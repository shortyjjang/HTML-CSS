jQuery(function($){
	var $doc = $(document), $ov_charge = $('#ov-charge');

	// initialize #ov-charge
	(function(){
		var w = $ov_charge.show().find('dd.detail').width();
		var i, n, s='';

		$ov_charge.hide();

		n = $ov_charge.find('.slide > ul').width(w).length;
		$ov_charge.find('.slide').width(w*n);

		for(i=0;i<n;i++) s += '<span>'+(i+1)+'</span>';
		$ov_charge.find('.paging').html(s).find('>span:first').addClass('current');

		// swipe
		var start_x = 0;
		$ov_charge.find('.slide')
			.on({
				touchstart : function(event){
					event.preventDefault();

					var ml = $(this).css('margin-left');
					start_x = event.originalEvent.touches[0].pageX;
				},
				touchend : function(event){
					event.preventDefault();

					var current_x = event.originalEvent.touches[0].pageX, $span, direction, idx;

					if(!start_x || Math.abs(start_x - current_x) < 20) return;

					start_x = 0;
					direction = (start_x - current_x < 0)?-1:1;

					$span = $ov_charge.find('.paging > span');
					if($span.index($span.filter('.current')) < 0) $span.eq(0).addClass('current');

					idx = $span.index($span.filter('.current')) + direction;
					if(idx < 0 || idx > $span.length-1) return;

					$span.removeClass('current').eq(idx).addClass('current');
					$(this).animate({marginLeft : -idx*w},'fast');
				}
			});

		$ov_charge.on('show', function(){
			$ov_charge
				.find('.slide').css('margin-left', 0).end()
				.find('.paging > span').removeClass('current').eq(0).addClass('current').end().end();
		});
	})();

	$('a.show-popup').click(function(){
		var $this = $(this), $popup = $($this.attr('href')).show().trigger('show');
		$popup.find('dl').css('margin-top', $doc.scrollTop()+20+'px');

		return false;
	});
	$('div.popup')
		.on('click', function(event){ if(event.target === this){ $(this).hide(); return false } })
		.find('a.close').click(function(){ $(this).closest('div.popup').hide() }).end();

	$('#bookinfo').submit(function(){
		var $form = $(this), $submit, elems = this.elements, el, i, c, n;

		var errorMsg = {
			'room1FirstName'    : gettext('Please enter first name.'),
			'room1LastName'     : gettext('Please enter last name.'),
			'email'             : gettext('Please enter email address.'),
			'homePhone'         : gettext('Please enter phone number.'),
			'countryCode'       : gettext('Please select billing country.'),
			'address1'          : gettext('Please enter address.'),
			'city'              : gettext('Please enter city.'),
			'stateProvinceCode' : gettext('Please enter state.'),
			'postalCode'        : gettext('Please enter zip code.'),
			'firstName'         : gettext('Please enter first name on card.'),
			'lastName'          : gettext('Please enter last name on card.'),
			'creditCardType'    : gettext('Please select card type.'),
			'creditCardNumber'  : gettext('Please enter card number.'),
			'creditCardExpirationYear'  : gettext('Please select expiration date.'),
			'creditCardExpirationMonth' : gettext('Please select expiration date.'),
			'creditCardIdentifier' : gettext('Please enter security code.'),
			'terms' : gettext('Please check if you agree to the Cancellation Policy.')
		};

		$submit = $form.find('button:submit').prop('disabled',true);

		for(i=0,c=elems.length; i < c; i++){
			el = elems[i];
			n  = el.name;
			if(!n) continue;
			if((!el.value || (el.type == 'checkbox' && !el.checked)) && errorMsg[n]) {
				alert(errorMsg[n]);
				el.scrollIntoView(true);
				el.focus();
				$submit.prop('disabled',false);
				return false;
			}
		}
	});
});
