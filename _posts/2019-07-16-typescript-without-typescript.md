---
layout: post
categories:
  - TypeScript
published: true
permalink: /typescript-jsdoc-superpowers/
title: "TypeScript without TypeScript -- JSDoc superpowers"
---

One way to think about TypeScript is as a thin layer around JavaScript that adds type annotations.
Type annotations that make sure you don't make any mistakes. The TypeScript team worked hard on making
sure that type checking also works with regular JavaScript files. Let's see how.

In the best case, TypeScript finds out types on its own by infering correctly from 
the way you use JavaScript.

```javascript
function addVAT(price, vat) {
  return price * (1 + vat) // Oh! You add and mulitply with numbers, so it's a number
}
```

In the example above, we mulitply values. This operation is only valid for type `number`. With this information,
TypeScript knows that the return value of `addVAT` will be of type `number`.

To make sure the input values are correct, we can add default values:

```javascript
function addVAT(price, vat = 0.2) { // great, `vat`is also number!
  return price * (1 + vat)
}
```

But type inference just can get so far. We can provide more information for TypeScript by adding JSDoc comments:

```javascript
/**
 * Adds VAT to a price
 * 
 * @param {number} price The price without VAT
 * @param {number} vat The VAT [0-1]
 * 
 * @returns {number}
 */
function addVAT(price, vat = 0.2) {
  return price * (1 + vat)
}
```

Paul Lewis has a great [video](https://www.youtube.com/watch?v=YHvqbeh_n9U) on that. But there's a lot, lot more
to it than a couple of basic types in comments. Turns out working with JSDoc type gets you very far.

## Activating reports

To make sure you not only provide type information, but get actual error feedback in your editor (or via `tsc`), please
activate the `@ts-check` flag in your source files:

```javascript
// @ts-check
```

If there's one particular line that errors, but you think you know better, add the `@ts-ignore` flag:

```javascript
// @ts-ignore
addVAT('1200', 0.1); // would error otherwise
```

## Defining objects

## Defining functions

## Importing types

## Working with generics

## Enums

## typeof

One of my most favourite tools, `typeof` is also available. Saves you a ton of editing:

```javascript
/**
 * @param {number} status The status code as a number
 * @param {string} data The data to work with
 */
function defaultCallback(status, data) {
  if(status === 200) {
    document.body.innerHTML = data
  }
}

/**
 * @param {string} url the URL to load data from
 * @param {typeof defaultCallback} cb what to do afterwards
 */
function loadData(url, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url)
  xhr.onload = () => {
    cb(xhr.status, xhr.responseText)
  }
}
```

## extending and augmenting from classes

{% include helper/include-by-tag.html tag="TypeScript" title="More articles about TypeScript" %}
