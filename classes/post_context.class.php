<?php

/*
* Save and restore post context when using query_posts
* or other raw query methods that overwrite $[GLOBALS]
*
* It's useful to reuse standard theme/plugin templates
*

Usage Example:

  $context = new post_context();
  $context->set($posts); // $posts is an array of post_ids which you may already have calculated, otherwise run your own query_posts()
    include('loop/loop-archive-portfolio.php');
    OR
    get_template_part('template_name');
  $context->restore();

*/

class post_context {

  private $wp_query;
  private $pagenow;
  private $post;

  public function __construct() {

    $this->save();

  }

  /*
  * Saves the current post context
  */

  private function save() {

    global $wp_query, $pagenow, $post;

    $this->wp_query   = $wp_query;
    $this->pagenow = $pagenow;

    if ($post) {
      $this->post = $post;
    }

  }

  /*
  * Sets (easily) a post content when you already have an array of post ids
  * Otherwise, run your own query_posts
  */

  public function set($posts) {

    global $wp_query, $pagenow, $post;

    if($wp_query != $this->wp_query && $pagenow != $this->pagenow && $post != $this->post) return false;

    query_posts(array(
      'post_type' => $this->set_types($posts),
      'post__in' => $posts,
      'orderby' => 'post__in',
      'ignore_sticky_posts' => 1
      )
    );

    return true;

  }

  /*
  * Given an array of post_ids, retrieves all the multiple post_types
  * they may include (which is a parameter needed by query_posts)
  */

  private function set_types($posts) {
    $types = array();
    foreach ($posts as $id) {
      $types[] = get_post_type($id);
    }
    return array_unique($types);
  }

  /*
  * Restore the previuosly saved post context
  */

  public function restore() {

    global $wp_query, $pagenow, $post;

    $wp_query = $this->wp_query;
    $pagenow = $this->pagenow;
    $post = $this->post;

    if (isset($this->post) && !empty($this->post)) {
      $post = $this->post;
      setup_postdata( $post );
    }

  }

}
