---
title: "TypeScript: Variadic Tuple Types Preview"
categories:
- TypeScript
---

TypeScript 4.0 is supposed to be released in August 2020, and one of the biggest changes in this release will be *variadic tuple types*. And even though his feature is hot of the press at the time of this writing, it's worth checking out and see what we can do with it. Note that stuff here might be subject to change, so be cautious! I will try to keep this page up to date until 4.0 is in RC or released.

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

We had something similar already with rest elements in functions (more on that later), but the *big* difference is that variadic tuple types can happen anywhere in the tuple and multiple times.

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

This is also known as *rest* elements, something that we have in JavaScript and that allows you to define functions with an almost limitless argument list, where the last element, the *rest* element sucks all excess arguments in.

We can use this, e.g. for this generic tuple function takes an argument list of any type and creates a tuple out of it:

```typescript
function tuple<T extends any[]>(...args: T): T {
    return args;
}

const numbers: number[] = getArrayOfNumbers();
const t1 = tuple("foo", 1, true);  // [string, number, boolean]
const t2 = tuple("bar", ...numbers);  // [string, ...number[]]
```

The thing is, *rest* elements always have to be last. In JavaScript, it's not possible to define an almost endless argument list just somewhere in between.

With *variadic tuple types* however, we can do this! For example, this is a function type where the argument list at the beginning is not defined, but the last element *has* to be a function:

```typescript
type HasCallback<T extends unknown[]> =
  (...t: [...T, (...args: any[]) => any]) => void;

declare const foo: HasCallback<[string]>

foo('hello', function() {}) // 👍
foo('hello') // 💥 breaks

declare const bar: HasCallback<[string, number]>

bar('hello', 2, function() {}) // 👍
bar('hello', function() {}) // 💥 breaks
bar('hello', 2) // 💥 breaks
```

This is now with an explicit type annotation, but as always with generics, we can also infer them by usage 😎 Which brings me to a solution for an interesting problem.

## Typing promisify

Functions that take a callback at the end are common in async programming. In Node.js you encounter this pattern all the time. The argument list *before* the callback varies based on the purpose of the function. 

Here are a couple of fictional examples:

```typescript
// loads a file, you can set the encoding
// the callback gets the contents of the file
declare function load(
  file: string,
  encoding: string,
  callback: (result: string) => void): void

// Calls a user defined function based on 
// an event. The event can be one of 4 messages
type Messages = 'open' | 'write' | 'end' | 'error'
declare function on(
  msg: Messages,
  callback: (msg: { type: Messages, content: string}) => void
): void
```

When you program async, you might want to use promises. There is a nice function to *promisify* callback-based functions. They take the same argument list as the callback-based function, but instead of taking a callback, they return a Promise with the result.

We can type this using variadic tuple types.

First, we design a type that infers all arguments except for the last one.

```typescript
type InferArguments<T> =
  T extends (... t: [...infer Arg, (...args: any) => any]) => any ? 
    Arg : never
```

It reads that T is a function that has rest elements where the tuple consists of
- Any variadic tuple `Arg` that we infer
- A callback function with any arguments

We return `Arg`.

We also want to infer the result from the callback function. Similar type, slightly modified:

```typescript
type InferCallbackResults<T> = 
  T extends (... t: [...infer Arg, (res: infer Res) => any]) => any ? 
    Res : never
```

The `promisify` function takes any function that matches the shape of *arguments* + *callback*. It returns a function that has the same argument list except for the callback. This function then returns a promise with the results of the callback. 😅

```typescript
declare function promisify<
  // Fun is the function we want to promisify
  Fun extends (...arg: any[]) => any 
>(f: Fun): 
  // we return a function with the same argument list
  // except the callback
  (...args: InferArguments<Fun>) 
    // this function in return returns a promise
    // with the same results as the callback
    => Promise<InferCallbackResults<Fun>>
```

This declaration is already pretty fine, the implementation of the function body checks without type casts, which means that the types are really sound:

```typescript
function promisify<
  Fun extends (...args: any[]) => any
>(f: Fun): (...args: InferArguments<Fun>) => Promise<InferCallbackResults<Fun>> {
  return function(...args: InferArguments<Fun>) {
    return new Promise((resolve) => {
      function callback(result: InferCallbackResults<Fun>) {
        resolve(result)
      }
      args.push(callback);
      f.call(null, ...args)
    })
  }
}
```

In action:

```typescript
const loadPromise = promisify(load)

loadPromise('./text.md', 'utf-8').then(res => {
  // res is string! 👍
})


const onPromise = promisify(on)

onPromise('open').then(res => {
  console.log(res.content) // content and type infered 👍
})
```

The nicest part of all this is that we retain the argument names. When we call the `loadPromise`, we still know that the arguments are `file` and `encoding`. ❤️

## Further reading

- Check out [the Playground](https://www.typescriptlang.org/play/index.html?ts=4.0.0-pr-39094-7&ssl=45&ssc=1&pln=26&pc=1#code/C4TwDgpgBAkgdgMwgJwILIOYFcC2E7ADOAPACoB8UAvAFBRSlQQAew+AJoVABQB0-UYAC4oAbX68AlohRQASgBoeEgIaZCIlXBABKapS0gAunqoHtUAPzyoIuBABuKGjVCRYM5HIiEsAGyIySiooOgYmVg4uPgFhMQlpJGQGJW5kHxFE2TlTc2NcqEMrGztHZxoELDgAY2BJAHs4KDBkepxJQkkEEGIwgDEqiLY4TmV+NQwNQu1RE31pkBpybgQRAbgdERjeCan4JPRsPAISdfICgAVW9sIIYn2Ub18A06rySgBvMPTgLGQmyo1OqNba7EQPNCYXD4QJnPRfej0H5-Jr2ADuUCubQ6EG4aR89T8TgKCMR9EBtQaTWqKj8fgARipqgBrfHPOIQp7+WFveFhMlIglE3Hpdk6fmIgC+Evou14YCwhAAFtwaXTGSydABuGVQBC8NV+bhwfx+JSqdTismSq1QaXSmjsCDVPxqaAU4FNPz1FTsbhhBCSPwQESEYDIaQYBRhfDVersSOh8OR6P0Q0a5lbUXcpMRuAYAoOeqSdibKBFksuONwMNQb2+rE3aAhFrYzrdbj10suLuNnHcADkvAA9GxWLwcOwB0oB1hgAgALQADgHOl4wCV+DZ81Jw+HUFFUA6UDDeYwAEIaDaXG5oABZHyEFQYHzUKAD+qQOADqAAH3faIRmwP7-gOHAge+KCtMgA6Os6rrpHqVSUo0UAgmEOCEBgIgPoQT4voQqZQOmTKZjwmHYVAHyCOAIZQLh+E+Eo1bDHEp6RnahbFuwNBlhWPE0NWtaNH2txvq2NxdCA3CNOKNAidc-Yfl+q7rpucDbmYVFhEJhIQLw3oYGyBqNKxeh7lAgC8G4AsjtXnJNBAA) of the *promisify* function
- Read the entirety of Anders' [Pull Request](https://github.com/microsoft/TypeScript/pull/39094). Highly recommended.

Keep an eye on this blog! 😉

