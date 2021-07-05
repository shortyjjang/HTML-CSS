(function($){
	var MOMENTUM_CONST = 25;
	var eventType = 'wheel mousewheel DOMMouseScroll MozMousePixelScroll fakedMouseWheel';
	var defaults = {
		bound: null,
		loop: false,
		update : $.noop,
		friction: .86,
		maxOffset: 40
	};

	/**
	 * @see http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
	 */
	var requestAnimFrame = (function(){
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	$.fn.emulateScroll = function(options){
		options = $.extend({}, defaults, options);
		options.friction = Math.min(options.friction, .99);

		var self = this, scrollCurrentY = 0, prev = 0, scrollTimer = null, emulMomentum = false, fn;
		self.on(eventType, function(event){
			event.preventDefault();
			var delta = getDelta(event.originalEvent), now = new Date(), timeOffset = now - prev, unit = Math.ceil(delta*1000/timeOffset), _delta = delta;

			clearTimeout(scrollTimer);
			if (event.type !== 'fakedMouseWheel') {
				emulMomentum = false;
			}

			// limit maximum scroll amount
			if (Math.abs(unit) > options.maxOffset) {
				_delta = timeOffset * options.maxOffset/10 * (delta < 0 ? -1:1);
				if (Math.abs(_delta) > Math.abs(delta)) _delta = delta;
			}

			prev = now;

			scrollTimer = setTimeout(function(){
				if (navigator.platform && navigator.platform.indexOf('Win') >= 0) {
					// emulate momentum
					emulMomentum = true;
					emulateMomentum(_delta * MOMENTUM_CONST/timeOffset);
				} else {
					prev = 0;
				}

			}, 50);

			scrollCurrentY -= _delta;

			var bound = options.bound;
			if (bound) {
				if (scrollCurrentY < bound[0]) {
					scrollCurrentY = options.loop ? bound[1] - bound[0] + scrollCurrentY : bound[0];
				} else if (scrollCurrentY > bound[1]) {
					scrollCurrentY = options.loop ? bound[0] - bound[1] + scrollCurrentY : bound[1];
				}
			}
			options.update(0, scrollCurrentY);
		});

		// support mobile environment
		self.on('touchstart.emul', function(event){
			var $doc = $(document), touchStart = getTouch(event), touchPrev = touchStart, touchLast = null;

			clearTimeout(scrollTimer);
			emulMomentum = false;

			$doc.on({
				'touchmove.emul': function(event){
					event.preventDefault();

					var touch = getTouch(event);
					if (touch.id === touchStart.id) {
						triggerWheel(0, touch.y - touchPrev.y);
						touchLast = touchPrev = touch;
					}
				},
				'touchend.emul': function(event){
					if (getTouch(event).id === touchStart.id) {
						$doc.trigger('touchcancel.emul');
					}
				},
				'touchcancel.emul': function(event){
					$doc.off('.emul');
					if (!touchLast) return;
					var yOffset = touchLast.y - touchStart.y, timeOffset = touchLast.time - touchStart.time;

					emulMomentum = true;
					emulateMomentum(yOffset * MOMENTUM_CONST / timeOffset);
				}
			});
		});

		function triggerWheel(deltaX, deltaY) {
			var event = $.Event('fakedMouseWheel', {originalEvent:{deltaX: deltaX, deltaY: -deltaY}});
			self.trigger(event);
		}

		function emulateMomentum(momentum) {
			if (!emulMomentum) return;
			if (Math.abs(momentum) < .4) return;

			triggerWheel(0, momentum < 0 ? Math.floor(momentum) : Math.ceil(momentum));
			requestAnimFrame(function(){ emulateMomentum(momentum * options.friction ) });
		}

		return this;
	};

	function getDelta(event){
		if ('deltaY' in event) return -event.deltaY;
		if ('wheelDeltaY' in event) return event.wheelDeltaY;
		if ('detail' in event) return -event.detail;
		if ('wheelDelta' in event) return event.wheelDelta;
		return 0;
	}

	function getTouch(event){
		var touch = event.originalEvent.targetTouches[0] || event.originalEvent.changedTouches[0];
		return {
			id: touch.identifier,
			x: touch.clientX * 2,
			y: touch.clientY * 2,
			time: new Date().getTime()
		};
	}
})(window.jQuery);
