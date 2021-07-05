jQuery(function($){
	var dlg = $.dialog('update_card'), $form = dlg.$obj;

	if (!window.gettext) window.gettext = function(msg){ if(window.catalog && catalog[msg]) return catalog[msg]; return msg };

	$form
		.on('open', function(){
			$form
				.find('.error').hide().end()
				.find('input:text').val('').end()
				.find('select').prop('selectedIndex', 0).end()
				.find('select.select-country').val('USA').end()
				.find('button:submit').prop('disalbed', false);
		})
		.submit(function(event){
			event.preventDefault();

			var params = getParam(this), result = balanced.card.validate(params), $error = $form.find('div.error'), errors = [], useGoogleWallet = !!$('.btn-wallet').length;

			params.street_address = $.trim(params.street_address + ' ' + (params.street_address2||''));

			// check required fields
			var missed = 0;
			$.each('name,card_number,security_code,street_address,city,postal_code'.split(','), function(idx,key){
				var v = params[key];
				if(typeof v=='undefined' || $.trim(v+'').length == 0) missed++;
			});
			if (missed > 1) {
				errors.push(gettext('Please fill out all information.'));
			} else {
				if (!params.name) errors.push(gettext('Please enter the full name.'));
				if (!params.street_address) errors.push(gettext('Please enter a valid address.'));
				if (!params.city) errors.push(gettext('Please enter the city.'));
				if (!params.postal_code) errors.push(gettext('Please enter the zip code.'));
			}
			if ('card_number' in result) errors.push(gettext('Please enter a valid card number.'));
			if ('security_code' in result) errors.push(gettext('Please enter a valid security code.'));
			if ('expiration' in result) errors.push(gettext('Please enter a valid expiration date.'));

			if (errors.length) {
				$error.show().find('>ul').html('<li>'+errors.join('</li><li>')+'</li>');
				return;
			}

			$error.hide();
			$form.find('button:submit').prop('disabled', true);

			balanced.card.create(params, function(response){
				var brand = (balanced.card.cardType(params.card_number)||'').toLowerCase(), lastDigit = /\d{4}$/.exec(params.card_number), $added;

				if (lastDigit) lastDigit = lastDigit[0];

				$form.find('button:submit').prop('disabled', false);

				switch(response.status) {
					case 201:
						$added = $('.pay-type').find('.new-method').addClass('hidden').end().find('>.selected').removeClass('hidden');
						$added.find('.name_').text( $added.find('.name_').text().replace(/$/, response.data.name||params.name) );
						$added
							.find('input[type="hidden"]').remove().end()
							.find('i.icon').attr('class', 'icon '+brand).end()
							.find('.name_').text(response.data.name || params.name).end()
							.find('.digits_').text(response.data.last_four || lastDigit).end();

						$.each('brand,name,expiration_year,expiration_month,uri,last_four'.split(','), function(idx,name){
							var value = response.data[name];
							if (value) {
								if (name == 'brand') name = 'card_type';
								$('<input type="hidden" />').attr('name', name).val(value).appendTo($added);
							}
						});

						dlg.close();
						break;
					case 400:
					case 403: // missing/malformed data - check response.error for details
					case 402: // we couldn't authorize the buyer's credit card - check response.error for details
					case 404: // your marketplace URI is incorrect
					default:
						// we did something unexpected - check response.error for details
						if ('description' in response.error) {
							$error.show().find('>ul').html('<li>'+response.error.description+'</li>');
						}
				}
			});
		})
		.find('i.ic-q')
			.mouseover(function(){ $(this).next().show() })
			.mouseout(function(){ $(this).next().hide() })
		.end()
		.find('.payment-save-check #same-address')
			.click(function(){
				if(this.checked){
					var $elems = $form.find("[name^=ship-]");
					$elems.each(function(){
						var name = $(this).attr("name").replace("ship-","");
						$form.find("[name="+name+"]").val($(this).val());
					})
				}
			})
		.end();

	function getParam(form) {
		var arrParam = $(form).serializeArray(), params = {}, i, c;

		for (i=0,c=arrParam.length; i < c; i++) {
			params[arrParam[i].name] = arrParam[i].value;
		}

		return params;
	};
});
