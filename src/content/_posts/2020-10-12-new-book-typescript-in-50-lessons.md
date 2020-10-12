---
title: "My new book: TypeScript in 50 Lessons"
categories:
- TypeScript
- Books
---

I've written a new book! On **October 6**, the pre-release of [*TypeScript in 50 Lessons*](https://www.smashingmagazine.com/printed-books/typescript-in-50-lessons/) started.  It's 450 pages, published by the wonderful people at [Smashing Magazine](https://smashingmagazine.com), and available to read right now! The printed version is being produced as I write, and will be shipping in mid-November.

It's what it says on the cover: TypeScript. 50 Lessons. All you need to know to become an expert in TypeScript.
*TypeScript in 50 Lessons* has been written with longevity in mind. We focus on the type system and give you a mental model so you are prepared for all future TypeScript releases. And this is how it came to be...

[![The book: TypeScript in 50 Lessons](/wp-content/uploads/2020/book-main.png)](https://www.smashingmagazine.com/printed-books/typescript-in-50-lessons/)

## The itch...

*TypeScript in 50 Lessons* started all the way back in 2019. My [TypeScript + React guide](https://fettblog.eu/typescript-react/) gained some popularity, just enough to bring acquisition editors of several publishing houses into my mailbox, wanting me to write about TypeScript. There were renowned publishers among them, and also some infamous companies that shoot for quantity, rather than quality.

People reaching out to you to write a book is not uncommon. Especially not if you have material published already, like on a blog, or on Slideshare. This also happened when I wrote my first book [Front-End Tooling](/the-gulp-book/), which was largely based on a workshop I've given in 2014 and 2015.

Compared to *Front-End Tooling*, the number of publishers reaching out was significantly higher. A handful, but still: I got an e-Mail every week from a different person. All publishers had one thing in common: They were in a hurry. They wanted me to write about TypeScript, yes. But either they had an outline ready and wanted me to contribute a couple of chapters. Or they had a title ready and wanted me to fill it with content in the next couple of months. 

[![A beautiful interior](/wp-content/uploads/2020/book-open.jpg)](https://www.smashingmagazine.com/printed-books/typescript-in-50-lessons/)

I guess this isn't so uncommon either. You all know how fast web technologies move. How quickly new things appear and tried and trusted things go into oblivion. Tech book publishers must be frightened of how soon books might become outdated. I know from experience! *Front-End Tooling* was written within 9 months, but it took another year until it was published. I wrote [The announcement post](/the-gulp-book/) in August 2015, the print version appeared at my doorstep in January 2017. *Front-End Tooling* was yesterday's news when it was finally published.

I love *Front-End Tooling*, and I think its concepts and ideas are valid to this day -- the chapters on objects streams and promises haven't aged a bit! But it sobered my view on publishing books. It was a tremendous effort from many people to bring this piece to paper -- was it worth it?

That's why I respectfully declined all offers to write a TypeScript book. But one thing happened: I was stung by the idea of writing a TypeScript book. Oh, and it was itching ... a lot!

## The pitch!

By the beginning of 2019, I spent so much time with TypeScript and its type system that I developed a **mental model**. A map to navigate the type space! Something that would make good learning material. Slides, blog posts. Or maybe something bigger? The mails I got from the acquisition editors were the last push I needed to develop this idea into an outline. And finally to pitch it to a publisher. 

I said to myself to write another book only under two conditions:

1. The book has to have a certain **longevity**. TypeScript is a hot topic, no doubt. But I don't want to write about the most recent version or explain each feature that ever existed. I want to write a book that isn't outdated even if the TypeScript team releases four versions a year, which they do!
2. It has to have a certain **visual appeal**. Beautiful typography. Wonderful artworks. A unique experience! I realized over the years that I find it increasingly difficult to focus on text if fonts don't play well with another, and if line lengths are too wide or to narrow. I had to ditch some undoubtedly good books just because my eyes weren't able to grasp the looks of a typeface or the way they publishers work with their typeface. Also, I had some ideas on how a TypeScript book can be a unique experience for readers. Something that transcends from a piece of paper into a developer's everyday work environment: The code editor.

[![Lots of code samples](/wp-content/uploads/2020/book-open2.jpg)](https://www.smashingmagazine.com/printed-books/typescript-in-50-lessons/)

Condition number two lead me to a publisher I love since basically forever: [Smashing Magazine](https://smashingmagazine.com). I have every release on my bookshelf, even if I'm not the targeted audience. Their books are a joy to read, both visually and content-wise. And they care so much about every little detail to make every book and outstanding experience. 

When I wrote Vitaly, then-editor-in-chief of *Smashing Magazine*, and a frequent collaborator, and pitched my idea, we quickly found that we both take condition one very seriously. Smashing books stand the test of time. I just recently ordered [a book from 2014](https://www.smashingmagazine.com/printed-books/digital-adaptation/), and its contents still hold up to this day. 

So if Smashing decides on publishing a book on a programming language, it has to guarantee certain longevity!

Sounds like a match made in heaven!

## The book ...

Some say "a well-planned book writes itself". That is kind of true for *TypeScript in 50 Lessons*. I spent a lot of time in planning. Gathering examples, bringing all bits and pieces in shape, and finding the right narrative that leads readers from their very first TypeScript example up to the advanced concepts. 

Frequent calls with Smashing have been a tremendous help, as they assured me that there is no rush, gave invaluable feedback on the content, and helped to play around with different concepts. We quickly found a few key features we want the book to have.

[![A Smashing experience](https://res.cloudinary.com/indysigner/image/fetch/f_auto,q_auto/w_724/https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/e85a877b-93c9-47e7-ae60-515879a2e1b0/typescript-cover-big-preview.png)](https://www.smashingmagazine.com/printed-books/typescript-in-50-lessons/)

1. It has to be **practical**. Examples and real-world use cases help a lot in understanding fundamental concepts. No *foo*, *bar*, *baz*, but stuff from actual applications. Finding good examples is one thing, but reworking them so you build up knowledge with every step you take is a quite challenging task.
2. It has to be **gentle** and easily digestible. TypeScript and type systems are very technical topics. And they can be very demanding if you don't allow **room to breathe**. That's why we split up each chapter in seven lessons, so you can stop whenever you like. **Non-technical interludes** between chapters give you better insights into TypeScript culture and give you time to reflect on what you just learned.
3. Reduce the contents to the **essentials**. To guarantee longevity, we intentionally leave out some things from TypeScript's long history. I see little reason in learning about the old style module and namespace system if there are now things available that are more aligned with JavaScript. Nor do I think we should learn about OOP concepts that have been carried over from other programming languages and come from a time where classes didn't exist in JavaScript. Instead, the focus on the **type system** as an extension to JavaScript will give you enough knowledge to be up to speed with each new TypeScript release.
4. Take more time explaining **complex concepts**. We spend a whole chapter on **generics** and another chapter on **conditional** types. Were other books touch upon them briefly in a couple of pages, we look at these concepts by working out some real-world examples. Plus, we get some insights into how to design good types!


<figure class="img-holder wide">
  <img src="/wp-content/uploads/2020/book-ibooks.png" class="no-frame"
    loading="lazy"
    alt="A screenshot of the EPUB version on Apple Books" />
    <figcaption>If your eBook software is capable of displaying colors, you get beautiful syntax highlighting, with red-highlighted text areas when TypeScript throws an error</figcaption>
</figure>

This is what makes *TypeScript in 50 Lessons*. It is very opinionated, but also the guide you need to reduce the noise of so many different approaches. Among my most favorite chapters is chapter 1, where we see TypeScript from a tooling perspective. And chapter 4, the watershed chapter that takes you from a beginner to an expert. This is also the part were seasoned TypeScript developers will gain a lot of new insights.

You can check out all the examples and a free sample chapter (chapter 4) on the [book's official website](https://typescript-book.com)

## The look!

So far about the content, but what about the second condition. The looks? The people at Smashing outdid themselves!

1. The book's artwork is done by [Rob Draper](https://robdraper.co.uk). Rob worked with us on [ScriptConf](https://scriptconf.org) and [TSConf:EU](https://tsconf.eu), and I'm so happy that he agreed to illustrate my book as well. Talking to him about what we want to achieve with the book has had a tremendous influence on the overall direction. He coined the phrase of having a "**human approach** towards a very technical topic", which was the motto for the entire book. His artwork is playful, fun, and fitting!
2. The interior is filled with great looking code examples. The printed version has **red squigglies wherever** they are necessary, bringing an **immersive code editor feel** to the book. The eBook versions can't feature red squiggly lines, so they highlight erroneous code with red underlines and red text. The content has been **tailored for each medium**, and you have the best reading experience, no matter what you choose!
3. The printed book's finishing includes **metallic ink**, carefully selected colors, and nice additions on each page to make the whole book a unique experience. The typography is well selected and legible. Code samples are colored so you can focus on the important parts. **Illustrations add value**, not distracting from what's happening around. The result is stunning!


<figure class="img-holder wide">
  <img src="/wp-content/uploads/2020/book-kindle.jpg"
    loading="lazy"
    alt="A photo of my Kindle, with my book on it" />
    <figcaption>Black and white eBook readers, like the Kindle, work with contrasts and underlines to highlight important areas</figcaption>
</figure>

Working with Smashing has been nothing but amazing. The team really cares about the result, and everybody puts so much effort into making each book unique. In the end, every page has been crafted, polished, and a team effort through and through.

[![Get it now!](/wp-content/uploads/2020/book-mailing.png)](https://www.smashingmagazine.com/printed-books/typescript-in-50-lessons/)

[The book is available right now](https://www.smashingmagazine.com/printed-books/typescript-in-50-lessons/). The printed copies are at the printer and will be shipped in November. If you buy the printed book, you can read the eBook versions right away. 

I hope you enjoy reading it as much as I enjoyed writing it!

