FancyBackbone.Models.Insights = FancyBackbone.Models.Insights || {};
FancyBackbone.Collections.Insights = FancyBackbone.Collections.Insights || {};

FancyBackbone.Models.Insights.SearchKeywordData = Backbone.RelationalModel.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeModelMixin,
  {
    specificRangeURLFormat: "/rest-api/v1/seller/%s/dashboard/search-keyword/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/seller/%s/dashboard/search-keyword/%s",
  }
));

FancyBackbone.Collections.Insights.SearchKeywordDataCollection = Backbone.Collection.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeCollectionMixin,
  FancyBackbone.Mixins.PaginatedCollectionMixin,
  {
    model: FancyBackbone.Models.Insights.SearchKeywordData,
    specificRangeURLFormat: "/rest-api/v1/seller/%s/dashboard/search-keyword/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/seller/%s/dashboard/search-keyword/%s",
    parse: function(response) {
      this.parsePageInfo(response);
      return response.search;
    },
  }
));
