FancyBackbone.Models.User = FancyBackbone.Models.User || {};
FancyBackbone.Models.User.Affiliate = FancyBackbone.Models.User.Affiliate || {};
FancyBackbone.Models.User.Affiliate.Analytics = FancyBackbone.Models.User.Affiliate.Analytics || {};

FancyBackbone.Models.User.Affiliate.Analytics.Stat = Backbone.RelationalModel.extend({
    url: function() {
        return '/affiliate/analytics/stat';
    },
    defaults: {
        overall_sales: 0,
        clicks_today: 0,
        clicks_this_week: 0,
        earned_today: 0,
        earned_this_week: 0,
        earned_this_month: 0,
        last_click: 0,
        last_signup: 0,
    },
});