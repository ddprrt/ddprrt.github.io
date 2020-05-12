---
title: "Jekyll filter: Use Liquid in front-matter"
published: true
categories: Jekyll
permalink: /snippets/jekyll/liquid-in-frontmatter/
---

Jekyll's template language [Liquid](https://help.shopify.com/themes/liquid) is pretty powerful. We
especially use Liquid objects to access different data across all pages, like

```
{% raw %}
{{ site.data.placeholder.product-name }}
{% endraw %}
```

instead of the product name itself. However, we can't use these objects in front-matter, where
we would define titles and other meta information:

```
{% raw %}
---
title: How to install {{ site.data.placeholder.product-name }}
---
{% endraw %}
```

Not possible. Well, not without a little help at least. Here's a nice filter that
parses Liquid objects when used within Jekyll front-matter:

```ruby
module LiquidFilter
  def liquify(input)
    Liquid::Template.parse(input).render(@context)
  end
end
Liquid::Template.register_filter(LiquidFilter)
```

Use it with

```ruby
{% raw %}
{{ page.title | liquify }}
{% endraw %}
```

Anywhere in your layouts.
