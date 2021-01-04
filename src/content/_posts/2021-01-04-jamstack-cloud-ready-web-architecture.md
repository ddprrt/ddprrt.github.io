---
title: "Jamstack - A cloud-ready web architecture"
categories:
  - Jamstack
  - Architecture
---

This is the beginning of a series of Jamstack articles that deal around architecture and design patterns. The main goal of this series is to give you a framework- and host-agnostic guide to all the Jamstack building blocks, so you can find the right approach to the problems you want to solve.

Most of the series' content is based upon my experience of the last 6-7 years of doing Jamstack -- [way before the term was coined](https://www.smashingmagazine.com/2016/08/using-a-static-site-generator-at-scale-lessons-learned/) -- where we created our own build pipeline, function server, static site generators and even CMS. Surprisingly, most of the key principles haven't changed. But we got a lot more tools and it became a lot easier to work with the Jamstack architecture!

This introductory article is a rewrite of a talk [I've given throughout 2019](https://www.youtube.com/watch?v=nZUwrCCKZrs), giving you an overview of what you are dealing with when talking Jamstack. Let's go!

## Layers of a web application

Every website or web application has parts that can be assigned to a specific layer.

<!-- TODO add image -->

* **Hosting**. First, there's hosting. Where does your website run, and what (software) do you need to run it? The hosting layer can take many forms, but primarily takes care about a web application's *availability*, *scalability*, and *security*.
* **Content**. The content layer stores your web application's data and provides means to edit, maintain, and deliver. This is a traditional CMS job. *Data*, *data structures*, and *editing possibilities* are this layer's main concern.
* **Application**. The application layer takes care about *data processing* and *managing state*. Do your users need to log-in to view a certain slice of data? Do you want to aggregate metrics over a certain period of time? Do you want to search for pages with a specific query? Everything that is dynamic for whatever reason is part of the application layer.
* **Front-End**. Last, but not least, there's the front-end. This is the actualy HTML, CSS and JavaScript delivered to your users. Of course, this can take many forms as well. From static HTML to a big, monolithic Angular application, everything is possible. The front-end's concern is to provide *accessible*, *usable*, and *interactive* user interfaces.

Every web application that you create with any technology available, can be split up to the four layers. I know organisations who even split  their teams to cater each layer, with either the application or the front-end teams being the most dominant ones. Other organisations are organized vertically, but you still have specialized roles within teams.

This is what some consider to be the *full stack*. This, of course, depends on everyone's individual view of "full-ness".

## Monoliths

Let's review the four layers with the [web's most used CMS](https://almanac.httparchive.org/en/2020/cms#top-cmss): WordPress.

* **Hosting**: WordPress runs on PHP and needs a database, usually MySQL or similar, to work properly. I know that you can run WordPress with different server technologies, but I figure a traditional LAMP stack is still the way to go.
* **Content**: WordPress itself is the way to manage data within your MySQL database. WordPress defines data structures and editors. You can customize fields.
* **Application**: A plethora of plug-ins extends your WordPress installation to be your own social network, or your own e-Commerce platform. If you want to write custom application code, it's usually most straight-forward to implement your own plug-in.
* **Front-End**: We deliver HTML through the WordPress render function. You have the possibility to influence the HTML output through themes, plug-ins, etc.

As with any technology, there are variations. You can run WordPress headless for a custom front-end, or sans plugins and write your application code on the side. Also, **none of these layers has clear boundaries**. That's not the point. What you see is how all layers are strongly connected to each other. You get that with every other CMS of the golden PHP era. Typo3, Drupal. Or take Ruby on Rails. **All four layers depend on each other**.

With traditional web architectures, we deliver monoliths. And with those monoliths, we always **make cuts in at least on of our layers**. Go the traditional WordPress route: The way you write and deliver HTML is just as good as you can work with WordPress's theming functionality. Your website's availability is only as good as the underlying LAMP stack can provide for you. WordPress's plug-in functionality is rich, but there might be better suited technologies or more direct ways to achieve your goal than writing a WordPress plug-in.

I'm not saying that WordPress is bad, not at all! It might however not be the right tool for the job, and it can slow you down in any phase of a web project's lifecycle.

We are talking about **technology lock-in**. We chose one platform, one tool to do everything for us. We bend our four layers to its needs and run with it as far as we can. Moving away, or just to the side, is costly. This mostly comes from focussing on said platforms that mostly care about content management.

## Focus on front-end

Focussing on content management might seem reasonable. After all, this is what your customers are paying for. They don't care which front-end framework or CSS methodology you are using. They care how they can be most productive in maintaining a production website.

There is a bigger group than your customers, though. Your customer's users. And they mostly care what ends up in their browser. With Jamstack, we put the front-end in focus.

As a front-end developer, your main task is to produce semantic HTML browser's can consume. Even with React, what ends up is browser-ready DOM nodes that appear on a user's screen. 

Each front-end project I worked on, no matter the technology or platform, had a certain templating phase. This was the moment where we were working on translating designs into code. During this process, we were aiming to **reuse as much as possible** so we had a set of snippets we could assemble in different ways. Nowadays, this is through React components, back in the day we used templating languages. 

From a template it's just a small step towards a static site, where you fill your snippets (or components) with real world data, from -- well -- any data source. There are a lot of **static site generators** out there, and you've seen most of them: [Hugo](https://gohugo.io/), [Jekyll](https://jekyllrb.com), [Eleventy](https://11ty.dev), [Next.js](https://nextjs.org) static export. You name them.

## Push vs Pull

Traditional web platforms like WordPress deliver HTML through a *pull* model:

1. Each request hits a **routing layer**
2. The routing layer calls the **renderer** for the HTML it should deliver
3. The renderer goes to the **data storage** to retrieve content.
4. The content from the data storage gets rendered into HTML by the **renderer**
5. The finished HTML from the renderer gets delivered to the user by the **routing layer**

<!-- TODO ADD IMAGE -->

Add a couple of caching layers on each step of the process, and you have every non-headless CMS out there. With Jamstack and static site generators, we go to a *push* model:

1. We know all data upfront. Coming from Markdown files, CMS APIs, other sources. 
2. We push the entire content mesh to a **renderer**.
3. The renderer converts all available content into HTML. Cross-links, navigational structures, etc. are all known up-front.
4. We store the available HTML somewhere, the routing layer can pick up everything pre-rendered as they need to.

<!-- TODO ADD IMAGE -->

So instead of rendering on demand, we render everything upfront. Through a build proces. Preferably on some <abbr title="continuous integration">CI</abbr>/<abbr title="continuous delivery">CD</abbr> service.


## Effect on other layers


The process is straight forward: You take content from any source, combine them with reusable components, safe the result as a static HTML file and deploy it to ... well, anywhere.

## Routing is key

## Upcoming
