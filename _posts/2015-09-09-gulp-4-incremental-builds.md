---
title: "Gulp 4: Incremental builds with gulp.lastRun"
layout: book
published: true
permalink: /gulp-4-incremental-builds/
categories:
- gulp
- tools
---

Incremental builds are a good way of speeding up your build iterations. Instead
of building everything again with each and every iteration, you just process
the files that have changed.

## The Gulp 3 way

Gulp has plenty of plugins for crafting incremental build pipelines. Some of the
most common used are `gulp-cached`:

{% highlight javascript %}
/** Gulp 3 Code **/

var cached = require('gulp-cached');
var jshint = require('gulp-jshint');

gulp.task('jshint', function() {
  return gulp.src('scripts/**/*.js')
    .pipe(cached('scripts'))  /** 1 **/
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.watch('scripts/**/*.js', ['jshint'])

{% endhighlight %}

1. This line installs a build cache for incremental builds. With each iteration,
Gulp checks if the files have been updated. If not, they will be filtered, resulting
in a slimmer stream. `gulp-cached` will check both timestamp and contents.

While this appraoch delivers great results, they all have some caveat: With
`gulp.src` all files are read. Which means that you have to transfer all the contents
into memory. This can be optimized with Gulp 4.

## The Gulp 4 way

The virtual file sytem in Gulp 4 adds a new flag when globbing files
through `gulp.src`. The `since` option. This option takes a timestamp,
and `gulp.src` will filter files that are older than the given time. This
alone is powerful enough, but it really shines when being combined with
the `lastRun` function from the task manager.

With version 4, Gulp saves the time when a task has been executed last. Not only
for the whole system, but also for each task separately. We can combine those two
features by telling Gulp to "select files *since*" "the last time task X ran":

{% highlight javascript %}
/** Gulp 4 Code **/

var jshint = require('gulp-jshint');

gulp.task('jshint', function() {
  return gulp.src('scripts/**/*.js', { since: gulp.lastRun('jshint') })
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.watch('scripts/**/*.js', gulp.parallel('jshint'))
{% endhighlight %}

The biggest advantage here: The files don't even get selected, which reduces
reading operations with every iteration.

## Where you still need some plugins

You will still need plugins when you terminate Gulp between your iterations,
since Gulp loses all information on runs once it exits. `gulp-newer` comes in
handy:

{% highlight javascript %}
/** Gulp 3 Code **/
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');

gulp.task('images', function() {
  return gulp.src('images/**/*')
    .pipe(newer('dist')) /** 1 **/
    .pipe(imagemin())
    .pipe(gulp.dest('dist'));
});

{% endhighlight %}

1. Here we use `gulp-newer` to check if any of the images in our source stream
have a newer timestamp than their results in the `dist` folder. `gulp-newer` just
checks for newer timestamps and ignores contents. Compared to `gulp-cached` it
can be used in multiple Gulp runs, not needing a watcher.

You also need the `cached` plugin if you want to refill your stream with original
contents through `gulp-remember` afterwards. However, this can be combined with
`lastRun`:

{% highlight javascript %}
gulp.task('scripts', function() {
  return gulp.src('src/**/*.js', since: {gulp.lastRun('scripts')}) /** 1 **/
    .pipe(cached('scripts')) /** 2 **/
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .pipe(uglify())
    .pipe(remember('scripts')) /** 3 **/
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('dest'));
});
{% endhighlight %}

1. We select all files that have changed since the last run of this task. Which means
that for the first run, this contains all files.
2. We store those files in our cache. We will need them later. In the second run,
this actually does filter nothing
3. After our heavy tasks, we restore files from our cache so we can concatenate them.

This is actually the same as we would've done with Gulp 4, but we save lots of file
reading operations with each iteration.
