FancyBackbone.Models.Insights = FancyBackbone.Models.Insights || {};
FancyBackbone.Collections.Insights = FancyBackbone.Collections.Insights || {};

FancyBackbone.Models.Insights.ConversionData = Backbone.RelationalModel.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeModelMixin,
  {
    specificRangeURLFormat: "/rest-api/v1/seller/%s/dashboard/conversions/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/seller/%s/dashboard/conversions/%s",
  }
));