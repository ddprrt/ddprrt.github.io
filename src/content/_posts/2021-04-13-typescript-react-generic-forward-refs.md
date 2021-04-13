---
title: "TypeScript + React: Typing Generic forwardRefs"
category:
- TypeScript
- React
---

If you are creating component libraries and design systems in React, you might already have fowarded Refs to the DOM elments inside your components.

This is especially useful if you wrap basic components or *leafs* in [proxy components](https://fettblog.eu/typescript-react-component-patterns/#preset-attributes), but want to use the `ref` property just like you're used to:

```jsx
const Button = React.forwardRef((props, ref) => (
  <button type="button" {...props} ref={ref}>
    {props.children}
  </button>
));

// Usage: You can use your proxy just like you use
// a regular button!
const reference = React.createRef();
<Button className="primary" ref={reference}>Hello</Button>
```

Providing types for `React.forwardRef` is usually pretty straightforward. The types shipped by `@types/react` have generic type variables that you can set upon calling `React.forwardRef`. In that case, explicitly annotating your types is the way to go!

```tsx
type ButtonProps = JSX.IntrinsicElements["button"];

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <button type="button" {...props} ref={ref}>
      {props.children}
    </button>
  )
);

// Usage
const reference = React.createRef<HTMLButtonElement>();
<Button className="primary" ref={reference}>Hello</Button>
```

If you want to know more about patterns on proxy components, type information on `WithChildren` and *preset attributes*, please refer to my [Component Patterns guide](/typescript-react-component-patterns/). Also, check on `useRef` typings from my [TypeScript + React guide](/typescript-react/) for a hook-friendly alternative to `React.createRef`.


So far, so good. But things get a bit hairy if you have a component that accepts generic properties. Check out this component that produces a list of list items, where you can select each row with a `button` element:

```tsx
type ClickableListProps<T> = {
  items: T[];
  onSelect: (item: T) => void;
};

function ClickableList<T>(props: ClickableListProps<T>) {
  return (
    <ul>
      {props.items.map((item) => (
        <li>
          <button onClick={() => props.onSelect(item)}>
            Choose
          </button>
          {item}
        </li>
      ))}
    </ul>
  );
}

// Usage
const items = [1, 2, 3, 4];
<ClickableList items={items} 
  onSelect={(item) => {
    // item is of type number
    console.log(item)
  } } />
```

You want the extra type-safety so you can work with a type-safe `item` in your `onSelect` callback. Say you want to create a `ref` to the inner `ul` element, how do you proceed? The answer is tricky... you have a couple of options.

## Option 1: Do a type assertion


## Option 2: Do a wrapper component


## Option 3: Create a custom ref


## Option 4: Augment forwardRef


## Credits
