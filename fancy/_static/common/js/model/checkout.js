;(function(){
	var Model = namespace('Fancy.Model'), Collection = namespace('Fancy.Collection');

    Model.CheckoutItem = Backbone.Model.extend({
        urlRoot : '/rest-api/v1/checkout',
		url : function() {
			var id = this.get('id');
			return this.urlRoot + (id ? '/item/' + id : '');
		},
		getImageURL : function(){
            return this.get('image_url');
        }
    });

    Collection.CheckoutItems = Backbone.Collection.extend({
        model : Model.CheckoutItem,
        id : 0,
        subtotal : 0,
        total : 0,
        shipping_cost : 0,
        tax : 0,
        checkout_code : null,
        initialize :  function(options) {
            console.log("Initialize CheckoutItems with options",options);
			//this.options = _.defaults({}, options, this.defaults);
            //this.create(options)
        },
        url: function() {
            var url = '/rest-api/v1/checkout';
            return url;
        },
        parse : function(json) {
            var items = [];
            var coupons = [];
            var credit_cards = [];
            var coupon_ids = {};
            for(seller_id in json.sale_items_freeze) {
                var freeze = json.sale_items_freeze[seller_id]
                var seller_items = freeze.items
                if(seller_items) items = items.concat(seller_items);

                var seller_coupons = freeze.coupons
                for(var i in seller_coupons) {
                    seller_coupon = seller_coupons[i];
                    if(seller_coupon.id in coupon_ids) continue;
                    coupon_ids[seller_coupon.id] = true;
                    coupons.push(seller_coupon);
                }

                var shipping_addr_id = freeze.shipping_addr_id;
                if(!json.shipping_addr_id && shipping_addr_id) {
                    json.shipping_addr_id = shipping_addr_id;
                }

                if(!json.credit_cards && freeze.credit_cards.cards && freeze.credit_cards.cards.length>0) {
                    json.credit_cards = freeze.credit_cards;
                }
            }

            json.coupons = coupons;

            var coupon_amount = 0.00;
            for(seller_id in json.coupon_info) {
                coupon_amount += parseFloat(json.coupon_info[seller_id].discount_amount);
            }
            json.coupon_amount = coupon_amount.toFixed(2);

            return items;
        }
    });
})();
