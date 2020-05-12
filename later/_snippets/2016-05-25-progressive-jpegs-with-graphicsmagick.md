---
title: "Create progressive JPEGs with graphicsmagick in Node.js"
published: true
categories:
- Node.js
- JPEG
- Performance
permalink: /snippets/node.js/progressive-jpegs-gm/
---

We want to convert all our header images to progressive JPEGs to give a good
impression of the content to come, rather than having everything line by line.
If you've installed [GraphicsMagick](http://www.graphicsmagick.org/) you can
use the excellent [gm](https://www.npmjs.com/package/gm) Node.js bindings to
do so. This is some sample code, with an additional check if the conversion
went well:

```javascript
const gm = require('gm');
const isProgressive = require('is-progressive');

gm('aggressive.png')
  .strip() // Removes any profiles or comments. Work with pure data
  .interlace('Line') // Line interlacing creates a progressive build up
  .quality(90) // Quality is for you to decide
  .write('aggressive-progressive.jpg', (err) => {
    if(err) throw Error(err);

    console.log('Converted');
    isProgressive.file('aggressive-progressive.jpg')
      .then(progressive => console.log('Is progressive:', progressive));
  });
```

You can even use this in your builds. [gulp-gm](https://www.npmjs.com/package/gulp-gm)
for instance makes these API bindings available in your Gulp builds.
