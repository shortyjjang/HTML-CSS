FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Analytics = FancyBackbone.Views.User.Affiliate.Analytics || {};

FancyBackbone.Views.User.Affiliate.Analytics.StatisticsTab = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate("analytics_statistics_tab"),
    events: {
        "click li a:not(.current)": "onClickTabButton",
    },
    initialize: function() {
        this.activeTab = 'sales';
    },
    setActiveTab: function(tabName) {
        this.$el.find("a.current").removeClass("current");
        this.$el.find("a[type=" + tabName + "]").addClass("current");
        this.activeTab = tabName;
    },
    onClickTabButton: function(e){
        e.preventDefault();
        var $currentTarget = $(e.currentTarget);
        this.setActiveTab($currentTarget.attr('type'));
        this.trigger('changedTab');
    },
    render: function() {
        this.$el.html(this.template());
        return this;
    },
});