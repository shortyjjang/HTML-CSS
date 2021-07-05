FancyBackbone.Views.Product = FancyBackbone.Views.Product || {};
FancyBackbone.Views.Product.ProductInformationView = Backbone.View.extend({
  events: {
    
  },
  syncTitle: function() {
    this.model.set('title', (this.$el.find('input[name=title]').val() || "").trim());
  },
  syncTagline: function() {
    if(this.$el.find('textarea#product-tagline').length>0) {
        this.model.set('tagline', (this.$el.find('textarea#product-tagline').val() || "").trim())
    }
  },
  syncDescription: function() {
    var $desc = tinyMCE.get('product-description');
    var description = ($desc) ? $desc.getContent() : null;
    if(description!=null)
      this.model.set('description', description.replace(/\n/g,'') );
  },
  syncFancyDetails: function() {
    var that = this;
    _.each(['description', 'specs', 'features'], function(val){
        var $desc = tinyMCE.get('product-fancy-' + val);
        var description = ($desc) ? $desc.getContent() : null;
        if(description!=null) that.model.set('fancy_' + val, description.replace(/\n/g,'') );  
    });
    var $t = this.$el.find('input[name=meta_title]');
    if ($t.length) {
      this.model.set('meta_title', ($t.val() || "").trim());
    }
    var $t = this.$el.find('textarea[name=meta_description]');
    if ($t.length) {
      this.model.set('meta_description', ($t.val() || "").trim());
    }
  },
  syncMetaDescription: function() {
    if(this.whitelabel) {
      var $desc = tinyMCE.get('product-meta-description');
      var description = ($desc) ? $desc.getContent() : null;

      if(description!=null){
        var metadata = this.model.get('metadata')||{};
        metadata['meta_description'] = description.replace(/\n/g,'');
        this.model.set('metadata', metadata);
      }
    }
  },
  syncTechSpec: function() {
    if(!this.whitelabel) {
      var $desc = tinyMCE.get('product-techspec');
      var description = ($desc) ? $desc.getContent() : null;

      if(description!=null){
        var metadata = this.model.get('metadata')||{};
        metadata['tech_spec'] = description.replace(/\n/g,'');
        this.model.set('metadata', metadata);
      }
    }
  },
  syncMoreInfo: function() {
    if(this.whitelabel) {
      var $desc = tinyMCE.get('product-moreinfo');
      var description = ($desc) ? $desc.getContent() : null;

      if(description!=null){
        var metadata = this.model.get('metadata')||{};
        metadata['more_info'] = description.replace(/\n/g,'');
        this.model.set('metadata', metadata);
      }
    }
  },
  syncEstimatedDelivery: function() {
    var $t = this.$el.find('input#product-estimated-delivery');
    if($t.length>0) {
        var metadata = this.model.get('metadata')||{};
        metadata['estimated_delivery'] = ($t.val() || "").trim();
        this.model.set('metadata', metadata);
    }
  },
  syncModel: function() {
    this.syncTitle();
    this.syncTagline();
    this.syncDescription();
    this.syncFancyDetails();
    this.syncTechSpec();
    this.syncMetaDescription();
    this.syncMoreInfo();
    this.syncEstimatedDelivery();
  },
  renderDescriptionTextArea: function() {
    var dfd = $.Deferred();
    this.descriptEditorInitPromise = dfd.promise();
    tinyMCE.init({
      mode : 'exact',
      elements : 'product-description,description,product-fancy-description,product-fancy-features,product-fancy-specs,product-meta-description,product-techspec,product-moreinfo',
      content_css : '/_ui/css/seller_brand_content.css',
      theme : 'advanced',
      theme_advanced_toolbar_location : 'top',
      theme_advanced_toolbar_align : 'left',
      theme_advanced_buttons1 : 'bold,italic,underline,|,bullist,numlist,|,justifyleft,justifycenter,justifyright,fontsizeselect,|,code',
      theme_advanced_buttons2 : '',
      theme_advanced_buttons3 : '',
      theme_advanced_resizing : true,
      theme_advanced_font_sizes : '10px,12px,14px,16px,24px',
      theme_advanced_more_colors : false,
      browser_spellcheck : true,
      gecko_spellcheck : true,
      plugins : 'paste, inlinepopups, autoresize',
      paste_text_sticky : true,
      invalid_elements : 'a',
      autoresize_max_height: 200,
      oninit : function() { dfd.resolve(); },
      setup : function(editor) {
        editor.onInit.add(function(ed){ ed.pasteAsPlainText = false; });
        editor.onExecCommand.add(function(editor, command) {
          if (command != 'mceInsertLink') return;
          setTimeout(function(){
          tinymce.map(editor.dom.select('a'), function(n){
            var href = editor.dom.getAttrib(n, 'href') || '';
            if (href.indexOf('/') !== 0) {
              href = 'http://' + href;
              editor.dom.setAttrib(n, 'href', href);
              editor.dom.setAttrib(n, 'data-mce-href', href);
            }
          });
          }, 10);
        });
      }
    });
  },
  onEditorWindowOpen: function(){
    var $wysiwyg = this.$el.find(".defaultSkin");
    var offset = $wysiwyg.offset();
    var width = $wysiwyg.width();
    var height = $wysiwyg.height();
    tinyMCE.activeEditor.windowManager.features.left = offset.left;
    tinyMCE.activeEditor.windowManager.features.top = offset.top;
    tinyMCE.activeEditor.windowManager.features.width = width;
    tinyMCE.activeEditor.windowManager.features.height = height;
    tinyMCE.activeEditor.windowManager.params.mce_width = width;
    tinyMCE.activeEditor.windowManager.params.mce_height = height;

  },
  syncView: function() {
    var that = this;
    this.descriptEditorInitPromise.done(function() {
      if (that.model.id) {
        tinyMCE.get('product-description').setContent(that.model.get("description"));
        if(that.whitelabel){
          var metadata = that.model.get('metadata')||{};
          if(tinyMCE.get('product-meta-description'))
            tinyMCE.get('product-meta-description').setContent(metadata['meta_description']||'');
          if(tinyMCE.get('product-techspec'))
            tinyMCE.get('product-techspec').setContent(metadata['tech_spec']||'');
          if(tinyMCE.get('product-moreinfo'))
            tinyMCE.get('product-moreinfo').setContent(metadata['more_info']||'');
        } else {
          if(tinyMCE.get('product-fancy-description')) tinyMCE.get('product-fancy-description').setContent(that.model.get("fancy_description") || '');
          if(tinyMCE.get('product-fancy-features')) tinyMCE.get('product-fancy-features').setContent(that.model.get("fancy_features") || '');
          if(tinyMCE.get('product-fancy-specs')) tinyMCE.get('product-fancy-specs').setContent(that.model.get("fancy_specs") || '');
        }
      }
      that.syncDescription();
      window.view.changed = false;
      
      if(that.model.id && that.model.is_locked_field('description')) {
        tinyMCE.dom.Event.add(tinyMCE.activeEditor.getBody(), "click", function(e) {
            alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
        });
        tinyMCE.activeEditor.getBody().setAttribute('contenteditable', !that.model.is_locked_field('description'));
      }else{
        tinyMCE.dom.Event.add(tinyMCE.activeEditor.getBody(), "focus", function(e) {
           that.$el.find(".defaultSkin").addClass('focus expand'); 
        });

        tinyMCE.dom.Event.add(tinyMCE.activeEditor.getBody(), "blur", function(e) {
            that.$el.find(".defaultSkin").removeClass('focus');
        });

        tinyMCE.activeEditor.windowManager.onOpen.add(function(e){
          that.onEditorWindowOpen();
        }, that);

        $(window).off('resize.editor').on('resize.editor', function(e){
          var $wysiwyg = that.$el.find(".defaultSkin");
          var offset = $wysiwyg.offset();
          if(tinyMCE.activeEditor.windowManager.lastId){
            tinymce.DOM.setStyles( tinyMCE.activeEditor.windowManager.lastId.replace("_wrapper","") , { top: offset.top, left: offset.left })
          }
        });

        $(document).off('focus.editorlayer').on('focus.editorlayer', '.clearlooks2[role=dialog] iframe', function(e){
          $(".clearlooks2[role=dialog] iframe").load(function(){
            $(".clearlooks2[role=dialog]").attr('class', 'clearlooks2 ' + $(".clearlooks2[role=dialog] iframe")[0].contentWindow.document.body.getAttribute('id')||"" );  
          })
        })

        if(that.model.get("description")){
          that.$el.find(".defaultSkin").addClass('expand'); 
        }
      }
    });

    this.$el.find("textarea#product-tagline").val(this.model.get('tagline'));
    this.$el.find("input[name=new_thing_id]").val(this.model.get('new_thing_id'));
    this.$el.find("input[name=new_thing_user_id]").val(this.model.get('new_thing_user_id'));
    this.$el.find("input[name=title]").val(this.model.get('title'));
    this.$el.find("input[name=meta_title]").val(this.model.get('meta_title'));
    this.$el.find("textarea[name=meta_description]").val(this.model.get('meta_description'));

    var metadata = that.model.get('metadata')||{};
    that.$el.find("input#product-estimated-delivery").val(metadata['estimated_delivery']||'');
    
    this.$el.find("input[name=title]").attr('readonly', this.model.is_locked_field('title'));
    if(this.model.is_locked_field('title')) this.$el.find("input[name=title]").addClass('locked');
    else this.$el.find("input[name=title]").removeClass('locked');
    
  },
  initialize: function(options) {
    this.whitelabel = options.whitelabel;
  },
  render: function() {
    this.renderDescriptionTextArea();
    this.syncView();
    return this;
  },
});

FancyBackbone.Views.Product.ImageItemView = Backbone.View.extend({
  events: {
    'click a.btn-del': 'onDeleteButtonClick',
    'click a.btn-edit': 'onAltButtonClick',
    'click a.btn-hide': 'onHideButtonClick',
    'click a.preview': 'onPreviewClick',
  },
  tagName: 'li',
  className: 'photo item',
  template: FancyBackbone.Utils.loadTemplate("product_new_photo_item"),
  initialize: function(options) {
    this.is_admin = options.is_admin;
    this.whitelabel = options.whitelabel||false;
  },
  onDeleteButtonClick: function(event) {
    event.preventDefault();
    if(this.model.get('product').is_locked_field('images')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    this.remove();    
  },
  onAltButtonClick: function(event){
    event.preventDefault();
    if(this.model.get('product').is_locked_field('images')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    window.popups.editAltText.open(this.model);
  },
  onHideButtonClick: function(event){
    event.preventDefault();
    if(this.model.get('product').is_locked_field('images')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    this.$el.toggleClass('hide-item');
    this.model.set('hide_on_thing', !this.model.get('hide_on_thing') );
    this.$el.data('model', this.model);
  },
  onPreviewClick: function(event){
    event.preventDefault();
    window.popups.previewPhotoItem.open(this.model);
  },
  setLoading: function(){
    this.$el.addClass('loading').find("> a, > img").hide();
  },
  setImage: function(model){
    this.model = model;
    this.$el.data('model', model).removeClass('loading');
    this.render();
  },
  render: function() {
    this.$el.html(this.template({
      url: this.model.get('url_310'),
      is_admin: this.is_admin,
      whitelabel: this.whitelabel,
    }));
    if( this.is_admin && this.model.get('hide_on_thing') ){
      this.$el.addClass('hide-item');
    }else{
      this.$el.removeClass('hide-item');
    }
    return this;
  }
});

FancyBackbone.Views.Product.VideoItemView = Backbone.View.extend({
  events: {
    'click a.btn-del': 'onDeleteButtonClick',
    'click a.btn-cancel': 'onDeleteButtonClick',
    'click a.btn-edit': 'onEditButtonClick',
    'click video': 'onPreviewClick'
  },
  tagName: 'li',
  className: 'video item',
  template: FancyBackbone.Utils.loadTemplate("product_new_video_item"),
  onDeleteButtonClick: function(event) {
    event.preventDefault();
    if(this.model.get('product').is_locked_field('images')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    var that = this;
    event.preventDefault();
    $.ajax({
      type : 'DELETE',
      url  : '/rest-api/v1/seller/'+this.model.get('product').get('user').id+'/products/videos/'+this.model.get('id'),
      data : {},
      dataType : 'json',
      success  : function(result){
        that.model.get('product').set('video', null);
        that.model.get('product').set('video_id', null);
        that.$el.remove();
      }
    });
  },
  onEditButtonClick: function(event){
    event.preventDefault();
    if(this.model.get('product').is_locked_field('images')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    window.popups.editVideoThumbnail.open(this.model);
  },
  onPreviewClick: function(event){
    window.popups.previewVideo.open(this.model);
  },
  getDuration:function(sec){
    var min = Math.floor(sec/60);
    var sec = sec%60;
    return (min<10?"0":"")+min+":"+(sec<10?"0":"")+sec;
  },
  render: function() {
    var video = this.model;
    var data = {status: video.get('status')};
    if(video.get('status')=='ready'){
      data.url = video.get('outputs')['h264_400k'].url;
      data.time = this.getDuration(video.get('outputs')['h264_400k'].duration) ;
      data.thumbnail = video.get('thumbnail');
    }
    this.$el.html(this.template(data));
    if(video.get('status')=="uploading"){
      this.$el.addClass('loading');
    }else if(video.get('status')!='ready'){
      this.$el.addClass('loaded');
    }
    return this;
  }
});

FancyBackbone.Views.Product.ImagesAndVideoView = Backbone.View.extend({
  events: {
    "click  .additional > li.add": "onAddClick",
    "click  .import_image": "onImportClick",
  },
  initialize: function(options) {
    this.listenTo(FancyBackbone.App.eventAggregator,'import:saleitemimage', _.bind(this.importImageFromUrl, this));
    this.is_admin = options.is_admin;
    this.whitelabel = options.whitelabel;
  },
  onAddClick: function(event) {
    event.preventDefault();
    var $this = $(event.currentTarget);
    if(this.model.is_locked_field('images')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    if($this.find(".infscr-loading").is(":visible")) return;
    $this.closest('div').find("#add-product-imagevideo").click();
  },
  onImportClick: function(event) {
    event.preventDefault();
    var $this = $(event.currentTarget);
    if(this.model.is_locked_field('images')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    if($this.find(".infscr-loading").is(":visible")) return;
    window.popups.importImageFromUrl.open(this.model);
  },
  syncModel: function() {
    var productImageCollection = new FancyBackbone.Collections.Product.ImageCollection(
      _.map(this.$el.find(".item.photo"), function(photoItemView) {
        return $(photoItemView).data('model');
      })
    );
    this.model.set('images', productImageCollection);

    this.model.set('video_id', this.$el.find("li.item.video").attr('video_id'));
    this.model.set('video_position', this.$el.find("li.item.video").prevAll('li.item').length );
  },
  syncView: function() {
    var that = this;
    this.model.get('images').each(function(v){
      that.addProductImage(v);
    });
    if(this.model.get('video')){
      this.setProductVideo( new FancyBackbone.Models.Product.Video( this.model.get('video') ) );
    }else{
      this.setProductVideo(null);
    }
  },
  importImageFromUrl: function(url){
    var that = this;
    var imageView = that.addProductImage(new FancyBackbone.Models.Product.Image({
      product: that.model
    }), true);
    that.$el.find('.additional > li.add').hide();
    $.post('/sales/upload', {image_url:url}, function(result){
      if(result.status_code==1 && result.img_url){
        imageView.setImage(new FancyBackbone.Models.Product.Image({
            product: that.model,
            url_310: result.img_url,
            original_rel_path: result.img_id,
            alt_text: result.alt_text||'',
          }));
      }else{
        imageView.remove();
        alert("An error occurred. Please check the url and try again.");
      }
    }).fail(function(){
      imageView.remove();
      alert("An error occurred. Please check the url and try again.");
    }).always(function(){
      that.$el.find('.additional > li.add').show();
      that.setWaiting(that.$el.find(".additional li.add .infscr-loading"),false);
    })
  },
  createImageView: function(productImage) {
    var ret = new FancyBackbone.Views.Product.ImageItemView({model: productImage, is_admin: this.is_admin, whitelabel: this.whitelabel}).render();
    ret.$el.data('model', productImage);
    return ret;
  },
  createVideoView: function(video) {
    var ret = new FancyBackbone.Views.Product.VideoItemView({model: video}).render();
    ret.$el.data('model', video);
    return ret;
  },
  addProductImage: function(productImage, loading) {
    var imageView = this.createImageView(productImage);
    if(loading){
      imageView.setLoading();
    }
    $(imageView.$el).insertBefore( this.$el.find("ul.additional > li.add") );
    return imageView;
  },
  setProductVideo: function(video) {
    this.$el.find("li.item.video").remove();
    if(video && video.get('status')=='failed'){
      alertify.alert("failed");
    }else if(video && video.get('status')){
      video.set('product', this.model);
      var videoView = this.createVideoView(video);
      if( video.get('position') > 0 ){
        $(videoView.$el).insertAfter( this.$el.find("li.item:eq("+ (video.get('position')-1) +")") );  
      }else{
        $(videoView.$el).prependTo( this.$el.find("ul.additional") );  
      }
      
      videoView.$el.attr('video_id', video.id );
    }
  },
  setWaiting: function($el, waitingStatus) {
    if (waitingStatus) {
      $el.show();
    } else {
      $el.hide();
    }
  },
  render: function() {
    var that = this, $addPhoto = this.$el.find('.additional > li.add');

    if(!that.model.is_locked_field('images')) {
      $addPhoto.parent().sortable({
        cancel : '.add',
        helper: "clone",
        items: "> li.item",
        forcePlaceholderSize: true,
        forceHelperSize: true,
        scroll:false,
        containment: "._images_video",
        start : function(event, ui) {
          $addPhoto.css('opacity',0);
          setTimeout(function(){ $addPhoto.hide() }, 200);
        },
        stop : function(event, ui) {
          $addPhoto.appendTo($addPhoto.parent()).show();
          setTimeout(function(){ $addPhoto.css('opacity',1) }, 0);
        },
        sort : function( e, ui ) {
          var container   = $( this ),
              placeholder = container.children( '.ui-sortable-placeholder:first' );

          var helpHeight  = ui.helper.outerHeight(),
              helpWidth  = ui.helper.outerWidth(),
              helpTop     = ui.offset.top,
              helpLeft     = ui.offset.left,
              helpBottom  = helpTop + helpHeight;

          container.find('> li.item:visible:not(.add)').each( function () {
              var item = $( this );

              if( !item.hasClass( 'ui-sortable-helper' ) && !item.hasClass( 'ui-sortable-placeholder' )) {
                  var itemHeight = item.outerHeight(),
                      itemWidth = item.outerWidth(),
                      itemTop    = item.offset().top,
                      itemLeft    = item.offset().left,
                      itemBottom = itemTop + itemHeight;

                  if(( helpTop < itemBottom ) && ( helpBottom > itemTop )) {
                      var tolerance = Math.min( helpWidth, itemWidth ) / 5,
                          distance  = helpLeft - itemLeft;

                      if( distance < tolerance ) {
                          placeholder.insertBefore( item );
                          container.sortable( 'refreshPositions' );
                          return false;
                      }else if( item.next().is(".add") ){
                          placeholder.insertAfter( item );
                          container.sortable( 'refreshPositions' );
                          return false;
                      }
                  } 
              }
          });
        }
      });
    }
    $addPhoto.parent().disableSelection();

    if(!that.model.is_locked_field('images')) {
      this.$el.find("#add-product-imagevideo").removeClass('locked').fileupload({
        dataType: 'json',
        url: '/sales/upload',
        dropZone: this.$el,
        start: function(e, data) {
          that.setWaiting(that.$el.find(".additional li.add .infscr-loading"), true);
        },
        add: function(e, data){
          var fname = data.files[0].name.split(".");
          var ext = fname[fname.length-1];
          if(/(jpg|jpeg|png|gif)/i.test(ext)){
            data.type = 'POST';
            data.url = '/sales/upload';
            data.paramName = 'upload-file';
          }
          if( /(mov|avi|mkv|mpg|mp4)/i.test(ext)){
            if(that.$el.hasClass('allow_video')){
              data.type = (that.model.id?'PUT':'POST');
              data.url = '/rest-api/v1/seller/'+that.model.get('user').id+'/products/'+(that.model.id||'new')+'/video';
              data.paramName = 'video-file';
            }else{
              alertify.alert('Please select an image file');
              return;
            }
          }
          if(data.paramName=='video-file' && that.$el.find(".item.video").length ){
            alertify.alert("You can attach only one video file.");
            data.fileInput = [];
            data.originalFiles = [];
            return;
          }
          data.process().done(function () {
              if(/(jpg|jpeg|png|gif)/i.test(ext)){
                var imageView = that.addProductImage(new FancyBackbone.Models.Product.Image({
                  product: that.model
                }), true);
                data.imageView = imageView;
                that.$el.find('.additional > li.add').hide();
              }
              data.submit();
          });
        },
        done: function(e, data) {
          if (data.result.status_code || data.result.status) {
            if(data.result.img_url){
              data.imageView.setImage(new FancyBackbone.Models.Product.Image({
                  product: that.model,
                  url_310: data.result.img_url,
                  original_rel_path: data.result.img_id,
                  alt_text: data.result.alt_text,
                }));
              that.$el.find('.additional > li.add').show();
            }else{
              that.model.set('video_id', data.result.id);
              data.result.product = that.model;
              that.setProductVideo( new FancyBackbone.Models.Product.Video(data.result) );
              that.$el.find("li.item.video").attr('video_id', data.result.id);
            }
          } else {
            alert("An error occurred. Please check the file and try again.");
          }
        },
        fail: function(e){
          that.$el.find('.additional > li.add').show();
          alert("An error occurred. Please check the file and try again.");
        },
        always: function(e){
          that.$el.find('.additional > li.add').show();
          that.setWaiting(that.$el.find(".additional li.add .infscr-loading"),false);
        }
      });
    }else{
      this.$el.find("#add-product-imagevideo").addClass('locked');
    }

    if (this.model.id) {
      this.syncView();
    }
    return this;
  },
});


FancyBackbone.Views.Product.PricingDetailView = Backbone.View.extend({
  events: {
    'keyup input[name=price]': 'onPriceChage',
    'keyup input[name=retail-price]': 'onRetailPriceChage',
    'click #check-sale': 'onCheckSaleClick',
    'change input#check-charge-tax': 'onChangeChargeTaxesButton',
    'click .edit-ribbon-threshold': 'onClickEditRibbonThreshold',
    'click ul[name=color] a[data-color]': 'onSelectColor',
    'click .color-picker a.btn-del': 'onDeselectColor',
    'change input#is_preorder': 'onTogglePreorder',
    'click .brand-picker a.add': 'onAddBrand',
    'click .brand-picker .create a:not(.add)': 'onAddBrand',
    'click .brand-picker li a[data-brand]': 'onSelectBrand',
    'click .brand-picker li a.edit': 'onEditBrand',
    'keyup .brand-picker .search input': 'onSearchBrand',
  },
  onPriceChage: function(event) {
    var price = parseFloat($(event.currentTarget).val());
    var retail_price = parseFloat(this.$el.find('input[name=retail-price]').val());
    var discount = parseFloat(this.$el.find('input[name=discount]').val());
    if (!isNaN(price)) {
      if (!isNaN(retail_price)) {
        this.$el.find('input[name=discount]').val(get_discount(retail_price, price));
      } else if (isNaN(discount)) {
        this.$el.find('input[name=discount]').val('');
      }
    } else {
      this.$el.find('input[name=discount]').val('');
    }
  },

  onRetailPriceChage: function(event) {
    var retail_price = parseFloat($(event.currentTarget).val());
    var price = parseFloat(this.$el.find('input[name=price]').val());
    var discount = parseFloat(this.$el.find('input[name=discount]').val());
    if (!isNaN(retail_price)) {
      if (!isNaN(price)) {
        this.$el.find('input[name=discount]').val(get_discount(retail_price, price));
      } else if (isNaN(discount)) {
        this.$el.find('input[name=discount]').val('');
      }
    } else {
      this.$el.find('input[name=discount]').val('');
    }
  },

  onCheckSaleClick: function (event) {
    var $this = $(event.target);
    if($this.is(":checked")){
      this.$el.find(".price.retail, .price.discount").show();
    }else{
      this.$el.find(".price.retail, .price.discount").hide().filter(".price.retail").find("input").val('').trigger('keyup');
    }
    
  },
  onChangeChargeTaxesButton: function() {
    var $chargeTaxButton = this.$el.find("input#check-charge-tax");
    var chargeTax = $chargeTaxButton.prop("checked");
    if (chargeTax) {
      this.$el.find(".tax-cloud-view").show();
    } else {
      this.$el.find(".tax-cloud-view").hide();
      this.$el.find("#ticComplete .navlink").click();
    }
  },
  onClickEditRibbonThreshold: function(){
    window.popups.editLowStockThreshold.open(this.model);
  },
  onCreateBrand: function(e, brand){
    var $el = this.$el.find(".brand-picker");
    var $li = $el.find(".lists ul a[data-brand='"+brand+"']");
    if(!$li[0]){
      $el.find(".lists ul").append('<li><a href="#" data-brand="'+brand+'" >'+brand+'</a><a href="#" class="edit"><em>Edit Brand</em></a></li>')
    }
    $el.find(".lists ul a[data-brand='"+brand+"']").click();
  },
  onEditBrandProc: function(e, prev_brand, brand){
    if(prev_brand && prev_brand == brand) return;
    var $el = this.$el.find(".brand-picker");
    $.ajax({
      type : 'POST',
      url  : '/merchant/products/edit-brand.json',
      data : {brand:prev_brand, new_brand:brand},
      dataType : 'json',
      success  : function(result){
        if(brand){
          $el.find(".lists ul a[data-brand='"+prev_brand+"']").attr('data-brand', brand).text(brand);
          if( $el.find("span.selected").text()==prev_brand){
            $el.find("span.selected").text(brand);
          }
        }else{
          $el.find(".lists ul a[data-brand='"+prev_brand+"']").closest('li').remove();
          if( $el.find("span.selected").text()==prev_brand){
            $el.find("span.selected").text('Select Brand');
          }
        }
      }
    });
  },
  onAddBrand: function(e){
    e.preventDefault();
    var $el = $(e.target);

    if( $el.parent().is(".create") ){
      var brand = $el.parent().find("a:eq(0)").text();
      this.onCreateBrand(e, brand);
      $el.closest('.select-lists').find(".search input").val('').trigger('keyup');
    }else{
      $el.closest('.select-lists').hide();
      $.dialog('edit_brand').$obj
        .find("#edit_title, .btn-delete").hide().end()
        .find("#create_title").show().end()
        .find("input").val('');
      $.dialog('edit_brand').open();  
    }
    
  },
  onSelectBrand: function(e){
    e.preventDefault();
    if( $(e.target).hasClass('selected') ){
      $(e.target).removeClass('selected').closest('.brand-picker').find("span.selected").text('Select Brand');
    }else{
      $(e.target)
        .closest('ul').find("a.selected").removeClass("selected").end().end()
        .addClass('selected').closest('.select-lists').hide();
      var brand = $(e.target).attr('data-brand');
      $(e.target).closest('.brand-picker').find("span.selected").text(brand);
    }
  },
  onEditBrand: function(e){
    var brand = $(e.target).prev().attr('data-brand');
    $(e.target).closest('.select-lists').hide();
    $.dialog('edit_brand').$obj
      .find("#edit_title, .btn-delete").show().end()
      .find("#create_title").hide().end()
      .find("input").val(brand);
    $.dialog('edit_brand').open();
  },
  onSearchBrand: function(e){
    var q = $(e.target).val();
    var ql = q.toLowerCase();
    var exists = false;
    this.$el.find(".brand-picker")
      .find(".lists ul li").show().each(function(){
        var name = $(this).find("a").attr('data-brand').toLowerCase();
        if( name.indexOf(ql) == -1) $(this).hide();
        if( name == ql ) exists = true;
      })

    if( exists || !q){
      this.$el.find(".brand-picker .create").hide();
    }else{
      this.$el.find(".brand-picker .create").show().find('a:eq(0)').text(q);
    }
  },
  onSelectColor: function(e){
    e.preventDefault();
    function capfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    var color = $(e.target).hide().attr('data-color');
    $("<span class='selected'>"+capfirst(color)+"<a href='#' class='btn-del'>Remove</a></span>").attr('data-color', color).insertBefore(this.$el.find(".color-picker .select-lists") );
  },
  onDeselectColor: function(e){
    e.preventDefault();
    var color = $(e.target).parent().remove().attr('data-color');
    this.$el.find(".color-picker .select-lists [data-color]").filter(function() { return $(this).attr("data-color") == color; }).show();
  },
  onTogglePreorder: function(event) {
    if($(event.currentTarget).prop('checked')) {
      $('.wrapper.add-preorder').show();
    } else {
      $('.wrapper.add-preorder').hide();
    }
  },
  syncPrice: function() {
    this.model.set('price', (this.$el.find('input[name=price]').val() || "").trim().replace(/,/g, ''));
  },
  syncRetailPrice: function() {
    this.model.set('retail_price', (this.$el.find('input[name=retail-price]:visible').val() || "").trim().replace(/,/g, ''));
  },
  syncSellerSKU: function() {
    this.model.set('seller_sku', (this.$el.find('input[name=seller_sku]').val() || "").trim());
  },
  syncTax: function() {
    var $chargeTaxButton = this.$el.find("input#check-charge-tax");
    var chargeTax = $chargeTaxButton.prop("checked");
    if (chargeTax) {
      if (this.$el.find(".tax-cloud-view input").length) {
        this.model.set('tax_code', this.$el.find(".tax-cloud-view input").val().trim());
      } else {
        this.model.set('tax_code', this.$el.find(".tax-cloud-view select").val().trim());
      }
    } else {
      this.model.set('tax_code', null);
    }
  },
  syncRibbonThreshold: function(){
    var scarcity_ribbon_threshold = null;
    if (this.$el.find("#show_scarcity").is(":checked")) {
      scarcity_ribbon_threshold = parseInt(this.$el.find('label[for=show_scarcity] > span').text());
      if (!scarcity_ribbon_threshold) {
        scarcity_ribbon_threshold = 'null';
      }
    }
    this.model.set('scarcity_ribbon_threshold', scarcity_ribbon_threshold);
  },

  syncColors: function() {
    this.model.set('colors', Array.prototype.slice.apply($("span.selected[data-color]").map(function(){return $(this).attr('data-color')})) || []);
  },
  syncBrand: function() { 
    var $selected = this.$el.find('.brand-picker span.selected');
    if ($selected.length == 0) return;
    var brand = this.$el.find('.brand-picker span.selected').text() || '';
    if(brand == 'Select Brand') brand = '';
    this.model.set('brand', brand.trim()); 
  },
  syncWeight: function() { this.model.set('weight', (this.$el.find('input[name=weight]').val() || "").trim()); },
  syncWidth: function() { this.model.set('width', (this.$el.find('input[name=width]').val() || "").trim()); },
  syncLength: function() { this.model.set('length', (this.$el.find('input[name=length]').val() || "").trim()); },
  syncHeight: function() { this.model.set('height', (this.$el.find('input[name=height]').val() || "").trim()); },
  
  syncPersonalizable: function() { this.model.set('personalizable', this.$el.find('input[name=personalizable]').is(":checked")); },
  syncIsPreorder: function() {
    var $is_preorder = this.$el.find('#is_preorder');
    if ($is_preorder.length > 0) {
      this.model.set('is_preorder', $is_preorder.prop('checked') ? true : false);
    } else {
      //this.model.set('is_preorder', null); // skip
    }
  },
  syncUnitCost: function(){
    if( this.$el.find('input[name=unit-cost]').length )
      this.model.set('unit_cost', (this.$el.find('input[name=unit-cost]').val() || '').trim()); 
  },
  syncFancyFee: function(){
    if( this.$el.find('input[name=fancy-fee]').length )
      this.model.set('fancy_percentage', (this.$el.find('input[name=fancy-fee]').val() || "").trim()); 
  },
  syncAvaTax: function() {
    var $t = this.$el.find('input[name=avalara-tax-code]');
    if ($t.is(":visible")) this.model.set('avalara_tax_code', $t.val());
  },
  syncModel: function() {
    this.syncPrice();
    this.syncRetailPrice();
    this.syncSellerSKU();
    this.syncTax();
    this.syncRibbonThreshold();
    this.syncColors();
    this.syncWeight();
    this.syncWidth();
    this.syncLength();
    this.syncHeight();
    this.syncPersonalizable();
    this.syncBrand();
    this.syncIsPreorder();
    this.syncUnitCost();
    this.syncFancyFee();
    this.syncAvaTax();
  },
  syncView: function() {
    var that = this;
    
    this.$el.find("input[name=price]").val(this.model.get('price_original'));
    this.$el.find("input[name=retail-price]").val(this.model.get('retail_price'));
    this.$el.find("input[name=price]").attr('readonly', this.model.is_locked_field('price'));
    this.$el.find("input[name=retail-price]").attr('readonly', this.model.is_locked_field('price'));
    if(this.model.is_locked_field('price')) this.$el.find("input[name=price], input[name=retail-price]").addClass('locked');
    else this.$el.find("input[name=price], input[name=retail-price]").removeClass('locked');
    this.$el.find("input[name=seller_sku]").val(this.model.get('seller_sku'));
    var price = this.model.get('price_original'), retail_price = this.model.get('retail_price');
    if (price && retail_price) {
      var discount = get_discount(retail_price, price);
      if (!isNaN(discount)) {
        this.$el.find("input[name=discount]").val(discount);
      }
      if( price != retail_price ){
        this.$el.find("#check-sale").click();
      }
    }

    if (this.model.get('tax_code')) {
      this.$el.find("input#check-charge-tax").prop("checked", true);
      this.$el.find(".tax-cloud-view").show();
    }
    this.$el.find("input[name='avalara-tax-code']").val(this.model.get('avalara_tax_code'));
    
    var scarcity_ribbon_threshold = this.model.get('scarcity_ribbon_threshold');
    if (!scarcity_ribbon_threshold) {
      this.$el.find('input#show_scarcity').prop('checked', false);
      this.$el.find('label[for=show_scarcity] > span').text('');
    } else {
      this.$el.find('input#show_scarcity').prop('checked', true);
      this.$el.find('label[for=show_scarcity] > span').text(scarcity_ribbon_threshold);
    }

    function capfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    that.$el.find(".color-picker > span.selected").remove();
    $(this.model.get('colors')).each(function(){
      $("<span class='selected'>"+capfirst(this)+"<a href='#' class='btn-del'>Remove</a></span>").attr('data-color', this).insertBefore(that.$el.find(".color-picker .select-lists") );
      that.$el.find(".color-picker .select-lists [data-color]").filter(function() { return $(this).attr("data-color") == this; }).hide();
    })
    
    this.$el.find("input[name='weight']").val(this.model.get('weight'));
    this.$el.find("input[name='width']").val(this.model.get('width'));
    this.$el.find("input[name='length']").val(this.model.get('length'));
    this.$el.find("input[name='height']").val(this.model.get('height'));
    
    this.$el.find("input[name='weight']").attr('readonly',this.model.is_locked_field('weight'));
    if(this.model.is_locked_field('weight')) this.$el.find("input[name='weight']").addClass('locked');
    else this.$el.find("input[name='weight']").removeClass('locked');

    if(this.model.get('brand'))
      this.$el.find(".brand-picker span.selected").text(this.model.get('brand'));
    this.$el.find("input[name='personalizable']").prop('checked', this.model.get('personalizable'));

    if(this.model.get('brand') || this.model.get('colors').length ){
      this.$el.find("._advanced_options .btn-switch").addClass('on').end().find(".details .color, .details .brand").show();
    }

    this.$el.find("._show_scarcity").show();

    if (this.model.get('is_preorder')) {
      this.$el.find('input#is_preorder').prop('checked', true);
      $('.wrapper.add-preorder').show();
    } else {
      $('.wrapper.add-preorder').hide();
    }

  },
  initialize: function() {
    $(".popup.edit_brand").on('create:brand', $.proxy(this.onCreateBrand,this));
    $(".popup.edit_brand").on('edit:brand', $.proxy(this.onEditBrandProc,this));
  },
  render: function() {
    if (this.model.id) {
      this.syncView();
    }
    return this;
  },
});

FancyBackbone.Views.Product.PriceInventoryView = Backbone.View.extend({
  events: {
    'keyup input[name=price]': 'onPriceChage',
    'keyup input[name=retail_price]': 'onPriceChage',
    'click  .sync #sync_qty': 'onSyncQtyChange',
  },
  onPriceChage: function(event) {
    var price = this.$el.find('input[name=price]').val();
    var retail_price = this.$el.find('input[name=retail_price]').val();

    if(price && isNaN(price)){
      this.$el.find("[name=price]").closest('p').addClass("error");
      return;
    }else{
      this.$el.find("[name=price]").closest('p').removeClass("error");
    }
    if(!retail_price || isNaN(retail_price)){
      this.$el.find("[name=retail_price]").closest('p').addClass("error");
      return;
    }else{
      this.$el.find("[name=retail_price]").closest('p').removeClass("error");
    }

    var price = parseFloat(price);
    var retail_price = parseFloat(retail_price);

    var discount = get_discount(retail_price, price);
    if(discount>0 && this.model.get('options').length==0){
      this.$el.find("[name=price]").next().show().html(discount+"% OFF");
    }else{
      this.$el.find("[name=price]").next().hide().html("% OFF");
    }
  },
  onSyncQtyChange: function(event){
    var $this = $(event.target);
    $this.toggleClass('on');
    if($this.hasClass('on')){
      $this.closest('.sync').find('input').attr('disabled','disabled');
    }else{
      $this.closest('.sync').find('input').removeAttr('disabled');
    }
  },
  syncPrice: function() {
    var price = this.$el.find('input[name=price]').val();
    var retail_price = this.$el.find('input[name=retail_price]').val();
    if(!price){
      price = retail_price;
    }
    if(!isNaN(price)) price = (parseFloat(price)).toFixed(2);
    if(!isNaN(retail_price)) retail_price = (parseFloat(retail_price)).toFixed(2);

    if(this.model.get('options').length){
      price = (parseFloat(this.model.get('options').models[0].get('price'))).toFixed(2);
      retail_price = (parseFloat(this.model.get('options').models[0].get('retail_price'))).toFixed(2);
    }
    this.model.set('price', price || "");
    this.model.set('price_original', price || "");
    this.model.set('retail_price', retail_price  || "");
  },
  syncQuantity: function() {
    var quantity_value = this.$el.find('input[name=quantity]').val();
    if(quantity_value!==''){
      this.model.set('quantity', parseInt((this.$el.find('input[name=quantity]').val() || "0").trim()) + (this.model.get('num_sold')||0) + "" );  
    }else{
      this.model.set('quantity', null);
    }

    this.model.set('sync_quantity_with_warehouse', this.$el.find('.sync button').hasClass('on') );
    
  },
  syncUnitCost: function(){
    if( this.$el.find('input[name=unit-cost]').length )
      this.model.set('unit_cost', (this.$el.find('input[name=unit-cost]').val() || '').trim()); 
  },
  syncFancyFee: function(){
    if( this.$el.find('input[name=fancy-fee]').length )
      this.model.set('fancy_percentage', (this.$el.find('input[name=fancy-fee]').val() || "").trim()); 
  },
  syncModel: function() {
    this.syncPrice();
    this.syncQuantity();
    this.syncUnitCost();
    this.syncFancyFee();
  },
  syncView: function() {
    var that = this;

    var price = parseFloat(this.model.get('price')+"");
    var original_price = parseFloat(this.model.get('price_original')+"");
    var retail_price = parseFloat(this.model.get('retail_price')+"") || original_price || price;
    
    this.$el.find("input[name=retail_price]").val(retail_price);
    if(retail_price && retail_price > price){
      this.$el.find("input[name=price]").val(price).trigger('keyup');
    }else{
      this.$el.find("input[name=price]").val('').trigger('keyup');
    }
    this.$el.find("input[name=price]").attr('readonly', this.model.is_locked_field('price'));
    this.$el.find("input[name=retail_price]").attr('readonly', this.model.is_locked_field('price'));
    if(this.model.is_locked_field('price')) this.$el.find("input[name=price], input[name=retail_price]").addClass('locked');
    else this.$el.find("input[name=price], input[name=retail_price]").removeClass('locked');
    var discount = parseFloat(this.model.get('discount_override'));
    if (!isNaN(discount) && discount > 0) {
        $('ul.discount-override').show();
        $('span#discount_override').text(discount.toFixed(2));
        $("span#discount_override_status").text(this.model.get('discount_override_valid') ? "in effect" : "inactive");
        var s = this.model.get('discount_start_date'), e = this.model.get('discount_end_date');
        var fmt = Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short'})
        if (s) {
            $("#discount_start_date").show().text("Starts at " + fmt.format(new Date(s + "Z")));
        } else {
            $("#discount_start_date").hide();
        }
        if (e) {
            $("#discount_end_date").show().text("Ends at " + fmt.format(new Date(e + "Z")));
        } else {
            $("#discount_end_date").hide();
        }
        var fp = this.model.get('discount_fancy_percentage');
        if (fp) {
            $("#discount_fancy_percentage").show().text("Fancy Fee " + parseFloat(fp).toFixed(4) + " applied during discount.");
        } else {
            $("#discount_fancy_percentage").hide();
        }
    } else {
        $('ul.discount-override').hide();
    }

    var qty_value = this.model.get('quantity');
    if(this.model.get('options').length>0) {
        // there are options
        var total_quantities = this.model.get('real_available');
        this.$el.find("input[name=quantity]").val(total_quantities == null ? '' : total_quantities);
        if(this.model.get('sync_quantity_with_warehouse')){
          this.$el.find('.sync button').addClass('on');
          this.$el.find("input[name=quantity]").prop('disabled',true);
        }else{
          this.$el.find('.sync button').removeClass('on');
          this.$el.find("input[name=quantity]").prop('disabled',true);
        }
        this.$el.find("input[name=price], input[name=retail_price]").val('').prop('disabled',true).attr('placeholder', 'Uses option prices');
    } else {
        // there is no option
        if(qty_value==null || typeof(qty_value)=='string' && qty_value.toLowerCase().startsWith('inf')) {
            this.$el.find("input[name=quantity]").val('');
        } else {
            this.$el.find("input[name=quantity]").val( Math.max(0,qty_value-(this.model.get('num_sold')||0)));
        }
        this.$el.find("input[name=quantity]").attr('readonly', this.model.is_locked_field('quantity'));
    }
    if(this.model.is_locked_field('quantity')) this.$el.find("input[name=quantity]").addClass('locked');
    else this.$el.find("input[name=quantity]").removeClass('locked');
  },
  initialize: function() {
  },
  render: function() {
    if (this.model.id) {
      this.syncView();
    }
    return this;
  },
});

FancyBackbone.Views.Product.AdvancedDetailsView = Backbone.View.extend({
  events: {
    'change input#check-charge-tax': 'onChangeChargeTaxesButton',
    'click .edit-ribbon-threshold': 'onClickEditRibbonThreshold',
    'click ul[name=color] a[data-color]': 'onSelectColor',
    'click .color-picker a.btn-del': 'onDeselectColor',
    'change input#is_preorder': 'onTogglePreorder',
    'click .brand-picker a.add': 'onAddBrand',
    'click .brand-picker .create a:not(.add)': 'onAddBrand',
    'click .brand-picker li a[data-brand]': 'onSelectBrand',
    'click .brand-picker li a.edit': 'onEditBrand',
    'keyup .brand-picker .search input': 'onSearchBrand',
  },
  
  onChangeChargeTaxesButton: function() {
    var $chargeTaxButton = this.$el.find("input#check-charge-tax");
    var chargeTax = $chargeTaxButton.prop("checked");
    if (chargeTax) {
      this.$el.find(".tax-cloud-view").show();
    } else {
      this.$el.find(".tax-cloud-view").hide();
      this.$el.find("#ticComplete .navlink").click();
    }
  },
  onClickEditRibbonThreshold: function(){
    window.popups.editLowStockThreshold.open(this.model);
  },
  onCreateBrand: function(e, brand){
    var $el = this.$el.find(".brand-picker");
    var $li = $el.find(".lists ul a[data-brand='"+brand+"']");
    if(!$li[0]){
      $el.find(".lists ul").append('<li><a href="#" data-brand="'+brand+'" >'+brand+'</a><a href="#" class="edit"><em>Edit Brand</em></a></li>')
    }
    $el.find(".lists ul a[data-brand='"+brand+"']").click();
  },
  onEditBrandProc: function(e, prev_brand, brand){
    if(prev_brand && prev_brand == brand) return;
    var $el = this.$el.find(".brand-picker");
    $.ajax({
      type : 'POST',
      url  : '/merchant/products/edit-brand.json',
      data : {brand:prev_brand, new_brand:brand},
      dataType : 'json',
      success  : function(result){
        if(brand){
          $el.find(".lists ul a[data-brand='"+prev_brand+"']").attr('data-brand', brand).text(brand);
          if( $el.find("span.selected").text()==prev_brand){
            $el.find("span.selected").text(brand);
          }
        }else{
          $el.find(".lists ul a[data-brand='"+prev_brand+"']").closest('li').remove();
          if( $el.find("span.selected").text()==prev_brand){
            $el.find("span.selected").text('Select Brand');
          }
        }
      }
    });
  },
  onAddBrand: function(e){
    e.preventDefault();
    var $el = $(e.target);

    if( $el.parent().is(".create") ){
      var brand = $el.parent().find("a:eq(0)").text();
      this.onCreateBrand(e, brand);
      $el.closest('.select-lists').find(".search input").val('').trigger('keyup');
    }else{
      $el.closest('.select-lists').hide();
      $.dialog('edit_brand').$obj
        .find("#edit_title, .btn-delete").hide().end()
        .find("#create_title").show().end()
        .find("input").val('');
      $.dialog('edit_brand').open();  
    }
    
  },
  onSelectBrand: function(e){
    e.preventDefault();
    if( $(e.target).hasClass('selected') ){
      $(e.target).removeClass('selected').closest('.brand-picker').find("span.selected").text('Select Brand');
    }else{
      $(e.target)
        .closest('ul').find("a.selected").removeClass("selected").end().end()
        .addClass('selected').closest('.select-lists').hide();
      var brand = $(e.target).attr('data-brand');
      $(e.target).closest('.brand-picker').find("span.selected").text(brand);
    }
  },
  onEditBrand: function(e){
    var brand = $(e.target).prev().attr('data-brand');
    $(e.target).closest('.select-lists').hide();
    $.dialog('edit_brand').$obj
      .find("#edit_title, .btn-delete").show().end()
      .find("#create_title").hide().end()
      .find("input").val(brand);
    $.dialog('edit_brand').open();
  },
  onSearchBrand: function(e){
    var q = $(e.target).val();
    var ql = q.toLowerCase();
    var exists = false;
    this.$el.find(".brand-picker")
      .find(".lists ul li").show().each(function(){
        var name = $(this).find("a").attr('data-brand').toLowerCase();
        if( name.indexOf(ql) == -1) $(this).hide();
        if( name == ql ) exists = true;
      })

    if( exists || !q){
      this.$el.find(".brand-picker .create").hide();
    }else{
      this.$el.find(".brand-picker .create").show().find('a:eq(0)').text(q);
    }
  },
  onSelectColor: function(e){
    e.preventDefault();
    function capfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    var color = $(e.target).hide().attr('data-color');
    $("<span class='selected'>"+capfirst(color)+"<a href='#' class='btn-del'>Remove</a></span>").attr('data-color', color).insertBefore(this.$el.find(".color-picker .select-lists") );
  },
  onDeselectColor: function(e){
    e.preventDefault();
    var color = $(e.target).parent().remove().attr('data-color');
    this.$el.find(".color-picker .select-lists [data-color]").filter(function() { return $(this).attr("data-color") == color; }).show();
  },
  onTogglePreorder: function(event) {
    if($(event.currentTarget).prop('checked')) {
      $('.wrapper.add-preorder').show();
    } else {
      $('.wrapper.add-preorder').hide();
    }
  },
  syncSellerSKU: function() {
    this.model.set('seller_sku', (this.$el.find('input[name=seller_sku]').val() || "").trim());
  },
  syncTax: function() {
    var $chargeTaxButton = this.$el.find("input#check-charge-tax");
    var chargeTax = $chargeTaxButton.prop("checked");
    if (chargeTax) {
      if (this.$el.find(".tax-cloud-view input").length) {
        this.model.set('tax_code', this.$el.find(".tax-cloud-view input").val().trim());
      } else {
        this.model.set('tax_code', this.$el.find(".tax-cloud-view select").val().trim());
      }
    } else {
      this.model.set('tax_code', null);
    }
  },
  syncRibbonThreshold: function(){
    var scarcity_ribbon_threshold = null;
    if (this.$el.find("#show_scarcity").is(":checked")) {
      scarcity_ribbon_threshold = parseInt(this.$el.find('label[for=show_scarcity] > span').text());
      if (!scarcity_ribbon_threshold) {
        scarcity_ribbon_threshold = 'null';
      }
    }
    this.model.set('scarcity_ribbon_threshold', scarcity_ribbon_threshold);
  },

  syncColors: function() {
    this.model.set('colors', Array.prototype.slice.apply($("span.selected[data-color]").map(function(){return $(this).attr('data-color')})) || []);
  },
  syncBrand: function() { 
    var $selected = this.$el.find('.brand-picker span.selected');
    if ($selected.length == 0) return;
    var brand = this.$el.find('.brand-picker span.selected').text() || '';
    if(brand == 'Select Brand') brand = '';
    this.model.set('brand', brand.trim()); 
  },
  syncWeight: function() { this.model.set('weight', (this.$el.find('input[name=weight]').val() || "").trim()); },
  syncWidth: function() { this.model.set('width', (this.$el.find('input[name=width]').val() || "").trim()); },
  syncLength: function() { this.model.set('length', (this.$el.find('input[name=length]').val() || "").trim()); },
  syncHeight: function() { this.model.set('height', (this.$el.find('input[name=height]').val() || "").trim()); },
  syncGTIN: function() { this.model.set('gtin', (this.$el.find('input[name=gtin]').val() || "").trim()); },
  
  syncPersonalizable: function() { this.model.set('personalizable', this.$el.find('input[name=personalizable]').is(":checked")); },
  syncIsPreorder: function() {
    var $is_preorder = this.$el.find('#is_preorder');
    if ($is_preorder.length > 0) {
      this.model.set('is_preorder', $is_preorder.prop('checked') ? true : false);
    } else {
      //this.model.set('is_preorder', null); // skip
    }
  },
  syncUnitCost: function(){
    if( this.$el.find('input[name=unit-cost]').length )
      this.model.set('unit_cost', (this.$el.find('input[name=unit-cost]').val() || '').trim()); 
  },
  syncFancyFee: function(){
    if( this.$el.find('input[name=fancy-fee]').length )
      this.model.set('fancy_percentage', (this.$el.find('input[name=fancy-fee]').val() || "").trim()); 
  },
  syncAvaTax: function() {
    var $t = this.$el.find('input[name=avalara-tax-code]');
    if ($t.is(":visible")) this.model.set('avalara_tax_code', $t.val());
  },
  
  syncModel: function() {
    this.syncSellerSKU();
    this.syncTax();
    this.syncRibbonThreshold();
    this.syncColors();
    this.syncWeight();
    this.syncWidth();
    this.syncLength();
    this.syncHeight();
    this.syncGTIN();
    this.syncPersonalizable();
    this.syncBrand();
    this.syncIsPreorder();
    this.syncUnitCost();
    this.syncFancyFee();
    this.syncAvaTax();
  },
  syncView: function() {
    var that = this;
    
    this.$el.find("input[name=seller_sku]").val(this.model.get('seller_sku'));
    this.$el.find("input[name=gtin]").val(this.model.get('gtin'));
    
    if (this.model.get('tax_code')) {
      this.$el.find("input#check-charge-tax").prop("checked", true);
      this.$el.find(".tax-cloud-view").show();
    }
    var scarcity_ribbon_threshold = this.model.get('scarcity_ribbon_threshold');
    if (!scarcity_ribbon_threshold) {
      this.$el.find('input#show_scarcity').prop('checked', false);
      this.$el.find('label[for=show_scarcity] > span').text('');
    } else {
      this.$el.find('input#show_scarcity').prop('checked', true);
      this.$el.find('label[for=show_scarcity] > span').text(scarcity_ribbon_threshold);
    }

    function capfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    that.$el.find(".color-picker > span.selected").remove();
    $(this.model.get('colors')).each(function(){
      $("<span class='selected'>"+capfirst(this)+"<a href='#' class='btn-del'>Remove</a></span>").attr('data-color', this).insertBefore(that.$el.find(".color-picker .select-lists") );
      that.$el.find(".color-picker .select-lists [data-color]").filter(function() { return $(this).attr("data-color") == this; }).hide();
    })
    
    this.$el.find("input[name='avalara-tax-code']").val(this.model.get('avalara_tax_code'));
    
    this.$el.find("input[name='weight']").val(this.model.get('weight'));
    this.$el.find("input[name='width']").val(this.model.get('width'));
    this.$el.find("input[name='length']").val(this.model.get('length'));
    this.$el.find("input[name='height']").val(this.model.get('height'));
    
    this.$el.find("input[name='weight']").attr('readonly',this.model.is_locked_field('weight'));
    if(this.model.is_locked_field('weight')) this.$el.find("input[name='weight']").addClass('locked');
    else this.$el.find("input[name='weight']").removeClass('locked');

    if(this.model.get('brand'))
      this.$el.find(".brand-picker span.selected").text(this.model.get('brand'));
    this.$el.find("input[name='personalizable']").prop('checked', this.model.get('personalizable'));

    if (this.model.get('is_preorder')) {
      this.$el.find('input#is_preorder').prop('checked', true);
      $('.wrapper.add-preorder').show();
    } else {
      $('.wrapper.add-preorder').hide();
    }

  },
  initialize: function() {
    $(".popup.edit_brand").on('create:brand', $.proxy(this.onCreateBrand,this));
    $(".popup.edit_brand").on('edit:brand', $.proxy(this.onEditBrandProc,this));
  },
  render: function() {
    if (this.model.id) {
      this.syncView();
    }
    return this;
  },
});

FancyBackbone.Views.Product.PreorderView = Backbone.View.extend({
  events: {
    'keyup input[name=deposit_percentage]': 'onPercentageChage',
  },
  onPercentageChage: function(event) {
    var percentage = parseFloat($(event.currentTarget).val());
    var price = parseFloat($('input[name=price]').val());

    if (!isNaN(percentage)) {
    if (percentage > 100) {
      percentage = 100;
      $(event.currentTarget).val(percentage);
    }
      if (!isNaN(price)) {
          $('input[name=deposit_amount]').val((price * percentage / 100).toFixed(2));
      } 
    } else {
      $('input[name=deposit_amount]').val('');
    }
  },
  syncView: function() { 
      var preorder = this.model.get('preorder'); 
    if (preorder) {
      var percentage = preorder.deposit_percentage; 
      var price = parseFloat($('input[name=price]').val());
      if (!isNaN(percentage) && !isNaN(price)) {
        this.$el.find('input[name=deposit_amount]').val((price * percentage / 100).toFixed(2));
        this.$el.find('input[name=deposit_percentage]').val(percentage);
      }
    } else {
      this.$el.find('input[name=deposit_amount]').val('');
      this.$el.find('textarea[name=preorder_description]').val('');
      this.$el.find('input[name=deposit_percentage]').val('');
    }
  },

  syncModel: function() { 
    var id_list = []; 
    var deposit_percentage = parseFloat(this.$el.find('input[name=deposit_percentage]').val());
    var description = this.$el.find('textarea[name=preorder_description]').val();
    if (!isNaN(deposit_percentage) && deposit_percentage > 0) {
      var preorder = {'deposit_percentage' : deposit_percentage,
              'description' : description||''}
      this.model.set('preorder', preorder); 
    } else {
      this.model.set('preorder', null); 
    }

  },
  render: function() { 
    this.syncView();
    return this;
  },
});

FancyBackbone.Views.Product.ProductOptionsNewView = Backbone.View.extend({
  events: {
    'click .opt-title .btn-add': 'onAddOptionsClick',
    'click .multiple-option-frm .options .btn-add': 'onAddOptionClick',
    'click .update_inventory a.btn-qty': 'onOptionQuantitiesClick',
    'click .update_inventory a.btn-price': 'onOptionPriceClick',
    'click .select a': 'onOptionSelectClick',
    'click .batch a' : 'onOptionBatchUpdateClick',
  },
  onAddOptionsClick: function(event) {
    event.preventDefault();
    var $target = $(event.target);
    if(this.model.is_locked_field('options')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    if( !this.$el.find('.multiple-option-frm').is(":visible") ){
      $target.hide();
      $("._price_inventory [name=price], ._price_inventory [name=retail_price]").closest('p').removeClass("error");
      this.$el.find(".multiple-option-frm").show();
      if( !this.model.get('option_meta').length ){
        this.renderOptionMeta();
        this.$el
          .find('.opt-title .btn-add').hide().end()
          .find(".added, .multiple-option-frm").show();

        this.renderOptions();
        this.updateOption();
        this.onAddOptionClick(event);
      }
    }
  },
  onAddOptionClick: function(event) {
    event.preventDefault();
    var $target = $(event.target);
    if(this.model.is_locked_field('options')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    var option_meta, meta = {name:'', type:'dropdown', values:[]};
    this.syncModel();
    option_meta = this.model.get('option_meta');
    for(var i=0; i<option_meta.length; i++){
      if(!option_meta[i].values.length){
        alertify.alert("Please provide available options for "+option_meta[i].name);
        return;
      }
    }

    option_meta.push(meta);
    this.applyAddOption(meta, '');
    this.syncView();
    
    if(option_meta.length>=3) $target.hide();
  },
  onOptionQuantitiesClick: function(event){
    event.preventDefault();
    this.syncModel();
    window.popups.optionQuantities.render(this.model.get('options'));
  },
  onOptionPriceClick: function(event){
    event.preventDefault();
    this.syncModel();
    window.popups.optionPrices.render(this.model.get('options'));
  },
  onOptionSelectClick: function(event){
    event.preventDefault();
    var type = $(event.target).data("type");
    if (type == 'expand') {
      this.$el.find(".opt").each(function() {
          $(this).data('view').expandOption(true);
      });
    } else if (type == 'collapse') {
      this.$el.find(".opt").each(function() {
        $(this).data('view').expandOption(false);
      });
    } else if (type == 'all'){
      this.$el.find(".opt .summary .selector").prop('checked', true);
    }else{
      this.$el.find(".opt .summary .selector").prop('checked', false);
    }
  },
  onOptionBatchUpdateClick: function(event){
    event.preventDefault();
    if(window.product.is_locked_field('options')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }

    var targetOptions = [], type = $(event.target).data('type');
    this.$el.find("div.opt").each(function(){
      var $this = $(this);
      if($this.find("input.selector").prop("checked")){
        targetOptions.push( $this.data('model') );
      }
    })
    if(!targetOptions.length){
      var typelabel = type+'s';
      if(type=='quantity') typelabel = 'quantities';
      alertify.alert("Please select variants to batch update "+typelabel+".");
      return;
    }
    this.syncModel();
    window.popups.optionBatchUpdate.render(type, targetOptions);
  },
  getNullCheckedValue: function(val, length_check, null_value) {
    if (val == null || val == 'None') {
        return null_value?null_value:'-';
    }
    if (length_check && val.length <= 0) {
        return null_value?null_value:'-';
    }
    return val;
  },
  updateOptionAddButton: function() { 
    if(this.model.get('options').length > 0) { 
      this.$el
        .find("input[name=quantity]").attr('readonly','true').end()

    } else { 
      if(!this.model.is_locked_field('quantity')) {
        this.$el.find("input[name=quantity]").removeAttr('readonly').removeClass('locked');
      }else{
        this.$el.find("input[name=quantity]").addClass('locked');
      }
    }

    if(this.model.get('option_meta').length){
      this.$el
        .find('.opt-title .btn-add').hide().end()
        .find(".multiple-option-frm").show();
      
      var placeholders = {0: 'Size', 1:'Color', 2:'Style'};
      this.$el.find(".multiple-option-frm .options p.title input").each(function(i,v){
        $(v).attr('placeholder', placeholders[i]||'');
      })
    }else{
      this.$el
        .find('.opt-title .btn-add').show().end()
        .find(".multiple-option-frm").hide();
    }

    if(this.model.get('options').length>0) {
      this.$el
        .find(".added h4 > span, .detail").show();
    }else{
      this.$el
        .find(".added h4 > span, .detail").hide();
    }

    var optionCount = this.$el.find(".added .detail > div.opt:not(.add)").length;

    if(optionCount){
      this.$el.find(".added h4 b").html("<span class='count'>"+optionCount+"</span> Product Variant"+(optionCount>1?"s":""));
    }else{
      this.$el.find(".added h4 b").html("Type an option title and values above");
    }
  }, 
  updateOption: function(event){
    var qty = 0;
    this.model.get('options').each(function(v){
      if(v.get('quantity')==null || v.get('quantity')==='') {
          qty = '';
      } else {
          qty += (parseInt(v.get('quantity'))||0) ;
      }
    },this);
    $("._price_inventory input[name=quantity]").val(qty);
    if(this.model.get('options').length){
      $("._price_inventory").find("input[name=price], input[name=retail_price]").val('').prop('disabled',true).attr('placeholder', 'Uses option prices');
    }else{
      $("._price_inventory").find("input[name=price], input[name=retail_price]").prop('disabled',false).attr('placeholder', '$');
    }
  },
  removeOptionProc: function(option) {
    if(this.model.is_locked_field('options')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    this.model.get("options").remove(option);
    if(option.get('id') && this.$el.find("div.opt[id="+option.get('id')+"]").data('view')){
      this.$el.find("div.opt[id="+option.get('id')+"]").data('view').destroy_view();
    }
    if(option.get('tid') && this.$el.find("div.opt[tid='"+option.get('tid')+"']").data('view')){
      this.$el.find("div.opt[tid='"+option.get('tid')+"']").data('view').destroy_view();
    }
  },
  removeOption: function(option) {
    this.removeOptionProc(option);
    this.organizeOptionMetaLabels();
    this.updateOptionAddButton();
    this.updateOption();
    this.renderOptionMeta();
  },
  updateOptionLabel: function(option){
    this.organizeOptionMetaLabels();
    this.syncView();
  },
  organizeOptionMetaLabels: function(){
    var option_meta = this.model.get('option_meta'), options = this.model.get('options');
    $(option_meta).each(function(i, meta){
      var targetRemove = [];
      var targetAdd = [];
      $(meta.values).each(function(_, v){
        var needRemove = true;
        options.each(function(option){
          if(option.get('values')[i] == v){
            needRemove = false;
            return false;
          }
        })
        if(needRemove) targetRemove.push(v);
      });
      options.each(function(option){
        if(option.get('values')[i] && meta.values.indexOf( option.get('values')[i] )==-1) {
          targetAdd.push( option.get('values')[i] )
        }
      })
      $(targetRemove).each(function(_, v){
        var index = meta.values.indexOf(v);
        meta.values.splice(index,1);
      })
      $(targetAdd).each(function(_, v){
        meta.values.push(v);
      })
    });
  },
  addOptionToOptionMeta: function(meta, option){
    this.syncModel();
    this.applyAddOption(meta, option);
    this.renderOptions();
    this.updateOption();
  },
  editOptionFromOptionMeta: function(meta, option, before){
    this.applyEditOption(meta, option, before);
  },
  sortOptionFromOptionMeta: function(meta){
    this.syncModel();
    var index = this.model.get('option_meta').indexOf(meta);
    var option_meta = this.model.get('option_meta');
    var options = this.model.get('options');

    options.comparator = function(model){
      var idx = 0;
      for(var i=0; i<option_meta.length; i++){
        var values = option_meta[i].values;
        idx +=  ((values.indexOf( model.get('values')[i] ) + 1) * Math.pow(100,i+1) );
      }
      return idx;
    }
    options = options.sort()
    this.renderOptions();
  },
  removeOptionFromOptionMeta: function(meta, option){
    this.applyRemoveOption(meta, option);
  },
  updateOptionMeta: function(meta){
    var option_meta = this.model.get('option_meta');
    var meta_index = option_meta.indexOf(meta);
    option_meta[meta_index] = meta;
    this.model.set('option_meta', option_meta);
    this.model.get('options').each(function(model){
      model.set('option_meta', this.model.get('option_meta'));
    }, this)
    this.renderOptions();
    this.updateOption();
  },
  removeOptionMeta: function(meta) {
    if(this.model.is_locked_field('options')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    var option_meta = _.clone(this.model.get('option_meta'));
    var idx = option_meta.indexOf(meta);
    option_meta.splice(idx,1);
    this.model.set('option_meta', option_meta);
    this.model.get('options').each(function(model){
      model.get('values').splice(idx,1);
      model.set('option_meta', this.model.get('option_meta'));
    }, this)
    this.removeDuplicatedOption();
    this.model.set('option_meta', option_meta);
    if(!option_meta.length){
      var targetRemove = [];
      this.model.get('options').each(function(option){
        targetRemove.push(option);
      }, this);
      var targetLength = targetRemove.length;
      for(var i=targetLength-1; i>-1; i--){
        this.removeOptionProc(targetRemove[i]);
      }
    }

    this.model.set('option_meta', option_meta);
    this.organizeOptionMetaLabels();
    this.renderOptionMeta();
    this.renderOptions();
    this.updateOption();
    this.updateOptionAddButton();
    this.$el.find(".multiple-option-frm .options .btn-add").show();
  },
  isEqualOption: function(v1, v2){
    var isEqual = true;
    if(v1.length == v2.length){
      for(var i=0; i<v1.length; i++){
        if( v1[i]!=v2[i] && v1[i] && v2[i]){
          isEqual = false;
          break;
        }
      }
    }else if(v1.length == v2.length-1){
      for(var i=0; i<v1.length; i++){
        if( v1[i]!=v2[i] && v1[i] && v2[i]){
          isEqual = false;
          break;
        }
      }
    }
    return isEqual;
  },
  createOption: function(values){
    var exists = false, name=values.join(" / ");
    this.model.get('options').each(function(model){
      if(this.isEqualOption(model.get('values'), values)){
          model.set('values', values);
          model.set('name', name);
          exists = true;
          return false;
      }
    }, this);  
    if(exists) return;

    option = new FancyBackbone.Models.Product.Option({
        name: name,
        price: this.model.get('price_original'),
        price_original: '',
        retail_price: this.model.get('retail_price')||'',
        discount_percentage: get_discount(this.model.get('retail_price'), this.model.get('price')), 
        quantity: null,
        sync_quantity_with_warehouse: false,
        color: '',
        prod_length: this.model.get('length'),
        prod_height: this.model.get('height'),
        prod_width: this.model.get('width'),
        prod_weight: this.model.get('weight'),
        unit_cost: '',
        num_sold:'',
        seller_sku: '',
        tid: escape(name),
        marked_soldout: false,
        images: [],
        values: values
    });

    this.model.get("options").add(option);
    this.updateOption();
  },
  removeDuplicatedOption: function(){
    var targetRemove = [];
    this.model.get('options').each(function(v){
      var cnt = 0;
      this.model.get('options').each(function(v2){
        if(this.isEqualOption(v.get('values'), v2.get('values'))){
          cnt++;
          if(cnt>1) targetRemove.push(v2);
        }
      },this)
      if(v.get('values').length==1 && !v.get('values')[0] && targetRemove.indexOf(v)==-1) targetRemove.push(v);
    },this)
    var targetLength = targetRemove.length;
    for(var i=targetLength-1; i>-1; i--){
      this.removeOptionProc(targetRemove[i]);
    }
  },
  applyAddOption: function(meta, option){
    var that=this, option_meta = this.model.get('option_meta'), index = option_meta.indexOf(meta);

    if(option && !this.model.get('options').length){
      this.createOption([option]);
      return;
    }
    this.model.get('options').each(function(v){
      var values = v.get('values'), _v = _.clone(values);
      if(values.length == option_meta.length) _v[index] = option;
      else _v.push(option);
      that.createOption(_v);
    })
  },
  applyEditOption: function(meta, option, before){
    var that=this, option_meta = this.model.get('option_meta'), index = option_meta.indexOf(meta);

    this.syncModel();

    this.model.get('options').each(function(v){
      var values = v.get('values');
      if(values[index] == before) values[index] = option;
    })

    this.syncView();
  },
  applyRemoveOption: function(meta, option){
    var that=this, option_meta = this.model.get('option_meta'), index = option_meta.indexOf(meta);

    this.syncModel();

    var targetRemove = [];
    this.model.get('options').each(function(v){
      var values = v.get('values');
      if(meta.values.length){
        if(values[index] == option) targetRemove.push(v);
      }else{
        if(values.length==1){
          targetRemove.push(v);
        }else{
          values[index] = '';
          v.set('values', values);
        }
      }
    })
    var targetLength = targetRemove.length;
    for(var i=targetLength-1; i>-1; i--){
      that.removeOptionProc(targetRemove[i]);
    }
    this.removeDuplicatedOption();
    
    this.syncView();
  },
  createOptionRow: function(option) {
    option.set('option_meta', this.model.get('option_meta'));
    var optionView = this.$el.find("div.opt[id="+option.get("id")+"], div.opt[tid='"+option.get("tid")+"']").data('view');
    if(!optionView){
      optionView = new FancyBackbone.Views.Product.DetailViewOptionNew({
        data: option, is_admin: this.is_admin
      });
    }else{
      if(option.get('tid')){
        option.set('tid', escape(option.get('name')));
      }
    }

    var $el = optionView.render().$el;
    $el.data('model', option); 
    $el.data('view', optionView); 
    if (option.get('id') != null)
      $el.attr('id', option.get('id')); 
    else
      $el.attr('tid', option.get('tid')); 

    this.$el.find(".detail .opt.add").before($el); 
    
    if(this.model.is_locked_field('options')) {
      $el.find('input[type="text"]').attr('readonly',true).addClass('locked');
    }else{
      $el.find('input[type="text"]').removeClass('locked');
    }

    this.updateOptionAddButton();
  },
  createOptionMeta: function(meta){
    var that = this;
    var optionVariantView = new FancyBackbone.Views.Product.OptionVariantView({
      data: meta
    });

    var $el = optionVariantView.render().$el;
    $el.data('model', meta); 
    $el.data('view', optionVariantView); 
    
    this.$el.find(".options > ul").append($el); 
    // make options sortable 
    try{
      this.$el.find(".options > ul").sortable('destroy');  
    }catch(e){}

    if(this.model.is_locked_field('options')) {
      $el.find('input[type="text"],select').attr('readonly',true).addClass('locked');
    }else{
      $el.find('input[type="text"],select').removeClass('locked');
    }

    if(this.model.get('option_meta').length > 1){
      if(this.model.is_locked_field('options')) {
        this.$el.find("a.btn-move").addClass("disabled").addClass('locked');
      } else {
        this.$el.find("a.btn-move").removeClass("disabled").removeClass('locked');
        this.$el.find(".options > ul").sortable({ 
          handle: "> a.btn-move", 
          axis:'y',
          update: function(){
            that.syncModel();
            that.syncView();
          },
          sort: function(event, ui) {
            var $target = $(event.target);
            if ($.browser.safari && parseInt(ui.helper.css('top'))<0 )  {
                var top = parseInt(ui.helper.css('top')) + $(window).scrollTop();
                ui.helper.css({'top' : top + 'px'});
            }
          },
        })
      }
    }else{
      this.$el.find("a.btn-move").addClass("disabled");
    }
    this.updateOptionAddButton();
  },
  syncModel: function() {
    var option_meta = [];
    this.$el.find('.options > ul > li').each(function(){
      $(this).data('view').syncModel();
      option_meta.push($(this).data('model'));
    })
    this.model.set('option_meta', option_meta);

    this.model.get('options').each(function(v){
      var selector = "";

      if( v.get('id') ) selector = "div.opt[id='"+v.get('id')+"']";
      if( v.get('tid')) selector = "div.opt[tid='"+v.get('tid')+"']"; 
      var $el = this.$el.find(selector);
      if(!$el[0]){
        selector = "div.opt[tid='"+escape(v.get('name'))+"']";
        $el = this.$el.find(selector);
      }
      if($el[0]){
        $el.data('view').syncModel();
        v = $el.data('model');
        v.set('position', $el.prevAll('div.opt').length+1);
      }
      var newValues = [], values = v.get('values');
      newValues.length = option_meta.length;
      newValues.fill('');
      $(option_meta).each(function(i2,v2){
        $(v.get('option_meta')).each(function(i,v){
          if(v2 == v){
            newValues[i2] = values[i];
            return false;
          }
        })
      });
      v.set('option_meta', option_meta);
      v.set('values', newValues);
      v.set('name', newValues.join(" / "));

    },this);
  },
  renderOptionMeta: function(){
    var self = this;
    var option_meta = this.model.get('option_meta'), options = this.model.get('options');
    if(!option_meta.length && options.length){
      var defaultMeta = {name:'Option', type:'dropdown', values:[]};
      this.model.get('options').each(function(v){
        defaultMeta.values.push( v.get('name') );
      })
      option_meta.push(defaultMeta);
      this.model.set('option_meta', option_meta);
    }
    this.$el.find(".options > ul").empty();
    $(option_meta).each(function(i, meta){
      self.createOptionMeta(meta);
    });
    if(option_meta.length >= 3){
      this.$el.find(".multiple-option-frm .options .btn-add").hide();
    }else{
      this.$el.find(".multiple-option-frm .options .btn-add").show();
    }
  },
  renderOptions: function(){
    var that = this;
    if(!this.$el.find(".added .detail div.add").length){
      var optionAddView = new FancyBackbone.Views.Product.DetailViewOptionAdd({
        data: this.model
      });
      var $el = optionAddView.render().$el;
      $el.data('view', optionAddView); 
      this.$el.find(".detail").append($el); 
    }else{
      this.$el.find(".added .detail div.add").data('view') && this.$el.find(".added .detail div.add").data('view').render();
    }

    this.$el.find(".added .detail div.opt:not(.add)").each(function(){
      var exists=false, $el=$(this);
      that.model.get('options').each(function(option){
        if( $el.data('model')===option ){
          exists = true;
        }
      });
      if(!exists) $el.data('view') && $el.data('view').destroy_view();
    });
    console.time('rowall')

    this.model.get('options').each(function(option){
      console.time('row')
      this.createOptionRow(option);
      console.timeEnd('row')
    }, this);

    console.timeEnd('rowall')

  },
  syncView: function() {
    if(this.model.get('option_meta').length || this.model.get('options').length>0){
      this.renderOptionMeta();
    
      if(this.model.get('option_meta').length){
        this.$el
          .find('.opt-title .btn-add').hide().end()
          .find(".added, .multiple-option-frm").show();
      }else{
        this.$el
          .find('.opt-title .btn-add').show().end()
          .find(".added, .multiple-option-frm").hide();
      }

      if(this.model.get('options').length>0) {
        this.$el
          .find(".added h4 > span, .detail").show();
      }else{
        this.$el
          .find(".added h4 > span, .detail").hide();
      }
      this.renderOptions();
      this.updateOption();
    }
  },
  initialize: function(options) {
    this.listenTo(FancyBackbone.App.eventAggregator,'update:saleitemoption', _.bind(this.updateOption, this));
    this.listenTo(FancyBackbone.App.eventAggregator,'delete:saleitemoption', _.bind(this.removeOption, this));
    this.listenTo(FancyBackbone.App.eventAggregator,'updatelabel:saleitemoption', _.bind(this.updateOptionLabel, this));
    this.listenTo(FancyBackbone.App.eventAggregator,'addoption:optionmeta', _.bind(this.addOptionToOptionMeta, this));
    this.listenTo(FancyBackbone.App.eventAggregator,'editoption:optionmeta', _.bind(this.editOptionFromOptionMeta, this));
    this.listenTo(FancyBackbone.App.eventAggregator,'sortoption:optionmeta', _.bind(this.sortOptionFromOptionMeta, this));
    this.listenTo(FancyBackbone.App.eventAggregator,'removeoption:optionmeta', _.bind(this.removeOptionFromOptionMeta, this));
    this.listenTo(FancyBackbone.App.eventAggregator,'update:optionmeta', _.bind(this.updateOptionMeta, this));
    this.listenTo(FancyBackbone.App.eventAggregator,'delete:optionmeta', _.bind(this.removeOptionMeta, this));
    this.listenTo(FancyBackbone.App.eventAggregator,'syncView:saleitemoption', _.bind(this.syncView, this));
    this.is_admin = options.is_admin;
  },
  render: function() {
    var that = this;
    if (this.model.id) {
      this.syncView();
    }

    return this;
  },
});

FancyBackbone.Views.Product.OptionVariantView = Backbone.View.extend({
  tagName: 'li',
  className: '',
  template: FancyBackbone.Utils.loadTemplate("product_option_variant"),
  events: {
    'change  select[name=type]': 'onChange',
    'focus   .title input:text': 'onTitleFocus',
    'keyup   .title input:text': 'onTitleChange',
    'blur   .title input:text': 'onChange',
    'click   .option': 'onLabelClick',
    'click   .selected a.tooltip': 'onEditShowClick',
    'blur  .option .option-picker .select-lists input:text': 'onOptionInputBlur',
    'keydown  .option .option-picker .select-lists input:text': 'onOptionInputKeydown',
    'click .selected .btn-del': 'onLabelRemoveClick',
    'keydown  .selected .rename-frm input:text': 'onLabelRenameKeydown',
    'click .selected .rename-frm .btn-rename': 'onLabelRenameClick',
    'click > .btn-del': 'onRemoveClick',
    'click .color .add': 'onColorAddLayerClick',
    'click .color .btn-swatch-save': 'onColorSaveClick',
    'click .thumbnail .add': 'onThumbnailAddLayerClick',
    'click .thumbnail .btn-thumbnail-save': 'onThumbnailSaveClick',
  },
  onTitleFocus: function(event){
    $(event.target).closest('.title').find('.tooltip').show();
  },
  onTitleChange: function(event){
    var label = $(event.target).val();
    this.$el.find(".option label").text( (label||"Option") + " values");
    if( label ) $(event.target).closest('.title').find('.tooltip').remove();
  },
  onChange: function(event){
    var option_meta = this.option_meta;
    this.syncModel();
    if( !$(event.target).is(".title *") ) this.render();
    else{
      this.$el.find(".option label").text( (this.option_meta.name||"Option") + " values");
      if( $(event.target).val() ) $(event.target).closest('li').find('.title .tooltip').remove();
    }
    FancyBackbone.App.eventAggregator.trigger("update:optionmeta", option_meta);
  },
  onLabelClick: function(e){
    if( $(e.target).is(".selected *") || this.option_meta.type == 'swatch' || this.option_meta.type == 'thumbnail' ) return;
    event.preventDefault();
    this.$el.find('span.rename-frm').hide().end().find(".selected em").removeAttr('style');
    $(e.target).closest('.option').find('input:text').focus();
  },
  onColorAddLayerClick: function(e){
    e.preventDefault();
    this.$el.find('.selected .popup-palette').hide();
    this.$el.find('.select-lists').toggleClass('opened');
  },
  onColorSaveClick: function(event){
    event.preventDefault();
    var $frm = $(event.target).closest('.popup-palette');
    var name = $frm.find('input.paletteLabel').val();
    var code = $frm.find('input.sp-input').val();
    var prevname;
    if(!name){
      alertify.alert('Please type a label for this swatch.');
      return;
    }
    if( $frm.closest('.selected[data-id]').length ){
      prevname = $(event.target).closest('.selected').data('id');
    }

    var option_meta = this.option_meta;
    if(prevname!=name && option_meta.values.indexOf(name)>-1){
      alertify.alert("There's an option with the same name. Please check the option name.");
      return;
    }

    if( $frm.closest('.selected[data-id]').length ){
      if(prevname!=name){
        var index = option_meta.values.indexOf(prevname);
        option_meta.values[index] = name;
        if(option_meta.swatch[prevname]) delete option_meta.swatch[prevname];
      }
      option_meta.swatch[name] = code;

      this.syncModel();
      FancyBackbone.App.eventAggregator.trigger("editoption:optionmeta", option_meta, name, prevname);
      $(event.target).closest('.selected').remove();
    }else{
      $frm.find('input.paletteLabel').val('');
      option_meta.values.push(name);
      if(!option_meta.swatch) option_meta.swatch = {};
      option_meta.swatch[name] = code;
      this.syncModel();
      FancyBackbone.App.eventAggregator.trigger("addoption:optionmeta", option_meta, name);
      this.render();
    }
  },
  onThumbnailAddLayerClick: function(e){
    e.preventDefault();
    this.$el.find('.selected .popup-thumb').hide();
    this.$el.find('.select-lists').toggleClass('opened');
  },
  onThumbnailSaveClick: function(event){
    event.preventDefault();
    var $frm = $(event.target).closest('.popup-thumb');
    var name = $frm.find('input:text').val();
    var image_url = $frm.find('.figure').data('image_url');
    var prevname;
    if(!name){
      alertify.alert('Please add a thumbnail label.');
      return;
    }
    if(!image_url){
      alertify.alert('Please upload an image.');
      return;
    }
    if( $frm.closest('.selected[data-id]').length ){
      prevname = $(event.target).closest('.selected').data('id');
    }
    var option_meta = this.option_meta;
    if(prevname!=name && option_meta.values.indexOf(name)>-1){
      alertify.alert("There's an option with the same name. Please check the option name.");
      return;
    }

    if( $frm.closest('.selected[data-id]').length ){
      if(prevname!=name){
        var index = option_meta.values.indexOf(prevname);
        option_meta.values[index] = name;
        if(option_meta.thumbnail[prevname]) delete option_meta.thumbnail[prevname];
      }
      option_meta.thumbnail[name] = image_url;

      this.syncModel();
      FancyBackbone.App.eventAggregator.trigger("editoption:optionmeta", option_meta, name, prevname);
      $(event.target).closest('.selected').remove();
    }else{
      $frm.find('input').val('').end().find(".figure").removeData().find("img").removeAttr('style');
      option_meta.values.push(name);
      if(!option_meta.thumbnail) option_meta.thumbnail = {};
      option_meta.thumbnail[name] = image_url;
      this.syncModel();
      FancyBackbone.App.eventAggregator.trigger("addoption:optionmeta", option_meta, name);
      this.render();
    }
  },
  onEditShowClick: function(e){
    event.preventDefault();
    var $target = $(e.currentTarget), $tooltip = $target.find('em'), $editFrm = $target.closest('.selected').find('span.rename-frm, .popup-palette, .popup-thumb');

    if($editFrm.is(":visible")){
      this.$el.find(".selected").removeClass('opened').find('span.rename-frm, .popup-palette, .popup-thumb').hide().end().find("em").removeAttr('style');
      if(this.option_meta.type == 'swatch'){
        $target.closest('.selected').css('background', $target.closest('.selected').data('color'));
      }
      return;
    }

    this.$el.find(".selected").find('span.rename-frm, .popup-palette, .popup-thumb').hide();
    this.$el.find('.select-lists').removeClass('opened');
    $tooltip.hide();
    $editFrm.show().closest('.selected').addClass('opened');
    if(this.option_meta.type=='swatch'){
      var name = $editFrm.find("input.paletteLabel").val();
      $editFrm.find(".showPalette").spectrum('set', this.option_meta.swatch[name]||'#fff');
    }
    if(this.option_meta.type=='thumbnail'){
      this.setWaiting(false);
    }
    $editFrm.css('margin-left', -$editFrm.outerWidth()/2+'px');
  },
  onOptionInputKeydown: function(event){
    var that = this;
    if ( event.keyCode === 13 || event.keyCode === 188 ) {
      if(this.option_meta.type == 'swatch') {
        this.onColorSaveClick(event);
        return;
      }
      if(this.option_meta.type == 'thumbnail') {
        this.onThumbnailSaveClick(event);
        return;
      }
      event.preventDefault();
      var name = $(event.target).val().trim();
      if(!name){
        if(event.keyCode === 13)
          alertify.alert("Please type an option name.")
        return;
      }
      $(event.target).val('');
      var option_meta = this.option_meta;
      if(option_meta.values.indexOf(name)>-1){
        alertify.alert("There's an option with the same name. Please check the option name.");
        return;
      }
      option_meta.values.push(name);
      this.syncModel();
      FancyBackbone.App.eventAggregator.trigger("addoption:optionmeta", option_meta, name);
      this.render();
      this.$el.find(".option input:text").focus();
    }
  },
  onOptionInputBlur: function(event){
    var that = this;
    if(this.option_meta.type == 'swatch') {
      return;
    }
    if(this.option_meta.type == 'thumbnail') {
      return;
    }
    event.preventDefault();
    var name = $(event.target).val().trim();
    if(!name){
      return;
    }
    $(event.target).val('');
    var option_meta = this.option_meta;
    if(option_meta.values.indexOf(name)>-1){
      return;
    }
    option_meta.values.push(name);
    this.syncModel();
    FancyBackbone.App.eventAggregator.trigger("addoption:optionmeta", option_meta, name);
    this.render();
  },
  onLabelRemoveClick: function(event){
    event.preventDefault();
    var name = $(event.target).closest('.selected').data('id');

    var that = this, targetCount = this.getRemoveVariantsCount(name);
    if(targetCount==0){
        var option_meta = that.option_meta;
        var index = option_meta.values.indexOf(name);
        option_meta.values.splice(index,1);
        that.syncModel();
        FancyBackbone.App.eventAggregator.trigger("removeoption:optionmeta", option_meta, name);
        $(event.target).closest('.selected').remove();
        return;
    }
    alertify.set({labels: {ok : "Delete",cancel : "Cancel"}});
    alertify.confirm("Are you sure you want to delete this option? This will remove "+targetCount+" variant"+(targetCount>1?"s":"")+".", function(e){
      if(e){
        var option_meta = that.option_meta;
        var index = option_meta.values.indexOf(name);
        option_meta.values.splice(index,1);
        that.syncModel();
        FancyBackbone.App.eventAggregator.trigger("removeoption:optionmeta", option_meta, name);
        $(event.target).closest('.selected').remove();
      }
    })
    alertify.set({labels: {ok : "OK",cancel : "Cancel"}});
  },
  onLabelRenameKeydown: function(event){
    if ( event.keyCode === 13) {
      $(event.target).closest('.rename-frm').find('.btn-rename').trigger('click');
    }
  },
  onLabelRenameClick: function(event){
    event.preventDefault();
    var name = $(event.target).closest('.selected').data('id');
    var rename = $(event.target).closest('.rename-frm').find('input').val();
    var option_meta = this.option_meta;
    if(name!=rename && option_meta.values.indexOf(rename)>-1){
      alertify.alert("There's an option with the same name. Please check the option name.");
      return;
    }

    var index = option_meta.values.indexOf(name);
    option_meta.values[index] = rename;
    if(option_meta.swatch && option_meta.swatch[name]){
      option_meta.swatch[rename] = option_meta.swatch[name];
      delete option_meta.swatch[name];
    }
    if(option_meta.thumbnail && option_meta.thumbnail[name]){
      option_meta.thumbnail[rename] = option_meta.thumbnail[name];
      delete option_meta.thumbnail[name];
    }
    this.syncModel();
    FancyBackbone.App.eventAggregator.trigger("editoption:optionmeta", option_meta, rename, name);
    $(event.target).closest('.selected').remove();
  },
  onRemoveClick: function(event){
    event.preventDefault();
    var that = this, targetCount = this.getRemoveVariantsCount('');
    if(targetCount==0){
        var option_meta = that.option_meta;
        FancyBackbone.App.eventAggregator.trigger("delete:optionmeta", option_meta);
        that.destroy_view();  
        return;
    }
    alertify.set({labels: {ok : "Delete",cancel : "Cancel"}});
    alertify.confirm("Are you sure you want to delete this option? This will remove "+targetCount+" variant"+(targetCount>1?"s":"")+".", function(e){
      if(e){
        var option_meta = that.option_meta;
        FancyBackbone.App.eventAggregator.trigger("delete:optionmeta", option_meta);
        that.destroy_view();  
      }
    })
    alertify.set({labels: {ok : "OK",cancel : "Cancel"}});
  },
  getRemoveVariantsCount: function(label){
    var targetCount = 0, index = window.product.get('option_meta').indexOf(this.option_meta), newOptions=[];
    window.product.get('options').each(function(option){
      var values = _.clone(option.get('values'));
      if(!label || values[index]==label){
        values.splice(index,1);
        newOptions.push(values.join("/"));  
      }
    }, this);
    var beforeCount = newOptions.length;
    newOptions = newOptions.reduce(function(a,b){if(b && a.indexOf(b)<0)a.push(b);return a;},[]);
    var afterCount = newOptions.length;
    return label ? beforeCount : (beforeCount - afterCount);
  },
  destroy_view: function() {
    // COMPLETELY UNBIND THE VIEW
    this.undelegateEvents();
    this.$el.removeData().unbind(); 
    // Remove view from DOM
    this.remove();  
    Backbone.View.prototype.remove.call(this);
  },
  setWaiting: function(waitingStatus) {
    var $popup = this.$el.find(".popup-thumb:visible");
    if (waitingStatus) {
      $popup.find(".infscr-loading").show();
      $popup.find(".btn-save").attr("disabled", true);
    } else {
      $popup.find(".infscr-loading").hide();
      $popup.find(".btn-save").attr("disabled", false);
    }
  },
  setImage: function(image){
    var $popup = this.$el.find(".popup-thumb:visible");
    $popup.find(".figure").data("image_url", image.img_url).find("img").css('backgroundImage','url("'+ image.img_url+'")');
  },
  initialize: function(options) {
    this.option_meta = options.data;
  },
  syncLabel: function(){
    var newValues = [];
    this.$el.find(".selected[data-id]").each(function(){
      newValues.push( $(this).data('id')+'' );
    })
    this.option_meta.values = newValues;
    FancyBackbone.App.eventAggregator.trigger("sortoption:optionmeta", this.option_meta);
  },
  syncModel: function(){
    this.option_meta.name = this.$el.find(".title input:text").val();
    this.option_meta.type = this.$el.find("[name=type]").val();
  },
  render: function() {
    var that = this;
    if(this.option_meta.type == 'swatch' && !this.option_meta.swatch) this.option_meta.swatch = {};
    if(this.option_meta.type == 'thumbnail' && !this.option_meta.thumbnail) this.option_meta.thumbnail = {};

    this.$el.html(this.template(this.option_meta)); 
    if(this.option_meta.type == 'swatch'){
      this.$el.find(".showPalette").each(function(){
        var $palette = $(this);
        $palette.spectrum({
            flat: true,
            preferredFormat: "hex",
            showSelectionPalette: false, 
            //showPalette: true,
            showInput: true,
            chooseText: "Save",
            maxSelectionSize: 7,
            move: function(color) {
                $palette.closest('.selected').css('background',color);
            }
        });
      });
    }
    if(this.option_meta.type == 'thumbnail'){
      this.$el.find("[name=upload-file]").each(function(){
        var $item = $(this).closest('.selected,.select-lists');
        $(this).fileupload({
            dataType: 'json',
            dropZone: $item,
            url: '/sales/upload',
            start: function(e, data) {
              if( $item.find(".popup-thumb").is(":hidden") ){
                $item.find("a.add, .btn-edit").trigger('click');
              }
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
      });
    }
    this.$el.find(".option-picker").sortable({ 
        items: "li.selected", 
        handle: this.option_meta.type == 'thumbnail'?"img":"a.btn-move", 
        containment: "parent",
        start : function(e, ui){
          ui.item.height(30);
        },
        stop : function(e, ui){
          ui.item.css('height','');
          that.syncLabel();
        },
        sort: function(event, ui) {
          var $target = $(event.target);
          if ($.browser.safari && parseInt(ui.helper.css('top'))<0 )  {
              var top = parseInt(ui.helper.css('top')) + $(window).scrollTop();
              ui.helper.css({'top' : top + 'px'});
          }
        },
    })
    return this;
  },
});

FancyBackbone.Views.Product.DetailViewOptionNew = Backbone.View.extend({
  tagName: 'div',
  className: 'opt',
  template: FancyBackbone.Utils.loadTemplate("product_option_item_add_2"),
  events: {
    'keyup input[name=price]': 'onPriceChage',
    'keyup input[name=retail_price]': 'onPriceChage',
    'keyup .qty': 'onQuantityChage',
    'click .btn-collapse': 'onToggleExpand',
    'click .price.onsale label': 'onToggleExpand',
    'click .btn-del': 'onRemoveOptionClick',
    'click .img a': 'onImageClick',
    'click .qty': 'onClickQuantity',
    'click input[name=marked_soldout]': 'onClickSoldOut',
    'blur  .option input:text': 'onLabelChange',
  },
  isEqualOption: function(v1, v2){
    var isEqual = true;
    if(v1.length == v2.length){
      for(var i=0; i<v1.length; i++){
        if( v1[i]!=v2[i]){
          isEqual = false;
          break;
        }
      }
    }
    return isEqual;
  },
  onLabelChange: function(event){
    var that = this, $this = $(event.target), $opt = $this.closest('.option'), index = $opt.prevAll('.option').length, prevvalue = this.option.get('values')[index], value = $this.val().trim();
    var newValues = _.clone(this.option.get('values')), isExists= false;
    newValues[index] = value;

    if(!value){
      alertify.alert("Please type an option name.");
      $this.val(prevvalue);
      return;
    }

    if(prevvalue==value) return;

    window.view.model.get('options').each(function(option){
      if( that.isEqualOption( option.get('values'), newValues ) ){
        isExists = true;
        return false;
      }
    })
    if(isExists){
      alertify.alert("There's an option with the same name. Please check the option name.");
      $this.val(this.option.get('values')[index]);
      return;
    }

    var option_meta = window.view.model.get('option_meta')[index];
    if(option_meta){
      if(option_meta.thumbnail && option_meta.thumbnail[prevvalue]){
        option_meta.thumbnail[value] = option_meta.thumbnail[prevvalue];  
        delete option_meta.thumbnail[prevvalue];
      }
      if(option_meta.swatch && option_meta.swatch[prevvalue]){
        option_meta.swatch[value] = option_meta.swatch[prevvalue];  
        delete option_meta.swatch[prevvalue];
      }
    }

    this.option.get('values')[index] = value;
    var name = this.option.get('values').join(" / ");
    this.option.set('name', name);

    FancyBackbone.App.eventAggregator.trigger("updatelabel:saleitemoption", this.option);  
  },
  onPriceChage: function(event) {
    var price = this.$el.find('input[name=price]').val();
    var retail_price = this.$el.find('input[name=retail_price]').val();

    if(price && isNaN(price)){
      this.$el.find("[name=price]").closest('p').addClass("error");
      return;
    }else{
      this.$el.find("[name=price]").closest('p').removeClass("error");
    }
    if(!retail_price || isNaN(retail_price)){
      this.$el.find("[name=retail_price]").closest('p').addClass("error");
      return;
    }else{
      this.$el.find("[name=retail_price]").closest('p').removeClass("error");
    }

    var price = parseFloat(price);
    var retail_price = parseFloat(retail_price);

    var discount = get_discount(retail_price, price);
    if(discount && discount>0){
      this.$el.find("[name=retail_price]").next().show().html("-"+discount+"%");
      this.$el.find("[name=retail_price]").closest('p.price').addClass('onsale');
    }else{
      this.$el.find("[name=retail_price]").next().hide().html("");
      this.$el.find("[name=retail_price]").closest('p.price').removeClass('onsale');
    }
  },
  onQuantityBlur: function(event){
    this.syncModel();
    var that = this;
    try{ clearTimeout(this.qtyTimer) }catch(e){}
    this.qtyTimer = setTimeout(function(){
      FancyBackbone.App.eventAggregator.trigger("update:saleitemoption", that.option);  
    }, 500);
  },
  onClickQuantity: function(event){
    var qty = this.$el.find("[name=qty]").val();
    var $soldout = this.$el.find("input[name=marked_soldout]");
    if ($soldout.prop('checked') && !this.option.get('expand')) {
      alertify.alert("This option is marked sold out.");
      this.$el.find('.btn-collapse').click();
    }
  },
  onClickSoldOut: function(event){
    var $this = $(event.target), soldout = $this.prop('checked');
    var $qty = this.$el.find("[name=qty]")
    if(soldout){
      var qty = $qty.val();
      $qty
        .attr('qty', qty)
        .addClass('disabled soldout');
    }else{
      var qty = $qty.attr('qty');
      $qty.removeClass('disabled soldout');
      $qty.removeAttr('qty');
    }
  },
  expandOption: function(expand) {
    expand = !!expand;
    this.$el.find(".btn-collapse").toggleClass("show", expand);
    this.$el.find(".inventory").toggle(expand);
    this.option.set('expand', expand);

  },
  onToggleExpand: function(e){
    e.preventDefault();
    var $btn = $(e.target);
    this.expandOption(!$btn.closest(".opt").find('.inventory').is(":visible"));
  },
  onRemoveOptionClick: function(e){
    e.preventDefault();
    var that = this;
    alertify.set({labels: {ok : "Delete",cancel : "Cancel"}});
    alertify.confirm("Are you sure you want to delete this variant?", function(e){
      if(e){
        var option = that.option;
        FancyBackbone.App.eventAggregator.trigger("delete:saleitemoption", option);
      }
    })
    alertify.set({labels: {ok : "OK",cancel : "Cancel"}});
    
  },
  onImageClick: function(e){
    e.preventDefault();
    if(this.option.get('images').models.length>0){
      this.syncModel();
      window.popups.optionImages.render(this.option);
    }else{
      this.$el.find("[name=upload-file]").trigger('click');
    }
  },
  updateOption: function(option) {
    if( (this.option.get('id') && this.option.get('id') == option.get('id')) ||
          (this.option.get('tid') && this.option.get('tid') == option.get('tid')) ){
      this.option = option;
      this.$el.data('view').render();
    }
  },
  destroy_view: function() {

    // COMPLETELY UNBIND THE VIEW
    this.undelegateEvents();
    this.$el.removeData().unbind(); 
    // Remove view from DOM
    this.remove();  
    Backbone.View.prototype.remove.call(this);
  },
  addOptionImage: function(image) {
      this.option.get('images').add(image);
      this.$el.data('view').render();
  },
  setWaiting: function(waitingStatus) {
      if (waitingStatus) {
        this.$el.find(".infscr-loading").show();
      } else {
        this.$el.find(".infscr-loading").hide();
      }
  },
  initialize: function(options) {
    this.option = options.data;
    this.option.set('expand', false);
    this.listenTo(FancyBackbone.App.eventAggregator,'update:saleitemoption', _.bind(this.updateOption, this));
    this.is_admin = !!options.is_admin;
  },
  syncModel: function(){
    var $el = this.$el;
    var option_qty_val = $el.find("input[name=qty]").val();
    if(option_qty_val==='') {
        this.option.set('quantity', null);
        // $el.find("input[name=marked_soldout]").prop('checked', false);
    } else {
        // if( option_qty_val=="0"){
        // }else{
        //   $el.find("input[name=marked_soldout]").prop('checked', false);
        // }
        this.option.set('quantity', (parseInt(option_qty_val)||0) + (parseInt(this.option.get('num_sold'))||0)+"") ;
    }
    var price = this.$el.find('input[name=price]').val();
    var retail_price = this.$el.find('input[name=retail_price]').val();
    var unit_cost = this.$el.find('input[name=unit_cost]').val();
    if(!price){
      price = retail_price;
    }
    
    if(!isNaN(price)) price = (parseFloat(price)).toFixed(2);
    if(!isNaN(retail_price)) retail_price = (parseFloat(retail_price)).toFixed(2);
    if(unit_cost && !isNaN(unit_cost)) unit_cost = (parseFloat(unit_cost)).toFixed(2);
    else unit_cost = null;

    var discount = get_discount(retail_price, price);
    this.option.set('price', price || '') ;
    this.option.set('price_original', price || '') ;
    this.option.set('retail_price', retail_price || '' ) ;
    this.option.set('discount_percentage', discount ) ;
    this.option.set('seller_sku', $el.find("input[name=seller_sku]").val() ) ;
    this.option.set('seller_sku', $el.find("input[name=seller_sku]").val() ) ;
    this.option.set('prod_length', $el.find("input[name=length]").val() ) ;
    this.option.set('prod_height', $el.find("input[name=height]").val() ) ;
    this.option.set('prod_width', $el.find("input[name=width]").val() ) ;
    this.option.set('prod_weight', $el.find("input[name=weight]").val() ) ;
    this.option.set('marked_soldout', $el.find("input[name=marked_soldout]").prop('checked') ) ;
    this.option.set('selected', $el.find("input.selector").prop('checked') );
    this.option.set('unit_cost', unit_cost || '');

    $el.data('model', this.option); 
  },
  render: function() {
    var that = this;
    if (this.option.get('retail_price') == null) {
        this.option.set('retail_price', this.option.get('price_original'));
    }
    var discount = get_discount(this.option.get('retail_price'), this.option.get('price_original'));
    this.option.set('discount_percentage', discount ) ;
    this.option.set('selected', this.option.get('selected')||false);

    this.$el.html(this.template(_.extend(this.option.attributes, { is_admin: this.is_admin }))); 
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
                that.addOptionImage(new FancyBackbone.Models.Product.Image({
                  url_310: data.result.img_url,
                  original_rel_path: data.result.img_id,
                  alt_text: data.result.alt_text,
                }));
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


FancyBackbone.Views.Product.DetailViewOptionAdd = Backbone.View.extend({
  tagName: 'div',
  className: 'opt add',
  template: FancyBackbone.Utils.loadTemplate("product_option_item_new"),
  events: {
    'click .img a': 'onImageClick',
    'click .btn-add': 'onAddOptionClick',
  },
  onImageClick: function(e){
    e.preventDefault();
    if(this.option.get('images').models.length>0){
      this.syncModel();
      window.popups.optionImages.render(this.option);
    }else{
      this.$el.find("[name=upload-file]").trigger('click');
    }
  },
  isEqualOption: function(v1, v2){
    var isEqual = true;
    if(v1.length == v2.length){
      for(var i=0; i<v1.length; i++){
        if( v1[i]!=v2[i] && v1[i] && v2[i]){
          isEqual = false;
          break;
        }
      }
    }else if(v1.length == v2.length-1){
      for(var i=0; i<v1.length; i++){
        if( v1[i]!=v2[i] && v1[i] && v2[i]){
          isEqual = false;
          break;
        }
      }
    }
    return isEqual;
  },
  onAddOptionClick: function(e){
    e.preventDefault();
    var that = this, isExists = false;
    this.syncModel();
    if(this.hasEmptyLabel()){
      alertify.alert("Please type an option name.")  ;
      return;
    }
    
    this.model.get('options').each(function(option){
      if( that.isEqualOption( option.get('values'), that.option.get('values') ) ){
        isExists = true;
        return false;
      }
    })
    if(isExists){
      alertify.alert("There's an option with the same name. Please check the option name.");
      return;
    }
    this.model.get("options").add(this.option);
    FancyBackbone.App.eventAggregator.trigger("updatelabel:saleitemoption", this.option);  
    FancyBackbone.App.eventAggregator.trigger("syncView:saleitemoption", this.option);  
    this.reset();
  },
  hasEmptyLabel: function(){
    var emptyLabel = false;
    this.$el.find("p.option input:text").each(function(){
      if(!$(this).val().trim()) emptyLabel=true;
    })
    return emptyLabel;
  },
  addOptionImage: function(image) {
      this.option.get('images').add(image);
      this.syncModel();
      this.$el.data('view').render();
  },
  setWaiting: function(waitingStatus) {
      if (waitingStatus) {
        this.$el.find(".infscr-loading").show();
      } else {
        this.$el.find(".infscr-loading").hide();
      }
  },
  reset: function(){
    this.option = new FancyBackbone.Models.Product.Option({
        name: "",
        price: this.model.get('price_original'),
        price_original: '',
        retail_price: this.model.get('retail_price')||'',
        discount_percentage: get_discount(this.model.get('retail_price'), this.model.get('price')), 
        quantity: null,
        sync_quantity_with_warehouse: false,
        color: '',
        prod_length: this.model.get('length'),
        prod_height: this.model.get('height'),
        prod_width: this.model.get('width'),
        prod_weight: this.model.get('weight'),
        unit_cost: '',
        num_sold:'',
        seller_sku: '',
        tid: escape(name),
        marked_soldout: false,
        images: [],
        values: []
    });
    this.render();
  },
  initialize: function(options) {
    this.model = options.data;
    this.reset();
  },
  syncModel: function(){
    var values = [], $el = this.$el;;
    $el.find("p.option input:text").each(function(){
      values.push($(this).val());
    })
    var option_qty_val = $el.find("input[name=qty]").val();
    if(option_qty_val==='') {
        this.option.set('quantity', null);
    } else {
        this.option.set('quantity', parseInt(option_qty_val)||0 ) ;
    }
    var retail_price = parseFloat($el.find("input[name=retail_price]").val());
    var price = retail_price;
    var discount = get_discount(retail_price, price);
    var name = values.join(" / ");

    this.option.set('name', name);
    this.option.set('tid', escape(name)) ;
    this.option.set('values', values);
    this.option.set('price', price && price.toFixed(2) || '') ;
    this.option.set('price_original', price && price.toFixed(2) || '') ;
    this.option.set('retail_price', retail_price && retail_price.toFixed(2) || '' ) ;
    this.option.set('discount_percentage', discount ) ;
  },
  render: function() {
    var that = this;
    this.option.set('option_meta', this.model.get('option_meta'));
    this.$el.html(this.template(this.option.attributes)); 
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
                that.addOptionImage(new FancyBackbone.Models.Product.Image({
                  product: that.model,
                  url_310: data.result.img_url,
                  original_rel_path: data.result.img_id,
                  alt_text: data.result.alt_text,
                }));
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

FancyBackbone.Views.Product.ShippingView = Backbone.View.extend({
  events: {
    'change select.tiered-rates': 'onShippingRateSelectChange',
    'change select[name=shipping_destination]': 'onShippingDestinationChange',
    'click .view_rate': 'showShippingRatesPopup',
    'click input[name="shipping-type"]': 'onChangeShippingType',
    'click .ships_from .change-default': 'onClickChangeDefault',
    'click .harmonized-code-selection > button.harmonized-code-btn-del': 'onDeleteHarmonizedCodeClick',
    'keyup input[name=harmonized-code-search]': 'onInputHarmonizedCodeSearch',
    'click .harmonized-code-suggestion ul > li': 'onClickHarmonizedCodeSuggestion'
  },
  showShippingRatesPopup: function(e) {
    e.preventDefault();
    $.dialog('show_rate').open();   
  },
  onClickChangeDefault: function(e) {
    e.preventDefault();
    window.open(
      '/merchant/settings/shipping/preferences',
      '_blank' // <- This is what makes it open in a new window.
    );
  },
  onChangeShippingType: function(e) {
    var $selected_type = $(e.target);
    var selected_type = $selected_type.val();
    $selected_type.closest('ul').find("li").removeClass('checked').end().end().closest("li").addClass('checked');
    
    this.$el.find(".multiple-shipping-frm").removeClass('custom-shipping').removeClass('weight-shipping').removeClass('price-shipping');
    this.$el.find(".multiple-shipping-frm table colgroup").empty(); 
    this.$el.find(".calculation").removeClass('free custom flat');
    if (selected_type == '1') { // custom
        this.$el.find(".calculation").addClass('custom');
        this.$el.find(".multiple-shipping-frm").show().removeClass('custom-shipping');
        this.$el.find(".multiple-shipping-frm table colgroup").append('<col width="*"><col width="140">');
        this.$el.find(".multiple-shipping-frm table .custom-shipping-field").hide();
        this.$el.find(".shipping_rate .view_rate").hide();
        this.$el.find(".show_rate").show();
        $(".data-field .usa table").empty().append($(".weight-based-rates .domestic").clone());
        $(".data-field .world table").empty().append($(".weight-based-rates .international").clone());
        this.renderShippingRateGroupsSelect();
        this.onShippingRateSelectChange();
    }
    else if(selected_type == '0'){ // flat 
        this.$el.find(".calculation").addClass('flat');
        this.$el.find(".multiple-shipping-frm").show().addClass('custom-shipping');
        this.$el.find(".multiple-shipping-frm table colgroup").append('<col width="165"><col width="110"><col width="110"><col width="*">');
        this.$el.find(".multiple-shipping-frm table .custom-shipping-field").show();
        this.$el.find(".show_rate").hide();
        this.$el.find(".shipping_rate .view_rate").hide();
    }
    else { // free
        this.$el.find(".calculation").addClass('free')
        this.$el.find(".multiple-shipping-frm").show().removeClass('custom-shipping');
        this.$el.find(".multiple-shipping-frm table colgroup").append('<col width="*"><col width="140">');
        this.$el.find(".multiple-shipping-frm table .custom-shipping-field").hide();
        this.$el.find(".show_rate").hide();
        this.$el.find(".shipping_rate .view_rate").hide();
    }
  },
  onShippingWindowChange: function(e){
    var $select = $(e.target);
    if($select.val()=='true'){
      this.$el.find('.multiple-shipping-frm').show();
    }else{
      this.$el.find('.multiple-shipping-frm').hide();
    }
  },
  onShippingDestinationChange: function(e){
    if($(e.target).val() == 'international_shipping' ){
      this.$el.find(".multiple-shipping-frm .international").removeClass("disabled");
    }else{
      this.$el.find(".multiple-shipping-frm .international").addClass("disabled");
    }
    
  },
  updateShippingRateGroupView: function(shippingRateGroupId) {

    if (this.shippingRateGroupView) {
      this.shippingRateGroupView.remove();
    }
    
    var shippingRateGroup = this.shippingRateGroupCollection.get(shippingRateGroupId);
    if (shippingRateGroupId == -1) {
	$(".data-field .usa table").empty().append($(".weight-based-rates .domestic").clone());
	$(".data-field .world table").empty().append($(".weight-based-rates .international").clone());
    } else {
	var $worldTableDiv = $("div.data-field .world .table");
	this.shippingRateGroupView = new FancyBackbone.Views.Product.ShippingRateGroupNewView({
            model: shippingRateGroup,
            intl_el: $worldTableDiv,
            usa_el: $("div.data-field .usa .table"),
	});
	this.shippingRateGroupView.render();
	if ($worldTableDiv.children.length <= 0) {
            $("div.data-field .world").hide();
	} else {
            $("div.data-field .world").show();
	}
    }
  },
  onShippingRateSelectChange: function() {
    
    this.updateShippingRateGroupView(this.selectView.getSelectedValue());
  },
  onInputHarmonizedCodeSearch: function(event) {
    event.preventDefault();
    if (this.hsCodeJqXHR) {
      this.hsCodeJqXHR.abort();
      this.hsCodeJqXHR = null;
    }
    var search_text = $(event.currentTarget).val();
    if(search_text.length > 1) {
        var that = this;
        this.hsCodeJqXHR = $.get('/rest-api/v1/seller/'+window.seller.get('id_str')+'/products/hscode',{query:search_text, limit:10},
          function (response) {
            if (response.hscode_list) {
              var $suggestion_holder = that.$el.find('.harmonized-code-suggestion');
              $suggestion_holder.find('ul').empty();
              var result_list = response.hscode_list;
              for (var i in result_list) {
                  var code = result_list[i];
                  var li_string = '<li cc-id="' + code.id + '"><b>[' + code.commodity_code + ']</b> <small>' + code.description + '</small></li>';
                  var $li = $(li_string);
                  $li.data('hscode', code);
                  $suggestion_holder.find('ul').append($li);
              }

              $('.harmonized-code-suggestion').show();
            }
          }, "json");
    } else {
        $('.harmonized-code-suggestion').hide();
    }
  },
  onClickHarmonizedCodeSuggestion: function(event) {
    event.preventDefault();
    var cc_id = $(event.currentTarget).attr('cc-id');
    var cc = $(event.currentTarget).data('hscode');
    this.$el.find('.harmonized-code-selection').find('span').text('[' + cc['commodity_code'] + '] ' + cc['description']);
    this.$el.find('.harmonized-code-selection').attr('cc-id', cc_id);
    this.$el.find('.harmonized-code-selection').show();
    this.$el.find("input[name='harmonized-code-search']").hide();

    $('.harmonized-code-suggestion').hide();
    return false;
  },
  onDeleteHarmonizedCodeClick: function(event) {
    event.preventDefault();
    this.$el.find('.harmonized-code-selection').attr('cc-id', '');
    this.$el.find('.harmonized-code-selection').hide();
    this.$el.find("input[name='harmonized-code-search']").show();
  },

  syncHarmonizedCommodityCode: function() {
    var harmonizedCommodityCode = parseInt(this.$el.find('.harmonized-code-selection').attr('cc-id'));
    if (harmonizedCommodityCode == NaN)
        this.model.set('commodity_code_id', null);
    else
        this.model.set('commodity_code_id', harmonizedCommodityCode);
  },
  syncOriginCountry: function() { this.model.set('origin_country', (this.$el.find('select.select-country').val() || "").trim()); },
  renderCountriesSelect: function() {
    var selectView = new FancyBackbone.Views.Base.SelectView({
      el: this.$el.find("select.select-country"),
      options: _.map(this.countryCollection.models, function(country) {
        return country.createSelectOption();
      }),
    }).render();
    selectView.selectValue(this.countryCollection.currentCountryCode);
  },
  renderShippingRateGroupsSelect: function(sid) {
    var rateGroupCollection = [];
    _.map(this.shippingRateGroupCollection.models, function(shippingRateGroup) {
        var option = shippingRateGroup.createSelectOption();
        option.display = option.display + " - "+ ((shippingRateGroup.get('based_type')==1)?"Weight-Based":"Price-Based");
        rateGroupCollection.push(option);
    })
    rateGroupCollection.unshift({value: '-1',display: 'Default - Weight-Based'});

    this.$el.find("select.tiered-rates").empty();
    this.selectView = new FancyBackbone.Views.Base.SelectView({
      defaultOption: false,
      el: this.$el.find("select.tiered-rates"),
      options: rateGroupCollection,
    }).render();

    var sid2 = null;
    $(rateGroupCollection).each(function(){
      if( this.value == sid){
        sid2 = sid;
      }
    })
    this.selectView.selectValue(sid2 || rateGroupCollection[0].value);
    if (sid2 != null) {
	this.updateShippingRateGroupView(sid2);
    }
  },

  syncPriority: function(){
    if( this.$el.find(".priority").length ){
      var domestic_shipping_service_level = this.$el.find('.priority p.domestic select').find('option:selected').attr('service_level');
      var domestic_shipping_carrier = this.$el.find('.priority p.domestic select').find('option:selected').attr('carrier');
      var intl_shipping_service_level = this.$el.find('.priority p.international select').find('option:selected').attr('service_level');
      var intl_shipping_carrier = this.$el.find('.priority p.international select').find('option:selected').attr('carrier');

      this.model.set('domestic_shipping_service_level', domestic_shipping_service_level );
      this.model.set('domestic_shipping_carrier', domestic_shipping_carrier );
      this.model.set('intl_shipping_service_level', intl_shipping_service_level );
      this.model.set('intl_shipping_carrier', intl_shipping_carrier );
    }
  },
  syncModel: function() {
    var ships_internationally = this.$el.find("select[name=shipping_destination]").val()=='international_shipping';
    var $selected_type = this.$el.find('input[name="shipping-type"]:checked');
    var selected_type = $selected_type.val();

    var charge_domestic = true;
    var charge_international = true;
    
    if (selected_type == '2') {
        charge_domestic = false;
        charge_international = false;
    } else if (this.$el.find('div.shipping_free').is(':visible') && this.$el.find('input#shipping_us_free').prop('checked')) {
        charge_domestic = false;
    }

    this.model.set('international_shipping', ships_internationally);
    this.model.set('charge_domestic_shipping', charge_domestic);
    this.model.set('charge_international_shipping', charge_international);
    
    var $ships_from = this.$el.find("select[name=ships_from]");
    if ($ships_from.is(':visible')) this.model.set('ships_from', $ships_from.val());
    var $shipping_origin = this.$el.find("select[name=shipping_origin]");
    if ($shipping_origin.is(':visible')) this.model.set('shipping_origin', $shipping_origin.val() || null);

    var shippping_rate_group_id = this.selectView ? this.selectView.getSelectedValue() : -1;
    if (selected_type == '1') {
        this.model.set('use_custom_shipping', 0);
        this.model.set('custom_domestic_charge', '0.00');
        this.model.set('custom_international_charge', '0.00');
        this.model.set('custom_domestic_incremental_fee', '0.00');
        this.model.set('custom_international_incremental_fee', '0.00');
        this.model.set('shipping_rate_group_id', shippping_rate_group_id); 
    }
    else if (selected_type == '0' ) {
        this.model.set('use_custom_shipping', 1);
        this.model.set('custom_domestic_charge', this.$el.find('input.custom-charge-domestic').val());
        this.model.set('custom_international_charge', this.$el.find('input.custom-charge-international').val());
        this.model.set('custom_domestic_incremental_fee', this.$el.find('input.custom-incremental-domestic').val());
        this.model.set('custom_international_incremental_fee', this.$el.find('input.custom-incremental-international').val());
        this.model.set('shipping_rate_group_id', -1);
    }else{
        if( this.model.get('shipping_rate_group_id') == null ) {
            this.model.set('shipping_rate_group_id', -1);
        }
    }
    this.model.set('expected_delivery_day_1', this.$el.find('input.expected_delivery_day_1').val());
    this.model.set('expected_delivery_day_2', this.$el.find('input.expected_delivery_day_2').val());
    this.model.set('expected_delivery_day_intl_1', this.$el.find('input.expected_delivery_day_intl_1').val());
    this.model.set('expected_delivery_day_intl_2', this.$el.find('input.expected_delivery_day_intl_2').val());

    this.syncHarmonizedCommodityCode();
    this.syncOriginCountry();
    this.syncPriority();
    
  },
  syncView: function() {
    var use_custom_shipping = this.model.get('use_custom_shipping');
    var shippingRateGroupId = this.model.get('shipping_rate_group_id');
    var shippingProfileId = this.model.get('shipping_profile_id');
    var intl_free_charge = !this.model.get('charge_international_shipping');
    var domestic_free_charge = !this.model.get('charge_domestic_shipping');
    
    if( intl_free_charge && domestic_free_charge ){
      this.$el.find('input[name="shipping-type"][value=2]').click();
      this.$el.find('div.shipping_free').hide();
    }else {
        if (use_custom_shipping == 0){
          this.$el.find('input[name="shipping-type"][value=1]').click();
        } else {
          this.$el.find('input[name="shipping-type"][value=0]').click();
        }
        if (domestic_free_charge) {
          this.$el.find('div.shipping_free').show().find('input#shipping_us_free').prop('checked', true);
        } else {
          this.$el.find('div.shipping_free').hide().find('input#shipping_us_free').prop('checked', false);
        }
    }

    var expected_delivery_day_1 = this.model.get('expected_delivery_day_1');
    if(expected_delivery_day_1){
      this.$el.find('input.expected_delivery_day_1').val(expected_delivery_day_1);
    }
    var expected_delivery_day_2 = this.model.get('expected_delivery_day_2');
    if(expected_delivery_day_2){
      this.$el.find('input.expected_delivery_day_2').val(expected_delivery_day_2);
    }
    var expected_delivery_day_intl_1 = this.model.get('expected_delivery_day_intl_1');
    if(expected_delivery_day_intl_1){
        this.$el.find('input.expected_delivery_day_intl_1').val(expected_delivery_day_intl_1);
    }
    var expected_delivery_day_intl_2 = this.model.get('expected_delivery_day_intl_2');
    if(expected_delivery_day_intl_2){
        this.$el.find('input.expected_delivery_day_intl_2').val(expected_delivery_day_intl_2);
    }
    if(this.model.is_locked_field('shipping_window')) {
      this.$el.find('input.expected_delivery_day_1').attr('readonly',true).addClass('locked');
      this.$el.find('input.expected_delivery_day_2').attr('readonly',true).addClass('locked');
      this.$el.find('input.expected_delivery_day_intl_1').attr('readonly',true).addClass('locked');
      this.$el.find('input.expected_delivery_day_intl_2').attr('readonly',true).addClass('locked');
    }else{
      this.$el.find('input.expected_delivery_day_1').removeClass('locked');
      this.$el.find('input.expected_delivery_day_2').removeClass('locked');
      this.$el.find('input.expected_delivery_day_intl_1').removeClass('locked');
      this.$el.find('input.expected_delivery_day_intl_2').removeClass('locked');
    }

    if (this.model.get('international_shipping')) {
        this.$el.find('select[name=shipping_destination]').val('international_shipping').trigger('change');
    }else{
        this.$el.find('select[name=shipping_destination]').val('domestic_shipping').trigger('change');
    }

    if (use_custom_shipping) {
        var domestic_charge = this.model.get('custom_domestic_charge');
        if (domestic_charge) {
            this.$el.find('input.custom-charge-domestic').val(domestic_charge);
        }
        var international_charge = this.model.get('custom_international_charge');
        if (international_charge) {
            this.$el.find('input.custom-charge-international').val(international_charge);
        }
        var domestic_incremental = this.model.get('custom_domestic_incremental_fee');
        if (domestic_incremental != null) {
           this.$el.find('input.custom-incremental-domestic').val(domestic_incremental);
        }

        var international_incremental = this.model.get('custom_international_incremental_fee');
        if (international_incremental != null) {
            this.$el.find('input.custom-incremental-international').val(international_incremental);
        }

        var expected_delivery_day_1 = this.model.get('expected_delivery_day_1');
        if(expected_delivery_day_1){
            this.$el.find('input.expected_delivery_day_1').val(expected_delivery_day_1);
        }
        var expected_delivery_day_2 = this.model.get('expected_delivery_day_2');
        if(expected_delivery_day_2){
            this.$el.find('input.expected_delivery_day_2').val(expected_delivery_day_2);
        }
        var expected_delivery_day_intl_1 = this.model.get('expected_delivery_day_intl_1');
        if(expected_delivery_day_intl_1){
            this.$el.find('input.expected_delivery_day_intl_1').val(expected_delivery_day_intl_1);
        }
        var expected_delivery_day_intl_2 = this.model.get('expected_delivery_day_intl_2');
        if(expected_delivery_day_intl_2){
            this.$el.find('input.expected_delivery_day_intl_2').val(expected_delivery_day_intl_2);
        }
    }

    var hcc = this.model.get('harmonized_commodity_code');
    if (hcc) {
        this.$el.find("input[name='harmonized-code-search']").hide();
        this.$el.find(".harmonized-code-selection").attr('cc-id', hcc['id']);
        this.$el.find(".harmonized-code-selection span").text('['+hcc['commodity_code']+'] '+ hcc['description']);
        this.$el.find(".harmonized-code-selection").show();
    } else {
        this.$el.find("input[name='harmonized-code-search']").show();
    }
    this.$el.find('select.select-country').val(this.model.get('origin_country'));
    this.$el.find('select[name=shipping_origin]').val(this.model.get('shipping_origin'));


  },
  initialize: function() {
    this.countryCollection = window.countryCollection;
    this.shippingRateGroupCollection = window.shippingRateGroupCollection;
    this.hsCodeJqXHR = null;
  },
  render: function() {

    this.renderCountriesSelect();
    if (this.model.id) {
      this.syncView();
      var shippingRateGroupId = this.model.get('shipping_rate_group_id');
      if (shippingRateGroupId ) {
        this.renderShippingRateGroupsSelect(shippingRateGroupId);
      }
    } else {
      this.$el.find('select[name="shipping_destination"]').val('international_shipping');
      this.$el.find('input[name="shipping-type"][value=0]').click();
    }
    return this;
  },
});


FancyBackbone.Views.Product.ProfileShippingView = Backbone.View.extend({
  events: {
    'click .view_rate': 'showShippingRatesPopup',
    'click input[name="shipping-type"]': 'onChangeShippingType',
    'click .ships_from .change-default': 'onClickChangeDefault',
    'click .harmonized-code-selection > button.harmonized-code-btn-del': 'onDeleteHarmonizedCodeClick',
    'keyup input[name=harmonized-code-search]': 'onInputHarmonizedCodeSearch',
    'click .harmonized-code-suggestion ul > li': 'onClickHarmonizedCodeSuggestion',
    'change .shipping_window select': 'onShippingWindowChange',
  },
  showShippingRatesPopup: function(e) {
    var slug =  this.selectView.$el.find('option:selected').attr('slug');
    $(e.target).attr('href', '/merchant/settings/shipping/'+slug+'?new');
  },
  onClickChangeDefault: function(e) {
    e.preventDefault();
    window.open(
      '/merchant/settings/shipping/preferences',
      '_blank' // <- This is what makes it open in a new window.
    );
  },
  onChangeShippingType: function(e) {
    var $selected_type = $(e.target);
    var selected_type = $selected_type.val();
    $selected_type.closest('ul').find("li").removeClass('checked').end().end().closest("li").addClass('checked');
    
    this.$el.find(".multiple-shipping-frm").removeClass('custom-shipping').removeClass('weight-shipping').removeClass('price-shipping');
    this.$el.find(".multiple-shipping-frm table colgroup").empty(); 
    this.$el.find(".calculation").removeClass('free custom flat');
    this.$el.find(".calculation p.shipping_rate.new").show();
    this.$el.find(".calculation p.shipping_window").hide();
  
    if (selected_type == '1') { // custom
        this.$el.find(".calculation").addClass('custom');

        this.$el.find(".multiple-shipping-frm").show().removeClass('custom-shipping');
        this.$el.find(".multiple-shipping-frm table colgroup").append('<col width="*"><col width="140">');
        this.$el.find(".multiple-shipping-frm table .custom-shipping-field").hide();
        this.$el.find(".shipping_rate .view_rate").hide();
        this.$el.find(".show_rate").show();
        $(".data-field .usa table").empty().append($(".weight-based-rates .domestic").clone());
        $(".data-field .world table").empty().append($(".weight-based-rates .international").clone());
        this.renderShippingRateGroupsSelect();
        this.$el.find(".calculation p.shipping_rate.new").hide();
        this.$el.find(".calculation p.shipping_window").show();
        this.$el.find(".shipping_window select").change();
    }
    else if(selected_type == '0'){ // flat 
        this.$el.find(".calculation").addClass('flat');
        this.$el.find(".multiple-shipping-frm").show().addClass('custom-shipping');
        this.$el.find(".multiple-shipping-frm table colgroup").append('<col width="165"><col width="110"><col width="110"><col width="*">');
        this.$el.find(".multiple-shipping-frm table .custom-shipping-field").show();
        this.$el.find(".show_rate").hide();
        this.$el.find(".shipping_rate .view_rate").hide();
    }
  },
  onShippingWindowChange: function(e){
    var $select = $(e.target);
    if($select.val()=='true'){
      this.$el.find('.multiple-shipping-frm').show();
    }else{
      this.$el.find('.multiple-shipping-frm').hide();
    }
  },
  onInputHarmonizedCodeSearch: function(event) {
    event.preventDefault();
    if (this.hsCodeJqXHR) {
      this.hsCodeJqXHR.abort();
      this.hsCodeJqXHR = null;
    }
    var search_text = $(event.currentTarget).val();
    if(search_text.length > 1) {
        var that = this;
        this.hsCodeJqXHR = $.get('/rest-api/v1/seller/'+window.seller.get('id_str')+'/products/hscode',{query:search_text, limit:10},
          function (response) {
            if (response.hscode_list) {
              var $suggestion_holder = that.$el.find('.harmonized-code-suggestion');
              $suggestion_holder.find('ul').empty();
              var result_list = response.hscode_list;
              for (var i in result_list) {
                  var code = result_list[i];
                  var li_string = '<li cc-id="' + code.id + '"><b>[' + code.commodity_code + ']</b> <small>' + code.description + '</small></li>';
                  var $li = $(li_string);
                  $li.data('hscode', code);
                  $suggestion_holder.find('ul').append($li);
              }

              $('.harmonized-code-suggestion').show();
            }
          }, "json");
    } else {
        $('.harmonized-code-suggestion').hide();
    }
  },
  onClickHarmonizedCodeSuggestion: function(event) {
    event.preventDefault();
    var cc_id = $(event.currentTarget).attr('cc-id');
    var cc = $(event.currentTarget).data('hscode');
    this.$el.find('.harmonized-code-selection').find('span').text('[' + cc['commodity_code'] + '] ' + cc['description']);
    this.$el.find('.harmonized-code-selection').attr('cc-id', cc_id);
    this.$el.find('.harmonized-code-selection').show();
    this.$el.find("input[name='harmonized-code-search']").hide();

    $('.harmonized-code-suggestion').hide();
    return false;
  },
  onDeleteHarmonizedCodeClick: function(event) {
    event.preventDefault();
    this.$el.find('.harmonized-code-selection').attr('cc-id', '');
    this.$el.find('.harmonized-code-selection').hide();
    this.$el.find("input[name='harmonized-code-search']").show();
  },

  syncHarmonizedCommodityCode: function() {
    var harmonizedCommodityCode = parseInt(this.$el.find('.harmonized-code-selection').attr('cc-id'));
    if (harmonizedCommodityCode == NaN)
        this.model.set('commodity_code_id', null);
    else
        this.model.set('commodity_code_id', harmonizedCommodityCode);
  },
  syncOriginCountry: function() { this.model.set('origin_country', (this.$el.find('select.select-country').val() || "").trim()); },
  renderCountriesSelect: function() {
    var selectView = new FancyBackbone.Views.Base.SelectView({
      el: this.$el.find("select.select-country"),
      options: _.map(this.countryCollection.models, function(country) {
        return country.createSelectOption();
      }),
    }).render();
    selectView.selectValue(this.countryCollection.currentCountryCode);
  },
  renderShippingRateGroupsSelect: function(sid) {
    var rateGroupCollection = [];
    _.map(this.shippingProfileCollection.models, function(shippingProfile) {
        var option = shippingProfile.createSelectOption();
        rateGroupCollection.push(option);
    })
    
    this.$el.find("select.tiered-rates").empty();
    this.selectView = new FancyBackbone.Views.Base.SelectView({
      defaultOption: false,
      el: this.$el.find("select.tiered-rates"),
      options: rateGroupCollection,
    }).render();

    var sid2 = null;
    $(rateGroupCollection).each(function(){
      if( this.value == sid){
        sid2 = sid;
      }
    })
    this.selectView.selectValue(sid2 || rateGroupCollection[0].value);
  },
  syncPriority: function(){
    if( this.$el.find(".priority").length ){
      var domestic_shipping_service_level = this.$el.find('.priority p.domestic select').find('option:selected').attr('service_level');
      var domestic_shipping_carrier = this.$el.find('.priority p.domestic select').find('option:selected').attr('carrier');
      var intl_shipping_service_level = this.$el.find('.priority p.international select').find('option:selected').attr('service_level');
      var intl_shipping_carrier = this.$el.find('.priority p.international select').find('option:selected').attr('carrier');

      this.model.set('domestic_shipping_service_level', domestic_shipping_service_level );
      this.model.set('domestic_shipping_carrier', domestic_shipping_carrier );
      this.model.set('intl_shipping_service_level', intl_shipping_service_level );
      this.model.set('intl_shipping_carrier', intl_shipping_carrier );
    }
  },
  syncModel: function() {
    var ships_internationally = this.$el.find("select[name=shipping_destination]").val()=='international_shipping';
    var $selected_type = this.$el.find('input[name="shipping-type"]:checked');
    var selected_type = $selected_type.val();

    var charge_domestic = false;
    var charge_international = false;
    
    this.model.set('international_shipping', ships_internationally);
    this.model.set('charge_domestic_shipping', charge_domestic);
    this.model.set('charge_international_shipping', charge_international);

    var $ships_from = this.$el.find("select[name=ships_from]");
    if ($ships_from.is(':visible')) this.model.set('ships_from', $ships_from.val());
    var $shipping_origin = this.$el.find("select[name=shipping_origin]");
    if ($shipping_origin.is(':visible')) this.model.set('shipping_origin', $shipping_origin.val() || null);

    var shippping_rate_group_id = this.selectView ? this.selectView.getSelectedValue() : -1;
    if (selected_type == '1') {
        this.model.set('use_custom_shipping', 0);
        this.model.set('custom_domestic_charge', '0.00');
        this.model.set('custom_international_charge', '0.00');
        this.model.set('custom_domestic_incremental_fee', '0.00');
        this.model.set('custom_international_incremental_fee', '0.00');
        this.model.set('shipping_profile_id', shippping_rate_group_id);
        this.model.set('shipping_rate_group_id', -1); 
        this.model.set('use_custom_shipping_window', this.$el.find('select[name=use_custom_shipping_window]').val()=='true' );
    }
    else if (selected_type == '0' ) {
        this.model.set('use_custom_shipping', 1);
        this.model.set('custom_domestic_charge', this.$el.find('input.custom-charge-domestic').val());
        this.model.set('custom_international_charge', this.$el.find('input.custom-charge-international').val());
        this.model.set('custom_domestic_incremental_fee', this.$el.find('input.custom-incremental-domestic').val());
        this.model.set('custom_international_incremental_fee', this.$el.find('input.custom-incremental-international').val());
        this.model.set('shipping_profile_id', -1);
        this.model.set('shipping_rate_group_id', -1);
    }
    this.model.set('expected_delivery_day_1', this.$el.find('input.expected_delivery_day_1').val());
    this.model.set('expected_delivery_day_2', this.$el.find('input.expected_delivery_day_2').val());
    this.model.set('expected_delivery_day_intl_1', this.$el.find('input.expected_delivery_day_intl_1').val());
    this.model.set('expected_delivery_day_intl_2', this.$el.find('input.expected_delivery_day_intl_2').val());

    this.syncHarmonizedCommodityCode();
    this.syncOriginCountry();
    this.syncPriority();
    
  },
  syncView: function() {
    var use_custom_shipping = this.model.get('use_custom_shipping');
    var shippingProfileId = this.model.get('shipping_profile_id');
    
    if (use_custom_shipping == 0){
      this.$el.find('input[name="shipping-type"][value=1]').click();
    } else {
      this.$el.find('input[name="shipping-type"][value=0]').click();
    }

    var expected_delivery_day_1 = this.model.get('expected_delivery_day_1');
    if(expected_delivery_day_1){
      this.$el.find('input.expected_delivery_day_1').val(expected_delivery_day_1);
    }
    var expected_delivery_day_2 = this.model.get('expected_delivery_day_2');
    if(expected_delivery_day_2){
      this.$el.find('input.expected_delivery_day_2').val(expected_delivery_day_2);
    }
    var expected_delivery_day_intl_1 = this.model.get('expected_delivery_day_intl_1');
    if(expected_delivery_day_intl_1){
        this.$el.find('input.expected_delivery_day_intl_1').val(expected_delivery_day_intl_1);
    }
    var expected_delivery_day_intl_2 = this.model.get('expected_delivery_day_intl_2');
    if(expected_delivery_day_intl_2){
        this.$el.find('input.expected_delivery_day_intl_2').val(expected_delivery_day_intl_2);
    }

    if (this.model.get('international_shipping')) {
        this.$el.find('select[name=shipping_destination]').val('international_shipping');
    }else{
        this.$el.find('select[name=shipping_destination]').val('domestic_shipping');
    }

    this.$el.find('select[name=use_custom_shipping_window]').val( this.model.get('use_custom_shipping_window')?'true':'false' ).change();
    
    if (use_custom_shipping) {
        var domestic_charge = this.model.get('custom_domestic_charge');
        if (domestic_charge) {
            this.$el.find('input.custom-charge-domestic').val(domestic_charge);
        }
        var international_charge = this.model.get('custom_international_charge');
        if (international_charge) {
            this.$el.find('input.custom-charge-international').val(international_charge);
        }
        var domestic_incremental = this.model.get('custom_domestic_incremental_fee');
        if (domestic_incremental != null) {
           this.$el.find('input.custom-incremental-domestic').val(domestic_incremental);
        }

        var international_incremental = this.model.get('custom_international_incremental_fee');
        if (international_incremental != null) {
            this.$el.find('input.custom-incremental-international').val(international_incremental);
        }

        var expected_delivery_day_1 = this.model.get('expected_delivery_day_1');
        if(expected_delivery_day_1){
            this.$el.find('input.expected_delivery_day_1').val(expected_delivery_day_1);
        }
        var expected_delivery_day_2 = this.model.get('expected_delivery_day_2');
        if(expected_delivery_day_2){
            this.$el.find('input.expected_delivery_day_2').val(expected_delivery_day_2);
        }
        var expected_delivery_day_intl_1 = this.model.get('expected_delivery_day_intl_1');
        if(expected_delivery_day_intl_1){
            this.$el.find('input.expected_delivery_day_intl_1').val(expected_delivery_day_intl_1);
        }
        var expected_delivery_day_intl_2 = this.model.get('expected_delivery_day_intl_2');
        if(expected_delivery_day_intl_2){
            this.$el.find('input.expected_delivery_day_intl_2').val(expected_delivery_day_intl_2);
        }
    }

    var hcc = this.model.get('harmonized_commodity_code');
    if (hcc) {
        this.$el.find("input[name='harmonized-code-search']").hide();
        this.$el.find(".harmonized-code-selection").attr('cc-id', hcc['id']);
        this.$el.find(".harmonized-code-selection span").text('['+hcc['commodity_code']+'] '+ hcc['description']);
        this.$el.find(".harmonized-code-selection").show();
    } else {
        this.$el.find("input[name='harmonized-code-search']").show();
    }
    this.$el.find('select.select-country').val(this.model.get('origin_country'));
    this.$el.find('select[name=shipping_origin]').val(this.model.get('shipping_origin'));
  },
  initialize: function() {
    this.countryCollection = window.countryCollection;
    this.shippingProfileCollection = window.shippingProfileCollection;
    this.hsCodeJqXHR = null;
  },
  render: function() {

    this.renderCountriesSelect();
    if (this.model.id) {
      this.syncView();
      var shippingProfileId = this.model.get('shipping_profile_id');
      if (shippingProfileId ) {
        this.renderShippingRateGroupsSelect(shippingProfileId);
      }
    } else {
      this.$el.find('select[name="shipping_destination"]').val('international_shipping');
      this.$el.find('input[name="shipping-type"][value=0]').click();
    }
    return this;
  },
});

FancyBackbone.Views.Product.ReturnExchangeView = Backbone.View.extend({
  events: {
    'change .policy select[name=return_policy]': 'onSelectedReturnPolicyChange',
    'change .policy select[name=exchange_policy]': 'onSelectedExchangePolicyChange',
    'change .policy textarea#return_exchange_policy_description': 'onKeyupReturnExchangePolicyDesc',
    'click .policy input#use_exchange': 'onClickUseExchangeCheckBox',
    'keyup .policy .return_policy_day input[name="custom_return_policy_days"]': 'onKeyupCustomReturnPolicyDays',
    'keyup .policy .use_exchange .exchange_policy_day input[name="custom_exchange_policy_days"]': 'onKeyupCustomExchangePolicyDays',
    'click .policy .btn-reset': 'onClickBtnReset',
  },
  ui: {
    $returnPolicy: '.policy',
    $returnPolicySelect: '.policy select[name=return_policy]',
    $customReturnPolicyDays: '.policy .return_policy_day input[name="custom_return_policy_days"]',
    $customReturnPolicyDaysBlock: '.policy .return_policy_day',
    $exchangePolicySelect: '.policy select[name=exchange_policy]',
    $customExchangePolicyDays: '.policy .use_exchange .exchange_policy_day input[name="custom_exchange_policy_days"]',
    $customExchangePolicyDaysBlock: '.policy .use_exchange .exchange_policy_day',
    $returnExchangePolicyDesc: '.policy textarea#return_exchange_policy_description',
    $useExchangeInput: '.policy input#use_exchange',
    $useExchangeDiv: '.policy div.use_exchange'
  },
  synchronizeExchangePolicy: function () {
    if (this.ui.$useExchangeInput.is(':checked')) {
      this.ui.$exchangePolicySelect.val(this.ui.$returnPolicySelect.val());
      this.ui.$customExchangePolicyDays.val(this.ui.$customReturnPolicyDays.val());
    }
  },
  onSelectedReturnPolicyChange: function (event) {
    if (this.ui.$returnPolicySelect.val() == 4) { // custom return policy selected
      this.ui.$returnPolicy.addClass('custom');
      //this.ui.$customReturnPolicyDaysBlock.show();
    } else {
      this.ui.$returnPolicy.removeClass('custom');
      //this.ui.$customReturnPolicyDaysBlock.hide();
    }

    this.synchronizeExchangePolicy();
    this.renderReturnExchangePolicyDescription();
  },
  renderCustomExchangePolicyDaysBlock: function () {
    if (this.ui.$exchangePolicySelect.val() == 4) { // custom exchange policy selected
      this.ui.$customExchangePolicyDaysBlock.show();     
      this.ui.$returnPolicy.addClass("custom_exchange");
    } else {
      this.ui.$customExchangePolicyDaysBlock.hide();      
      this.ui.$returnPolicy.removeClass("custom_exchange") 
    }
  },
  onSelectedExchangePolicyChange: function (event) {
    this.renderCustomExchangePolicyDaysBlock();
    this.renderReturnExchangePolicyDescription();
  },
  onClickUseExchangeCheckBox: function (event) {
    var $input = $(event.currentTarget);

    if ($input.is(':checked')) {
      //this.ui.$useExchangeDiv.hide();
      this.ui.$returnPolicy.removeClass("exchange");
      this.synchronizeExchangePolicy();
    } else {
      this.renderCustomExchangePolicyDaysBlock();
      this.ui.$returnPolicy.addClass("exchange");
      //this.ui.$useExchangeDiv.show();
    }

    this.renderReturnExchangePolicyDescription();
  },
  onKeyupCustomReturnPolicyDays: function () {
    this.synchronizeExchangePolicy();
    this.renderReturnExchangePolicyDescription();
  },
  onKeyupCustomExchangePolicyDays: function () {
    this.renderReturnExchangePolicyDescription();
  },
  renderReturnExchangePolicyDescription: function () {
    if (this.policyJqXHR) {
      this.policyJqXHR.abort();
      this.policyJqXHR = null;
    }
    var returnPolicy = this.ui.$returnPolicySelect.val(),
      exchangePolicy = this.ui.$exchangePolicySelect.val(),
      customReturnPolicyDays = null,
      customExchangePolicyDays = null;

    if (returnPolicy == 4) {
      customReturnPolicyDays = $.trim(this.ui.$customReturnPolicyDays.val());
      if (!customReturnPolicyDays) {
        customReturnPolicyDays = "[RETURN POLICY]";
      }
    } else {
      customReturnPolicyDays = null;
    }

    if (this.ui.$useExchangeInput.is(':checked')) {
      exchangePolicy = returnPolicy;
      customExchangePolicyDays = customReturnPolicyDays;
    } else {
      if (exchangePolicy == 4) {
        customExchangePolicyDays = $.trim(this.ui.$customExchangePolicyDays.val());
        if (!customExchangePolicyDays) {
          customExchangePolicyDays = "[EXCHANGE POLICY]";
        }
      } else {
        customExchangePolicyDays = null;
      }
    }

    var param = {
      return_policy: returnPolicy,
      exchange_policy: exchangePolicy
    };

    if (customReturnPolicyDays !== null) {
      param['custom_return_policy_days'] = customReturnPolicyDays;
    }

    if (customExchangePolicyDays !== null) {
      param['custom_exchange_policy_days'] = customExchangePolicyDays;
    }

    var originalPolicyDesc = this.ui.$returnExchangePolicyDesc.val();
    this.ui.$returnExchangePolicyDesc.val('Loading...');
    this.ui.$returnExchangePolicyDesc.prop('disabled', true);
    var that = this;
    this.policyJqXHR = $.get("/get_return_exchange_policy_description.json", param,
      function (response) {
        if (response.status_code != undefined && response.status_code == 1) {
          that.ui.$returnExchangePolicyDesc.attr('default-policy-desc', response.return_exchange_policy_description);
          if( returnPolicy == that.model.get('return_policy') &&  that.model.get('custom_return_exchange_policy_description') ){
            that.ui.$returnExchangePolicyDesc.val(that.model.get('custom_return_exchange_policy_description'));
          }else{
            that.ui.$returnExchangePolicyDesc.val(response.return_exchange_policy_description);
          }
        } else if (response.status_code != undefined && response.status_code == 0) {
          if (response.message != undefined) {
            that.ui.$returnExchangePolicyDesc.val(originalPolicyDesc);
            alert(response.message);
          }
        }

        that.ui.$returnExchangePolicyDesc.prop('disabled', false);
      }, "json");
  },
  onKeyupReturnExchangePolicyDesc: function (e) {
      var returnPolicy = this.ui.$returnPolicySelect.val();
      // write changed custom policy
      if (returnPolicy === '4') {
          this.ui.$returnExchangePolicyDesc.attr('custom-policy-desc', this.ui.$returnExchangePolicyDesc.val())
      }
  },
  onClickBtnReset: function (e) {
    var defaultPolicyDesc = this.ui.$returnExchangePolicyDesc.attr('default-policy-desc');
    this.ui.$returnExchangePolicyDesc.val(defaultPolicyDesc);
  },
  syncReturnPolicy: function() {
    var returnPolicy = (this.$el.find('select[name=return_policy] option:selected').val() || "").trim();
    this.model.set('return_policy', returnPolicy);

    if (returnPolicy == 4) { // custom day returns
      this.model.set('custom_return_policy_days', this.$('input[name="custom_return_policy_days"]').val().trim());
    } else {
      this.model.set('custom_return_policy_days', null);
    }
  },
  syncExchangePolicy: function() {
    var exchangePolicy = (this.$el.find('select[name=exchange_policy] option:selected').val() || "").trim();
    this.model.set('exchange_policy', exchangePolicy);

    if (exchangePolicy == 4) { // custom day exchanges
      this.model.set('custom_exchange_policy_days', this.$('input[name="custom_exchange_policy_days"]').val().trim());
    } else {
      this.model.set('custom_exchange_policy_days', null);
    }
  },
  syncCustomReturnExchangePolicyDescription: function () {
    var defaultPolicyDesc = this.ui.$returnExchangePolicyDesc.attr('default-policy-desc');
    var policyDesc = this.ui.$returnExchangePolicyDesc.val();

    if (policyDesc != defaultPolicyDesc) {
      this.model.set('custom_return_exchange_policy_description', policyDesc);
    } else { // no custom policy desc
      this.model.set('custom_return_exchange_policy_description', null);
    }
  },
  syncModel: function() {
    this.syncReturnPolicy();
    this.syncExchangePolicy();
    this.syncCustomReturnExchangePolicyDescription();

  },
  syncView: function() {
    this.$el.find("select[name=return_policy]").val(this.model.get('return_policy')).trigger('change');
    this.$el.find("input[name='custom_return_policy_days']").val(this.model.get('custom_return_policy_days'));
    this.$el.find("select[name=exchange_policy]").val(this.model.get('exchange_policy')).trigger('change');
    this.$el.find("input[name='custom_exchange_policy_days']").val(this.model.get('custom_exchange_policy_days'));
    this.ui.$returnExchangePolicyDesc.val(this.model.get('return_exchange_policy_description'));
  },
  initialize: function() {
    var that = this;
    _.each(this.ui, function (selector, uiElement) {
      that.ui[uiElement] = that.$(selector);
    });
    this.policyJqXHR = null;
  },
  render: function() {
    if (this.model.id) {
      this.syncView();
    }
    return this;
  },
});

FancyBackbone.Views.Product.ShippingRateRuleTableNewView = Backbone.View.extend({
  template: FancyBackbone.Utils.loadTemplate("product_shipping_rate_rule_table_new"),
  initialize: function(options) {
    this.data = options.data;
  },
  render: function() {
    this.$el.html(this.template(this.data));

    return this;
  },
});

FancyBackbone.Views.Product.ShippingRateGroupNewView = Backbone.View.extend({
  initialize: function(options) {
    this.usa_el = options.usa_el;
    this.intl_el = options.intl_el;
  },
  renderShippingRateRule: function(shippingRateRule) {
    var tableView = new FancyBackbone.Views.Product.ShippingRateRuleTableNewView({
      data: shippingRateRule
    });
    if (shippingRateRule.country_code == 'us') {
      this.usa_el.append(tableView.render().$el);
    } else {
      this.intl_el.append(tableView.render().$el);
    }
  },
  renderShippingRateRules: function(shippingRateRules) {
    _.map(shippingRateRules, this.renderShippingRateRule, this);
  },
  render: function() {
    var that = this;
    if(this.model){
      this.model.fetch().success(function() {
        that.usa_el.empty();
        that.intl_el.empty();
        that.renderShippingRateRules(that.model.get('shipping_rate_rules'));
      });  
    }
    return this;
  },
});

FancyBackbone.Views.Product.MiscellaneousView = Backbone.View.extend({
  events: {
    'click #fancy_profile': 'onFancyProfileChange',
  },
  onFancyProfileChange:function(e){
    this.$el.find('#fancy_profile').toggleClass('on off');
  },
  syncModel: function() {
    if (!this.model.id) {
      this.model.set('fancy_this_item', this.$el.find("#fancy_profile").hasClass('on'));
    }
  },
  render: function() {
    if(this.model.id) {
      this.$el.hide();
    }
    return this;
  }
});

FancyBackbone.Views.Product.ProcessingDataView = Backbone.View.extend({
  events: {
    'click .buy_url a.add': 'onAddBuyUrlClick',
    'click .buy_url a.btn-del': 'onDeleteBuyUrlClick',
    'click .buy_url input:text': 'onAddBuyUrlTextClick',
    'click .tags .select-lists > a.add': 'onClickAddTag',
    'click .tags .select-lists .trick': 'onClickAddTag',
    'click .tags .select-lists .lists ul li a[name]': 'onAddPreviousTag',
    'click .tags .selected a.btn-del': 'onDeleteTag',
    'click #exclude_bulk': 'onClickExcludeBulk',
  },
  onAddBuyUrlClick:function(e){
    e.preventDefault();
    var $this = $(e.target);
    $('<li><input type="text" class="text" placeholder="http://" value=""><a href="#" class="btn-del">Delete</a></li>').insertBefore($this);
  },
  onAddBuyUrlTextClick:function(e){
    e.preventDefault();
    $(e.target).select();
  },
  onDeleteBuyUrlClick:function(e){
    e.preventDefault();
    var $this = $(e.target);
    $this.closest("li").remove();
  },
  onClickExcludeBulk:function(e){
    var checked = $(e.target).is(":checked");
    this.$el.find("#discount-code, #dropship_domestically, #dropship_internationally").prop('disabled', !checked);
  },
  onClickAddTag: function(e){
    e.preventDefault();
    this.$el.find(".tags .lists, .tags .select-lists > a.add").toggle();
  },
  getSelectedTags: function() { 
    var keywords = [];
    _.each( this.$el.find(".tags .tags-picker > span.selected"), function(tag) {
      keywords.push($(tag).attr('name'));
    });
    return keywords; 
  },
  updateExistingTagButtons: function() { 
    var that = this; 
    var keywords = this.getSelectedTags(); 
    _.each(this.$el.find('.tags .lists ul li a[name]'), function(pre_tag) { 
      var aTag = $(pre_tag).attr('name'); 
      if(_.find(keywords, function(keyword) { return keyword == aTag }) != undefined) { 
        $(pre_tag).closest('li').hide(); 
      } else { 
        $(pre_tag).closest('li').show(); 
      }
    }); 
    if(keywords.length){
      this.$el.find(".tags-picker").removeClass('blank');
    }else{
      this.$el.find(".tags-picker").addClass('blank');
    }
  }, 
  addTag: function(tag, tag_id){
    if (!tag || tag === '') return;
    var keywords = this.getSelectedTags(); 
    if(_.find(keywords, function(keyword) { return keyword == tag }) != undefined) { 
      return false; 
    }
    var $span = $('<span class="selected"><a href="#" class="btn-del">Remove</a></span>');
    $span.attr("name", tag);
    $span.attr("tag_id", tag_id);
    $span.prepend(document.createTextNode(tag));
    $span.insertBefore( this.$el.find('.tags .tags-picker .select-lists') );
    var input = this.$el.find('.tags .select-lists .lists input:text'); 
    input.val(''); 

    this.updateExistingTagButtons(); 
  },
  onAddPreviousTag: function(e){
    e.preventDefault(); 
    var aTag = $(e.currentTarget).attr('name');
    var tag_id = $(e.currentTarget).attr('tag_id');
    this.addTag(aTag, tag_id); 
    this.updateExistingTagButtons(); 
  },
  onDeleteTag: function(e){
    e.preventDefault();
    $(e.currentTarget).closest('span').remove();
    this.updateExistingTagButtons(); 
    return false;
  },
  addPreviousTag: function(tag) { 
    var $span = $('<li><a href="#"></a></li>');
    $span.find("a").attr("name", tag).prepend(document.createTextNode(tag));
    this.$el.find('.tags .lists ul').append($span); 
  }, 
  syncModel: function() {
    if (this.model.id && this.$el.find('.vendor select')[0]) {
      var vendor_id = this.$el.find('.vendor select').val();
      var notes = this.$el.find('input[name=notes]').val();
      var fancy_contact = this.$el.find('input[name=fancy-contacts-vendor]').val();
      var discount_code = this.$el.find('input[name=discount-code]').val();
      var manual_override = this.$el.find('#exclude_bulk').is(':checked');
      var is_international_dropship = this.$el.find('#dropship_internationally').is(':checked');
      var is_domestic_dropship = this.$el.find('#dropship_domestically').is(':checked');
      var processing_tag_ids = Array.prototype.slice.call( this.$el.find(".tags span.selected").map(function(){return $(this).attr('tag_id') }) );
      var buy_urls = Array.prototype.slice.call( this.$el.find(".buy_url input").map(function(){if($(this).val()){return $(this).val()}}));
      
      this.model.set('vendor_id', vendor_id);
      this.model.set('notes', notes);
      this.model.set('fancy_contact', fancy_contact);
      this.model.set('discount_code', discount_code);
      this.model.set('manual_override', manual_override);
      this.model.set('is_domestic_dropship', is_domestic_dropship);
      this.model.set('is_international_dropship', is_international_dropship);
      this.model.set('processing_tag_ids', processing_tag_ids);
      this.model.set('buy_url', buy_urls);

    }
  },
  render: function() {
    
    return this;
  }
});

FancyBackbone.Views.Product.PrivateSaleView = Backbone.View.extend({
  events: {
    'click #private-sale': 'onPrivateSaleChange',
  },
  onPrivateSaleChange:function(e){
    this.$el.find("#private-sale").toggleClass('on');
  },
  syncModel: function() {
    if (this.model.id) {
      var is_private = this.$el.find('#private-sale').hasClass('on');
      var private_allow_users = this.$el.find(".specific_users input:text").val();
      this.model.set('is_private', is_private);
      this.model.set('private_allow_users', private_allow_users);
    }
  },
  render: function() {
    
    return this;
  }
});

FancyBackbone.Views.Product.StatusView = Backbone.View.extend({
  events: {
    'click button[name=product_is_active]': 'onActiveChange',
    'click button[name=marked_soldout]': 'onSoldoutChange',
    'click button[name=show_anywhere_only]': 'onAnywhereOnlyChange',
  },
  onActiveChange:function(e){
    this.$el.find("button[name=product_is_active]").toggleClass('on');
    if( this.$el.find("button[name=product_is_active]").hasClass('on') ){
      this.$el.find("p.status label").text('Active');
    }else{
      this.$el.find("p.status label").text('Inactive');
    }
  },
  onSoldoutChange:function(e){
    this.$el.find("button[name=marked_soldout]").toggleClass('on');
  },
  onAnywhereOnlyChange:function(e){
    if(this.$el.find("button[name=show_anywhere_only]")[0])
      this.$el.find("button[name=show_anywhere_only]").toggleClass('on');
  },
  syncThingIds: function(){
    if( this.$el.find('.thing_id').length ){
      var thing_id = this.$el.find(".thing_id input").val();
      this.model.set('thing_id', thing_id);
    }
  },
  
  syncModel: function() {
    var is_active = this.$el.find('button[name=product_is_active]').hasClass('on');
    var marked_soldout = this.$el.find('button[name=marked_soldout]').hasClass('on');
    this.model.set('is_active', is_active);
    this.model.set('marked_soldout', marked_soldout);

    if( this.$el.find('button[name=show_anywhere_only]').length ){
      var show_anywhere_only = this.$el.find('button[name=show_anywhere_only]').hasClass('on');
      this.model.set('show_anywhere_only', show_anywhere_only);
    }
    this.syncThingIds();
  },
  syncView: function() {
    if (this.model.id) {
      if (this.model.get('is_active')) {
        this.$el.find('button[name=product_is_active]').addClass('on');
        this.$el.find("p.status label").text('Active');
      } else {
        this.$el.find('button[name=product_is_active]').removeClass('on');
        this.$el.find("p.status label").text('Inactive');
      }

      var locked = this.model.is_locked_field('is_active');
      this.$el.find('button[name=product_is_active]').prop('disabled',locked);
      if(locked) this.$el.find('p.status').addClass('locked');
      else this.$el.find('p.status').removeClass('locked');

      if (!this.model.get('seller_owns_thing')) {
        this.$el.find('button[name=product_is_active]').prop('disabled', true);
      }

      if (this.model.get('marked_soldout')) {
        this.$el.find('button[name=marked_soldout]').addClass('on');
      }else{
        this.$el.find('button[name=marked_soldout]').removeClass('on');
      }
      this.$el.find('input#marked_soldout').prop('disabled', this.model.is_locked_field('quantity'));
      if(this.model.is_locked_field('quantity')) this.$el.find('input#marked_soldout').addClass('locked')
      else this.$el.find('input#marked_soldout').removeClass('locked')
      
    } else {
      this.$el.find('button[name=product_is_active]').addClass('on');
      this.$el.find("p.status label").text('Active');
      this.$el.find('button[name=marked_soldout]').removeClass('on');
    }
    
  },
  initialize: function() {
  },
  render: function() {
    this.syncView();
    return this;
  },
});

FancyBackbone.Views.Product.OrganizeView = Backbone.View.extend({
  events: {
    'click .category_ids a.selector': 'onClickSelectedCategory',
    'click .category_ids .trick': 'onClickSelectedCategory',
    'click .category_ids .lists a[data-idx]': 'onSelectedCategoryChange',
    'click .category_ids .category-lists li.cat-li': 'onAddCategoryClick2',
    'click .category_ids a.add': 'onAddCategoryClick',
    'click .select-category-2 .select-lists': 'onFocusCategoryInput',
    'focus .select-category-2 input._focus': 'onFocusCategoryInput',
    'blur .select-category input._focus': 'onBlurCategoryInput',
    'keyup .select-category-2 input': 'onChangeCategoryInput',
    'click .others .manually': 'onClickManualAddCategory',
    'click .category_ids ul.step-category > li > a.btn-del': 'onRemoveCategoryClick',
    'click .add-collection a.selector': 'onClickSelectCollection',
    'click .add-collection .trick': 'onClickSelectCollection',
    'click .add-collection .lists a[value]': 'onChangeCollectionSelect',
    'click .add-collection .lists .create a': 'onClickCreateCollectionButton', 
    'click .add-collection .step-category a.btn-del': 'onClickDeleteCollection',
    'click .step-category li a.tooltip': 'onClickCategoryApproval',
    'keyup .add-collection .search input': 'onSearchCollection',
    'click .tags .select-lists > a.add': 'onClickAddTag',
    'click .tags .select-lists .trick': 'onClickAddTag',
    'keyup .tags .select-lists .lists input:text': 'onInputTag',
    'paste .tags .select-lists .lists input:text': 'onInputTag',
    'click .tags .select-lists .lists button.add': 'onAddTag',
    'click .tags .select-lists .lists .previous-tags ul li a[name]': 'onAddPreviousTag',
    'click .tags .select-lists .lists .filter-tags ul li a[name]': 'onAddShopFilterTag',
    'click .tags .selected a.btn-del': 'onDeleteTag',
    'click .google-product-category a.selector': 'onClickSelectGoogleProductType',
    'click .google-product-category a.btn-del': 'onClickClearGoogleProductType',
    'click .google-product-category .trick': 'onClickSelectGoogleProductType',
    'click .google-product-category .lists a[data-product-type-id]': 'onChangeGoogleProductTypeSelect',
    'keyup .google-product-category input[type="text"]': 'onSearchGoogleProductType',
  },
  onClickSelectGoogleProductType: function(event) {
    event.preventDefault();
    this.$el.find(".google-product-category .lists").toggle();
    if( this.$el.find(".google-product-category .lists").is(":visible") ){
      this.$el.find(".google-product-category input[type='text']").focus();
    }
  },
  onClickClearGoogleProductType: function(event) {
    event.preventDefault();
    this.$el.find(".google-product-category .selector").text("Select Google Product Category");
    this.$el.find(".google-product-category input[name='google-product-category']").val(null);
    this.$el.find(".google-product-category .btn-del").hide();
  },
  onSearchGoogleProductType: function(event) {
    this.$el.find('.category.google-product-category ul').show()
    var fn = arguments.callee;

    var $this = $(event.currentTarget);

    if(fn.delayed_timer) {
        clearTimeout(fn.delayed_timer);
        fn.delayed_timer = null;
    }

    var keyword = $this.val();

    fn.delayed_timer = setTimeout(function() {
        clearTimeout(fn.delayed_timer);

        $('.google-product-category ul>li').hide();
        $('.google-product-category ul>li').each(function(i,elem) {
            if($(elem).find('a').html().toLowerCase().search(keyword.toLowerCase())>=0) {
                $(elem).show();
            }
        });
    }, 300);
  },
  onChangeGoogleProductTypeSelect: function(event) {
    event.preventDefault();
    var $this = $(event.currentTarget);
    var id = $this.data('product-type-id');
    var name = $this.text();
    this.$el.find('.google-product-category input[type="text"]').val(name);
    this.$el.find('.google-product-category input[name="google-product-category"]').val(id);
    this.$el.find(".google-product-category .lists").hide();
    this.$el.find(".google-product-category .selector").text(name);
    this.$el.find(".google-product-category .btn-del").show();
  },
  onFocusCategoryInput: function(event){
    event.preventDefault();
    if ($('.select-category-2 input._focus').val()) {
      if ($('.select-category-2 input._focus').val().trim().length > 0) {
        $(event.target).closest('.select-category-2').addClass('focus');
      }
    }
  },
  onBlurCategoryInput: function(event){
    setTimeout(function() {
      event.preventDefault();
      $(event.target).closest('.select-category-2').removeClass('focus');
    }, 150);
  },
  onChangeCategoryInput: _.debounce(function(event) {
    var str = event.target.value.trim();
    var $container = $(event.target).closest('.select-category-2')
    var selectedIds = $container.find('ul.step-category li').toArray().map(function(e){ return $(e).data('model').id })
    if (str) {
      $container.addClass('focus');
        var results = this.categoryCollection.findCategoryByString(str);
        $container.find('.category-lists .step1')
          .empty()
          .append(
            results
            .filter(function(res) {
                return !selectedIds.some(function(selectedId) {
                  return String(res.id) === String(selectedId)
                })
            })
            .map(function(res) {
              return $('<li class="cat-li" data-id="' + res.id + '"><a href="#">' + res.omniDisplay + '</a><a href="#" class="add">Add</a></li>')
            })
          );
    } else {
      $container.removeClass('focus');
      $container.find('.category-lists .step1').empty()
    }
  }, 100),
  onClickManualAddCategory: function(event) {
    event.preventDefault();
    $.dialog('add-categories').open();
  },
  onClickSelectedCategory: function(event){
    event.preventDefault();
    this.setCurrentCategory(null);
  },
  onSelectedCategoryChange: function(event) {
    event.preventDefault();
    var categoryId = $(event.currentTarget).attr('data-idx');
    var category = this.categoryCollection.get(categoryId);
    this.setCurrentCategory(category);
    if( $(event.currentTarget).parent().is(".recent") ){
      this.$el.find(".category_ids a.add").click();
    }
  },
  onRemoveCategoryClick: function(event) {
    event.preventDefault();
    var $categoryListItem = $(event.currentTarget).closest("li");
    $categoryListItem.remove();
    if( !this.$el.find(".category_ids ul.step-category li:visible")[0] ){
      this.$el.find(".category_ids ul.step-category").hide();
    }
    if( $categoryListItem.data('root-id')){
      var rootId = $categoryListItem.data('root-id');
      if(!this.$el.find(".category_ids ul.step-category li[data-root-id="+rootId+"]:visible").length){
        this.$el.find(".category_ids .step1 a[data-idx="+rootId+"]").show();
      }
    }
    if( this.$el.find(".category_ids ul.step-category li").length < 2){
      this.$el.find(".category_ids .select-lists").show();
    }
    this.trigger('onCategoryChange');
  },
  addCategory: function(category) {
    var $categoryListItem = this.renderSelectingCategoryListItem(category);
    $categoryListItem.prependTo(this.$el.find(".category_ids ul.step-category"));
    $categoryListItem.data('model', category);
    $categoryListItem.css("display", "block");
    this.$el.find(".category_ids ul.step-category").show();
    if (!category.attributes.is_approved) {
      $categoryListItem.removeClass('selected');
    }
    if (!this.whitelabel && this.is_admin) {
      $categoryListItem.prepend('<a href="#" class="approval tooltip"><em>Pending admin approval</em></a>')
      $categoryListItem.prepend('<a href="#" class="approved tooltip"><em>Admin approved</em></a>')
    }

    this.$el.find(".category_ids").removeClass("error");
  },
  onAddCategoryClick: function(event) {
    event.preventDefault();
    event.stopPropagation();
    return this.onAddCategoryClick2(event);
  },
  // ?new 
  onAddCategoryClick2: function(event) {
    event.preventDefault();
    this.syncCategories();
    var categories = this.model.get("categories");
    this.currentCategory = this.categoryCollection.get($(event.target).closest('li').data('id'))
    if (categories.get(this.currentCategory.id)) {
      alertify.alert("You already selected this category.");
    } else if (!this.whitelabel && categories.length >= 3) {
      alertify.alert("You can add up to 3 categories.");
    } else {
      this.addCategory(this.currentCategory);
      this.setCurrentCategory(null);
      this.trigger('onCategoryChange');
    }
    // $(event.target).closest('li').remove()
  },
  onClickCategoryApproval: function(event) {
    $(this).closest('li').toggleClass('selected');
  },
  renderCategorySelect: function(theCategory) {
    var $this = this;
    var subCategories = this.categoryCollection.findSubCategories(theCategory);

    var subcategoryList = '';
    if (subCategories.length > 0) {
      $(subCategories).each(function(){
        subcategoryList += "<li><a href='#'' data-idx='"+this.id+"''>"+this.get('display')+"</a></li>";
      })
    }

    if (theCategory) {
      var step = this.$el.find(".category_ids .category-lists a[data-idx="+theCategory.id+"]").closest('ul');
      var header = "<a href='#' data-idx='' class='back'></a>";
      var parents = [theCategory];
      var parent = theCategory;
      while( (parent = this.categoryCollection.findParentCategory(parent)) ){
        parents.push(parent);
      }
      parents = parents.reverse();
      $(parents).each(function(){
        if(this!=theCategory){
          header += "<a href='#' data-idx='"+this.id+"'>"+this.get('display')+"</a> <span class='arrow'>&gt;</span>";
        }else{
          header += this.get('display');
        }
      })
      this.$el.find(".category_ids .lists dt b").html(header);
      
      if(subcategoryList){
        step.nextAll().empty();
        step.next().html(subcategoryList);
        this.$el.find(".category_ids .category-lists").css({'left': (step.next().prevAll().length*-100)+'%', height: step.next().outerHeight()+"px"});
      }else{
        this.$el.find(".category_ids .category-lists a.selected").removeClass('selected');
        this.$el.find(".category_ids .category-lists a[data-idx="+theCategory.id+"]").addClass('selected');
      }
    } else {
      this.$el.find(".category_ids .lists dt b").html('Select Category');
      this.$el.find(".category_ids .category-lists ul:not(.step1)").empty();
      this.$el.find(".category_ids .category-lists").css({'left':0, height: this.$el.find(".category_ids .category-lists ul.step1").outerHeight()});
    }
  },
  renderCategorySelect2: function(theCategory, step) {
    var subCategories = this.categoryCollection.findSubCategories(theCategory) || [];
    if (subCategories.length > 0) {
      subCategories = subCategories.map(function(c){
        return $("<option value='"+c.id+"'>"+c.get('display')+"</select>")
      });
  
      if (theCategory) {
        var existingSteps = $('.popup.add-categories select').length;
        $('.popup.add-categories > fieldset').append('<select class="step' + (existingSteps + 1) + '" />')
        var $nextStep = $('.popup.add-categories .step' + (step + 1))
        if(subCategories){
          $nextStep
            .empty()
            .prepend('<option value="">Select</option>')
            .append(subCategories);
        }
      }
      return true
    } else {
      return false
    }
  },
  renderSelectingCategoryListItem: function(theCategory) {
    if (theCategory) {
      var involvedCategories = [];
      var aCategory = theCategory;
      while(aCategory) {
        involvedCategories.push(aCategory);
        aCategory = this.categoryCollection.get(aCategory.get('parent_id'));
      }
      involvedCategories.reverse();

      var display = _.map(involvedCategories, function(category) {
        return category.get("display");
      }).join(" <span>›</span> ");
      return $('<li class="selected" style="display:block;" data-root-id="'+involvedCategories[0].get('id_str')+'">' + display + '<a href="#" class="btn-del">Delete</a></li>');
    } else {
      return $();
    }
  },
  renderMeasuringGuideSelect: function(mgid) {
    var measuringGuideCollection = [];
    _.map(this.measuringGuideCollection.models, function(measuringGuide) {
        var option = measuringGuide.createSelectOption();
        measuringGuideCollection.push(option);
    })
    
    this.$el.find("select[name=measuring-guide]").find('option[value!=""]').remove();
    this.selectView = new FancyBackbone.Views.Base.SelectView({
      defaultOption: false,
      el: this.$el.find("select[name=measuring-guide]"),
      options: measuringGuideCollection,
    }).render();

    var mgid2 = null;
    $(measuringGuideCollection).each(function(){
      if( this.value == mgid){
        mgid2 = mgid;
      }
    })
    if(mgid2) this.selectView.selectValue(mgid2);
  },
  setCurrentCategory: function(category) {
    this.currentCategory = category;
    this.renderCategorySelect(category);
  },
  syncCategories: function() {
    var sel;
    sel = ".category_ids ul.step-category li"
    var productCategoryCollection = new FancyBackbone.Collections.Product.CategoryCollection(
      _.map(this.$el.find(sel), function(selectedCategoryListItem) {
        var model = $(selectedCategoryListItem).data('model');
        var recentCategories = $.jStorage.get('recent_categories')||[];
        if( _.contains( recentCategories, model.id) ){
          recentCategories = _.without(recentCategories, model.id);
        }
        recentCategories.unshift(model.id);
        $.jStorage.set('recent_categories', recentCategories);
        return model;
      })
    );
    this.model.set('categories', productCategoryCollection);
  },
  syncCollections: function(){
    var id_list = []; 
    this.$el.find(".add-collection ul.step-category li").each(function() { 
      id_list.push($(this).attr('value'));
    }); 
    this.model.set('collection_ids', id_list); 
  },
  onClickSelectCollection: function(event){
    event.preventDefault();
    this.$el.find(".add-collection .lists").toggle().find("a.add").hide();
    if( this.$el.find(".add-collection .lists").is(":visible") ){
      this.$el.find(".add-collection .search input").focus();
    }
  },
  getCollectionWithID: function(c_id) { 
    var collections = this.model.get('seller_collections'); 
    return _.find(collections, function(collection){ return collection.id == c_id; }); 
  }, 
  addCollection: function(c_title, c_id) {
    var found = false; 
    this.$el.find(".add-collection ul.step-category li").each(function() { if($(this).attr('value') == c_id) { found = true; return false; }  }); 
    if (found) return false; 

    this.$el.find(".add-collection ul.step-category").append('<li class="selected" value="' +c_id+ '">' +c_title+ '<a href="#" class="btn-del">Delete</a></li>');
    this.$el.find(".add-collection .lists ul.step1 a[value="+c_id+"]").addClass('selected');
    this.syncCollections();
  }, 
  onChangeCollectionSelect: function(event) { 
    event.preventDefault();
    var collectionId = $(event.currentTarget).attr('value');
    if (collectionId == '-1') { 
      this.$el.find(".add-collection .lists a.add").hide();
    } else if (collectionId == 'add') {
      this.$el.find(".add-collection .lists a.add").hide();
      var that = this;
      $.post("/merchant/products/collections/popup-create.html", {} ,function(html){
          $('.popup.edit_mylist').find('#edit_title').hide();
          $('.popup.edit_mylist').find('#create_title').show();
          $('.popup.edit_mylist').find('.fill').empty();
          $('.popup.edit_mylist').find('.fill').append(html);
          var $list_popup = $.dialog('edit_mylist');
          $list_popup.open(); 
          $list_popup.$obj.on('create:collection', function(event, c_id, c_name){
            var has_cid = _.find(that.$el.find('.add-collection .select-category .lists ul.step1 a[value]'), function(opt) { return $(opt).attr('value') == c_id; });
            if (has_cid == undefined) {
              that.addExistingCollection(c_id, c_name); 
              that.$el.find('.add-collection .lists ul.step1 li a[value='+c_id+']').click();
            }
          });
      }, "html");
    }else { 
      var $selected_collection = $(event.currentTarget);
      if( $selected_collection.hasClass('selected') ){
        $selected_collection.removeClass('selected').closest('.add-collection').find("li.selected[value="+$selected_collection.attr('value')+"] .btn-del").click();
      }else{
        $selected_collection.addClass('selected');
        this.addCollection($selected_collection.text(), $selected_collection.attr('value'));
        this.$el.find(".add-collection .lists").toggle();
        this.$el.find(".add-collection ul.step-category").show();
      }
    }
  }, 
  onClickAddCollectionButton: function(event) { 
    event.preventDefault();
    var $selected_collection = this.$el.find(".add-collection .select-category .lists ul.step1 a.selected");
    this.addCollection($selected_collection.text(), $selected_collection.attr('value'));
    this.$el.find(".add-collection ul.step-category").show();
    this.$el.find(".add-collection .lists").toggle().find("a.add").hide();
  },
  onClickCreateCollectionButton: function(event) { 
    event.preventDefault();
    var that = this;
    var $el = $(event.target);
    var title = $el.parent().find("a:eq(0)").text();
    var param = {
      'collection_id': '',
      'title' : title,
      'description' : ''
    };
    $.post( FancyBackbone.Utils.makeURL('/merchant/products/collections/create.json'), param, 
         function(json){
           if (json.status_code == 1) {
              var c_id = json.collection_id;
              var c_name = title;
              var has_cid = _.find(that.$el.find('.add-collection .select-category .lists ul.step1 a[value]'), function(opt) { return $(opt).attr('value') == c_id; });
              if (has_cid == undefined) {
                that.addExistingCollection(c_id, c_name); 
                that.$el.find('.add-collection .lists ul.step1 li a[value='+c_id+']').click();
              }
           }
           else if (json.status_code == 0) {
             var msg = json.message;
             alertify.alert(msg);
           }
         }, "json");
  }, 
  onClickDeleteCollection: function(e) { 
    e.preventDefault();
    var value = $(e.currentTarget).closest('li').attr('value');
    $(e.currentTarget).closest('li').remove();
    this.syncCollections(); 
    this.$el.find(".add-collection .lists ul.step1 a[value="+value+"]").removeClass('selected');
    if( !this.$el.find(".add-collection ul.step-category li:visible").length ){
      this.$el.find(".add-collection ul.step-category").hide();
    }
  }, 
  onSearchCollection: function(e){
    var q = $(e.target).val();
    var ql = q.toLowerCase();
    var exists = false;
    this.$el.find(".add-collection")
      .find(".category-lists ul li").show().each(function(){
        var name = $(this).find("a").text().toLowerCase();
        if( name.indexOf(ql) == -1) $(this).hide();
        if( name == ql ) exists = true;
      })

    if( exists || !q){
      this.$el.find(".add-collection .create").hide();
    }else{
      this.$el.find(".add-collection .create").show().find('a:eq(0)').text(q);
    }
  },
  addExistingCollection: function(c_id, c_name) {
    this.$el.find('.add-collection .select-category .lists ul.step1').append('<li><a href="#" value="'+c_id+'">'+c_name+'</a></li>');
  },
  onClickAddTag: function(e){
    e.preventDefault();
    if(this.model.is_locked_field('keywords')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    this.$el.find(".tags .lists, .tags .select-lists > a.add").toggle().end().find(".tags .lists input:text").val('').focus().end().find(".tags .lists button.add").hide();
  },
  onInputTag: function(e){
    var val = this.$el.find(".tags .lists input:text").val();
    if(val){
      this.$el.find(".tags .lists button.add").show();
    }else{
      this.$el.find(".tags .lists button.add").hide();
    }
    if (this.$el.find('.tags .lists .filter-tags ul').length > 0) {
	this.showFilterSuggestion(val);
    }
  },

  showFilterSuggestion: function(val) {
    var self = this;
    var filters = [];
    _.map(self.saleitemFilterCollection.models, function(f) {
        _.each(f.get('options'), function(option) {
	    if (option.label.toLowerCase().startsWith(val) || option.value.toLowerCase().startsWith(val)) {
		option.filter_name = f.get('name');
		filters.push(option);
	    }
	});
    });
    self.$el.find('.tags .lists .filter-tags ul').empty();
    _.each(filters, function(option) {
	var $span = $('<li><a href="#"></a></li>');
	$span.find("a").attr("name", option.value).prepend(document.createTextNode(option.filter_name + ' - ' + option.label));
	self.$el.find('.tags .lists .filter-tags ul').append($span); 
    });
  },
  getSelectedTags: function() { 
    var keywords = [];
    _.each( this.$el.find(".tags .tags-picker > span.selected"), function(tag) {
      keywords.push($(tag).attr('name'));
    });
    return keywords; 
  },
  updateExistingTagButtons: function() { 
    var that = this; 
    var keywords = this.getSelectedTags(); 
    _.each(this.$el.find('.tags .lists .previous-tags ul li a[name]'), function(pre_tag) { 
      var aTag = $(pre_tag).attr('name'); 
      if(_.find(keywords, function(keyword) { return keyword == aTag }) != undefined) { 
        $(pre_tag).closest('li').hide(); 
      } else { 
        $(pre_tag).closest('li').show(); 
      }
    }); 
    if(keywords.length){
      this.$el.find(".tags-picker").removeClass('blank');
    }else{
      this.$el.find(".tags-picker").addClass('blank');
    }
  }, 
  addTag: function(tag, isSyncing){
    if (!tag || tag === '') return;
    var keywords = this.getSelectedTags(); 
    if(_.find(keywords, function(keyword) { return keyword == tag }) != undefined) { 
      return false; 
    }
    if(!isSyncing && this.model.is_locked_field('keywords')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    var $span = $('<span class="selected"><a href="#" class="btn-del">Remove</a></span>');
    $span.attr("name", tag);
    $span.prepend(document.createTextNode(tag));
    $span.insertBefore( this.$el.find('.tags .tags-picker .select-lists') );
    var input = this.$el.find('.tags .select-lists .lists input:text'); 
    input.val(''); 

    this.updateExistingTagButtons(); 
  },
  onAddTag: function(e){
    e.preventDefault(); 
    var self = this;
    if(this.model.is_locked_field('keywords')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    var tags = this.$el.find('.tags .lists input:text').val().split(",");
    $(tags).each(function(i,v){
      if(v.trim()) self.addTag(v.trim());   
    })
    this.$el.find('.tags .lists input:text').focus();
    this.$el.find(".tags .lists button.add").hide();
  },
  onAddPreviousTag: function(e){
    e.preventDefault(); 
    if(this.model.is_locked_field('keywords')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    var aTag = $(e.currentTarget).attr('name');
    this.addTag(aTag); 
    this.updateExistingTagButtons(); 
  },
  onAddShopFilterTag: function(e){
    e.preventDefault(); 
    if(this.model.is_locked_field('keywords')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    var aTag = $(e.currentTarget).attr('name');
    this.addTag(aTag); 
    this.updateExistingTagButtons(); 
  },
  onDeleteTag: function(e){
    e.preventDefault();
    if(this.model.is_locked_field('keywords')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    $(e.currentTarget).closest('span').remove();
    this.updateExistingTagButtons(); 
    return false;
  },
  addPreviousTag: function(tag) { 
    var $span = $('<li><a href="#"></a></li>');
    $span.find("a").attr("name", tag).prepend(document.createTextNode(tag));
    this.$el.find('.tags .lists .previous-tags ul').append($span); 
  }, 
  syncTags: function(){
    var keywords = this.getSelectedTags(); 
    this.model.set('keywords', keywords.join(','));
  },
  syncMeasuringGuide: function(){
    if( this.$el.find("select[name=measuring-guide]")[0] ){
      var guide = this.$el.find("select[name=measuring-guide]").val();
      this.model.set('size_guide_id', guide || null);
    }
  },
  syncGoogleProductType: function() {
    var $id = this.$el.find('.google-product-category input[name="google-product-category"]');
    if($id.length) {
        var metadata = this.model.get('metadata') || {};
        metadata['google-product-category'] = $id.val();
        this.model.set('metadata', metadata);
    }
  },
  syncModel: function() {
    this.syncCategories();
    this.syncCollections();
    this.syncTags();
    this.syncMeasuringGuide();
    this.syncGoogleProductType();
  },
  syncView: function() {
    var that = this, categories = this.model.get('categories');
    if (categories.length > 0) {
      for (var i = categories.length-1; i >= 0; i--) {
        this.addCategory(categories.at(i));
      }
      this.$el.find(".category_ids ul.step-category").show();
    }
    if( $.jStorage.get('recent_categories') &&  $.jStorage.get('recent_categories').length){
      var $recent = this.$el.find(".category_ids dd.recent")
      $recent.show();
      $( $.jStorage.get('recent_categories') ).each(function(idx, categoryId){
        if ($recent.children("a").length > 4) return;
        var category = that.categoryCollection.get(categoryId);
        if (category) {
            var $el = that.renderSelectingCategoryListItem(category);
            $recent.append("<a href='#' data-idx='"+categoryId+"'>"+ $el.find("a.btn-del").remove().end().html() );
        }
      })
    }
    var collections = this.model.get('collection_ids'); 
    for (var index in collections) {
      var collection = this.getCollectionWithID(collections[index]); 
      if (collection == undefined ) continue; 
      this.addCollection(collection.title, collection.id); 
      this.$el.find(".add-collection ul.step-category").show();
    }
    if(this.model.get('keywords')) { 
      var keywords = this.model.get('keywords').split(",");
      _.each(keywords, function(tag) { 
        that.addTag(tag, true);
      });
    }
    this.renderMeasuringGuideSelect(this.model.get('size_guide_id'));

    var google_product_category = this.model.get('metadata') && this.model.get('metadata')['google-product-category'];
    var google_product_category_name = null;

    if(google_product_category) {
        var $type = this.$el.find('.google-product-category li>a[data-product-type-id="'+google_product_category+'"]');
        if($type.length) {
            google_product_category_name = $type.text();
        }
    }
    if(google_product_category_name) {
        this.$el.find('.google-product-category a.selector').text(google_product_category_name);
        this.$el.find('.google-product-category a.btn-del').show();
        this.$el.find('.google-product-category input[name="google-product-category"]').val(google_product_category);
    } else {
        this.$el.find('.google-product-category a.selector').text("Select Google Product Category");
        this.$el.find('.google-product-category a.btn-del').hide();
        this.$el.find('.google-product-category input[name="google-product-category"]').val(null);
    }
  },
  initialize: function(options) {
    this.categoryCollection = window.categoryCollection;
    this.measuringGuideCollection = window.measuringGuideCollection;
    this.saleitemFilterCollection = window.saleitemFilterCollection;
    this.whitelabel = options.whitelabel;
    this.is_admin = options.is_admin;
    if (this.whitelabel) {
      var that = this;
      $('.select-category-2 .step-category').sortable({
        update: function() {
          that.syncCategories();
        }
      });
    }

    $('.select-category-2 .step-category').on('click', 'li .tooltip', function() {
      var $li = $(this).closest('li');
      if ($li.hasClass('updating')) {
        return;
      }
      $li.addClass('updating');
      // var cid = $li.data('model').attributes.id;
      var approve = !$li.hasClass('selected');
      // $.post('/admin/approve-category', { approve: JSON.stringify(approve), sid: window.product.attributes.id, cid: cid }, function(res){
      //   if (res && res.updated) {
      //     if (approve) {
      //       $li.addClass('selected');
      //     } else {
      //       $li.removeClass('selected');
      //     }
      //   }
      //   $li.removeClass('updating');
      //   $li.data('model').set('is_approved', true);
      // });
      if (approve) {
        $li.addClass('selected');
      } else {
        $li.removeClass('selected');
      }
      $li.removeClass('updating');
      $li.data('model').set('is_approved', approve);
      return false
    });

    $('.popup.add-categories').on('change', 'select', (function() {
      var $el = $(event.target);
      $el.nextAll().remove()
      var categoryId = $el.val();
      var step = $('.popup.add-categories select').index($el);
      if (categoryId) {
        var category = this.categoryCollection.get(categoryId);
        this.renderCategorySelect2(category, step + 1)
      }
      if (step < $('.popup.add-categories select').length - 1) {
        $('.popup.add-categories select').filter(function(i) { return i > step + 1 }).empty().prepend('<option value="">Select</option>')
      }

      if ($('.popup.add-categories select').length > 2 || $('.popup.add-categories select:last-child').val()) {
        $('.popup.add-categories .btn-save').prop('disabled', false)
      } else {
        $('.popup.add-categories .btn-save').prop('disabled', true)
      }
    }).bind(this));

    $('.popup.add-categories .btn-save')
      .on('click', (function() {
        var categoryId = $('.popup.add-categories select').filter(function(i, sel){ return $(sel).val() !== '' }).last().val();
        var category = this.categoryCollection.get(categoryId);
        this.currentCategory = category;
        this.syncCategories();
        var categories = this.model.get("categories");
        if (categories.get(this.currentCategory.id)) {
          alertify.alert("You already selected this category.");
        } else if (!this.whitelabel && categories.length >= 3) {
          alertify.alert("You can add up to 3 categories.");
        } else {
          this.addCategory(this.currentCategory);
          this.setCurrentCategory(null);
          this.trigger('onCategoryChange');
          $.dialog('add-categories').close()
          // reset/remove selects
          $('.popup.add-categories select').eq(0).val('')
          $('.popup.add-categories select').filter(function(i) { return i > 0 }).remove()
        }
      }).bind(this));
  },
  render: function() {
    this.setCurrentCategory(null);
    if (this.model.get('seller_collections')) {
      var that = this ;
      _.each( this.model.get('seller_collections'), function(collection) {
        that.addExistingCollection(collection.id, collection.title); 
      });
    }
    if (this.model.id) {
      this.syncView();
    }else{
      this.renderMeasuringGuideSelect('');
    }

    if(this.model.get('seller_tags') && this.model.get('seller_tags').length) { 
      var seller_tags = this.model.get('seller_tags');
      if( seller_tags.length > 10){
        seller_tags = seller_tags.slice(0,10);
      } 
      
      _.each(seller_tags, function(tag) { 
        that.addPreviousTag(tag); 
      }); 

      this.$el.find(".tags .lists > dl.previous-tags").show();
    }else{
      this.$el.find(".tags .lists > dl.previous-tags").hide();
    }

    if(this.model.is_locked_field('keywords')) {
      this.$el.find(".tags .lists input:text").attr('readonly', true).addClass('locked');
    }else{
      this.$el.find(".tags .lists input:text").removeClass('locked');
    }
    return this;
  },
});

FancyBackbone.Views.Product.OrganizeViewLegacy = Backbone.View.extend({
  events: {
    'click .category_ids a.selector': 'onClickSelectedCategory',
    'click .category_ids .trick': 'onClickSelectedCategory',
    'click .category_ids .lists a[data-idx]': 'onSelectedCategoryChange',
    'click .category_ids a.add': 'onAddCategoryClick',
    'click .category_ids ul.step-category > li > a.btn-del': 'onRemoveCategoryClick',
    'click .add-collection a.selector': 'onClickSelectCollection',
    'click .add-collection .trick': 'onClickSelectCollection',
    'click .add-collection .lists a[value]': 'onChangeCollectionSelect',
    'click .add-collection .lists .create a': 'onClickCreateCollectionButton', 
    'click .add-collection .step-category a.btn-del': 'onClickDeleteCollection',
    'click .step-category li a.tooltip': 'onClickCategoryApproval',
    'keyup .add-collection .search input': 'onSearchCollection',
    'click .tags .select-lists > a.add': 'onClickAddTag',
    'click .tags .select-lists .trick': 'onClickAddTag',
    'keyup .tags .select-lists .lists input:text': 'onInputTag',
    'paste .tags .select-lists .lists input:text': 'onInputTag',
    'click .tags .select-lists .lists button.add': 'onAddTag',
    'click .tags .select-lists .lists .previous-tags ul li a[name]': 'onAddPreviousTag',
    'click .tags .select-lists .lists .filter-tags ul li a[name]': 'onAddShopFilterTag',
    'click .tags .selected a.btn-del': 'onDeleteTag',
    'click .google-product-category a.selector': 'onClickSelectGoogleProductType',
    'click .google-product-category a.btn-del': 'onClickClearGoogleProductType',
    'click .google-product-category .trick': 'onClickSelectGoogleProductType',
    'click .google-product-category .lists a[data-product-type-id]': 'onChangeGoogleProductTypeSelect',
    'keyup .google-product-category input[type="text"]': 'onSearchGoogleProductType',
  },
  onClickSelectGoogleProductType: function(event) {
    event.preventDefault();
    this.$el.find(".google-product-category .lists").toggle();
    if( this.$el.find(".google-product-category .lists").is(":visible") ){
      this.$el.find(".google-product-category input[type='text']").focus();
    }
  },
  onClickClearGoogleProductType: function(event) {
    event.preventDefault();
    this.$el.find(".google-product-category .selector").text("Select Google Product Category");
    this.$el.find(".google-product-category input[name='google-product-category']").val(null);
    this.$el.find(".google-product-category .btn-del").hide();
  },
  onSearchGoogleProductType: function(event) {
    this.$el.find('.category.google-product-category ul').show()
    var fn = arguments.callee;

    var $this = $(event.currentTarget);

    if(fn.delayed_timer) {
        clearTimeout(fn.delayed_timer);
        fn.delayed_timer = null;
    }

    var keyword = $this.val();

    fn.delayed_timer = setTimeout(function() {
        clearTimeout(fn.delayed_timer);

        $('.google-product-category ul>li').hide();
        $('.google-product-category ul>li').each(function(i,elem) {
            if($(elem).find('a').html().toLowerCase().search(keyword.toLowerCase())>=0) {
                $(elem).show();
            }
        });
    }, 300);
  },
  onChangeGoogleProductTypeSelect: function(event) {
    event.preventDefault();
    var $this = $(event.currentTarget);
    var id = $this.data('product-type-id');
    var name = $this.text();
    this.$el.find('.google-product-category input[type="text"]').val(name);
    this.$el.find('.google-product-category input[name="google-product-category"]').val(id);
    this.$el.find(".google-product-category .lists").hide();
    this.$el.find(".google-product-category .selector").text(name);
    this.$el.find(".google-product-category .btn-del").show();
  },
  onClickSelectedCategory: function(event){
    event.preventDefault();
    this.$el.find(".category_ids .lists").toggle();
    this.setCurrentCategory(null);
  },
  onSelectedCategoryChange: function(event) {
    event.preventDefault();
    var categoryId = $(event.currentTarget).attr('data-idx');
    var category = this.categoryCollection.get(categoryId);
    this.setCurrentCategory(category);
    if( $(event.currentTarget).parent().is(".recent") ){
      this.$el.find(".category_ids a.add").click();
    }
  },
  onRemoveCategoryClick: function(event) {
    event.preventDefault();
    var $categoryListItem = $(event.currentTarget).closest("li");
    $categoryListItem.remove();
    if( !this.$el.find(".category_ids ul.step-category li:visible")[0] ){
      this.$el.find(".category_ids ul.step-category").hide();
    }
    if( $categoryListItem.data('root-id')){
      var rootId = $categoryListItem.data('root-id');
      if(!this.$el.find(".category_ids ul.step-category li[data-root-id="+rootId+"]:visible").length){
        this.$el.find(".category_ids .step1 a[data-idx="+rootId+"]").show();
      }
    }
    if( this.$el.find(".category_ids ul.step-category li.selected").length < 2){
      this.$el.find(".category_ids .select-lists").show();
    }
    this.trigger('onCategoryChange');
  },
  addCategory: function(category) {
    var $categoryListItem = this.renderSelectingCategoryListItem(category);
    $categoryListItem.prependTo(this.$el.find(".category_ids ul.step-category"));
    $categoryListItem.data('model', category);
    $categoryListItem.css("display", "block");

    if (!this.whitelabel && this.is_admin) {
      $categoryListItem.prepend('<a href="#" class="approval tooltip"><em>Pending admin approval</em></a>')
      $categoryListItem.prepend('<a href="#" class="approved tooltip"><em>Admin approved</em></a>')
    }
    //if( !this.whitelabel && $categoryListItem.data('root-id')){
    //  var rootId = $categoryListItem.data('root-id');
    //  this.$el.find(".category_ids .step1 a[data-idx="+rootId+"]").hide();
    //}

    //if( !this.whitelabel && this.$el.find(".category_ids ul.step-category li.selected").length >= 2){
    //  this.$el.find(".category_ids .select-lists").hide();
    //}
    this.$el.find(".category_ids").removeClass("error");
  },
  onAddCategoryClick: function(event) {
    event.preventDefault();
    this.syncCategories();
    var categories = this.model.get("categories");
    if (categories.get(this.currentCategory.id)) {
      alertify.alert("You already selected this category.");
    } else if (!this.whitelabel && categories.length >= 3) {
      alertify.alert("You can add up to 3 categories.");
    } else {
      this.$el.find(".category_ids ul.step-category").show();
      this.addCategory(this.currentCategory);
      this.setCurrentCategory(null);
      this.$el.find(".category_ids .lists").toggle();
      this.trigger('onCategoryChange');
    }
  },
  onClickCategoryApproval: function(event) {
    $(this).closest('li').toggleClass('selected');
  },
  renderCategorySelect: function(theCategory) {
    var $this = this;
    var subCategories = this.categoryCollection.findSubCategories(theCategory);

    var subcategoryList = '';
    if (subCategories.length > 0) {
      $(subCategories).each(function(){
        subcategoryList += "<li><a href='#'' data-idx='"+this.id+"''>"+this.get('display')+"</a></li>";
      })
    }

    if (theCategory) {
      var step = this.$el.find(".category_ids .category-lists a[data-idx="+theCategory.id+"]").closest('ul');
      var header = "<a href='#' data-idx='' class='back'></a>";
      var parents = [theCategory];
      var parent = theCategory;
      while( (parent = this.categoryCollection.findParentCategory(parent)) ){
        parents.push(parent);
      }
      parents = parents.reverse();
      $(parents).each(function(){
        if(this!=theCategory){
          header += "<a href='#' data-idx='"+this.id+"'>"+this.get('display')+"</a> <span class='arrow'>&gt;</span>";
        }else{
          header += this.get('display');
        }
      })
      this.$el.find(".category_ids .lists dt b").html(header);
      
      if(subcategoryList){
        step.nextAll().empty();
        step.next().html(subcategoryList);
        this.$el.find(".category_ids .category-lists").css({'left': (step.next().prevAll().length*-100)+'%', height: step.next().outerHeight()+"px"});
      }else{
        this.$el.find(".category_ids .category-lists a.selected").removeClass('selected');
        this.$el.find(".category_ids .category-lists a[data-idx="+theCategory.id+"]").addClass('selected');
      }
    } else {
      this.$el.find(".category_ids .lists dt b").html('Select Category');
      this.$el.find(".category_ids .category-lists ul:not(.step1)").empty();
      this.$el.find(".category_ids .category-lists").css({'left':0, height: this.$el.find(".category_ids .category-lists ul.step1").outerHeight()});
    }
  },
  renderSelectingCategoryListItem: function(theCategory) {
    if (theCategory) {
      var involvedCategories = [];
      var aCategory = theCategory;
      while(aCategory) {
        involvedCategories.push(aCategory);
        aCategory = this.categoryCollection.get(aCategory.get('parent_id'));
      }
      involvedCategories.reverse();

      var display = _.map(involvedCategories, function(category) {
        return category.get("display");
      }).join(" <span>›</span> ");
      return $('<li class="selected" style="display:block;" data-root-id="'+involvedCategories[0].get('id_str')+'">' + display + '<a href="#" class="btn-del">Delete</a></li>');
    } else {
      return $();
    }
  },
  renderMeasuringGuideSelect: function(mgid) {
    var measuringGuideCollection = [];
    _.map(this.measuringGuideCollection.models, function(measuringGuide) {
        var option = measuringGuide.createSelectOption();
        measuringGuideCollection.push(option);
    })
    
    this.$el.find("select[name=measuring-guide]").find('option[value!=""]').remove();
    this.selectView = new FancyBackbone.Views.Base.SelectView({
      defaultOption: false,
      el: this.$el.find("select[name=measuring-guide]"),
      options: measuringGuideCollection,
    }).render();

    var mgid2 = null;
    $(measuringGuideCollection).each(function(){
      if( this.value == mgid){
        mgid2 = mgid;
      }
    })
    if(mgid2) this.selectView.selectValue(mgid2);
  },
  setCurrentCategory: function(category) {
    this.currentCategory = category;

    this.renderCategorySelect(category);

    if (category) {
      this.$el.find(".category_ids .lists a.add").show();
    }else{
      this.$el.find(".category_ids .lists a.add").hide();
    }
  },
  syncCategories: function() {
    var productCategoryCollection = new FancyBackbone.Collections.Product.CategoryCollectionLegacy(
      _.map(this.$el.find(".category_ids ul.step-category li.selected"), function(selectedCategoryListItem) {
        var model = $(selectedCategoryListItem).data('model');
        var recentCategories = $.jStorage.get('recent_categories')||[];
        if( _.contains( recentCategories, model.id) ){
          recentCategories = _.without(recentCategories, model.id);
        }
        recentCategories.unshift(model.id);
        $.jStorage.set('recent_categories', recentCategories);
        return model;
      })
    );
    this.model.set('categories', productCategoryCollection);
  },
  syncCollections: function(){
    var id_list = []; 
    this.$el.find(".add-collection ul.step-category li").each(function() { 
      id_list.push($(this).attr('value'));
    }); 
    this.model.set('collection_ids', id_list); 
  },
  onClickSelectCollection: function(event){
    event.preventDefault();
    this.$el.find(".add-collection .lists").toggle().find("a.add").hide();
    if( this.$el.find(".add-collection .lists").is(":visible") ){
      this.$el.find(".add-collection .search input").focus();
    }
  },
  getCollectionWithID: function(c_id) { 
    var collections = this.model.get('seller_collections'); 
    return _.find(collections, function(collection){ return collection.id == c_id; }); 
  }, 
  addCollection: function(c_title, c_id) {
    var found = false; 
    this.$el.find(".add-collection ul.step-category li").each(function() { if($(this).attr('value') == c_id) { found = true; return false; }  }); 
    if (found) return false; 

    this.$el.find(".add-collection ul.step-category").append('<li class="selected" value="' +c_id+ '">' +c_title+ '<a href="#" class="btn-del">Delete</a></li>');
    this.$el.find(".add-collection .lists ul.step1 a[value="+c_id+"]").addClass('selected');
    this.syncCollections();
  }, 
  onChangeCollectionSelect: function(event) { 
    event.preventDefault();
    var collectionId = $(event.currentTarget).attr('value');
    if (collectionId == '-1') { 
      this.$el.find(".add-collection .lists a.add").hide();
    } else if (collectionId == 'add') {
      this.$el.find(".add-collection .lists a.add").hide();
      var that = this;
      $.post("/merchant/products/collections/popup-create.html", {} ,function(html){
          $('.popup.edit_mylist').find('#edit_title').hide();
          $('.popup.edit_mylist').find('#create_title').show();
          $('.popup.edit_mylist').find('.fill').empty();
          $('.popup.edit_mylist').find('.fill').append(html);
          var $list_popup = $.dialog('edit_mylist');
          $list_popup.open(); 
          $list_popup.$obj.on('create:collection', function(event, c_id, c_name){
            var has_cid = _.find(that.$el.find('.add-collection .select-category .lists ul.step1 a[value]'), function(opt) { return $(opt).attr('value') == c_id; });
            if (has_cid == undefined) {
              that.addExistingCollection(c_id, c_name); 
              that.$el.find('.add-collection .lists ul.step1 li a[value='+c_id+']').click();
            }
          });
      }, "html");
    }else { 
      var $selected_collection = $(event.currentTarget);
      if( $selected_collection.hasClass('selected') ){
        $selected_collection.removeClass('selected').closest('.add-collection').find("li.selected[value="+$selected_collection.attr('value')+"] .btn-del").click();
      }else{
        $selected_collection.addClass('selected');
        this.addCollection($selected_collection.text(), $selected_collection.attr('value'));
        this.$el.find(".add-collection .lists").toggle();
        this.$el.find(".add-collection ul.step-category").show();
      }
    }
  }, 
  onClickAddCollectionButton: function(event) { 
    event.preventDefault();
    var $selected_collection = this.$el.find(".add-collection .select-category .lists ul.step1 a.selected");
    this.addCollection($selected_collection.text(), $selected_collection.attr('value'));
    this.$el.find(".add-collection ul.step-category").show();
    this.$el.find(".add-collection .lists").toggle().find("a.add").hide();
  },
  onClickCreateCollectionButton: function(event) { 
    event.preventDefault();
    var that = this;
    var $el = $(event.target);
    var title = $el.parent().find("a:eq(0)").text();
    var param = {
      'collection_id': '',
      'title' : title,
      'description' : ''
    };
    $.post( FancyBackbone.Utils.makeURL('/merchant/products/collections/create.json'), param, 
         function(json){
           if (json.status_code == 1) {
              var c_id = json.collection_id;
              var c_name = title;
              var has_cid = _.find(that.$el.find('.add-collection .select-category .lists ul.step1 a[value]'), function(opt) { return $(opt).attr('value') == c_id; });
              if (has_cid == undefined) {
                that.addExistingCollection(c_id, c_name); 
                that.$el.find('.add-collection .lists ul.step1 li a[value='+c_id+']').click();
              }
           }
           else if (json.status_code == 0) {
             var msg = json.message;
             alertify.alert(msg);
           }
         }, "json");
  }, 
  onClickDeleteCollection: function(e) { 
    e.preventDefault();
    var value = $(e.currentTarget).closest('li').attr('value');
    $(e.currentTarget).closest('li').remove();
    this.syncCollections(); 
    this.$el.find(".add-collection .lists ul.step1 a[value="+value+"]").removeClass('selected');
    if( !this.$el.find(".add-collection ul.step-category li:visible").length ){
      this.$el.find(".add-collection ul.step-category").hide();
    }
  }, 
  onSearchCollection: function(e){
    var q = $(e.target).val();
    var ql = q.toLowerCase();
    var exists = false;
    this.$el.find(".add-collection")
      .find(".category-lists ul li").show().each(function(){
        var name = $(this).find("a").text().toLowerCase();
        if( name.indexOf(ql) == -1) $(this).hide();
        if( name == ql ) exists = true;
      })

    if( exists || !q){
      this.$el.find(".add-collection .create").hide();
    }else{
      this.$el.find(".add-collection .create").show().find('a:eq(0)').text(q);
    }
  },
  addExistingCollection: function(c_id, c_name) {
    this.$el.find('.add-collection .select-category .lists ul.step1').append('<li><a href="#" value="'+c_id+'">'+c_name+'</a></li>');
  },
  onClickAddTag: function(e){
    e.preventDefault();
    if(this.model.is_locked_field('keywords')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    this.$el.find(".tags .lists, .tags .select-lists > a.add").toggle().end().find(".tags .lists input:text").val('').focus().end().find(".tags .lists button.add").hide();
  },
  onInputTag: function(e){
    var val = this.$el.find(".tags .lists input:text").val();
    if(val){
      this.$el.find(".tags .lists button.add").show();
    }else{
      this.$el.find(".tags .lists button.add").hide();
    }
    if (this.$el.find('.tags .lists .filter-tags ul').length > 0) {
	this.showFilterSuggestion(val);
    }
  },

  showFilterSuggestion: function(val) {
    var self = this;
    var filters = [];
    _.map(self.saleitemFilterCollection.models, function(f) {
        _.each(f.get('options'), function(option) {
	    if (option.label.toLowerCase().startsWith(val) || option.value.toLowerCase().startsWith(val)) {
		option.filter_name = f.get('name');
		filters.push(option);
	    }
	});
    });
    self.$el.find('.tags .lists .filter-tags ul').empty();
    _.each(filters, function(option) {
	var $span = $('<li><a href="#"></a></li>');
	$span.find("a").attr("name", option.value).prepend(document.createTextNode(option.filter_name + ' - ' + option.label));
	self.$el.find('.tags .lists .filter-tags ul').append($span); 
    });
  },
  getSelectedTags: function() { 
    var keywords = [];
    _.each( this.$el.find(".tags .tags-picker > span.selected"), function(tag) {
      keywords.push($(tag).attr('name'));
    });
    return keywords; 
  },
  updateExistingTagButtons: function() { 
    var that = this; 
    var keywords = this.getSelectedTags(); 
    _.each(this.$el.find('.tags .lists .previous-tags ul li a[name]'), function(pre_tag) { 
      var aTag = $(pre_tag).attr('name'); 
      if(_.find(keywords, function(keyword) { return keyword == aTag }) != undefined) { 
        $(pre_tag).closest('li').hide(); 
      } else { 
        $(pre_tag).closest('li').show(); 
      }
    }); 
    if(keywords.length){
      this.$el.find(".tags-picker").removeClass('blank');
    }else{
      this.$el.find(".tags-picker").addClass('blank');
    }
  }, 
  addTag: function(tag){
    if (!tag || tag === '') return;
    var keywords = this.getSelectedTags(); 
    if(_.find(keywords, function(keyword) { return keyword == tag }) != undefined) { 
      return false; 
    }
    if(this.model.is_locked_field('keywords')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    var $span = $('<span class="selected"><a href="#" class="btn-del">Remove</a></span>');
    $span.attr("name", tag);
    $span.prepend(document.createTextNode(tag));
    $span.insertBefore( this.$el.find('.tags .tags-picker .select-lists') );
    var input = this.$el.find('.tags .select-lists .lists input:text'); 
    input.val(''); 

    this.updateExistingTagButtons(); 
  },
  onAddTag: function(e){
    e.preventDefault(); 
    var self = this;
    if(this.model.is_locked_field('keywords')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    var tags = this.$el.find('.tags .lists input:text').val().split(",");
    $(tags).each(function(i,v){
      if(v.trim()) self.addTag(v.trim());   
    })
    this.$el.find('.tags .lists input:text').focus();
    this.$el.find(".tags .lists button.add").hide();
  },
  onAddPreviousTag: function(e){
    e.preventDefault(); 
    if(this.model.is_locked_field('keywords')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    var aTag = $(e.currentTarget).attr('name');
    this.addTag(aTag); 
    this.updateExistingTagButtons(); 
  },
  onAddShopFilterTag: function(e){
    e.preventDefault(); 
    if(this.model.is_locked_field('keywords')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    var aTag = $(e.currentTarget).attr('name');
    this.addTag(aTag); 
    this.updateExistingTagButtons(); 
  },
  onDeleteTag: function(e){
    e.preventDefault();
    if(this.model.is_locked_field('keywords')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    $(e.currentTarget).closest('span').remove();
    this.updateExistingTagButtons(); 
    return false;
  },
  addPreviousTag: function(tag) { 
    var $span = $('<li><a href="#"></a></li>');
    $span.find("a").attr("name", tag).prepend(document.createTextNode(tag));
    this.$el.find('.tags .lists .previous-tags ul').append($span); 
  }, 
  syncTags: function(){
    var keywords = this.getSelectedTags(); 
    this.model.set('keywords', keywords.join(','));
  },
  syncMeasuringGuide: function(){
    if( this.$el.find("select[name=measuring-guide]")[0] ){
      var guide = this.$el.find("select[name=measuring-guide]").val();
      this.model.set('size_guide_id', guide || null);
    }
  },
  syncGoogleProductType: function() {
    var $id = this.$el.find('.google-product-category input[name="google-product-category"]');
    if($id.length) {
        var metadata = this.model.get('metadata') || {};
        metadata['google-product-category'] = $id.val();
        this.model.set('metadata', metadata);
    }
  },
  syncModel: function() {
    this.syncCategories();
    this.syncCollections();
    this.syncTags();
    this.syncMeasuringGuide();
    this.syncGoogleProductType();
  },
  syncView: function() {
    var that = this;
    this.model.get('categories').each(this.addCategory, this);
    if( this.model.get('categories').length > 0){
      this.$el.find(".category_ids ul.step-category").show();
    }
    if( $.jStorage.get('recent_categories') &&  $.jStorage.get('recent_categories').length){
      var $recent = this.$el.find(".category_ids dd.recent")
      $recent.show();
      $( $.jStorage.get('recent_categories') ).each(function(idx, categoryId){
        if ($recent.children("a").length > 4) return;
        var category = that.categoryCollection.get(categoryId);
        if (category) {
            var $el = that.renderSelectingCategoryListItem(category);
            $recent.append("<a href='#' data-idx='"+categoryId+"'>"+ $el.find("a.btn-del").remove().end().html() );
        }
      })
    }
    var collections = this.model.get('collection_ids'); 
    for (index in collections) {
      var collection = this.getCollectionWithID(collections[index]); 
      if (collection == undefined ) continue; 
      this.addCollection(collection.title, collection.id); 
      this.$el.find(".add-collection ul.step-category").show();
    }
    if(this.model.get('keywords')) { 
      var keywords = this.model.get('keywords').split(",");
      _.each(keywords, function(tag) { 
        that.addTag(tag); 
      });
    }
    this.renderMeasuringGuideSelect(this.model.get('size_guide_id'));

    var google_product_category = this.model.get('metadata') && this.model.get('metadata')['google-product-category'];

    var google_product_category_name = null;

    if(google_product_category) {
        var $type = this.$el.find('.google-product-category li>a[data-product-type-id="'+google_product_category+'"]');
        if($type.length) {
            google_product_category_name = $type.text();
        }
    }
    if(google_product_category_name) {
        this.$el.find('.google-product-category a.selector').text(google_product_category_name);
        this.$el.find('.google-product-category a.btn-del').show();
        this.$el.find('.google-product-category input[name="google-product-category"]').val(google_product_category);
    } else {
        this.$el.find('.google-product-category a.selector').text("Select Google Product Category");
        this.$el.find('.google-product-category a.btn-del').hide();
        this.$el.find('.google-product-category input[name="google-product-category"]').val(null);
    }
  },
  initialize: function(options) {
    this.categoryCollection = window.categoryCollection;
    this.measuringGuideCollection = window.measuringGuideCollection;
    this.saleitemFilterCollection = window.saleitemFilterCollection;
    this.whitelabel = options.whitelabel;
    this.is_admin = options.is_admin;
  },
  render: function() {
    this.setCurrentCategory(null);
    var self = this;
    if (this.model.get('seller_collections')) {
      var that = this ;
      _.each( this.model.get('seller_collections'), function(collection) {
        that.addExistingCollection(collection.id, collection.title); 
      });
    }
    if (this.model.id) {
      this.syncView();
    }else{
      this.renderMeasuringGuideSelect('');
    }

    if(this.model.get('seller_tags') && this.model.get('seller_tags').length) { 
      var seller_tags = this.model.get('seller_tags');
      if( seller_tags.length > 10){
        seller_tags = seller_tags.slice(0,10);
      } 
      
      _.each(seller_tags, function(tag) { 
        that.addPreviousTag(tag); 
      }); 

      this.$el.find(".tags .lists > dl.previous-tags").show();
    }else{
      this.$el.find(".tags .lists > dl.previous-tags").hide();
    }

    if(this.model.is_locked_field('keywords')) {
      this.$el.find(".tags .lists input:text").attr('readonly', true).addClass('locked');
    }else{
      this.$el.find(".tags .lists input:text").removeClass('locked');
    }
    return this;
  },
});

FancyBackbone.Views.Product.SaleDurationView = Backbone.View.extend({
  events: {
    'click a.remove': 'onRemoveEndDateClick',
  },
  onRemoveEndDateClick: function(event) {
    event.preventDefault();
    this.$el.find(".end-date .date").val('');
  },
  syncModel: function() {
    this.model.set('start_date', moment(this.$el.find(".start-date .date").val(), "YYYY-MM-DD").format("MM/DD/YYYY") );
    var endDate = this.$el.find(".end-date .date").val();
    if (endDate) {
      this.model.set('end_date', moment(endDate, "YYYY-MM-DD").format("MM/DD/YYYY") );
    } else {
      this.model.set('end_date', null);
    }
    this.model.set('soldout_after_expired', this.$el.find('.soldout-after-expired').prop('checked'));
  },
  syncView: function() {
    var self = this;
    if (this.model.get('start_date')) {
      this.$el.find(".start-date .date").val(moment(this.model.get('start_date')).format("YYYY-MM-DD"));
    }
    if (this.model.get('end_date')) {
      this.$el.find(".end-date .date").val(moment(this.model.get('end_date')).format("YYYY-MM-DD"));
      this.$el.show();
    }

    if (this.model.get('soldout_after_expired')) {
      this.$el.find('.soldout-after-expired').prop('checked', this.model.get('soldout_after_expired'));
    }

    if( this.is_admin || window.seller.get('username')=='fancymerchant'){
      this.$el.show();
    }
  },
  initialize: function(options) {
    this.hasEndDate = false;
    this.is_admin = options.is_admin;
  },
  render: function() {
    var self = this;
    if (this.model.id) {
      this.syncView();
    } else {
      this.$el.find(".start-date .date").val(moment().format("YYYY-MM-DD"));
      if( this.is_admin || window.seller.get('username')=='fancymerchant'){
        this.$el.show();
      }
    }
    return this;
  },
});

FancyBackbone.Views.Product.CustomFieldsView = Backbone.View.extend({
  events: {
    'click a.add-custom': 'onEditFields',
  },  
  onEditFields: function(event) {
    event.preventDefault();
    this.syncModel();
    window.popups.editCustomFields.open(this.model);
  },
  addField: function(key, value){
    var template = this.$el.find("ul > script").html();
    var $el = $(template);
    if(key) $el.find(".key").text(key);
    if(value) $el.find(".val").text(value);
    this.$el.find("ul").append($el);
  },
  syncModel: function(){
    var that = this;
    var fields = this.$el.find("ul > li"); 
    var metadata = this.model.get('metadata')||{};
    for( k in metadata){
      if(that.whitelabel && ['meta_description','tech_spec','more_info','sidebar_graphics','google-product-category','estimated_delivery'].indexOf(k)>-1) continue;
      metadata[k] = null;
    }
    fields.each(function(){
      var key = $(this).find(".key").text();
      var value = $(this).find(".val").text();
      if(that.whitelabel && ['meta_description','tech_spec','more_info','sidebar_graphics','google-product-category','estimated_delivery'].indexOf(key)>-1) return true;
      if(key){
        metadata[key] = value||"";
      }
    })
    this.model.set('metadata', metadata);
  },
  syncView: function(metadata) { 
    var that = this;
    var metadata = metadata||this.model.get('metadata');
    var keys = Object.keys(metadata).sort();

    this.$el.find("ul li").remove();
    $(keys).each(function(){
      if(that.whitelabel && ['meta_description','tech_spec','more_info','sidebar_graphics','google-product-category','estimated_delivery'].indexOf(this)>-1) return true;
      if(metadata[this] != null){
        that.addField(this, metadata[this]);
      }
    })
  },
  initialize: function(options) {
    this.whitelabel = options.whitelabel;
    this.listenTo(FancyBackbone.App.eventAggregator,'update:customfields', _.bind(this.syncView, this));
  },
  render: function() {     
    if(this.model.get('metadata')) { 
      this.syncView(); 
    }
    
    return this; 
  },
}); 

FancyBackbone.Views.Product.SidebarGraphicsView = Backbone.View.extend({
  events: {
    'click li.add a': 'onAddClick',
    'click li a.btn-edit': 'onEditClick',
    'click li a.btn-del': 'onDeleteClick',
  },
  onAddClick:function(e){
    e.preventDefault();
    window.popups.addSidebarGraphics.render();
  },
  onEditClick: function(e){
    e.preventDefault();
    var $li = $(e.target).closest('li'), graphic = $li.data('model');
    window.popups.addSidebarGraphics.render(graphic);
  },
  onDeleteClick: function(e){
    e.preventDefault();
    var $li = $(e.target).closest('li'), graphic = $li.data('model');
    this.removeSidebarGraphic(graphic)
  },
  updateSidebarGraphic: function(graphic){
    this.syncView();
  },
  removeSidebarGraphic: function(graphic){
    var graphics = this.model.get('_sidebar_graphics') || [];
    var index = graphics.indexOf(graphic);
    graphics.splice(index,1);
    this.model.set('_sidebar_graphics', graphics);
    this.syncView();
  },
  addSidebarGraphic: function(graphic){
    var graphics = this.model.get('_sidebar_graphics') || [];
    graphics.push(graphic);
    this.model.set('_sidebar_graphics', graphics);
    this.syncView();
  },
  appendSidebarGraphic: function(graphic){
    var $el =  $('<li class="photo item"><a class="preview"><img src="//static-ec1.thefancy.com/_ui/images/common/blank.gif" style="background-image:url('+graphic.image_url+')"><em>'+graphic.title+'</em></a><a href="#" class="btns-gray-embo btn-edit">Edit</a><a href="#" class="btns-gray-embo btn-del">Delete</a></li>');
    $el.data('model', graphic);
    $el.insertBefore( this.$el.find("li.add") );
  },
  syncModel: function(){
    var metadata = this.model.get('metadata')||{};
    var graphics = this.model.get('_sidebar_graphics') || [];
    metadata['sidebar_graphics'] = JSON.stringify(graphics);
    this.model.set('metadata', metadata);
  },
  syncView: function() {
    var that = this;
    var metadata = this.model.get('metadata')||{};
    var graphics = this.model.get('_sidebar_graphics') || metadata['sidebar_graphics'] || [];
    if(typeof graphics == 'string'){
      try{
        graphics = JSON.parse(graphics);
        this.model.set('_sidebar_graphics', graphics);
      }catch(e){
        graphics = [];
      }
    }
    this.$el.find("li:not(.add)").remove();
    $(graphics).each(function(i,v){
      that.appendSidebarGraphic(v);
    })
  },
  initialize: function(){
    this.listenTo(FancyBackbone.App.eventAggregator,'create:sidebargraphics', _.bind(this.addSidebarGraphic, this));
    this.listenTo(FancyBackbone.App.eventAggregator,'update:sidebargraphics', _.bind(this.updateSidebarGraphic, this));
    this.listenTo(FancyBackbone.App.eventAggregator,'delete:sidebargraphics', _.bind(this.removeSidebarGraphic, this));
  },
  render: function() {
    if(this.model.get('metadata')) { 
      this.syncView(); 
    }
    return this;
  }
});

FancyBackbone.Views.Product.VisibilityView = Backbone.View.extend({
  events: {
    'click .multi-text .select-lists a.selector': 'onLayerShow',
    'click .multi-text .select-lists .trick': 'onLayerHide',
    'click .multi-text .select-lists a[data-tag]': 'onAddClick',
    'click .multi-text .step-category a.btn-del': 'onDeleteClick',
  },
  onLayerShow:function(e){
    e.preventDefault();
    var $this = $(e.target);
    $this.next().show();
  },
  onLayerHide: function(e){
    e.preventDefault();
    var $this = $(e.target);
    $this.closest('.lists').hide();
  },
  onAddClick: function(e){
    e.preventDefault(); 
    var $this = $(e.target), tag = $this.data('tag');
    var readonly = this.$el.hasClass('readonly');
    if( $this.hasClass('selected')){
      $this.removeClass('selected').closest('.multi-text').find("ul.step-category li[data-tag='"+tag+"']").remove();
    }else{
      var $item = $('<li class="selected" data-tag="'+tag+'">'+tag+ (!readonly?' <a href="#" class="btn-del">Delete</a>':'')+'</li>');
      $this.addClass('selected').closest('.multi-text').find("ul.step-category").append($item);
    }
    $this.closest('.lists').hide();
  },
  onDeleteClick: function(e){
    e.preventDefault(); 
    var $this = $(e.target), tag = $this.closest('li').data('tag');
    $this.closest('.multi-text').find(".lists a[data-tag='"+tag+"']").trigger('click');
  },
  syncModel: function(){
    var tag_filters = [];
    var profession_filter = { "tag_type_name": "EUROPISTE_PROFESSION", "tags": [], "tag_type_description": "Profession", "filter_type": "ALLOW", "tag_type": 102};
    profession_filter.tags = Array.prototype.slice.call(this.$el.find(".select-profession .step-category li[data-tag]").map(function(){return $(this).data('tag');}))
    profession_filter.filter_type = this.$el.find(".select-profession .show").val();
    var region_filter = { "tag_type_name": "EUROPISTE_REGION", "tags": [], "tag_type_description": "Region", "filter_type": "ALLOW", "tag_type": 103};
    region_filter.tags = Array.prototype.slice.call(this.$el.find(".select-region .step-category li[data-tag]").map(function(){return $(this).data('tag');}))
    region_filter.filter_type = this.$el.find(".select-region .show").val();
    tag_filters.push(profession_filter);
    tag_filters.push(region_filter);
    this.model.set('tag_filters', tag_filters);
  },
  syncView: function() {
    var that = this;
    var readonly = this.$el.hasClass('readonly');
    this.$el.find(".lists a").removeClass('selected').end().find(".step-category").empty();
    var tag_filters = this.model.get('tag_filters')||[];
    if(readonly && !tag_filters.length) this.$el.hide();
    else this.$el.show();
    tag_filters.forEach(function(filter){
      var type = filter.tag_type, $frm;
      if(type == 102) $frm = that.$el.find(".select-profession");
      else if(type == 103)  $frm = that.$el.find(".select-region");
      if(!$frm) return true;
      $frm.find(".show").val(filter.filter_type);
      if(readonly){
        $frm.find(".show").html(filter.filter_type=='ALLOW'?'Show to:':'Hide from:');
        if(filter.tags.length) {
            $frm.show();
        }
      }
      filter.tags.forEach(function(tag){
        $frm.find(".lists a[data-tag='"+tag+"']").trigger('click');
      });
    })
  },
  initialize: function(options){
  },
  render: function() {
    this.$el.show();
    this.syncView(); 
    return this;
  }
});

FancyBackbone.Views.Product.VisibilityNewView = Backbone.View.extend({
  events: {
    'click .btn-new': 'onAddFilterClick',
  },
  onAddFilterClick: function(e){
    var tag_filter = { "tag_type_name": "", "tags": [], "tag_type_description": "", "filter_type": "DENY", "tag_type": null};
    if(!this.model.get('tag_filters')){
      this.model.set('tag_filters', []);
    }
    this.model.get('tag_filters').push(tag_filter);
    this.syncView();
  },
  deleteTagFilter: function(tag_filter){
    this.syncModel();
    this.renderTagFilter();
  },
  syncModel: function(){
    var tag_filters = [];
    this.$el.find(".table-body tbody tr").each(function(){
      $(this).data('view').syncModel();
      tag_filters.push( $(this).data('model') );
    })

    this.model.set('tag_filters', tag_filters);
  },
  initialize: function(options) {
    this.listenTo(FancyBackbone.App.eventAggregator,'delete:tag_filter', _.bind(this.deleteTagFilter, this));
  },
  createTagFilterRow: function(tag_filter) {
    var tagFilterView = new FancyBackbone.Views.Product.VisibilityTagFilterView({
        data: tag_filter,
        readonly : this.$el.hasClass('readonly')
      });

    var $el = tagFilterView.render().$el;
    $el.data('model', tag_filter);
    $el.data('view', tagFilterView);
    this.$el.find(".table-body tbody").append($el);
  },
  renderTagFilter: function(){
    var that = this;
    var tag_filters = Array.prototype.slice.call((this.model.get('tag_filters')||[]).map(function(tag_filter){ return tag_filter; }));

    this.$el.find(".table-body tbody").empty();
    $(tag_filters).each(function(i, tag_filter){
      if(tag_filter) that.createTagFilterRow(tag_filter);
    });

  },
  syncView: function() {
    var that = this;
    this.renderTagFilter();
    var readonly = this.$el.hasClass('readonly');
    if(readonly && !(this.model.get('tag_filters')||[]).length) {
        this.$el.hide();
    } else {
        this.$el.show();
    }
  },
  render: function() {
    this.$el.show();
    this.syncView(); 
    return this;
  }
});

FancyBackbone.Views.Product.VisibilityTagFilterView = Backbone.View.extend({
  tagName: 'tr',
  className: 'Visibility-rule row row-with-data',
  template: FancyBackbone.Utils.loadTemplate("product_ruleset_visibility"),
  events: {
    'click .btn-visibility': 'onVisibilityChage',
    'click .professions a': 'onClickSelector',
    'click .regions a': 'onClickSelector',
    'click .btn-del': 'onTagFilterDelete',
  },
  onVisibilityChage: function(event) {
    event.preventDefault();
    this.tag_filter.filter_type = this.tag_filter.filter_type=='ALLOW'?'DENY':'ALLOW';
    this.render();
  },
  onTagFilterDelete: function(e){
    e.preventDefault();
    this.$el.remove();
    FancyBackbone.App.eventAggregator.trigger("delete:tag_filter", this.tag_filter);  
  },
  onTagFilterUpdate: function(tag_filter){
    if(tag_filter === this.tag_filter) this.render();
  },
  onClickSelector: function(e){
    e.preventDefault();
    if( $(e.target).is(".professions a") ){
      window.popups.whitelabelProfession.open(this.tag_filter);
    }else if( $(e.target).is(".regions a") ){
      window.popups.whitelabelRegion.open(this.tag_filter);
    }
  },
  syncModel: function() {
    if(this.tag_type=='102'){
      this.tag_type_name = 'EUROPISTE_PROFESSION';
      this.tag_type_description = 'Profession';
    }else if (this.tag_type =='103'){
      this.tag_type_name = 'EUROPISTE_REGION';
      this.tag_type_description = 'Region';
    }
  },
  initialize: function(options) {
    this.tag_filter = options.data;
    this.readonly = options.readonly;
    this.listenTo(FancyBackbone.App.eventAggregator,'update:whitelabeltag', _.bind(this.onTagFilterUpdate, this));
  },
  render: function() {
    this.$el.html(this.template({tag_filter:this.tag_filter, readonly:this.readonly})); 
    return this;
  },
});

FancyBackbone.Views.Product.DiscountOverrideView = Backbone.View.extend({
  events: {
    'click .btn-new': 'onAddRuleClick',
    'click .lists a[data-tag]': 'onToggleTagClick',
    'click .lists .trick': 'onLayerTrickClick',
  },
  onAddRuleClick: function(){
    var rule = {"condition":{"type":"user_tags","tags":{"102":[],"103":[]}},"value":"","rule":"discount_override"};
    if(!this.model.get('ruleset')){
      this.model.set('ruleset', []);
    }
    this.model.get('ruleset').push(rule);
    this.syncView();
  },
  onToggleTagClick: function(e){
    e.preventDefault();
    var $tag = $(e.target), tag = $tag.data('tag'), type = $tag.data('type');
    var rule = $tag.closest('.lists').data('rule');
    if($tag.hasClass('selected')){
      $tag.removeClass('selected');
      if(!tag){
        rule.condition.tags[type] = [];
      }else{
        rule.condition.tags[type].splice(rule.condition.tags[type].indexOf(tag),1);
      }
    }else{
      $tag.addClass('selected');
      if(!tag){
        if( rule.condition.tags[type] ) delete rule.condition.tags[type];
      }else{
        if(!rule.condition.tags[type]) rule.condition.tags[type] = [];
        rule.condition.tags[type].push(tag);
      }
    }
    this.renderRuleset();
    $tag.closest('.lists').find(".trick").trigger("click");
  },
  onLayerTrickClick: function(e){
    var $this = $(e.target);
    $this.closest('.lists').hide().closest('.wrapper').find('.table-data').find('a').removeClass('on');
  },
  deleteRule: function(rule){
    this.syncModel();
    this.renderRuleset();
  },
  syncModel: function() {
    var ruleset = [];
    this.$el.find(".table-data tbody tr").each(function(){
      ruleset.push( $(this).data('model') );
    })

    ruleset = ruleset.sort(function(a, b){
      if( a.rule != b.rule) return a.rule>b.rule?1:-1;
      var valA=parseFloat(a.value), valB=parseFloat(b.value);
      if( isNaN(valA) != isNaN(valB) ) return isNaN(valB)?-1:1;
      return valA > valB ? -1 : 1;
    })
    this.model.set('ruleset', ruleset);
  },
  initialize: function(options) {
    this.listenTo(FancyBackbone.App.eventAggregator,'delete:rule', _.bind(this.deleteRule, this));
  },
  createRulesetRow: function(rule) {
    var rulesetView = new FancyBackbone.Views.Product.DiscountOverrideRuleView({
        data: rule,
        readonly : this.$el.hasClass('readonly')
      });

    var $el = rulesetView.render().$el;
    $el.data('model', rule);
    this.$el.find(".table-data tbody").append($el);
  },
  renderRuleset: function(){
    var that = this;
    var ruleset = Array.prototype.slice.call((this.model.get('ruleset')||[]).map(function(rule){ if(rule && rule.rule=='discount_override') return rule; }));

    this.$el.find(".table-data tbody").empty();
    $(ruleset).each(function(i, rule){
      if(rule) that.createRulesetRow(rule);
    });

  },
  syncView: function() {
    var that = this;
    this.renderRuleset();

    var readonly = this.$el.hasClass('readonly');
    if(readonly && !(this.model.get('ruleset')||[]).length) {
        this.$el.hide();
    } else {
        this.$el.show();
    }
  },
  render: function() {
    this.$el.show();
    this.syncView(); 
    return this;
  },
});

FancyBackbone.Views.Product.DiscountOverrideRuleView = Backbone.View.extend({
  tagName: 'tr',
  className: '',
  template: FancyBackbone.Utils.loadTemplate("product_ruleset_rule"),
  events: {
    'blur input[name=value]': 'onValueChage',
    'click a.selector': 'onClickSelector',
    'click a.btn-del': 'onRuleDelete',
  },
  onValueChage: function(event) {
    var value = this.$el.find('input[name=value]').val();
    if( value && ( isNaN(value) || parseFloat(value) > 100 || parseFloat(value) < 0) ){
      if( isNaN(value) ) alertify.alert("Please input valid discount value.")
      else if( parseFloat(value) > 100 ) alertify.alert("Please input discount lower than 100.")
      else if( parseFloat(value) < 0 ) alertify.alert("Please input discount higher than 0.")
      this.$el.find('input[name=value]').closest(".price").addClass("error");
    }else{
      this.$el.find('input[name=value]').closest(".price").removeClass("error");
    }
    this.rule.value = value;
  },
  onRuleDelete: function(e){
    e.preventDefault();
    this.$el.remove();
    FancyBackbone.App.eventAggregator.trigger("delete:rule", this.rule);  
  },
  onClickSelector: function(e){
    e.preventDefault();
    var that = this, $this = $(e.target), type = $this.data('type'), $layer = $this.closest('.wrapper').find('.multi-text'), $lists = $layer.find('.lists');
    $this.toggleClass('on');
    $lists.toggle();
    $lists.data('rule', this.rule).find("li a").each(function(){
      var _type = $(this).data('type'), _tag = $(this).data('tag');
      if( _type != type ) $(this).hide();
      else{
        $(this).show();
        if(that.rule.condition.tags[_type] && that.rule.condition.tags[_type].indexOf(_tag)>-1) $(this).addClass('selected');
        else $(this).removeClass('selected');
      }
    })
    if(!(type in this.rule.condition.tags)){
      $lists.find("li a[data-type="+type+"][data-tag='']").addClass('selected');
    }
    $layer.css('top',$this.offset().top+'px').css('left',$this.offset().left-$('.wrapper.discount').offset().left+$this.width()/2+'px');
  },
  syncModel: function() {
  },
  initialize: function(options) {
    this.rule = options.data;
    this.readonly = options.readonly;
  },
  render: function() {
    this.$el.html(this.template({rule:this.rule, readonly:this.readonly})); 
    return this;
  },
});


FancyBackbone.Views.Product.DiscountOverrideNewView = Backbone.View.extend({
  events: {
    'click .btn-new': 'onAddRuleClick',
  },
  onAddRuleClick: function(){
    var rule = {"condition":{"type":"user_tags","tags":{}},"value":"","rule":"discount_override"};
    if(!this.model.get('ruleset')){
      this.model.set('ruleset', []);
    }

    this.model.get('ruleset').push(rule);
    this.syncView();
  },
  deleteRule: function(rule){
    this.syncModel();
    this.renderRuleset();
  },
  syncModel: function() {
    var ruleset = [];
    this.$el.find(".table-body tbody tr").each(function(){
      $(this).data('view').syncModel();
      ruleset.push( $(this).data('model') );
    })

    ruleset = ruleset.sort(function(a, b){
      if( a.rule != b.rule) return a.rule>b.rule?1:-1;
      var valA=parseFloat(a.value), valB=parseFloat(b.value);
      if( isNaN(valA) != isNaN(valB) ) return isNaN(valB)?-1:1;
      return valA > valB ? -1 : 1;
    })
    this.model.set('ruleset', ruleset);
  },
  initialize: function(options) {
    this.listenTo(FancyBackbone.App.eventAggregator,'delete:rule', _.bind(this.deleteRule, this));
  },
  createRulesetRow: function(rule) {
    var rulesetView = new FancyBackbone.Views.Product.DiscountOverrideRuleNewView({
        data: rule,
        readonly : this.$el.hasClass('readonly')
      });

    var $el = rulesetView.render().$el;
    $el.data('model', rule);
    $el.data('view', rulesetView);
    this.$el.find(".table-body tbody").append($el);
  },
  renderRuleset: function(){
    var that = this;
    var ruleset = Array.prototype.slice.call((this.model.get('ruleset')||[]).map(function(rule){ if(rule && rule.rule=='discount_override') return rule; }));

    this.$el.find(".table-body tbody").empty();
    $(ruleset).each(function(i, rule){
      if(rule) that.createRulesetRow(rule);
    });

  },
  syncView: function() {
    var that = this;
    this.renderRuleset();

    var readonly = this.$el.hasClass('readonly');
    if(readonly && !(this.model.get('ruleset')||[]).length) {
        this.$el.hide();
    } else {
        this.$el.show();
    }
  },
  render: function() {
    this.$el.show();
    this.syncView(); 
    return this;
  },
});

FancyBackbone.Views.Product.DiscountOverrideRuleNewView = Backbone.View.extend({
  tagName: 'tr',
  className: 'discount-rule row row-with-data',
  template: FancyBackbone.Utils.loadTemplate("product_ruleset_rule_new"),
  events: {
    'blur input[name=value]': 'onValueChage',
    'click .professions a': 'onClickSelector',
    'click .regions a': 'onClickSelector',
    'click .btn-del': 'onRuleDelete',
  },
  onValueChage: function(event) {
    var value = this.$el.find('input[name=value]').val();
    if( value && ( isNaN(value) || parseFloat(value) > 100 || parseFloat(value) < 0) ){
      if( isNaN(value) ) alertify.alert("Please input valid discount value.")
      else if( parseFloat(value) > 100 ) alertify.alert("Please input discount lower than 100.")
      else if( parseFloat(value) < 0 ) alertify.alert("Please input discount higher than 0.")
      this.$el.find('input[name=value]').closest(".price").addClass("error");
    }else{
      this.$el.find('input[name=value]').closest(".price").removeClass("error");
    }
    this.rule.value = value;
  },
  onRuleDelete: function(e){
    e.preventDefault();
    this.$el.remove();
    FancyBackbone.App.eventAggregator.trigger("delete:rule", this.rule);  
  },
  onRuleUpdate: function(rule){
    if(rule === this.rule) this.render();
  },
  onClickSelector: function(e){
    e.preventDefault();
    if( $(e.target).is(".professions a") ){
      window.popups.whitelabelProfession.open(this.rule);
    }else if( $(e.target).is(".regions a") ){
      window.popups.whitelabelRegion.open(this.rule);
    }
    
  },
  syncModel: function() {
    if( !this.rule.condition.tags['102'] ) this.rule.condition.tags['102'] = [];
    if( !this.rule.condition.tags['103'] ) this.rule.condition.tags['103'] = [];
  },
  initialize: function(options) {
    this.rule = options.data;
    this.readonly = options.readonly;
    this.listenTo(FancyBackbone.App.eventAggregator,'update:whitelabeltag', _.bind(this.onRuleUpdate, this));
  },
  render: function() {
    this.$el.html(this.template({rule:this.rule, readonly:this.readonly})); 
    return this;
  },
});

FancyBackbone.Views.Product.AddProductView = Backbone.View.extend({
  events: {
    'click button.btn-save': 'onSaveClick',
    'click button.btn-delete': 'onDeleteClick',
    'click .locked': 'onLockedFieldClick'
  },
  initialize: function(options) {
      this.whitelabel = options.whitelabel;
      this.legacyOrganizeView = options.legacyOrganizeView;
  },
  highlightErrors: function(errorFields) {
    var that = this;
    var optionErrorsFields = {};
    var optionErrorsCount = 0;

    _.each(errorFields, function(errorField) {
      try{
        var field = that.$el.find("*[name=" + errorField + "]");
        if(errorField=="price"){
          field = that.$el.find("*[name=retail_price]");
        }else if(errorField=="sale_price"){
          field = that.$el.find("*[name=price]");
        }
        if( !field.length ) field = that.$el.find("*[name=" + errorField.replace(/_/g,'-') + "]"); 
        if( field.length ) {
          field.parent().addClass("error");
        }
      }catch(e){}
      if (errorField.indexOf("option ") == 0) {
        var data = errorField.split(" ");
        var errorMsg = data.length==3?data[2]:data.slice(2).join(" ");
        optionErrorsFields[errorMsg] = "true";
        if($.inArray(data[2], ['name', 'price'])!=-1){
          that.$el.find('.multiple-option-frm').find('.opt[id="'+data[1]+'"],.opt[tid="'+data[1]+'"]').find('input.'+data[2]).parent().addClass("error");
        }else{
          var $opt = that.$el.find('.multiple-option-frm').find('.opt[id="'+data[1]+'"],.opt[tid="'+data[1]+'"]');
          $opt.find(".btn-collapse").addClass("show").end().find(".inventory").show();
          $opt.find(".inventory").find('input.'+data[2]).parent().addClass("error");
        }
        optionErrorsCount++;
      }
      if (errorField == 'options') {
        that.$el.find('.multiple-option-frm .detail div.opt:not(.add)').addClass("error");
      }
      if (errorField.startsWith('option_meta ')) {
        var values = errorField.split(" ");
        if(values[1]=='name'){
          that.$el.find(".multiple-option-frm .options li p.title input").filter(function(){ return !this.value}).addClass("error");  
          alertify.alert('Please enter an option title.');
        }else if(values[1]=='values'){
          alertify.alert('Please provide available options for '+values[2]);
        }
      }
      if(errorField == 'image'){
        that.$el.find('._images_video li.add').addClass("error");
      }
      if(errorField == 'category_ids'){
        that.$el.find('.select-category.category_ids').addClass("error");
      }
      if(errorField == 'description'){
        that.$el.find('#product-description').closest('div.description').addClass("error");
      }
      if(errorField == 'tax_code'){
        that.$el.find('div.tax-cloud-view').addClass("error");
      }
      if(errorField == 'end_date'){
        that.$el.find('div.end-date.date-field').addClass("error");

      }
      if(errorField == 'shipping_options') {
        that.$el.find('.shipping_rate > label').addClass("error");
        alertify.alert('Please use Flat Rates or Custom Rates for items over 150 lbs.');
      }
      if(errorField == 'expected_delivery_day') {
        that.$el.find('._shipping .multiple-shipping-frm .expected_delivery_day_1').parent().addClass('error'); 
      } 
      if (errorField == 'expected_delivery_day_intl') {
        that.$el.find('._shipping .multiple-shipping-frm .expected_delivery_day_intl_1').parent().addClass('error'); 
      }
      if (errorField == 'custom_charge_domestic') { 
        that.$el.find('._shipping input[name="custom-charge-domestic"]').parent().addClass('error');
      }
      if (errorField == 'custom_incremental_domestic') { 
        that.$el.find('._shipping input[name="custom-incremental-domestic"]').parent().addClass('error');
      }
      if (errorField == 'custom_charge_international') { 
        that.$el.find('._shipping input[name="custom-charge-international"]').parent().addClass('error');
      }
      if (errorField == 'custom_incremental_international') { 
        that.$el.find('._shipping input[name="custom-incremental-international"]').parent().addClass('error');
      }
      
      if($.inArray(errorField, ['weight', 'height', 'length', 'width'])!=-1){
        that.$el.find("p.weight-based").addClass("error");
        if( that.model.get('use_warehouse')){
          that.$el.find("p.weight-based").html("You are using Fancy Warehouse. Please fill out dimensions and weight.");
        }else{
          that.$el.find("p.weight-based").html("This product uses weight-based shipping rate. Please fill out dimensions and weight.");
        }
      }
    });

    var capitalize = function(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
    $(".error-box").show();
    var optionErrors = Object.keys(optionErrorsFields).join(",");
    var msg = "There were " + (errorFields.length + (optionErrorsCount?1-optionErrorsCount:0)) + " errors, please check the highlighted fields:"; 
    if (errorFields.length == 1) { msg = "There was 1 error, please check the highlighted field:" }
    $(".error-box h3 span").text(msg);
    $(".error-box ul").empty(); 
    _.each(errorFields, function(field) {
        if(field.indexOf("option ")!=0 && field.indexOf("option_meta ")!=0 ){
          field = capitalize(field.replace(/_/g,' ')); 
          $(".error-box ul").append("<li>"+field+"</li>");       
        }
    });
    if(optionErrors){
      field = "Option's "+ optionErrors; 
      $(".error-box ul").append("<li>"+field.replace(/,/g,', ')+"</li>"); 
    }
      
    window.scrollTo(0, 0);
  },
  successCallback: function() {
    window.view.$el.find("button.btn-save").prop("disabled", false).removeClass('loading').text('Save Product');
    $("h2 button.btn-save").prop("disabled", false).removeClass('loading').text('Save Product');
	  $('.notification-bar').slideDown('fast');
	  setTimeout(function(){
		  $('.notification-bar').slideUp('fast');
	  },3000);

    window.view.syncModel();
    window.view.changed = false;
    if( !$("#content").hasClass("edit") ){
      window.location.pathname = "/merchant/products";  
    }
  },
  onSaveClick: function(event) {
    event.preventDefault();
    this.syncModel();
    var validated = true;
    $(".error-box").hide();
    this.$el.find(".error-comment").hide();
    this.$el.find(".error").removeClass("error");
    try {
      this.model.validateFields();
    } catch (errors) {
      this.highlightErrors(errors);
      validated = false;
    }
    if (validated) {
      this.$el.find("button.btn-save").prop("disabled", true).addClass('loading');
      $("h2 button.btn-save").prop("disabled", true).addClass('loading');

      var that = this;
      this.model.save().success(
        that.successCallback
      ).error(function(jqXHR) {
        if (jqXHR.responseJSON) {
          if (jqXHR.responseJSON['error_fields']) {
            that.highlightErrors(jqXHR.responseJSON['error_fields']);
          } else {
            var message = jqXHR.responseJSON.message || "Failed to create. Please fill out the form correctly.";
            alertify.alert(message);
          }
        }
        that.$el.find("button.btn-save").prop("disabled", false).removeClass('loading').text('Save Product');
        $("h2 button.btn-save").prop("disabled", false).removeClass('loading').text('Save Product');
      });
    }
  },
  onDeleteClick: function(event) {
    event.preventDefault();
    if(this.model.get('status') != 'pending'){
      alertify.alert("Active products cannot be deleted. Please deactivate the product from your Products screen first.");
      return;
    }

    if( !confirm("Are you sure you want to delete this sale item?") ) return;
    var that = this;
    this.model.destroy().success(function() {
      window.view.changed = false;
      window.location.pathname = "/merchant/products";
    }).error(function(jqXHR) {
      if (jqXHR.responseJSON) {
        if (jqXHR.responseJSON['error_fields']) {
            that.highlightErrors(jqXHR.responseJSON['error_fields']);
        } else {
          var message = jqXHR.responseJSON.message || "Failed to create. Please fill out the form correctly.";
          alertify.alert(message);
        }
      }
      that.$el.find("button.btn-delete").prop("disabled", false);
    });
  },
  onLockedFieldClick: function(event){
    alertify.alert("This field has been locked by Fancy. Please contact us to edit this." );
  },
  syncModel: function() {
    _.each(this.subviews, function(subview) {
      subview.syncModel();
    });
  },

  createProductInformationView: function() {
    return new FancyBackbone.Views.Product.ProductInformationView({
      el: this.$el.find("._product_information"),
      model: this.model,
      whitelabel: this.whitelabel 
    }).render();
  },

  createImagesAndVideoView: function() {
    return new FancyBackbone.Views.Product.ImagesAndVideoView({
      el: this.$el.find("._images_video"),
      model: this.model,
      is_admin: false,
      whitelabel: this.whitelabel,
    }).render();
  },

  createPricingDetailView: function() {
    return new FancyBackbone.Views.Product.PricingDetailView({
      el: this.$el.find("._pricing_detail"),
      model: this.model
    }).render();
  },
  createProductOptionsView: function() {
    return new FancyBackbone.Views.Product.ProductOptionsNewView({
      el: this.$el.find("._product_options"),
      model: this.model,
      is_admin: false,
    }).render();
  },

  createPriceInventoryView: function() {
    return new FancyBackbone.Views.Product.PriceInventoryView({
      el: this.$el.find("._price_inventory"),
      model: this.model
    }).render();
  },
  createAdvancedDetailsView: function() {
    return new FancyBackbone.Views.Product.AdvancedDetailsView({
      el: this.$el.find("._advanced_details"),
      model: this.model
    }).render();
  },

  createShippingView: function() {
    if( this.$el.find('._shipping').hasClass('new') ){
      return new FancyBackbone.Views.Product.ProfileShippingView({
        el: this.$el.find("._shipping"),
        model: this.model
      }).render();
    }else{
      return new FancyBackbone.Views.Product.ShippingView({
        el: this.$el.find("._shipping"),
        model: this.model
      }).render();  
    }
  },

  createReturnExchangeView: function() {
    return new FancyBackbone.Views.Product.ReturnExchangeView({
      el: this.$el.find("._return_exchange"),
      model: this.model
    }).render();
  },
  
  createMiscellaneousView: function () {
    return new FancyBackbone.Views.Product.MiscellaneousView({
      el: this.$el.find("._miscellaneous"),
      model: this.model
    }).render();
  },

  createProcessingDataView: function () {
    return new FancyBackbone.Views.Product.ProcessingDataView({
      el: this.$el.find("._processing_data"),
      model: this.model
    }).render();
  },

  createPrivateSaleView: function () {
    return new FancyBackbone.Views.Product.PrivateSaleView({
      el: this.$el.find("._private_sale"),
      model: this.model
    }).render();
  },

  createStatusView: function() {
    return new FancyBackbone.Views.Product.StatusView({
      el: this.$el.find("._status"),
      model: this.model
    }).render();
  },

  createOrganizeView: function() {
    if (this.legacyOrganizeView) {
      return new FancyBackbone.Views.Product.OrganizeViewLegacy({
        el: this.$el.find("._organize"),
        model: this.model,
        whitelabel: this.whitelabel,
        is_admin: false
      }).render();
    }
    return new FancyBackbone.Views.Product.OrganizeView({
      el: this.$el.find("._organize"),
      model: this.model,
      whitelabel: this.whitelabel,
      is_admin: false
    }).render();
  },

  createSaleDurationView: function() {
    return new FancyBackbone.Views.Product.SaleDurationView({
      el: this.$el.find("._sale_duration"),
      model: this.model,
      is_admin: false
    }).render();
  },
  
  createCustomFieldsView: function() {
    return new FancyBackbone.Views.Product.CustomFieldsView({
      el: this.$el.find("._custom_fields"),
      model: this.model,
      whitelabel: this.whitelabel 
    }).render();
  },

  createPreorderView: function () {
    return new FancyBackbone.Views.Product.PreorderView({
      el: this.$el.find(".add-preorder"),
      model: this.model
    }).render();
  },

  createSidebarGraphicsView: function () {
    return new FancyBackbone.Views.Product.SidebarGraphicsView({
      el: this.$el.find("._sidebar_graphics"),
      model: this.model
    }).render();
  },

  createVisibilityView: function () {
    if( this.$el.find("._visibility").hasClass('new')){
      return new FancyBackbone.Views.Product.VisibilityNewView({
        el: this.$el.find("._visibility"),
        model: this.model,
        whitelabel: this.whitelabel
      }).render();
    }else{
      return new FancyBackbone.Views.Product.VisibilityView({
        el: this.$el.find("._visibility"),
        model: this.model,
        whitelabel: this.whitelabel
      }).render();
    }
  },

  createDiscountOverrideView: function () {
    if( this.$el.find("._discount_override").hasClass('new')){
      return new FancyBackbone.Views.Product.DiscountOverrideNewView({
        el: this.$el.find("._discount_override"),
        model: this.model,
        whitelabel: this.whitelabel
      }).render();
    }else{
      return new FancyBackbone.Views.Product.DiscountOverrideView({
        el: this.$el.find("._discount_override"),
        model: this.model,
        whitelabel: this.whitelabel
      }).render();
    }
  },

  adjustContainer: function() {
    $("#content").removeClass("loading");
  },

  confirmClose: function(){
    window.view.syncModel();
    if( window.view.changed && !window.skipConfirmClose){
      return 'You have unsaved changes on this page.\nAre you sure you want to leave?';
    }
  },

  onProductChange: function(model){
    for(key in window.product.changed){
      if( ['seller_tags'].indexOf(key) > -1 ) continue;
      if( window.product.previous(key) != window.product.changed[key]){
        window.view.changed = true;
        break;
      }
    }
  },

  render: function() {
    this.subviews = [
      this.createProductInformationView(),
      this.createImagesAndVideoView(),
      this.createProductOptionsView(),
      this.createShippingView(),
      this.createReturnExchangeView(),
      this.createMiscellaneousView(),
      this.createProcessingDataView(),
      this.createPrivateSaleView(),
      this.createStatusView(),
      this.createOrganizeView(),
      this.createSaleDurationView(),
      this.createCustomFieldsView(),
      this.createPreorderView(),
      this.createSidebarGraphicsView(),
    ];

    if( this.$el.find("._price_inventory").length){
      this.subviews.push(this.createPriceInventoryView());
      this.subviews.push(this.createAdvancedDetailsView());
    }else{
      this.subviews.push(this.createPricingDetailView());
    }

    if( this.$el.find("._discount_override").length){
      this.subviews.push(this.createDiscountOverrideView());
    }
    if( this.$el.find("._visibility").length){
      this.subviews.push(this.createVisibilityView());
    }

    this.changed = false;
    this.syncModel();
    this.model.on('change', this.onProductChange);
    window.onbeforeunload = this.confirmClose;
    this.adjustContainer();
    this.$el.find('.tooltip').each(function(){
      var w = $(this).find('em').width();
      $(this).find('em').css('margin-left',-w/2+'px');
    });
    return this;
  },
});

FancyBackbone.Views.Product.AdminSeniorPricingDetailView = FancyBackbone.Views.Product.PricingDetailView.extend({
  syncModel: function() {
    this._super();
  },
  syncView: function() {
    this._super();
  },
  render:function() { 
    this._super();
    return this; 
  },
});

FancyBackbone.Views.Product.AdminSeniorStatusView = FancyBackbone.Views.Product.StatusView.extend({
  events: {
    'click button[name=product_is_active]': 'onActiveChange',
    'click button[name=marked_soldout]': 'onSoldoutChange',
    'click button[name=show_anywhere_only]': 'onAnywhereOnlyChange',
  },
  onActiveChange:function(e){
    this.$el.find("button[name=product_is_active]").toggleClass('on');
    var is_active = false;
    if( this.$el.find("button[name=product_is_active]").hasClass('on') ){
      this.$el.find("p.status label").text('Active');
      is_active = true;
    }else{
      this.$el.find("p.status label").text('Inactive');
    }

    if(!window.product.get('id_str')) return;

    var params = { ids: [window.product.get('id_str')] }
    if(window.overridden_seller_id) {
        params['seller_id'] = window.overridden_seller_id
    }

    $.ajax({
      url: is_active?'/merchant/products/activate-items.json':'/merchant/products/deactivate-items.json',
      data: params,
      dataType: 'json',
      type: 'POST',
      traditional: true,
    }).done(function(data, statusText, xhr) {
        if (data.status_code == 0){
          if (data.message) {
            alert(data.message);
          } else {
            alert(gettext('Please try again later.'));
          }
        }
    }).fail(function() {
      alert(gettext('Please try again later.'));
    });
  },
  onSoldoutChange:function(e){
    this.$el.find("button[name=marked_soldout]").toggleClass('on');
    var mark_soldout = this.$el.find("button[name=marked_soldout]").hasClass('on') ;

    if(!window.product.get('id_str')) return;

    var params = { ids: [window.product.get('id_str')] }
    if(window.overridden_seller_id) {
        params['seller_id'] = window.overridden_seller_id
    }

    $.ajax({
      url: mark_soldout?'/merchant/products/mark-soldout-items.json':'/merchant/products/unmark-soldout-items.json',
      data: params,
      dataType: 'json',
      type: 'POST',
      traditional: true,
    }).done(function(data, statusText, xhr) {
        if (data.status_code == 0){
          if (data.message) {
            alert(data.message);
          } else {
            alert(gettext('Please try again later.'));
          }
        }
    }).fail(function() {
      alert(gettext('Please try again later.'));
    });
  },
  onAnywhereOnlyChange:function(e){
    if(this.$el.find("button[name=show_anywhere_only]")[0]){
      this.$el.find("button[name=show_anywhere_only]").toggleClass('on');
      var mark_anywhereonly = this.$el.find("button[name=show_anywhere_only]").hasClass('on') ;
      if(!window.product.get('id_str')) return;

      var params = { ids: [window.product.get('id_str')] }
      if(window.overridden_seller_id) {
          params['seller_id'] = window.overridden_seller_id
      }
      $.ajax({
        url: mark_anywhereonly?'/merchant/products/mark-anywhere-only-items.json':'/merchant/products/unmark-anywhere-only-items.json',
        data: params,
        dataType: 'json',
        type: 'POST',
        traditional: true,
      }).done(function(data, statusText, xhr) {
          if (data.status_code == 0){
            if (data.message) {
              alert(data.message);
            } else {
              alert(gettext('Please try again later.'));
            }
          }
      }).fail(function() {
        alert(gettext('Please try again later.'));
      });
    }

  },
  
  initialize: function() {
  },
  render: function() {
    this.syncView();
    return this;
  },
});

FancyBackbone.Views.Product.AdminSeniorAddProductView = FancyBackbone.Views.Product.AddProductView.extend({
  createImagesAndVideoView: function() {
    return new FancyBackbone.Views.Product.ImagesAndVideoView({
      el: this.$el.find("._images_video"),
      model: this.model,
      is_admin: true,
      whitelabel: this.whitelabel,
    }).render();
  },
  createProductOptionsView: function() { 
    return new FancyBackbone.Views.Product.ProductOptionsNewView({
      el: this.$el.find("._product_options"),
      model: this.model,
      is_admin: true,
    }).render();
  },
  createPricingDetailView: function() {
    return new FancyBackbone.Views.Product.AdminSeniorPricingDetailView({
      el: this.$el.find("._pricing_detail"),
      model: this.model
    }).render();
  },
  createSaleDurationView: function() {
    return new FancyBackbone.Views.Product.SaleDurationView({
      el: this.$el.find("._sale_duration"),
      model: this.model,
      is_admin: true,
    }).render();
  },
  createStatusView: function() {
    return new FancyBackbone.Views.Product.AdminSeniorStatusView({
      el: this.$el.find("._status"),
      model: this.model
    }).render();
  },
  createOrganizeView: function() {
    return new FancyBackbone.Views.Product.OrganizeView({
      el: this.$el.find("._organize"),
      model: this.model,
      whitelabel: this.whitelabel,
      is_admin: true,
    }).render();
  },
});


