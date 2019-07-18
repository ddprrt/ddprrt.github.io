---
title: "TypeScript and React: Styles and CSS"
layout: post-typescript
categories:
- typescript
published: true
next:
  title: Further reading
  url: ../further-reading/
---

Is there any topic in the React space that has spawned more controversy than styling?
Do everything inline vs rely on classic styles. There's a broad spectrum. There's also
a lot of frameworks around that topic. I try to cover a couple, never all of them. 

Most of them have their own, really good documentation on TypeScript. And all, really
all typings have one thing in common: They rely on the [csstype](https://www.npmjs.com/package/csstype) package.

In this section:
- [inline styles](#inline-styles)
- [emotion](#emotion)
- [Styled Components](#styled-components)
- [Styled JSX](#styled-jsx)
- [Load CSS with Webpack](#load-css-with-webpack)
- [Demos](#demos)

## inline styles

The easiest choice: Inline styles. Not the full flexibility of CSS, but decent basic styling at 
top level specificity. Every React HTML element has a style property that allows an object with 
all your styling. Objects can look like this: 

```javascript
const h1Styles = {
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  position: 'absolute',
  right: 0,
  bottom: '2rem',
  padding: '0.5rem',
  fontFamily: 'sans-serif',
  fontSize: '1.5rem',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
};
```

They have roughly the same properties as the [CSSStyleDeclaration](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration)
interface.

When using React typings, these properties are already typed through [csstype](https://www.npmjs.com/package/csstype). To get 
editor benefits, import types directly from `csstype`:

```javascript
import CSS from 'csstype';

const h1Styles: CSS.Properties = {
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  position: 'absolute',
  right: 0,
  bottom: '2rem',
  padding: '0.5rem',
  fontFamily: 'sans-serif',
  fontSize: '1.5rem',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
};
```

And apply them:

```javascript
export function Heading({ title } : { title: string} ) {
  return <h1 style={h1Styles}>{title}</h1>;
}
```

Editor feedback is pretty good! You get Autocompletion on properties:

![Autocompletion on properties](../img/autocompletion-on-properties.png)

And documentation if you mis-type a value. (e.g. `absolut` instead of `absolute`)

![Autocompletion on properties](../img/styles-and-doc.png)

You don't need any other plugins.

## emotion

[Emotion](https://emotion.sh) -- the one with the David Bowie Emoji 👩‍🎤 -- is a pretty nice
framework with lots of ways to add styles to your components. They also have a very good
[TypeScript guide](https://emotion.sh/docs/typescript). I give you a quick run-down, though.

Install `emotion`:

```
npm install --save @emotion/core
npm install --save @emotion/styled
```

Emotion has its own component wrapper, giving you a `css` property for elements 
you can add styles to. Other than inline styles, these styles are added as a style
element on the top of the page. With proper classes and everything.

With its own component wrapper, you also need to swap out `React.createElement` for
their own `jsx` factory. You can do this on a global level in `tsconfig`, or per file.

For the course of this section, we do it per file. The `css` template function takes
CSS and returns an object you can pass to your components. 

The properties are compatible with `CSS.Properties` from `csstype`. In fact, it uses 
`csstype` under the hood.

```javascript
/** @jsx jsx */
// the line above activates the jsx factory by emotion
import { css, jsx } from '@emotion/core';


const h1Style = css({
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  position: 'absolute',
  right: 0,
  bottom: '2rem',
  padding: '0.5rem',
  fontFamily: 'sans-serif',
  fontSize: '1.5rem',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
});

export function Heading({ title } : { title: string} ) {
  return <h1 css={h1Style}>{title}</h1>;
}
```

Roughly the same application, but the difference is significant: Styles in
proper style elements, not attribute. The cascade is going to love you.

You also get the same type information as with `CSS.Properties`.

Since properties are compatible, you can easily migrate and use your old 
`CSS.Properties` styles:

```javascript
const h1Style = css({
  ...originalStyles,
  ...maybeMixedWithOtherStyles
});
```

Handy! When you want to create styled components with emotion, you can use the `styled`
function. The same ground rules apply:

```javascript
/** @jsx jsx */
import styled from '@emotion/styled';
import { jsx } from '@emotion/core';

const LayoutWrapper = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 1rem;
`;

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
```

The element I create is an actualy `div` and gets all props from `HTMLDivElement`
(or the React Equivalent). Meaning that if you an `styled("a")`, you can pass
`href` properties.

If you want to have proper tooling support, install the [Styled Components for VSCode](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components) extension. It works really
well with emotion.

## Styled Components

[Styled components](https://www.styled-components.com), the one that got styling in react *really* going. It also has
an emoji 💅. And TypeScript support! TypeScript support comes through `DefinitelyTyped`:

```
npm install @types/styled-components
```

## Styled JSX

Styled JSX is by [Zeit](https://zeit.co) and comes with the [Next.js](https://nextjs.org) framework.
It goes its own route of providing scoped styles in `style` properties, without changing
anything to original components.

It also requires you to use a Babel plug-in. Which means you have to use TypeScript as a babel
plug-in. 

``` javascript
export function Heading({ title }: { title: string }) {
  return <>
    <style jsx>{`
      h1 {
        font-weight: normal;
        font-style: italic;
      }
    `}</style>
    <h1>{title}</h1>
  </>
}
```

When you use it like that, this will break. You need to add an ambient type declaration 
file `styled-jsx.d.ts`:

```javascript
import "react";

declare module "react" {
    interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
        jsx?: boolean;
        global?: boolean;
    }
}
```

Or you do the short cut: 

```
npm install --save-dev @types/styled-jsx
```

There's a nice [VSCode](https://marketplace.visualstudio.com/items?itemName=blanu.vscode-styled-jsx) plugin to 
get better tooling for styles in [styled-jsx](https://github.com/zeit/styled-jsx)

## Load CSS with Webpack

With webpack, you want to import style files in your JavaScript, to make sure you don't have any extra
style files you might not need. You still write regular CSS or Sass.

To load CSS or Sass, Webpack comes with a couple of loaders:

- [css-loader](https://webpack.js.org/loaders/css-loader/)
- [sass-loader](https://webpack.js.org/loaders/sass-loader/)
- [less-loader](https://webpack.js.org/loaders/less-loader/)

You name it.

To make things work with CSS or Sass in Webpack and TypeScript, you also need to add ambient type declarations.
I call them `css.d.ts` or `scss.d.ts`.

```javascript
declare module '*.css' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export = classNames;
}
```

```javascript
declare module '*.scss' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export = classNames;
}
```

Both tell you that everything you export from a `css` or `scss` file is a string. 
You don't get any class names you can attach, but at least you can import styles:

```javascript
import './Button.css'
```

If you want to get all the class names, and really nice auto-completion, drop the
ambient files and include another loader: [css-modules-typescript-loader](https://www.npmjs.com/package/css-modules-typescript-loader)

## Demos

Styling requires a bit of infrastructure. Here's some demos to get you started.

- [This Codesandbox](https://codesandbox.io/s/funny-frost-1bxwk) has samples for inline styles and emotion
- [The ScriptConf website](https://github.com/stahlstadtjs/scriptconf.org) uses CSS imports and styled-jsx
