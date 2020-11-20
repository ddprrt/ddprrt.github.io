---
title: "Tidy TypeScript: Avoid traditional OOP patterns"
categories:
  - TypeScript
  - JavaScript
  - Tidy Typescript
---

This is the third article in a [series of articles](/archive/tidy-typescript/) where I want to highlight ways on how to keep your TypeScript code neat and tidy. This series is heavily opinionated and you might find out things you don't like. Don't take it personal, it's just an opinion.

This time we look at POOP, as in "Patterns of Object Oriented Programming". With traditional OOP I mostly mean class-based OOP, what I assume the vast majority of developers thinks of when talking OOP. If you come from Java or C#, you might see a lot of familiar constructs in TypeScript, which might end up as false friends in the end.

## Avoid static classes

One thing I see a lot from people who worked a lot with Java is their urge to wrap everything inside a class. In Java, you don't have any other options as classes are the only way to structure code. In JavaScript (and thus: TypeScript) there are plenty of other possibilities that do what you want without any extra steps. One of those things is static classes or classes with static methods, a true Java pattern.

```typescript
// Environment.ts

export default class Environment {
  private static variableList: string[] = []
  static variables(): string[] { /* ... */ }
  static setVariable(key: string, value: any): void  { /* ... */ }
  static getValue(key: string): unknown  { /* ... */ }
}

// Usage in another file
import * as Environment from "./Environment";

console.log(Environment.variables());
```

While this works and is even -- sans type annotations -- valid JavaScript, it's way too much ceremony for something that can easily be just plain, boring functions:

```typescript
// Environment.ts
const variableList: string = []

export function variables(): string[] { /* ... */ }
export function setVariable(key: string, value: any): void  { /* ... */ }
export function getValue(key: string): unknown  { /* ... */ }

// Usage in another file
import * as Environment from "./Environment";

console.log(Environment.variables());
```

The interface for your users is exactly the same. You can access module scope variables just the way you would access static properties in a class, but you have them module-scoped automatically. You decide what to export and what to make visible, not some TypeScript field modifiers. Also, you don't end up creating an `Environment` instance that doesn't do anything.

Even the implementation becomes easier. Check out the class version of `variables()`:

```typescript
export default class Environment {
  private static variableList: string[] = []
  static variables(): string[] { 
    return this.variableList;
   }
}
```

As opposed to the module version:

```typescript
const variableList: string = []

export function variables(): string[] {
  return variableList;
}
```

No `this` means less to think about. As an added benefit, your bundlers have an easier time doing tree-shaking, so you end up only with the things you actually use:

```typescript
// Only the variables function and variablesList 
// end up in the bundle
import { variables } from "./Environment";

console.log(variables());
```

That's why a proper module is always preferred to a class with static fields and methods. That's just added boilerplate with no extra benefit.

## Avoid namespaces

As with static classes, I see people with a Java or C# background clinging on to namespaces. Namespaces are a feature that TypeScript introduced to organize code long before ECMAScript modules were standardized. They allowed you to split things across files, merging them again with reference markers.

```typescript
// file users/models.ts
namespace Users {
  export interface Person {
    name: string;
    age: number;
  }
}

// file users/controller.ts

/// <reference path="./models.ts" />
namespace Users {
  export function updateUser(p: Person) {
    // do the rest
  }
}
```

Back then, TypeScript even had a bundling feature. It should still work to this day. But as said, this was before ECMAScript introduced modules. Now with modules, we have a way to organize and structure code that is compatible with the rest of the JavaScript ecosystem. So that's a plus. 

So what do we need namespaces for?

### Extending declarations

Namespaces are still valid if you want to extend definitions from a third party dependency, e.g. that lives inside node modules. Some of my articles use that heavily. For example if you want to extend the global `JSX` namespace and make sure `img` elements feature alt texts:

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

Or if you want to write elaborate type definitions in ambient modules. But other than that? There is not much use for it anymore. 

### Needless namespaces

Namespaces wrap your definitions into an Object. Writing something like this:

```typescript
export namespace Users {
  type User = {
    name: string;
    age: number;
  }

  export function createUser(name: string, age: number): User {
    return { name, age }
  }
}
```

emits something very elaborate:

```typescript
export var Users;
(function (Users) {
    function createUser(name, age) {
        return {
            name, age
        };
    }
    Users.createUser = createUser;
})(Users || (Users = {}));
```

This not only adds cruft, but also keeps your bundlers from tree-shaking properly! Also using them becomes a bit more wordy:

```typescript
import * as Users from "./users";

Users.Users.createUser("Stefan", "39");
```

Dropping them makes things a lot easier. Stick to what JavaScript offers you. Not using namespaces outside of declaration files makes your code clear, simple, and tidy.

## Avoid abstract classes

