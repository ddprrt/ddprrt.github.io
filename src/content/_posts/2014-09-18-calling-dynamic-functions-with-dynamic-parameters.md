---
title: "Calling Dynamic Functions with Dynamic Paramters"
published: true
categories:
- JavaScript
permalink: /snippets/javascript/calling-dynamic-functions-with-dynamic-parameters/
---

Useful for wrapper APIs or communicating with external interfaces:

```typescript
function callFunction(fn) {
  this[fn].apply(this, Array.prototype.slice.call(arguments, 1));
}

callFunction("alert", "It works");
callFunction("setTimeout", function() {
  alert("Timeout after 5s");
}, 5000);
```
