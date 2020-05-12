---
title: "TypeScript and React: Events"
layout: post-typescript
categories:
- typescript
published: true
next:
  title: Prop Types
  url: ../prop-types/
---

Web apps are really boring if you don't interact with them. Events are key, and TypeScript's React typings
have great support for them. 

In this section:

- [Basic Event Handling](#basic-event-handling)
- [Restrictive Event Handling](#restrictive-event-handling)
- [Where's InputEvent?](#wheres-inputevent)

## Basic Event Handling

React uses its own event system. That's why you can't use typical `MouseEvent`s or similar on your elements.
You need to use the specific React version, otherwise you get a compile error.

Luckily, React typings give you the proper equivalent of each event you might be familiar with from standard
DOM. They even have the same name, which can be tricky at times. You either need to be specific with e.g.
`React.MouseEvent` or import the `MouseEvent` typing right from the React module:

```javascript
import React, { Component, MouseEvent } from 'react';

export class Button extends Component {
  handleClick(event: MouseEvent) {
    event.preventDefault();
    alert(event.currentTarget.tagName); // alerts BUTTON
  }
  
  render() {
    return <button onClick={this.handleClick}>
      {this.props.children}
    </button>
  }
}
```

Events supported are: [`AnimationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent), 
[`ChangeEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ChangeEvent), 
[`ClipboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent),
[`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent), 
[`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent), 
[`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent), 
[`FormEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FormEvent), 
[`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent), 
[`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent), 
[`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent), 
[`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent), 
[`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent), 
[`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent). As well as `SyntheticEvent`, for
all other events.

## Restrictive Event Handling

If you want to restrict your event handlers to specific elements, you can use a generic to be more specific:

```javascript
import React, { Component, MouseEvent } from 'react';

export class Button extends Component {
  /*
   Here we restrict all handleClicks to be exclusively on 
   HTMLButton Elements
  */
  handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    alert(event.currentTarget.tagName); // alerts BUTTON
  }

  /* 
    Generics support union types. This event handler works on
    HTMLButtonElement and HTMLAnchorElement (links).
  */
  handleAnotherClick(event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) {
    event.preventDefault();
    alert('Yeah!');
  }

  render() {
    return <button onClick={this.handleClick}>
      {this.props.children}
    </button>
  }
}
```

All HTML element type definitions are in the default DOM typings of TypeScript. Don't forget to add the
library `dom` (see getting started).

## Where's InputEvent?

If you come from Flow you will notice that `InputEvent` (`SyntheticInputEvent` respectively) is not supported by
TypeScript typings. This is mainly because `InputEvent` is still an experimental interface and not fully
supported by all browsers. If you use the `onInput` property from all `input` elements, you will see that the interface for
`onInput` uses `any` for the event interface. This will change in the future.

To be a bit more specific in your code you can import `SyntheticEvent` from the React typings.


```javascript
import React, { Component, SyntheticEvent } from 'react';

export class Input extends Component {

  handleInput(event: SyntheticEvent) {
    event.preventDefault();
    // ...
  }

  render() {
    return <>
      <input type="text" onInput={this.handleInput}/>
    </>
  }
}
```

Now you get at least *some* type safety.
