---
title: "TypeScript and React: Getting Started"
layout: post-typescript
categories:
- typescript
published: true
next:
  title: Components
  url: ../components/
---


TypeScript is a natural fit for React, not only because TypeScript is a full fledged JSX compiler. Which means
that you don't need a huge building setup. TypeScript includes everything you need. One thing you might want is a 
bundling tool. [Parcel](https://parceljs.org/) is one choice with easy to no configuration, but you can also use 
[Webpack](https://webpack.js.org/).

The TypeScript docs have some [documentation](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html) on
React and Webpack and might be a good start.

In this section:

1. [NPM packages to install](#npm-packages-to-install)
2. [tsconfig.json compiler options](#tsconfigjson-compiler-options)

## NPM Packages to install

Next to your bundler, you need the following packages to start. 

### Development dependencies

Install with `npm install -D [packagename]` or `yarn add --dev [packagename]`:

- [`typescript`](https://www.npmjs.com/package/typescript) - This guide uses v3.0.1
- [`@types/react`](https://www.npmjs.com/package/@types/react) - Type definitions for React. This guide uses v16.4.11
- [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) - Type defintions for the React DOM library. This guide uses v16.0.7

### Dependencies

Install with `npm install -S [packagename]` or `yarn add [packagename]`:

- [`react`](https://www.npmjs.com/package/react) - This guide uses v16.4.1
- [`react-dom`](https://www.npmjs.com/package/react-dom) - This guide uses v16.4.1
- [`tslib`](https://www.npmjs.com/package/tslib) - A runtime library for TypeScript helpers. This guide uses v1.9.3

## tsconfig.json compiler options

To make React work smooth and nicely with TypeScript, we need to set a couple of compiler options. Here are the
most important ones:

### jsx and jsxFactory


```json
{
  "compilerOptions": {
    ...
    "jsx": "react",
    ...
}
```

Other values for this are `react-native` if you work with React Native, and `preserve`, if you want to 
keep JSX as it is. `preserve` makes sense if you want to compile it later with Babel or a predefined setup.
If you want to use TypeScript and JSX with libraries like Preact, Vue or Dojo (they all speak JSX!), you can
define a specific JSX factory:

```json
{
  "compilerOptions": {
    ...
    "jsx": "react",
    "jsxFactory": "h",
    ...
}
```

This uses the respective virtual DOM implementation of said libraries (`h`) instead of `React.createElement`. 

### Synthetic default imports

TypeScript supports the ES module notation. You can import React with 

```javascript
import * as React from 'react'
```

but writing

```javascript
import React from 'react'
```

is a wee bit nicer. Mostly because you can import type definitions and React features in a destructured way:

```javascript
import React { Component, SFC } from 'react'
```

To make this work, we need to set both `allowSyntheticDefaultImports` and `esModuleInterop` to true:

```json
{
  "compilerOptions": {
    ...
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    ...
}
```

### Libraries

We use React for client-side development. That's why we need to import some libraries to support this.
In our case, we import ES 2015 (good baseline ES features) and DOM. With DOM, we get type definitions for
things like Events, HTML nodes, ... 

```json
{
  "compilerOptions": {
    ...
    "lib": [
      "dom", "es2015"
    ],
    ...
}
```

### Decorators

Decorators are an experimental language feature that was added to TypeScript back when
Angular switched from their own programming language to TypeScript. Since then they have
become hugely popular, leading to tons of discussions at TC39 how to include them best 
into the JavaScript language.

Since they are still at stage-2, TypeScript only features them if you turn on a flag.
Heads up: You don't need it for your usual React tasks. Once you start using tools like
MobX, though, they might come in handy.

```json
{
  "compilerOptions": {
    ...
    "experimentalDecorators": true,
    ...
}
```

## Bottom line

A ton to set up... I suggest getting [the official starter package on Github](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).
If you have an existing setup, the infos above will help you getting everything right. Let's start with some real code.
