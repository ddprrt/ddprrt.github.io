---
title: "TypeScript and React: Children"
layout: post-typescript
categories:
- typescript
published: true
next:
  title: Events
  url: ../events/
---

JSX elements can be nested, like HTML elements. In React, children elements are accessible via
the `children` props in each component. With TypeScript, we have the possibilty to make children
type safe.

1. [Default behaviour](#default-behaviour)
2. Specific children types
3. Disallowing children
4. Function children


## Default behaviour

Once you have the default types installed, we already get autocompletion and code analysis out of the box.
In class components, we get this even without using any TypeScript specific syntax:

```javascript
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

For stateless functional components, we need to use the `SFC` generic type to access children. Check out the example
we had earlier:

```javascript
import React, { SFC } from 'react';

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

Note that we use destructring here to access our properties directly. You have to be
explicit that you want to access children as well. If you don't use destructuring, the
code looks like this:


```javascript
import React, { SFC } from 'react';

// no children defined here
type CardProps = {
  title: string,
  paragraph: string
}

// undestructured
export const Card: SFC<CardProps> = (props) => <aside>
  <h2>{ props.title }</h2>
  <p>
    { props.paragraph }
  </p>
  { /* still in our props */ }
  { props.children }
</aside>
```

{% comment %}

If you think this is boring, you are right. Let's do something more!

## Specific children types

As you can see from the screenshot above, the autocompletion tells us `children` is of type
`React.ReactNode`. `React.ReactNode` is very generic (it can be everything). Let's be more
specific about that!

When we use the default typings of `Component` and `SFC`, the `children` prop gets patched
to our prop type. Once we specify children explicitly in our type, we have a lot more possibilites:

Look at the following example. A gallery that features only gallery items:

```javascript
import React, { Component } from 'react';

type GalleryItemProps = {
  url: string,
  alt: string
}

export class GalleryItem extends Component<GalleryItemProps> {
  render() {
    return <img src={ this.props.url } alt={ this.props.alt }/>
  }
}

// Here we specify the children to be of type gallery item. Only
// gallery items allowed in our gallery
type GalleryProps = {
  children: GalleryItem
}

export class Gallery extends Component<GalleryProps> {
  render() {
    return <>{ this.props.children }</>
  }
}
```

With the code above, things like

```javascript
const el = <Gallery>
  Here is text, not possible
</Gallery>

const el2 = <Gallery>
  <p>An element, also not possible!</p>
</Gallery>

const el3 = <Gallery>
  <AComponent description="Is also not possible!"/>
</Gallery>
```

Won't work. You get a fine error with TypeScript:

![Showing an error](../img/children-2.png)

We are only allowed to pass `GalleryItem`:


Same goes for stateless functional components, of course.

## Disallowing children

## Function children

## Node vs. Element vs. Component

{% endcomment %}
