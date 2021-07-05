FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Rewards = FancyBackbone.Views.User.Affiliate.Rewards || {};

FancyBackbone.Views.User.Affiliate.Rewards.TabView = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate("rewards_tab"),
    tagName: 'ul',
    className: 'menu',
    events: {
        'click li a:not(.current)': 'onClickTabButton',
    },
    initialize: function() {
        this.activeTab = 'affiliate';
    },
    render: function() {
        this.$el.html(this.template());
        return this;
    },
    setActiveTab: function(tabName) {
        this.$el.find("a.current").removeClass("current");
        this.$el.find("a[name=" + tabName + "]").addClass("current");
        this.activeTab = tabName;
    },
    onClickTabButton: function(e){
        e.preventDefault();
        var $currentTarget = $(e.currentTarget);
        this.setActiveTab($currentTarget.attr('name'));
        this.trigger('changedTab');
    },
});