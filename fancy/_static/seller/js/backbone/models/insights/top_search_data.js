FancyBackbone.Models.Insights = FancyBackbone.Models.Insights || {};
FancyBackbone.Collections.Insights = FancyBackbone.Collections.Insights || {};

FancyBackbone.Models.Insights.TopSearchData = Backbone.RelationalModel.extend({
});

FancyBackbone.Collections.Insights.TopSearchData = Backbone.Collection.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeCollectionMixin,
  {
    model: FancyBackbone.Models.Insights.TopSearchData,
    specificRangeURLFormat: "/rest-api/v1/seller/%s/dashboard/search-history/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/seller/%s/dashboard/search-history/%s",
    initialize: function(options) {
      this.user = options.user;
      this.range = options.range;
      this.dateFrom = options.dateFrom;
      this.dateTo = options.dateTo;
    },
    getRange: function() {
      return this.range;
    },
    urlParams: function() {
      var range = this.range;
      var ret = [
        this.user.id,
        range
      ];
      if (range == 'specific') {
        var dateRange = this.getDateRange();
        ret.push(dateRange[0].format("YYYYMMDD"));
        ret.push(dateRange[1].format("YYYYMMDD"));
      }
      return ret;
    },
	}
));
