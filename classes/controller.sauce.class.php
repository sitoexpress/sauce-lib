<?php

class sauce_lib {

	private static $_instance = null;
	private $image_sizes;

  public function __construct() {

  	// Actions
  	add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'), 20);
		add_action('init', array($this, 'post_exclude'), 1);
		add_action('init', array($this, 'add_image_sizes'), 10);

		/* WC / UM / Shield Compat */
		add_action('woocommerce_lostpassword_form', array($this, 'wc_um_shield_compat_lostpass'), 9);
		add_action('woocommerce_login_form', array($this, 'wc_um_shield_compat_login'), 9);
		add_action('woocommerce_register_form', array($this, 'wc_um_shield_compat_login'));
		add_action('um_after_login_fields', array($this, 'wc_um_shield_compat_login'));

		/*
		* SOWB Stuff
		*/
		add_filter("siteorigin_widgets_template_variables_sow-image", array($this, "sow_image_auto_lightbox"), 10, 4);

		/* This might be useless since SOWB 1.30.x */
		add_filter('siteorigin_widgets_search_posts_results', array($this, 'so_search_fix'));

		/*
		* SOPB Stuff
		*/
		add_filter('siteorigin_panels_row_classes', array($this, 'sopb_add_row_classes'), 10, 2);

		/*
		* WC & WPML Stuff
		*/
		if(defined("WC_VERSION") && defined('ICL_LANGUAGE_CODE')) {
			add_filter('mod_rewrite_rules', array($this, 'wpml_wc_fix_rewritebase'));
		}

  }

	public function post_exclude() {
		$posts__not_in = post_exclude::instance();
	}

	/*
	* SiteOrigin Pagebuilder Customs
	*/

	public function sopb_add_row_classes($classes, $row) {
	  if(isset($row['style']['collapse_order'])) {
	    $classes[] = $row['style']['collapse_order'];
	  }
	  return $classes;
	}

	/**
	 * Woocommerce / Ultimate Member / Shield compatibility on login - reset password
	 */

	public function wc_um_shield_compat_lostpass() {
		do_action('lostpassword_form');
	}

	public function wc_um_shield_compat_login() {
		do_action('login_form');
	}

	/*
	* WPML / WOOCOMMERCE flush rewrite rules fix for .htaccess
	*/

	public function wpml_wc_fix_rewritebase($rules){
	    $home_root = parse_url(home_url());
	    if ( isset( $home_root['path'] ) ) {
	        $home_root = trailingslashit($home_root['path']);
	    } else {
	        $home_root = '/';
	    }

	    $wpml_root = parse_url(get_option('home'));
	    if ( isset( $wpml_root['path'] ) ) {
	        $wpml_root = trailingslashit($wpml_root['path']);
	    } else {
	        $wpml_root = '/';
	    }

	    $rules = str_replace("RewriteBase $home_root", "RewriteBase $wpml_root", $rules);
	    $rules = str_replace("RewriteRule . $home_root", "RewriteRule . $wpml_root", $rules);

	    return $rules;
	}

	/**
	 * Fix for Siteorigin not picking post in correct language in dropdowns
	 */

	public function so_search_fix($results) {
		if(!defined('ICL_LANGUAGE_CODE')) return $results;
		$fixed = array();
		foreach($results as $result) {
			$code = apply_filters( 'wpml_post_language_details', '', $result['value'])['language_code'];
			if( $code == ICL_LANGUAGE_CODE) {
				$fixed[] = $result;
			}
		}
		return $fixed;
	}

	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	private function set_image_sizes() {

    	$sizes = array();

    	$sizes[0] = array(
			'name' => 'square-thumb',
			'nicename' => 'Square Crop 480x480',
    	'width' => 480,
    	'height' => 480,
    	'crop' => true
  		);

  		$sizes[1] = array(
  			'name' => 'thin-640',
  			'nicename' => 'Medium Thin 640x240',
	    	'width' => 640,
	    	'height' => 240,
	    	'crop' => true
  		);

  		$sizes[2] = array(
  			'name' => 'medium-640',
  			'nicename' => 'Medium 640x360',
	    	'width' => 640,
	    	'height' => 360,
	    	'crop' => true
  		);

  		$sizes[3] = array(
  			'name' => 'big-800',
  			'nicename' => 'Big 800x480',
	    	'width' => 800,
	    	'height' => 480,
	    	'crop' => true
  		);

    	$this->image_sizes = apply_filters('sl_image_sizes', $sizes);

    }

    public function add_image_sizes() {

			$this->set_image_sizes();

    	foreach($this->image_sizes as $size) {

    		add_image_size($size['name'], $size['width'], $size['height'], $size['crop']);

    	}

			add_filter('image_size_names_choose', array($this, 'image_size_names_choose'), 1, 100);

    }

		public function image_size_names_choose($sizes) {

			$merge = array();

			foreach($this->image_sizes as $size) {
				$merge[$size['name']] = $size['nicename'];
			}

			return array_merge($sizes, $merge);

		}

    public function enqueue_scripts() {

			remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
			remove_action( 'wp_print_styles', 'print_emoji_styles' );
	    wp_dequeue_style( 'wp-pagenavi');

	    if(!defined('DISABLE_SL_JQUERY')) {
	  		wp_dequeue_script( 'jquery' );
	  		wp_deregister_script( 'jquery' );
	  		wp_dequeue_script('jquery-migrate');
	  		wp_deregister_script('jquery-migrate');
	  		wp_enqueue_script('jquery', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js');
	  		wp_enqueue_script('jquery-migrate', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-migrate/3.3.2/jquery-migrate.min.js');
	    }


			wp_enqueue_style('sauce-select2', 'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css');
	    wp_enqueue_style( 'sauce-style', SL_URL . 'assets/css/style.css', '', SL_VER);
	    wp_enqueue_style( 'sauce-bars-style', 'https://cdnjs.cloudflare.com/ajax/libs/simplebar/6.0.0-beta.10/simplebar.min.css', '', SL_VER);


			wp_enqueue_script( 'sauce-bars', 'https://cdnjs.cloudflare.com/ajax/libs/simplebar/6.0.0-beta.10/simplebar.min.js', '', SL_VER, true);
			wp_enqueue_script( 'sauce-fontawesome', 'https://use.fontawesome.com/796d2ad5c0.js', '', false, true);
			wp_enqueue_script( 'js-cookie', 'https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.min.js', '', SL_VER, true);
			wp_enqueue_script( 'sauce-select2', 'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.full.min.js', array('jquery'), SL_VER, true);
			wp_enqueue_script( 'scrollTo', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.3/jquery.scrollTo.min.js', array('jquery'), SL_VER, true);
			wp_enqueue_script( 'scrollTo-localScroll', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-localScroll/2.0.0/jquery.localScroll.min.js', array('scrollTo'), SL_VER, true);
			wp_enqueue_script( 'imagesloaded', '', array( 'jquery' ), false, true);
			wp_enqueue_script( 'sauce-script', SL_URL . 'assets/js/sauce.js', array('jquery', 'sauce-bars', 'js-cookie', 'sauce-select2', 'scrollTo-localScroll', 'scrollTo', 'imagesloaded'), SL_VER, true );

    }

		/**
		 * Makes SiteOrigin Widget Image auto-lightbox if "#" is set as URL value
		 */

		public function sow_image_auto_lightbox($vars, $instance, $args, $widget){
			if($instance['url'] == '#') {
				$vars['url'] = wp_get_attachment_image_url($instance['image'], 'full');
			}
			return $vars;
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
