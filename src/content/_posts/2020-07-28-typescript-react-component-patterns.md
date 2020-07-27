---
title: "TypeScript + React: Component patterns"
categories:
- TypeScript
- React
---

This list is a collection of component patterns for React when working with TypeScript. See them as an extension to the [TypeScript + React Guide](/typescript-react/) that deals with overall concepts and types. This list has been heavily inspired by [chantastic's original React patterns list](https://reactpatterns.com/).

Contrary to chantastic's guide I use mainly modern-day React, so function components and -- if necessary -- hooks. I also focus exclusively on types.

**Last updated**: July 28, 2020

Have fun!

## Table of Contents

- [Basic function components](#basic-function-components)
- [Props](#props)
- [Default Props](#default-props)
- [Children](#children)
- [WithChildren Helper type](#withchildren-helper-type)
- [Spread attributes](#spread-attributes-to-html-elements)
- [Preset attributes](#preset-attributes)
- [Styled components](#styled-components)
- [Required properties](#required-properties)
- [Controlled input](#controlled-input)

## Basic function components

When using function components without any props you don't have the need to use extra types. Everything can be inferred. In old-style functions (which I prefer), as well as in arrow functions. 

```typescript
function Title() {
  return <h1>Welcome to this application</h1>;
}
```

## Props

When using props we name props usually according to the component we're writing, with a `Props`-suffix. No need to use `FC` component wrappers or anything similar.

```typescript
type GreetingProps = {
  name: string;
};

function Greeting(props: GreetingProps) {
  return <p>Hi {props.name} 👋</p>
}
```

Destructuring makes it even more readable

```typescript
function Greeting({ name }: GreetingProps) {
  return <p>Hi {name} 👋</p>;
}
```

## Default props

Instead of setting default props, like in class-based React, it's easier to set default values to props. We mark props with a default value optional (see the question-mark operator). The default value makes sure that `name` is never undefined.

```typescript
type LoginMsgProps = {
  name?: string;
};

function LoginMsg({ name = "Guest" }: LoginMsgProps) {
  return <p>Logged in as {name}</p>;
}
```

## Children

Instead of using `FC` or `FunctionComponent` helpers we prefer to set `children` explicitly, so it follows the same pattern as other components. We set `children` to type `React.ReactNode` as it accepts most (JSX elements, strings, etc.)

```typescript
type CardProps = {
  title: string;
  children: React.ReactNode;
};

export function Card({ title, children }: CardProps) {
  return (
    <section className="cards">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
```

When we set `children` explicitly, we can also make sure that we *never* pass any children.

```typescript
// This throws errors when we pass children
type SaveButtonProps = {
  //... whatever
  children: never
}
```

## WithChildren helper type

A custom helper type helps us to set `children` easier. 

```typescript
type WithChildren<T = {}> = 
  T & { children?: React.ReactNode };

type CardProps = WithChildren<{
  title: string;
}>;
```

This is very similar to `FC`, but with the default generic parameter to `{}`, it can be much more flexible:

```typescript
// works as well
type CardProps = { title: string } & WithChildren;
```

## Spread attributes to HTML elements

Spreading attributes to HTML elements is a nice feature where you can make sure that you are able to set all the HTML properties that an element has without knowing upfront which you want to set. You pass them along. Here's a button wrapping component where we spread attributes. To get the right attributes, we access a `button`'s props through `JSX.IntrinsicElements`. This includes `children`, we spread them along.

```typescript
type ButtonProps = JSX.IntrinsicElements["button"];

function Button({ ...allProps }: ButtonProps) {
  return <button {...allProps} />;
}
```

## Preset attributes

Let's say we want to preset `type` to `button` as the default behavior `submit` tries to send a form, and we just want to have things clickable. We can get type safety by omitting `type` from the set of button props.

```typescript
type ButtonProps =
  Omit<JSX.IntrinsicElements["button"], "type">;

function Button({ ...allProps }: ButtonProps) {
  return <button type="button" {...allProps} />;
}

// 💥 This breaks, as we omitted type
const z = <Button type="button">Hi</Button>; 
```

## Styled components

Not to be confused with the *styled-components* CSS-in-JS library. We want to set CSS classes based on a prop we define. E.g. a new `type` property that allows being set to either `primary` or `secondary`.

We omit the original `type` and `className` and intersect with our own types:

```typescript
type StyledButton = Omit<
  JSX.IntrinsicElements["button"],
  "type" | "className"
> & {
  type: "primary" | "secondary";
};

function StyledButton({ type, ...allProps }: StyledButton) {
  return <Button className={`btn-${type}`} />;
}
```

## Required properties

We dropped some props from the type definition and preset them to sensible defaults. Now we want to make sure our users don't forget to set some props. Like the alt attribute of an image or the `src` attribute.

For that, we create a `MakeRequired` helper type that removes the optional flag.

```typescript
type MakeRequired<T, K extends keyof T> = Omit<T, K> &
  Required<{ [P in K]: T[P] }>;
```

And build our props with that:

```typescript
type ImgProps 
  = MakeRequired<
    JSX.IntrinsicElements["img"], 
    "alt" | "src"
  >;

export function Img({ alt, ...allProps }: ImgProps) {
  return <img alt={alt} {...allProps} />;
}

const zz = <Img alt="..." src="..." />;
```

## Controlled Input

When you use regular input elements in React and want to pre-fill them with values, you can't change them anymore afterward. This is because the `value` property is now controlled by React. We have to put `value` in our state and *control* it. Usually, it's enough to just intersect the original input element's props with our own type. It's optional as we want to set it to a default empty string in the component later on.

```typescript
type ControlledProps = 
  JSX.IntrinsicElements["input"] & {
    value?: string;
  };
```

Alternatively, we can drop the old property and rewrite it:

```typescript
type ControlledProps =
  Omit<JSX.IntrinsicElements["input"], "value"> & {
    value?: string;
  };
```

And use `useState` with default values to make it work:

```typescript
function Controlled({ value = "", ...allProps }: ControlledProps) {
  const [val, setVal] = useState(value);
  return (
    <input
      value={val}
      {...allProps}
      onChange={e => {
        setVal(() => e.target?.value);
      }}
    />
  );
}
```

*to be extended*

## Play around

Instead of the usual TypeScript playground, I created a [Codesandbox](https://codesandbox.io/s/component-patterns-sw7x9?file=/src/Components.tsx) you can use to play around. Have fun!
