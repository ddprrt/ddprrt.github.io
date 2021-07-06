---
title: "TypeScript: Array.includes on narrow types"
categories:
- TypeScript
- JavaScript
---


```typescript
// actions: string[]
const actions = ["CREATE", "READ", "UPDATE", "DELETE"];

function execute(action: string) {
  if(actions.includes(action)) { // 👍
    // do something with action
  }
}
```

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


## Option 1: Re-declare ReadonlyArray

```typescript
const actions = ["CREATE", "READ", "UPDATE", "DELETE"] as const;

interface ReadonlyArray<T> {
  includes(searchElement: any, fromIndex?: number): searchElement is T;
}

function execute(action: string) {
  if(actions.includes(action)) {
    // do something
  }
}
```

**The problem**

```typescript
// type number has no relation to actions at all
function execute(action: number) {
  if(actions.includes(action)) {
    // do something
  }
}
```

## Option 2: A helper with type assertions

```typescript
function includes<T extends U, U>(coll: ReadonlyArray<T>, el: U): el is T {
  return coll.includes(el as T);
}
```

```typescript
function execute(action: number) {
  if(includes(actions, action)) {
    // Do Something
  }
}
```

*Argument of type 'readonly ["CREATE", "READ", "UPDATE", "DELETE"]' is not assignable to parameter of type 'readonly number[]'.* -- Error **2345**
