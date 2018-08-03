---
title: "TypeScript and React"
layout: post-typescript
categories:
- typescript
published: true
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

{% include typescript-react-menu.md %}
