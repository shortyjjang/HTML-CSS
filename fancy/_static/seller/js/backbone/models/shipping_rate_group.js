FancyBackbone.Models.ShippingRateGroup = Backbone.RelationalModel.extend({
  idAttribute: 'id_str',
  urlRoot: function() {
    return _.str.sprintf("/rest-api/v1/seller/%s/shipping-rate-groups/", this.get('user').id);
  },
  createSelectOption: function() {
    return {
      value: this.id,
      display: this.get('name'),
    };
  },
});

FancyBackbone.Collections.ShippingRateGroupCollection = Backbone.Collection.extend({
  url: function() {
    return _.str.sprintf("/rest-api/v1/seller/%s/shipping-rate-groups/", this.user.id);
  },
  model: function() {
    return new FancyBackbone.Models.ShippingRateGroup({user: this.user});
  },
  parse: function(response) {
    return response.shipping_rate_groups;
  },
});
