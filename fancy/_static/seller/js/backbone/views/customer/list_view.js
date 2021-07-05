FancyBackbone.Views.Customer = FancyBackbone.Views.Customer || {};

FancyBackbone.Views.Customer.ListView = Backbone.View.extend({
    tagName: 'div',
    className: 'wrapper new-listing',
    template: FancyBackbone.Utils.loadTemplate('customer_list'),
    listItemTemplate: FancyBackbone.Utils.loadTemplate('customer_list_item'),
    emptyTemplate: FancyBackbone.Utils.loadTemplate('customer_empty_list'),
    events: {
        'click .pagination4 > .page:not(.current)': 'onChangePage',
        'click .pagination4 > .prev:not(.disabled)': 'onChangePageToPrev',
        'click .pagination4 > .next:not(.disabled)': 'onChangePageToNext',
        'click .btn-export': 'onClickExportButton',
        'click th > a': 'onChangeSortOption',
        'click .dropdown li > a': 'onChangeSearchKey',
        'keypress .search > input': 'onSearchString',
        'mouseenter .customer-name': 'onShowTooltip',
        'mouseleave .customer-name': 'onHideTooltip',
        'mouseenter .userinfo-tooltip': 'onMouseenterTooltip',
        'mouseleave .userinfo-tooltip': 'onMouseleaveTooltip',
    },
    onChangePage: function(e) {
        e.preventDefault();
        this.page = $(e.currentTarget).text();
        this._render();
    },
    onChangePageToPrev: function(e) {
        e.preventDefault();
        this.page--;
        this._render();
    },
    onChangePageToNext: function(e) {
        e.preventDefault();
        this.page++;
        this._render();
    },
    onClickExportButton: function(e) {
        e.preventDefault();
        window.open('/merchant/orders/customer.csv' + '?' + $.param(location.args));
    },
    onChangeSortOption: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        
        if ($target.hasClass('down')) {
            this.sort_ascending = 'false';
        } else {
            this.sort_ascending = 'true';
        }

        // ORDER_CUSTOMER_SORT_OPTION_LAST_ORDER_TIME = 0
        // ORDER_CUSTOMER_SORT_OPTION_CUSTOMER_NAME = 1
        // ORDER_CUSTOMER_SORT_OPTION_ORDER_CNT = 2
        // ORDER_CUSTOMER_SORT_OPTION_TOTAL_SPENT = 3
        this.sort_option = $target.attr('sort_option');
        window.history.pushState('objects or string', 'Title', location.pathname + '?' + this.getQueryString());
        this._render();
    },
    onChangeSearchKey: function(e) {
        e.preventDefault();
        var currentTarget = $(e.currentTarget);
        this.search_key = currentTarget.attr('key');
        this.$el.find('.search .text').attr('placeholder', 'Search ' + currentTarget.attr('name'));
        this.$el.find('.dropdown').removeClass('opened');
    },
    onSearchString: function(e) {
        if (event.keyCode != 13 ) return;
        e.preventDefault();

        var search_str = $(e.currentTarget).val();
        if (search_str === '') {
            alert("Enter the search string. ");
            return;
        }

        this.search_str = search_str;
        this._render();
    },
    onShowTooltip: function(e) {
        this.$el.find('.userinfo-tooltip').removeClass('show');
        var $target = $(e.currentTarget);
        $target.find('.userinfo-tooltip').addClass('show');
    },
    onHideTooltip: function(e) {
        var $target = $(e.currentTarget);
        setTimeout(function() {
            $tooltip = $target.find('.userinfo-tooltip');
            if (!$tooltip.hasClass('hover')) {
                $tooltip.removeClass('show');
            }}, 200
        );
    },
    onMouseenterTooltip: function(e) {
        var $target = $(e.currentTarget);
        $target.addClass('show');
        $target.addClass('hover');
    },
    onMouseleaveTooltip: function(e) {
        var $target = $(e.currentTarget);
        $target.removeClass('hover');
        $target.removeClass('show');
    },
    getQueryString: function() {
        var params = {
            page: this.page,
            per_page: this.per_page,
        };
        if (this.sellerId) {
            params.seller_id = this.sellerId;
        }
        if (this.sort_option) {
            params.sort_option = this.sort_option;
            params.sort_ascending = this.sort_ascending;
        }
        if (this.search_str) {
            params[this.search_key] = this.search_str;
        }
        return $.param(params);
    },
    initialize: function(options) {
        this.sellerId = window.seller.id;
        this.search_key = 'customer_name';
        this.search_str = null;
    },
    renderInfo: function() {
        if (this.model.attributes.customers.length === 0) {
            this.$el.attr('class', 'wrapper empty-result');
            this.$el.html(this.emptyTemplate());
        } else {
            this.$el.html(this.template(this.model.attributes));
            this._appendContents();
        }
        return this;
    },
    render: function() {
        this.$el.html();
        return this;
    },
    _render: function() {
        this.model = new FancyBackbone.Models.Customer.List({
            seller: this.sellerId,
            page: this.page,
            per_page: this.per_page,
            sort_option: this.sort_option,
            sort_ascending: this.sort_ascending,
            search_key: this.search_key,
            search_str: this.search_str,
        });
        var that = this;
        this.model.fetch().success(function() {
            that.renderInfo();
        });
    },
    updateView: function(sellerId, page, per_page, sort_option, sort_ascending) {
        this.sellerId = sellerId ? sellerId : window.seller.id;
        this.page = page;
        this.per_page = per_page;
        this.sort_option = sort_option;
        this.sort_ascending = sort_ascending;
        this._render();
    },
    _appendContents: function() {
        var idx = 0;
        _.each(this.model.attributes.customers, function(customer) {
          var $el = $("<tr>");
          $el.html(this.listItemTemplate(customer));
          if(idx<4) $el.find(".userinfo-tooltip").addClass("bot");
          this.$el.find("tbody").append($el);
          idx++;
        }, this);
    },
});
