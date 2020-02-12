---
layout: typescript
categories:
  - TypeScript
  - JavaScript
published: true
permalink: /typescript-hasownproperty/
title: "TypeScript: Check for object properties and narrow down type"
og:
  img: wp-content/uploads/2020/typescript-1.png
---

TypeScript's control flow analysis lets you narrow down from a broader type to a more narrow type:

```javascript
function print(msg: any) {
  if(typeof msg === 'string') {
    // We know msg is a string
    console.log(msg.toUpperCase()) // 👍
  } else if (typeof msg === 'number') {
    // I know msg is a number
    console.log(msg.toFixed(2)) // 👍
  }
}
```

This is a type-safety check in JavaScript, and TypeScript benefits from that. However, there are some cases where
TypeScript *at the time of this writing* needs a little bit more assistance from us.

Let's assume you have a JavaScript object where you don't know if a certain property exists. The object might be `any` or `unknown`. In JavaScript, you would check for properties like that:

```javascript
if(typeof obj === 'object' && 'prop' in obj) {
  //it's safe to access obj.prop
  console.assert(typeof obj.prop !== 'undefined') // But TS doesn't know :-(
}

if(typeof obj === 'object' && obj.hasOwnProperty('prop')) {
  //it's safe to access obj.prop
  console.assert(typeof obj.prop !== 'undefined') // But TS doesn't know :-(
}
```

At the moment, TypeScript isn't able to extend the type of `obj` with a `prop`. Even though this works with JavaScript.

We can, however, write a little helper function to get correct typings:

```javascript
function hasOwnProperty<X extends {}, Y extends PropertyKey>
  (obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop)
}
```

If you don't want to know how this works, copy it and be happy. If you want to know more, let's check out what's happening:

1. Our `hasOwnProperty` function has two generics:
   1.  `X extends {}` makes sure we use this method only on objects
   2.  `Y extends PropertyKey` makes sure that the key is either `string | number | symbol`. `PropertyKey` is a builtin type.
2. There's no need to explicitly define the generics, they're getting inferred by usage.
3. `(obj: X, prop: Y)`: We want to check if `prop` is a property key of `obj`
4. The return type is a [type predicate](/typescript-type-predicates/). If the method returns `true`, we can retype any of our parameters. In this case, we say our `obj` is the original object, with an intersection type of `Record<Y, unknown>`, the last piece adds the newly found property to `obj` and sets it to `unknown`.

In use, `hasOwnProperty` works like that:

```javascript
// person is an object
if(typeof person === 'object' 
  // person = { } & Record<'name', unknown>
  // = { } & { name: 'unknown'}
  && hasOwnProperty(person, 'name') 
  // yes! name now exists in person 👍
  && typeof person.name === 'string' 
  ) {
    // do something with person.name, which is a string
  }
```

That's it! A lovely little helper to make TypeScript understand your code better.
Here's a [playground](https://www.typescriptlang.org/play/index.html?ts=3.8-Beta&ssl=6&ssc=1&pln=3&pc=1#code/C4TwDgpgBACgTgezFAvFAzsOBLAdgcygB8pcBXAWwCMI5iMRqEAbAbgCh2AzM3AY2DYEuKAAsAhugDyAd1zwktUAB4AGlAgAPYBFwATdFADeAXwA0UAJobtug7ERgAfAAoEVAFYAuKKothHH0sASh93DyhsQ3UAMigAJQg+BDg9ZUsLXgBrXAQ5J2N2KCg4CGAyOBFwgDoJaTkFSDhQFwCkYPYTTj0k5nFSqGTcTCgQH1N2bC4oFzrZeUclEBcQCwByXHEKCDXgqBi4uYbF5uXVqDXMMi4uXb2jIsjpl1BIBGmQas3t1BQ0S6weHwa32cU+6Huj2Kjy6XXYQA) for you to fiddle around.

{% include helper/include-by-tag.html tag="TypeScript" title="More articles about TypeScript" %}
