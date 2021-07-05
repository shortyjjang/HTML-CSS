FancyBackbone.Models.WarehouseRestriction = Backbone.RelationalModel.extend({
  idAttribute: 'id_str',
  urlRoot: function() {
    return _.str.sprintf(
      '/rest-api/v1/seller/%s/sale-order-items/%s/warehouse-restrictions',
      this.get("sale_order_item").get('seller_id_str'),
      this.get("sale_order_item").id
    );
  },
});
