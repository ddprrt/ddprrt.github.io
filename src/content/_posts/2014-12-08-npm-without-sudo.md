---
title: "Running NPM without sudo"
published: true
categories:
- Node.js
permalink: /snippets/node.js/npm-without-sudo/
---

Several ways to fix the problem of running node tools and npm without sudo (which probably always results in an error).

## What I do at the moment

Creating npm local in your home directory. Changing the npm configuration and pointing to this directory.

```bash
npm config set prefix ~/npm
```

Adding the directory to my path. Adding this line to `.zshrc` or `.bashrc`

```bash
export PATH="$PATH:$HOME/npm/bin"
```

## What might also work

Giving the path to all the node directories to the current user:

```bash
sudo chown -R `whoami` ~/.npm
sudo chown -R `whoami` /usr/local/lib/node_modules
```
