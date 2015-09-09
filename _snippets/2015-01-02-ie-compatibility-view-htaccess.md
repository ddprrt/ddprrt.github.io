---
title: "Changing compatibility view settings for IE via htaccess"
published: true
categories:
- Server
permalink: /snippets/server/changing-compatibility-view-settings-for-ie-via-htaccess/
---

Those lines send compatibility view instructions with the HTTP Header:

```
# ---------------------------------------------------
# Better website experience for IE users
# ---------------------------------------------------

# Force the latest IE version, in various
# cases when it may fall back to IE7 mode
# github.com/rails/rails/commit/123eb25#commitcomment-118920
# Use ChromeFrame if it's installed for a
# better experience for the poor IE folk

<IfModule mod_setenvif.c>
  <IfModule mod_headers.c>
    BrowserMatch MSIE ie
    Header set X-UA-Compatible "IE=Edge,chrome=1" env=ie
  </IfModule>
</IfModule>

<IfModule mod_headers.c>
#
# Because X-UA-Compatible isn't sent to non-IE
# (to save header bytes), we need to inform proxies
# that content changes based on UA
#
  Header append Vary User-Agent
# Cache control is set only if mod_headers
# is enabled, so that's unncessary to declare
</IfModule>
```

I needed this because compatibility view instructions in the META tag work fine, but not with conditional comments in Intranet sites. htaccess instructions on the other hand work fine!
