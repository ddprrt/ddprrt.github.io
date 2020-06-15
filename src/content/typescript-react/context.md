---
title: "TypeScript and React: Context"
layout: post-typescript
categories:
- TypeScript
published: true
next:
  title: Styles
  url: ../styles/
date: 2019-07-17
order: 7
---

React's context API allows you to share data on a global level. To use it, you need two things:

- A *provider*. Providers pass data to a subtree.
- *Consumers*. Consumers are components that *consume* the passed data inside render props

With React's typings, context works without you doing anything else. Everything is done using type inference and
generics. You *consume* all the implied type information which `@types/react` *produces* for you.

- [Create a context](#create-a-context)
- [Provide context](#provide-context)
- [Consume context](#consume-context)
- [Context without default values](#context-without-default-values)

## Create a context

Let's have a look! First, we create a context. The most important thing is to not forget default properties.

```typescript
import React from 'react';

export const AppContext = React.createContext({ 
  authenticated: true,
  lang: 'en',
  theme: 'dark'
});
```

And with that, everything you need to do in terms of types is done for you. We have three properties called
`authenticated`, `lang` and `theme`, they are of types `boolean` and `string` respectively. React's typings 
take this information to provide you with the correct types when you use them.

## Provide context

Our app component provides this context. It also sets values different from default values.

```typescript
const App = () => {
  return <AppContext.Provider value={ {
    lang: 'de',
    authenticated: true,
    theme: 'light'
  } }>
    <Header/>
  </AppContext.Provider>
}
```

Now, every component inside this tree can consume this context. You already get type errors when you forget a
property or use the wrong type:


```typescript

const App = () => {
  // ⚡️ compile error! Missing properties
  return <AppContext.Provider value={ {
    lang: 'de', 
  } }>
    <Header/>
  </AppContext.Provider>
}
```

Now, let's consume our global state.

## Consume context

Consuming context is done via render props (see the [previous chapter](../render-props/)) for more details). You can 
destructure you render props as deep as you like, to get only the props you want to deal with:

```typescript
const Header = () => {
  return <AppContext.Consumer>
  {
    ({authenticated}) => {
      if(authenticated) {
        return <h1>Logged in!</h1>
      }
      return <h1>You need to sign in</h1>
    }
  }
  </AppContext.Consumer>
}
```

Because we defined our properties earlier with the right types, `authenticated` is of type boolean at this point. Again
we didn't have to do anything to get this extra type safety.

## Context without default values

The whole example above works best if we have default properties and values. Sometimes, you don't have default values or
you need to be more flexible in which properties you want to set.

Generics for `createContext` and the `Partial` helper can help you greatly with that:

```typescript
import React from 'react';

// We define our type for the context properties right here
type ContextProps = { 
  authenticated: boolean,
  lang: string,
  theme: string
};

// we initialise them without default values, to make that happen, we
// apply the Partial helper type.
export const AppContext = 
  React.createContext<Partial<ContextProps>>({});

const Header = () => {
  return <AppContext.Consumer>
  {
    ({authenticated}) => {
      if(authenticated) {
        return <h1>Logged in!</h1>
      }
      return <h1>You need to sign in</h1>
    }
  }
  </AppContext.Consumer>
}

// Now, we can set only the properties we really need
const App = () => {
  return <AppContext.Provider value={ {
    authenticated: true,
  } }>
    <Header/>
  </AppContext.Provider>
}
```

There's a [StackBlitz](https://stackblitz.com/edit/react-ts-d4toch?file=index.tsx) you can check out.

And that's context! I think it's nicer to use with the [hooks](../hooks/#usecontext) API, but nevertheless, it's
incredibly useful!
