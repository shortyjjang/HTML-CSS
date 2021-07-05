FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.PreviewPhotoItemPopup = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'popup_preview_photo_item',
    events: {
    },
    templateData: function () {
        return {
        };
    },
    open: function (model) {
        this.render(model);
        $.dialog("preview_photo_item").open();
    },
    render: function (model) {
        var that = this;
        var superFn = this._super;
        superFn.apply(that);
        if(!model) return;
        
        this.$el.find(".preview img").attr('src', model.get('url_original'));
        return this;
    }
});