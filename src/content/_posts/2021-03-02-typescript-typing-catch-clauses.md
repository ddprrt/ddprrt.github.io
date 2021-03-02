---
title: "TypeScript: Narrow types in catch clauses"
categories:
- TypeScript
---

When you are coming from languages like Java, C++, or C#, you are used to doing your error handling by throwing exceptions. And subsequently, catching them in a cascade of `catch` clauses. There are arguably better ways to do error handling, but this one has been around for ages and given history and influences, has also found its way into JavaScript.

So, this is a valid way of doing error handling in JavaScript and TypeScript But try to follow the same flow as with other programming languages, and annotate the error in your `catch` clause.

```typescript
try {
  // something with Axios, for example
} catch(e: AxiosError) {
//         ^^^^^^^^^^ Error 1196 💥
}
```

TypeScript will error with **TS1196**: Catch clause variable type annotation must be 'any' or 'unknown' if specified.

There are a couple of reasons for this:

## 1. Any type can be thrown

In JavaScript, you are allowed to throw every expression. Of course, you can throw "exceptions" (or errors, as we call them in JavaScript), but it's also possible to throw any other value:

```typescript
throw "What a weird error"; // 👍
throw 404; // 👍
throw new Error("What a weird error"); // 👍
```

Since any valid value can be thrown, the possible values to catch are already broader than your usual sub-type of `Error`.

## 2. There is only one catch clause in JavaScript

JavaScript only has one `catch` clause per `try` statement. There have been proposals for multiple catch clauses and even conditional expressions in the distant past, but they never manifested. See [JavaScript - the definitive guide](https://www.oreilly.com/library/view/javascript-the-definitive/9781449393854/ch11s06.html) for -- hold it! -- [JavaScript 1.5](https://www-archive.mozilla.org/js/js15.html) -- what?!?

Instead, you should use this one `catch` clause and do `instanceof` and `typeof` checks ([Source](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)):

```typescript
try {
  myroutine(); // There's a couple of errors thrown here
} catch (e) {
  if (e instanceof TypeError) {
    // A TypeError
  } else if (e instanceof RangeError) {
    // Handle the RangeError
  } else if (e instanceof EvalError) {
    // you guessed it: EvalError
  } else if (typeof e === "string") {
    // The error is a string
  } else if (axios.isAxiosError(e)) {
    // axios does an error check for us!
  } else {
    // everything else  
    logMyErrors(e);
  }
}
```

*Note*: The example above is also the only correct way to narrow down types for `catch` clauses in TypeScript.

And since all possible values can be thrown, and we only have one `catch` clause per `try` statement to handle them, the type range of `e` is exceptionally broad.

## 3. Any exception can happen

But hey, since you know about every error that can happen, wouldn't be a proper union type with all possible "throwables" work just as well? In theory, yes. In practice, there is no way to tell which types the exception will have. 

Next to all your user-defined exceptions and errors, the system might throw errors when something is wrong with the memory when it encountered a type mismatch or one of your functions has been undefined. A simple function call could exceed your call stack and cause the infamous *stack overflow*.

The broad set of possible values, the single `catch` clause, and the uncertainty of errors that happen only allow two possible types for `e`: `any` and `unknown`.

## What about Promise rejections?

The same is true if you reject a Promise. The only thing TypeScript allows you to specify is the type of a fulfilled Promise. A rejection can happen on your behalf, or through a system error:

```typescript
const somePromise = () => new Promise((fulfil, reject) => {
  if (someConditionIsValid()) {
    resolve(42);
  } else {
    reject("Oh no!");
  }
});

somePromise()
  .then(val => console.log(val)) // val is number
  .catch(e => {
    console.log(e) // e can be anything, really.
  })
```

It becomes clearer if you call the same promise in an `asnyc`/`await` flow:

```typescript
try {
  const z = await somePromise(); // z is number
} catch(e) {
  // same thing, e can be anything!
}
```

## Bottom line

Error handling in JavaScript and TypeScript can be a "false friend" if you come from other programming languages with similar features. Be aware of the differences, and trust the TypeScript team and type checker to give you the correct control flow to make sure your errors are handled well enough.
