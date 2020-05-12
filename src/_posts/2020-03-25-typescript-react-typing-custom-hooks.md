---
layout: post
categories:
  - TypeScript
  - JavaScript
  - React
published: true
permalink: /typescript-react-typeing-custom-hooks/
title: "TypeScript + React: Typing custom hooks with tuple types"
---

I recently stumbled upon a question on Reddit's [LearnTypeScript](https://www.reddit.com/r/LearnTypescript/) subreddit regarding custom React hooks. A user wanted to create a toggle custom hook, and stick to the naming convention as regular React hooks do: Returning an array that you destructure when calling the hook. For example `useState`:

```javascript
const [state, setState] = useState(0)
```

Why an array? Because you the array's fields have no name, and you can set names on your own:

```javascript
const [count, setCount] = useState(0)
const [darkMode, setDarkMode] = useState(true)
```

So naturally, if you have a similar pattern, you also want to return an array.

A custom toggle hook might look like this:

```javascript
export const useToggle = (initialValue: boolean) => {
  const [value, setValue] = useState(initialValue)
  const toggleValue = () => setValue(!value)
  return [value, toggleValue]
}
```
Nothing out of the ordinary. The only types we have to set are the types of our input parameters. Let's try to use it:

```javascript
export const Body = () => {
  const [isVisible, toggleVisible] = useToggle(false)
  return (
    <>
      {/* It very much booms here! 💥 */ }
      <button onClick={toggleVisible}>Hello</button>
      {isVisible && <div>World</div>}
    </>
  )
}
```

So why does this fail? TypeScript's error message is very elaborate on this: *Type 'boolean \| (() => void)' is not assignable to type '((event: MouseEvent<HTMLButtonElement, MouseEvent>) => void) \| undefined'. Type 'false' is not assignable to type '((event: MouseEvent<HTMLButtonElement, MouseEvent>) => void) \| undefined'.*

It might be very cryptic. But what we should look out for is the first type, which is declared incompatible: `boolean | (() => void)'`. This comes from returning an array. An array is a list of any length, that can hold as many elements as virtually possible. From the return value in `useToggle`, TypeScript infers an array type. Since the type of `value` is boolean (great!) and the type of `toggleValue` is `(() => void)` (a function returning nothing), TypeScript tells us that both types are possible in this array.

And this is what breaks the compatibility with `onClick`. `onClick` expects a function. Good, `toggleValue` (or `toggleVisible`) is a function. But according to TypeScript, it can also be a boolean! Boom! TypeScript tells you to be explicit, or at least do type checks.

But we shouldn't need to do extra type-checks. Our code is very clear. It's the types that are wrong. Because we're not dealing with an array.

Let's go for a different name: Tuple. While an array is a list of values that can be of any length, we know exactly how many values we get in a tuple. Usually, we also know the type of each element in a tuple.

So we shouldn't return an array, but a tuple at `useToggle`. The problem: In JavaScript an array and a tuple are indistinguishable. In TypeScript's type system, we can distinguish them.

## Option 1: Add a return tuple type

First possibility: Let's be intentional with our return type. Since TypeScript -- correctly! -- infers an array, we have to tell TypeScript that we are expecting a tuple. 

```javascript
// add a return type here
export const useToggle = (initialValue: boolean): [boolean, () => void] => {
  const [value, setValue] = useState(initialValue)
  const toggleValue = () => setValue(!value)
  return [value, toggleValue]
}
```

With `[boolean, () => void]` as a return type, TypeScript checks that we are returning a tuple in this function. TypeScript does not infer anymore, but rather makes sure that your intended return type is matched by the actual values. And voila, your code doesn't throw errors anymore.

## Option 2: as const

With a tuple, we know how many elements we are expecting, and know the type of these elements. This sounds like a job for freezing the type with a const assertion.

```javascript
export const useToggle = (initialValue: boolean) => {
  const [value, setValue] = useState(initialValue)
  const toggleValue = () => setValue(!value)
  // here, we freeze the array to a tuple
  return [value, toggleValue] as const
}
```

The return type is now `readonly [boolean, () => void]`, because `as const` makes sure that your values are constant, and not changeable. This type is a little bit different semantically, but in reality, you wouldn't be able to change the values you return outside of `useToggle`. So being `readonly` would be slightly more correct.

And this is, a perfect use case for tuple types! As always, there's a [playground link](https://www.typescriptlang.org/play/index.html?jsx=2#code/JYWwDg9gTgLgBAJQKYEMDGMA0cDecCuAzkgMowoxIC+cAZlBCHAORSobMBQnSAHpLDhoIAO0LwiSACoQA5rIA2SOAF44ACmAjgMYCgUA1ffiQAuOACMIEJShEBKcwG0rN1COzr7qgHxwAbhDAACYAur64nHBCouJwTv7GSNjEMEYKJuFqkmQUSJrauvrpJvZRMWLwMHKKSCXKal4RqfXqAISJGUhl0Www+FAi8Z0m2NXySvWhnFTcPPzQ8MKVBMQAwrEwMhMNGlo6eoZJ5q62DhE45ctxCUkpSGlJWauk5JQFB8VJPRVx47X1VQabwqPwtJLtEbdcp9AZDW5dMY1SZPOAoQi-GAzbh8ARLTZwABCEGCAE8gU1QZFotd4E5gIQDAzgBYlEidkzCCylM9JNtaupaPpiD9YYMNOVogAeHyS6JwKUWfAwapDURrBTANAAaxUOH+k2ZrOoPgAEkgFAoIFKAPRKlWiWXy+U4Bmc7nKABknoVwWA-h8AHVoApgra-QHZs7bU64GUqEA) for you to fiddle around! Have fun!

 //include helper/include-by-tag.html tag="TypeScript" title="More articles about TypeScript"
