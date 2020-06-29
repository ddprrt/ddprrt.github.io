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

However, putting them in a union has some side-effects when you need e.g. all available keys:

```typescript
// FormatKeys = never
type FormatKeys = keyof Video["urls"]

// But I need a string representation of all possible
// Video formats here!
declare function selectFormat(format: FormatKeys): void
```

In the example above, `FormatKeys` is `never`, because there are no common, intersecting keys within this type. Since I don't want to maintain extra types (that might be error-prone), I need to somehow transform the union of my video formats to an *intersection* of video formats. The intersection means that all keys need to be available, which allows the `keyof` operator to create a union of all my formats.

So how do we do that? The answer can be found in the academic description of [conditional types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html) that have been released with TypeScript 2.8. There is a lot of jargon, so let's go over this piece by piece to make sense out of it.

## The solution

I'll start by presenting you with the solution. If you don't want to know how this works underneath, just see this as a TL/DR.

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

Since this condition is always true, we wrap our generic type in a function, where `T` is the type of the function's parameter. But why are we doing that?

## Contra-variant type positions

This leads me to the second condition:

```typescript
type UnionToIntersection<T> = 
  (T extends any ? (x: T) => any : never) extends 
  (x: infer R) => any ? R : never
```

As the first condition always yields true, meaning that we wrap our type in a function type, the other condition also always yields true. We are basically checking if the type we just created is a subtype of itself. But instead of passing through `T`, we infer a new type `R`, and return the inferred type. 

So what we do is wrap, and unwrap type `T` via a function type.

Doing this via function arguments brings the new inferred type `R` in a *contra-variant position*. So what are contra-variant positions?

```typescript
type Fun<X> = (...args: X[]) => void

declare let f: Fun<string>
declare let g: Fun<string | number>

g = f // 💥 this cannot be assigned
```

We define a simple function type that takes generic arguments, and then declare two functions of that type. One just with a `string`, the other one can be `string` or `number`. Even though `f` is kind of similar to `g`, we can't assign `f` to `g`, because we miss the second part of the union. 

TypeScript tells us that even though our type arguments are a union, and we partially fulfill this union, we need to provide both for a complete assignment. This works effectively like an intersection.

And this is also what happens when we put contra-variant positions in a conditional type: TypeScript creates an *intersection* out of it.

## How the solution works

Let's run it through.

```typescript
type UnionToIntersection<T> = 
  (T extends any ? (x: T) => any : never) extends 
  (x: infer R) => any ? R : never

type Intersected = UnionToIntersection<Video["urls"]>

// equals to

type Intersected = UnionToIntersection<
  { format320p: string } |
  { format480p: string } |
  { format720p: string } |
  { format1080p: string } 
>

// we have a naked type, this means we can do
// a union of conditionals:

type Intersected = 
  UnionToIntersection<{ format320p: string }>
  UnionToIntersection<{ format480p: string }> |
  UnionToIntersection<{ format720p: string }> |
  UnionToIntersection<{ format1080p: string }> 

// expand it...

type Intersected = 
  ({ format320p: string } extends any ? 
    (x: { format320p: string }) => any : never) extends 
    (x: infer R) => any ? R : never | 
  ({ format480p: string } extends any ? 
    (x: { format480p: string }) => any : never) extends 
    (x: infer R) => any ? R : never | 
  ({ format720p: string } extends any ? 
    (x: { format720p: string }) => any : never) extends 
    (x: infer R) => any ? R : never | 
  ({ format1080p: string } extends any ? 
    (x: { format1080p: string }) => any : never) extends 
    (x: infer R) => any ? R : never

// conditional one!

type Intersected = 
  (x: { format320p: string }) => any extends 
    (x: infer R) => any ? R : never | 
  (x: { format480p: string }) => any extends 
    (x: infer R) => any ? R : never | 
  (x: { format720p: string }) => any extends 
    (x: infer R) => any ? R : never | 
  (x: { format1080p: string }) => any extends 
    (x: infer R) => any ? R : never

// conditional two!, inferring R!
type Intersected = 
  { format320p: string } | 
  { format480p: string } | 
  { format720p: string } | 
  { format1080p: string }

// But wait! `R` is inferred from a contra-variant position
// I have to make an intersection, otherwise I lose type compatibility

type Intersected = 
  { format320p: string } & 
  { format480p: string } & 
  { format720p: string } & 
  { format1080p: string }
```

And that's what we have been looking for! So applied to our original example:

```typescript
type FormatKeys = keyof UnionToIntersection<Video["urls"]>
```

`FormatKeys` is now `"format320p" | "format480p" | "format720p" | "format1080p"`. Whenever we add another format to the original union, the `FormatKeys` type gets updated automatically. Maintain once, use everywhere.


## Further reading:

I came to this solution after digging into what *contra-variant* positions are and what they mean in TypeScript. Next to type system jargon, it tells us effectively that we need to provide all constituents of a generic union if used as a function argument. And this works as an intersection during the assignment.

If you want to read more on this subject, I suggest catching up on the following articles.

- See the TypeScript 2.4 release notes [about contra-variance in functions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-4.html#strict-contravariance-for-callback-parameters)
- See the TypeScript 2.8 release notes [on how conditional types work](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#conditional-types)
- Stephan Boyer's article on [co-variance and contra-variance](https://www.stephanboyer.com/post/132/what-are-covariance-and-contravariance)
- A [playground](https://www.typescriptlang.org/play?#code/C4TwDgpgBAYg9gJwLYENgGYBMAGKBeKAbygFcEAbAZwC4ioAzRVDHMWy4BASwDsBzKAF8hAWABQoSLCZoALAA5cBYmSq1ijZHMVsoHbvyGiJ4aPC3AA7Dnx1VNOpubXsu-bwHDB4yWZnAARmxFWxUKBw1-IJ12Tg8jbzEfUygAIRRKLgBjADUuABMIOAARNBRQxOSpPMK4W3TM3IKi0uBygDIoAApxKGkLLFwAH37mBWHRtBcoEfNmaOxxAEpxVZMpAFUeLjgeABU4AEkeYAgESggs4B2eAB49gD5bXu69qAgAD1OefMooFB4ICgAH5uh9aHslvgngCgbQeBAAG5nKGfb6-KAvLrgqC8ehnKAAJSheBhgJBRKg8KRZzWvkmwAA0hAQH8CABrFlwehQLY3A7HU7nS7XXa3GpFADaACJ7NKALoPNZAA) with the examples above
- As always, watch this blog!
