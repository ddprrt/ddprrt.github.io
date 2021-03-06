---
layout: post
categories:
  - TypeScript
published: true
permalink: /typescript-type-maps/
title: "TypeScript: Mapped types for type maps"
---

Factory functions are a popular tool in JavaScript to create a diversity of objects with a single call.
There's a particular factory function that you might have used at some point:

```typescript
document.createElement('video') // creates an HTMLVideoElement
```

`document.createElement` takes any string and creates `HTMLElement` instances. `HTMLElement` is one
of the most derived objects in the DOM. Every available tag creates it's on
derivate. For example `document.createElement('video')` creates an instance of `HTMLVideoElement`.

But how do we type a factory function like that? One that has a couple of dozen different return types? Let's try.

**NOTE: TypeScript with the `dom` library activated in `tsconfig.json` knows of all `HTMLElement` derivates**.

## With conditional types

The original typings for `document.createElement` take a string as parameter,
and returns an object of type `HTMLElement`:

```typescript
declare function createElement(tag: string, options?: any): HTMLElement
```

This is true, but not specific enough. We can be a lot more specific, since we know which tags implement corresponding
`HTMLElement` derivates.

The first thing that came into my mind were conditional types. They were made for use cases like that! 
We know that `tag` is a subset of string, and more important: we know exactly which subset! The collection of 
tags available in your browser.

A possible generic type for the `createElement` factory function could look like this:

```typescript
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

```typescript
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

```typescript
type CreatedElement<T extends string> = 
  T extends 'a' ? HTMLAnchorElement :  
    T extends 'div' ? HTMLDivElement :
      T extends 'video' ? HTMLVideoElement :
        T extends 'thead' | 'tfoot' | 'tbody' ? HTMLTableSectionElement :
          HTMLElement; 
```

So it's nested. This also means that with every further comparision, there has to be reference to the original 
comparison. Internally, this can be best done via a recursion. And recursions take up memory. 

This is why TypeScript gives you a hard limit of **50 nested comparisons** to make sure memory and performance
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

```typescript
const elementMap = {
  a: HTMLAnchorElement,
  div: HTMLDivElement,
  video: HTMLVideoElement
}

function createElement(tag) {
  return tag in elementMap ? new elementMap[tag]()
    : new HTMLElement()
}
```

This obviously doesn't work, that's what the `document.createElement` factory function is for. But it illustrates
the way of accessing via the index access operator rather nice. Since every key in an object can be accessed using a
string, we select the right constructor out of this list, and create a new instance. If we don't have a constructor,
let's create a generic `HTMLElement`.

In TypeScript, we can create types that work in a similar manner. First, let's create the `AllElements` type which is
a map of all tags to their corresponding `HTMLElement` derivate:

```typescript
type AllElements = {
  'a': HTMLAnchorElement,
  'div': HTMLDivElement,
  'video': HTMLVideoElement,
  ... //extend as you need
}
```

This is what I like to call a **type map**. We *could* use this type to create an object of type `AllElements`,
but in reality we most likely won't need that. We only use this type as an helper type for `CreatedElement`:

```typescript
type CreatedElement<T extends string> = 
  T extends keyof AllElements ? AllElements[T] : /** 1 **/
  HTMLElement;                                   /** 2 **/
```

1. The type signatur is the same as in the previous example. The generic placeholder `T` extends from `string`.
   But now we check if `T` is somewhere in the keys of `AllElements`. If so, we index the type that is stored
   with this particular key `T`. That's how we get the correct derivate!
2. In all other cases, we have "just" an `HTMLElement`.

Do you see how similar this type definition is to the JavaScript example above? Of course the way I wrote 
JavaScript earlier is just one way to express myself, and I used it deliberately to show the similarities
with conditional types. But it shows how close TypeScript tries to be to JavaScript in terms of syntax and
semantics.

The cool thing is: We are just moving in type space. No source created, just information to make your 
code a lot safer. Like that:

```typescript
declare function createElement<T extends string>(tag: T, options?: any): CreatedElement<T>
```

We can use the function like that:

```typescript
createElement('video') // It's an HTMLVideoElement
createElement('video').src = '' // `src` exists
createElement('a').href = '' // It's an HTMLAnchorElement with an `href`
```

We can even write our own factory functions, that can do a little more that *just* creating elements:

```typescript
function elementFactory<T extends string>(tag: T, 
  defaultProps: Partial<CreatedElement<T>>) : CreatedElement<T> {

  const element = createElement(tag);
  return Object.assign(element, defaultProps)
}
```

This factory takes a couple of default properties that need to be available in the
generated output element. So things like:

```typescript
elementFactory('video', { src: '' });
```

Can even be autocompleted. And TypeScript warns you if you want to specify a property
that does not exist:

```typescript
elementFactory('video', { source: '' }) // 💥 Error: this property does not exist
```

Pretty sweet, huh?

## Bottom line

Type maps are a good tool for factory functions which produce a ton of different results. And most likely
for a lot, lot more. If you want to expand on the example shown above, take this [gist](https://gist.github.com/ddprrt/61644bdbbb48e577ca54fdb2ee16ed56). And look at [this playground](https://www.typescriptlang.org/play/index.html?ssl=85&ssc=2&pln=80&pc=1#code/C4TwDgpgBAggNnAonCBbCA7YBnKBeKKAbwFgAoQgcgENKAuKACQBUBZAGRgwGMALAewBOyNJmABuclQAmASwBu9Jm3YARBSPRZJFKJWxhqGJSw4BlQxk1idVAK5wTKgKrtZ2YNe1Qpe4LOAUJw5mAJQvCV9KYAgAD2BqQQhaBlN2ZjjgGCTqCNs-NDA4ahjg9MLimLyo4AAzfn5gMuZqACMUMwhuf34rFC1I3WjeZOlmto6unr7RbRrW-mkQcfaITu7ZXuqh4EEVlAAlfgB3baoE1f2IM71ufkdUlRbVgGF7m8o7uABzQX47MBXN5Ifo2Gq8K6MUYQQQvCAID7AMaPEITCCqErUOEI0FzIbcahgaZAwnTD4eEBBFHsMygcK4wZUbDwqZlToobrk7iCWREtnc3meBn5SjtfjcADWAEc7I0IGUAIqyqrCqJSxXK66qoZgP6-CDYbBlAAKeqSho+uvl1NNWtmjL0hkE1FQJsSLstbudv0JvA+-2AYDsTWpAHlg0GhfaRfwiZtjGG41ttVRY8Bfv9AYngABxP4A-2tABWrLDxam-oeyg4obcHg+sgwRuprEWH2k8LKrekH3QMT2LYg-d7Q5S1fYrFHvcSMog1vHrBndjn06zC8JH3ksg7-DKADVtxB+B9qHY5LvqTAz5sPnBGxKym4MBLbxBvphkeP2G+P7e2p3qXYf8QWjKI70fABJBsMEjMoIJg4MG1Qb44NQah3wbWpnXQOCADFsLtAYRV4YBUCrNJGFIkCiKiXgAEYyihag5Awb4Pl4AAmRjRkbNiUz0XgAGZuOY3j2IAFhEli+NAoZeAAViksT+MoXgADYlNY9jRik9iB3HRgDg+LCXQNIcynw0zOijGihhMnDqUs9BjKEV1HNclysAs3obLBOzZHhaRmRDcdcICuBpGsj40FaCBPzSRBUFinsVOkTE7w8MoMQSOtfLxGRyJUVRco+AkMHkahm3HF4jAq7APlaYNgF6MoACEmuTWSqAWJY2sWEAGsq+c0laoaGv0kajJUxJkjKbJkgicgAF9yHIUBICgF4chiaQEoZAAeZgoEyD9cAlCAQH4WpYBxe1sAAPnwG7qLEbAAG1mAAXR0NbwGgLbkh2iJDuO+JTqgDweVYx68F8I6TowIKoHOy7rvgF6sFwAB+Tbtrivb7UOx7qW2cgO24YokigWo7B4aYoG5QHCLEEGEaRyHePugAKBJvgYZgABooDTeNsCxhgjBAABKBgAZKOLgeYe7VrIGm6fjY6GVw6huiEEBWbBxHcA56GefQ-mhd8DtalPOBgFNWNsAYY1En8ag4H2uWgYOpX7qlqBZbxlLCaV4gVcIO4m2ATX7Sexn5YiM3vil-IkmAOxBAwKBQ3LboADpKuwWRvgwLmWQGIXrdt+2-jAbApeWlXy7EbXdcEEAucoLcd0oIWiAhwRuAYShKCgJaU-IZusFb5r2877uj174gIf+QeIGH0fx6gAB6beoEAXg3AFKdqBEEEP5BAYYBeHcKBdVjGFQCgaR+ANKAMEaUH3GAcggA) to play around.

 
