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

## Avoid namespaces

## Avoid static classes

## Prefer unknown over any

## Prefer types over interfaces

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

The reason is that there is a use-case of implementing bitmasks with numeric enums. And people seem to actually do that! Do a quick search for "TypeScript enum bitmask" or "bitwise flags" and see lots of implementations and examples. Enums provide syntacic sugar for this scenario. I'd argue that why this scenario is valid to implement in JavaScript, I'd doubt it's the most common scenario you would use enums for. Usually, you want to make sure you only can pass values that are actually valid.

A `const` object might just give you the desired behaviour and is *much* closer to JavaScript:

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
declare function move(direction: Values<typeof Direction>): void;

move(30);
//   ^ 💥 This breaks!

move(0);
//   ^ 👍 This works!

move(Direction.Left);
//   ^ 👍 This also works!
```

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
//               ^ 💥 This is not allowed!
```

This is something you can leverage, but it's also very different to how number enums *and* the entire rest of TypeScript's type system work. A simple union type gives you something that works similar and is much more aligned with TypeScript.

```typescript
type Status = "Admin" | "User" | "Moderator"

declare function closeThread(threadId: number, status: Status): void;

closeThread(10, "Admin");
// All good 😄
```

You get all the benefits from enums like proper tooling and type-safety without going the extra round, and risking to output code that you don't want. It also becomes clearer what you need to pass, and where to get the value from. No need to manually map back-end strings to an enum just for the sake of it.

If you want to write your code enum-style, with an object and a named identifier, you can use the same method as in the example before where we used a simple `const` object and a `Values` helper type:

```typescript
const Status = {
  Admin: "Admin",
  User: "User",
  Moderator: "Moderator"
} as const;

declare function closeThread(threadId: number, status: Values<typeof Status>): void;

closeThread(10, "Admin"); // All good!
closeThread(10, Status.User); // enum style
```

There are also no surprises.
- You *know* what code you end up with in the output.
- You don't end up with changed behaviour because somebody decides to go from a string enum to a numeric enums.
- You have type-safety where you need it. 
- And you give your colleagues and users the same conveniences that you get with enums.

Of course, you can learn and remember all the peculiarities of enums and know quite well how to handle them. But why bother if there is a much clearer and easier way to achieve the same -- if not better -- type safety entirely in the type system? That's why I suggest to **prefer union types over enums**.
