---
title: Tidy TypeScript
categories:
  - TypeScript
  - JavaScript
---


## JavaScript first

## Inference first

## Know when to check your contracts

## Avoid typecasting

## Avoid traditional OOP patterns

### Avoid static classes

One thing I see a lot from people who worked a lot with Java is their urge to wrap everything inside a class. In Java, you don't have any other options as classes are the only way to structure code. In JavaScript (and thus: TypeScript) there are plenty of other possibilities that do what you want without any extra steps. One of those things is static classes or classes with static methods, a true Java pattern.

```typescript
// Environment.ts

export default class Environment {
  private static variableList: string[] = []
  static variables(): string[] { /* ... */ }
  static setVariable(key: string, value: any): void  { /* ... */ }
  static getValue(key: string): unknown  { /* ... */ }
}

// Usage in another file
import * as Environment from "./Environment";

console.log(Environment.variables());
```

While this works and is even -- sans type annotations -- valid JavaScript, it's way too much ceremony for something that can easily be just plain, boring functions:

```typescript
// Environment.ts
const variableList: string = []

export function variables(): string[] { /* ... */ }
export function setVariable(key: string, value: any): void  { /* ... */ }
export function getValue(key: string): unknown  { /* ... */ }

// Usage in another file
import * as Environment from "./Environment";

console.log(Environment.variables());
```

The interface for your users is exactly the same. You can access module scope variables just the way you would access static properties in a class, but you have them module-scoped automatically. You decide what to export and what to make visible, not some TypeScript field modifiers. Also, you don't end up creating an `Environment` instance that doesn't do anything.

Even the implementation becomes easier. Check out the class version of `variables()`:

```typescript
export default class Environment {
  private static variableList: string[] = []
  static variables(): string[] { 
    return this.variableList;
   }
}
```

As opposed to the module version:

```typescript
const variableList: string = []

export function variables(): string[] {
  return variableList;
}
```

No `this` means less to think about. As an added benefit, your bundlers have an easier time doing tree-shaking, so you end up only with the things you actually use:

```typescript
// Only the variables function and variablesList 
// end up in the bundle
import { variables } from "./Environment";

console.log(variables());
```

That's why a proper module is always preferred to a class with static fields and methods. That's just added boilerplate with no extra benefit.

### Avoid namespaces

As with static classes, I see people with a Java or C# background clinging on to namespaces. Namespaces are a feature that TypeScript introduced to organize code long before ECMAScript modules were standardized. They allowed you to split things across files, merging them again with reference markers.

```typescript
// file users/models.ts
namespace Users {
  export interface Person {
    name: string;
    age: number;
  }
}

// file users/controller.ts

/// <reference path="./models.ts" />
namespace Users {
  export function updateUser(p: Person) {
    // do the rest
  }
}
```

Back then, TypeScript even had a bundling feature. It should still work to this day. But as said, this was before ECMAScript introduced modules. Now with modules, we have a way to organize and structure code that is compatible with the rest of the JavaScript ecosystem. So that's a plus. 

So what do we need namespaces for?

### Extending declarations

Namespaces are still valid if you want to extend definitions from a third party dependency, e.g. that lives inside node modules. Some of my articles use that heavily. For example if you want to extend the global `JSX` namespace and make sure `img` elements feature alt texts:

```typescript
declare namespace JSX {
  interface IntrinsicElements {
    "img": HTMLAttributes & {
      alt: string,
      src: string,
      loading?: 'lazy' | 'eager' | 'auto';
    }
  }
}
```

Or if you want to write elaborate type definitions in ambient modules. But other than that? There is not much use for it anymore. 

### Needless namespaces

Namespaces wrap your definitions into an Object. Writing something like this:

```typescript
export namespace Users {
  type User = {
    name: string;
    age: number;
  }

  export function createUser(name: string, age: number): User {
    return { name, age }
  }
}
```

emits something very elaborate:

```typescript
export var Users;
(function (Users) {
    function createUser(name, age) {
        return {
            name, age
        };
    }
    Users.createUser = createUser;
})(Users || (Users = {}));
```

This not only adds cruft, but also keeps your bundlers from tree-shaking properly! Also using them becomes a bit more wordy:

```typescript
import * as Users from "./users";

Users.Users.createUser("Stefan", "39");
```

Dropping them makes things a lot easier. Stick to what JavaScript offers you. Not using namespaces outside of declaration files makes your code clear, simple, and tidy.

### Avoid abstract classes



## Prefer unknown over any

`any` is the happy-go-lucky type. Once you annotate an argument, variable, or field with that, literally *anything* is allowed. The TypeScript compiler takes a step back and lets you take the driver's seat. You are in charge of making your code work.

```typescript
function shout(msg: any) {
  // This might work, it might not work
  // Who knows? You do!
  // TypeScript is fine with that 😎
  return msg.toUpperCase()
}
```

This is a big foot gun, as you intentionally disable type-checking. And usually, this happens at places where the types are more complex than `number` or `string`. A better way is to use `unknown`, `any`'s type-safe counterpart. Anything is assignable to `unknown`, but `unknown` isn't assignable to anything except itself and `any` without doing proper type checks before.

```typescript
function shout(msg: unknown) {
  if(typeof msg === "string") {
    // If it's a string, call toUpperCase()
    return msg.toUpperCase();
  }
  return "I can only shout if you pass a string!";
}
```

That's better! We deliberately say that what we pass can be anything, and inside we **have to make sure** that we do proper type checks. That's why I suggest you **prefer unknown over any**.

### no implicit any

I have to note that `any` gets a much more bad reputation than it deserves. I'm a fan of `any`, as it allows me not to think about types when I don't necessarily have to. This can be quite liberating, especially when you prototype. Here's the `any` version of a function that calls something from a deeply nested object:

```typescript
function display(chartData: any) {
  // Deeply nested. Objects! Functions! Everything!
  chartData.rows.print();
}
```

Proper type checks are for this construct are ... long!

```typescript
// A helper type for proper type guards
function hasOwnProperty<T extends object, K extends string>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> {
  return obj.hasOwnProperty(prop);
}

function display(chartData: unknown) {
  if (
    // chartData exists and is an object
    chartData && typeof chartData === "object" &&
    // chartData has a property called  rows
    hasOwnProperty(chartData, "rows") &&
    // chartData.rows is not null and an object
    chartData.rows && typeof chartData.rows === "object" &&
    // chartData.rows has a property called print
    hasOwnProperty(chartData.rows, "print") &&
    // chartData.rows.print is not null and a function
    chartData.rows.print && typeof chartData.rows.print === "function"
  ) {
    chartData.rows.print();
  }
}
```

And we still don't know if we pass the correct arguments to `print()`. `any` is good and has it's use-cases. However, `any` can fire back in the long run. And you want to be prepared for that. Switching on the `noImplicitAny` flag in your `tsconfig.json` helps, as it requires you to explicitly state your use of `any`. 

```typescript
// `noImplicitAny` switched on

function display(chartData) {
//               ^💥  Parameter 'chartData'
//                    implicitly has an 'any' type.(7006)

  // The rest of the function
}

// Better 👍

function display(chartData: any) {
//               ^ This helps you track down your 
//                 missing types once you know how
//                 your data should look like

  // The rest of the function
}

```

This should help you track down potential holes in your type definitions.

## Prefer type aliases over interfaces

There are two different ways in TypeScript to declare object types: Interfaces and type aliases. Both approaches to defining object types have been subject to lots of blog articles over the years. And all of them became outdated as time progressed. Right now, there is little difference between type aliases and interfaces. And everything that *was* different has been gradually aligned.

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

It's an equal sign. This nuance can have some effect on the time of type evaluation -- immediate for the type alias, lazy for interfaces -- but that's it. You can use interfaces and type aliases for the same things, in the same scenarios: 

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

TypeScript itself uses this technique a lot in `lib.d.ts` files, making it possible to just add deltas of new JavaScript APIs based on ECMAScript versions. This is a great feature if you want to extend e.g. `Window`, but it can fire back in other scenarios. Take this as an example:

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

Oh, bother, where does the `entries()` method come from? It's a [DOM API](https://github.com/microsoft/TypeScript/blob/9c71eaf59040ae75343da8cdff01344020f5bba2/src/lib/dom.iterable.d.ts#L81)! `FormData` is one of the interfaces provided by browser APIs, and there are a lot of them. They are globally available, and nothing keeps you from extending those interfaces. And you get no notification if you do. 

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

It also prevents your types from being extended unknowingly. That's why I suggest to **prefer type aliases over interfaces**. Of course, if you are providing a library that has interfaces that should be extendable by others, type aliases won't get you far. But other than that, type aliases are clear, simple, and **tidy**.

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

You can get rid of the output if you use a `const enum`, but too often I've seen people using just regular enums everywhere and wondering why their output gets so big. Especially if you put "glue code" between front-end and back-end in enums you can end up with huge files and bundles.

Okay, that's one thing, and we can handle that by enforcing `const enum`s. But there is also this nasty ambiguity.

### Numeric enums are not type-safe

Yes, you've heard right. Regular numeric enums -- as in an enum where you don't set string values -- are not type-safe! If we look back at the `Direction` enum from earlier a function that takes a direction also takes *any* number value instead.

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

The reason is that there is a use-case of implementing bitmasks with numeric enums. And people seem to actually do that! Do a quick search for "TypeScript enum bitmask" or "bitwise flags" and see lots of implementations and examples. Enums provide syntactic sugar for this scenario. I'd argue that why this scenario is valid to implement in JavaScript, I'd doubt it's the most common scenario you would use enums for. 

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

This is something you can leverage, but it's also very different from how number enums *and* the entire rest of TypeScript's type system work. 

### Prefer union types

A simple union type gives you something that works similarly and is much more aligned with TypeScript.

```typescript
type Status = "Admin" | "User" | "Moderator"

declare function closeThread(threadId: number, status: Status): void;

closeThread(10, "Admin");
// All good 😄
```

You get all the benefits from enums like proper tooling and type-safety without going the extra round and risking to output code that you don't want. It also becomes clearer what you need to pass, and where to get the value from. No need to manually map back-end strings to an enum just for the sake of it. Simple, clear, **tidy**!

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
- You *know* what code you end up within the output.
- You don't end up with changed behavior because somebody decides to go from a string enum to a numeric enum.
- You have type-safety where you need it. 
- And you give your colleagues and users the same conveniences that you get with enums.

But to be fair, a simple string union type does just what you need: Type-safety, auto-complete, predictable behavior.

Of course, you can learn and remember all the peculiarities of enums and know quite well how to handle them. But why bother if there is a much clearer and easier way to achieve the same -- if not better -- type safety entirely in the type system? That's why I suggest to **prefer union types over enums**.
