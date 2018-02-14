---
title: Cutting the mustard - 2018 edition
layout: post
published: true
permalink: /cutting-the-mustard-2018/
categories:
- JavaScript
- Progressive Enhancement
---

The other day I was holding a workshop on performance optimisation for single page applications. For this workshop I needed an example that I could optimise step by step. I decided not to use a framework, as I didn't know the experiences and background of my attendees. Also, I didn't want to draw attention to framework details, rather focus on concepts that build on the platform and that are universally applicable to SPAs.

Coding modern JavaScript for quite a while (especially on Node!), I used every new language feature in my demo app: `import`/`export`, `async`/`await`, `fetch`, classes, arrow functions, template strings and literals. Basically everything that clashes with good old ES5 syntax-wise.

After I wrote the first couple of lines, I was naturally thinking about transpiling everything down to something all browser could understand. Then I paused for a little while and asked myself: *Do I really have to?*

## Browsers don't need to get there, they are here!

So before installing Babel and Webpack or Browserify, I realised something: Just like every single browser on all my books knows how to interpret CSS Grid, every single browser on all my books has implemented a great deal of ESnext syntax features. Features that would cause syntax errors on older platforms.

I knew that from features like classes or arrow functions. But even things like `async`/`await` -- which I rarely used before -- [are available on all major platforms](https://caniuse.com/#feat=async-functions). This is amazing! This is living in the future! No need to transpile, no need to have a build script. Code, deploy, run!

See the code below. This is the standard [`client.js`](https://glitch.com/edit/#!/es5-jquery-version?path=public/client.js:1:0) file from [glitch.com](https://glitch.com), but refactored to use modern JavaScript instead of jQuery and old syntax.

```javascript
const $ = (sel) => document.querySelector(sel);

export async function init() {
  console.log('hello world :o');
  const res = await fetch('/dreams');
  const dreams = await res.json();
  $('#dreams').innerHTML = dreams.map(dream => `<li>${dream}</li>`).join('');

  $('form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const dream = $('input').value;
    const res = await fetch(`/dreams?dream=${dream}`, { method: 'POST' });
    if(res.ok) {
      $('#dreams').innerHTML = $('#dreams').innerHTML + `<li>${dream}</li>`;
      $('input').value = '';
      $('input').focus();
    }
  });
}
```

Look at all the goodness we can use now:
- [`async/await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/async_function) - write asynchronous code in a synchronous way. Syntactic sugar for your promises!
- [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) - like XHR, but actually easy to use!
- [Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) - anonymous functions, easier to write, easier to scope
- [Template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) - no more weird string concatenation
- [Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) - export and import from other JavaScript files, natively

*But wait*, you might say, *what about the browsers that don't support all those new features*? Yeah, what about those?

## Cutting the mustard - 5 years ago

I loved it when [Chris Heilmann](https://twitter.com/codepo8) said at [ScriptConf](https://scriptconf.org) that "it's **not** okay to block old browsers, but it's a **waste of time** to support them 100%". This is wonderful call to do progressive enhancement. Create a solid foundation, enhance when features are ready. You can do this for every feature on its own. Or you can be more aggressive and make a clean cut in which browsers you support and which you don't.

The BBC calls it *[cutting the mustard](http://responsivenews.co.uk/post/18948466399/cutting-the-mustard)*. Having a strict set of rules a browser has to pass to get the full experience.

```javascript
if('querySelector' in document
  && 'localStorage' in window
  && 'addEventListener' in window) {
  // bootstrap the javascript application
}
```
If a browser does not fulfil one criteria, it won't get any JavaScript and has to live with the plain old, but still usable, HTML only experience. The rules are a sign of the times. This article was published more than five years ago. It distinguishes between "HTML4" browsers (which had no unified API and would most likely need jQuery) and "HTML5" browsers.

I think we now face a similar distinction between ES5 browsers and modern ESnext browsers. And I think we can once again make a clean cut: Deliver a solid, but reduced experience to non ESnext browsers, get the full featured experience on modern browsers.

## Cutting the mustard - now!

The rules in the BBC article were checking for features available in the platform. This time it's a bit different, as we most likely don't even get to feature checks. The syntax updates are so entirely different, that some browsers might throw syntax errors before the whole script is parsed and executed.

But, there's a way to safely activate the feature-rich enhancement on modern platforms without causing any error at all. And it's baked right into the platform itself!

Along with all the modern syntax features comes a (not so) little but important specification: Modules. Not only modules in the sense of importing and exporting methods from other files, but also a `script` type that's available in HTML:

```html
<script type="module">
import { init } from './client.js';
init();
</script>
```

At time of writing this `script` type is available in all modern browsers (in Firefox behind a flag) and features a wonderful behaviour for our cause: Browsers that understand this type will load the module as defined. Browsers that don't know what to do with that will simply ignore the whole lot. Perfect!

*But what about Firefox!*, I hear you say.  Firefox supports all the goodness I've shown you earlier, but modules are still behind a flag. However, as history shows, this is something that can change rather quickly. Every other browser features ES modules. And ES modules work pretty well in Firefox when the flag is activated. So the path for Firefox to feature ES modules in all upcoming releases is a good one. We just have to wait a little.

And if you just can't wait, than you can use a proposal by [Jouni](https://twitter.com/jouni_kantola): Doing [feature tests for async functions](https://github.com/jouni-kantola/webpack-promote-modern-browsers/blob/master/ViewTemplates/modern-script-view-template.tmpl).

## Using it now

We reached a point with evergreen browsers where we can define another checkpoint, a new status quo for browser features. Just as we distinguished between non-HTML5 browsers and HTML5 browsers back in the day, we can make a watershed for non-ES6 and ES6 browsers from now on. A common understanding on what's supported and what isn't.

After piecing all together, I decided to use this right away. All my new sites and projects will try to live without transpiling or bundling. Maybe a little [Rollup](https://rollupjs.org) to reduce the amount of files, but no extra module loading behaviour that doesn't come from platform. And inside my scripts I can freely use all the syntax I love and know from Babel-times and Node.js.
