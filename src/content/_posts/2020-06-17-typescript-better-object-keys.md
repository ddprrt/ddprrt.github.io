---
title: "TypeScript: Improving Object.keys"
categories:
- TypeScript
---

TypeScript's predefined types in `lib.d.ts` are usually very well-typed and give tons of information on how to use built-in functionality as well as providing you with extra-type safety. Until they don't. Consider the following example with an object type `Person`:

```typescript
type Person = {
  name: string, age: number, id: number,
}
declare const me: Person;

Object.keys(me).forEach(key => {
  // 💥 the next line throws red squigglies at us
  console.log(me[key])
})
```

We have an object of type `Person`, with `Object.keys` we want to get all keys as strings, then use this to access each property in a `map` or `forEach` loop to do something about it in strict mode, we get red squigglies thrown at us. This is the error message:

> *Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Person'. No index signature with a parameter of type  'string' was found on type 'Person'*

So what's happening? The type declaration for `Object.keys` is as follows:

```typescript
interface ObjectConstructor {
  //... 
  keys(o: object): string[]
  keys(o: {}): string[]
}
```

Both overloads take any *object* as input and return a *string array* as output. This is correct and expected behavior. It's just very generalized for something where we already know more, and where TypeScript should know more.

*string* is a super-set of the actual keys we can access from `Person`. The concrete subset would be `name | age | id`. This is also the set of values TypeScript allows us to index from `Person`. For every other string, TypeScript says that *it could be*, but the indexed value could be *any*-thing. And in strict mode, *any* is not allowed unless explicitly stated.

**Important**: There is most likely a reason for this. Either more concrete types cause problems somewhere in well-established libraries. Or the behavior is too complex to be summed up in a type. Or, there simply were more important things. This doesn't mean that better typings won't come at some point.

But still, what can we do?

## Option 1. Type-casting

The worst solution would be to turn off `noImplicitAny`. This is an open door for bugs and wrong types. The most obvious solution would be type-casting. We could either cast the object to *any* to allow for ... everything to happen.

```typescript
Object.keys(me).forEach((key) => {
  console.log((me as any)[key])
})
```

Not cool. Or we can cast the `key` argument to be of `keyof Person` to ensure TypeScript understands what we're aiming for.

```typescript
Object.keys(me).forEach((key) => {
  console.log(me[key as keyof Person])
})
```

Better. Still not cool. This is something TypeScript should do on its own! So if TypeScript doesn't know yet, we can start *teaching* TypeScript how to do it.

## Option 2. Extending Object Constructor

Thanks to the declaration merging feature of interfaces, we can extend the `ObjectConstructor` interface with our own type definitions. We can do this directly where we need it or create our own ambient declaration file.

We open the interface, and write another overload for `keys`. This time we want to be very concrete about the object's value we get in and decide based on its shape what to return.

This is the behavior:

1. If we pass a number, we get an empty array.
2. If we pass a string or an array, we get a string array in return. This string array contains string representations of the number indices to index either the array or the string's position. Meaning that the string array has the same length as its input.
3. For any real object, we return its keys.

We construct a helper type for this. This one is a conditional type, describing the behavior above.

```typescript
type ObjectKeys<T> = 
  T extends object ? (keyof T)[] :
  T extends number ? [] :
  T extends Array<any> | string ? string[] :
  never;
```

In my conditional types, I usually end on never. This gives me the first signal that I either forget something in my declaration or did something entirely wrong in my code. In any case, it's a good pointer to see that something's smelly.

Now, we open the `ObjectConstructor` interface and add another overload for keys. We define a generic type variable, the return value is based on the conditional type `ObjectKeys`.

```typescript
interface ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>
}
```

Again, since this is an interface, we can monkey-patch our definitions right where we need them. The moment we pass a concrete object to `Object.keys`, we bind the generic type variable `T` to this object. Meaning that our conditional can give *exact* information about the return value. And since our definition is the most specific of all three *keys* declarations, TypeScript defaults to using this. 

Our little example doesn't throw squigglies at us anymore. 

```typescript
Object.keys(me).forEach((key) => {
  // typeof key = 'id' | 'name' | 'age'
  console.log(me[key])
})
```

The type of `key` is now `'id' | 'name' | 'age'`, just as we want it to be. Also, for all other cases, we get proper return values.

Note: The behavior of passing an array or a string doesn't significantly change. But this is a good indicator that there might be something wrong with your code. Same with the empty array. Still, we retain the behavior of built-in functionality.

Extending existing interfaces is a great way to opt-in to typings where for some reason we don't get the information we need. 
