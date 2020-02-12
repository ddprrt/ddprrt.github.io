---
layout: typescript
categories:
  - TypeScript
  - JavaScript
published: true
permalink: /typescript-assertion-signatures/
title: "TypeScript: Assertion signatures and Object.defineProperty"
og:
  img: wp-content/uploads/2020/typescript-2.png
---

In JavaScript, you can define object properties on the fly with `Object.defineProperty`. This is useful if you want your properties to be read-only or similar. Think of a storage object that has a maximum value that shouldn't be overwritten:

```javascript
const storage = {
  currentValue: 0
}

Object.defineProperty(storage, 'maxValue', {
  value: 9001,
  writable: false
})

console.log(storage.maxValue) // 9001

storage.maxValue = 2

console.log(storage.maxValue) // still 9001
```

`defineProperty` and property descriptors are very complex. They allow you to do everything with properties that usually is reserved for built-in objects. So they're common in larger codebases. TypeScript -- *at the time of this writing* -- has a little problem with `defineProperty`:

```javascript
const storage = {
  currentValue: 0
}

Object.defineProperty(storage, 'maxValue', {
  value: 9001,
  writable: false
})

// 💥 Property 'maxValue' does not exist on type...
console.log(storage.maxValue) 
```

If we don't explicitly typecast, we don't get `maxValue` attached to the type of `storage`. However, for simple use cases, we can help!

## assertion signatures

With TypeScript 3.7, the team introduced assertion signatures. Think of an `assertIsNumber` function where you can make sure some value is of type `number`. Otherwise, it throws an error. This is similar to the `assert` function in Node.js:

```javascript
function assertIsNumber(val: any) {
  if (typeof val !== "number") {
    throw new AssertionError("Not a number!");
  }
}

function multiply(x, y) {
  assertIsNumber(x);
  assertIsNumber(y);
  // at this point I'm sure x and y are numbers
  // if one assert condition is not true, this position
  // is never reached
  return x * y;
}
```

To comply with behavior like this, we can add an assertion signature that tells TypeScript that we know more about the type after this function:

```diff
- function assertIsNumber(val: any) {
+ function assertIsNumber(val: any) : asserts val is number
    if (typeof val !== "number") {
      throw new AssertionError("Not a number!");
    }
  }
```

This works a lot like [type predicates](/typescript-type-predicates/), but without the control flow of a condition-based structure like `if` or `switch`.

```javascript
function multiply(x, y) {
  assertIsNumber(x);
  assertIsNumber(y);
  // Now also TypeScript knows that both x and y are numbers
  return x * y;
}
```

If you look at it closely, you can see those assertion signatures can **change the type of a parameter or variable on the fly**.
This is just what `Object.defineProperty` does as well.

## custom defineProperty

> **Disclaimer**: The following helper does not aim to be 100% accurate or complete. It might have errors, it might not tackle every edge case of the `defineProperty` specification. It might, however, handle a lot of use cases well enough. So use it at your own risk!

Just as with [hasOwnProperty](/typescript-hasownproperty/), we create a helper function that mimics the original function signature:

```javascript
function defineProperty<
  Obj extends object,
  Key extends PropertyKey,
  PDesc extends PropertyDescriptor>
  (obj: Obj, prop: Key, val: PDesc) {
  Object.defineProperty(obj, prop, val);
}
```

We work with 3 generics:

1. The object we want to modify, of type `Obj`, which is a subtype of `object`
2. Type `Key`, which is a subtype of `PropertyKey` (built-in), so `string | number | symbol`.
3. `PDesc`, a subtype of `PropertyDescriptor` (built-in). This allows us to define the property with all its features (writability, enumerability, reconfigurability).

We use generics because TypeScript can narrow them down to a very specific unit type. `PropertyKey` for example is all numbers, strings, and symbols. But if I use `Key extends PropertyKey`, I can pinpoint `prop` to be of e.g. type `"maxValue"`. This is helpful if we want to change the original type by adding more properties.

The `Object.defineProperty` function either changes the object or throws an error should something go wrong. Exactly what an assertion function does. Our custom helper `defineProperty` thus does the same.

Let's add an assertion signature. Once `defineProperty` successfully executes, our object has another property. We are creating some helper types for that. The signature first:

```diff
function defineProperty<
  Obj extends object,
  Key extends PropertyKey,
  PDesc extends PropertyDescriptor>
-  (obj: Obj, prop: Key, val: PDesc) {
+  (obj: Obj, prop: Key, val: PDesc): asserts obj is Obj & DefineProperty<Key, PDesc> {
  Object.defineProperty(obj, prop, val);
}
```

`obj` then is of type `Obj` (narrowed down through a generic), and our newly defined property.

This is the `DefineProperty` helper type:

```javascript
type DefineProperty<Prop extends PropertyKey, Desc extends PropertyDescriptor> = 
  Desc extends { writable: any, set(val: any): any } ? never :
  Desc extends { writable: any, get(): any } ? never :
  Desc extends { writable: false } ? Readonly<InferValue<Prop, Desc>> :
  Desc extends { writable: true } ? InferValue<Prop, Desc> :
  Readonly<InferValue<Prop, Desc>>
```

First, we deal with the `writeable` property of a `PropertyDescriptor`. It's a set of conditions to define some edge cases and conditions of how the original property descriptors work:

1. If we set `writable` and any property accessor (get, set), we fail. `never` tells us that an error was thrown.
2. If we set `writable` to `false`, the property is read-only. We defer to the `InferValue` helper type.
3. If we set `writable` to `true`, the property is not read-only. We defer as well
4. The last, default case is the same as `writeable: false`, so `Readonly<InferValue<Prop, Desc>>`. (`Readonly<T>` is built-in)

This is the `InferValue` helper type, dealing with the set `value` property.

```javascript
type InferValue<Prop extends PropertyKey, Desc> =
  Desc extends { get(): any, value: any } ? never :  
  Desc extends { value: infer T } ? Record<Prop, T> : 
  Desc extends { get(): infer T } ? Record<Prop, T> : never;
```

Again a set of conditions:
1. Do we have a getter and a value set, `Object.defineProperty` throws an error, so never.
2. If we have set a value, let's infer the type of this value and create an object with our defined property key, and the value type
3. Or we infer the type from the return type of a getter.
4. Anything else: We forgot. TypeScript won't let us work with the object as it's becoming `never`

## In action!

Lots of helper types, but roughly 20 lines of code to get it right:

```javascript
type InferValue<Prop extends PropertyKey, Desc> =
  Desc extends { get(): any, value: any } ? never :  
  Desc extends { value: infer T } ? Record<Prop, T> : 
  Desc extends { get(): infer T } ? Record<Prop, T> : never;

type DefineProperty<Prop extends PropertyKey, Desc extends PropertyDescriptor> = 
  Desc extends { writable: any, set(val: any): any } ? never :
  Desc extends { writable: any, get(): any } ? never :
  Desc extends { writable: false } ? Readonly<InferValue<Prop, Desc>> :
  Desc extends { writable: true } ? InferValue<Prop, Desc> :
  Readonly<InferValue<Prop, Desc>>

function defineProperty<
  Obj extends object,
  Key extends PropertyKey,
  PDesc extends PropertyDescriptor>
  (obj: Obj, prop: Key, val: PDesc): asserts obj is Obj & DefineProperty<Key, PDesc> {
  Object.defineProperty(obj, prop, val)
}
```

Let's see what TypeScript does:

```javascript

const storage = {
  currentValue: 0
}

defineProperty(storage, 'maxValue', { writable: false, value: 9001 })

storage.maxValue // it's a number
storage.maxValue = 2 // Error! It's read-only

const storageName = 'My Storage'
defineProperty(storage, 'name', {
  get() {
    return storageName
  }
})

storage.name // it's a string!

// it's not possible to assing a value and a getter
defineProperty(storage, 'broken', {
  get() {
    return storageName
  },
  value: 4000
})

// storage is never because we have a malicious property descriptor
storage 
```

As said, this most likely won't deal with all edge cases, but it's a good start. And if you know what you're dealing with, you can get very far.

As always, [there's a playground for you to fiddle around](https://www.typescriptlang.org/play/index.html?ssl=47&ssc=76&pln=20&pc=1#code/C4TwDgpgBAkgdgMwgJwGoEMA2BXCAeABWQHswoIAPYCOAEwGcojSVQBpCEAGigBEJ6AYwB8UALwBYAFBQ+AweSo0GUAN5QA5hGAAKAJQAuKOjjcoANyy4jJkFAC+UAPxQ4EcyihGo02fyGK1HSM6pY4EEYAloieACoOzlAAShCCxMi0hCRgPLGiRr5yAZRBKupauoZQ0UjIUPGOLilpGVmkufmu7igA3NLSoJByCNEQzJDIoG1kJcqM46wgHGb+CrPBTNmLq8iRYMDpomI+MkVrShvqAO67wOgARpgRxqY89No6YTamVbYJLm4PHUDIVVoE5mooDdIndHs9bDwKvpvnZGl0gV5QfJwZcobcHk8jAgsO9-skIOhaMQ4JgQHh4LUMOFpjxVsJ8ljihcyniYQTnsBkLgyQyUEzcCyzhzTilKdTafSYmgrPhxqz5Oz+lIENg4IJgJFqVBaBARm4FpM6YUAPL3ABWOJUxHtqWAXEKy0d8y2luW7tOBDB6xUFtAOz2B2QwkKOmddqMtrtPDA2SMfosWCMgfkv3o70mjDj1UYiagADJhqNQ3T09mhKJVDaXfqAHQms1jH2gWP25PZHhhPTSexatJwejAKAT9LoLTiNSFQTYZDIGjAcXPAAMw617arXZAOmnyFnEB4AHIALboCgb888a74uFEklnjPhIwATk3m4AjA4hykaRj1PFtr1vFUoAAeig6pgHPRh0FcbBL3uFBgMjUDwI3ecACZoNggBRFd0gAQlgeDGFXSkAFp5RAUdqQnKdMK0AA5dBL2gY5zwAWTsABlViIHPaQ93NA8j2Ei84E4kSH0KJE9AXU5ZFXYBlzgFiZ3YuTChHKR7EAjCdIgFtZK4gi4IQ4wWN2OANFIrUYOsxg4GIScwGIPNIjhKADmMHyHNssJhRMWhbIqahkDE019xYS0pNMi97hIABrGh7xU2QlOy2QoHUzTtJPXSuP0-1ZFC54ABYf23QzjKkEC5xc5roEiNzujqNDBHQbBSSuaAAAt0A8Wzr0wSJBENfqoBTBLQGNeRdn2dJpCAA).

{% include helper/include-by-tag.html tag="TypeScript" title="More articles about TypeScript" %}
