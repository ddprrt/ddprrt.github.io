---
title: "TypeScript and React: Components"
layout: post-typescript
categories:
- typescript
published: true
---

Components are at the heart of React. Let's see what we can do to get better error handling and tooling for them!

## Stateless functional components - SFC

SFCs are my most favourite thing in React. They are simple, purely functional and super easy to reason about. 
The following shows an example of a stateless functional component with some typed properties.

```javascript
import React from 'react'; // we need this to make JSX compile

type CardProps = {
  title: string,
  paragraph: string
}

export const Card = ({ title, paragraph }: CardProps) => <aside>
  <h2>{ title }</h2>
  <p>
    { paragraph }
  </p>
</aside>

const el = <Card title="Welcome!" paragraph="To this example" />
```

We use as little TypeScript as possible. Creating a type for our properties, and telling TypeScript that the
parameters of our functional component are of that type. You already get nice suggestions in VS Code:

![Autocompletion in VS Code](../img/autocomplete.png)

And errors when you compile without passing all required properties:

![Error message in command line](../img/errormsg.png)

If you want to make some properties optional, do that in the respective Props type:

```javascript
type CardProps = {
  title: string,
  paragraph?: string  // the paragraph is optional
}
```

My personal prefered way of using SFCs in TypeScript is by using the generic type provided by the official typings:


```javascript
import React, { SFC } from 'react'; // importing SFC

type CardProps = {
  title: string,
  paragraph: string
}

export const Card: SFC<CardProps> = ({ title, paragraph }) => <aside>
  <h2>{ title }</h2>
  <p>
    { paragraph }
  </p>
</aside>

const el = <Card title="Welcome!" paragraph="To this example" />
```

The parameters of our function are infered from the generic SFC. Other than that, 
it seems very similar to the first example. However, it allows for optional child components:


```javascript
type CardProps = {
  title: string,
  paragraph: string
}

// we can use children even though we haven't defined them in our CardProps
export const Card: SFC<CardProps> = ({ title, paragraph, children }) => <aside>
  <h2>{ title }</h2>
  <p>
    { paragraph }
  </p>
  { children }
</aside>
```

More on the usage of child components in [Children](../children/).

## Stateful class components

## defaultProperties
