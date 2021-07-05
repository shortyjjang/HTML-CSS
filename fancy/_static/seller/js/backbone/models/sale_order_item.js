FancyBackbone.Models.SaleOrderItem = Backbone.RelationalModel.extend({
  // urlRoot: '/rest-api/v1/seller/sale-order-items',
  idAttribute: 'id_str',
  relations: [
    {
      type: Backbone.HasOne,
      key: 'warehouse_restriction',
      relatedModel: 'WarehouseRestriction',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'sale_order_item',
        includeInJSON: false,
      }
    },
  ],
});

FancyBackbone.Collections.SaleOrderItemCollection = Backbone.Collection.extend({
  model: FancyBackbone.Models.SaleOrderItem,
});
