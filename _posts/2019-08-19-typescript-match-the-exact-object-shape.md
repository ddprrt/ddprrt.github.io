---
layout: post
categories:
  - TypeScript
published: true
permalink: /typescript-match-the-exact-object-shape/
title: "TypeScript: Match the exact object shape"
---

TypeScript is a structural type system. This means as long as your data structure satisfies a contract,
TypeScript will allow it. Even if you have too many keys declared.

```javascript
type Person = {
  first: string, last: string
}

declare function savePerson(person: Person);

const tooFew = { first: 'Stefan' };
const exact = { first: 'Stefan', last: 'Baumgartner' }
const tooMany = { first: 'Stefan', last: 'Baumgartner', age: 37 }

savePerson(tooFew); // 💥 doesn't work
savePerson(exact); // ✅ satisfies the contract
savePerson(tooMany); // ✅ satisfies the contract
```

This complements the way JavaScript works really well and gives you both flexibility and type safety.
There are some scenarios where you might want the exact shape of an object. E.g. 
when you send data to backend that errors if it gets too much information.

```javascript
savePerson(tooMany); // ✅ satisfies the contract, 💥 bombs the backend
```

In a JS world, always make sure to explicitly send payloads in scenarios like that, 
don't rely on types alone. But while types can't help you getting communication 100% correct, 
we can get a little compilation time help to make sure we don't stray off our own path.
All with the help of conditional types.

First, we check if the object we want to validate matches the original shape:

```javascript
type ValidateShape<T, Shape> = 
  T extends Shape ? ...
```

With that call we make sure that the object we pass as parameter is a subtype of `Shape`.
Then, we check for any extra keys:

```diff
type ValidateShape<T, Shape> ?
  T extends Shape ? 
+  Exclude<keyof T, keyof Shape> extends never ? ...
```

So how does this work? `Exclude<T, U>` is defined as `T extends U ? never : T`. We pass 
in the keys the object to validate and the shape. Let's say `Person` is our shape, and
`tooMany = { first: 'Stefan', last: 'Baumgartner', age: 37 }` is the object we want 
to validate. This are our keys:

```javascript
keyof Person = 'first' | 'last'
keyof typeof tooMany = 'first' | 'last' | 'age'
```

`'first'` and `'last'` are in both union types, so they return `never`, `age` returns
itself because it isn't available in `Person`:

```javascript
keyof Person = 'first' | 'last'
keyof typeof tooMany = 'first' | 'last' | 'age'

Exclude<keyof typeof tooMany, keyof Person> = 'age';
```

Is it an exact match, `Exclude<T, U>` returns `never`:

```javascript
keyof Person = 'first' | 'last'
keyof typeof exact = 'first' | 'last'

Exclude<keyof typeof exact, keyof Person> = never;
```

In `ValidateShape` we check if `Exclude` extends `never`, meaning we don't have any extrac keys.
If this condition is true, we return the type we want to validate. 
In all other conditions, we return `never`:

```diff
type ValidateShape<T, Shape> ?
  T extends Shape ? 
  Exclude<keyof T, keyof Shape> extends never ? 
+  T : never : never;
```

Let's adapt our original function:

```javascript
declare function savePerson<T>(person: ValidateStructure<T, Person>): void;
```

With that, it's impossible to pass objects that don't exactly match the
shape of the type we expect:

```javascript
savePerson(tooFew); // 💥 doesn't work
savePerson(exact); // ✅ satisfies the contract
savePerson(tooMany); // 💥 doesn't work
```

There's a [playground for you](https://www.typescriptlang.org/play/index.html#code/C4TwDgpgBAChBOBnA9gOygXigbwLACgooAzASyWAC4pFh5TUBzAGigBsBDW62+pggL4ECoSFABqHNqQAmHYBADKdAK4BjYCvgQAPABVWy+OuAA+TFAJE9UCAA8FqGYihGTUAPyXCUAKJ21NhUZXQBrCBBkYigDKHDI6LcNc3tHZyhUCAA3BE8YqGpMnPgCjOyEAG5hfBDAjm0SFVQNUjQaDhy4JDR9UwAKSG7UaklpOQUkzW19Vi6UVFMASmos5Fkq-AI1NFooYGRkADEIAHcLbBJybigAcmUIYg5UG6gBDe3UXfsODXPLimodwUj2erE41xuACEOCoALaMerATLwF5CfAfXb7ZAAWSeID+ZABt3uIJuYK4VFu0LhCPgSIQZKgHEYEGoAGYAOyvaqIDoQOZoPpY44nRYVKAAeglUEAvBuAUp2oDJkBBEM9gFATsh4KECLzOgh5n1vhoxZLpYBQcnawFIiDIKr2AAtoB86D9gLq+QLUEKDrjUCBTVLZQqlSq1RqtTrNvggA) to fiddle around. This helper won't get you around runtime checks, but it is a helping hand during development.
