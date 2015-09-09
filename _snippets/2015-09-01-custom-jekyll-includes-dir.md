---
title: "Custom Jekyll Includes Directory"
published: true
categories: Jekyll
permalink: /snippets/jekyll/custom-jekyll-includes-directory/
---

If you want to have a custom `_includes` directory, and maybe more than one
`_includes` directory, you can easily achieve this by adding a new tag to your
existing Jekyll tag library:

{% highlight ruby %}
module Jekyll
  module Tags
    class SnippetTag < IncludeTag
      def resolved_includes_dir(context)
        context.registers[:site].in_source_dir('_snippets')
      end
    end
  end
end

Liquid::Template.register_tag('snippet', Jekyll::Tags::SnippetTag)
{% endhighlight %}

Put this in a file in your `_plugins` directory, then use it then with
&#123;% snippet test.md %&#125;
