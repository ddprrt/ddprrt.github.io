---
title: "Gulp, Sass, Autoprefixer, Sourcemaps!"
layout: post
published: true
modified: "2015-03-25"
categories:
- Tools
- Sass
- Gulp
---
**Update 2015/03**: *There has been a breaking change with `gulp-ruby-sass` v1.0. The files have been updated.*

Having Sourcemaps is one of the new big things in Sass 3.3. And rightfully so: The opportunity to fully track selectors and rules back to its very origin in your debugger is really, really helpful! And also, it's rather easy to set up. Just add the `--sourcemaps` flag and you are done.

Things can be complicated if you're using a more complex chain of build processes and tools. Like booting up *gulp* or *grunt*, processing your Sass files and post-processing it afterwards with `autoprefixer` or similar.

**TL;DR:** Use Sass's `compact` mode

It's a sensible approach do to so; prefixing (whether you like it or not) is something that is really tedious when done manually, and obfuscates your code when you rely too much on mixins. Plus, you have to think about what needs to be prefixed, and what can be left how it is. Actually using prefix mixins might double your work if you really care about a clean and sensible output. `autoprefixer` helps by knowing what needs to be done. This is what automation is all about.

Anyhow, if you want to have both benefits -- kick-ass sourcemaps and some help by automation tools -- you might easily end up in the same problem as my friend [Gerrit](http://praegnanz.de) did just a few days ago. Sourcemaps define a map of which line of code in the output is connected to which file and line of code in the original. If you're postprocessing your output and adding new lines (or removing them, depending on how you configured your `autoprefixer`), the map gets all mangled up. `autoprefixer` itself is able to create sourcemaps, but still, you would have to rewrite the old one, and that's kinda tedious.

But there is an easy trick how you can achieve both with minimal effort. Just don't allow  new lines to be created. Both Sass and `autoprefixer` care a lot about your style of coding. Which means that they don't f**k up your code once you've decided how the output is created. So, if you tell Sass to write each rule into one single line (output style `compact`), `autoprefixer` will add the new rules in exact the same line, thus keeping the sourcemap information intact.

When you're using `gulp`, be sure to use the ruby version of the plugin, and also make sure that you've Sass 3.3 installed.

```
gem install sass
```

Initialize your gulp setup:

```
npm init && npm install --save-dev gulp gulp-autoprefixer gulp-ruby-sass
```

The interface of `gulp-sass` (which uses a much faster native implementation) and the one of `gulp-ruby-sass` are **not** identical. So once `gulp-sass` is based on Sass 3.3, you not only have to switch plugins, but also adapt their parameters.

**Update 2014/6/3**: Apparently `gulp-sass` does not allow to use `outputStyle: compressed`, so you have to stick with the Ruby version for now.

**Update 2015/3/25**: With Sass 3.4. and `gulp-ruby-sass` 1.0 the interface has changed again. It now has been adapted to realise that's just a wrapper for the original Sass and not a piped through task, and also requires Gulp's sourcemap module to work properly. This might also change the behaviour with Autoprefixer and Sourcemaps in general.

Your `gulpfile.js`

{% highlight js %}
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var prefix = require('gulp-autoprefixer');

gulp.task('default', function () {
    sass('src/app.scss', {sourcemap: true, style: 'compact'})
        .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(sourcemaps('.'))
        .pipe(gulp.dest('dist'));
});
{% endhighlight %}

And voilà, feel yourself sourcemapped! Grunt setup is pretty much the same.

![Style tab in chrome shows the scss file](/wp-content/uploads/2014/chrome1.png)
![Source tab leads to the right source and line](/wp-content/uploads/2014/chrome2.png)

*Big thanks to [Gerrit](https://twitter.com/gerritvanaaken) and [Florian](https://twitter.com/pichfl) for a nice discussion!*
