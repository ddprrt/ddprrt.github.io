---
title: "TypeScript and React: Getting Started"
layout: post-typescript
categories:
- typescript
published: true
---

TypeScript is a natural fit for React, not only because TypeScript is a full fledged JSX compiler. Which means
that you don't need a huge building setup. TypeScript includes everything you need. One thing you might want is a 
bundling tool. For the upcoming examples we use Parcel, but switch to a basic Webpack setup later.

## Installation

To get ready, install the following NPM packages (either with NPM or Yarn, this guide uses NPM):

```
npm install -S react react-dom tslib
npm install -D @types/react @types/react-dom typescript parcel
```
