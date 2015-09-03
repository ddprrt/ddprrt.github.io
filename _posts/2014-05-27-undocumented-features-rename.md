---
title: "Lesser known Grunt.js features: Renaming of files"
layout: book
published: true
permalink: /blog/2014/05/27/undocumented-features-rename/
categories:
- Tools
- Grunt
---
Recently I had to deploy some static sites for some client, whose server didn't allow to automatically redirect to `index.html` when accessing a directory. It had to be named `index.php` for whatever reason.

Having everything in one neat *Grunt.js* build chain I tried using a plugin for this very task. And I had the very problem as with almost every *Grunt plugin* out there: There were plenty, and none was in any way usable for my needs. *grunt-rename* is some sort of *mv* command (which is roughly the same, but just if you have the power of regexp), and *grunt-contrib-rename* is neither a *contrib* task nor does it rename files.

After some research and digging I actually found out that I didn't have to look that far: I just can use *grunt-contrib-copy*!

You just need to attach one parameter to my configuration, which overrides the standard *rename* function of the *Grunt* file utilities.

{% highlight javascript %}
...
copy: {
  dist: {
    files: [{
      expand: true,
      dot: true,
      cwd: 'dist',
      dest: 'dist/',
      src: [
        '{,*/}*.html'
      ],
      rename: function(dest, src) {
        return dest + src.replace('.html','.php');
      }
    }]
  }
},
...
{% endhighlight %}

The function takes two parameters: *dest* and *src*, with *dest* being the destination directory. Be sure to attach a trailing slash at the end. *src* is the current file, so if your expression catches more than one file, you can access them one by one here.

I just copied the files from the same directory *to* the same directory. By having a different suffix all the files stay where the were. So afterwards, being already in the *dist* folder, delete all the '*.html' files using *grunt-contrib-clean*.

## Beware!

Be aware that this very method is an internal utility for file operations in grunt and might not be there in the future. However, until we get something better, why not use what's there!
