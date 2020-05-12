---
layout: post
---

<ul>
{%- for post in collections.posts -%}
  <li><a href="{{post.url}}">Link</a>: {{ post.data.title }}</li>
{%- endfor -%}
</ul>
