FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};

FancyBackbone.Views.Popup.OptionImageItemNewView = FancyBackbone.Views.Base.TemplateView.extend({
  events: {
    'click a.btn-del': 'onDeleteButtonClick',
    'click a.btn-edit': 'onAltButtonClick',
  },
  tagName: 'li',
  className: 'photo item',
  template: FancyBackbone.Utils.loadTemplate("product_new_photo_item"),
  initialize: function(options) {
    this.url = options.url;
  },
  onDeleteButtonClick: function(event) {
    event.preventDefault();
    if(window.product.is_locked_field('options')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    this.remove();
  },
  onAltButtonClick: function(event){
    event.preventDefault();
    var that = this;
    if(window.product.is_locked_field('options')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    window.popups.editAltText.open(this.model, {close:function(){
        window.popups.optionImages.render(that.model.get('option'));
    }});
  },
  render: function() {
    this.$el.html(this.template({
      url: this.url,
      is_admin: false,
    }));
    return this;
  }
});

FancyBackbone.Views.Popup.OptionImagesView = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'popup_option_images',
    events: {
        'click .btn-save': 'onSaveButtonClick',
        'click li.add_photo': 'onAddPhotoClick'
    },
    templateData: function() {
      return {      
      };
    },
    onAddPhotoClick: function() { 
        if(window.product.is_locked_field('options')){
          alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
          return;
        }
        this.$el.find("#add-option-image").click();
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
    onSaveButtonClick: function() {
        var imageCollection = new FancyBackbone.Collections.Product.ImageCollection(
          _.map(this.$el.find(".item.photo"), function(photoItemView) {
            return $(photoItemView).data('model');
          })
        );
        this.model.set('images', imageCollection);

        FancyBackbone.App.eventAggregator.trigger("update:saleitemoption", this.model);
        $.dialog("update_img").close();
    },
    addOptionImage: function(image) {
        var imageView = new FancyBackbone.Views.Popup.OptionImageItemNewView({model: image, url: image.get('url_310')}).render().$el;
        imageView.data('model', image);
        this.$el.find("ul .add").before(imageView);
    },
    open: function() {
        $.dialog("update_img").open();
        
        var options = null;
        if (this.$el.data().hasOwnProperty('model')) {
            options = this.$el.data('model');

            var images = options.get('images').models; 
            for (var i=0; i < images.length; i++ ) { 
                this.addOptionImage(images[i]); 
            }
        }

    },
    render: function(options) {
        var that = this, $addPhoto = this.$el.find('ul > li.add');
        var superFn = this._super;
        superFn.apply(that);

        this.model = options;
        this.$el.data('model', options);
        
        that.open();

        this.$el.find("ul").sortable({
            items:'.photo.item', 
            containment: "parent",
            start : function(event, ui) {
              $addPhoto.css('opacity',0);
              setTimeout(function(){ $addPhoto.hide() }, 200);
            },
            stop : function(event, ui) {
              $addPhoto.appendTo($addPhoto.parent()).show();
              setTimeout(function(){ $addPhoto.css('opacity',1) }, 0);
            }
        });
        
        this.$el.find("#add-option-image").fileupload({
            dataType: 'json',
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

FancyBackbone.Views.Popup.OptionQuantitiesView = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'popup_option_quantities',
    events: {
        'click .btn-add': 'onAddButtonClick',
        'keyup input.qty': 'onStatusChange',
        'click input:checkbox': 'onStatusChange',
    },
    templateData: function() {
      return {
        options : this.model.models
      };
    },
    onAddButtonClick: function() {
        var that = this;
        var qty = parseInt(this.$el.find("input.qty").val())||0;
        _.each(this.model.models, function(option){
            var $tr = that.$el.find("[id='"+option.get('id')+"'],[tid='"+option.get('tid')+"']");
            var currentQty = parseInt(option.get('quantity'));
            var checked = $tr.find("input").prop('checked');
            if(checked && qty){
                option.set('quantity', (currentQty||0) + qty );
                FancyBackbone.App.eventAggregator.trigger("update:saleitemoption", option);
            }
        });
        $.dialog("update_qty").close();
    },
    onStatusChange: function(){
        var qty = parseInt(this.$el.find("input.qty").val())||0;
        this.$el.find("tbody tr").each(function(){
            var $this = $(this);
            var checked = $this.find("input").prop('checked');
            var currentQty = parseInt($this.find("td:eq(1)").text());
            if(checked && qty){
                $this.find("td:eq(2)").text( (currentQty||0) + qty );
            }else if(currentQty){
                $this.find("td:eq(2)").text( currentQty );
            }else{
                $this.find("td:eq(2)").text( $this.find("td:eq(1)").text() );
            }
        })
    },
    open: function() {
        $.dialog("update_qty").open();
        
        var options = null;
        if (this.$el.data().hasOwnProperty('model')) {
            options = this.$el.data('model');
        }

    },
    render: function(options) {
        var that = this;

        this.model = options;
        this.$el.data('model', options);

        var superFn = this._super;
        superFn.apply(that);
        
        that.open();

        return this;
    },
});

FancyBackbone.Views.Popup.OptionPricesView = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'popup_option_prices',
    events: {
        'click .btn-add': 'onAddButtonClick',
        'keyup [name=price]': 'onStatusChange',
        'keyup [name=retail_price]': 'onStatusChange',
        'click input:checkbox': 'onStatusChange',
    },
    templateData: function() {
      return {
        options : this.model.models
      };
    },
    onAddButtonClick: function() {
        var that = this;
        var retail_price = parseFloat(this.$el.find("input[name=retail_price]").val());
        var price = parseFloat(this.$el.find("input[name=price]").val());
        if(isNaN(price)) price = retail_price
        _.each(this.model.models, function(option){
            var $tr = that.$el.find("[id='"+option.get('id')+"'],[tid='"+option.get('tid')+"']");
            var checked = $tr.find("input").prop('checked');
            if(checked){
                if(!isNaN(retail_price)){
                    option.set('retail_price', retail_price );
                }
                if(!isNaN(price)){
                    option.set('price', price );
                    option.set('price_original', price );
                }
                FancyBackbone.App.eventAggregator.trigger("update:saleitemoption", option);
            }
        });
        $.dialog("update_price").close();
    },
    onStatusChange: function(){
        var retail_price = parseFloat(this.$el.find("input[name=retail_price]").val());
        var price = parseFloat(this.$el.find("input[name=price]").val());
        if(isNaN(price)) price = retail_price;
        var discount = get_discount(retail_price, price);
        if(discount>0){
          this.$el.find("[name=price]").next().show().html(discount+"% OFF");
        }else{
          this.$el.find("[name=price]").next().hide().html("% OFF");
        }

        this.$el.find("tbody tr").each(function(){
            var $this = $(this);
            var checked = $this.find("input").prop('checked');
            if(checked){
                if(!isNaN(retail_price)){
                    $this.find("td:eq(2)").text( "$"+retail_price );
                }
                if(!isNaN(price)){
                    $this.find("td:eq(4)").text( "$"+price );
                }
            }else{
                $this.find("td:eq(2)").text( $this.find("td:eq(1)").text() );
                $this.find("td:eq(4)").text( $this.find("td:eq(3)").text() );
            }
        })
    },
    open: function() {
        $.dialog("update_price").open();
        
        var options = null;
        if (this.$el.data().hasOwnProperty('model')) {
            options = this.$el.data('model');
        }

    },
    render: function(options) {
        var that = this;

        this.model = options;
        this.$el.data('model', options);
        
        var superFn = this._super;
        superFn.apply(that);

        that.open();

        return this;
    },
});

FancyBackbone.Views.Popup.ViewOptionBatchUpdate = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'popup_option_batch_update',
    events: {
        'click .add a': 'onAddPhotoClick',
        'click .btn-save': 'onSaveButtonClick'
    },
    templateData: function() {
      return {
        options : this.model,
        type : this.type
      };
    },
    onSaveButtonClick: function() {
        var isValid = true;

        if(this.type == 'dimension'){
            isValid = this.updateDimension();
        }else if(this.type == 'price'){
            isValid = this.updatePrice();
        }else if(this.type == 'quantity'){
            isValid = this.updateQuantity();
        }else if(this.type == 'image'){
            isValid = this.updateImage();
        }else if(this.type == 'gtin'){
            isValid = this.updateGTIN();
        }
        if(!isValid) return;

        $(this.model).each( function(i,v){
            FancyBackbone.App.eventAggregator.trigger("update:saleitemoption", v);
        });
        $.dialog("update-batch").close();
        
    },
    onAddPhotoClick: function(e){
        e.preventDefault();
        this.$el.find("[name=upload-file]").click();
    },
    updateDimension: function(){
        var that = this;
        this.$el.find("input[name]").each(function(){
            var name = $(this).attr('name'), val = $(this).val();
            if(val){
                $(that.model).each( function(i,v){
                    v.set('prod_'+name, val);
                })        
            }
        })
        return true;
    },
    updatePrice: function(){
        var that = this;
        var price = this.$el.find("input[name=price]").val();
        var retail_price = this.$el.find("input[name=retail_price]").val();
        if(!retail_price){
            alertify.alert("Please input new price");
            return false;
        }else if(isNaN(retail_price)){
            alertify.alert("Please input new price as number format");
            return false;
        }
        if(isNaN(price)){
          price = retail_price;
        }
        price = parseFloat(price);
        retail_price = parseFloat(retail_price);

        var discount = get_discount(retail_price, price);
        $(this.model).each( function(i,v){
            v.set('price', price && price.toFixed(2) || '');
            v.set('price_original', price && price.toFixed(2) || '');
            v.set('retail_price', retail_price && retail_price.toFixed(2) || '');
            v.set('discount_percentage', discount ) ;
        })    
        return true;    
    },
    updateQuantity: function(){
        var that = this;
        var quantity = this.$el.find("input[name=quantity]").val();
        $(that.model).each( function(i,v){
            if(quantity==''){
                v.set('quantity', null);
            }else{
                v.set('quantity', parseInt(quantity)||0);
            }
        })
        return true;
    },
    updateGTIN: function(){
        var that = this;
        var gtin = this.$el.find("input[name=gtin]").val();
        $(that.model).each( function(i,v){
            if(gtin==''){
                v.set('gtin', null);
            }else{
                v.set('gtin', gtin);
            }
        })
        return true;
    },
    addOptionImage: function(image) {
        var imageView = new FancyBackbone.Views.Popup.OptionImageItemNewView({model: image, url: image.get('url_310')}).render().$el;
        imageView.data('model', image);
        this.$el.find("ul .add").before(imageView);
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
    updateImage: function(){
        var replace = this.$el.find("#remove_existing_variant").prop('checked');
        var imagemodels = _.map(this.$el.find(".item.photo"), function(photoItemView) {
            return $(photoItemView).data('model');
          })
        $(this.model).each( function(i,v){
            if(replace) v.get('images').reset();
                
            $(imagemodels).each(function(_,image){
                v.get('images').add( new FancyBackbone.Models.Product.Image({
                      url_310: image.get('url_310'),
                      original_rel_path: image.get('original_rel_path'),
                      alt_text: image.get('alt_text'),
                      options: image.get('options'),
                    })
                );
            })
        });
        return true;
    },
    open: function(admin) {
        $.dialog("update-batch").open();

        var options = null;
        if (this.$el.data().hasOwnProperty('model')) {
            options = this.$el.data('model');
        }
    },
    render: function(type, options) {
        var that = this;

        this.type = type;
        this.model = options;
        this.$el.data('model', options);
        
        var superFn = this._super;
        superFn.apply(that);

        that.open();
        if(type=='image'){
            var $addPhoto = this.$el.find('ul > li.add');
            this.$el.find("ul").sortable({
                items:'.photo.item', 
                containment: "parent",
                start : function(event, ui) {
                  $addPhoto.css('opacity',0);
                  setTimeout(function(){ $addPhoto.hide() }, 200);
                },
                stop : function(event, ui) {
                  $addPhoto.appendTo($addPhoto.parent()).show();
                  setTimeout(function(){ $addPhoto.css('opacity',1) }, 0);
                }
            });

            this.$el.find("[name=upload-file]").fileupload({
                dataType: 'json',
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
        }

        return this;
    },
});
