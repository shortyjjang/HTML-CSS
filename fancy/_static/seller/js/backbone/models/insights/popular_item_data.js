FancyBackbone.Models.Insights = FancyBackbone.Models.Insights || {};
FancyBackbone.Collections.Insights = FancyBackbone.Collections.Insights || {};

FancyBackbone.Models.Insights.PopularItemData = Backbone.RelationalModel.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeModelMixin,
  {
    specificRangeURLFormat: "/rest-api/v1/seller/%s/dashboard/popular-item/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/seller/%s/dashboard/popular-item/%s",
  }
));

FancyBackbone.Collections.Insights.PopularItemDataCollection = Backbone.Collection.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeCollectionMixin,
  FancyBackbone.Mixins.PaginatedCollectionMixin,
  {
    model: FancyBackbone.Models.Insights.PopularItemData,
    specificRangeURLFormat: "/rest-api/v1/seller/%s/dashboard/popular-item/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/seller/%s/dashboard/popular-item/%s",
    parse: function(response) {
      this.parsePageInfo(response);
      return response.popular_items;
    },
  }
));
