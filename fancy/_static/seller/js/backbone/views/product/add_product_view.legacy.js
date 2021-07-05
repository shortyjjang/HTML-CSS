if(location.search!='?new'){

FancyBackbone.Views.ProductLegacy = FancyBackbone.Views.ProductLegacy || {};

FancyBackbone.Views.ProductLegacy.StatusView = Backbone.View.extend({
  syncModel: function() {
	  var is_active = this.$el.find('input#status_activated').prop('checked');
	  var scarcity_ribbon_threshold = null;
    if (this.$el.find("#show_scarcity").is(":checked")) {
      scarcity_ribbon_threshold = this.$el.find('input[name="scarcity_ribbon_threshold"]').val();
      if (!scarcity_ribbon_threshold) {
        scarcity_ribbon_threshold = 'null';
      }
    }
    this.model.set('is_active', is_active);
    this.model.set('marked_soldout', (this.$el.find("#marked_soldout").is(":checked")));
    this.model.set('scarcity_ribbon_threshold', scarcity_ribbon_threshold);
  },
  syncView: function() {
    if (this.model.id) {
      if (this.model.get('is_active')) {
        this.$el.find('input#status_activated').prop('checked', true);
      } else {
        this.$el.find('input#status_deactivated').prop('checked', true);
      }

      var locked = this.model.is_locked_field('is_active');
      this.$el.find('input#status_activated').prop('disabled',locked);
      this.$el.find('input#status_deactivated').prop('disabled', locked);
      if(locked) this.$el.find('p.status').addClass('locked');
      else this.$el.find('p.status').removeClass('locked');

      if (!this.model.get('seller_owns_thing')) {
        this.$el.find('input#status_activated').prop('disabled', true);
        this.$el.find('.status .label .tooltip').show();
      }

      if (this.model.get('marked_soldout')) {
        this.$el.find('input#marked_soldout').prop('checked', true);
      }
      this.$el.find('input#marked_soldout').prop('disabled', this.model.is_locked_field('quantity'));
      if(this.model.is_locked_field('quantity')) this.$el.find('input#marked_soldout').addClass('locked')
      else this.$el.find('input#marked_soldout').removeClass('locked')

      var scarcity_ribbon_threshold = this.model.get('scarcity_ribbon_threshold');
      if (!scarcity_ribbon_threshold) {
        this.$el.find('input#show_scarcity').prop('checked', false);
        this.$el.find('input[name="scarcity_ribbon_threshold"]').val('');
      } else {
        this.$el.find('input#show_scarcity').prop('checked', true);
        this.$el.find('input[name="scarcity_ribbon_threshold"]').val(scarcity_ribbon_threshold);
      }
    } else {
      if (!this.$el.find('input#status_deactivated').prop('checked')) {
        this.$el.find('input#status_activated').prop('checked', true);
      }
    }
  },
  render: function() {
    this.syncView();
    return this;
  }
});


FancyBackbone.Views.ProductLegacy.InfoView = Backbone.View.extend({
  events: {
    'keyup input[name=price]': 'onPriceChage',
    'keyup input[name=retail-price]': 'onRetailPriceChage',
    'change fieldset.select-category > select': 'onSelectedCategoryChange',
    'change input#is_preorder': 'onTogglePreorder',
    'click fieldset.select-category > button.btns-add': 'onAddCategoryClick',
    'click ul.step-category > li > a.btn-del': 'onRemoveCategoryClick',
    'click .harmonized-code-selection > button.harmonized-code-btn-del': 'onDeleteHarmonizedCodeClick',
    'keyup input[name=harmonized-code-search]': 'onInputHarmonizedCodeSearch',
    'click .harmonized-code-suggestion > li': 'onClickHarmonizedCodeSuggestion',
    'click #sync_qty_checkbox': 'onSyncQuantityClick'
  },
  onTogglePreorder: function(event) {
	  if($(event.currentTarget).prop('checked')) {
		  $('.add-preorder').show();
	  } else {
		  $('.add-preorder').hide();
	  }
  },
  onPriceChage: function(event) {
    var price = parseFloat($(event.currentTarget).val());
    var retail_price = parseFloat($('input[name=retail-price]').val());
    var discount = parseFloat($('input[name=discount]').val());
    if (!isNaN(price)) {
      if (!isNaN(retail_price)) {
        $('input[name=discount]').val(get_discount(retail_price, price));
      } else if (isNaN(discount)) {
        $('input[name=discount]').val('');
      }
    } else {
      $('input[name=discount]').val('');
    }
  },

  onRetailPriceChage: function(event) {
    var retail_price = parseFloat($(event.currentTarget).val());
    var price = parseFloat($('input[name=price]').val());
    var discount = parseFloat($('input[name=discount]').val());
    if (!isNaN(retail_price)) {
      if (!isNaN(price)) {
        $('input[name=discount]').val(get_discount(retail_price, price));
      } else if (isNaN(discount)) {
        $('input[name=discount]').val('');
      }
    } else {
      $('input[name=discount]').val('');
    }
  },
  onSelectedCategoryChange: function(event) {
    var $select = $(event.currentTarget);
    var category = this.categoryCollection.get($select.val());
    //if (category) {
      this.setCurrentCategory(category);
    //}
  },
  onRemoveCategoryClick: function(event) {
    event.preventDefault();
    var $categoryListItem = $(event.currentTarget).closest("li");
    $categoryListItem.remove();
    if( !this.$el.find("ul.step-category li:visible")[0] ){
      this.$el.find("ul.step-category").hide();
    }
    if( $categoryListItem.data('root-id')){
      var rootId = $categoryListItem.data('root-id');
      if(!$("ul.step-category li[data-root-id="+rootId+"]:visible").length){
        $(".select-category.category_ids > select:eq(0) option[value="+rootId+"]").removeAttr('disabled');
      }
    }
    if( this.$el.find(".category ul.step-category li.selected").length < 2){
      this.$el.find(".select-category.category_ids").show();
    }
  },
  onInputHarmonizedCodeSearch: function(event) {
    event.preventDefault();
    var search_text = $(event.currentTarget).val();
    if(search_text.length > 1) {
        var search_key = 'commodity_code';
        if(isNaN(parseInt(search_text))) {
            search_key = 'description';
            search_text = search_text.toUpperCase();
        }
        var $suggestion_holder = this.$el.find('.harmonized-code-suggestion');
        $suggestion_holder.empty();
        var commodity_code_list = this.model.get('harmonized_commodity_code_list');
        var result_list = _.filter(commodity_code_list, function(code) { return code[search_key].indexOf(search_text) != -1; } );
        for (var i in result_list) {
            if (i > 10) break;
            var code = result_list[i];
            var li_string = '<li cc-id="' + code.id + '"><b>[' + code.commodity_code + ']</b> <small>' + code.description + '</small></li>';
            $suggestion_holder.append(li_string);
        }

        $('.harmonized-code-suggestion').show();

    } else {
        $('.harmonized-code-suggestion').hide();
    }
  },
  onClickHarmonizedCodeSuggestion: function(event) {
    event.preventDefault();
    var cc_id = $(event.currentTarget).attr('cc-id');
    var commodity_code_list = this.model.get('harmonized_commodity_code_list');
    var cc = _.findWhere(commodity_code_list, {'id':parseInt(cc_id)});
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

  onSyncQuantityClick: function () {
    this.updateSyncQuantityView();
    this.syncSyncQuantityWithWarehouse();

    //if (this.$el.find("input#sync_qty_checkbox").is(':checked')) {
    FancyBackbone.App.eventAggregator.trigger("update:sync_quantity_with_warehouse", this.$el.find("input#sync_qty_checkbox").is(':checked'));
    //}
  },
  updateSyncQuantityView: function () {
    var $checkbox = this.$el.find("input#sync_qty_checkbox");
    var model = this.model;
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
  syncSyncQuantityWithWarehouse: function () {
    this.model.set('sync_quantity_with_warehouse', this.$el.find('input#sync_qty_checkbox').is(':checked'))
  },
  addCategory: function(category) {
    var $categoryListItem = this.renderSelectingCategoryListItem(category);
    $categoryListItem.prependTo(this.$el.find("ul.step-category"));
    $categoryListItem.removeClass("selecting");
    $categoryListItem.addClass("selected");
    $categoryListItem.find("a").removeClass("btn-add").addClass("btn-del");
    $categoryListItem.data('model', category);
    $categoryListItem.css("display", "block");
    if( $categoryListItem.data('root-id')){
      var rootId = $categoryListItem.data('root-id');
      if($(".select-category.category_ids > select:eq(0) option[value="+rootId+"]")[0])
        $(".select-category.category_ids > select:eq(0) option[value="+rootId+"]")[0].disabled = 'disabled';
    }
    if( this.$el.find(".category ul.step-category li.selected").length >= 2){
      this.$el.find(".select-category.category_ids").hide();
    }

  },
  onAddCategoryClick: function(event) {
    event.preventDefault();
    var $categoryListItem = $(event.currentTarget).closest("li");
    if (this.model.get("categories").get(this.currentCategory.id)) {
      window.alert("You already selected this category.");
    } else {
      this.$el.find("ul.step-category").show();
      this.addCategory(this.currentCategory);
      $categoryListItem.remove();
      this.setCurrentCategory(null);
    }
  },
  renderCategorySelect: function(theCategory) {
    var $this = this;
    var subCategories = this.categoryCollection.findSubCategories(theCategory);

    var selectView = null;
    if (subCategories.length > 0) {
      selectView = new FancyBackbone.Views.Base.SelectView({
        options: _.map(subCategories, function(subCategory) {
          return subCategory.createSelectOption();
        }),
        defaultOption: {
          value: (theCategory && theCategory.id)||'',
          display: gettext('Select Category'),
        }
      }).render();
    }

    if (theCategory) {
      var parentCategory = this.categoryCollection.findParentCategory(theCategory);
      var $parentSelects = this.renderCategorySelect(parentCategory);
      $parentSelects.eq(-1).val(theCategory.createSelectOption().value);
      if (selectView) {
        return $parentSelects.add("<span>›</span>").add(selectView.$el);
      } else {
        return $parentSelects;
      }
    } else {
      selectView.$el.find("option[value!='']").each(function(){
        if( $this.$el.find("ul.step-category li[data-root-id="+this.value+"]:visible").length ){
          this.disabled = 'disabled';
        }else{
          $(this).removeAttr('disabled');
        }
      })
      return selectView.$el;
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
      return $('<li class="selecting" style="display:none;" data-root-id="'+involvedCategories[0].get('id_str')+'">' + display + '<a href="#" class="btns-white btn-add tooltip"><i class="icon"></i><em>'+gettext('Click to add this category')+'</em></a></li>');
    } else {
      return $();
    }
  },
  setCurrentCategory: function(category) {
    this.currentCategory = category;

    var $categorySelects = this.renderCategorySelect(category);

    this.$el.find("fieldset.select-category").html($categorySelects);
    this.$el.find("ul.step-category > li.selecting").remove();

    if (category) {
      this.renderSelectingCategoryListItem(category).prependTo(this.$el.find("ul.step-category"));
      this.$el.find("fieldset.select-category").append('<button class="btns-white btns-add"><i class="icon"></i><em>Click to add this category</em></button>')
    }
  },
  syncTitle: function() {
    this.model.set('title', (this.$el.find('input[name=title]').val() || "").trim());
  },
  syncPrice: function() {
    this.model.set('price', (this.$el.find('input[name=price]').val() || "").trim().replace(/,/g, ''));
  },
  syncRetailPrice: function() {
    this.model.set('retail_price', (this.$el.find('input[name=retail-price]').val() || "").trim().replace(/,/g, ''));
  },
  syncQuantity: function() {
    if(this.$el.find('input[name=quantity]').val()){
      this.model.set('quantity', parseInt((this.$el.find('input[name=quantity]').val() || "0").trim()) + (this.model.get('num_sold')||0) + "" );  
    }else{
      this.model.set('quantity', "");
    }
    
  },
  syncSellerSKU: function() {
    this.model.set('seller_sku', (this.$el.find('input[name=seller_sku]').val() || "").trim());
  },
  syncCategories: function() {
    var productCategoryCollection = new FancyBackbone.Collections.Product.CategoryCollection(
      _.map(this.$el.find("ul.step-category li.selected"), function(selectedCategoryListItem) {
        return $(selectedCategoryListItem).data('model');
      })
    );
    this.model.set('categories', productCategoryCollection);
  },
  syncIsPreorder: function() {
      var $is_preorder = this.$el.find('#is_preorder');
	  if ($is_preorder.length > 0) {
		  this.model.set('is_preorder', $is_preorder.prop('checked') ? true : false);
	  } else {
		  this.model.set('is_preorder', null); // skip
	  }
  },
  syncHarmonizedCommodityCode: function() {
    var harmonizedCommodityCode = parseInt(this.$el.find('.harmonized-code-selection').attr('cc-id'));
    if (harmonizedCommodityCode == NaN)
        this.model.set('commodity_code_id', null);
    else
        this.model.set('commodity_code_id', harmonizedCommodityCode);
  },
  
  syncModel: function() {
    this.syncTitle();
    this.syncPrice();
    this.syncRetailPrice();
    this.syncQuantity();
    this.syncSellerSKU();
    this.syncCategories();
    this.syncIsPreorder();
    this.syncHarmonizedCommodityCode();
  },
  syncView: function() {
    this.$el.find("input[name=new_thing_id]").val(this.model.get('new_thing_id'));
    this.$el.find("input[name=new_thing_user_id]").val(this.model.get('new_thing_user_id'));
    this.$el.find("input[name=title]").val(this.model.get('title'));
    this.$el.find("input[name=price]").val(this.model.get('price'));
    this.$el.find("input[name=retail-price]").val(this.model.get('retail_price'));
    this.$el.find("input[name=quantity]").val( Math.max(0,this.model.get('quantity')-(this.model.get('num_sold')||0)));

    this.$el.find("input[name=title]").attr('readonly', this.model.is_locked_field('title'));
    if(this.model.is_locked_field('title')) this.$el.find("input[name=title]").addClass('locked');
    else this.$el.find("input[name=title]").removeClass('locked');
    this.$el.find("input[name=price]").attr('readonly', this.model.is_locked_field('price'));
    this.$el.find("input[name=retail-price]").attr('readonly', this.model.is_locked_field('price'));
    if(this.model.is_locked_field('price')) this.$el.find("input[name=price], input[name=retail-price]").addClass('locked');
    else this.$el.find("input[name=price], input[name=retail-price]").removeClass('locked');

    this.$el.find("input[name=quantity]").attr('readonly', this.model.is_locked_field('quantity'));
    if(this.model.is_locked_field('quantity')) this.$el.find("input[name=quantity]").addClass('locked');
    else this.$el.find("input[name=quantity]").removeClass('locked');

    if( this.model.get('options').length ){
      this.$el.find("input[name=quantity]").attr('readonly','true');
    }

    if (this.model.get('is_preorder')) {
      this.$el.find('input#is_preorder').prop('checked', true);
	  $('.add-preorder').show();
    } else {
	  $('.add-preorder').hide();
	}

    this.$el.find("input[name=seller_sku]").val(this.model.get('seller_sku'));
    //this.$el.find("input#sync_qty_checkbox").prop("checked", this.model.get("sync_quantity_with_warehouse"));
    this.$el.find("input#sync_qty_checkbox").prop("checked", false);
    this.updateSyncQuantityView();

    var price = this.model.get('price'), retail_price = this.model.get('retail_price');
    if (price && retail_price) {
      var discount = get_discount(retail_price, price);
      if (!isNaN(discount)) {
        this.$el.find("input[name=discount]").val(discount);
      }
    }
    var categories = this.model.get('categories');
    if (categories.length > 0){
      for (var i = categories.length-1; i >= 0; i--) {
        this.addCategory(categories.at(i));
      }
      this.$el.find("ul.step-category").show();
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
  },
  initialize: function() {
    this.categoryCollection = window.categoryCollection;
  },
  render: function() {
    this.setCurrentCategory(null);
    if (this.model.id) {
      this.syncView();
    }
    return this;
  },
});

FancyBackbone.Views.ProductLegacy.PhotoView = Backbone.View.extend({
  events: {
    'click a.delete-button': 'onDeleteButtonClick',
    'click a.alt-button': 'onAltButtonClick',
  },
  tagName: 'li',
  className: 'photo-item',
  template: FancyBackbone.Utils.loadTemplate("product_new_photo_item"),
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
  render: function() {
    this.$el.html(this.template({
      url: this.model.get('url_310'),
    }));    
    return this;
  }
});

FancyBackbone.Views.ProductLegacy.PhotoListView = Backbone.View.extend({
  events: {
    "click .data-cont .photo-list > li.add_photo": "onAddPhotoClick",
  },
  onAddPhotoClick: function(event) {
    event.preventDefault();
    if(this.model.is_locked_field('images')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    $(event.target).closest('div').find("#add-product-photo, #add-featured-photo").click();
  },
  syncModel: function() {
    var productImageCollection = new FancyBackbone.Collections.Product.ImageCollection(
      _.map(this.$el.find(".additional .photo-list .photo-item"), function(photoItemView) {
        return $(photoItemView).data('model');
      })
    );
    this.model.set('images', productImageCollection);
    
  },
  syncView: function() {
    this.model.get('images').each(this.addProductImage, this);    
  },
  createImageView: function(productImage) {
    var ret = new FancyBackbone.Views.ProductLegacy.PhotoView({model: productImage}).render();
    ret.$el.data('model', productImage);
    return ret;
  },
  addProductImage: function(productImage) {
    var imageView = this.createImageView(productImage);
    $(imageView.$el).insertBefore( this.$el.find(".additional ol.photo-list li.add_photo") );
  },
  setWaiting: function($el, waitingStatus) {
    if (waitingStatus) {
      $el.show().parent().find(".content").hide();
    } else {
      $el.hide().parent().find(".content").show();
    }
  },
  render: function() {
    var that = this, $addPhoto = this.$el.find('.additional ol.photo-list .add_photo');

    if(!that.model.is_locked_field('images')) {
      $addPhoto.parent().sortable({
        cancel : '.add_photo',
        /* items: "> li.photo-item"  */
        start : function(event, ui) {
          $addPhoto.css('opacity',0);
          setTimeout(function(){ $addPhoto.hide() }, 200);
        },
        stop : function(event, ui) {
          $addPhoto.appendTo($addPhoto.parent()).show();
          setTimeout(function(){ $addPhoto.css('opacity',1) }, 0);
        }
      });
    }
    $addPhoto.parent().disableSelection();

    if(!that.model.is_locked_field('images')) {
      this.$el.find("#add-product-photo").removeClass('locked').fileupload({
        dataType: 'json',
        url: '/sales/upload',
        start: function(e, data) {
          that.setWaiting(that.$el.find(".additional ol.photo-list li.add_photo .infscr-loading"), true);
        },
        done: function(e, data) {
          that.setWaiting(that.$el.find(".additional ol.photo-list li.add_photo .infscr-loading"),false);
          if (data.result.status_code) {
            that.addProductImage(new FancyBackbone.Models.Product.Image({
              product: that.model,
              url_310: data.result.img_url,
              original_rel_path: data.result.img_id,
              alt_text: data.result.alt_text,
            }));
          } else {
            alert("An error occurred. Please check the file and try again.");
          }
        }
      });
    }else{
      this.$el.find("#add-product-photo").addClass('locked');
    }

    if (this.model.id) {
      this.syncView();
    }
    return this;
  },
});

FancyBackbone.Views.ProductLegacy.VideoView = Backbone.View.extend({
  events: {
    "click .additional .add_video": "onAddVideoClick",
    "click .customize .add_video": "onAddVideoThumbnailClick",
    'click .additional a.btn-del': 'onDeleteVideoClick',
    'click .customize a.btn-del': 'onDeleteVideoThumbnailClick',
    'click .additional ._preview': 'onPreviewClick',
  },
  onAddVideoClick: function(event) {
    event.preventDefault();
    $(event.target).closest('p').find("#add-product-video").click();
  },
  onAddVideoThumbnailClick: function(event) {
    event.preventDefault();
    if( !this.model.get('video_id') && !this.model.get('video') ){
      alertify.alert('please upload video first');
      return;
    } 
    this.$el.find("#add-product-video-thumbnail").fileupload({url:'/rest-api/v1/seller/'+this.model.get('user').id+'/products/videos/'+(this.model.get('video_id')||this.model.get('video').id)})
    $(event.target).closest('p').find("#add-product-video-thumbnail").click();
  },
  onDeleteVideoClick: function(event) {
    var that = this;
    event.preventDefault();
    $.ajax({
      type : 'DELETE',
      url  : '/rest-api/v1/seller/'+this.model.get('user').id+'/products/videos/'+(this.model.get('video_id')||this.model.get('video').id),
      data : {},
      dataType : 'json',
      success  : function(result){
        that.$el.removeAttr('video_id');
        that.model.set('video', null);
        that.model.set('video_id', null);
        that.$el.find(".additional .add_video").show();
        that.$el.find(".additional .video-item").hide();
        that.$el.find(".customize").hide();
        that.$el.find(".customize .add_video").show();
        that.$el.find(".customize .video-item").hide();
      }
    });
  },
  onDeleteVideoThumbnailClick: function(event) {
    var that = this;
    event.preventDefault();
    $.ajax({
      type : 'PUT',
      url  : '/rest-api/v1/seller/'+this.model.get('user').id+'/products/videos/'+(this.model.get('video_id')||this.model.get('video').id),
      data : {action:'delete_thumbnail'},
      dataType : 'json',
      success  : function(result){
        that.$el.find(".customize .add_video").show();
        that.$el.find(".customize .video-item").hide();
      }
    });
  },
  onPreviewClick: function(event){
    window.popups.previewVideo.open(this.model);
  },
  syncModel: function() {
    this.model.set('video_id', this.$el.attr('video_id'));
  },
  syncView: function() {
    var that = this;
    if(this.model.get('video')){
      this.$el.attr('video_id', this.model.get('video').id );
      that.setProductVideo(this.model.get('video'));
      that.setProductVideoThumbnail(this.model.get('video'));
    }else{
      that.setProductVideo({});
      that.setProductVideoThumbnail({});
    }
  },
  getDuration:function(sec){
    var min = Math.floor(sec/60);
    var sec = sec%60;
    return (min<10?"0":"")+min+":"+(sec<10?"0":"")+sec;
  },
  setProductVideo: function(video) {
    this.$el.find(".additional .add_video, .additional .video-item, .failed").hide();
    if(!video.status){
      this.$el.find(".additional .add_video").show();
      this.$el.find(".customize").hide();
    }else if(video.status=='failed'){
      this.$el.find(".failed, .additional .add_video").show();
      this.$el.find(".customize").hide();
    }else if(video.status!='ready'){
      this.$el.find(".additional .video-item._processing").show();
      this.$el.find(".customize").show();
    }else{
      this.$el.find(".additional .video-item._preview").find("video source").attr('src', video.outputs['h264_400k'].url).end().show();
      this.$el.find(".additional .video-item._preview .time").html( this.getDuration(video.outputs['h264_400k'].duration) );
      this.$el.find(".customize").show();
    }
  },
  setProductVideoThumbnail: function(video) {
    this.$el.find(".customize .add_video, .customize .video-item").hide();
    if(video.thumbnail){
      this.$el.find(".customize .video-item").find("img").css('background-image','url('+video.thumbnail+')').end().show();
    }else{
      this.$el.find(".customize .add_video").show();
    }
  },
  setWaiting: function($el, waitingStatus) {
    if (waitingStatus) {
      $el.css('display','block').parent().find(".content").hide();
    } else {
      $el.hide().parent().find(".content").show();
    }
  },
  render: function() {
    var that = this;

    this.$el.find("#add-product-video").fileupload({
      type: (this.model.id?'PUT':'POST'),
      dataType: 'json',
      url: '/rest-api/v1/seller/'+this.model.get('user').id+'/products/'+(this.model.id||'new')+'/video',
      start: function(e, data) {
        that.setWaiting(that.$el.find(".additional .add_video .infscr-loading"), true);
      },
      fail: function(e, data){
        alert(data.error||"An error occurred. Please check the file and try again.");
      },
      done: function(e, data) {
        that.setWaiting(that.$el.find(".additional .add_video .infscr-loading"),false);
        if (data.result.status) {
          that.model.set('video_id', data.result.id);
          that.$el.attr('video_id', data.result.id);
          that.setProductVideo(data.result);
        } else {
          alert(data.error||"An error occurred. Please check the file and try again.");
        }
      }
    });

    this.$el.find("#add-product-video-thumbnail").fileupload({
      type: 'PUT',
      dataType: 'json',
      url: '/rest-api/v1/seller/'+this.model.get('user').id+'/products/videos/'+this.model.get('video_id'),
      start: function(e, data) {
        that.setWaiting(that.$el.find(".customize .add_video .infscr-loading"), true);
      },
      done: function(e, data) {
        that.setWaiting(that.$el.find(".customize .add_video .infscr-loading"),false);
        if (data.result.thumbnail) {
          that.$el.attr('video_id', data.result.id);
          that.setProductVideoThumbnail(data.result);
        } else {
          alert(data.error||"An error occurred. Please check the file and try again.");
        }
      }
    });

    if (this.model.id) {
      this.syncView();
    }
    return this;
  },
});


FancyBackbone.Views.ProductLegacy.DetailView = Backbone.View.extend({
  events: {
    'change input.charge-taxes-button': 'onChangeChargeTaxesButton',
    'change select[name=brand]': 'onChangeBrand'
  },  
  initialize: function() {
    this.countryCollection = window.countryCollection;
    $(".popup.edit_brand").on('create:brand', $.proxy(this.onCreateBrand,this));
  },
  onCreateBrand: function(e, brand){
    var $sel = this.$el.find("select[name=brand]");
    var isExists = false;
    $sel.find("option").each(function(){
      if( $(this).val() == brand) isExists = true;
    })
    if( !isExists ){
      $sel.find("option[disabled]").before('<option value="'+brand.replace('"','&quot;')+'">'+brand+"</option>");
    }
    $sel.val(brand);
  },
  onChangeBrand: function(e){
    if( $(e.target).val() == "add" ){
      $.dialog('edit_brand').open();
    }
  },
  onChangeChargeTaxesButton: function() {
    var $chargeTaxButton = this.$el.find("input.charge-taxes-button");
    var chargeTax = $chargeTaxButton.prop("checked");
    if (chargeTax) {
      this.$el.find(".tax-cloud-view").show();
    } else {
      this.$el.find(".tax-cloud-view").hide();
      this.$el.find("#ticComplete .navlink").click();
    }
  },
  syncColors: function() {
    this.model.set('colors', this.$el.find("select[name=colors]").val() || []);
  },
  syncBrand: function() { this.model.set('brand', (this.$el.find('select[name=brand]').val() || "").trim()); },
  syncWeight: function() { this.model.set('weight', (this.$el.find('input[name=weight]').val() || "").trim()); },
  syncWidth: function() { this.model.set('width', (this.$el.find('input[name=width]').val() || "").trim()); },
  syncLength: function() { this.model.set('length', (this.$el.find('input[name=length]').val() || "").trim()); },
  syncHeight: function() { this.model.set('height', (this.$el.find('input[name=height]').val() || "").trim()); },
  syncOriginCountry: function() { this.model.set('origin_country', (this.$el.find('select.select-country').val() || "").trim()); },
  syncPersonalizable: function() { this.model.set('personalizable', this.$el.find('input[name=personalizable]').is(":checked")); },
  syncDescription: function() {
    var $desc = tinyMCE.get('product-description');
    var description = ($desc) ? $desc.getContent() : null;
    this.model.set('description', description);
  },
  syncTax: function() {
    var $chargeTaxButton = this.$el.find("input.charge-taxes-button");
    var chargeTax = $chargeTaxButton.prop("checked");
    if (chargeTax) {
      if (this.$el.find(".tax-cloud-view input").length) {
        this.model.set('tax_code', this.$el.find(".tax-cloud-view input").val().trim());
      } else if (this.$el.find(".tax-cloud-view select").length){
        this.model.set('tax_code', this.$el.find(".tax-cloud-view select").val().trim());
      }
    } else {
      this.model.set('tax_code', null);
    }
  },
  syncModel: function() {
    this.syncColors();
    this.syncWeight();
    this.syncWidth();
    this.syncLength();
    this.syncHeight();
    this.syncOriginCountry();
    this.syncPersonalizable();
    this.syncDescription();
    this.syncTax();
    this.syncBrand();
  },
  renderDescriptionTextArea: function() {
    var dfd = $.Deferred();
    this.descriptEditorInitPromise = dfd.promise();
    tinyMCE.init({
      mode : 'exact',
      elements : 'product-description,description',
	  content_css : '/_ui/css/seller_brand_content.css',
      theme : 'advanced',
      theme_advanced_toolbar_location : 'top',
      theme_advanced_toolbar_align : 'left',
      theme_advanced_buttons1 : 'bold,italic,underline,|,bullist,numlist,|,justifyleft,justifycenter,justifyright,fontsizeselect,|,link,unlink,|,code',
      theme_advanced_buttons2 : '',
      theme_advanced_buttons3 : '',
      theme_advanced_resizing : true,
      theme_advanced_font_sizes : '10px,12px,14px,16px,24px',
      theme_advanced_more_colors : false,
      browser_spellcheck : true,
      gecko_spellcheck : true,
	  plugins : 'paste',
	  paste_text_sticky : true,
      init_instance_callback : function() { dfd.resolve(); },
	  setup : function(editor) {
		  editor.onInit.add(function(ed){ ed.pasteAsPlainText = true; });
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
  renderCountriesSelect: function() {
    var selectView = new FancyBackbone.Views.Base.SelectView({
      el: this.$el.find("select.select-country"),
      options: _.map(this.countryCollection.models, function(country) {
        return country.createSelectOption();
      }),
    }).render();
    selectView.selectValue(this.countryCollection.currentCountryCode);
  },
  syncView: function() {
    var that = this;
    this.descriptEditorInitPromise.done(function() {
      tinyMCE.get('product-description').setContent(that.model.get("description"));
      if(that.model.is_locked_field('description')) {
        tinyMCE.dom.Event.add(tinyMCE.activeEditor.getBody(), "click", function(e) {
            alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
        });
        tinyMCE.activeEditor.getBody().setAttribute('contenteditable', !that.model.is_locked_field('description'));
      }
    });

    
    this.$el.find("p.color select[name=colors]").val(this.model.get('colors'));
    this.$el.find("input[name='weight']").val(this.model.get('weight'));
    this.$el.find("input[name='width']").val(this.model.get('width'));
    this.$el.find("input[name='length']").val(this.model.get('length'));
    this.$el.find("input[name='height']").val(this.model.get('height'));
    this.$el.find('select.select-country').val(this.model.get('origin_country'));

    this.$el.find("input[name='weight']").attr('readonly',this.model.is_locked_field('weight'));
    if(this.model.is_locked_field('weight')) this.$el.find("input[name='weight']").addClass('locked');
    else this.$el.find("input[name='weight']").removeClass('locked');

    if(this.model.get('brand'))
      this.$el.find("select[name='brand']").val(this.model.get('brand'));
    this.$el.find("input[name='personalizable']").prop('checked', this.model.get('personalizable'));

    if (this.model.get('tax_code')) {
      this.$el.find("input.charge-taxes-button").prop("checked", true);
      this.$el.find(".tax-cloud-view").show();
    }
  },
  render: function() {
    this.renderDescriptionTextArea();
    this.renderCountriesSelect();
    if (this.model.id) {
      this.syncView();
    }
    this.$el.find("p.color select[name=colors]").dropdownchecklist({width:300});
    this.$el.find("div.qty select[name=colors]").dropdownchecklist({width:85});
    return this;
  },
});


FancyBackbone.Views.ProductLegacy.OptionView = Backbone.View.extend({
  events: {
    'click button.btn-add': 'onAddOptionClick',
    'click .multiple-option-frm a.btn-del': 'onRemoveOptionClick',
    'click .multiple-option-frm a.btn-edit': 'onEditOptionClick',
    'change .multiple-option-frm .qty': 'onOptionQuantityChange',
    'click .multiple-option-frm input[name=marked_soldout]': 'onOptionMarkedSoldoutChange'
  },  
  initialize: function(options) {
    this.listenTo(FancyBackbone.App.eventAggregator,'save:saleitemoption', _.bind(this.onSaveOptionClick, this));
    this.listenTo(FancyBackbone.App.eventAggregator,'update:sync_quantity_with_warehouse', _.bind(this.onUpdateSyncQuantityWithWarehouse, this));
    this.is_admin = options.is_admin;
  },
  onAddOptionClick: function(event) {
    event.preventDefault();
    if(this.model.is_locked_field('options')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    if (window.popups && window.popups.viewAddSaleItemOptions){
      window.view.syncModel();
      window.popups.viewAddSaleItemOptions.render(null, this.model, this.is_admin);
    }
  },
  onEditOptionClick: function(event) {
    event.preventDefault();
    if(this.model.is_locked_field('options')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    var $row = $(event.currentTarget).closest("tr");
    var option = $row.data("model");
    window.view.syncModel();
    window.popups.viewAddSaleItemOptions.render(option, this.model, this.is_admin);
  },
  onRemoveOptionClick: function(event) {
    event.preventDefault();
    if(this.model.is_locked_field('options')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    var $row = $(event.currentTarget).closest("tr");
    var option = $row.data("model");
    this.model.get("options").remove(option);
    $row.remove();
    // make options sortable 
    try{
      this.$el.find(".multiple-option-frm table tbody").sortable('destroy');  
    }catch(e){}
    
    if(this.model.get('options').length > 1){
      this.$el.find("a.btn-reposition").removeClass("disabled");
      this.$el.find(".multiple-option-frm table tbody").sortable({ handle: "a.btn-reposition", containment: "parent"})
    }else{
      this.$el.find("a.btn-reposition").addClass("disabled");
    }

    this.updateOptionAddButton();
  },
  onOptionQuantityChange: function(event){
    var qty = 0;
    this.model.get('options').each(function(v){
      var tr = null;
      if (v.get('id')) {
        tr = this.$el.find(".multiple-option-frm table tbody tr[id='"+v.get('id')+"']");
      } else if (v.get('tid')) {
        tr = this.$el.find(".multiple-option-frm table tbody tr[tid='"+v.get('tid').replace("'", "\\'")+"']");
      }
      if(tr){
        qty += (parseInt(tr.find("input.qty").val())||0) ;
      }
    },this);
    this.$el.find("input[name=quantity]").val(qty);
  },  
  onOptionMarkedSoldoutChange: function(event){
    var checked = $(event.target).is(":checked");
    var $tr = $(event.target).closest("tr");
    if(checked){
      $tr.find("input.qty").attr('disabled','disabled');
    }else{
      $tr.find("input.qty").removeAttr('disabled');
    }
    $tr.data("model").set('marked_soldout', checked);
  },
  getEditingRow: function() {
    return this.$el.find("div.multiple-option-frm");
  },
  getNullCheckedValue: function(val, length_check) {
    if (val == null || val == 'None') {
        return '-';
    }
    if (length_check && val.length <= 0) {
        return '-';
    }
    return val;
  },
  updateOptionAddButton: function() { 
    if(this.$el.find(".multiple-option-frm table tbody tr").length > 0) { 
      this.$el.find(".multiple-option-frm").show(); 
      this.$el.find(".multiple-option-frm.blank").hide(); 
      this.$el.find("input[name=quantity]").attr('readonly','true');
    } else { 
      this.$el.find(".multiple-option-frm").hide(); 
      this.$el.find(".multiple-option-frm.blank").show(); 
      if(!this.model.is_locked_field('quantity')) {
        this.$el.find("input[name=quantity]").removeAttr('readonly').removeClass('locked');
      }else{
        this.$el.find("input[name=quantity]").addClass('locked');
      }
    }
  }, 
  createOption: function() { 
    var images = [];  
    $('div.popup.add-option div.add-photos ol.photo-list li.photo-item').each( function() { 
      var imageDict = {url_310:$(this).attr("url_310")}
      if ($(this).attr("original_rel_path") !== undefined)
        imageDict['original_rel_path'] = $(this).attr("original_rel_path") 
      if ($(this).attr("id_str") !== undefined) 
        imageDict['id_str'] = $(this).attr("id_str")
      images.push(imageDict)
    }); 

    var quantity = $('div.popup.add-option div.ltxt p.qty input[type="text"]').val().trim();
    if (quantity === '') {
      quantity = null;
    }
  
    return new FancyBackbone.Models.Product.Option({
        name: $('div.popup.add-option div.ltxt p.name input').val().trim(),
        seller_sku: $('div.popup.add-option div.ltxt p.sku input').val().trim(),
        price: $('div.popup.add-option div.ltxt p.price input').val().trim().replace(/,/g, ''),
        retail_price: $('div.popup.add-option div.ltxt p.retail input').val().trim().replace(/,/g, ''),
        quantity: quantity,
        //sync_quantity_with_warehouse: $('div.popup.add-option div.ltxt p.qty input#sync_qty_checkbox').is(':checked'),
        sync_quantity_with_warehouse: false,
        color: $('div.popup.add-option div.ltxt p.color input').val().trim(),
        prod_length: $('div.popup.add-option div.ltxt p.length input').val().trim(),
        prod_height: $('div.popup.add-option div.ltxt p.height input').val().trim(),
        prod_width: $('div.popup.add-option div.ltxt p.width input').val().trim(),
        prod_weight: $('div.popup.add-option div.ltxt p.weight input').val().trim(),
        unit_cost: $('div.popup.add-option div.ltxt p.unit-cost input').val().trim().replace(/,/g, ''),
        tid: $('div.popup.add-option div.ltxt p.name input').val().trim(),
        marked_soldout: $('div.popup.add-option div.btn-area input').prop('checked'),
        images: images,
    });
  },
  createOptionRow: function(option) { 
    var optionView = new FancyBackbone.Views.ProductLegacy.DetailViewOption({
      data: option
    });
    var $row = optionView.render().$el;
    $row.data('model', option); 
    if (option.get('id') != null)
      $row.attr('id', option.get('id')); 
    else
      $row.attr('tid', option.get('tid')); 

    this.$el.find(".multiple-option-frm table tbody").append($row); 
    // make options sortable 
    try{
      this.$el.find(".multiple-option-frm table tbody").sortable('destroy');  
    }catch(e){}

    if(this.model.is_locked_field('options')) {
      $row.find('input[type="text"]').attr('readonly',true).addClass('locked');
    }else{
      $row.find('input[type="text"]').removeClass('locked');
    }

    if(this.model.get('options').length > 1){
      if(this.model.is_locked_field('options')) {
        this.$el.find("a.btn-reposition").addClass("disabled").addClass('locked');
      } else {
        this.$el.find("a.btn-reposition").removeClass("disabled").removeClass('locked');
        this.$el.find(".multiple-option-frm table tbody").sortable({ handle: "a.btn-reposition", containment: "parent"})
      }
    }else{
      this.$el.find("a.btn-reposition").addClass("disabled");
    }
    this.updateOptionAddButton();
  },
  updateOption: function(option_row, option_id, temp_id) {
    var option = this.createOption();
    if (temp_id != null)
        option.set('tid', temp_id)
    if (option_id != null)
        option.set('id', option_id);

    $(option_row).find('input.name').val(option.get('name'));
    $(option_row).find('input.sku').val(this.getNullCheckedValue(option.get('seller_sku'), true));

    $(option_row).find('input.qty').val(this.getNullCheckedValue(option.get('quantity'), true));
    $(option_row).find('input.price').val(this.getNullCheckedValue(option.get('price'), true));
    $(option_row).find('li.retail-price span').text('$' + this.getNullCheckedValue(option.get('retail_price'), true));
    $(option_row).find('li.weight span').text(this.getNullCheckedValue(option.get('prod_weight'), true));
    $(option_row).find('li.dimensions span').text(this.getNullCheckedValue(option.get('prod_length'), true) + ' x ' + this.getNullCheckedValue(option.get('prod_height'), true) + ' x ' + this.getNullCheckedValue(option.get('prod_width'), true));
    //update images 
    $(option_row).find('li.thing').empty();
    var images = option.get('images');
    for (var i=0; i < images.length; i++) { 
      $(option_row).find('li.thing').append('<img src="/_ui/images/common/blank.gif" style="background-image:url(' + "'" + images[i].url_310 + "'" + ')">');
    }
    $(option_row).data("model", option);

    var new_option_id = null;
    var current_option_id = null;
    if (option.get('id') != null)
        new_option_id = option.get('id');
    else
        new_option_id = option.get('tid');
    var option_models = this.model.get('options').models;
    for (var i = 0 ; i < option_models.length; i++) {
        if (option_models[i].get('id') == null)
            current_option_id = option_models[i].get('tid');
        else
            current_option_id = option_models[i].get('id');

        if (current_option_id == new_option_id) {
            option_models[i].set('name', option.get('name'));
            option_models[i].set('seller_sku', option.get('seller_sku'));
            option_models[i].set('marked_soldout', option.get('marked_soldout'));

            option_models[i].set('quantity', parseInt(option.get('quantity'))+(parseInt(option_models[i].get('num_sold'))||0));
            option_models[i].set('sync_quantity_with_warehouse', option.get('sync_quantity_with_warehouse'));
            option_models[i].set('price', option.get('price'));
            option_models[i].set('retail_price', option.get('retail_price'));
            option_models[i].set('color', option.get('color'));

            option_models[i].set('prod_length', option.get('prod_length'));
            option_models[i].set('prod_width', option.get('prod_width'));
            option_models[i].set('prod_weight', option.get('prod_weight'));
            option_models[i].set('prod_height', option.get('prod_height'));

            option_models[i].set('unit_cost', option.get('unit_cost'));
            option_models[i].set('images', option.get('images')); 
        }
    }
  },
  onSaveOptionClick: function(param) {
    var isEditing = false;
    var options = this.$el.find('div.multiple-option-frm table tbody tr');
    var existing_id = null;
    var temp_id = null;
    
    if (param == null) { 
      param = this.createOption(); 
    }

    if (param != null) {
        if (param.get('id'))
            existing_id = param.get('id')
        if (param.get('tid'))
            temp_id = param.get('tid')
    }
    for (var i = 0; i < options.length; i++) {
        if(existing_id != null) {
            var option_id = $(options[i]).attr('id');
            if (option_id == existing_id) {
                isEditing = true;
                if(param.get('marked_soldout')){
                  $(options[i]).find('input[name=marked_soldout]').attr('checked','checked');
                  $(options[i]).find('input.qty').attr('disabled','disabled');
                }else{
                  $(options[i]).find('input[name=marked_soldout]').removeAttr('checked');
                  $(options[i]).find('input.qty').removeAttr('disabled');
                }
                this.updateOption(options[i], option_id, null);
                break;
            }
        }

        if(temp_id != null) {
           var tid = $(options[i]).attr('tid');
           if (tid == temp_id) {
               isEditing = true;
               if(param.attributes['marked_soldout']){
                 $(options[i]).find('input[name=marked_soldout]').attr('checked','checked');
                 $(options[i]).find('input.qty').attr('disabled','disabled');
               }else{
                 $(options[i]).find('input[name=marked_soldout]').removeAttr('checked');
                 $(options[i]).find('input.qty').removeAttr('disabled');
               }
               
               this.updateOption(options[i], null, temp_id);
               break;
           }
        }
    }

    if (!isEditing) {
        var option = this.createOption();
        this.model.get("options").add(option);
        this.createOptionRow(option);
    }
    this.onOptionQuantityChange();    
  },
  onUpdateSyncQuantityWithWarehouse: function (saleItemSyncQuantityWithWarehouseChecked) {
    var $options = this.$('div.multiple-option-frm table tbody tr'),
        i, optionModel;

    for (i = 0; i < $options.length; i++) {
      optionModel = $($options[i]).data("model");

      if (optionModel) {
        optionModel.set('sync_quantity_with_warehouse', saleItemSyncQuantityWithWarehouseChecked);
      }
    }
  },
  
  syncView: function() {
    this.model.get('options').each(this.createOptionRow, this);

  },
  syncModel: function() {
    
    this.model.get('options').each(function(v){
      var tr = this.$el.find(".multiple-option-frm table tbody tr[id='"+(v.get('id')||v.get('tid').replace("'", "\\'"))+"']");
      if(tr[0]){
        v.set('position', tr.prevAll('tr').length+1);
        v.set('quantity', ((parseInt(tr.find("input.qty").val())||0) + (parseInt(v.get('num_sold')))||0)+"") ;
        v.set('name', tr.find("input.name").val() ) ;
        v.set('seller_sku', this.getNullCheckedValue(tr.find("input.sku").val(),true) ) ;
        v.set('price', this.getNullCheckedValue(tr.find("input.price").val()) ) ;
      }
    },this);
  }, 
  render: function() {
    if (this.model.id) {
      this.syncView();
    }
    return this;
  },
});

FancyBackbone.Views.ProductLegacy.DetailViewOption = Backbone.View.extend({
  tagName: 'tr',
  template: FancyBackbone.Utils.loadTemplate("product_option_item_add"),
  initialize: function(options) {
    this.option = options.data;
  },
  render: function() {
    this.$el.html(this.template(this.option.attributes)); 
    return this;
  },
});

FancyBackbone.Views.ProductLegacy.CollectionsView = Backbone.View.extend({
  events: {
    'change fieldset.select-category select': 'onChangeCollectionSelect',
    'click button.btns-add': 'onClickAddButton', 
    'click .step-category a.btn-del': 'onClickDeleteCollection',
    'click a.btn-add': 'onClickAddCollection', 
  },
  onClickAddCollection: function(event) {
    event.preventDefault(); 
    var that = this;
    $.post("/merchant/products/collections/popup-create.html", {} ,function(html){
		$('.popup.edit_mylist').find('#edit_title').hide();
		$('.popup.edit_mylist').find('#create_title').show();
		$('.popup.edit_mylist').find('.fill').empty();
		$('.popup.edit_mylist').find('.fill').append(html);
		var $list_popup = $.dialog('edit_mylist');
		$list_popup.open(); 
		$list_popup.$obj.on('create:collection', function(event, c_id, c_name){
			var has_cid = _.find(that.$el.find('fieldset.select-category select option'), function(opt) { return $(opt).attr('value') == c_id; });
			if (has_cid == undefined) 
				that.addExistingCollection(c_id, c_name); 
		});
    }, "html");
      return false;  
  },
  getCollectionWithID: function(c_id) { 
    var collections = this.model.get('seller_collections'); 
    return _.find(collections, function(collection){ return collection.id == c_id; }); 
  }, 
  addCollection: function(c_title, c_id) {
    var found = false; 
    this.$el.find("ul.step-category li").each(function() { if($(this).attr('value') == c_id) { found = true; return false; }  }); 
    if (found) return false; 

    this.$el.find("ul.step-category").append('<li class="selected" value="' +c_id+ '">' +c_title+ '<a href="#" class="btns-white tooltip btn-del"><i class="icon"></i></a></li>');
    this.syncModel(); 
  }, 
  syncView: function() { 
    var collections = this.model.get('collection_ids'); 
    for (index in collections) {
      var collection = this.getCollectionWithID(collections[index]); 
      if (collection == undefined ) continue; 
      this.addCollection(collection.title, collection.id); 
      this.$el.find("ul.step-category").show();
    }
  },
  syncModel: function() { 
    var id_list = []; 
    this.$el.find("ul.step-category li").each(function() { 
      id_list.push($(this).attr('value'));
    }); 
    this.model.set('collection_ids', id_list); 
  },
  onChangeCollectionSelect: function() { 
    var $selected_option = this.$el.find("fieldset.select-category select option:selected");
    if ($selected_option.val() == '-1') { 
      this.$el.find("button.btns-add").hide(); 
      this.$el.find("a.btn-add").show(); 
    } else if ($selected_option.val() == 'add') {
      this.$el.find("button.btns-add").hide(); 
      this.$el.find("a.btn-add").hide(); 
      $('.new-product .add-collection .select-category .btn-add').click();
	  }else { 
      this.$el.find("button.btns-add").show(); 
      this.$el.find("a.btn-add").hide(); 
    }
  }, 
  onClickAddButton: function() { 
    var $selected_option = this.$el.find("fieldset.select-category select option:selected");
    this.addCollection($selected_option.text(), $selected_option.val());
    this.$el.find("ul.step-category").show();
  }, 
  onClickDeleteCollection: function(e) { 
    e.preventDefault();
    $(e.currentTarget).closest('li').remove();
    this.syncModel(); 
    if( !this.$el.find("ul.step-category li:visible").length ){
      this.$el.find("ul.step-category").hide();
    }
  }, 
  addExistingCollection: function(c_id, c_name) {
    this.$el.find('fieldset.select-category select').append('<option value="' + c_id + '">'+ c_name + '</option>')
  },
  render: function() { 
    var self = this;
    if (this.model.get('seller_collections')) {
      var that = this ;
      _.each( this.model.get('seller_collections'), function(collection) {
        that.addExistingCollection(collection.id, collection.title); 
      });
    }
    if (this.model.id) {
      this.syncView();
    } 
    return this;
  },
});

FancyBackbone.Views.ProductLegacy.TagsView = Backbone.View.extend({
  events: {
    'keydown .multi-text input': 'onTagDelete',
    'keypress .multi-text input': 'onTagEntered',
    'click .multi-text.frm a.btn-del': 'onClickDeleteTag',
    'click .multi-text.list span': 'onClickExistingTag',
  },  
  onTagDelete: function(event) {
    if (event.keyCode != 8) return;
    if(this.model.is_locked_field('keywords')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }

    if( $(event.currentTarget).val() ) return;
    event.preventDefault();
    $(event.currentTarget).prev('span').remove();

    this.updateExistingTagButtons(); 
    return false;
  },
  onTagEntered: function(event) {
    if (event.keyCode != 13 && event.keyCode != 44 ) return;
    if(this.model.is_locked_field('keywords')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
   
    event.preventDefault();
    var tag = $('.tags input.add').val();
    this.addTag(tag); 
    $('.tags input.add').focus();
  },
  onClickDeleteTag: function(e) {
    e.preventDefault();
    if(this.model.is_locked_field('keywords')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }

    $(e.currentTarget).closest('span').remove();

    this.updateExistingTagButtons(); 
    return false;
  },
  onClickExistingTag: function(e) { 
    e.preventDefault(); 
    if(this.model.is_locked_field('keywords')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    var aTag = $(e.currentTarget).attr('name');
    this.addTag(aTag); 
    this.updateExistingTagButtons(); 
  },
  getSelectedTags: function() { 
    var keywords = [];
    _.each( this.$el.find(".multi-text.frm span"), function(tag) {
      keywords.push($(tag).attr('name'));
    });
    return keywords; 
  },
  updateExistingTagButtons: function() { 
    var that = this; 
    var keywords = this.getSelectedTags(); 
    _.each(this.$el.find('.multi-text.list span'), function(pre_tag) { 
      var aTag = $(pre_tag).attr('name'); 
      if(_.find(keywords, function(keyword) { return keyword == aTag }) != undefined) { 
        $(pre_tag).addClass('selected'); 
      } else { 
        $(pre_tag).removeClass('selected'); 
      }
    }); 
  }, 
  addTag: function(tag) { 
    if (!tag || tag === '') return;
    var keywords = this.getSelectedTags(); 
    if(_.find(keywords, function(keyword) { return keyword == tag }) != undefined) { 
      return false; 
    }
    if(this.model.is_locked_field('keywords')){
      alertify.alert('This field has been locked by Fancy. Please contact us to edit this.');
      return;
    }
    var $span = $('<span><a href="#" class="btn-del"><i class="icon"></i></a></span>');
    $span.attr("name", tag);
    $span.prepend(document.createTextNode(tag));
    this.$el.find('.multi-text.frm').append($span);
    var input = this.$el.find('.multi-text.frm input.add'); 
    input.val(''); 
    this.$el.find('.multi-text.frm').append(input); 

    this.updateExistingTagButtons(); 
  },
  addPreviousTag: function(tag) { 
    var $span = $('<span><a href="#" class="btn-del"><i class="icon"></i></a></span>');
    $span.attr("name", tag);
    $span.prepend(document.createTextNode(tag));
    this.$el.find('.multi-text.list').append($span); 
  }, 
  syncModel: function() {
    var keywords = this.getSelectedTags(); 
    this.model.set('keywords', keywords.join(','));
  },
  syncView: function(e) { 
    var that = this;
    var keywords = this.model.get('keywords').split(",");
    _.each(keywords, function(tag) { 
      that.addTag(tag); 
    });
  },
  render: function() { 
      var that = this; 
    if(this.model.get('seller_tags') && this.model.get('seller_tags').length) { 
      var seller_tags = this.model.get('seller_tags');
      if( seller_tags.length > 10){
        seller_tags = seller_tags.slice(0,10);
      } 
      
      _.each(seller_tags, function(tag) { 
        that.addPreviousTag(tag); 
      }); 

      this.$el.find("small.comment, .multi-text.list").show();
    }else{
      this.$el.find("small.comment, .multi-text.list").hide();
    }

    if(this.model.get('keywords')) { 
      this.syncView(); 
    }
    if(this.model.is_locked_field('keywords')) {
      this.$el.find("input").attr('readonly', true).addClass('locked');
    }else{
      this.$el.find("input").removeClass('locked');
    }
   
    return this; 
  },
}); 

FancyBackbone.Views.ProductLegacy.SaleDurationView = Backbone.View.extend({
  events: {
    'click a.add-end-date': 'onAddEndDateClick',
    'click a.remove-end-date': 'onRemoveEndDateClick',
  },
  toggleEndDateOption: function(endDateOption) {
    if (endDateOption === undefined) {
      endDateOption = !this.hasEndDate;
    }
    if (endDateOption) {
      this.$el.find("a.add-end-date").removeClass("add-end-date").addClass("remove-end-date").text("Remove end date");
      this.$el.find(".date-field .end-date").css('display','inline-block');
    } else {
      this.$el.find("a.remove-end-date").removeClass("remove-end-date").addClass("add-end-date").text("Add end date");
      this.$el.find(".date-field .end-date").hide();
    }
    this.hasEndDate = endDateOption;
  },
  onAddEndDateClick: function(event) {
    event.preventDefault();
    var start_date = this.$el.find(".date-field .start-date .date").val();
    var min_date = moment(start_date, "YYYY-MM-DD")
    min_date.date(min_date.date()+1);
    min_date.month(min_date.month()+6); 
    var date_string = min_date.format("YYYY-MM-DD")
    this.$el.find(".date-field .end-date .date").val(date_string)
    this.toggleEndDateOption(true);
  },
  onRemoveEndDateClick: function(event) {
    event.preventDefault();
    this.toggleEndDateOption(false);
  },
  syncModel: function() {
    this.model.set('start_date', moment(this.$el.find(".date-field .start-date .date").val(), "YYYY-MM-DD").format("MM/DD/YYYY") );
    if (this.hasEndDate) {
		this.model.set('end_date', moment(this.$el.find(".date-field .end-date .date").val(), "YYYY-MM-DD").format("MM/DD/YYYY") );
    } else {
      this.model.set('end_date', null);
    }
    this.model.set('soldout_after_expired', this.$el.find('.soldout-after-expired').prop('checked'));
  },
  initialize: function(options) {
    this.hasEndDate = false;
    this.is_admin = options.is_admin;
  },
  syncView: function() {
    var self = this;
    if (this.model.get('start_date')) {
      this.$el.find(".date-field .start-date .date").val(moment(this.model.get('start_date')).format("YYYY-MM-DD"));
    }
    if (this.model.get('end_date')) {
      this.toggleEndDateOption();
      this.$el.find(".date-field .end-date .date").val(moment(this.model.get('end_date')).format("YYYY-MM-DD"));
      this.$el.show();
    }

    if (this.model.get('soldout_after_expired')) {
      this.$el.find('.soldout-after-expired').prop('checked', this.model.get('soldout_after_expired'));
    }
    if( this.is_admin || window.seller.get('username')=='fancymerchant'){
      this.$el.show();
    }

  },
  render: function() {
    var self = this;
    if (this.model.id) {
      this.syncView();
    } else {
      this.$el.find(".date-field .start-date .date").val(moment().format("YYYY-MM-DD"));
      if( this.is_admin || window.seller.get('username')=='fancymerchant'){
        this.$el.show();
      }
    }
    return this;
  },
});

FancyBackbone.Views.ProductLegacy.ShippingView = Backbone.View.extend({
  events: {
    'change select.tiered-rates': 'onShippingRateSelectChange',
    'click .view_rate': 'showShippingRatesPopup',
    'change select[name="shipping_destination"]': 'onChangeShipInternationally',
    'change select[name="shipping-type"]': 'onChangeShippingType',
    'change .policy select[name=return_policy]': 'onSelectedReturnPolicyChange',
    'change .policy select[name=exchange_policy]': 'onSelectedExchangePolicyChange',
    'click .policy input#use_exchange': 'onClickUseExchangeCheckBox',
    'keyup .policy .return_policy_day input[name="custom_return_policy_days"]': 'onKeyupCustomReturnPolicyDays',
    'keyup .policy .use_exchange .exchange_policy_day input[name="custom_exchange_policy_days"]': 'onKeyupCustomExchangePolicyDays',
    'change .free_charge select': 'onChangeFreeCharge',
    'click .policy button.btn-reset': 'onClickBtnReset',
    'click .ships_from .change-default': 'onClickChangeDefault',
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
  initialize: function() {
    this.shippingRateGroupCollection = window.shippingRateGroupCollection;
    var that = this;
    _.each(this.ui, function (selector, uiElement) {
      that.ui[uiElement] = that.$(selector);
    });
    this.policyJqXHR = null;
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
  showShippingRatesPopup: function() { 
    $.dialog('show_rate').open(); 
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
          that.ui.$returnExchangePolicyDesc.val(response.return_exchange_policy_description);
          that.ui.$returnExchangePolicyDesc.attr('default-policy-desc', response.return_exchange_policy_description);
        } else if (response.status_code != undefined && response.status_code == 0) {
          if (response.message != undefined) {
            that.ui.$returnExchangePolicyDesc.val(originalPolicyDesc);
            alert(response.message);
          }
        }

        that.ui.$returnExchangePolicyDesc.prop('disabled', false);
      }, "json");
  },
  onClickBtnReset: function (e) {
    var defaultPolicyDesc = this.ui.$returnExchangePolicyDesc.attr('default-policy-desc');
    this.ui.$returnExchangePolicyDesc.val(defaultPolicyDesc);
  },
  onClickChangeDefault: function(e) {
    e.preventDefault();
    window.open(
      '/merchant/settings/shipping/preferences',
      '_blank' // <- This is what makes it open in a new window.
    );
  },
  onChangeShipInternationally: function() {
    //var $intl_ship = this.$el.find("input#international_shipping");
    //var international_shipping = $intl_ship.prop("checked");
  },
  onChangeFreeCharge: function(){
    var free_charge = this.$el.find('.free_charge select').val()==1;
    if(free_charge){
      this.$el.find('select[name="shipping-type"]').val(1);
      this.$el.find(".shipping_rate, .shipping_rate .view_rate, .show_rate").hide();
    }else{
      this.$el.find(".shipping_rate").show();
      //this.$el.find(".shipping_rate .view_rate").show();
      if( this.$el.find('select[name="shipping-type"]').val()!=0 ){
        this.$el.find(".show_rate").show();
        //this.$el.find(".shipping_rate .view_rate").hide();
      }
    }

  },
  onChangeShippingType: function() {
    var $selected_type = this.$el.find('select[name="shipping-type"]');
    var selected_type = $selected_type.val();
    
    this.$el.find(".multiple-option-frm").removeClass('custom-shipping').removeClass('weight-shipping').removeClass('price-shipping');
    this.$el.find(".multiple-option-frm table colgroup").empty(); 
    if (selected_type == '1') { // Tiered
        this.$el.find(".multiple-option-frm").addClass('price-shipping');
        this.$el.find(".multiple-option-frm table colgroup").append('<col width="165"><col width="*">');
        this.$el.find(".multiple-option-frm table .custom-shipping-field").hide();
        this.$el.find(".shipping_rate .view_rate").hide();
        this.$el.find(".show_rate").show();
        this.renderShippingRateGroupsSelect();
        this.onShippingRateSelectChange();
    }
    else if(selected_type == '0'){ // Custom 
        this.$el.find(".multiple-option-frm").addClass('custom-shipping');
        this.$el.find(".multiple-option-frm table colgroup").append('<col width="165"><col width="110"><col width="110"><col width="*">');
        this.$el.find(".multiple-option-frm table .custom-shipping-field").show();
        this.$el.find(".show_rate").hide();
        this.$el.find(".shipping_rate .view_rate").hide();
    }
    else {
        this.$el.find(".multiple-option-frm").addClass('weight-shipping');
        this.$el.find(".multiple-option-frm table colgroup").append('<col width="165"><col width="*">');
        this.$el.find(".multiple-option-frm table .custom-shipping-field").hide();
        this.$el.find(".shipping_rate .view_rate").hide();
        this.$el.find(".show_rate").show();
        $(".data-field .usa table").empty().append($(".weight-based-rates .domestic").clone());
        $(".data-field .world table").empty().append($(".weight-based-rates .international").clone());
        this.renderShippingRateGroupsSelect();
        this.onShippingRateSelectChange();
    }
  },
  updateShippingRateGroupView: function(shippingRateGroupId) {
    if (this.shippingRateGroupView) {
      this.shippingRateGroupView.remove();
    }
    
    var shippingRateGroup = this.shippingRateGroupCollection.get(shippingRateGroupId);
    var $worldTableDiv = $("div.data-field .world .table");
    this.shippingRateGroupView = new FancyBackbone.Views.ProductLegacy.ShippingRateGroupNewView({
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
  },
  onShippingRateSelectChange: function() {
    this.updateShippingRateGroupView(this.selectView.getSelectedValue());
    //this.showShippingRatesPopup();
  },

  renderShippingRateGroupsSelect: function(sid) {
    var based_type = 0;
    if( this.$el.find("[name=shipping-type]").val() == 2){
      based_type = 1;
    }
    var rateGroupCollection = [];
    _.map(this.shippingRateGroupCollection.models, function(shippingRateGroup) {
        if( shippingRateGroup.get('based_type') == based_type)
          rateGroupCollection.push(shippingRateGroup.createSelectOption());
      })
    if(based_type == 1){
      rateGroupCollection.unshift({value: '-1',display: 'Default'});
    }
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
    //this.updateShippingRateGroupView(this.selectView.getSelectedValue());
  },
  render: function() {
    if (this.model.id) {
      this.syncView();
      var shippingRateGroupId = this.model.get('shipping_rate_group_id');
      if (shippingRateGroupId ) {
        this.renderShippingRateGroupsSelect(shippingRateGroupId);
      }
    } else {
      this.$el.find('select[name="shipping_destination"]').val('international_shipping');
      this.$el.find('select[name="shipping-type"]').val(0);
      this.onChangeShippingType(); 
    }
    return this;
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

    var ships_internationally = this.$el.find("select[name=shipping_destination]").val()=='international_shipping';
    var charge_domestic = true;
    var charge_international = true;
    var ships_from = this.$el.find("select[name=ships_from]").val();
    var free_charge = this.$el.find(".free_charge select option:selected").val();
    if (free_charge == 1) {
        charge_domestic = false
        charge_international = false
    } else if (free_charge == 2) {
        charge_domestic = false
    } else if (free_charge == 3) {
        charge_international = false
    }

    this.model.set('international_shipping', ships_internationally);
    this.model.set('charge_domestic_shipping', charge_domestic);
    this.model.set('charge_international_shipping', charge_international);
    this.model.set('ships_from', ships_from);

    var $selected_type = this.$el.find('select[name="shipping-type"]');
    var selected_type = $selected_type.val();
    var shippping_rate_group_id = this.selectView ? this.selectView.getSelectedValue() : -1;
    if (selected_type == '1') {
        this.model.set('use_custom_shipping', 0);
        this.model.set('custom_domestic_charge', '0.00');
        this.model.set('custom_international_charge', '0.00');
        this.model.set('custom_domestic_incremental_fee', '0.00');
        this.model.set('custom_international_incremental_fee', '0.00');
        this.model.set('shipping_rate_group_id', shippping_rate_group_id);
    }
    else if (selected_type == '0') {
        this.model.set('use_custom_shipping', 1);
        this.model.set('custom_domestic_charge', this.$el.find('input.custom-charge-domestic').val());
        this.model.set('custom_international_charge', this.$el.find('input.custom-charge-international').val());
        this.model.set('custom_domestic_incremental_fee', this.$el.find('input.custom-incremental-domestic').val());
        this.model.set('custom_international_incremental_fee', this.$el.find('input.custom-incremental-international').val());
        this.model.set('shipping_rate_group_id', -1);
    }
    else {
        this.model.set('use_custom_shipping', 0);
        this.model.set('custom_domestic_charge', '0.00');
        this.model.set('custom_international_charge', '0.00');
        this.model.set('custom_domestic_incremental_fee', '0.00');
        this.model.set('custom_international_incremental_fee', '0.00');
        this.model.set('shipping_rate_group_id', shippping_rate_group_id);
        //this.model.set('shipping_rate_group_id', -1);
    }
    this.model.set('expected_delivery_day_1', this.$el.find('input.expected_delivery_day_1').val());
    this.model.set('expected_delivery_day_2', this.$el.find('input.expected_delivery_day_2').val());
    this.model.set('expected_delivery_day_intl_1', this.$el.find('input.expected_delivery_day_intl_1').val());
    this.model.set('expected_delivery_day_intl_2', this.$el.find('input.expected_delivery_day_intl_2').val());
  },
  syncView: function() {
    var use_custom_shipping = this.model.get('use_custom_shipping');
    var shippingRateGroupId = this.model.get('shipping_rate_group_id');
    if (use_custom_shipping == 0){
      var based_type = 1;
      if(shippingRateGroupId && this.shippingRateGroupCollection.get(shippingRateGroupId)) {
        if(this.selectView) this.selectView.selectValue(shippingRateGroupId);
        this.updateShippingRateGroupView(shippingRateGroupId);
        based_type = this.shippingRateGroupCollection.get(shippingRateGroupId).get('based_type');
      }
       
      this.$el.find('select[name="shipping-type"]').val(based_type?2:1);
    } else {
      this.$el.find('select[name="shipping-type"]').val(0)
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
    var intl_free_charge = !this.model.get('charge_international_shipping');
    var domestic_free_charge = !this.model.get('charge_domestic_shipping');
    if (intl_free_charge && domestic_free_charge) {
        this.$el.find(".free_charge select").val("1");
    } else if (domestic_free_charge) {
        this.$el.find(".free_charge select").val("2");
    } else if (intl_free_charge) {
        this.$el.find(".free_charge select").val("3");
    }
    this.onChangeShippingType(); 
    
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
        this.$el.find('input.use-custom-shipping').click();

    }
    this.$el.find("select[name=return_policy]").val(this.model.get('return_policy'));
    this.$el.find("input[name='custom_return_policy_days']").val(this.model.get('custom_return_policy_days'));
    this.$el.find("select[name=exchange_policy]").val(this.model.get('exchange_policy'));
    this.$el.find("input[name='custom_exchange_policy_days']").val(this.model.get('custom_exchange_policy_days'));
    this.ui.$returnExchangePolicyDesc.val(this.model.get('return_exchange_policy_description'));

    this.$el.find('.free_charge select').trigger("change");
  }
});

FancyBackbone.Views.ProductLegacy.ShippingRateRuleTableNewView = Backbone.View.extend({
  template: FancyBackbone.Utils.loadTemplate("product_shipping_rate_rule_table_new"),
  initialize: function(options) {
    this.data = options.data;
  },
  render: function() {
    this.$el.html(this.template(this.data));

    return this;
  },
});

FancyBackbone.Views.ProductLegacy.ShippingRateGroupNewView = Backbone.View.extend({
  initialize: function(options) {
    this.usa_el = options.usa_el;
    this.intl_el = options.intl_el;
  },
  renderShippingRateRule: function(shippingRateRule) {
    var tableView = new FancyBackbone.Views.ProductLegacy.ShippingRateRuleTableNewView({
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

FancyBackbone.Views.ProductLegacy.MiscellaneousView = Backbone.View.extend({
  syncModel: function() {
    if (!this.model.id) {
      this.model.set('fancy_this_item', this.$el.find("#fancy_profile").is(":checked"));
    }
  },
  render: function() {
      if(this.model.id) {
        this.$el.hide();
    }
    return this;
  }
});

FancyBackbone.Views.ProductLegacy.PreorderView = Backbone.View.extend({
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

FancyBackbone.Views.ProductLegacy.CustomFieldView = Backbone.View.extend({
  events: {
    'click .btn-add': 'onAddField',
    'click .btn-del': 'onDeleteField',
  },  
  onAddField: function(event) {
    event.preventDefault();

    this.addField();
  },  
  onDeleteField: function(event) {
    event.preventDefault();
    $(event.target).closest("tr").remove();
  },
  addField:function(key,value){
      var template = this.$el.find("table tbody > script").html();
      var field = $(template);
      if(key) field.find("input.key").val(key);
      if(value) field.find("input.value").val(value);
      this.$el.find("table tbody").append(field);
  },
  syncModel: function() {
    var fields = this.$el.find("table tbody tr"); 
    var metadata = {};
    fields.each(function(){
      var key = $(this).find("input.key").val();
      var value = $(this).find("input.value").val();
      if(key){
        metadata[key] = value||"";
      }
    })
    this.model.set('metadata', metadata);    
  },
  syncView: function(e) { 
    var that = this;
    var metadata = this.model.get('metadata');
    var keys = Object.keys(metadata).sort();

    $(keys).each(function(){
      that.addField(this, metadata[this]);
    })
  },
  render: function() {     
    if(this.model.get('metadata')) { 
      this.syncView(); 
    }
    
    return this; 
  },
}); 

FancyBackbone.Views.ProductLegacy.AddProductView = Backbone.View.extend({
  events: {
    'click button.btn-save': 'onSaveClick',
    'click button.btn-delete': 'onDeleteClick',
    'click .locked': 'onLockedFieldClick'
  },
  highlightErrors: function(errorFields) {
    var that = this;
    var optionErrorsFields = {};
    var optionErrorsCount = 0;

    _.each(errorFields, function(errorField) {
      try{
        var field = that.$el.find("*[name=" + errorField + "]");
        if( !field.length ) field = that.$el.find("*[name=" + errorField.replace(/_/g,'-') + "]"); 
        if( field.length ) {
          field.parent().addClass("error");
        }
      }catch(e){}
      if (errorField.indexOf("option ") == 0) {
        var data = errorField.split(" ");
        optionErrorsFields[data[2]] = "true";
        if($.inArray(data[2], ['name', 'price'])!=-1){
          that.$el.find('.multiple-option-frm tr[id='+data[1]+'] input.'+data[2]).parent().addClass("error");
        }else{
          that.$el.find('.multiple-option-frm tr[id='+data[1]+']').addClass("error");
        }
        optionErrorsCount++;
      }
      if (errorField == 'options') {
        that.$el.find('.multiple-option-frm').addClass("error");
      }
      if(errorField == 'image'){
        that.$el.find('.add-photos > dd.data-cont').addClass("error");
      }
      if(errorField == 'category_ids'){
        that.$el.find('.select-category.category_ids').addClass("error");
      }
      if(errorField == 'description'){
        that.$el.find('div.description').addClass("error");
      }
      if(errorField == 'tax_code'){
        that.$el.find('div.tax-cloud-view').addClass("error");
      }
      if(errorField == 'end_date'){
        that.$el.find('div.end-date.date-field').addClass("error");

      }
      if(errorField == 'shipping_options') {
        that.$el.find('.shipping_rate > label').addClass("error");
        alertify.alert('Please use custom shipping for items over 150lbs.');
      }
      if(errorField == 'expected_delivery_day') {
        that.$el.find('.add-shipping .multiple-option-frm .expected_delivery_day_1').parent().addClass('error'); 
      } 
      if (errorField == 'expected_delivery_day_intl') {
        that.$el.find('.add-shipping .multiple-option-frm .expected_delivery_day_intl_1').parent().addClass('error'); 
      }
      if (errorField == 'custom_charge_domestic') { 
        that.$el.find('.add-shipping input[name="custom-charge-domestic"]').parent().addClass('error');
      }
      if (errorField == 'custom_incremental_domestic') { 
        that.$el.find('.add-shipping input[name="custom-incremental-domestic"]').parent().addClass('error');
      }
      if (errorField == 'custom_charge_international') { 
        that.$el.find('.add-shipping input[name="custom-charge-international"]').parent().addClass('error');
      }
      if (errorField == 'custom_incremental_international') { 
        that.$el.find('.add-shipping input[name="custom-incremental-international"]').parent().addClass('error');
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
        if(field.indexOf("option ")!=0){
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
	$('.notification-bar').css('top','45px');
	setTimeout(function(){
		$('.notification-bar').css('top','-100px');
	},3000);
    if( $("#content").hasClass("edit") ){
    }else{
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
            window.alert(message);
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
      window.location.pathname = "/merchant/products";
    }).error(function(jqXHR) {
      if (jqXHR.responseJSON) {
        if (jqXHR.responseJSON['error_fields']) {
            that.highlightErrors(jqXHR.responseJSON['error_fields']);
        } else {
          var message = jqXHR.responseJSON.message || "Failed to create. Please fill out the form correctly.";
          window.alert(message);
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
  createInfoView: function() {
    return new FancyBackbone.Views.ProductLegacy.InfoView({
      el: this.$el.find(".add-info"),
      model: this.model
    }).render();
  },
  createDetailView: function() {
    return new FancyBackbone.Views.ProductLegacy.DetailView({
      el: this.$el.find(".add-detail"),
      model: this.model
    }).render();
  },
  createOptionView: function() { 
    return new FancyBackbone.Views.ProductLegacy.OptionView({
      el: this.$el.find(".add-items"),
      model: this.model,
      is_admin: false,
    }).render();
  }, 
  createTagsView: function() { 
    return new FancyBackbone.Views.ProductLegacy.TagsView({ 
      el: this.$el.find(".add-tags"),
      model: this.model,
    }).render(); 
  },
  createPhotoListView: function() {
    return new FancyBackbone.Views.ProductLegacy.PhotoListView({
      el: this.$el.find(".add-photos"),
      model: this.model
    }).render();
  },
  createVideoView: function() {
    return new FancyBackbone.Views.ProductLegacy.VideoView({
      el: this.$el.find(".add-video"),
      model: this.model
    }).render();
  },
  createSaleDurationView: function() {
    return new FancyBackbone.Views.ProductLegacy.SaleDurationView({
      el: this.$el.find(".add-duration"),
      model: this.model,
      is_admin: false,
    }).render();
  },
  createStatusView: function() {
    return new FancyBackbone.Views.ProductLegacy.StatusView({
      el: this.$el.find(".add-status"),
      model: this.model
    }).render();
  },
  createCollectionsView: function() {
    return new FancyBackbone.Views.ProductLegacy.CollectionsView({
      el: this.$el.find(".add-collection"),
      model: this.model
    }).render();
  },
  createShippingView: function() {
    return new FancyBackbone.Views.ProductLegacy.ShippingView({
      el: this.$el.find(".add-shipping"),
      model: this.model
    }).render();
  },
  createMiscellaneousView: function () {
    return new FancyBackbone.Views.ProductLegacy.MiscellaneousView({
      el: this.$el.find(".add-miscellaneous"),
      model: this.model
    }).render();
  },
  createCustomFieldView: function () {
    return new FancyBackbone.Views.ProductLegacy.CustomFieldView({
      el: this.$el.find(".add-custom"),
      model: this.model
    }).render();
  },
  createPreorderView: function () {
    return new FancyBackbone.Views.ProductLegacy.PreorderView({
      el: this.$el.find(".add-preorder"),
      model: this.model
    }).render();
  },

  adjustContainer: function() {
    $("#content").removeClass("loading");
	if ($(window).height()<$('#content').height()+$('#header').height()+20){
	  $('.container').addClass('btns-fix');
	}else{
	  $('.container').removeClass('btns-fix');
	}
  },

  render: function() {
    this.subviews = [
      this.createStatusView(),
      this.createInfoView(this.hcc),
      this.createDetailView(),
      this.createOptionView(),
      this.createTagsView(),
      this.createPhotoListView(),
      this.createSaleDurationView(),
      this.createShippingView(),
      this.createCollectionsView(),
      this.createMiscellaneousView(),
      this.createCustomFieldView(),
      this.createPreorderView(),
    ];
    if(this.$el.find(".add-video").length){
      this.subviews.push(this.createVideoView());
    }
    this.adjustContainer();
    this.$el.find('.tooltip').each(function(){
      var w = $(this).find('em').width();
      $(this).find('em').css('margin-left',-w/2-5+'px');
    });
    return this;
  },
});

FancyBackbone.Views.ProductLegacy.AdminSeniorInfoView = FancyBackbone.Views.ProductLegacy.InfoView.extend({
  syncModel: function() {
    this._super();
  },
  syncView: function() {
    this._super();
    this.$el.find("p.unit-cost").show(); 
    this.$el.find("p.qty input").css("width", "121px");
  },
  render:function() { 
    this._super();
    return this; 
  },
});

FancyBackbone.Views.ProductLegacy.AdminSeniorAddProductView = FancyBackbone.Views.ProductLegacy.AddProductView.extend({
  createOptionView: function() { 
    return new FancyBackbone.Views.ProductLegacy.OptionView({
      el: this.$el.find(".add-items"),
      model: this.model,
      is_admin: true,
    }).render();
  },
  createInfoView: function() {
    return new FancyBackbone.Views.ProductLegacy.AdminSeniorInfoView({
      el: this.$el.find(".add-info"),
      model: this.model
    }).render();
  },
  createSaleDurationView: function() {
    return new FancyBackbone.Views.ProductLegacy.SaleDurationView({
      el: this.$el.find(".add-duration"),
      model: this.model,
      is_admin: true,
    }).render();
  },
});

}
