FancyBackbone.Models.Insights = FancyBackbone.Models.Insights || {};
FancyBackbone.Collections.Insights = FancyBackbone.Collections.Insights || {};

FancyBackbone.Models.Insights.MostImpressionData = Backbone.RelationalModel.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeModelMixin,
  {
    specificRangeURLFormat: "/rest-api/v1/seller/%s/dashboard/most-impression/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/seller/%s/dashboard/most-impression/%s",
  }
));

FancyBackbone.Collections.Insights.MostImpressionDataCollection = Backbone.Collection.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeCollectionMixin,
  FancyBackbone.Mixins.PaginatedCollectionMixin,
  {
    model: FancyBackbone.Models.Insights.MostImpressionData,
    specificRangeURLFormat: "/rest-api/v1/seller/%s/dashboard/most-impression/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/seller/%s/dashboard/most-impression/%s",
    parse: function(response) {
      this.parsePageInfo(response);
      return response.most_impression;
    },
  }
));
