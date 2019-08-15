---
layout: post
categories:
  - TypeScript
published: true
permalink: /typescript-interface-constructor-pattern/
title: "TypeScript: The constructor interface pattern"
---

If you are doing traditional OOP with TypeScript, the structural features of TypeScript might
sometimes get in your way. Look at the following class hierachy for instance:

```javascript
abstract class FilterItem {
  constructor(private property: string) {}
  someFunction() { /* ... */ }
  abstract filter(): void;
}


class AFilter extends FilterItem {
  filter() { /* ... */ } 
}


class BFilter extends FilterItem {
  filter() { /* ... */ }
}
```

The `FilterItem` abstract class needs to be implemented by other classes. In this example by
`AFilter` and `BFilter`. So far, so good. Classical typing works like you are used to from
Java or C#:

```javascript
const some: FilterItem = new AFilter('afilter'); // ✅
```

When we need the structural information, though, we leave the realms of traditional OOP.
Let's say we want to instantiate new filters based on some token we get from an AJAX call.
To make it easier for us to select the filter, we store all possible filters in a map:

```javascript
declare const filterMap: Map<string, typeof FilterItem>;

filterMap.set('number', AFilter)
filterMap.set('stuff', BFilter)
```

The map's generics are set to a string (for the token from the backend), and everything
that complements the type signature of `FilterItem`. We use the `typeof` keyword here 
to be able to add classes to the map, not objects. We want to instantiate them afterwards,
after all.

So far everything works like you would expect. The problem occurs when you want to 
fetch a class from the map and create a new object with it.

```javascript
let obj: FilterItem;
const ctor = filterMap.get('number');

if(typeof ctor !== 'undefined') {
  obj = new ctor(); // 💣 cannot create an object of an abstract class
}
```

What a problem! TypeScript only knows at this point that we get a `FilterItem` back,
and we can't instantiate `FilterItem`. Since abstract classes mix type information and
actualy language (something that I try to avoid), a possible solution is to move to 
interfaces to define the actual type signature, and be able to create proper 
instances afterwards:

```javascript
interface IFilter {
  new (property: string: IFilter;
  someFunction(): void;
  filter(): void;
}

declare const filterMap: Map<string, IFilter>;
```

Note the `new` keyword. This is a way for TypeScript to define the type signature
of a constructor function.

Lots of 💣s start appearing now. No matter where you put the `implements IFilter`
command, no implementation seems to satisfy our contract:

```javascript
abstract class FilterItem implements IFilter { /* ... */ }
// 💣 Class 'FilterItem' incorrectly implements interface 'IFilter'.
// Type 'FilterItem' provides no match for the signature 
// 'new (property: string): IFilter'.

filterMap.set('number', AFilter)
// 💣Argument of type 'typeof AFilter' is not assignable 
// to parameter of type 'IFilter'. Type 'typeof AFilter' is missing 
// the following properties from type 'IFilter': someFunction, filter
```

What's happening here? Seems like neither the implementation, nor the
class itself seem to be able to get all the properties and functions
we've defined in our interface declaration. Why?

JavaScript classes are special: They have not only one type we could easily
define, but two types! The type of the static side, and the type of the instance
side. It might get clearer if we transpile our class to what it was before ES6:
a constructor function and a prototype:

```javascript
function AFilter(property) { // this is part of the static side
  this.property = property;  // this is part of the instance side
}

// instance
AFilter.prototype.filter = function() {/* ... */} 

// not part of our example, but instance
Afilter.something = function () { /* ... */ }
```

One type to create the object. One type for the object itself. So let's split
it up and create two type declarations for it:

```javascript
interface FilterConstructor {
  new (property: string): IFilter;
}

interface IFilter {
  someFunction(): void;
  filter(): void;
}
```

The first type `FilterConstructor` is the **constructor interface**. Here are all static properties,
and the constructor function itself. The constructor function returns an instance: `IFilter`.
`IFilter` contains type information of the instance side. All the functions we declare. 

By splitting this up, our subsequent typings also become a lot clearer:

```javascript
declare const filterMap: Map<string, FilterConstructor>; /* 1 */

filterMap.set('number', AFilter)
filterMap.set('stuff', BFilter)

let obj: IFilter;  /* 2 */
const ctor = filterMap.get('number')
if(typeof ctor !== 'undefined') {
  obj = new ctor('a');
}
```

1. We add `FilterConstructor`s to our map. This means we only can add classes that
   procude the desired objects.
2. What we want in the end is an instance of `IFilter`. This is what the constructor
   function returns when being called with `new`. 
   
Our code compiles again and we get all the auto completion and tooling we desire.
Even better: We are not able to add abstract classes to the map. Because they don't
procude a valid instance:

```javascript
// 💣 Cannot assign an abstract constructor 
//    type to a non-abstract constructor type.
filterMap.set('notworking', FilterItem)
```

Traditional OOP, weaved in into our lovely type system. ✅

*[Here's a playground with the full code](https://www.typescriptlang.org/play/index.html#code/JYOwLgpgTgZghgYwgAgGLADaSgYQPYgDOYUArgmHlMgN4CwAUMsiBAO7IAUADlHt9DABPAFzJiUUAHMAlGICS6LNADcjAL6NGobPCTJFmbLUbMYR6JznIAbnmAATNQ00NGcAEYTEYZAgxwhIRoFlDykAC2yMAR3BgQERDgwYbK1PRuTH4EEuSUUDySNnCQyLz8gqLiJNIyJpnMrqbInt4UyOZpVmJ2js5NDP6BwQDKNSBSSsYQAB6QIA7BU9DhCcwZzZ3YVvXMzAD0+8iUDnjN6sgaWplDQcgAcqQRHtDL1LPziyFpq1EbWVtLHUMntkIdjnhTudLi5rg4IEMoCgEDlfICoABZODcMRY7gAHgk0gANN9sPgiCQ8lQAHzORjovEAOkIEDAnAA5CAni8oBzSWNJBM3jIGaFmaz2Vy8GA2FQANbSflklaRUU3VEq6gAXg64uxTKkbM53Oe0A56uAME4wgEeBgWuQAEJtbqOaQFhBzKwHBbdtlKXq0shdawOG9OXALf0gA)*
