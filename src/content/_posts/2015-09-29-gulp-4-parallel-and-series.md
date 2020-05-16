---
title: "Gulp 4: The new task execution system - gulp.parallel and gulp.series"
layout: book
published: true
permalink: /gulp-4-parallel-and-series/
categories:
- Gulp
- Tools
---

One of the major changes in Gulp 4 is the new task execution system. In this
article, I want to show you what's new and how you can migrate the best.

## Task execution chains in Gulp 3

Before we take a look at the new, let's see what was there previously. Usually,
Gulp would allow defining a dependency to a task. It would make sure that this
dependency task gets executed before the original task gets triggered. Look
at this code:

```typescript
// Per default, start scripts and styles
gulp.task('default', ['scripts', 'styles'], function() {...});

// Both scripts and styles call clean
gulp.task('styles', ['clean'], function() {...});
gulp.task('scripts', ['clean'], function() {...});

// Clean wipes out the build directory
gulp.task('clean', function() {...});
```

A very basic Gulpfile. You want to build scripts and styles, but before you do
so, clean the original build directory so you can start at a blank slate. The
syntax is very elegant and similar to those of other build tools.

When Gulp's started, it creates a dependency tree like the one below.

![How Gulp 3 orders tasks](/wp-content/uploads/2015/folie1.jpg)

So it realizes that *clean* is a dependency of two tasks. In this way, it makes
sure that it is executed only once.

One thing to keep in mind there: All those tasks are executed for maximum
concurrency. So the execution order is something like shown in the next
figure.

![Gulp 3 dependency check and execution order](/wp-content/uploads/2015/folie2.jpg)

First clean, then *scripts* and *styles* in parallel, and after that we can
execute the default task function.

There are however several problems with it:

* Once you define the dependency chain in that way, the execution of
this dependency is mandatory.
* This is a particular problem if you want to have watchers that listen on one
type only. Imagine triggering the *styles* task every time you change one of your
CSS files. It would execute first *clean*, and then *styles*, practically
deleting your efforts from "script".
* Also, there is currently no way of executing tasks sequentially. The "first clean,
then task" style of executing can be done just with dependencies, leading to the
problems above.

One Gulp plugin that tried to bridge the gap here was [run-sequence](https://www.npmjs.com/package/run-sequence).
It's functionality is now part of Gulp 4 with the addition of the new
task manager "Undertaker".

## Task execution functions for Gulp 4

Gulp 4 drops the dependency parameter completely and replaces them with execution functions
that can be used instead:

- `gulp.series` for sequential execution
- `gulp.parallel` for parallel execution.

Each of those functions allow for parameters of the following kind:

* The name of the task to execute
* Another function to execute

So if you want to execute *styles* and *scripts* in parallel, you can write
something like this:

```typescript
gulp.task('default', gulp.parallel('scripts', 'styles'));
```

The cool thing is, `gulp.parallel` and `gulp.series` are functions, and
accept functions. So you can nest them as much as you want, creating
complex execution orders:

![Parallel and series nested](/wp-content/uploads/2015/folie4.jpg)

The execution of the graph above is: A, then B, then C and D parallel, then E.

## Migration

Since we aim for the maximum currency, one would think to replace all dependency
arrays with `gulp.parallel` functions, like that:

```typescript
gulp.task('styles', gulp.parallel('clean', function() {...}));
gulp.task('scripts', gulp.parallel('clean', function() {...}));

gulp.task('clean', function() {...});

gulp.task('default', gulp.parallel('scripts', 'styles'));
```

The first problem with this approach is that `clean` always gets executed with the
actual task that creates the output. In a concurrent world, this can mean that we
immediately delete the files we created. We don't want that. So let's exchange the
tasks that are meant to be executed after another with `gulp.series`.

```typescript
gulp.task('styles', gulp.series('clean', function() {...}));
gulp.task('scripts', gulp.series('clean', function() {...}));

gulp.task('clean', function() {...});

gulp.task('default', gulp.parallel('scripts', 'styles'));
```

Better. However, there are still problems. First of all, the dependency is still
hard-wired: "Clean" gets called every time we call *scripts* or *styles*.

Second, Gulp 4 does not have any dependency check (because they aren't dependencies)
anymore, so our execution tree looks something like that:

![The problem replacing the arrays with gulp.parallel](/wp-content/uploads/2015/folie3.jpg)

"Clean" gets executed twice. This is fatal, because it might actually be that
results from one task would be deleted by the next execution tree.

To make a good and robust migration, without hard wires and by keeping the original
execution order, do the following. Look at the original execution order:

![Gulp 3 dependency check and execution order](/wp-content/uploads/2015/folie2.jpg)

The execution order of the tasks in the original tree are: *clean*, *styles* and
*scripts* in parallel, and then the *default* task.

Each step that can be done in concurrent will be combined in a `gulp.parallel`
function. The others are ordered in a `gulp.series` function. Like that:

![Our original execution chain restructured](/wp-content/uploads/2015/folie5.jpg)

The accompanying source code:

```typescript
// The tasks don't have any dependencies anymore
gulp.task('styles', function() {...});
gulp.task('scripts', function() {...});

gulp.task('clean', function() {...});

// Per default, start scripts and styles
gulp.task('default',
  gulp.series('clean', gulp.parallel('scripts', 'styles'),
  function() {...}));
```

The execution order at *default* stays the same as previously, but all the
other tasks can be used on their own, without being bound on dependencies.

Hurray for flexibility!
