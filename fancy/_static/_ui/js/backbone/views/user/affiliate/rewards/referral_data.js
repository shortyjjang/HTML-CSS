FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Rewards = FancyBackbone.Views.User.Affiliate.Rewards || {};

FancyBackbone.Views.User.Affiliate.Rewards.ReferralDataView = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate("rewards_referral_data"),
    tagName: 'table',
    className: 'tb-type1',
    initialize: function(options) {
        this.page = 1;
        this.collection = new FancyBackbone.Collections.User.Affiliate.Rewards.ReferralData({
            username: options.username,
            range: options.range,
        });

        this.listenTo(this.collection, 'reset', this.onCollectionReset);
    },
    onCollectionReset: function() {
        if (this.collection.length) {
            this.renderTable();
        } else {
            this.removeTable();
        }
        this.trigger('changedData');
    },
    onChangeRange: function(range) {
        this.collection.range = range;
        this.render();
    },
    removeTable: function() {
        this.$el.html('');
    },
    renderTable: function() {
        this.$el.html(this.template({ referral_data: this.collection.getData() }));
        return this;
    },
    render: function() {
        this.collection.fetch({ reset:true });
        return this;
    },
});