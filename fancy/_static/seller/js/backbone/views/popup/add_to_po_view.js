FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.AddToPurchaseOrderPopup = FancyBackbone.Views.Base.TemplateView.extend({
  template: 'popup_add_to_po',  
  events: {
    'click button.btn-add': 'onSaveButtonClick',
  },
  initialize: function() {
    this._super();
  },
  getTitle: function() {
    return gettext('Add to Current PO');    
  },
  templateData: function() {
    return {
      purchaseOrders: this.collection.models
    };
  },
  open: function() {
    $.dialog("add_po").open();
  },
  syncModel: function() {

    this.purchaseOrder.set('action','add_to_po');
    this.purchaseOrder.set('warehouse', this.purchaseOrder.get('warehouse').id||1 );
    this.purchaseOrder.set('carrier', this.purchaseOrder.get('carrier')||-1 );
    this.purchaseOrder.set('service_level', this.purchaseOrder.get('service_level')||-1 );

    this.purchaseOrder.set('item_profiles', new FancyBackbone.Collections.ItemProfileCollection(this.itemProfiles));
    this.purchaseOrder.set('sale_order_items', new FancyBackbone.Collections.SaleOrderItemCollection(this.saleOrderItems));
  },
  savePurchaseOrder: function() {
    var that = this;
    var purchaseOrder = this.purchaseOrder;
    this.purchaseOrder.save().then(function() {
      if (purchaseOrder.get('status') == 'Locked') {
        alert(gettext("Please contact your manager to authorize this Purchase Order."));
      }

      //$.dialog("add_po").close();
      window.popups.createPurchaseOrder.renderEdit( purchaseOrder );
      //window.location.reload(false);
    }).fail(function() {
      alert(gettext("Failed to proceed request. Please try again later."));
    });
  },
  onSaveButtonClick: function(e) {
    this.purchaseOrder = this.collection.get( this.$('select.po-id').val() );
    if(this.purchaseOrder){
      this.syncModel(false);
      this.savePurchaseOrder();
    }
  },
  renderNew: function(saleOrderItems) {
    var itemProfiles = _.unique(_.map(saleOrderItems, function(saleOrderItem) {
      return saleOrderItem.get('item_profile');
    }));

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
    this.saleOrderItems = saleOrderItems;
    this.itemProfiles = itemProfiles;
    
    return this.render();
  },
  render: function() {
    var that = this;
    var superFn = this._super;
    
    this.collection = FancyBackbone.App.seller.get('purchase_orders');
    this.collection.status = 'saved';
    var that = this;
    this.collection.fetch({data: {page: 1,page_size: 999}}).always(function() {      
      superFn.apply(that);
      that.open();
    });

    return this;
  }
});
