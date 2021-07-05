// selectBox
jQuery(function($){
	// with checkboxes
	var $openedPopup = null;

	$(document)
		.on('click', 'a.selectBox.checkboxes_', function(event){
			event.preventDefault();
			var $this = $(this), $popup = $($this.attr('href')), defaultText = $this.text();
			$popup.addClass('selectbox_popup_').toggle();

			if (!$popup.data('event-attached')) {
				$popup.on('click', 'input[type="checkbox"]', function(event){
					var checked = [];
					$(this).closest('.selectbox_popup_').find('input[type="checkbox"]:checked').each(function(){
						checked.push($popup.find('label[for="'+this.id+'"]').text());
					});

					$this.find('.selectBox-label').text( checked.length ? checked.join(', ') : defaultText );
				});
				$popup.data('event-attached', true);
			}

			if ($openedPopup && $openedPopup.length) {
				$openedPopup.hide();
				$openedPopup = null;
			}

			if ($popup.is(':visible')) {
				$openedPopup = $popup;
			}
		})
		.mousedown(function(event){
			var $target = $(event.target);
			if ($openedPopup && $openedPopup.length && $target.closest('.selectBox.checkboxes_, .selectbox_popup_').length === 0) {
				$openedPopup.hide();
				$openedPopup = null;
			}
		});
});