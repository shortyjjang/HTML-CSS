FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.CreatePurchaseOrderPopup = FancyBackbone.Views.Base.TemplateCollectionView.extend({
  template: 'popup_create_purchase_order',
  listItemViewClass: FancyBackbone.Views.Base.TemplateModelView.extend({
    tagName: 'tr',
    template: 'popup_create_purchase_order_list_item',
    syncModel: function() {
      this.model.set('quantity', parseInt(this.$('input[name=quantity]').val(), 10));
      this.model.set('unitcost', parseInt(this.$('input[name=unitcost]').val(), 10));
      this.model.set('unitdiscount', this.$('input[name=unitdiscount]').val());
      this.model.set('currency', this.$('select[name=currency]').val());
    },
    templateData: function() {
      return _.extend(
        {
          currencies: this.model.currencies.toJSON()
        },
        this._super()
      );
    },
  }),
  listSelector: '.products table tbody',
  events: {
    'change select[name=warehouse]': 'onWarehouseChange',
    'change input[name=unitcost]': 'onUnitChange',
    'change input[name=unitdiscount]': 'onUnitChange',
    'change input[name=quantity]': 'onUnitChange',
    'change select[name=carrier]': 'onCarrierSelectChange',
    'keyup input[name=tracking-id],input[name=order-ref-num]': 'onTrackingIdOrOrderRefNumChange',
    'click button.btn-save': 'onSaveButtonClick',
    'click button.btn-send': 'onSendButtonClick',
    'click a.btn-del': 'onItemDeleteButtonClick',
  },
  initialize: function() {
    this._super();
    // FancyBackbone.App.SharedResources.fetchWarehouses();
    // FancyBackbone.App.SharedResources.fetchStates();
    // FancyBackbone.App.SharedResources.fetchPurchaseOrderCarriers();
    //FancyBackbone.App.SharedResources.fetchPurchaseOrderCurrencies();
    // FancyBackbone.App.SharedResources.fetchPurchaseOrderVendors();
    // FancyBackbone.App.SharedResources.fetchPurchaseOrderVendors();
    // FancyBackbone.App.SharedResources.fetchCountries();
  },
  getTitle: function() {
    if (this.purchaseOrder.isNew()) {
      return gettext('Create PO');
    } else {
      return _.str.sprintf('Edit PO #%s', this.purchaseOrder.get('versioned_id'));
    }
  },
  canSend: function() {
    if (this.purchaseOrder.isNew()) {
        return true;
    } else if (this.purchaseOrder.get('status').toLowerCase() == 'active') {
        return false;
    }
    return true;
  },
  templateData: function() {
    return {
      warehouses: this.warehouses.toJSON(),
      states: this.states.toJSON(),
      carriers: this.carriers.toJSON(),
      currencies: this.currencies.toJSON(),
      vendors: [],
      // vendors: this.vendors.toJSON(),
      countries: this.countries.toJSON(),
      currentCountryCode: [],
      //currentCountryCode: this.states.currentCountryCode,
      title: this.getTitle(),
      purchaseOrder: this.purchaseOrder.toJSON(),
      canSend: this.canSend(),
      seller: this.seller.toJSON()
    };
  },
  onWarehouseChange: function(event) {
     var warehouse = this.warehouses.get(this.$('select[name=warehouse]').val());
     this.$('dd.warehouse address').html(warehouse.get('name')+"<br/>"+warehouse.get('address'));
  },
  onUnitChange : function(event) {
    var item = $(event.target).closest('tr');
    var unitcost = item.find("input[name=unitcost]").val();
    var unitdiscount = item.find("input[name=unitdiscount]").val();
    item.find("input[name=unittotal]").val( (unitcost-unitdiscount).toFixed(2) );

    var discount = 0;
    var items = $(event.target).closest('tbody').find(">tr");
    items.each(function(idx,item){
      var quantity = $(item).find("input[name=quantity]").val();
      var unitdiscount = $(item).find("input[name=unitdiscount]").val();  
      discount += (quantity * unitdiscount);
    })
    
    this.$("input[name=discount_value]").val(discount);
  },
  onCarrierSelectChange: function(event) {
    var carrier = this.carriers.get(this.$('select[name=carrier]').val());
    $carrierServiceSelect = this.$('select[name=service-level]');
    $carrierServiceSelect.val(-1);
    $carrierServiceSelect.empty();    
    _.each(carrier?carrier.get('service_levels'):[], function(serviceLevel) {
      $carrierServiceSelect.append($("<option>").attr('value', serviceLevel.id).text(serviceLevel.display));
    });
  },
  onTrackingIdOrOrderRefNumChange: function(event) {
    $currentTarget = $(event.currentTarget);
    if ($currentTarget.attr('name') == 'tracking-id') {
      this.$('input[name=order-ref-num]').val('');
    } else {
      this.$('input[name=tracking-id]').val('');
    }
  },
  open: function() {
    $.dialog("create_po").open();
  },
  checkTypes: function() {
    var nullableIntRegex = /^\d*$/;
    var nullableIntValues = [];
    var intRegex = /^\d+$/;
    var intValues = _.map(this.$('input[name=quantity]'), function(input) {
      return $(input).val();
    });
    return _.every(nullableIntValues, nullableIntRegex.test, nullableIntRegex) && _.every(intValues, intRegex.test, intRegex);
  },
  checkQuantities: function() {
    return _.every(this.$('input[name=quantity][min-quantity]'), function(input) {
      var $input = $(input);
      var minQuantity = Number($input.attr('min-quantity'));
      var quantity = Number($input.val());
      return minQuantity <= quantity;
    });
  },
  validateData: function(send) {
    if (send) {
      if (this.purchaseOrder.get('status').toLowerCase() != 'pending') {
        alert('This purchase order has already been sent.');
        return false;
      }
      if (this.purchaseOrder.get('tracking_id') === null && this.purchaseOrder.get('order_ref_num') === null) {
        alert('Please enter tracking # or order reference #');
        return false;
      }
    }

    var ret = this.checkTypes() && this.checkQuantities();
    if (!ret) {
      alert("Please check values.");
    }
    return ret;
  },
  syncModel: function(send) {
    this.purchaseOrder.set('comments', this.$('textarea[name=comments]').val());
    this.purchaseOrder.set('carrier', parseInt(this.$('select[name=carrier]:visible').val()||"-1",10));
    this.purchaseOrder.set('service_level', parseInt(this.$('select[name=service-level]:visible').val()||"-1",10));

    this.purchaseOrder.set('warehouse', this.$('select[name=warehouse]').val());

    this.purchaseOrder.set('vendor_company', this.$('input[name=vendor_company]').val());
    this.purchaseOrder.set('vendor_contact', this.$('input[name=vendor_contact]').val());
    this.purchaseOrder.set('vendor_address1', this.$('input[name=vendor_address1]').val());
    this.purchaseOrder.set('vendor_address2', this.$('input[name=vendor_address2]').val());
    this.purchaseOrder.set('vendor_city', this.$('input[name=vendor_city]').val());
    this.purchaseOrder.set('vendor_state', this.$('select[name=vendor_state]').val());
    this.purchaseOrder.set('vendor_zip', this.$('input[name=vendor_zip]').val());
    this.purchaseOrder.set('vendor_country', this.$('select[name=vendor_country]').val());
    this.purchaseOrder.set('vendor_phone', this.$('input[name=vendor_phone]').val());
    this.purchaseOrder.set('vendor_email', this.$('input[name=vendor_email]').val());

    this.purchaseOrder.set('merchant_invoice', this.$('input[name=merchant_invoice]').val());
    this.purchaseOrder.set('wire_ref_num', this.$('input[name=wire_ref_num]').val());
    this.purchaseOrder.set('shipping_cost', this.$('input[name=shipping_cost]').val());
    this.purchaseOrder.set('paypal_ref_num', this.$('input[name=paypal_ref_num]').val());
    this.purchaseOrder.set('extra_cost_type', this.$('input[name=extra_cost_type]').val());
    this.purchaseOrder.set('extra_cost', this.$('input[name=extra_cost]').val());
    this.purchaseOrder.set('sales_tax', this.$('input[name=sales_tax]').val());
    this.purchaseOrder.set('card_last_four', this.$('input[name=card_last_four]').val());
    this.purchaseOrder.set('tag', this.$('input[name=tag]').val());
    this.purchaseOrder.set('po_type', this.$('input[name=po_type]').val());
    
    var value;

    value = this.$('input[name=tracking-id]:visible').val();
    if (!value) {
      value = null;
    }
    this.purchaseOrder.set('tracking_id', value);

    value = this.$('input[name=order-ref-num]:visible').val();
    if (!value) {
      value = null;
    }
    this.purchaseOrder.set('order_ref_num', value);

    this.purchaseOrder.set('eta', this.$('input[name=eta]:visible').val());

    _.each(this.listItemViews, function(listItemView) {
      listItemView.syncModel();
    }, this);

    this.purchaseOrder.set('send', send);
  },

  savePurchaseOrder: function() {
    var purchaseOrder = this.purchaseOrder;
    this.purchaseOrder.save().then(function() {
      if (purchaseOrder.get('status') == 'Locked') {
        alert(gettext("Please contact your manager to authorize this Purchase Order."));
      }
      window.location.reload(false);
    }).fail(function() {
      alert(gettext("Failed to proceed request. Please try again later."));
    });
  },
  onSaveButtonClick: function() {
    if (this.validateData(false)) {
      this.syncModel(false);
      this.savePurchaseOrder();
    }
  },
  onSendButtonClick: function() {
    if (this.validateData(true)) {
      this.syncModel(true);
      this.savePurchaseOrder();
    }
  },
  onItemDeleteButtonClick: function(event){

    if( !confirm("Are you sure?")){
      return;
    }
    var item_number = $(event.target).closest("a").attr("data-item_number");
    var itemProfiles = [];
    _.each( this.purchaseOrder.get('item_profiles').models, function(itemProfile){
      if( itemProfile.get("item_number") == item_number){
        itemProfiles.push(itemProfile);
      }
    })
    var that = this;
    this.purchaseOrder.set('action', 'remove_po_items');
    this.purchaseOrder.set('warehouse', this.purchaseOrder.get('warehouse').id||1 );
    this.purchaseOrder.set('carrier', this.purchaseOrder.get('carrier')||-1 );
    this.purchaseOrder.set('service_level', this.purchaseOrder.get('service_level')||-1 );
    this.purchaseOrder.set('item_profiles', new FancyBackbone.Collections.ItemProfileCollection(itemProfiles) );
    this.purchaseOrder.save().then(function() {
      window.popups.createPurchaseOrder.renderEdit( that.purchaseOrder );
    }).fail(function() {
      alert(gettext("Failed to proceed request. Please try again later."));
    });
  },
  renderEdit: function(purchaseOrder) {
    this.purchaseOrder = purchaseOrder;
    this.collection = purchaseOrder.get('item_profiles');
    return this.render();
  },  
  renderNew: function(saleOrderItems, purchaseOrder) {
    var itemProfiles = _.unique(_.map(saleOrderItems, function(saleOrderItem) {
      return saleOrderItem.get('item_profile');
    }));

    if(purchaseOrder){
      saleOrderItems = purchaseOrder.get('sale_order_items').models;
      itemProfiles = purchaseOrder.get('item_profiles').models;
    }

    _.each(itemProfiles, function(itemProfile) {
      var relatedSaleOrderItems = _.filter(saleOrderItems, function(saleOrderItem) {
        return saleOrderItem.get('item_profile') == itemProfile;
      });
      var relatedVipSaleOrderItems = _.filter(relatedSaleOrderItems, function(saleOrderItem) {
        return saleOrderItem.get('sale_order').is_vip;
      });
      itemProfile.set(
        'quantity',
        _.reduce(
          _.map(
            relatedSaleOrderItems,
            function(saleOrderItem) {
              return Number(saleOrderItem.get('quantity'));
            }
          ),
          function(memo, num) { return memo + num;},
          0
        )
      );
      itemProfile.set(
        'vip_quantity',
        _.reduce(
          _.map(
            relatedVipSaleOrderItems,
            function(saleOrderItem) {
              return Number(saleOrderItem.get('quantity'));
            }
          ),
          function(memo, num) { return memo + num;},
          0
        )
      );
      itemProfile.set(
        'has_vip_order',
        itemProfile.get('vip_quantity') > 0
      );
      itemProfile.set(
        'min_quantity',
        itemProfile.get('quamtity')
      );
    }, this);
    this.collection = new FancyBackbone.Collections.ItemProfileCollection(itemProfiles);
    this.purchaseOrder = new FancyBackbone.Models.PurchaseOrder.PurchaseOrder({
      sale_order_items: new FancyBackbone.Collections.SaleOrderItemCollection(saleOrderItems),
      item_profiles: this.collection,
      user: window.seller,
      carrier: -1,
      service_level: -1,
      comments: '',
    });

    var that = this;
    if(purchaseOrder){
      $(['carrier','service_level','comments','eta','order_ref_num','tracking_id']).each(function(idx,v){
        that.purchaseOrder.set(v, purchaseOrder.get(v) );
      })
    }
    return this.render();
  },
  render: function() {
    var that = this;
    var superFn = this._super;
    var promises = [
      FancyBackbone.App.SharedResources.fetchWarehouses(),
      FancyBackbone.App.SharedResources.fetchStates(),
      FancyBackbone.App.SharedResources.fetchPurchaseOrderCarriers(),
      FancyBackbone.App.SharedResources.fetchPurchaseOrderCurrencies(),
      //FancyBackbone.App.SharedResources.fetchPurchaseOrderVendors(),
      FancyBackbone.App.SharedResources.fetchCountries(),
    ];
    // $.when.apply($, promises).done(function(warehouses, states, carriers, currencies, vendors, countries) {
    //   that.warehouses = warehouses;
    //   that.states = states;
    //   that.carriers = carriers;
    //   that.currencies = currencies;
    //   that.vendors = vendors;
    //   that.countries = countries;
    $.when.apply($, promises).done(function(warehouses, states, carriers, currencies, countries) {
      that.warehouses = warehouses;
      that.states = states;    
      that.currencies = currencies;
      that.carriers = carriers;
      that.countries = countries;
      that.seller = window.seller;
      that.collection.each(function(v){ v.currencies = currencies });
      superFn.apply(that);

      that.$('input[name=eta]').datepicker({
        changeMonth: false,
        numberOfMonths: 1,
        defaultDate: moment.utc().toDate(),
        minDate: moment.utc().toDate(),
      });
      _.defer(function() {
        if(that.seller.get('warehouse_id')){
          that.$('select[name=warehouse]').val(that.seller.get('warehouse_id')).attr('disabled','disabled');
        }else{
          that.$('select[name=warehouse]').removeAttr('disabled');
        }

        that.$('select[name=vendor_state]').val(that.seller.get('state'));
        that.$('select[name=vendor_country]').val(that.seller.get('country'));

        that.$('select[name=warehouse]').trigger('change');

        if (that.purchaseOrder.get('eta')) {
          that.$('input[name=eta]').datepicker(
            'setDate',
            moment.utc(that.purchaseOrder.get('eta')).format("MM/DD/YYYY")
          );
          $("#ui-datepicker-div").hide();
        }
        if (that.purchaseOrder.get('carrier') !== null) {
          that.$('select[name=carrier]').val(that.purchaseOrder.get('carrier'));
          that.onCarrierSelectChange();
          if (that.purchaseOrder.get('service_level') !== null) {
            that.$('select[name=service-level]').val(that.purchaseOrder.get('service_level'));
          }
          that.$('dd.ship-info select:eq(0)').val('tracking').trigger('change');
        }
        if (that.purchaseOrder.get('order_ref_num') != null){
          that.$('dd.ship-info select:eq(0)').val('reference').trigger('change');
        }
        if( that.$(".tb-type2 tbody tr a.btn-del").length == 1 || !that.purchaseOrder.get('status') || that.purchaseOrder.get('status').toLowerCase()!='pending'){
          that.$(".tb-type2 tbody tr a.btn-del").remove();
        }
      });
      that.open();
    });

    return this;
  }
});
