FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.AffiliateNew = FancyBackbone.Views.User.AffiliateNew || {};
FancyBackbone.Views.User.AffiliateNew.Products = FancyBackbone.Views.User.AffiliateNew.Products || {};

FancyBackbone.Views.User.AffiliateNew.Products.ProductInfoPopupView = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate("products_info_popup"),
    events: {
        'click .ly-close': 'onClickClose',
        'click button.btn-close': 'onClickClose',
        'mousedown button.btn-copy': 'onPrepareCopy',
        'mouseup button.btn-copy': 'onClickCopy',
    },
    initialize: function(options) {
        this.username = options.username;
    },
    onClickClose: function() {
        $.dialog('product-detail').close();
    },
    onPrepareCopy: function(e){
        e.preventDefault();
        var $link = $(e.target).prev();
        prepareClipboard($link.val()); // see common.js
    },
    onClickCopy: function(e) {
        e.preventDefault();
        var $this = $(e.target);
        copyToClipboard(); // see common.js
        $this.text('Copied');
        setTimeout(function(){
            $this.text('Copy Product Link');
        },2000)
    },
    render: function() {
        var that = this;
        /*
        $.post('/get_short_url.json', {thing_id:this.thing_id}).then(function(data){
            if(!data.short_url) return;
            var info = that.model.attributes;
            info.referrer_url = data.short_url
            that.$el.html(that.template(that.model.attributes));
            that.$el.find('.retail .commission b').text(numeral(that.commission).format("$0,0.00"));

            $.dialog('product-detail').open();

            if (window.renderMoreShare) {
                renderMoreShare({ containerSelector: this.$el, renderMode:'Button' });
            } else {
                console.warn('renderMoreShare not found')
            }
            
        });*/
        var info = that.model.attributes;
        info.referrer_url = this.thing_url;
        that.$el.html(that.template(that.model.attributes));
        that.$el.find('.retail .commission b').text(numeral(that.commission).format("$0,0.00"));

        $.dialog('product-detail').open();

        if (window.renderMoreShare) {
            renderMoreShare({ containerSelector: this.$el, renderMode:'Button' });
        } else {
            console.warn('renderMoreShare not found')
        }
        

        
        return this;
    },
    openPopup: function(e) {
        if (this.model && this.model.get('thing_id') == e.thing_id) {
            this.render();
        } else {
            this.thing_id = e.thing_id;
            this.thing_url = e.thing_url+'?ref='+this.username;
            this.commission = e.commission;
            this.model = null;
            this.model = new FancyBackbone.Models.Common.Thing({
                thing_id: e.thing_id,
                thing_url: e.thing_url,
                viewer: window.user
            });

            var that = this;
            this.model.fetch().success(function() {
                that.render();
            });
        }
    },
});
