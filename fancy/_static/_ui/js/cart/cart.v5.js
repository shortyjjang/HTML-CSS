jQuery(function($){
    var $cart = $cart = $("form#cart-saleitem");
    var undoing = false;

    if( $(".btn-checkout").attr('data-is_available_for_sale') == '1' ){
        // enable the submit button after the script is fully loaded
		$(".btn-checkout").removeAttr('disabled');
	}

    $cart
        .on('update', function(){
            updateCart();
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
            startSpinner();
            $.ajax({
                type : 'PUT',
                url  : '/rest-api/v1/carts/saleitem/items/'+sale_item_cart_id+'/',
                data : {quantity:this.value, user : window.owner},
                beforeSend : function(xhr){ $this.data('xhr', xhr); },
                select : function(item){
                    if (item.error_message_before_shipping) {
                        alert(item.error_message_before_shipping);
                        stopSpinner();
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
            dlg.$obj.find(".btn-save.loading").removeClass("loading");
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

            startSpinner();
            $.ajax({
                type : 'PUT',
                url  : '/rest-api/v1/carts/saleitem/items/'+sale_item_cart_id+'/',
                data : params,
                dataType : 'json',
                beforeSend : function(xhr){ $this.data('xhr', xhr) },
                success  : function(item){
                    stopSpinner();
                    if (oid != $this.val()) return;

                    /*
                    var id = 'item-'+siid+'-'+oid, nid = 'notify-'+siid+'-'+oid;
                    if (!$('#'+id).length) {
                        $row.attr('id', id).attr('data-sio', oid)
                            .find('.notify-available_').attr('id', nid).attr('data-sio', oid)
                                .next('label').attr('for', nid);

                    }
                    $this.attr('data-optionid', oid).closest('.option').find('.change-option').html( $this.find("option:selected").html().replace(/( - Sold out:)?\(\$[0-9\.]*\)$/,''));
                    */
                    updateCart(true);

                    if (item.error_message_before_shipping) alert(item.error_message_before_shipping);
                }
            });
        })
        // remove items
        .on('click', 'a.remove-item_', function(event){
            var $this = $(this), data;

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
            startSpinner();

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
                            $this.closest('li').remove();
                            updateCart(true); 
                            loadSavedForLater(1);
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
            $buttons.hide().filter(".btn-checkout").show();
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
            var $btn = $(this), $popup = $(this).closest('.popup'), sale_item_cart_id = $popup.data('sicid'), xhr = $popup.data('xhr'), personalization = $popup.find(".text").val();
            if ($btn.hasClass("loading")) return;

            try { xhr.abort() } catch(e){};
            $btn.addClass("loading");
            startSpinner();
            $.ajax({
                type : 'PUT',
                url  : '/rest-api/v1/carts/saleitem/items/'+sale_item_cart_id+'/',
                data : {personalization:personalization, user : window.owner},
                beforeSend : function(xhr){ $popup.data('xhr', xhr); },
                complete : function(){
                    $.dialog('edit-personalization').close();
                    $btn.removeClass("loading");
                    updateCart();
                }
            });
        })

    var $later = $("div.saved-later"), $tplLater = $("#laterTemplate").remove();

    function loadSavedForLater(page) {
        if ($later.hasClass("loading")) return;
        var $ul = $later.find('>ul');
        $later.addClass("loading");
        page = page || $later.data("page") || 1;
        $.ajax({
            url  : '/rest-api/v1/carts/later',
            data : { per_page:3, page: page }
        }).then(function(json) {
            page = json.cur_page;
            $later.removeClass("loading").data("page", page);
            if (json.count == 0) {
                return $later.hide();
            }
            if (json.items.length == 0 && page > 1) {
                // if the last item on the current page was removed..
                loadSavedForLater(page-1);
                return;
            }
            $ul.empty();
            $.each(json.items, function(idx, item){
                item.item_price = item.item_price.replace(/\.00/,'');
                if(item.quantity > item.remaining_quantity) item.quantity = item.remaining_quantity;
                var $item = $tplLater.template(item);
                if(item.is_sold_out){
                    $item.find("button.cart").hide();
                    $item.find(".stock").addClass("soldout").text("Sold Out")
                }
                if (!item.option_id) {
                    $item.find("._option").remove();
                }
                
                $item.appendTo($ul);
            });
            $later.find("h3 .number").text("(" + json.count + " item" + (json.count>1 ? "s":"") + ")");
            if (json.pages <= 1) {
                $later.find(".paging").hide();
            } else {
                $later.find(".paging").show()
                    .find("a.next").data("page", page+1).toggleClass("disabled", page >= json.pages).end()
                    .find("a.prev").data("page", page-1).toggleClass("disabled", page <= 1).end()
            }
            $later.show();
        }).fail(function(xhr) {
            console.log('failed to load cart later')
            $later.hide();
        });
    }        

    $later
        .on('click', ".paging a",function(e){
            e.preventDefault();
            if (!$(this).hasClass('disabled')) loadSavedForLater($(this).data('page'));
        })
        .on('click', 'button.cart', function(event){
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

                        loadSavedForLater();
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
                    loadSavedForLater();
                },
                complete : function(){
                    $this.removeClass('disabled');
                }
            });
        })
    loadSavedForLater(1);

    function makeScrollable($el, per_page){
        var $ul = $el.find("ul");
        var $items = $ul.find("> li");

		var scrollArea = $ul.outerWidth(), scrollWidth = $ul[0].scrollWidth;
        if (scrollWidth <= scrollArea) {
            $el.find(".paging").hide();
            return;
        }
        var itemWidth = $ul.find("li:last").outerWidth(true), 
            maxScroll = Math.round((scrollWidth - scrollArea) / itemWidth) * itemWidth;
        
        $el.find(".paging").show().find("a.next, a.prev").on('click', function(e) {
            var $this = $(this);
            e.preventDefault();
            var newLeft = Math.round($ul.scrollLeft() / itemWidth) * itemWidth;
            if ($this.hasClass("prev")) newLeft -= (itemWidth * per_page);
            else newLeft += (itemWidth * per_page);

            if (newLeft > maxScroll) newLeft = maxScroll;
            $ul.animate({'scrollLeft':newLeft},200);
            $el.find(".paging a.next").toggleClass("disabled", newLeft < maxScroll);
            $el.find(".paging a.prev").toggleClass("disabled", newLeft > 0);
        });
    }

	function updateRecentlyViewed(){
		$.ajax({
            type : 'get',
            url  : '/recently_viewed_things.json?cart',
            success  : function(html){
                if(!html) return;
                $('.recommend .recently_item ul').html(html);
                if($('.recommend .recently_item ul > li').length){
                	$('.recommend .recently_item').show();
                	makeScrollable( $('.recommend .recently_item'), 4 );
                }

            },
            error : function(){
            	$('.recommend .recently_item').hide();
            }
        });
	};
	updateRecentlyViewed();

    function addToCart($btn, data, callback){
        $btn.addClass('disabled').attr('disabled', true);
        startSpinner();
        Fancy.CartAPI.addItem(data, function(success, json) {
            if (success) {
                
            } else {
                alertify.alert(json.error || "Failed to add the item to cart!")
            }
            $btn.removeClass('disabled').removeAttr('disabled');
            stopSpinner();
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
        
        startSpinner();
        $.ajax({
            type : 'POST',
            url  : '/remove_cart_item.json',
            data : data,
            dataType : 'json',
            success  : function(json) {
                stopSpinner();
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
        var $btn = $cart.find('button:submit:not(.undo_)'), xhr = $cart.data('xhr'), params = {}, count, disabled;

        /*
        if (!$cart.length) {
            $(".cart-item .cart-item-detail").addClass('loading'); 
            location.reload();
            return false;
        }
        */

        startSpinner();
        $btn.prop('disabled', true);
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
                stopSpinner();
                
                updateSaleitems(json.items);
                updateSummary(json)
                
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

        function updateSummary(json){
            var prevSubtotal = parseFloat($cart.data("subtotal"));
            var subtotal = parseFloat(json['subtotal_price']);
            var $subtotal = $cart.find('.payment-reciept > li.subtotal_');
            $subtotal.show().find(".price").text('$'+addCommas(subtotal.toFixed(2)));

            if(subtotal != prevSubtotal){
                $subtotal.addClass('add');
                setTimeout(function(){
                    $subtotal.removeClass('add');
                },2000)
            }

            var available = subtotal > 0;
            if (json.items.length) {
                for (var i = 0; i < json.items.length; ++i) {
                    available = available && json.items[i].available_before_shipping;
                }
                $cart.find(".cart-item, .cart-payment").show().end().find(".empty-cart").hide();
                $(".wrapper-content h1").show();
                $btn.show();
                $(".wrapper-content h1 .number").text("(" + json.items.length + " item" + (json.items.length != 1 ? "s" : "") + ")");


                var $free = $cart.find(".free-shipping"), minimum = parseFloat($free.data("minimum")), more = (minimum - subtotal).toFixed(2);
                $free.show()
                    .find(".more").toggle(more > 0).find("i").text("$" + more).end().end()
                    .find(".qual").toggle(more <= 0).end()
                    .find(".range > i").css("width", more > 0 ? ((subtotal/minimum*100).toFixed(2)+"%") : "100%").end();
            } else {
                $(".wrapper-content h1 .number").text("");
                available = false;
                $cart.find(".free-shipping").hide();
                if ($cart.find("ul.cart-item-detail > li:visible").length == 0) {
                    $cart.find(".cart-item, .cart-payment").hide().end().find(".empty-cart").show();
                    $(".wrapper-content h1").hide();
                }
            }

            $btn.prop('disabled', !available);
        }

        function updateSaleitem(item){
            var id=item.item_number, $row = $cart.find(".item_[id=item-"+id+"]"), $tpl = $cart.find("script#cartItemTemplate");

            if(!$row.length){
                var $seller = $tpl.template({
                            seller_id : item.seller_id, 
                            item_id : item.item_number,
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
                            personalization: item.personalization,
                            estimated_arrival_date: item.estimated_arrival_date
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
                    $cart.find("ul.cart-item-detail").prepend($row);
                }
            }

            // price
            $row.find('.price').text('$'+addCommas(item.item_price.replace(".00","")));
            if( parseInt(item.item_discount_percentage) > 0 ){
                $row.find('.price').addClass('sales').html('<small class="before">$'+addCommas(item.item_retail_price.replace(".00",""))+'</small> $'+addCommas(item.item_price.replace(".00","")));
            }

            if(item.personalizable) $row.find(".personalization em").text(item.personalization);

            var $stock = $row.find(".stock");
            var stock_quantity = item.remaining_quantity ? item.remaining_quantity : 10;
            if (item.is_sold_out) {
                $stock.addClass("soldout").text("Sold Out");
            } else if (item.remaining_quantity && item.remaining_quantity >= 10) {
                $stock.removeClass("soldout").text("In Stock");
            } else {
                $stock.removeClass("soldout").text("Only "+stock_quantity+" left");
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

        function updateSaleitems(items) {
            var cart_ids = {};

            for (var i=items.length - 1; i >= 0; i--) { // because we prepend li
                updateSaleitem(items[i]);
                cart_ids["item-" + items[i].item_number] = true;
            }

            $cart.find('.item_').each(function(){
                if (!cart_ids[$(this).attr('id')]) {
                    $(this).remove();
                }
            });

            $cart.find('.item_').sort(function(a, b) {
                return $(a).data("cid") > $(b).data("cid");            
            });

        }
    };

    function startSpinner() {
       $cart.find(".cart-payment").addClass("loading");
    }
    function stopSpinner() {
        $cart.find(".cart-payment").removeClass("loading");
    }

    $cart.on("submit", function(e){
        e.preventDefault();
        var $btns = $cart.find('.cart-payment .payment-button');
        if ($btns.hasClass("loading")) return false;

        if ($cart.find(".cart-payment").hasClass("loading")) {
            setTimeout(function(){
                $("#cart-saleitem").submit();
            },200);
            return;
        }
        var method = $("[name=payment_type]:checked").val();
        var params = {
            "payment_gateway": 6,
            "reset_shipping_option": "true"
        };
        if (method == 'pay-with-google') {
            window.startPayWithGoogle();
            return;
        }
        $btns.addClass("loading");
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

    $cart.find('input:radio[name^="payment_type"]:checked').eq(0).click();

});
