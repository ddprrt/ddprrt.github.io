---
title: "Gulp: Grab files from your CDN and add them to your build pipeline"
layout: book
published: true
permalink: /gulp-merge-cdn-files-into-your-pipeline/
categories:
- gulp
- tools
---

This one is a shorty, but that's what it makes it so nice. Imagine that you
have only one dependency in your project, which is some third party library
your code builds upon, like jQuery. Instead of having the complete dependency
management stack on your shoulders, you just want to use that single file.

Usually, you would use a CDN, but you prefer it having it added to your bundle.
With a library called `request`, which allows you to fetch files from a webserver
and access the contents in a stream format, you can do the following in Gulp:

{% highlight javascript %}
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var request = require('request');
var merge = require('merge2');
var concat = require('gulp-concat');
var buffer = require('gulp-buffer');

gulp.task('js', function() {

  var jquery = request('http://code.jquery.com/jquery-latest.js') /* 1 */
    .pipe(source('jquery.js'));                                   /* 2 */
  var main = gulp.src('main.js');                                 /* 3 */

  return merge(jquery, main)                                      /* 4 */
    .pipe(buffer())                                               /* 5 */
    .pipe(concat('concat.js'))
    .pipe(gulp.dest('dist'));
})
{% endhighlight %}

1. We request the latest jQuery version from the jQuery CDN. The `request` package
   allows for streaming. What we get in return is a readable stream.
2. We create a valid vinyl file object with `vinyl-source-stream`. This makes it
   compatible with Gulp
3. Our main file is selected from the file system as usual
4. The `merge2` package allows us to combine both streams
5. The contents of both streams are converted to text buffers
   so `gulp-concat` can handle them.

The use case for this might be limited, but it's good to know that you can pipe
any web resource to your build pipeline. Think of assets that are available online,
or any data you want to prepare for your static site generator.

The awesome power of streams makes this possible.
