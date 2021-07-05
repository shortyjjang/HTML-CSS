FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.AffiliateNew = FancyBackbone.Views.User.AffiliateNew || {};
FancyBackbone.Views.User.AffiliateNew.Analytics = FancyBackbone.Views.User.AffiliateNew.Analytics || {};

FancyBackbone.Views.User.AffiliateNew.Analytics.OverAllView = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate("analytics_overall"),
    initialize: function(options) {
        this.model = new FancyBackbone.Models.User.Affiliate.Analytics.Stat({username: options['username']});
        var that = this;
        this.model.fetch().success(function() {
            that.render();
        });
    },
    render: function() {
        var values = this.model.attributes;

        if(typeof this.model.attributes.overall_sales=='undefined'){
            values = {
                        overall_sales: 0,
                        clicks_today: 0,
                        clicks_this_week: 0,
                        earned_today: 0,
                        earned_this_week: 0,
                        earned_this_month: 0,
                        last_click: 0,
                        last_signup: 0,
                    };
        }
        this.$el.html(this.template(values));
        return this;
    },
});