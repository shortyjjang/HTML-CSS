FancyBackbone.Views.User.AffiliateNew.Analytics.SubTitleView = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate('analytics_title_view'),
    tagName: 'h3',
    className: 'stit',
    initialize: function(options) {
        this.sub_title = options.sub_title;
    },
    render: function() {
        this.$el.html(this.template({
            'sub_title': this.sub_title,
        }));
        return this;
    }
});