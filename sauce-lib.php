<?php

/*

Plugin Name: SE Sauce Library
Description: Adds some PHP/JS/CSS facilities to any theme.
Author: Sito.Express
Author URI: https://sito.express
Version: 0.6.0
License: GPL v3
Text Domain: sauce-lib

*/

define('SL_VER', 'v.0.6.0');
define('SL_DIR', plugin_dir_path(__FILE__));
define('SL_URL', plugin_dir_url(__FILE__));

require_once(SL_DIR.'classes/controller.sauce.class.php');
require_once(SL_DIR.'classes/post_context.class.php');
require_once(SL_DIR.'classes/post_exclude.class.php');
require_once(SL_DIR.'includes/functions.php');

$sauce_lib = sauce_lib::instance();

function sauce() {
  return sauce_lib::instance();
}

?>
