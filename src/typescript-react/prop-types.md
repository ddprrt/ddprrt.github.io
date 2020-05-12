---
title: "TypeScript and React: Prop Types"
layout: post-typescript
categories:
- TypeScript
published: true
next:
  title: Hooks
  url: ../hooks/
---

React has its own, built-in way of type checking called "prop types". Together with TypeScript this provides
a full, end-to-end type-checking experience: Compiler and run-time.

In this section:

- [Installing Prop Types](#installing-prop-types)
- [Inferring Prop Types](#inferring-prop-types)
- [Combined with defaultProps](#combined-with-defaultprops)
- [Children](#children)
- [Further reading](#further-reading)

## Installing Prop Types

To get going with prop types you have to install two packages:

```
npm install --save prop-types
npm install --save-dev @types/prop-types
```

Once everything is installed, you can start adding prop types by adding a field 
called `propTypes` to your components:

```javascript
import React from "react";
import PropTypes from "prop-types";

export function Article ({ title, price })  {
  return (
    <div className="article">
      <h1>{title}</h1>
      <span>Priced at (incl VAT): {price * 1.2}</span>
    </div>
  );
}

Article.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};
```

This is already enough to get IDE feedback when using the component:

```javascript
const book = <Article title="TypeScript and React" price={10} /> // ✅
const video = <Article title="TypeScript Videos" price="1000" /> // 💥 - Type Error
```

Check out my [Codesandbox](https://codesandbox.io/s/competent-mcnulty-1p9dt) for a live example.

## Inferring Prop Types

This means we get a ton of type safety for free, without adding *any* TypeScript functionality.
There's one downside however: The props **inside** the component are still of type any. So while
you get type safety when *using* the components, you don't get any when *writing*. Thankfully,
the `prop-types` types package gives you some handy tools. All you need is the `InferProps` generic:

```javascript
import PropTypes, { InferProps } from "prop-types";

export function Article({
  title,
  price
}: InferProps<typeof Article.propTypes>) {
  return (
    <div className="article">
      <h1>{title}</h1>
      <span>Priced at (incl VAT): {price * 1.2}</span>
    </div>
  );
}

Article.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired
};
```

Compiles just right, and gives you all the insights *inside* your component.

## Combined with defaultProps

We were talking about `defaultProps` in the [components chapter](../components). You can combine `defaultProps`
and `propTypes`. E.g. when you set a prop type to `isRequired`, but add a `defaultProp` for it, TypeScript
understands that this becomes optional.

```javascript
Article.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired
};

Article.defaultProps = {
  price: 20
};
```

Nice!

## Children

Compared to other ways of defining components like the `FunctionComponent` type,
`InferProps` only deals with properties, not with the component itself. This also means that we have to explicitly
provide information for children:

```javascript
export function ArticleList({
  children
}: InferProps<typeof ArticleList.propTypes>) {
  return <div className="list">{children}</div>;
}

ArticleList.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};
```

This should be sufficient.

## Further reading

For insights into prop types, check out the [official documentation](https://reactjs.org/docs/typechecking-with-proptypes.html).

If you want to dig deeper into *how* this works, check out Ali's excellent article
on that topic over at [dev.to](https://dev.to/busypeoples/notes-on-typescript-inferring-react-proptypes-1g88).
