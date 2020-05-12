---
title: "Gulp Recipes - Part Two: You might not need this plugin"
layout: book
published: true
permalink: /gulp-recipes-part-2/
categories:
- Gulp
- Tools
---

One month has passed, many questions on [StackOverflow](http://stackoverflow.com/questions/tagged/gulp) have been answered, so here's yet another round of common Gulp issues with a simple and repeatable solution to them. Be sure to check out last [month's edition](/gulp-recipes-part-1), as well as my articles on [Gulp, PHP and BrowserSync](/php-browsersync-grunt-gulp) and [multiple Browserify bundles](/gulp-browserify-multiple-bundles/).

### Today's menu:

* [Confirm prompts in Gulp](#confirm-prompts-in-gulp)
* [Sync directories on your harddisk](#sync-directories-on-your-harddisk)
* [Pass command line arguments to Gulp](#pass-command-line-arguments-to-gulp)

<h2 id="confirm-prompts-in-gulp">Confirm prompts in Gulp</h2>

Imagine a Gulp task that actually takes long and has a lot of file operations going on. Or even one which deploys to some cloud storage in the end. Sometimes you want to really make sure that you or your co-workers want to run this task or execute the following steps. Just pop up a command line prompt and let the user confirm his action.

There are actually two plugins out there doing this, the one being [gulp-confirm](https://www.npmjs.com/package/gulp-confirm) and the other being [gulp-prompt](https://www.npmjs.com/package/gulp-prompt), both with their own idea of how this should work. The latter one is actually a wrapper to [inquirer](https://www.npmjs.com/package/inquirer) and passes through all options unfiltered and unchanged.

So why not use `inquirer` directly? The API is pretty straight forward, so give it a go:

```javascript
var inquirer = require('inquirer');

gulp.task('default', function(done) {
    inquirer.prompt([{
        type: 'confirm',
        message: 'Do you really want to start?',
        default: true,
        name: 'start'
    }], function(answers) {
        if(answers.start) {
            gulp.start('your-gulp-task');
        }
        done();
    });
});
```

One important piece in here is the `done` callback. This one has to be passed and called in `inquirer`'s callback function to let Gulp know when this task has stopped. Otherwise it would end the task directly after calling it.

<h2 id="sync-directories-on-your-harddisk">Sync directories on your harddisk</h2>

This problem has come up multiple times on StackOverflow recently: People wanting to sync two folders, having all contents available in one folder also available in another. They have been searching for the best plugin, but didn't find anything really fitting their needs.

Before I came up with solutions, I asked a few things back:

* Do you really want to keep both folders in sync, which means having changes in folder A appear in folder B, *and* vice versa?
* Do you need this sync as part of some deployment on a remote location (if so, use [gulp-rsync](https://www.npmjs.com/package/gulp-prompt)), or during development process, where you have a watcher running.

Turned out that the true `A <-> B` scenario actually never happened, it was more of an `A -> B` scenario during development. And for this scenario the solution was strangely easy. If you want to have your contents in another folder, you don't need any Gulp plugin whatsoever. In fact, you don't need any Gulp plugin at all:

```javascript
// the sync
gulp.task('sync', function() {
	return gulp.src('./a/**/*')
		.pipe(gulp.dest('./b'));
});

// the watcher
gulp.task('watch', function() {
	gulp.watch('./a/**/*', ['sync']);
})
```

This line will copy all files from folder `a` to folder `b`. Include the [gulp-newer](https://www.npmjs.com/package/gulp-newer) plugin to boost up performance as you go:

```javascript
var newer = require('gulp-newer');

gulp.task('sync', function() {
	return gulp.src('./a/**/*')
		.pipe(newer('./b'))
		.pipe(gulp.dest('./b'));
});
```

But this is just half of the story. A real sync also deletes files in B should they've been deleted in A. For that we would need a change in our watcher:

```javascript
var del = require('del');
var path = require('path');

gulp.task('watch', function() {
	var watcher = gulp.watch('./a/**/*', ['sync']);
	watcher.on('change', function(ev) {
        if(ev.type === 'deleted') {
            del(path.relative('./', ev.path).replace('a/','b/'));
        }
    });
})
```

Everytime a file changes in our selected glob, we call `sync`. But before `sync` happens, the `change` event is called, where we dive in and do the following: Should the file have been deleted, we change its path to the corresponding file in the other folder and delete it!

There it is. Your one-way sync without any fancy Gulp plugin required.

<h2 id="pass-command-line-arguments-to-gulp">Pass command line arguments to Gulp</h2>

One question coming up a lot is how to handle different environments and destinations. This comes probably from a Grunt-y mindset, where it was all about handling different configurations for the same task. The more I use Gulp, the less I do have the need for different configurations, because somehow everything can be handled in-stream, but there might still be some occassions where it's necessary to flip some switches. And it would be great if we could do that directly from the command-line.

Let's assume we want to change the output directory based on a command-line switch. Usually we want to have it in the `dist` folder, but based on the command-line argument `destination` we want to change that.

There's a wonderful Node.js package out there called [yargs](https://www.npmjs.com/package/yargs), which parses everything that happens on the CLI and gives it to you in an easily devourable way:

```javascript
var args = require('yargs').argv;

var dest = args.destination ? args.destination : 'dist';

gulp.task('something', function() {
	return gulp.src('./src/**/*')
		.pipe(sometask())
		.pipe(gulp.dest(dest + '/'));
});

```

Line 3 is the important one. If we have the destination switch set, we set our value to it, otherwise we use the default `'dist'` folder.

Run it via `gulp --destination=prod` on your CLI, `yargs` will do the rest for you.

## Bottom line

Once more I saw that the best Gulp extras are the ones which don't require a plugin. That's the biggest strength of Gulp, but also its greatest weakness: You have to have a good understanding of what the Node.js ecosystem looks like and where to get the right tool for the right job. With Grunt it's easy: There is a Grunt plugin, and that's everything you have to know. With Gulp, the less you use it, the more you are on the right way (I know how that sounds).

Everytime you face a certain task and are in search for a Gulp plugin, ask yourself:

* Does it have anything to do with processing and transforming my files?
* Is it something that has to occur between the globbing my files and saving it?

If you can answer one of those questions with "No", you are most likely not in the need of yet another Gulp plugin. Try searching the Node.js ecosystem instead.
