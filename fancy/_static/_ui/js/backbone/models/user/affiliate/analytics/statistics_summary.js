FancyBackbone.Models.User = FancyBackbone.Models.User || {};
FancyBackbone.Models.User.Affiliate = FancyBackbone.Models.User.Affiliate || {};
FancyBackbone.Models.User.Affiliate.Analytics = FancyBackbone.Models.User.Affiliate.Analytics || {};

FancyBackbone.Models.User.Affiliate.Analytics.StatisticsSummary = Backbone.RelationalModel.extend({
    url: function() {
        return _.str.sprintf('/affiliate/analytics/statistics_summary/%s', this.get('range'));
    },
    getConversionChartData: function() {
        var data = [];

        var clicks_data = this.get('clicks_data');
        _.each(this.get('sales_data'), function(d, idx) {
            if (clicks_data[idx] > 1)
                data.push(d / clicks_data[idx]);
            else
                data.push(0);
        });
        return data;
    },
    defaults: {
		total_products: 0,
        total_clicks: 0,
        total_sales: 0,
        total_commission: 0,
    },

});