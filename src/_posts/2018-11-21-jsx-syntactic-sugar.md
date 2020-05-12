---
title: "JSX is syntactic sugar"
layout: post
categories:
- React
- TypeScript
- Vue.js
published: true
permalink: /jsx-syntactic-sugar/
og:
  img: wp-content/uploads/ogimgs/jsx.png
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
but you have to do a ton of calls to the DOM API to get what you can achieve so easily by writing HTML.

JSX solves that. With JSX you have a nice and familiar syntax of writing elements without HTML. 

## Writing the DOM with JSX

I mentioned TypeScript earlier. TypeScript is a full blown JSX compiler. 
With TypeScript, we have the possibility to change the JSX factory. That's how 
TypeScript is able to compile JSX for React, Vue.js, Dojo... any other framework using JSX in one way or the other. 
The virtual DOM implementations underneath might differ, but the interface is the same:

```javascript
/**
 * element: string or component
 * properties: object or null
 * ...children: null or calls to the factory
 */
function factory(element, properties, ...children) { ... }
```

We can use the same factory method signature not only to work with the virtual DOM, we can also use this to work with the real DOM.
Just to have a nice API on top of `document.createElement`.

Let's try! These are the features we want to implement:

1. Parse JSX to DOM nodes, including attributes
2. Have simple, functional components for more composability and flexibility.

Step 1: TypeScript needs to know how to compile JSX for us. Setting two properties in `tsconfig.json` is all we need.


```javascript
{
  "compilerOptions": {
    ...
    "jsx": "react",
    "jsxFactory": "DOMcreateElement",
  }
}
```

We leave it to the React JSX pattern (the method signature we were talking earlier), but tell TypeScript to use our soon to be 
created function `DOMcreateElement` for that.

Next, we implement our factory function. This is just a couple lines of code, so I'll leave everything here and have 
detailed comments below:

```javascript
/**
 * A helper function that ensures we won't work with null values
 */
function nonNull(val, fallback) { return Boolean(val) ? val : fallback };

/**
 * How do we handle children. Children can either be:
 * 1. Calls to DOMcreateElement, returns a Node
 * 2. Text content, returns a Text
 * 
 * Both can be appended to other nodes.
 */
function DOMparseChildren(children) {
  return children.map(child => {
    if(typeof child === 'string') {
      return document.createTextNode(child);
    }
    return child;
  })
}

/**
 * How do we handle regular nodes.
 * 1. We create an element
 * 2. We apply all properties from JSX to this DOM node
 * 3. If available, we append all children.
 */
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

/**
 * Our entry function.
 * 1. Is the element a function, than it's a functional component.
 *    We call this function (pass props and children of course)
 *    and return the result. We expect a return value of type Node
 * 2. If the element is a string, we parse a regular node
 */
function DOMcreateElement(element, properties, ...children) {
  if(typeof element === 'function') {
    return element({
      ...nonNull(properties, {}),
      children
    });
  }
  return DOMparseNode(element, properties, children);
}
```

To sum it up:

1. The factory function takes elements. Elements can be of type string or a function.
2. A function element is a component. We call the function, because we expect to get a 
   DOM Node out of it. If the function component has also more function components inside, they
   will eventually resolve to a DOM Node at some point
3. If the element is a string, we create a regular DOM Node. For that we call `document.createElement`
4. All properties are passed to the newly created Node. Now you might understand why React has something like
   `className` instead of `class`. This is because the DOM API underneath is also `className`. `onClick` is 
   camel-case, though, which I find a little odd.
5. Our implementation only allows DOM Node properties in our JSX, because of that simple property passing
6. If our component has children (pushed together in an array), we parse children as well and append them.
7. Children can be either a call to `DOMcreateElement`, resolving in a DOM Node eventually. Or a simple string.
8. If it's a string, we create a `Text`. `Text`s can also be appended to a DOM Node.


That's all there is! Look at the following code example:

```javascript
const Button = ({ msg }) => {
  return <button onclick={() => alert(msg)}>
    <strong>Click me</strong>
  </button>
}

const el = <div>
  <h1 className="what">Hello world</h1>
  <p>
    Lorem ipsum dolor sit, amet consectetur 
    adipisicing elit. Quae sed consectetur 
    placeat veritatis 
    illo vitae quos aut unde doloribus, minima eveniet et 
    eius voluptatibus minus aperiam 
    sequi asperiores, odio ad?
  </p>
  <Button msg='Yay' />
  <Button msg='Nay' />
</div>

document.body.appendChild(el);
```

Our JSX implementation returns a DOM Node with all its children. We can even use function components for it.
Instead of templates, we work with the DOM directly. But the API is a lot nicer!

## Bottom line

JSX is syntactic sugar for function calls. This allows us to work with the DOM or virtual DOM directly, without any
detours. This is also what makes JSX so powerful, even if it's so simple: All around and inside is JavaScript. You can
be as expresssive as you can be with JavaScript, you are not limited to any templating language.

This also means that JSX is just as nice and beautiful to read as the code written with it. Producing bad and unreadable
code can happen to everybody in every programming language. A bit of syntactic sugar won't help here.

For me, putting together this little example helped me a lot to understand what's going on behind the scenes. And it made me 
appreciate JSX and React a lot more. Now I know that I'm not mixing HTML with JavaScript or something like that. I'm calling
functions. It just has a lot of angle brackets...

*P.S. You can find the code at [GitHub](https://github.com/ddprrt/dom-jsx)*

 //include helper/include-by-tag.html tag="TypeScript" title="More articles about TypeScript"
