---
title: "TypeScript: Low maintenance types"
categories:
- TypeScript
---

I write a lot about TypeScript and I enjoy the benefits it gives me in my daily work a lot. But I have a confession to make, I don't really like writing types or type annotations. I'm really happy that TypeScript can infer so much out of my usage when writing regular JavaScript so I'm not bothered writing anything extra.

That's how I write TypeScript in general: I write regular JavaScript, and where TypeScript needs extra information, I happily add some extra annotations. One condition: I don't want to be bothered maintaining types. I rather create types that can update themselves if their dependencies or surroundings change. I call this approach *creating low maintenance types*.

## Scenario 1: Information is already available

Let's take a look at this brief and possibly incomplete copy function. I want to copy files from one directory to another. To make my life easier, I created a set of default options so I don't have to repeat myself too much:

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
  overwrite: true,
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
- We have one single source of truth: The actual `defaultOptions` object. This is the object that counts because it's the only information we have at run-time.

And our code becomes a little bit terser. TypeScript becomes less intrusive and more aligned to how we write JavaScript.

[David](https://twitter.com/dtanzer/status/1352169078681645056) pointed out another example that falls into this category. With the const context, `typeof` and index access operators, you are able to convert a tuple into a union:

```typescript
const categories = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

// "beginner" | "intermediate" | "advanced"
type Category = (typeof categories)[number]
```

Again, we maintain just one piece, the actual data. We convert `categories` into a tuple type and index each element. Nice!

## Scenario 2: Connected Models

I'm not against laying out your models, though. On the contrary, I think in most cases it makes sense to be explicit and intentional about your models and your data. Let's take a look at this toy shop:

```typescript
type ToyBase = {
  name: string;
  price: number;
  quantity: number;
  minimumAge: number;
};

type BoardGame = ToyBase & {
  kind: "boardgame";
  players: number;
}

type Puzzle = ToyBase & {
  kind: "puzzle";
  pieces: number;
}

type Doll = ToyBase & {
  kind: "doll";
  material: "plastic" | "plush";
}

type Toy = BoardGame | Puzzle | Doll;
```

That's some great data modelling here. We have a proper `ToyBase` which includes all properties that are available with all the distinct toy types like `BoardGame`, `Puzzle`, and `Doll`. With the `kind` attribute we can create a distinct union type `Toy` where we can differentiate properly:

```typescript
function printToy(toy: Toy) {
  switch(toy.kind) {
    case "boardgame":
      // todo
      break;
    case "puzzle":
      // todo
      break;
    case "doll":
      // todo
      break;
    default: 
      console.log(toy);
  }
}
```

If we need the information of those models in different scenarios, we might end up with more types:

```typescript
type ToyKind = "boardgame" | "puzzle" | "doll";

type GroupedToys = {
  boardgame: Toy[];
  puzzle: Toy[];
  doll: Toy[];
};
```

And this is where maintenance starts again. The moment we add a type `VideoGame`:

```typescript
type VideoGame = ToyBase & {
  kind: "videogame";
  system: "NES" | "SNES" | "Mega Drive" | "There are no more consoles"; 
};
```

We have to maintain at three different spots:

```diff
- type Toy = BoardGame | Puzzle | Doll;
+ type Toy = BoardGame | Puzzle | Doll | VideoGame;

- type ToyKind = "boardgame" | "puzzle" | "doll";
+ type ToyKind = "boardgame" | "puzzle" | "doll" | "videogame";

type GroupedToys = {
  boardgame: Toy[];
  puzzle: Toy[];
  doll: Toy[];
+ videogame: Toy[];
};
```

This is not only a lot of maintenance but also very error-prone. Typos may happen, as I could misspell the `videogame` key in `GroupedToys` or the string `"videogame"` in the `ToyKind` union.

Let's use some of TypeScript's built-in functionality to change that. I think there is no reasonable way of changing the first type we need to maintain, `Toy`, but that's ok. Here it's good to be explicit because we only want to include actual toys and not something that accidentally has the same basic features.

If we want to have a union type `ToyKind` with all possible `kind` types, it's better to not maintain them on the side, but rather access the types directly.

```diff
- type ToyKind = "boardgame" | "puzzle" | "doll";
+ type ToyKind = Toy["kind"]
```

That does the same trick, thanks to us creating the `Toy` union.

We can use the newly created and self-maintaining `ToyKind` type to create a new, better `GroupedToys` type using mapped types:

```typescript
type GroupedToys = {
  [K in ToyKind]: Toy[]
}
```

And that's it! The moment we change the `Toy` type with new information, we have updated information in `ToyKind` and `GroupedToys`. Less to maintain for us.

We can even go further. The `GroupedToys` type is not exactly what we're looking for. When we group toys, we want to make sure that we only add `Doll` type objects to `doll`, etc. So what we need to is split the union again.

The `Extract` type gives us a great utility to do exactly that.

```typescript
// GetKind extracts all types that have the kind property set to Kind
type GetKind<Group, Kind> = Extract<Group, { kind: Kind }>

type DebugOne = GetKind<Toy, "doll"> // DebugOne = Doll
type DebugTwo = GetKind<Toy, "puzzle"> // DebugTwo = Puzzle
```

Let's apply that to `GroupedToys`:

```typescript
type GroupedToys = {
  [K in ToyKind]: GetKind<Toy, K>[]
};

// this is equal to 

type GroupedToys = {
  boardgame: BoardGame[];
  puzzle: Puzzle[];
  doll: Doll[];
}
```

Great! Better, more correct types at no maintenance! But there's one thing that still bugs me. The property keys. They're singular. They should be plural:

```typescript
type GroupedToys = {
  [K in ToyKind as `${K}s`]: GetKind<Toy, K>[]
};

// this is equal to 

type GroupedToys = {
  boardgames: BoardGame[];
  puzzles: Puzzle[];
  dolls: Doll[];
}
```

Great! And again, no maintenance for us. The moment we change something in `Toy`, we get a proper update in all other types.

## Defining low maintenance types

Usually, this is my approach if I want to create low maintenance types:

1. Model your data or infer from existing models
2. Define derivates (mapped types, Partials, etc)
3. Define behavior (conditionals)

I discuss the last point extensively in my book [TypeScript in 50 Lessons](https://typescript-book.com). And, as always, enjoy the [playground](https://www.typescriptlang.org/play?ts=4.2.0-beta#code/C4TwDgpgBAKg9iAQgQwM7QLxQN4CgpQB2yAthAFxSrABOAloQOYDc+UY9AxhUQK4kAjCDVYEAjr2SFgdUJUL8hItiQZ0S-AIKMeCwcNYBfVrlCQoiOMhoATAOKlMsBCnRQAZDjYBrBjcoARAJWtoyOAaLsADbIIMKo8ooGuIa4puDQAAq8AF45UU7wSGjQnngEvoT+UAFgufkQEWxgdBDcCXz6yqnp5gAicFFRUFhFrqVeFX6BNoNRTQQkyMDCdMhRgWAx1HScAVAAPjVbvKgAFk09ZtBFIxYh9o6HUNl5Bc8DQybXziAA0n47kUANoBSo2AIAXTSvWgdhocF4kBsRVQd3KUGBfygDF+AKqkModggwHxNgAPEUADRQP4APmB0OMaR+xNJfnJ8MRYBpZLpdwAogAPWjITjATkIpE07BQcGUMlQQx0lkZKB9CACXiMADyhCcbLJlIQNICsyGAX5AHorerNdq9U5PlFYXatYwYAB3OB3Q0c6nHeoFS1QG1uh36u6vBpAA) and fiddle around with the results.
