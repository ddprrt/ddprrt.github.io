---
title: Running an on-demand PHP server with BrowserSync and Grunt/Gulp
layout: book
published: true
permalink: /php-browsersync-grunt-gulp/
categories:
- PHP
- Tools
- BrowserSync
- Gulp
- Grunt
---

Quite a while ago I wrote a little article on [connect middleware and how to run PHP with it](/blog/2013/11/17/the-magic-of-grunt-contrib-connect-and-how-to-run-php-with-it/). While the article was originally intended to introduce the concept of connect middlewares to the Grunt audience, I get a lot of feedback on the PHP part. Which was actually broken by design. So, if you're search for a *real* on-demand PHP server in your Grunt or Gulp setup, and have all the livereload goodness you know from your connect server, proceed:

## Starting a real PHP server

The problem with the original solution was, that it tried to fit in one server (a PHP server) into the other ([connect](https://github.com/senchalabs/connect#readme)), which isn't possible at all. What was possible though, was to execute the PHP process every time a PHP file turns up in our connect stream. This would worked with basic `include`s, programming constructs, and `$_GET` parameters, however all the server stuff wouldn't. What we need is a *real* PHP server.

Since PHP 5.4 you have the possibility to run an [on-demand web server](http://php.net/manual/en/features.commandline.webserver.php) everywhere on your command line by simply typing `php -S` and the server address you want to have it listen to, like `php -S localhost:8000`. This is also not intended to replace a web server with PHP functionality, but serves quite well for development reasons. Now we just need a way to run it in Node.js, and better: In one of our build systems. Good for us there's the ever-coding [Sindre Sorhus](https://github.com/sindresorhus) who offers [Grunt-PHP](https://github.com/sindresorhus/grunt-php) for us. Install it to your project with `npm install --save-dev grunt-php`.

Setup is rather easy if you're familiar with `connect`:

```typescript
grunt.initConfig({
    php: {
        test: {
            options: {
            	base: 'app',
            	port: 8010,
                keepalive: true,
                open: true
            }
        }
    }
});

grunt.registerTask('server', ['php'])
```

This snippet opens up a PHP server running on localhost and port 8010, the `open` property calls the nearest browser to open, and `keepalive` tells our Grunt not to stop after executing the task.

You can do the same with Gulp. There's a plugin out there called `gulp-connect-php`, which is the most misleading name for a node module since you neither have to have Gulp for that one nor does it has anything to do with connect (so now tell me that the Grunt plugin directory is convoluted!). Anyhow, if you want to *use* it with Gulp, install it and start it that way:

```typescript
var gulp = require('gulp'),
    php  = require('gulp-connect-php');

gulp.task('php', function() {
    php.server({ base: 'app', port: 8010, keepalive: true});
});
```

That's basically all you need, you can go and enjoy your PHP server, started from your build files.

## Adding BrowserSync as a Livereload replacement

As the documentation in "Grunt-PHP" states: There is no way for middleware like there was in `grunt-contrib-connect`. That's mainly because the middleware concept is a thing of `connect`, not PHP. But we still want to use LiveReload (Getting all your results without having to refresh your browser is a real performance booster), and maybe some other middlewares we are used to. This is where [BrowserSync](http://browsersync.io) comes in. BrowserSync essentially is already a connect+livereload+custom middleware setup. But bundled together in one package without custom setup in a pure Node script and with command line tools to lower some barriers. One of the features which intrigued me the most was the possibility to let BrowserSync create a proxy for another server.

So BrowserSync forwards all requests to some other server, like our newly created PHP server, and when responding to it, it includes all the necessary scripts for livereloading and such.

For Grunt, this setup looks like this:

```typescript
'use strict';

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-php');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        watch: {
            php: {
                files: ['app/**/*.php']
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: 'app/**/*.php'
                },
                options: {
                    proxy: '127.0.0.1:8010', //our PHP server
                    port: 8080, // our new port
                    open: true,
                    watchTask: true
                }
            }
        },
        php: {
            dev: {
                options: {
                    port: 8010,
                    base: 'app'
                }
            }
        }
    });

    grunt.registerTask('default', ['php', 'browserSync', 'watch']);
};
```

Take a look at the browserSync task: We told him which files to watch for reloading (the `bsFiles` property), and to forward all calls from `localhost:8080` to `127.0.0.1:8010` with the proxy attribute. Note also that I added an (kinda empty) watch task to make sure that our server doesn't smoke off after one run, and that I removed the `open` and `keepAlive` properties. This way it's more suited for your other Grunt setup.

In Gulp, our code's even less. And uses actually not a single Gulp function whatsoever. We can include `browser-sync` directly, due to not having the need for wrappers when it's not meant to run through the Gulp pipeline.

```typescript
// Gulp 3.8 code... differs in 4.0
var gulp = require('gulp'),
    php = require('gulp-connect-php'),
    browserSync = require('browser-sync');

var reload  = browserSync.reload;

gulp.task('php', function() {
    php.server({ base: 'build', port: 8010, keepalive: true});
});
gulp.task('browser-sync',['php'], function() {
    browserSync.init({
        proxy: '127.0.0.1:8010',
        port: 8080,
        open: true,
        notify: false
    });
});
gulp.task('default', ['browser-sync'], function () {
    gulp.watch(['build/*.php'], [reload]);
});
```

The setup has the same changes as the one with Grunt. Note the watch process at the end, which basically tells us to call the `reload` function of BrowserSync every time a PHP file has changed.

Neat!

## Bottom line

This setup (especially with Gulp) works like a charm and will be included as my last gift for the [Yeoman generator](https://github.com/Netural/generator-netural) I wrote for my previous company. BrowserSync really is a tool which helps with all the clumsy connect setup we had to deal with in our old Grunt/Gulp setups. And with me being all pro "one tool should just do one thing" and having everything split up into manageable, little software parts, I can say I like having the "server thing" done right!
