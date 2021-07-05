;(function(){
	var Model = namespace('Fancy.Model');

	Model.CartCoupon = Backbone.Model.extend({
		idAttribute : 'code',
		urlRoot  : '/rest-api/v1/carts/',
		defaults : {
			cart_type : 'saleitem',
			seller_id : 0
		},
		initialize : function(attrs) {
			var self = this;
			this.urlRoot += this.get('cart_type')+'/'+this.get('seller_id')+'/coupons';
		},
		validate : function(attrs, options){
			if (!$.trim(attrs.code).length) {
				return 'Invalid Coupon Code.';
			}

			if (!attrs.seller_id || attrs.seller_id < 0) {
				return 'Invalid Seller ID.';
			}
		}
	});
})();
