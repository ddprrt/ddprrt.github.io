---
title: "Tidy TypeScript: Prefer type aliases over interfaces"
categories:
  - Tidy Typescript
  - TypeScript
  - JavaScript
---

This is the second article in a [series of articles](/archive/tidy-typescript/) where I want to highlight ways on how to keep your TypeScript code neat and tidy. By nature, this series is heavily opinionated and is to be taken with grains of salt (that's plural).

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
