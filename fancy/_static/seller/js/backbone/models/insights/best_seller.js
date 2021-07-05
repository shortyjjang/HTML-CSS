FancyBackbone.Models.Insights = FancyBackbone.Models.Insights || {};
FancyBackbone.Collections.Insights = FancyBackbone.Collections.Insights || {};


FancyBackbone.Models.Insights.BestSeller = Backbone.RelationalModel.extend({
});

FancyBackbone.Collections.Insights.BestSellerCollection = Backbone.Collection.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeCollectionMixin,
  FancyBackbone.Mixins.PaginatedCollectionMixin,
  {
    model: FancyBackbone.Models.Insights.BestSeller,
    specificRangeURLFormat: "/rest-api/v1/seller/%s/dashboard/best-sellers/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/seller/%s/dashboard/best-sellers/%s",
    // initialize: function(options) {
    //   this.range = options.range;
    //   this.dateFrom = options.dateFrom;
    //   this.dateTo = options.dateTo;
    //   this.sellerId = options.sellerId;
    // },
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
    parse: function(response) {
      this.parsePageInfo(response);
      this.range = response.range;
      this.dateFrom = moment.utc(response.date_from);
      this.dateTo = moment.utc(response.date_to);
      return response.best_sellers;
    },
  }
));
