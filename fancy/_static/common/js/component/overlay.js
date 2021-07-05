/**
 * Make a link/button to open overlay which is auto closed
 * when another overlay is opened. Overlays will be opened
 * if you click the related link/button.
 *
 * Just add data-component="overlay" attribute to <a> or <button> elements
 * that you want to convert. The href attribute has to indicate the id of
 * target overlay like:
 * <a href="#target-overlay">Open the overlay</a>
 * <div id="target-overlay">Content here</div>
 *
 * Also, <button> elements need to include data-href="#overlay-id" attribute
 * to indicate target overlay.
 *
 * When overlay is opened 'ovopen' event is fired on the component.
 * On the contrary, there's 'ovclose' event on it when the overlay is closed.
 */
;(function($){
	var $doc = $(document), $prev = null;
	$doc.on('click', 'a[data-component="overlay"],button[data-component="overlay"]', function(event){
		var $btn = $(this), $overlay = null, class_;

		event.preventDefault();

		try { $overlay = $($btn.attr('href') || $btn.attr('data-href')) }catch(e){};
		if (!$overlay || !$overlay.length) return;

		class_ = $btn.attr('data-use-class');

		$overlay
			.off('overlay:open overlay:close')
			.on({
				'overlay:open' : function(){
					// hide previous opeend overlay
					if ($prev && $prev.length && !$prev.is($overlay)) $prev.trigger('overlay:close');

					(class_ ? $overlay.addClass(class_) : $overlay.css('display','block')/*show*/ ).trigger('open');
					$btn.trigger('open');

					$doc.on('mousedown.overlay', function(event){
						var $target = $(event.target);
						if (!$target.closest($btn).length && !$target.closest($overlay).length) {
							$overlay.trigger('overlay:close');
						}
					});

					$prev = $overlay;
				},
				'overlay:close' : function(){
					(class_ ? $overlay.removeClass(class_) : $overlay.css('display','')/*hide*/ ).trigger('close');
					$btn.trigger('close');
					$doc.off('mousedown.overlay');
					$prev = null;
				}
			});

		if ((!class_ && $overlay.is(':visible')) || (class_ && $overlay.hasClass(class_))) {
			$overlay.trigger('overlay:close');
		} else {
			$overlay.trigger('overlay:open');
		}
	});
})(jQuery);
