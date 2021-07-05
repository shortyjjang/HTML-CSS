jQuery(function($){

    // currency approximately
    var str_currency = $('.cart-payment .currency_price').eq(0).text();
    var dlg_currency = $.dialog('show_currency');
    var $currency_list = $('.popup.show_currency .currency-list');

    function refresh_currency(){
        var $currency = $('.cart-payment .currency_price');
        
        $currency.text(str_currency);

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
                return $(el).closest(".wrapper").find(".change_currency").show().end().find(".currency .country, .currency .currency_price").hide();
            }else{          
                $(el).closest(".wrapper").find(".currency .country, .currency .currency_price").show().end().find(".change_currency").hide();
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

        $currency.closest(".wrapper").delegate('a.change_currency, a.code', 'click', function(event){
            var $this = $(this);
            event.preventDefault();
            if(!$currency_list.hasClass('loaded')) return;

            var old_dlg_class= $('#popup_container').attr('class');
            function close_currency() {
                if (old_dlg_class) $.dialog(old_dlg_class).open();
                else dlg_currency.close();
            }

            var my_currency = $currency.filter(":visible").eq(0).attr('currency');
            if (my_currency) {
                var my_currency_selector = 'li.currency[code="'+my_currency+'"]'
                $currency_list.find(my_currency_selector).find('a').addClass('current');
                var $ul_major = $currency_list.find('.right[code="all"] ul.major');

                var $my_currency_item = $ul_major.find(my_currency_selector);
                if ($my_currency_item.length == 0) {
                    var $ul_all = $currency_list.find('.right[code="all"] ul').not('.major');
                    $my_currency_item = $ul_all.find(my_currency_selector).clone();
                }
                $ul_major.prepend($my_currency_item)
            }
            dlg_currency.open()
            dlg_currency.$obj
                .find('.right-outer .right[code="all"]').show().end()
                .find('.right-outer .right').not('[code="all"]').hide().end().end()
                .off('click', 'button.cancel')
                .on('click', 'button.cancel', function() {
                    close_currency();
                })
                .off('click', 'button.save')
                .on('click', 'button.save', function(event) {
                    event.preventDefault();
                    var code = $currency_list.find('.right li a.current').parent().attr('code');
                    show_currency( $this.closest('.wrapper').find('.currency').find('.currency_price'), code, true);
                    close_currency();
                });
        });
        
    };

    refresh_currency();

    var $tplNoti = $('tbody > script').remove().eq(0), txt = $tplNoti.text();
    var $tplCoupon = $('dl.coupon > dd.list > script').remove().eq(0);
    var $tplCouponInline =$('span.function > em.coupon-list > script').remove().eq(0);
    var $tplPackage = $('script[type="fancy/package-template"]').remove().eq(0);
    var $tplPackageItem = $('script[type="fancy/package-item-template"]').remove().eq(0);

    $tplNoti.text( txt.replace('%s', '##title##') );
    var undoing = false;

    $('form.merchant_')
        .on('update', function(){
            updateCart();
        })
        .on('submit', function(){
            var $this = $(this), $addr = $this.find('select[name^="shipping_addr"]');
            if ($addr.length) {
                var shipping = $addr.val();
                if (!/^\d+$/.test(shipping)) {
                    $wallet_addr = $this.find('input[name="shipping_addr_wallet"]').val();
                    if ($wallet_addr && $wallet_addr.length && $wallet_addr != "") {
                    } else {
                        if( $addr.hasClass('owner-addr') ) {
                            alert(gettext("Please choose a number owner's address"));   
                        } else {
                            alert(gettext("Please choose a shipping address")); 
                        }
                        return false;
                    }
                }
            }
            $this.find(':submit').attr('disabled', true);
        })
        // quantity
        .on('click', '.qty > .btn-up, .qty > .btn-down', function(e){
            e.preventDefault();

            var $this = $(this), $qty = $this.closest('.qty').find("input");
            var qty = parseInt($qty.val());
            if( $this.hasClass('btn-up')){
                qty = (qty+1)||1;
            }else{
                qty = (qty-1)||1;
            }
            if(qty<1) qty = 1;
            $qty.val(qty).trigger('change');

        })
        .on('change keyup blur', '.qty > input', function(){
            var $this = $(this), form = this.form, sale_item_cart_id = $this.attr('sicid'), unitPrice = parseFloat($this.attr('price')), xhr = $this.data('xhr');
            if(parseInt(this.value)<1) {
                alertify.alert('please input valid quantity');
                return;
            }
            try { xhr.abort() } catch(e){};
            startSpinner(form);
            $.ajax({
                type : 'PUT',
                url  : '/rest-api/v1/carts/saleitem/items/'+sale_item_cart_id+'/',
                data : {quantity:this.value, user : window.owner},
                beforeSend : function(xhr){ $this.data('xhr', xhr); },
                select : function(item){
                    if (item.error_message_before_shipping) {
                        alert(item.error_message_before_shipping);
                        stopSpinner(form);
                    }
                },
                complete : function(){
                    updateCart(true);
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
            event.preventDefault();
                        if (!window.owner) { require_login(); return; }

            var $this = $(this), params, optionId;

            params = {sale_item_id : $this.data('siid'), user : window.owner};

            if (optionId = $this.data('sio')) {
                params['option_id'] = optionId;
            }

            if ($this.data('is_notify')) params['remove'] = 1;

            $.ajax({
                type : 'post',
                url  : '/wait_for_product_secure.json',
                data : params,
                dataType : 'json',
                success  : function(json){
                    if (!json || !('status_code' in json)) return; 
                    if (json.status_code) {
                        if(params['remove']){
                            $this.html("Notify Me");
                        }else{
                            $this.html("Cancel notification");
                        }
                        $this.data('is_notify', !params['remove']);
                        updateCart();
                    } else if (json.status_code == 0 && json.message) {
                        alert(json.message);
                    }
                }
            });
        })
        // changing option
        .on('change', 'select.option_', function(event){
            var $this = $(this), xhr = $this.data('xhr'), sale_item_cart_id = $this.attr('data-sicid'), siid = $this.attr('data-siid'), oid = this.value, $row = $this.closest('.item_'), params;

            params = {
                option_id : oid,
                user : window.owner
            };

            if($this.find('option:selected').data('remaining-quantity') < $this.closest('.item_').find('.qty > select').val()){
                var quantity = $this.find('option:selected').data('remaining-quantity');

                alertify.alert($this.find("option:selected").html()+" has only "+quantity+" in stock. We've updated the quantity for you.");
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

                        $this.attr('data-optionid', oid).closest('.option').find('.change-option').html( $this.find("option:selected").html().replace(/( - Sold out:)?\(\$[0-9\.]*\)$/,''));
                    }else{
                        $this.val($this.attr('data-optionid'));
                    }
                    updateCart(true);

                    if (item.error_message_before_shipping) alert(item.error_message_before_shipping);
                }
            });
        })
        // remove items
        .on('click', 'a.remove-item_', function(event){
            var $this = $(this), $form = $this.closest('form'), data;

            event.preventDefault();

            if( $this.hasClass('disabled') ) return;

            data = { sale_item_cart_id:$this.data('sicid'), is_fancybox:($this.data('type') == 'fancybox'), user : window.owner};

            removeItem($this, data, function(json){
                if (!json.status_code) {
                    if (json.message) alert(json.message);
                    return;
                }

                var $addback = $this.closest("div.cart-item").find("li.add-back");
                var $li = $this.closest('li');
                $addback
                    .find("a")
                        .html($li.find("b.title").html())
                        .attr('href', $li.find(".item a").attr('href'))
                    .end()
                    .find("button.btn-cart")
                        .attr("data-tid", $li.attr('data-tid'))
                        .attr("data-sid", $li.attr('data-sid'))
                        .attr("data-siid", $li.attr('data-siid'))
                        .attr('data-qty', $li.find(".qty input").val())
                        .attr('data-sio', $li.find("select.option_").val() || null)
                    .end()
                .show()
                .insertAfter($li);
                if(json.is_sold_out[data.sale_item_cart_id]){
                    $addback.find("button.btn-cart").hide();
                }else{
                    $addback.find("button.btn-cart").show();
                }

                $li.remove();

                updateCart(true);
            });
        })
        // save for later
        .on('click', 'a.wishlist-item_', function(event){
            var $this = $(this), $form = $this.closest('form');

            event.preventDefault();

            if (!window.owner) { require_login(); return; }
            if (window.ownerID != window.viewerID) { alert("Not supported"); return; }
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
                            sale_item_cart_id : $this.data('sicid'),
                            is_fancybox : 'false'
                        };

                        removeItem($this, params, function(){ 
                            if( $this.closest('ul').find('li').length==1 ){
                                $this.closest('ul').prev('h3').remove().end().remove();
                            }else{
                                $this.closest('li').remove();
                            }
                            updateCart(true); 
                            updateSavedForLater(1); 
                        });
                    }
                },
                complete : function(){
                    $this.removeClass('disabled');
                }
            });
            try { track_event('Save for Later', { 'sale id': $this.closest('.item_').data('siid') }); } catch(e) { console.log(e) }
        })
        // restore from deleted to cart
        .on('click', 'button.undo_', function(event){
            var $this = $(this);

            event.preventDefault();

            if($this.hasClass('disabled') || undoing) return;
            $this.addClass('disabled');
            undoing = true;

            var params = {
                quantity    : $this.attr('data-qty'),
                sale_id     : $this.attr('data-siid'),
                user_id        : window.ownerID
            };

            if ($this.data('sio')) {
                params.option_id = $this.attr('data-sio');
            }
            
            addToCart($this, params, function(){ 
                undoing = false;
                $this.removeClass('disabled').closest("li.add-back").hide(); 
                updateCart(); 
            });     
        })
        // dismiss
        .on('click', 'a.dismiss_', function(event){
            var $this = $(this), $tr = $this.closest('tr');

            event.preventDefault();

            $tr.nextAll('tr:hidden').remove().end().next().andSelf().remove();

            updateCart();
        })
        // payment types
        .on('click', 'input:radio[name^="payment_type"]', function(){
                    var method = this.value, $this = $(this), $buttons = $this.closest('.cart-payment').find(".payment-button");
                    $this.closest('ul').find('li').removeClass('selected').end().end().closest('li').addClass('selected');
                    if (method == 'amex-express') {
                        $buttons.hide().filter("#amex-express-checkout").show();
                    } else if (method == 'paypal') {
                        $buttons.hide().filter("#paypal-button").show();
                    } else {
                        $buttons.hide().filter(".btn-checkout").show();
                    }
                    
        })
        .on('click', '.user-add-item .btn-add-item', function(event) {
            event.stopPropagation();
            var $this = $(this), $sale_id = $(this).closest('.user-add-item').find('input[name=sale_id]');
            var sale_id = $.trim($sale_id.val());
            if (!sale_id.length || isNaN(sale_id)) {
                alert("Enter a sale item ID to add.")
            }
            params = {
                quantity: 1,
                sale_id : sale_id,
                user_id : window.ownerID
            };
            addToCart($this, params, function(){ 
                $sale_id.val('');
                $(".cart-item .cart-item-detail").addClass('loading');
                updateCart();
                $(document.documentElement).stop().animate({scrollTop:0}, 500);
            });

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

    $("div.saved-later")
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
                        dataLayer.push({'event': 'Add_to_Wishlist_Check', 'product_id': undefined, 'products': undefined, 'products_info': undefined, 'revenue': undefined, 'option_id': undefined, 'option_id': undefined });
                    }
                    var $xml = $(xml), $st = $xml.find('status_code'), $tr, id, optId, params;
                    if ($st.text() == 1) {
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
                        updateCart(true);

                        var page = parseInt($this.closest('.saved-later').find('.pagination a.current').html());
                        updateSavedForLater(page);
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
                    var page = parseInt($this.closest('.saved-later').find('.pagination a.current').html());
                    updateSavedForLater(page);
                },
                complete : function(){
                    $this.removeClass('disabled');
                }
            });
        })
        // .on('click', '.pagination a:not(.dash)', function(event){
        //     var $this = $(this);
        //     event.preventDefault();
        //     var page = parseInt($this.html());

        //     updateSavedForLater(page);
        // })

    $('form.wrapper input:radio[name^="payment_type"]:checked').click();

    // show notification bar if there is a cached message
    (function(message){
        if(message) $('h3.notify-bar.success').html(message).show();
        $.jStorage.deleteKey('cart.notification');
    })($.jStorage.get('cart.notification'));

    function makeSavedLaterPaging($el){
        var $ul = $el.find("ul");
        $ul.attr("page", 1);
        $el.find(".paging").show();
        $el.find(".paging")
        .find("a.next").click(function(e){
            e.preventDefault();
            var maxPage = Math.ceil($el.data('totalCount') / 5);
            var page = $ul.attr("page")||1;
            if(page==maxPage) return;
            page++;
            updateSavedForLater(page);
            $ul.attr("page", page);
            if(page==maxPage){
                $el.find(".paging a.next").addClass("disabled");
            }
            $el.find(".paging a.prev").removeClass("disabled");
            $el.find(".paging > small").html("Page "+page+" of "+maxPage);
        }).end()
        .find("a.prev").click(function(e){
            e.preventDefault();
            var maxPage = Math.ceil($el.data('totalCount') / 5);
            var page = $ul.attr("page")||1;
            if(page==1) return;
            page--;
            updateSavedForLater(page);
            $ul.attr("page", page);
            if(page==1){
                $el.find(".paging a.prev").addClass("disabled");
            }
            $el.find(".paging a.next").removeClass("disabled");
            $el.find(".paging > small").html("Page "+page+" of "+maxPage);
        });
    }

    makeSavedLaterPaging($('div.saved-later'));

    function updateSavedForLater(page){
        var fn = arguments.callee, $tpl = fn.$tpl, $later = $('div.saved-later'), $list = $later.find('>ul'), seq;
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

                $list.empty();

                $.each(json.items, function(idx, item){
                    item.item_price = item.item_price.replace(/\.00/,'');
                    if(item.quantity > item.remaining_quantity) item.quantity = item.remaining_quantity;
                    var $item = $tpl.template(item);
                    if(item.is_sold_out){
                        $item.find("a.cart").addClass('soldout').html('Sold out');
                    }
                    $item.appendTo($list);
                });
                $later.data('totalCount', json.count)
                var maxPage = Math.ceil($later.data('totalCount') / 5);
                if(maxPage==1){
                    $later.find(".paging").hide().find("a").addClass("disabled");
                }
                $later.find(".paging").find("> small").html("Page 1 of "+maxPage);

                if(json.count > 0 ) $later.removeClass('empty');

                $later.find("h3.stit .number").html( json.count+" item"+(json.count>1?'s':''));
                $later.show();
            }
        });
    };
    updateSavedForLater(1);

	function updateWants(){
		var fn = arguments.callee, $tpl = fn.$tpl, $wants = $('.recommend div.add_wants'), $list = $wants.find('>ul'), seq;
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
				makeScrollable( $wants );
			}
		});
	};
	updateWants();

	function updateRecentlyViewed(){
		$.ajax({
            type : 'get',
            url  : '/recently_viewed_things.json?cart',
            success  : function(html){
                if(!html) return;
                $('.recommend .recently_item ul').html(html);
                if($('.recommend .recently_item ul > li').length){
                	$('.recommend .recently_item').show();
                	makeScrollable( $('.recommend .recently_item') );
                }

            },
            error : function(){
            	$('.recommend .recently_item').hide();
            }
        });
	};
	updateRecentlyViewed();

    // recommended list
    $('.recommend')
        .on('click', '.btn-cart', function(event){
            var $this = $(this);
            var $show_cart = $(this).closest(".show_cart");
            if($show_cart.find("em").length){
                if( $show_cart.find("select[name=option_id] option").length > 1 || !!$show_cart.find("button.add_to_cart").attr('style')){
                    $(this).closest('li').addClass('active').find('.opened').removeClass('opened').end().find('.show_cart').addClass('opened');
                }else{
                    $(this).closest('.show_cart').find('.add_to_cart').click();
                }
                $show_cart.trigger('mixpanel');
            }else{
                $(this).closest('.show_cart').data('click', true);
            }
        })
        .on('click', '.show_cart .trick', function(event){
            event.preventDefault();
            $(this).closest('li').removeClass('active').find('.opened').removeClass('opened');
        })
        .on('click', '.add_to_cart', function(event){
            var $this = $(this), params;

            params = {
                quantity: $this.closest('em').find("select[name=quantity]").val(),
                sale_id : $this.attr('sii') || $this.attr('data-siid'),
                user_id : window.ownerID
            };
            
            if ($this.closest('em').find("select.option_").val()) {
                params.option_id = $this.closest('em').find("select.option_").val();
            }

            addToCart($this, params, function(){ 
                $this.closest('li').removeClass('active').find('.opened').removeClass('opened');
                $(".cart-item .cart-item-detail").addClass('loading');
                updateCart();
                $(document.documentElement).stop().animate({scrollTop:0}, 500);
            });
        })
        .on('mixpanel', 'span.show_cart', function(event) {
            var $this = $(this), $add_to_cart = $this.closest('.show_cart').find('.add_to_cart');
            var param = { 'thing id': $add_to_cart.attr('tid'), 'sale id': $add_to_cart.attr('sii'), 'via': $add_to_cart.attr('via'), 'section': $add_to_cart.attr('section')};
            if( $this.find("select[name=option_id]").length || !!$this.find("button.add_to_cart").attr('style')){
                param['option popup'] = true;
            } else {
                param['option popup'] = false;
            }
            try { track_event('Buy', param); } catch(e) { console.log(e) }
        });

    function makeScrollable($el){
        var $ul = $el.find("ul");
        var $items = $ul.find("> li");
        var maxPage = 1;
		var scrollArea = $ul.outerWidth();

        if ($ul.hasClass('cart-item-detail') ) {maxPage = $items.length;}
		else{maxPage = Math.ceil($items.length/5);}

        $el.find(".paging")
        .find("> small").html("Page 1 of "+maxPage).end()
        .find("a.next").click(function(e){
            e.preventDefault();
            var page = $ul.attr("page")||1;
            if(page==maxPage) return;
            page++;
            var newLeft = (page-1) * scrollArea;
            $ul.animate({'scrollLeft':newLeft},200);
            $ul.attr("page", page);
            if(page==maxPage){
                $el.find(".paging a.next").addClass("disabled");
            }
            $el.find(".paging a.prev").removeClass("disabled");
            $el.find(".paging > small").html("Page "+page+" of "+maxPage);
        }).end()
        .find("a.prev").click(function(e){
            e.preventDefault();
            var page = $ul.attr("page")||1;
            if(page==1) return;
            page--;
            var newLeft = (page-1) * scrollArea;
            $ul.animate({'scrollLeft':newLeft},200);
            $ul.attr("page", page);
            if(page==1){
                $el.find(".paging a.prev").addClass("disabled");
            }
            $el.find(".paging a.next").removeClass("disabled");
            $el.find(".paging > small").html("Page "+page+" of "+maxPage);
        });
        if(maxPage==1){
            $el.find(".paging").hide().find("a").addClass("disabled");;
        }
    }
    makeScrollable( $(".recommend div.people_bought") );

    function addToCart($btn, data, callback){
        $btn.addClass('disabled').attr('disabled', true);
        Fancy.CartAPI.addItem(data, function(success, json) {
            if (success) {
                
            } else {
                alertify.alert(json.error || "Failed to add the item to cart!")
            }
            $btn.removeClass('disabled').removeAttr('disabled');
            callback && callback();
        });
    }

    function removeItem($btn, data, callback){
        var $rows = $btn.closest('li');

        $btn.addClass('disabled').attr('disabled', true);
        $rows.addClass('disabled');

        var $item = $btn.closest('.item_');
        var trackData = (function getTrackData() {
            try {
                var box = $item.find('.qty input[type=text]');
                var quantity = Number(box.val());
                var price = Number(box.attr('price'));
                var variant = '';
                var name = $item.find('.item .title').text();
                var brand = $item.find('.info a').text();
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
                    location_id: $item.data('country')
                }]];
            } catch(e) {}
        })();
        
        $.ajax({
            type : 'POST',
            url  : '/remove_cart_item.json',
            data : data,
            dataType : 'json',
            success  : function(json) {
                callback && callback(json);
                if (json.status_code == 1) {
                    try {
                        TrackingEvents.removeFromCart.apply(null, trackData);
                    } catch (e) {}
                    // crdl will be called on update
                }
            },
            complete : function(resp){
                $rows.removeClass('disabled');
                $btn.removeClass('disabled').removeAttr('disabled');
            }
        });
    };

    function updateCart(logUpdates){
        var $cart = $("form#cart-saleitem"), $btn, xhr = $cart.data('xhr'), params = {}, count, disabled;

        if (!$cart.length) {
            $(".cart-item .cart-item-detail").addClass('loading'); 
            location.reload();
            return false;
        }

        // disable submit buttons
        $btn = $cart.find('button:submit:not(.undo_)');
        disabled = !!$btn.attr('disabled');
        $("#cart-saleitem").attr('loading',true);

        startSpinner($cart[0]);
        params.cart_type = $cart.attr('id').replace(/^cart-/, '');
        if (/^\d+$/.test(params.cart_type)) {
            params.seller_id = params.cart_type;
            params.cart_type = 'saleitem';
        }

        params.user = window.owner;

        try { if(xhr) xhr.abort(); } catch(e){};

        $.ajax({
            url  : '/rest-api/v1/carts',
            data : params,
            beforeSend : function(xhr){ $cart.data('xhr', xhr); },
            success : function(json){
                disabled ? $btn.attr('disabled', true) : $btn.removeAttr('disabled');
                $("#cart-saleitem").removeAttr('loading');
                $(".cart-item .cart-item-detail").removeClass('loading');
                stopSpinner($cart[0]);
                
                updateSaleitems(json.items);
                refresh_currency();
                
                if (logUpdates && !window.DO_NOT_TRACK) {
                    try {
                        crdl(Fancy.CartAPI.getCordialEvents(json.items || []));
                    } catch (e) {
                        console.error(e);
                    }
                }
                Fancy.Cart.setItems(json.items);
            }
        });

        function updateSummary(data){
            var prevSubtotal = parseFloat($cart.find('.payment-reciept > li.subtotal_ .price').text().replace(/[^0-9\.]/g,''));

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
            var $row = $cart.find('.payment-reciept > li.subtotal_'), txt;
            $row.show();
            
            if ( subtotal < 0.5) {
                $('.select-card-payment input[type=radio]').prop('checked', true);
                $('.select-bitcoin-payment input[type=radio]').prop('checked', false);
                $('.select-bitcoin-payment').hide();
            } else {
                $('.select-bitcoin-payment').show();
            }           

            txt = '$'+addCommas(subtotal.toFixed(2));

            $row.find('.price').text(txt);
            $row.closest(".cart-payment").find(".currency_price").attr('price', txt.replace('$',''));
            
            // add 'add' class when subtotal is changed
            if(data.subtotal_price!=prevSubtotal){
                $cart.find('.payment-reciept > li.subtotal_').addClass('add');
                setTimeout(function(){
                    $cart.find('.payment-reciept > li.subtotal_').removeClass('add');
                },2000)
            }

            // disable submit button if subtotal price is zero.
            disabled = (+data.subtotal_price === 0);
            
            // restore availibility of submit buttons
            disabled = ('available_before_shipping' in data)?!data.available_before_shipping:disabled;
            $btn.prop('disabled', disabled);            
        }

        function updateSaleitem(item){
            var id=item.item_id, $row = $cart.find(".item_[id=item-"+id+"]"), $tpl = $cart.find(".cart-item.wrapper> script");

            if(!$row.length){
                var $seller = $tpl.template({
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
                            seller_name : item.seller_name,
                            seller_country : item.seller_country,
                            brand_name : item.brand_name,
                            personalization: item.personalization
                        });
                $row = $seller.find("li");
                if(item.available_options.length){
                    $(item.available_options).each(function(){
                        var option = this;
                        if(option.soldout && option.id!=item.option_id) return true;
                        var $opt = $("<option value='"+option.id+"' data-remaining-quantity="+option.remaining_quantity+"> "+option.name+(option.soldout?" - Sold out":("($"+option.price+")")) + "</option>");
                        $row.find(".option select").append($opt);
                    })
                    $row.find(".option select").val(item.option_id);
                    var optionLabel = ($row.find(".option select>option:selected").html() || '').replace(/( - Sold out:)?\(\$[0-9\.]*\)$/,'');
                    $row.find(".option .change-option").html( optionLabel );
                    if ($row.find(".option select>option").length < 2) {
                        $row.find(".option").addClass('one-option').show();
                    }else {
                        $row.find(".option").show();
                    }
                }
                if(!item.personalizable) $row.find(".personalization").hide();

                $h3 = $cart.find("h3[data-seller_id="+item.seller_id+"]");

                if ($h3.length) {
                    $h3.next().prepend($row);
                } else {
                    $cart.find(".cart-item.wrapper").prepend($seller);
                }
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
                    var stock_quantity = item.remaining_quantity ? item.remaining_quantity : 10;
                    stock_quantity = Math.min(stock_quantity,10);
                    var $qty = $row.find('.qty input');
                    
                    if ($qty && $qty.length > 0) {
                        var userSelectedQty = Number($qty.val()) || 0;
                        if (item.quantity != null && userSelectedQty > item.quantity) {
                            alertify.alert('Currently there are ' + item.quantity + ' items only in stock.');
                        }
                        $qty.val(item.quantity||1);
                        var $stock = $row.find(".left_stock, .stock");
                        $stock.removeClass("left_stock stock");
                        if(stock_quantity >= 10){
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
                    var $qty = $row.find('.qty input');
                    if ($qty && $qty.length > 0) {
                        var userSelectedQty = Number($qty.val()) || 0;
                        if (item.quantity != null && userSelectedQty > item.quantity) {
                            alertify.alert('Currently there are ' + item.quantity + ' items only in stock.');
                        }
                        $qty.val(item.quantity||1);

                        var $stock = $row.find(".left_stock, .stock");
                        $stock.removeClass("left_stock stock");
                        if(stock_quantity >= 10){
                            $stock.addClass("stock").html("In Stock");
                        }else{
                            $stock.addClass("left_stock").html("Only "+stock_quantity+" left");
                        }
                    }
                })();
            }
            $row.find('.notification-cart,.unavailable').addClass('hidden');
            if(!item.available_before_shipping){
                if (item.notify_available) {
                    $row.find('.notification-cart').removeClass('hidden').find('p > b').text(item.error_message_before_shipping);
                } else {
                    $row.find('.unavailable').removeClass('hidden').text(item.error_message_before_shipping);
                }
                $row.find("span.action").hide();
            }

            var optionLabel = ($row.find(".option select>option:selected").html() || '').replace(/( - Sold out:)?\(\$[0-9\.]*\)$/,'');
            $row.find(".option .change-option").html( optionLabel );
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
				$(".cart > h2").show();
                $cart.find(".cart-item.wrapper, .cart-payment.wrapper").show().end()
                    .find(".empty-cart.wrapper").hide().end()
                    .find(".saved-later").removeClass('empty').end();

                $cart.find('button.btn-checkout').show();
                $cart.find(".cart-item h3.stit").html(itemcount+" items in cart");
                updateSummary(_items);

                if( isAvailable ){
                    $(".btn-checkout").removeAttr('disabled');
                }else{
                    $(".btn-checkout").attr('disabled','disabled');
                }
            } else {
                $('.payment-reciept .price').text('$0');
                $('.cart-payment .currency_price').attr('price', '0');
                $(".btn-checkout").attr('disabled','disabled');
                refresh_currency();
            }
            // else{
			// 	$(".cart > h2").hide();
            //     $cart.find(".cart-item.wrapper, .cart-payment.wrapper").hide().end()
            //         .find(".empty-cart.wrapper").show().end()
            //         .find(".saved-later").addClass('empty').end();
            // }

        
            $('form.merchant_').find(".cart-item > h3").each(function(){
                var $this = $(this), $list = $this.next();
                if( !$list.find("li").length ) {
                    $list.remove();
                    $this.remove();
                }
            })
    
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

        if($this.attr('loading')){
            setTimeout(function(){
                $("#cart-saleitem").submit();
            },200);
            return;
        }
        var method = $("[name=payment_type]:checked").val();
        var params = {
            "payment_gateway": 6
        };
        if (method == 'pay-with-google') {
            window.startPayWithGoogle();
            return;
        } else if(method == 'bitcoin'){
            params.payment_gateway = 5;
        } else if(method == 'bitpay'){
            params.payment_gateway = 21;
        } else if (method == 'crypto') {
            params.payment_gateway = 23;            
        } else if (method == 'alipay') {
            params.payment_gateway = 19;
        }
        if('incomplete_address' in location.args) {
            params['incomplete_address'] = true;
            params['shipping_addr'] = {
                address1: 'TESTADDRESS1',
                zip: '20012',
                city: 'Palo Alto',
                state: 'CA',
                country: 'United States',
                full_name:'Incomplete Address test'
            }
        }
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
				document.location.href= "/checkout";
            }
        }).fail(function(xhr) {
            var message = "Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText;
            try {
                var res = JSON.parse(xhr.responseText);
                if (res && res.error) message = res.error;
            } catch (e) {
            }
            alertify.alert(message, function() { location.reload(); });
        });

        if (dataLayer) {
            dataLayer.push({'event': 'Checkout_Button', 'product_id': undefined, 'products_info': undefined, 'revenue': undefined, 'producst': undefined, 'option_id': undefined });
        }
    });

    $("#cart-vanity").submit(function(e){
        e.preventDefault();

        var $this = $(this);

        var params = {
            "payment_gateway": 6,
            "is_vanity": 'true'
        };

        $.ajax({
            type : 'POST',
            url  : '/rest-api/v1/checkout',
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(params),
            processData : false,
            success  : function(res){
                document.location.href= "/checkout";
            },
            error : function(res) {
                console.log(res);
                if (res.responseText) {
                    var json = JSON.parse(res.responseText)
                    if (json.error) {
                        alert(json.error);  
                    }
                }
                $this.find('.btn-checkout').removeAttr('disabled');
            }
        });
    });

});
