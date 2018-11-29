---
title: "TypeScript: Built in generic types"
layout: post
categories:
- TypeScript
published: true
permalink: /typescript-built-in-generics/
---

TypeScript comes with a ton of built in generic types that ease your development workflow.

Here's a list of all built-in generics, with examples!

1. [Readonly](#readonly)
2. [ReadonlyArray](#readonlyarray)
3. [ReturnType](#returntype)
4. [Partial](#partial)
5. [Required](#required)
6. [NonNullable](#nonnullable)

## Readonly

`const` in JavaScript is tricky, because it only means you can't reassign any other values to this
name. It allows however for changing properties of an object. The `Readonly` built-in type helps:

```javascript
type Point = {
  x: number,
  y: number
};

const p: Readonly<Point> = {
  x: 4,
  y: 2
};

p.x = 5; // ⚡️ compile error!
```

## ReadonlyArray

The generic, built-in type `ReadonlyArray` allows us to throw errors once we use an array function
that mutates the original array. See for yourself:

```javascript
const values: ReadonlyArray<number> = [1, 2, 3, 4, 5];

values.push(6); // ⚡️ compile error! This mutates the array
values.filter(x => x > 4); // ✔︎ compiles! filter returns a new array
```

Handy if you want to keep an immutable array!

## ReturnType

This built-in type gets you the return type of any function.

```javascript
type Point = {
  x: number,
  y: number
}

function generateSquare(bottomLeft: Point, topRight: Point) {
  return {
    bottomLeft,
    bottomRight: {
      x: topRight.x,
      y: bottomLeft.y,
    },
    topLeft: {
      x: bottomLeft.x,
      y: topRight.y
    },
    topRight
  }
}

type Square = ReturnType<typeof generateSquare>; 
// here's the magic! I can use this return type now everywhere
// in my code

function areaOfSquare(square: Square): number {
  //do something
  return result;
}
```

You can also access functions inside classes:

```javascript
class Square {
  generate(bottomLeft, topRight) {
    return {
      bottomLeft,
      bottomRight: {
        x: topRight.x,
        y: bottomLeft.y,
      },
      topLeft: {
        x: bottomLeft.x,
        y: topRight.y
      },
      topRight
    }
  }
}

type TSquare = ReturnType<Square['generate']>;
declare let result: TSquare;
```

## Partial

`Partial<T>` is a beauty. It takes all properties from one type, and makes them optional.
What is it good for? Think about having a set of default options, and you want to override
just parts and pieces from them. `Partial<T>` helps you getting autocomplete and type-checking for that case:

```javascript
const defaultOptions = {
  directory: '.',
  incremental: true, 
  filePattern: '**/*',
}

function start(options: Partial<typeof defaultOptions>) {
  const allOptions = Object.assign({}, defaultOptions, options);
  console.log(allOptions); 
}

start({
  incremental: false, // Awesome! Typechecks!
});

start({
  flatten: true // ⚡️ Error! This property has nothing to do with our options
});
```

## Required

`Required<T>` is the opposite to `Partial<T>`. Where `Partial<T>` makes every property optional, required makes
ever property necessary.

```javascript
type Container = {
  width: number,
  height: number, 
  children?: Container[]
}

function getChildrenArea(parent: Required<Container>) {
  let sum = 0;
  for (let child of parent.children) {
    sum = sum + (child.width * child.height)
  }
  return sum;
}

const mainContainer: Container = {
  width: 200,
  height: 100
}

getChildrenArea(mainContainer); // ⚡️ Error: Needs children
```

## NonNullable

`NonNullable<T>` helps you to ensure you don't pass `null` or `undefined` to your functions. 
This complements the `strictNullChecks` compiler flag, so make sure you activate it.

```javascript
function print<T>(x: NonNullable<T>) {
  console.log(x.toString());
}

print('Hello');
print(2);
print(null); // ⚡️ Error
print(undefined); // ⚡️ Error
```

