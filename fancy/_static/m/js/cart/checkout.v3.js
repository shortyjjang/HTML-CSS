$(function(){

	var LETTER_IN_ZIP = ["AR", "BN", "CA", "JM", "MT", "NL", "PE", "SO", "SZ", "GB", "VE"];

	var is_giftcard_cart = false;
	if( $(".cart-new").hasClass("giftcard") ){
		is_giftcard_cart = true;
	}

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
                    var res = JSON.parse(xhr.statusText);
                    error = res.error;
                } catch(e) {
                }
                alert(error || "We failed to process your order. Please try again or contact cs@fancy.com");
            }
		});
	}


	$("select[name=country], select[name=country_code]").change(function(){
		var $wrapper = $(this).closest("fieldset, .frm"), code = $(this).val();
		$wrapper.find("[name=state]").hide();
		if(code=='US' || code=='USA'){
			$wrapper.find("select[name=state]").show();
		}else{
			$wrapper.find("input[name=state]").show();
		}
		if( LETTER_IN_ZIP.indexOf(code) > -1 ){
			$wrapper.find("input[name=zip]").attr('type', 'text');
		}else{
			$wrapper.find("input[name=zip]").attr('type', 'number');
		}
	})

	var Checkout = {};

	Checkout.Shipping = {
		$el : $("#content .checkout > .select-addr.wrap"),
		open : function(){
			this.$el.find("> ul, > a, > p:not(.notify)").hide().end().find("> ul, > a").show();
			this.$el.find("h2.tit").html("<b>Shipping address</b>");
			$(".btn-payment").attr('disabled','disabled');
		},
		close : function(){
			if(this.$el.find("> p:not(.notify)").is(":visible")) return;
			this.$el.find("> ul, > a").hide().end().find("> p:not(.notify)").show();		
			var $addr = this.$el.find("ul li.selected");
			this.$el.find("h2.tit").html("<b>Shipping address</b> · "+$addr.data('nickname'));
		},
		isOpened : function(){
			return this.$el.find("> p").is(":hidden");
		},
		init: function(){
			this.$el
				.on('click', 'p a.edit', function(e){
					e.preventDefault();
					Checkout.Payment.close();
					Checkout.Shipping.open();
				})
				.on('click', 'li input:radio', function(event){
					var $this = $(this), $li = $this.closest('li'), $wrapper = $this.closest('.wrap');
					
					$this.closest('ul').find('li').removeClass('selected').end().end().closest('li').addClass('selected');
					$wrapper.data('addr_id', $this.val());
					$wrapper.find('p > a').html( $li.find('label small').html() );
				})
				// edit shipping
				.on('click', 'li .btn-edit', function(event){
					event.preventDefault();

					var $this = $(this), $li = $this.closest("li"), id = $li.find("input").val();

					$this.closest('body')
						.find('.checkout').hide().end()
						.find('.new-addr').show()
							.find('.tit').html('Edit shipping address').end()
							.find('input,select').each(function() {
								var $this = $(this);
								var name = $this.attr('name');
								var value = $li.data(name);
								if(name=="set_default"){
									this.checked = (value=="True");
								}else if(name=="prev_addr_id"){
									$this.val( $li.data("id") );
								}else{
									$this.val(value);
								}
								if(name=='country'){
									$this.change();
								}
							}).end()
						.end();
				})
				.on('click', '.btn-del', function(){
					var $this = $(this); ;
					var addr_id = $this.closest('li').attr('data-id');
					$.ajax({
						type : 'post',
						url  : '/remove_shipping_addr.json',
						data : {id:addr_id},
						dataType : 'json',
						success  : function(json){
							if(json.status_code === 1){
		                        $(".select-addr li[data-id="+addr_id+"]").remove();
		                        $(".select-addr li[data-set_default=True] input:radio").click();
							} else if (json.status_code === 0){
								if(json.message) alert(json.message);
							}
						}
					})
				})
				.on('click', 'li .btn-ship', function(){
					var $this = $(this), $wrapper = $this.closest(".wrap");
					var addressInfo = null;

					addressInfo = {address_id: $(".select-addr.wrap").data('addr_id')};
					if(!addressInfo.address_id){
						alert('Please select an address');
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
					
				})
				.on('click', "a.go_new", function(e){
					e.preventDefault();

					var $this = $(this);

					$this.closest('body')
						.find('.checkout').hide().end()
						.find('.new-addr').show()
							.find('.tit').html('Ship to a new address').end()
							.find('input,select').each(function() {
								var $this = $(this);
								var name = $this.attr('name');
								if(name=="set_default"){
									this.checked = false;
								}else{
									$this.val( $this.data('default') || '');
								}
								if(name=='country'){
									if( $this.data('default') ){
										$this.val($this.data('default')).change();	
									}else{
										$this.val('US').change();	
									}
								}
							}).end()
						.end();
				})

			$(".new-addr")
				.on('click', 'a.back', function(e){
					e.preventDefault();
					var $this = $(this);
					$this.closest('body')
						.find('.checkout').show().end()
						.find('.new-addr').hide();
				})
				.on('click', '.btn-ship', function(){
					var $this = $(this); $form = $this.closest("form"); var params = getParam($form);
					params.state = $form.find("[name=state]:visible").val();
					params.country_name = $form.find("select[name=country] option:selected").html();
					params.set_default = $form.find("input[name=set_default]")[0].checked;

					Checkout.Shipping.addShippingAddress(params, function(data){						
						var $li = $(".select-addr li.selected");
						if(!params.prev_addr_id){
							var $wrapper = $(".select-addr")
							$li = $( $wrapper.find("ul > script").html() );
							$wrapper.find("ul").append($li);
						}

						for(k in data){
							if( $li.data(k) != undefined){
								$li.data(k, data[k]);
							}					
						}
						$li.data('set_default', data.is_default?"True":"False");
						$li.find("label").html( "<b class='nickname'>"+data.nickname+"</b><br>" + data.fullname+"<br/> "+data.address1+(data.address2?(" "+data.address2):"")+"<br/> "+data.city+(data.state?(", "+data.state):"")+", "+data.zip+"<br/>"+data.country_name+"<small style='display:none'>"+data.fullname+", "+data.address1+(data.address2?(" "+data.address2):"")+", "+data.city+(data.state?(", "+data.state):"")+", "+data.zip+", "+data.country_name+"</small>" );
						$li.find("input:radio").val( data.id ).click();
						
						addressInfo = {address_id: data.id};
						checkoutPutRequest(addressInfo, function(res){
							$this.closest('body')
								.find('.checkout').show().end()
								.find('.new-addr').hide();
							Checkout.Shipping.close();
							if(Checkout.Payment.isConfirmed())
								Checkout.Review.open();
							else
								Checkout.Payment.open();
							refreshCheckout(res);
						});
					});
				})
				.on('keypress', 'input', function(e){
					if( e.keyCode==13) e.preventDefault();
				})
				.on('submit', function(e){
					e.preventDefault();
				})
		},
		addShippingAddress: function(params, callback){		
			function error(msg) {
				if (typeof gettext == 'function') msg = gettext(msg);
				alert(msg);
			}

			if (params.fullname.length < 1) return error('Please enter the full name.');
			if (params.nickname.length < 1) return error('Please enter the shipping nickname.');
			if (params.address1.length < 1) return error('Please enter a valid address.');
			if (params.city.length < 1) return error('Please enter the city.');
			if (params.zip.length < 1) return error('Please enter the zip code.');
			if (params.country == 'US') {
				var phone = params.phone.replace(/\s+/g, ''); 
				if (phone.length < 10 || !phone.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/)) return error('Please specify a valid phone number.');
				if (params.state.length < 1) return error('Please select the state.');
			}else if(params.phone.length < 1){
				return error('Please enter the phone number.');
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
							if (json.message) alert(json.message);
	                        break;
						case 1:
							callback(json);
							break;
					}
				},
				complete : function() {
					
				}
			});
		}

	}

	Checkout.Payment = {
		$el : $("#content .checkout .select-card.wrap, #content .checkout .payment_type.wrap"),
		isConfirmed: function(){
			return this.$el.hasClass("confirm");
		},
		open : function(){
			this.$el.removeClass("disabled").filter('.payment_type').hide().end().filter(".select-card").show().end();
			this.$el.removeClass("confirm");
			$(".btn-payment").attr('disabled','disabled');
			var paymentId = this.$el.closest('.checkout').find(".payment_type.wrap").data('payment_id');

			if ( paymentId == 'alipay' ){
				Checkout.Payment.close();
				Checkout.Review.open();
			}
		},
		close : function(){
			if(this.$el.filter(".payment_type").is(":visible")) return;
			this.$el.hide().filter(".payment_type").show();
			if(this.$el.filter(".payment_type").data('payment_id')){
				this.$el.addClass('confirm').filter(".payment_type").find("> p, > div").show();
			}else{
				this.$el.filter(".payment_type").addClass('disabled').find("> p, > div").hide().end();
			}
		},
		isOpened : function(){
			return this.$el.filter(".payment_type").is(":hidden");
		},
		init : function(){

			function selectPayment($li){
					var $wrapper = $li.closest('.checkout').find(".payment_type.wrap");

					var payment_id = $li.find("input:radio").val();
					
					$li.closest('ul').find('li').removeClass('selected').end().end().addClass('selected');
					$wrapper.data('payment_id', payment_id);
			        $('#bitpay_invoice_id').val(''); // clear bitpay_invoice_id
			        $('#globee_invoice_id').val(''); // clear bitpay_invoice_id

					if(payment_id == 'bitcoin'){
						$wrapper.find(".selected_card")
							.find(".card_name").html( "<i class='card bitcoin'></i> Powered by BitPay").end()
							.find(".username").html("").end()
							.find(".date").html("").end();
					}else if(payment_id == 'crypto'){
						$wrapper.find(".selected_card")
							.find(".card_name").html( "<i class='crypto-bitcoin'>Bitcoin</i><i class='crypto-monero'>Monero</i>").end()
							.find(".username").html("").end()
							.find(".date").html("").end();
					}else if(payment_id == 'alipay'){
						$wrapper.find(".selected_card").html("<span class='card_name'><i class='card alipay'></i> Alipay</span>");						
					}else{
						$wrapper.find(".selected_card")
							.find(".card_name").html( $li.find("b.nickname").html()).end()
							.find(".username").html( $li.data("holder_name")).end()
							.find(".date").html( $li.find("span > small").html()).end();
					}					
					if(is_giftcard_cart){
						$(".btn-payment").removeAttr('disabled');
					}
			}

			this.$el
				.on('click', 'a.edit', function(e){
					e.preventDefault();					
					Checkout.Shipping.close();
					Checkout.Payment.open();
				})
				.on('click', 'ul li input:radio', function(event){
					var $this = $(this);					
					selectPayment( $this.closest('li') );
				})
				.on('click', '.btn-use', function(){
					var $this = $(this), $wrapper = $this.closest(".checkout").find(".payment_type");
					$this.closest("li").find("input:radio").click();
					
					if(!$wrapper.data('payment_id')){
						alert("Please select a credit card");
						return;
					}
					Checkout.Payment.close();
					Checkout.Review.open();
				})
				.on('click', ".coupon_frm button.btn-apply", function(){
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
				.on('click', ".coupon_frm a.remove-coupon_", function(e){
					e.preventDefault();
					var code = $(this).attr('code');
					var couponInfo = {"apply_coupon":false, "coupon_code":code};

					checkoutPutRequest(couponInfo, function(res){
						refreshCheckout(res);
					});
				})
				.on('click', "a.go_new", function(e){
					var dlg = $(".update-card");
					dlg.find('input,select').each(function() {
						var $this = $(this);
						var name = $this.attr('name');
						if(name=="set_default"){
							this.checked = false;
						}else{
							$this.val('');
						}
						if(name=='country_code'){
							var defaultCountryCode = $(".select-card ul li.selected").data('country_code')||'US';
                        	var defaultCountry = dlg.find("p.country [name=country_code] [data-code2="+defaultCountryCode+"]").val();
							$this.val(defaultCountry).change();
						}
					});
					var $addr = Checkout.Shipping.$el.find("ul li.selected");
					dlg.find("[name=shipping_street_address]").val($addr.data('address1'));
					dlg.find("[name=shipping_street_address2]").val($addr.data('address2'));
					dlg.find("[name=shipping_city]").val($addr.data('city'));
					dlg.find("[name=shipping_country_code]").val( $addr.data('country'));
					dlg.find("[name=shipping_state]").val($addr.data('state'));
					dlg.find("[name=shipping_postal_code]").val($addr.data('zip'));
					dlg.find("#same_addr").prop('checked',true);
					dlg.find(".frm.address > p:not(.use)").hide();
					dlg.find(".btn-use").removeAttr('disabled');

					$(this).closest('body').addClass('payment').find('.checkout').hide().end().find('.update-card').show();
				})

			$(".update-card")
				.on('click', 'a.back', function(e){
					e.preventDefault();
					var $this = $(this);
					$this.closest('body').removeClass('payment')
						.find('.checkout').show().end()
						.find('.update-card').hide();
				})
				.on('change', '#same_addr', function(){
					var dlg = $(".update-card");
					if( $(this).prop('checked') ){
						dlg.find(".frm.address > p:not(.use)").hide();
					}else{
						dlg.find(".frm.address > p:not(.use)").show();
					}
				})
				.on('click', '.btn-use', function(){
					var $this = $(this);
					$this.attr('disabled','disabled');
					var $wrapper = $("#content .checkout .select-card.wrap");
					var $form = $(".update-card");
					var params = getParam($form);
					
					if($form.find("#same_addr")[0].checked){
						for(k in params){
							if( k.startsWith("shipping_") ){
								var k2 = k.replace('shipping_','');
								params[k2] = params[k];
								delete params[k];
							}
						}
					}else{
						params.country_code = $form.find('[name=country_code]').find('option[value='+params.country_code+']').attr('data-code2');
						params.state = $form.find("[name=state]:visible").val();
						params.set_default = $form.find("input[name=set_default]")[0].checked;
					}

					Checkout.Payment.addNewCard(params, function(data){						
						$this.removeAttr('disabled');

						if(!data.card_id){
							alert(data.message||"Please input valid credit card info");
							return;
						}

						var $li = $( $wrapper.find("ul > script").html() );
						$wrapper.find("ul").append($li);
						$li.data('holder_name', data.card_holder_name).data('last_digits', data.card_last_digits).data('type', data.card_type).data('billing_address', data.card_holder_name+", "+data.billing_address.address1+", "+data.billing_address.city+", "+data.billing_address.state+", "+data.billing_address.postal_code+", "+data.billing_address.country);
						$li.find("label i.card").addClass( (data.card_type||'').toLowerCase() );
						$li.find("b.nickname").html("<i class='card "+(data.card_type||'').toLowerCase()+"'></i> "+data.card_type + " ****"+data.card_last_digits);
						$li.find("span").html(data.card_holder_name+" <small>Expires "+data.card_expiration+"</small>" );
						$li.find("label").attr("for","card_"+data.card_id);
						$li.find("input:radio").attr("id","card_"+data.card_id).val( data.card_id ).click();
						$this.closest('body').removeClass('payment').find('.checkout').show().end().find('.update-card').hide();

						selectPayment( $li );

						Checkout.Payment.close();
						Checkout.Review.open();
					}, function(){
						$this.removeAttr('disabled');
					});
				})
				
			if( this.$el.find("ul li.selected input:radio").length )
				this.$el.find("ul li.selected input:radio").click();
		},
		addNewCard: function(params, callback, callback_error){
		
			function error(msg) {
				if (typeof gettext == 'function') msg = gettext(msg);
				callback_error();
				alert(msg);
			}
			
			// check required fields
			if (!params.name)return error('Please enter the full name.');
			if (!params.street_address) return error('Please enter a valid address.');
			if (!params.city) return error('Please enter the city.');
			if (!params.postal_code) return error('Please enter the zip code.');
		
			if (!Stripe.card.validateCardNumber(params.card_number)) return error('Please enter a valid card number.');
			if (!Stripe.card.validateCVC(params.security_code)) return error('Please enter a valid security code.');
			if (!Stripe.card.validateExpiry(params.expiration_month, params.expiration_year)) return error('Please enter a valid expiration date.');
			
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
                    if (response.error) {
                        // we did something unexpected - check response.error for details
                        callback_error();
                        if ('message' in response.error) {
                            alert(response.error.message);
                        }
                    } else {
                        var endpoint, payload;
                        endpoint = '/settings/cards/stripe/add-card.json';
                        payload = { 'card_token': response['id'], 
                            'address1': params.street_address, 'address2': params.street_address2,
                            'city': params.city, 'state': params.state, 'country': params.country_code,
                            'postal_code': params.postal_code, 'set_default': params.set_default };
                        if (recaptcha_token) payload['recaptcha_token'] = recaptcha_token;
                        $.ajax({
                            type: 'post', url: endpoint, data: payload,
                            success : function(response) {
                                callback(response);
                            },
                            complete : function() {
                                
                            },
                            error : function(res) {
                                var message = "Failed to add a credit card. please try again";
                                if (res.responseText) {
                                    try {
                                        var json = JSON.parse(res.responseText)
                                        if (json.message) message = json.message;
                                    } catch(e) {}
                                }
                                callback_error();
                                alert(message);
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
		}
	}



	
	Checkout.Review = {
		open : function(){
			$(".review").removeClass("disabled").find("> .cart-item").show().find("> *:not(.sdd_option)").show();
			$(".summary").show();
            refreshCheckout();
		},
		close : function(){
			$(".summary, .review > .cart-item").hide();
		},
		init: function(){
			$('#content')
				.on('click', '.review .delivery-option a', function(event){
					event.preventDefault();
					if( $(this).closest(".delivery-option").hasClass('disabled')) return;
					var seller = $(this).closest(".cart-item").data('seller_data');
					var seller_id = $(this).closest(".cart-item").attr('seller_id');
					var dlg = $("div.delivery-type");
					var optionSddTemplate = dlg.find("#delivery_sdd_template").html();
					dlg.find("ul > li").remove();

					dlg.data('seller_id', seller_id);
					var shipping_options_length = $(seller.shipping_options).length;
					$(seller.shipping_options).each(function(){
						var amount = "$"+this.amount.toFixed(2);
						if(this.amount==0){
							amount = "Free";
						}
						var html = "";
						html = "<li><input type='radio' id='seller_shipping_"+k+"_"+this.id+"' name='seller_shipping_"+k+"' value='"+this.id+"' "+(this.id==seller.shipping_selected?'checked':'')+"> <label for='seller_shipping_"+k+"_"+this.id+"'><b>"+this.label+" - "+amount+"</b> <small>"+this.detail+"</small></label></li>";

						var $html = $(html);
						if(this.id == "3"){
							var $sddEl = $(optionSddTemplate);
							if(seller.sameday_is_today){
								$sddEl.find("select.date").val('today');
							}else{
								$sddEl.find("select.date").val('tomorrow');
							}

							var range = seller.sameday_order_by_delivery_by?seller.sameday_order_by_delivery_by.split('-'):[12,17];
							$sddEl.find('select.start, select.end').empty();
							for(var i=range[0]; i<=range[1]; i++){
								var time = i>=12?( (i>12?(i-12):i)+'PM'):(i+'AM');
								if( i!=range[1] ){
									$sddEl.find('select.start').append('<option value="'+i+'" '+(i==range[0]?'selected':'')+'>'+time+'</option');
								}
								if( i!=range[0] ){
									$sddEl.find('select.end').append('<option value="'+i+'" '+(i==range[1]?'selected':'')+'>'+time+'</option');
								}
							}

							if(seller.sameday_delivery){
								if(seller.sameday_delivery.delivery_at){
									var range = seller.sameday_delivery.delivery_at.split('-');
									$sddEl.find('select.start').val(range[0]);
									$sddEl.find('select.end').val(range[1]);
								}
								if(seller.sameday_delivery.delivery_on){
									$sddEl.find("select.date").val(seller.sameday_delivery.delivery_on);
									if(!seller.sameday_is_today && seller.sameday_delivery.delivery_on=='today'){
										seller.sameday_delivery.delivery_on = 'tomorrow';
										$sddEl.find("select.date").val(seller.sameday_delivery.delivery_on).change();
									}							
								}
							}
							if(seller.sameday_message){
								$sddEl.find('textarea').val(seller.sameday_message[seller_id]).show().prev().hide();
							}
							$html.append($sddEl);
						}
						dlg.find("ul").append($html);
					})
					if( seller.shipping_selected == "3"){
						$(".delivery-type").find("fieldset").show().end().find("#seller_shipping_3").click();
					}

					$(this).closest('body').addClass('payment').find('.checkout').hide().end().find('.delivery-type').show();
				})
				.on('click', '.review .optional .note', function(event){
					event.preventDefault();
					var seller_id = $(this).closest('[seller_id]').attr('seller_id');
					var note = $(this).data('note')||'';
					var dlg = $("div.seller-note");
					
					dlg.data('seller_id',seller_id).find("textarea").val(note).end();

					$(this).closest('body').find('.checkout').hide().end().find('.seller-note').show();
				})
				.on('click', '.review .optional .note a.delete', function(event){
					event.preventDefault();
					event.stopPropagation();
					var seller_id = $(this).closest('[seller_id]').attr('seller_id');
					var noteInfo = {'note_info':{}};
					noteInfo.note_info[seller_id] = '';

					checkoutPutRequest(noteInfo, function(res) {
						refreshCheckout(res);
					});
				})
				.on('click', '.review .optional .gift', function(event){
					event.preventDefault();
					var seller_id = $(this).closest('[seller_id]').attr('seller_id');
					var is_gift = true;
					var gift_message = $(this).data('gift_message')||'';
					var dlg = $("div.gift-option");
					
					dlg.data('seller_id',seller_id).find("textarea").val(gift_message).end();
					dlg.find("input:checkbox")[0].checked = is_gift;
					if(is_gift){
						dlg.find("textarea").removeAttr('disabled');	
					}else{
						dlg.find("textarea").attr('disabled','disabled');	
					}
					
					$(this).closest('body').find('.checkout').hide().end().find('.gift-option').show();
				})
				.on('click', '.review .optional .gift a.delete', function(event){
					event.preventDefault();
					event.stopPropagation();
					var seller_id = $(this).closest('[seller_id]').attr('seller_id');
					var giftInfo = {'gift_info':{}};
					giftInfo.gift_info[seller_id] = {"is_gift": false, "gift_message": ''};

					checkoutPutRequest(giftInfo, function(res) {
						refreshCheckout(res);
					});

				})
                .on('click','.review .action a.save_for_later', function(event) {
					event.preventDefault();
					var $this = $(this);
					$this.addClass('disabled');
					var item_id = $this.data('item_id');
					var option_id = $this.data('option_id');

					var url = "/rest-api/v1/checkout/item/"+item_id+(option_id?"/option/"+option_id:"")+"/later";

					$.ajax({
						type : 'POST',
						url  : url,
						data : {},
						dataType : 'json',
						success  : function(res){
							refreshCheckout();
						},
						complete : function(){
							$this.removeClass('disabled');
						}
					});
                })
                .on('click','.review .action a.remove', function(event) {
					event.preventDefault();
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

			$("div.seller-note")
				.on('click', 'a.back', function(e){
					e.preventDefault();
					$(this).closest('body').find('.checkout').show().end().find('.seller-note').hide();
				})
				.on('click', 'button.btn-save', function(){
					var seller_id = $("div.seller-note").data('seller_id');
					var note = $("div.seller-note").find("textarea").val();

					var noteInfo = {'note_info':{}};
					noteInfo.note_info[seller_id] = note;

					checkoutPutRequest(noteInfo, function(res) {
						refreshCheckout(res);
					});
					$(this).closest('body').find('.checkout').show().end().find('.seller-note').hide();
				})
			$("div.gift-option")
				.on('click', 'a.back', function(e){
					e.preventDefault();
					$(this).closest('body').find('.checkout').show().end().find('.gift-option').hide();
				})
				.on('click', 'input:checkbox', function(){
					if( this.checked ){
						$("div.gift-option").removeAttr('disabled');	
					}else{
						$("div.gift-option").attr('disabled','disabled');	
					}
				})
				.on('click', 'button.btn-save', function(){
					var seller_id = $("div.gift-option").data('seller_id');
					var is_gift = $("div.gift-option").find("input:checkbox")[0].checked;
					var gift_message = $("div.gift-option").find("textarea").val();

					var giftInfo = {'gift_info':{}};
					giftInfo.gift_info[seller_id] = {"is_gift": is_gift, "gift_message": gift_message};

					checkoutPutRequest(giftInfo, function(res) {
						refreshCheckout(res);
					});

					$(this).closest('body').find('.checkout').show().end().find('.gift-option').hide();
				})

			$("div.delivery-type")
				.on('click', 'a.back', function(e){
					e.preventDefault();
					$(this).closest('body').find('.checkout').show().end().find('.delivery-type').hide();
				})
				.on('click', 'input:radio', function(e){
					if( $(this).val() == 3 ){
						$(".delivery-type ul li fieldset").show();
					}else{
						$(".delivery-type ul li fieldset").hide();
					}
				})
				.on('change', 'select.start, select.end', function(){
					var dlg = $("div.delivery-type");
					var delivery_at_start = dlg.find("select.start").val();
					var delivery_at_end = dlg.find("select.end").val();
					if(delivery_at_end<delivery_at_start){
						if( $this.is('.start')){
							delivery_at_end = delivery_at_start;
							dlg.find("select.end").val(delivery_at_start);
						}else{
							delivery_at_start = delivery_at_end;
							dlg.find("select.start").val(delivery_at_end);
						}
					}
				})
				.on('click', 'button.btn-save', function(){
					var dlg = $("div.delivery-type");
					var seller_id = parseInt(dlg.data('seller_id'));
					var deliveryOption = dlg.find("input:radio:checked").val();
					var delivery_on = dlg.find("select.date").val();
					var delivery_at_start = dlg.find("select.start").val();
					var delivery_at_end = dlg.find("select.end").val();
					var samedayMessage = dlg.find("textarea").val();

					var info = {"shipping_option":{}};
					info['shipping_option'][seller_id] = parseInt(deliveryOption);
					if(deliveryOption == '3'){
						info['sameday_delivery'] = {};
						info['sameday_message'] = {};
						info['sameday_delivery'][seller_id] = {"delivery_on":delivery_on, "delivery_at":delivery_at_start+"-"+delivery_at_end};
						info['sameday_message'][seller_id] = samedayMessage||"";
					}
					
					checkoutPutRequest(info, function(res) {
						refreshCheckout(res);
					});

					$(this).closest('body').find('.checkout').show().end().find('.delivery-type').hide();
				})

		}
	}
	

	Checkout.Shipping.init();
	Checkout.Payment.init();
	Checkout.Review.init();
	if(is_giftcard_cart) Checkout.Payment.open();
	
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
		});
	};

	function renderShippingInfo(data){
		if(! Object.keys(data.sale_items_freeze)[0]) return;

        var addrTemplate = $("script#address_template").html();
        $.each(data.shipping_info.addresses, function(idx, data) {
            if ($(".select-addr li input:radio[value="+data.id+"]").length == 0) {
                $li = $(addrTemplate);
                if (!data.nickname && data.alias) data.nickname = data.alias;
                if (!data.fullname && data.full_name) data.fullname = data.full_name;
                for(k in data){
                    if( $li.data(k) != undefined){
                        $li.data(k, data[k]);
                    }					
                }
                $li.data('set_default', data.is_default?"True":"False");
                $li.find("label").html( "<b class='nickname'>"+data.nickname+"</b><br>" + data.fullname+"<br/> "+data.address1+(data.address2?(" "+data.address2):"")+"<br/> "+data.city+(data.state?(", "+data.state):"")+", "+data.zip+"<br/>"+data.country_name+"<small style='display:none'>"+data.fullname+", "+data.address1+(data.address2?(" "+data.address2):"")+", "+data.city+(data.state?(", "+data.state):"")+", "+data.zip+", "+data.country_name+"</small>" );
                $li.find("input:radio").val( data.id );
                $(".select-addr ul").append($li);
            }
        });

		var addrId = data.sale_items_freeze[Object.keys(data.sale_items_freeze)[0]].shipping_addr_id;
		if($(".select-addr li input:radio[value="+addrId+"]").length)
			$(".select-addr li input:radio[value="+addrId+"]").click();
		else
			$(".select-addr li input:radio:first").click();
        if (window.pay_with_google) {
            Checkout.Shipping.close();
        }
	}

	function renderSummary(data){
		var $frm = $(".summary");        
    
	    var total_in_cent = Math.round(parseFloat(data.total_prices) * 100);
        $("body").data("total_prices_in_cent", total_in_cent);

		$frm.find("li.total .total_price_").html("$"+addCommas(data.total_prices));
		$frm.find("li.subtotal_ .subtotal_price_").html("$"+addCommas(data.subtotal_prices));

		var shipping_promotion_amount = (data.extra_info.free_shipping_promotion && parseFloat(data.extra_info.free_shipping_promotion.total)) || 0;
        var shipping_discount_amount = parseFloat(data.shipping_discount_amount) || 0
        var shipping_cost = parseFloat(data.shipping_costs) || 0
        $frm.find("li.shipping_ .price.before-discount").hide()
		$frm.find("li.shipping_ .price").html("$"+addCommas(data.shipping_costs));
        if(shipping_discount_amount > 0 || shipping_promotion_amount > 0) {
		    $frm.find("li.shipping_ .price:not(.before-discount)").html("$"+addCommas( (shipping_cost-shipping_discount_amount-shipping_promotion_amount).toFixed(2) ) )
		    $frm.find("li.shipping_ .price.before-discount").show()
        }

		$frm.find("li.tax_ .tax_").html("$"+addCommas(data.sales_taxes));

		if(data.extra_info && data.extra_info.is_vanity) {
			var vanity;
			for(k in data.sale_items_freeze) {
				vanity = data.sale_items_freeze[k].items[0];
				break;
			}
			$frm.find("li.vanity_num .price").html(vanity.option);
			$frm.find("li.vanity_price .price").html("$"+addCommas(vanity.item_price));
		}

		var coupon_amount = parseFloat(data.coupon_amount)||0;
        if(shipping_discount_amount>0) {
            coupon_amount = Math.max(coupon_amount - shipping_discount_amount,0)
        }

		var fancyRebate = 0;
		for(k in data.sale_items_freeze){
			var item = data.sale_items_freeze[k];
			if(item.fancy_rebate) fancyRebate+= item.fancy_rebate;
		}
		if(coupon_amount > 0)
			$frm.find("li.coupon_").show().find(".coupon_amount_").html("- $"+addCommas(coupon_amount.toFixed(2)));
		else
			$frm.find("li.coupon_").hide();

		if(fancyRebate > 0)
			$frm.find("li.rebate_").show().find(".fancy_rebate_").html("- $"+addCommas(fancyRebate.toFixed(2)));
		if(data.fancy_money_amount > 0)
			$frm.find("li.giftcard_").show().find(".fancy_gift_card_").html("- $"+addCommas(data.fancy_money_amount));

		$frm.find(".currency_price").attr('price', data.total_prices);
		refresh_currency();
	}

	function renderSaleItems(data){
		var sellerTemplate = $("script#seller_template").html();
		var itemTemplate = $("script#cart_item_template").html();
        var payment_method = 'stripe';
		var itemCount = 0;

        if(Object.keys(data.sale_items_freeze).length==0) {
            location.href = "/cart";
            return;
        }

        if(data.payment_gateway == 5) {
            payment_method = 'coinbase';
        } else if(data.payment_gateway == 21) {
            payment_method = 'bitpay';
        } else if(data.payment_gateway == 21) {
            payment_method = 'globee';
        } else if (window.pay_with_google) {
            payment_method = 'pay with google';
        } else if (window.use_amex_express){
            payment_method = 'amex checkout';
        }
        var $couponArea = $(".payment_type .coupon_frm");
        if( !$(".wrap.payment_type").hasClass('disabled')){
        	$couponArea.show();
        }
        var couponInfo = [];
        for(var key in data.sale_items_freeze) {
            coupons = data.sale_items_freeze[key].coupons;
            if(coupons) {
                couponInfo = couponInfo.concat(coupons);
            }
        }
        couponInfo = couponInfo && couponInfo[0];
        if( couponInfo ){        	
        	$couponArea.find("ul li").html("<b>"+couponInfo.code+ " · <a href='#' class='remove-coupon_' code='"+couponInfo.code+"'>Remove</a></b> "+couponInfo.description);
        	$couponArea.addClass('opened').find('dd').find(">input,>button,>div").hide().end().find(">ul").show();
        }else{
        	$couponArea.find('dd').find(">input,>button").css('display','inline-block').end().find(">div,>ul").hide();
        }

        var isAvailable = true;
        $(".review [seller_id]").attr("mark-delete",true);
		for(k in data.sale_items_freeze){
			var seller = data.sale_items_freeze[k];
			var $sellerEl = $(".review [seller_id="+k+"]");
			if(!$sellerEl.length) {
                $sellerEl = $(sellerTemplate);
                if ($(".summary").is(":visible")) $sellerEl.show();
            }
			$sellerEl.attr('seller_id', k);
			$sellerEl.find('> h5').html(seller.items[0].brand_name);

			if(!seller.checkout_available) isAvailable = false;
			
			$sellerEl.find("[item_id]").attr("mark-delete", true);
			
            var contains_shippable_item = false;
			$(seller.items).each(function(){
				var item = this;
				
				var $el = $sellerEl.find("[item_id="+item.id+"]");
				if(!$el.length) $el = $(itemTemplate);
				$el.attr('item_id', item.id)
					.find(".stit")
						.find("a").attr("href", this.item_url).html(this.title).end()
						.find("img").css("background-image","url('"+this.image_url+"')").end()
					.end()
					.find(".price").html("Price: $"+addCommas(this.item_price.replace(".00",""))+" <small>USD</small>").end()
					.find(".qty").html('Quantity: '+this.quantity).end();
				if(parseInt(this.item_retail_price) && this.item_price!=this.item_retail_price){
					$el.find(".price").addClass("sales").html('Price: <small class="before">'+ "$"+addCommas(this.item_retail_price.replace(".00",""))+'</small>'+" $"+addCommas(this.item_price.replace(".00","")))
				}
				if(this.option_id){
					$el.find("._option").show().html(this.option);
				}
				
				if(item.error_message){
					$el.find(".error").html(item.error_message).show();
					$el.find(".action").show().end().removeClass('hide-action');
					$el.find(".delivery-option").hide();
					$el.find("a.save_for_later, a.remove").data('cid', item.id).data('sicid', item.id).data('item_id', item.sale_id).data('option_id', item.option_id);
				}else{
					$el.find(".error, .action").hide().end().addClass('hide-action');
					$el.find(".delivery-option").show();
                    contains_shippable_item = true;
				}
				if(item.personalizable){
					$el.find(".personalization").show().find("em").text(item.personalization);
				}else{
					$el.find(".personalization").hide();
				}

				$el.removeAttr('mark-delete');
				$el.appendTo( $sellerEl.find("ul") );
				itemCount++;
			})

			$sellerEl.find(".delivery-option selected").empty();
			$sellerEl.data('seller_data', seller);
			if (seller.items[0].item_type != 'VANITY') {
				$(seller.shipping_options).each(function(){
					var amount = "$"+this.amount.toFixed(2);
					if(this.amount==0){
						amount = "Free";
					}
					if(this.id==seller.shipping_selected){
						$sellerEl.find(".delivery-option a").html("<label>"+this.label+" - "+amount+"</label> <small>"+this.detail+"</small>");
					}
				})
				if( seller.shipping_options.length == 1){
					$sellerEl.find(".delivery-option").addClass('disabled');
				}else{
					$sellerEl.find(".delivery-option").removeClass('disabled');
				}
				if( !seller.shipping ){
					$sellerEl.find('.delivery-option').addClass('free');
				}else{
					$sellerEl.find('.delivery-option').removeClass('free');
				}
			}

			$sellerEl.find("[item_id][mark-delete]").remove();

			var note = data.note_info[ k ];
			var giftInfo = data.gift_info[ k ];
			
			if(note){
				$sellerEl
					.find("div.note").data('note',note||'').show()
						.find("> p > span").html(note).end()
					.end()
					.find("a.add.note").hide();
			}else{
				$sellerEl
					.find("a.note").css('display','block').end()
					.find("div.note").data('note','').hide();
			}
			if(giftInfo && giftInfo.is_gift) {
				$sellerEl 
					.find("div.gift").data('is_gift',true).data('gift_message',giftInfo.gift_message||'').show()
						.find("> p > span").html(giftInfo.gift_message||'No gift message added').end()
					.end()
					.find("a.add.gift").hide();
			}
			else {
				$sellerEl
					.find("a.gift").css('display','block').end()
					.find("div.gift").data('is_gift',false).data('gift_message','').hide();
			}

            if(contains_shippable_item) {
                $sellerEl.find(".optional").show();
            } else {
                $sellerEl.find(".optional").hide();
            }

			$sellerEl.removeAttr('mark-delete');
			$sellerEl.appendTo($(".review"));
            try {
                track_event('Begin Checkout', { 'payment method': payment_method, 'type': 'saleitem', 'seller id': k});
            }catch(e) {}
		}
		$(".review [seller_id][mark-delete]").remove();

		if(isAvailable && !Checkout.Shipping.isOpened() && !Checkout.Payment.isOpened()){
			$(".btn-payment").removeAttr('disabled');
		}else{
			if (!window.use_amex_express) {
				$(".btn-checkout").attr('disabled', 'disabled');
			}
		}
		
	}
        var initialRender = true;
	function render(data){
		$("[name=checkout_id]").val(data.id);

		if( !$(".cart-new").hasClass("giftcard") ) {
			renderShippingInfo(data);
			renderSummary(data);
			renderSaleItems(data);
		}

		if(data.payment_gateway == 6 && initialRender) {
            if(data.sale_items_freeze.credit_cards && data.sale_items_freeze.credit_cards.cards[0]){
                $("[name=payment_id]").val(data.sale_items_freeze.credit_cards.cards[0].id);
            }
            $("#alipay").hide();
            initialRender = false;
        } else if(data.payment_gateway == 5 && initialRender) {
        	$("#alipay").hide();
            //$(".select-card").find("ul > li").hide().end().find("a.go_new").hide();
            $("#bitcoin").find("input").attr('checked','checked').click();
            if (data.bitcoin_code) {
                $('#coinbase_button_code').attr('value', data.bitcoin_code);
            }
            initialRender = false;
        } else if(data.payment_gateway == 21 && initialRender) {
            $("#alipay").hide();
            //$(".select-card").find("ul > li").hide().end().find("a.go_new").hide();
            $("#bitcoin").show().find("input").attr('checked','checked').click();
	    	if (data.bitpay) {
                $('#bitpay_invoice_id').attr('value', data.bitpay.invoice_id).attr('testmode', data.bitpay.testmode);
            }
            initialRender = false
		} else if (data.payment_gateway == 23 && initialRender) {
            $("#alipay, #bitcoin").hide();
		    $("#crypto").show().find("input").attr('checked','checked').click();
		    if (data.globee) {
                $('#globee_invoice_id').attr('value', data.globee.invoice_id).attr('testmode', data.globee.testmode);
            }
	    	initialRender = false; 
        } else if(data.payment_gateway == 19 && initialRender) {
        	$("#bitcoin").hide();
            $(".select-card").find("ul > li").hide().end().find("a.go_new").hide();
            $("#alipay").show().find("input").attr('checked','checked').click();
            initialRender = false;
        }
	}

	var isBegin = true;
	function refreshCheckout(json){
		window.TrackingEvents.Data.purchase = json;
		if(json){
			render(json);
		}else{
            var method = "GET", params = location.args;
            if (isBegin && window.checkout_post_param) {
                method = "POST";
                params = window.checkout_post_param;
            } else if (isBegin && window.payment_gateway) {
                method = "POST";
                params = { payment_gateway:window.payment_gateway };
            }
			$.ajax({
				type : method,
				url  : '/rest-api/v1/checkout',
				data : params,
				success  : function(json){
					if(isBegin){
						var param = {'payment method':'stripe', type:'saleitem'}
						if( json.payment_gateway == 5){
							param['payment method'] = 'coinbase';
						} else if( json.payment_gateway == 21){
							param['payment method'] = 'bitpay';
						}else if( json.payment_gateway == 19){
							param['payment method'] = 'alipay';
						}else if (window.use_amex_express){
							param['payment method'] = 'amex checkout';
						}
						if( $(".cart-new").hasClass("giftcard") ){
							param['type'] = 'giftcard';
						}else{
							param['seller id'] = Object.keys( json.sale_items_freeze).join(", ");						
						}
                        if (!window.pay_with_google) {
                            track_event('Begin Payment', param );
                        }
                        $("#loading").hide().empty();
                        $(".checkout").show();
						isBegin = false;
					}
					render(json);
				}
			}).fail(function(xhr) {
                var error = null;
                try {
                    var res = JSON.parse(xhr.statusText);
                    error = res.error;
                } catch(e) {
                }
                alert(error || "We failed to process your order. Please try again or contact cs@fancy.com");
                location.href='/cart';
			});
		}
	}

	if(!is_giftcard_cart){
        $("#loading").show().append(new Spinner({ color: '#999999' }).spin().el);
        if (window.pay_with_google) {
            Checkout.Review.open();
        } else {
            refreshCheckout();
        }
	}

	// currency approximately
	var str_currency = $('.summary .currency_price').eq(0).text();
	
	var $currency = $('.summary .currency_price');
		
	function refresh_currency(){
		$currency.text(str_currency);

		// get currency
		$currency.each(function(i,v){
			var $this = $(v);
			if($this.attr('price') && parseFloat($this.attr('price'))>0){	
				if ($this.attr('currency')) {
	                show_currency(v, $this.attr('currency'));
				} else {
					setTimeout(function(){
						$.ajax({
							type : 'GET',
							url  : '/get_my_currency.json',
							dataType : 'json',
							success  : function(json){
								if(json && json.currency_code) show_currency(v, json.currency_code);
							}
						});
					},100)
				}
			}else{
				$this.closest(".currency").hide();
			}
		})	
	};

	function text_currency(el, money, code, symbol, natural_name) {

		if(typeof(money) == 'number') {
			money = money.toFixed(2);
		}
		money = money.replace(/[ \.]00$/,'');

		var str = str_currency.replace('...', symbol+" "+money+' <small>'+code+'</small>');
		$(el).html(str);
        $(el).attr('currency', code);
        $(el).closest(".currency").find(".country > a").html(natural_name);
	};		

	function show_currency(el, code, set_code){
		var p = $(el).attr('price');

		if(window.numberType === 2) p = p.replace(/,/g, '.').replace(/ /g, '');
		p = p.replace(/,/g, '');

		if(set_code) {
			$.ajax({
				type : 'POST',
				url  : '/set_my_currency.json',
				data : {currency_code:code}
			});
		}

		if(code == 'USD') {			
			$(el).attr('currency', code);
		    return $(el).closest(".currency").hide();
		}else{			
			$(el).closest(".currency").find(".country, .currency_price").show();
		}

		text_currency(el, '...', code, '');
		
		$.ajax({
			type : 'GET',
			url  : '/convert_currency.json?amount='+p+'&currency_code='+code,
			dataType : 'json',
			success  : function(json){
				if(!json || typeof(json.amount)=='undefined') return;
				var price = json.amount.toFixed(2) + '', regex = /(\d)(\d{3})([,\.]|$)/;
				while(regex.test(price)) price = price.replace(regex, '$1,$2$3');

				if(window.numberType === 2) price = price.replace(/,/g, ' ').replace(/\./g, ',');

				text_currency(el, price, json.currency.code, json.currency.symbol, json.currency.natural_name);
			}
		});
	};

})
		
