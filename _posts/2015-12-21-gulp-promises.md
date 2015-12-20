---
title: "Gulp and Promises"
layout: book
published: true
permalink: /gulp-promises/
categories:
- gulp
- tools
---

The Gulp task system does not only work with streams alone, but also with other
asynchronous patterns. One of those are well known Promises! Find out how we can
use two Promise-based tools to create a thorough file sync between two folders.

## File sync: Copy new files to a destination

Think of a build system where you store your files in a source directory, but have
every computation done in a working or build directory. Gradle for instance is one
of those tools that recommend you to work this way. And for good reason: You never
touch the source, making it more robust to integrate in CI environments. A pull from
master doesn't kill your intermediates. And on the other: Your intermediates or results
don't interfere with everything new coming from your Git branch.

So, what we are aiming for is a call that copies all the files from a source directory
to a destination directory, where Gulp awaits to execute your build tasks. 

{% highlight javascript %}
var globArray = [ ... ]  // all the files you want to read

gulp.task('copy-src', function(){
  return gulp.src(globArray, { cwd: '../../src/' })
    .pipe(newer('.'))
    .pipe(gulp.dest('.'));
});
{% endhighlight %}

So that takes care of all the new files or changed files, without copying
anything that doesn't need to be there. That's half the battle. What about the
files that have been copied from a previous run, but then got removed? If you
really want to have a direct copy of your source directory, you also want to
remove them in your destination directory.

## Getting the diff between two directories

{% highlight javascript %}
gulp.task('diff', function() {
  return Promise.all([                                    /* 1 */
    globby(globArray, { nodir: true }),                   /* 2 */
    globby(globArray, { cwd: '../../src/', nodir: true }) /* 3 */
  ]).then(function(paths) {
    return paths[0].filter(function(i) {                  /* 4 */
      return paths[1].indexOf(i) < 0;
    });
  }).then(function(diffs) {                               /* 5 */
    return del(diffs);
  });
});
{% endhighlight %}

Let's go through this one by one.

1. We use `Promise.all` to run two Promise-based glob calls against
our file system.
2. `globby` by the one and only Sindre Sorhus allows for
Gulp-style globbing (including directories) with Promises. Add the `nodir`
parameter to the `globby` call to not get directory file handles.
3. Do the same for the source directory. We change the working directory to
our sourc directory. By using the `cwd` param, the file list has the same
structure as from the first `globby` call.
Since we run both Promises with Promise.all, we also get an array of results.
4. The array of results contain two arrays of file names. The first one from
the destination, the second one from our source.

## ES6 fat arrows

It's even more beautiful when you work with ES6 fat arrow functions:

{% highlight javascript %}
gulp.task('diff', function() {
  return Promise.all([
    globby(globArray, { nodir: true }),
    globby(globArray, { cwd: '../../src/', nodir: true })
  ])
  .then(paths => paths[0].filter(i => paths[1].indexOf(i) < 0))
  .then(diffs => del(diffs))
});
{% endhighlight %}

## Bottom line

With Gulp you have a vast ecosystem of plugins at your hand. This ecosystem
expands as you can use any stream related tool and wrap it around the Gulp API.
But you are not bound to streams alone. With Promises, any asynchronous code can
work with the Gulp task system! So the amount of tools to choose from grows even
more!

## Software used:
