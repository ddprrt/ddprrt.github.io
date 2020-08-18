---
title: "this in JavaScript and TypeScript"
categories:
  - TypeScript
  - JavaScript
---

*Sometimes when writing JavaScript, I want to shout "This is ridiculous!". But then I never know what `this` refers to*. 

If there is one concept in JavaScript that confuses people, it has to be `this`. Especially if your background is a class-based object oriented programming languages, where `this` always refers to an instance of a class. `this` in JavaScript is entirely different, but not necessarily harder to understand. There're a few basic rules, and about as much exceptions to keep in mind. And TypeScript can help greatly!

## this in regular JavaScript functions

A way I like to think about `this` is that in regular functions (with the `function` keyword or the object function short-hand), resolve to "the nearest object", which is the object that they are bound to. For example:

```typescript
const author = {
  name: 'Stefan',
  // function shorthand
  hi() {
    console.log(this.name)
  }
}

author.hi() // prints 'Stefan'
```

In the example above, `hi` is bound to `author`, so `this` is `author`. 

JavaScript is flexible, you can attach functions or apply functions to an object on the fly.

```typescript
const author = {
  name: 'Stefan',
  // function shorthand
  hi() {
    console.log(this.name)
  }
}

author.hi() // prints 'Stefan'

const pet = {
  name: 'Finni',
  kind: 'Cat'
}

pet.hi = author.hi

pet.hi() // prints 'Finni'
```

The "nearest object" is `pet`. `hi` is bound to `pet`.

We can declare a function independently from objects and still use it in the object context with `apply` or `call`:

```typescript
function hi() {
  console.log(this.name)
}

const author = {
  name: 'Stefan'
}

const pet = {
  name: 'Finni',
  kind: 'Cat'
}

hi.apply(pet) // prints 'Finni'
hi.call(author) // prints 'Stefan'
```

The nearest object is the object we pass as the first argument. The documentation call the first argument `thisArg`, so the name tells you already what to expect.

### apply vs call

What's the difference between `call` and `apply`? Think of a function with arguments:

```typescript
function sum(a, b) {
  return a + b
}
```

With `call` you can pass the arguments one by one:

```typescript
sum.call(null, 2, 3)
```

`null` is the object sum should be bound to, so no object.

With `apply`, you have to pass the arguments in an array:

```typescript
sum.apply(null, [2, 3])
```

An easy mnemonic to remember this behaviour is **a**rray for **a**pply, **c**ommas for **c**all.

### bind

Another way to explicitly *bind* an object to an object-free function is by using `bind`

```typescript
const author = {
  name: 'Stefan'
}

function hi() {
  console.log(this.name)
}

hi.bind(author)

hi() // prints 'Stefan'
```

This is already cool, but more on that later.

### Event listeners

The concept of the "nearest object" helps a lot when you work with event listeners:

```typescript
const button = document.querySelector('button')

button.addEventListener('click', function() {
  this.classList.toggle('clicked')
})
```

`this` is `button`. `addEventListener` sets one of many `onclick` functions. Another way of doing that would be

```typescript
button.onclick = function() {
  this.classList.toggle('clicked')
}
```

which makes it a bit more obvious why `this` is `button` in that case.

## this in arrow functions and classes

So I spent half of my professional JavaScript career to totally understand what `this` refers to, just to see the rise of classes and arrow functions which turn everything upside down again. 

Arrow functions always resolve `this` respective to their lexical scope. Lexical scope means that the inner scope is the same as the outer scope, so `this` inside an arrow function is the same as outside an arrow function. For example:

```typescript
const lottery = {
  numbers: [4, 8, 15, 16, 23, 42],
  el: 'span',
  html() {
    // this is lottery
    return this.numbers.map(number =>
       //this is still lottery
       `<${this.el}>${number}</${this.el}>`).join()
  }
}
```

Calling `lottery.html()` gets us a string with all numbers wrapped in spans, as `this` inside the arrow function of `map` doesn't change. It's still `lottery`.

If we would use a regular function, `this` would be undefined, as there is no nearest `object`. We would have to bind `this`:

```typescript
const lottery = {
  numbers: [4, 8, 15, 16, 23, 42],
  el: 'span',
  html() {
    // this is lottery
    return this.numbers.map(function(number) {
      return  `<${this.el}>${number}</${this.el}>`
    }.bind(this)).join('')
  }
}
```

Tedious.

In classes, `this` also refers to the lexical scope, which is the class instance. Now we're getting Java-y!

```typescript

class Author {
  constructor(name) {
    this.name = name
  }

  // lexical, so Author
  hi() {
    console.log(this.name)
  }

  hiMsg(msg) {
    // lexical, so still author!
    return () => {
      console.log(`${msg}, ${this.name}`)
    }
  }
}

const author = new Author('Stefan')
author.hi() //prints '
author.hiMsg('Hello')() // prints 'Hello, Stefan'
```

### unbinding

Problems occur if you accidentally *unbind* a function, e.g. by passing a function that is bound to some other function, or storing it in a variable.

```typescript
const author = {
  name: 'Stefan',
  hi() {
    console.log(this.name)
  }
}

const hi = author.hi()
// hi is unbound, this refers to nothing
// or window/global in non-strict mode
hi() // 💥
```

You would have to re-bind the function. This also explains some behaviour in React class components with event handlers:

```typescript
class Counter extends React.Component {
  constructor() {
    super();
    this.state = {
      count: 1
    };
  }

  // we have to bind this.handleClick to the
  // instance again, because after being
  // assigned, the function loses its binding ...
  render() {
    return (
      <>
        {this.state.count}
        <button onClick={this.handleClick.bind(this)}>+</button>
      </>
    );
  }

  //... which would error here as we can't
  // call `this.setState`
  handleClick() {
    this.setState(({ count }) => ({
      count: count + 1
    }));
  }
}
```

## this in TypeScript

TypeScript is pretty good at finding the "nearest object" or knowing the lexical scope, so TypeScript can give you exact information on what to expect from `this`. There are however some edge cases where we can help a little.

### this arguments

Think of extract an event handler function into its own function:

```typescript
const button = document.querySelector('button')
button.addEventListener('click', handleToggle)

// Huh? What's this?
function handleToggle() {
  this.classList.toggle('clicked') //💥
}
```

We lose all information on `this` since `this` would now be `window` or `undefined`. TypeScript gives us red squigglies as well!

We add an argument at the first position of the function, where we can define the type of `this`.

```typescript
const button = document.querySelector('button')
button.addEventListener('click', handleToggle)

function handleToggle(this: HTMLElement) {
  this.classList.toggle('clicked') // 😃
}
```

This argument gets removed once compiled. We now know that `this` will be of type `HTMLElement`, which also means that we get errors once we use `handleToggle` in a different context.

```typescript
// The 'this' context of type 'void' is not 
// assignable to method's 'this' of type 'HTMLElement'.
handleToggle() // 💥
```

## ThisParameterType and OmitThisParameter

There are some helpers if you use `this` parameters in your function signatures.

`ThisParameterType` tells you which type you expect `this` to be:

```typescript
const button = document.querySelector('button')
button.addEventListener('click', handleToggle)

function handleToggle(this: HTMLElement) {
  this.classList.toggle('clicked') // 😃
  handleClick.call(this)
}

function handleClick(this: 
  ThisParameterType<typeof handleToggle>
) {
  this.classList.add('clicked-once')
}
```

`OmitThisParameter` removes the `this` typing and gives you the blank type signature of a function.

```typescript
// No reason to type `this` here!
function handleToggle(this: HTMLElement) {
  console.log('clicked!')
}

type HandleToggleFn 
  = OmitThisParameter<typeof handleToggle>

declare function toggle(callback: HandleToggleFn)

toggle(function() {
  console.log('Yeah works too')
}) // 👍
```

## ThisType

There's another generic helper type that helps defining `this` for objects.
