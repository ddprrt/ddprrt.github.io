---
title: "Show only user's posts in post overview"
published: true
categories:
- Wordpress
permalink: /snippets/wordpress/show-only-user-s-post-in-post-overview/
---

This one restricts authors to only view their own posts in Wordpress' post overview:

{% highlight php %}
function mypo_parse_query_useronly( $wp_query ) {
    if ( strpos( $_SERVER[ 'REQUEST_URI' ], '/wp-admin/edit.php' ) !== false || strpos( $_SERVER[ 'REQUEST_URI' ], '/wp-admin/upload.php' ) !== false ) {
        if ( !current_user_can( 'update_core' ) ) {
            global $current_user;
            $wp_query->set( 'author', $current_user->id );
        }
    }
}

add_filter('parse_query', 'mypo_parse_query_useronly' );
{% endhighlight %}

Add this part to your `functions.php` or include it in a seperate plugin
