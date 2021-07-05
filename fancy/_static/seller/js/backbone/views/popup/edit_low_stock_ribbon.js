FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.EditLowStockRibbonPopup = FancyBackbone.Views.Base.TemplateView.extend({
    events: {
        'click .btn-save': 'onSaveButtonClick',
        'click .btn-close': 'onCloseButtonClick'
    },
    open: function (product) {
        this.render(product);
        $.dialog("show_ribbon_threshold").open();
    },    
    onSaveButtonClick: function () {
        this.product.set('scarcity_ribbon_threshold', $.dialog("show_ribbon_threshold").$obj.find('input:text').val());
        $('label[for=show_scarcity] span').html($.dialog("show_ribbon_threshold").$obj.find('input:text').val());
        $.dialog("show_ribbon_threshold").close();
    },
    onCloseButtonClick: function(e){
        $.dialog("show_ribbon_threshold").close();
    },
    render: function (product) {
        var that = this;
        var superFn = this._super;
        this.product = product;
        $.dialog("show_ribbon_threshold").$obj.find('input:text').val(this.product.get('scarcity_ribbon_threshold'));
        return this;
    }
});