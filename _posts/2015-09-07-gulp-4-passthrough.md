---
title: "Gulp 4: Passthrough source streams"
layout: book
published: true
permalink: /gulp-4-passthrough/
categories:
- gulp
- tools
---

Another nice addition to `vinyl-fs` that will end up in Gulp 4 is the possibility
of having "passthrough" source streams. This basically allows `gulp.src` to be
writeable. So what does this mean for you?

Usually, `gulp.src` would create a stream of file objects based on the globbing
pattern you provide. This made `gulp.src` mandatory to be at the beginning of
your stream. Now it can be anywhere in your pipeline, carrying over the intermediate
results from the earlier steps.

This makes up for some pretty interesting scenarios. The most useful one is
definitely merging streams. See the example
below: We want to lint our self-written JavaScript files, and concatenate them
with vendor specific files to one single JavaScript file:

{% highlight javascript %}
var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');

gulp.task('default', function() {
  return gulp.src('src/**/*.js') /** 1 **/
    .pipe(jshint()) /** 2 **/
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .pipe(gulp.src('vendor/**/*.js', {passthrough: true})) /** 3 **/
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('dest'));
});
{% endhighlight %}

The process explained:

1. We glob all our source JavaScript files.
2. Those are the files **we** create, which means we want to have them linted to our coding conventions
3. After the JSHint process, we get all our vendor files.
Those include things like jQuery, lodash, you name it. By using the `passthrough`
flag, all the file objects from the original pipeline are passed through, and thus
added to the whole stream.

We can also benefit from this feature when we want to merge preprocessor output with
plain source files:

{% highlight javascript %}
gulp.task('styles', function(){
  return gulp.src('styles/main.scss')
    .pipe(sass())
    .pipe(gulp.src('styles/**/*.css'), {passthrough: true})
    .pipe(concat('main.css'))
    .pipe(gulp.dest('dist'));
});
{% endhighlight %}

Same with CoffeeScript, if you are into that:

{% highlight javascript %}
gulp.task('scripts', function(){
  return gulp.src('scripts/*.coffee')
    .pipe(coffee())
    .pipe(gulp.src('scripts/*.js'), {passthrough: true})
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
{% endhighlight %}


While this doesn't solve all the scenarios where merging comes in handy, combining
different sources mid-stream is definitely a welcomed addition.
