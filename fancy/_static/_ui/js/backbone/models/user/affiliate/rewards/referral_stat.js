FancyBackbone.Models.User = FancyBackbone.Models.User || {};
FancyBackbone.Models.User.Affiliate = FancyBackbone.Models.User.Affiliate || {};
FancyBackbone.Models.User.Affiliate.Rewards = FancyBackbone.Models.User.Affiliate.Rewards || {};

FancyBackbone.Models.User.Affiliate.Rewards.ReferralStat = Backbone.RelationalModel.extend({
    url: function() {
        return _.str.sprintf('/affiliate/rewards/referral_stat/%s', this.get('range'));
    },
    defaults: {
        total_people: 0,
        total_commission: 0,
    },
});