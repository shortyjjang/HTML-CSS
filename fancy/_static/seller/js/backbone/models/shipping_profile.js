FancyBackbone.Models.ShippingProfile = Backbone.RelationalModel.extend({
  idAttribute: 'id',
  urlRoot: function() {
    return _.str.sprintf("/rest-api/v1/seller/%s/shipping-profiles", this.get('user').id);
  },
  createSelectOption: function() {
    return {
      value: this.id,
      display: this.get('name'),
      attr: {slug: this.get('slug')}
    };
  },
});

FancyBackbone.Collections.ShippingProfileCollection = Backbone.Collection.extend({
  url: function() {
    return _.str.sprintf("/rest-api/v1/seller/%s/shipping-profiles", this.user.id);
  },
  model: function() {
    return new FancyBackbone.Models.ShippingProfile({user: this.user});
  },
  parse: function(response) {
    return response.profiles;
  },
});
