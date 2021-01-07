---
title: "Tidy TypeScript: Name your generics"
categories:
  - TypeScript
  - JavaScript
  - Tidy Typescript
---

My book [TypeScript in 50 Lessons](https://typescript-book.com) features interludes. Short texts on TypeScript culture that provide room to breathe between heavy, technical tutorials. One of those interludes gives some opinionated advice on how to name generic variables.

I want to recap this text piece and elaborate. And this series is called *Tidy TypeScript*, so expect an even more opinionated stance.

## Generic programming

TypeScript's generics are arguably one of the most powerful features of the language. They open a door to TypeScript's own meta-programming language, which allows for a very flexible and dynamic generation of types. It comes really close to being its own functional programming language, as Anders Hejslberg stated [in his 2020 TSConf keynote](https://www.youtube.com/watch?v=IGw2MRI0YV8).

Especially with the arrival of *string literal types* and *recursive conditional types* in the most recent TypeScript versions, we can craft types that do astonishing things. This little type parses Express-style route information and retrieves an object with all its parameters:

```typescript
type ParseRouteParameters<T> = 
  T extends `${string}/:${infer U}/${infer R}` ? 
    { [P in U | keyof ParseRouteParameters<`/${R}`>]: string } : 
  T extends `${string}/:${infer U}` ?
    { [P in U]: string } : {}


type X = ParseRouteParameters<"/api/:what/:is/notyou/:happening">
// type X = {
//   what: string,
//   is: string,
//   happening: string, 
// }
```

Powerful! (Dan shows a more elaborate version of this type over at his blog, [check it out](https://effectivetypescript.com/2020/11/05/template-literal-types/)).

When we define a *generic type*, we also define *generic type parameters*. That's the stuff between the angle brackets that we sometimes causally call *generics*.

They can be of a certain type (or more correct: be a certain sub-type):

```typescript
type Foo<T extends string> = ...
```

They can have default values:

```typescript
type Foo<T extends string = "hello"> = ...
```

And when using default values, *order* is important. Lots of similarities to regular JavaScript functions! So since we are almost talking functions, why are we using single-letter names for generic type parameters?


## Naming generic type parameters

Most generic type parameters start with the letter `T`. Subsequent parameters go along the alphabet (`U`, `V`, `W`), or are abbreviations like `K` for `key`.

As with almost any programming concept, the idea of Generics has been around for quite some time. Some major implementations of generic types can be seen in programming languages of the Seventies, such as *Ada* and *ML*.

I don't know if naming type parameters `T` has started back then, or if it was the popularity of the similar -- albeit more powerful -- templating concept in C++ that led us to generally calling them that way. The point is: We are doing that for a long time. We are used to it.

This can lead to highly unreadable types, however. If I look at `Pick<T, U>`, I can never tell if I pick keys `T` from object type `U`, or if it's object type `T`, where I pick keys `U`. 

Being a bit more elaborate helps a lot:

```typescript
type Pick<Obj, Keys> = ...
```

Note: The actual `Pick` type is much better defined in TypeScript (with `K extends keyof T`), but you get the idea. `Exclude`, `Extract`, `Record` ... all of them make me scratch my head.

So even though it's common to use single letter names for our generics, I think we can do better!

## A naming concept

Types are documentation, and our type parameters can have speaking names. Just like you would do with regular functions. This is the style guide I'm using:

1. All type parameters start with an uppercase letter. Like I would name all other types!
2. Only use single letters if the usage is completely clear. E.g. `ParseRouteParams` can only have one argument, the route.
3. Don't abbreviate to `T` (that's way too ... generic! 🤨), but to something that makes it clear what we are dealing with. E.g. `ParseRouteParams<R>`, where `R` stands for `Route`.
4. Rarely use single letters, stick to short words, or abbreviations. `Elem` for `Element`, `Route` can stand as it is.
5. Use prefixes where I need to differentiate from built-in types. E.g. `Element` is taken, I can use `GElement` (or stick with `Elem`)
6. Use prefixes to make generic names clearer `URLObj` is clearer than `Obj`, for instance.
7. Same patterns apply to inferred types within a generic type.

Let's look at `ParseRouteParams` again, and be more explicit with our names:

```typescript
type ParseRouteParameters<Route> = 
  Route extends `${string}/:${infer Param}/${infer Rest}` ? 
    { [Entry in Param | keyof ParseRouteParameters<`/${Rest}`>]: string } : 
  Route extends `${string}/:${infer Param}` ?
    { [Entry in Param]: string } : {}
```

It becomes a lot clearer what each type is meant to be. We also see that we need to iterate over all `Entries` in `Param`, even if `Param` is just a set of one type. 

Arguably, a lot more readable than before!

Counter arguments? Well, generic programming in TypeScript is close to functional programming. And you know that functional programming is where you name your functions *f*, your arguments *x*, and your patterns [Zygohistomorphic prepromorphism](https://wiki.haskell.org/Zygohistomorphic_prepromorphisms). 😜

You can read a lot more on generics, how generics work in TypeScript and what they are capable of in my book [TypeScript in 50 lessons](https://typescript-book.com).
