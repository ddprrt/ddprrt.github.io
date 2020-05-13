---
layout: post
categories:
  - TypeScript
published: true
permalink: /why-i-use-typescript/
title: "Why I use TypeScript"
---

You might well see that my blog starts to center around TypeScript a lot recently. This might look 
like a strong deviation from what I usually blog and advocate: Performant, accessible and resilient
web sites.

A lot of people ask me why I do so much with TypeScript, and why I see it as such a central piece of
my day to day work. Let me explain by looking at the three encounters I had with TypeScript.

## 1. November 2012 - TypeScript at our local meetup

Just a month after TypeScript got released, some people showed their features at one of our local
meetups. [I even blogged about it](https://fettblog.eu/blog/2012/11/26/technologieplauscherl-at-netural/). I 
could see benefits back then, but was sceptical. Especially when I saw friends of mine using it. They usually 
came from the back-end side of things. Mostly Java and C#. That's why they strongly relied on things like 
"abstract classes" and "interface hierachies" and "factories" and "static classes" and ... **yuck**! All this
POOOP (patterns of object oriented programming) and SHIT (somehow hierachical interface trees) in my 
JavaScript?

That's not JavaScript. And I like JavaScript!

So I dismissed TypeScript.

## 2. Around 2015 - Giving Angular a try

Staying curious, I tried out the upcoming version of Angular. Don't pin me on the date. It was a
release candidate of Angular 2. A framework that pushed TypeScript to more popularity. And the first steps
I made needed to be very strongly typed. So much annotations and decorators Angular needs to understand your 
code. `any` was my best friend. But I got lost, and I gave up. I remember me saying: "TypeScript wants to know 
the type of my backend results. How do I know? I haven't even console logged it, yet!"

And... that wasn't JavaScript. And I like JavaScript!

So... I decided to stay off of TypeScript for a while. To be fair, back then my Angular knowledge was very
limited. And I think so was my willigness to change that.

## 3. Paternity leave 2018. Learning

I was on paternity leave in 2018 for three months, and had the chance to learn a lot while my baby child
was sleeping. I also learned new programming languages. And I thought I should give TypeScript and React a
try. Just to better know what I'm talking about. And being able to judge without looking at mere aesthetics.

When working with TypeScript, I found out that I can just write JavaScript like I'm used to. No complaining
from a compiler. No extra annotations. No fuss. 

But then came the revelation: TypeScript analyses my code constantly. And can give great information on my
code without me needing to do anything. Information my editor shows to me every time I write.

The truth is, if you are using VSCode and write JavaScript, you most likely are using TypeScript without your
knowledge. The TypeScript language server runs in the background, analyses your code and gives you as much
information as it can. This allows you to get a better development experience without the need to do anything.

TypeScript becomes an extra brain that knows my code much better than I do. And where it doesn't, I can give
TypeScript a little bit of extra type information to make it understand. And since you can do 
so much with JavaScript, TypeScript strives for being as complete as possible to type all the constructs
your JavaScript code can have.

This goes well with TypeScript's design goals
- It's gradual. Which means you can adopt TypeScript features whenever you feel the need to.
- Extensive type inference. TypeScript wants to know your JavaScript
- Control flow analysis. Everytime TypeScript can help you narrowing down possible types, it does.
- It closely tracks the ECMAScript standard. Nowadays you don't get extra language features that haven't 
  reached stage 3 in ECMAScript
- Innovations happen in the type system. TypeScript wants to give better ways to express your JavaScript
- Tooling, tooling, tooling. TypeScript's not here to restrict you. TypeScript is here to provide you with 
  tools that make you more productive.

I also watched a ton of YouTube back then, checked out old JSConf videos of historical introductions.
That's how I stumpled upon the [introduction of TypeScript](https://www.youtube.com/watch?v=3UTIcQYQ8Rw) at 
JSConf.EU 2012. The way Anders describes the design goals of TypeScript hasn't changed that much. Being a 
type layer on top of JavaScript has been TypeScript's goal since the very beginning. Language features were
a side effect. A side effect based on lots of tries from previous standardisation efforts like ES4.

So TypeScript... is JavaScript. JavaScript with benefits. And I like Javascript! And I like benefits.

My approach:
1. Write JavaScript. Be happy when something isn't `any`
2. Every time you want to have better types, add type annotations
3. Enjoy this as some extra documentation when you revisit a project
4. Stay away from any extra language stuff that mixes type annotations with stage 3 JavaScript. They are a 
   relict of old times.

And when you work like that, it's easy to like TypeScript. And that's why I use it so much and why I want to
write about it. It helps me, my co-workers, and my future self to actually know what I've been thinking. Can't
go wrong without that.

Btw. If you want the benefits, but stay away from the compile step, check out how to write 
[TypeScript without TypeScript](/typescript-jsdoc-superpowers/). This is actually useful. Libraries like
[Preact](https://github.com/preactjs/preact) manage to give you full TypeScript support and tooling, but 
still stay in JavaScript land for contributions and coding.

 
