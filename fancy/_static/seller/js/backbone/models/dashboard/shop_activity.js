FancyBackbone.Models.Dashboard = FancyBackbone.Models.Dashboard || {};
FancyBackbone.Collections.Dashboard = FancyBackbone.Collections.Dashboard || {};

FancyBackbone.Models.Dashboard.ShopActivity = Backbone.RelationalModel.extend({
});

FancyBackbone.Collections.Dashboard.ShopActivityCollection = Backbone.Collection.extend(_.extend(
  {},
  FancyBackbone.Mixins.PaginatedCollectionMixin,
  {
    model: FancyBackbone.Models.Dashboard.ShopActivity,
    url: function() {
      return _.str.sprintf("/rest-api/v1/seller/%s/dashboard/shop-activity", this.user.id);
    },
    parse: function(response) {
      this.parsePageInfo(response);
      return response.shop_activities;
    },
  }
));

