---
title: "Wordpress as CMS for your JAMStack sites"
published: true
permalink: /wordpress-and-jamstack-sites/
layout: post
categories:
- Node.js
- Static site generators
- JAMstack
---

The almighty JAMStack brings you fast and secure static websites, and with things like [headless content management systems](https://storyblok.com) they become even easy to edit! However, every once in a while you will find yourself in front of a Wordpress blog that has way too many articles (and way too many authors that fear change!) to be reasonably transferred. But Wordpress can be headless, too. In fact, Wordpress' own hosting service uses its core only via API, the editing interface comes with the shiny new [Calypso](https://developer.wordpress.com/calypso/).

One of the best advantages of using a static site generator is that they usually don't care where your content comes from. So let's use the [fancy Wordpress REST API](http://v2.wp-api.org/), fetch some content and produce static sites!

In this example, I use [Metalsmith](http://www.metalsmith.io/) as static site generator. Only because I work with it on a daily basis. And it's pretty easy to get new plug-ins running. But other static site generators will work as well. You can use [Jekyll generators](https://jekyllrb.com/docs/plug-ins/#generators) for instance. And as long as your static site generator knows how to use JSON files as data input, you can use the code samples below to store fetched output in a pre-processing step. Let's go!

## The Wordpress API

Every Wordpress installation comes with a full fledged JSON API. This means you can access posts and pages via URLs. This just sounds like a headless CMS to me! If you have a Wordpress installation running somewhere, add `/wp-json/wp/v2/posts` at the end of the main URL. You most likely will get some output! In fact, the latest 10 posts with all its metadata are presented to you in easy digestible JSON.

### Getting author information

You will soon notice that the `author` field in each entry is but a number. This is Wordpress' data structure. You would need to look up the table for authors, and Wordpress doesn't have an  API URL for that. However, there's a secret flag you can add to get all the author data passed along, and it's called `_embed`.

So with

```
https://url-to-your-blog/wp-json/wp/v2/posts?_embed
```

you have all the data you need!

### Getting all posts

If you have a ton of posts, the next challenge will be to get all of them. Sadly, this can't be done with one single request. You can max the number of fetched posts to 100 by adding a new parameter called `per_page`:

```
https://url-to-your-blog/wp-json/wp/v2/posts?_embed&per_page=100
```

But after that, you have to fetch paginated. There's the `page` parameter where you can select the page you want to retrieve. With that, you can either go recursively and fetch as long as there's something to fetch. Or you check Wordpress' custom HTTP headers for information on how many pages there are to fetch. In this example, I go for the latter. But be aware that your server's CORS settings must allow to pass those headers through to your client. The custom header for the number of total pages is `X-WP-TotalPages`.

To retrieve data, I'm using [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch), which provides the same `fetch` API both for Node and the browser. Let's see:

```javascript
const fetch = require('isomorphic-fetch');

const mainURL = 'http://path-to-your-blog';
const apiURL = '/wp-json/wp/v2/posts';
const url = `${mainURL}${apiURL}?_embed&per_page=100`;

fetch(url)                                        /* 1 */
  .then(res => {
    const noPages = 
      res.headers.get('X-WP-TotalPages');         /* 2 */
    const pagesToFetch = new Array(noPages - 1)
      .fill(0)
      .map((el, id) => 
        fetch(`${url}&page=${id+2}`));            /* 3 */
    return Promise.all([res, ...(pagesToFetch)]); /* 4 */
  })
  .then(results => 
     Promise.all(results.map(el => el.json())))   /* 5 */
  .then(pages => [].concat(...pages))             /* 6 */
```

1. Let's fetch the first 100 posts from our blog. If our Wordpress blog has less than 100 posts, we won't need any more fetches.
2. The `X-WP-TotalPages' header has information on how many more pages we need to fetch.
3. We create an array of fetch promises, fetching data from page 2 onwards (we fetched page 1 already).
4. `Promise.all` allows us to pass the first result and all subsequent results from our `pagesToFetch` array.
5. Next promise call: Convert all results to JSON.
6. Finally, we convert all our results into one array containing all the post data from our blog.

The next `.then` call will include one array with all blog entries. You can store this data as JSON file (if your static site generator is not extendable), or in our case: Create actual page data we want to generate.

## Add your posts to Metalsmith

Metalsmith is -- like any other static site generator -- aware of a source directory which contains files. Most likely Markdown. These files are then converted into HTML. However, Metalsmith also allows adding data from any other source. It's pretty easy to manipulate the files array and add new files. The only thing you need to know is that each file needs a unique key: The URL or path it is going to be stored. The contents of each entry is an object with all the data you want to store. Let's check it out! 

### Wordpress metalsmith plug-in

Metalsmith works with plug-ins. Each run of the Metalsmith build pipeline runs through the list of plug-ins you defined, much like Gulp does. 

Let's use the code sample from above and extend it to a Metalsmith plug-in:

```javascript
const { URL } = require('url');

const wordpress = (url) => (files, smith, done) => { /* 1 */
  fetch(url)
    /* ... include code from above ...*/
    .then(allPages => {
      allPages.forEach(page => {
        const relativeURL 
          = new URL(page.link).pathname;             /* 2 */
        const key = `./${relativeURL}/index.html`;   
        let value = page;                            /* 3 */
        value.layout = 'post.hbs';
        value.contents = 
          new Buffer(page.content.rendered, 'utf8');
        files[key] = value;                          /* 4 */
      });
      done();                                        /* 5 */
    });
}
```

1. The interface for Metalsmith plug-ins is `(files, metalsmith, done)`. The first parameter is the set of files which needs to be transformed to HTML. The second parameter is the Metalsmith object, which contains all the metadata information of the Metalsmith build. Parameter three is a done callback function. This is particularly helpful for async operations. Call it when your plug-in is finished.
2. Once we have all posts from the API calls (see above), we need to transform some data. First, we change the permalinks from Wordpress to something Metalsmith can work with. We use Node's URL package to get the relative URL (sans domain name), and make a relative path on the file system out of it. Notice that we add `index.html`. In doing so, we create lots of folders with one HTML file inside. Prettified URLs for static sites.
3. Next, we create key/value pairs for the file object. Each value is one entry of the post array we retrieved earlier. Additionally, we add a layout flag (for `metalsmith-layouts`) and set the contents (this is also something `metalsmith-layouts` needs to work properly). 
4. After that, we store the value under the relative path name we defined earlier.
5. Once we did that for all posts, we call the `done()` callback to end our plug-ins process.

Perfect. In just a few lines of code we told Metalsmith to extend the files it already transforms with the files we fetched from an API. This makes Metalsmith extremely powerful, because you are not tied to a single CMS any more. In fact, you can hook into a ton of new and legacy content management systems and still produce one output. Nice!

### Metalsmith build pipeline

We want to use our new plug-in with a very straightforward Metalsmith build pipeline. We don't use much but a layout plug-in that builds upon Handlebars to squeeze our content into something more semantically correct.

```javascript
const Metalsmith = require('metalsmith');
const layouts = require('metalsmith-layouts');

/** the plug-in from above **/

Metalsmith('.')
  .use(wordpress(apiURL))
  .use(layouts({
    engine: 'handlebars'
  }))
  .source('./source')
  .destination('./build')
  .build((err) => {
    if (err) throw err;
    console.log('Finished');
  });
```

This pipeline fetches all data from the Wordpress API, and then runs it through `metalsmith-layouts`. After we call `build`, the pipeline is actually executed. Run this file, and you will see a `build` directory in your file system.

### Layout file

The layout file is a handlebars file which defines the basic HTML structure. ```{{contents}}}``` refers to the field we defined earlier in our Wordpress Metalsmith plug-in. The rest comes from the object directly, including the `_embedded` Author data. It's pretty straightforward:

{% raw %}
```handlebars
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{title.rendered}}</title>
</head>
<body>
  <h1>{{title.rendered}}</h1>
  {{{contents}}}

  <aside>
    by {{_embedded.author.0.name}}
  </aside>
</body>
</html>
```
{% endraw %}

## Next steps

Sweet! After I got acquainted with the Wordpress API, fetching all the contents and creating static sites out of it was super easy. You can find a sample repository [on Github](https://github.com/ddprrt/metalsmith-wordpress-sample). Let me know what you think. 

Next steps would be to create a small Wordpress plug-in (a real one, in PHP and all that), that uses the publish hook to automatically kick off your continuous integration system. But knowing Wordpress' vast plug-in ecosystem, something like that might actually already exist.
