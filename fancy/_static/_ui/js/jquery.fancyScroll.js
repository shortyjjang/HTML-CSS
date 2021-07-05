/**
 * Fancy Scrollbar component for jQuery
 *
 * Usage
 *  $(element).fancyScroll();
 *    - create fancy scroll bar
 *  $(element).fancyScroll('reset');
 *    - reset the scroll position. equivalent to $(element).fancyScroll('scrollTop', 0);
 *  $(element).fancyScroll('scrollTop', scrollPosition);
 *    - set the scroll position with scrollPosition. scrollPosition should be a number.
 **/
(function($){
	var prefix='fancyScroll-', UNIT=100, $win=$(window), style={invisible:'fancy-scroll-transparent'}, needThis = null;
	var defaults = {
		panel : '>:first-child'
	};

	$.extend($.easing, {
		easeOutCirc : function (x,t,b,c,d){ return c * Math.sqrt(1 - (t=t/d-1)*t) +b; }
	});

	$.fn.fancyScroll = function(opts){
		var _this=this, canCss3=supportsTransitions(), $thumb=this.data(prefix+'thumb'), $panel, _timer=null, _start=null, _h_timer=null, _tw, _sh, _wh, _r, _max, arg;

		if(needThis === null){
			var $tmp = $('<div style="width:100px;height:100px;overflow:scroll;position:absolute;top:-9999px;padding:0;border:0" />').appendTo('body');
			needThis = $tmp[0].offsetWidth > $tmp[0].clientWidth;
			$tmp.remove();

			// don't use this script for osx lion
			if (!needThis) {
				$(document).on('mousewheel', function(event){
					var deltaY = event.originalEvent.deltaY, scTop, winH, docH;

					if (!deltaY) return;

					scTop = $win.scrollTop();

					if (deltaY < 0) {
						if (scTop == 0) event.preventDefault();
					} else if (deltaY > 0) {
						winH = $win.height();
						docH = $(document).height();

						if (winH > docH || winH + scTop >= docH) event.preventDefault();
					}

				});
				return true;
			}
		}

		if(typeof opts == 'string'){
			arg = arguments[1];
			$panel = this.data(prefix+'panel');

			switch(opts){
				case 'reset':
					this.fancyScroll.call(this, 'scrollTop', 0, arg);
					break;
				case 'scrollTop':
					if(typeof arg != 'undefined'){
						arg = Math.max(arg, 0);
						if(arguments[2] === true){
							$panel ? $panel.animate({marginTop:-arg},200) : this.animate({scrollTop:arg},200);
						} else {
							$panel ? $panel.css('margin-top', -arg) : this.scrollTop(arg);
						}
					} else {
						return $panel ? -parseInt($panel.css('margin-top')) : this.scrollTop();
					}
					break;
			}
			return;
		}

		// already executed?
		if($thumb) return this;

		opts = $.extend({}, defaults, opts);

		$panel = this.find(opts.panel);
		if(!$panel || $panel.length) this.data(prefix+'panel', $panel);

		$thumb = $('<div class="fancy-scroll-thumb" />').appendTo(this);
		hideThumb(4000);

		function update(){
			clearTimeout(_timer);
			_timer = setTimeout(arguments.callee, 100);

			_sh  = $panel.outerHeight();
			_wh  = $win.height();
			_r   = _wh/Math.max(_sh, 1);
			_max = _wh - _sh;

			if(_max >= 0) {
				$thumb.addClass(style.invisible);
			} else {
				var t = parseInt($panel.css('margin-top')), _t = Math.min(0, Math.max(t, _max));
				if(t != _t){
					$panel.stop().css({'margin-top': _t+'px'});
					$thumb.stop().css({'top': Math.max(Math.floor(-_t*_r),0)+'px'});
				}
			}

			// resize scroll thumb
			if(_r >= 1 || $thumb.hasClass(style.invisible)) return;
			$thumb.css({height:Math.floor(_wh*_r)});
		};

		function hideThumb(delay){
			clearTimeout(_h_timer);
			_h_timer = setTimeout(function(){ $thumb.addClass(style.invisible) }, delay||0);
		};

		$win.resize(function(){
			update();
		});
		$win.resize();

		$panel
			.on('mouseenter', function(event){
				$thumb.removeClass(style.invisible);
				hideThumb(2000);
			})
			.on('mouseleave', function(event){
				hideThumb(500);
			});

		this
			.css('overflow','hidden')
			.on('scrollBy', function(event, delta, speed, hidden){
				if(!event || !delta) return;

				speed  = speed || 200;
				hidden = !!hidden;

				update();
				if(typeof _tw != 'number') _tw = $panel[0].offsetTop;
				_tw = Math.min(0, Math.max(_tw + UNIT*delta, _max));

				$thumb.stop().animate({top:Math.max(Math.floor(-_tw*_r),0)+'px'}, speed);
				$panel.stop().animate({marginTop:_tw}, speed, function(){ _tw=null });

				if(!hidden) {
					$thumb.removeClass(style.invisible);
					hideThumb(1500);
				}
			})
			.on('keyup', function(event){
				if(!event || (event.which != 38/*UP*/ && event.which != 40/*DOWN*/) || $(event.target).is('input,textarea')) return;

				var delta = (event.which == 38)?1:-1;
				_this.trigger('scrollBy', [delta]);
			})
			.on('wheel mousewheel DOMMouseScroll MozMousePixelScroll', function(event){
				var evt=event.originalEvent, delta=0, sh=$panel.height(), wh=$win.height(), r, tw, max, diff, accel=1, speed=50;

				event.preventDefault();
				event.stopPropagation();

				delta = evt.deltaY || evt.wheelDelta || evt.detail || 0;
				if(!delta) return;

				delta = delta / Math.abs(delta);
				if(evt.deltaY || evt.detail) delta = -delta;

				r = wh/Math.max(sh,1);
				if(r >= 1) return;

				if($thumb.hasClass(style.invisible)) {
					$thumb.removeClass(style.invisible);
				}

				if(_start) {
					diff = +new Date - _start;
					if(diff > 100) {
						_start = null;
					} else {
						accel = 100/diff;
					}
				} else {
					_start = +new Date();
				}

				_this.trigger('scrollBy', [delta*accel, speed*accel]);
			});

		return this;
	};

	function supportsTransitions(){
		var s = document.createElement('p').style, v = 'Moz Webkit Khtml O ms', i, c;
		v = v.replace(/ |$/g, 'Transition ')+'transition'.split(' ');
		for(i=0,c=v.length; i < c; i++){
			if(typeof s[v[i]] == 'string') return true;
		}
		return false;
	}
})(jQuery);
