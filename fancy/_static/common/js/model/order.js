;(function(){
	var Model = namespace('Fancy.Model');

	Model.Order = Backbone.Model.extend({
		url : function(){
			return '/rest-api/v1/carts/saleitem/'+this.get('seller_id')+'/payment';
		},
		validate : function(attrs, options) {

			if (!attrs.seller_id) return 'Invalid seller ID.';

            var required, k, i, c;
            if( attrs.email ){
                required = 'email payment_type full_name address1 city country billing_card_uri billing_address1 billing_city billing_country'.split(' ');
			}else{
				required = 'total_price payment_type card_expiration card_last_digits card_type'.split(' ');
			}
            for (i=0,c=required.length; i < c; i++) {
                k = required[i];
                if (!attrs[k].length) return 'Please enter '+k+'.';
            }
		},
		setGuestInfo : function(model) {
			this.set('email', model['email']||'');
			this.set('full_name', model['full_name']||'');
			this.set('address1', model['address1']||'');
			this.set('address2', model['address2']||'');
			this.set('city', model['city']||'');
			this.set('state', model['state']||'');
			this.set('zip', model['zip']||'');
			this.set('country', model['country']||'');
			this.set('phone', model['phone']||'');

			this.set('payment_type', model['payment_type']||'');
			this.set('billing_card_uri', model['billing_card_uri']||'');
			this.set('billing_address1', model['billing_address1']||'');
			this.set('billing_address2', model['billing_address2']||'');
			this.set('billing_city', model['billing_city']||'');
			this.set('billing_state', model['billing_state']||'');
			this.set('billing_postal_code', model['billing_postal_code']||'');
			this.set('billing_country', model['billing_country']||'');
		},
		setPreference : function(model) {
			this.set('note', model.get('note')||'');
			this.set('is_gift', model.get('is_gift')||'');
			this.set('gift_message', model.get('gift_message')||'');
			this.set('total_price', model.get('summary.total_price'));
			this.set('seller_id', (model.get('seller')||{}).id);
		},
		setCreditCard : function(model) {
			var attrs = _.pick(model.attributes, 'payment_type', 'card_type', 'card_last_digits', 'card_expiration');
			attrs.card_id = model.id;
			this.set(attrs);
		}
	});
})();
