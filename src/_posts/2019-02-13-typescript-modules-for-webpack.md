---
layout: post
categories:
  - TypeScript
published: true
permalink: /typescript-modules-for-webpack/
title: "TypeScript: Ambient modules for Webpack loaders"
---

When you work on modern JS apps you most likely use Webpack. Webpack always looked like a very complicated build tool to me, until I realised that it's nothing but a JavaScript bundler. A JavaScript bundler that allows you to bundle _everything_! CSS, Markdown, SVGs, JPEGs, you name. It exists and helps the web, you can bundle it.

## Import everything

Once I got that Webpack configs weren't that scary anymore. It's loaders loading stuff in JavaScript. Stuff that wouldn't be loadable otherwise. Cool! You define the assets to load in the JavaScript file you develop.

```typescript
// like this
import "./Button.css";

// or this
import styles from "./Button.css";
```

Especially the last one lets you use CSS class names like object properties, how nice!

If you are like me and use TypeScript for all you code, you will  quickly realise that TypeScript is not so happy with non-TypeScript or non-JavaScript imports.

## TypeScript's modules

TypeScript itself does neither load other modules, nor does it bundle JavaScript into files. TypeScript uses modules to get more type information for you and to sanity check your code to make sure you didn't have any error.

What should TypeScript do with something that isn't a JS or TS module? Exactly. Throwing an error! *Could not find module*.

There is a way to solve this.

## Ambient module declarations

TypeScript supports so called "**ambient module declarations**". Even for a module that is not "physically" there, but in the environment or reachable via tooling. One example are Node's main built-in modules, like `url`, `http` or `path`:

```typescript
declare module "path" {
  export function normalize(p: string): string;
  export function join(...paths: any[]): string;
  export var sep: string;
}
```

*The example above comes from the docs*. This is great for modules where we know the exact name. We can use the same pattern also for wildcard patterns. Let's declare a generic ambient module for all our CSS files:

```typescript
declare module '*.css' {
  // wait for it
}
```

The pattern is ready. This listens to all CSS files we want to import. What we expect is a list of class names that we can add to our components. Since we don't know which classes are defined in the CSS files, let's go with an object that accepts every string key and returns a string.

```typescript
declare module '*.css' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames;
  export default classNames;
}
```

That's all we need to make our files compile again. The only downside is that we can't use the exact class names to get auto completion and similar benefits. There is a [ton 🏋️‍♀️ of packages 📦 on NPM](https://www.npmjs.com/search?q=css%20modules%20typescript%20loader), that deal with that. Pick yours!

## MDX

It's a bit easier if we want to import something like MDX into our modules. MDX lets us write Markdown which parses to regular React (or JSX) components. This sounds super weird at first but it's actually a ton of fun to use. Let's define that in an ambient module for our webpack loader.

We expect a functional component (that we can pass props to) that returns a JSX element:

```typescript
declare module '*.mdx' {
  let MDXComponent: (props) => JSX.Element;
  export default MDXComponent;
}
```

And voilà: Everything perfectly usable:

```typescript
import About from '../articles/about.mdx';

function App() {
  return <>
    <About/>
  </>
}
```

## What if we don't know the result

If you don't know what to expect, make your life easy:

```typescript
declare module '*.svg';
```


## Where to put ambient modules

To make ambient modules available to your app, I recommend creating an `@types` folder somewhere in your project (probably root level). There you can put any amount of `.d.ts` files with your module definitions in. Add a referal to your `tsconfig.json` and TypeScript knows what to do 👍

```typescript
{
  ...
  "compilerOptions": {
    ...
    "typeRoots": [
      "./node_modules/@types",
      "./@types"
    ],
    ...
  }
}

```

As [Martin](https://twitter.com/martin_hotell) suggests, a good pattern is to create folders with the package name, and put `index.d.ts` files in them. But that's up to you!

 
