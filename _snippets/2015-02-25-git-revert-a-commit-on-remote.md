---
title: "Delete a commit on your remote"
published: true
categories:
- Git
permalink: /snippets/git/delete-a-commit-on-your-remote/
---

Assume you have pushed a commit and regret it now. Or you did want to have that commit in another branch, for development reasons.
It's rather easy to revert that commit and delete it from your pushed remote:

First, get the commit hash using `git log`:

{% highlight bash %}
$ git log

commit f0b7a5ae40afd21e7b0269f72ff51dca8a073c6f
Author: Stefan Baumgartner <sbaumg@gmail.com>
Date:   Mon Jan 5 12:15:04 2015 +0100

    first git post yay

commit b54cd567aa46354d7b5c62aaa01f4459f7668ac8
Author: Stefan Baumgartner <sbaumg@gmail.com>
Date:   Fri Jan 2 19:06:01 2015 +0100

    no scrolling there

commit 6fb0ac1a2866881e93ab2e9c5881aacc3e21c007
Author: Stefan Baumgartner <sbaumg@gmail.com>
Date:   Fri Jan 2 19:05:17 2015 +0100

    no scrolling there
:
{% endhighlight %}

You need the first 8 digits of this hash. Then, run the following:

{% highlight bash %}
$ git push remotename +f0b7a5ae^:branchname
{% endhighlight %}

Git interprets the `^` after the hash as the parent of this very commmit, and the `+` as a force push. Reset done!
