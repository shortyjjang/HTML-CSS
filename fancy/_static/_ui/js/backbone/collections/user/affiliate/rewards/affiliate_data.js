FancyBackbone.Collections.User = FancyBackbone.Collections.User || {};
FancyBackbone.Collections.User.Affiliate = FancyBackbone.Collections.User.Affiliate || {};
FancyBackbone.Collections.User.Affiliate.Rewards = FancyBackbone.Collections.User.Affiliate.Rewards || {};

FancyBackbone.Collections.User.Affiliate.Rewards.AffiliateData = Backbone.Collection.extend({
	model: FancyBackbone.Models.User.Affiliate.Rewards.AffiliateData,
    url: function() {
        return _.str.sprintf('/affiliate/rewards/affiliate_data/%s/%s', this.range, this.page);
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