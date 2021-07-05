FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Analytics = FancyBackbone.Views.User.Affiliate.Analytics || {};

FancyBackbone.Views.User.Affiliate.Analytics.ProductStat = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate("analytics_product_stat"),
    initialize: function(options) {
        this.username = options.username;
        this.range = options.range;
    },
    render: function(stats) {
        this.$el.html(this.template(stats));
        return this;
    },
});