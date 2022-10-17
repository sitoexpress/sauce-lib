<?php

/*
* Creates Popups HTML
*/

function sauce_create_popup($content, $trigger, $settings = null) {

  $settings = shortcode_atts(
    array('return' => false, 'group' => '', 'trigger_align' => 'text-left', 'fullscreen' => false),
    $settings
  );

  $prefixes = $settings['group'];
  $elements = array('wrap', 'parent-css', 'popup', 'pp-content', 'trigger');

  $classes = array();


  foreach($elements as $el) {
    $classes[$el][] = ($el != 'popup') ? 'popup-'.$el : $el;
    if(isset($settings['group']) && !empty($settings['group'])) {
      foreach($settings['group'] as $pre) {
        $classes[$el][] = $pre.'-'.$el;
      }
    }
  }

  $classes['trigger'][] = $settings['trigger_align'];
  if($settings['fullscreen']) $classes['popup'][] = 'fullscreen';

  apply_filters('sauce_popup_classes', $classes, $settings);

  if($settings['return']) {
    ob_start();
  }

  ?>

  <div class="<?php echo implode(' ', $classes['wrap']); ?>">
    <div class="<?php echo implode(' ', $classes['parent-css']); ?>">
      <div class="popup-css <?php echo implode(' ', $classes['popup']); ?>">
        <div class="popup-wrapper">
          <div class="popup-content">
            <div class="<?php echo implode(' ', $classes['pp-content']); ?>">
                <?php echo $content; ?>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="<?php echo implode(' ', $classes['trigger']); ?>">
      <?php echo $trigger; ?>
    </div>
  </div>

  <?php
  if($settings['return']) {
    return ob_get_clean();
  }

}
