function success_callback(response, $form) {
	if (typeof response.status_code == 'undefined') return;
	if (response.status_code == 1) {
        if ($form.hasClass('settings-page')||$form.hasClass('merchant-page')){
            location.reload(false);
        }
        else{
			if (response.card_id){
				var $added = $('.pay-type').find('.new-method').addClass('hidden').end().find('>.selected').removeClass('hidden');
                if($('.pay-type').find('input#payment-card-last-digits') == undefined ||
                   $('.pay-type').find('input#payment-card-last-digits') == null ||
                   $('.pay-type').find('input#payment-card-last-digits').length == 0){

					$('<input type="hidden" />').attr('name','card_last_digits').attr('id','payment-card-last-digits').appendTo($added);
					$('<input type="hidden" />').attr('name','card_expiration').attr('id','payment-card-expiration').appendTo($added);
					$('<input type="hidden" />').attr('name','card_type').attr('id','payment-card-type').appendTo($added);
                }
                var cid= response.card_id;
				var ld = response.card_last_digits;
				var ce = response.card_expiration;
				var ct = response.card_type;
			    $('.pay-type')
				    .find('i.icon').attr('class', 'icon '+ct.toLowerCase()).end()
					.find('.name_').text(ct).end()
					.find('.digits_').text('Ending with xxxx-'+ld).end();
				var new_op = $('<option value="'+cid+'" data-ld="'+ld+'" data-ce="'+ce+'"  data-ct="'+ct+'">'+ct+' xxx-'+ld+'</option>');
				var $select = $('select#select-payment-card');
				$select.append(new_op);
				$select.val(cid);
				$select.change();
            }
        }
	} else if (response.status_code == 0) {
		alertify.alert(response.message || "We couldn't add your card. Please try again later.");
	}
}
window.card_dialog_callbacks = {
	'start' : function(dlg) {
	},
	'error' : function(dlg) {
	},
	'success' : function(data, dlg) {
		var $form = dlg.$obj;
		success_callback(data, $form);
		dlg.close();
	},
	'complete' : function(dlg) {
		var $form = dlg.$obj;
		$form.find('button.btn-save').prop('disabled', false);
	}
}

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
				.find('button:submit').prop('disabled', false).end();
		})
		.on('keypress', 'input', function(e){
			if( e.keyCode==13) e.preventDefault();
		})
        .on('change','select.select-country', function(e) {
		    if($(this).val()=='US' || $(this).val()=='USA'){
                $form.find("input[name=state]").hide();
                $form.find("select[name=state]").show();
            } else {
                $form.find("select[name=state]").hide();
                $form.find("input[name=state]").show();
            }

        })
		//.submit(function(event){
        .on('click','.btn-save', function(event) {
			event.preventDefault();
			card_dialog_callbacks.start(dlg);
			var params = getParam($form);
            var $error = $form.find('div.error');
            var errors = [];
            var additional='';
            if( $form.find('.btn-save').attr('data-additional') != undefined && 
                $form.find('.btn-save').attr('data-additional') != null &&
                $form.find('.btn-save').attr('data-additional').length >0){
                additional = $form.find('.btn-save').attr('data-additional');
            }
            params.country_code = $form.find('select[name=country_code]').find('option:selected').attr('data-code2');
            params.state = $form.find("[name=state]:visible").val();

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
			if (!Stripe.card.validateCardNumber(params.card_number)) errors.push(gettext('Please enter a valid card number.'));
			if (!Stripe.card.validateCVC(params.security_code)) errors.push(gettext('Please enter a valid security code.'));
			if (!Stripe.card.validateExpiry(params.expiration_month, params.expiration_year)) errors.push(gettext('Please enter a valid expiration date.'));

            if ($form.hasClass('amex-only')) {
                if (Stripe.card.cardType(params.card_number) != "American Express") 
                    errors.push('Your coupon is valid for American Express cards only.');
            }

			if (errors.length) {
				$error.show().find('>ul').html('<li>'+errors.join('</li><li>')+'</li>');
				card_dialog_callbacks.error(dlg);
				return;
			}

			$error.hide();
			$form.find('button:submit').prop('disabled', true);


            function submit(recaptcha_token) {
                Stripe.card.createToken({
                    number: params.card_number,
                    exp_month: params.expiration_month,
                    exp_year: params.expiration_year,
                    cvc: params.security_code,
                    name: params.name,
                    address_line1: params.street_address,
                    address_line2: params.street_address2,
                    address_city: params.city,
                    address_state: params.state,
                    address_zip: params.postal_code,
                    address_country: params.country_code
                }, function (status, response) {
                    //console.log([status, response]);
                    $form.find('button.btn-save').prop('disabled', false);
                    if (response.error) {
                        // we did something unexpected - check response.error for details
                        if ('message' in response.error) {
                            $error.show().find('>ul').html($('<li>').text(response.error.message));
                        }
                        card_dialog_callbacks.error(dlg);
                    } else {
                        // successful.
                        $form.find('button.btn-save').prop('disabled', true);
                        var endpoint, payload, forMerchant = false;
                        if ($form.hasClass('merchant-page')) {
                            forMerchant = true;
                            endpoint = '/merchant/settings/add-credit-card.json';
                            payload = { 'stripe_token': response['id'] };
                        } else {
                            endpoint = '/settings/cards/stripe/add-card.json';
                            payload = { 'card_token': response['id'], 
                                'address1': params.street_address, 'address2': params.street_address2,
                                'city': params.city, 'state': params.state, 'country': params.country_code,
                                'postal_code': params.postal_code, 'set_default': params.set_default };
                            if (recaptcha_token) payload['recaptcha_token'] = recaptcha_token;
                        } 
                        $.ajax({
                            type: 'post', url: endpoint + additional, data: payload,
                            success : function(response) {
                                if (window.dataLayer && !forMerchant) {
                                    dataLayer.push({'event': 'Save_Payment', 'product_id': undefined, 'products': undefined, 'products_info': undefined, 'revenue': undefined, 'option_id': undefined });
                                }
                                return card_dialog_callbacks.success(response, dlg);
                            },
                            complete : function() {
                                return card_dialog_callbacks.complete(dlg);
                            },
                            error : function(res) {
                                var message = "We couldn't add your card. Please try again later.";
                                if (res.responseText) {
                                    try {
                                        var json = JSON.parse(res.responseText)
                                        if (json.message) message = json.message;
                                    } catch(e) {}
                                }
                                alertify.alert(message);
                                card_dialog_callbacks.error(dlg);
                            }
                        });
                    }
                });
            }
            if (window.execute_recaptcha) {
                window.execute_recaptcha(function(success, token) {
                    if (success) {
                        if (window.clear_recaptcha) clear_recaptcha();
                        submit(token);
                    }
                    else {
                        error('Please complete RECAPTCHA to continue')
                    }
                });
            } else {
                submit();
            }

            
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
			params[arrParam[i].name] = $.trim(arrParam[i].value);
		}

		return params;
	};
});
