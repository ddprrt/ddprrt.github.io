---
layout: post
categories:
  - TypeScript
published: true
permalink: /typescript-validate-mapped-types-and-const-context/
title: "TypeScript: Validate mapped types and const context"
---

Mapped types are great, as they allow for the flexibility in object structures JavaScript is known for.
But they have some crucial implications on the type system. Take this example:

```javascript
type Messages = 
  'CHANNEL_OPEN' | 'CHANNEL_CLOSE' | 'CHANNEL_FAIL' | 
  'MESSAGE_CHANNEL_OPEN' | 'MESSAGE_CHANNEL_CLOSE' | 'MESSAGE_CHANNEL_FAIL'

type ChannelDefinition = {
  [key: string]: {
    open: Messages,
    close: Messages,
    fail: Messages
  }
}
```

This is from a generic messaging library, that takes a "channel definition" where multiple 
channel tokens can be defined. The keys from this channel definition object are what the user
wants it to be. So this is a valid channel definition:

```javascript
const impl: ChannelDefinition = {
  test: {
    open: 'CHANNEL_OPEN',
    close: 'CHANNEL_CLOSE',
    fail: 'CHANNEL_FAIL'
  },
  message: {
    open: 'MESSAGE_CHANNEL_OPEN',
    close: 'MESSAGE_CHANNEL_CLOSE',
    fail: 'MESSAGE_CHANNEL_FAIL'
  }
} 
```

We have a problem when we want to access the keys we defined so flexibly. Let's say we have
a function that opens a channel. We pass the whole channel definition object, as well as the
channel we want to open.

```javascript
declare function openChannel(
  def: ChannelDefinition,
  channel: keyof ChannelDefinition
)
```

So what are the keys of `ChannelDefinition`? Well, it's every key: `[key: string]`. So the 
moment we assign a specific type, TypeScript treats `impl` as this specific type, ignoring
the actual implementation. The contract is fulfilled. Moving on. This allows for wrong keys to
be passed:

```javascript
openChannel(impl, 'massages') // Passes, even though "massages" is no part of impl
```

So we are more interested in the actualy implementation, not the type we assing to our constant.
This means we have to get rid of the `ChannelDefinition` type and make sure we care about the
actual type of the object.

First, the `openChannel` function should take any object that is a subtype of `ChannelDefinition`, 
but work with the concrete subtype:

```diff
- declare function openChannel(
-   def: ChannelDefinition,
-   channel: keyof ChannelDefinition
- )
+ declare function openChannel<T extends ChannelDefinition>(
+   def: T,
+   channel: keyof T
+ )
```

TypeScript now works on two levels:

1. Checking if `T` actually extends `ChannelDefinition`. If so, we work with type `T`
2. All our function parameters are typed with the generic `T`. This also means we get
   the *real* keys of `T` through `keyof T`.

To benefit from that, we have to get rid of the type definition for `impl`. The explicit
type definition overrides all actual types. From the moment we explicitly specify the type,
TypeScript treats it as `ChannelDefinition`, not the actual underlying subtype. We also have
to set `const` context, so we can convert all strings to their unit type (and thus be compliant
with `Messages`):

```diff
- const impl: ChannelDefinition = { ... };
+ const impl: { ... }  as const;
```

Without `const` context, the inferred type of `impl`is:
```javascript
/// typeof impl 
{
  test: {
    open: string;
    close: string;
    fail: string;
  };
  message: {
    open: string;
    close: string;
    fail: string;
  };
}
```

With `const` context, the actual type of `impl` is now:

```javascript
/// typeof impl 
{
  test: {
    readonly open: "CHANNEL_OPEN";
    readonly close: "CHANNEL_CLOSE";
    readonly fail: "CHANNEL_FAIL";
  };
  message: {
    readonly open: "MESSAGE_CHANNEL_OPEN";
    readonly close: "MESSAGE_CHANNEL_CLOSE";
    readonly fail: "MESSAGE_CHANNEL_FAIL";
  };
}
```

`const` context allows us to satisfy the contract made by
`ChannelDefinition`. Now, `openChannel` correctly errors:

```javascript
openChannel(impl, 'messages') // ✅ satisfies contract
openChannel(impl, 'massages') // 💥 bombs
```

You might be in a space where you need to work with the concrete type, that satisfies
the `ChannelDefinition` contract, outside of a function. For that, we can mimic the same
behaviour using the `Validate<T, U>` helper type:

```javascript
type Validate<T, U> = T extends U ? T : never; 
```

Use this as follows:

```javascript
const correctImpl = {
  test: { open: 'CHANNEL_OPEN', close: 'CHANNEL_CLOSE', fail: 'CHANNEL_FAIL' }
} as const;

const wrongImpl = {
  test: { open: 'OPEN_CHANNEL', close: 'CHANNEL_CLOSE', fail: 'CHANNEL_FAIL' }
} as const;


// ✅ returns typeof correctImpl
type ValidatedCorrect 
  = Validate<typeof correctImpl, ChannelDefinition>;

// 💥 returns never
type ValidatedWrong 
  = Validate<typeof wrongImpl, ChannelDefinition>;
```

As always, there's a [pen](https://www.typescriptlang.org/play/index.html#code/C4TwDgpgBAshDO8CGBzBUC8UDkBhAEgIIByxAogDID6A8gApnHZQA+OBJ51uFNAymWZs8RUpSoAxQgEkKQqAFgAUFBwwyfPoQDiZKhzHV6jednWadeg1328Bp81t37RNqbOzLloSFFwALJAA7IIgAGwARCAAzAEsg2OBYgHsgzCgAb2VVAG0AawgQAC4oeGAAJ3iUAF0SrJVVKGTIIJK4RFQEABpsxoBjMOT4CDaEZDR4HobVaKRYsNGOid6AX2U1pWU+1LKoWIBbMDD0+tVgBGA63tVmiFb2V3FjJinGqAGhkYfOcR5+QVejVm8xKIh+1HcclWgP2Y06V2mTRaoMclhc4NoDBe13eg2GKI0Tisj24dgBOOBCzUhLR1nEkM8DQ2KygSHg7x2wAA3F4lAATCADJDlaDRACuQT6SVSSLuAWCoTCAAoBXEEtL7vKQuEomrEikgl13oFtVSCiBktE-CbFbr4vrUgBKEoAN2SsT5PM2SluQS1iqVByORuw5zKACZsI7eT5oAA1JBhD1Ic4AHmkRtwAD50tIoBAAB7nIJ89m4KAAfigeZKoRdEHKXMU3oFQpFUHFko1sr9NvCCaTfJTEFTABUsyqYvaNSUB8m06PM33IlP1Qas0a+suSubLVBR86oG6PV7lL7-f3E-OIIHDmEQ2HgJHoy3BWFhaKJVKDT2L2EyEWdx8mO+aASWZbLnaa6pBOqolIuxoKuEO6FHuB6uu6nq8uey4AcWfK3sGOCPs+QA) for you to fiddle around.

{% include helper/include-by-tag.html tag="TypeScript" title="More articles about TypeScript" %}
