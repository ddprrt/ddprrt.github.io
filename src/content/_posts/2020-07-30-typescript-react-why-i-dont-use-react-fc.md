---
title: "TypeScript + React: Why I don't use React.FC"
categories:
- TypeScript
- React
- Preact
---

In my recent article on [TypeScript and React component patterns](/typescript-react-component-patterns/) I've stated that I don't use the built-in type `React.FC<>` but rather be explicit with typing children. I didn't state why, and it sparked some interest. That's why I want to elaborate a little bit.

Please note that this is just an opinion, not a suggestion or anything else. If you like to use `React.FC` and it works for you, please continue to do so! That's totally fine and sometimes I do so as well! And let's be serious: There are different problems out there that need discussion and are more enough a reason to get angry. So don't waste your time getting too emotional about code styles. But if you like to get new ideas, please continue!

Hat tip to [Martin Hochel](https://twitter.com/martin_hotell) who wrote about *not* using `React.FC` ages ago in his [piece on component patterns](https://levelup.gitconnected.com/ultimate-react-component-patterns-with-typescript-2-8-82990c516935).

## What's React.FC<>?

In React you have two ways of defining components. 

1. Writing a class and extending from `Component`
2. Writing a function and returning JSX

Since React was not written in TypeScript, the community provides types with the `@types/react` package. In there is a generic type called `FC` that allows us to type our function components, like this:

```typescript
import React, { FC } from "react";

type GreetingProps = {
  name: string;
}

const Greeting:FC<GreetingProps> = ({ name }) => {
  // name is string!
  return <h1>Hello {name}</h1>
};
```

Personally, I think the type is excellent as it covers *everything* that function components can be and allow in just a couple lines of code:

```typescript
interface FunctionComponent<P = {}> {
  (props: PropsWithChildren<P>, context?: any)
    : ReactElement<any, any> | null;
  propTypes?: WeakValidationMap<P>;
  contextTypes?: ValidationMap<any>;
  defaultProps?: Partial<P>;
  displayName?: string;
}
```

See [GitHub for reference](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L546). Still, I'm not using it. So why?

##  1. You type a function, not its arguments

`React.FC` types a function. That's in its name, *function component*. Function types are really hard to apply to regularly named functions. Where do you put the function type in code like this:

```typescript
function Greeting({ name }) {
  return <h1>Hello {name}</h1>
}
```

You can use an anonymous function and assign it to a const/variable:

```typescript
const Greeting:FC<GreetingProps> = function({ name }) {
  return <h1>Hello {name}</h1>
}
```

Or use arrow functions like in the example above. But we totally exclude simple, regular functions.

If we don't type functions, but rather its properties, we can use *any* form of functions to achieve our goal:

```typescript
// ✅
function Greeting({ name }: GreetingProps) {
  return <h1>Hello {name}</h1>
}
```

And yes, even in times of arrow functions and transpilation, writing regular, old, boring, working, and simple named functions is totally valid! And nice!

## 2. FC<> always imply children

This is also an argument Martin makes in his original article. Typing with `React.FC<>` opens your components for children. For example:

```typescript
export const Greeting:FC<GreetingProps> = ({ name }) => {
  // name is string!
  return <h1>Hello {name}</h1>
};

// use it in the app
const App = () => <>
  <Greeting name="Stefan">
    <span>{"I can set this element but it doesn't do anything"}</span>
  </Greeting>
</>
```

If I use simple props instead of `FC`, TypeScript tells me that I pass along children even if my component tells me that I shouldn't.

```typescript
function Greeting({ name }: GreetingProps) {
  return <h1>Hello {name}</h1>
}
const App = () => <>
  <Greeting name="Stefan">
    {/* The next line throws errors at me! 💥*/}
    <span>{"I can set this element but it doesn't do anything"}</span>
  </Greeting>
</>
```

And to be fair, handling children types is not TypeScript's strength. But getting at least the information that there shouldn't be children in the first place helps.

Be explicit. State that your component is using children when it really needs to! I wrote a `WithChildren` helper type for that.

```typescript
type WithChildren<T = {}> = 
  T & { children?: React.ReactNode };

type CardProps = WithChildren<{
  title: string
}>

function Card({ title, children }: CardProps) {
  return <>
    <h1>{ title }</h1>
    {children}
  </>
}
```

Works just as well and has one big benefit...

## 3. Easier to move to Preact

If you are not using Preact, you should! It does the same thing, the `preact/compat` package makes sure you are compatible with the React ecosystem. You can save up to 100 KB of production size and you are using an independent library!

Recently I started moving all my React projects to Preact. Preact is written in TypeScript (with JSDoc annotations), so you get all the good typing information with an installation of Preact. Everything from `@types/react` isn't compatible anymore. Since `React.FC` is tacked on, you would need to refactor all your existing code to something that, well, would mimic simple functions with typed props anyways.

```typescript
// The Preact version
type WithChildren<T = {}> = 
  T & { children?: VNode };
```

## 4. React.FC<> breaks defaultProps

`defaultProps` is a relic from class-based React where you were able to set default values to your props. With function components, this is now basic JavaScript as [you can see here](/typescript-react-component-patterns/#default-props). Still, you might get into some situations where setting `defaultProps` (or other static properties) is still necessary.

Since version 3.1, TypeScript has a mechanism to understand `defaultProps` and can set default values based on the values you set. However, `React.FC` types `defaultProps`, and thus breaks the connection to use them as default values. So this one breaks:

```typescript
export const Greeting:FC<GreetingProps> = ({ name }) => {
  // name is string!
  return <h1>Hello {name}</h1>
};

Greeting.defaultProps = {
  name: "World"
};

const App = () => <>
  {/* Big boom 💥*/}
  <Greeting />
</>
```

Not using `FC` but just a function (regular, named, anonymous, arrow, whatever) with typed props works!

```typescript
export const Greeting = ({ name }: GreetingProps) => {
  // name is string!
  return <h1>Hello {name}</h1>
};

Greeting.defaultProps = {
  name: "World"
};

const App = () => <>
  {/* Yes! ✅ */}
  <Greeting />
</>
```

## 5. Future-proof

Remember when everybody called function components *stateless function components*. Yeah, with the introduction of hooks we suddenly had lots of state in our function components. This reflected in the `SFC` type that is now `FC`, and who knows, could change in the future as well. Typing your arguments (props), and not the function itself, keeps you away from changing function types. 

## Bottom line

So those are a couple of arguments I have to not use `React.FC`. That being said, I think it's totally legit and fine to use `React.FC` if it's good and well for your workflow. I've been using it a lot in the past and well, it works! So please don't feel pushed to change your coding style if you can run with it. 

But maybe you see that typing props can be much simpler, much closer to JavaScript. And maybe this suits your coding style more!
