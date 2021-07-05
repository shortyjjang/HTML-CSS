(function($){
	function getParam($form) {
		var arrParam = $form.serializeArray(), params = {}, i, c;

		for (i=0,c=arrParam.length; i < c; i++) {
			params[arrParam[i].name] = arrParam[i].value;
		}

		return params;
	};

	function formatMoney(money, sample){
		var type2 = /,23/.test(sample);

		if(typeof money == 'string') money = parseFloat(money.replace(/[^\d\.]+/g,''));

		money = (money+'').split('.');
			money[0] = money[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
		money = money.join('.');

		return money;
	};


	var default_address = {country:'US', state:'AL', city:'', zip:''};
    var $addback = $(".cart_ ul li.add-back").remove();
    // initialize underscore templates
    $('script[type="template"]').each(function(){
        var $tpl = $(this);
        $tpl.parent().data('template', _.template($tpl.remove().html()));
    });

    function start_loading() {
        $('#wrap').addClass('loading');
    }

    function finish_loading() {
        $('#wrap').removeClass('loading');
    }

    function refresh_cart(cart, keep_list) {
        var items_total = 0;
        var available = true;
        $.each(cart.items, function(idx, item) {
            items_total += item.quantity;
            if(!item.available) available = false;
        });
        $('.cart_ h2.tit').text(items_total+" item"+(items_total>1?'s':'')+" in cart");

        var $items = $('.cart_ ul.cart-item-detail');
        if(!keep_list){
        	if(cart.items.length){
        		$items.show().html($items.data('template')({items: cart.items}));	
        	}else{
        		$(".cart_")
        			.find("h2.tit").html("Cart").end()
        			.find("> div, >ul, >button").hide().end()
        			.find("> div.empty").show();
        	}
        }

        $('.order-price-summary').show()
            .find('.price').text('$'+cart.subtotal_price||'0.00');

        if(available){
            $(".btn-checkout_").removeAttr('disabled');
        }else{
            $(".btn-checkout_").attr('disabled','disabled');
        }
    }

    function get_cart(params, do_finish_loading, keep_list) {
        params.checkout = false;
        $.ajax({
            type: 'get', dataType: 'json', contentType: 'application/json',
            data: params,
            url: '/rest-api/v1/carts/saleitem/'+seller_id,
            success: function(cart) {
                refresh_cart(cart, keep_list);
                if (do_finish_loading) finish_loading();
            }
        });
    }

    function update_cart_item(item_id, option_id, quantity, revert_quantity) {
        start_loading();
        $.ajax({
            type: 'put', dataType: 'json', contentType: 'application/json',
            data: JSON.stringify({option_id: option_id, quantity: quantity}),
            url: '/rest-api/v1/carts/saleitem/items/'+item_id,
            success: function(item) {
                get_cart(default_address, true);
            },
            error: function(xhr) {
                if (xhr.responseJSON) {
                    if ($.inArray("quantity", xhr.responseJSON.error_fields >= 0)) {
                        alert("You can only order a maximum quantity of "+xhr.responseJSON.quantity+" for this item.");
                    }
                }
                revert_quantity();
                finish_loading();
            }
        });
    }

    function delete_cart_item(item_id, callback) {
        start_loading();
        $.ajax({
            type: 'delete', dataType: 'json', contentType: 'application/json',
            url: '/rest-api/v1/carts/saleitem/items/'+item_id,
            success: function(item) {
                if(callback) callback();
                else get_cart(default_address, true);
            },
            error: function(xhr) {
                finish_loading();
            }
        });
    }

    start_loading();
    get_cart(default_address, true);

    // cart - update, remove
    $('div.cart_')
        .on('change', 'select.option_', function(){
            var $this = $(this), $row = $this.closest('.item_');
            var item_id = $row.attr('id');
            var option_id = $this.val();
            var quantity = $row.find(".qty select").val();
            
            if($this.find('option:selected').data('remaining-quantity') < quantity){
                var quantity = $this.find('option:selected').data('remaining-quantity');

                alert($this.find("option:selected").html()+" has only "+quantity+" in stock. We've updated the quantity for you.");
                quantity = $this.find('option:selected').data('remaining-quantity');             
            }

            update_cart_item(item_id, option_id, quantity);
        })
        .on('change', '.qty > select', function(){
            var $this = $(this), $row = $this.closest('.item_');

            var item_id = $row.attr('id');
            var option_id = $row.find(".option select").val()||'';
            var quantity = $this.val();
            
            update_cart_item(item_id, option_id, quantity);
        })
        .on('click', '.remove-item_', function(event){
            var $this=$(this), $li=$this.closest('li');

            delete_cart_item( $li.attr('id'), function(){
                    get_cart(default_address, true, true);

                    $addback
                        .find("a")
                            .html($li.find("b.title").html()).attr('href', $li.find("a.item").attr('href'))
                        .end()
                        .find("button.btn-cart")
                            .attr("data-sid", $li.attr('data-sid')).attr("data-siid", $li.attr('data-siid')).attr('data-qty', $li.find(".qty select").val()).attr('data-sio', $li.find("select.option_").val()||null)
                        .end()
                    .show().insertAfter($li);
                    $li.remove();
            } );
        })
        // restore from deleted to cart
        .on('click', 'button.undo_:not(.disabled)', function(event){
            var $this = $(this), $form = $this.closest('form');

            event.preventDefault();

            var params = {
                cart_type    : 'saleitem',
                seller_id    : $this.data('sid'),
                quantity     : $this.data('qty'),
                sale_id : $this.data('siid')
            };

            if ($this.data('sio')) {
                params.option_id = $this.data('sio');
            }
            
            $this.attr('disabled', true);
            $.ajax({
                type: 'post', dataType: 'json', contentType: 'application/json',
                url: '/rest-api/v1/carts',
                data: JSON.stringify(params),
                success: function(response) {
                    $this.removeAttr('disabled');
                    get_cart(default_address, true);
                }
            });
        })
        .on('click', '.btn-checkout_', function(event){
            $("#wrap").removeClass('cart').addClass('checkout')
                .find(".cart_").hide().end()
                .find(".checkout_").show().end();
        })


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
		});
	}


	$("select[name=country], select[name=country_code]").change(function(){
		var $wrapper = $(this).closest("div");
		$wrapper.find("[name=state]").hide();
		if($(this).val()=='US' || $(this).val()=='USA'){
			$wrapper.find("select[name=state]").show().val('AL');
		}else{
			$wrapper.find("input[name=state]").show().val('');
		}
	})

	var Checkout = {};

	$(".checkout_ .step li.ended").click(function(){
		location.reload();
	})

	Checkout.Email = {
		$el : $(".checkout_ > .guest-checkout"),
		open: function(){
			this.$el.show().filter(".confirm").hide().end();
			$(".checkout_ .checkout-header").find("li.current").removeClass("current").end().find("li.email").addClass("current");
			$(".checkout_ .btn-checkout").attr('disabled','disabled');
		},
		close: function(){
			this.$el.show().filter(":not(.confirm)").hide();
			this.$el.filter(".confirm").find(".saved.status_").show();
		},
		isOpened : function(){
			return this.$el.filter(".confirm").is(":hidden");
		},
		init: function(){
			var $wrapper = this.$el;
			this.$el
				.on('click', '.btn-confirm', function(e){
					
					var is_valid_guest = true;
					var guest_email = $wrapper.find("input[name=email]").val();
					if (!/^[\w\-\.\+]+@([\w\-]+\.)+[a-z]+$/.test(guest_email))
            			is_valid_guest = false;

            		if(is_valid_guest){
            			$wrapper.data('email', guest_email).find(".saved.status_ > p").html(guest_email);
            			Checkout.Email.close();

            			if(!Checkout.Shipping.isConfirmed()) Checkout.Shipping.open();
            			else if(!Checkout.Payment.isConfirmed()) Checkout.Payment.open();
            			else Checkout.Review.open();
            		}else{
            			alert("please input valid email address");
            		}
				})
				.on('click', 'a.back', function(e){
					e.preventDefault();
					Checkout.Payment.close();
					Checkout.Shipping.close();
					Checkout.Email.open();
				})
		}
	}

	Checkout.Shipping = {
		$el : $(".checkout_ > .checkout-shipping.wrapper"),
		open : function(){
			this.$el.show().filter(".confirm").hide().end();
			$(".checkout_ .checkout-header").find("li.current").removeClass("current").end().find("li.shipping").addClass("current");
			$(".checkout_ .btn-checkout").attr('disabled','disabled');
		},
		close : function(){
			this.$el.show().filter(":not(.confirm)").hide();
			this.$el.filter(".confirm").find("h3.stit").html("<b>Shipping address</b><a href='#' class='back'>Change</a>").end().find(".saved.status_").show();
		},
		isOpened : function(){
			return this.$el.filter(".confirm").is(":hidden");
		},
		isConfirmed: function(){
			return !!this.$el.data("address");
		},
		init: function(){
			var $wrapper = this.$el;
			this.$el
				.on('click', 'h3.stit a.back', function(e){
					e.preventDefault();
					Checkout.Email.close();
					Checkout.Payment.close();
					Checkout.Shipping.open();
				})
				.on('click', '.select_ship_addr_', function(){
					var $this = $(this);
					var addressInfo = null;

					var $form = $wrapper.find(".new");
					var params = getParam($form);
					params.state = $form.find("[name=state]:visible").val();
					params.country_name = $form.find("select[name=country] option:selected").html();

					Checkout.Shipping.addShippingAddress(params, function(data){
						refreshCheckout();

						Checkout.Shipping.$el.data('address', data).find(".saved.status_").html( data.full_name+", "+data.address1+(data.address2?(' '+data.address2):'')+', '+data.city+(data.state?(', '+data.state):'')+', '+data.zip+', '+data.country_name );

						Checkout.Shipping.close();
						if(Checkout.Payment.isConfirmed())
							Checkout.Review.open();
						else
							Checkout.Payment.open();
					});
					
				})
		},
		addShippingAddress: function(params, callback){		
			function error(msg) {
				if (typeof gettext == 'function') msg = gettext(msg);
				alert(msg);
			}

			if (params.full_name.length < 1) return error('Please enter the full name.');
			if (params.address1.length < 1) return error('Please enter a valid address.');
			if (params.city.length < 1) return error('Please enter the city.');
			if (params.zip.length < 1) return error('Please enter the zip code.');
			if (params.country == 'US') {
				var phone = params.phone.replace(/\s+/g, ''); 
				if (phone.length < 10 || !phone.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/)) return error('Please specify a valid phone number.');
			}
			
			callback(params);
		}

	}

	Checkout.Payment = {
		$el : $(".checkout_ > .checkout-payment.wrapper"),
		isConfirmed: function(){
			return !!this.$el.data("payment");
		},
		open : function(){
			this.$el.show().filter(".confirm").hide();
			$(".checkout_ .checkout-header").find("li.current").removeClass("current").end().find("li.payment").addClass("current");
			
			var addr = Checkout.Shipping.$el.data('address');
			this.$el.find(".new label[for=billing_saved]").html( addr.address1+"<br/>"+(addr.address2?(addr.address2+"<br/>"):"")+addr.city+","+addr.state+"<br/>"+addr.country_name );
			this.$el.find(".new [name=shipping_street_address]").val(addr.address1);
			this.$el.find(".new [name=shipping_street_address2]").val(addr.address2);
			this.$el.find(".new [name=shipping_city]").val(addr.city);
			this.$el.find(".new [name=shipping_country_code]").val( addr.country);
			this.$el.find(".new [name=shipping_state]").val(addr.state);
			this.$el.find(".new [name=shipping_postal_code]").val(addr.zip);

			$(".checkout_ .btn-checkout").attr('disabled','disabled');
		},
		close : function(){
			if(this.$el.find(">div.status_").is(":visible")) return;
			this.$el.hide().filter(".confirm").show();
			if(this.$el.data('payment')){
				var card = this.$el.data('payment');
				this.$el.filter(".confirm").find("h3.stit").html("<b>Payment method</b> · <span class='card "+card.type.toLowerCase()+"'></span> "+card.type+" - Ending in "+card.card_number.slice(-4)+" <a href='#' class='back'>Change</a>");
				this.$el.find(".status_").find(".billing_address_").html( card.name+", "+card.street_address+", "+card.city+", "+card.state+", "+card.postal_code+", "+card.country_name);
			}else{
				this.$el.hide();
			}
		},
		isOpened : function(){
			return this.$el.filter(".confirm").is(":hidden");
		},
		init : function(){
			var $wrapper = this.$el;
			
			this.$el
				.on('click', 'h3.stit a.back', function(e){
					e.preventDefault();			
					Checkout.Email.close();		
					Checkout.Shipping.close();
					Checkout.Payment.open();
				})
				.on('keyup paste', '[name=card_number]', function(e){
					var $this = $(this);
					var type = Stripe.card.cardType($this.val());
					$this.closest("p.card_number").attr('class', 'card_number '+type.toLowerCase());
				})
				.on('click', '.select_payment_', function() {
					var $this = $(this);
					
					var $form = $wrapper.find(".new");
					var params = getParam($form);
					
					if($wrapper.find("#billing_saved")[0].checked){
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
					}
					params.country_name = $form.find("select[name=country_code] option[data-code2="+params.country_code+"]").html();

					$this.addClass('loading').attr('disabled','disabled');

					Checkout.Payment.addNewCard(params, function(data){
						$this.removeClass('loading').removeAttr('disabled');

						$wrapper.data('payment', data);

						Checkout.Payment.close();
						Checkout.Review.open();
					}, function(){
						$this.removeClass('loading').removeAttr('disabled');
					});
				})
				.on('click', ".payment-coupon dt > a", function(e){
					e.preventDefault();
					$(this).toggleClass('opened').parent().next().toggle();
				})
				.on('click', ".payment-coupon button.btn-apply", function(){
					var $this = $(this);
					var code = $(this).prev().val();

					$.ajax({
			            type: 'put', dataType: 'json', contentType: 'application/json',
			            url: '/rest-api/v1/carts/saleitem/'+seller_id+'/coupons/'+code,
			            success: function(coupons) {
			                refreshCheckout();
			            },
			            error: function(xhr) {
			                alert(xhr.responseJSON.error);
			            }
			        });
				})
				.on('click', ".payment-coupon a.remove-coupon_", function(e){
					e.preventDefault();
					var code = $(this).attr('code');

					$.ajax({
		                type: 'delete', dataType: 'json', contentType: 'application/json',
		                url: '/rest-api/v1/carts/saleitem/'+seller_id+'/coupons/'+code,
		                success: function(coupons) {
		                    refreshCheckout();
		                },
		                error: function(xhr) {
		                }
		            });
				})
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
			params.type = Stripe.card.cardType(params.card_number);
			
			callback(params);
		}
	}

	Checkout.Review = {
		open : function(){
			$(".checkout_").find(".checkout-review, .terms, .order-price-summary").show();
			$(".checkout_ .checkout-header").find("li.current").removeClass("current").end().find("li.review").addClass("current");
			refreshCheckout();
		},
		close : function(){
			$(".checkout_").find(".order-price-summary, .checkout-review, .terms").hide();
		},
		getNote: function(){
			return $(".checkout_ .checkout-review").find("a.note").data('note');
		},
		getGiftMessage: function(){
			var giftMessage = {is_gift:false, gift_message:''};
			giftMessage.is_gift = $(".checkout_ .checkout-review").find("a.gift").data('is_gift')||false;
			giftMessage.gift_message = $(".checkout_ .checkout-review").find("a.gift").data('gift_message')||'';
			return giftMessage;
		},
		init: function(){
			$('.checkout_')			
				.on('click', '.checkout-review .optional a.note', function(event){
					event.preventDefault();
					var note = $(this).data('note')||'';
					
					var scTop = $('#container').scrollTop();
					$('#container').attr('data-sctop', scTop);

					$('.checkout_ > :not(.checkout-header, .edit_seller_note, .add_gift_msg):visible').attr('current','true').hide();

					var $layer = $('.checkout_ > .edit_seller_note');
					$layer.find("textarea.text").val(note);
					$layer.show().find("textarea.text").focus();
				})
				.on('click', '.wrapper.edit_seller_note button.btn-continue', function(){
					var note = $(".edit_seller_note").find("textarea").val();
					var isGift = $(".checkout_ .checkout-review").find("a.gift").data('is_gift');

					$('.checkout_ > [current=true]').removeAttr('current').show();
					$('.checkout_ > .edit_seller_note').hide();

					if( note || isGift ){
						$(".checkout_ .optional.add span").hide();
					}else{
						$(".checkout_ .optional.add span").show();
					}

					if( note ){
						$(".checkout_ .optional.edit").show();	
						$(".checkout_ .checkout-review").find("a.note").data('note',note||'').end().find("div.note > span").html(note + " · ").end().find(".optional.add a.note").hide().end().find(".optional.edit > div.note").show();
					}else{
						$(".checkout_ .checkout-review").find("a.note").data('note','').end().find("div.note > span").html('').end().find(".optional.add a.note").show().end().find(".optional.edit > div.note").hide();
					}
					
					$('#container').scrollTop( $('#container').attr('data-sctop') );
				})
				.on('click', '.wrapper.edit_seller_note button.btn-cancel', function(){
					$('.checkout_ > [current=true]').removeAttr('current').show();
					$('.checkout_ > .edit_seller_note').hide();
					$('#container').scrollTop( $('#container').attr('data-sctop') );
				})
				.on('click', '.checkout-review .optional .note a.remove', function(event){
					event.preventDefault();
					var note = '';
					var isGift = $(".checkout_ .checkout-review").find("a.gift").data('is_gift');

					if( note || isGift ){
						$(".checkout_ .optional.add span").hide();
					}else{
						$(".checkout_ .optional.add span").show();
					}
					$(".checkout_ .checkout-review").find("a.note").data('note','').end().find("div.note > span").html('').end().find(".optional.add a.note").show().end().find(".optional.edit > div.note").hide();
				})
				.on('click', '.checkout-review .optional a.gift', function(event){
					event.preventDefault();
					var is_gift = true;
					var gift_message = $(this).data('gift_message')||'';

					var scTop = $('#container').scrollTop();
					$('#container').attr('data-sctop', scTop);

					$('.checkout_ > :not(.checkout-header, .edit_seller_note, .add_gift_msg):visible').attr('current','true').hide();

					var $layer = $('.checkout_ > .add_gift_msg');
					
					$layer.find("textarea.text").val(gift_message);
					$layer.find("input:checkbox")[0].checked = is_gift;
					if(is_gift){
						$layer.find("textarea").removeAttr('disabled');	
					}else{
						$layer.find("textarea").attr('disabled','disabled');	
					}
					
					$layer.show().find("textarea").focus();	
				})
				.on('click', '.wrapper.add_gift_msg input:checkbox', function(){
					if( this.checked ){
						$(".popup.add_gift_msg textarea").removeAttr('disabled');	
					}else{
						$(".popup.add_gift_msg textarea").attr('disabled','disabled');	
					}
				})
				.on('click', '.wrapper.add_gift_msg button.btn-continue', function(){
					var is_gift = $(".wrapper.add_gift_msg").find("input:checkbox")[0].checked;
					var gift_message = $(".wrapper.add_gift_msg").find("textarea").val();

					var giftInfo = {"is_gift": is_gift, "gift_message": gift_message};
					var note = $(".checkout_ .checkout-review").find("a.note").data('note');

					if( note || is_gift ){
						$(".checkout_ .optional.add span").hide();
					}else{
						$(".checkout_ .optional.add span").show();
					}

					$('.checkout_ > [current=true]').removeAttr('current').show();

					if(is_gift){
						$('.checkout_ > .add_gift_msg').hide();

						$(".checkout_ .optional.edit").show();
						$(".checkout_ .checkout-review").find("a.gift").data('is_gift',true).data('gift_message',giftInfo.gift_message||'').end().find("div.gift > span").removeClass('empty').html(giftInfo.gift_message + " · ").end().find(".optional.add a.gift").hide().end().find(".optional.edit > div.gift").show();
						if (!giftInfo.gift_message) {
							$("div.gift > span").addClass('empty').html('No gift message added · ');
						}
					}else{
						$(".checkout_ .checkout-review").find("a.gift").data('is_gift',false).data('gift_message','').end().find("div.gift > span").html('').end().find(".optional.add a.gift").show().end().find(".optional.edit > div.gift").hide();
					}
					$('#container').scrollTop( $('#container').attr('data-sctop') );
				})
				.on('click', '.wrapper.add_gift_msg button.btn-cancel', function(){
					$('.checkout_ > [current=true]').removeAttr('current').show();
					$('.checkout_ > .add_gift_msg').hide();
					$('#container').scrollTop( $('#container').attr('data-sctop') );
				})
				.on('click', '.checkout-review .optional .gift a.remove', function(event){
					event.preventDefault();
					var giftInfo = {"is_gift": false, "gift_message": ''};
					var note = $(".checkout_ .checkout-review").find("a.note").data('note');

					if( note ){
						$(".checkout_ .optional.add span").hide();
					}else{
						$(".checkout_ .optional.add span").show();
					}

					$(".checkout_ .checkout-review").find("a.gift").data('is_gift',false).data('gift_message','').end().find("div.gift > span").html('').end().find(".optional.add a.gift").show().end().find(".optional.edit > div.gift").hide();
				})
				.on('click', '.checkout-review .cart-item-detail li a.remove', function(e){
					e.preventDefault();
					var $this = $(this);
					$this.addClass('disabled');

					params = {
						item_id : $this.data('item_id')
					};

					removeItem($this, params, function(){ 
						refreshCheckout();
					});		
				})
		}
	}

	Checkout.Email.init();
	Checkout.Shipping.init();
	Checkout.Payment.init();
	Checkout.Review.init();

	function removeItem($btn, data, callback){
		$btn.addClass('disabled').attr('disabled', true);
		$.ajax({
            type: 'delete', dataType: 'json', contentType: 'application/json',
            url: '/rest-api/v1/carts/saleitem/items/'+data.item_id,
            success: callback || $.noop,
            complete : function(){				
				$btn.removeClass('disabled').removeAttr('disabled');
			}
        });
	};

	
	function renderSummary(data){
		var $frm = $(".order-price-summary");

		$("button.btn-checkout").data('total-price', data.total_price);
		$frm.find("li.total .price").html("$"+formatMoney(data.total_price));
		$frm.find("li.subtotal_ .price").html("$"+formatMoney(data.subtotal_price.replace(".00","")));
		$frm.find("li.shipping_ .price").html("$"+formatMoney(data.shipping.replace(".00","")));
		$frm.find("li.tax_ .price").html("$"+formatMoney( (data.tax||"0").replace(".00","")));

		var coupontAmount = parseFloat(data.coupon_amount);
		if(coupontAmount > 0)
			$frm.find("li.coupon_").show().find(".price").html("- $"+formatMoney(coupontAmount.toFixed(2).replace(".00","")));
		else
			$frm.find("li.coupon_").hide();
	}

	function renderSaleItems(data){
		var sellerTemplate = $("script#seller_template").html();
		var itemTemplate = $("script#cart_item_template").html();
        var payment_method = 'stripe';
		var itemCount = 0;

        var $couponArea = $(".checkout_ .checkout-payment .payment-coupon dd");
        var couponInfo = data.coupons;
        couponInfo = couponInfo && couponInfo[0];
        if( couponInfo ){        	
        	$couponArea.find(">ul li").html("<b>"+couponInfo.code+ " · <a href='#' class='remove-coupon_' code='"+couponInfo.code+"'>Remove</a></b> "+couponInfo.description);
        	$couponArea.show().find(">input,>button,>div").hide().end().find(">ul").show();
        }else{
        	$couponArea.find(">input,>button").show().end().find(">div,>ul").hide();
        }

        var isAvailable = true;
    
    	var $reviewEl = $(".checkout_ .checkout-review .cart-item-detail");
		$reviewEl.find('> h4').html(data.items[0].brand_name);

		$reviewEl.find("[item_id]").attr("mark-delete", true);

		window.share_thing_name = data.items[0].title;
		window.share_thing_url = 'https://fancy.com/things/'+data.items[0].thing_id;

		$(data.items).each(function(){
			var item = this;
			if(!item.available) isAvailable = false;
			
			var $el = $reviewEl.find("[item_id="+item.id+"]");
			if(!$el.length) $el = $(itemTemplate);
			$el.attr('item_id', item.id)
				.find(".item")
					.find("img").css("background-image","url('"+this.image_url+"')").end()
					.find(".title").html(this.title).end()
				.end()
				.find(".price").html("$"+formatMoney(this.item_price.replace(".00",""))).end()
				.find(".qty").html('Quantity: '+this.quantity).end();
			if(parseInt(this.item_retail_price) && this.item_price!=this.item_retail_price){
				$el.find(".price").addClass("sales").html('<small class="before">'+ "$"+formatMoney(this.item_retail_price.replace(".00",""))+'</small>'+" $"+formatMoney(this.item_price.replace(".00","")))
			}
			if(this.option_id){
				$el.find("._option").css('display','block').html(this.option);
			}
			
			if(item.error_message){
				$el.find(".error").find('b').html(item.error_message).end().show();
				//$el.find(".action").show().end().removeClass('hide-action');
				$el.find(".delivery-option").hide();
				$el.find("a.remove").data('item_id', item.id);
			}else{
				$el.find(".error, .action").hide().end().addClass('hide-action');
				$el.find(".delivery-option").show();
			}

			$el.removeAttr('mark-delete');
			$el.appendTo( $reviewEl.find("ul") );
			itemCount++;
		})

		var shipping_option = null;
		$reviewEl.find(".delivery-option ul").empty();
		var shipping_options_length = $(data.shipping_options).length;
		$(data.shipping_options).each(function(){
			var amount = "$"+this.amount;
			if(parseFloat(this.amount)==0){
				amount = "Free";
			}
			var html = "";
			if(shipping_options_length==1){
				this.label = 'Shipping';
				$reviewEl.find(".delivery-option b.tit").hide();
				html = "<li><label><b>"+this.label+" - "+amount+"</b> <small>"+this.detail+"</small></label></li>";
			}else{
				$reviewEl.find(".delivery-option b.tit").show();
				html = "<li><input type='radio' id='seller_shipping_"+this.id+"' name='seller_shipping' value='"+this.id+"' "+(this.id==data.shipping_selected?'checked':'')+"> <label for='seller_shipping_"+this.id+"'><b>"+this.label+" - "+amount+"</b> <small>"+this.detail+"</small></label></li>";
			}
			$reviewEl.find(".delivery-option ul").append($(html));
		})
		if( shipping_options_length == 1){
			$reviewEl.find(".delivery-option").addClass('disabled');
		}else{
			$reviewEl.find(".delivery-option").removeClass('disabled');
		}
		if( !parseFloat(data.shipping) ){
			$reviewEl.find('.delivery-option').addClass('free');
		}else{
			$reviewEl.find('.delivery-option').removeClass('free');
		}
		
		$reviewEl.find("[item_id][mark-delete]").remove();

		if(isAvailable && !Checkout.Email.isOpened() && !Checkout.Shipping.isOpened() && !Checkout.Payment.isOpened()){
			$(".checkout_ .btn-checkout").removeAttr('disabled');
		}else{
			$(".checkout_ .btn-checkout").attr('disabled', 'disabled');
		}
	}

	function render(data){
		if(!data.items.length){
			$("#wrap").removeClass('checkout').addClass('cart')
                .find(".cart_").show().end()
                .find(".checkout_").hide().end();
			start_loading();
    		get_cart(default_address, true);
    		return;
		}
		renderSummary(data);
		renderSaleItems(data);
	}

	function refreshCheckout(){
		var address = Checkout.Shipping.$el.data('address')||default_address;

		$.ajax({
            type: 'get', dataType: 'json', contentType: 'application/json',
            data: address,
            url: '/rest-api/v1/carts/saleitem/'+seller_id,
            success: function(cart) {
                render(cart);
            }
        });
	}

	$('.checkout_ button.btn-checkout').click(function(event){
		var card = Checkout.Payment.$el.data('payment');
		cardInfo = { name : card.name, 
					     address_line1 : card.street_address, 
						 address_zip : card.postal_code, 
						 address_country : card.country_code,
						 number : card.card_number, 
						 exp_month : card.expiration_month, 
						 exp_year : card.expiration_year, 
						 cvc : card.security_code };

		Stripe.card.createToken(cardInfo, function(status, response) {
			if (response.error) {
                alert('Please enter valid payment information');
			} else {
                send_payment(response.id);
			}
		});
        
    })

    function send_payment(card_uri) {
        var email = Checkout.Email.$el.data('email');
		var address = Checkout.Shipping.$el.data('address');
		var card = Checkout.Payment.$el.data('payment');
		var note = Checkout.Review.getNote();
		var giftMessage = Checkout.Review.getGiftMessage();
		var total_price = $('button.btn-checkout').data('total-price');
        
        var data = {
            seller_id: seller_id, total_price: total_price, via: 'FancyAnywhere',
            email: email, is_gift: giftMessage.is_gift, gift_message: giftMessage.gift_message, note: note,
            full_name: address.full_name, alias: email, address1: address.address1, address2: address.address2, 
            city: address.city, country: address.country, state: address.state, zip: address.zip, phone: address.phone,
            billing_address1: card.street_address, billing_address2: card.street_address2, billing_city: card.city, 
            billing_country: card.country_code, billing_postal_code: card.postal_code, billing_state: card.state,
            billing_card_uri: card_uri, payment_type: 'stripe'
        };

        $.ajax({
            type: 'post', dataType: 'json', contentType: 'application/json',
            data: JSON.stringify(data),
            url: '/rest-api/v1/carts/saleitem/'+seller_id+'/payment',
            success: function(response) {
                var order_id = response.order.id;
                var order_complete_url = response.order.url;
                show_payment_complete(order_id, order_complete_url);
            },
            error: function(xhr) {
                var response = xhr.responseJSON;
                if (response && response.error && response.error.error_message) {
                    alert(response.error.error_message);
                }else{
                	alert('order confirmation failed.');
                }
            }
        });
    }

    function show_payment_complete(order_id, order_complete_url){
    	var email = Checkout.Email.$el.data('email');
    	$(".complete_").find(".email_").html(email);

    	$("#wrap").removeClass('checkout').addClass('cart')
                .find(".checkout_").hide().end()
                .find(".complete_").show().end();
    }

})(jQuery);
