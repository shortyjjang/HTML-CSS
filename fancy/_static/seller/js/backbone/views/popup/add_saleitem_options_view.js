FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.ViewAddSaleItemOptions = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'popup_add_saleitem_options',
    events: {
        'click .btn-save': 'onSaveButtonClick',
        'click #sync_qty_checkbox': 'onSyncQuantityClick'
    },
    templateData: function() {
      return {
        seller: FancyBackbone.App.seller
      };
    },
    onSaveButtonClick: function() {
        var isValid = true;
        this.$el.find(".error").removeClass("error");
        this.$el.find("input").each(function(){
			var $this = $(this);
            if( $this.is('p.name input,p.price input') && !$.trim($this.val()) ){
				$this.parent().addClass("error");
				isValid = false;
            }
            if( $this.is("p.color input") ){
                if( $this.val().length > 50 ){
                    $this.parent().addClass("error");
                    alert("Color field must have under 50 characters. please check Color text!");
                    isValid = false;
                }
            }
        });

        if(!isValid) return;

        if (this.$el.data().hasOwnProperty('model')) {
            var option = this.$el.data('model');
            option.set('marked_soldout', this.$el.find('div.btn-area #marked_soldout_option').prop('checked') );
            FancyBackbone.App.eventAggregator.trigger("save:saleitemoption", option);
        } else {
            FancyBackbone.App.eventAggregator.trigger("save:saleitemoption", null);
        }
        $.dialog("add-option").close();
        
    },
    onSyncQuantityClick: function () {
        this.updateSyncQuantityView();
    },
    updateSyncQuantityView: function () {
        var $checkbox = this.$('input#sync_qty_checkbox');
        var model = this.$el.data('model');
        var quantity = '';

        if (model) {
            quantity = model.get('quantity');
        }

        if ($checkbox.is(':checked')) {
            $checkbox.closest('.qty').addClass('checked');
            this.$("input[name=quantity]").val(quantity).prop('disabled', true);
        } else {
            $checkbox.closest('.qty').removeClass('checked');
            this.$("input[name=quantity]").prop('disabled', false);
        }
    },
    open: function(admin) {
        $.dialog("add-option").open();

        if (!admin)  {
            this.$el.find('p.unit-cost').hide();
        }
        var option = null;
        if (this.$el.data().hasOwnProperty('model')) {
            option = this.$el.data('model');
            this.$el.find('p.name input').val(option.get('name'));
            this.$el.find('p.qty input[name=quantity]').val(option.get('quantity') || '');
            this.$el.find('p.price input').val(option.get('price'));
            this.$el.find('p.retail input').val(option.get('retail_price'));
            this.$el.find('p.sku input').val(option.get('seller_sku'));
            this.$el.find('p.length input').val(option.get('prod_length'));
            this.$el.find('p.width input').val(option.get('prod_width'));
            this.$el.find('p.weight input').val(option.get('prod_weight'));
            this.$el.find('p.height input').val(option.get('prod_height'));
            this.$el.find('p.color input').val(option.get('color'));

            if (admin) {
                this.$el.find('p.unit-cost input').val(option.get('unit_cost'));
            }
        }

        //if (this.saleItem.get('sync_quantity_with_warehouse')) {
        //    this.$el.find('p.qty input#sync_qty_checkbox').prop('disabled', true);
        //}
        var syncQuantityWithWarehouse = false;
        //if (option) {
        //    syncQuantityWithWarehouse = option.get('sync_quantity_with_warehouse');
        //} else {
        //    syncQuantityWithWarehouse = this.saleItem.get('sync_quantity_with_warehouse');
        //}
        this.$el.find('p.qty input#sync_qty_checkbox').prop('checked', syncQuantityWithWarehouse);

        this.updateSyncQuantityView();
    },
    render: function(option, saleItem, admin) {
        var that = this;
        var superFn = this._super;
        superFn.apply(that);

        this.saleItem = saleItem;
        if (option) {
            this.$el.data('model', option);
        } else {
            delete this.$el.data()['model'];
        }

        that.open(admin);

        return this;
    },
});

FancyBackbone.Views.Popup.OptionPhotoView = FancyBackbone.Views.Base.TemplateView.extend({
  events: {
    'click a.delete-button': 'onDeleteButtonClick',
  },
  tagName: 'li',
  className: 'photo-item',
  template: FancyBackbone.Utils.loadTemplate("product_new_photo_item"),
  initialize: function(options) {
    this.url = options.url;
  },
  onDeleteButtonClick: function(event) {
    event.preventDefault();
    this.remove();
  },
  render: function() {
    this.$el.html(this.template({
      url: this.url,
    }));
    return this;
  }
});

FancyBackbone.Views.Popup.OptionImageItemView = FancyBackbone.Views.Base.TemplateView.extend({
  events: {
    'click a.btn-del': 'onDeleteButtonClick',
  },
  tagName: 'li',
  className: 'photo item',
  template: FancyBackbone.Utils.loadTemplate("product_new_photo_item"),
  initialize: function(options) {
    this.url = options.url;
  },
  onDeleteButtonClick: function(event) {
    event.preventDefault();
    this.remove();
  },
  render: function() {
    this.$el.html(this.template({
      url: this.url,
      is_admin: false,
    }));
    this.$el.find(".btn-edit").remove();
    return this;
  }
});

FancyBackbone.Views.Popup.ViewAddSaleItemOptionsImage = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'popup_add_saleitem_options_image',
    events: {
        'keyup .price input:text': 'onPriceChage',
        'keyup .retail input:text': 'onPriceChage',
        'click #opt_product_sales': 'onCheckSaleClick',
        'click .btn-save': 'onSaveButtonClick',
        'click .btn-delete': 'onDeleteButtonClick',
        'click  .sync #opt_sync_qty': 'onSyncQtyChange',
        'click .btn-delete': 'onDeleteButtonClick',
        'click li.add_photo': 'onAddPhotoClick'
    },
    templateData: function() {
      return {      
      };
    },
    onPriceChage: function(event) {
      var price = parseFloat(this.$el.find('.price input:text').val());
      var retail_price = parseFloat(this.$el.find('.retail input:text').val());
      var discount = parseFloat(this.$el.find('.discount input:text').val());
      if (!isNaN(price)) {
        if (!isNaN(retail_price)) {
          this.$el.find('.discount input:text').val(get_discount(retail_price, price));
        } else if (isNaN(discount)) {
          this.$el.find('.discount input:text').val('');
        }
      } else {
        this.$el.find('.discount input:text').val('');
      }
    },
    onAddPhotoClick: function() { 
        this.$el.find("#add_product_photo").click();
    },
    onCheckSaleClick: function (event) {
      var $this = $(event.target);
      if($this.is(":checked")){
        $this.closest('.data-frm').find(".retail, .discount").show();
      }else{
        $this.closest('.data-frm').find(".retail, .discount").hide().filter(".retail").find("input").val('').trigger('keyup');
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
        var isValid = true;
        var self = this;
        this.$el.find(".error").removeClass("error");
        this.$el.find("input,select").each(function(){
            var $this = $(this);
            if( $this.is('p.name input,p.price input') && !$.trim($this.val()) ){
                $this.parent().addClass("error");
                isValid = false;
            }
            if( $this.is("p.color select") ){
                if( $this.val().length > 50 ){
                    $this.parent().addClass("error");
                    alert("Color field must have under 50 characters. please check Color text!");
                    isValid = false;
                }
            }
        });

        if(!isValid) return;
        if (this.$el.data().hasOwnProperty('model')) {
            option = this.$el.data('model');
            option.set('marked_soldout', this.$el.find('#marked_soldout_option').prop('checked') );
            FancyBackbone.App.eventAggregator.trigger("save:saleitemoption", option);
        } else {
            FancyBackbone.App.eventAggregator.trigger("save:saleitemoption", null);
        }
        $.dialog("add-option").close();
    },
    onDeleteButtonClick: function(){
        var option = this.$el.data('model');
        FancyBackbone.App.eventAggregator.trigger("delete:saleitemoption", option);
        $.dialog("add-option").close();
    },
    addOptionImage: function(image) {
        var imageDictionary = image.attributes;
        var imageView = new FancyBackbone.Views.Popup.OptionImageItemView({model:image, url: imageDictionary.url_310}).render().$el;
        if ('original_rel_path' in imageDictionary) {
            imageView.attr('original_rel_path', imageDictionary.original_rel_path);
        }
        if ('id_str' in imageDictionary) { 
            imageView.attr('id_str', imageDictionary.id_str); 
        }
        imageView.attr('url_310', imageDictionary.url_310)
        this.$el.find("ol.photo-list .add_photo").before(imageView);
    },
    open: function(admin) {
        $.dialog("add-option").open();
        if (admin)  {
            this.$el.find('p.cost').show();
            this.$el.find('p.sku').show();
        }
        if(this.saleItem.get('retail_price') && parseFloat(this.saleItem.get('retail_price')) > parseFloat(this.saleItem.get('price')) ){
            this.$el.find("p.retail, p.discount").show().end().find("#opt_product_sales").prop('checked',true);    
        }else{
            this.$el.find("p.retail, p.discount").hide().end().find("#opt_product_sales").prop('checked',false);    
        }
        
        var options = null;
        if (this.$el.data().hasOwnProperty('model')) {
            options = this.$el.data('model');
            this.$el.find('p.name input').val(options.get('name'));
            var qty_value = options.get('quantity');
            if(qty_value==null) {
                this.$el.find('p.qty input').val( '');
            } else {
                this.$el.find('p.qty input').val( Math.max(0, options.get('quantity')- (options.get('num_sold')||0))||'');
            }
            this.$el.find('p.price input').val(options.get('price'));
            this.$el.find('p.retail input').val(options.get('retail_price')).keyup();
            this.$el.find('p.length input').val(options.get('prod_length'));
            this.$el.find('p.width input').val(options.get('prod_width'));
            this.$el.find('p.weight input').val(options.get('prod_weight'));
            this.$el.find('p.height input').val(options.get('prod_height'));
            this.$el.find('div.color select').val(options.get('color'));
            if( options.get('color') && !this.$el.find('p.color select').val() ){
                this.$el.find('p.color select').prepend("<option value='"+options.get('color')+"'>"+options.get('color')+"</option>").val(options.get('color'));
            }
            if(options.get('marked_soldout')){
                this.$el.find('#marked_soldout_option').attr('checked', 'checked');
            }else{
                this.$el.find('#marked_soldout_option').removeAttr('checked');
            }
            if (admin) {
                this.$el.find('input[name=unit_cost]').val(options.get('unit_cost'));
                this.$el.find('input[name=seller_sku]').val(options.get('seller_sku'));

                this.$el.find('p.qty .sync button, p.qty .sync label').show();
                if (this.saleItem.get('sync_quantity_with_warehouse')) {
                    this.$el.find('p.qty .sync').addClass('disabled').find('button').addClass('on').end().find('input').prop('disabled',true);
                }
                var syncQuantityWithWarehouse = false;
                if (options) {
                    syncQuantityWithWarehouse = options.get('sync_quantity_with_warehouse');
                } else {
                    syncQuantityWithWarehouse = this.saleItem.get('sync_quantity_with_warehouse');
                }
                if(syncQuantityWithWarehouse){
                    this.$el.find('p.qty .sync button').addClass('on');
                    this.$el.find('p.qty input').prop('disabled',true);
                }
            }

            var images = options.get('images').models;
            for (var i=0; i < images.length; i++ ) { 
                this.addOptionImage(images[i]); 
            }
            
            if(options.get('retail_price') && options.get('price')!=options.get('retail_price') && !this.$el.find("#opt_product_sales").prop('checked') ){
                this.$el.find("#opt_product_sales").trigger('click');
            }


            this.$el.find(".btn-delete").show();
        }else{
            this.$el.find('p.price input').val(this.saleItem.get('price'));
            this.$el.find('p.qty input').val( '');
            this.$el.find('p.retail input').val(this.saleItem.get('retail_price')).keyup();
            this.$el.find('p.length input').val(this.saleItem.get('length'));
            this.$el.find('p.width input').val(this.saleItem.get('width'));
            this.$el.find('p.weight input').val(this.saleItem.get('weight'));
            this.$el.find('p.height input').val(this.saleItem.get('height'));
            this.$el.find(".btn-delete").hide();
            if(this.saleItem.get('retail_price') && this.saleItem.get('price')!=this.saleItem.get('retail_price') ){
                this.$el.find("#opt_product_sales").click();
            }
        }

    },
    render: function(options, saleItem, admin) {
        var that = this, $addPhoto = this.$el.find('ul.photo-list > li.add_photo');
        var superFn = this._super;
        superFn.apply(that);

        this.model = options;
        this.saleItem = saleItem;

        if (options) {
            this.$el.data('model', options);
        } else {
            delete this.$el.data()['model'];
        }
        
        that.open(admin);

        this.$el.find(".data-frm.add-photos").show();

        this.$el.find("ol.photo-list").sortable({
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
        
        this.$el.find("#add_product_photo").fileupload({
            dataType: 'json',
            url: '/sales/upload',
            start: function(e, data) {
              that.setWaiting(true);
            },
            done: function(e, data) {
              that.setWaiting(false);
              if (data.result.status_code) {
                that.addOptionImage(new FancyBackbone.Models.Product.Image({
                  option: that.model,
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
