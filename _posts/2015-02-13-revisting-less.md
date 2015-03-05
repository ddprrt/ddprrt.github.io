---
title: Revisiting LESS
published: true
layout: post
permalink: /revisiting-less-stylesheets/
categories:
- Tools
- LESS
- Sass
- Preprocessors
---

Back in 2011 when we started using preprocessors at our company the decision fell very quick to [LESS](http://www.lesscss.org). The reasons for that where mannifold:

1. We could use [WinLESS](http://www.winless.org) and LESSApp (not available anymore) to cover all our developer's infrastructure
2. The website was pretty

And we where very happy with it. Let's say for half a year or so, when we started to switch to much more popular [Sass](http://sass-lang.org) preprocessor:

1. We all had Macs by now and thus Ruby pre-installed. A short way to Sass. Especially if you want to run it on your Jenkins server, too.
2. We had `@extend`, and I loved that.

And stuck with it since. Life was good, and we're still using it up to this day. When I started lecturing at the University of Applied Sciences in Hagenberg, me and my colleagues decided to teach them CSS preprocessors, because they rock. But our choice went  back to LESS. Mostly because it was easy to get on the university's PCs (download a JS and include it, enough for running demos!) and one of my colleagues was very uncomfortable with every programming language that did not had at least a little "Java" in its name. Brr.

Anyhow. As CSS and tooling guy, it was my task to take a closer look at LESS as it was now and create a little 2 hour talk on it. And I found out, boy, in three years time a lot has changed:

1. LESS now has `extend` too
2. The website looks like crap! <span id="up01">[<a href="#down01">1</a>]</span>

Hah! Same as Sass back then! So it has to be good!

I was diving more into the topic and found out that it now has some really good features. And I want to show you which ones stuck with me the most. This ain't going a lame "Sass vs LESS" (take that, SEO!) comparison which gets on everybody's nerves. Except the fanbois. They love that. 

80 percent of pre-processor users use 20 percent of their features. And in that case Sass and LESS are absolutely identical. So deal with it! 

However, the stuff I want to show you is something that you can really use in your daily workflow, without being overly specific. Actually, this can be perfectly included in Sass once and we all will be happy by having it. 

## `extend`

Yeah! `extend` is there in LESS. And it works like you would expect, because you know it from Sass already. And yeah, that's one of the features everybody loved and brought people to Sass in the first place, and now it's considered kind of bad practice because you can do a lot of bullshit if you don't know what to do with it. Guess what! You can do a lot more bullshit now with the LESS version of it!

This is the basic code, which works as we would expect it:

{% highlight css %}
/** LESS **/
.pattern {
  color: blue;
}

.extender {
  &:extend(.pattern);
}

/** CSS RESULT **/

.pattern,
.extender {
  color: blue;
}

{% endhighlight %}

Tadaa! You don't have placeholders like in Sass yet (classes you can extend from, but with aren't in the output), but you got several other extend possibilites you don't have in Sass. Which can be nice if you know what you're doing:

### The `all` keyword

Usually the selector you extend from has to be specified in the very same format, but the `all` keyword searches for a selector pattern and extends from all selectors in which this one occurs.

{% highlight css %}
/** LESS **/
.pattern {
  color: blue;
}

#stuff > .pattern {
  color: red;
}

.extender {
  &:extend(.pattern all)
}

/** CSS **/

.pattern,
.extender {
  color: blue;
}
#stuff > .pattern,
#stuff > .extender {
  color: red;
}
{% endhighlight %}

### Extend from any and multiple selectors

Sass extending is boring because you just can extend from one single class, tag, id or placeholder. Nested selectors are not allowed. In LESS however, you can extend from any selector pattern you like. Multiple times.

{% highlight css %}
/** LESS **/
nav a {
  color: blue;  
}

#topnav .item {
  background-color: red;  
}

.other-link {
  &:extend(nav a, #topnav .item);
}

/** CSS **/
nav a,
.other-link {
  color: blue;
}
#topnav .item,
.other-link {
  background-color: red;
}
{% endhighlight %}

Handy! 

What I especially like is the possibility of attaching the extend rule directly to the selector like some sort of pseudo-class. That's some syntactic sugar I like. I don't use `extend` as often as I should (didn't do it in Sass either), but I like how they tackle some edge cases. This is still something that's pretty cool otherwise too.

Anyways. The next feature is one which is super cool:

## Importing CSS files

Let it roll over your tongue: Import CSS files! Oh yeah, you can import any CSS file as long as you don't forget to state the extension and call what to do with it:

{% highlight css %}
@import 'mylessmodule';
@import (inline) 'csscodefromtheinterwebs.css';
{% endhighlight %}

Boom! Use any blindly downloaded CSS code directly in your one and only `main.less` file. But importing does not stop here! Think of having more LESS modules which require one certain file to be imported. You want to make sure that this file *is* there, but you don't want to import multiple times? There's the keyword `once` which deals with that. And that's even the default behaviour.

## Namespaces

This one is huge if you are totally into the OOCSS craze, but don't want to hurt your documents with a lot of classes in your DIVs and constantly calling them semantics. You can have namespaces! There you can

1. Use IDs, even you some guys say you shouldn't
2. Can use all the OOCSS extravaganza you got butchered in your head over the last few years. Including all the BEMing
3. Style actual HTML elements which represent the thing you actually want to have. Like, let's say, buttons.

So here's how this works. Mixins in LESS are nothing more that classes. You can use **any** class (or ID) you defined in your CSS (or LESS) as a mixin somewhere else. This is pretty unique for LESS and totally cool if you're used to:

{% highlight css %}
/** LESS **/

.myclass { color: blue; }

.otherclass { 
  .myclass;
}

/** CSS **/

.myclass { color: blue; }

.otherclass { color: blue; }
{% endhighlight %}

(btw. you also can import basic CSS files per reference, which means that they are loaded, but not included in your output, and use *any* CSS file as mixin library. Sweet, huh?).

That's the basic usage. If you put parentheses next to the class, you can define parameters or just make sure that the mixin does not get written into your CSS output. It's also possible that you *nest* mixins. This is where you can create some sort of bundles, like this one:

{% highlight css %}
/** LESS **/

/**
 * Don't forget the parentheses to make 
 * sure this one's not in the CSS
 */
#bundle() {
  .btn {
    border-radius: 5px;
    color: white;
    background-color: blue;
  }
  
  .btn--disabled {
    color: gray;
    background-color: gray;
  }
}

button {
  #bundle > .btn;
  
  &:disabled {
    #bundle > .btn--disabled;  
  }
}

/** CSS **/

button {
  border-radius: 5px;
  color: white;
  background-color: blue;
}
button:disabled {
  color: gray;
  background-color: gray;
}
{% endhighlight %}

This is like the best of *all* worlds! [Twitter Bootstrap](http://getbootstrap.com) actually makes heavy use of this technique. Pretty cool because you include all those popular opinions on pattern and anti-pattern in one single example and piss off everybody at the same time! No, seriously, this is pretty cool if you want to work in that way. 

## Plugins

LESS now has a sweet little plugin architecture where you can extend the platform at your will. You aren't limited to the basic features, but can include new functions and processes by simply writing JavaScript. Which I personally prefer compared to Ruby or consorts. The funny thing is that LESS also comes with a postprocessing chain, which means you can add things like [autoprefixer](https://github.com/postcss/autoprefixer) to the tool itself.

This might not be so mind-blowing if you use something like Grunt or Gulp, but if you are just sticking to one tool, and that being LESS. It can come in totally handy. At the moment I'm writing a little plugin for the upcoming [HWB color space](/hwb-colors/).

You can use *autoprefixer* from the command line like that:

```
# Assuming that LESS is installed, install the plugin
$ npm install -g less-plugin-autoprefix

# Included when you run LESS on your files
$ lessc file.less --autoprefix="last 2 versions"
```

You can also include those plugins when using the Grunt-Plugin or the one for Gulp.

## Getting rid of the Ruby dependecy

If you're totally in front-end tooling and have a huge Node.js based toolchain with a lot of Grunt or Gulp code, creating your distributables on different levels using continuous integration (local, staging, live, whatever), you always have to make sure that there's a Ruby installation available, along with the correct version of Sass installed (and the correct version of Ruby installed). LESS -- which originally starting as a Ruby tool <span id="up02">[<a href="#down02">2</a>]</span> -- runs on Node.js. The version of the compiler can be fixated in the package.json for every project, so that's also a plus for CI.

And it's much, much faster.

Here's the output of compiling the LESS and Sass version of Bootstrap with their respective Grunt plugins (the `grunt-contrib-sass` plugin using the native one):

```
# Sass

$ grunt sass
Running "sass:dist" (sass) task

Done, without errors.


Execution Time (2015-02-13 14:02:21 UTC)
sass:dist   1.2s  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 100%
Total 1.2s


# LESS

$ grunt less
Running "less:dist" (less) task
File main-less.css created

Done, without errors.


Execution Time (2015-02-13 14:01:20 UTC)
less:dist    528ms  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 100%
Total 530ms

```

Check out this [gist](https://gist.github.com/ddprrt/5a46331028250f79c412) with all the files from my demo setup.

## Bottom line

I know that this one was rather cheeky and way over the top. Actually I still don't care which preprocessor you use, as long as you know that you need to use one. I'm one of those users who does not go that much further than the basic features. If you're one of those gurus who stick on their absolutely advanced features where you need all those loops and conditions, LESS is still nothing for you. For the others: Well, you might like it!

Things I still miss from LESS are also on a convenience level. I like the color output from Sass where the colors are much more optimised (that's available per [plugin](https://github.com/less/less-plugin-clean-css) in LESS), and the very reason that variables don't start with the @-sign, which has some sort of meaning in basic CSS.

But anyhow, after using it for a while, I strongly consider using it on projects again. I'm curious if my way of doing things really changes with switching the technology.

Oh, and there's still a lot more changes to check out. [The merge feature](http://lesscss.org/features/#merge-feature) for instance are quite interesting, so are a lot of their new [functions](http://lesscss.org/functions/).

<span id="down01">[<a href="#up01">1</a>]</span> Forgive me, Jon Schlinkert. It was just for the laughs, I don't mean it that way ;-)

<span id="down02">[<a href="#up02">2</a>]</span> Yup, that's right. Actually LESS was originally not so different from the SCSS version of Sass. SCSS could be seen as the direct successor to LESS in the Ruby world