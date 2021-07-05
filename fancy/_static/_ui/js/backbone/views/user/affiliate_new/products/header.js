FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.AffiliateNew = FancyBackbone.Views.User.AffiliateNew || {};
FancyBackbone.Views.User.AffiliateNew.Products = FancyBackbone.Views.User.AffiliateNew.Products || {};

FancyBackbone.Views.User.AffiliateNew.Products.HeaderView = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate("products_header"),
    events: {
        "change .cate select": 'onChangeCategory',
        "change .cate li a": 'onClickCategory',
        "keyup .filter input": "onChangeKeyword",
        "click .filter a.remove": "onClearKeyword",
        "change .sort select": "onChangeSort",
    },
    initialize: function(options) {
        var that = this;
        this.categories = new FancyBackbone.Collections.Common.Categories(undefined, { root: true });
        this.categoriesDfd = this.categories.fetch({ reset:true });
    },
    onChangeCategory: function(e) {
        var $this = $(e.target), categoryId = $this.val(), name = $this.find("option:selected").text();
        this.categoryId = categoryId;
        $this.prev().text(name).closest('dl').removeClass('bold');
        if(categoryId) $this.closest('dl').addClass('bold');
        this.reloadList();
    },
    onClickCategory: function(e) {
        var $this = $(e.target), categoryId = $this.attr('rel');
        this.categoryId = categoryId;
        this.reloadList();
    },
    onChangeKeyword: function(e) {
        var $this = $(e.target), $label = $this.closest('dl').find('dt');
        if (e.keyCode == 13) {
            var searchStr = $(e.currentTarget).val();
            if (searchStr !== this.searchStr) {
                this.searchStr = searchStr;
                if(searchStr){
                    $label.text('Filter by '+searchStr).closest('dl').addClass('bold');
                    $this.next().show()    
                }else{
                    $label.text('Filter by keyword').closest('dl').removeClass('bold');
                    $this.next().hide()
                }
                
                this.reloadList();
            }
        }
    },
    onClearKeyword: function(e){
        var $this = $(e.target), $label = $this.closest('dl').find('dt');
        e.preventDefault();
        $this.hide().prev().val('');
        $label.text('Filter by keyword').closest('dl').removeClass('bold');
        this.searchStr = '';
        this.reloadList();
    },
    onChangeSort: function(e) {
        var $this = $(e.target), sort = $this.val();
        this.sort = sort;
        this.reloadList();
    },
    reloadList: function() {
        this.trigger('reloadList', {
                        page: 1,
                        category: this.categoryId,
                        p: this.price_range,
                        search: this.searchStr,
                        sort: this.sort,
                    });
    },
    render: function(range) {
        var that = this;
        this.categoriesDfd.success(function() {
            that.$el.html(that.template(that.categories.getData()[0]));
            that.$el.find("#slider-range").slider({
                range: true,
                min: 0,
                max: 1000,
                step: 10,
                values: [ 1, 1000 ],
                slide: function( event, ui ) {
                    if(ui.values[1]-ui.values[0] < 10) return false;;
                    that.$el.find(".price dd .amount .min" ).text( ui.values[ 0 ] || 1);
                    that.$el.find(".price dd .amount .max" ).text( ui.values[ 1 ] + (ui.values[1]==1000?"+":""));           
                    var rangeStr = that.$el.find(".price dd .amount").html();
                    if( ui.values[0]<=1 && ui.values[1]==1000 ){
                        rangeStr = 'Any Price';
                        that.$el.find(".price").removeClass('bold');
                    }else{
                        that.$el.find(".price").addClass('bold');
                    }
                    that.$el.find(".price dt.amount").html(rangeStr);
                },
                change: function( event, ui ) {
                    var min_price = ui.values[ 0 ], max_price = ui.values[ 1 ], price_range="";

                    if(max_price==1000) max_price="";
                    if(max_price && !min_price) min_price = "1"

                    if(min_price || max_price){             
                        price_range = min_price+"-"+max_price;
                    }

                    that.price_range = price_range;
                    that.reloadList();
                }
            });
        });
        
        return this;
    },
});