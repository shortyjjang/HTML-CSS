;(function(){
	var View = namespace('Fancy.View'), Collection = namespace('Fancy.Collection');

	View.CartPopup = Backbone.View.extend({
        events: {
            'click .remove': 'onRemoveCartItemClick',
            'focusout .quantity' : 'onUpdateQuantity',
            'keyup .quantity'    : 'onUpdateQuantity',
            'change .option select'    : 'onUpdateOption',
            'click .btn-checkout': 'onCheckoutBtnClick'
        },
        onRemoveCartItemClick: function (event) {
			var self = this, $target = $(event.target), id = $target.closest('[data-id]').attr('data-id');

			event.preventDefault();
			if ($target.hasClass('disabled_')) return;

			try {
				this.remove(id)
					.done(function(){ self.updateSubTotal().render();  })
					.always(function(){ $target.removeClass('disabled_'); });

				$target.addClass('disabled_');
			} catch(e){}
        },
        onUpdateQuantity: function (event) {
			var self = this, $target = $(event.target), qty, id;

			if ($target.hasClass('disabled_')) return;
			if (event.type == 'keyup') {
				if (event.which == 13) event.preventDefault();
				else return;
			}

			qty = parseInt($.trim($target.val()));
			prev = parseInt($target.attr('data-value'));
			if (isNaN(qty) || qty == prev) {
				return $target.val($target.attr('data-value'));
			}

			id = $target.closest('[data-id]').attr('data-id');
			try {
				this.update(id, {quantity:qty})
					.done(function(res){ 
						$target.attr('data-value', qty); self.updateSubTotal().render()
					})
					.fail(function(res){
						if(res.responseJSON && res.responseJSON.error_fields && res.responseJSON.error_fields[0] == 'quantity'){
							alert("You can only order a maximum quantity of "+res.responseJSON.quantity+" for this item");
						}else{
							alert('Unable to update quantity. Please try again later.');
						}
                        $target.val( $target.attr('data-value') )
                    })
                    .always(function(){ $target.removeClass('disabled_') });

				$target.addClass('disabled_');
			} catch(e){}
        },        
        onUpdateOption: function (event) {
			var self = this, $target = $(event.target), qty, id;

			if ($target.hasClass('disabled_')) return;

			var option_id = $target.val();
			
			id = $target.closest('[data-id]').attr('data-id');
			try {
				this.update(id, {option_id:option_id })
					.done(function(res){ 
						$target.attr('data-option-id', option_id); self.fetch();
					})
					.fail(function(res){
						alert('Unable to update option. Please try again later.');
						
						$target.val( $target.attr('data-option-id') )
                    })
                    .always(function(){ $target.removeClass('disabled_') });

				$target.addClass('disabled_');
			} catch(e){}
        },
        onCheckoutBtnClick: function (event) {
			if (this.$('.disabled_').length) {
				event.preventDefault();
			}
        },
		initialize : function(options) {
			if (!options) options  = {};

			_.bindAll(this, 'render');

			this.collection = new Collection.CartItems({seller_id:options['seller_id'], cart_type:options['cart_type']});
			this.options = options;
		},
		fetch : function(data) {
			var self = this;
			self.$el.addClass('loading');
			return this.collection.fetch({data:data}).done(function(){ self.render(); self.$el.removeClass('loading'); });
		},
		render : function() {
			var models = this.collection.models || [], count = 0, template;

			if (!this.$tbody) this.$tbody = this.$('tbody');
			if (!this.$tbody || !this.$tbody.length) return this;

			_.each(models, function(model){ count += +model.get('quantity') || 0; });

			this.$tbody.empty().html( this.$tbody.data('template')({items:models}) );
			this.$('.subtotal_').text('$'+this.collection.subtotal);
			$('.btn-cart').show().find('.count').text(count);
			if (this.collection.checkout_url) this.$('.btn-checkout').attr('href', this.collection.checkout_url);
			this.$el.find(".not-empty, .empty").hide().filter(count ? '.not-empty' : '.empty').show();

			if( this.$el.hasClass('popup')) this.$el.trigger('center');

			return this;
		},
        updateSubTotal: function () {
            var subtotal = 0;
			_.each(this.collection.models, function(model){
				var price = model.get('quantity') * parseFloat(model.get('item_price'));
				if (!isNaN(price)) subtotal += price;
			});
            this.collection.subtotal = subtotal.toFixed(2);
            return this;
        },
		add : function(thing, quantity, attr) {
			var self = this, cartItem, qty, query = {thing_id:thing.get('id')};

			if (attr.option_id && !isNaN(attr.option_id)) {
				query['option_id'] = (attr.option_id=+attr.option_id);
			}

			cartItem = this.collection.findWhere(query);
			if (!cartItem) {
				cartItem = this.createCartItem(thing);
				cartItem.set(attr);
				this.collection.add(cartItem);
			}
			cartItem.set( 'quantity', +cartItem.get('quantity')+quantity );

			self.$el.addClass('loading');
			return cartItem.save().done(function(json, status){
				try {
					var saved = json.id ? json : _.findWhere(json.items, query);
					cartItem.set('id', saved.id);
                    self.fetch();
					self.$el.removeClass('loading');
				} catch(e){}
			}).fail(function (res) {
			    cartItem.set( 'quantity', +cartItem.get('quantity')-quantity );
				if(res.responseJSON && res.responseJSON.error_fields && res.responseJSON.error_fields[0] == 'quantity'){
					alert("You can only order a maximum quantity of "+res.responseJSON.quantity+" for this item");
				}else{
					alert('Unable to add item(s). Please try again later.');
				}
				self.$el.removeClass('loading');
            });
		},
		remove : function(id) {
			var self = this, ci = this.collection.get(id);
			if (ci) return ci.destroy();
		},
		update : function(id, attr) {
			var ci = this.collection.get(id);
			return ci.save(attr);
		},
		createCartItem : function(thing) {
			var cartItem = new this.collection.model({
				seller_id : this.options.seller_id,
				thing_id  : thing.get('id'),
				image_url : (thing.get('sales').images ? thing.get('sales').images[0] : null) || thing.get('image').sales.src,
				title : thing.get('sales').title,
				sale_id : thing.get('sales').id,
				item_price : thing.get('sales').price
			});
			cartItem.thing = thing;

			return cartItem;
		}
	});
})();
