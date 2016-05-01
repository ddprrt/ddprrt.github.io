---
title: "Wordpress: Remove Admin bar in Theme"
published: true
categories:
- Wordpress
permalink: /snippets/wordpress/wordpress-remove-admin-bar-in-theme/
---

The admin bar in Wordpress can be annoying sometimes, hiding some of your design and even having certain side effects you don't want. With this snippet, you can turn it off:

{% highlight php %}
<?
function my_function_admin_bar() {
  return false;
}

add_filter( 'show_admin_bar' , 'my_function_admin_bar');
{% endhighlight %}

Add this part to your `functions.php` or include it in a seperate plugin
