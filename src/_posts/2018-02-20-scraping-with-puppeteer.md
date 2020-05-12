---
title: Saving and scraping a website with Puppeteer
layout: post
published: true
categories:
- JavaScript
- Tooling
permalink: /scraping-with-puppeteer/
---

For some of my performance audits I need an exact copy of the webpage as it is served by my clients infrastructure. In some cases, it can be hard to get to the actual artefact. So it's easier to fetch it from the web.

I found it particularly hard to save a website like it's delivered with some of the tools around. `curl` and `wget` have troubles when dealing with an SPA. Parsed JavaScript fetches new resources. And you need a browser context to record every request and response.

That's why I decided to use a headless Chrome instance with [puppeteer](https://www.npmjs.com/package/puppeteer) to store an exact copy. Let's see how this works!

## Environment


I'm using Node v9 and only need a couple of extra packages. [puppeteer](https://www.npmjs.com/package/puppeteer), in version 1.1.0. I'm also using [fs-extra](https://www.npmjs.com/package/fs-extra) in version 5.0. It features a couple of nice shortcuts if you want to create folders and files in a single line.

```javascript
const puppeteer = require('puppeteer'); // v 1.1.0
const { URL } = require('url');
const fse = require('fs-extra'); // v 5.0.0
const path = require('path');
```

And that's it! The `url` and `path` packages are from core. I need both to extract filenames and create a proper path to store the files on my disk.

## Scraping the website

Here's the full code for scraping and saving a website. Let it sink in for a bit, I'll explain each point afterwards in detail.

```javascript
async function start(urlToFetch) {
  /* 1 */
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  /* 2 */
  page.on('response', async (response) => {
    const url = new URL(response.url());
    let filePath = path.resolve(`./output${url.pathname}`);
    if (path.extname(url.pathname).trim() === '') {
      filePath = `${filePath}/index.html`;
    }
    await fse.outputFile(filePath, await response.buffer());
  });

  /* 3 */
  await page.goto(urlToFetch, {
    waitUntil: 'networkidle2'
  });

  /* 4 */
  setTimeout(async () => {
    await browser.close();
  }, 60000 * 4);
}

start('https://fettblog.eu');
```

Let's dive into the code.

### 1. Creating a browser context

First thing we have to do: Starting the browser!

```javascript
const browser = await puppeteer.launch();
const page = await browser.newPage();
```

`puppeteer.launch()` creates a new browser context. It's like starting up your browser from the dock or toolbar. It starts a headless Chromium instance, but you can point to a Chrome/Chromium browser on your machine as well.

Once the browser started, we open up a new tab with `browser.newPage`. And we are ready!

### 2. Record all responses

Before we navigate to the URL we want to scrape, we need to tell puppeteer what to do with all the responses in our browser tab. Puppeteer has an event interface for that.

```javascript
page.on('response', async (response) => {
  const url = new URL(response.url());
  let filePath = path.resolve(`./output${url.pathname}`);
  if (path.extname(url.pathname).trim() === '') {
    filePath = `${filePath}/index.html`;
  }
  await fse.outputFile(filePath, await response.buffer());
});
```

With every response in our page context, we execute a callback. This callback accesses a couple of properties to store an exact copy of the file on our hard disk.

- The `URL` class from the `url` package helps us accessing parts of the response's URL. We take the `pathname` property to get the URL without the host name, and create a path on our local disk with the `path.resolve` method.
- If the URL has no extension name specified, we transform the file into a directory and add an `index.html` file. This is how static site generators create pretty URLs for servers where you can't access routing directly. Works for us as well.
- The `response.buffer()` contains all the content from the response, in the right format. We store it as text, as image, as font, whatever is needed.

It's important that this response handler is defined before navigating to a URL. But navigating is our next step.

### 3. Navigate to the URL

The `page.goto` method is the right tool to start navigation.

```javascript
await page.goto(urlToFetch, {
  waitUntil: 'networkidle2'
});
```

Pretty straightforward, but notice that I passed a configuration object where I ask for which event to wait. I set it to `networkidle2`, which means that there haven't been more than 2 open network connections in the last 500ms. Other options are `networkidle0`, or the events `load` and `domcontentloaded`. The last events mirror the navigation events in the browser. Since some SPAs start executing after `load`, I rather want to listen to network connections.

After this event, the async function call resolves and we go back to our synchronous flow.

### 4. Wait a bit

```javascript
setTimeout(async () => {
  await browser.close();
}, 60000 * 4);
```

To end execution and clean things up, we need to close the browser window with `browser.close()`. In that particular case I wait for 4 minutes. The reason is that this particular SPA that I crawled has some delayed fetching I wasn't able to record with `networkidle` events. The response handler is still active. So all responses are recorded.

## Bottom line

And that's all I needed for getting a copy of my client's web application. Having a real browser context was a great help. `puppeteer` however is much more powerful. Look at their [API](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#) and [Readme](https://www.npmjs.com/package/puppeteer) to see some examples and get some ideas!
