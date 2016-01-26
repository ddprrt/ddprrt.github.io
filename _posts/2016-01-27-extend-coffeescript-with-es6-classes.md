---
title: "You can extend CoffeeScript classes with ES6 classes"
layout: post
published: true
permalink: /extend-coffeescript-with-es6-classes/
categories:
- ecmascript
- javascript
- node.js
---

**TL;DR**: If you want to extend from CoffeeScript written classes, you can use
the ES6 class syntax to do so.

Every once in a while you run into a library that was written with the best
intentions, but in CoffeeScript. Now you need that library badly, even want
to write your own extensions ... but alas, the lack of parentheses keeps you
from the caffeine. That just happened to me with [liquid-node](https://github.com/sirlantis/liquid-node).

Lovely tool, but to extend it to suit my needs, I would have to write in
CoffeeScript. Says the documentation. Turns out, you don't have to. Not if your
runtime environment is capable of ES6 classes.

## An example

Take this code listing for example:

{% highlight javascript %}
'use strict';

const Liquid = require('liquid-node'); // 1
const highlight = require('highlight.js')

module.exports = class Highlight extends Liquid.Block { // 2
  constructor(template, tag, params) {
    super(template, tag, params); // 3
    this.language = typeof params !== 'undefined' ?
      params.trim() : 'bash';
  }
  render(context) {
    return super.render(context) // 4
      .then(chunks => highlight.highlight(this.language, chunks.join('')))
      .then(parsed => `<div class="highlight"><pre><code class="${this.language}">${parsed.value}</code></pre></div>`);
  }
}
{% endhighlight %}

What's going on?

1. This is the library written in CoffeeScript. It features lots of classes that
can be used to create or own functionality.
2. With ES6 syntax, we can extend from the class `Liquid.Block` like it would be
done with CoffeeScript
3. You can even call the constructor from the class you extend from
4. Or do any other `super` calls

## Why does that work

The CoffeeScript class syntax didn't create *real* classes like you know from
the classical object oriented languages like Java or C#. Instead, it provided
some syntactic sugar for JavaScript's prototype chain.

ES6 classes do they same, but baked in your runtime environment.
