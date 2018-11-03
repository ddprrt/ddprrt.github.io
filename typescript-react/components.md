---
title: "TypeScript and React: Components"
layout: post-typescript
categories:
- typescript
published: true
next:
  title: Children
  url: ../children/
---

Components are at the heart of React. Let's see what we can do to get better error handling and tooling for them!

In this section:

1. [Stateless functional components](#stateless-functional-components---sfc)
2. [Stateful class components](#stateful-class-components)
3. [defaultProperties](#defaultprops)

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

One of the things that convinced me to use React were functional components. The "olde way" of doing
components is with class components. And they can keep state. State is like props, but private and only
controlled by the component.

`@types/react` typings of course have full support for those, and are also equally easy to use.

Class components need to be extended from the base `React.Component` class. Typings enhance this class 
with generics, passing props (like `SFC` earlier) and state. Let's do a clock component:

```javascript
import React, { Component } from 'react'; // let's also import Component

// the clock's state has one field: The current time, based upon the
// JavaScript class Date
type ClockState = {
  time: Date
}

// Clock has no properties, but the current state is of type ClockState
// The generic parameters in the Component typing allow to pass props
// and state. Since we don't have props, we pass an empty object.
export class Clock extends Component<{}, ClockState> {

  // The tick function sets the current state. TypeScript will let us know
  // which ones we are allowed to set.
  tick() {
    this.setState({
      time: new Date()
    });
  }

  // Before the component mounts, we initialise our state
  componentWillMount() {
    this.tick();
  }

  // After the component did mount, we set the state each second.
  componentDidMount() {
    setInterval(() => this.tick(), 1000);
  }

  // render will know everything!
  render() {
    return <p>The current time is {this.state.time.toLocaleTimeString()}</p>
  }
}
```

And through proper tooling, we get a ton of infos:

First, setState is aware of its state properties and only allows to set those. Even if you have more 
state properties, TypeScript allows you to only set those you want to update.

![setState only allows to set time](../img/class-1.png)

When we access state in our render function, we have access to all its properties. Here we see `time`,
and it's of type `Date`

![state has only one element time, it's of type Date](../img/class-2.png)

`Date` of course is a built-in JavaScript type, so we get full access to all its methods. 
Ever wanted to know what `Date` can do? Let TypeScript tell you:

![Date is a built-in JS type, we have full autocompletion](../img/class-3.png)

That's a lot of tooling support, just for a couple of keystrokes more. The type inference of React does the rest.

### constructors

The constructor function is a bit special. You need to pass your props there (even if you don't have any),
and TypeScript requires you to pass the to the super constructor function.

However, when writing the typical pattern of constructors and super calls in TypeScript's strict mode,
you will get an error if you don't provide any typings yourself. This is because you create a new class,
with a completly new constructor, and TypeScript does not know which parameters to expect!

Therefore, TypeScript will imply them to be `any`. And implicit `any` in strict mode is not allowed.

```javascript
export class Sample extends Component<SampleProps> {
  constructor(props) { // ️⚡️ does not compile in strict mode
    super(props)
  }
}
```

Even though the `super` call knows which props to expect, we need to be explicit with our constructor 
function:

```javascript
export class Sample extends Component<SampleProps> {
  constructor(props: SampleProps) {
    super(props)
  }
}
```

## defaultProps

Default properties allow you to specifcy default values for properties. In case you don't want
to have every value to be set explicitly. React has the property `defaultProps` reserved for
components.

TypeScript in version 3.0 is honouring `defaultProps`. With the latest React typings (v 16.4.8) you
are ready to go:

```javascript
import React, { Component } from 'react';

type NoticeProps = {
  msg: string
}

export class Notice extends Component<NoticeProps> {
  static defaultProps = {
    msg: 'Hello everyone!'
  }

  render() {
    return <p>{ this.props.msg }</p>
  }
}

const el = <Notice /> // Will compile in TS 3.0
```

For SFCs, I suggest using the ES6 default value syntax and optional type properties:

```javascript
type CardProps = {
  title: string,
  paragraph?: string  // the paragraph is optional
}

// No need to define the defaultProps property
export const Card: SFC<CardProps> = ({ title, paragraph = 'Hello World' }) => 
<aside>
  <h2>{ title }</h2>
  <p>
    { paragraph }
  </p>
</aside>
```

## Bottom line

You already can see that you don't have to write that many typings or boilerplate
code in React to get into the nice tooling and type safety features of TypeScript.
Components are a huge deal in React, and with just a couple of keystrokes we have
everything we need.

Let's see what else we can do in the next section.
