FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.EditVideoThumbnailPopup = FancyBackbone.Views.Base.TemplateView.extend({
    events: {
        'click .btn-close': 'onCloseButtonClick'
    },
    open: function (video) {
        this.render(video);
        $.dialog("video_thumbnail").open();
    },    
    onCloseButtonClick: function(e){
        $.dialog("video_thumbnail").close();
    },
    initialize: function(){
        var that = this;
        this.$el.find("#add-product-video-thumbnail").fileupload({
          type: 'PUT',
          dataType: 'json',
          url: '',
          add: function(e, data){
            if(!that.video) return;
            data.url = '/rest-api/v1/seller/'+that.video.get('product').get('user').id+'/products/videos/'+that.video.get('id');
            that.$el.find("span.file-name").html(data.files[0].name);
            that.$el.find(".btn-save").off('click').on('click',function(){
                data.process().done(function () {
                    data.submit();
                });
            })
          },
          done: function(e, data) {
            if (data.result.thumbnail) {
              that.video.set('thumbnail', data.result.thumbnail);
              that.$el.find("span.file-name").html('No files selected');
              that.render(that.video);
              $.dialog("video_thumbnail").close();
            } else {
              alertify.alert(data.error||"An error occurred. Please check the file and try again.");
            }
          }
        });
    },
    render: function (video) {
        var that = this;
        var superFn = this._super;
        //superFn.apply(that);
        this.video = video;
        if(this.video.get('thumbnail')){
            $.dialog("video_thumbnail").$obj.find('figure img').css('background-image',"url("+this.video.get('thumbnail')+")");    
        }
        
        return this;
    }
});