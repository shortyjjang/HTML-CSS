FancyBackbone.Models.User = FancyBackbone.Models.User || {};
FancyBackbone.Models.User.Affiliate = FancyBackbone.Models.User.Affiliate || {};
FancyBackbone.Models.User.Affiliate.Analytics = FancyBackbone.Models.User.Affiliate.Analytics || {};
FancyBackbone.Collections.User = FancyBackbone.Collections.User || {};
FancyBackbone.Collections.User.Affiliate = FancyBackbone.Collections.User.Affiliate || {};
FancyBackbone.Collections.User.Affiliate.Analytics = FancyBackbone.Collections.User.Affiliate.Analytics || {};

FancyBackbone.Models.User.Affiliate.Analytics.Product = Backbone.RelationalModel.extend({});

FancyBackbone.Collections.User.Affiliate.Analytics.Product = Backbone.Collection.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeCollectionMixin,
  FancyBackbone.Mixins.PaginatedCollectionMixin,
  {
    specificRangeURLFormat: "/rest-api/v1/affiliate/dashboard/products/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/affiliate/dashboard/products/%s",
    parse: function(response) {
      this.parsePageInfo(response);
      return response.product_list;
    },
  }
));