FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.AffiliateNew = FancyBackbone.Views.User.AffiliateNew || {};
FancyBackbone.Views.User.AffiliateNew.Products = FancyBackbone.Views.User.AffiliateNew.Products || {};

FancyBackbone.Views.User.AffiliateNew.Products.ProductListView = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate("products_list"),
    events: {
        'click figure > a': 'onClickProduct',
        'click figcaption > a': 'onClickProduct',
        'click .pagination4 .prev:not(.disabled)': 'onClickPrevButton',
        'click .pagination4 .next:not(.disabled)': 'onClickNextButton',
        'click .pagination4 .page:not(.current)': 'onClickPageButton',
    },
    initialize: function(options) {
        this.page = 1;
        this.perPage = 50;
        this.collection = new FancyBackbone.Collections.User.Affiliate.Products.ProductCollection({
            username: options.username,
        });
        this.listenTo(this.collection, 'reset', this.onCollectionReset);
    },
    onClickProduct: function(e) {
        e.preventDefault();
        this.trigger('clickProduct', {
            thing_id: $(e.currentTarget).attr('id'),
            thing_url: $(e.currentTarget).attr('href'),
            commission: $(e.currentTarget).closest('li').attr('commission'),
        });
    },
    onClickPrevButton: function(e) {
        e.preventDefault();
        this.trigger('changePage', this.page-1);
    },
    onClickNextButton: function(e) {
        e.preventDefault();
        this.trigger('changePage', this.page+1);
    },
    onClickPageButton: function(e) {
        e.preventDefault();
        var page = parseInt($(e.target).attr('page'))||1;
        this.trigger('changePage', page);
    },
    onCollectionReset: function() {
        this.listLength = this.collection.models.length;
        this.renderList();
        this.trigger('changedData');
    },
    onChangePage: function(page, filters) {
        if(!filters) filters = {};
        filters.page = this.page = page;
        this.render(filters);
    },
    renderList: function() {
        this.$el.html(this.template({ 
            products: this.collection.models,
            maxPage: this.collection.maxPage,
            currentPage: this.collection.currentPage,
            totalCount: this.collection.totalCount,
        }));
        return this;
    },
    render: function(data) {
        
        var options = { reset: true };
        if (data) options.data = data;
        
        this.collection.fetch(options);
        return this;
    },
});