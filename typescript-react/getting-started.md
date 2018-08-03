---
title: "TypeScript and React: Getting Started"
layout: post-typescript
categories:
- typescript
published: true
---


TypeScript is a natural fit for React, not only because TypeScript is a full fledged JSX compiler. Which means
that you don't need a huge building setup. TypeScript includes everything you need. One thing you might want is a 
bundling tool. For the upcoming examples we use [Parcel](https://parceljs.org/), but switch to a basic Webpack setup later.

## Installation

To get ready, install the following NPM packages (either with NPM or Yarn, this guide uses NPM):

```
npm install -S react react-dom tslib
npm install -D @types/react @types/react-dom typescript parcel
```

Dependencies are React and React DOM. The latter allows you to use React with the web. `tslib` contains helper
methods for TypeScript to run in older browsers. 

Development dependencies are TypeScript to compile your TypeScript files, and Parcel to bundle them into one. Also
we install type definitions for React and React DOM. 

## The JSX flag in tsconfig

