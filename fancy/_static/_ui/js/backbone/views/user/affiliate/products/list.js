FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Products = FancyBackbone.Views.User.Affiliate.Products || {};

FancyBackbone.Views.User.Affiliate.Products.ProductListView = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate("products_list"),
    events: {
        'click figure > a': 'onClickProduct',
        'click figcaption > a': 'onClickProduct',
    },
    initialize: function(options) {
        this.page = 1;
        this.perPage = 50;
        this.collection = new FancyBackbone.Collections.User.Affiliate.Products.ListItems({
            username: options.username,
        });
        this.listenTo(this.collection, 'reset', this.onCollectionReset);
    },
    onClickProduct: function(e) {
        e.preventDefault();
        this.trigger('clickProduct', {
            thing_id: $(e.currentTarget).attr('id'),
            commission: $(e.currentTarget).parent().parent().find('.commission > b').text(),
        });
    },
    onCollectionReset: function() {
        this.listLength = this.collection.models.length;
        this.renderList();
        this.trigger('changedData');
    },
    onChangePage: function(page, filters) {
        this.collection.page = this.page = page;
        this.render(filters);
    },
    renderList: function() {
        this.$el.html(this.template({ products: this.collection.getData() }));
        return this;
    },
    render: function(data) {
        if (data && data.per_page) {
            this.collection.perPage = this.perPage = data.per_page;
        }

        var options = { reset: true };
        if (data) options.data = data;
        
        this.collection.page = this.page;
        this.collection.fetch(options);
        return this;
    },
});