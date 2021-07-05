(function() {
    gtag('set', {
        // 'country': 'US',
        'currency': window.CURRENCY_CODE
    });
    function sendEvent(eventName, params) {
        if (location.hostname.indexOf('fancy.com') === -1) {
            return;
        }
        if (window.DO_NOT_TRACK) return;
        gtag('event', eventName, params);
    }
    window.TrackingEvents = {
        Flag: false,
        Data: {},
        Util: {
            extractSaleItems: function (cartSaleItems, sellerId, saleItemsResult) {
                var saleItemsResult = saleItemsResult || [];
                cartSaleItems[sellerId].items.forEach(function(item) {
                    saleItemsResult.push({
                        id: item.sale_id,
                        brand: item.brand_name,
                        name: item.title,
                        quantity: item.quantity,
                        price: item.item_price,
                        variant: item.option,
                        location_id: cartSaleItems[sellerId] && cartSaleItems[sellerId].ships_from
                    });
                });
                return saleItemsResult;
            },
            extractSalesFromCart: function(cartSaleItems, specifiedSellerId) {
                cartSaleItems = cartSaleItems || [];
                if (specifiedSellerId) {
                    return window.TrackingEvents.Util.extractSaleItems(cartSaleItems, specifiedSellerId);
                } else {
                    // extract all for every seller
                    var saleItemsResult = [];
                    for (var sellerId in cartSaleItems) {
                        window.TrackingEvents.Util.extractSaleItems(cartSaleItems, sellerId, saleItemsResult);
                    }
                    return saleItemsResult;
                }
            },
        },
        addToCart: function(items) {
            // quantity, item_name, item_id (* use sale id. ignore option), price (* unit price), value (* item total), currency
            sendEvent("add_to_cart", {
                value: String((items[0] && (items[0].price * items[0].quantity)) || '0'),
                items: items,
                currency: window.CURRENCY_CODE
            });
        },
        beginCheckout: function(value, items) {
            sendEvent("begin_checkout", { currency: window.CURRENCY_CODE, value: value, items });
        },
        purchase: function(coupon, value, tax, shipping, transaction_id, items) {
            items.forEach(function(item) {
                ga('ec:addProduct', item);
            });
            var params = {
                'id': transaction_id,
                'revenue': value,
                'tax': tax,
                'shipping': shipping,
                'coupon': coupon
            };
            ga('ec:setAction', 'purchase', params);
            ga('send', 'event', 'Ecommerce', 'Purchase', 'revenue', { nonInteraction: true });
        },
        refund: function(transaction_id, value, tax, shipping, items) {
            // transaction_id, value, currency, tax, shipping, items
            sendEvent("refund", {
                shipping: shipping,
                tax: tax,
                value: value,
                currency: window.CURRENCY_CODE,
                transaction_id: transaction_id,
                items: items
            });
        },
        viewItem: function(item, callback) {
            if (window.DO_NOT_TRACK) return;
            ga('ec:addProduct', item);
            ga('ec:setAction', 'detail');
            //sendEvent("view_item", { items });
            if (callback) {
                callback();
            }
        },
        viewSearchResults: function(search_term) {
            sendEvent("view_search_results", { search_term: search_term });
        },
        removeFromCart: function(value, items) {
            sendEvent("remove_from_cart", { value, currency: window.CURRENCY_CODE, items });
        },
    };
})();
