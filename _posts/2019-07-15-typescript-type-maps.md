---
layout: post
categories:
  - TypeScript
published: true
permalink: /typescript-type-maps/
title: "TypeScript: Mapped types for type maps"
---

Factory functions are a popular tool in JavaScript to create a diversity of objects with just one call.
There's a particular factory function that you might have used at some point:

```javascript
document.createElement('video') // creates an HTMLVideoElement
```

`document.createElement` takes any string and creates `HTMLElement` instances. `HTMLElement` is probably one
of the most derived objects in the DOM. Every tag name that is known to the browser creates it's on
derivate. For example `document.createElement('video')` creates an instance of `HTMLVideoElement`.

But how do we type a factory function like that? One that has a couple of dozen different return types? Let's try.

## With conditional types

The original typings for `document.createElement` take a string as parameter (let's ignore the options for now),
and returns an object of type `HTMLElement`:

```javascript
declare function createElement(tag: string, options?: any): HTMLElement
```

This is true, but not specific enough. We can be a lot more specific, since we know which tags implement which
`HTMLElement` derivates.

The first thing that came into my mind were conditional types. They were made for use cases like that! 
We know that `tag` is a subset of string, and more important: we know exactly which subset! The collection of 
tags available in your browser.

A possible generic type for the `createElement` factory function could look like this:

```javascript
type CreatedElement<T extends string> =    /** 1 **/
  T extends 'a' ? HTMLAnchorElement :      /** 2 **/
  T extends 'div' ? HTMLDivElement :
  T extends 'video' ? HTMLVideoElement :
  HTMLElement;                             /** 3 **/
```

Let's go over this definition in detail:

1. We start with a generic type `CreatedElement<T>`. The generic placeholder `T` has to be a subset of string
2. We then test for a specific **unit** type from the `string` subset. For example, the string `"a"` is of type `string`,
   but also of type `"a"`. You can think of `string` as the universe of all possible string unit types. If our generic
   placeholder `T` extends this particular subset of `"a"`, we know that the result has to be of type `HTMLAnchorElement`.
   The *else* branch starts a cascade through all known HTML tags. In our example, we know of `div` and `video`.
3. At the end of this cascade, when we went through all known HTML tags, we return the generic `HTMLElement` as a fallback.
   This is totally in tune with the way `createElement` works. When you create an element with a tag the browser doesn't know,
   you get at least an `HTMLElement`.

So far, so good. This even looks like a map from string to HTMLElement derivate. Now the only thing we have to do is 
to extend this list with all available tags and return the respective element instance. We can even use things like union types to 
help with types that implement more than one tag:

```javascript
type CreatedElement<T extends string> = 
  T extends 'a' ? HTMLAnchorElement :  
  T extends 'div' ? HTMLDivElement :
  T extends 'video' ? HTMLVideoElement :
  T extends 'thead' | 'tfoot' | 'tbody' ? HTMLTableSectionElement : /** 1 **/
  HTMLElement; 
```

1. All three of `thead`, `tbody` and `tfoot` implement `HTMLTableSectionElement`. We can use a union type of all three unit types
   to identify `HTMLTableSectionElement`

The solution is good and robust, but has one catch. A rather big one. The amount of comparisions is finite. Even though this looks like
a map of types, in reality it's a nested comparision chain:

```javascript
type CreatedElement<T extends string> = 
  T extends 'a' ? HTMLAnchorElement :  
    T extends 'div' ? HTMLDivElement :
      T extends 'video' ? HTMLVideoElement :
        T extends 'thead' | 'tfoot' | 'tbody' ? HTMLTableSectionElement :
          HTMLElement; 
```

So it's nested. This also means that with every further comparision, there has to be reference to the original 
comparison. Internally, this can be best done via a recursion. And recursions take up memory. 

This is why TypeScript gives you a hard limit of 50 nested comparisons to make sure memory and performance
goals are met. If you extend your list beyond 50 comparisions, you get the error 
**"Type instantiation is excessively deep and possibly infinite"**. Check out the issue [#28663](https://github.com/microsoft/TypeScript/issues/28663) on
Github.

So that doesn't solve our problem in the long run. So what shall we do?

## Mapped types

To find a proper solution for that problem, let's think for one moment how you would've implemented the
`document.createElement` factory function yourself in JavaScript.
I would have used an object, where each key corresponds to the correct implementation.
And I would've indexed the object dynamically with an index access. Something like that:

**NOTE: This does not work. This is just for demonstration purposes**

```javascript
const elementMap = {
  a: HTMLAnchorElement,
  div: HTMLDivElement,
  video: HTMLVideoElement
}

function createElement(tag) {
  const constr = elementMap[tag];
  if(constr) {
    return new constr();
  }
  return new HTMLElement();
}
```

This obviously doesn't work, that's what the `document.createElement` factory function is for. But it illustrates
the way of accessing via the index access operator rather nice. Since every key in an object can be accessed using a
string, we select the right constructor out of this list, and create a new instance. If we don't have a constructor,
let's create a generic `HTMLElement`.
