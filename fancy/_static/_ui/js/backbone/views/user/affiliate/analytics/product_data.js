FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Analytics = FancyBackbone.Views.User.Affiliate.Analytics || {};

FancyBackbone.Views.User.Affiliate.Analytics.ProductData = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate("analytics_product_data"),
    events: {
        'click .pagination .prev:not(.disabled)': 'onClickPrevButton',
        'click .pagination .next:not(.disabled)': 'onClickNextButton',
        'click thead th > a': 'onClickTableHead',
        'keyup thead .search input': 'onItemSearch',
    },
    initialize: function(options) {
        this.params = {};
        this.page = 1;
        this.sort = 'clicks';
        this.sort_order = 'desc';
        this.params.sort = this.sort;
        this.params.sort_order = this.sort_order;
        this.collection = new FancyBackbone.Collections.User.Affiliate.Analytics.ProductData({
            username: options.username,
            range: options.range,
            page: this.page,
        });
        
        this.listenTo(this.collection, 'reset', this.onCollectionReset);
    },
    onCollectionReset: function() {
        if (this.collection.length) {
            this.renderTable();
            this.renderPagination();
        } else {
            this.removeTable();
        }
        this.$el.find('.loading').hide();
    },
    onClickPrevButton: function() {
        this.onChangePage(this.page-1);
    },
    onClickNextButton: function() {
        this.onChangePage(this.page+1);
    },
    onClickTableHead: function(e) {
        e.preventDefault();
        var $this = $(e.currentTarget);
        this.sort = $this.attr('name');
        this.sort_order = 'desc';
        if( $this.hasClass('current') && $this.hasClass('down') ) this.sort_order = 'asc';
        this.params.sort = this.sort;
        this.params.sort_order = this.sort_order;
        this.render();
    },
    onItemSearch: function(e) {
        if (e.keyCode == 13) {
            var searchStr = $(e.currentTarget).val();
            if (searchStr !== this.searchStr) {
                this.collection.page = this.page = 1;
                this.params.search = this.searchStr = searchStr;
                this.render();
            }
        }
    },
    renderPagination: function() {
        if (this.page == 1) {
            this.$el.find('.pagination .prev').addClass('disabled');
        } else {
            this.$el.find('.pagination .prev').removeClass('disabled');
        }

        if (this.collection.length > 10) {
            this.$el.find('.pagination .next').removeClass('disabled');
        } else {
            this.$el.find('.pagination .next').addClass('disabled');
        }
    },
    removeTable: function() {
        this.$el.find('.tb-product > tbody').html('');
    },
    renderTable: function() {
        this.$el.html(this.template({
            products: this.collection.getData(),
            initIdx: (this.page -1) * 10,
            sort: this.sort,
            sort_order: this.sort_order,
            search: this.searchStr
        }));
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
    onChangeRange: function(range, params) {
        this.params = params ? params : {};
        this.collection.range = range;
        this.collection.page = this.page = 1;
        this.render();
    },
    onChangePage: function(page) {
        this.collection.page = this.page = page;
        this.render();
    },
});