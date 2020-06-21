---
title: "Large node module dependencies &mdash; an issue?"
categories:
- Node.js
- Serverless
---

The other day, I had some friends frowning over the 800KB size of a node application. This brought to my attention that I never really worried about the size of my dependencies in a Node.js application. 

Which is odd, as I constantly worry about size when shipping JavaScript to the browser. Whereas in Node.js, the size of Node modules has become a meme by now. Many memes!

<figure class="img-holder wide">
  <img src="/wp-content/uploads/2020/node-modules-meme.png"
    alt="The heaviest objects in the universe, with node_modules leading by far" loading="lazy"/>
    <figcaption>You have all seen this meme</figcaption>
</figure>

I used Node.js for tooling and web applications and never thought about the size of my modules. Now with me mostly doing Serverless (Lambdas, functions), I'm wondering if its implications have some impact on functions with some large dependencies chained to it.

So I set out on Twitter to ask the pros about their experience. Thanks to [Nodeconf.eu](https://nodeconf.eu) and [ScriptConf](https://scriptconf.org) I have some connections to the Node and Serverless communities, and they provided me with *all* the insights.

<p class="not-tldr">The TLDR? It depends. For a "normal" Node application, it most likely isn't. It can be on Serverless, though!</p>

This was the original question.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Node.js people: Has module size ever worried you in a production environment? Were there any significant performance drops when adding heavy libraries? <br><br>Maybe the <a href="https://twitter.com/NearForm?ref_src=twsrc%5Etfw">@nearform</a> people (pinging <a href="https://twitter.com/jasnell?ref_src=twsrc%5Etfw">@jasnell</a>, <a href="https://twitter.com/matteocollina?ref_src=twsrc%5Etfw">@matteocollina</a>, <a href="https://twitter.com/addaleax?ref_src=twsrc%5Etfw">@addaleax</a>) have some insights into that 😄</p>&mdash; Stefan Baumgartner (@ddprrt) <a href="https://twitter.com/ddprrt/status/1273883621661827072?ref_src=twsrc%5Etfw">June 19, 2020</a></blockquote>

Brief tweets leave lots of room for details. So this question was way too generic to provide a simple yes or no. The issue can be much more varied and depends highly on people's views:

- When we talk about large depdencies, what size are we talking about. When is something large?
- What causes an issue and what do we see as issues (start-up performance, run-time performance, stability?)

So there was a lot of room to fill. And the wonderful people from the community filled it with their insights. Thank you so much for helping me here!

Let's target the question from three different angles:

## Regular Node.js apps

## Serverless

## The DevOps view
