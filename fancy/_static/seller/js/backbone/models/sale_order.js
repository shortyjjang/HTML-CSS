FancyBackbone.Models.SaleOrder = Backbone.RelationalModel.extend({
  idAttribute: 'id_str',
});

FancyBackbone.Collections.SaleOrderCollection = Backbone.Collection.extend({
  model: FancyBackbone.Models.SaleOrder,
  initialize: function(options) {
    this.url = this.url || options.url;
  },
  parse: function(response) {
    return response.sale_orders;
  },
});
