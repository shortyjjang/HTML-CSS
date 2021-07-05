
FancyBackbone.Views.Popup.ViewAddSidebarGraphics = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'popup_add_sidebar_graphics',
    events: {
        'click .figure .btn-del': 'onRemoveImageClick',
        'click .btn-area .btn-delete': 'onDeleteClick',
        'click .btn-save': 'onSaveButtonClick'
    },
    templateData: function() {
      return {
        image_url : this.model&&this.model.image_url||'',
        title : this.model&&this.model.title||'',
        short_description: this.model&&this.model.short_description||'',
        description: this.model&&this.model.description||''
      };
    },
    onRemoveImageClick: function(){
        this.$el.find(".figure").data('image_url','').find("img").css('backgroundImage','none').css('opacity','0').end().find(".btn-del").hide();
    },
    onDeleteClick: function(e){
        e.preventDefault();
        FancyBackbone.App.eventAggregator.trigger("delete:sidebargraphics", this.model);
        $.dialog("sidebar_graphic").close();
    },
    onSaveButtonClick: function(e) {
        e.preventDefault();
        var graphic = {};
        graphic.image_url = this.$el.find(".figure").data('image_url');
        graphic.title = this.$el.find("[name=title]").val();
        graphic.short_description = this.$el.find("[name=short_description]").val();
        graphic.description = this.$el.find("[name=description]").val();
        if(!graphic.title){
          alertify.alert('Please add a graphic title.');
          return;
        }
        if(!graphic.image_url){
          alertify.alert('please upload an image');
          return;
        }
        if( this.model ){
            var _graphic = this.model;
            for(k in graphic) _graphic[k] = graphic[k];
            FancyBackbone.App.eventAggregator.trigger("update:sidebargraphics", _graphic);
        }else{
            FancyBackbone.App.eventAggregator.trigger("create:sidebargraphics", graphic);    
        }
        $.dialog("sidebar_graphic").close();
    },
    setImage: function(image){
        this.$el.find(".figure").data("image_url", image.img_url)
            .find("img").css('backgroundImage','url("'+ image.img_url+'")').css('opacity','1').end()
            .find(".btn-del").show()
    },
    setWaiting: function(waitingStatus) {
        if (waitingStatus) {
          this.$el.find(".infscr-loading").show().end().find(".content").hide();
          this.$el.find(".btn-save").attr("disabled", true);
        } else {
          this.$el.find(".infscr-loading").hide().end().find(".content").show();
          this.$el.find(".btn-save").attr("disabled", false);
        }
    },
    open: function(admin) {
        $.dialog("sidebar_graphic").open();

    },
    render: function(graphic) {
        var that = this;

        this.model = graphic;
        
        var superFn = this._super;
        superFn.apply(that);

        that.open();
        
        this.$el.find("[name=upload-file]").fileupload({
            dataType: 'json',
            dropZone: this.$el,
            url: '/sales/upload',
            start: function(e, data) {

              that.setWaiting(true);
            },
            done: function(e, data) {
              that.setWaiting(false);
              if (data.result.status_code) {
                that.setImage(data.result);
              } else {
                alert("An error occurred. Please check the file and try again.");
              }
            },
            fail: function(e){
              alert("An error occurred. Please check the file and try again.");
            },
            always: function(e){
              that.setWaiting(false);
            }
        });

        return this;
    },
});