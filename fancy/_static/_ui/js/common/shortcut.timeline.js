// shortcuts - only for timeline
jQuery(function($){
	var $win = $(window),
		$body = $('body'),
		$stream = $('.stream'),
		$slidebox = $('#slideshow-box'),
		hh = $('header').eq(0).height(),
		$focused;

	if(!$stream.length) return;

	$stream.delegate('a[rel]', {
		setFocus : function(){
			var $this = $focused = $(this), ot = $this.offset().top, new_st;

			new_st = ot - hh - 20;

			$body.stop().animate({scrollTop : new_st}, function(){
				$this.get(0).focus();
				$focused = $this;
			});

			$('a[rel].focus').removeClass('focus');
			$this.addClass('focus');
		},
		blur  : function(){
			$(this).removeClass('focus');
			$focused = null;
		}
	});

	$.hotkey({
		'J' : function(e){
			var s = state();
			if(s & SKIP) return;
			if(s & GOT_FOCUS) {
				var $fp = $focused.parent(), $el;

				($el=$fp.prev('.figure-product')).length ||
				($el=$fp.closest('.figure-row').prev('.figure-row')).length ||
				($el=$fp.closest('li').prev('li')).length;

				$el.find('a[rel]:last').trigger('setFocus');
			} else {
				var $rows = $stream.find('.figure-row'), st = $win.scrollTop();
				$rows.each(function(i,v,a){
					var $this = $(this);
					if($this.offset().top - hh - st > 20) {
						if(i > 0) {
							$rows.eq(i-1).find('a[rel]:first').trigger('setFocus');
						} else {
							$this.find('a[rel]:first').trigger('setFocus');
						}
						return false;
					}
				});
			}
		},
		'K' : function(e){
			var s = state();
			if(s & SKIP) return;
			if(s & GOT_FOCUS) {
				var $fp = $focused.parent(), $el;

				($el=$fp.next('.figure-product')).length ||
				($el=$fp.closest('.figure-row').next('.figure-row')).length ||
				($el=$fp.closest('li').next('li')).length;

				$el.find('a[rel]:first').trigger('setFocus');
			} else {
				var st = $win.scrollTop();
				$stream.find('.figure-row').each(function(){
					var $this = $(this);
					if($this.offset().top - hh - st > 20) {
						$this.find('a[rel]:first').trigger('setFocus');
						return false;
					}
				});
			}
		},
		'F' : function(e){
			if(state() & GOT_FOCUS){
				$focused.nextAll('.button.fancy, .button.fancyd').click();
			}
		},
		'A' : function(e){
			if(state() & GOT_FOCUS){
				$focused.nextAll('.button.fancy, .button.fancyd').attr('show_add_to_list', 'true').click();
			}
		},
		'H' : function(e){
			if(state() & GOT_FOCUS) $focused.find('button.btn-share').click();
		},
		'ENTER' : function(e){
			if(state() & GOT_FOCUS) $focused.click();
		}
	});

	var SKIP = 1, GOT_FOCUS = 2;
	function state(){
		if($slidebox.is(':visible')) return SKIP;
		if($focused && $focused.is('.figure-product > a[rel].focus')) return GOT_FOCUS;

		$focused = $(':focus');
		if($focused.is('textarea,input:text,input:password')) return SKIP;

		return 0;
	}
});