---
title: "Advanced TypeScript"
layout: post
categories:
- TypeScript
published: true
breadcrumbs:
- title: Home
  path: /
- title: Guides
  path: /guides/
permalink: /advanced-typescript-guide/
date: 2020-07-25
excludeFromTOC: true
---

You rarely learn Advanced TypeScript features just by themselves. Only when combined with other parts of the language and put in context they reveal their true power. And this is the focus of this guide.

This is a constantly updated collection of articles you can find on this site. Clustered by use-cases, detailing which technologies you use to achieve your goal.

While each article stands on its own I can recommend reading it like a book, as you see familiar concepts in a new light.

Ready? let's go!

**Last update**: July 6, 2021 at 19.000 words!

## Table of contents

- [TypeScript and JavaScript](#typescript-and-javascript): 6 articles
- [Control flow](#control-flow): 3 articles
- [Ambient declarations](#ambient-declarations): 4 articles
- [Working with generics](#working-with-generics): 4 articles
  
## TypeScript and JavaScript

TypeScript is a strict superset of JavaScript, and you can feel that with every line of TypeScript you write. I wrote a couple of articles looking at concepts in JavaScript and how they influenced the inner workings of TypeScript.

### [Boolean in JavaScript and TypeScript](/boolean-in-javascript-and-typescript/)

Boolean is a very boring type, but there's actually a lot to it, especially if you want to learn how the type-space in TypeScript works.

You learn:
- Union types
- `null` and `undefined` as types
- Value types (or literal types)


### [Symbol in JavaScript and TypeScript](/symbols-in-javascript-and-typescript/)

Symbols are a very *unique* type in JavaScript, as every created symbol can only exist once. TypeScript even has a keyword for that:

You learn:
- How Symbols work
- The `unique` keyword
- Run-time `enums`!

### [this in JavaScript and TypeScript](/this-in-javascript-and-typescript/)


*Sometimes when writing JavaScript, I want to shout "This is ridiculous!". But then I never know what `this` refers to*. All about `this` and how to type it.

You learn:
- `this`!
- `this` parameters
- `ThisParameterType`, `OmitThisParameter`, `ThisType` helpers

### [void in JavaScript and TypeScript](/void-in-javascript-and-typescript/)

`void` is a very special case of undefined, that not only exists in TypeScript, but also in JavaScript!

You learn:
- The relation of `undefined` and `void`, and how it stems from JavaScript
- A bit on substitutability

### [Substitutability](/typescript-substitutability/)

Substitutability is a concept in TypeScript that makes sure that functions that are passed as values are type-safe even though the signature is not 100% the same.

You learn:
- Substitutability for `void`
- Substitutability for functions with different function signatures

### [The constructor interface pattern](/typescript-interface-constructor-pattern/)

Classes in JavaScript are little more than syntactic sugar for the old prototype and constructor function pattern that exists for ages. That's why TypeScript also needs two types to describe classes!

You learn:
- Two types for classes: Constructor function and prototype
- The `new` keyword in types

## Control Flow

Control flow is one of the biggest concepts in TypeScript. TypeScript will take all the type information and all your branching statements (`if` and `switch`) to figure out what type your variables have at a certain part in your code. You can influence control flow.

### [Type predicates](/typescript-type-predicates/)

Type predicates are *custom type guards* where you can decide to make the type of your input more concrete. We look at an easy example to see what *narrowing down* means.

You learn:
- Custom type guards
- Union types

### [Type predicates for hasOwnProperty](/typescript-hasownproperty/)

We create a custom `hasOwnProperty` function that changes the shape of the current object significantly!

You learn:
- `Records`
- Type predicates
- `unknown` type

### [Assertion signatures](/typescript-assertion-signatures/)

Assertion signatures are similar to type predicates, but they work outside branching statements. In this example, we create our own `defineProperty` function where we can add properties to the type we originally defined.

You learn:
- Conditional types
- Assertion signatures
- Property Descriptor

## Ambient declarations

TypeScript has *a ton* of built-in types, all describing what's going on in the world of JavaScript. But what if something is missing? We can declare our environment without having the actual code to it. This is what we do in this example.

### [Improving Object.keys](/typescript-better-object-keys/)

This is a direct continuation of the last two examples in the last chapter. This time, we posh up `Object.keys` a little, and we are not creating a helper function, but patch the original `ObjectConstructor`.

You learn:
- Conditional types
- The `keyof` operator
- The `ObjectConstructor` interface
- Interface declaration merging

### [Array.prototype.includes on narrow types](/typescript-array-includes/)

Similar to the two above, you are going to check if you can modify `Array.prototype.includes` to work in situations where your array is alrady very narrow!

You learn
- Interface declaration merging
- Type predicates
- Type assertions

### [Ambient file modules](/typescript-modules-for-webpack/)

What if the file you import isn't a JavaScript or TypeScript file? This can happen in Webpack, for example. Thankfully, TypeScript has a way to describe *any* file and which types to expect.

You learn:
- Wildcard module declarations
- Module declarations for SVG, CSS, MDX, and more!

### [Extending JSX Elements](/typescript-react-extending-jsx-elements/)

What if you need to use a web component in JSX, but you get type errors because React doesn't know about the components you use? You can extend the React types that you import with the information for your environment.

You learn:
- Module re-declarations
- Namespace declaration merging
- Interface declaration merging

### [Augmenting global](/typescript-augmenting-global-lib-dom/)

Type information for all the DOM APIs and `window` is stored in the global object. If we miss something, we can add info to the `global` namespace. We do this by adding a DOM API that will appear at some time in TypeScript once it's stable enough: Resize Observer.

You learn:
- WIDL
- The `global` namespace

## Working with Generics

Generics are immensely powerful in TypeScript, especially combined with conditional types. Here we look at some 

### [Type maps](/typescript-type-maps/)

Type maps are a container type that contains a set of key-value entries that are very similar to plain JavaScript objects. Together with index types and mapped types, we can have a great lookup table!

You learn:
- Index types
- Type maps
- Conditional types

### [Match the exact object shape](/typescript-match-the-exact-object-shape/)

TypeScript is a structural type system, which means that as long as all required properties of an object are available and have the correct type, TypeScript is happy. This can lead to some side effects if there are excess properties. Rarely, but possible! We work on a helper type that gets rid of excess properties.

You learn:
- Conditional types
- `never` type
- `Exclude`

### [Variadic tuple types](/variadic-tuple-types-preview/)

Variadic tuple types are a generic type pattern where you can define a sub-set of a tuple type in a generic type variable. What does that even mean? We take a good look at it in this article.

You learn:
- Tuple types
- Variadic tuple type generics
- Conditional types

### [Union to Intersection type](/typescript-union-to-intersection/)

There are some cases where you need to transform a union type to an intersection type. We see how we can use distributive conditional types and contra-variance to do so.

You learn:
- Union and intersection types
- Distributive conditional types
- Co-variance and Contra-variance
