FancyBackbone.Models.Insights = FancyBackbone.Models.Insights || {};
FancyBackbone.Collections.Insights = FancyBackbone.Collections.Insights || {};

FancyBackbone.Models.Insights.InternalReferralData = Backbone.RelationalModel.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeModelMixin,
  {
    specificRangeURLFormat: "/rest-api/v1/seller/%s/dashboard/internalreferrals/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/seller/%s/dashboard/internalreferrals/%s",
  }
));

FancyBackbone.Collections.Insights.InternalReferralDataCollection = Backbone.Collection.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeCollectionMixin,
  FancyBackbone.Mixins.PaginatedCollectionMixin,
  {
    model: FancyBackbone.Models.Insights.InternalReferralData,
    specificRangeURLFormat: "/rest-api/v1/seller/%s/dashboard/internalreferrals/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/seller/%s/dashboard/internalreferrals/%s",
    parse: function(response) {
      this.parsePageInfo(response);
      return response.traffic_sources;
    },
  }
));
