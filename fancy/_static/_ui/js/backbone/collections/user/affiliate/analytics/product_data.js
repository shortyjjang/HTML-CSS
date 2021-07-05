FancyBackbone.Collections.User = FancyBackbone.Collections.User || {};
FancyBackbone.Collections.User.Affiliate = FancyBackbone.Collections.User.Affiliate || {};
FancyBackbone.Collections.User.Affiliate.Analytics = FancyBackbone.Collections.User.Affiliate.Analytics || {};

FancyBackbone.Collections.User.Affiliate.Analytics.ProductData = Backbone.Collection.extend({
	model: FancyBackbone.Models.User.Affiliate.Analytics.ProductData,
    url: function() {
        return _.str.sprintf('/affiliate/analytics/product/%s/%s', this.range, this.page);
    },
    initialize: function(options) {
        this.username = options.username;
        this.range = options.range;
        this.page = options.page;
    },
    getData: function() {
        return _.map(_.first(this.models, 10), function(model) {
            return model.attributes;
        });
    },
});