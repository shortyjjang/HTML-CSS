window.CardDialogOptions = {
        forMerchant: false,
        title: null,
        parameter: null,
        usesandbox: false,
        onSuccess: function(dlg, card) {
            location.reload(false);
        }
}

jQuery(function($){
    var stripe = Stripe(window.stripePublishableKey), elements = stripe.elements();

    var dlg = $.dialog('update_card'), $form = dlg.$obj, $button = $form.find(".btn-save"), $err = $form.find(".error-msg");

    if (!window.gettext) window.gettext = function(msg){ if(window.catalog && catalog[msg]) return catalog[msg]; return msg };

    var cardElement = elements.create('card', { hidePostalCode: true, iconStyle: 'solid' });
    cardElement.mount('#card-element');
    cardElement.on('change', function(event) {
        if(event.complete) {
            $button.prop('disabled', false);
        } else {
            $button.prop('disabled', true);
        }
        if (event.error) {
            $err.show().text(event.error.message);
        } else {
            $err.hide().text('');
        }
    });

    $form
        .on('open', function(){
            if (CardDialogOptions.title) {
                $form.find("p.ltit").text(CardDialogOptions.title);
            }
            $form
                .find('input:text').val('').eq(0).focus().end().end()
                .find('select').prop('selectedIndex', 0).end()
                .find('select.select-country').val('US').trigger('change').end()
                .find("select.shipping-address").trigger('change').end();
            $button.prop('disabled', true).end()
            $err.hide();
            cardElement.clear();
        })
        .on('keypress', 'input', function(e){
            if (e.keyCode==13) e.preventDefault();
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
        .on('change', 'select.shipping-address', function(){
            var $elems = $(this).closest('p').nextAll().find('input, select'), $selected = $(this).find("option:selected");
            $elems.each(function() {
                var $this = $(this), name = $this.attr("name"), val = $selected.data(name);
                if (name == 'country') {
                    $this.val(val || "US").trigger('change');
                } else {
                    $this.val(val);
                }
            });
        })
        .on('click','.btn-save', function(event) {
            var $btn = $(this);
            if ($btn.prop('disabled') || $btn.hasClass("loading")) return;
            event.preventDefault();

            $btn.addClass("loading");
            $form.attr('disable-close', 'true');

            function onComplete() {
                $btn.removeClass('loading');
                $form.attr('disable-close', null); 
            }

            var params = getParam($form);
            var errors = [];
            params.state = $form.find("[name=state]:visible").val();

            // check required fields
            var missed = 0;
            $.each('name,street_address,city,postal_code'.split(','), function(idx,key){
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

            if (errors.length) {
                alertify.alert(errors.join("\n"));
                onComplete();
                return;
            }
            
            function submit(recaptcha_token) {
                stripe.createToken(cardElement, {
                    name: params.name,
                    address_line1: params.street_address,
                    address_line2: params.street_address2,
                    address_city: params.city,
                    address_state: params.state,
                    address_zip: params.postal_code,
                    address_country: params.country_code,
                    currency: 'usd'
                }).then(function(result) {
                    if (result.error) {
                        if ('message' in result.error) {
                            alertify.alert(result.error.message);
                        } else {
                            alertify.alert("Failed to add a credit card. Please try again later.");
                        }
                        onComplete();
                    } else {
                        var token = result.token;
                        var endpoint, payload;
                        if (CardDialogOptions.forMerchant) {
                            endpoint = '/merchant/settings/add-credit-card.json';
                            payload = { 'stripe_token': token.id };
                        } else {
                            endpoint = '/settings/cards/stripe/add-card.json';
                            payload = { 'card_token': token.id, 
                                'address1': params.street_address, 'address2': params.street_address2,
                                'city': params.city, 'state': params.state, 'country': params.country_code,
                                'postal_code': params.postal_code, 'set_default': params.set_default };
                        } 
                        if (recaptcha_token) payload['recaptcha_token'] = recaptcha_token;
                        if (CardDialogOptions.usesandbox) payload['usesandbox'] = 'true';
                        if (CardDialogOptions.parameter) endpoint += CardDialogOptions.parameter;
                        $.ajax({
                            type: 'post', url: endpoint, data: payload,
                            success : function(response) {
                                onComplete();
                                if (response.status_code == 1) {
                                    if (window.dataLayer && !CardDialogOptions.forMerchant) {
                                        dataLayer.push({'event': 'Save_Payment', 'product_id': undefined, 'products': undefined, 'products_info': undefined, 'revenue': undefined, 'option_id': undefined });
                                    }
                                    CardDialogOptions.onSuccess(dlg, response);
                                } else {
                                    alertify.alert(response.message || "We couldn't add your card. Please try again later.", function() {
                                        onComplete();
                                        $form.trigger('open');
                                    });
                                }
                            },
                            error : function(res) {
                                var message = "We couldn't add your card. Please try again later.";
                                if (res.responseText) {
                                    try {
                                        var json = JSON.parse(res.responseText)
                                        if (json.message) message = json.message;
                                    } catch(e) {}
                                }
                                alertify.alert(message, function() {
                                    onComplete();
                                    $form.trigger('open');
                                });
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
                        alertify.alert('Please complete RECAPTCHA to continue');
                        onComplete();
                    }
                });
            } else {
                submit();
            }

            
        })

    function getParam(form) {
        var arrParam = $(form).serializeArray(), params = {}, i, c;

        for (i=0,c=arrParam.length; i < c; i++) {
            params[arrParam[i].name] = $.trim(arrParam[i].value);
        }

        return params;
    };
});
