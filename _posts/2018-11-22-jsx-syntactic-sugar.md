---
title: "JSX is syntactic sugar"
layout: post
categories:
- React
- TypeScript
- Vue.js
published: true
permalink: /jsx-syntactic-sugar/
---

If you follow me you know that I'm super late to the React game. It was not until functional components showed up that I got 
really interested in the framework. I just loved the idea of having everything wrapped in an easy function rather than needing
to navigate up and down a class to get everything together. One thing that put me off in the beginning though was JSX. And I'm
sure I'm not the only one. Every time I talk to people about my newly found React love, this point comes up constantly. 

"JSX mixes HTML with my JavaScript, that's ugly!"

Except that JSX doesn't. Here's what JSX is not:

- JSX is not a templating language
- JSX is not HTML
- JSX is not XML

JSX *looks* like all that, but it's nothing but syntactic sugar.

## JSX is function calls

JSX translates into pure, nested function calls. The React method signature of JSX is `(element, properties, ...children)`. 
With element being either a React component or a string, properties being a JS object with keys and values. Children being empty, or
an array with more function calls.

So:

```javascript
<Button onClick={() => alert('YES')}>Click me</Button>
```

translates to:

```javascript
React.createElement(Button, { onClick: () => alert('YES') }, 'Click me');
```

With nested elements, it looks something like this:

This JSX

```javascript
<Button onClick={() => alert('YES')}><span>Click me</span></Button>
```

translates to:


```javascript
React.createElement(Button, { onClick: () => alert('YES') }, 
  React.createElement('span', {}, 'Click me'));
```

What are the implications of that, especially compared to templates?

- There's no runtime compilation and parsing of templates. Everything goes directly to the virtual DOM or layout engine underneath. 
  That's why it also works with Vue.js so well.
- There's no expressions to evaluate. Everything around is JavaScript.
- Every component property is translatable to a JSX object key. This allows us to type check them. TypeScript works so well with JSX 
  because there's JavaScript underneath.

So everything *looks* like XML, except that it's JavaScript functions. If you are a seasoned web developer like I am, think like that:
Ever wanted to write to the DOM directly, but gave up because it's so unwieldy? Come on, `document.createElement` is probably easy, 
but you have to do a ton of calls to the DOM API do get what you can achieve so easily by writing HTML.

JSX solves that. With JSX you have a nice and familiar syntax of writing elements without HTML. 

## Writing the DOM with JSX

I mentioned TypeScript earlier. With TypeScript, we have the possibility to change the JSX factory. That's how 
TypeScript is able to compile JSX for React, Vue.js, Dojo... any other framework using JSX in one way or the other. The virtual DOM implementations underneath might differ, but the interface is the same:

```javascript
/**
 * element: string or component
 * properties: object or null
 * ...children: null or calls to the factory
 */
function factory(element, properties, ...children) { ... }
```


```javascript
function DOMparseChildren(children) {
  return children.map(child => {
    if(typeof child === 'string') {
      return document.createTextNode(child);
    }
    return child;
  })
}

function nonNull(val, fallback) { return Boolean(val) ? val : fallback };

function DOMparseNode(element, properties, children) {
  const el = document.createElement(element);
  Object.keys(nonNull(properties, {})).forEach(key => {
      el[key] = properties[key];
  })
  DOMparseChildren(children).forEach(child => {
    el.appendChild(child);
  });
  return el;
}

function DOMcreateElement(element, properties, ...children) {
  if(typeof element === 'function') {
    return element({
      ...nonNull(properties, {}),
      children
    });
  }
  return DOMparseNode(element, properties, children);
}

const Button = ({ msg }) => {
  return <button onclick={() => alert(msg)}><strong>Click me</strong></button>
}

const el = <div>
  <h1 className="what">Hello world</h1>
  <p>
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae sed consectetur placeat veritatis 
    illo vitae quos aut unde doloribus, minima eveniet et eius voluptatibus minus aperiam sequi asperiores, odio ad?
  </p>
  <Button msg='Yay' />
  <Button msg='Nay' />
</div>

document.body.appendChild(el);
```
