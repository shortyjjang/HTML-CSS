FancyBackbone.Collections.User = FancyBackbone.Collections.User || {};
FancyBackbone.Collections.User.Affiliate = FancyBackbone.Collections.User.Affiliate || {};
FancyBackbone.Collections.User.Affiliate.Analytics = FancyBackbone.Collections.User.Affiliate.Analytics || {};

FancyBackbone.Collections.User.Affiliate.Analytics.StatisticsGraphChart = Backbone.Collection.extend({
	model: FancyBackbone.Models.User.Affiliate.Analytics.StatisticsGraphChart,
    url: function() {
        return _.str.sprintf('/affiliate/analytics/statistics_graphchart/%s/%s', this.log_type, this.range);
    },
    initialize: function(options) {
        this.username = options.username;
        this.log_type = options.log_type;
        this.range = options.range;
    },
    getData: function() {
        return _.map(this.models, function(model) {
            return _.extend({}, model.attributes, {
                value: model.attributes.value,
                date: new Date(moment.utc(model.attributes.date).format('L'))
            });
        });
    },
});