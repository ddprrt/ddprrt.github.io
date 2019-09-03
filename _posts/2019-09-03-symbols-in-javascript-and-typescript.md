---
layout: post
categories:
  - TypeScript
  - JavaScript
published: true
permalink: /symbols-in-javascript-and-typescript/
title: "Symbols in JavaScript and TypeScript"
---

Object properties in JavaScript can be of type `number` or `string`, allowing different ways of
property access:

```javascript
const collectionWithModifiers = {
  0: { name: 'Stefan', age: 37},
  1: { name: 'C', age: 2 },
  length: 2,
  allToLowerCase() {
    for(let i = 0; i < this.length; i++) {
      this[i].name = this[i].name.toLowerCase()
    }
  }
}

collectionWithModifiers[0].name = 'Not Stefan'
collectionWithModifiers.allToLowerCase()

// This also works
collectionWithModifiers['allToLowerCase']()
```

## Symbols in JavaScript

## Symbols in TypeScript

## Runtime Enums

An interesting use case of symbols is to re-create `enum` like behaviour at runtime in JavaScript.
`enum`s in TypeScript are opaque. This effectively means that you can't assign string values to `enum`
types, because TypeScript treats them as unique:

```javascript
enum Colors {
  Red = 'Red',
  Green = 'Green',
  Blue = 'Blue',
}

const c1: Colors = Colors.Red;
const c2: Colors = 'Red'; // 💣 No direct assigment possible
```

Very interesting for comparisons:

```javascript

enum Moods {
  Happy = 'Happy',
  Blue = 'Blue'
}

// 💣 This condition will always return 'false' since the
// types 'Moods.Blue' and 'Colors.Blue' have no overlap.
if(Moods.Blue === Colors.Blue) {
  // Nope
}
```

Even with the same value types, being in an enum makes them unique enough for
TypeScript to consider them not comparable.

In JavaScript land, we can create enums like that with symbols. See the colors of the
rainbow an black in the following example. Our "enum" `Colors` includes only symbols
which are colors, not black:

```javascript
// All Color symbols
const COLOR_RED: unique symbol = Symbol('RED')
const COLOR_ORANGE: unique symbol = Symbol('ORANGE')
const COLOR_YELLOW: unique symbol = Symbol('YELLOW')
const COLOR_GREEN: unique symbol = Symbol('GREEN')
const COLOR_BLUE: unique symbol = Symbol('BLUE')
const COLOR_INDIGO: unique symbol = Symbol('INDIGO')
const COLOR_VIOLET: unique symbol = Symbol('VIOLET')
const COLOR_BLACK: unique symbol = Symbol('BLACK')

// All colors except Black
const Colors = {
  COLOR_RED,
  COLOR_ORANGE,
  COLOR_YELLOW,
  COLOR_GREEN,
  COLOR_BLUE,
  COLOR_INDIGO,
  COLOR_VIOLET
} as const;
```

We can use this symbols just as we would use `enum`s:

```javascript
function getHexValue(color) {
  switch(color) {
    case Colors.COLOR_RED: return '#ff0000'
    //...
  }
}
```

And the symbols can't be compared:

```javascript
const MOOD_HAPPY: unique symbol = Symbol('HAPPY')
const MOOD_BLUE: unique symbol = Symbol('BLUE')

// All colors except Black
const Moods = {
  MOOD_HAPPY,
  MOOD_BLUE
} as const;

// 💣 This condition will always return 'false' since the types 
// 'typeof MOOD_BLUE' and 'typeof COLOR_BLUE' have no overlap.
if(Moods.MOOD_BLUE === Colors.COLOR_BLUE) {
  // Nope
}
```

There are a few TypeScript annotations hat make sense:

1. We declare all symbol keys (and values) as `unique symbols`, meaning
   the constant we assign our symbols to can never be changed. This symbol
   exists like that forever.
2. We declare our "enum" objects `as const`. With that, TypeScript goes from
   setting the type to allow for every symbol, to just allow the exact same
   symbols we defined.

This allows us to get more type safety when defining our symbol "enums" for 
function declarations. We start with a helper type for getting all value types
from an object.

```javascript
type ValuesWithKeys<T, K extends keyof T> = T[K];
type Values<T> = ValuesWithKeys<T, keyof T>
```

Remember, we use `as const`, which means that our values are narrowed down to
the exact value type (e.g. type is `COLOR_RED`).

With that, we can declare our function like that:

```javascript
function getHexValue(color: Values<typeof Colors>) {
  switch(color) {
    case COLOR_RED:
      // super fine, is in our type
    case Colors.COLOR_BLUE:
      // also super fine, is in our type
      break;
    case COLOR_BLACK: 
      // what? What is this??? TypeScript errors
      break;
  }
}
```

This gives you both type safety at compile time through TypeScript `unique symbol`s,
and actual type safety at runtime with the unique characteristics of JavaScript's
`Symbol`s.

And, als always: [A playground](https://www.typescriptlang.org/play/index.html#code/LAKFGMHsDsGcBcAEBhA8gGVQJQPpYKIAiAXIgK7QCWAjmQKaKwCeAtgEaQA2iAvIgMqsOnABQByNJlwFCYgJQQYCFBmw5sAQQByAcXykKNeoyFdeA06Imrcm3fnmK4SSWoCa+dJgDqBqrQZmdjM+QWCrV1wPL1RvRxAoZxUpHB0CfC0-I0DLczDhcUjU9K14xOUigCF0AFV9cn9jIOE8y0KbHGq6sqUXDoBJLUJ+nVQsgJNw1vD2lMHh0Z6kooA1fox8ABVxptzQtusUtY3NpYqO6o1kAGkdnKn9mcO1S5v4pwquSAAnWHMAb1AiGSahkABogSDbFhtHoISBgUVoj54YiOml8BlUVDOrV8NiivMRqgCR1jugtqAAL6IACGf3K8AA3KBQPAmAAHBgrWmceiwbyUeAAC2udCYsAAPJswYhrog6AAPeB0aAAEz+AGtxZAAGaITYAPnMmwA2tcALoskDsrmIHl8uhSo3mB38wUisUS6Wy7VMPUGw2skC6ijgeCUGCIADmdHgAAklW66CIoJwfqRk1LbXQA8gvr9DXJEICEYwAO5C8DC1MF4ul4HA8D0hj59O-AB0VTxxEhjcQAHoB33G2xvnRaZrrf3m7BWxd0FdbogR8Ch6vEGOJ1PIVTqcHYwmk7z6CI2z9YF2F3UFGAEr1EABZVCoQg4eMaAAKn7cd0mLUeAoxA-b83DOJBn1fXE6j-ZoQgsJ4ugcW9QCHRANE4bg0wvBVFXAOgOSQSpOFpcBNQ+CDIEgDUAUhSC3xAn9sXo6D8GpOkGV6a1QEoXUREfKiNQ7FikN4Hg+HPTtuxvEtIWpIA) for you to fiddle around.


{% include helper/include-by-tag.html tag="TypeScript" title="More articles about TypeScript" %}
