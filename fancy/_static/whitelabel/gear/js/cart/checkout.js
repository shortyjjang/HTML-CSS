$(function(){

	function getParam($form) {
		var arrParam = $form.serializeArray(), params = {}, i, c;

		for (i=0,c=arrParam.length; i < c; i++) {
			params[arrParam[i].name] = arrParam[i].value;
		}

		return params;
	}

	function checkoutPutRequest(params, successCallback) {
		if (location.args) {
			$.extend(params, location.args);
		}
		$.ajax({
			type : 'PUT',
			url  : '/rest-api/v1/checkout',
			contentType: "application/json; charset=utf-8",
			data : JSON.stringify(params),
			processData : false,
			success  : successCallback
		}).fail(function(xhr) {
            if(xhr.status==404) {
                location.href='/cart'
            } else {
                var error = null;
                try {
                    var res = JSON.parse(xhr.responseText);
                    error = res.error || res.message;
                } catch(e) {
                }
                alertify.alert(error || "We failed to process your order. Please try again or contact support@gear.com");
            }
        });
	}

	$("select[name=country], select[name=country_code]").change(function(){
		var $wrapper = $(this).closest("div");
		$wrapper.find("[name=state], .state .selectBox").hide();
		if($(this).val()=='US' || $(this).val()=='USA'){
			$wrapper.find(".state .selectBox, select[name=state]").show();
		}else{
			$wrapper.find("input[name=state]").show();
		}
	})

	var Checkout = {};

    window.Checkout = Checkout;

	Checkout.Shipping = {
		$el : $("#content > .section.shipping"),
		open : function(){
			this.$el.addClass("confirm").find("> p, > div").hide().end().find("> div.selector").show();
			this.$el.removeClass("confirm").find("h3.stit").html("Choose a shipping address");
			$(".btn-checkout").attr('disabled','disabled');
		},
		close : function(){
			if(this.$el.find(">p.status").is(":visible")) return;
			this.$el.addClass("confirm").find("> p, > div").hide().end().find("> p.status").show();		
			var $addr = this.$el.find("ul li.selected");
			this.$el.find("h3.stit").html("<b>Shipping address</b>");
		},
		isOpened : function(){
			return this.$el.find("> p.status").is(":hidden");
		},
		init: function(){
            if(this.$el.length<=0) {
				Checkout.Shipping.close();
                return;
            }

			this.$el
				.on('click', 'p.status a.change', function(e){
					e.preventDefault();
					Checkout.Payment.close();
					Checkout.Shipping.open();
				})
                .on('setAddr', function(e, addr_id){
                    var $this = Checkout.Shipping.$el.find("li[data-id='"+addr_id+"']"), $wrapper = $this.closest('.shipping');
                    $this.closest('ul').find('li').removeClass('selected').end().end().closest('li').addClass('selected').find("input:radio").prop('checked',true);
                    $wrapper.data('addr_id', addr_id);
                    $wrapper.find('.status span').html( $this.find('label small').html() );
                })
                .on('confirm', function(e, addr_id){
                    if(addr_id && Checkout.Shipping.$el.find("li[data-id='"+addr_id+"']").length ){
                        Checkout.Shipping.$el.trigger('setAddr', addr_id);
                        Checkout.Shipping.close();
                        if(Checkout.Payment.isConfirmed())
                            Checkout.Review.open();
                        else
                            Checkout.Payment.open();
                    }else{
                        //Checkout.Shipping.$el.find("li input:radio").eq(0).trigger('click');
                    }
                })
				.on('click', 'li input:radio', function(event){
					var $this = $(this), $li = $this.closest('li'), $wrapper = $this.closest('.shipping'), prev_id = $wrapper.data('addr_id');
					
                    Checkout.Shipping.$el.trigger('setAddr', $this.val());

					if(!Checkout.Shipping.$el.hasClass('confirm') && !prev_id && $this.val() ){
						Checkout.Shipping.$el.find(".select_ship_addr_").trigger('click');
					}
				})
				// edit shipping
				.on('click', 'li a.edit', function(event){
					event.preventDefault();

					var $this = $(this), $li = $this.closest("li"), dlg = $.dialog('add-shipping'), id = $li.find("input").val();

					dlg.open();
					dlg.$obj.find('p.ltit').html('Edit shipping address').end().find(".btn-continue");
                    dlg.$obj.find("p.tooltip").removeClass('tooltip error').find('em').remove();

					dlg.$obj.find('input,select').each(function() {
						var $this = $(this);
						var name = $this.attr('name');
						var value = $li.data(name);
						if(name=="prev_addr_id"){
							$this.val( $li.data("id") );
						}else{
							$this.val(value);
						}
						if(name=='country'){
							$this.change();
						}
					});
				})
                // delete shipping
                .on('click', 'li a.del', function(event){
                    event.preventDefault();

                    var $this = $(this), $li = $this.closest("li"), dlg = $.dialog('add-shipping'), addr_id = $li.find("input").val();

                    $.ajax({
                        type : 'post',
                        url  : '/remove_shipping_addr.json',
                        data : {id:addr_id},
                        dataType : 'json',
                        success  : function(json){
                            if(json.status_code === 1){
                                if( $this.closest('ul').find("li:not(.selected) input:radio").length ){
                                    $this.closest('ul').find("li:not(.selected) input:radio").trigger('click');    
                                }else{
                                    $this.closest('ul').hide()
                                        .next().show()
                                        .next().find("a.new").hide();
                                }
                                $this.closest('li').remove();
                            } else if (json.status_code === 0){
                                if(json.message) alertify.alert(json.message);
                            }
                        }
                    })
                })
				.on('click', '.select_ship_addr_', function(){
					var $this = $(this), $wrapper = $this.closest(".shipping");
					var addressInfo = null;

					if( $wrapper.find("form.new").is(":visible")){
						var $form = $wrapper.find("form.new");
						var params = getParam($form);
						params.state = $form.find("[name=state]:visible").val();
						params.country_name = $form.find("select[name=country] option:selected").html();
						params.set_default = $form.find("input[name=set_default]")[0].checked;

						Checkout.Shipping.addShippingAddress(params, function(data){
							var $li = $( $wrapper.find(".selector ul > script").html() );
							$wrapper.find("ul").append($li).show();
							for(k in data){
								if( $li.attr('data-'+k) != undefined){
									$li.attr('data-'+k, data[k]);
								}
							}
                            $li.find("input:radio").attr('value', data.id);
							$li.find("b.title").html( data.nickname );
							$li.find("label small").html( data.fullname+", "+data.address1+(data.address2?(" "+data.address2):"")+", "+data.city+", "+(data.state?(data.state+", "):"")+data.zip+", "+data.country_name  );
							
							$wrapper.find(".btn-area a.new").show().end().find("form.new").hide();
                            Checkout.Shipping.$el.trigger('setAddr', data.id);

							addressInfo = {address_id: data.id};
							checkoutPutRequest(addressInfo, function(res){
								Checkout.Shipping.close();
								if(Checkout.Payment.isConfirmed())
									Checkout.Review.open();
								else
									Checkout.Payment.open();
								refreshCheckout(res);
							});
						});
					}else{
						addressInfo = {address_id: $wrapper.data('addr_id')};
						if(!addressInfo.address_id){
							alertify.alert('Please select an address');
							return;
						}
						checkoutPutRequest(addressInfo, function(res){
							Checkout.Shipping.close();
							if(Checkout.Payment.isConfirmed())
								Checkout.Review.open();
							else
								Checkout.Payment.open();
							refreshCheckout(res);
						});
					}					
						
					
				})
				.on('click', "a.new", function(e){
					e.preventDefault();

					var $this = $(this), dlg = $.dialog('add-shipping');

					dlg.open();
					dlg.$obj.find('p.ltit').html('Ship to a new address').end().find(".btn-continue");
                    dlg.$obj.find("p.tooltip").removeClass('tooltip error').find('em').remove();
					dlg.$obj.find('input,select').each(function() {
						var $this = $(this);
						var name = $this.attr('name');
						$this.val('');
						if(name=='country'){
							$this.val('US').change();
						}
					});
					dlg.$obj.find("button.btn-remove").hide();
				})
                .on('focus', 'input:text', function(e){
                    $(this).closest("p").removeClass('tooltip error').find("em").remove();
                })

			$(".popup.add-shipping")
				.on('click', '.btn-continue', function(){
					var $this = $(this); $form = $this.closest(".popup.add-shipping"); var params = getParam($form);
					params.state = $form.find("[name=state]:visible").val();
					params.country_name = $form.find("select[name=country] option:selected").html();
					params.set_default = $form.find("input[name=set_default]")[0].checked;

					Checkout.Shipping.addShippingAddress(params, function(data){
						var $li = $(".section.shipping li.selected");
						if(!params.prev_addr_id){
							var $wrapper = $(".section.shipping")
							$li = $( $wrapper.find("ul > script").html() );
							$wrapper.find("ul").append($li);
						}

						for(k in data){
							if( $li.data(k) != undefined){
								$li.data(k, data[k]);
								$li.attr('data-'+k, data[k]);
							}					
						}
						$li.find("b.title").html( data.nickname );
						$li.find("label small").html( data.fullname+", "+data.address1+(data.address2?(" "+data.address2):"")+", "+data.city+", "+(data.state?(data.state+", "):"")+data.zip+", "+data.country_name );
						$li.find("input:radio").val( data.id ).click();
						
						$.dialog('add-shipping').close();
					});
				})
				.on('focus', 'input:text', function(e){
					$(this).closest("p").addClass("focus").removeClass('tooltip error').find("em").remove();
				})
				.on('blur', 'input:text', function(e){
					$(this).closest("p").removeClass("focus");
				})	
				.on('keypress', 'input', function(e){
					if( e.keyCode==13) e.preventDefault();
				})
                .on('click', '.popup-close', function(e){
                    $.dialog('add-shipping').close();
                })
				.on('submit', function(e){
					e.preventDefault();
				})

			//this.$el.find("ul:visible li[data-set_default=True] input:radio").trigger('click');
		},
		addShippingAddress: function(params, callback){		
			function error(field, msg) {
				if (typeof gettext == 'function') msg = gettext(msg);
                if(field){
                    var $field = $(".shipping,.add-shipping").find("[name="+field+"]:visible:eq(0)");
                    $field.closest('p').addClass('tooltip error').find('em').remove().end().append("<em>"+msg+"</em>").end().trigger('mouseover');
                }else{
				    alertify.alert(msg);
                }
			}

			if (params.fullname.length < 1) return error('fullname', 'Please enter your full name');
			if (params.nickname.length < 1) params.nickname = params.fullname+"-"+params.zip;
			if (params.address1.length < 1) return error('address1', 'Please enter your address');
			if (params.city.length < 1) return error('city', 'Enter your nearest city');
			if (params.zip.length < 1) return error('zip', 'We also need your ZIP or postal code');
			if (params.country == 'US') {
				var phone = params.phone.replace(/\s+/g, ''); 
				if (phone.length < 10 || !phone.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/)) return error('phone', 'Please enter your phone number');
			}
			
			$.ajax({
				type : 'POST',
				url  : '/add_new_shipping_addr.json',
				data : params,
				dataType : 'json',
				success  : function(json) {
					var $op, html='';
					switch (json.status_code) {
						case 0:
						case 2:
							if (json.message) alertify.alert(json.message);
	                        break;
						case 1:
							callback(json);
							break;
					}
				},
				complete : function() {
					
				}
            }).fail(function(xhr) {
                alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
			})
		}

	}

	Checkout.Payment = {
		$el : $("#content > .section.payment"),
		isConfirmed: function(){
			return this.$el.hasClass("confirm") || this.$el.is(":hidden");
		},
		hide : function(){
			if(this.$el.is(":visible")){
				Checkout.Payment.close();
				Checkout.Review.open();
			}
			this.$el.hide();
		},
		show : function(){
			if(this.$el.is(":hidden")){
				Checkout.Payment.open();
			}
			this.$el.show();
		},
		open : function(){
			if(this.skip){
				Checkout.Payment.close();
				Checkout.Review.open();
				return;
			}

			this.$el.removeClass("disabled").find("> div, >p").hide().filter(".selector").show();

            // copy shipping addresses to billing address
            var billings = this.$el.find("form.new dl.billing");
            if(Checkout.Shipping.$el.find(".selector ul").length>0) {
                function SAFE1(str) {
                    return str || '';
                }
                function SAFE2(str) {
                    if(!str) return '';
                    return (''+str).replace(/>/g,'&gt;').replace(/</g,'&lt;')
                }
                billings.each(function(i,billing) {
                    $billing = $(billing);
                    $billing.find('li:not(.billing_new)').remove();
                    template = $billing.find('>script').html();
                    if(!template) return true;
                    var addrs = $(Checkout.Shipping.$el.find(".selector ul li"));
                    addrs.each(function(j,addr) {
                        $addr = $(addr);
                        var _id = $addr.data('id');
                        var _nickname = $addr.data('nickname');
                        var _address1 = SAFE1($addr.data('address1'));
                        var _address2 = SAFE1($addr.data('address2'));
                        var _city = SAFE1($addr.data('city'));
                        var _country = SAFE1($addr.data('country'));
                        var _state = SAFE1($addr.data('state'));
                        var _zip = SAFE1($addr.data('zip'));
                        var _country_name = SAFE1($addr.data('country_name'));
                        var selected = $addr.hasClass('selected');

                        billing_address = template.replace(/##id##/g, _id);
                        billing_address = billing_address.replace(/##nickname##/g, _nickname);
                        billing_address = billing_address.replace(/##address_text##/g, SAFE2(_address1)+'<br>'+(_address2?SAFE2(_address2)+'<br>':'')+SAFE2(_city+', '+_state+', '+_country_name));
                        billing_address = billing_address.replace(/##checked##/g, selected?'checked':'');
                        billing_address = billing_address.replace(/##selected##/g, selected?'selected':'');

                        $billing_address = $(billing_address).insertBefore($billing.find("li.billing_new"));

                        $billing_address.find('[name=street_address]').val(_address1);
                        $billing_address.find('[name=street_address2]').val(_address2);
                        $billing_address.find('[name=country_code]').val(_country);
                        $billing_address.find('[name=city]').val(_city);
                        $billing_address.find('[name=state]').val(_state);
                        $billing_address.find('[name=postal_code]').val(_zip);

                        if(selected) {
                            $billing.find('li.billing_new').removeClass('selected');
                        }
                    });
                });
            }

            if( !this.$el.hasClass("confirm") && this.$el.find("ul.cardlist:visible li:not([id=bitcoin],.add_card)").length) {
                if(!this.$el.find("ul.cardlist:visible li.selected").length) this.$el.find("ul.cardlist:visible li:not([id=bitcoin],.add_card)").eq(0).addClass('selected');
				if(!this.$el.data('payment_id')) this.$el.find("ul.cardlist:visible li.selected input:radio").trigger("click");
				this.$el.find(".select_payment_").trigger('click');
			}else{
				this.$el.removeClass("confirm").find("h3.stit").html("Payment Method");
                if(!this.$el.data('payment_id')){
                    this.$el.find("ul.cardlist:visible li.add_card input:radio").trigger('click');
				    $(".btn-checkout").attr('disabled','disabled');
                }
                this.$el[0].scrollIntoView();
            }


		},
		close : function(){
			if(this.$el.find("> .status").is(":visible")) return;
			this.$el.find("> div, > p").hide().end().find("> .status").show();
			if(this.$el.data('payment_id')){
				this.$el.addClass('confirm');				
				var $card = this.$el.find(".selector ul li.selected");
				if($card.length){
                    if($card.is("#bitcoin")){
                        this.$el.find("h3.stit").html("Payment method · Bitcoin");
                    }else{
					   this.$el.find("h3.stit").html("Payment Method · "+$card.data('type')+" - Ending in "+$card.attr('data-last_digits'));
                    }
				}
			}else{
				this.$el.addClass('disabled').find("> .status").hide().end().find("h3.stit").html("Payment Method");
			}
		},
		isOpened : function(){
			return this.$el.find("> .status").is(":hidden") && this.$el.is(":visible");
		},
		init : function(){
            var stripe = null, elements = null, cardElement = null, $btn = this.$el.find(".select_payment_");
            if (Stripe.version == 3) {
                this.stripe = stripe = Stripe(window.stripePublishableKey);
                this.elements = elements = stripe.elements();
                var $err = this.$el.find(".new .element .error-msg");
                this.cardElement = cardElement = elements.create('card', { hidePostalCode: true, iconStyle: 'solid' });
                cardElement.mount('#card-element');
                cardElement.on('change', function(event) {
                    if(event.complete) {
                        $btn.prop('disabled', false);
                    } else {
                        $btn.prop('disabled', true);
                    }
                    if (event.error) {
                        $err.show().text(event.error.message);
                    } else {
                        $err.hide().text('');
                    }
                });
            }

			function selectPayment($li){
					var $wrapper = $li.closest('.section.payment'), prev_id = $wrapper.data('payment_id');

					var payment_id = $li.find("input:radio").val();
					
					$li.closest('ul').find('li').removeClass('selected').end().end().addClass('selected');
					$wrapper.data('payment_id', payment_id);
                    $('#bitpay_invoice_id').val('');
                    if(payment_id == 'bitcoin'){
                        $wrapper.find(".status")
                            .find("b").html($li.find("label").html()).find("input:radio").remove().end()
                            .next().hide();
                    }else{
					   $wrapper.find(".status").find("b").html("Billing address:").end().find(".billing_address_").html($li.data('billing_address')).show();
                    }

					if( !$wrapper.find("form.new").is(":visible") &&  !$wrapper.hasClass("confirm") && !prev_id && payment_id && payment_id!='bitcoin')
						$wrapper.find(".select_payment_").trigger('click');
			}

			this.$el
				.on('click', '.status a.change', function(e){
					e.preventDefault();					
					Checkout.Shipping.close();
					Checkout.Payment.open();
				})
                .on('click', '.selector ul.cardlist li input:radio', function(event){
                    var $this = $(this), $wrapper = $this.closest(".section.payment");
                    $btn.prop('disabled', false);
                    if($this.val()=='new'){
                        $this.closest('li').closest('ul').find('li').removeClass('selected').end().end().addClass('selected');
                        $wrapper.find("form.new").show().find("input[name=name]").focus();
                        if (cardElement) {
                            if (!$("#card-element").hasClass("StripeElement--complete")) {
                                $btn.prop('disabled', true);
                            }
                        }
                        return;
                    }           
                    $wrapper.find("form.new").hide();       
                    selectPayment( $this.closest('li') );
                })
				.on('click', '.selector .billing ul li input:radio', function(event){
					var $this = $(this), $wrapper = $this.closest(".section.payment");
                    $this.closest('li').closest('ul').find('li').removeClass('selected').end().end().addClass('selected');
				})
				.on('click', '.select_payment_', function() {
					var $this = $(this), $wrapper = $this.closest(".section.payment");
					if( $wrapper.find("form.new").is(":visible")){
						var params = getParam($wrapper.find('form'));

                        $this.addClass('loading').prop('disabled',true);

                        var $selected = $wrapper.find("form.new dd.selector li.selected");
    					if(!$selected.hasClass("billing_new")){
                            $selected.find("input[type='hidden']").each(function(i,input) {
                                params[$(input).attr('name')] = $(input).val();
                            });
    					}else{
                            $selected.find("input[type='text']:visible").each(function(i,input) {
                                params[$(input).attr('name')] = $(input).val();
                            });
			    			params.country_code = $selected.find('[name=country_code]').find('option[value='+params.country_code+']').attr('data-code2');
    						params.state = $selected.find("[name=state]:visible").val();
    						params.set_default = $selected.find("input[name=set_default]")[0].checked;
    					}

						Checkout.Payment.addNewCard(params, function(data){
							$this.removeClass('loading').prop('disabled', false);

							if(!data.card_id){
								alertify.alert(data.message||"Please input valid credit card info");
								return;
							}

							var $li = $( $wrapper.find(".selector ul > script").html() );
							$li.data('holder_name', data.card_holder_name).attr('data-last_digits', data.card_last_digits).data('type', data.card_type).data('billing_address', data.card_holder_name+", "+data.billing_address.address1+", "+data.billing_address.city+", "+data.billing_address.state+", "+data.billing_address.postal_code+", "+data.billing_address.country);
							$li.find("label").addClass( data.card_type.toLowerCase() );
							$li.find("b.title").html( data.card_type + " <small>ending in "+data.card_last_digits+"</small>");
							$li.find("small.name").html( data.card_holder_name );					
							$li.find("small.exp").html( data.card_expiration );					
							$li.find("input:radio").val( data.card_id );
							$wrapper.find(".selector ul.cardlist .add_card").before($li);
							$wrapper.find("form.new").hide();
							
							selectPayment( $li );

							Checkout.Payment.close();
    						Checkout.Review.open();
						}, function(){
							$this.removeClass('loading').prop('disabled', false);
						});
					}else{
						if(!$wrapper.data('payment_id')){
							alertify.alert("Please select a payment method");
							return;
						}

						Checkout.Payment.close();
                        Checkout.Review.open();
					}

				})
                .on('focus', 'input:text', function(e){
                    $(this).closest("p").removeClass('tooltip error').find("em").remove();
                })

            if(Checkout.Shipping.$el.length<=0) {
				Checkout.Payment.open();
            }
		},
		addNewCard: function(params, callback, callback_error){

            function error(field, msg) {
				if (typeof gettext == 'function') msg = gettext(msg);
				callback_error();
                if(field){
                    var $field = $(".payment,.add-payment").find("[name="+field+"]:visible:eq(0)");
                    $field.closest('p').addClass('tooltip error').find('em').remove().end().append("<em>"+msg+"</em>").end().trigger('mouseover');
                }else{
                    alertify.alert(msg);
                }
			}
			
            var stripe = this.stripe, cardElement = this.cardElement;

			// check required fields
			if (!params.name)return error('name','Type your name as it appears on your card');
            if (!params.street_address) return error('street_address','Please enter your billing address');
			if (!params.city) return error('city','Enter your nearest city');
			if (!params.postal_code) return error('postal_code','We also need your ZIP or postal code');
		
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
	                callback_error();
	                if ('message' in result.error) {
	                	alertify.alert(result.error.message);
	                } else {
                        alertify.alert("Failed to add a credit card. Please try again later.");
                    }
	            } else {
                    var token = result.token;
	                var endpoint, payload;
	                endpoint = '/settings/cards/stripe/add-card.json';
	                payload = { 'card_token': token['id'], 
	                    'address1': params.street_address, 'address2': params.street_address2,
	                    'city': params.city, 'state': params.state, 'country': params.country_code,
	                    'postal_code': params.postal_code, 'set_default': params.set_default };
	                $.ajax({
	                    type: 'post', url: endpoint, data: payload,
	                    success : function(response) {
	                        callback(response);
	                    },
	                    complete : function() {
	                        
	                    }
                    }).fail(function(xhr) {
                        alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
	                })
	            }
	        });
		}
	}
	
	Checkout.Review = {
		$el : $("#content > .section.review"),
		open : function(){
            if (lastCheckoutJson) {
                renderSummary(lastCheckoutJson);
                renderSaleItems(lastCheckoutJson);
            }
		},
		close : function(){
		},
		init: function(){
			this.$el
				.on('change', '.reviewShipping select', function(event){
					var seller_id = $(this).closest('[seller_id]').attr('seller_id');
					var deliveryOption = $(this).val();
					var info = {"shipping_option":{}};
					info['shipping_option'][seller_id] = parseInt(deliveryOption);

					checkoutPutRequest(info, function(res) {
						refreshCheckout(res);
					});
				})
				.on('click', '.optional a.note', function(event){
					event.preventDefault();
					var seller_id = $(this).closest('[seller_id]').attr('seller_id');
					var note = $(this).data('note')||'';
					var dlg = $.dialog('edit_seller_note');
					var title = dlg.$obj.find("p.ltit").html();
					if( $(this).closest('.optional').hasClass('add')) title = title.replace(/Edit/i,"Add");
					else title = title.replace(/Add/i,"Edit");
					dlg.$obj.data('seller_id',seller_id).find("textarea.text").val(note).end().find("p.ltit").html( title );
					dlg.open().$obj.find("textarea.text").focus();
				})
				.on('click', '.optional .note a.remove', function(event){
					event.preventDefault();
					var seller_id = $(this).closest('[seller_id]').attr('seller_id');
					var noteInfo = {'note_info':{}};
					noteInfo.note_info[seller_id] = '';

					checkoutPutRequest(noteInfo, function(res) {
						refreshCheckout(res);
					});
				})
				.on('click', '.optional a.gift', function(event){
					event.preventDefault();
					var seller_id = $(this).closest('[seller_id]').attr('seller_id');
					var is_gift = true;// $(this).data('is_gift')||false;
					var gift_message = $(this).data('gift_message')||'';
					var dlg = $.dialog('add_gift_msg');
					var title = dlg.$obj.find("p.ltit").html();
					if( $(this).closest('.optional').hasClass('add') ) title = title.replace(/Edit/i,"Add");
					else title = title.replace(/Add/i,"Edit");

					dlg.$obj.data('seller_id',seller_id).find("textarea.text").val(gift_message).end().find("p.ltit").html( title );
					dlg.$obj.find("input:checkbox")[0].checked = is_gift;
					if(is_gift){
						dlg.$obj.find("textarea").removeAttr('disabled');	
					}else{
						dlg.$obj.find("textarea").attr('disabled','disabled');	
					}
					
					dlg.open().$obj.find("textarea").focus();	
				})
				.on('click', '.optional .gift a.remove', function(event){
					event.preventDefault();
					var seller_id = $(this).closest('[seller_id]').attr('seller_id');
					var giftInfo = {'gift_info':{}};
					giftInfo.gift_info[seller_id] = {"is_gift": false, "gift_message": ''};

					checkoutPutRequest(giftInfo, function(res) {
						refreshCheckout(res);
					});

				})
				.on('click', '.reviewOrder li a.remove', function(e){
					e.preventDefault();
					var $this = $(this);
					$this.addClass('disabled');

					params = {
						item_id : $this.data('item_id'),
						option_id : $this.data('option_id')
					};

					removeItem($this, params, function(){ 
						refreshCheckout();
					});		
				})

			$(".popup.edit_seller_note")
				.on('click', 'button.btn-continue', function(){
					var seller_id = $(".popup.edit_seller_note").data('seller_id');
					var note = $(".popup.edit_seller_note").find("textarea").val();

					var noteInfo = {'note_info':{}};
					noteInfo.note_info[seller_id] = note;

					checkoutPutRequest(noteInfo, function(res) {
						refreshCheckout(res);
					});
					$.dialog('edit_seller_note').close();
				})
                .on('click', '.popup-close', function(){
                    $.dialog('edit_seller_note').close();  
                })
			$(".popup.add_gift_msg")
				.on('click', 'input:checkbox', function(){
					if( this.checked ){
						$(".popup.add_gift_msg textarea").removeAttr('disabled');	
					}else{
						$(".popup.add_gift_msg textarea").attr('disabled','disabled');	
					}
				})
				.on('click', 'button.btn-continue', function(){
					var seller_id = $(".popup.add_gift_msg").data('seller_id');
					var is_gift = $(".popup.add_gift_msg").find("input:checkbox")[0].checked;
					var gift_message = $(".popup.add_gift_msg").find("textarea").val();

					var giftInfo = {'gift_info':{}};
					giftInfo.gift_info[seller_id] = {"is_gift": is_gift, "gift_message": gift_message};

					checkoutPutRequest(giftInfo, function(res) {
						refreshCheckout(res);
					});

					$.dialog('add_gift_msg').close();
				})
                .on('click', '.popup-close', function(){
                    $.dialog('add_gift_msg').close();
                })

            $("#sidebar")
                .on('click', ".payment-coupon dt > a", function(e){
                    e.preventDefault();
                    $(this).toggleClass('opened').parent().next().toggle();
                })
                .on('click', ".payment-coupon button.btn-apply", function(){
                    var $this = $(this);
                    var code = $(this).prev().val();
                    var couponInfo = {"apply_coupon":true, "coupon_code":code};

                    checkoutPutRequest(couponInfo, function(res){
                        if(res.error){
                            if( res.error.match(/^Invalid coupon code/) ) res.error = "Invalid coupon code";
                            $this.next().html(res.error).show();
                        }else{
                            refreshCheckout(res);
                        }
                    });
                })
                .on('click', ".payment-coupon a.remove-coupon_", function(e){
                    e.preventDefault();
                    var code = $(this).attr('code');
                    var couponInfo = {"apply_coupon":false, "coupon_code":code};

                    checkoutPutRequest(couponInfo, function(res){
                        refreshCheckout(res);
                    });
                })

		}
	}

	Checkout.Shipping.init();
	Checkout.Payment.init();
	Checkout.Review.init();
	
	function removeItem($btn, data, callback){
		$btn.addClass('disabled').attr('disabled', true);
		var url = '/rest-api/v1/checkout/item/'+data.item_id;
		if(data.option_id) url += "/option/"+data.option_id;

		$.ajax({
			type : 'DELETE',
			url  : url,
			data : {},
			dataType : 'json',
			success  : callback || $.noop,
			complete : function(){				
				$btn.removeClass('disabled').removeAttr('disabled');
			}
        }).fail(function(xhr) {
            alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
		})
	};

    var isRenderingSummary = false;
	function renderSummary(data){
        if (isRenderingSummary) return;
        isRenderingSummary = true;
		var $frm = $(".section.summary, .section.confirm");
        var total_in_cent = Math.round(parseFloat(data.total_prices) * 100);
        $("body").data("total_prices_in_cent", total_in_cent);

		if(total_in_cent > 0){
			Checkout.Payment.show();
		}else{
			Checkout.Payment.hide();
		}
        var shipping_promotion_amount = (data.extra_info.free_shipping_promotion && parseFloat(data.extra_info.free_shipping_promotion.total)) || 0;
        var shipping_discount_amount = parseFloat(data.shipping_discount_amount) || 0
        var shipping_cost = parseFloat(data.shipping_costs) || 0
        
        var subtotal = parseFloat(data.total_prices) - parseFloat(data.sales_taxes) - shipping_cost;

		$frm.find("div.total .price b").html("$"+addCommas(data.total_prices));
		$frm.find("p.price > b > span").html("$"+addCommas(data.total_prices));
		$frm.find("li.producttotal_ .price").html("$"+addCommas(data.subtotal_prices.replace(".00","")));
        $frm.find("li.shipping_ .price.before-discount").hide()
		$frm.find("li.shipping_ .price").html("$"+addCommas(data.shipping_costs.replace(".00","")));
        
        if(shipping_discount_amount > 0 || shipping_promotion_amount > 0) {
		    $frm.find("li.shipping_ .price:not(.before-discount)").html("$"+addCommas((shipping_cost-shipping_discount_amount-shipping_promotion_amount).toFixed(2)))
		    $frm.find("li.shipping_ .price.before-discount").show()
            subtotal = subtotal + (shipping_discount_amount + shipping_promotion_amount);
        }

        $frm.find("li.subtotal_ .price").html("$"+addCommas(subtotal.toFixed(2).replace(".00","")));

		$frm.find("li.tax_ .price").html("$"+addCommas(data.sales_taxes.replace(".00","")));
        if(parseFloat(data.sales_taxes)>0) $frm.find("li.tax_").show()

        $frm.find("li.rebate .price").html("- $"+addCommas(data.credit_amount.replace(".00", "")))
            .parent().css("display", (parseFloat(data.credit_amount) || 0) > 0 ? "" : "none");
        $frm.find("li.giftcard .price").html("- $"+addCommas(data.fancy_money_amount.replace(".00", "")))
            .parent().css("display", (parseFloat(data.fancy_money_amount) || 0) > 0 ? "" : "none");

        var coupon_amount = data.coupon_amount
        if(shipping_discount_amount>0) {
            var coupon_amount = parseFloat(data.coupon_amount)||0
            coupon_amount = Math.max(coupon_amount - shipping_discount_amount,0)
            coupon_amount = coupon_amount.toFixed(2)
        }
        $frm.find("li.discount .price").html("- $"+addCommas(coupon_amount.replace(".00", "")))
            .parent().css("display", (parseFloat(coupon_amount) || 0) > 0 ? "" : "none");

        // show give a buck amount
        var award_amount = data.extra_info.gividend_reward||0;
        if(award_amount){
            $(".give-buck span b").text("$"+award_amount);
        }else{
            $(".give-buck").hide();
        }
        isRenderingSummary = false;
	}

	var sellerTemplate = $("script#seller_template").html();
	var itemTemplate = $("script#cart_item_template").html();

	function renderSaleItems(data){
		var $review = $(".section.review");
        var payment_method = 'stripe';
		var itemCount = 0;

        if(Object.keys(data.sale_items_freeze).length==0) {
            location.href = "/cart";
            return;
        }

        var $couponArea = $("#sidebar .payment-coupon dd");
        var couponInfo = [];
        for(var key in data.sale_items_freeze) {
            coupons = data.sale_items_freeze[key].coupons;
            if(coupons) {
                couponInfo = couponInfo.concat(coupons);
            }
        }
        couponInfo = couponInfo && couponInfo[0];
        if( couponInfo ){        	
        	$couponArea.find(">ul li").html("<b>"+couponInfo.code+ " · <a href='#' class='remove-coupon_' code='"+couponInfo.code+"'>Remove</a></b> "+couponInfo.description);
        	$couponArea.show().find(">input,>button,>div").hide().end().find(">ul").show();
        }else{
        	$couponArea.find(">input,>button").show().end().find(">div,>ul").hide();
        }

        var isAvailable = true;
        $review.find("[seller_id]").attr("mark-delete",true);

        gift_card_info = null;
        if(data.is_giftcard_checkout) {
            gift_card_info = {
                'message': data.gift_info['message'],
                'recipient_email': data.gift_info['recipient_email'],
                'recipient_id': data.gift_info['recipient_id'],
                'recipient_username': data.gift_info['recipient_username'],
                'recipient_name': data.gift_info['recipient_name']
            };
        }
        var digitalDataProducts = [];
		for(k in data.sale_items_freeze){
			var seller = data.sale_items_freeze[k];
			var $sellerEl = $review.find("[seller_id="+k+"]");
			if(!$sellerEl.length) $sellerEl = $(sellerTemplate);
			$sellerEl.attr('seller_id', k);
			$sellerEl.find('> h4').html(String(seller.items[0].brand_name).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));

			if(!seller.checkout_available) isAvailable = false;
			
			$sellerEl.find("[item_id]").attr("mark-delete", true);

            var contains_shippable_item = false;
			$(seller.items).each(function(){
				var item = this;
				
				var $el = $sellerEl.find("[item_id="+item.id+"]");
				if(!$el.length) $el = $(itemTemplate);
				$el.attr('item_id', item.id)
					.find(".item").attr("href", this.item_url)
						.find("img").css("background-image","url('"+this.sale_image_url+"')").end()
						.find(".title").html(this.title).end()
					.end()
					.find("span.price em.price").html("$"+addCommas(this.item_price.replace(".00",""))).end()
					.find(".qty").html('Quantity: '+this.quantity).end();

                if(data.is_giftcard_checkout) {
                    if(gift_card_info.recipient_username) {
                        $el.find('span.recipient em.recipient').html('<a href="/me/'+gift_card_info['recipient_username']+'">'+gift_card_info['recipient_name']+'</a>');
                        $el.find('span.recipient_email').hide();
                    } else {
                        $el.find('span.recipient em.recipient').html(gift_card_info['recipient_name']);
                        $el.find('span.recipient_email em.recipient_email').html(gift_card_info['recipient_email']);
                        $el.find('span.recipient_email').show();
                    }
                    $el.find('span.message em.message').html(gift_card_info['message']);
                }

				if(parseInt(this.item_retail_price) && this.item_price!=this.item_retail_price){
					$el.find("span.price").addClass("sales").find("em.price").html('<small class="before">'+ "$"+addCommas(this.item_retail_price.replace(".00",""))+'</small>'+" $"+addCommas(this.item_price.replace(".00","")))
				}
				if(this.option_id){
					$el.find("._option").show().find("em").text(this.option);
				}
				
				if(item.error_message){
					$el.find(".error").find('b').html(item.error_message).end().show();
					$('.reviewShipping').hide();
					$el.find(".delivery-option").hide();
					$el.find("a.save_for_later, a.remove").data('cid', item.id).data('sicid', item.id).data('item_id', item.sale_id).data('option_id', item.option_id);
				}else{
					$('.reviewShipping').show();
					$el.find(".error, .action").hide().end().addClass('hide-action');
					$el.find(".delivery-option").show();
                    contains_shippable_item = true;
				}
                digitalDataProducts.push({
                    name: this.title, brand: this.brand_name, options: this.option,
                    quantity: this.quantity, unit_price: this.item_price, total_price: this.subtotal_price
                });

				$el.removeAttr('mark-delete');
				$el.appendTo( $sellerEl.find("ul") );
				itemCount++;
			})
            if (window.digitalData) {
                digitalData.products = digitalData.products || digitalDataProducts;
            }
			var shipping_option = null;
			$sellerEl.find(".reviewShipping select").empty();
			if (seller.items[0].item_type != 'VANITY') {
				var shipping_options_length = $(seller.shipping_options).length;
				$(seller.shipping_options).each(function(){
					var amount = "$"+this.amount.toFixed(2);
                                        if(this.amount==0){
                                            amount = "Free";
                                        } else if (this.free) {
                                            amount = amount + " (Waived)";
                                        } else if (this.flat) {
                                            amount = amount + " (Discounted)";
                                        }
					var html = "";
					var shipped_from = seller.ships_from_name;
					if(shipping_options_length==1){
						this.label = 'Shipping';
						$sellerEl.find(".reviewShipping select")
							.prop('readonly',true).prop('disabled',true)
							.closest('.selectBox').addClass('_disabled');
						html = '<option value='+this.id+'>'+this.label+' - '+amount+'</option>';
					}else{
						$sellerEl.find(".reviewShipping select").prop('readonly',false);
						html = '<option value='+this.id+' '+(this.id==seller.shipping_selected?'selected':'')+'>'+this.label+' - '+amount+'</option>';
					}
					$sellerEl.find(".reviewShipping select").append($(html));
					if(this.id==seller.shipping_selected){
						$sellerEl.find(".reviewShipping p").html(this.detail);
					}
				});

			}
			
			$sellerEl.find("[item_id][mark-delete]").remove();

			var note = data.note_info[ k ];
			var giftInfo = data.gift_info[ k ];
			
			if(note || (giftInfo && giftInfo.is_gift)){
				$sellerEl.find(".optional.edit").show();
			}else{
				$sellerEl.find(".optional.edit").hide();
			}
			if(note)
				$sellerEl.find("a.note").data('note',note||'').end().find("div.note > span").html(note).end().find(".optional.add a.note").hide().end().find(".optional.edit > div.note").show();
			else
				$sellerEl.find("a.note").data('note','').end().find("div.note > span").html('').end().find(".optional.add a.note").show().end().find(".optional.edit > div.note").hide();
			if(giftInfo && giftInfo.is_gift) {
				$sellerEl.find("a.gift").data('is_gift',true).data('gift_message',giftInfo.gift_message||'').end().find("div.gift > span").removeClass('empty').html(giftInfo.gift_message).end().find(".optional.add a.gift").hide().end().find(".optional.edit > div.gift").show();
				if (!giftInfo.gift_message) {
					$sellerEl.find("div.gift > span").addClass('empty').html('No gift message added');
				}
			}
			else {
				$sellerEl.find("a.gift").data('is_gift',false).data('gift_message','').end().find("div.gift > span").html('').end().find(".optional.add a.gift").show().end().find(".optional.edit > div.gift").hide();
			}

			if( note || (giftInfo && giftInfo.is_gift) ){
				$sellerEl.find(".optional.add span").hide();
			}else{
				$sellerEl.find(".optional.add span").show();
			}

            if(contains_shippable_item) {
                $sellerEl.find(".optional.add").show();
                $sellerEl.find('.delivery-option').show();
            } else {
                $sellerEl.find(".optional.add, .optional.edit").hide();
                $sellerEl.find('.delivery-option').hide();
            }

			$sellerEl.removeAttr('mark-delete');
			$sellerEl.appendTo($review);
            try {
                track_event('Begin Checkout', { 'payment method': payment_method, 'type': 'saleitem', 'seller id': k});
            }catch(e) {}
		}
		$review.find("[seller_id][mark-delete]").remove();

		if(isAvailable && !Checkout.Shipping.isOpened() && !Checkout.Payment.isOpened()){
			$(".btn-checkout").removeAttr('disabled');
		}else{
			if (!window.use_amex_express) {
				$(".btn-checkout").attr('disabled', 'disabled');
			}
		}
		if ($('.checkout-giftoption').length) {
			for(k in data.sale_items_freeze){
				$('.checkout-giftoption').attr('seller_id', k);
			}
			var giftInfo = data.gift_info[ k ];
			if (giftInfo && giftInfo.is_gift) {
				$('.checkout-giftoption').find('li').removeClass('selected');
				$('.checkout-giftoption').find('li > input#giftopt_t').attr('checked', true).closest('li').addClass('selected');
				$('.checkout-giftoption').find('li.selected > textarea').val(giftInfo.gift_message);
			}
		}
		
	}

    function renderShippingAddress(data){
        var addr_id = data.sale_items_freeze[Object.keys( data.sale_items_freeze)[0]].shipping_addr_id;
        $(".section.shipping").trigger("confirm", addr_id);
    }

    var lastCheckoutJson;
	function render(data){
        lastCheckoutJson = data;
		$("[name=checkout_id]").val(data.id);
		renderSummary(data);
		renderSaleItems(data);
        renderShippingAddress(data);
	}

	var isBegin = true;
    var isRefreshing = false;
	function refreshCheckout(json){
		if(json){
			render(json);
		}else{
            var method = "GET", params = (isBegin && window.payment_gateway) ? {payment_gateway:window.payment_gateway} : null;
            if (params) {
                method = "POST";
            } else {
                params = location.args;
            }
            if(isRefreshing) return;
            isRefreshing = true;
			$.ajax({
				type : method,
				url  : '/rest-api/v1/checkout',
				data : params, 
				success  : function(json){
					if(isBegin){
						var param = {'payment method':'stripe', type:'saleitem'}
						param['seller id'] = Object.keys( json.sale_items_freeze).join(", ");						
                        try {
                            var content_ids = [];
                            var value = parseFloat(json.subtotal_prices);
                            for(k in json.sale_items_freeze){
                                var seller = json.sale_items_freeze[k];
                                $(seller.items).each(function(){
                                    var item = this;
                                    content_ids.push(item.id);
                                });
                            }
                            fbq('track', 'InitiateCheckout', {content_ids:content_ids, value:value, currency:'USD'});
                        }catch(e){}
						try {
							track_event('Begin Payment', param ); 
						}catch(e) {}
						isBegin = false;
                        isRefreshing = false;
					}
					render(json);
				}
			}).fail(function(xhr) {
                location.href='/cart';
            });
		}
	}

    refreshCheckout();

    // gividend user search

    var search_user_ajax = null;
    var $gividend = $(".give-buck");
    if($gividend[0]){
        // workaround for disabling autocomplete
        setTimeout(function(){
            $gividend.find('.gividend_user').val('')
        }, 0);
        $gividend.find('.gividend_user')
            .focus(function(event) {
                var $this = $(this);
                var $gividend = $this.closest('.give-buck');
                var val = $this.val();

                if(!val){
                    search_user_ajax = $.get('/givebuck-default-users.json', {}, function(res) {
                        $gividend.find('.user-list').hide();
                        $gividend.find('.user-list li').remove();
                        for(var i in res.users) {
                            var u = res.users[i];
                            if( u.username == owner )continue;
                            $gividend.find('.user-list').append('<li data-username="'+u.username+'" data-fullname="'+u.fullname+'" data-uid="'+u.id+'"><img src="/_static/_ui/images/common/blank.gif" style="background-image: url(\''+u.profile_image_url+'\')" /><b>'+u.fullname+'<span title="Verified account" class="ic-verified"></span></b><small>@'+u.username+'</small></li>');
                        }
                        if($gividend.find('.user-list > li').length>0) {
                            $gividend.find('.user-list').show();
                            $gividend.find('p.error').removeClass('error');
                        }
                    }).fail(function(xhr) {
                        $gividend.find('.user-list').hide();
                        $gividend.find('.user-list li').remove();
                        $gividend.find("#agree-marketing:not(:checked)").closest('p').addClass('error');
                    });
                }
            })
            .keyup(function(event) {
                var $this = $(this);
                var $gividend = $this.closest('.give-buck');
                var val = $this.val();

                if(search_user_ajax) {
                    search_user_ajax.abort();
                    search_user_ajax = null;
                }

                $gividend.find('input[name=gividend_userid]').val("");

                if(val.search('@')>=0) {
                    $gividend.find('.user-list').hide();
                    return;
                }

                search_user_ajax = $.get('/search-users.json', {'term':val}, function(res) {
                    $gividend.find('.user-list').hide();
                    $gividend.find('.user-list li').remove();
                    for(var i in res) {
                        var u = res[i];
                        if( u.username == owner )continue;
                        $gividend.find('.user-list').append('<li data-username="'+u.username+'" data-fullname="'+u.fullname+'" data-uid="'+u.id+'"><img src="/_static/_ui/images/common/blank.gif" style="background-image: url(\''+u.profile_image_url+'\')" /><b>'+u.fullname+'</b><small>@'+u.username+'</small></li>');
                    }
                    if($gividend.find('.user-list > li').length>0) {
                        $gividend.find('.user-list').show();
                        $gividend.find('p.error').removeClass('error');
                    }
                }).fail(function(xhr) {
                    $gividend.find('.user-list').hide();
                    $gividend.find('.user-list li').remove();
                    $gividend.find("#agree-marketing:not(:checked)").closest('p').addClass('error');
                });
            });
        $gividend.find('.user-list').delegate('li', 'click', function(event) {
            var $gividend = $(this).closest('.give-buck');
            var username = $(this).data('username');
            var name = $(this).data('fullname');
            var uid = $(this).data('uid');
            $gividend.find('.gividend_user').val(username);
            $gividend.find('input[name=gividend_userid]').val(uid);
            $gividend.find('.user-list').hide();
            $gividend.find("#agree-marketing:not(:checked)").closest('p').addClass('error');
        });
        $gividend.find('#agree-marketing').click(function(e){
            var $gividend = $(this).closest('.give-buck');
            if(!$(this).prop('checked')){
                $gividend.addClass('disabled');
            }else{
                $gividend.removeClass('disabled');
            }
        })
        $(document).on('click', ':not(.gividend_user, .user-list)', function(){
            $gividend.find('.user-list').hide();
        })

    }      
})
		
