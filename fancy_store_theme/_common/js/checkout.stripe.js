jQuery(function($){
	var View = namespace('Fancy.View'), Model = namespace('Fancy.Model'), Collection = namespace('Fancy.Collection'), globals = namespace('Fancy.globals');
	var pref = new Backbone.DeepModel({subtotal_price:'0', shipping:'0', tax:'0', total_price:'0'});

	// template
	$('script[type="template"]').each(function(){
		var $tpl = $(this);
		$tpl.parent().data('template', _.template($tpl.remove().html()));
	});

	View.Checkout = View.DataBinding.extend({
		events : {
			// coupon form
			'click .coupon_ .btn-apply' : 'onApplyCoupon',
			'keydown .coupon_ input[name="code"]' : 'onEnterCoupon',
			'click .coupon_ .remove' : 'onRemoveCoupon',

			// address form
			'click .shipping a.go-new'	  : 'onOpenNewAddressForm',
			'click .shipping a.go-back'	  : 'onCloseNewAddressForm',
			'change .shipping select[name="addr.id"]' : 'onChangeAddress',
			'change .shipping select[name="addr.country"]' : 'onChangeCountry',
			'change .shipping select[name="addr.state"]' : 'onChangeTaxAddr',
			'blur .shipping input[name="addr.city"]' : 'onChangeTaxAddr',
			'blur .shipping input[name="addr.zip"]' : 'onChangeTaxAddr',
            'click .shipping-type input[name=shipping-type]' : 'onChangeShippingType',
			'click .shipping .btn-next' : 'onSubmitAddress',
			'click .error-msg' : 'onClickErrorMsg',
			'focus input,select' : 'onClickErrorMsg',

			// credit card form
			'click .payment a.go-new' : 'onOpenNewCardForm',
			'click .payment a.go-back' : 'onCloseNewCardForm',
			'click .payment .btn-delete' : 'onDeleteCard',
			'change .payment select[name="card.id"]' : 'onChangeCard',
			'change .payment select[name="billing.country"]' : 'onChangeBillingCountry',
			'keyup .payment input[name="card.card_number"]' : 'onInputCardNumber',
			'click .btn-submit' : 'onSubmitOrder',
			'click #use_same_addr' : 'onToggleBillingAddr'
		},
		initialize : function(options) {
			View.DataBinding.prototype.initialize.call(this, options);

			this.options = _.clone(options);
			this.firstTime = true;

			_.bindAll(this, 'fetch', 'render');
			this.listenTo(this.model, 'change', this.render);
		},
		/**
		 * Fetch cart items
		 */
		fetch : function(options) {
			var loggedIn = !!globals.userInfo;
			options = _.clone(options || {});
			options.data = _.defaults({}, options.data, {checkout:loggedIn, stripe:true});

			var self = this, success = options.success, error = options.error, complete = options.complete, $forms;

			$forms = self.$(options.section||'.right .summary, .order-note, .gift-option, .order-coupon, .shipping, .shipping-type, .payment').addClass('loading');
			
			options.success = function(collection, json) {
				if (!json) json = {};

				if (self.collection.models.length == 0) {
					location.href = self.options.seller.store_url;
				}
				// summary
				var summary = _.pick(json, 'subtotal_price', 'total_price', 'fancy_gift_card', 'tax', 'shipping', 'coupon_amount', 'fancy_rebate', 'discount_amount');
				_.defaults(summary, {fancy_gift_card:0, coupon_amount:0, tax: null, shipping: null, total_price: null, fancy_rebate:0, discount_amount: null});
                if (json.preorder) {
                    _.each(json.preorder, function(value, key) {
                        summary['preorder_' + key] = value;
                    });
                }
				self.model.set({summary:summary});

                var shipping_options = json.shipping_options||[];
                for (var i = 0; i < shipping_options.length; ++i) {
                    if (shipping_options[i].id == json.shipping_selected) 
                        shipping_options[i].selected = true;
                }
                self.model.set('shipping_options', shipping_options);

				// sale items
				self.model.set('items', self.collection.models);

				// coupon
				self.model.set('coupons', json.coupons || []);
				if (json.coupons && json.coupons.length) {
					_.defaults(json.coupons[0], {seller_id:self.options.seller.id});
					self.coupon = new Model.CartCoupon(json.coupons[0]);
				}

				// credit cards
				if (!json.credit_cards) json.credit_cards = {};
				self.creditCards = new Collection.CreditCards(json.credit_cards.cards||[]);
				self.model.set(_.omit(json.credit_cards||{}, 'cards'));
				self.model.set('credit_cards', self.creditCards.models);
				self.model.set('current_card', self.creditCards.getPrimaryCard());

				// addreses
				self.addresses = new Collection.Addresses(json.addresses||[]);
				self.model.set('addresses', self.addresses.models);
				if (json.shipping_addr_id) {
					self.model.set('current_addr', self.addresses.findWhere({id:json.shipping_addr_id}) || self.addresses.getDefaultAddr());
				} else {
					self.model.set('current_addr', self.addresses.getDefaultAddr());
				}



				//self.$el.find(".order-coupon, .payment, .shipping").find("fieldset").toggle(loggedIn);
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
				$forms.removeClass('loading');
				self.trigger('fetch:complete');
				if (complete) complte.apply(this, arguments);
			};

			self.trigger('fetch:before', options);

			return this.collection.fetch(options);
		},
		render : function(model, repaint) {
			var self = this, changed = _.defaults({}, model?model.changed:{}, repaint);
            console.log(changed);

			if (changed.summary) {
				_.each(changed.summary, function(value, key){
					var $prices = self.$('.receipt .'+key+'_v .price, .receipt .'+key+'_ .price');
					$prices.filter('.yet').toggleClass('hide', value !== null);
					$prices.filter('.set').toggleClass('hide', value === null);
					parseFloat(value) ? self.$('.receipt .'+key+'_').show() : self.$('.receipt .'+key+'_').hide();
				});
			}
            if (changed.items) {
                var preorder = false, regular = false;
                for (var i = 0; i < changed.items.length; ++i) {
                    if (changed.items[i].get('preorder')) preorder = true; else regular = true;
                }
                console.log([preorder, regular]);
                if (preorder) {
                    self.$('.receipt .total_price_v .label').text('Pay Now');
                    if (!regular) {
					    $('.receipt .tax_v').hide();
					    $('.receipt .shipping_v').hide();
                    }
                    self.$('.receipt li[class^=preorder_]').show();
                } else {
                    self.$('.receipt .total_price_v .label').text('Order Total');
                    self.$('.receipt li[class^=preorder_]').hide();
                }
            }

			if ('STRIPE_PUBLISHABLE_KEY' in changed) {
				if (!Stripe.initialized) {
					try { Stripe.setPublishableKey(changed.STRIPE_PUBLISHABLE_KEY); 
						  Stripe.initialized = true; 
						} catch(e) {
					};
				}
			}

			if ('coupons' in changed) {
				var $forms = $('.coupon_').find('.input_, .list_').hide();

				if (changed.coupons.length) {
					$forms.filter('.list_').show();
				} else {
					$forms.filter('.input_').show();
				}
			}

			if ('credit_cards' in changed) {
				var $payment = this.$('.payment'), $save = $payment.find('.save-card'), $sel = $save.find('select[name="card.id"]'), primaryCard;

				if (changed.credit_cards.length) {
					primaryCard = this.creditCards.getPrimaryCard();
					$sel.html( $sel.data('template')(changed) ).val(primaryCard ? primaryCard.id : changed.credit_cards[0].id).change();
					$payment.find('.go-back').click();
				} else {
					$payment.find('.go-new').click();
				}
			}

			if ('current_card' in changed) {
				this.$('.payment')
					.find('select[name="card.id"]').val(changed.current_card.id).end()
					.find('.save-card > .card').attr('class', 'card '+changed.current_card.get('card_type').toLowerCase());
			}

			if ('addresses' in changed) {
				var $shipping = this.$('.shipping > fieldset'), $addr = $shipping.find('.save-adds'), $sel = $addr.find('select[name="addr.id"]'), defaultAddr;

				if (changed.addresses.length) {
					var prevAddrId = $sel.val();
					defaultAddr = this.addresses.getDefaultAddr();					
					$sel.html( $sel.data('template')(changed) ).val(defaultAddr ? defaultAddr.id : changed.addresses[0].id);
					//if(prevAddrId != $sel.val()) $sel.change();
					$addr.show();
				} else {
					$shipping.hide().filter('.frm').show().find();
					this.$('.shipping select[name="addr.country"]').trigger('change');
					$addr.hide();
				}
				$shipping.find(".error-box, .error-msg").hide();
				if( globals.userInfo && changed.addresses[0] && !model.get('current_addr')){
					this.updateAddress(changed.addresses[0].id);
				}
			}

			if ('current_addr' in changed) {
				var $shipping = this.$('.shipping > fieldset');

				if (changed.current_addr) {
					$shipping.find('select[name="addr.id"]').val(changed.current_addr.id);
				}

				if (this.firstTime) {
					$shipping.hide();
					if (changed.current_addr) {
						$shipping.filter('.save').show();
						this.$('.shipping a.go-new').show();
						this.openPaymentForm();
					} else {
						$shipping.filter('.frm').show();
					}
				}
			}
            if ('shipping_options' in changed) {
                var $ul = $('.shipping-type ul');
                $ul.html( $ul.data('template') (changed) );
                if (changed.shipping_options.length > 1) {
                    $('.shipping-type').show();
                } else {
                    $('.shipping-type').hide();
                }
            }
		},
		onApplyCoupon : function(event) {
			var self = this, $form = $(event.currentTarget).closest('.coupon_'), $code, $btn, code;

			event.preventDefault();

			$btn  = $form.find('.btn-apply');
			$code = $form.find('input[name="code"]');
			code  = $.trim($code.val());
			if ($btn.hasClass('disabled') || !code) return;


			if( $("input[name=email]").is(":visible") && !$("input[name=email]").val()){
				alert("Please enter your email address to apply a coupon code.");
				return;
			}

			$btn.addClass('disabled').prop('disabled',true);
			$code.prop('readOnly', true);
			$form.addClass('loading');

			var email = $("input[name=email]").val();

			new Model.CartCoupon({code:code, seller_id:this.options.seller.id}).save({email:email})
				.always(function(){
					$form.removeClass('loading');
					$btn.removeClass('disabled').prop('disabled',false);
					$code.val('').prop('readOnly', false);
				})
				.done(function(json){ self.model.set('coupons', json||[]); self.fetch({section:'.right .summary, .order-coupon'}); })
				.error(function(json){
                    var errormsg = json.responseJSON['error'].replace(/ \(.*\)$/, '.');
                    $form.find('.input_').find('.error-msg').text(errormsg);
                    $form.find('.input_').addClass('error');
                });
		},
		onEnterCoupon : function(event) {
			var $input = $(event.currentTarget);
			if (event.which == 13) {
				$input.closest('.coupon_').find('.btn-apply').click().end();
				event.preventDefault();
			}
			$input.closest('.input_').removeClass('error');
		},
		onRemoveCoupon : function(event) {
			var self = this, $btn = $(event.currentTarget), $form = $btn.closest('.coupon_');

			event.preventDefault();

			if ($btn.hasClass('disabled')) return;
			$btn.addClass('disabled');

			if (this.coupon) {
				$form.addClass('loading');
				this.coupon.destroy()
					.always(function(){ $form.removeClass('loading'); $btn.removeClass('disabled'); })
					.done(function(){ self.fetch({section:'.right .summary, .order-coupon'}); });
			}
		},
		onOpenAddressForm : function(event) {
			event.preventDefault();

			this.closePaymentForm();

			var $shipping, $addr_id, defaultAddr = this.model.get('current_addr');
			if (!defaultAddr) defaultAddr = this.addresses.findWhere({is_default:true});

			$shipping = this.$('.shipping > .frm').show();
			$addr_id = $shipping.find('select[name="addr.id"]');
			(defaultAddr ? $addr_id.val(defaultAddr.id) : $addr_id.prop('selectedIndex', 0)).change();

			this.$('.shipping > .save').hide();
			$shipping.find('.go-new, .save-adds, .go-back').hide();
			!this.collection.length || $shipping.find('.go-new, .save-adds').show();
		},
		onOpenNewAddressForm : function(event) {
			event.preventDefault();

			this.$('.shipping')
				.find('.go-back, > fieldset.frm').show().end()
				.find('.go-new, .save-adds, > fieldset.save').hide().end()
				.find('input[type="text"]').val('').end()				
				.find('select[name="addr.state"]').prop('selectedIndex', 0).end();

			var countryBox = this.$('.shipping').find('select[name="addr.country"]');
			countryBox.val(countryBox.attr('data-default')).change();

			this.model.set('current_addr', null, {silent:true});
		},
		onClickErrorMsg: function(event){
			var target = $(event.target);
			var msg = target;
			if(!msg.is(".error-msg")) msg = msg.next();
			if(!msg.is(".error-msg")) return;
			msg.hide();
			if(target.is('.error-msg')) target.prev().focus();
		},
		onCloseNewAddressForm : function(event) {
			event.preventDefault();

			this.$('.shipping')
				.find('.go-back, > fieldset.frm').hide().end()
				.find('.go-new, .save-adds, > fieldset.save').show().end()
				.find('select[name="addr.id"]').change().end();
		},
		onDeleteAddress : function(event) {
			var self = this, addr = this.model.get('current_addr'), $btn = $(event.currentTarget), $shipping;

			if (!addr) return;
			if (this.addresses.length < 2) {
				// TODO : user can't delete the last address.
			}

			$shipping = $btn.prop('disabled', true).closest('.shipping').addClass('shipping');

			addr.destroy()
				.always(function(){ $shipping.removeClass('shipping'); $btn.prop('disabled', false) })
				.done(function(){ self.render(null, {addresses:self.addresses.models}); $shipping.removeClass('shipping') });
		},
		onChangeAddress : function(event) {
			var $this = this, id = event.currentTarget.value, addr = this.addresses.get(+id), $fields = this.$('.shipping [name^="addr."]');

			if (!addr) return;

			this.model.set('current_addr', addr);
			if(!this.firstTime)
				this.updateAddress(addr.get('id'));
		},
		onChangeCountry : function(event) {
			var $fields = this.$('.shipping .state').children('.selectBox, input').hide(), country, $zip;

			country = event.currentTarget.value;
			if (country == 'US') {
				$fields.filter('.selectBox').show().children('select').prop('selectedIndex', 0);
			} else {
				$fields.filter('input').show().val('');
			}

			$zip = this.$('.shipping .zip input');
			if(! globals.userInfo){
				var state = this.$(".shipping .state select:visible, .shipping .state input:visible").val();
				var city = this.$(".shipping .city input").val();
				var zip = $zip.val();
				this.fetch({data: {country: country, city: city, zip: zip, state: state}, section:'.right .summary, .shipping, .shipping-type'});
			}

			// some countries uses alphanumeric zip codes
			if ('AR,BN,CA,JM,MT,NL,PE,SO,SZ,GB,VE,'.indexOf(country+',') > -1) {
				$zip.attr('type', 'text');
			} else {
				$zip.attr('type', 'text');
			}
		},
		onChangeTaxAddr : function(event) {
			if(! globals.userInfo){
				var country = this.$(".shipping .country select").val();
				var state = this.$(".shipping .state select:visible, .shipping .state input:visible").val();
				var city = this.$(".shipping .city input").val();
				var zip = this.$(".shipping .zip input").val();
				if( country=='US' && state && city && zip)
					this.fetch({data: {country: country, state: state, city: city, zip: zip}, section:'.right .summary, .shipping, .shipping-type'});
			}
		},
        onChangeShippingType : function(event) {
            var shipping_type = this.$(".shipping-type input[name=shipping-type]:checked").val();
			if(! globals.userInfo){
				var country = this.$(".shipping .country select").val();
				var state = this.$(".shipping .state select:visible, .shipping .state input:visible").val();
				var city = this.$(".shipping .city input").val();
				var zip = this.$(".shipping .zip input").val();
                this.fetch({data: {country: country, state: state, city: city, zip: zip, shipping_type:shipping_type}, section:'.right .summary, .shipping-type'});
            } else {
    			this.fetch({type: 'PUT', data: {shipping_type: shipping_type}, section: '.right .summary, .shipping-type'}) ;
            }
        },
		onSubmitAddress : function(event){
			event.preventDefault();

			var self = this, attrs = {}, $btn = $(event.currentTarget), addr = this.model.get('current_addr'), $shipping;
			this.$('.shipping [name^="addr."]:visible').each(function(){
				var name = this.getAttribute('name').replace(/^addr\./,''), val = $.trim(this.value);
				attrs[name] = val;
			});

			if (addr && addr.id) {
				if (attrs.id) attrs.id = +attrs.id;
				attrs.is_default = addr.get('is_default');
				attrs.country_name = addr.get('country_name');

				// not changed?
				if (_.isEqual(attrs, addr.attributes)) {
					this.updateAddress(addr.id);
					self.openPaymentForm();
					return;
				}
			} else {
				delete attrs.id;
			}

			addr = new Model.Address(attrs);

			this.$('.shipping .error-box, .shipping .error-msg').hide();
			if (!addr.isValid()) {
				var required = 'alias full_name address1 city phone zip'.split(' '), k, i, c;

				this.$('.shipping .error-box').show();
				for (i=0,c=required.length; i < c; i++) {
					k = required[i];
					if (!attrs[k].length){
						this.$('.shipping [name="addr.'+k+'"]').next().show();
					}
				}
				
				return ;
			}

			$shipping = $btn.prop('disabled', true).closest('.shipping').addClass('loading');

			if(globals.userInfo){
				addr.save()
					.always(function(){
						$shipping.removeClass('loading');
						$btn.prop('disabled', false);
					})
					.done(function(json){
						if (!addr.id) {
							addr.set('id', json.id, {silent:true});
							self.addresses.add(addr);
						}
						//self.render(null, {addresses:self.addresses.models, current_addr:addr});
						self.model.set('current_addr', addr);
						self.$('.shipping > fieldset, .shipping a.go-back').hide();
						self.$('.shipping > fieldset.save').show();

						self.openPaymentForm();

						self.updateAddress(addr.id);
					})
					.error(function(xhr, status, code){
						var json = xhr.responseJSON;
						if (json) (json.error || json.detail) && alert(json.error || json.detail);
					});
			}else{
				$shipping.removeClass('loading');
				$btn.prop('disabled', false);
				self.addresses.add(addr);
				self.model.set('current_addr', addr);
			}
		},
		updateAddress : function(addrID) {
			this.firstTime = true;
			this.fetch({type: 'PUT', data: {shipping_addr_id: addrID}, section: '.right .summary, .shipping, .shipping-type'}) ;
		},
		closePaymentForm : function() {
			this.$('.payment > fieldset').hide();
		},
		openPaymentForm : function() {
			var $fieldset = this.$('.payment > fieldset').show();

			if (!this.creditCards) return;
			if (this.creditCards.length) {
				$fieldset.find('.go-back').click();
			} else {
				$fieldset.find('.go-new').click();
			}
		},
		onOpenNewCardForm : function(event) {
			if (event) event.preventDefault();

			var $payment = this.$('.payment');
			$payment.find('.go-new, .save-card').hide().end().find('.frm').show();
			this.creditCards.length ? $payment.find('.go-back').show() : $payment.find('.go-back').hide();
			this.model.set('current_card', null, {silent:true});
		},
		onCloseNewCardForm : function(event) {
			if (event) event.preventDefault();

			var $payment = this.$('.payment');
			$payment.find('.go-back, .frm').hide().end().find('.go-new, .save-card').show().find('select[name="card.id"]').change();
		},
		onChangeCard : function(event) {
			var id = +event.currentTarget.value, card = this.creditCards.get(id);
			if (card) this.model.set('current_card', card);
		},
		onDeleteCard : function(event) {
			event.preventDefault();

			var self = this, card = this.model.get('current_card'), $btn = $(event.currentTarget), $payment;

			if (!card) return;

			$payment = $btn.prop('disabled', true).closest('.payment').addClass('loading');

			card.destroy()
				.always(function(){ $payment.removeClass('loading'); $btn.prop('disabled', false) })
				.done(function(){
					self.render(null, {creditCards:self.creditCards.models});
					if (self.creditCards.length) {
						self.$('.payment select[name="car.id"]').prop('selectedIndex', 0).change();
					}
				});
		},
		onChangeBillingCountry : function(event) {
			var $fields = this.$('.payment .state').children('.selectBox, input').hide();
			if (event.currentTarget.value == 'US') {
				$fields.filter('.selectBox').show().children('select').prop('selectedIndex', 0);
			} else {
				$fields.filter('input').show().val('');
			}
		},
		onToggleBillingAddr : function(event) {
			var checked = event.currentTarget.checked;

			if (checked) {
				this.$('.payment .billing-frm').hide();
			} else {
				this.$('.payment .billing-frm').show()
					.find('input').val('').end()
					.find('select').prop('selectedIndex', 0).end();
				var countryBox = this.$('.payment .billing-frm').find('select[name="billing.country"]');
				var defaultCountry = countryBox.find('option[data-c2="'+countryBox.attr('data-default')+'"]').attr('value');
				countryBox.val(defaultCountry).change();
			}
		},
		onInputCardNumber : function(event) {
			var number = $.trim(event.currentTarget.value).replace(/ /g,'').substring(0,16), type;
			type = (Stripe.card.cardType(number)||'').replace(/ /,'').toLowerCase();
			if (type == 'americanexpress') type = 'amex';

			event.currentTarget.value = $.trim(number.replace(/([0-9]{4})/g,'$1 '));
			this.$('.payment .frm .card').attr('class', 'card '+type);
		},
		onSubmitOrder : function(event) {
			var self = this, $btn = this.$('.btn-submit'), addr = this.model.get('current_addr'), card = this.model.get('current_card'), $payment;

			event.preventDefault();

			// billing address
			var billing = {};
			var shipping = {};
			if (addr && $('#use_same_addr').is(':checked')) {
				billing = _.pick(addr.attributes, 'address1', 'address2', 'city', 'state');
				billing['postal_code'] = addr.get('zip');
				billing['country'] = this.$('select[name="billing.country"] option[data-c2="'+addr.get('country')+'"]').attr('value');
			} else {
				this.$('.payment [name^="billing."]').each(function(){
					var name = this.getAttribute('name').replace(/^billing\./,''), val = $.trim(this.value);
					billing[name] = val;
				});
			}

            if (!addr && globals.userInfo) {
                this.$('.shipping .error-box').show()[0].scrollIntoView();
                return;
            }
			if (!card) {
				var cardAttrs = {}, stripeCard;
				this.$('.payment [name^="card."]').each(function(){
					var name = this.getAttribute('name').replace(/^card\./,''), val = $.trim(this.value);
					if (name != 'id') cardAttrs[name] = val;
				});		

				var card_required = 'name card_number security_code'.split(' '), address_required = 'address1 city postal_code phone'.split(' '), k, i, c;
				var isValidCard = true;

				this.$('.error-box, .error-msg').hide();
                for (i=0,c=card_required.length; i < c; i++) {
                    k = card_required[i];
					if (!cardAttrs[k].length){						
						var msg = this.$('.payment [name="card.'+k+'"]').next();
						msg.text(msg.attr('data-msg')).show();
						isValidCard = false;
					}
				}
                
				var isValidGuest=true;
				if (!globals.userInfo){					
					if( !this.$(".sign input[name=email]").val()){
						var msg = this.$(".sign input[name=email]").next();
						msg.text(msg.attr('data-msg')).show();
						isValidGuest = false;
					}else if( !/^[\w\-\.\+]+@([\w\-]+\.)+[a-z]+$/.test(this.$(".sign input[name=email]").val()) ){
						var msg = this.$(".sign input[name=email]").next();
						msg.text(this.$(".sign input[name=email]").val()).show();
						isValidGuest = false;
					}
				}

				if(!addr){
					this.$('.shipping [name^="addr."]:visible').each(function(){
						var name = this.getAttribute('name').replace(/^addr\./,''), val = $.trim(this.value);
						shipping[name] = val;
					});

					var shipping_required = 'full_name address1 city zip phone'.split(' ');
					for (i=0,c=shipping_required.length; i < c; i++) {
						k = shipping_required[i];
						if (!shipping[k].length){
							this.$('.shipping [name="addr.'+k+'"]').next().show();
							isValidGuest = false;
						}
					}
				}					
				if( !isValidGuest ) {
					this.$('.shipping .error-box').show();
				}
                

				if (!$('#use_same_addr').is(':checked')) {
					for (i=0,c=address_required.length; i < c; i++) {
						k = address_required[i];
						if (!billing[k].length){
							this.$('.payment [name="billing.'+k+'"]').next().show();
							isValidCard = false;
						}
					}	
				}
				if( !isValidCard){
					this.$('.payment .error-box').show();
				}
				if( !isValidGuest ||  !isValidCard){
					this.$('.error-msg:visible:eq(0)').closest('fieldset')[0].scrollIntoView();
					return;
				}

				if (globals.staging) {
					$payment = $btn.prop('disabled', true).addClass('loading').text('Processing Order...').closest('.payment').addClass('loading');

					if($('#use_same_addr').is(':checked') && !globals.userInfo){
						billing = _.pick(shipping, 'address1', 'address2', 'city', 'state');
						billing['postal_code'] = shipping.zip;
						billing['country'] = this.$('select[name="billing.country"] option[data-c2="'+shipping.country+'"]').attr('value');
					}
					cardAttrs = _.extend(cardAttrs, billing);
                    var valid = true;
                    var pan = cardAttrs['card_number'].replace(/[ -]/g, '');
                    if (pan != pan.replace(/[^\d]/g, '') || pan.length < 15 || pan.length > 16) {
                        valid = false;
                    }
                    var csv = cardAttrs['security_code']
                    if (csv.length != 3 && csv.length != 4) {
                        valid = false;
                    }
                    if (valid) {
                        payment();
                    } else {
                        $btn.prop('disabled', false).removeClass('loading').text('Submit Order');
                        $payment.removeClass('loading');
                        self.$('.payment .error-box').show()[0].scrollIntoView();
                        for (i=0,c=card_required.length; i < c; i++) {
                            k = card_required[i];
                            var v = cardAttrs[k]
                            self.$('.payment [name="card.'+k+'"]').next().text(v).show();								
                        }
                        return;
                    }
				} else if (globals.userInfo) {
					if(!addr && $('#use_same_addr').is(':checked')){
						billing = _.pick(shipping, 'address1', 'address2', 'city', 'state');
						billing['postal_code'] = shipping.zip;
						billing['country'] = this.$('select[name="billing.country"] option[data-c2="'+shipping.country+'"]').attr('value');
					}
					cardAttrs = _.extend(cardAttrs, billing);
					
					stripeCard = new Model.StripeCreditCard(cardAttrs);
		
					// creating card via stripe
					$payment = $btn.prop('disabled', true).addClass('loading').text('Processing Order...').closest('.payment').addClass('loading');

					stripeCard.getCreditCard(function(card_, error){
						if (!card_ || error) {
							$btn.prop('disabled', false).removeClass('loading').text('Submit Order');
							$payment.removeClass('loading');

							self.$('.payment .error-box').show()[0].scrollIntoView();
							for (i=0,c=card_required.length; i < c; i++) {
								k = card_required[i];
								var v = cardAttrs[k]
								self.$('.payment [name="card.'+k+'"]').next().text(v).show();								
							}

							return;
						}

						// update billing address
						card_.set(billing).save()							
							.fail(function(){
                                self.$('.payment .error-box').show()[0].scrollIntoView();
								$btn.prop('disabled', false).removeClass('loading').text('Submit Order');
								$payment.removeClass('loading');
								//console.log('Address!', arguments);
							})
							.done(function(json){
								card = card_.set('id', json.id);
								payment();
							});
					});
                } else {
					if($('#use_same_addr').is(':checked')){
						billing = _.pick(shipping, 'address1', 'address2', 'city', 'state');
						billing['postal_code'] = shipping.zip;
						billing['country'] = this.$('select[name="billing.country"] option[data-c2="'+shipping.country+'"]').attr('value');
					}
					cardAttrs = _.extend(cardAttrs, billing);
					stripeCard = new Model.StripeCreditCard(cardAttrs);
		
					// creating card via stripe
					$payment = $btn.prop('disabled', true).addClass('loading').text('Processing Order...').closest('.payment').addClass('loading');

					stripeCard.getGuestCreditCard(function(card_, error){						
						if (!card_ || error) {
							$btn.prop('disabled', false).removeClass('loading').text('Submit Order');
							$payment.removeClass('loading');

							self.$('.payment .error-box').show()[0].scrollIntoView();
							self.$('.payment [name="card.card_uri"]').next().text(card_.id).show(); 
							return;
						}
						card = card_;
						payment();
					});

				}
			} else {
				payment();
			}

			function payment() {
				$payment = $btn.prop('disabled', true).addClass('loading').text('Processing Order...').closest('.payment').addClass('loading');

				var order = new Model.Order();

				order.setPreference(self.model);
				if( !globals.userInfo){
					var guestInfo = {};
					guestInfo.email = $(".sign input[name=email]").val();
					for( var k in shipping){
						guestInfo[k] = shipping[k];
					}
					for( var k in billing){
						guestInfo['billing_'+k] = billing[k];
					}
                    if (globals.staging) {
                        guestInfo['payment_type'] = 'staging';
                        var pan = $('.payment [name="card.card_number"]').val();
                        guestInfo['billing_card_uri'] = pan.substr(pan.length - 4);
                    } else {
                        guestInfo['payment_type'] = 'stripe';
                        guestInfo['billing_card_uri'] = card.id;
                    }
					order.setGuestInfo(guestInfo);
				}else{
                    if (globals.staging) {
                        if (!card) {
                            var pan = $('.payment [name="card.card_number"]').val();
                            var attr = {}
                            attr['payment_type'] = 'staging';
                            attr['card_type'] = 'Mastercard';
                            attr['card_last_digits'] = pan.substr(pan.length - 4);
                            attr['card_expiration'] = '12/2020';
                            card = { 'id': 0, 'attributes': attr };
                        }
					    order.setCreditCard(card);
                        order.set('payment_type', 'staging');
                    } else {
					    order.setCreditCard(card);
                    }
				}
                if ($(".shipping-type").is(':visible')) {
                    order.set('shipping_type', $(".shipping-type input[name=shipping-type]:checked").val());
                }

				order.save()
					.always(function(){
						$btn.prop('disabled', false).removeClass('loading').text('Submit Order');
						$payment.removeClass('loading');
					})
					.fail(function(obj){
						var json = obj.responseJSON;
						if (json && json.error && json.error.error_message) {
							alert(json.error.error_message);
						} else {
							alert("Order failed. Please try again");
						}
					})
					.done(function(json){
						location.href = json.order.url;
					});
			}

		}
	});

	pref.set('seller', globals.sellerInfo || {});

	var checkoutView = new View.Checkout({
		el : '#checkout',
		model : pref,
		collection : new Collection.CartItems({seller_id:+globals.sellerInfo.id}),
		seller : globals.sellerInfo || {}
	});

	checkoutView.fetch();	
	
	var reloadEverything = function() {
		$('.shipping')
			.find('input[type="text"]').val('').end()
			.find('select[name="addr.state"]').prop('selectedIndex', 0).end();
		var countryBox = $('.shipping').find('select[name="addr.country"]');
		countryBox.val(countryBox.attr('data-default')).change();
		$('.payment .frm')
			.find('input[type="text"]').val('').end()
			.find('select').prop('selectedIndex', 0).end()
			.find('#use_same_addr').prop('checked', false).end()
			.find('.billing-frm').hide().end();
		countryBox = $('.payment .billing-frm').find('select[name="billing.country"]');
		var defaultCountry = countryBox.find('option[data-c2="'+countryBox.attr('data-default')+'"]').attr('value');
		countryBox.val(defaultCountry).change();
		checkoutView.firstTime = true;
		checkoutView.model.set('items', []);
		checkoutView.fetch();
	};
	
	globals.checkoutView = checkoutView;
});
