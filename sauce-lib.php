<?php

/*

Plugin Name: SE Sauce Library
Description: Adds some PHP/JS/CSS facilities to any theme.
Author: Sito.Express
Author URI: https://sito.express
Version: 0.8.0
License: GPL v3
Text Domain: sauce-lib

*/

define('SL_VER', 'v.0.8.0');
define('SL_DIR', plugin_dir_path(__FILE__));
define('SL_URL', plugin_dir_url(__FILE__));

require_once(SL_DIR.'classes/controller.sauce.class.php');
require_once(SL_DIR.'classes/post_context.class.php');
require_once(SL_DIR.'classes/post_exclude.class.php');
require_once(SL_DIR.'includes/functions.php');

add_action('init', 'load_sauce_on_init', 1);

function load_sauce_on_init() {
  $sauce_lib = sauce_lib::instance();
}

function sl_() {
  return sauce_lib::instance();
}

add_action('plugins_loaded', 'woocommerce_dummies'); 

function woocommerce_dummies() {
  if(!class_exists( 'WooCommerce' )) {
    function is_shop() {
      return false;
    }
    function is_cart() {
      return false;
    }
    function is_checkout() {
      return false;
    }
  }
}

?>
