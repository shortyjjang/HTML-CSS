FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Products = FancyBackbone.Views.User.Affiliate.Products || {};

FancyBackbone.Views.User.Affiliate.Products.ProductInfoPopupView = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate("products_info_popup"),
    events: {
        'click .ly-close': 'onClickClose',
        'click button.btn-close': 'onClickClose',
        'click button.btn-copy': 'onClickCopy',
        'click .share-via .show': 'onClickShow',
    },
    initialize: function() {
        
    },
    onClickClose: function() {
        this.$el.parent().removeClass('product-info').hide();
    },
    onClickCopy: function() {

    },
    onClickShow: function(e) {
        $(e.currentTarget).toggleClass('less');
        $(e.currentTarget).prev('ul').toggleClass('less');
    },
    render: function() {
        var that = this;
        $.post('/get_short_url.json', {thing_id:this.thing_id}).then(function(data){
            if(!data.short_url) return;
            var info = that.model.attributes;
            info.referrer_url = data.short_url
            that.$el.html(that.template(that.model.attributes));
            that.$el.parent().addClass('product-info').show().css('opacity', 1);
            try {
                var clipboard = new Clipboard('.btn-copy');

                clipboard.on('success', function(e) {
                    e.clearSelection();
                    var $b = $(e.trigger);
                    $b.text('Copied!')
                    setTimeout(function() {
                        $b.text("Copy Link");
                    }, 600);
                });
            } catch(e) {
                console.log(e)
            }
            that.$el.find('fieldset .commission').text(numeral(that.commission).format("$0,0.00"));
        });

        
        return this;
    },
    openPopup: function(e) {
        if (this.model && this.model.get('thing_id') == e.thing_id) {
            this.render();
        } else {
            this.thing_id = e.thing_id;
            this.commission = e.commission;
            this.model = null;
            this.model = new FancyBackbone.Models.Common.Thing({
                thing_id: e.thing_id,
            });

            var that = this;
            this.model.fetch().success(function() {
                that.render();
            });
        }
    },
});
