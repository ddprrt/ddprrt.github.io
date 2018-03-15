---
title: "TypeScript and Substitutability"
layout: post
categories:
- typescript
published: true
permalink: /typescript-substitutability/
og:
  img: /wp-content/uploads/ogimgs/typescript-substitutability.png
---

When starting with TypeScript it took not much time to stumble upon some of the type system's odds. Odds that make a lot of sense if you take a closer look. In this article I want to show you why and how in some cases, TypeScript allows non-matching method signatures.

## Functions with fewer parameters

With TypeScript, it's fine to pass functions to other functions that have fewer parameters as specified. Look at the following example.

`fetchResults` has one parameter, a callback function. The method gets data from somewhere, and afterwards executes a callback. The callback's method signature has two paramters. `statusCode` (type `number`) and results (array of `number`). You see the call in line 4.

```javascript
function fetchResults(callback: (statusCode: number, results: number[]) => void) {
  // get results from somewhere
  ...
  callback(200, results);
}
```

We call `fetchResults` with the following `handler` function. The method signature is different, though. It omits the second paramter `results`.

```javascript
function handler(statusCode: number) {
  // evaluate the status code
  ...
}

fetchResults(handler); // compiles, no problem!
```

This still compiles with no errors or warnings whatsoever. This felt odd first, especially when comparing it to other languages. Why are non-matching method signatures accepted? But TypeScript is a superset of JavaScript. And if you think hard about it, we do this all the time in JavaScript!

Take `express`, the server side framework, for example. The callback methods usually have three parameters:
- `req`: the original request
- `res`: the server response
- `next`: passing over to the next middleware in the stack.

We can omit the `next` parameter if there's no need to call the next middleware.

The power lies in the callback function. The callback function knows best what to do with all the parameters handed over. And if there's no need for a certain parameter, it's safe to skip it.

## Return type void

If a function type specifies return type `void`, functions with a different, more specific, return type are also accepted. Again, the example from before:

```javascript
function fetchResults(callback: (statusCode: number, results: number[]) => void) {
  // get results from somewhere
  ...
  callback(200, results);
}
```

The callback function has two parameters in its signature, and the return type is `void`. Let's look at an adapted handler function from before:

```javascript
function handler(statusCode: number): boolean {
  // evaluate the status code
  ...
  return true;
}

fetchResults(handler); // compiles, no problem!
```

Even though the method signature declares a boolean return type, the code still compiles. Even though the method signatures don't match. This is special when declaring a `void` return type. The original caller `fetchResults` does not expect a return value when calling the callback. 

TypeScript would throw an error if we did assign the result to a variable or constant inside `fetchResult`. That's why we can pass callbacks with any return type. Even if the callback returns something, this value isn't used and goes into the void.

The power lies within the calling function. The calling function knows best what to expect from the callback function. And if the calling function doesn't require a return value at all from the callback, anything goes!

## Substitutability

TypeScript calls this feature "substitutability". The ability to substitute one thing for another, wherever it makes sense. This might strike you odd at first. But especially when you work with libraries that you didn't author, you will find this feature very usable.
