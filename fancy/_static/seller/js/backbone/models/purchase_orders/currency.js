FancyBackbone.Models.PurchaseOrder = FancyBackbone.Models.PurchaseOrder || {};
FancyBackbone.Collections.PurchaseOrder = FancyBackbone.Collections.PurchaseOrder || {};

FancyBackbone.Models.PurchaseOrder.Currency = Backbone.RelationalModel.extend({
  idAttribute: 'code',
});

FancyBackbone.Collections.PurchaseOrder.CurrencyCollection = Backbone.Collection.extend({
  url: '/rest-api/v1/purchase-orders/currencies',
  model: FancyBackbone.Models.PurchaseOrder.Currency,
});
