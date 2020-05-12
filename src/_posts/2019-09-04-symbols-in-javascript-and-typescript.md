---
layout: post
categories:
  - TypeScript
  - JavaScript
published: true
permalink: /symbols-in-javascript-and-typescript/
title: "Symbols in JavaScript and TypeScript"
---

`symbol` is a primitive data type in JavaScript and TypeScript, which, amongst other things,
can be used for object properties. Compared to `number` and `string`, `symbol`s have some unique
features that make them stand out.

## Symbols in JavaScript

Symbols can be created using the `Symbol()`  factory function:

```javascript
const TITLE = Symbol('title')
```

`Symbol` has no constructor function. The parameter is an optional description. By calling the
factory function, `TITLE` is assigned the unique value of this freshly created symbol. This 
symbol is now unique, distinguishable from all other symbols and doesn't clash with any other
symbols that have the same description.

```javascript
const ACADEMIC_TITLE = Symbol('title')
const ARTICLE_TITLE = Symbol('title')

if(ACADEMIC_TITLE === ARTICLE_TITLE) {
  // THis is never true
}
```

The description helps you to get info on the Symbol during development time:

```javascript
console.log(ACADEMIC_TITLE.description) // title
console.log(ACADEMIC_TITLE.toString()) // Symbol(title)
```

Symbols are great if you want to have comparable values that are exclusive and unique. For
runtime switches or mode comparisons:

```javascript
// A shitty logging framework
const LEVEL_INFO = Symbol('INFO')
const LEVEL_DEBUG = Symbol('DEBUG')
const LEVEL_WARN = Symbol('WARN')
const LEVEL_ERROR = Symbol('ERROR')

function log(msg, level) {
  switch(level) {
    case LEVEL_WARN: 
      console.warn(msg); break
    case LEVEL_ERROR: 
      console.error(msg); break;
    case LEVEL_DEBUG: 
      console.log(msg); 
      debugger; break;
    case LEVEL_INFO:
      console.log(msg);
  }
}
```

Symbols also work as property keys, but are not iterable, which is great for serialisation

```javascript
const print = Symbol('print')

const user = {
  name: 'Stefan',
  age: 37,
  [print]: function() {
    console.log(`${this.name} is ${this.age} years old`)
  }
}

JSON.stringify(user) // { name: 'Stefan', age: 37 }
user[print]() // Stefan is 37 years old
```

## Global symbols registry

There's a global symbols registry that allows you to access tokens across your whole
application.

```javascript
Symbol.for('print') // creates a global symbol

const user = {
  name: 'Stefan',
  age: 37,
  // uses the global symbol
  [Symbol.for('print')]: function() {
    console.log(`${this.name} is ${this.age} years old`)
  }
}
```

First call to `Symbol.for` creates a symbol, second call uses the same symbol.
If you store the symbol value in a variable and want to know the key, you can use `Symbol.keyFor()`

```javascript
const usedSymbolKeys = []

function extendObject(obj, symbol, value) {
  //Oh, what symbol is this?
  const key = Symbol.keyFor(symbol)
  //Alright, let's better store this
  if(!usedSymbolKeys.includes(key)) {
    usedSymbolKeys.push(key)
  }
  obj[symnbol] = value
}

// now it's time to retreive them all
function printAllValues(obj) {
  usedSymbolKeys.forEach(key => {
    console.log(obj[Symbol.for(key)])
  })
}
```

Nifty!

## Symbols in TypeScript

TypeScript has full support for symbols, and they are prime citizens in the type system.
`symbol` itself is a data type annotation for all possible symbols. See the `extendObject`
function from earlier on. To allow for all symbols to extend our object, we can use the
`symbol` type:

```javascript
const sym = Symbol('foo')

function extendObject(obj: any, sym: symbol, value: any) {
  obj[sym] = value
}

extendObject({}, sym, 42) // Works with all symbols
```

There's also the sub-type `unique symbol`. A `unique symbol` is closely tied to the 
declaration, only allowed in const declarations and references this exact symbol, and nothing else.

You can think of a nominal type in TypeScript for a very nominal value in JavaScript.

To get to the type of `unique symbol`s, you need to use the typeof operator.

```javascript
const PROD: unique symbol = Symbol('Production mode')
const DEV: unique symbol = Symbol('Development mode')

function showWarning(msg: string, mode: typeof DEV | typeof PROD) {
 // ...
}
```

At time of writing, the only possible nominal type in TypeScript's structural type system.

Symbols stand at the intersection between nominal and opaque types in TypeScript and JavaScript.
And are the closest things we get to nominal type checks at runtime. A good way to recreate constructs
like `enum`s for example.

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

Very interesting if you do comparisons:

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

There are a few TypeScript annotations we want to add:

1. We declare all symbol keys (and values) as `unique symbols`, meaning
   the constant we assign our symbols to can never be changed. 
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
the exact value type (e.g. type is `COLOR_RED`) instead of their overarching type (`symbol`).

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
      // what? What is this??? TypeScript errors 💥
      break;
  }
}
```

You can get rid of the helper and const context, if you use symbol keys and values 
instead of only symbol values:

```javascript
const ColorEnum = {
  [COLOR_RED]: COLOR_RED,
  [COLOR_YELLOW]: COLOR_YELLOW,
  [COLOR_ORANGE]: COLOR_ORANGE,
  [COLOR_GREEN]: COLOR_GREEN,
  [COLOR_BLUE]: COLOR_BLUE,
  [COLOR_INDIGO]: COLOR_INDIGO,
  [COLOR_VIOLET]: COLOR_VIOLET,
}

function getHexValueWithSymbolKeys(color: keyof typeof ColorEnum) {
  switch(color) {
    case ColorEnum[COLOR_BLUE]:
      // 👍
      break;
    case COLOR_RED:
      // 👍
      break;
    case COLOR_BLACK: 
      // 💥
      break;
  }
}
```

This gives you both type safety at compile time through TypeScript `unique symbol`s,
and actual type safety at runtime with the unique characteristics of JavaScript's
`Symbol`s.

And, als always: [A playground](https://www.typescriptlang.org/play/index.html#code/LAKFGMHsDsGcBcAEBhA8gGVQJQPpYKIAiAXIgK7QCWAjmQKaKwCeAtgEaQA2iAvIgMqsOnABQByNJlwFCYgJQQYCFBmw5sAQQByAcXykKNeoyFdeA06Imrcm3fnmK4SSWoCa+dJgDqBqrQZmdjM+QWCrV1wPL1RvRxAoZxUpHB0CfC0-I0DLczDhcUjU9K14xOUigCF0AFV9cn9jIOE8y0KbHGq6sqUXDoBJLUJ+nVQsgJNw1vD2lMHh0Z6kooA1fox8ABVxptzQtusUtY3NpYqO6o1kAGkdnKn9mcO1S5v4pwquSAAnWHMAb1AiGSahkABogSDbFhtHoISBgUVoj54YiOml8BlUVDOrV8NiivMRqgCR1jugtqAAL6IACGf3K8AA3KBQPAmAAHBgrWmceiwbyUeAAC2udCYsAAPJswYhrog6AAPeB0aAAEz+AGtxZAAGaITYAPnMmwA2tcALoskDsrmIHl8uhSo3mB38wUisUS6Wy7VMPUGw2skC6ijgeCUGCIADmdHgAAklW66CIoJwfqRk1LbXQA8gvr9DXJEICEYwAO5C8DC1MF4ul4HA8D0hj59O-AB0VTxxEhjcQAHoB33G2xvnRaZrrf3m7BWxd0FdbogR8Ch6vEGOJ1PIVTqcHYwmk7z6CI2z9YF2F3UFGAEr1EABZVCoQg4eMaAAKn7cd0mLUeAoxA-b83DOJBn1fXE6j-ZoQgsJ4ugcW9QCHRANE4bg0wvBVFXAOgOSQSpOFpcBNQ+CDIEgDUAUhSC3xAn9sXo6D8GpOkGV6a1QEoXUREfKiNQ7FikN4Hg+HPTtuxvEtIX3O9GRQAt8GgMgWFostTSKGQLVIbSiGxLSOmRWJdJxEzvEMoo7D0MzrJhewrPREo7OczEtCclIkNcry8U8tQiVGHyAqGYl-NwcktmCiL1gpGV5NAUNoHDSNoBjONE0VZMPWFfIuC9WBa3bUg-QDHM82U1SWHrSFYEreBqyKn4arLJsWyU9sVLUozfLqXSN3XVrR3HSdp0bWd5xSGReyGtdh1mzcRp3IaJpxV5lwG+b+2BLdRt3akgA) for you to fiddle around.


 //include helper/include-by-tag.html tag="TypeScript" title="More articles about TypeScript"
