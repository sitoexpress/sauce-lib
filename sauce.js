/**
 * File sauce.js.
 *
 * Handles all the scripts and automations
 *
 */

var viewport
var ui_update

function ui_timer() {

	var timer
	var init_viewport

	function get_viewport() {
		return {
			h: parseInt($(window).height()),
			w: parseInt($(window).width())
		}
	}

	function update_check() {

    var currH = init_viewport.h
		var currW = init_viewport.w
		var maxH = viewport.h + 100
		var minH = viewport.h - 100
		var maxW = viewport.w + 60
		var minW = viewport.w - 60

		if((currH > maxH) || (currH < minH) || (currW > maxW) || (currW < minW)) {
			init_viewport = viewport
			return true
		} else {
			init_viewport = viewport
			return false
		}

	}

	function work() {
		viewport = get_viewport()
		ui_update = update_check()

		// console.log('sauce_js work()', viewport.h, viewport.w)
	}

	function init() {
		init_viewport = get_viewport()
		viewport = get_viewport()
		update_check()
		timer = setInterval(work, 249)
	}

	init()

}

function get_class_value(elem, needle) {
	classes = $(elem).attr('class').split(' ')
  if(!classes) return false
	// retrieve offset_el from css offset-* class
	for (i = 0; i < classes.length; i++) {

		regexp = new RegExp("^" + needle + "-(.+)")
		matches = regexp.exec(classes[i])

		if (matches) {
			return matches[1]
		}
	}
}

function scroll_check(options) {

	var timer

	default_options = {
        top_offset : 100,
        page_width : 100,
        refresh: 250
    }

    options = $.extend({}, default_options, options)

	function work() {
		var scrolled = $(window).scrollTop()

		if($('.site-header').length) {
			if(scrolled > options.top_offset && viewport.w > options.page_width) {
				$('body').addClass('scrolled')
			} else {
				$('body').removeClass('scrolled')
			}
		}
	}

	function init() {
		timer = setInterval(work, options.refresh)
	}

	init()

}

function max_width() {
  if(!$('[class*="max"]').length) return
	$('[class*="max"]').each(function(){
		$(this).css('max-width', get_class_value(this, 'max')+'px')
	})
}

function elem_fullheight(options) {

	var timer
	var i
	var matches
	var offset_el
	var coeff = 1
	var classes

    default_options = {
        target : ".fullheight",
        refresh : 250
    }

    options = $.extend({}, default_options, options)

    function init() {
		if($(options.target).length) {
			setup()
			work()
			timer = window.setInterval(update_check, options.refresh)
			scroll_arrow()
		}
	}

	function setup() {
		classes = $(options.target).attr('class').split(' ')
		offset_el = '.'+get_class_value(options.target, "offset")
		coeff = get_class_value(options.target, "height")/100
	}

	function work() {

		// set heights
		var offsetH = ($(offset_el).length) ? $(offset_el).outerHeight() : 0;
		var currentH = (viewport.h - offsetH) * coeff

		$(options.target).height(currentH)
		$('.halfheight').height(currentH/2)

		// Site Origin Hero compatibility check
		var hero = $(options.target).find('.sow-slider-images')

		if(hero) {
			hero.height(currentH).css('min-height', currentH + 'px').css('max-height', currentH + 'px')
			hero.find('.sow-slider-image').css('min-height', currentH + 'px').css('max-height', currentH + 'px')
		}

	}

	function update_check() {
		ui_update && work()
	}

	function scroll_arrow() {
		slider = $(options.target)
		hasSlider = slider.length
		button = '<div class="bottom-circle" id="circle1"><a href="#next"><div class="bottom-arrow animation" id="#arrow1"></div></a></div>'

		if(hasSlider) {
			$(slider).each(function(){
				if($(this).hasClass('scrolldown')) {
					$(button).appendTo(this)
					$('.bottom-circle').each(function() {
						$(this).localScroll({
							onBefore: function() {
								this.offset = {
									top: -$('.site-header').outerHeight(),
								}
							}
						})
					})
				}
			})
		}
		$('.go-next').each(function() {
			$(this).localScroll({
				onBefore: function() {
					this.offset = {
						top: -$('.site-header').outerHeight(),
					}
				}
			})
		})
	}

	$('body').imagesLoaded(function(){
		init()
	})

}

$.fn.longer_box = function(callback) {

	var timer

	function work(elem) {

			var height_limit
			var content
			var content_height
      var viewed_height

			height_limit = get_class_value(elem, "height")

      if(!height_limit) height_limit = 100

      if(!$('.longer-content', elem).length) elem.children().wrapAll("<div class='longer-content longer-css'></div>")

      content = $('.longer-content', elem)

      if(!$(content).hasClass('longer-css')) $(content).addClass('longer-css')

			content_height = content.outerHeight(true, true)
			viewed_height = content.height()

			if(viewed_height <= height_limit) return

			$(content).css('height', height_limit+'px')

      $(elem).append('<div class="longer-click"><span class="longer-plus longer-char"></span></div>')

      $('.longer-click, h2', elem).click(function() {
				content.toggleClass('longer-open')
				$('.longer-char', elem).toggleClass('longer-hide')
				$('.longer-char', elem).toggleClass('longer-plus')
				if(content.hasClass('longer-open')) {
					content.css('height', content_height +'px')
					$('.longer-overlay', elem).toggleClass('a-disappear')
				} else {
					content.css('height', height_limit +'px')
					$('.longer-overlay', elem).toggleClass('a-disappear')
				}
			})
	}

	function reset(elem) {

		elem.each(function() {
			$('.longer-content', this).css('height', 'auto').removeClass('longer-open')
      $('.longer-overlay', this).remove()
      $('.longer-char', this).remove()
      $('.longer-click', this).remove()
			$(this).unbind('click')
      work($(this))
		})

	}

	function update_check(elem) {
		ui_update && reset(elem)
	}

	function init(elem) {
		work(elem)
		timer = setInterval(update_check, 250, elem)
	}

  return this.each(function() {
    var elem = $(this)
    if(callback == 'reset') {
      reset(elem)
    } else {
      init(elem)
    }
  })

}

function hide_site_header() {
	if(!$('#content').find('.hide-site-header').length) return
	if($('.header-nav-wrap').length) {
    $('.header-nav-wrap').remove()
    return
  }
	$('.site-header').remove()
}

function no_footer_margin() {
	if(!$('#content').find('.no-footer-margin').length) return
	$('#colophon').css('margin-top','0')
}

function parent_click(anchor, parent) {
  if(!anchor.length) return
	$(anchor).each(function() {

		var container = $(this).closest(parent)
		var link = $(this).attr('href')
    var target = $(this).attr('target')

		$(container).css('cursor','pointer')

    if(target == '_blank') {
      var a_overlay = "<a class='a-overlay' href='"+link+"' target='blank'></a>"
      if(!container.find('.a-overlay').length) {
        $(a_overlay).appendTo(container)
      }
    } else {
  		$(container).click(function(){
  			window.location = link
  		})
    }

	})
}

function vertical_align(distance, elem) {
  if(!elem.length) return
	position = $(distance).position()
	$(elem).css('margin-top', position.top + 'px')
}

function same_height(selector, margin) {

	var max_height = 0

  if(!selector.length) return

	setTimeout(function(){
		$(selector).each(function(){
			$(this).css('height','auto')
		})

		if(margin) {
			$(selector).each(function() {
				max_height = $(this).outerHeight(true) > max_height ? $(this).outerHeight(true) : max_height
			})
		} else {
			$(selector).each(function() {
				max_height = $(this).outerHeight(false) > max_height ? $(this).outerHeight(false) : max_height
			})
		}

		$(selector).each(function(){
			$(this).css('height', max_height + 'px')
		})
	}, 250)

}

function ready_popup() {
	// readypopup requires js-cookie to work
	var body_offset_y = 0
	var is_cookie = Cookies.get('popup-closed')
	var is_popup = $('.readypopup').length
	var is_logged = $('.logged-in').length
	var ua = navigator.userAgent

	if(!is_cookie && is_popup && ua.indexOf('bot') == -1 && ua.indexOf('Lighthouse') == -1) {

			var ready = $('.readypopup')
      var time = get_class_value(ready, 'cookie')
      var cookie_time = (time) ? time : 1

			ready.addClass('a-disappear popup-css')
			ready.closest('.so-panel').css('margin-bottom','0')
			ready.parent('div').addClass('readypopup-parent readypopup-active')

      if($(".popup-content", ready).length < 1) {
          $("> div", ready).addClass('popup-content').wrap('<div class="popup-wrapper"></div>')
      }

      $('<div class="readypopup-close"></div>').appendTo($('.popup-wrapper', ready))

			if($('.readypopup').hasClass('fullscreenvideo')) {
				$('<div class="video-controls"><div class="unmute"><a>Attiva audio</a></div><div class="button-close"><a>Salta il video</a></div></div>').appendTo($('.popup-wrapper', ready))
				$('.unmute').click(function(){
					$('body > .readypopup video').prop('muted', false)
				})
			}

      window.requestAnimationFrame(function(){
        $('<div class="readypopup-background a-disappear"></div>').appendTo('body')
  			// $(".readypopup").find('.ow-button-base a').removeAttr('href')

  			if ($("body").height() > $(window).height()) {
  				body_offset_y = $(window).scrollTop()
          $('html').addClass('lock-body')
  				$('body').css('margin-top', -body_offset_y)
  				if($('body').hasClass('scolled')) $('body').addClass('as-scrolled')
  			}
        ready.appendTo('body')
				ready.toggleClass('a-appear a-disappear')
				$('.readypopup-background').toggleClass('a-appear a-disappear')
        window.requestAnimationFrame(function(){
          new SimpleBar($('.popup-content', ready)[0])
          if($('select', ready).length) { $('select', ready).select2() }
  			})
			})

			$( ".readypopup-close, .readypopup-background, .readypopup .ready-accept, .readypopup .button-close, .readypopup a" ).click(function(e) {

        e.preventDefault()

				var popup = $('body > .readypopup')
				var parent = $('.readypopup-active')
        var $this = $(this)

				$('.readypopup-background').toggleClass('a-appear a-disappear')
				popup.toggleClass('a-appear a-disappear')

        $('html').removeClass('lock-body')
				$('body').css('margin-top', '')
				$(window).scrollTop(body_offset_y)
				$('.site-header').removeClass('as-scrolled')

				setTimeout(function(){
					popup.appendTo(parent)
					parent.removeClass('readypopup-active')
					$('.readypopup-background').remove()
					$('body > .readypopup video').remove()
					$('.readypopup video').remove()
					Cookies.set('popup-closed', '1', { expires: time })
          if($this.attr('href') !== "" && typeof $this.attr('href') !== 'undefined') {
            window.location.href = $this.attr('href')
          }
				}, 550)

			})

			if($('.readypopup').hasClass('fullscreenvideo')) {
				var contentVideo = document.getElementsByClassName("elementor-video")[0]
				var promise = contentVideo.play()

				if (promise !== undefined) {
					promise.then(function() {
						console.log('playing')
						$(".basil-loader").addClass('a-disappear')
					}, function(e) {
						$('.readypopup-close').click()
					})
				}
			}

	}
}

function do_popup_html(content,trigger,elem) {
  content = (typeof content != 'string') ? content.outerHTML : content
  var html =  "<div class='basil-do-popup'>"
  		html += "<div>"
  		html +=	"<div class='"+elem+" fullscreen'>"
  		html +=	"<div>"
  		html += "<div class='textwidget do-popup-content'>"+content+"</div>"
  		html +=	"</div>"
  		html +=	"</div>"
  		html += "</div>"
  		html += "<div class='popup-trigger'>"
  		html +=	"<p class='button'>"+trigger+"</p>"
  		html += "</div>"
	    html += "</div>"
  var obj = document.createRange().createContextualFragment(html)
  return obj
}

function popup_system(elem) {

	var body_offset_y = 0

	var popup_trigger = elem+'-trigger'
	var popup_close = elem+'-close'
	var popup_bg = elem+'-background'

	var is_popup = $(elem).length
	if(!is_popup) return

	if(!$('.popup-background').length)
	$('<div class="popup-background a-disappear"></div>').appendTo('body')

	$(".popup-trigger").find('.ow-button-base a').removeAttr('href')

	$(elem).each(function(){

    var popup = $(this)
    build(popup)

    if(popup.hasClass('auto')) {

      var closed_cookie = get_cookie_name(popup, 'id', 'closed');
      var is_closed =  Cookies.get(closed_cookie)
    	var is_logged = $('.logged-in').length
    	var ua = navigator.userAgent

      if(!is_closed && ua.indexOf('bot') == -1 && ua.indexOf('Lighthouse') == -1) {
        open(popup)
      }
    }

	})

	$( popup_trigger ).click(function() {

		var container = $(this).closest('.popup-container')
		var popup = $(container).find(elem)
    open(popup)

	})

  $('.popup .popup-close, .popup .popup-background, .popup .popup-accept, .popup .button-close, .popup a').click(function(){
    close()
  })

	$(".popup-trigger .lsow-social-list a").click(function(e) {
    e.stopPropagation()
	})

  function get_cookie_name(popup, value, suffix) {
    var value = get_class_value(popup, value)
    return (value) ? 'popup-'+value+'-'+suffix : 'popup-'+suffix;
  }

  function build(popup) {

    popup.addClass('a-disappear popup-css')
		popup.closest('.so-panel').css('margin-bottom','0')

    if($(".popup-content", popup).length < 1) {
        $("> div", popup).addClass('popup-content').wrap('<div class="popup-wrapper"></div>')
    }

		$('<div class="popup-close"></div>').appendTo($('.popup-wrapper', popup))
		$('.popup-close', popup).addClass(popup_close.replace(/\./g, ""))
		popup.attr('data-backclass', popup_bg)
		popup.parents().filter($('.popup-trigger').parents()).first().addClass('popup-container')
		popup.closest('.popup-container').find('.popup-trigger').addClass(popup_trigger.replace(/\./g, ""))
		popup.parent('div').addClass('popup-parent')

  }

  function close() {

    var popup = $('body > .actual-popup')
    var parent = $('.popup-active')
    var $this = $(this)

    $('.popup-background').toggleClass('a-appear a-disappear')
    popup.toggleClass('a-appear a-disappear')

    $('html').removeClass('lock-body')
    $('body').css('margin-top', '')
    $(window).scrollTop(body_offset_y)
    $('.site-header').removeClass('as-scrolled')

    setTimeout(function() {

      popup.appendTo(parent)
      parent.removeClass('popup-active')
      $('.popup-background').unbind()

      if(popup.hasClass('auto')) {
        var closed_cookie = get_cookie_name(popup, 'id', 'closed')
        if(!Cookies.get(closed_cookie)) {
          var time = get_class_value(popup, 'expire')
          var cookie_time = (time) ? parseInt(time) : 1;
          Cookies.set(closed_cookie, '1', { expires: cookie_time })
        }
      }

      if($this.attr('href') !== "" && typeof $this.attr('href') !== 'undefined') {
        window.location.href = $this.attr('href')
      }

    }, 550)

  }

  function open(popup) {

    var current_bg = popup.data('backclass')
    var container = popup.closest('.popup-container')

    if(!popup.hasClass('actual-popup')) popup.addClass('actual-popup')

    if(container.hasClass('popup-parent')) {
      container.addClass('popup-active')
    } else {
      container.find('.popup-parent').addClass('popup-active')
    }

    if($('select', popup).hasClass('select2-hidden-accessible')) {
      $('select', popup).select2('destroy')
    }

    if ($("body").height() > $(window).height()) {
      body_offset_y = $(window).scrollTop()
      $('html').addClass('lock-body')
      $('body').css('margin-top', -body_offset_y)
      if($('body').hasClass('scrolled')) $('body').addClass('as-scrolled')
    }

    popup.appendTo('body')
    $('.popup-background').addClass(current_bg.replace(/\./g, ""))

    setTimeout(function(){
      window.requestAnimationFrame(function(){
        popup.toggleClass('a-appear a-disappear')
        $('.popup-background').toggleClass('a-appear a-disappear')
      })
    }, 100)

    setTimeout(function(){
      window.requestAnimationFrame(function(){
        new SimpleBar($('.popup-content', popup)[0])
        if($('select', popup).length) { $('select', popup).select2() }
      })
    }, 100)

    $(current_bg).click(function() {
      close()
      if(current_bg != '.popup-background') $(this).removeClass(current_bg.replace(/\./g, ""))
    })

  }

}

function basil_modal() {

	var body_offset_y = 0

	$.alert = function(params){
		if($('#modalpopup').length){
			setTimeout(function() {
				build_modal(params)
			}, 1000)
		} else {
			build_modal(params)
		}
	}

	$.confirm = function(params){
		if($('#modalpopup').length){
			setTimeout(function() {
				build_modal(params)
			}, 1000)
		} else {
			build_modal(params)
		}
	}

	$.confirm.hide = function(){
		$('.modal-background, #modalpopup').toggleClass('a-appear a-disappear')

		if(!$('body > .actual-popup').length) {
      $('html').removeClass('lock-body')
			$('body').css('margin-top', '')
			$(window).scrollTop(body_offset_y)
			$('body').removeClass('as-scrolled')
		}

		setTimeout(function() {
			$('.modal-background, #modalpopup').remove()
		}, 500)
	}

	function build_modal(params) {
		var button_html = ''

		$.each(params.buttons,function(name,obj){
			// Generating the markup for the buttons:
			button_html += '<a href="#" class="button '+obj['class']+'">'+name+'<span></span></a>'
			if(!obj.action){
				obj.action = function(){}
			}
		})

		var markup = [
			'<div class="modal-background a-disappear"></div>',
			'<div id="modalpopup" class="popup popup-css a-disappear">',
			'<div class="popup-wrapper">',
			'<div class="popup-content">',
			'<div class="textwidget">',
			'<h1>',params.title,'</h1>',
			'<p>',params.message,'</p>',
			'<div id="popup-buttons">',
			button_html,
			'</div></div></div>',
			'</div></div>'
		].join('')

		$(markup).appendTo('body')

		if ($("body").height() > $(window).height()) {
			body_offset_y = $(window).scrollTop()
			if(!$('html').hasClass('lock-body')) {
        $('html').addClass('lock-body')
        $('body').css('margin-top', -body_offset_y)
      }
			if($('body').hasClass('scrolled') && !$('body').hasClass('as-scrolled'))
				$('body').addClass('as-scrolled')
		}

		setTimeout(function(){
			$('#modalpopup').toggleClass('a-appear a-disappear')
			$('.modal-background').toggleClass('a-appear a-disappear')
		}, 100)

		var buttons = $('#modalpopup .button'),
		i = 0

		$.each(params.buttons,function(name,obj){
			buttons.eq(i++).click(function(){
				// Calling the action attribute when a
				// click occurs, and hiding the confirm.
				obj.action()
				$.confirm.hide()
				return false
			})
		})
	}
}

/*
* Check if element is on screen
* if it's on screen, returns the distance to the top of the viewport
*/

function is_on_screen(elem)
{
	if ($(elem).length) {
		var doc_view_top = $(window).scrollTop()
		var doc_view_bottom = doc_view_top + $(window).height()
		var elem_top = $(elem).offset().top
		if((elem_top <= doc_view_bottom) && (elem_top >= doc_view_top)) {
      return parseInt(elem_top - doc_view_top);
    }
    return false;
	}
}

function sauce_commerce() {

	//* Wrap thumbnail in archives to show gradient around **//

	$('.products li.product img').each(function(){
		$(this).wrap('<div class="thumb-wrap"></div>')
	})

	//** Ajax Add To Cart Dynamics **//

	$( document.body ).on( 'added_to_cart', function(){
		var buyBox = $('.basil-buy-product')

		if(buyBox.length) {
			setTimeout(function(){

				var Atc = $('.added_to_cart', buyBox)

				buyBox.each(function(){

					if($('.remove-added-to-cart', this).length) return

					$('.added_to_cart', this).append('<span class="remove-added-to-cart"></span>')
					$('.added_to_cart', this).addClass('a-appear')

					$('.remove-added-to-cart', this).click(function(e){

						e.preventDefault()

						var thisAtc = $(this).closest('.added_to_cart')
						var thisBuyButt = $(this).closest('.basil-buy-product').find('.added')

						$(this).closest('.basil-buy-product').find('.go-to-product').toggleClass('a-appear a-disappear')

						thisAtc.removeClass('a-appear')
						thisBuyButt.removeClass('added')

						setTimeout(function(){
							thisAtc.remove()
						}, 550)

					})

				})

			}, 100)
		}
	})

	$('.basil-buy-product .add_to_cart_button').click(function(e){
		e.preventDefault()
		var add_to_qty = $(this).data('quantity')
		console.log(add_to_qty)

		$('+ .go-to-product', this).toggleClass('a-appear a-disappear')

	})

	/** Basil Woo Set Quantity **/

	var current_qty
	var steps
	var qty_parent
	var qty_elem
	var new_qty
	var change_qty_to
	var change_data_to
	var woo_qty_wrap
	var is_cart = $('body.woocommerce-cart').length

	function wooSetQty() {

		$('.quantity input').each(function() {
			steps = parseInt($(this).attr('step'))
			if(!steps) steps = basil_woo_steps

			parent = $(this).closest('quantity')

			if(!$(this).hasClass('quantity-active')) {

				$(this).wrap('<span class="woo-quantity-wrap"></span>').addClass('quantity-active')
				woo_qty_wrap = $(this).closest('.woo-quantity-wrap')
				$(woo_qty_wrap).append('<span class="woo-increment"></span>')
				$(woo_qty_wrap).prepend('<span class="woo-decrement"></span>')

			}

			$( ".woo-decrement").unbind( "click" )
			$( ".woo-increment").unbind( "click" )

		})

		$('.woo-decrement').click(function(){
			steps = parseInt($(this).closest('.woo-quantity-wrap').find('.qty').attr('step'))
			if(!steps) steps = basil_woo_steps
			change_qty_to = $(this).closest('.woo-quantity-wrap').find('.qty')
			current_qty = $(change_qty_to).val()
			if(current_qty > 0) {
				new_qty = parseFloat(current_qty) - steps
				$(change_qty_to).val(new_qty).change()
			}
			if(is_cart) {
				$('.actions .button').prop('disabled',false)
			}
		})

		$('.woo-increment').click(function(){
			steps = parseInt($(this).closest('.woo-quantity-wrap').find('.qty').attr('step'))
			if(!steps) steps = basil_woo_steps
			change_qty_to = $(this).closest('.woo-quantity-wrap').find('.qty')
			current_qty = $(change_qty_to).val()

				new_qty = parseFloat(current_qty) + steps
				$(change_qty_to).val(new_qty).change()

			if(is_cart) {
				$('.actions .button').prop('disabled',false)
			}
		})
	}

	function stepsCorrect(qty_elem) {
		var qty = qty_elem.val()
		var steps_correct = parseInt($(qty_elem).attr('step'))
		if(!steps_correct) steps_correct = basil_woo_steps
		var d_int = parseInt(qty/steps_correct)
		var change_data_to = $(this).closest('.product').find('.add_to_cart_button')
		console.log(d_int)
		var corrected = steps_correct * d_int
		$(qty_elem).val(corrected)
		$(change_data_to).attr('data-quantity', corrected)
	}

	function stepsAlert(qty_elem) {
		var qty = qty_elem.val()
		steps = qty_elem.attr('step')
		if(!steps) steps = basil_woo_steps
		if(qty % steps !== 0) {
			$.modal({
				'title' : '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i><br/>Ooops',
				'message' : 'Puoi acquistare prodotti solo per multipli di '+steps+'.',
				'buttons' : {
					'Ok' : {
						'class' : 'green',
						'action': function(){
							stepsCorrect(qty_elem)
						}
					}
				}
			})
		}
	}

	if(is_cart) {
		$(document).ajaxComplete(function( event, xhr, settings ) {
			console.log(settings)

				wooSetQty()

		})
	}

	$('.basil-woo-quantity').each(function(){
		current_qty = $(this).val()
		if(current_qty) {
			var min = parseInt($(this).attr('step'))
			if(current_qty < min) current_qty = min
			change_data_to = $(this).closest('.product').find('.add_to_cart_button')
			$(change_data_to).attr('data-quantity', current_qty)
			$(this).val(current_qty)
		}
		stepsCorrect($(this))
		$(this).change(function(){
			qty_elem = $(this)
			stepsAlert(qty_elem)
		})
	})



	$('.basil-woo-decrement').click(function(){
		change_qty_to = $(this).closest('.product').find('.basil-woo-quantity')
		change_data_to = $(this).closest('.product').find('.add_to_cart_button')
		current_qty = $(change_qty_to).val()

		if(current_qty > 0) {
			steps = parseInt($(this).closest('.basil-quantity-wrap').find('.basil-woo-quantity').attr('step'))
			if(!steps) steps = basil_woo_steps
			new_qty = parseFloat(current_qty) - steps
			$(change_qty_to).val(new_qty).change()
			$(change_data_to).attr('data-quantity', new_qty)
		}
	})

	$('.basil-woo-increment').click(function(){
		change_qty_to = $(this).closest('.product').find('.basil-woo-quantity')
		change_data_to = $(this).closest('.product').find('.add_to_cart_button')
		current_qty = $(change_qty_to).val()

		steps = parseInt($(this).closest('.basil-quantity-wrap').find('.basil-woo-quantity').attr('step'))
		if(!steps) steps = basil_woo_steps
		new_qty = parseFloat(current_qty) + steps
		$(change_qty_to).val(new_qty).change()
		$(change_data_to).attr('data-quantity', new_qty)
	})

	$('.basil-woo-quantity').on('change', function(){
		new_qty = $(this).val()
		change_data_to = $(this).closest('.product').find('.add_to_cart_button')
		$(change_data_to).attr('data-quantity', new_qty)
	})

	wooSetQty()

}

function whatsapp_link() {
  if(!$('a[href*="api.whatsapp.com"]').length) return
	$('a[href*="api.whatsapp.com"]').click(function(e){
		if(viewport.w > 768) {
			e.preventDefault()
			var body_message = 'Ciao, ti contatto dal tuo sito web per '
			var email = $('a[href*="mailto:"]').attr('href')
			var subject = 'Contatto via WhatsApp'
    		var mailto_link = email + '?subject=' + subject + '&body=' + body_message

			win = window.open(mailto_link, 'emailWindow')
    		if (win && win.open && !win.closed) win.close()
		}
	})
}

function tab_user(e) {
	// thanks to
	// https://hackernoon.com/removing-that-ugly-focus-ring-and-keeping-it-too-6c8727fefcd2
    if (e.keyCode === 9) { // the "I am a keyboard user" key
        document.body.classList.add('tab-active')
        window.removeEventListener('keydown', tab_user)
    }
}

function enable_localscroll() {

  var ls_offset = ($('.localscroll.no-offset').length) ? 0 : -Math.ceil($('.header-nav-wrap').outerHeight())

  console.log(ls_offset)

  $('.localscroll').localScroll({
    onBefore: function() {
      this.offset = {
        top: ls_offset,
      }
    }
  })

}

$(document).ready(function() {

	ui_timer()

	window.addEventListener('keydown', tab_user)

	hide_site_header()
	scroll_check({top_offset: 125})
	elem_fullheight()
	whatsapp_link()
	max_width()
  $('.longer').longer_box();
	popup_system('.popup')
	ready_popup()
	basil_modal()
	// sauce_commerce()
	no_footer_margin()
  enable_localscroll()

  if($('select').length) {
    $('select').each(function() {
      if($(this).hasClass('hide-search')) {
        $(this).select2({
          minimumResultsForSearch: Infinity
        })
      } else {
        $(this).select2()
      }
    })
    $('select').on('change', function(){
      setTimeout(function() {
        $('select').each(function(){
          if(!$(this).hasClass('select2-hidden-accessible')) {
            if($(this).hasClass('hide-search')) {
              $(this).select2({
                minimumResultsForSearch: Infinity
              })
            } else {
              $(this).select2()
            }
          }
        })
      }, 100)
    })
  }

})
