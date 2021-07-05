FancyBackbone.Routers.AnalyticsRouter = Backbone.Router.extend({
  routes: {
    "affiliate/analytics(/)": "analyticsIndex",
  },
  initialize: function() {
    this.view = window.analyticsView;
  },
  analyticsIndex: function(params) {
    params = params || {};
    var dateFrom = null,
        dateTo = null,
        range = params.range || "7d",
        chartType = params.chart_type || "area",
        logType = params.log_type || "commission",
        username = params.username || null;
    if (range == 'specific') {
      dateFrom = moment.utc(params.date_from, "YYYY/MM/DD");
      dateTo = moment.utc(params.date_to, "YYYY/MM/DD");
    }
    window.analyticsView.updateView(username, range, dateFrom, dateTo, chartType, logType);
  },
});
