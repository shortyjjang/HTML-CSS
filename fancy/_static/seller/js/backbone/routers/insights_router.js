FancyBackbone.Routers.InsightsRouter = Backbone.Router.extend({
  routes: {
    "merchant/insights(/)": "insightsIndex",
  },
  initialize: function() {
    this.view = window.view;
  },
  insightsIndex: function(params) {
    params = params || {};
    var dateFrom = null,
        dateTo = null,
        range = params.range || "12m",
        chartType = params.chart_type || "area",
        logType = params.log_type || "impressions",
        sellerId = params.seller_id || null;
    if (range == 'specific') {
      dateFrom = moment.utc(params.date_from, "YYYY/MM/DD");
      dateTo = moment.utc(params.date_to, "YYYY/MM/DD");
    }
    window.view.updateView(sellerId, range, dateFrom, dateTo, chartType, logType);
  },
});
