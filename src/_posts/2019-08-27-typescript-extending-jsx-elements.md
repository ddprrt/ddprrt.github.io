---
layout: post
categories:
  - TypeScript
  - React
  - Preact
  - JSX
published: true
permalink: /typescript-react-extending-jsx-elements/
title: "TypeScript + React: Extending JSX Elements"
---

React typings for TypeScript come with lots of interfaces for all possible HTML elements
out there. But sometimes, your browsers, your frameworks or your code are a little bit ahead of
what's possible.

Let's say you want to use the latest image features in Chrome, and load your images lazily.
A progressive enhancement, so only browsers which understand what's going on know how to
interpret this. Other browsers are robust enough not to care.

```html
<img src="/awesome.jpg" loading="lazy" alt="What an awesome image" />
```

Your TypeScript JSX code? Errors. 

```typescript
function Image({ src, alt }) {
  // 💥 Property 'loading' does not exist...
  return <img src={src}
   alt={alt}
   loading="lazy" />
}
```

To prevent this, we can extend the available interfaces with our own properties. This
feature of TypeScript is called *declaration merging*.

Create a `@types` folder and put a `jsx.d.ts` file in it. Change your TypeScript config
so your compiler options allow for extra types:

```typescript
{
  "compilerOptions": {
    ...
    /* Type declaration files to be included in compilation. */
    "types": ["@types/**"],
  },
  ...
}
```

We re-create the exact module and interface structure:

1. The module is called `'react'`,
2. The interface is `ImgHTMLAttributes<T> extends HTMLAttributes<T>`

We know that from the original typings. Here, we add the properties we want to have.

```typescript
import 'react'

declare module 'react' {
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    loading?: 'lazy' | 'eager' | 'auto';
  }
}
```

And while we are at it, let's make sure we don't forget alt texts!

```diff
import 'react'

declare module 'react' {
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    loading?: 'lazy' | 'eager' | 'auto';
+   alt: string;
  }
}
```

Way better! TypeScript will take the original definition and merge your declarations.
Your autocomplete can give you all available options *and* will error when you
forget an alt text.

We can use the same method, when we want `styled-jsx` to be compatible with TypeScript.
TypeScript does not recognize the `jsx` and `global` attributes of the `style` tag.
Let's change that:

```typescript
declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}
```

When working with **Preact**, things are a bit more complicated. The original
HTML typings are very generous and not so specific as React's typings. That's why
we have to be a bit more explicit when defining images:

```typescript
declare namespace JSX {
  interface IntrinsicElements {
    "img": HTMLAttributes & {
      alt: string,
      src: string,
      loading?: 'lazy' | 'eager' | 'auto';
    }
  }
}
```

This makes sure that both `alt` and `src` are available, and sets and 
optional attribute `loading`.

The technique is the same, though: Declaration merging, which works on namespaces,
interfaces and modules.

 
