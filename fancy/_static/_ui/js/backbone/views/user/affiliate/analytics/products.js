FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Analytics = FancyBackbone.Views.User.Affiliate.Analytics || {};

FancyBackbone.Views.User.Affiliate.Analytics.ProductsView = FancyBackbone.Views.Base.View.extend({
    template: FancyBackbone.Utils.loadTemplate("analytics_products"),
    initialize: function(options) {
        this._super();
        this.username = options.username;
        this.range = options.range;

        this.statView = new FancyBackbone.Views.User.Affiliate.Analytics.ProductStat({
            username: this.username,
            range: this.range
        });
        this.tableView = new FancyBackbone.Views.User.Affiliate.Analytics.ProductData({
            username: this.username,
            range: this.range,
        });
    },
    render: function() {
        this._super();
        this.$el.html(this.template());
        this.setSubview('table', this.tableView.render().$el.appendTo(this.$('.inner')));
        return this;
    },
    onChangeRange: function(range, params) {
        this.range = range;
        this.tableView.onChangeRange(range, params);
    },
    changeStat: function(stats) {
        this.$el.find('.status').html(this.statView.render(stats).$el);
    },
});