FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.AffiliateNew = FancyBackbone.Views.User.AffiliateNew || {};
FancyBackbone.Views.User.AffiliateNew.Analytics = FancyBackbone.Views.User.AffiliateNew.Analytics || {};

FancyBackbone.Views.User.AffiliateNew.Analytics.ContentView = Backbone.View.extend({
  template: FancyBackbone.Utils.loadTemplate('analytics_content_view'),
  tagName: 'div',
  id: 'content',
  setSummary: function(summary) {
    this.summary = summary;
    this.summaryDfd = this.summary.fetch({data: $.param({admin:!!this.username, username:this.username})});
  },
  updateView: function(username, range, dateFrom, dateTo, chartType, logType) {
    if (this.range != range || (
        this.range == 'specific' && (
            this.dateFrom.diff(dateFrom) ||  this.dateTo.diff(dateTo)
        )
    )) {
      this.range = range;
      this.dateFrom = dateFrom;
      this.dateTo = dateTo;
    }
    this.username = username;
    this.chartType = chartType;
    this.logType = logType;

    this.$el.addClass("loading");
    this.setSummary(new FancyBackbone.Models.User.Affiliate.Analytics.Summary({
      username: username,
      range: range,
      date_from_str: dateFrom ? dateFrom.format("YYYY/MM/DD") : "",
      date_to_str: dateTo ? dateTo.format("YYYY/MM/DD") : "",
    }));
    
    this.renderContents();
  },
  getChartViewClass: function() {
    if (this.chartType == 'map') {
      return FancyBackbone.Views.User.AffiliateNew.Analytics.MapChartView;
    } else {
      return FancyBackbone.Views.User.AffiliateNew.Analytics.AreaChartView;
    }
  },
  onChangedChartType: function(e) {
    this.$el.addClass("loading");
    this.chartType = e.chartType;
    window.history.pushState('objects or string', 'Title', e.href);
    this.createChartView();
    this.controllerView.setChartType(this.chartType);
    this.$el.removeClass("loading");
  },
  onChangedLogType: function(e) {
    this.$el.addClass("loading");
    this.logType = e.logType;
    window.history.pushState('objects or string', 'Title', e.href);
    this.createChartView();
    this.controllerView.setLogType(this.logType);
    this.$el.removeClass("loading");
  },
  createChartView: function() {
    this.chartView = new (this.getChartViewClass())({
      range: this.range,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      chartType: this.chartType,
      logType: this.logType,
      username: this.username,
      summary: this.summary
    }).render();
    this.listenTo(this.chartView, 'changedChartType', this.onChangedChartType);
    this.listenTo(this.chartView, 'changedLogType', this.onChangedLogType);
    this.$el.find(".view-chart").html(this.chartView.$el);
  },
  renderContents: function() {
    this.$el.html(this.template());
    var dfds = [this.summaryDfd];
    var that = this;
    $.when.apply($, dfds).done(function() {
      that.controllerView = new FancyBackbone.Views.User.AffiliateNew.Analytics.ControllerView({
        model: that.summary,
        range : that.range,
        dateFrom: that.dateFrom,
        dateTo: that.dateTo,
        chartType: that.chartType,
        logType: that.logType,
        username: that.username,
      }).render();
      that.createChartView();
      
      that.productsView = new FancyBackbone.Views.User.AffiliateNew.Analytics.ProductsView({
        range : that.range,
        dateFrom : that.dateFrom,
        dateTo : that.dateTo,
        username : that.username
      });
      
      that.$el.closest(".dashboard_insights").find("> .controller").html(that.controllerView.$el);
      that.$el.find(".wrapper.products").append(that.productsView.render().$el);
      that.$el.removeClass("loading");
    });
  },
  render: function() {
    this.$el.html(this.template());
    return this;
  },
});
