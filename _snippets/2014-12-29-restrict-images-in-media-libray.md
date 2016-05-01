---
title: "Show only user's images in media library"
published: true
categories:
- Wordpress
permalink: /snippets/wordpress/show-only-user-s-images-in-media-library/
---

This short snippet restricts authors to only view the files from the media library which they have uploaded:

{% highlight php %}
<?
add_action('pre_get_posts','ml_restrict_media_library');

function ml_restrict_media_library( $wp_query_obj ) {
  global $current_user, $pagenow;
  if( !is_a( $current_user, 'WP_User') )
    return;
  if( 'admin-ajax.php' != $pagenow || $_REQUEST['action'] != 'query-attachments' )
    return;
  if( !current_user_can('update_core') )
    $wp_query_obj->set('author', $current_user->ID );
  return;
}
{% endhighlight %}

Add this part to your `functions.php` or include it in a seperate plugin
