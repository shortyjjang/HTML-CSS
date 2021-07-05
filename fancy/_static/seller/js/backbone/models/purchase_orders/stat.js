FancyBackbone.Models.PurchaseOrder = FancyBackbone.Models.PurchaseOrder || {};
FancyBackbone.Collections.PurchaseOrder = FancyBackbone.Collections.PurchaseOrder || {};

FancyBackbone.Models.PurchaseOrder.Stat = Backbone.RelationalModel.extend({
  url: function() {
    return _.str.sprintf('/rest-api/v1/seller/%s/purchase-orders/stat', this.get('user').id);
  },
  defaults: {
    num_saved: 0,
    num_active: 0,
    num_canceled: 0,
  },
});