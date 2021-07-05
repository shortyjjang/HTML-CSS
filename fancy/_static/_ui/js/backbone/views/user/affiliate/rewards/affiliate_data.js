FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Rewards = FancyBackbone.Views.User.Affiliate.Rewards || {};

FancyBackbone.Views.User.Affiliate.Rewards.AffiliateDataView = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate("rewards_affiliate_data"),
    tagName: 'table',
    className: 'tb-type1',
    events: {
        'click thead th > a:not(.current)': 'onClickTableHead',
    },
    initialize: function(options) {
        this.page = 1;
        this.collection = new FancyBackbone.Collections.User.Affiliate.Rewards.AffiliateData({
            username: options.username,
            range: options.range,
            page: this.page,
        });

        this.listenTo(this.collection, 'reset', this.onCollectionReset);
    },
    onClickTableHead: function(e) {
        e.preventDefault();
        this.sort = $(e.currentTarget).attr('name');
        this.collection.fetch({
            reset: true,
            data: {
                sort: this.sort,
            }
        });
    },
    onCollectionReset: function() {
        if (this.collection.length) {
            this.renderTable();
        } else {
            this.removeTable();
        }
        this.trigger('changedData');
    },
    onChangePage: function(page) {
        this.collection.page = this.page = page;
        this.render();
    },
    onChangeRange: function(range) {
        this.collection.range = range;
        this.render();
    },
    removeTable: function() {
        this.$el.html('');
    },
    renderTable: function() {
        this.$el.html(this.template({
            rewards: this.collection.getData(),
            sort: this.sort
        }));
        return this;
    },
    render: function() {
        this.collection.fetch({ reset:true });
        return this;
    },
});