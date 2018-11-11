---
title: "TypeScript and React: Hooks"
layout: post-typescript
categories:
- typescript
published: true
next:
  title: Render props and child render props
  url: ../render-props/
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

## useState

`useState` is probably one you are going to use a lot. Instead of using `this.state` from class components, you can access the
current state of a component instance, and initialise it, with one single function call. Our desire for strong typing is that
values we intially set, get per component update, and set through events, always have the same type. With the provided 
typings, this works without any additional TypeScript:

```javascript
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
    <button onClick={() => setClicks(clicks-1)}>+</button>
  </>
}
```

And that's it. Your code works with out any extra type annotations, but still typechecks.

## useEffect


## useContext

`useContext` allows you to access context properties from anywhere in your components. Much like the `Context.Consumer`
does in class components. Type inference works brilliantly here, you don't need to use any TypeScript specific language
features to get everything done:

```javascript
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

```javascript
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

```javascript
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

