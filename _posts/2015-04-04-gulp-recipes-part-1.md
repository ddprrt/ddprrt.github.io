---
title: "Gulp Recipes - Part One"
layout: book
published: true
permalink: /gulp-recipes-part-1/
categories:
- gulp
- tools
---

In the last two weeks I spent a good deal of time on [StackOverflow](http://stackoverflow.com/questions/tagged/gulp), trying to solve every open Gulp question there is. The reasons for that are manifold, and besides an overall high amount of spare time and a strong tendency to masochism (it would be more if I'd watch the JavaScript channel there), there was one more reason, which I hope to address at some point in the future.

After answering about 30 questions or so, I saw that while their issues seem to be unique, the solutions to them are often nearly the same. Focussing on the problems that lie underneath, I tried to compile a list of recipes which might help you with your own gulpy hiccups.

To make it more easily digestible, I'll start with three recipes for now, continuing this series over time.

### Today's menu:

* [Conditionally delete files](#conditionally-delete-files)
* [Stopping `gulp.watch` after some time](#stopping-the-watch-process-after-some-time)
* [Same task, different configurations](#same-task-different-configurations)

<h2 id="conditionally-delete-files">Conditionally delete files</h2>

There was one user [having fun with TypeScript](http://stackoverflow.com/questions/29267041/how-to-conditionally-delete-generated-javascript-files/), and putting the output of every compiled `.ts` file into the same directory. This directory also contains other `.js` files:

```
scripts/
├── module.ts   // the original TypeScript file
├── module.js   // the compile JavaScript file, we need to get rid of this
├── module2.ts  // the original TypeScript file
├── module2.js  // compiled JS --> delete
└── library.js  // original JavaScript file, this one should be kept
```

So, without changing the folder structure, how do you get rid of the compiled resources, without touching the original JavaScript files? We just cannot delete all ".js" files, because we would remove `library.js` also. But what we can do is select all our TypeScript files, and find the accompanying JavaScript files. To do so, we use [`glob`](https://www.npmjs.com/package/glob) (or [`globby`](https://www.npmjs.com/package/globby)) to recreate the same file selection mechanism we know from Gulp. The output is different: Instead of getting a stream of vinyl objects, we get an array of filenames. And this array we are going to manipulate by replacing the file extension (`.ts`) with a new one.

What we get is a new array, consisting of only JavaScript files. We pass this one to the `del` module:

{% highlight javascript %}
var gulp = require('gulp');
var del = require('del');
var glob = require('glob');

// This method replaces all ".ts" occurrences at the
// end of our filenames with ".js"
var replaceTS = function(file) {
    return file.replace(/.ts$/, '.js');
};

gulp.task('delete', function(done) {
    glob('./scripts/**/*.ts', function(err, files) {
        del(files.map(replaceTS));
        done();
    })
});
{% endhighlight %}

Please note that we don't need any Gulp plugins or similar. Everything is done using standard node modules. One of the bigger strengths of Gulp.

<h2 id="stopping-the-watch-process-after-some-time">Stopping `gulp.watch` after some time</h2>

In this [issue](http://stackoverflow.com/questions/29268054/how-to-timeout-gulp-watch-if-inactive/), Stack Overflow user Finglish wanted to know how to stop Gulp's watch process after being idle for some time. You can use that to be reminded of your own laziness or -- more likely -- to kill demanding processes should you have forgotten them. The latter one actually happens lots of time to me.

I included this one in this series because you'll learn that `gulp.watch` has more to offer than just a simple watch process:

{% highlight javascript %}
gulp.task('watch', function() {
	// gulp.watch here works like you would've
	// expected it. Only difference: We save the
	// returned watcher in a variable.
    var watcher = gulp.watch('./app/*.js', ['jshint']);

    // Simple and basic JavaScript: After one hour, we call
    // watcher.end to end the watch process and thus
    // Gulp, too.
    var timeout = setTimeout(watcher.end, 60*60*1000);

	// Should one of our watched files change ...
    watcher.on('change', function() {
    	// .. we clear the timeout call we created earlier ...
        clearTimeout(timeout);
        // .. and start it anew ...
        timeout = setTimeout(watcher.end, 60*60*1000);
    });
});
{% endhighlight %}

Prime example of how basic Gulp functionality mixed with a touch of basic JavaScript methods create something helpful and unique.

<h2 id="same-task-different-configurations">Same task, different configurations</h2>

This one I do get a lot: What if you want to run the same task, but with different configurations. Take this configuration object for example:

{% highlight javascript %}
var config = [
	{
		src: 'project-one/scripts/**/*.js',
		name: 'p1.bundle.js',
		dest: 'public/compiled'
	},
	{
		src: 'project-two/scripts/**/*.js',
		name: 'p2.bundle.js',
		dest: 'public/compiled'
	},
	{
		src: 'project-three/scripts/**/*.js',
		name: 'p3.bundle.js',
		dest: 'private/compiled'
	},
	{
		src: 'project-four/scripts/**/*.js',
		name: 'p4.bundle.js',
		dest: 'private/compiled'
	}
];
{% endhighlight %}

We want to run all of those to a pipeline of task which is absolutely identical. The only things different are inputs and outputs. We can achieve this by creating a so called stream array:


{% highlight javascript %}
var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
// this node module will do the trick
var merge  = require('merge2');

gulp.task('scripts', function() {
	// we use the array map function to map each
	// entry in our configuration array to a function
	var tasks = config.map(function(entry) {
		// the parameter we get is this very entry. In
		// that case, an object containing src, name and
		// dest.
		// So here we create a Gulp stream as we would
		// do if we just handle one set of files
		return gulp.src(entry.src)
			.pipe(concat())
			.pipe(uglify())
			.pipe(rename(entry.name))
			.pipe(gulp.dest(entry.dest))
	});
	// tasks now includes an array of Gulp streams. Use
	// the `merge-stream` module to combine them into one
	return merge(tasks);
});
{% endhighlight %}

This pattern can be used by many problems. We had something similar last time when we created [multiple Browserify bundles](/gulp-browserify-multiple-bundles/).

## Bottom line

All three recipes share one thing in common: There is no special gulp plugin or fancy core functionality doing magic tricks, it's most of the time basic JavaScript and some already existing modules from the Node.js ecosystem. This might also be the reason those questions are asked that often on StackOverflow and consorts, because it's a lot harder to find and requires some mental switch. Especially if you come from other build systems such as Grunt.
