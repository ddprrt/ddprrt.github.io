---
title: "TypeScript: Variadic Tuple Types Preview"
categories:
- TypeScript
---

TypeScript 4.0 is supposed to be released in August 2020, and one of the biggest changes in this release will be *variadic tuple types*. And even tought his feature is hot of the press at time of this writing, it's worth to check out and see what we can do with it. Note that stuff here might be subject to change, so be cautious! I will try to keep this page up to date until 4.0 is in RC or released.

If you want to try it out yourself, you can load an early version of the branch into the [TypeScript playground](https://www.typescriptlang.org/play/index.html?ts=4.0.0-pr-39094-7).

## Variadic tuples

A tuple type in TypeScript is an array with the following features.

1. The length of the array is defined.
2. The type of each element is known (and does not have to be the same).

For example, this is a tuple type:

```typescript
type PersonProps = [string, number]

const [name, age]: PersonProps = ['Stefan', 37]
```

A *variadic* tuple type is a tuple type that has the same properties &mdash; defined length and the type of each element is known &mdash; but where the *exact shape* is yet to be defined.

An example straight out of the pull request

```typescript
type Foo<T extends unknown[]> = [string, ...T, number];

type T1 = Foo<[boolean]>;  // [string, boolean, number]
type T2 = Foo<[number, number]>;  // [string, number, number, number]
type T3 = Foo<[]>;  // [string, number]
```

We had something similar already with rest elements in functions (more on that later), but the *big* difference is that variadic tuple types can happen anywhere in the tuple, and multiple times.

```typescript
type Bar<
  T extends unknown[],
  U extends unknown[]
> = [...T, string, ...U];

type T4 = Bar<[boolean], [number]>;  // [boolean, string, number]
type T5 = Bar<[number, number], [boolean]>;  // [number, number, string, boolean]
type T6 = Bar<[]. []>;  // [string]
```

Cool already! But why do we care so much about it?

## Function arguments are tuples

Every function head can be described in a tuple type. For example:

```typescript
declare function hello(name: string, msg: string): void;
```

Is the same as:

```typescript
declare function hello(...args: [string, string]): void;
```

And we can be very flexible in defining it:

```typescript
declare function h(a: string, b: string, c: string): void
// equal to
declare function h(a: string, b: string, ...r: [string]): void
// equal to
declare function h(a: string, ...r: [string, string]): void
// equal to
declare function h(...r: [string, string, string]): void
```

This is also known as *rest* elements, something that we have in JavaScript and that allow you to define functions with a almost limitless argument list, where the last element, the *rest* element sucks all excess arguments in.

We can use this, e.g. for this generic tuple function takes an argument list of any type and creates a tuple out of it:

```typescript
function tuple<T extends any[]>(...args: T): T {
    return args;
}

const numbers: number[] = getArrayOfNumbers();
const t1 = tuple("foo", 1, true);  // [string, number, boolean]
const t2 = tuple("bar", ...numbers);  // [string, ...number[]]
```

The thing is, *rest* elements always have to be last. In JavaScript it's not possible to define an almost endless argument list just somewhere in between.

With *variadic tuple types* however, we can do this! For example, this is a function type where the argument list at the beginning is not defined, but the last element *has* to be a function:

```typescript
type HasCallback<T extends unknown[]> =
  (...t: [...T, (...args: any[]) => any]) => void;

declare const foo: HasCallback<[string]>
declare const bar: HasCallback<[string, number]>

foo('hello', function() {}) // 👍
foo('hello') // 💥 breaks

bar('hello', 2, function() {}) // 👍
bar('hello', function() {}) // 💥 breaks
bar('hello', 2) // 💥 breaks
```
