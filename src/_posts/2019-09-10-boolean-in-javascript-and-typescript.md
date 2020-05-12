---
layout: post
categories:
  - TypeScript
  - JavaScript
published: true
permalink: /boolean-in-javascript-and-typescript/
title: "Boolean in JavaScript and TypeScript"
---

`boolean` is a fun primitive data type in JavaScript. In TypeScript, it allows for a total of four values
Wait, four?

## Boolean in JavaScript

`boolean` can take the values of `true` and `false`. Values from other types can be truthy or falsy, 
like `undefined` or `null`.

```typescript
let b = true
if(b) console.log('logged')

b = false
if(b) console.log('not logged')

b = undefined
if(b) console.log('not logged')

b = null
if(b) console.log('not logged')
```

Values other than `undefined`, `null` or `false` considered falsy are `""` (empty string), `-0` and `0`, as well as `NaN`.

To get the boolean value of any value, you can use the `Boolean` function:

```typescript
Boolean(false) // false
Boolean(true) // true
Boolean("false") // true ❗️
Boolean("Hey folks") // true
Boolean({}) // true
Boolean([]) // true
Boolean(123.4) // true
Boolean(Symbol()) // true
Boolean(function() {}) // true
Boolean(undefined) // false
Boolean(null) // false
Boolean(NaN) // false
Boolean(0) // false
Boolean("") // false
```

Rule of thumb: All empty values evaluate to `false`. Empty object `{}` and 
empty array `[]` (which is an object itself) do have value as they are containers
for other values.

The `Boolean` function is really good to filter empty values from collections:

```typescript
const collection = [
  { name: 'Stefan Baumgartner', age: 37 },
  undefined,
  { name: 'D.', age: 36 },
  false
  { name: 'C.', age: 2},
  false
]

collection.filter(Boolean) // handy!
```

Together with `Number` -- which converts all values into their `number` counterpart or `NaN`, this
is a really cool way of getting to actual values quickly:

```typescript
const x = ["1.23", 2137123, "wut", false, "lol", undefined, null]
  .map(Number)
  .filter(Boolean) // [1.23, 2137123] 👍
```

`Boolean` exists as a constructor and has the same conversion rules as the `Boolean` function.
However, with `new Boolean(...)` you create a wrapping object, making value comparisions truthy, 
but reference comparisions falsy:

```typescript
const value = Boolean("Stefan") // true
const reference = new Boolean("Stefan") // [Boolean: true]

value == reference // true
value === reference // false
```

You get to the value via `.valueOf()`:

```typescript
value === reference.valueOf() // true
```

I have a [REPL](https://repl.it/repls/ShamelessDelectableLint) for you to check.
The use of `Boolean` as a function is obviously great, but `new Boolean` has very limited use.
If you know a practical use case, please [let me know](https://twitter.com/ddprrt).

## Boolean in TypeScript

`boolean` in TypeScript is a primitive type. Be sure to use the lower case version and don't
refer to object instances from `Boolean`

```typescript
const boolLiteral: boolean = false // 👍
const boolObject: Boolean = false // 👎
```

It works, but it's bad practice as we really rarely need `new Boolean` objects.

You can assign `true`, `false` and `undefined` and `null` to `boolean` in TypeScript 
without strict null checks.

```typescript
const boolTrue: boolean = true // 👍
const boolFalse: boolean = false // 👍
const boolUndefined: boolean = undefined // 👍
const boolNull: boolean = null // 👍
```

With that, `boolean` is the only one we can express fully through union types:

```typescript
type MyBoolean = true | false | null | undefined // same as boolean

const mybool: MyBoolean = true
const yourbool: boolean = false
```

When we enable the `strictNullChecks` compiler flag, the set of values reduces to `true` and `false`.

```typescript
const boolTrue: boolean = true // 👍
const boolFalse: boolean = false // 👍
const boolUndefined: boolean = undefined // 💥
const boolNull: boolean = null // 💥
```

So our set reduces to two values in total.

```typescript
type MyStrictBoolean = true | false
```

We can also get rid of null values with the NonNullable helper type:

```typescript
type NonNullable<T> = T extends null | undefined
  ? never
  : T;

type MyStrictBoolean = NonNullable<MyBoolean> // true | false
```

The fact that `boolean` consists of a limited set of values only used in conditions,
allows for interesting conditional types.

Think of an mutation in a datastore through a function. You set a flag in a function that
updates e.g. the user id. You have to provide the user ID then:

```typescript
type CheckUserId<Properties, AddUserId> = 
    AddUserId extends true 
    ? Properties & { userId: string }
    : Properties & { userId?: string }
```

Depending on the value of our generic `AddUserId`, we expect the property `userId` to be set or to be
optional.

We can make this type more explicit by extending our generics from the types we expect

```diff
- type CheckUserId<Properties, AddUserId> = 
+ type CheckuserId<
+  Properties extends {},
+  AddUserId extends boolean
+ >
     AddUserId extends true 
     ? Properties & { userId: string }
     : Properties & { userId?: string }
```

In use, it might declare a function like this:

```typescript
declare function mutate<P, A extends boolean = false>
  (props: CheckUserId<P, A>, addUserId?: A): void
```

Note that I even set a default value for `A` to make sure `CheckUserId` gives the correct
info depending on `addUserId` to be set or not.

The function in action:

```typescript
mutate({}) // 👍
mutate({ data: 'Hello folks' }) // 👍
mutate({ name: 'Stefan' }, false) // 👍
mutate({ name: 'Stefan' }, true) // 💥 userId is missing
mutate({ name: 'Stefan', userId: 'asdf' }, true) // 👍 userId is here
```

Handy if your code relies a lot on truthy and falsy values.
As always, there's [playground](https://www.typescriptlang.org/play/index.html#code/C4TwDgpgBAwgFhAxgawKoGcICcCSATAHgAUsB7SLYASwnQBooBBPPDbfAPigF4oAoKIKYs2uPFAgAPYBAB2edFGBYArtAFCA-FBLls1WlABkUAN5QVmMQC4o6ZVVkBzKAF8Ng27ooHFJ85bseJq29liOLu58eEgANgCGWNAAZiqyiNSkslAAtirA8TIEHjpkPjSKUjLyiqauDCXMrFb4EtJyClAARqSksRDx2bzJ8bGYHAAUYGXotvBIaC2E3voVDE2inAzxIkshws1BAJS2AG6kVHh813kFMhN1R3y3hRAPUHiF8bYA5AASEFisVIUGSfWQ6B+bieL3u5lk8RyEF+AGUZCNZFD6qDRpgYflXu8EUjUejBliGMo1Pi7m94YjkVAfmiIBifgxAjYmfF0HhkhSlKoIEcgA) for you. 

 //include helper/include-by-tag.html tag="TypeScript" title="More articles about TypeScript"
