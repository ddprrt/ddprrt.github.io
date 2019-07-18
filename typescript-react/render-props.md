---
title: "TypeScript and React: Render props and child render props"
layout: post-typescript
categories:
- typescript
published: true
next:
  title: Context
  url: ../context/
---

Render props is, according to the [offical docs](https://reactjs.org/docs/render-props.html), *a technique for sharing code between React components using a prop whose value is a function.*  The idea is to make components composable but being flexible in what to share.

In this section:
- [Render props](#render-props)
- [Children render props](#children-render-props)
- [Context](#context)

## Render props

Let's look at the example from the [official docs](https://reactjs.org/docs/render-props.html) and make it type-safe. 
Turns out, this is quite easy.

We want to have a Cat that chases a Mouse. It chases our computer's mouse, in that case. 

The `Cat` renders an image of cat that is positioned based on mouse coordinates. For this we
need the `Cat`s props, which points to a `MouseState`. `MouseState` holds x and y coordinates for us.s

```javascript
import React, { FC, Component, MouseEvent } from 'react';

type CatProps = {
  mouse: MouseState
}

type MouseState = {
  x: number,
  y: number
}


export class Cat extends Component<CatProps> {
  render() {
    const { mouse } = this.props;
    return (
      <img src="cat.gif" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}
```

That's the `Cat`, let's look at the `Mouse`.

The props from `Mouse` are pretty straight forward. We have one property -- `render` (hence the name)
-- which accepts a `MouseState`. `MouseState` becomes the glue between `Cat` and `Mouse`


```javascript
type MouseProps = {
  render(state: MouseState): void
}
```

The `Mouse` component itself builds on `MouseProps` and `MouseState`. Note that we call 
the `render` function instead of merely adding children.

```javascript
export class Mouse extends Component<MouseProps, MouseState> {
  constructor(props: MouseProps) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event: MouseEvent) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div 
        style={{ height: '100vh', width: '100vw' }}
        onMouseMove={this.handleMouseMove}>
        {/*
          Instead of providing a static representation of what <Mouse> renders,
          use the `render` prop to dynamically determine what to render.
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}
```

Now let's combine everything. The `Mouse` component has one prop, `render`, 
and the function returns the hunting `Cat`. Here we don't have any extra
TypeScript annotations. But TypeScript warns us if the function properties from
`mouse` are incompatible with the `mouse` prop from `Cat`:

```javascript
export const MouseTracker = () => <div>
  <h1>Move the mouse around!</h1>
  <Mouse render={mouse => (
    <Cat mouse={mouse} />
  )}/>
</div>;
```

## Children render props

Turns out that [children](../children) can be a function as well. As for typings, the same
typings apply. We only have to change a little bit of code.

```diff
export class Mouse extends Component<MouseProps, MouseState> {
  render() {
    return (
      <div 
        style={{ height: '100vh', width: '100vw' }}
        onMouseMove={this.handleMouseMove}>
        {/*
          Instead of providing a static representation of what <Mouse> renders,
          use the `render` prop to dynamically determine what to render.
        */}
-       {this.props.render(this.state)}
+       {this.props.children(this.state)}
      </div>
    );
  }
}

export const MouseTracker = () => <div>
  <h1>Move the mouse around!</h1>
- <Mouse render={mouse => (
-   <Cat mouse={mouse} />
- )}/>
+ <Mouse>
+   {mouse => (
+     <Cat mouse={mouse} />
+   )}
+ </Mouse>
</div>;
```

Typings stay the same.

## Context

One concept that relies heavily on render props is Context. I explain context in its
[own chapter](../context).

## Bottom line

With typings you can easily see that state is the key for render props. We pass state from
one component to the other through a function. This also means that state is the one type
that gets shared between components. Again, there's some excellent reading by [Ali Sharif](https://dev.to/busypeoples/notes-on-typescript-render-props-1f3p)
