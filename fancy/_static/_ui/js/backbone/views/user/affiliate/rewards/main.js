FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Rewards = FancyBackbone.Views.User.Affiliate.Rewards || {};

FancyBackbone.Views.User.Affiliate.Rewards.MainView = FancyBackbone.Views.Base.View.extend({
    initialize: function(options) {
        this._super();
        this.username = options.username;
        this.currentView = 'affiliate';

        this.tabView = new FancyBackbone.Views.User.Affiliate.Rewards.TabView();
        this.listenTo(this.tabView, 'changedTab', this.onChangeTab);

        this.affiliateView = new FancyBackbone.Views.User.Affiliate.Rewards.AffiliateView({
            username: this.username,
        });

        this.referralView = new FancyBackbone.Views.User.Affiliate.Rewards.ReferralView({
            username: this.username,
        });

        this.referralView.hide();
    },
    onChangeTab: function() {
        var selectedTab = this.$el.find('.menu .current').attr('name');
        this.setView(selectedTab);
    },
    setView: function(viewName) {
        this.subviews[this.currentView].hide();
        this.subviews[viewName].show();
        this.currentView = viewName;
    },
    render: function() {
        this._super();
        this.setSubview('tab', this.tabView.render().$el.appendTo(this.$el));
        this.setSubview('affiliate', this.affiliateView.render().$el.appendTo(this.$el));
        this.setSubview('referral', this.referralView.render().$el.appendTo(this.$el));
        this.setView(this.currentView);
        
        return this;
    },
});