FancyBackbone.Models.Product = FancyBackbone.Models.Product || {};
FancyBackbone.Collections.Product = FancyBackbone.Collections.Product || {};

FancyBackbone.Models.Product.Option = Backbone.RelationalModel.extend({
  urlRoot: function() {
var sellerId = this.get('product').get('user').get('id_str');
    return _.str.sprintf("/rest-api/v1/seller/%s/products/%s/options", sellerId, this.getProductId());
  },
  idAttribute: 'id_str',
  relations: [{
    type: Backbone.HasMany,
    key: 'images',
    relatedModel: 'Product.Image',
    collectionType: 'Product.ImageCollection',
    reverseRelation: {
      key: 'option',
      includeInJSON: false,
    }
  },
  ],
  getProductId: function() {
    if (this.get('product')) {
      return this.get('product').id;
    } else {
      return this.get('product_id_str');
    }
  },
});

FancyBackbone.Collections.Product.OptionCollection = Backbone.Collection.extend({
  model: FancyBackbone.Models.Product.Option,
  initialize: function(models, options) {
    if (options && options.url) {
      this.url = options.url;
    }
  },
  parse: function(response) {
    return response.options;
  },
});