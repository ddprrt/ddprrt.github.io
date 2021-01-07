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

<figure class="img-holder wide" style="text-align:center">
  <img src="/wp-content/uploads/2020/jamstack-intro-1.svg" class="no-frame" loading="lazy" alt="Four layers of every web application">
</figure>

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

As a front-end developer, your main task is to produce semantic HTML browser's can consume. Even with React, what ends up are browser-ready DOM nodes that appear on a user's screen. 

Each front-end project I worked on, no matter the technology or platform, had a certain templating phase. This was the moment where we were working on translating designs into code. During this process, we were aiming to **reuse as much as possible** so we had a set of snippets we could assemble in different ways. Nowadays, this is through React components, back in the day we used templating languages. 

From a template it's just a small step towards a static site, where you fill your snippets (or components) with real world data, from -- well -- any data source. There are a lot of **static site generators** out there, and you've seen most of them: [Hugo](https://gohugo.io/), [Jekyll](https://jekyllrb.com), [Eleventy](https://11ty.dev), [Next.js](https://nextjs.org) static export. You name them.

## Push vs Pull

Traditional web platforms like WordPress deliver HTML through a *pull* model:

1. Each request hits a **routing layer**
2. The routing layer calls the **renderer** for the HTML it should deliver
3. The renderer goes to the **data storage** to retrieve content.
4. The content from the data storage gets rendered into HTML by the **renderer**
5. The finished HTML from the renderer gets delivered to the user by the **routing layer**

<figure class="img-holder wide" style="text-align:center">
  <img src="/wp-content/uploads/2020/jamstack-intro-2.svg" class="no-frame" loading="lazy" alt="The pull model visualized. See the description above" width="100%">
</figure>

Add a couple of caching layers on each step of the process, and you have every non-headless CMS out there. With Jamstack and static site generators, we go to a *push* model:

1. We know all data upfront. Coming from Markdown files, CMS APIs, other sources. 
2. We push the entire content mesh to a **renderer**.
3. The renderer converts all available content into HTML. Cross-links, navigational structures, etc. are all known up-front.
4. We store the available HTML somewhere, the routing layer can pick up everything pre-rendered as they need to.


<figure class="img-holder wide" style="text-align:center">
  <img src="/wp-content/uploads/2020/jamstack-intro-3.svg" class="no-frame" loading="lazy" alt="The push model visualized. See the description above" width="100%">
</figure>

So instead of rendering on demand, we render everything upfront. Through a build proces. Preferably on some <abbr title="continuous integration">CI</abbr>/<abbr title="continuous delivery">CD</abbr> service.


## Effect on other layers

Let's see how this new focus on the front-end, with a little help from static site generators and CI/CD pipelines influences all the other layers of a website.

### Hosting

The process is straight forward: You take content from any source, combine them with reusable components, safe the result as a static HTML file and deploy it to ... well, anywhere!

As we pre-generate the HTML output, we gain the ability to host the results on any service or server that is capable of delivering static files. Which is every server. This can be the same machine that originally ran your Apache-PHP combo. Or a static file bucket in the cloud like AWS S3 or Azure Storage. Some folks even use their Dropbox account to serve static files.

Add a CDN on top of it and you can deliver your content everywhere in the world fast. No load on the server. Globally distributed. And for the concerns of the hosting layer perfectly suited:

1. Nothing is easier than serving static files. We can guarantee *availability* and *scalability* because it's super easy to distribute static HTML world-wide. One server goes down? It's easy to deploy to a new one. It's less headache to keep redudant copies and balance between them. And with CDNs, we can use globally available infrastructure to distribute your content world-wide. On the doorstep of your users.
2. Regarding security, your static HTML is really hard to hack. The user's access to your content starts where your CI/CD ends. There is a clean cut between the process of generating said HTML which is occluded from public, and the actual access of the output. CI/CD output should also be **immutable**, meaning that you can only change content by creating a new version, making read-only disks a viable option. In short: Static sites are a fortress.

Nothing but benefits for the hosting layer!

### Application

We also get more freedom for what we want to do with our application code. Instead of writing all the functionality of your application within the boundaries of your platform, you can pick any technology, on any host you see fit. The ones that work best for you. This can be a PHP app, a Java monolith running on Azure, or some third party application like *Auth0*.

It's important to note that this is where the *JA* in *Jamstack* comes in.

1. The *A* stands for APIs, this is the main communication method of your application layer. APIs that are consumed by your other server-side applications, or by your front-end app. Think of a site search you can send a search query, what you get in return are results in e.g. the JSON format.
2. The *J* stands for *JavaScript*. The idea is that you enhance the static markup you deliver with dynamic functionality on the client-side.

I'd argue that this approach is a little too restrictive for what's possible with this separation, and we come to that in later parts of this guide. For now it's important to know that you can create server-side processes with any technology you like. Freedom for the app developers to pick and choose based on their skillset.

We also avoid technology lock-in. If your Java monolith becomes to big and unwieldy, you can create a Node.js server just on the side. Or you go with the preferred way of handling the application layer on the Jamstack: Serverless functions. Which is also what we ware going to use further on in this guide.
### Content

With a focus on front-end and statically generated sites, the content layer gets an entire new perspective. In a traditional CMS, content input was very strictly tied to content output. This lead to a lot techniques where the seperation between does two tasks was not always clear. Think WYSIWYG editors that transformed every content *management* system into a content *design* system -- go search for a "graphic design is my passion" meme, I'll wait! Or editors where you were able to edit on the live output, meaning you had user management and a direct connection to the database on every rendered page.

Possible security holes aside, this strong connection meant that you never where entirely in control of the mark-up created. Users where able to influence in ways you couldn't think of, meaning you had to write a lot of defensive CSS and JavaScript to make sure your web page actually workds.

Now that we generate the HTML output up-front, we can focus again on how to manage, organize, and structure content. We can consume content from any source available. You can mix CMS maintained content with Markdown files stored in a GtiHub repo, and a table full of API documentation that comes from the bespoke API itself!

We again consume content via JSON APIs during the build process. No connection to our content systems after that (unless we want it).

## Routing is key

<!-- ADD image -->

## Downsides

* **Fragmentation**
* **Vendor lock-in**

## Upcoming
