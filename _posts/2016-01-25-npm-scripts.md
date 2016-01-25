---
title: "The best thing about NPM scripts"
published: true
permalink: /npm-scripts/
categories:
- npm
- tools
---

**TL;DR:** NPM Scripts render global installations of NPM command line tools useless.

For quite some while people love to echo the amazing power of NPM's package scripts.
With a view additions to `package.json`, you are able to run shell commands and other
tools with NPM, without needing any build tools at all. See [Substack's article](http://substack.net/task_automation_with_npm_run) on that topic. A good one.

And yes, NPM scripts are wonderful. The Grunt and Gulp and whatnot killer?
Maybe, depends on your use case. Decide for yourself.

There is one little thing about NPM scripts that is awesome. I would
even consider it the best feature of them. It adds the local `node_modules` binary
folder to your execution path.

What does that mean? When you install Node modules locally, you get a
`node_modules` folder containing everything you've installed. You know that. If you
install a tool locally that has some executable, this executable will be added
in a hidden `.bin` folder in `node_modules`.

That means if you install command line tools like Gulp, Grunt or Browserify not
with a `-g` flag, but as a dependency and local, you still get the command line
tool in your `node_modules` folder. Without explicitly adding it to your
execution path, this won't do anything. But if you run NPM scripts, this path is
exactly what's included. For example:

{% highlight javscript %}
{% raw %}
{
  ...
  "scripts": {
    "gulp": "gulp"
  },
  ...
}
{% endraw %}
{% endhighlight %}

So `npm run gulp` would be the same as running a globally installed "Gulp CLI".
You can even pass parameters:

```
$ npm run gulp -- build
```

is the same as

```
$ gulp build
```

This allows you to run any command line tool in continuous integration or on
your system without polluting your global `node_modules` directory. This helps
also when you are regularly switching Node versions with `nvm`. This also helps
if you have to handle multiple versions of one command line tool. For example
running Gulp 3.x and Gulp 4 in parallel.

Cool stuff! I wouldn't want to work without it.
