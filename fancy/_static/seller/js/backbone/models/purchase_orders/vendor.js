FancyBackbone.Models.PurchaseOrder = FancyBackbone.Models.PurchaseOrder || {};
FancyBackbone.Collections.PurchaseOrder = FancyBackbone.Collections.PurchaseOrder || {};

FancyBackbone.Models.PurchaseOrder.Vendor = Backbone.RelationalModel.extend({
});

FancyBackbone.Collections.PurchaseOrder.VendorCollection = Backbone.Collection.extend({
  url: '/rest-api/v1/purchase-orders/vendors',
  model: FancyBackbone.Models.PurchaseOrder.Vendor,
});
