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

You want the extra type-safety so you can work with a type-safe `item` in your `onSelect` callback. Say you want to create a `ref` to the inner `ul` element, how do you proceed? Let's change the `ClickableList` component to an inner function component that takes a `ForwardRef`, and use it as an argument in the `React.forwardRef` function.

```tsx
// The original component extended with a `ref`
function ClickableListInner<T>(
  props: ClickableListProps<T>,
  ref: React.ForwardedRef<HTMLUListElement>
) {
  return (
    <ul ref={ref}>
      {props.items.map((item, i) => (
        <li key={i}>
          <button onClick={(el) => props.onSelect(item)}>Select</button>
          {item}
        </li>
      ))}
    </ul>
  );
}

// As an argument in `React.forwardRef`
const ClickableList = React.forwardRef(ClickableListInner)
```

This compiles, but has one downside: We can't assign a generic type variable for `ClickableListProps`. It becomes `unknown` by default. Which is good compared to `any`, but also slightly annoying. When we use `ClickableList`, we know which items to pass along! We want to have them typed accordingly! So how can we achieve this? The answer is tricky... and you have a couple of options.

## Option 1: Type assertion

One option would be to do a type assertion that restores the original function signature. 

```tsx
const ClickableList = React.forwardRef(ClickableListInner) as <T>(
  props: ClickableListProps<T> & { ref?: React.ForwardedRef<HTMLUListElement> }
) => ReturnType<typeof ClickableListInner>;
```

Type assertions are a little bit frowned upon as they look similar like type casts in other programming languages. They are a little bit different, and [Dan](https://effectivetypescript.com/2021/02/03/pet-peeves/) masterfully explains why. Type assertions have their place in TypeScript. Usually, my approach is to let TypeScript figure out everything from my JavaScript code that it can figure out on its own. Where it doesn't, I use type annotations to help a little bit. And where I know definitely more than TypeScript, I do a type assertion. 

This is one of the cases, here I know that my original component accepts generic props! 

Pro: It's easy. Contra: It's extra maintenance.

## Option 2: Create a custom ref

```tsx
type ClickableListProps<T> = {
  items: T[];
  onSelect: (item: T) => void;
  mRef?: React.Ref<HTMLUListElement> | null;
};

export function ClickableList<T>(
  props: ClickableListProps<T>
) {
  return (
    <ul ref={props.mRef}>
      {props.items.map((item, i) => (
        <li key={i}>
          <button onClick={(el) => props.onSelect(item)}>Select</button>
          {item}
        </li>
      ))}
    </ul>
  );
}
```


## Option 3: The Wrapper Component

```tsx
function ClickableListInner<T>(
  props: ClickableListProps<T>,
  ref: React.ForwardedRef<HTMLUListElement>
) {
  return (
    <ul ref={ref}>
      {props.items.map((item, i) => (
        <li key={i}>
          <button onClick={(el) => props.onSelect(item)}>Select</button>
          {item}
        </li>
      ))}
    </ul>
  );
}

const ClickableListWithRef = forwardRef(ClickableListInner);

type ClickableListWithRefProps<T> = ClickableListProps<T> & {
  mRef?: React.Ref<HTMLUListElement>;
};

export function ClickableList<T>({
  mRef,
  ...props
}: ClickableListWithRefProps<T>) {
  return <ClickableListWithRef ref={mRef} {...props} />;
}
```


## Option 4: Augment forwardRef



## Credits

