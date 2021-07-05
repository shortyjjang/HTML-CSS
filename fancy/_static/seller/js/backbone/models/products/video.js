FancyBackbone.Models.Product = FancyBackbone.Models.Product || {};
FancyBackbone.Collections.Product = FancyBackbone.Collections.Product || {};

FancyBackbone.Models.Product.Video = Backbone.RelationalModel.extend({
  idAttribute: 'id_str',
  getProductId: function() {
    if (this.get('product')) {
      return this.get('product').id;
    } else {
      return this.get('product_id_str');
    }
  },
});

FancyBackbone.Collections.Product.VideoCollection = Backbone.Collection.extend({
  model: FancyBackbone.Models.Product.Video,
});
