---
title: "Gulp: Creating multiple bundles with Browserify"
layout: book
published: true
permalink: /gulp-browserify-multiple-bundles/
categories:
- Gulp
- Browserify
- Tools
---

With the ever-changing eco system of Node.js tools, a short version disclaimer. This article has been created using

* Gulp v3.8
* Browserify
* Glob 5.0
* Event Stream 3.3
* Vinyl Source Stream 1.1

If something does not work when you're using the same tutorial, please check if there's been a major update causing breaking changes. And please do [inform me](http://twitter.com/ddprrt), I like keeping those tutorials updated when possible.

## Everything's a stream

So what's the gist? [Browserify](http://browserify.org) is a JavaScript bundling tool, which allows you to declare modules in the Node way, but subsequently bundled to work in the browser. Think Require.js, but leaner and in the need of a processing step. [Gulp](http://gulpjs.com) is a build system which is fast, controllable and a good way of processing things. Both use streams. So why not combine them and process Browserify with Gulp?

Good idea in general, but as it turns out both tools handle streams a little differently. Or let's say: Their contents. While Browserify takes the contents of the files you handle to it, Gulp needs both contents and the original file information, for writing the results afterwards on the hard disk. That's why it uses Vinyl as a virtual file system. Vinyl objects are streamable, but contain the information of there original origin. So when writing `gulp.src('*.js')`, you get a bunch of vinyl objects with each representing the original JavaScript file on your disk. `gulp.dest('somewhere')` just takes a folder where you put your files, how they're called is still contained in the vinyl object.

Browserify on the other hand forgets about the origin as soon as you start. To make both tools compatible, there was originally a wrapper plugin for browserify called `gulp-browserify`. But since that was just a wrapper, and Gulp encouraging people to use the original in favour of some non-maintained plugin, they decided to blacklist `gulp-browserify` and promote the use of wrappers directly.

This is where `vinyl-source-stream` comes in. It does exactly what `gulp-browserify` did, but is of course more flexible: It converts any stream to a vinyl object, suitable for the use with Gulp.

## One bundle

So here's how you handle one Browserify bundle with Gulp

```typescript
var gulp       = require('gulp'),
    browserify = require('browserify'),
    source     = require('vinyl-source-stream');

gulp.task('browserify', function() {
    return browserify({ entries: ['path/to/main.js'] })
        .bundle()
        .pipe(source('main.bundled.js'))
        .pipe(gulp.dest('dist'));
});
```

We take one file into Browserify, bundle it (that's the thing Browserify should do), and pipe this stream to the next task, which is creating a vinyl object. Note the parameter, it adds the missing information -- the filename -- to the stream which comes out of Browserify. Now we can store it.

## More bundles

So far, so good. But there's a new problem (wouldn't be fun without one, would it). Once you call `bundle`, all file information is lost. What you get is one stream representing one file. So if you want to create multiple bundles, you're pretty lost. This problem seems to occur a lot, just over this weekend, I stumbled upon three different requests on that topic from various sources.

What can you do? Of course you think: Well, if I need it for more than one bundle, than I should run it more than once. That's absolutely correct, for every bundle you have, you have to run this task. However, we would get in a sequential and non flexible hell nobody wants to be. After all we're using Gulp, it's made to run things with maximum efficiency.

What we need are so called *stream arrays*. Define your stream, create an array of multiple streams, and execute all of them at once:


```typescript
'use strict';

var gulp       = require('gulp'),
    source     = require('vinyl-source-stream'),
    rename     = require('gulp-rename'),
    browserify = require('browserify'),
    es         = require('event-stream');

gulp.task('default', function() {
    // we define our input files, which we want to have
    // bundled:
    var files = [
        './app/main-a.js',
        './app/main-b.js'
    ];
    // map them to our stream function
    var tasks = files.map(function(entry) {
        return browserify({ entries: [entry] })
            .bundle()
            .pipe(source(entry))
            // rename them to have "bundle as postfix"
            .pipe(rename({
                extname: '.bundle.js'
            }))
            .pipe(gulp.dest('./dist'));
        });
    // create a merged stream
    return es.merge.apply(null, tasks);
});
```

The original setup is self explaining, but the last line is important: We merge that array to one stream which will be returned from our task. This way, we tell gulp that this stream is the one stream to execute. That it's an array internally does not bother anymore.

## Using Globs

Globs allow us to use patterns when selecting files. That functionality is in Gulp, but with our first entry point being browserify and the outcome being a stream array, we have to improvise. That's the way if you want to have all the files starting with `main-` and ending with `js` in your stream array:

```typescript
'use strict';

var gulp       = require('gulp'),
    source     = require('vinyl-source-stream'),
    rename     = require('gulp-rename'),
    browserify = require('browserify'),
    glob       = require('glob'),
    es         = require('event-stream');

gulp.task('default', function(done) {
    glob('./app/main-**.js', function(err, files) {
        if(err) done(err);

        var tasks = files.map(function(entry) {
            return browserify({ entries: [entry] })
                .bundle()
                .pipe(source(entry))
                .pipe(rename({
                    extname: '.bundle.js'
                }))
                .pipe(gulp.dest('./dist'));
            });
        es.merge(tasks).on('end', done);
    })
});
```

So this one makes it even more flexible.

## Bottom line

One thing I learned when doing this example over and over, was to appreciate and understand streams. That concept seems clear from the get go when you're starting with Gulp, but in the end it's much more than that. Gulp's just a use-case for streams, not a stream implementation. If you can divide streams and virtual file objects (a.k.a vinyl objects), and focus your learnings on the stream part, you realise that you can do wonderful things with it.

*Thanks to <a href="https://twitter.com/simondean">Simon Dean</a> and <a href="https://twitter.com/blacksonic86">Soós Gábor</a> for updates on the last task*
