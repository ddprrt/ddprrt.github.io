---
title: JAMStack vs serverless web apps
published: true
layout: post
categories:
  - Jamstack
permalink: /jamstack-vs-serverless-web-apps/
---

JAMStack seems to be one of the most trending topics right now. So are serverless web apps. Hot and loved! I've seen some tweets, articles and even live presentations just this week that talk about JAMStack and serverless web apps as if they are the same. For good reason. In an ideal scenario, serverless web apps and JAMStack sites/apps are indistinguishable.

But, it's in the details where both differ. Let's dig deeper.

## JAMStack sites/apps

Let's think back one more time what the "JAM" in JAMStack stands for: JavaScript, APIs, Markup. But how are they interconnected?

We deploy and serve pre-generated, *static* **markup**. We enhance this markup dynamically on the client side with **JavaScript**, and fetch dynamic data via **APIs**. MJAStack just has not the ring to it, has it?

Let's focus on the "M" in JAMStack. Statically generated markup. Generated by a static site generator. Probably the one thing that tends to be overlooked when talking about JAMStack vs. serverless web apps.

As soon as we deploy and serve statically generated markup, our sites qualify for being a JAMStack site.

The good thing about this pre-generated markup: We are able to serve content in any scenario. Our APIs might malfunction, our JavaScript might break. As long as we send some pure, old HTML over the wire we have something to show! Then we add dynamic features -- *if necessary* -- via JavaScript.

This is *progressive enhancement* in its purest form. That's why so many people love it.

What about APIs, though? In an ideal scenario, the only APIs we call are serverless or cloud functions. Because they are cheap. They allow for self-healing. They scale. They might have a lower security attack surface.

But, as long as we call URLs via JavaScript to get dynamic data, we fulfil the "A" part in JAMStack.

Best case: Serverless. A bunch of URLs: Good enough.

## Serverless web apps

Compared to JAMStack, a serverless web app by its very name needs to talk to serverless APIs. Most of the time there's a funny sounding JavaScript framework running in your application to show data to your users.

We don't have to serve any markup at all other than some element your JavaScript app can attach to. We don't have to pre-generate content and have a bunch of HTML files if it doesn't serve our purpose.

If we serve actual content, the HTML does not have to be statically stored or pre-generated. It can be generated dynamically through server-side rendering.

The best case scenario? Just like JAMStack: We have our content pre-generated and served statically. Maybe via a CDN to have the cheapest and most effective delivery secured.

Just having an empty HTML file calling some JavaScript and having a blank element to attach your app to? Good enough?

## Bottom line

In JAMStack apps, the "A" can be any API to call. Preferably serverless. The "M" though, is statically generated markup. Serverless web apps are much stricter on the "A" part. Markup though is a whole different story.

If you care about performance, security, discoverability and resilience, I recommend architecting both serverless web apps and JAMStack sites the same.