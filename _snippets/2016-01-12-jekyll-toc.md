---
title: "Jekyll table of contents per page"
published: true
categories: Jekyll
permalink: /snippets/jekyll/table-of-contents/
---

This filter creates a table of contents list based on all `h2` tags that are on
your site.

{% highlight ruby %}
module TocFilter
  def toc(input)
    output = "<ul class=\"toc\">"
    input.scan(/<(h2)(?:>|\s+(.*?)>)([^<]*)<\/\1\s*>/mi).each do |entry|
      id = (entry[1][/^id=(['"])(.*)\1$/, 2] rescue nil)
      title = entry[2].gsub(/<(\w*).*?>(.*?)<\/\1\s*>/m, '\2').strip
      if id
        output << %{<li><a href="##{id}">#{title}</a></li>}
      else
        output << %{<li>#{title}</li>}
      end
    end
    output << '</ul>'
    output
  end
end
Liquid::Template.register_filter(TocFilter)

{% endhighlight %}

Use it with

{% highlight ruby %}
{% raw %}
{{ content | toc }}
{% endraw %}
{% endhighlight %}

Anywhere in your layouts.
