---
title: "Are large node module dependencies an issue?"
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

[Matteo](https://twitter.com/matteocollina) from Nearform never experienced any big trouble with big node modules. Especially not with regular Node.js apps.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I&#39;ve never experienced any significant problem about this, even in serverless environments. The few times this has been a problem was solved by splitting said lambda/service into multiple small bits as not all the deps are needed everywhere.</p>&mdash; Matteo Collina (@matteocollina) <a href="https://twitter.com/matteocollina/status/1273889481175810049?ref_src=twsrc%5Etfw">June 19, 2020</a></blockquote>

[Tim Perry](https://twitter.com/pimterry/status/1273905137694752768?s=20) has found some issues with CLI tools where he wants to be as responsive as possible. He used one of Vercel's many Node.js tools to make it fast and swift. [PKG](https://twitter.com/vercel/pkg) creates executables for Windows, Mac and Linux that package the correct Node.js version with it.

## Serverless

When regular Node.js apps boot once and then run, Serverless functions boot once and then ... die some time. Also, Serverless functions run in (Docker) containers that need to be booted as well. And even if everything is supposed to be fast, it isn't as fast as running it on a server that understands Node.js or your local machine.

This is also what [Franziska](https://twitter.com/fhinkel), who worked with the V8 team and is now with GCP, points out:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">It&#39;s a problem for lamdba/functions. Just parsing large deps takes significant time.</p>&mdash; Franziska Hinkelmann, Ph.D. (@fhinkel) <a href="https://twitter.com/fhinkel/status/1273953161703763970?ref_src=twsrc%5Etfw">June 19, 2020</a></blockquote>

So what does significant mean? [Mikhail Shilkov](https://mikhail.io/serverless/coldstarts/big3/) did some great research on that topic. He deployed three different versions of an app that does roughly the same (Hello World style), but with differently sized dependencies. One as-is, around 1KB, one with 14MB of dependencies, one with 35MB of dependencies. 

On GCP, Azure and AWS cold start time rose significantly, with AWS being the fastest:

1. The 1KB as-is version always started below 0.5 seconds
2. Cold start of the 14MB version took between 1.5 seconds and 2.5 seconds
3. Cold start of the 35MB version took between 3.3 seconds and 5.8 seconds

With other vendors, cold start can last up to 23 seconds. This *is* significant. Be sure to check out his [article](https://mikhail.io/serverless/coldstarts/big3/) and the details of each provider! Big shout-out to [Simona Cotin](https://twitter.com/simona_cotin) for pointing me to this one!

[James](https://twitter.com/jasnell/status/1273955716999442433) from Nearform seconds this opinion and points to some work from [Anna](https://twitter.com/addaleax) (who works for Nearform on Node) to possibly enable V8 snapshots for this. 


## The DevOps view

[Frederic](https://twitter.com/fhemberger), [Sebastian](https://twitter.com/sebgie), and [Marvin](https://twitter.com/marvinhagemeist) all point to the cost of CI build time and docker image size. 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">+ 1 to Docker image size, CI build time and slow startup which has already been mentioned.<br><br>There is also a deployment package size limit of 50 MB (zipped), 250 MB (unzipped) on AWS Lambda (<a href="https://t.co/TA5x2jHozm">https://t.co/TA5x2jHozm</a>). Using rollup/ncc can save your deployment in this case.</p>&mdash; Sebastian Gierlinger (@sebgie) <a href="https://twitter.com/sebgie/status/1273946116682403840?ref_src=twsrc%5Etfw">June 19, 2020</a></blockquote>

Which is definitely an issue. Especially if you pay for the minute in your CI environment.

Frederic also found the best way to close this round-up:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">With serverless, this should&#39;t be too much of a problem. If your single-purpose function requires *a lot* of dependencies to get the job done, you&#39;re probably doing something wrong and should reconsider the scope of it.</p>&mdash; Frederic&#39;); DROP TABLE tweets;-- (@fhemberger) <a href="https://twitter.com/fhemberger/status/1273890780550135808?ref_src=twsrc%5Etfw">June 19, 2020</a></blockquote>
