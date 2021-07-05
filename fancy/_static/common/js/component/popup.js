;(function($){
	var $doc = $(document), $container, $latest = null, container_h;

	$doc.on('click', 'a[data-component="popup"],button[data-component="popup"]', function(event){
		var $this = $(this), $popup = null;

		event.preventDefault();

		try { $popup = $($this.attr('href') || $this.attr('data-href')) }catch(e){};
		if (!$popup || !$popup.length) return;
		if ($container) $container.trigger('open.popup', [$popup]);
	});

	$(function(){
		$container = $('#popup_container');
		$container
			.on('open.popup', function(event, $popup){
				if (event.namespace != 'popup') return;

				var replace = $latest && $latest.length && $latest.is(':visible');

				closePopup($latest, true);
				openPopup($popup, replace);
			})
			.click(function(event){
				if (event.target !== this && !$(event.target).closest('.popup_close').length) return;
				event.preventDefault();
				closePopup($latest);
			})
			.on('transitionend webkitTransitionEnd oTransitionEnd', function(event){
				if ($container.css('opacity') == 0) {
					$container.hide();
				} else {
					$container.show();
				}
			});
	});

	function openPopup($popup, replace) {
		var name = $popup.attr('id');

		$container.addClass(name);
		$latest = $popup;

		$('html').addClass('fixed');
		if (!replace) $container.show();
		if(!container_h) container_h = Math.min($container.height(), $(window).innerHeight());
		center($popup);

		$popup.off('center').on('center', function(event){
			center($popup);
		});

		setTimeout(function(){
			if (!replace) $container.css('opacity', 1);
			$popup.trigger('open');
		}, 1);
	}

	function closePopup($popup, replace) {
		if (!$popup || !$popup.length) return;

		$('html').removeClass('fixed');
		var name = $popup.attr('id');
		$popup.trigger('close');
		$container.removeClass(name);

		if (!replace) $container.css('opacity', 0);
		if (!window.Modernizr || !Modernizr.csstransitions) $container.trigger('transitionend');
	}

	function center($popup){
		var mt = Math.max(Math.floor((container_h-$popup.outerHeight())/2)+(+$popup.attr('data-offset')||0)-20,5);
		if($popup.attr('data-margin-top')) mt = $popup.attr('data-margin-top');
		
		$popup.css('margin-top', mt+'px');
	}
})(jQuery);
