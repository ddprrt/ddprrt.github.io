---
title: "TypeScript: Augmenting global and lib.dom.d.ts"
categories:
- TypeScript
---

Recently I wanted to use a [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) in my application. `ResizeObserver` recently landed in all [major browsers](https://caniuse.com/#search=ResizeObserver), but when you use it in TypeScript &mdash; at the time of this writing &mdash; `ResizeObserver` won't be recognized as a valid object (or constructor). So why is that?

## How DOM API types land in TypeScript

TypeScript stores types to all DOM APIs in `lib.dom.d.ts`. This file is auto-generated from *Web IDL* files. *Web IDL* stands for *Web Interface Definition Language* and is a format the W3C and WHATWG use to define interfaces to web APIs. It came out around 2012 and is a standard since 2016. 

When you read standards at [W3C](https://w3c.org) &mdash; like on [Resize Observer](https://www.w3.org/TR/resize-observer/#idl-index) &mdash; you can see a parts of a definition or the full definition somewhere within the specification. Like this one:

```markdown
enum ResizeObserverBoxOptions {
  "border-box", "content-box", "device-pixel-content-box"
};

dictionary ResizeObserverOptions {
  ResizeObserverBoxOptions box = "content-box";
};

[Exposed=(Window)]
interface ResizeObserver {
  constructor(ResizeObserverCallback callback);
  void observe(Element target, optional ResizeObserverOptions options);
  void unobserve(Element target);
  void disconnect();
};

callback ResizeObserverCallback = void (sequence<ResizeObserverEntry> entries, ResizeObserver observer);

[Exposed=Window]
interface ResizeObserverEntry {
  readonly attribute Element target;
  readonly attribute DOMRectReadOnly contentRect;
  readonly attribute FrozenArray<ResizeObserverSize> borderBoxSize;
  readonly attribute FrozenArray<ResizeObserverSize> contentBoxSize;
  readonly attribute FrozenArray<ResizeObserverSize> devicePixelContentBoxSize;
};

interface ResizeObserverSize {
  readonly attribute unrestricted double inlineSize;
  readonly attribute unrestricted double blockSize;
};

interface ResizeObservation {
  constructor(Element target);
  readonly attribute Element target;
  readonly attribute ResizeObserverBoxOptions observedBox;
  readonly attribute FrozenArray<ResizeObserverSize> lastReportedSizes;
};
```

Browsers use this as a guideline to implement respective APIs. TypeScript uses these IDL files to generate `lib.dom.d.ts`. The [*TS JS Lib generator*](https://github.com/microsoft/TSJS-lib-generator) project scrapes web standards and extracts IDL information. Then an *IDL to TypeScript* parser generates the correct typings.

Pages to scrape are maintained manually. The moment a specification is far enough and supported by all major browsers, people add a new resource and see their change released with an upcoming TypeScript version. So it's just a matter of time until we get `ResizeObserver` in `lib.dom.d.ts`.

If we can't wait, we just can add the typings ourselves. And only for the project we currently work with.

## Ambient declarations

Let's assume we generated the types for `ResizeObserver`. We would store the output in a file called `resize-observer.d.ts`. Here are the contents:

```typescript
type ResizeObserverBoxOptions =
  "border-box" | 
  "content-box" |
  "device-pixel-content-box";

interface ResizeObserverOptions {
  box?: ResizeObserverBoxOptions;
}

interface ResizeObservation {
  readonly lastReportedSizes: ReadonlyArray<ResizeObserverSize>;
  readonly observedBox: ResizeObserverBoxOptions;
  readonly target: Element;
}

declare var ResizeObservation: {
  prototype: ResizeObservation;
  new(target: Element): ResizeObservation;
};

interface ResizeObserver {
  disconnect(): void;
  observe(target: Element, options?: ResizeObserverOptions): void;
  unobserve(target: Element): void;
}

export declare var ResizeObserver: {
  prototype: ResizeObserver;
  new(callback: ResizeObserverCallback): ResizeObserver;
};

interface ResizeObserverEntry {
  readonly borderBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly contentBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly contentRect: DOMRectReadOnly;
  readonly devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly target: Element;
}

declare var ResizeObserverEntry: {
  prototype: ResizeObserverEntry;
  new(): ResizeObserverEntry;
};

interface ResizeObserverSize {
  readonly blockSize: number;
  readonly inlineSize: number;
}

declare var ResizeObserverSize: {
  prototype: ResizeObserverSize;
  new(): ResizeObserverSize;
};

interface ResizeObserverCallback {
  (entries: ResizeObserverEntry[], observer: ResizeObserver): void;
}
```

We declare a ton of interfaces, and some variables that implement our interfaces, like `declare var ResizeObserver` which is the object that defines the prototype and constructor function:

```typescript
declare var ResizeObserver: {
  prototype: ResizeObserver;
  new(callback: ResizeObserverCallback): ResizeObserver;
};
```

This already helps a lot. We can use the &mdash; arguably &mdash; long type declarations and put them directly in the file where we need them. `ResizeObserver` is found! We want to have it available everywhere, though.

## Augmenting global

Thanks to TypeScript's declaration merging feature, we can extend *namespaces* and *interfaces* as we need it. There are several articles here on how to [extend `Object`](https://fettblog.eu/typescript-better-object-keys/), [JSX types](https://fettblog.eu/typescript-react-extending-jsx-elements/), and more. This time, we're extending the *global namespace*.

The *global* namespace contains all objects and interfaces that are, well, globally available. Like the window object (and `Window` interface), as well as everything else where which should be part of our JavaScript execution context. We *augment* the global namespace and add the `ResizeObserver` object to it:

```typescript
declare global { // opening up the namespace
  var ResizeObserver: { // mergin ResizeObserver to it
    prototype: ResizeObserver;
    new(callback: ResizeObserverCallback): ResizeObserver;
  }
}
```

Let's put `resize-observer.d.ts` in a folder called `@types`. Don't forget to add the folder to both the sources that TypeScript shall parse, as well as the list of type declaration folders in `tsconfig.json`

```typescript
{
  "compilerOptions": {
    //...
    "typeRoots": ["@types", "./node_modules/@types"],
    //...
  },
  "include": ["src", "@types"]
}

```

Since there might be a significant possibility that `ResizeObserver` is not yet available in your target browser, make sure that you make the `ResizeObserver` object possibly `undefined`. This urges you to check if the object is available:

```typescript
declare global {
  var ResizeObserver: {
    prototype: ResizeObserver;
    new(callback: ResizeObserverCallback): ResizeObserver;
  } | undefined
}
```

In your application:

```typescript
if(typeof ResizeObserver !== 'undefined') {
  const x = new ResizeObserver((entries) => {})
}
```

This makes working with `ResizeObserver` as safe as possible!


## Troubleshooting

It might be that TypeScript doesn't pick up your ambient declaration files and the *global* augmentation. If this happens, make sure that:

1. You parse the `@types` folder via the `include` property in `tsconfig.json`
2. Your ambient type declaration files are recognized as such by adding them to `types` or `typeRoots` in the `tsconfig.json` compiler Options
3. Add `export {}` at the end of your ambient declaration file so TypeScript recognizes this file as a module

## Further reading

All the links above, plus:

- [The WebIDL specification](https://heycam.github.io/webidl/)
- A template for modifying the [global namespace](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html)
- All posts on this site! 😉

