---
layout: post
categories:
- TypeScript
published: true
permalink: /typescript-built-in-generics/
title: "TypeScript: Built-in generic types"

---

TypeScript comes with a ton of built in generic types that ease your development workflow. Here's a list of all built-in generics, with examples!

**Note**: This list is probably (most definitely) not complete. If you miss something and 
want to have it added, please reach out to me via [Twitter](https://twitter.com/ddprrt)

See more on:
- [Readonly](#readonly)
- [ReadonlyArray](#readonlyarray)
- [ReturnType](#returntype)
- [Partial](#partial)
- [Required](#required)
- [NonNullable](#nonnullable)
- [Pick](#pick)
- [Record](#record)
- [Extract](#extract)
- [Exclude](#exclude)
- [Bottom line](#bottom-line)

## Readonly

`const` in JavaScript is tricky, because it only means you can't reassign any other values to 
this name. It allows however for changing properties of an object. The `Readonly` built-in 
type helps:

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

The generic, built-in type `ReadonlyArray` allows us to throw errors once we use an array 
function that mutates the original array. See for yourself:

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
just parts and pieces from them. `Partial<T>` helps you getting autocomplete and 
type-checking for that case:

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

`Required<T>` is the opposite to `Partial<T>`. Where `Partial<T>` makes every property 
optional, required makes ever property necessary.

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

## Pick

With `Pick<T, K extends keyof T>` you can create a new type from an existing object, by only 
using a selected list of properties. Lodash's eponymous `pick` function is a good example of
its usage:

```javascript
/**
 * The pick function is generic as well. It has two generic types:
 * - T ... the type of the object we want to pick props from
 * - K ... a subset of all keys in T
 *
 * Our method signature takes an object of type T, the other parameters
 * are collected in an array of type K.
 *
 * The return type is a subset of keys of T.
 */
declare function pick<T, K extends keyof T>(obj: T, ...propsToPick: K[]): Pick<T, K>;

const point3D = {
  x: 2,
  y: 0,
  z: 4
}

const point2D = pick(point3D, 'x', 'y'); // returns a type { x: number, y: number }
```

This one is especially useful when used with other generic types, e.g. `Exclude`. 

## Record

`Record<K, T>` is funny. With it you can say that *every key `K` should be of type `T`. With 
it you can do things like

```javascript
type Person = Record<'firstName' | 'lastName', string>
```

which is the same as `{ firstName: string, lastName: string }`. Or, something like

```javascript
type MetaInfo = {
  title: string,
  url: string
}

type Episodes = Record<string, MetaInfo>
```

Which allows an object with any key possible, but values of type `MetaInfo`.
This is very much alike to `{ [k: string]: MetaInfo }`.

So far, so good. But why have this generic `Record` type if we can achieve similar, if not 
the same results with other methods?
`Record` helps when you deal with other generic types. Let's look at that example: We can 
create a function that transforms all values of an object to a string representation:

```javascript
// The implementation is somewhere else. It converts all values to strings.
declare function allToString<T>(obj: T): Record<keyof T, string>;

const person = {
  firstName: 'Stefan',
  lastName: 'Baumgartner',
  age: Number.MAX_VALUE
}

// all properites in strPerson are now strings
const strPerson = allToString(person);
```

[Check it out here](https://www.typescriptlang.org/play/index.html#src=function%20allToString%3CT%3E(obj%3A%20T)%3A%20Record%3Ckeyof%20T%2C%20string%3E%20%7B%0D%0A%20%20%20%20let%20transfer%3A%20Partial%3CRecord%3Ckeyof%20T%2C%20string%3E%3E%20%3D%20%7B%7D%3B%0D%0A%20%20%20%20for%20(let%20key%20in%20obj)%20%7B%0D%0A%20%20%20%20%20%20%20%20transfer%5Bkey%5D%20%3D%20obj%5Bkey%5D.toString()%3B%0D%0A%20%20%20%20%7D%0D%0A%20%20%20%20return%20transfer%20as%20Record%3Ckeyof%20T%2C%20string%3E%3B%0D%0A%7D%0D%0A%0D%0Aconst%20person%20%3D%20%7B%0D%0A%20%20%20%20firstName%3A%20'Stefan'%2C%0D%0A%20%20%20%20lastName%3A%20'Baumgartner'%2C%0D%0A%20%20%20%20age%3A%20Number.MAX_VALUE%0D%0A%7D%0D%0A%0D%0Atype%20Person%20%3D%20typeof%20person%3B%0D%0A%0D%0Aconst%20strPerson%20%3D%20allToString(person)%3B%0D%0A);


## Extract

`Extract<T, K>` extracts all types from `T` that are assignable to `K`. Let's say you have 
two different types of shape. Circles and rectangles. They look something like that:

```javascript
const rect = {
  width: 200,
  height: 100,
  area() {
    return this.width * this.height;
  },
  perimeter() {
    return this.width * 2 + this.height * 2;
  }
}

const circle = {
  r: 50,
  area() {
    return this.r * this.r * Math.PI;
  },
  perimeter() {
    return 2 * this.r * Math.PI;
  }
}
```

Their types are

```javascript
type Rect = typeof rect;
type Circle = typeof circle;
```

They have something in common: They both have the same methods for `area` and `perimeter`.
These objects might change over time. We still want to make sure that we only access
methods that are available in both of them. With `Extract`, we can get the keys of those
functions:

```javascript
// extracts: 'area' | 'perimeter'
type ShapeFunctionProps = Extract<keyof Rect, keyof Circle>
```

To create a type that has access to all those functions again, we can use the `Record` type
from earlier on:

```javascript
type ShapeFunctions = Record<ShapeFunctionProps, () => number>
```

Now we have this extra type safety in functions that may apply to all of those objects:

```javascript
declare function extensiveMath<T extends ShapeFunctions>(obj: T)

extensiveMath(rect); // ✅ compiles
extensiveMath(circle); // ✅ compiles
```

## Exclude

`Exclude<T, K>` excludes all types from `T` that are assignable to `K`. It's like the
opposite of `Extract`. Let's take the example from earlier:


```javascript
type Rect = typeof rect;
type Circle = typeof circle;

// only has 'width' | 'height';
type RectOnlyProperties = Exclude<keyof Rect, keyof Circle>;

// An object of type { width: number, height: number }
type RectOnly = Record<RectOnlyProperties, number>;

declare function area<T extends RectOnly>(obj: T)

area({
  width: 100,
  height: 100
})  // ✅ compiles;
```

## Bottom line

That's a couple of generic built-in types that might be useful for different cases.
I think the combination of all those generic types is super helpful if you want to
strengthen your library or application without interfering too much. Especially 
when you generate type definitions for methods that allow different parameter types
(as it happens often in JavaScript), they might be much more useful than defining
every possible type outcome on its own.

Again, I'm sure I missed a ton. So if you have any generic built-in type that you 
want to have convered here, let me [https://twitter.com/ddprrt](know);

*Update*: My buddy Martin Hochel has a couple of mapped types that build on top of
those. They are pretty good, so [check them out](https://github.com/Hotell/rex-tils#2-compile-time-typescript-type-helpers)