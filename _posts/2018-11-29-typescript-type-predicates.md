---
title: "TypeScript: Type predicates"
layout: post
categories:
- TypeScript
published: true
permalink: /typescript-type-predicates/
og:
  img: wp-content/uploads/ogimgs/typepredicates.png
---

Type predicates in TypeScript help you narrowing down your types based on conditionals. They're similar to type guards, but work on functions.
They way the work is, if a function returns true, change the type of the paramter to something more useful.

Let's start with a basic example. Let's say you have a function that checks if a certain value is of type string:

```javascript
function isString(s) {
  return typeof s === 'string';
}
```

Use the `isString` function inside another function:

```javascript
function toUpperCase(x: unknown) {
  if(isString(x)) {
    x.toUpperCase(); // ⚡️ x is still of type unknown
  }
}
```

TypeScript throws an error. We can be sure that `x` is of type string at this point. But since the validation is wrapped in 
a function, the type of `x` does not change (as opposed to type guards). Enter type predicates.

Let's tell TypeScript explicitly that if `isString` evaluates to true, the type of the parameter is a string:

```javascript
function isString(s): s is string {
  return typeof s === 'string';
}
```

TypeScript now knows that we are dealing with strings in our `toUpperCase` function.

```javascript
function toUpperCase(x: unknown) {
  if(isString(x)) {
    x.toUpperCase(); // ✅ all good, x is string
  }
}
```

See that in the [TypeScript playground](https://www.typescriptlang.org/play/index.html#src=function%20isString(s)%3A%20s%20is%20string%20%7B%0D%0A%20%20return%20typeof%20s%20%3D%3D%3D%20'string'%3B%0D%0A%7D%0D%0A%0D%0Afunction%20toUpperCase(x%3A%20unknown)%20%7B%0D%0A%20%20if(isString(x))%20%7B%0D%0A%20%20%20%20x.toUpperCase()%3B%20%2F%2F%20%E2%9A%A1%EF%B8%8F%0D%0A%20%20%7D%0D%0A%7D);

## Narrowing down sets

This not only helps you for unknown types, or multiple types, but also to narrow down sets within a type. Let's have a program where
you throw a dice. Every time you throw a Six, you win.

```javascript
function pipsAreValid(pips: number) {
  // we check for every discrete value, as number can 
  // be something between 1 and 2 as well.
  return pips === 1 || pips === 2 || pips === 3 ||
    pips === 4 || pips === 5 || pips === 6;
}

function evalThrow(count: number) {
  if (pipsAreValid(count)) {
    // my types are lying 😢
    switch (count) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        console.log('Not today');
        break;
      case 6:
        console.log('Won!');
        break;
      case 7:
        // TypeScript does not complain here, even though
        // it's impossible for count to be 7
        console.log('This does not work!');
        break;
    }
  }
}
```

The program looks good at first, but has some issues from a type perspective: `count` is of type number. This is ok as an input
parameter. Right away we validate that `count` is a number between 1 and 6. Once we validate this, `count` is not *any* number anymore.
It's narrowed down to a discrete set of six values.

So starting from the switch statement, my types are lying! To prevent any further complications, let's narrow down the set of numbers
to those six discrete values, using union types:

```javascript
type Dice = 1 | 2 | 3 | 4 | 5 | 6;

function pipsAreValid(pips: number): pips is Dice {
  return pips === 1 || pips === 2 || pips === 3 ||
    pips === 4 || pips === 5 || pips === 6;
}

function evalThrow(count: number) {
  if (pipsAreValid(count)) {
    // count is now of type Dice 😎
    switch (count) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        console.log('Not today');
        break;
      case 6:
        console.log('Won!');
        break;
      case 7:
        // TypeScript errors here. 7 is not in the union type of 
        // Dice
        console.log('This does not work!');
        break;
    }
  }
}
```

A lot type safer for us, and for our colleagues. Of course this "type casts" can be anything that makes sense to strengthen your
applications. Even if you validate complex objects, you can narrow down your parameters to a specific type and make sure they
get along with the rest of your code. Useful, especially if you rely on a lot of functions.
