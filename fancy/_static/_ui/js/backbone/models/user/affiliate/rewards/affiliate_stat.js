FancyBackbone.Models.User = FancyBackbone.Models.User || {};
FancyBackbone.Models.User.Affiliate = FancyBackbone.Models.User.Affiliate || {};
FancyBackbone.Models.User.Affiliate.Rewards = FancyBackbone.Models.User.Affiliate.Rewards || {};

FancyBackbone.Models.User.Affiliate.Rewards.AffiliateStat = Backbone.RelationalModel.extend({
    url: function() {
        return _.str.sprintf('/affiliate/rewards/affiliate_stat/%s', this.get('range'));
    },
    defaults: {
        total_affiliates: 0,
        total_commission: 0,
    },
});