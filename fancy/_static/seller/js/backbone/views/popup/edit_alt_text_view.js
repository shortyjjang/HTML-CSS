FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.EditAltTextPopup = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'popup_edit_alt_text',
    events: {
        'click .btn-save': 'onSaveButtonClick',
        'click .btn-close': 'onCloseButtonClick'
    },
    initialize: function(options) {
        this.whitelabel = options.whitelabel;
    },
    templateData: function () {
        return {
            option: this.product_image.get('option'),
            whitelabel: this.whitelabel
        };
    },
    open: function (product_image) {
        this.render(product_image);
        $.dialog("add_alt_text").open(true);
    },    
    onSaveButtonClick: function () {
        this.product_image.set('alt_text', $.dialog("add_alt_text").$obj.find('input:text').val());
        if(this.whitelabel){
            var options = this.product_image.get('options') || {};
            options.fit_to_bounds = $.dialog("add_alt_text").$obj.find('input[name=fit_to_bounds]').prop('checked');
            options.hide_for_option = $.dialog("add_alt_text").$obj.find('input[name=hide_for_option]').prop('checked');
            this.product_image.set('options', options);
        }
        $.dialog("add_alt_text").close();
    },
    onCloseButtonClick: function(e){
        $.dialog("add_alt_text").close();
    },
    render: function (product_image) {
        var that = this;
        this.product_image = product_image;
        var superFn = this._super;
        superFn.apply(that);
        $.dialog("add_alt_text").$obj.find('.thumbnail').css('background-image',"url("+this.product_image.get('url_310')+")");
        $.dialog("add_alt_text").$obj.find('input:text').val(this.product_image.get('alt_text'));
        if(this.whitelabel){
            var options = this.product_image.get('options') || {};
            $.dialog("add_alt_text").$obj
                .find('input[name=fit_to_bounds]').prop('checked', options.fit_to_bounds).end()
                .find('input[name=hide_for_option]').prop('checked', options.hide_for_option);

        }
        return this;
    }
});