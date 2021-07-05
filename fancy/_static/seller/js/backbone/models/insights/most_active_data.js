FancyBackbone.Models.Insights = FancyBackbone.Models.Insights || {};
FancyBackbone.Collections.Insights = FancyBackbone.Collections.Insights || {};

FancyBackbone.Models.Insights.MostActiveData = Backbone.RelationalModel.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeModelMixin,
  {
    specificRangeURLFormat: "/rest-api/v1/seller/%s/dashboard/most-active/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/seller/%s/dashboard/most-active/%s",
  }
));

FancyBackbone.Collections.Insights.MostActiveDataCollection = Backbone.Collection.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeCollectionMixin,
  FancyBackbone.Mixins.PaginatedCollectionMixin,
  {
    model: FancyBackbone.Models.Insights.MostActiveData,
    specificRangeURLFormat: "/rest-api/v1/seller/%s/dashboard/most-active/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/seller/%s/dashboard/most-active/%s",
    parse: function(response) {
      this.parsePageInfo(response);
      return response.most_active;
    },
  }
));
