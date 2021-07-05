FancyBackbone.Models.Insights = FancyBackbone.Models.Insights || {};
FancyBackbone.Collections.Insights = FancyBackbone.Collections.Insights || {};

FancyBackbone.Models.Insights.ReferralData = Backbone.RelationalModel.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeModelMixin,
  {
    specificRangeURLFormat: "/rest-api/v1/seller/%s/dashboard/referrals/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/seller/%s/dashboard/referrals/%s",
  }
));

FancyBackbone.Collections.Insights.ReferralDataCollection = Backbone.Collection.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeCollectionMixin,
  FancyBackbone.Mixins.PaginatedCollectionMixin,
  {
    model: FancyBackbone.Models.Insights.ReferralData,
    specificRangeURLFormat: "/rest-api/v1/seller/%s/dashboard/referrals/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/seller/%s/dashboard/referrals/%s",
    parse: function(response) {
      this.parsePageInfo(response);
      return response.traffic_sources;
    },
  }
));
