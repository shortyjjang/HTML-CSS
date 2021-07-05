FancyBackbone.Views.EuropisteInsights = FancyBackbone.Views.EuropisteInsights || {};
FancyBackbone.Views.EuropisteInsights.ContentView = Backbone.View.extend({
  template: FancyBackbone.Utils.loadTemplate('europiste_insights_content_view'),
  tagName: 'div',
  id: 'content',
  setSummary: function(summary) {
    this.summary = summary;
    this.summaryDfd = this.summary.fetch();
  },
  setBestSellers: function(bestSellers) {
    this.bestSellers = bestSellers;
    this.bestSellersDfd = this.bestSellers.fetch();
  },
  // setAcquisitionData: function(acquisitionData) {
  //   this.acquisitionData = acquisitionData;
  //   this.acquisitionDataDfd = this.acquisitionData.fetch();
  // },
  updateView: function(sellerId, range, dateFrom, dateTo, chartType, logType) {
    if (this.range != range || (
        this.range == 'specific' && (
            this.dateFrom.diff(dateFrom) ||  this.dateTo.diff(dateTo)
        )
    )) {
      this.range = range;
      this.dateFrom = dateFrom;
      this.dateTo = dateTo;
    }
    this.sellerId = sellerId;
    this.chartType = chartType;
    this.logType = logType;

    this.$el.addClass("loading");
    this.setSummary(new FancyBackbone.Models.Insights.Summary({
      user: window.seller,
      range: range,
      date_from_str: dateFrom ? dateFrom.format("YYYY/MM/DD") : "",
      date_to_str: dateTo ? dateTo.format("YYYY/MM/DD") : "",
    }));
    
    this.renderContents();
  },
  getChartViewClass: function() {
    if (this.chartType == 'map') {
      return FancyBackbone.Views.EuropisteInsights.MapChartView;
    } else {
      return FancyBackbone.Views.EuropisteInsights.AreaChartView;
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
      sellerId: this.sellerId,
      summary: this.summary
    }).render();
    this.listenTo(this.chartView, 'changedChartType', this.onChangedChartType);
    this.listenTo(this.chartView, 'changedLogType', this.onChangedLogType);
    this.$el.find(".view-chart").html(this.chartView.$el);
  },
  renderContents: function() {
    this.$el.html(this.template());
    var dfds = [this.summaryDfd, this.bestSellersDfd];
    var that = this;
    $.when.apply($, dfds).done(function() {
      that.controllerView = new FancyBackbone.Views.EuropisteInsights.ControllerView({
        model: that.summary,
        dateFrom: that.dateFrom,
        dateTo: that.dateTo,
        chartType: that.chartType,
        logType: that.logType,
        sellerId: that.sellerId,
      }).render();
      that.createChartView();

      that.trafficFancyView = new FancyBackbone.Views.EuropisteInsights.TrafficFancyView({
        range : that.range,
        dateFrom : that.dateFrom,
        dateTo : that.dateTo,
        sellerId : that.sellerId
      });

      that.mostSearchedView = new FancyBackbone.Views.EuropisteInsights.MostSearchedView({
        range : that.range,
        dateFrom : that.dateFrom,
        dateTo : that.dateTo,
        sellerId : that.sellerId
      });

      that.mostImpressionView = new FancyBackbone.Views.EuropisteInsights.MostImpressionView({
        range : that.range,
        dateFrom : that.dateFrom,
        dateTo : that.dateTo,
        sellerId : that.sellerId
      });

      that.mostActiveView = new FancyBackbone.Views.EuropisteInsights.MostActiveView({
        range : that.range,
        dateFrom : that.dateFrom,
        dateTo : that.dateTo,
        sellerId : that.sellerId
      });

      
      that.$el.closest(".dashboard_insights").find("> .controller").html(that.controllerView.$el);
      that.$el.find(".wrapper.traffic-fancy").append(that.trafficFancyView.render().$el);
      that.$el.find(".wrapper.searched").append(that.mostSearchedView.render().$el);
      that.$el.find(".wrapper.impression").append(that.mostImpressionView.render().$el);
      that.$el.find(".wrapper.active").append(that.mostActiveView.render().$el);
      that.$el.removeClass("loading");
    });
  },
  render: function() {
    this.$el.html(this.template());
    return this;
  },
});
