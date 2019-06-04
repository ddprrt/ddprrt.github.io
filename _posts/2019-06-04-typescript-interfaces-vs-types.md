---
layout: post
categories:
  - TypeScript
published: true
permalink: /typescript-interfaces-vs-types/
title: "TypeScript: The biggest difference between interfaces and type aliases"
---

One curiosity about TypeScript that pops up quite frequently is the difference between type aliases and interfaces. They seem to be exchangeable at times, but then there's those subtle nuances that make them so, so different.

There's already been some articles on that topic. Like [Martin Hochel's great explanation](https://medium.com/@martin_hotell/interface-vs-type-alias-in-typescript-2-7-2a8f1777af4c) on the differences between interfaces and type aliases. Or [Pawel Grzybek's recent findings](https://pawelgrzybek.com/typescript-interface-vs-type/) that shed even more light. 

To sum up the gist of those articles:

### Interfaces are exlusive to objects

A type alias can be any type. Literally. You can move freely in the type space and create a full alias for number, string, or even unit types:

```javascript
type Num = number; ✅

type Str = string; ✅

type One = 1; ✅
```

The fun begins of course when we start with object types. And when we use things like union and intersection types to be more explicit with our type definitions:

```javascript
type Person = {
  first: string,
  last: string
}

type Adult = Person & {
  wage: number,
  dept: BigInt
}
```

Object types can easily be modelled with interfaces, as well:

```javascript
interface IPerson {
  first: string;
  second: string;
}

interface IAdult extends IPerson {
  wage: number;
  dept: BigInt;
}
```

But that's that. We can't re-define unit types or primitive types with interfaces. We need to stick to object types. This is quite understandable, given that interfaces in this syntax stem from traditional OOP.

### Interfaces can have merge declarations

One of the most peculiar things about interfaces is that once you define an interface, the definition is not final. It can be extended in other files through something called declaration merging:


```javascript
interface IPerson {
  first: string;
  second: string;
}

interface IPerson {
  age: number;
}

/* creates:

interface IPerson {
  first: string;
  second: string;
  age: number;
}
*/
```

This is super helpful if you work with APIs from libraries and need just a little bit more to fulfil your contract. This also allows greatly for compatibility layers to older APIs. You can't do that with type aliases.

### Intersection and union types are exclusive to type aliases

You can intersect and unite interfaces, but you can't assign an intersection or union type to interfaces:

```javascript
interface IPerson { ... }
interface IWealth { ... }
interface IAnimal { ... }

type TAdult = IPerson & IWealth; ✅

type TBeing = IPerson | IAnimal; ✅

interface IBeing = ... ... 🤷‍♀️ ❌
```

You can work around intersection types by using the `extends` clause (see the `IAdult` example above), but anything more complex won't work. This is also true for mapped types and anything that goes beyond defining and extending. 

Different tools for different use cases, I presume.

There's a bit more to it. You see it when you read the articles linked above. But there's still one more thing we tend to overlook:

## Circular type references

This is it. The one difference that made my mind spin. Most of the time I'm working with type aliases and leave interfaces completely on the side. But if I have a data structure that is more complex and might reference itself, I always need to rely to interfaces. Check out this example for instance:



{% include helper/include-by-tag.html tag="TypeScript" title="More articles about TypeScript" %}
