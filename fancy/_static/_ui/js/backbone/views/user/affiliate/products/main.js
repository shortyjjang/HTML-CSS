FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Products = FancyBackbone.Views.User.Affiliate.Products || {};

FancyBackbone.Views.User.Affiliate.Products.MainView = FancyBackbone.Views.Base.View.extend({
    template: FancyBackbone.Utils.loadTemplate("products_main"),
    events: {
        'click .pagination .prev:not(.disabled)': 'onClickPrevButton',
        'click .pagination .next:not(.disabled)': 'onClickNextButton',
    },
    initialize: function(options) {
        this._super();
        this.username = options.username;
        this.searchOptions = null;
        this.popups = options.popups;

        this.productListView = new FancyBackbone.Views.User.Affiliate.Products.ProductListView({
            username: this.username,
        });
        this.searchView = new FancyBackbone.Views.User.Affiliate.Products.SearchView();
        
        this.model = new FancyBackbone.Models.User.Affiliate.Products.Stat({
            username: this.username,
        });

        var that = this;
        this.model.fetch().always(function(){
            that.renderStat();
        });

        this.listenTo(this.productListView, 'changedData', this.onChangedProductData);
        this.listenTo(this.productListView, 'clickProduct', this.onClickProduct);
        this.listenTo(this.searchView, 'reloadList', this.onReloadProductList);
    },
    onClickPrevButton: function() {
        this.onChangePage(this.productListView.page-1);
    },
    onClickNextButton: function() {
        this.onChangePage(this.productListView.page+1);
    },
    onChangePage: function(page) {
        this.$el.find('.loading').show();
        this.productListView.onChangePage(page, this.searchOptions);
    },
    renderPagination: function() {
        if (this.productListView.page == 1) {
            this.$el.find('.pagination .prev').addClass('disabled');
        } else {
            this.$el.find('.pagination .prev').removeClass('disabled');
        }

        if (this.totalProducts > this.productListView.perPage || this.productListView.listLength > this.productListView.perPage) {
            this.$el.find('.pagination .next').removeClass('disabled');
        } else {
            this.$el.find('.pagination .next').addClass('disabled');
        }
    },
    renderStat: function() {
        this.totalProducts = this.model.attributes.total;
        this.searchView.renderTotalProducts(this.totalProducts);
        this.renderPagination();
        this.$el.find('.loading').hide();
    },
    onChangedProductData: function() {
        this.renderPagination();
        this.$el.find('.loading').hide();
    },
    onClickProduct: function(e) {
        this.popups.info_popup.openPopup(e);
    },
    onReloadProductList: function(e) {
        this.$el.find('.loading').show();
        this.productListView.page = 1;
        this.searchOptions = e;
        this.productListView.render(e);
        var that = this;
        this.model.fetch({ data: e }).always(function(){
            that.renderStat();
        });
    },
    render: function() {
        this._super();
        this.$el.html(this.template());

        this.$el.find('.inner .pagination').before(this.searchView.render().$el);
        this.$el.find('.inner .pagination').before(this.productListView.render().$el);
        
        return this;
    },
});