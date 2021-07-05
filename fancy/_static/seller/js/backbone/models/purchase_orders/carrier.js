FancyBackbone.Models.PurchaseOrder = FancyBackbone.Models.PurchaseOrder || {};
FancyBackbone.Collections.PurchaseOrder = FancyBackbone.Collections.PurchaseOrder || {};

FancyBackbone.Models.PurchaseOrder.Carrier = Backbone.RelationalModel.extend({
});

FancyBackbone.Collections.PurchaseOrder.CarrierCollection = Backbone.Collection.extend({
  url: '/rest-api/v1/purchase-orders/carriers',
  model: FancyBackbone.Models.PurchaseOrder.Carrier,
});
