---
title: noPrefixes flag in Modernizr
layout: post
published: true
categories:
- CSS
- Browser
- Modernizr
---

More than half a year ago I had some little rant on why we should [drop using vendor prefixes as a whole](/blog/2013/07/02/preparing-for-an-unprefixed-future/). Main points were:

* Major browser vendors (Google, Mozilla, Microsoft) follow the policy of just shipping unprefixed features in their browsers' stable releases. So *unprefixed* became kind of a synonym for a stable feature. Prefixed features are in developer releases and just meant to ~~fool~~ play around and get a preview of things to come. See the [Blink developer FAQ](http://www.chromium.org/blink/developer-faq#TOC-Will-we-see-a--chrome--vendor-prefix-now-) and [Mozilla Statement in W3C lists](http://lists.w3.org/Archives/Public/public-webapps/2012OctDec/0731.html) for more details.
* Current versions of major browsers already support plenty of CSS3 and HTML5 features unprefixed, as pointed out in my previous article. Take the `transition` property, for instance.
* Older browsers, especially older mobile browsers, support modern features just prefixed, but in most cases they run crappy and have either huge performance issues, other implementation quirks or follow deprecated specifications. We should treat those browsers like old IEs and just give a presentation that they really can handle.

Also, [several](http://remysharp.com/2012/02/09/vendor-prefixes-about-to-go-south/) [people](http://www.brucelawson.co.uk/2012/on-the-vendor-prefixes-problem/) already pointed out that vendor prefixes were a necessary evil, but are all in all bad and shouldn't be used at all; neither by developers nor by browser vendors. There's even a "[considered harmful](http://www.quirksmode.org/blog/archives/2010/03/css_vendor_pref.html)" article out there, which just shows that there are some *really* strong feelings out there!

## One (solvable) problem

Well, we kept them using anyways. Mostly because we were used to it, and there were tools (Sass mixins, [Emmet.io](http://emmet.io) autocompletion), which helped creating more code than necessary.

Another reason was because we love using [Modernizr](http://modernizr.com) and the great ability to do feature based decision making: If feature *A* exists, use that code, otherwise do it in a different way. Modernizr tests **do** also check for prefixed features. So, for your switch to work in all cases, prefixes were again mandatory.

Modernizr is an indispensable tool for my daily workflow and helps me progressively enhancing my websites and applications.

We had some [discussion](https://github.com/Modernizr/Modernizr/issues/1082) over at Modernizr and decided to try if a robust and easy to opt-in possibility exists for that very case. And now, with the upcoming release, there's a flag for that.

## noPrefixes

It's pretty easy to set up for you. I hope to have it [on the Modernizr web page](http://modernizr.com/download/) in the near future, but for now you just clone or fork or download the repo, and add one line of code in the file `config-all.json`. Try to figure out which one!

```javascript
"options": [
  "setClasses",
  "addTest",
  "html5printshiv",
  "load",
  "testProp",
  "fnBind",
  "noPrefixes"
],
```

`config-all.json` includes all options for the Modernizr build. Here you can remove the HTML5 Shiv, the possibility to add new (custom) tests, or remove tests which you have no use for. Afterwards, you just build your file using Grunt. Et voilà!

## One alternative against code bloat

If you still want to use vendor prefixes in your CSS file, be sure to check out [Autoprefixer](https://github.com/ai/autoprefixer). It uses the [Caniuse.com](http://caniuse.com) database to make sure that your property is just prefixed with the necessary ones.

## Modernizr team, I love you guys!

Big thanks to [Patrick Kettner](http://twitter.com/patrickkettner) from the Modernizr team who guided me through all this! Learned a lot from you guys.
