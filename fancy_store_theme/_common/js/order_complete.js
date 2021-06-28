jQuery(function($){
	var Model = namespace('Fancy.Model'), View = namespace('Fancy.View'), Collection = namespace('Fancy.Collection'), globals = namespace('Fancy.globals');
	var pref = new Model.Preference({subtotal_price:'', shipping:'', tax:'', total_price:''});

	View.OrderComplete = View.DataBinding.extend({
		initialize : function(options) {
			View.DataBinding.prototype.initialize.call(this, options);

			this.options = _.clone(options);

			_.bindAll(this, 'fetch', 'render');
		},
		fetch : function(options) {
			options = _.clone(options || {});

			var self = this, success = options.success, error = options.error, complete = options.complete;

			options.success = function(collection, json) {
				if (!json) json = {};

				// sale item
				var attrs = _.clone(json);
				attrs.items = self.collection.models;
				self.model.set(attrs);

				// hide payment section if without payment
				if( !attrs.payment.card_type){
					$("div.payment").parent().hide();
				}

				// trigger fetch:success event
				self.trigger('fetch:success', json);
				if (success) success.apply(this, arguments);

				self.firstTime = false;
			};
			options.error = function() {
				self.trigger('fetch:error');
				if (error) error.apply(this, arguments);
			};
			options.complete = function() {
				self.trigger('fetch:complete');
				if (complete) complete.apply(this, arguments);
			};

			self.trigger('fetch:before', options);

			return this.collection.fetch(options);
		}
	});

	var orderComplete = new View.OrderComplete({
		el : '#checkout',
		model : pref,
		collection : new Collection.CartItems({seller_id:+globals.sellerInfo.id}),
		seller : globals.sellerInfo || {}
	});
	orderComplete.collection.url = '/rest-api/v1/orders/'+globals.sellerInfo.order_id;
	orderComplete.model.on('change', function(model){
		var self = this;
		_.each('coupon_amount credit_amount fancy_gift_card fancy_rebate'.split(' '), function(key){
			var value = self.get(key);
 			parseFloat(value) ? orderComplete.$('.'+key+'_').show() : orderComplete.$('.'+key+'_').hide();
		});
	});

	orderComplete.fetch({
		complete: function(){

			$(".confirm-msg span._price").show();
			$("#checkout > .complete").removeClass("loading");
		}
	});
});
