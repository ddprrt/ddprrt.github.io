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
to a destination directory, where Gulp awaits to execute your build tasks. With the
concepts we learned from [incremental builds](/gulp-4-incremental-builds/) we are able
to create the first part: Copying new files from a source to a destination:

```javascript
var globArray = [ ... ]  // all the files you want to read

gulp.task('copy-src', function(){
  return gulp.src(globArray, { cwd: '../../src/' })
    .pipe(newer('.'))
    .pipe(gulp.dest('.'));
});
```

That takes care of all the new files or changed files, without copying
anything that doesn't need to be there. That's half the battle. What about the
files that have been copied from a previous run, but then got removed? If you
really want to have a direct copy of your source directory, you also want to
remove them in your destination directory.

## Getting the diff between two directories

To get the difference between the source and destination directory we have
several possibilities, even Gulp plugins to use. However, most of them feel
kind of clumsy or "do too much", something that a Gulp plugin should never do.

So, why not do it on our own? Here's the plan:

- Read both source and destination directory.
- Compare both lists and find the difference
- Delete the files that are left, hence: The ones that are not in the source
directory anymore.

We have some Promised-based Node modules for that:

- `globby`: Creates a list of file paths based on a glob. Something very similar
to Gulp.s
- `del`: A module that deletes files based on a glob. This is actually the
preferred way by Gulp to take care of deleting files.

And here's how we are going to combine them:

```javascript
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
```

Let's go through this one by one.

1. We use `Promise.all` to run two Promise-based glob calls against
our file system.
2. `globby` by the one and only Sindre Sorhus allows for
Gulp-style globbing (including directories) with Promises. Add the `nodir`
parameter to the `globby` call to not get directory file handles.
3. Do the same for the source directory. We change the working directory to
our source directory. By using the `cwd` parameter, the file list has the same
structure as from the first `globby` call.
Since we run both Promises with Promise.all, we also get an array of results.
4. The array of results contain two arrays of file names. The first one from
the destination, the second one from our source. We use the
[`Array.prototype.filter`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) and [`Array.prototype.indexOf`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf) function to compare our results: We filter all elements that are not in our second
array. Note: This procedure might take some time depending on how many file paths you
are going to compare. We are talking seconds here. This is quite some time in
the Gulp world.
5. The result of this step is an array with "leftovers": All those files that have
been removed from the source directory but still exist in our working directory.
We use Sindre Sorhus' `del` module that takes care of this files. It returns also a
Promise, so it's perfectly usable with the Promise-chain that we made here.

## ES6 fat arrows

It's even more beautiful when you work with ES6 fat arrow functions:

```javascript
gulp.task('diff', function() {
  return Promise.all([
    globby(globArray, { nodir: true }),
    globby(globArray, { cwd: '../../src/', nodir: true })
  ])
  .then(paths => paths[0].filter(i => paths[1].indexOf(i) < 0))
  .then(diffs => del(diffs))
});
```

Nice, clean and totally in tune with Gulp!

## Bottom line

With Gulp you have a vast ecosystem of plugins at your hand. This ecosystem
expands as you can use any stream related tool and wrap it around the Gulp API.
But you are not bound to streams alone. With Promises, any asynchronous code can
work with the Gulp task system! So the amount of tools to choose from grows even
more!

## Software used:

- Node.js: 5.2.0
- [`gulp-newer`](https://www.npmjs.com/package/gulp-newer): 0.5.1
- [`del`](https://www.npmjs.com/package/del): 2.2.0
- [`globby`](https://www.npmjs.com/package/globby): 4.0.0

Works with both Gulp 3 and Gulp 4. The rest is Node.js native.
