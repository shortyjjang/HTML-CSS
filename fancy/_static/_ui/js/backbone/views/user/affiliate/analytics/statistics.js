FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Analytics = FancyBackbone.Views.User.Affiliate.Analytics || {};

FancyBackbone.Views.User.Affiliate.Analytics.StatisticsView = FancyBackbone.Views.Base.View.extend({
    template: FancyBackbone.Utils.loadTemplate("analytics_statistics"),
    events: {
        'click .stit .download': 'onClickDownload',
    },
    initialize: function(options) {
        this._super();
        this.username = options.username;
        this.range = options.range;
        this.page = options.page;
        this.log_type = 'sales';

        this.summaryView = new FancyBackbone.Views.User.Affiliate.Analytics.StatisticsSummary({
            username: this.username,
            range: this.range,
        });
        this.mapView = new FancyBackbone.Views.User.Affiliate.Analytics.StatisticsMapChart({
            username: this.username,
            range: this.range,
            log_type: this.log_type,
        });
        this.graphView = new FancyBackbone.Views.User.Affiliate.Analytics.StatisticsGraphChart({
            username: this.username,
            range: this.range,
            log_type: this.log_type
        });
        this.tabView = new FancyBackbone.Views.User.Affiliate.Analytics.StatisticsTab();
        this.listenTo(this.summaryView, 'changedData', this.onChangeSummaryData);
        this.listenTo(this.tabView, 'changedTab', this.onChangeTab);
        this.listenTo(this.mapView, 'doneDrawingChart', this.onDoneDrawingChart);
    },
    getParams: function() {
        if (this.params && this.params.dateFrom && this.params.dateTo) {
            return '?dateFrom=' + this.params.dateFrom + '&dateTo=' + this.params.dateTo;
        } else {
            return '';
        }
    },
    onClickDownload: function(e) {
        e.preventDefault();
        window.location.href = "analytics/download/" + this.range + this.getParams();
    },
    onChangeSummaryData: function() {
        var stats = this.summaryView.getSummaryData();
        this.trigger('changedStat', {
            stats: stats
        });
        this.graphView.renderTotal(stats);
    },
    onChangeTab: function() {
        this.$el.find('.loading').show();
        this.graphView.onChangeType(this.$('.inner .viewer .current').attr('type'), this.params);
        this.mapView.onChangeType(this.$('.inner .viewer .current').attr('type'), this.params);
    },
    onDoneDrawingChart: function() {
        this.$el.find('.loading').hide();
    },
    onChangeRange: function(range, params) {
        this.range = range;
        this.params = params ? params : null;
        this.summaryView.render(range, params);
        this.mapView.onChangeRange(range, params);
        this.graphView.onChangeRange(range, params);
    },
    render: function() {
        this.$el.find('.loading').show();
        this._super();
        this.$el.html(this.template());
        this.$el.find(".inner .viewer").html(this.tabView.render().$el);
        this.$el.find(".inner .summary").html(this.summaryView.render().$el);
        this.$el.find(".inner .map").html(this.mapView.render().$el);
        this.$el.find(".inner .graph").html(this.graphView.render(this.summaryView.getSummaryData()).$el);
        // this.setSubview('tab', this.tabView.render().$el.appendTo(this.$('.inner .viewer')));
        // this.setSubview('stat', this.summaryView.render().$el.appendTo(this.$('.inner .summary')));
        // this.setSubview('map', this.mapView.render().$el.appendTo(this.$('.inner .map')));
        // this.setSubview('graph', this.graphView.render(this.summaryView.getSummaryData()).$el.appendTo(this.$('.inner .graph')));
        return this;
    },
});