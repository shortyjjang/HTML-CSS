FancyBackbone.Models.User = FancyBackbone.Models.User || {};
FancyBackbone.Models.User.Affiliate = FancyBackbone.Models.User.Affiliate || {};
FancyBackbone.Models.User.Affiliate.Products = FancyBackbone.Models.User.Affiliate.Analytics || {};
FancyBackbone.Collections.User = FancyBackbone.Collections.User || {};
FancyBackbone.Collections.User.Affiliate = FancyBackbone.Collections.User.Affiliate || {};
FancyBackbone.Collections.User.Affiliate.Products = FancyBackbone.Collections.User.Affiliate.Analytics || {};

FancyBackbone.Models.User.Affiliate.Products.Product = Backbone.RelationalModel.extend({});

FancyBackbone.Collections.User.Affiliate.Products.ProductCollection = Backbone.Collection.extend(_.extend(
  {},
  FancyBackbone.Mixins.PaginatedCollectionMixin,
  {
    url: function(){
      return "/rest-api/v1/affiliate/products";
    },
    parse: function(response) {
      this.parsePageInfo(response);
      return response.product_list;
    },
  }
));