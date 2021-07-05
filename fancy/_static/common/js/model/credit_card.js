;(function(){
	var Model = namespace('Fancy.Model'), Collection = namespace('Fancy.Collection');

	Model.CreditCard = Backbone.Model.extend({
		urlRoot : '/rest-api/v1/payment/credit_cards/',
		defaults : {
			payment_type : 'balanced',
			is_primary : false
		},
		validate : function(attrs, options) {
			var required = 'payment_type card_holder_name card_expiration card_last_digits card_type'.split(' '), k, i, c;

			for (i=0,c=required.length; i < c; i++) {
				k = required[i];
				if (!attrs[k].length) return 'Please enter '+k+'.';
			}
		}
	});

	Model.BalancedCreditCard = Backbone.Model.extend({
		idAttribute : 'uri',
		validate : function(attrs, options) {
			var result = balanced.card.validate(attrs);

			if (!result.errors) return ''; // valid

			var message = [];
			_.each(result.errors, function(error){ if (error.description) message.push(error.description); });

			return message.join('\n');
		},
		getCreditCard : function(callback) {
			var self = this;
			if (this.isNew()) {
				return this.save().done(create).fail(error("Please enter valid payment information."));
			}

			create();

			function create() {
				var number = self.get('card_number'), attrs;
				attrs = {
					payment_type : 'balanced',
					card_uri : self.id,
					card_holder_name : self.get('name'), 
					card_last_digits : number.substr(number.length-4),
					card_expiration  : self.get('expiration_month')+'/'+self.get('expiration_year'),
					card_type : balanced.card.cardType(number)
				};
				
				var card = new Model.CreditCard(attrs);
				callback(card);
			}

			function error(msg, msg2) {
				return function(){ callback(null, msg2 || msg); };
			}
		},
		getGuestCreditCard : function(callback) {


			var self = this;

			var attrs = {
					expiration_month : self.get('expiration_month'),
					expiration_year : self.get('expiration_year'),
					card_number : self.get('card_number'),
					security_code : self.get('security_code'), 
					name : self.get('name'), 
					country_code  : self.get('country'),
					postal_code : self.get('postal_code')
				};

			balanced.card.create(attrs, function(response, errors){
				if (response.status == 201 && response.data) {
					var data = response.data;
					callback(data);
				} else {
					callback(null, "Please enter valid payment information.");
				}
			});
		},
		sync : function(method, model, options) {
			var self = this, deferred = $.Deferred();
			if (method == 'create') {
				if (this.isValid()) {
					balanced.card.create(this.attributes, function(response, errors){
						if (response.status == 201 && response.data) {
							var data = response.data;
							self.set('uri', data.uri, {slient:true});
							deferred.resolve();
						} else {
							deferred.reject();
						}
					});
				} else {
					_.defer(function(){ deferred.reject() });
				}
			}

			return deferred;
		}
	});

	Model.StripeCreditCard = Backbone.Model.extend({
		idAttribute : 'card_token',
		validate : function(attrs, options) {
			return '';
		},
		getCreditCard : function(callback) {
			var self = this;
			if (this.isNew()) {
				return this.save().done(create).fail(error("Please enter valid payment information."));
			}

			create();

			function create() {
				var number = self.get('card_number'), attrs;
				attrs = {
					payment_type : 'stripe',
					card_token : self.id,
					card_holder_name : self.get('name'), 
					card_last_digits : number.substr(number.length-4),
					card_expiration  : self.get('expiration_month')+'/'+self.get('expiration_year'),
					card_type : Stripe.card.cardType(number)
				};
				
				var card = new Model.CreditCard(attrs);
				callback(card);
			}

			function error(msg, msg2) {
				return function(){ callback(null, msg2 || msg); };
			}
		},
		getGuestCreditCard : function(callback) {


			var self = this;

			var attrs = {
					exp_month : self.get('expiration_month'),
					exp_year : self.get('expiration_year'),
					number : self.get('card_number'),
					cvc : self.get('security_code'), 
					name : self.get('name'), 
					address_country  : self.get('country'),
					address_zip : self.get('postal_code')
				};
            Stripe.card.createToken(attrs, function(status, response){
				if (response.error) {
					callback(null, "Please enter valid payment information.");					
				} else {
					callback(response)
				}
			});
		},
		sync : function(method, model, options) {
			var self = this, deferred = $.Deferred();
			if (method == 'create') {
				if (this.isValid()) {
					var attrs = {
						exp_month : self.get('expiration_month'),
						exp_year : self.get('expiration_year'),
						number : self.get('card_number'),
						cvc : self.get('security_code'), 
						name : self.get('name'), 
						address_country  : self.get('country'),
					address_zip : self.get('postal_code')
					};
					Stripe.card.createToken(attrs, function(status, response){
						if (response.error) {
							deferred.reject();
						} else {
							self.set('card_token', response.id, {slient:true});
							deferred.resolve();
						}
					});
				} else {
					_.defer(function(){ deferred.reject() });
				}
			}

			return deferred;
		}
	});

	Collection.CreditCards = Backbone.Collection.extend({
		url   : '/rest-api/v1/payment/credit_cards/',
		model : Model.CreditCard,
		parse : function(json) {
			if (!json) json = {};
			_.extend(this, _.omit(json, 'cards'));
			return json.cards || [];
		},
		getPrimaryCard : function() {
			return this.findWhere({is_primary:true}) || this.at(0) || null;
		}
	});
})();
