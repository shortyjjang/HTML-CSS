Fancy.CartAPI = {
    addItem : function(payload, callback) {
        // payload: { sale_id, option_id, quantity, personalization, via }
        // callback: function(success, resp)
        if (window.dataLayer && !window.DO_NOT_TRACK) {
            window.dataLayer.push({
                event: 'Add_to_Cart_Button',
                product_id: payload['sale_id'],
                option_id: payload['option_id'],
                products: undefined,
                products_info: undefined,
                revenue: undefined
            });
        }
        if (window.track_event && !window.DO_NOT_TRACK) {
            try {
                var prop = {
                    "sale id": payload['sale_id'],
                    "option id": payload['option_id'],
                    "via": payload['via'],
                    "utm": location.args && location.args.utm
                };
                track_event('Add to Cart', prop);
            } catch (e) {
                console.error(e);
            }
        }
        return $.ajax({
            type: 'POST',
            url: '/rest-api/v1/carts',
            data: payload
        })
        .done(function(resp) {
            if (resp.error) {
                callback && callback(false, resp);
            } else {
                var items = resp.items, item;
                for (var i = 0; i < items.length; ++i) {
                    if (items[i].added) { item = items[i]; break; }
                }
                if (!window.DO_NOT_TRACK) {
                    if (item) {
                        try {
                            TrackingEvents.addToCart([{
                                id: item.sale_id,
                                brand: item.brand_name,
                                name: item.title,
                                quantity: payload['quantity'],
                                price: item.item_price,
                                variant: item.option
                            }]); // avoid NaN
                        } catch(e) {
                            console.error(e);
                        }
                    }
                    try {
                        var ev = Fancy.CartAPI.getCordialEvents(items);
                        ev.push(['event', 'cart', item && { 
                            "thingID": item.thing_id, "productID": String(item.sale_id), "seller": item.seller_name, 
                            "url": 'https://fancy.com' + item.item_url, "name": item.title, "category": item.cordial_category,
                            "instock": item.available_before_shipping && !item.is_sold_out, "image": item.full_image_url,
                            "sku": item.item_number, 'price': parseFloat(item.item_price)
                        }])
                        crdl(ev);
                    } catch(e) {
                        console.error(e);
                    }
                }
                Fancy.Cart.setItems(items);
                callback && callback(true, resp);
            }
        })
        .fail(function(xhr) {
            callback && callback(false, xhr.responseJSON);
       });
    },
    getCordialEvents : function(items) {
        var cartData = []
        for (var i = 0; i < items.length; ++i) {
            var it = items[i];
            cartData.push({
                productID: String(it.sale_id), sku: it.item_number,
                category: it.cordial_category, name: it.title, 
                qty: it.quantity, itemPrice: parseFloat(it.item_price), url: 'https://fancy.com' + it.item_url
            });
        }
        return [['cart', 'clear'], ['cartitem', 'add', cartData]];
    }
}

Fancy.Cart = {
    setItems: function(items) {
        var $popup = $('#cart_popup'), $ul = $popup.find('ul');
        $ul.empty();
        for (var i = 0; i < items.length; ++i) {
            var item = items[i];
            this.renderItem({
                'THING_ID': item.thing_id,
                'ITEMCODE': item.id,
                'THUMBNAIL_IMAGE_URL': item.image_url,
                'ITEMNAME': item.title,
                'QUANTITY':item.quantity,
                'PRICE': item.item_price,
                'OPTIONS': item.option,
                'HTML_URL': item.html_url,
                'FANCY_PRICE': item.item_retail_price
            });            
        }
        this.update();
    },
    addItem : function(args) {
        this.renderItem(args);
        this.update();

    },
    renderItem: function(args) {
        var $popup = $('#cart_popup'), $ul = $popup.find('ul');
        var quantity = parseInt(args['QUANTITY']) || 0, price = parseFloat(args['PRICE']) || 0, fancy_price = parseFloat(args['FANCY_PRICE']) || 0;
        args['PRICE'] = addCommas(price.toFixed(2).replace(/\.?0+$/, ''));
        args['FANCY_PRICE'] = addCommas(fancy_price.toFixed(2).replace(/\.?0+$/, ''));

        $item = $popup.find('>script[type="fancy/template"]').template(args);
        $item.find('span.price')
            .find("i").css("display", quantity > 1 ? null : "none").end()
            .find("small").css("display", fancy_price > 0 && fancy_price > price ? null : "none").end();
        $item.data('price', price).data('quantity', quantity);
        if (!args.OPTIONS) {
            $item.find("span._option").remove();
        }

        var $old = $('#cartitem-'+args['ITEMCODE']);
        if ($old.length) $old.replaceWith($item);
        else $item.appendTo($ul);
    },
    update : function() {
        var count = 0, price = 0, $container = $('.container');

        $('#cart_popup ul > li').each(function(){
            var $this = $(this);
            var q = parseInt($this.data('quantity')) || 0;
            var p = parseFloat($this.data('price')) || 0;

            if(q == 0) {
                $item.remove();
                return;
            }

            count += q;
            price += p;
        });
        
        $('#cart-new a.mn-cart span.count').text(count || '');
        if (count == 0) this.hidePopup();
    },
    togglePopup : function() {
        if ($("#cart-new").hasClass("active")) {
            this.hidePopup();
        } else {
            this.openPopup();
        }
    },
    openPopup : function() {
        var $cart = $("#cart-new"), $cart_overlay = $('#cart_popup');
        if ($cart.find('a.mn-cart span.count').text() > 0) {
            $cart.siblings(".active").removeClass("active").end().addClass("active");
        }else {
            document.location.href= "/cart";
        }
    },
    hidePopup : function() {
        $("#cart-new").removeClass("active");
    },

};