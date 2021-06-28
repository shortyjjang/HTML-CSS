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

            var self = this;
            var data = { payment_gateway:6 };

            this.fetch({type:'POST',data:data,update_credit_card:true});
		},
		/**
		 * Fetch cart items
		 */
		fetch : function(options) {
			var loggedIn = !!globals.userInfo;
			options = _.clone(options || {});
            options.data = options.data || {};
            options.data.storefront = globals.sellerInfo.id;
            if(options.type=="PUT" || options.type=="POST") {
                options.data = JSON.stringify(options.data);
                options.contentType = "application/json; charset=utf-8";
                options.processData = false;
            }


			var self = this, success = options.success, error = options.error, complete = options.complete, $forms;

			$forms = self.$(options.section||'.right .summary, .order-note, .gift-option, .order-coupon, .shipping, .shipping-type, .payment').addClass('loading');
			
			options.success = function(collection, json) {
				if (!json) json = {};

                if (json.error) {
                    alert(json.error);
                    return;
                }

				if (self.collection.models.length == 0) {
					location.href = self.options.seller.store_url;
				}
				self.model.set({checkout_id:json.id});
                if(json.checkout_code) {
    				self.model.set({checkout_code:json.checkout_code});
                }
				// summary
				//var summary = _.pick(json, 'subtotal_price', 'total_price', 'fancy_gift_card', 'tax', 'shipping', 'coupon_amount', 'fancy_rebate', 'discount_amount');
				var summary = {
                    'subtotal_price': json.subtotal_prices,
                    'total_price': json.total_prices,
                    'tax': json.sales_taxes,
                    'shipping': json.shipping_costs,
                    'coupon_amount': json.coupon_amount,
                    'fancy_rebate': json.credit_amount,
                    'fancy_gift_card': json.fancy_money_amount
                };
				_.defaults(summary, {tax: null, shipping: null, total_price: null});
                for(key in json.sale_items_freeze) {
                    if(json.sale_items_freeze[key].preorder) {
                        _.each(json.sale_items_freeze[key].preorder, function(value, key) {
                            var curValue = summary['preorder_' + key];
                            if (curValue) {
                                if (!isNaN(parseFloat(value))) {
                                    summary['preorder_' + key] = (parseFloat(curValue)+parseFloat(value)).toFixed(2);
                                } 
                            } else {
                                summary['preorder_' + key] = isNaN(parseFloat(value)) ? null : parseFloat(value).toFixed(2);
                            }
                        });
                    }
                }
				self.model.set({summary:summary});

                // If there are items from 1 seller among the checkout, show the seller's shipping option.
                // If there are items from storefront seller among the checkout, show the storefront seller's shipping option.
                // If there are items from multiple sellers except storefront seller, do not show the shipping option.
                var shipping_options = [];
                var keys = [];
                for(key in json.sale_items_freeze) {
                    if(json.sale_items_freeze[key].shipping_options.length>1) {
                        keys.push(key);
                    }
                }
                var seller_id = null;
                if(keys.length==1) {
                    seller_id = keys[0];
                } else {
                    if(globals.sellerInfo.id in keys) {
                        seller_id = globals.sellerInfo.id;
                    }
                }
                if(seller_id!=null) {
                    other_sellers_shipping_cost = 0;
                    for(var k in json.sale_items_freeze) {
                        if(k!=seller_id) other_sellers_shipping_cost += parseFloat(json.sale_items_freeze[k].shipping);
                    }

                    sale_item_freeze = json.sale_items_freeze[seller_id];
                    var shipping_options = sale_item_freeze.shipping_options||[];
                    for (var i = 0; i < shipping_options.length; ++i) {
                        if (shipping_options[i].id == sale_item_freeze.shipping_selected) {
                            shipping_options[i].selected = true;
                        }
                        shipping_options[i].other_sellers_shipping_cost = other_sellers_shipping_cost;
                    }
                }
                self.model.set('shipping_options', shipping_options);
                if(seller_id)
                    self.model.set('shipping_options_seller_id', parseInt(seller_id));
                else
                    self.model.set('shipping_options_seller_id', seller_id);

				// sale items
				self.model.set('items', []);
				self.model.set('items', self.collection.models);

				// coupon
				self.model.set('coupons', json.coupons || []);
				if (json.coupons && json.coupons.length) {
					_.defaults(json.coupons[0], {seller_id:self.options.seller.id});
					self.coupon = new Model.CartCoupon(json.coupons[0]);
				}

				// credit cards
                if(options.update_credit_card) {
    				if (!json.credit_cards) json.credit_cards = {};
    				self.creditCards = new Collection.CreditCards(json.credit_cards.cards||[]);
    				self.model.set(_.omit(json.credit_cards||{}, 'cards'));
    				self.model.set('credit_cards', self.creditCards.models);
    				self.model.set('current_card', self.creditCards.getPrimaryCard());
                }

				// addreses
                if(loggedIn) {
    				self.addresses = new Collection.Addresses(json.shipping_info.addresses||[]);
                } else {
    				self.addresses = new Collection.Addresses([]);
                }

				if (json.shipping_addr_id) {
				    self.model.set({'addresses': self.addresses.models,'current_addr': self.addresses.findWhere({id:json.shipping_addr_id}) || self.addresses.getDefaultAddr()});
				} else {
				    self.model.set({'addresses': self.addresses.models,'current_addr': self.addresses.getDefaultAddr()});
				}



				//self.$el.find(".order-coupon, .payment, .shipping").find("fieldset").toggle(loggedIn);
				// trigger fetch:success event
				self.trigger('fetch:success', json);
				if (success) success.apply(this, arguments);

				self.firstTime = false;
			};
			options.error = function(res,xhr) {
				self.trigger('fetch:error');
				if (error) error.apply(this, arguments);
                else {
                    if(xhr.status==404) {
                        location.href=globals.sellerInfo.store_url + '/cart';
                        return;
                    } else {
                        try {
                            var error_parsed = JSON.parse(xhr.responseText)
                            var error_msg = error_parsed.message || error_parsed.error
                            if(error_msg) {
                                alert(error_msg)
                            }
                            $forms.removeClass('loading');
                        } catch(e) { }
                    }
                }
			};
			options.complete = function() {
                if(!self.isSubmittingOrder) {
    				$forms.removeClass('loading');
                }
				self.trigger('fetch:complete');
				if (complete) complte.apply(this, arguments);
			};

			self.trigger('fetch:before', options);

			return this.collection.fetch(options);
		},
		render : function(model, repaint) {
			var self = this, changed = _.defaults({}, model?model.changed:{}, repaint);

			if (changed.summary) {
                console.log(changed.summary);
				_.each(changed.summary, function(value, key){
					var $prices = self.$('.receipt .'+key+'_v .price, .receipt .'+key+'_ .price');
					$prices.filter('.yet').toggleClass('hide', value !== null);
					$prices.filter('.set').toggleClass('hide', value === null);
                    console.log([key,value]);
					parseFloat(value) ? self.$('.receipt .'+key+'_').removeClass('hidden') : self.$('.receipt .'+key+'_').addClass('hidden');
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
                    self.$('.receipt li[class^=preorder_]').css('display', '');
                } else {
                    self.$('.receipt .total_price_v .label').text('Order Total');
                    self.$('.receipt li[class^=preorder_]').css('display', 'none');
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
                    $(".items_").attr('data-coupon-code', changed.coupons[0].code);
				} else {
					$forms.filter('.input_').show();
                    $(".items_").removeAttr('data-coupon-code');
				}
			}

			if ('credit_cards' in changed) {
				var $payment = this.$('.payment'), $save = $payment.find('.save-card'), $sel = $save.find('select[name="card.id"]'), primaryCard;

				if (changed.credit_cards.length && $sel.data('template')) {
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

				if (changed.addresses.length && $sel.data('template')) {
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
						this.$('.shipping a.go-back').hide();
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

			var email = $("input[name=email]").val();

            this.fetch({type:'PUT', data:{apply_coupon: true, coupon_code: code, email:email}, section:'.right .summary, .order-coupon'});
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
                this.fetch({type:'PUT', data:{apply_coupon: false}, section:'.right .summary, .order-coupon'})
					.always(function(){ $form.removeClass('loading'); $btn.removeClass('disabled'); });
					//.done(function(){ self.fetch({section:'.right .summary, .order-coupon'}); });
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
            this.model.set('shipping_options', []);
            this.firstTime = true;
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
            console.log('onChangeCountry');

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

                var self = this;
                var data = {country: country, city: city, zip: zip, state: state};
                if(globals.storefront) data['storefront'] = globals.sellerInfo.id
				self.fetch({type:'PUT',data:data,section:'.right .summary, .shipping, .shipping-type'});
                console.log('Change Country');
			}

			// some countries uses alphanumeric zip codes
			if ('AR,BN,CA,JM,MT,NL,PE,SO,SZ,GB,VE,'.indexOf(country+',') > -1) {
				$zip.attr('type', 'text');
			} else {
				$zip.attr('type', 'text');
			}
		},
		onChangeTaxAddr : function(event) {
            console.log('onChangeTaxAddr');
			if(! globals.userInfo){
				var country = this.$(".shipping .country select").val();
				var state = this.$(".shipping .state select:visible, .shipping .state input:visible").val();
				var city = this.$(".shipping .city input").val();
				var zip = this.$(".shipping .zip input").val();
				if( country=='US' && state && city && zip)
					this.fetch({type:'PUT', data: {country: country, state: state, city: city, zip: zip}, section:'.right .summary, .shipping, .shipping-type'});
			}
		},
        onChangeShippingType : function(event) {
            console.log('onChangeShippingType');
            var shipping_type = this.$(".shipping-type input[name=shipping-type]:checked").val();
            shipping_option = {}
            if(this.model.attributes.shipping_options_seller_id) {
                shipping_option[this.model.attributes.shipping_options_seller_id] = parseInt(shipping_type);
            }
			if(! globals.userInfo){
				var country = this.$(".shipping .country select").val();
				var state = this.$(".shipping .state select:visible, .shipping .state input:visible").val();
				var city = this.$(".shipping .city input").val();
				var zip = this.$(".shipping .zip input").val();
                // For now, shipping option is only applied for the items from the storefront.
                // Affiliate sale items will be applied default shipping options
                this.fetch({type: 'PUT', data: {country: country, state: state, city: city, zip: zip, shipping_option:shipping_option}, section:'.right .summary, .shipping-type'});
            } else {
                // For now, shipping option is only applied for the items from the storefront.
                // Affiliate sale items will be applied default shipping options
    			this.fetch({type: 'PUT', data: {shipping_option:shipping_option}, section: '.right .summary, .shipping-type'}) ;
            }
        },
		onSubmitAddress : function(event){
			event.preventDefault();

            console.log('onSubmitAddress');

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
			this.fetch({type: 'PUT', data: {address_id: addrID}, section: '.right .summary, .shipping, .shipping-type'}) ;
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

                if (globals.userInfo) {
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
                            if(card_) {
    							self.$('.payment [name="card.card_uri"]').next().text(card_.id).show(); 
                            }
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

                // instead of /rest-api/v1/carts/saleitem/<seller_id>/payment,
                // post to /rest-api/v1/checkout/payment/<checkout_id>
                // which processes unified checkout.
                //
                // this code fetch attributes from Backbone Model object and post the data to rest_api in a raw format.
                // this should be re-written in some day in near future.
                console.log('Start Unified checkout payment')

                attributes = self.model.attributes;
                var checkoutId = attributes.checkout_id;
                var checkout_code = attributes.checkout_code;
                var note = attributes.note;
                var note_info = {};
                for(var i in attributes.items) {
                    note_info[attributes.items[i].attributes.seller_id] = note;
                }
                var gift_info = {};
                var is_gift = attributes.is_gift;
                var gift_message = is_gift?attributes.gift_message:"";
                for(var i in attributes.items) {
                    gift_info[attributes.items[i].attributes.seller_id] = {
                        is_gift: is_gift,
                        gift_message: gift_message
                    };
                }

                if(!checkoutId || checkoutId<=0) {
                    alert("Order failed. Please try again");
                    $btn.prop('disabled', false).removeClass('loading').text('Submit Order');
                    $payment.removeClass('loading');
                    return;
                }
                var data = {
                    note_info: note_info,
                    gift_info: gift_info,
                }
                var card_id = null;
                var address_id = null;
                if( globals.userInfo) {
                    address_id = attributes.current_addr.id;
                    if(attributes.current_card) {
                        card_id = attributes.current_card.id;
                    } else {
                        card_id = card.id;
                    }
                    if(!card_id || !address_id) {
                        alert("Order failed. Please try again");
                        $btn.prop('disabled', false).removeClass('loading').text('Submit Order');
                        $payment.removeClass('loading');
                        return;
                    }
                } else {
                    data["email"] = $(".sign input[name=email]").val();
                    data["shipping_addr"] = shipping;
                }

                self.fetch({type:'PUT',data:data,
                    success:function(res) {
                        console.log('PUT result', res);
                        console.log('PUT result', self.model);

                        attributes = self.model.attributes;
                        for(i in attributes.items) {
                            if(!attributes.items[i].attributes.available) {
						        alert('"'+attributes.items[i].attributes.title + '" is not available to ship to your address.');
        						$btn.prop('disabled', false).removeClass('loading').text('Submit Order');
        						$payment.removeClass('loading');
                                return;
                            }
                        }

                        if(res.error){
                            alert(res.error);
    						$btn.prop('disabled', false).removeClass('loading').text('Submit Order');
    						$payment.removeClass('loading');
                            return;
                        }
                        var payment_data = {
                            payment_gateway:6,
                            ordered_via:"storefront"
                        };
                        if( globals.userInfo) {
                            payment_data["payment_id"] = card_id;
                        } else {
                            payment_data["card_token"] = card.id;
							payment_data["billing_addr"] = JSON.stringify(billing);
                        }
			            self.$('.right .summary, .order-note, .gift-option, .order-coupon, .shipping, .shipping-type, .payment').addClass('loading');
                        self.isSubmittingOrder = true;
                        $.ajax({
                            type : 'POST',
                            url  : '/rest-api/v1/checkout/payment/'+checkoutId,
                            contentType: "application/json; charset=utf-8",
                            data : JSON.stringify(payment_data),
                            processData : false,
                            success  : function(res){
                                location.href='/'+globals.sellerInfo.username+'/complete/checkout/'+(checkout_code || checkoutId)
                            }
                        }).fail(function(xhr) {
                            console.log(xhr);
                            if(xhr.responseJSON && xhr.responseJSON.error) {
        						alert(xhr.responseJSON.error);
                            } else {
        						alert("Order failed. Please try again");
                            }
                        }).always(function() {
                            self.isSubmittingOrder = false;
			                self.$('.right .summary, .order-note, .gift-option, .order-coupon, .shipping, .shipping-type, .payment').removeClass('loading');
    						$btn.prop('disabled', false).removeClass('loading').text('Submit Order');
    						$payment.removeClass('loading');
    					});
                    },
                    error:function(res, xhr) {
                        console.log('error', res);
                        if(xhr.status==404) {
                            location.href=globals.sellerInfo.store_url + '/cart';
                            return;
                        }
                        var error_msg = null
                        try {
                            var error_parsed = JSON.parse(xhr.responseText)
                            error_msg = error_parsed.message || error_parsed.error
                        } catch(e) { }
                        alert(error_msg || "Order failed. Please try again");

                        $btn.prop('disabled', false).removeClass('loading').text('Submit Order');
                        $payment.removeClass('loading');
                    }});
                return;
			}
		}
	});

	pref.set('seller', globals.sellerInfo || {});

	var checkoutView = new View.Checkout({
		el : '#container',
		model : pref,
	    collection : new Collection.CheckoutItems({payment_gateway:6, storefront:globals.sellerInfo.id}),
		seller : globals.sellerInfo || {}
	});

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

    if (!Stripe.initialized) {
        try { Stripe.setPublishableKey(globals.STRIPE_PUBLISHABLE_KEY); 
            Stripe.initialized = true; 
        } catch(e) {
        };
    }

	globals.checkoutView = checkoutView;
});
