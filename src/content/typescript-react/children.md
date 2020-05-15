---
title: "TypeScript and React: Children"
layout: post-typescript
categories:
- TypeScript
published: true
next:
  title: Events
  url: ../events/
---

JSX elements can be nested, like HTML elements. In React, children elements are accessible via
the `children` props in each component. With TypeScript, we have the possibilty to make children
type safe.

1. [Default behaviour](#default-behaviour)

## Default behaviour

Once you have the default types installed, we already get autocompletion and code analysis out of the box.
In class components, we get this even without using any TypeScript specific syntax:

```typescript
import React, { Component } from 'react';

export class Wrapper extends Component {
  render() {
    return <div style={ { display: 'flex' } }>
      { this.props.children }
    </div>
  }
}
```

Tools like Visual Studio Code already help:

![Auto-completion for children](../img/children-1.png)

For functional components, we need to use the `FunctionComponent` generic type to access children. Check out the example
we had earlier:

```typescript
import React, { FunctionComponent } from 'react';

type CardProps = {
  title: string,
  paragraph: string
}

// we can use children even though we haven't defined them in our CardProps
export const Card: FunctionComponent<CardProps> = ({ title, paragraph, children }) => <aside>
  <h2>{ title }</h2>
  <p>
    { paragraph }
  </p>
  { children }
</aside>
```

Note that we use destructring here to access our properties directly. You have to be
explicit that you want to access children as well. If you don't use destructuring, the
code looks like this:


```typescript
import React, { FunctionComponent } from 'react';

// no children defined here
type CardProps = {
  title: string,
  paragraph: string
}

// undestructured
export const Card: FunctionComponent<CardProps> = (props) => <aside>
  <h2>{ props.title }</h2>
  <p>
    { props.paragraph }
  </p>
  { /* still in our props */ }
  { props.children }
</aside>
```
