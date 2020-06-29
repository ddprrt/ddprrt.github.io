---
title: "TypeScript: Union to intersection type"
categories:
- TypeScript
---

Recently, I had to convert a union type into an intersection type. Working on a helper type `UnionToIntersection<T>` has taught me a ton of things on conditional types and strict function types, which I want to share with you.

I really like working with non-discriminated union types when I try to model a type where at least one property needs to be set, making all other properties optional. Like in this example:

```typescript
type Format320 = { urls: { format320p: string } }
type Format480 = { urls: { format480p: string } }
type Format720 = { urls: { format720p: string } }
type Format1080 = { urls: { format1080p: string } }

type Video = BasicVideoData & (
  Format320 | Format480 | Format720 | Format1080
)

const video1: Video = {
  // ...
  urls: {
    format320p: 'https://...'
  }
} // ✅

const video2: Video = {
  // ...
  urls: {
    format320p: 'https://...',
    format480p: 'https://...',
  }
} // ✅

const video3: Video = {
  // ...
  urls: {
    format1080p: 'https://...',
  }
} // ✅
```

However, putting them in a union has some side-effects when you need e.g. all avaiable keys:

```typescript
// FormatKeys = never
type FormatKeys = keyof Video["urls"]

// But I need a string representation of all possible
// Video formats here!
declare function selectFormat(format: FormatKeys): void
```

In the example above, `FormatKeys` is `never`, because there are no common, intersecting keys within this type. Since I don't want to maintain extra types (that might be error prone), I need to somehow transform the union of my video formats to an *intersection* of video formats. The intersection means that all keys need to be available, which allows the `keyof` operator to create a union of all my formats.

So how do we do that? The answer can be found in the academic description of [conditional types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html) that have been released with TypeScript 2.8. There is a lot of jargon, so let's go over this piece by piece to make sense out of it.

## The solution

I'll start by presenting you the solution. If you don't want to know how this works underneath, just see this as a TL/DR.

```typescript
type UnionToIntersection<T> = 
  (T extends any ? (x: T) => any : never) extends 
  (x: infer R) => any ? R : never
```

Still here? Good! There is *a lot* to unpack here. There's a conditional type nested within a conditional type, we use the *infer* keyword and everything looks like it's way too much work that does nothing at all. But it does, because there are a couple of key pieces TypeScript treats special. First, the naked type.

## The naked type

If you look at the first conditional within `UnionToIntersection<T>`, you can see that we use the generic type argument as a naked type.

```typescript
type UnionToIntersection<T> = 
  (T extends any ? (x: T) => any : never) //...
```

This means that we check if `T` is in a sub-type condition without wrapping it in something.

```typescript
type Naked<T> = 
  T extends ... // naked!

type NotNaked<T> = 
  { o: T } extends ... // not naked!
```

Naked types in conditional types have a certain feature. If `T` is a union, they run the conditional type for each constituent of the union. So with a naked type, a conditional of union types becomes a union of conditional types. For example:

```typescript
type WrapNaked<T> = 
  T extends any ? { o: T } : never

type Foo = WrapNaked<string | number | boolean>

// A naked type, so this equals to

type Foo = 
  WrapNaked<string> | 
  WrapNaked<number> | 
  WrapNaked<boolean>

// equals to

type Foo = 
  string extends any ? { o: string } : never |
  number extends any ? { o: number } : never |
  boolean extends any ? { o: boolean } : never

type Foo = 
  { o: string } | { o: number } | { o: boolean }
```

As compared to the non-naked version:


```typescript
type WrapNaked<T> = 
  { o: T } extends any ? { o: T } : never

type Foo = WrapNaked<string | number | boolean>

// A non Naked type, so this equals to

type Foo = 
  { o: string | number | boolean } extends any ? 
    { o: string | number | boolean } : never

type Foo = 
  { o: string | number | boolean }
```

Subtle, but considerably different for complex types!

So, back in our example, we use the naked type and ask if it extends *any* (which it always does, *any* is the allow-it-all top type).

```typescript
type UnionToIntersection<T> = 
  (T extends any ? (x: T) => any : never) //...
```

Since this condition is always true, we wrap our generic type in a function, where `T` is the type of the function's parameter. But why?

## Contra-variant type positions
