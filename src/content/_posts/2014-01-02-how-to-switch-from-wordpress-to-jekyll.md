---
layout: post
title: "Remake, Remodel! Part Three: How to switch from Wordpress to Jekyll"
permalink: /blog/2014/01/02/how-to-switch-from-wordpress-to-jekyll/
categories:
- Jamstack
- Remake
- Jekyll
- Wordpress
- CMS
- Github Pages
---
Even tough I was pretty satisfied with my old blog, and especially its design, I felt the need to go into another round of updating not only the look, but more importantly the system behind it. So, even if everything looks shiny and new (more likely: crappy), this is all about the nuts and bolts behind the content: **Converting your blog from Wordpress to Jekyll**

*Last updated on 2014/01/03*

## Why the change?

Probably the most interesting question of all. Well, i felt the need to change for several reasons:

* My last hosting provider sucked. Cheap webspace on cheap servers, which meant that given about 5 to 10 visitors, my website was not available anymore. Especially not any of the PHP-heavy backend.
* Even though I like Wordpress and have worked with it for about 8 years now, I felt somehow limited, both in writing content and publishing pages that differ from the rest. Everytime I have to write some HTML markup in Wordpress posts I have the feeling that I'm doing something really wrong.
* Wordpress still has a lot of extra load, and I found it constantly difficult to apply all of the front-end best practices to a Wordpress theme. And keeping everything maintainable.
* I want to write in Markdown. I always write in Markdown, and I find it inconvenient to put MD file contents into a text box of some online form.

## Static site generators

I'm a huge fan of static site generators like [assemble.io](/blog/2013/09/02/using-assemble-io-with-yeoman-ios-webapp-gruntfile/), because I can work like I'm used to in source code, and let the generator take care of all the dynamic parts of my content. I strongly considered using assemble, pushing everything into a git repository and publishing the generated files on some server. I also considered switching to GitHub, because GitHub Pages seemed rather handy. With those considerations at hand, I stumbled upon the Ruby-based static site generator called [Jekyll](http://jekyllrb.com), which has one big advantage: You don't have to call the "build" command every time you want to publish, GitHub Pages takes care of that itself. Just push the source code in a GitHub Pages repository, and you get the perfectly assembled site as output on your page.

## Setting up Jekyll

You need Ruby to run Jekyll, fortunately you don't need to *understand* Ruby at all. If you are on Mac or Linux, just open a Terminal (you will need this a lot!) and install the jekyll gem with

```
gem install jekyll
```

Depending on your configuration, `sudo` might be required. What I found strange is, that on Mac, even with installed gnu compile tools, Jekyll requires Xcode to build native extensions. Make sure you have that on your computer. You can use Jekyll without the gem and with GitHub pages perfectly fine, but it's still good if you know how the whole thing will look like before you publish something live.

Once installed, just create a new directory and type 

```
jekyll new .
```

inside. And voilà, you have a basic theme with a standard post already there!

## Converting your Wordpress blog

Converting was a little challenge, since how the Jekyll developers *want* converting to happen is rather different from how it actually can be achieved. Thing is: The documentation on [the Jekyll Import site](http://import.jekyllrb.com/) is sometimes ready for the upcoming release of `jekyll-import`, but up until now, this package is still in beta. Install it with the `--pre` command:

```
gem install jekyll-import --pre
```

Again, `sudo` might be required. Also, the import package needs some third party libraries. The installer will warn you if something is missing, just go ahead and install the next package.

Next: Export your old Wordpress blog via the Admin panel. That's pretty easy to find, you'll get an XML file, I just renamed it `wordpress.xml` for convenience and put it into the same directory.

Now I just copied the detailed command from [Jekyll's Wordpress import page](http://import.jekyllrb.com/docs/wordpressdotcom/)

```
ruby -rubygems -e 'require "jekyll-import";
    JekyllImport::Importers::WordpressDotCom.run({
      "source" => "wordpress.xml"
    })'
```

Wait some seconds (or minutes, I converted a 3000 post Wordpress site once ...) and you should have everything ready! If you want to know which files you have, be sure to check out [Jeykll's documentation on that](http://jekyllrb.com/docs/structure/).

## URLs and Custom Domain name

One very important thing to me was to have every single URL that I had ready on my Wordpress site also on my Jekyll page. When I converted from ModX to Wordpress I rewrote the permalinks so they were the same on both systems, and I did the same when switching to Jekyll. Every post I wrote is now in the posts directory, the name of the post defining the permalink slug and the date. To define the right URL, just open the `_config.yml` file and adapt. In my case, it was:

```
permalink: /blog/:year/:month/:day/:title/
```

I also rewrote the paging URL to be:

```
paginate_path: /blog/page/:num
```

even tough I now have more posts on one page as before, but it saves at least some of the URLs.

For all the pages you get a folder called `_pages` after converting. While posts were just there, I needed some extra work on them. One of the great things in Jekyll is how they handle those pretty URLs. So, if you want to have some URL called *http://somedomain.com/<wbr>contact*, just create a folder `contact` and put an `index.html` in there. You don't need anything more. So I took those two pages ([Speaking](/talks-slides) and [About](/contact) and put the into their respective folder. Take care of the naming conventions (might be a Ruby thing): If something starts with an underscore, it will be ignored on publishing.

As for the domain name, if you use GitHub Pages, I just added a CNAME file according to [this page](https://help.github.com/articles/setting-up-a-custom-domain-with-pages) and gave my new domain keeper a short notice were to point that A record.

## Saving Assets

If you had a lot of images and other uploads, you can easily save them if you still use the same URLs. Wordpress uses (for whatever reason) absolute paths to all your uploads, which are mostly located in `wp-content/uploads`. So just download this folder, and put it in your own repository.

## RSS feed

I've never ever used RSS feeds at all, but some of my readers like them. Thanks to [Hugo Giraudel](http://hugogiraudel.com), who also has his blog open source on GitHub, I was able to see how he managed to do it (without any of the already available Jekyll plugins):

He just created an XML file which declares RSS markup, and will be parsed by Jekyll and updated with the sites contents. Very clever!

```xml
{% raw %}
---
layout: none
---
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{{ site.name }}</title>
    <description>{{ site.description }}</description>
    <link>http://fettblog.eu</link>
    <atom:link href="http://fettblog.eu/feed" 
      rel="self" type="application/rss+xml" />
    {% for post in site.posts %}
      {% unless post.preview %}
      <item>
        <title>{{ post.title }}</title>
        <description>{{ post.excerpt | xml_escape }}</description>
        <pubDate>{{ post.date | date: "%a, %d %b %Y %H:%M:%S %z" }}</pubDate>
        <link>http://fettblog.eu{{ post.url }}</link>
        <guid isPermaLink="true">http://fettblog.eu/feed{{ post.url }}</guid>
      </item>
      {% endunless %}
    {% endfor %}
  </channel>
</rss>
{% endraw %}
```

I also did something nasty and made an URL as stated above. Needs an HTML file, though, but it still works as long as it's read by machines and not opened in a browser. It was all about saving the old URLs, I guess.

## Comments

If you are using Wordpress comments, you might have a problem regarding the lack of dynamic content on static sites. I used [Disqus](http://disqus.com), and since all old URLs are still there, all comments are there too. I strongly recommend using that plugin, and you can even [import old Wordpress comments into Disqus](http://help.disqus.com/customer/portal/articles/466255-importing-comments-from-wordpress).

## Using GitHub Pages

GitHub recently created a very nice and short tutorial on how to use [Pages](http://pages.github.com/) for your project/your organisation, which means: Were do I put my files to? You shouldn't need anything more than that.

## Bottom Line

### Downsides

1. No search anymore. Not that I really needed them
2. No categories and category search results as in Wordpress, at least not without a plugin
3. ~~No custom 404~~. Forget that... Just provide a 404.html and your done!

### Benefits

1. First of all: GitHub Pages are fast. Good servers, good availability, good performance.
2. By serving just static files, the speed got better overall
3. Pygments is a nice little plugin which allows you syntax highlighting of code snippets during processing time. Which means you already get a highlighted output. No need for JavaScript there anymore.
4. Creating extra pages with no standard markup is as easy as it can get. Still thinking of reworking my [Speaking](/talks-slides) page to something ... fresher.
5. It's just so much more fun working and adapting your website without the CMS clutter. I'm a front-end dev, and I finally can work in my environment.

If you have any questions concerning this setup, feel free to check out [the source code](https://github.com/ddprrt/ddprrt.github.io) or ask me in the comments or on [Twitter](http://twitter.com/ddpprt).

*Update 2014/01/16*: My friend Tomomi (aka [GirlieMac](http://girliemac.com/blog/2013/12/27/wordpress-to-jekyll/)) also switched from Wordpress to Jekyll at almost the same time. Check out her awesome [article](http://girliemac.com/blog/2013/12/27/wordpress-to-jekyll/) for some good tips on how to secure everything from your Wordpress installation without strange prerelase packages.
