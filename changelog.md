# Sauce Library Changelog
This changelog will still be used to keep track of changes, as the github repo won't necessarily follow our internal release history.
* Current release: 0.6.5

## v.0.6.5
* popup_system:   slightly refactored code to include readypopup more coherently in the system. Readypopup are now called 'auto popup' and they're activated via the 'auto' class applied to a standard 'popup'. An auto popup can have two class values:
 * 'id-{string}' which identifies the popup in question (f.eg. id-menu2)
 * 'expire-{int}' which sets the cookie duration in days (f.eg. expire-4)
 * An example auto popup is '<div class='popup auto id-menu2 expire-4'></div>'
* style.css: added several CSS helper classes to improve CLS & LCP
* style.css: some simple animation classes moved to CSS transforms
* sauce.js: localscroll works with offset or no offset.
 * use 'no-offset' class on 'localscroll' element in order to disable offset
 * 'no-offset' class needs to be placed once in page
* sauce.js: removed do_popup_html() function
* php: __wakeup method in singleton classes moved to public to prevent Warning in PHP 8.0

## v.0.6.2
* longer_box:     box is now wrapped with .longer-content and button moved outside it for better customization and design
* style.css:      removed padding from .popup-content because simplebar was mad for it

## v.0.6.1
* style.css:      added github icon and tidied up some repeated css
* style.css:      popup-trigger inline-block to avoid 100% trigger width
* post_exclude:   fixed exclude_shown method did not account for other exclusions applied via pre_get_posts

## v.0.6.0
* post_context:   allows saving post context in order to reuse theme defined templates via query_posts
* post_exclude:   automatically exclude already displayed posts in pages (posts must use the_loop to show up)
* controller:     deleted some unused methods

## v.0.5.6
* functions:      sauce_create_popup accepts 'fullscreen' as arg
* style.css:      fixed <style> displayed as text under wp previews for unknown reasons
* style.css:      added .relative class that applies position: relative to element

## v.0.5.5
* sauce.js:       ready_popup now allows clicks on links, same should happen for popup_system
* sauce-lib.php:  added sauce() function to call sauce_lib::instance() for future uses
* functions.php:  added include
* functions.php:  added sauce_create_popup function to create popups
* popup_system:   fixed sauce.js for better web vitals web using sauce_create_popup (& ready_popup)
* sepwidgets.pho: deleted file


## v.0.5.0
* style.css:  removes ReCaptcha badge
* style.css:  better styling for wpcf7 related messages
* style.css:  inline-menu forces !important for inline-block
* sauce.js:   parent_click rewritten to handle _blank target via mixed js/css fix
* sauce.js:   added enable_localscroll which will enable localScroll effect for links within '.localscroll' parent element

## v.0.4.9
* sauce.js:   longer_box refresh method didn't remove .longer-click
* sauce.js:   select2 search box can now be hidden by adding .hide-search class to the select item
* sauce.js:   popup_close had two events attached leading to unexpected behaviour
* style.css:  round-img rules did not work for typo
* style.css:  the basic grid system now columnize at 811px in order to target 100% with on iPads
* controller: added Shield/WC compat for woocommerce registration form too
* style.css:  added twitter icon as social-item icon

## v.0.4.8
* modernizr:  removed file (already not loaded)
* sauce:      popups can now be closed by the following elements: .popup-close, .popup-background, .popup-accept, .button-close, a
* controller: adds class when SOPB rows collapse right on top
* style.css:  the basic grid system now has 15px default padding per cell, row class removes the lateral padding with negative margins
* style.css:  offset-site-header changed to offset-header-nav-wrap and moved into theme
* style.css:  added autoleft / autoright helper classes
* style.css:  added round-img class to round image within containers
* style.css:  extended .inline-panels class system with .right and .bottom classes
* controller: fixed issues with some SOPB filters

## v.0.4.6
* sauce.js:   is_on_screen now returns the distance in int between the element and the top viewport
* style.css:  fullheight overflow-y hidden
* controller: fixed wc_um_shield_compat_lostpass returning headers
* style.css:  some icons moved to GeneratePress Font

## v.0.4.5
* sauce.js:   longer_box now allows for clickable reference in its content
* controller: added compatibility between Ultimate Members / WooCommerce & Shield plugin
* style.css:  button-menu and inline-menu now works with non-.menu uls
* style.css:  auto-icons now require .auto-icons class on container to display

## v.0.4.4
* style.css: removed wp pagenavi css

## v.0.4.3 beta2
* style.css:  button-menu now working even without .inline-menu class
* style.css:  improvements for .object-fit class
* sauce.js:   fullheight did not work if offset_el not set
* sauce.js:   longer_box refactoring. It can be now initialized as $('.elem').longer_box() and updated via $('.elem').longer_box('reset')
* sauce.js:   checking for select existence in popup and ready before to apply select2

## v.0.4.2
* sauce_lib:  moved jquery to 3.6.0 and migrate to 3.3.2
* sauce_lib:  added so_search_fix function to filter link language in SOPB link search within widgets
* sauce_lib:  added sow_image_auto_lightbox function. SOW Image widget are now auto-lightboxed when # is set as URL
* sauce_lib:  added wpml_wc_fix_rewritebase that fixes permalink structure on woocommerce/wpml update when a specific config is setup
* sauce.js:   small fixes for jquery 3.x compat
* vendors:    removed jquery-lightbox as internal dependancy as the plugin development seems to have restarted and it's now compatible wth jQuery 3.x

## v.0.4.0
* style.css:  enabled smaller padding for popup on small screens
            better object-fit styling for SOPB rows.
            added inline-panels class to make a SOPB single-col row's panels inlined
            popup_system: now non-scrolling popups are vertically centered
            popup_system: now it's compatible with Brizy Editor
* sauce.js:   readypopup did not preventDefault();
* controller: updated simplebar to beta10

## v.0.3.9
* controller.sauce.class.php: 1) added image_size_names_choose to register in
                            wordpress dropdown selectors the image sizes defined in set_image_sizes or added via sl_image_sizes filter
                            2) fixed loading order for add_image_sizes and set_image_sizes
* style.css: added support for Vimeo and Instagram on social-item class
* style.css: small css improvements, removed old basil-form-row grid system
* sauce.js:  fixed issue with select2 being destroyed in popup_system even if not created
* sauce.js:  added check in ready_popup to prevent it from appearing in Lightroom check

## v.0.3.8
* sauce.js: added do_popup_html to create popup dinamically
          bug: current implementation does not copy events.
          bug: using clone(true,true) doesn't work with critical iframes (such as paypal Buttons)
          related: check oel-berlin.de v3 implementation
* sauce.js: longer-box now accepts elem parameter with class/id
* style.css: added .object-fit helper class, fixed some auto icons rule on whatsapp, mail and phone links for post/page content
* style.css: tidied some rules
* style.css: added .social-item class for social icons on menu items. Now supports Facebook & Youtube

## v.0.3.7
* sauce.js:  ready_popup uses requestAnimationFrame instead of setTimeout
* sauce.js:  fixed loads with an additional /
* sauce.css: fixed loads with an additional /

## v.0.3.6
* sauce_lib:  moved all scripts to footer
* style.css:  fixed css rules for popups still using jScrollPane
* sauce.js:   fixed readypopup still not applying .popup-css class
* sauce.js:   fixed some undeclared variables ll 25-30

## v.0.3.5
* sauce_lib:  moved to classes/controller.sauce.class.php
* sauce_lib:  moved to singleton pattern
* update:     moved from jScrollPane to SimpleBar
* scripts:    updated jscookie, select2 to latest version
* style.css:  added .fullscreen class for popups, plus clarified .fullscreenvideo class style
* sauce.js:   added support for cookieN value via get_class_value to set cookie duration for readypopup via css class
* sauce.js:   now get_class_value returns false if no match is found
* sauce.js:   lock-body class must be applied to 'html' and not 'body' to prevent scrollbar disappearing when popup appears
* sauce.js:   added .length check on most function in order to optimize performance
* sauce_lib:  jquery & jquery migrate are loaded via CDN only when SL_JQUERY in sauce-lib.php is set to 1

## v.0.3.1
* style.css: added simple grid system
* style.css: started to normalize Grid System + wpcf7 rules (checkboxes)

## v.0.3
* jquery.lightbox.min.js: borderSize: 0
* style.css: AUTO A ICONS are now inline-block. few css cleanse.
* style.css: #imageContainer: padding 0px
* style.css: remove .stretched > .row (use hpadded helper class instead)
* style.css: vpadded e hpadded from vivibistrot.local

## v.0.2
* sauce.js: r 372 ".readypopup a" / vivibistrot.com
* sauce.js: r 352 comment out / vivibistrot.com
* style.css: add stretched class / vivibistrot.local

## v.0.1
* General GeneratePress compatibility
* sauce.js refactory from original Basil theme
