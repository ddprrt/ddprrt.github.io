---
title: "Reverting a single file"
published: true
categories:
- Git
permalink: /snippets/git/reverting-a-single-file/
---

You can do the following to revert a single filename to its previous status.

## If the file isn't commited:

```
git checkout filename
```

## If the file is already commited

`filename` is the path to your file, `abcde` is the hash of the commit you want to switch to.

```
git checkout abcde filename
```

or

```
git reset abcde filename
```
