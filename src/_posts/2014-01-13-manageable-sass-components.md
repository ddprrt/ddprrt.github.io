---
title: Create manageable Sass components (to use with Bower, etc.)
layout: post
published: true
categories:
- Tools
- Sass
- bower
---

Having a set of reusable and ready software components is a great thing. And for a multitude of reasons, like ensuring DRY development or boosting efficiency. A software component is a self contained unit of program code which can be accessed only by a defined interface. Or like [Berkely University puts it](http://www.eecs.berkeley.edu/~newton/Classes/EE290sp99/lectures/ee290aSp994_1/tsld009.htm):

> A software component is a unit of composition with contractually specified interfaces and explicit context dependencies only. A software component can be deployed independently and is subject to composition by third parties

We already have a lot of components in JavaScript. In the CSS world, developing such components is a lot harder. CSS is a fairly easy language: You have a set of properties which can take certain values, and that's it. The beauty of CSS lies in this simplicity, but same simplicity makes reusability difficult.

When using a preprocessor like [Sass](http://www.sass-lang.com), we might achieve more possibilities for component building, but we still might have some of those difficulties regarding self-containment.

## Handling components with Bower and Revision Control

That's especially true when used with a package manager like [Bower](http://bower.io). Bower was designed to take care of all your third party libraries which you can install from GitHub. Bower provides a command line interface for (un-)installing components. You might know that with

```
bower install konamicode.js
```

you just download the newest version of that component in your components folder. With the `--save` flag

```
bower install konamicode.js --save
```

you also add this library to a file called `bower.json`, which records all your installations.

```javascript
{
  "name": "demo",
  "version": "0.0.0",
  "dependencies": {
    "konamicode.js": "~1.0.0"
  },
  "devDependencies": {}
}
```

The main benefit of this file is that -- even if you accidentally delete one of the installations or mess up with them -- a simple

```
bower install
```

will re-install all the previously installed and `--save`d components, even in the right version.

Now think of revision control. When you are saving your project in some sort of repository (GitHub, SVN, whatever), you would just need to commit `bower.json`. Because everything can be reconstructed. Just like only committing `package.json` and calling `npm install` after checkout will reconstruct all the node modules you've previously had installed.

Why you shouldn't commit those files? Because not only do you save space and unnecessary transactions, you can also keep your project's repository clean and clear, and focus just on the files that are *really* the contents of *your* project. For a more detailed explanation and even more reasons, checkout [Mikeal Rogers' excellent article on that topic](http://www.futurealoof.com/posts/nodemodules-in-git.html).

And this just works really well for JavaScript components, because (at least most of the time) you don't have to make any changes to the library itself. Take *jQuery* for example: This is just one file you download from the repo and your done with.

*Modernizr* is more advanced: ~~Download~~ *Install* the whole repository and build a custom `modernizr.js` depending on the actually used CSS and JS properties without touching the original files. No need to commit all the thousand-something files in your repository.

Also, Sass/LESS mixing libraries fulfil the requirements for being handled like this. But with other CSS -- or rather Sass components -- you have one big obstacle if you want to do so: They are (mostly) meant to be adapted and changed. Be it colour values in *[Twitter Bootstrap](https://github.com/jlong/sass-bootstrap)* or font properties in Harry's recent [Typecsset](https://github.com/csswizardry/typecsset).

But actually the latter one is a prime example of how to keep those kind of modules manageable.


## The `!default` flag

Enter the `!default` flag. This little command has everything we need to create default values for our variables, just like other programming languages would handle them.

To quote the [Sass reference](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#variable_defaults_):

> You can assign to variables if they aren’t already assigned by adding the !default flag to the end of the value. This means that if the variable has already been assigned to, it won’t be re-assigned, but if it doesn’t have a value yet, it will be given one.

So, given a `!default` flag at the end of your variable assignment, we make sure that there is a value available no matter if your developer has assigned one or not. Take a look at this example:

```css
$spacing: 	1rem !default;

.box {
  margin: 0;
  margin-bottom: $spacing;
}
```

If I assign a value to `$spacing` on any other occasion *before* stating the class, the class will take that value. On the other hand, if I don't, I still make sure that my statement *has* some value.

This behaviour gives us one real benefit when developing Sass components: We can configure them from *outside*, without touching the source itself. We get a needed *interface* for configuration and usage, but the component is as self contained as it should be.

[Harry's](http://twitter.com/csswizardry) Sass libraries show perfectly how this might work. Again, take *Typecsset* as an example. To quote (and comment) the demo code from his README:

```css
/* YOUR configuration for typecsset, overriding the
   default values from the library. Our interface to
   the component
 */
$typecsset-base-font-size:      18px;
$typecsset-base-line-height:    27px;

[Your own CSS]

/* Inclusion of the -- now parametrised -- library */
@import "path/to/typecsset";

[More of your own CSS]
```

Another example comes from [inuit.css](http://inuitcss.com), his CSS framework, which is a lot bigger and features actually a set of different components.

```css
/*------------------------------------*\
    $OBJECTS AND ABSTRACTIONS
\*------------------------------------*/
/**
 * Which objects and abstractions would you like to use?
 */
$use-grids:         false!default;
$use-flexbox:       false!default;
$use-columns:       false!default;
$use-nav:           false!default;
$use-options:       false!default;
$use-pagination:    false!default;
...
```

All of those sub-component can be activated on demand. And that's the real beauty of it: Instead of adding a lot CSS definitions that you have to *remove*, you are opting them only if you really need them. Your Sass code might look like this:

```css
$use-grids: true;
$use-flexbox: true;

/* Next to the core definitions, just 'grids'
   and 'flexbox' is going to be used */
@import "path/to/inuit";
```

## Your very own Sass component

If you have Sass code that you are going to reuse with different parameters, and one that is not meant to be in some sort of mixing or function, you can easily apply those learnings by yourself:

* Every value that can change across uses should be put in a Sass variable.
* This variable should be set to a default value in the library/component itself. Use the `!default` flag to apply the rule of using this very value if it has not been set yet.
* If the value needed differs from the default value, it should be assigned *outside* of the library files, just before it's inclusion.
* If you want to register it with Bower, see their [docs](http://bower.io/), especially *Defining a package* and *Registering packages*

*Thanks to [@yellowled](http://twitter.com/yellowled) for proof-reading*
