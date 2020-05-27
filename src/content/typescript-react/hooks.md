---
title: "TypeScript and React: Hooks"
layout: post-typescript
categories:
- TypeScript
published: true
next:
  title: Render props and child render props
  url: ../render-props/
date: 2019-07-17
order: 5
---

Hooks have been announced at React Conf 2018. Check out [this page](https://reactjs.org/docs/hooks-intro.html) for more
details. I think they're pretty awesome. Probably game-changing! Hooks heave formerly "stateless" functional components to
... basically everything traditional class components can be. With a much cleaner API!

Just quickly after their release in React 16.7., React typings in DefinitelyTyped got an update as well. Check out how you 
can use hooks with TypeScript!

**Disclaimer**: This is all very experimental. Sweet nonetheless.


In this section:

1. [useState](#usestate)
2. [useEffect](#useeffect)
3. [useContext](#usecontext)
4. [useRef](#useref)
5. [useMemo and useCallback](#usememo---usecallback)
6. [useReducer](#usereducer)

## useState

`useState` is probably one you are going to use a lot. Instead of using `this.state` from class components, you can access the
current state of a component instance, and initialise it, with one single function call. Our desire for strong typing is that
values we initially set, get per component update, and set through events, always have the same type. With the provided 
typings, this works without any additional TypeScript:

```typescript
// import useState next to FunctionComponent
import React, { FunctionComponent, useState } from 'react';

// our components props accept a number for the initial value
const Counter:FunctionComponent<{ initial?: number }> = ({ initial = 0 }) => {
  // since we pass a number here, clicks is going to be a number.
  // setClicks is a function that accepts either a number or a function returning
  // a number
  const [clicks, setClicks] = useState(initial);
  return <>
    <p>Clicks: {clicks}</p>
    <button onClick={() => setClicks(clicks+1)}>+</button>
    <button onClick={() => setClicks(clicks-1)}>-</button>
  </>
}
```

And that's it. Your code works with out any extra type annotations, but still typechecks.

## useEffect

`useEffect` is here for all side effects. Adding event listeners, changing things in the document, fetching data. 
Everything you would use component lifecycle methods for (`componentDidUpdate`, `componentDidMount`, `componentWillUnmount`)
The method signature is pretty straightforward. It accepts two parameters:

- A function that is called without any parameters. This is the side-effect you want to call.
- An array of values of type `any`. This parameter is optional. If you don't provide it, the function provided is called 
  every time the component update. If you do, React will check if those values did change, and triggers the function only
  if there's a difference. 

```typescript
// Standard use case.
const [name, setName] = useState('Stefan');
useEffect(() => {
  document.title = `Hello ${name}`;
}, [name])
```

You don't need to provide any extra typings. TypeScript will check that the method signature of the function
you provide is correct. This function also has a return value (for cleanups). And TypeScript will check that you provide
a correct function as well:

```typescript
useEffect(() => {
  const handler = () => {
    document.title = window.width;
  }
  window.addEventListener('resize', handler);

  // ⚡️ won't compile
  return true;

  // ✅  compiles
  return () => {
    window.removeEventListener('resize', handler);
  }
})
```

This also goes for `useLayoutEffect` and `useMutationEffect`.

## useContext

`useContext` allows you to access context properties from anywhere in your components. Much like the `Context.Consumer`
does in class components. Type inference works brilliantly here, you don't need to use any TypeScript specific language
features to get everything done:

```typescript
import React, { useContext } from 'react';

// our context sets a property of type string
export const LanguageContext = React.createContext({ lang: 'en' });

const Display = () => {
  // lang will be of type string
  const { lang } = useContext(LanguageContext);
  return <>
    <p>Your selected language: {lang}</p>
  </>
}
```

Again, as it should be!

## useRef

`useRef` is nice as you can set references directly in your function components. However, this was the first time I found
hooks together with TypeScript a bit tricky! When you are in strict mode, TypeScript might complain:

```typescript
import React, { useRef } from 'react';
function TextInputWithFocusButton() {
  // it's common to initialise refs with null
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // ⚡️ TypeScript in strict mode will complain here, 
    // because inputEl can be null!
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

Here's what bugs us:

- usually we initialise refs with null. This is because we set it later in our JSX calls
- with the initial value of a ref being null, inputEl might be null. TypeScript complains that you should do a strict
  null check.

That's not the only thing. Since TypeScript doesn't know which element we want to refer to, things like `current` and
`focus()` will also probably be null. So our strict null checks are pretty elaborate. We can make this a ton easier
for us and for TypeScript, when we know which type of element we want to ref. This also helps us to not mix up element types 
in the end:

```typescript
function TextInputWithFocusButton() {
  // initialise with null, but tell TypeScript we are looking for an HTMLInputElement
  const inputEl = useRef<HTMLInputElement>(null);
  const onButtonClick = () => {
    // strict null checks need us to check if inputEl and current exist.
    // but once current exists, it is of type HTMLInputElement, thus it
    // has the method focus! ✅
    if(inputEl && inputEl.current) {
      inputEl.current.focus();
    } 
  };
  return (
    <>
      { /* in addition, inputEl only can be used with input elements. Yay! */ }
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

A bit more type safety for all of us ❤️


## useMemo - useCallback

You know from `useEffect` that you can influence the execution of certain functions by passing some parameters to it.
React checks if those parameters have changed, and will execute this function only if there's a difference.

`useMemo` does something similar. Let's say you have computation heavy methods, and only want to run them when their parameters
change, not every time the component updates. `useMemo` returns a memoized result, and executes the callback function only
when parameters change. 

To use that with TypeScript, we want to make sure that the return type from `useMemo` is the same as the return type from
the callback:

```typescript
/**
 *  returns the occurence of if each shade of the 
 *  red color component. Needs to browse through every pixel 
 *  of an image for that.
 */
function getHistogram(image: ImageData): number[] {
  // details not really necessary for us right now 😎
  ...
  return histogram;
}

function Histogram() {
  ...
  /*
   * We don't want to run this method all the time, that's why we save
   * the histogram and only update it if imageData (from a state or somewhere)
   * changes.
   *
   * If you provide correct return types for your function or type inference is
   * strong enough, your memoized value has the same type.
   * In that case, our histogram is an array of numbers
   */
  const histogram = useMemo(() => getHistogram(imageData), [imageData]);
}
```

The React typings are pretty good at that, so you don't have to do much else.

`useCallback` is very similar. In fact, it's a shortcut that can be expressed with `useMemo` as well. But it returns a 
callback function, not a value. Typings work similar:

```typescript
const memoCallback = useCallback((a: number) => {
  // doSomething
}, [a])

// ⚡️ Won't compile, as the callback needs a number
memoCallback();

// ✅ compiles
memoCallback(3);
```

The key here is: Get your typings right. The React typings do the rest.

## useReducer

Now this is something, isn't it? The core of Redux and similar state management libraries baked into a hook. Sweet and
easy to use. The typings are also pretty straightforward, but let's look at everything step by step. We take the example
from the website, and try to make it type safe.

```typescript
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter({ initialCount = 0}) {
  const [state, dispatch] = useReducer(reducer, { count: initialCount });
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'reset' })}>
        Reset
      </button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}
```

`useReducer` accepts a reducer function and an initial state. The reducer function switches the `action.type` 
property and selects the respective action. Nothing new. It's just that right now, everything is of type `any`.
We can change that.

The `useReducer` typings are nice as you don't have to change anything in the usage of `useReducer`, but can control
everything via type inference from the reducer function. Let's start by making the actions more type safe. Here's what we 
want to avoid:

- listening to actions that are not `reset`, `increment` or `decrement`
- Making sure that the `type` property is set.

For that, we create an `ActionType` type definition. We use union types to make sure that `type` can only be of 
`reset`, `increment` or `decrement`.

```typescript
type ActionType = {
  type: 'reset' | 'decrement' | 'increment'
}

const initialState = { count: 0 };

// We only need to set the type here ...
function reducer(state, action: ActionType) {
  switch (action.type) {
    // ... to make sure that we don't have any other strings here ...
    case 'reset':
      return initialState;
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter({ initialCount = 0 }) {
  const [state, dispatch] = useReducer(reducer, { count: initialCount });
  return (
    <>
      Count: {state.count}
      { /* and can dispatch certain events here */ }
      <button onClick={() => dispatch({ type: 'reset' })}>
        Reset
      </button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}
```

That's not much to do, to make our actions type safe. If you want to add another action, do it at your type declaration.
It's the same with the state. The `useReducer` typings infer state types from the reducer function:

```typescript
type StateType = {
  count: number
}

function reducer(state: StateType, action: ActionType) {
  ...
}
function Counter({ initialCount = 0 }) {
  // ⚡️ Compile error! Strings are not compatible with numbers
  const [state, dispatch] = useReducer(reducer, { count: 'whoops, a string' });
  ...
  // ✅ All good
  const [state, dispatch] = useReducer(reducer, { count: initialCount });
  ...
}
```

## Bottom line

I think hooks are exciting. I also think that TypeScript's great generics and type inference features are a perfect
match to make your hooks type safe, without doing too much. That's TypeScript's greatest strength: Being as little
invasive as possible, while getting the most out of it.
