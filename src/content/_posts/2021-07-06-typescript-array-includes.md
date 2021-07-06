---
title: "TypeScript: Array.includes on narrow types"
categories:
- TypeScript
- JavaScript
---

The `Array.prototype.includes` function allows searching for a value within an array. If this value is present, the function returns `true`! How handy! Of course, TypeScript has proper typings for this JavaScript functionality. 

However, in certain cases, the typings can bite a little. The reason? It's complicated! Let's find out why.

Take this little snippet for example. We create an array called `actions`, which contains a set of actions in string format which we want to execute. The resulting type of this `actions` array is `string[]`.

The `execute` function takes any string as an argument. We check if this is a valid action, and if so, do something!

```typescript
// actions: string[]
const actions = ["CREATE", "READ", "UPDATE", "DELETE"];

function execute(action: string) {
  if(actions.includes(action)) { // 👍
    // do something with action
  }
}
```

It gets a little trickier if we want to narrow down the `string[]` to something more concrete, a subset of all possible strings. By adding *const*-context via `as const`, we can narrow down `actions` to be of type `readonly ["CREATE", "READ", "UPDATE", "DELETE"]`.

This is handy if we want to do exhaustiveness checking to make sure we have cases for all available actions. However, `actions.includes` does not agree with us:

```typescript
// Adding const context
// actions: readonly ["CREATE", "READ", "UPDATE", "DELETE"]
const actions = ["CREATE", "READ", "UPDATE", "DELETE"] as const;

function execute(action: string) {
  if(actions.includes(action)) { // 💥 ERROR
    // no can do
  }
}
```

The error reads: *Argument of type 'string' is not assignable to parameter of type '"CREATE" | "READ" | "UPDATE" | "DELETE"'.* -- Error **2345**

So why is that? Let's look at the typings of `Array<T>` and `ReadonlyArray<T>` (we work with the latter one due to *const*-context).


```typescript
interface Array<T> {
  /**
   * Determines whether an array includes a certain element, 
   * returning true or false as appropriate.
   * @param searchElement The element to search for.
   * @param fromIndex The position in this array at which 
   *   to begin searching for searchElement.
   */
  includes(searchElement: T, fromIndex?: number): boolean;
}

interface ReadonlyArray<T> {
  /**
   * Determines whether an array includes a certain element, 
   * returning true or false as appropriate.
   * @param searchElement The element to search for.
   * @param fromIndex The position in this array at which 
   *   to begin searching for searchElement.
   */
  includes(searchElement: T, fromIndex?: number): boolean;
}
```

The element we want to search for (`searchElement`) needs to be of the same type as the array itself! So if we have `Array<string>` (or `string[]` or `ReadonlyArray<string>`), we can only search for strings. In our case, this would mean that `action` needs to be of type `"CREATE" | "READ" | "UPDATE" | "DELETE"`.

Suddenly, our program doesn't make a lot of sense anymore. Why do we search for something if the type already tells us that it just can be one of four strings? If we change the type for `action` to `"CREATE" | "READ" | "UPDATE" | "DELETE"`, `actions.includes` becomes obsolete. If we don't change it, TypeScript throws an error at us, and rightfully so!

One of the problems is that TypeScript lacks the possibility to check for contra-variant types with e.g. upper-bound generics. We can tell if a type should be a *subset* of type `T` with constructs like `extends`, we can't check if a type is a *superset* of `T`. At least not yet!

So what can we do?

## Option 1: Re-declare ReadonlyArray

One of the options that come into mind is changing how `includes` in `ReadonlyArray` should behave. Thanks to declaration merging, we can add our own definitions for `ReadonlyArray` that is a bit looser in the arguments, and more specific in the result. Like this:

```typescript
interface ReadonlyArray<T> {
  includes(searchElement: any, fromIndex?: number): searchElement is T;
}
```

This allows for a broader set of `searchElement`s to be passed (literally any!), and if the condition is true, we tell TypeScript through a **type predicate** that `searchElement is T` (the subset we are looking for). 

Turns out, this works pretty well!

```typescript
const actions = ["CREATE", "READ", "UPDATE", "DELETE"] as const;


function execute(action: string) {
  if(actions.includes(action)) {
    // action: "CREATE" | "READ" | "UPDATE" | "DELETE"
  }
}
```

**Hold your horses!** First of all, there's a problem (otherwise the TypeScript team would've changed that already). The solution works but takes the assumption of what's correct and what needs to be checked. If you change `action` to `number`, TypeScript would usually throw an error that you can't search for that kind of type. `actions` only consists of `string`s, so why even look at `number`. **This is an error you want to catch!**. 

```typescript
// type number has no relation to actions at all
function execute(action: number) {
  if(actions.includes(action)) {
    // do something
  }
}
```

With our change to `ReadonlyArray`, we lose this check as `searchElement` is `any`. While the functionality of `action.includes` still works as intended, we might not see the right *problem* once we change function signatures along the way. 

Also, and more importantly, we change behavior of built-in types. This might change your type-checks somewhere else, and might cause problems in the long run! **If you do a "type patch" like this, be sure to do this module scoped, and not globally.**

There is another way.


## Option 2: A helper with type assertions

As originally stated, one of the problems is that TypeScript lacks the possibility to check if a value belongs to a *superset* of a generic parameter. With a helper function, we can turn this relationship around!

```typescript
function includes<T extends U, U>(coll: ReadonlyArray<T>, el: U): el is T {
  return coll.includes(el as T);
}
```

This `includes` function takes the `ReadonlyArray<T>` as an argument, and searches for an element that is of type `U`. We check through our generic bounds that `T extends U`, which means that `U` is a *superset* of `T` (or `T` is a *subset* of `U`). If the method returns *true*, we can say for sure that `el` is of the *narrower* type `U`.

The only thing that we need to make the implementation work is to do a little type assertion the moment we pass `el` to `Array.prototype.includes`. The original problem is still there! The type assertion `el as T` is ok though as we check possible problems **already in the function signature**.


This means that the moment we change e.g. `action` to `number`, we get the right *booms* throughout our code. 


```typescript
function execute(action: number) {
  if(includes(actions, action)) { // 💥
    // Do Something
  }
}
```

Since I haven't got [shiki-twoslash](https://www.npmjs.com/package/shiki-twoslash) running yet (sorry, Orta), you can't see where TypeScript throws the error. But I invite you to check it for yourself. The interesting thing is since we swapped the relationship and check if the `actions` array is a *subset* of `action`, TypeScript tells us we need to change the `actions` array.

*Argument of type 'readonly ["CREATE", "READ", "UPDATE", "DELETE"]' is not assignable to parameter of type 'readonly number[]'.* -- Error **2345**

But hey, I think that's ok for the correct functionality we get! So let's get ready to do some exhaustiveness checking:

```typescript

function assertNever(input: never) {
  throw new Error("This is never supposed to happen!")
}

function execute(action: string) {
  if(includes(actions, action)) {
     // action: "CREATE" | "READ" | "UPDATE" | "DELETE"
    switch(action) {
      case "CREATE": 
        // do something
        break;
      case "READ": 
        // do something
        break;
      case "UPDATE": 
        // do something
        break;
      case "DELETE": 
        // do something
        break;
      default:
        assertNever(action)
    }
  }
}
```

Great!

## Bottom line

TypeScript aims to get all standard JavaScript functionality correct and right, but sometimes you have to make trade-offs. This case brings calls for trade-offs: Do you allow for an argument list that's looser than you would expect, or do you throw errors for types where you already should know more?

Type assertions, declaration merging, and other tools help us to get around that in situations where the type system can't help us. Not until it becomes better than before, by allowing us to move even further in the type space!
