---
title: "TypeScript troubleshooting - subtle differences interfaces and types"
categories:
- TypeScript
---

I've written extensively on why I prefer [types over interfaces](https://fettblog.eu/tidy-typescript-prefer-type-aliases/) in the past. But with all my recommendations, there is a big *it depends* in front of it. Followed along with a genuine, and well-meant *use whatever you think is best for you*. Interfaces and types are *almost* identical when you use them. Except when they aren't. There are some subtle differences in usage, and we want to look at one of them today.

## The Problem

Let's define type definitions for a very simple compound type called `Person`. We use both an interface and a type alias:

```typescript
type PersonType = {
  name: string
}

interface PersonInterface {
  name: string;
}
```

Both `PersonType` and `PersonInterface` look very similar, almost identical. When we explicitly annotate bindings with that type, they also seem to work just the same.

```typescript
const personT: PersonType = {
  name: "Stefan"
};

const personI: PersonInterface = {
  name: "Stefan"
};
```

Regardless if you *should* explictly annotate your bindings in that scenario, everybody would expect them to work similar. Until you work with a much wider type like `Record`:

```typescript
let rec: Record<string, string>;
rec = personT; // 👍 OK!
rec = personI; // 💥 Boom, no love from TypeScript here
```

TypeScript throws an error message at us: *Type 'PersonInterface' is not assignable to type 'Record<string, string>'.
  Index signature is missing in type 'PersonInterface'* -- Error **2322**.

The same problem occurs when we want to pass `personI` to a function that features the same type in its signature:

```typescript
function printRecord(record: Record<string, string>) {
  // TODO 
}

printRecord(personT); // 👍 OK!
printRecord(personI); // 💥 Boom, no love from TypeScript here
```

The error this time is *Argument of type 'MyInterface' is not assignable to parameter of type 'Record<string, string>'.* -- Error **2345**.

What's happening? Why do types work, but not interfaces?

## The explanation

