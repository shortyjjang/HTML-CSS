function success_callback(response, $form) {
    if (typeof response.status_code == 'undefined') return;
    if (response.status_code == 1) {
        if (response.card_id){
            var cid= response.card_id;
            var ld = response.card_last_digits;
            var ce = response.card_expiration;
            var ct = response.card_type;
            var holder = response.card_holder_name;

            var $el = $('<li><input type="radio" name="reward-payment" value="'+cid+'"><span class="card '+ct.toLowerCase()+'"> '+ct+' ending '+ld+'</span><small class="name">'+holder+'</small></li>');
            $form.find("ul").append($el);
            $el.find("input:radio").trigger('click');
        }
    } else if (response.status_code == 0) {
        if(response.message) alertify.alert(response.message);
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
    },
    'complete' : function(dlg) {
        dlg.$obj.find('.payment').show().end().find('.create').hide();
    }
}

jQuery(function($){
    var dlg = $.dialog('join-reward'), $form = dlg.$obj;

    if (!window.gettext) window.gettext = function(msg){ if(window.catalog && catalog[msg]) return catalog[msg]; return msg };

    $form
        .on('open', function(){
            $form.find("ul li:eq(0) input:radio").trigger("click");
        })
        .on('click', 'ul li input:radio', function(){
            $(this).closest('ul').find('li').removeClass('selected').end().end().closest('li').addClass('selected');
        })
        .on('click', '.btn-new', function(e){
            $form.find('.payment').hide().end().find('.create').show();
            $form
                .find('.error').hide().end()
                .find('input:text').val('').end()
                .find('select').prop('selectedIndex', 0).end()
                .find('select.select-country').val('USA').end()
                .find('button:submit').prop('disabled', false).end();
        })
        .on('click', '.back', function(e){
            $form.find('.payment').show().end().find('.create').hide();
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
        .on('click', '.btn-join', function(e){
            var card_id = $form.find("ul li.selected input:radio").val();
            var params = {card_id:card_id};

            $.ajax({
                type: 'post', url: '/vip/join_subscription.json', data: params,
                success : function(response) {
                    dlg.close();
                },
                complete : function() {
                    
                }
            });
        })
        .submit(function(event){
            event.preventDefault();
            card_dialog_callbacks.start(dlg);
            var params = getParam(this);
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
                $form.find('button:submit').prop('disabled', false);
                if (response.error) {
                    // we did something unexpected - check response.error for details
                    if ('message' in response.error) {
                        $error.show().find('>ul').html($('<li>').text(response.error.message));
                    }
                    card_dialog_callbacks.error(dlg);
                } else {
                    // successful.
                    $form.find('button:submit').prop('disabled', true);
                    var endpoint, payload, forMerchant = false;
                    endpoint = '/settings/cards/stripe/add-card.json';
                    payload = { 'card_token': response['id'], 
                        'address1': params.street_address, 'address2': params.street_address2,
                        'city': params.city, 'state': params.state, 'country': params.country_code,
                        'postal_code': params.postal_code, 'set_default': params.set_default };
                
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
                        }
                    });
                }
            });
        })

    function getParam(form) {
        var arrParam = $(form).serializeArray(), params = {}, i, c;

        for (i=0,c=arrParam.length; i < c; i++) {
            params[arrParam[i].name] = $.trim(arrParam[i].value);
        }

        return params;
    };
});
