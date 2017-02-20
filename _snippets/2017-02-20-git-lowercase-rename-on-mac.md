---
title: "Change case to lowercase for committed files"
published: true
categories:
- Git
permalink: /snippets/git/lowercase-rename
---

It's super-annoying that the Mac's file OS is case insensitive. Especially if you have a \*NIX based server that can't read your images and things like that. Just renaming it on the file system won't work, you have to rename it via Git itself:

```
git mv OldFileName.jpg newfilename.jpg
```

With this little script you can do lowercase all the files in a directory, ready to commit:

```
for f in *; do git mv "$f" "`echo $f | tr "[:upper:]" "[:lower:]"`"; done
```
