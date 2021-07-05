FancyBackbone.Models.Product = FancyBackbone.Models.Product || {};
FancyBackbone.Collections.Product = FancyBackbone.Collections.Product || {};

FancyBackbone.Models.Product.Stat = Backbone.RelationalModel.extend({
  url: function() {
    return _.str.sprintf('/rest-api/v1/seller/%s/products/stat', this.get('user').id);
  },
  defaults: {
    all_products_count: 0,
    affiliate_products_count: 0,
    active_products_count: 0,
    pending_products_count: 0,
    sold_out_products_count: 0,
    expired_products_count: 0,
    coming_soon_products_count: 0,
    awaiting_products_count: 0,
    on_sale_products_count: 0
  },
});
