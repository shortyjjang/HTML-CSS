FancyBackbone.Models.SaleItemFilter = Backbone.RelationalModel.extend({
  idAttribute: 'id',
  urlRoot: function() {
    return _.str.sprintf("/rest-api/v1/seller/%s/saleitem_filters", this.get('user').id);
  },
});

FancyBackbone.Collections.SaleItemFilterCollection = Backbone.Collection.extend({
  url: function() {
    return _.str.sprintf("/rest-api/v1/seller/%s/saleitem_filters", this.user.id);
  },
  model: function() {
    return new FancyBackbone.Models.SaleItemFilter({user: this.user});
  },
  parse: function(response) {
    return response.saleitem_filters;
  },
});
