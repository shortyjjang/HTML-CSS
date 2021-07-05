FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Analytics = FancyBackbone.Views.User.Affiliate.Analytics || {};

FancyBackbone.Views.User.Affiliate.Analytics.StatisticsMapChart = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate("analytics_statistics_mapchart"),
    initialize: function(options) {
        this.collection = new FancyBackbone.Collections.User.Affiliate.Analytics.StatisticsMapChart({
            username: options.username,
            range: options.range,
            log_type: options.log_type,
        });
    },
    render: function(params) {
        this.$el.html(this.template());

        var that = this;
        var _renderChart = function() {
            var data = that.collection.getData();

            data.unshift(['City', 'Count']);
            that.chart = new google.visualization.GeoChart($(".map-chart").get(0));
            that.chart.draw(google.visualization.arrayToDataTable(data), {
                displayMode: 'markers',
                colorAxis: {colors: ['#5C89C2', '#5C89C2']},
                legend: 'none',
                width: 462,
                height: 236,
            });
            that.trigger('doneDrawingChart');
        };
        this.collection.fetch({
            data: params
        }).success(function(){
            google.load('visualization', '1', {'callback': _renderChart, 'packages': ['geochart']});
        });
        return this;
    },
    removeChart: function() {
        this.chart = null;
        this.$el.find('.map-chart').html('');
    },
    onChangeType: function(log_type, params) {
        this.collection.log_type = log_type;
        this.removeChart();
        this.render(params);
    },
    onChangeRange: function(range, params) {
        this.collection.range = range;
        this.removeChart();
        this.render(params);
    },
});