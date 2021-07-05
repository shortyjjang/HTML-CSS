;(function(){
	var Model = namespace('Fancy.Model'), Collection = namespace('Fancy.Collection');

	Model.CartItem = Backbone.Model.extend({
		urlRoot : '/rest-api/v1/carts',
		defaults : {
			cart_type : 'saleitem',
			quantity  : 0,
			option_id : '',
			option    : ''
		},
		url : function() {
			var id = this.get('id');
			return this.urlRoot + (id ? '/' + this.get('cart_type') + '/items/' + id : '');
		},
		initialize : function(options) {
			this.createThing();
		},
		createThing : function() {
			this.thing = new Model.Thing({
				id : this.get('thing_id'),
				name : this.get('title'),
				image : {src:this.get('image_url')}
			});
			return this;
		},
		getCropImageURL : function(width, height) {
			if (!this.thing) this.createThing();
			return this.thing.getCropImageURL(width, height);
		},
		getImageURL : function(){
			if (!this.thing) this.createThing();
			return this.thing.getImageURL();	
		},
	});

	Collection.CartItems = Backbone.Collection.extend({
		model : Model.CartItem,
		subtotal : 0,
		defaults : {
			cart_type : 'saleitem'
		},
		initialize : function(options) {
			this.options = _.defaults({}, options, this.defaults);
		},
		url : function() {
			var url = '/rest-api/v1/carts';

			if (this.options.cart_type) {
				url += '/' + this.options.cart_type;
				if (this.options.seller_id) {
					url += '/' + this.options.seller_id;
				}
			}

			return url;
		},
		parse : function(json, options) {
			this.subtotal = json.subtotal_price;
			this.checkout_url = json.checkout_url;
			return json.items || [];
		}
	});
})();
