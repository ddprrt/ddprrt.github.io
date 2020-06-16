---
title: Remake, Remodel. Part 4.
categories:
- Remake
- Jamstack
---

I originally wanted to launch my new website on June 1st, but there were more important things happening at the moment than relaunching a tech blog. Truth be told, it was really hard for me focussing on anything else but the protest. The ongoing protests have not lost any importance. Do your part and [educate yourself and be an ally](/black-lives-matter/).

<p class="not-tldr">Welcome to the new fettblog.eu! Over the last couple of months I decided to make the fourth big relaunch of my website.</p>

## A bit of history

<figure class="img-holder wide">
  <img src="/wp-content/uploads/2020/fettblog2012.png"
    alt="fettblog.eu 2012" />
    <figcaption>The very first version of this blog</figcaption>
</figure>

1. I started blogging in April 2012, a day before my 30th birthday. Talking about eleventh hour panic! It was a piece on [HTML5 audio on mobile devices](/blog/2012/04/08/html5-audio-on-mobile-devices/). I used ModX as a CMS because it was a promising underdog. It needed a lot of processing power, though, that the little machine I had in Linz couldn't provide. Also, I found ModX quite unwieldy. You had to do a lot by yourself and I just hadn't the time to do that.
2. I moved to Wordpress in November 2012. It was more of a technology switch than a commitment to blog. Blogging started a couple of months later when I did my bigger redesign in April 2013. There were some blog articles back in the day that I thought were quite relevant back in the day. The one on [preserving aspect ratios for embedded media](/blog/2013/06/16/preserving-aspect-ratio-for-embedded-iframes/) is still a top hit.
3. The last big remake was in January 2014. I moved to a technology stack that became the *Jamstack* and sees a big hype nowadays. It used Jekyll, was hosted on Github pages, with a domain pointing to Cloudflare and proying the results. I felt like a cloud guru setting this stuff up. I had a couple of minor redesigns, but technology-wise this has been the stack I worked with for the last 6.5 years. The Jamstack never failed me!

But the Jamstack evolved. A lot. This is why I wanted to move to something new and more flexible. Using a build process that *I* can control and getting benefits of branch builds, flexible static site generators, and possibly functions. Here's how I approached the relaunch:

## Moving to 11ty

I've chosen [11ty](https://11ty.dev) for my static site generator. On the surface it felt like a drop-in replacement for Jekyll due to the way they transform markdown files to HTML pages, and all the metadata you get for free by using a file name pattern. 

<figure class="img-holder wide">
  <img src="/wp-content/uploads/2020/projectboard.png"
    alt="fettblog.eu 2020 project board" />
    <figcaption>I even had a project board for the relaunch</figcaption>
</figure>

But this is just the surface. It is so much more than that and I'm going to blog about my findings soon. I love that I can reduce front-matter to a bare minimum. A title, some categories. The rest is done with per-folder metadata files. This is pure magic!

I also create title cards for each of my 150 posts in SVG. I render about 400 objects. It doesn't take me more than 2.5 seconds. This is ludicrous speed. I'm more than amazed by the flexibility, the power and the sheer performance. Had tip to [Max Böck's excellent boilerplate](https://github.com/maxboeck/eleventastic) and [Chris Coyier's conferences website](https://github.com/CSS-Tricks/conferences). They proved to be invaluable resources to me.

The concept of how 11ty handles data, content and templates is pretty unique and allows for tons of pages to be generated without much maintenance. One piece that wouldn't work without 11ty's power is the [Cinema section](/cinema/). It's a YAML file that I maintain, and I get excellent web pages for free.

Plus, it is a lot of fun!

## Moving to Vercel

I haven't changed hosts since January 2014. Hosting static sites is an easy thing, but getting there is now fundamentally different. After trying out a couple of different Jamstack hosts I ended up with [Vercel](https://vercel.com). I had a Vercel account for years, but this is the first major project that I'm publishing there. There are no limits in build time and traffic as long as it's fair use. Their integration is remarkably easy, the UI is clean and informative.

But the best thing is their speed. The lead time for a Vercel build is less tan 25 seconds. Triggering version control, fetching updates, installing dependencies, building, caching, deploying. The site is published where other vendors haven't even started yet. 

I spent a lot of time creating a build pipeline for Jamstack in-house. And getting a fast pipeline where deployments felt natural was one of the biggest challenges. This speed that you gain from using a tailored infrastructure is incredible. Vercel is really a ton of fun to use. 

I moved to Vercel about a month ago. Even transferring the domain was more than easy. Nobody figured out that I switched. The only person who can see that is me, because suddenly cache hits in Cloudflare dropped.

![Dropping cache hits](/wp-content/uploads/2020/caching.png)

If you have an idea why, please [drop me a line](https://twitter.com/ddprrt).

## Design

I'm not that much of a designer. But I had fun toying around with gradients, colors, fonts and layouts. I tried to design in Figma or Sketch, but in the end, especially when dealing with layouts, the browser and CSS was my top choice. It allowed me safely to play with shadows, subtle gradients, colors, and more. 

Designing in the browser was fun, but due to me focussing on looks rather than CSS rules, my CSS ended up to be quite a mess. This is something I desperately want to refactor at some point.

Huge inspirations for the re-design where [CSS Tricks](https://css-tricks.com) and [Smashing Magazine](https://smashingmagazine.com). But all just me, with no skills and no talent. I still like it, though. And after getting used to this design, it is really hard to watch the old page.

Regarding colors, I went to [coolors](https://coolors.co) and got inspired by their trending palettes. First I tried to take my main color from the old design and see what coolors had to offer. The result was interesting, it was a 5 color palette with basically every color that I've used in the old design.

![The old color palette](/wp-content/uploads/2020/coolors1.png)

After some browsing I got inspired by this one. It felt like JavaScript on the left, TypeScript on the right, fun and colors in the middle.

![The new color palette](/wp-content/uploads/2020/coolors2.png)

I took the colors and made all sorts of gradients out of it. They are *everyhwere*, literally. There are subtle gradients, subtle color nuances, and shadows with those colors on almost every element. I tried to keep the colors as subtle as possible, except where they were supposed to scream.

I maybe overused some techniques and tips shown in [Refactoring UI](https://refactoringui.com/) by Steve Schoger and Adam Wathan. Don't be mad at me, Steve!

## Content

I also used the relaunch to make some content updates that were important to me.

1. I dropped the snippets section for good. I integrated all the content into regular posts. To be true, they are what my posts have become anyway over time.
2. I finally have category and article overview pages. Thanks to 11ty!
3. My most popular piece of content is my [TypeScript + React](/typescript-react/) guide. It got its own menu point back then, but I intent to write more guides. So there will be some updates here.
4. I tried a reading list like [Manuel Matuzovic](https://matuzo.at) did, but I failed finishing books or remembering myself that I need to save articles that I liked. So I dropped this piece.
5. I had also a watching list, where I note down notable talks from conferences that inspired me, or that I saw suitable for [DevOne](https://devone.at) or [ScriptConf](https://scriptconf.org). This list still exists, but it's now called [Cinema](/cinema/). This is a thing that I had in mind for a long time. I don't want to leave my site when I browse through my list of favorite talks. So let's make it a website feature instead!
6. I opened a section on [Books](/books/) that I wrote. Currently, it's one. But there's another in the works which I hope to share details soon. I just sent 57000 words to my editor. So let's see how soon we can release it!

## Obligatory lighthouse score

![All 4 pieces showing 100](/wp-content/uploads/2020/nice.png)

💯💯💯💯

I think that's it. I learned a lot in the last couple of weeks and had tremendous fun with it. 

<p class="not-tldr">If you find anything unusual, a broken link or some missing info, please <a href="https://twitter.com/ddprrt">drop me a line</a>. I highly appreciate it!</p>
