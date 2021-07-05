FancyBackbone.Collections.User = FancyBackbone.Collections.User || {};
FancyBackbone.Collections.User.Affiliate = FancyBackbone.Collections.User.Affiliate || {};
FancyBackbone.Collections.User.Affiliate.Rewards = FancyBackbone.Collections.User.Affiliate.Rewards || {};

FancyBackbone.Collections.User.Affiliate.Rewards.ReferralData = Backbone.Collection.extend({
	model: FancyBackbone.Models.User.Affiliate.Rewards.ReferralData,
    url: function() {
        return _.str.sprintf('/affiliate/rewards/referral_data/%s', this.range);
    },
    initialize: function(options) {
        this.username = options.username;
        this.range = options.range;
    },
    getData: function() {
        return _.map(this.models, function(model) {
            return model.attributes;
        });
    },
});