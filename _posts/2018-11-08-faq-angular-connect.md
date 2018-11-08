---
title: "FAQ on our Angular Connect Talk: Automating UI development"
layout: post
categories:
- Angular
published: true
permalink: /angular-connect/
og:
  img: /wp-content/uploads/ogimgs/typescript-substitutability.png
---


I'm writing these lines as I fly back from an excellent Angular Connect. I started public speaking a couple of years ago, and this particular talk will be one I'm going to remember for a long time. I think it's easily on par with my most favourite speaking experience that I had back in 2013 with Breaking Development.

It was a couple of first-timers for me: I had the pleasure and privilege to present for the first time as a duo, with my wonderful friend and colleague [Katrin Freihofner](https://twitter.com/Ka_TriN_F), and also for the first time on a framework specific conference. In front of 500 people. I was sweating bullets, but I also think I've never been so prepared, so well rehearsed and so excited about presenting. 

Our talk was about how we generate Sketch symbol files from our Angular components library, and how it helps overcome obstacles in our processes.
<figure class="img-holder wide">
  <img src="/wp-content/uploads/ac-header.jpg" alt="Katrin and myself">
  <figcaption>Presenting in front of 500 people at Angular Connect</figcaption>
</figure>

What I didn't expect though, was the tremendous feedback we got after the show. Originally I wanted to watch some talks at the conference, but I ended up answering questions and getting into dialogue with so many attendees who have similar or the same challenges ahead. While I had many chats, there were some questions that came up more often than others. What puzzled others might be puzzling you as well. That's why I want to put up a post-conference FAQ for everyone who watched our talk.

You can read it right away, but be sure to check out our [Slides](https://www.slideshare.net/ddprrt/automating-ui-development) and the video from [Angular Connect](https://youtu.be/OEOrgR1g3Ks?t=909). It's still the live stream video, the separated one will come in shortly, I assume. 

Watched it? Then let's go!

## FAQ

### Why are you generating Sketch from Angular, and not the other way round?

I can answer this question by asking you another question: When was the last time you shipped Sketch files as your production front-end? If you answer with "never", I'll believe you. Sketch is, like all design and mock-up tools, never the full experience your users are getting. The code you ship on the other hand is always the real deal. Code can be tailored, optimised!

When putting Sketch files into focus, we are always missing something. Like animations, interactions, dynamic content. And designers will always find something odd when looking at the final result. In the end, production UI will never be 100% aligned with what designers do in their mock-up tool. That's why it's called a mock-up! So why bother having it longer than for UX decisions and the initial kick-of. 

So put your production code into focus, and let every other part of your process revolve around it. With Sketch from Angular, we can make sure our designers have always the same truth as our clients have. We stay up to date, and it does the heavy lifting for reusable components. UX designers can then focus on the hard part. Making this complicated world of data easily accessible for everyone.

<video style="max-width: 100%" controls src="/wp-content/uploads/sketcherator-small.mp4"></video>

### Does this mean your designers code?

Yes! Partly. Our designers don't have to know Angular or every trick in the book in HTML and CSS. But they have the basic skills to do the simple tasks. Working in fonts. Changing colours. Adjusting padding.

If there's something more complicated or something new, our design systems team is going to help. New components will be prototyped first, and developed together with UX assistance. After the component is ready, all our designers get it through their Sketch symbols library. And it stays up to date.

So you have the traditional process for very small and clear parts of your design. This does not need a couple of sprints to be done.

### We need that! Will this be open source?

I hope so! We got tremendous feedback at Angular Connect. That's why I'm in talks with people at our company to make this an open source project. But even when I get the go, we still have a ton to do. There're some parts of it which are sound enough to be released, other parts are still very much tailored the Dynatrace infrastructure. This needs to be cleaned out. Watch this space for more details. 

### Does it work with other things than Angular?

Yes. We can parse any app that runs in the browser. Angular's meta information we get via TypeScript decorators helps us in creating the back-link to the component library. This is something we would have to investigate when moving it to React or Vue. But the parts are movable and flexible, so there's only time keeping that from happening. If you want to get in touch, please do! We'd love to have your contributions here, even if it's just ideas.

## A couple of last words

I'm genuinely humbled and overwhelmed to work with such a great team. Katrin and [Lukas](https://twitter.com/luka5c0m) are amazing colleagues and such a joy to work with. I also loved presenting as a duo. I had the feeling that Katrin relies on me, that's why I wanted to give the best presentation possible. I also could rely on Katrin, which gave me much more confidence than I had in any other talk before. Thank you Katrin for doing this with me. It was a pleasure and a privilege sharing the stage with you.

## Slides

You can click trough the slides right here:


<div class="aspect ratio-16-to-9">
<iframe src="//www.slideshare.net/slideshow/embed_code/key/zoklMYRQwqhUI4" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>
</div>
