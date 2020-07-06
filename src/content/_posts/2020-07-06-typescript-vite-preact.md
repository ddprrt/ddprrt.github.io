---
title: "Vite with Preact and TypeScript"
description: "An introduction to Vite, and how to run a Preact + TypeScript project with it"
categories:
- TypeScript
- Preact
---

[Vite](https://github.com/vitejs/vite) is a new web development build tool by [Evan You](https://twitter.com/youyuxi), the creator of Vue.js. It's in early beta at the time of this writing and was mainly created for Vue 3, but it's also able to build React and Preact and has TypeScript support out of the box.

Vite's biggest difference to other tools is that for development, it relies on the basic loading capabilities of ECMAScript modules. This means that your `import` statements translate are executed natively by the browser. Vite's task is to serve your files. Nothing more. Well, a little bit more.

If you have a file that needs transpilation, Vite transpiles them to regular JS for you so the browser knows what to do. This means that

- *JSX*, *TSX*, *TS* files are transpiled to JavaScript
- *CSS* you import in your JavaScript files is transpiled to JavaScript that injects style tags
- *VUE* files are also split up and transpiled to whatever they need to be

And you can extend Vite with custom transpilers, like Sass or other CSS preprocessors.

And since there is no bundling work to be done, or excessive dependency trees to be maintained, serving, translating, and hot module replacement is insanely *vite* ... eh ... fast!

If you do a production build, Rollup runs under the hood to do proper tree shaking and creating the smallest possible chunks for your deployment.

Vite really feels like it could be the build tool of all build tools. I'm very impressed! There are also some templates for Vue 3, React and Preact available. But at the time of writing, Preact didn't have any templates with TypeScript support. So I added my own, and this is what I did.

## Step 1. Create a new Preact project with Vite

As mentioned, there is a Preact template for Vite that we are going to use as a base. It already has most of the things wired up, we only need to add TypeScript support.

```bash
$ npm init vite-app my-preact-project --template preact
```

<p class="til">
  <code>npm init vite-app</code> is a shortcut for <code>npx create-vite-app</code>. It also works with <code>create-react-app</code> or <code>create-next-app</code>, and whatever <code>create-</code> tool there is out there.
</p>

Also, we install TypeScript, at least in version 4.0.

```bash
$ npm install typescript
```

Try `npm install typescript@beta` if TypeScript isn't at 4.0, yet. This is the first step. Now we set up the configuration.

## Step 2. Setting up TypeScript

There is no TypeScript project without a good TypeScript configuration. Create a `tsconfig.json` in your root folder and add the following:

```typescript
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["DOM", "DOM.Iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": false,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment"
  },
  "include": ["src"]
}
```

There's lots of settings in there, but the most important for our case are the last three lines in `compilerOptions`:

```typescript
"jsx": "preserve",
"jsxFactory": "h",
"jsxFragmentFactory": "Fragment"
```

We set

- `jsx` to `preserve`, which means that TypeScript doesn't compile JSX. This is done by Vite anyway
- `jsxFactory` is `h`. This is Preact's virtual DOM implementation. All JSX elements are transpiled to `h` function calls. See my article on [JSX is syntactic sugar](/jsx-syntactic-sugar/) if you want to know what's happening here under the hood.
- `jsxFragmentFactory` to `Fragment`. This is Preact's fragment component. Fragments are nice because they don't require you to add wrapping `divs`. Clean markup when rendered! This setting is new in TypeScript 4, and allows TypeScript to know that you mean `Fragment` when doing empty `<>...</>` tags.

Those settings are mostly for the editor experience, so you get proper typings when editing, and all the auto-completion that you love from TypeScript.

Compilation is done by Vite, though. So we also have to adapt `vite.config.js` a little bit. Right now, `vite.config.js` looks something like this:

```typescript
const config = {
  jsx: 'preact',
  plugins: [preactRefresh()]
}
```

This JSX preset from Vite injects `h` globally. This is ok for most JavaScript projects, but TypeScript loses some information on JSX and what your JSX factory function does. That's why Vite allows us to override the preset with custom JSX info:

```typescript
const config = {
  jsx: {
    factory: 'h',
    fragment: 'Fragment'
  },
  plugins: [preactRefresh()]
}
```

This mirrors what we have in `tsconfig.json`, cool!

## Step 3. Adapting files

We're close! The last thing we need to do is adapting files.

1. Rename all `.jsx` files to `.tsx`.
2. Open `index.html` and refer to `main.tsx` instead of `main.jsx`.
  
Next, let your `tsx` files know which factory and fragment factory you are using. Since we are not injecting globally anymore, we need to import them in each file. 

```typescript
import { Fragment, h } from 'preact'
```

Since we have TypeScript now up and running, our editor already gives us a sweet error message that we use `document.getElementById('app')` with way too much confidence. This might be `null`, after all!

Let's be sure that this element exists:

```typescript
const el = document.getElementById('app')
if(el) {
  render(<App />, el)
}
```

And that's it! You can see a rough and unpolished demo setup on [GitHub](https://github.com/ddprrt/preact-vite-ts-playground). Let me know what you think!
