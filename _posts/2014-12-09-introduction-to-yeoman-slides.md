---
title: "Slides and notes to: Introduction to Yeoman"
published: true
layout: post
permalink: /introduction-to-yeoman-slides/
titleimg: /wp-content/uploads/2014/yeoman.jpg
categories:
- Tools
- Yeoman
- Talk
---

A few weeks ago I did a short talk on [Yeoman](http://yeoman.io) at the Linzer edition of [Codeweek](http://codeweek.eu) and how it helps us in our daily workflow. For the first time I tried to have some sort of script, and afterwards I even made notes. So aside from funny images, you even can read what I was talking about. Have fun!

<div class="aspect ratio-4-to-3">
	<iframe class="speakerdeck-iframe" frameborder="0" src="//speakerdeck.com/player/35abc1f061d00132d663726ecad34358?" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

[Find the slides on speakerdeck](https://speakerdeck.com/ddprrt/a-short-introduction-to-yeoman)

1. I don’t know if you’ve ever heard from Yeoman or the Yeoman tools.
2. It might actually be that you’ve heard from the Yeoman warders who guard the tower of London. They’re also called beefeaters and might happen to have a strong taste for gin
3. They even have their own brand, which tastes great btw.
4. Anyhow, the Yeoman warders at the Tower of London are helpful guides and show you around on your sightseeing tour. This helpfulness inspired a bunch of software developers like Addy Osmani to create a not less helpful tool or toolchain to guide you in your software development process. And Yeoman, or not be precise, Yo, is the result.
5. We’re using Yo to overcome a lot of obstacles in our day-to-day workflow. First and foremost, because of this well know situation. This is Pinky, my colleague and the guy I work with most of the time. The other one is a random “Brain” from our team. 
6. We happen to do a lot of new projects, mostly microsites, and have the need to kick-start a new project often on a weekly base. So, if we try to get a new project running, every developer has his own way of doing so.
7. While Pinky might call his folders like the technology he is using,
8. Our random brain might call it after the actual type: Styles, scripts and templates.
9. If you have one generic build running, like Grunt, you can adapt this very Gruntfile for each solution.
10. This was even worse when we used a 1500 lines of code Ant File
11. which looked like this (Animation)
12. And this was my face when my co-workers asked me to change the build to their new setup. Every single time.
13. This is where our Yeomen come in. 
14. First the give me the much needed Gin,
15. but actually they’re helping me to settle on a good set of defaults and best practices, and provide a way to distribute them to everybody in my team.
16. They’re doing this by so-called generators. Each generator is used for a different eco-system. You even can develop a generator to create a custom project setup for your very own team.
17. It also helps to overcome the blank page angst. You don’t have to start from scratch and actually have a good setup where you can easily add your new parts. This helped me a lot when starting with Angular, because there were a lot of repetitive patterns which I couldn’t memorise at first.
18. Yo is based on node.js, so it is easily installed with NPM. The second command installs a generator. This is one provided by the Yeoman community, which is strongly supported by Google. That’s one reason why they have a nifty Angular generator ready. To kickstart a new Angular project, just run `yo angular` in your project folder. Yo will find yourself in a short questionnaire to set some options and parameters, after that Yeoman takes care of the rest. They’re also some subgenerators possible. In this case, I can add a new directive to an existing Angular project. Let’s try this out (demo)
19. If you’re not happy with the community generator, it’s easy to create your own. Yo has even a generator for generators, which gives you the very basic setup. After that, you just have four commands which you really need to finish your generator.
20. `this.prompt()` sets up the questionnaire and sets some variables. With `this.dest.mkdir()` you’re creating new directories, `this.src.copy()` copies files from your generators template directory to the desired destination, and `this.src.template()` does the same, but allows form parametrised output using underscore templates.
21. At the moment there are about 1100 generators available
22. Even our own one which is open source. Feel free to learn from it, we sure did a lot.
23. With this generator we managed to setup one project structure easily every time we need it.
24. I have a lot more time for Gin now
25. And also a much happier face. Thank you.

Image credits: [Yeoman](http://www.yeoman.io)