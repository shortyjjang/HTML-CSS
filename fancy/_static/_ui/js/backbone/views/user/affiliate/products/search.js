FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Products = FancyBackbone.Views.User.Affiliate.Products || {};

FancyBackbone.Views.User.Affiliate.Products.SearchView = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate("products_search"),
    events: {
        "click .cate > dd li": 'onClickCategory',
        "click .color > dd li:not(.checked)": 'onClickColor',
        "click .price > dd .btn-apply": 'onClickPriceApply',
        "click .filter-result > .left > .clear-all": "onClickClear",
        "click .filter-result > .left .del": "onClickDelete",
        "click .show_option a:not(.current)": 'onClickShowOption',
        "keyup .search input": "onSearch",
        "change .right select": "onClickSortOption",
    },
    initialize: function(options) {
        this.categories = new FancyBackbone.Collections.Common.Categories();
        this.listenTo(this.categories, 'reset', this.onCategoriesReset);
        this.categories.fetch({ reset:true });
        this.perPage = 50;
    },
    onClickCategory: function(e) {
        e.preventDefault();
        this.resetSelectedCategory();
        this.selectedCategory = $(e.currentTarget).attr('id');
        this.addFilter("<span class='cate'><span class='item'><label></label> " + $(e.currentTarget).text() + " <a href='#' class='del'></a></span></span>");
        $('.filter-popup').toggle();
        this.reloadList();
    },
    onClickColor: function(e) {
        e.preventDefault();
        var displayName = $(e.currentTarget).find('label').text();
        this.resetSelectedColor();

        this.selectedColor = $(e.currentTarget).find('label').attr('for');
        $(e.currentTarget).toggleClass('checked');
        this.addFilter("<span class='color'><span class='item " + this.selectedColor + "'><label></label> " + displayName + " <a href='#' class='del'></a></span></span>");
        $('.filter-popup').toggle();
        this.reloadList();
    },
    onClickPriceApply: function(e) {
        e.preventDefault();
        var minPrice = parseFloat($('.min').find('.text').val(), 10);
        var maxPrice = parseFloat($('.max').find('.text').val(), 10);
        if (isNaN(minPrice) || isNaN(maxPrice)) {
            alert("The Price value should be number.");
            return;
        } else if (typeof minPrice != 'number' || typeof maxPrice != 'number') {
            alert("The Price value should be number.");
            return;
        } else if (minPrice < 0 || maxPrice < 0) {
            alert("The Price value should be greater than 0.");
            return;
        } else if (minPrice >= maxPrice) {
            alert("The Max Price value should be greater than Min Price.");
            return;
        }

        this.resetSelectedPrice();

        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.addFilter("<span class='price'><span class='item'><label></label> $" + minPrice + " - $" + maxPrice + " <a href='#' class='del'></a></span></span>");
        $('.filter-popup').toggle();
        this.reloadList();
    },
    onClickClear: function(e) {
        e.preventDefault();
        this.resetSelectedCategory();
        this.resetSelectedColor();
        this.resetSelectedPrice();
        $('.filter-result .left .clear-all').remove();
        this.reloadList();
    },
    onClickDelete: function(e) {
        e.preventDefault();
        var selected = $(e.currentTarget).parent().parent();

        if (selected.hasClass('color')) {
            this.resetSelectedColor();
        } else if (selected.hasClass('price')) {
            this.resetSelectedPrice();
        } else if (selected.hasClass('cate')) {
            this.resetSelectedCategory();
        }

        if (!$('.filter-result .left > span').length) {
            $('.filter-result .left .clear-all').remove();
        }

        this.reloadList();
    },
    onClickShowOption: function(e) {
        console.log($(e.currentTarget).text());
        this.$el.find('.show_option .current').removeClass('current');
        $(e.currentTarget).addClass('current');
        this.perPage = $(e.currentTarget).text();
        this.reloadList();
    },
    onSearch: function(e) {
        if (e.keyCode == 13) {
            var searchStr = $(e.currentTarget).val();
            if (searchStr !== this.searchStr) {
                this.searchStr = searchStr;
                this.reloadList();
            }
        }
    },
    onClickSortOption: function(e) {
        this.sortOption = $('select > option:selected').attr('name');
        this.reloadList();
    },
    onCategoriesReset: function() {
        this.$el.find('.cate > dd > ul').html('');
        _.each(this.categories.getData(), function(category) {
            $('.cate > dd > ul').append("<li id='" + category.id + "'><a href='#' rel='" + category.key + "'>" + category.name + "</a></li>");
        });
    },
    reloadList: function() {
        this.trigger('reloadList', {
                        category: this.selectedCategory,
                        color: this.selectedColor,
                        minPrice: this.minPrice,
                        maxPrice: this.maxPrice,
                        search: this.searchStr,
                        per_page: this.perPage,
                        sort_option: this.sortOption,
                    });
    },
    resetSelectedCategory: function() {
        $(".filter-result > .left .cate").remove();
        this.selectedCategory = null;
    },
    resetSelectedColor: function() {
        this.$el.find(".color .checked").toggleClass('checked');
        $(".filter-result > .left .color").remove();
        this.selectedColor = null;
    },
    resetSelectedPrice: function() {
        $(".filter-result > .left .price").remove();
        this.minPrice = null;
        this.maxPrice = null;
    },
    addFilter: function(filter) {
        var $clear = this.$el.find('.clear-all');
        if (!$clear.length) {
            $('.filter-result > .left').append('<a href="#" class="clear-all">Clear All</a>');
            $clear = this.$el.find('.clear-all');
        }
        $clear.before(filter);
    },
    render: function(range) {
        this.$el.html(this.template());
        return this;
    },
    renderTotalProducts: function(total) {
        $('.filter-result .right').html('<label class="hidden">Total</label> ' + total + ' products</p>');
    },
});