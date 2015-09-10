---
title: "Node.js 4.0.0 and Gulp first aid"
layout: book
published: true
permalink: /gulp-and-node4-first-aid/
categories:
- gulp
- tools
---

[Node.js 4.0.0](https://nodejs.org/en/blog/release/v4.0.0/) just got released! The jump from 0.12.x
to 4.0 is a huge one, especially since it incorporates lots of changes that happened
over at the IO.js project. So far, I haven't experienced a lot of issues with it, and it
quickly became the one version that I use as default on my system. However, there are some
hickups here and there. Here I try to collect some issues with Gulp.js and first aid
solutions. There are few and they might be out of date quickly.

## Segmentation fault

If you run your Gulp build, it might happen that you experience the following output:

```
Segementation fault
```

This one leaves you with no information, but the solution is rather straightforward:
Re-install your Node.js dependencies:

```
$ rm -rf node_modules
$ npm install
```

And you should be ready to go again. Frederic gives more help here:

<blockquote class="twitter-tweet" lang="de"><p lang="en" dir="ltr"><a href="https://twitter.com/ddprrt">@ddprrt</a> Yes, all native modules require recompiling against latest V8 (best using nan@3).</p>&mdash; Frederic Hemberger (@fhemberger) <a href="https://twitter.com/fhemberger/status/641981760688005120">10. September 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

## libsass bindings not found

If you use `gulp-sass` with the native C++ implementation of Sass, you might end up
with the following error:

```
Error: `libsass` bindings not found
in /[PROJECT DIRECTORY]/trunk/node_modules/gulp-sass/node_modules/node-sass/vendor/linux-x64-14/binding.node.
Try reinstalling `node-sass`?
```

There are some dependency conflicts inside `libsass`, which we can resolve by moving
to an earlier version of Sass.

```
$ npm uninstall gulp-sass node-sass
$ npm install node-sass@1.0.3
$ npm install gulp-sass
```

## That's it

Up until now, I haven't found anymore issues. Will keep you posted if there are more
