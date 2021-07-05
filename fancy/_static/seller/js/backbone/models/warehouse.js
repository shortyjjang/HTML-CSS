FancyBackbone.Models.Warehouse = Backbone.RelationalModel.extend({
  idAttribute: 'id_str',
});

FancyBackbone.Collections.WarehouseCollection = Backbone.Collection.extend({
  url: '/rest-api/v1/warehouses',
  model: FancyBackbone.Models.Warehouse,
  parse: function(response) {
    return response.warehouses;
  },
});
