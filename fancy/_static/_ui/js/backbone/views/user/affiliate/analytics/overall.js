FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Analytics = FancyBackbone.Views.User.Affiliate.Analytics || {};

FancyBackbone.Views.User.Affiliate.Analytics.OverAllView = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate("analytics_stat"),
    initialize: function(options) {
        this.model = new FancyBackbone.Models.User.Affiliate.Analytics.Stat({username: options['username']});
        var that = this;
        this.model.fetch().success(function() {
            that.render();
        });
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
});