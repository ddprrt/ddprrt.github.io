---
title: Tidy TypeScript
categories:
  - TypeScript
  - JavaScript
---

## Table of contents

- [JavaScript first](#javascript-first)
- [Inference first](#inference-first)
- [Know when to check your contracts](#know-when-to-check-your-contracts)
- [Avoid typecasting](#avoid-typecasting)
- [Avoid namespaces](#avoid-namespaces)
- [Avoid static classes](#avoid-static-classes)
- [Prefer unknown over any](#prefer-unknown-over-any)
- [Prefer type aliases over interfaces](#prefer-type-aliases-over-interfaces)
  - [Declaration merging](#declaration-merging)
- [Prefer union types over enums](#prefer-union-types-over-enums)
  - [Enums emit code](#enums-emit-code)
  - [Numeric enums are not type-safe](#numeric-enums-are-not-type-safe)
  - [String enums are named types](#string-enums-are-named-types)
  - [Prefer union types](#prefer-union-types)

## JavaScript first

## Inference first

## Know when to check your contracts

## Avoid typecasting

## Avoid namespaces

## Avoid static classes

## Prefer unknown over any

## Prefer type aliases over interfaces

There are two different ways in TypeScript do declare object types: Interfaces and type aliases. Both approaches on defining object types have been subject to lots of blog articles over the years. And all of them became outdated as time progressed. Right now, there is little difference between type alisases and interfaces. And everything that *was* different  has been gradually aligned.

Syntactically, their difference is nuanced:

```typescript
type PersonAsType = {
  name: string;
  age: number;
  address: string[];
  greet(): string;
};

interface PersonAsInterface {
  name: string;
  age: number;
  address: string[];
  greet(): string;
}
```

It's the equal sign. This nuance can have some effect on the time of type evaluation -- immediate for the type alias, lazy for interfaces -- but that's it. You can use interfaces and type aliases for the same things, in the same scenarios: 

- In an `implements` declaration for classes
- As a type annotation for object literals
- For recursive type structures

You name it! There is however one *important* difference that can have side effects you usually don't want to deal with:

### Declaration merging

Interfaces allow for *declaration merging*, type aliases don't. Declaration merging allows for adding properties to an interface even after it has been declared.

```typescript
interface Person {
  name: string;
}

interface Person {
  age: number;
}

// Person is now { name: string; age: number; }
```

TypeScript itself uses this technique alot in `lib.d.ts` files, making it possible to just add deltas of new JavaScript APIs based on ECMAScript versions. This is a great feature if you want to extend e.g. `Window`, but it can fire back in other scenarios. Take this as an example:

```typescript
// Some data we collect in a web form
interface FormData {
  name: string;
  age: number;
  address: string[];
}

// A function that sends this data to a back-end
function send(data: FormData) {
  console.log(data.entries()) // this compiles!! 😱
  // but crashes horrendously in runtime 😕
}
```

Oh bother, where does the `entries()` method come from? It's a [DOM API](https://github.com/microsoft/TypeScript/blob/9c71eaf59040ae75343da8cdff01344020f5bba2/src/lib/dom.iterable.d.ts#L81)! `FormData` is one of the interfaces provided by browser APIs, and there are lot of them. They are globally available, and nothing keeps you from extending those interfaces. And you get no notification if you do. 

We can of course argue about proper naming, but the problem persists for all interfaces that you make available globally, maybe from some dependency where you don't even know they add an interface like that to the global space.

Changing this interface to a type alias immediately makes you aware of this problem:

```typescript
type FormData = {
//   ^ 💥 Duplicate identifier 'FormData'.(2300)
  name: string;
  age: number;
  address: string[];
}
```

It also prevents your types from being extended unknowingly. That's why I suggest to **prefer type aliases over interfaces**. Of course, if you are providing a library that has interfaces which should be extendable by others, interface are the way to go. But other than that, type aliases are clear, simple, and **tidy**.

## Prefer union types over enums

Enums are a feature that I see used a lot by people who come from languages like Java or C# because they have been so prominent there. Enums are also a feature from "the old days" of TypeScript where the JavaScript landscape was a lot different than it is now. And you can see that, as enums work exceptionally different than any other type in TypeScript.

### Enums emit code

Like classes, they create a type and a value. Meaning that e.g. this declaration:

```typescript
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
```

emits code in the JavaScript output.

```typescript
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
```

You can get rid of the output if you use a `const enum`, but way to often I've seen people using just regular enums all over and wondering why their output gets so big. Especially if you put "glue code" between front-end and back-end in enums you can end up with huge files and bundles.

Okay, that's one thing, and we can handle that by enforcing `const enum`s. But there is also this nasty ambiguity.

### Numeric enums are not type-safe

Yes, you've heard right. Regular numeric enums -- as in: an enum where you don't set string values -- are not type safe! If we look back at the `Direction` enum from earlier a function that takes a direction also takes *any* number value instead.

```typescript
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

declare function move(direction: Direction): void;

move(30);
// ☝️ This is totally ok! 😱
```

The reason is that there is a use-case of implementing bitmasks with numeric enums. And people seem to actually do that! Do a quick search for "TypeScript enum bitmask" or "bitwise flags" and see lots of implementations and examples. Enums provide syntacic sugar for this scenario. I'd argue that why this scenario is valid to implement in JavaScript, I'd doubt it's the most common scenario you would use enums for. 

Usually, you want to make sure you only can pass values that are actually valid.

So far for *numeric* enums. But there's always *string* enums, right? They are type-safe, aren't they? Yes. And they are peculiar!

### String enums are named types

In a world of structural typings, enums chose to be a *named* type. This means that even if values are *valid* and compatible, you can't pass them to a function or object where you expect a string enum. See this example:

```typescript
enum Status {
  Admin = "Admin",
  User = "User",
  Moderator = "Moderator",
}

declare function closeThread(threadId: number, status: Status): void;

closeThread(10, "Admin");
//              ^ 💥 This is not allowed!


closeThread(10, Status.Admin);
//              ^ You have to be explicit!
```

This is something you can leverage, but it's also very different to how number enums *and* the entire rest of TypeScript's type system work. 

### Prefer union types

A simple union type gives you something that works similar and is much more aligned with TypeScript.

```typescript
type Status = "Admin" | "User" | "Moderator"

declare function closeThread(threadId: number, status: Status): void;

closeThread(10, "Admin");
// All good 😄
```

You get all the benefits from enums like proper tooling and type-safety without going the extra round, and risking to output code that you don't want. It also becomes clearer what you need to pass, and where to get the value from. No need to manually map back-end strings to an enum just for the sake of it. Simple, clear, **tidy**!

If you want to write your code enum-style, with an object and a named identifier, a `const` object with a `Values` helper type might just give you the desired behaviour and is *much* closer to JavaScript:

```typescript
const Direction = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
} as const;

// Get to the const values of any object
type Values<T> = T[keyof T];

// Values<typeof Direction> yields 0 | 1 | 2 | 3
declare function move(
  direction: Values<typeof Direction>): void;

move(30);
//   ^ 💥 This breaks!

move(0);
//   ^ 👍 This works!

move(Direction.Left);
//   ^ 👍 This also works!

// And now for the Status enum

const Status = {
  Admin: "Admin",
  User: "User",
  Moderator: "Moderator"
} as const;

// Values<typeof Status> yields "Admin" | "User" | "Moderator"
declare function closeThread(
  threadId: number, 
  status: Values<typeof Status>): void;

closeThread(10, "Admin"); // All good!
closeThread(10, Status.User); // enum style
```

There are also no surprises.
- You *know* what code you end up with in the output.
- You don't end up with changed behaviour because somebody decides to go from a string enum to a numeric enums.
- You have type-safety where you need it. 
- And you give your colleagues and users the same conveniences that you get with enums.

But to be fair, a simple string union type does just what you need: Type-safety, auto-complete, predictable behavior.

Of course, you can learn and remember all the peculiarities of enums and know quite well how to handle them. But why bother if there is a much clearer and easier way to achieve the same -- if not better -- type safety entirely in the type system? That's why I suggest to **prefer union types over enums**.
