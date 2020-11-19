---
title: "Tidy TypeScript: Prefer union types over enums"
categories:
  - TypeScript
  - JavaScript
  - Tidy Typescript
---

This is the first of a series of articles where I want to highlight ways on how to keep your TypeScript code neat and tidy. This series is heavily opinionated, so don't be angry if I ditch a feature that you learned to like. It's not personal.

Today we look at enums. Enums are a feature that I see used a lot by people who come from languages like Java or C# because they have been so prominent there. Enums are also a feature from "the old days" of TypeScript where the JavaScript landscape was a lot different than it is now. And you can see that, as enums work exceptionally different than any other type in TypeScript.

## Enums emit code

My most prefered way of writing TypeScript is to 

- write regular, modern-day JavaScript.
- add types wherever we can strengthen TypeScript's understanding of our code.

This means after a compile step, you end up with the same code as before without the extra type defintions.

Enums, like classes, create both a type and a value. Meaning that e.g. this declaration:

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

## Numeric enums are not type-safe

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

## String enums are named types

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

## Prefer union types

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

## Further reading

- [Rob Palmer from Bloomberg](https://www.techatbloomberg.com/blog/10-insights-adopting-typescript-at-scale/) wrote a great piece on how to adopt TypeScript at scale. The first point already nails it: TypeScript can be JavaScript plus types, so stay standards-compliant. Recommended read.
- [I created a Symbol-based alternative to enums](https://fettblog.eu/symbols-in-javascript-and-typescript/). I still think for most use cases string union types are the way to go, but this is something worth exploring.
- [The isolated module flag prohibits the use of const enums](https://www.typescriptlang.org/tsconfig#isolatedModules). This flag is on if you compile your stuff with Babel and use TypeScript just as a type checker. Important to know!
