---
title: "TypeScript: Low maintenance types"
categories:
- TypeScript
---

I write a lot about TypeScript and I enjoy the benefits it gives me in my daily work a lot. But I have a confession to make, I don't really like writing types or type annotations. I'm really happy that TypeScript can infer so much out of my usage when writing regular JavaScript so I'm not bothered writing anything extra.

That's how I write TypeScript in general: I write regular JavaScript, and where TypeScript needs extra information, I happily add some extra annotations. One condition: I don't want to be bothered maintaining types. I rather create types that can update themselves if their dependencies or surroundings change. I call this approach *creating low maintenance types*.

## Scenario 1: Information is already available

Let's take a look at this brief and possibly uncomplete copy function. I want to copy files from one directory to another. To make my life easier, I created a set of default options so I don't have to repeat myself too much:

```typescript
const defaultOptions = {
  from: "./src",
  to: "./dest",
};

function copy(options) {
  // Let's merge default options and options
  const allOptions = { ...defaultOptions, ...options};

  // todo: Implementation of the rest
}
```

That's a pattern you might see a lot in JavaScript. What you see immediately is that TypeScript misses *some* type information. Especially the `options` argument of the `copy` function is `any` at the moment. So let's better add a type for that!

One thing I could do is creating types explicitly:

```typescript
type Options = {
  from: string;
  to: string;
};

const defaultOptions: Options = {
  from: "./src",
  to: "./dest",
};

type PartialOptions = {
  from?: string;
  to?: string;
};

function copy(options: PartialOptions) {
  // Let's merge default options and options
  const allOptions = { ...defaultOptions, ...options};

  // todo: Implementation of the rest
}
```

That's a very reasonable approach. You think about types, then you assign types, and then you get all the editor feedback and type checking you are used to. But what if something changes? Let's assume we add another field to `Options`, we would have to adapt our code three times:

```diff
type Options = {
  from: string;
  to: string;
+ overwrite: boolean;  
};

const defaultOptions: Options = {
  from: "./src",
  to: "./dest",
+ overwrite: true,
};

type PartialOptions = {
  from?: string;
  to?: string;
+ overwrite?: boolean;
};
```

But why? The information is already there! In `defaultOptions`, we tell TypeScript exactly what we're looking for. Let's optimize.

1. Drop the `PartialOptions` type and use the utility type `Partial<T>` to get the same effect. You might have guessed this one already
2. Make use of the `typeof` operator in TypeScript to create a new type on the fly.


```typescript
const defaultOptions = {
  from: "./src",
  to: "./dest",
};

function copy(options: Partial<typeof defaultOptions>) {
  // Let's merge default options and options
  const allOptions = { ...defaultOptions, ...options};

  // todo: Implementation of the rest
}
```

There you go. Just annotation where we need to tell TypeScript what we're looking for.

- If we add new fields, we don't have to maintain anything at all
- If we rename a field, we get *just* the information we care about: All usages of `copy` where we have to change the options we pass to the function
