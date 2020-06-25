---
title: "11ty: Generate Twitter cards for your posts"
categories:
- Eleventy
- Jamstack
---

For the redesign of this blog, I created Twitter title cards that are generated automatically. So whenever people share my stuff on social media, they get a nice card telling them the article's title and post date.

And folks should share these articles on social media, shouldn't they? 

![A tweet by @TypeScriptDaily showing one of my articles](/wp-content/uploads/2020/titlecard-demo.jpg)


I'm using [Eleventy](https://11ty.dev) as a static site generator for this webpage, and thanks to their pagination feature, creating Twitter cards for each post took just little investment.

## Eleventy's pagination feature

One important feature of Eleventy is collections. Eleventy tries to collect all parsable files from your source into a big *all* collection, and you have the possibility to cluster this big heap of data into different groups. One would be *posts*, which goes for all my blog articles. 

In a lot of cases, you want to browse your collections either as a whole or on several pages. The pagination feature of Eleventy allows you exactly that. It takes a set of data, and slices it based on page size. This can be defined in the front-matter:

```yaml
---
pagination:
  data: collections.posts
  size: 10
  alias: pagedPosts
---
```

In the example above, I create pages with 10 items each from the *posts* collection, storing the information in an array called `pagedPosts`. We loop over this array and show the contents in the template. Effectively creating a paged overview.

## Pagination to remap your collection

So how can we use the pagination for our teasers? The trick lies in the pagination size. What happens if we set the pagination size to 1? We get a page for each entry in the *posts* collection. With this, we remap the entire contents of our blog to a new output. 

This can be another HTML or XML page, or JSON, or in our case: An SVG.

{% raw %}
```yaml
---
pagination:
  data: collections.posts
  size: 1
  alias: post
permalink: /teasers/{{ pagination.items[0].permalink | slug  }}.svg
eleventyExcludeFromCollections: true
---
```
{% endraw %}

The above code

1. Sets the pagination size to 1, effectively creating another page for each post
2. Stores the post in the variable `post` so we can access it within the template
3. Remaps its contents to a new output URL. A slugified permalink of the original post, but with an *svg* ending. Note: I just managed to do this by setting each permalink on my own. This can be further automated.
4. With `eleventyExcludeFromCollections: true` I make sure that the newly created pages to get added to the overall list of collections. 

This is the basic set-up. Now to the contents of the template

## Creating an SVG

What I did for this site was creating an SVG with Sketch. A simple one with just a bit of text. I tried system fonts, because once I'm rendering this in an SVG or PNG, I'm not sure with fonts I have available. I used some dummy text based on a real blog post, and then copied the SVG code in the template:

{% raw %}
```html
---
pagination:
  data: collections.posts
  size: 1
  alias: post
permalink: /teasers/{{ pagination.items[0].permalink | slug  }}.svg
eleventyExcludeFromCollections: true
---
<?xml version="1.0" encoding="UTF-8"?>
<svg width="1452px" 
  height="843px" viewBox="0 0 1452 843"
  version="1.1" xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <!-- here come the contents -->
</svg>
```
{% endraw %}

I searched for the part why I set the text and removed all existing lines. I changed it to a loop where I split the title of the post so each line has the right number of characters in it. 

{% raw %}
```html
<text id="text"
  fill="url(#linearGradient-3)"
  font-family="Arial, Helvetica, sans-serif"
  font-size="100" font-weight="bold" line-spacing="101">
  {% for line in post.data.title | splitlines %}
  <tspan x="81" y="{{247 + loop.index0 * 141}}">{{line}}</tspan>
  {% endfor %}
</text>
```
{% endraw %}

Depending on the font size that I set, I set the y coordinate to an offset (in this case 247), plus the current line index and a font-size with line-height (141).

`splitlines` is a filter I create in my `.eleventy.js` configuration file:

```javascript
config.addFilter('splitlines', function(input) {
  const parts = input.split(' ') /* 1 */
  /* 2 */
  const lines = parts.reduce(function(prev, current) {
    /* 3 */
    if(!prev.length) {
      return [current]
    }
    
    /* 4 */
    let lastOne = prev[prev.length - 1]
    if(lastOne.length + current.length > 18) {
      return [...prev, current]
    }
    prev[prev.length - 1] = lastOne + ' ' + current
    return prev
  }, [])
  return lines
})
```

Here's what I do:

1. I split the title by each word
2. I run through all words
3. If the array is empty, I create an array with the first word
4. For each subsequent word, I check if the concatenation of words exceeds the number of characters I envision per line (18 in this case).
   1. If it does, I add the new word to the next line
   2. Otherwise, I concatenate words within a line

I also do something similar with the post date.

This already gives me an SVG for each blog post that I'm writing.

## Creating a PNG

The last thing that was necessary was creating a PNG of each SVG. I haven't been able to do this via Eleventy, yet. So I resorted to Gulp. This is actually intentional, as I want to save time through maximum parallelism.

This is my `Gulpfile.js`. I just need one plug-in.

```javascript
const gulp = require('gulp');
const svg2png = require('gulp-svg2png');

gulp.task('default', function() {
  return gulp
    .src('./dist/teasers/*.svg')
    .pipe(svg2png())
    .pipe(gulp.dest('./dist/teasers/'));
})
```

Note that this is resource-heavy. Depending on how big your site is you might want to do this incrementally or store the results somewhere instead of creating this per build run.

As for this site. Eleventy builds HTML + SVGs in less than 2 seconds. Converting the PNGs takes another 20 seconds on Vercel. This is still faster than a "Hello world" style Gatsby site. So I think it's reasonable to do this every time 😉

## Setting the meta tags

Last, but not least, I add the results in the meta information of each blog post:

{% raw %}
```html
{% set imgPath = permalink | slug %}

<meta property="og:image" 
  content="https://fettblog.eu/teasers/{{ imgPath }}.png">
<meta property="og:image:secure_url"
  content="https://fettblog.eu/teasers/{{ imgPath }}.png">
<meta name="twitter:image"
  content="https://fettblog.eu/teasers/{{ imgPath }}.png">
```
{% endraw %}


And that's it! 

Some gotchas that I found:

1. Finding the right line length was very much trial and error
2. *svg2png* uses a headless Chrome to render the PNGs (uh-uh...). This, and your CI Server (Netlify, Vercel), have a high impact on which fonts are available for rendering. There might be better solutions available.

But other than that, I think it's quite ok!
