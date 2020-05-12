---
layout: post
categories:
  - TypeScript
  - JavaScript
published: true
permalink: /void-in-javascript-and-typescript/
title: "void in JavaScript and TypeScript"
---

If you come from traditional, strongly typed languages you might be familiar with the concept
of `void`: A type telling you that functions and methods return nothing when called. 

`void` exists in both JavaScript as an operator and in TypeScript as a primitive type. And in both
worlds `void` works a little bit different than most people are used to.

## void in JavaScript

`void` in JavaScript is an operator which evaluates the expression next to it. No matter which
expression is evaluated, `void` always returns `undefined`.

```javascript
let i = void 2; // i === undefined
```

Why would we need something like this? First, in earlier times, people were able to override
`undefined` and giving it an actual value. `void` always returned the *real* undefined.

Second, it's a nice way to call immediately invoked functions:

```javascript
void function() {
  console.log('What')
}()
```

All without polluting the global namespace:

```javascript
void function aRecursion(i) {
  if(i > 0) {
    console.log(i--)
    aRecursion(i)
  }
}(3)

console.log(typeof aRecursion) // undefined
```

Since `void` always returns `undefined`, and `void` always evaluates the expression next to it,
you have a very terse way of returning from a function without returning a value, 
but still calling a callback for example:

```javascript
// returning something else than undefined would crash the app
function middleware(nextCallback) {
  if(conditionApplies()) {
    return void nextCallback();
  }
}
```

Which brings me to the most important use case of `void`: It's a security gate for your app. When
your function is always supposed to return `undefined`, you can make sure that this is always the case.

```javascript
button.onclick = () => void doSomething();
```

## void in TypeScript

`void` in TypeScript is a subtype of `undefined`. Functions in JavaScript always return something. 
Either it's a value, or `undefined`:

```javascript
function iHaveNoReturnValue(i) {
  console.log(i)
} // returns undefined
```

Since functions without a return value always return `undefined`, and `void` always returns undefined
in JavaScript, `void` in TypeScript is a proper type for telling developers that this function returns
`undefined`:

```javascript
declare function iHaveNoReturnValue(i: number): void
```

`void` as type can also be used for parameters and all other declarations. The only value that can be
passed is `undefined`:

```javascript
declare function iTakeNoParameters(x: void): void

iTakeNoParameters() // 👍
iTakeNoParameters(undefined) // 👍
iTakeNoParameters(void 2) // 👍
```

So `void` and `undefined` are pretty much the same. There's one little difference though, and
this difference is significant: `void` as a return type can be substituted with different types, to
allow for advanced callback patterns:

```javascript
function doSomething(callback: () => void) {
  let c = callback() // at this position, callback always returns undefined
  //c is also of type undefiend
}

// this function returns a number
function aNumberCallback(): number {
  return 2;
}

// works 👍 type safety is ensured in doSometing
doSomething(aNumberCallback) 
```

This is desired behaviour and often used in JavaScript applications. Read more on this
pattern called [substitutability](/typescript-substitutability/) in my other articles.

If you want to make sure to pass functions who only return `undefined` (as in "nothing"), 
be sure to adapt your callback method signature:

```diff
- function doSomething(callback: () => void) {
+ function doSomething(callback: () => undefined) { /* ... */ }

function aNumberCallback(): number { return 2; }

// 💥 types don't match
doSomething(aNumberCallback) 
```

You'll propably be good with `void` most of the time.

 //include helper/include-by-tag.html tag="TypeScript" title="More articles about TypeScript"
