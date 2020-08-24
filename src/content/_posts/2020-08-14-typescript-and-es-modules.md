---
title: "TypeScript and ECMAScript Modules"
categories:
- TypeScript
- JavaScript
- Preact
---

Working with real, native, ECMAScript modules is becoming a thing. Tools like [Vite](https://github.com/vitejs/vite), [ES Dev server](https://open-wc.org/developing/es-dev-server.html), and [Snowpack](https://snowpack.dev) get their fast development experience from leaving module resolution to the browser. Package CDNs like [Skypack](https://skypack.dev) and [UnPKG](https://unpkg.com/) are providing pre-compiled ES modules which you can use in both Deno and the browser just by referencing a URL.

Combined with proper caching and knowing what HTTP can do, ES modules can become a *real* alternative to all the heavy bundling and building that we're used to. If you want to work with ECMAScript modules and TypeScript, there are a few things to consider.

## Working with your own modules

What we want to achieve is to write `import` and `export` statements in TypeScript:

```typescript twoslash
// @filename: module.ts
export const obj = {
  name: 'Stefan'
}

// @filename: index.ts
import { obj } from './module'

console.log('name')
```

But preserve the syntax and let the browser handle module resolution. To do this, we need to tell TypeScript to

1. Compile to an ECMAScript version that understands modules
2. Use the ECMAScript module syntax for module code generation

Let's define this in our `tsconfig.json`:

```json tsconfig
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext", 
  }
}
```

I usually use `esnext` which is always the *latest* ECMAScript version, but you might want to go to a specific year depending on the rest of the ES features you are using. All options starting from `es2015` onwards are compatible. 

This already does one important thing: It leaves the syntax intact. A problem occurs once we want to run our code. Usually, we import from TypeScript files without an extension. Specifying a `ts` extension actually results in a compiler error. Once we compile, the extension is still missing. But the browser needs an extension to actually point to the respective JavaScript file.

The solution: Specify a `js` extension, even though you are pointing to a `ts` file when you develop. TypeScript is smart enough to pick that up.

```typescript twoslash
// @target: esnext
// @module: esnext
// @filename: module.ts
export const obj = {
  name: 'Stefan'
}
// ---cut---
// @filename: index.ts
// This still loads types from 'module.ts', but keeps
// the reference intact once we compile.
import { obj } from './module.js'

obj.name
```

The same goes for `tsx` files. TypeScript knows `tsx` files get compiled to a `js` file, so it's safe to use the `js` extension once you import.

```typescript
// Component.tsx
import { h } from 'preact';

export function Hello() {
  return <div>
    <h1>Hello World</h1>
  </div>
}

// index.ts
import { Hello } from './Component.js';

console.log(Hello)
```

That's all you need for local!

## Working with modules over HTTP

It gets a lot more interesting when we want to use dependencies that live under a specific URL. Let's say we want to import *[Preact](https://preactjs.com)* directly from Skypack or UnPKG.

```typescript
import { h } from 'https://cdn.skypack.dev/preact@^10.4.7';
```

TypeScript immediately throws a TS 2307 error at us: *Cannot find module '...' or its corresponding type declarations.(2307)*. TypeScript's module resolution works when files are on your disk, not on some server via HTTP. To get the info we need, we have to provide TypeScript with a resolution of our own.

### With types

Let's say we want to have type information. We can point TypeScript to read the respective type information from our local disk. Either get a good `.d.ts` file or install the missing dependency via NPM.

```bash
$ npm install preact@10.4.7
```

Or just the types depending on your library:

```bash
$ npm install @types/react
```

Next, do a path alias so TypeScript knows where to pick up types:

```typescript tsconfig
{
  "compilerOptions": {
    ...
    "paths": {
      "https://cdn.skypack.dev/preact@^10.4.7": [
        "node_modules/preact/src/index.d.ts"
      ]
    }
  }
}
```

Be sure you find the correct file, otherwise, your typings get all messed up.

### Without types

One of the cool things in TypeScript is that we can decide which types we want to have, and which we don't want to have. `any` might seem like an escape hatch, but it can also be an intentional choice to not use types for a part of your application.

Maybe we want to load a module that we don't really need to understand the interface or have to interact with the API, why bother wiring up types anyway?

TypeScript has an explicit *any* for imports, and it's called `ts-ignore`:

```typescript
//@ts-ignore
import { h } from 'https://cdn.skypack.dev/preact@^10.4.7';

// h is any
```

`ts-ignore` removes the *next* line from type checking. This also goes for *other* parts of our application, not just imports. In our case, `h` comes into existence, but TypeScript doesn't know the types because we ignored type checking and inferring. 

And for some cases, this is totally fine.

## Deno

Everything we heard so far goes for the browser, but there is one other runtime that uses ES imports in TypeScript: [Deno](https://deno.land). In Deno, ES imports via URLs are a first-class citizen and the preferred way to import dependencies. Since this is so heavily tied to how Deno works, Deno treats imports a bit differently.

1. Everything you write is TypeScript, so no need to use extensions
2. Deno throws the same TS 2307 at you once you import it from a URL. But the first time you run your application, Deno fetches the dependency and can do module resolution and type provision from the locally cached dependency.
3. If you use a CDN like Skypack, it's possible that types are sent along for regular JS dependencies. See how that works in Fred's article on [Dev.to](https://dev.to/pika/introducing-pika-cdn-deno-p8b)

