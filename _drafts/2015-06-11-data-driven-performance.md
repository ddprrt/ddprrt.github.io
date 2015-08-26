---
title: "Slides and notes to: Data Driven Performance Optimisation"
layout: post
published: true
permalink: /data-driven-performance/
--titleimg: /wp-content/uploads/2015/beyond.jpg
categories:
- conferences
- Slides
- Performance
---


<div class="aspect ratio-16-to-9">
	<iframe class="speakerdeck-iframe" frameborder="0" src="//speakerdeck.com/player/141f992e14304d3db39f54a9d5249d81?" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

1. Hello everyone and welcome to a UX session for "Data Driven Performance Optimisation". Sounds very high-headed, but it's actually very down to earth.
2. I'm Stefan Baumgartner, and I'm a web developer at Ruxit. I got nothing to do with the product actually, but every other website we have running. But before we go, I'd like you to take a good look at...
3. This stunning athlete! A handsome, lean and powerful man. He seems to be missing the starting gun tough, with all his colleagues already being more than a leap ahead. If you believe it or not. This was actually me. Back in 2011. Not the chubby, clumsy guy right in front of you.
4. If you take a look at the stats, you won't wonder. Back in 2011 I went 4 times a week to the gym. Not just for a chat and a cup of coffee, but actually doing a two-hour workout. I was able to run 10 kilometers and sported a good 74 kilos. Nowadays, my exercising got a little less. Like zero, null, nada, niente. Or as a JavaScript developer I like to call it "undefined". Which means that I still have my membership but don't use it anymore. I manage to run to the supermarket across the street and for the rest... sorry guys, we don't know each other that long. You might ask why doesn't this bother me at all. The answer is: I have the stats and know what to aim for. If I want to be that stallion you've seen earlier I just have to meet some metrics I managed to define earlier on.
5. And that's something that goes on with websites, too. When we start, we have faster than a speeding bullet like websites. But the more we develop on them ...
6. They get way too heavy.
7. If you take a look at the stats of [http archive](http://httparchive.org), the average website has about two megabyte transferred over the wire. With a good deal being images. And as you know, they more you carry around with you, the slower you are. And this has more effect on your users than you might think.
8. Lara Hogan from Etsy did wonderful work on that topic. They found out, that if your site needs longer than 3 seconds to load, 40% of your visitors will drop. That's huge!
9. They also saw that if you add one image of let's say 160 kilobytes, you get an increased bounce rate of 12 percent. 12 percent leaving your site because it needs to long to load.
10. On the other hand, they've seen that with one redirect saved, 12% are more likely to click through your site. 
11. No matter how you look at it: Performance matters. The faster and leaner your sites are, the more they your users enjoy being on it. So let's make our sites fast!
12. The question is though, what should we be aiming for? For me and my laziness it's easy: Up my visits at the gym, and aim for those 74 kilograms I had back then. But for your websites?
13. What we need are good, reliable and replicable metrics. Some numbers we can measure and especially track over time. Today I want to show you at three metrics which are easy to understand, easy to measure and take a lot of factors into account which whould be either really hard to grasp or have way too many parameters. So let's start with the obvious one.
14. Your page's weight.