jQuery(function($){

	// currency approximately
	var str_currency = $('.currency .currency_price').eq(0).text();
	var dlg_currency = $.dialog('show_currency');
	var $currency_list = $('.popup.show_currency');

	function refresh_currency(){
		var $currency = $('.currency .currency_price');
		
		$currency.text(str_currency);

		function text_currency(el, money, code, symbol, natural_name) {

			if(typeof(money) == 'number') {
				money = money.toFixed(2);
			}
			money = money.replace(/[ \.]00$/,'');

			var str = str_currency.replace('...', symbol+" "+money+' <small>'+code+'</small>');
			$(el).html(str);
            $(el).attr('currency', code);
            $(el).closest(".currency").find(".country > .code").html(natural_name);
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
			    return $(el).closest(".currency").find(".change_currency").show().end().find(".country, .currency_price").hide();
			}else{			
				$(el).closest(".currency").find(".country, .currency_price").show().end().find(".change_currency").hide();
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

		$currency.closest(".currency").delegate('a.change_currency, a.code', 'click', function(event){
			var $this = $(this);
			event.preventDefault();
            if(!$currency_list.hasClass('loaded')) return;

            function close_currency() {
            	dlg_currency.close();
            }

            var my_currency = $currency.filter(":visible").eq(0).attr('currency');
            if (my_currency) {
                var my_currency_selector = 'li.currency[code="'+my_currency+'"]'
                $currency_list.find(my_currency_selector).find('a').addClass('current');
                var $ul_major = $currency_list.find('ul.major');

                var $my_currency_item = $ul_major.find(my_currency_selector);
                if ($my_currency_item.length == 0) {
                    var $ul_all = $currency_list.find('ul').not('.major');
                    $my_currency_item = $ul_all.find(my_currency_selector).clone();
                }
                $ul_major.prepend($my_currency_item)
            }
            dlg_currency.open()
            dlg_currency.$obj
                .on('click', 'li.currency a', function(event) {
                    event.preventDefault();
                    var code = $(event.target).closest('.currency').attr('code');
                    show_currency( $this.closest('.currency').find('.currency_price'), code, true);
                    close_currency();
                });
		});
	};

	refresh_currency();

	$('form.merchant_')
		.on('update', function(){
			updateCart();
		})
		// quantity
		.on('change', '.qty > select', function(){
			var $this = $(this), sale_item_cart_id = $this.attr('sicid'), form = this.form, unitPrice = parseFloat($this.attr('price')), xhr = $this.data('xhr');

			try { xhr.abort() } catch(e){};
            startSpinner(form);
			$.ajax({
				type : 'PUT',
				url  : '/rest-api/v1/carts/saleitem/items/'+sale_item_cart_id+'/',
				data : {quantity:this.value, user : window.owner},
				beforeSend : function(xhr){ $this.data('xhr', xhr); },
				select : function(item){
					if (item.error_message_before_shipping) {
						if (item.error_message_before_shipping) alert(item.error_message_before_shipping);
                        stopSpinner(form);
					}
				},
				complete : function(){
					updateCart();
				}
			});
		})
		.on('click', '.personalization a', function(event){
			event.preventDefault();
			var $this = $(this), dlg = $.dialog('edit-personalization'), sale_item_cart_id = $this.attr('sicid'), personalization = $this.closest('.personalization').find('em').text();
			dlg.$obj.data('sicid', sale_item_cart_id).find(".text").val(personalization);
			dlg.open();
		})
		.on('click', '.notify-available_', function(event){
			var $this = $(this), params, optionId;

			params = {sale_item_id : $this.data('siid'), user : window.owner};

			if (optionId = $this.data('sio')) {
				params['option_id'] = optionId;
			}

			if (!this.checked) params['remove'] = 1;

			$.ajax({
				type : 'post',
				url  : '/wait_for_product_secure.json',
				data : params,
				dataType : 'json',
				success  : function(json){
					if (!json || !('status_code' in json)) return; 
					if (json.status_code) {
						updateCart();
					} else if (json.status_code == 0 && json.message) {
						alert(json.message);
					}
				}
			});
		})
		// changing option
		.on('change', 'select.option_', function(event){
			var $this = $(this), xhr = $this.data('xhr'), siid = $this.attr('data-siid'), sale_item_cart_id = $this.attr('data-sicid'), oid = $(this).val(), $row = $this.closest('.item_'), params;

			params = {
				option_id : oid,
				user : window.owner
			};

			if($this.find('option:selected').data('remaining-quantity') < $this.closest('.item_').find('.qty > select').val()){
				var quantity = $this.find('option:selected').data('remaining-quantity');

				alert($this.find("option:selected").html()+" has only "+quantity+" in stock. We've updated the quantity for you.");
				params.quantity = $this.find('option:selected').data('remaining-quantity');				
			}

			try{ xhr.abort() }catch(e){};

            startSpinner(this.form);             
			$.ajax({
				type : 'PUT',
				url  : '/rest-api/v1/carts/saleitem/items/'+sale_item_cart_id+'/',
				data : params,
				dataType : 'json',
				beforeSend : function(xhr){ $this.data('xhr', xhr) },
				success  : function(item){
                    stopSpinner(this.form);
					if (oid != $this.val()) return;

					if (!item.error_message_before_shipping) {
						var id = 'item-'+siid+'-'+oid, nid = 'notify-'+siid+'-'+oid;

						if (!$('#'+id).length) {
							$row.attr('id', id).attr('data-sio', oid)
								.find('.notify-available_').attr('id', nid).attr('data-sio', oid)
									.next('label').attr('for', nid);

						}

						$this.attr('data-optionid', oid).closest('.detail').find('.select-option span').text( $this.find("option:selected").data("option") );
					}else{
						$this.val($this.attr('data-optionid'));
					}
					updateCart();

					if (item.error_message_before_shipping) alert(item.error_message_before_shipping);
				}
			});
		})
		// remove items
		.on('click', 'a.remove-item_', function(event){
			var $this = $(this), $form = $this.closest('form'), data;

			event.preventDefault();

			if( $this.hasClass('disabled') ) return;

			data = {cart_id:$this.data('cid'), sale_item_cart_id:$this.data('sicid'), is_fancybox:($this.data('type') == 'fancybox'), user : window.owner};

			removeItem($this, data, function(json){
				if (!json.status_code) {
					if (json.message) alert(json.message);
					return;
				}
				var $addback = $this.closest("div.cart-item").find("li.add-back");
				var $li = $this.closest('li');

				$addback
					.find("a")
						.html($li.find(".stit > a").html()).attr('href', $li.find(".stit > a").attr('href'))
					.end()
					.find("button.btn-cart")
						.attr("data-tid", $li.attr('data-tid')).attr("data-sid", $li.attr('data-sid')).attr("data-siid", $li.attr('data-siid')).attr('data-qty', $li.find(".qty select").val()).attr('data-sio', $li.find("select.option_").val()||null)
					.end()
				.show().insertAfter($li);
				if(json.is_sold_out[data.sale_item_cart_id]){
					$addback.find("button.btn-cart").hide();
				}else{
					$addback.find("button.btn-cart").show();
				}

				$li.remove();

				updateCart();
			});
		})		// save for later
		.on('click', 'a.wishlist-item_', function(event){
			var $this = $(this), $form = $this.closest('form');

			event.preventDefault();

			if( $this.hasClass('disabled') ) return;

			$this.addClass('disabled');

			var qty = $this.closest('li.item_').find(".qty select").val();

			$.ajax({
				type : 'POST',
				url  : '/rest-api/v1/carts/later',
				data : {cart_item_id:$this.data('sicid'), quantity:qty},
				dataType : 'json',
				success  : function(res){
					var id, params;
					if (res.id) {
						
						id = res.id;
						
						params = {
							cart_id : $this.data('cid'),
							sale_item_cart_id : $this.data('sicid'),
							is_fancybox : 'false'
						};

						removeItem($this, params, function(){ 
							$this.closest('li').remove();
							updateCart(); 
							updateSavedForLater(1); 
						});
					}
				},
				complete : function(){
					$this.removeClass('disabled');
				}
			});
		})
		// restore from deleted to cart
		.on('click', 'button.undo_', function(event){
			var $this = $(this), $form = $this.closest('form');

			event.preventDefault();

			if( $this.hasClass('disabled') ) return;

			var params = {
				seller_id    : $this.data('sid'),
				quantity     : $this.data('qty'),
				thing_id     : $this.data('tid'),
				sale_item_id : $this.data('siid'),
				user : window.owner
			};

			if ($this.data('sio')) {
				params.option_id = $this.data('sio');
			}
			
			addToCart($this, params, function(){ 
				$this.removeClass('disabled').closest("li.add-back").hide(); 
				updateCart(); 
			});		
		})
		// dismiss
		.on('click', 'a.dismiss_', function(event){
			var $this = $(this), $form = $this.closest('form'), $tr = $this.closest('tr');

			event.preventDefault();

			$tr.nextAll('tr:hidden').remove().end().next().andSelf().remove();

			updateCart();
		})
		// payment types
		.on('click', 'input:radio[name^="payment_type"]', function(event){
		})
        .on('click', '.payment_type li', function(event) {
            if (event.target == this) {
                $(this).find('input:radio').click();
            }
        });

	$(".popup.edit-personalization")
		.on('click', '.btn-cancel', function(e){
			$.dialog('edit-personalization').close();
		})
		.on('click', '.btn-save', function(e){
			e.preventDefault();
			var $popup = $(this).closest('.popup'), form = $popup.data('form'), sale_item_cart_id = $popup.data('sicid'), xhr = $popup.data('xhr'), personalization = $popup.find(".text").val();

			try { xhr.abort() } catch(e){};
            startSpinner(form);
			$.ajax({
				type : 'PUT',
				url  : '/rest-api/v1/carts/saleitem/items/'+sale_item_cart_id+'/',
				data : {personalization:personalization, user : window.owner},
				beforeSend : function(xhr){ $popup.data('xhr', xhr); },
				complete : function(){
					$.dialog('edit-personalization').close();
					updateCart();
				}
			});
		})

	$(".saved-later")
		// move to wishlist
		.on('click', 'a.wishlist-item', function(event){
			var $this = $(this), $form = $this.closest('form');

			event.preventDefault();

			if( $this.hasClass('disabled') ) return;

			$this.addClass('disabled');

			$.ajax({
				type : 'POST',
				url  : '/add_want_tag.xml',
				data : {thing_id:$this.closest('li').attr('data-tid'), user : window.owner},
				dataType : 'xml',
				success  : function(xml){
                    if (dataLayer) {
                        dataLayer.push({'event': 'Add_to_Wishlist_Check', 'product_id': undefined, 'products': undefined, 'products_info': undefined, 'revenue': undefined, 'option_id': undefined });
                    }
					var $xml = $(xml), $st = $xml.find('status_code'), $tr, id, optId, params;
					if ($st.text() == 1) {
						
						updateWants(); 
						$this.closest("li").find("a.remove").attr('wishlist','true').click();
					}
				},
				complete : function(){
					$this.removeClass('disabled');
				}
			});
		})
		.on('click', 'a.cart', function(event){
			var $this = $(this), $form = $this.closest('form');

			event.preventDefault();

			if( $this.hasClass('disabled') ) return;
			if($this.hasClass('soldout')) return;

			$this.addClass('disabled');
			$.ajax({
				type : 'PUT',
				url  : '/rest-api/v1/carts/later/'+$this.closest('li').data('sicid'),
				data : {},
				dataType : 'json',
				success  : function(res){
					if (res) {
						var title = $this.closest('li').find('.stit > a').text();
						var option = $this.closest('li').find('.stit > span.detail').text();
						var itemStr = title + (option?" ("+option+")":"");
						if(res.quantity_changed){
							alert(itemStr+" has only "+res.quantity_remain+" in stock. We've updated the quantity for you.");							
						}
						$(".cart-item .cart-item-detail").addClass('loading');
						updateCart();

						var page = parseInt($this.closest('.saved-later').find('.pagination a.current').html());
						updateSavedForLater(page);
					}
				},
				error : function(res){
					try{
						var msg = JSON.parse(res.responseText).error_fields[0];
						alert(msg)
					}catch(e){
						alert('This item is currently unavailable.');
					}
				},
				complete : function(){
					$this.removeClass('disabled');
				}
			});
		})
		.on('click', 'a.remove', function(event){
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
					if (res.thing_id) {
						$this.closest(".cart-item").find("li.add-back").hide();
						var $addback = $this.closest(".cart-item").find("li.add-back._remove");
						if($this.attr('wishlist')){
							$addback = $this.closest(".cart-item").find("li.add-back._wishlist");
							$this.removeAttr('wishlist');
						}
						var $li = $this.closest('li');

						$addback
							.find("a")
								.html($li.find(".stit > a").html()).attr('href', $li.find(".stit > a").attr('href'))
							.end()
							.find("button.btn-undo")
								.attr("data-sicid", $li.data('sicid'))
							.end()
						.show().insertAfter($li);
						$li.remove();
					}
				},
				complete : function(){
					$this.removeClass('disabled');
				}
			});
		})
		.on('click', 'button._undo', function(event){
			var $this = $(this);
			event.preventDefault();
			if( $this.hasClass('disabled') ) return;
			$this.addClass('disabled');
			$.ajax({
				type : 'PUT',
				url  : '/rest-api/v1/carts/later/'+$this.attr('data-sicid'),
				data : {undo:true},
				dataType : 'json',
				success  : function(res){
					var page = parseInt($this.closest('.saved-later').find('.pagination a.current').html());
					updateSavedForLater(page);					
				},
				complete : function(){
					$this.removeClass('disabled');
				}
			});
		})
		.on('click', '.pagination a:not(.dash)', function(event){
			var $this = $(this);
			event.preventDefault();
			var $later = $this.closest(".saved-later");
			var page = parseInt($this.html());
			
			updateSavedForLater(page);

		})

	function makePagination($list, $el, page, totalCount){
		var itemsPerPage = 5;
		var maxPage = Math.ceil(totalCount/itemsPerPage);
		$list.find("li.add-back").hide();
		$el.empty();

		if(maxPage == 1){
			$el.hide();
		}else{
			$el.show();
		}

		for(var i=1; i<=maxPage; i++){
			if(maxPage < 11){
				$("<a href='#'' "+(i==page?"class='current'":"")+">"+i+"</a>").appendTo($el);
			}else{
				if( page < 7 ){
					if(i < 9 || i > maxPage-2){
						$("<a href='#'' "+(i==page?"class='current'":"")+">"+i+"</a>").appendTo($el);
					}
					if( i==9 ){
						$("<a href='#' class='dash'>···</a>").appendTo($el);
					}
				}else if( page > maxPage-6 ){
					if(i < 3 || i > maxPage-8){
						$("<a href='#'' "+(i==page?"class='current'":"")+">"+i+"</a>").appendTo($el);
					}
					if( i==maxPage-8 ){
						$("<a href='#' class='dash'>···</a>").appendTo($el);
					}
				}else{
					if(i < 3 || i > maxPage-2 || ( i > page-3 && i < page+3)){
						$("<a href='#'' "+(i==page?"class='current'":"")+">"+i+"</a>").appendTo($el);
					}
					if( i==3 || i==maxPage-2 ){
						$("<a href='#' class='dash'>···</a>").appendTo($el);
					}
				}
			}
			
		}
	}

	function updateSavedForLater(page){
		var fn = arguments.callee, $tpl = fn.$tpl, $later = $('.saved-later'), $list = $later.find('ul'), seq;
		if (!$tpl) fn.$tpl = $tpl = $list.find('>script').remove();
		if (!fn.seq) fn.seq = 0;

		seq = ++fn.seq;
		if (seq > 1000) seq = fn.seq = 1;

		$.ajax({
			url  : '/rest-api/v1/carts/later',
			data : {per_page:5, page: page},
			success : function(json){
				if (seq !== fn.seq) return;
				if (json.items.length === 0) return $later.hide();

				$list.find("li:not(.add-back)").remove();
				$.each(json.items, function(idx, item){
					item.item_price = item.item_price.replace(/\.00/,'');
					if(item.quantity > item.remaining_quantity) item.quantity = item.remaining_quantity;
					var $item = $tpl.template(item);
					if(item.is_sold_out){
						$item.find("a.cart").addClass('soldout').html('Sold out');
					}
					$item.appendTo($list);
				});
				makePagination( $later.find("ul"), $later.find(".pagination"), page, json.count);

				$later.show();
			}
		});
	};
	updateSavedForLater(1);

	// wanted list
	$('.add_wants')
		.on('click', 'a.btn-cart', function(event){
			event.preventDefault();
			var $this = $(this);
			$("#pop_wrap .sales_popup").html( $this.find(".sales_popup").html() );
			openPop("sales_popup");			
		})

	$('#pop_wrap .sales_popup')
		.on('click', '.btn-buy', function(event){
			event.preventDefault();
			var $this = $(this), params;
			params = {
				seller_id    : $this.data('sid'),
				quantity     : $this.closest("fieldset").find("p.qty select").val(),
				thing_id     : $this.attr('data-tid'),
				sale_item_id : $this.data('siid'),
				user : window.owner
			};
			if( $this.closest('fieldset').find('p.opt select').val() ){
				params['option_id'] = $this.closest('fieldset').find('p.opt select').val();
			}

			addToCart($this, params, function(){ 
				updateCart(); 
				closePop("sales_popup") 
			});
		})

	function updateWants(){
		var fn = arguments.callee, $tpl = fn.$tpl, $wants = $('.add_wants'), $list = $wants.find('>dd'), seq;
		if (!$tpl) fn.$tpl = $tpl = $list.find('>script').remove();
		if (!fn.seq) fn.seq = 0;

		seq = ++fn.seq;
		if (seq > 1000) seq = fn.seq = 1;

		$.ajax({
			url  : '/wanted_items_for_cart.json',
			success : function(json){
				if (seq !== fn.seq) return;
				if (json.length === 0) return $wants.hide();

				$list.empty();
				$.each(json, function(idx, item){
					//if (idx > 4) return false;
					var $item = $tpl.template(item);
					if(item.sale_item.options){
						$item.find("select.option_").removeAttr('disabled');
						$(item.sale_item.options).each(function(){
							if(this.available_for_sale){
								$item.find("select.option_").append("<option value='"+this.id+"'>"+this.option+(this.deal_price?(" ($"+this.deal_price)+")":"")+"</option>");
							}
						});
					}else{
						$item.find("select.option_").removeClass('option_').append("<option value=''>"+item.sale_item.title+"</option>");
					}
					$item.appendTo($list);
				});
				$wants.show();
			}
		});
	};
	updateWants();



    $('.payment_type input:radio[name^="payment_type"]:checked').click();

	// show notification bar if there is a cached message
	(function(message){
		if(message) $('h3.notify-bar.success').html(message).show();
		$.jStorage.deleteKey('cart.notification');
	})($.jStorage.get('cart.notification'));

	function addToCart($btn, data, callback){
		$btn.addClass('disabled').attr('disabled', true);
        if (dataLayer) {
            dataLayer.push({'event': 'Add_to_Cart_Button', 'product_id': data['sale_item_id'], 'products': undefined, 'products_info': undefined, 'revenue': undefined, 'option_id': data['option_id'] });
        }

		$.ajax({
			type : 'POST',
			url  : '/add_item_to_cart.json',
			data : data,
			dataType : 'json',
			success  : callback,
			complete : function(){
				$btn.removeClass('disabled').removeAttr('disabled');

				updateWants();
			}
		});
	}

	function removeItem($btn, data, callback){
		var $rows = $btn.closest('li');

		$btn.addClass('disabled').attr('disabled', true);
		$rows.addClass('disabled');

		var trackData = (function getTrackData() {
			try {
      var $item = $btn.closest('.item_');
      var box = $item.find('.qty select');
      var quantity = Number(box.val());
      var price = Number(box.attr('price'));
			var name = $item.find('.title').text().trim();
      var brand = $item.find('.shipped a').text();
			var variant = $item.find('.select-boxes2.option_ option:selected').text();
			if (variant) {
				variant = variant.match(/(.*) \(\$/)[1].trim();
			} else {
				variant = '';
			}

      return [String(price * quantity), [{
        id: $item.attr('data-sid'),
        brand: brand,
        name: name,
        quantity: quantity,
        price: String(price),
        variant: variant,
        location_id: $item.data('country'),
			}]];
		} catch(e) {}
    })();

		$.ajax({
			type : 'POST',
			url  : '/remove_cart_item.json',
			data : data,
			dataType : 'json',
			success  : callback || $.noop,
			complete : function(){
				$rows.removeClass('disabled');
				$btn.removeClass('disabled').removeAttr('disabled');
				TrackingEvents.removeFromCart.apply(null, trackData);
				updateWants();
			}
		});
	};

	function updateCart(){
		var $cart = $("form#cart-saleitem"), $btn, xhr = $cart.data('xhr'), params = {}, count, disabled;

		if (!window.owner || !$cart.length) {
			location.reload();
			return false;
		}

		// disable submit buttons
		$btn = $cart.find('.pay-button');
		disabled = !!$btn.attr('disabled');
		$("#cart-saleitem").attr('loading',true);

        startSpinner($cart[0]);
		
		params.user = window.owner;

		try { if(xhr) xhr.abort(); } catch(e){};

		$.ajax({
			url  : '/rest-api/v1/carts',
			data : params,
			beforeSend : function(xhr){ $cart.data('xhr', xhr); },
			success : function(json){
				disabled ? $btn.attr('disabled', true) : $btn.removeAttr('disabled');
				$("#cart-saleitem").removeAttr('loading');
                stopSpinner($cart[0]);
                var count = 0;
                json.items.forEach(function(v){ count += v.quantity })
                $("#header span.count").text( count);
		
				updateSaleitems(json.items);
				refresh_currency();
			}
		});

		function updateSummary(data){
			var prevSubtotal = parseFloat($cart.find('.receipt li.subtotal_ .price').text().replace(/[^0-9\.]/g,''));

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
			var $row = $cart.find('.receipt li.subtotal_'), txt;

			if ( subtotal < 0.5) {
				$('.select-card-payment input[type=radio]').prop('checked', true);
				$('.select-bitcoin-payment input[type=radio]').prop('checked', false);
				$('.select-bitcoin-payment').hide();
			} else {
				$('.select-bitcoin-payment').show();
			}

			txt = '$'+addCommas(subtotal.toFixed(2));

			$row.find('.price').text(txt);
			$row.closest(".wrap.cart").find(".currency_price").attr('price', txt.replace('$',''));
			
			// add 'add' class when subtotal is changed
			if(subtotal!=prevSubtotal){
				$cart.find('.receipt li.subtotal_').addClass('add');
				setTimeout(function(){
					$cart.find('.receipt li.subtotal_').removeClass('add');
				},2000)
			}

			// disable submit button if subtotal price is zero.
			disabled = (+data.subtotal_price === 0);
			
			// restore availibility of submit buttons
            disabled = ('available_before_shipping' in data)?!data.available_before_shipping:disabled;
			$btn.prop('disabled', disabled);            
		}

		function updateSaleitem(item){

			var id=item.item_id, $row = $cart.find(".item_[id=item-"+id+"]"), $tpl = $cart.find(".cart.wrap .cart-item ul > script");

			if(!$row.length){
				$row = $tpl.template({
							seller_id : item.seller_id, 
							item_id : item.item_id,
							thing_id : item.thing_id,
							sale_id : item.sale_id,
							option_id : item.option_id,
							saleitem_url : 'things/'+item.thing_id,
							image_url : item.sale_image_url,
							title : item.title, 
							option : item.option,
							sale_item_cart_id : item.id,
							price : item.item_price,
							seller_name : item.seller_name,
							seller_country : item.seller_country,
							brand_name : item.brand_name,
							personalization: item.personalization
						});
				if(item.available_options.length){
					$(item.available_options).each(function(){
						var option = this;
						if(option.soldout && option.id!=item.option_id) return true;
						var $opt = $("<option value='"+option.id+"' data-remaining-quantity="+option.remaining_quantity+"> "+option.name+(option.soldout?" - Sold out":("($"+option.price+")")) + "</option>");
						$row.find(".select-option select").append($opt);
					})
					$row.find(".select-option select").val(item.option_id);
					$row.find(".select-option").css('display','inline-block');
				}
				if(!item.personalizable) $row.find(".personalization").hide();
				$cart.find(".cart.wrap .cart-item ul").prepend($row);
			}
			
			// price
			$row.find('.price').text('$'+addCommas(item.item_price.replace(".00","")));
			if( parseInt(item.item_discount_percentage) > 0 ){
				$row.find('.price').addClass('sales').html('<small class="before">$'+addCommas(item.item_retail_price.replace(".00",""))+'</small> $'+addCommas(item.item_price.replace(".00","")));
			}

			if(item.personalizable) $row.find(".personalization em").text(item.personalization);

			// selected option
			if (item.option_id){
				$row.find('select.option_').val(item.option_id);
				// quantity
				(function(){
					var stock_quantity = item.remaining_quantity||10;
					stock_quantity = Math.min(stock_quantity,10);
					var $qty = $row.find('.qty > select'), i=0, len=stock_quantity, html='';
					if ($qty && $qty.length > 0) {
						//if (len != $qty[0].options.length) {
							while(++i <= len){
								html += '<option value="'+i+'">'+i+'</option>';
							}
							if( item.quantity > stock_quantity ){
								html += '<option value="'+item.quantity+'" selected>'+item.quantity+'</option>';	
							}
							$qty.html(html);
						//}
						$qty.val(item.quantity);

						var $stock = $row.find(".left_stock, .stock");
						$stock.removeClass("left_stock stock");
						if(stock_quantity > 10){
							$stock.addClass("stock").html("In Stock");
						}else{
							$stock.addClass("left_stock").html("Only "+stock_quantity+" left");
						}								
					}
				})();
			}else{
				// quantity
				(function(){
					var stock_quantity = item.remaining_quantity ? item.remaining_quantity : 10;
					stock_quantity = Math.min(stock_quantity,10);
					var $qty = $row.find('.qty > select'), i=0, len=stock_quantity, html='';
					if ($qty && $qty.length > 0) {
						//if (len != $qty[0].options.length) {
							while(++i <= len){
								html += '<option value="'+i+'">'+i+'</option>';
							}
							if( item.quantity > stock_quantity ){
								html += '<option value="'+item.quantity+'" selected>'+item.quantity+'</option>';	
							}
							$qty.html(html);
						//}
						$qty.val(item.quantity);

						var $stock = $row.find(".left_stock, .stock");
						$stock.removeClass("left_stock stock");
						if(stock_quantity > 10){
							$stock.addClass("stock").html("In Stock");
						}else{
							$stock.addClass("left_stock").html("Only "+stock_quantity+" left");
						}
					}
				})();
			}
			$row.find('.notification-cart,.unavailable').addClass('hidden');
			if(!item.available_before_shipping){
				$row.find('.unavailable').removeClass('hidden').text(item.error_message_before_shipping);
				if (item.notify_available) {
					$row.find('.notification-cart').removeClass('hidden');
				}
			}
		}

		function updateSaleitems(_items) {
		    var itemcount = 0, isAvailable = true;
			
			var items = {}, id, i, c, $shipping;

			for (i=0,c=_items.length; i < c; i++) {
				id = _items[i].sale_id;
				if (_items[i].option_id) {
					id += '-' + _items[i].option_id;
				}
				_items[i].item_id = id;
				items[id] = _items[i];
				isAvailable = isAvailable && _items[i].available_before_shipping;

				updateSaleitem(items[id]);
			}

			$cart.find('.item_').each(function(){
				var $row = $(this), m = $row.attr('id').match(/(\d+)(?:-(\d+))?$/), optId, rowId, saleId, item;
				
				rowId  = m[0];
				saleId = m[1];
				optId  = m[2]||'';

				if (!items[rowId]) {
					$row.remove();
					return;
				}

				item = items[rowId];

				itemcount+=item.quantity;
				
			});

			if(itemcount){
				$cart.find(".wrap.cart").show().end()
					.find(".empty.wrap").hide().end();

				$cart.find(".cart h2.tit").html(itemcount+" items in cart");
				updateSummary(_items);

				if( isAvailable ){
					$(".btn-checkout").removeAttr('disabled');
				}else{
					$(".btn-checkout").attr('disabled','disabled');
				}

			}else{
				$cart.find(".wrap.cart").hide().end()
					.find(".empty.wrap").show().end();
			}

		}

		function size(obj){
			var len = 0;
			for(var x in obj) {
				if(obj.hasOwnProperty(x)) len++;
			}
			return len;
		}
	};

	function fixedSummary(){
		$('.total-frm').each(function(){
			if ($(this).parents('.cart-summary').height()<$(this).parents('.wrapper').find('.cart-list').height()) {
				$(this).parents('.cart-summary').addClass('fixed').css('padding-bottom',$(this).height()+'px');
			}
		});
	}

    var spinners = {};
    function startSpinner(cart) { 
        var id = $(cart).attr('id');
        if (spinners[id]) return;
        initSpinner(id);
    }
    function stopSpinner(cart) {    
        var id = $(cart).attr('id');
        if (spinners[id]) {
            spinners[id].stop().targetElement.hide();
            delete spinners[id];
        }
    }
    function initSpinner(id) { 
        if (spinners[id]) return spinners[id];
        var opts = { lines: 9, // The number of lines to draw
                length: 10, // The length of each line
                width: 4, // The line thickness
                radius: 8, // The radius of the inner circle
                corners: 0.9, // Corner roundness (0..1)
                rotate: 69, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#87888a', // #rgb or #rrggbb or array of colors
                speed: 1.5, // Rounds per second
                trail: 64, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: 'auto', // Top position relative to parent in px
                left: 'auto' // Left position relative to parent in px
        };
        var $target = $('#loading-' + id);
        $target.show();
        spinner = new Spinner(opts).spin($target[0]);
        spinner.targetElement = $target;
        spinners[id] = spinner;
        return spinner;
    }
	
	$(document).delegate(".function .help","click",function(e){
		e.preventDefault();
		var $el = $(e.target);
		var sale_id = $el.data('sale-id');
		var sale_title = $el.data('sale-title');
		var option_title = $el.data('option-title')||"";
		var username = $el.data('username');
		var country = $el.parents('form').find('select[name=shipping_addr] option:selected').data('country');
		var mail_query_str = "?subject=Request Price Quote for International Shipping #"+sale_id;
		mail_query_str += "&body=Item: "+sale_title+"%0D%0AOption: "+option_title+"%0D%0ACountry: "+country+"%0D%0AUsername: "+username;
		$.dialog('price_quote').$obj.find("._mailto").attr('href',"mailto:cs@fancy.com"+mail_query_str);
		$.dialog('price_quote').open();
	});

	$("#cart-saleitem").submit(function(e){
		e.preventDefault();

		var $this = $(this);

        $(".pay-button").attr('disabled','disabled');

		if($this.attr('loading')){
			setTimeout(function(){
				$("#cart-saleitem").submit();
			},200);
			return;
		}

        var selected_method = $("input[name=payment_type]:checked").val()
            
		var params = {
			"payment_gateway": 6		
		};
        if (selected_method == 'pay-with-google') {
            window.startPayWithGoogle();
            return;
        } else if(selected_method == 'bitcoin'){
			params.payment_gateway = 5;
		} else if(selected_method == 'bitpay'){
			params.payment_gateway = 21;
		} else if(selected_method == 'alipay'){
			params.payment_gateway = 19;
		} else if (selected_method == 'crypto') {
		        params.payment_gateway = 23; 
		}

        if(!window.owner) {
            if($(this).attr('allow-guest-checkout')) {
                document.location.href= "/checkout?pg="+params.payment_gateway;
                return;
            } else {
                window.require_login();
                return;
            }
		} else {
            $.ajax({
                type : 'POST',
                url  : '/rest-api/v1/checkout',
                contentType: "application/json; charset=utf-8",
                data : JSON.stringify(params),
                processData : false,
                success  : function(res){
									try {
                    var items = TrackingEvents.Util.extractSalesFromCart(res.sale_items_freeze);
                    TrackingEvents.beginCheckout(res.total_prices, items);
									} catch(e) { console.warn(e); }
										setTimeout(function() {
											document.location.href= "/checkout";
										}, 1000);
                },
                error: function(xhr) {
                    var message = "Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText;
                    try {
                        var res = JSON.parse(xhr.responseText);
                        if (res && res.error) message = res.error;
                    } catch (e) {
                    }
                    alert(message);
                    location.reload(); 
                }
            });
        }
	});

	$('#header a.cart').addClass('disabled');

});
