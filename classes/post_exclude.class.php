<?php

class post_exclude {

	private static $_instance = null;
  private $shown_posts;

  public function __construct() {
    add_action('the_post', array($this, 'post_is_shown'), 100);
    add_action('pre_get_posts', array($this, 'exclude_shown'), 100);
  }

  function post_is_shown($post) {
    global $shown_posts;
    $shown_posts[] = $post->ID;
  }

  function get_shown_posts() {
    global $shown_posts;
    return $shown_posts;
  }

	function exclude_shown($query) {
    if(is_admin()) return;
    $to_exclude = $this->get_shown_posts();
    if(!empty($to_exclude)) {
			$excluded = ($query->get('post__not_in')) ? $query->get('post__not_in') : array();
			$to_exclude = array_unique(array_merge($excluded, $to_exclude));
      $query->set('post__not_in', $to_exclude);
    }
  }

	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

  /**
  * Private clone method to prevent cloning of the instance of the
  * *Singleton* instance.
  *
  * @return void
  */

  private function __clone() {}

  public function __wakeup() {}

}
