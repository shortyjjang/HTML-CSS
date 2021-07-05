FancyBackbone.Collections.User = FancyBackbone.Collections.User || {};
FancyBackbone.Collections.User.Affiliate = FancyBackbone.Collections.User.Affiliate || {};
FancyBackbone.Collections.User.Affiliate.Analytics = FancyBackbone.Collections.User.Affiliate.Analytics || {};

FancyBackbone.Collections.User.Affiliate.Analytics.StatisticsMapChart = Backbone.Collection.extend({
	model: FancyBackbone.Models.User.Affiliate.Analytics.StatisticsMapChart,
    url: function() {
        return _.str.sprintf('/affiliate/analytics/statistics_mapchart/%s/%s', this.log_type, this.range);
    },
    initialize: function(options) {
        this.username = options.username;
        this.log_type = options.log_type;
        this.range = options.range;
    },
    getData: function() {
        return _.map(this.models, function(model) {
            return [
                model.attributes.location.split(',')[0],
                model.attributes.value,
            ];
        });
    },
});