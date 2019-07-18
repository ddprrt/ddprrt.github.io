---
title: "TypeScript and React"
layout: post-typescript
categories:
- typescript
published: true
og:
  img: /wp-content/uploads/ogimgs/ts-react.png
---

Welcome to this little primer on TypeScript and React! A match made in heaven!

Why? JSX is syntactic sugar. Every JSX element you open and pass properties through, is nothing but a function 
call  in React (or Preact or Vue or Dojo... you name it). This gives us one big advantage in TypeScript: 
JavaScript can be parsed, understood and evaluated. Which means you get all the tooling and compilation
benefits that TypeScript has to offer. Missing a required property? TypeScript will tell you! Having a
typo somewhere: You will find out. Not knowing which properties you need? Autocomplete to the rescue!

With that, TypeScript and React are a perfect fit. You will enjoy combining both technologies together
to get huge productivity boost when writing your applications!

This guide assumes that you are familiar with the basic concepts of both React and TypeScript. 
We will focus on the combination of the technologies and the resulting features.

Also, this guide does not claim to be complete. It's one way and more important one easy way to
dive into React and TypeScript, modelled after two core principles:

1. Using as little setup and tools as possible. TypeScript already has a transpiler and a JSX compiler, so the only thing we need extra is some bundling. I will link to guides if your project needs some extra tooling.
2. Using TypeScript features only where needed. TypeScript has brilliant type inference, so you get
a ton of features like autocompletion and type safety already out of the box and without any extra code. Wherever we can improve on what's given,
we will.

Ready? Let's go!

## Table of contents:

1. [Getting started](./getting-started/): How to set up TypeScript and React, and what are your options
2. [Components](./components/): Components are everything in React. TypeScript gives you a lot of ways how to deal with them.
3. [Children](./children/): There's nothing more beautiful than children. In React, they even can be functions.
4. [Events](./events/): Apps are boring if you don't interact with them. Clicks, inputs, etc. are handled here.
5. [Prop Types](./prop-types/): Prop Types are React's built-in way of type checking. We can make good use of that with TypeScript.
6. [Hooks](./hooks/): Hooks are pretty new and pretty exciting. And already pretty well typed.
7. [Render props and child render props](./render-props/): *A technique for sharing code between React components using a prop whose value is a function*. We can type that!
8. [Context](./context/): React's context API gives you global state with a very lean API.
9. [Styles](./styles/): Coming soon!
10. [Further reading](./further-reading/): So many things not covered in our guide. You will find them here.
