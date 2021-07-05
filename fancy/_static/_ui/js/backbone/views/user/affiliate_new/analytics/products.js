FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.AffiliateNew = FancyBackbone.Views.User.AffiliateNew || {};
FancyBackbone.Views.User.AffiliateNew.Analytics = FancyBackbone.Views.User.AffiliateNew.Analytics || {};

FancyBackbone.Views.User.AffiliateNew.Analytics.ProductsView = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate("analytics_products"),
    events: {
        'click .pagination .prev:not(.disabled)': 'onClickPrevButton',
        'click .pagination .next:not(.disabled)': 'onClickNextButton',
        'click .pagination .page:not(.current)': 'onClickPageButton',
        'click thead th > a': 'onClickTableHead',
        'keyup .search input': 'onItemSearch',
    },
    initialize: function(options) {
        this.params = {};
        this.params.page = 1;
        this.params.sort = 'clicks';
        this.params.sort_order = 'desc';
        if(options.username){
            this.params.username = options.username;
            this.params.admin = 'true';
        }
        this.collection = new FancyBackbone.Collections.User.Affiliate.Analytics.Product({});

        this.collection.range = options.range,
        this.collection.dateFrom = options.dateFrom ? options.dateFrom.format("YYYY/MM/DD") : "";
        this.collection.dateTo = options.dateTo ? options.dateTo.format("YYYY/MM/DD") : "";
        
        this.listenTo(this.collection, 'reset', this.onCollectionReset);
    },
    onCollectionReset: function() {
        this.renderTable();
        this.$el.find('.loading').hide();
    },
    onClickPrevButton: function(e) {
        e.preventDefault();
        this.onChangePage(this.params.page-1);
    },
    onClickNextButton: function(e) {
        e.preventDefault();
        this.onChangePage(this.params.page+1);
    },
    onClickPageButton: function(e) {
        e.preventDefault();
        var page = parseInt($(e.target).attr('page'))||1;
        this.onChangePage(page);
    },
    onClickTableHead: function(e) {
        e.preventDefault();
        var $this = $(e.currentTarget);
        this.params.sort = $this.attr('name');
        this.params.sort_order = 'desc';
        if( $this.hasClass('current') && $this.hasClass('down') ) this.params.sort_order = 'asc';
        this.render();
    },
    onItemSearch: function(e) {
        if (e.keyCode == 13) {
            var searchStr = $(e.currentTarget).val();
            if (searchStr !== this.searchStr) {
                this.params.page = 1;
                this.params.search = searchStr;
                this.render();
            }
        }
    },
    onChangeRange: function(range, params) {
        this.params = params ? params : {};
        this.collection.range = range;
        this.collection.page = this.page = 1;
        this.render();
    },
    onChangePage: function(page) {
        this.params.page = page;
        this.render();
    },
    renderTable: function() {
        this.$el.html(this.template({
            products: this.collection.models,
            initIdx: (this.params.page -1) * 10,
            sort: this.params.sort,
            sort_order: this.params.sort_order,
            search: this.params.search,
            maxPage: this.collection.maxPage,
            currentPage: this.collection.currentPage,
            totalCount: this.collection.totalCount,
        }));
        if(this.collection.totalCount>0) this.$el.closest('.wrapper').show();
        return this;
    },
    render: function() {
        this.$el.find('.loading').show();
        this.collection.fetch({
            reset: true,
            data: this.params,
        });
        return this;
    },
});