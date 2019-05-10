---
title: The Unsung Benefits of JAMStack Sites
published: true
description: You've heard about availability, performance, and security benefits of JAMStack sites. But there's more! 
layout: post
categories:
  - JAMStack
permalink: /jamstack-the-unsung-benefits/
---

*This post originally appeared on [dev.to](https://dev.to/ddprrt/the-unsung-benefits-of-jamstack-sites-3kd6)*

Traditional websites are usually built on top of a CMS. Drupal, Wordpress, Typo3, you name it. CMS handle everything from content editing, over application programming to front-end generation. So choosing a CMS has a huge impact on how you develop your sites, and what skills and trades you need to get the job done. A CMS has also impact on hosting! Does LAMP-Stack ring a bell? Linux, Apache, MySQL and PHP. The golden standard for lots of popular CMS to this day.

JAMStack sites are different. Instead of putting the CMS into the core of all your decisions, you focus on the Front-End. And for good reason. The browser doesn't care what technology is underneath. It just wants cares about HTML, CSS and JavaScript. So why shouldn't you?

![Architectural parts of any website and web application](/wp-content/uploads/2019/stack-1.png)

Putting the Front-End into focus has a lot of impact on every other level of your website. Be it the CMS, your application layer or even where you host it. And this impact comes with a lot of benefits.

## Choose your tools

JAMStack sites treat hosting, content management and application as their own entities. With little to no dependency to each other. 

The application layer can be anything as long as it produces APIs consumable by the Front-End. And if you go full serverless, you don't even have to care about having a dedicated application server.  This is where the server-*less* comes in, folks.

Same for Content Management Systems. Great deal: A CMS can focus on actually managing content again! No need to serve as a rendering tool or application platform. [You even can stick with Wordpress](https://fettblog.eu/wordpress-and-jamstack-sites/), if you like. Or have something JAMStack optimised like [Storyblok](https://www.storyblok.com/). As long as there's an API to fetch content, you're good. 

Hosting is as easy as serving files. Put it up on a cloud storage like S3 or Azure Storage. Host it in your dropbox. Or find a cozy place next to your old website. It's your choice. 

![A set of technology choices](/wp-content/uploads/2019/stack-2.png)

The best thing: People can choose what they like best, and what they feel most productive with. It all sticks together with APIs. 

## No technology lock-in

With each part being independent, you not only have lots of choice for getting your website done. You also continue to have this choice as your project evolves. It's mich easier to swap one technology for the other if you don't have to replace your whole website. Want to move from Metalsmith to Gatsby, no need to kill your APIs. No need to kill your hosting strategy. No need to kill your builds or the huge amount of content you store in your CMS.

Does the CMS not serve your purpose anymore? Store the latest output in JSON files to keep builds going, and move silently to another one.

The bulky Java monolith is too slow and costs too much? Some light-weight cloud functions are easy to create and integrate. Only keep API contracts alive. 

![Out with the old, in with the new](/wp-content/uploads/2019/stack-3-neu.png)

Moving away from technology and adopting other still isn't easy or without serious effort. But it's a lot easier to grasp if you don't have to take care about complete picture.

## Incremental adoption

Every part is independent, and written in the technology you prefer. This means you can start migrating to the JAMStack immediately. Your old app still in place, start getting a few cloud functions up and running and publish a few HTML pages next to your old installation. Any server is ready to serve static files!

![A Gatsby site as part of a LAMP Stack site](/wp-content/uploads/2019/stack-4.png)


![Running the JAMStack next to a LAMPStack](/wp-content/uploads/2019/stack-5.png)


Especially in bigger projects I've seen this to be most beneficial. You don't want to migrate 2000 pages to a new stack in a big bang. But having the top-most pages fresh, new and fast can make a huge impact.

## Bottom line

Moving to the JAMStack is a commitment to modern cloud architectures and DevOps workflows. This also means that you are able adopt as you go, with the tools you see fit best. Don't be intimidated to redo everything. Start. And see where it takes you.

