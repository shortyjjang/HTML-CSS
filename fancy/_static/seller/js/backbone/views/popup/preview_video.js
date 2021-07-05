FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.PreviewVideoPopup = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'popup_preview_video',
    events: {
    },
    templateData: function () {
        return {
        };
    },
    open: function (model) {
        this.render(model);
        $.dialog("preview-video").open();
    },
    render: function (object) {
        var that = this;
        var superFn = this._super;
        superFn.apply(that);
        var video = object.get('video');
        if(!video) video = object.attributes;
        if(!video) return;
        
        var height = video.outputs['h264_400k'].height * (610/video.outputs['h264_400k'].width);
        this.$el.find("#myVideo").height(height).find("source").attr('src', video.outputs['h264_400k'].url).end().show();
        return this;
    }
});