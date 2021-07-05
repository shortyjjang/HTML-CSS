jQuery(function($){

	$('#cart-saleitem')
		.on('update', function(){
			updateCart();
		})
		// quantity
		.on('click', '.qty a.plus', function(e){
			e.preventDefault();
			var $qty  = $(this).closest(".qty").find("input"), val = $qty.val();
			var maxqty = parseInt($(this).closest(".qty").find("input").attr('max-qty')) || 10;
			val = Math.min(parseInt(val)+1||1, maxqty);
			$qty.val(val).trigger('change');
		})
		.on('click', '.qty a.minus', function(e){
			e.preventDefault();
			var $qty  = $(this).closest(".qty").find("input"), val = $qty.val();
			var maxqty = parseInt($(this).closest(".qty").find("input").attr('max-qty')) || 10;
			val = Math.max(parseInt(val)-1||1, 1);
            val = Math.min(val, maxqty)
			$qty.val(val).trigger('change');
		})
		.on('change', '.qty input', function(){
			var $this = $(this), form = this.form, sale_item_cart_id = $this.attr('sicid'), unitPrice = parseFloat($this.attr('price')), xhr = $this.data('xhr');

			try { xhr.abort() } catch(e){};
            $.ajax({
				type : 'PUT',
				url  : '/rest-api/v1/carts/saleitem/items/'+sale_item_cart_id+'/',
				data : {quantity:this.value, user : window.owner},
				beforeSend : function(xhr){ $this.data('xhr', xhr); },
				select : function(item){
					if (item.error_message_before_shipping) {
						alert(item.error_message_before_shipping);
					}
				},
				complete : function(){
					updateCart();
				}
            }).fail(function(xhr) {
                if(xhr.status==0) return;   // aborted
                if(xhr.status==400) {
                    try {
                        var result = xhr.responseJSON
                        if(!result) { result = JSON.parse(xhr.responseText) }
                        if(result.error_fields && result.error_fields[0]=='quantity') {
                            return
                        }
                    } catch(e) {
                    }
                }
                alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
			})
		})
        // save for later
        .on('click', 'a.save-for-later', function(event) {
            var $this = $(this);
            event.preventDefault();

            if( $this.hasClass('disabled') ) return;
            $this.addClass('disabled');

            var qty = $this.closest('li.item_').find(".qty input").val();
            if($this.hasClass('notify')){
                var sale_item_id = $this.closest('li').data('siid'), option_id=$this.closest('li').data('sio');
                $.get('/wait_for_product.json', {sale_item_id:sale_item_id, option_id:option_id}, function(res){})
            }

            $.post('/rest-api/v1/carts/later', {cart_item_id:$this.data('sicid'), quantity:qty}, function(res) {
                var id, params;
                if (res.id) {
                    id = res.id;
                    params = {
                        sale_item_cart_id : $this.data('sicid'),
                        is_fancybox : 'false'
                    };

                    removeItem($this, params, function(){ 
                        $this.closest('li').remove();
                        updateCart(); 
                        updateSavedForLater(1); 
                    });
                }
            }, 'json')
        .always(function(){
            $this.removeClass('disabled');
        });
        try { track_event('Save for Later', { 'sale id': $this.closest('.item_').data('siid') }); } catch(e) { console.log(e) }
     })
		// remove items
		.on('click', 'a.remove', function(event){
			var $this = $(this);

			event.preventDefault();

			var data = {cart_id:$this.data('cid'), sale_item_cart_id:$this.data('sicid'), user : window.owner};

			removeItem($this, data, function(json){
				if (!json.status_code) {
					if (json.message) alert(json.message);
					return;
				}
				var $li = $this.closest('li');
				$li.remove();

				updateCart();
			});
		})

	function removeItem($btn, data, callback){
		var $rows = $btn.closest('li'), $list = $rows.closest('.cartList');

		$btn.addClass('disabled').attr('disabled', true);
		$rows.addClass('disabled');
		$list.addClass('loading');
		
		$.ajax({
			type : 'POST',
			url  : '/remove_cart_item.json',
			data : data,
			dataType : 'json',
			success  : callback || $.noop,
			complete : function(){
				$list.removeClass('loading');
				$rows.removeClass('disabled');
				$btn.removeClass('disabled').removeAttr('disabled');
			}
        }).fail(function(xhr) {
            alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
		})
	};

	function updateCart(){
		var $cart = $("#cart-saleitem"), $btn, xhr = $cart.data('xhr'), params = {}, count, disabled;

		// disable submit buttons
		$btn = $cart.find('button.btn-cart');
		disabled = !!$btn.attr('disabled');
		$("#cart-saleitem").attr('loading',true);

		count = $cart.find('.item_:visible').length;
		if (!count) updateSummary({subtotal_price:0, shipping:0, tax:0, total_price:0});

        params.cart_type = 'saleitem';

		params.user = window.owner;

		try { if(xhr) xhr.abort(); } catch(e){};

		$.ajax({
			url  : '/rest-api/v1/carts',
			data : params,
			beforeSend : function(xhr){ $cart.data('xhr', xhr); },
			success : function(json){
				disabled ? $btn.attr('disabled', true) : $btn.removeAttr('disabled');
				$("#cart-saleitem").removeAttr('loading');
                if ($cart.hasClass('select-ship')) return updateSummary(json.items,json);

                if(json && json.items && json.items.length) {
                    $("#cart-saleitem").show();
                    $("#content .empty").hide();
                } else {
                    $("#cart-saleitem").hide();
                    $("#content .empty").show();
                }
				updateSaleitems(json.items, json);
			}
		})

		function updateSummary(data,cart){
			var prevSubtotal = parseFloat($cart.find('.finish .total .price b').text().replace(/[^0-9\.]/g,''));

			if(data.length){
				var tmp = {subtotal_price:0, available_before_shipping:true};
				$(data).each(function(){
					for(k in tmp){
						tmp[k] += parseFloat(this[k])||0;
					}
					if('available_before_shipping' in this)
						tmp['available_before_shipping'] = tmp['available_before_shipping'] && this['available_before_shipping'];
				})
				
				data = tmp;
			}

			var subtotal = parseFloat(data['subtotal_price']);			
			var $row = $cart.find('.finish .total .price.subtotal b'), txt;
			$row.show();
			txt = '$'+addCommas(subtotal.toFixed(2));
			$row.text(txt);

            try {
                var subtotal_discount = parseFloat(cart['subtotal_discount']);
                var $subtotal_discount = $cart.find('.finish .total .total-saving');
                if(subtotal_discount>0) {
			        var $subtotal_discount_row = $cart.find('.finish .total .price.total-saving b'), txt;
                    $subtotal_discount_row.text('$'+addCommas(subtotal_discount.toFixed(2)));
                    $subtotal_discount.show();
                } else {
                    $subtotal_discount.hide();
                }
            } catch(e) {
            }
            try {
                var discount_amount = parseFloat(cart['coupon_amount']);
                var free_shipping = !!cart['coupon_free_shipping'];
                var $discount = $cart.find('.finish .total .coupon-discount');
                var $free_shipping = $cart.find('.finish .total .shipping-free');

                if(discount_amount) {
			        var $discount_row = $cart.find('.finish .total .price.coupon-discount b'), txt;
                    $discount_row.text('-$'+addCommas(discount_amount.toFixed(2)));
                    $discount.show();
                } else {
                    $discount.hide();
                }
                if(free_shipping) {
                    $free_shipping.show();
                } else {
                    $free_shipping.hide();
                }
            } catch(e) {
            }

			// disable submit button if subtotal price is zero.
			disabled = (+data.subtotal_price === 0);
			
			// restore availibility of submit buttons
            //disabled = ('available_before_shipping' in data)?!data.available_before_shipping:disabled;
			$btn.prop('disabled', disabled);            

		}

		function updateSaleitems(_items, cart) {
		    if (!_items) return;
		    var itemcount = 0;

		    var items = {}, id, i, c, $shipping;

			for (i=0,c=_items.length; i < c; i++) {
				id = _items[i].sale_id;
				if (_items[i].option_id) {
					id += '-' + _items[i].option_id;
				}

				_items[i].item_id = id;
				items[id] = _items[i];
			}

            console.log('update saleitem',_items);
            var $tpl = $('#cart-item-template');

            for (i=0,c=_items.length; i < c; i++) {
                var item = _items[i];
                var item_id = item.item_id;
                if(!$cart.find('.item_#item-'+item_id+':visible').length) {
                    $row = $tpl.template({
                        seller_id : item.seller_id, 
                        item_id : item.item_id,
                        thing_id : item.thing_id,
                        sale_id : item.sale_id,
                        option_id : item.option_id,
                        saleitem_url : item.item_url,
                        image_url : item.sale_image_url,
                        title : item.title, 
                        option : item.option,
                        sale_item_cart_id : item.id,
                        price : item.item_price,
                        retail_price : item.item_retail_price,
                        seller_name : item.seller_name,
                        seller_country : item.seller_country,
                        brand_name : item.brand_name,
                        personalization: item.personalization
                    })
                    if(parseFloat(item.item_price)<parseFloat(item.item_retail_price)) {
                        $row.find('.price').addClass('sales')
                    }
				    $cart.find("ul>li.thead").after($row);
                }
            }

	    	$cart.find('.item_:visible').each(function(){
				var $row = $(this), m = $row.attr('id').match(/(\d+)(?:-(\d+))?$/), optId, rowId, saleId, item;
				
				rowId  = m[0];
				saleId = m[1];
				optId  = m[2]||'';

				if (!items[rowId]) {
					$row.remove();
					return;
				}

				item = items[rowId];
				delete items[rowId];

				itemcount+=item.quantity;

				// price
				price = parseFloat(item.item_price);
				retail_price = parseFloat(item.item_retail_price) || price;
                if(retail_price > price) {
                    $row.find('.price').addClass('sales');
				    $row.find('.price').html('$'+addCommas(item.item_price.replace(".00",""))+" <small class=\"before\">$"+addCommas((item.item_retail_price || item.item_price).replace(".00",""))+"</small>");
                } else {
                    $row.find('.price').removeClass('sales');
				    $row.find('.price').html('$'+addCommas(item.item_price.replace(".00","")));
                }
				$row.find('.total').text('$'+addCommas( (item.item_price*item.quantity).toFixed(2).replace(".00","")) );
				
				// selected option
				if (item.option_id){
					$row.find('span.option').text(item.option);
				}
				
				$row.find('.qty input').val(item.quantity);

				$row.find('.notification-cart,.unavailable').addClass('hidden');
				if(!item.available_before_shipping){
					if (item.notify_available) {
						//$row.find('.notification-cart').removeClass('hidden').find('p > b').text(item.error_message_before_shipping);
                        $row.find('.notification-cart').removeClass('hidden')   ;
						$row.find('.others').hide();
					} else {
						$row.find('.unavailable').removeClass('hidden').text(item.error_message_before_shipping);
					}
				}
			});

			if (size(items)) {
                $(".cart-item .cart-item-detail").addClass('loading');
            }
			if (!$cart.find('.item_').length){
			}

			if(itemcount > 0){
				$("#header .cart .count").text(itemcount);
				$("#header .cart").removeClass('empty')
			}else{
				$("#header .cart .count").text('');
				$("#header .cart").addClass('empty')
			}
			updateSummary(_items, cart);
		}

		function size(obj){
			var len = 0;
			for(var x in obj) {
				if(obj.hasOwnProperty(x)) len++;
			}
			return len;
		}
	};

	function updateSavedForLater(page){
		var fn = arguments.callee, $tpl = fn.$tpl, $later = $('div.saved-later'), $list = $later.find('>ul'), seq;
		if (!$tpl) fn.$tpl = $tpl = $list.find('>script').remove();
		if (!fn.seq) fn.seq = 0;

		seq = ++fn.seq;
		if (seq > 1000) seq = fn.seq = 1;

		$.ajax({
			url  : '/rest-api/v1/carts/later',
			data : {per_page:10, page: page},
			success : function(json){
				if (seq !== fn.seq) return;
				if (json.items.length === 0) {
                    return $later.parent('div').hide();
                } else {
                    $later.parent('div').show();
                }

				$list.find("li").remove();
				$.each(json.items, function(idx, item){
					item.item_price = item.item_price.replace(/\.00/,'');
					if(item.quantity > item.remaining_quantity) item.quantity = item.remaining_quantity;
					var $item = $tpl.template(item);
					if(item.is_sold_out){
						$item.find("a.move-to-cart").addClass('soldout').html('Sold out');
					}
                    if(item.retail_price && item.item_price>item.retail_price) {
                        $item.find(".figcaption .price").addClass("sales");
                        $item.find(".figcaption .price>small.before").show();
                    }
                    if(item.sale_image_options.fit_to_bounds) {
    					$item.find(".figure").addClass("fit");
                    }
					$item.appendTo($list);
				});

	            $(".recommended").recommendSlide();
			}
		});
	};
	updateSavedForLater(1);

    
	$("#cart-saleitem").submit(function(e){
		e.preventDefault();

		var $this = $(this);
        var $button = $this.find('.buttons.btn-cart');

        if($this.hasClass('loading')) {
            return;
        }

		if($this.attr('loading')){
			setTimeout(function(){
				$("#cart-saleitem").submit();
			},200);
			return;
		}

        $this.addClass('loading');
        $button.addClass('loading');

        var params = {
            "payment_gateway": window.DEFAULT_PAYMENTGATEWAY || 6,
            "available_only": true
        };

        if(!guest_checkout && !window.owner){
            document.location.href= "/login?next=/cart";
        }
        
        if(!window.owner){
            params.country = 'US';
        }

        $.ajax({
            type : 'POST',
            url  : '/rest-api/v1/checkout',
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(params),
            processData : false,
            success  : function(res){
                if(!window.owner){
                    document.location.href= "/checkout?pg="+(window.DEFAULT_PAYMENTGATEWAY || 6);
                }else{
                    document.location.href= "/checkout";    
                }
                
            }
        }).fail(function(xhr) {
            alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            $this.removeClass('loading');
            $button.removeClass('loading');
        })

	});

	$(".recommended").recommendSlide();

    $("div.saved-later").on('click', 'a.move-to-cart', function(event) {
        var $this = $(this);

        event.preventDefault();
        if($this.hasClass('disabled')) return;
        if($this.hasClass('soldout')) return;
        $this.addClass('disabled');
        $.ajax({
            type : 'PUT',
            url  : '/rest-api/v1/carts/later/'+$this.closest('li').data('sicid'),
            data : {},
            dataType : 'json',
            success  : function(res){
                if (res) {
                    var title = $this.closest('li').find('b.title').html();
                    var option = $this.closest('li').find('span.option').html();
                    var itemStr = title + (option?" ("+option+")":"");
                    if(res.quantity_changed){
                        alertify.alert(itemStr+" has only "+res.quantity_remain+" in stock. We've updated the quantity for you.");							
                    }
                    $(".cart-item .cart-item-detail").addClass('loading');

                    updateCart();
                    updateSavedForLater(1);
                }
            },
            error : function(res){
                try{
                    var msg = JSON.parse(res.responseText).error_fields[0];
                    alertify.alert(msg)
                }catch(e){
                    alertify.alert('This item is currently unavailable.');
                }
            },
            complete : function(){
                $this.removeClass('disabled');
            }
        });
    }).on('click', 'a.remove', function(event){
        var $this = $(this);
        event.preventDefault();
        if( $this.hasClass('disabled') ) return;

        $this.addClass('disabled');
        $.ajax({
            type : 'DELETE',
            url  : '/rest-api/v1/carts/later/'+$this.closest('li').data('sicid'),
            data : {},
            dataType : 'json',
            success  : function(res){
                if (res.sale_id) {
                    var $li = $this.closest('li');
                    $li.remove();

                    var $later = $('div.saved-later');
                    if($later.find('>ul>li').length<1) {
                        return $later.parent('div').hide();
                    }
                }
            },
            complete : function(){
                $this.removeClass('disabled');
            }
        });
    });
});
