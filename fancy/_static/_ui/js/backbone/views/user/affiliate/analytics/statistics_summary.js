FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Analytics = FancyBackbone.Views.User.Affiliate.Analytics || {};

FancyBackbone.Views.User.Affiliate.Analytics.StatisticsSummary = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate("analytics_statistics_summary"),
    initialize: function(options) {
        this.username = options.username;
        this.range = options.range;
    },
    render: function(range, params) {
        this.model = new FancyBackbone.Models.User.Affiliate.Analytics.StatisticsSummary({
            username: this.username,
            range: range ? range : this.range,
        });
        this.model.fetch({
            data: params
        });

        var that = this;
        this.model.on('change', function() {
            console.log(that.model);
            console.log(that.model.attributes);
            that.$el.html(that.template(that.model.attributes));
            that.trigger('changedData');
            that.renderChart();
        });
        
        return this;
    },
    renderChart: function() {
        var chartOptions = {
            type: 'line',
            width: '65px',
            lineColor: '#5c89c2',
            highlightLineColor: '#5c89c2',
            highlightSpotColor: null,
            minSpotColor: null,
            maxSpotColor: null,
            spotColor: null,
            lineWidth: 3,
            disableInteraction: true,
            disableTooltips: true,
            disableHightlight: true,
        };
        $('.commission-chart').sparkline(this.model.get('commission_data'), chartOptions);
        $('.sales-chart').sparkline(this.model.get('sales_data'), chartOptions);
        $('.clicks-chart').sparkline(this.model.get('clicks_data'), chartOptions);
        $('.conversion-chart').sparkline(this.model.getConversionChartData(), chartOptions);
    },
    getSummaryData: function() {
        return this.model.attributes;
    },
});