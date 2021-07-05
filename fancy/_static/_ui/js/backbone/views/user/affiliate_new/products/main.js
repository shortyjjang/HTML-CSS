FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.AffiliateNew = FancyBackbone.Views.User.AffiliateNew || {};
FancyBackbone.Views.User.AffiliateNew.Products = FancyBackbone.Views.User.AffiliateNew.Products || {};

FancyBackbone.Views.User.AffiliateNew.Products.MainView = FancyBackbone.Views.Base.View.extend({
    template: FancyBackbone.Utils.loadTemplate("products_main"),
    initialize: function(options) {
        this._super();
        this.searchOptions = null;
        this.popups = options.popups;

        this.productListView = new FancyBackbone.Views.User.AffiliateNew.Products.ProductListView({
            username: this.username,
        });
        this.headerView = new FancyBackbone.Views.User.AffiliateNew.Products.HeaderView();
        
        this.listenTo(this.productListView, 'changedData', this.onChangedProductData);
        this.listenTo(this.productListView, 'clickProduct', this.onClickProduct);
        this.listenTo(this.productListView, 'changePage', this.onChangePage);
        this.listenTo(this.headerView, 'reloadList', this.onReloadProductList);
    },
    onChangePage: function(page) {
        this.$el.find('.loading').show();
        this.productListView.onChangePage(page, this.searchOptions);
    },
    onChangedProductData: function() {
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
    },
    render: function() {
        this._super();
        this.$el.html(this.template());

        this.$el.find('.title').append(this.headerView.render().$el);
        this.$el.find('#content').append(this.productListView.render().$el);
        
        return this;
    },
});