FancyBackbone.Views.Product = FancyBackbone.Views.Product || {};

function get_discounted_price(price, discount) {
	price = parseFloat(price);
	discount = parseFloat(discount);
	return (price - price * discount / 100).toFixed(2);
}

function get_original_price(price, discount) {
	if (discount == 0) {
		return price;
	}
	price = parseFloat(price);
	discount = parseFloat(discount);
	return (price / discount / 100).toFixed(2);
}

function get_discount(original_price, price) {
	price = parseFloat(price);
	original_price = parseFloat(original_price);
  if(!price || !original_price) return "";
  var discount = (100 - (price / original_price * 100));
	return discount && discount.toFixed(2) || "";
}

FancyBackbone.Views.Product.NewInfoView = Backbone.View.extend({
  events: {
    'keyup input[name=discount]': 'onDiscountChage',
    'keyup input[name=price]': 'onPriceChage',
    'keyup input[name=retail-price]': 'onRetailPriceChage',
    'change fieldset.select-category > select': 'onSelectedCategoryChange',
    'click ul.step-category > li > a.btn-add': 'onAddCategoryClick',
    'click ul.step-category > li > a.btn-del': 'onRemoveCategoryClick',
    'click .harmonized-code-selection > button.harmonized-code-btn-del': 'onDeleteHarmonizedCodeClick',
    'keyup input[name=harmonized-code-search]': 'onInputHarmonizedCodeSearch',
    'click .harmonized-code-suggestion > li': 'onClickHarmonizedCodeSuggestion',
    'change .policy select[name=return_policy]': 'onSelectedReturnPolicyChange',
    'change .policy select[name=exchange_policy]': 'onSelectedExchangePolicyChange',
    'click .policy input#use_exchange': 'onClickUseExchangeCheckBox',
    'keyup .policy .return_policy_day input[name="custom_return_policy_days"]': 'onKeyupCustomReturnPolicyDays',
    'keyup .policy .use_exchange .exchange_policy_day input[name="custom_exchange_policy_days"]': 'onKeyupCustomExchangePolicyDays',
    'click .policy button.btn-reset': 'onClickBtnReset',
    'click #sync_qty_checkbox': 'onSyncQuantityClick'
  },
  ui: {
    $returnPolicySelect: '.policy select[name=return_policy]',
    $customReturnPolicyDays: '.policy .return_policy_day input[name="custom_return_policy_days"]',
    $customReturnPolicyDaysBlock: '.policy .return_policy_day',
    $exchangePolicySelect: '.policy select[name=exchange_policy]',
    $customExchangePolicyDays: '.policy .use_exchange .exchange_policy_day input[name="custom_exchange_policy_days"]',
    $customExchangePolicyDaysBlock: '.policy .use_exchange .exchange_policy_day',
    $returnExchangePolicyDesc: '.policy textarea#return_exchange_policy_description',
    $useExchangeInput: '.policy input#use_exchange',
    $useExchangeDiv: '.policy div.use_exchange',
    $syncQuantityCheckbox: 'input#sync_qty_checkbox'
  },
  initialize: function() {
    this.categoryCollection = window.categoryCollection;

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

  onDiscountChage: function(event) {
	var discount = $(event.currentTarget).val();
    var retail_price = parseFloat($('input[name=retail-price]').val());
    var price = parseFloat($('input[name=price]').val());
	var discount_num = parseFloat(discount);
	var discount_num = isNaN(discount_num) ? 0 : discount_num;

	if (!isNaN(retail_price)) {
		var discounted = get_discounted_price(retail_price, discount_num);
		$('input[name=price]').val(discounted);
	} else {
		if (!isNaN(price)) {
			var original = get_original_price(price, discount_num);
			$('input[name=retail-price]').val(original);
		}
	}
	if (discount && isNaN(discount)) {
		$(event.currentTarget).val('')
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
    if (category) {
      this.setCurrentCategory(category);
    }
  },
  onRemoveCategoryClick: function(event) {
    event.preventDefault();
    var $categoryListItem = $(event.currentTarget).closest("li");
    $categoryListItem.remove();
  },
  onInputHarmonizedCodeSearch: function(event) {
    event.preventDefault();
    var search_text = $(event.currentTarget).val();
    if(search_text.length > 1) {
        var search_key = 'commodity_code';
        if(isNaN(parseInt(search_text))) {
            search_key = 'description';
            search_tex = search_text.toUpperCase();
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
  onSelectedReturnPolicyChange: function (event) {
    if (this.ui.$returnPolicySelect.val() == 4) { // custom return policy selected
      this.ui.$customReturnPolicyDaysBlock.show();
    } else {
      this.ui.$customReturnPolicyDaysBlock.hide();
    }

    this.synchronizeExchangePolicy();
    this.renderReturnExchangePolicyDescription();
  },
  renderCustomExchangePolicyDaysBlock: function () {
    if (this.ui.$exchangePolicySelect.val() == 4) { // custom exchange policy selected
      this.ui.$customExchangePolicyDaysBlock.show();
    } else {
      this.ui.$customExchangePolicyDaysBlock.hide();
    }
  },
  onSelectedExchangePolicyChange: function (event) {
    this.renderCustomExchangePolicyDaysBlock();
    this.renderReturnExchangePolicyDescription();
  },
  onClickUseExchangeCheckBox: function (event) {
    var $input = $(event.currentTarget);

    if ($input.is(':checked')) {
      this.ui.$useExchangeDiv.hide();
      this.synchronizeExchangePolicy();
    } else {
      this.renderCustomExchangePolicyDaysBlock();
      this.ui.$useExchangeDiv.show();
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
      this.ui.$exchangePolicySelect.val(this.ui.$returnPolicySelect.val());
      this.ui.$customExchangePolicyDays.val(this.ui.$customReturnPolicyDays.val());

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
  onSyncQuantityClick: function () {
    this.updateSyncQuantityView();
    this.syncSyncQuantityWithWarehouse();

    if (this.ui.$syncQuantityCheckbox.is(':checked')) {
      FancyBackbone.App.eventAggregator.trigger("update:sync_quantity_with_warehouse", this.ui.$syncQuantityCheckbox.is(':checked'));
    }
  },
  updateSyncQuantityView: function () {
    var $checkbox = this.ui.$syncQuantityCheckbox;
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
  addCategory: function(category) {
    var $categoryListItem = this.renderSelectingCategoryListItem(category);
    $categoryListItem.prependTo(this.$el.find("ul.step-category"));
    $categoryListItem.removeClass("selecting");
    $categoryListItem.addClass("selected");
    $categoryListItem.find("a").removeClass("btn-add").addClass("btn-del");
    $categoryListItem.data('model', category);
  },
  onAddCategoryClick: function(event) {
    event.preventDefault();
    var $categoryListItem = $(event.currentTarget).closest("li");
    if (this.model.get("categories").get(this.currentCategory.id)) {
      window.alert("You already selected this category.");
    } else {
      this.addCategory(this.currentCategory);
      $categoryListItem.remove();
      this.setCurrentCategory(null);
    }
  },
  renderCategorySelect: function(theCategory) {
    var subCategories = this.categoryCollection.findSubCategories(theCategory);

    var selectView = null;
    if (subCategories.length > 0) {
      selectView = new FancyBackbone.Views.Base.SelectView({
        options: _.map(subCategories, function(subCategory) {
          return subCategory.createSelectOption();
        }),
        defaultOption: {
          value: '',
          display: gettext('Select Category'),
        }
      }).render();
    }

    if (theCategory) {
      var parentCategory = this.categoryCollection.findParentCategory(theCategory);
      var $parentSelects = this.renderCategorySelect(parentCategory);
      $parentSelects.eq(-1).val(theCategory.createSelectOption().value);
      if (selectView) {
        return $parentSelects.add("<span>><span>").add(selectView.$el);
      } else {
        return $parentSelects;
      }
    } else {
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
      }).join(" > ");
      return $('<li class="selecting">' + display + '<a href="#" class="btns-white btn-add tooltip"><i class="icon"></i><em>'+gettext('Click to add this category')+'</em></a></li>');
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
    }
  },
  syncNewThingId: function() {
    this.model.set('new_thing_id', this.$el.find('input[name=new_thing_id]').val().trim());
  },
  syncNewThingUserId: function() {
    this.model.set('new_thing_user_id', this.$el.find('input[name=new_thing_user_id]').val().trim());
  },
  syncTitle: function() {
    this.model.set('title', this.$el.find('input[name=title]').val().trim());
  },
  syncPrice: function() {
    this.model.set('price', this.$el.find('input[name=price]').val().trim().replace(/,/g, ''));
  },
  syncRetailPrice: function() {
    this.model.set('retail_price', this.$el.find('input[name=retail-price]').val().trim().replace(/,/g, ''));
  },
  syncQuantity: function() {
    var quantity = this.$el.find('input[name=quantity]').val().trim();
    if (quantity === '') {
      quantity = null;
    }
    this.model.set('quantity', quantity);
  },
  syncSyncQuantityWithWarehouse: function () {
    this.model.set('sync_quantity_with_warehouse', this.$el.find('input#sync_qty_checkbox').is(':checked'))
  },
  syncSellerSKU: function() {
    this.model.set('seller_sku', this.$el.find('input[name=seller_sku]').val().trim());
  },
  syncCategories: function() {
    var productCategoryCollection = new FancyBackbone.Collections.Product.CategoryCollection(
      _.map(this.$el.find("ul.step-category li.selected"), function(selectedCategoryListItem) {
        return $(selectedCategoryListItem).data('model');
      })
    );
    this.model.set('categories', productCategoryCollection);
  },
  syncHarmonizedCommodityCode: function() {
    var harmonizedCommodityCode = parseInt(this.$el.find('.harmonized-code-selection').attr('cc-id'));
    if (isNaN(harmonizedCommodityCode))
        this.model.set('commodity_code_id', null);
    else
        this.model.set('commodity_code_id', harmonizedCommodityCode);
  },
  syncReturnPolicy: function() {
    var returnPolicy = this.$el.find('select[name=return_policy] option:selected').val().trim();
    this.model.set('return_policy', returnPolicy);

    if (returnPolicy == 4) { // custom day returns
      this.model.set('custom_return_policy_days', this.$('input[name="custom_return_policy_days"]').val().trim());
    } else {
      this.model.set('custom_return_policy_days', null);
    }
  },
  syncExchangePolicy: function() {
    var exchangePolicy = this.$el.find('select[name=exchange_policy] option:selected').val().trim();
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
    this.syncNewThingId();
    this.syncNewThingUserId();
    this.syncTitle();
    this.syncPrice();
    this.syncRetailPrice();
    this.syncQuantity();
    this.syncSyncQuantityWithWarehouse();
    this.syncSellerSKU();
    this.syncCategories();
    this.syncHarmonizedCommodityCode();
    this.syncReturnPolicy();
    this.syncExchangePolicy();
    this.syncCustomReturnExchangePolicyDescription();
  },
  syncView: function() {
    this.$el.find("input[name=new_thing_id]").val(this.model.get('new_thing_id'));
    this.$el.find("input[name=new_thing_user_id]").val(this.model.get('new_thing_user_id'));
    this.$el.find("input[name=title]").val(this.model.get('title'));

	var price = this.model.get('price'), retail_price = this.model.get('retail_price');

    this.$el.find("input[name=price]").val(price);
    this.$el.find("input[name=retail-price]").val(retail_price);

	if (price && retail_price) {
		var discount = get_discount(retail_price, price);
		if (!isNaN(discount)) {
			this.$el.find("input[name=discount]").val(discount);
		}
	}

    this.$el.find("input[name=quantity]").val(this.model.get('quantity'));
    this.$el.find("input#sync_qty_checkbox").prop("checked", this.model.get("sync_quantity_with_warehouse"));
    this.updateSyncQuantityView();
    this.$el.find("input[name=seller_sku]").val(this.model.get('seller_sku'));
    this.model.get('categories').each(this.addCategory, this);

    var hcc = this.model.get('harmonized_commodity_code');
    if (hcc) {
        this.$el.find("input[name='harmonized-code-search']").hide();
        this.$el.find(".harmonized-code-selection").attr('cc-id', hcc['id']);
        this.$el.find(".harmonized-code-selection span").text('['+hcc['commodity_code']+'] '+ hcc['description']);
        this.$el.find(".harmonized-code-selection").show();
    } else {
        this.$el.find("input[name='harmonized-code-search']").show();
    }
    this.$el.find("select[name=return_policy]").val(this.model.get('return_policy'));
    this.$el.find("input[name='custom_return_policy_days']").val(this.model.get('custom_return_policy_days'));
    this.$el.find("select[name=exchange_policy]").val(this.model.get('exchange_policy'));
    this.$el.find("input[name='custom_exchange_policy_days']").val(this.model.get('custom_exchange_policy_days'));

    this.ui.$returnExchangePolicyDesc.val(this.model.get('return_exchange_policy_description'));
  },
  render: function() {
    this.setCurrentCategory(null);
    if (this.model.id) {
      this.syncView();
    }
    return this;
  },
});

FancyBackbone.Views.Product.NewTags = Backbone.View.extend({
  events: {
    'keydown .multi-text input': 'onTagDelete',
    'keypress .multi-text input': 'onTagEntered',
    'click .multi-text.frm .btn-del': 'onClickDeleteTag',
    'click .multi-text.list span': 'onClickExistingTag',
  },
  onTagDelete: function(event) {
    if (event.keyCode != 8) return;
   
    if( $(event.currentTarget).val() ) return;
    event.preventDefault();
    $(event.currentTarget).prev('span').remove();

    this.updateExistingTagButtons(); 
    return false;
  },
  onTagEntered: function(event) {
    if (event.keyCode != 13 && event.keyCode != 44 ) return;
   
    event.preventDefault();
    var tag = $('.tags input.add').val();
    this.addTag(tag); 
    $('.tags input.add').focus();
  },  
  getSelectedTags: function() { 
    var keywords = [];
    _.each( this.$el.find(".multi-text.frm span"), function(tag) {
      keywords.push($(tag).attr('name'));
    });
    return keywords; 
  },
  addTag: function(tag) { 
    if (!tag || tag === '') return;
    var keywords = this.getSelectedTags(); 
    if(_.find(keywords, function(keyword) { return keyword == tag }) != undefined) { 
      return false; 
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
  onClickExistingTag: function(e) {
    e.preventDefault(); 
    var aTag = $(e.currentTarget).attr('name');
    this.addTag(aTag); 
    this.updateExistingTagButtons(); 
  },
  onClickDeleteTag: function(e) {
    e.preventDefault();
    $(e.currentTarget).closest('span').remove();
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
  syncView: function() {
    var that = this; 
    if (this.model.get('keywords')) {
      _.each( this.model.get('keywords').split(','), function(tag) {
        that.addTag(tag);
      });
    }
  },
  render: function() {
    if(this.model.get('seller_tags') && this.model.get('seller_tags').length > 0) { 
      var that = this; 
      var tags = this.model.get('seller_tags');
      if( tags.length > 10) tags = tags.slice(0,10);
      _.each( tags, function(tag) { 
        that.addPreviousTag(tag); 
      }); 
      this.$el.find("small.comment, .multi-text.list").show();
    }else{
      this.$el.find("small.comment, .multi-text.list").hide();
    }
    if(this.model.get('keywords')) { 
      this.syncView(); 
    }
    return this;
  },
});

FancyBackbone.Views.Product.NewDetailView = Backbone.View.extend({
  events: {
    'click .multiple-option-frm a.btn-del': 'onRemoveOptionClick',
    'click .multiple-option-frm a.btn-edit': 'onEditOptionClick',
  },
  syncColors: function() {
    this.model.set('colors', this.$el.find("select[name=colors]").val() || []);
  },
  syncWeight: function() { this.model.set('weight', this.$el.find('input[name=weight]').val().trim()); },
  syncWidth: function() { this.model.set('width', this.$el.find('input[name=width]').val().trim()); },
  syncLength: function() { this.model.set('length', this.$el.find('input[name=length]').val().trim()); },
  syncHeight: function() { this.model.set('height', this.$el.find('input[name=height]').val().trim()); },
  syncOriginCountry: function() { this.model.set('origin_country', this.$el.find('select.select-country').val().trim()); },
  syncPersonalizable: function() { this.model.set('personalizable', this.$el.find('input[name=personalizable]').is(":checked")); },
  syncDescription: function() {
    this.model.set('description', tinyMCE.get('product-description').getContent());
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

    this.model.get('options').each(function(v){
      var dl = [];
      if( v.get('id') )
        dl = this.$el.find(".multiple-option-frm dt[id='"+v.get('id')+"']").parent();
      else if (v.get('tid'))
        dl = this.$el.find(".multiple-option-frm dt[tid='"+v.get('tid')+"']").parent();
      
      if(dl[0]){
        v.set('position', dl.prevAll('dl').length+1);
      }
    },this);
  },
  onEditOptionClick: function(event) {
    event.preventDefault();
    var $row = $(event.currentTarget).closest("dl");
    var option = $row.data("model");
    window.popups.viewAddSaleItemOptions.render(option, this.model, false);
  },
  onRemoveOptionClick: function(event) {
    event.preventDefault();
    var $row = $(event.currentTarget).closest("dl");
    var option = $row.data("model");
    this.model.get("options").remove(option);
    $row.remove();
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
  createOption: function() {
    //var $editingRow = this.getEditingRow();
    /*
    return new FancyBackbone.Models.Product.Option({
      name: $editingRow.find("input[name=name]").val().trim(),
      quantity: $editingRow.find("input[name=quantity]").val().trim(),
      price: $editingRow.find("input[name=price]").val().trim(),
      retail_price: $editingRow.find("input[name=retail-price]").val().trim(),
      // unit_cost: $editingRow.find("input[name=unit-cost]").val().trim(),
      color: $editingRow.find("select[name=color]").val(),
    });
    */
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
        sync_quantity_with_warehouse: $('div.popup.add-option div.ltxt p.qty input#sync_qty_checkbox').is(':checked'),
        color: $('div.popup.add-option div.ltxt p.color input').val().trim(),
        prod_length: $('div.popup.add-option div.ltxt p.length input').val().trim(),
        prod_height: $('div.popup.add-option div.ltxt p.height input').val().trim(),
        prod_width: $('div.popup.add-option div.ltxt p.width input').val().trim(),
        prod_weight: $('div.popup.add-option div.ltxt p.weight input').val().trim(),
        unit_cost: $('div.popup.add-option div.ltxt p.unit-cost input').val().trim().replace(/,/g, ''),
        tid: $('div.popup.add-option div.ltxt p.name input').val().trim(),
    });
  },
  createNewOptionRow: function(option) {
    var $editingRow = this.getEditingRow();
    var $newOptionRow = $editingRow.find('dl').last().clone();
    $newOptionRow.show();

    if (option.get('id') != null) {
        $newOptionRow.find('dt')[0].id = option.get('id');
    }

    if (option.get('tid') != null) {
        $newOptionRow.find('dt').attr('tid', option.get('tid'));
    }

    this.renderOptionName($newOptionRow.find('dt b.option_name'), option);
    $newOptionRow.find('dt small.option_sku').text(this.getNullCheckedValue(option.get('seller_sku'), true));
    $newOptionRow.find('dd ul li.qty span').text(this.getNullCheckedValue(option.get('quantity'), true));
    $newOptionRow.find('dd ul li.price span').text(this.getNullCheckedValue(option.get('price'), true));
    $newOptionRow.find('dd ul li.retail span').text(this.getNullCheckedValue(option.get('retail_price'), true));

    $newOptionRow.find('dd ul li.length span').text(this.getNullCheckedValue(option.get('prod_length'), true));
    $newOptionRow.find('dd ul li.height span').text(this.getNullCheckedValue(option.get('prod_height'), true));
    $newOptionRow.find('dd ul li.width span').text(this.getNullCheckedValue(option.get('prod_width'), true));
    $newOptionRow.find('dd ul li.weight span').text(this.getNullCheckedValue(option.get('prod_weight'), true));

    var unit_cost = this.getNullCheckedValue(option.get('unit_cost'), true);
    var color = this.getNullCheckedValue(option.get('color'), true);
    $newOptionRow.find('dd ul li.color span').text(color);
    $newOptionRow.find('dd ul li.unit_cost span').text(unit_cost);

    /*
    $newOptionRow.removeClass("editing").addClass("added");
    $newOptionRow.find("a").removeClass("btn-add").addClass("btn-del");
    $newOptionRow.find("select[name=color]").closest("td").empty().html('<input type="text" class="text" name="color" />');
    $newOptionRow.find("input").attr("readonly", true);
    $newOptionRow.find("input[name=name]").val(option.get("name"));
    $newOptionRow.find("input[name=quantity]").val(option.get("quantity"));
    $newOptionRow.find("input[name=price]").val(option.get("price"));
    $newOptionRow.find("input[name=retail-price]").val(option.get("retail_price"));
    $newOptionRow.find("input[name=color]").val(option.get("color") || '');
    */

    $newOptionRow.data("model", option);
    return $newOptionRow;
  },
  addOption: function(option) {
    this.getEditingRow().prepend(this.createNewOptionRow(option));
  },
  renderOptionName: function($optionName, optionModel) {
    var syncQuantityMsg = '';
    if (FancyBackbone.App.seller.get('has_fancy_warehouse_access_right')) {
      if (optionModel.get('sync_quantity_with_warehouse')) {
        syncQuantityMsg = '[synced with warehouse inventory]';
      } else {
        syncQuantityMsg = '[not synced with warehouse inventory]';
      }
    }
    $optionName.text(optionModel.get('name'));
    $optionName.append($(" <small>" + syncQuantityMsg + "</small>"));
  },
  updateOption: function(option_row, option_id, temp_id) {
    var option = this.createOption();
    if (temp_id != null)
        option.set('tid', temp_id);
    if (option_id != null)
        option.set('id', option_id);

    this.renderOptionName($(option_row).find('b.option_name'), option);
    $(option_row).find('small.option_sku').text(this.getNullCheckedValue(option.get('seller_sku'), true));

    $(option_row).find('li.qty span').text(this.getNullCheckedValue(option.get('quantity'), true));
    $(option_row).find('li.price span').text(this.getNullCheckedValue(option.get('price'), true));
    $(option_row).find('li.retail span').text(this.getNullCheckedValue(option.get('retail_price'), true));

    $(option_row).find('li.length span').text(this.getNullCheckedValue(option.get('prod_length'), true));
    $(option_row).find('li.height span').text(this.getNullCheckedValue(option.get('prod_height'), true));
    $(option_row).find('li.width span').text(this.getNullCheckedValue(option.get('prod_width'), true));
    $(option_row).find('li.weight span').text(this.getNullCheckedValue(option.get('prod_weight'), true));

    var unit_cost = this.getNullCheckedValue(option.get('unit_cost'), true);
    $(option_row).find('li.unit_cost span').text(unit_cost);

    var color = this.getNullCheckedValue(option.get('color'), true);
    $(option_row).find('li.color span').text(color);

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

            option_models[i].set('quantity', option.get('quantity'));
            option_models[i].set('sync_quantity_with_warehouse', option.get('sync_quantity_with_warehouse'));
            option_models[i].set('price', option.get('price'));
            option_models[i].set('retail_price', option.get('retail_price'));
            option_models[i].set('color', option.get('color'));

            option_models[i].set('prod_length', option.get('prod_length'));
            option_models[i].set('prod_width', option.get('prod_width'));
            option_models[i].set('prod_weight', option.get('prod_weight'));
            option_models[i].set('prod_height', option.get('prod_height'));

            option_models[i].set('unit_cost', option.get('unit_cost'));
        }
    }
  },
  onSaveOptionClick: function(param) {
    var isEditing = false;
    var options = this.$el.find('div.multiple-option-frm dl');
    var existing_id = null;
    var temp_id = null;
    if (param != null) {
        if (param.get('id'))
            existing_id = param.get('id')
        if (param.get('tid'))
            temp_id = param.get('tid')
    }

    for (var i = 0; i < options.length; i++) {
        if(existing_id != null) {
            var option_id = $(options[i]).find('dt')[0].id;
            if (option_id == existing_id) {
                isEditing = true;
                this.updateOption(options[i], option_id, null);
                break;
            }
        }

        if(temp_id != null) {
           var tid = $(options[i]).find('dt').attr('tid');
           if (tid == temp_id) {
               isEditing = true;
               this.updateOption(options[i], null, temp_id);
               break;
           }
        }
    }

    if (!isEditing) {
        var option = this.createOption();
        this.model.get("options").add(option);
        this.addOption(option);
    }
  },
  onUpdateSyncQuantityWithWarehouse: function (saleItemSyncQuantityWithWarehouseChecked) {
    var $options = this.$('div.multiple-option-frm dl'),
        i, optionModel;

    for (i = 0; i < $options.length; i++) {
      optionModel = $($options[i]).data("model");

      if (optionModel) {
        optionModel.set('sync_quantity_with_warehouse', saleItemSyncQuantityWithWarehouseChecked);
        this.renderOptionName($($options[i]).find('b.option_name'), optionModel);
      }
    }
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
      theme_advanced_buttons1 : 'bold,italic,underline,|,bullist,numlist,|,justifyleft,justifycenter,justifyright,|,forecolor,fontsizeselect,|,link,unlink,|,code',
      theme_advanced_buttons2 : '',
      theme_advanced_buttons3 : '',
      theme_advanced_resizing : true,
      theme_advanced_font_sizes : '10px,12px,14px,16px,24px',
      theme_advanced_more_colors : true,
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
  initialize: function() {
    this.countryCollection = window.countryCollection;
    this.listenTo(FancyBackbone.App.eventAggregator,'save:saleitemoption', _.bind(this.onSaveOptionClick, this));
    this.listenTo(FancyBackbone.App.eventAggregator,'update:sync_quantity_with_warehouse', _.bind(this.onUpdateSyncQuantityWithWarehouse, this));
  },
  syncView: function() {
    var that = this;
    this.descriptEditorInitPromise.done(function() {
      tinyMCE.get('product-description').setContent(that.model.get("description"));
    });
    this.model.get('options').models.reverse().forEach(this.addOption, this);
    this.$el.find("p.color select[name=colors]").val(this.model.get('colors'));
    this.$el.find("input[name='weight']").val(this.model.get('weight'));
    this.$el.find("input[name='width']").val(this.model.get('width'));
    this.$el.find("input[name='length']").val(this.model.get('length'));
    this.$el.find("input[name='height']").val(this.model.get('height'));
    this.$el.find('select.select-country').val(this.model.get('origin_country'));
    this.$el.find("input[name='personalizable']").prop('checked', this.model.get('personalizable'));
  },
  render: function() {
    this.renderDescriptionTextArea();
    this.renderCountriesSelect();
    if (this.model.id) {
      this.syncView();
    }
    this.$el.find("p.color select[name=colors]").dropdownchecklist({width:300});
    this.$el.find("div.qty select[name=colors]").dropdownchecklist({width:85});
    this.$el.find(".multiple-option-frm").sortable({items:"dl:visible",handle:"a.btn-reposition"}).disableSelection()
    return this;
  },
});

FancyBackbone.Views.Product.ImageView = Backbone.View.extend({
  events: {
    'click a.delete-button': 'onDeleteButtonClick',
  },
  tagName: 'li',
  className: 'photo-item',
  template: FancyBackbone.Utils.loadTemplate("product_new_photo_item"),
  onDeleteButtonClick: function(event) {
    event.preventDefault();
    this.remove();
  },
  render: function() {
    this.$el.html(this.template({
      url: this.model.get('url_310'),
    }));
    return this;
  }
});

FancyBackbone.Views.Product.NewImageListView = Backbone.View.extend({
  events: {
    "click .data-cont > .photo-list .add_photo": "onAddPhotoClick",
  },
  onAddPhotoClick: function(event) {
    event.preventDefault();
    this.$el.find("#add-product-photo").click();
  },
  syncModel: function() {
    var productImageCollection = new FancyBackbone.Collections.Product.ImageCollection(
      _.map(this.$el.find(".photo-list .photo-item"), function(photoItemView) {
        return $(photoItemView).data('model');
      })
    );
    this.model.set('images', productImageCollection);
  },
  syncView: function() {
    this.model.get('images').each(this.addProductImage, this);
  },
  createImageView: function(productImage) {
    var ret = new FancyBackbone.Views.Product.ImageView({model: productImage}).render();
    ret.$el.data('model', productImage);
    return ret;
  },
  addProductImage: function(productImage) {
    var imageView = this.createImageView(productImage);
    this.$el.find(".photo-list ol").append(imageView.$el);
  },
  setWaiting: function(waitingStatus) {
	  if (waitingStatus) {
		  this.$el.find('.add_photo').addClass('waiting').find('.uploader-progress').width(1);
	  } else {
		  this.$el.find('.add_photo').removeClass('waiting').css('background-image','');
	  }
  },
  render: function() {
    this.$el.find(".photo-list ol").sortable({
	  cancel : '.add_photo',
	  tolerance : 'intersect'
    });
    this.$el.find(".photo-list ol").disableSelection();
    var that = this;
    this.$el.find("#add-product-photo").fileupload({
      dataType: 'json',
      url: '/sales/upload',
	  change: function(e, data) {
		  if (!window.FileReader) return;

		  var reader = new FileReader();
		  reader.onloadend = function() {
			  that.$el.find('.add_photo').css('background-image', 'url('+reader.result+')');
		  };

		  if (data.files && data.files[0]) {
			  reader.readAsDataURL(data.files[0]);
		  }
	  },
      start: function(e, data) {
        that.setWaiting(true);
      },
	  progressall: function(e, data) {
		  var progress = parseInt(data.loaded / data.total * 100, 10);
		  that.$el.find('.uploader-progress').width(progress+'%');
	  },
      done: function(e, data) {
        that.setWaiting(false);
        if (data.result.status_code) {
          that.addProductImage(new FancyBackbone.Models.Product.Image({
            product: this.model,
            url_310: data.result.img_url,
            original_rel_path: data.result.img_id,
          }));
        } else {
          alert("An error occurred. Please check the file and try again.");
        }
      }
    });
    if (this.model.id) {
      this.syncView();
    }
    return this;
  },
});

FancyBackbone.Views.Product.NewDurationView = Backbone.View.extend({
  events: {
    'click a.add-end-date': 'onAddEndDateClick',
    'click a.remove-end-date': 'onRemoveEndDateClick',
  },
  toggleEndDateOption: function(endDateOption) {
    if (endDateOption === undefined) {
      endDateOption = !this.hasEndDate;
    }
    if (endDateOption) {
      this.$el.find("a.add-end-date").hide();
      this.$el.find(".date-field.end-date").show();
    } else {
      this.$el.find("a.add-end-date").show();
      this.$el.find(".date-field.end-date").hide();
    }
    this.hasEndDate = endDateOption;
  },
  onAddEndDateClick: function(event) {
    event.preventDefault();
    var start_date = this.$el.find(".date-field.start-date .picker").datepicker('getDate');
    var min_date = new Date(start_date);
    min_date.setDate(min_date.getDate()+1);
    this.$el.find(".date-field.end-date .picker").datepicker(
      'option','minDate', new Date(min_date)
    );
    start_date.setMonth(start_date.getMonth() + 6);    
    this.$el.find(".date-field.end-date .picker").datepicker(
      'setDate',
      $.datepicker.formatDate('mm/dd/yy', start_date)
    );
    this.toggleEndDateOption(true);
  },
  onRemoveEndDateClick: function(event) {
    event.preventDefault();
    this.toggleEndDateOption(false);
  },
  syncModel: function() {
    this.model.set('start_date', $.datepicker.formatDate('mm/dd/yy', this.$el.find(".date-field.start-date .picker").datepicker('getDate')));
    if (this.hasEndDate) {
		this.model.set('end_date', $.datepicker.formatDate('mm/dd/yy', this.$el.find(".date-field.end-date .picker").datepicker('getDate')));
    } else {
      this.model.set('end_date', null);
    }
    this.model.set('soldout_after_expired', this.$el.find('.soldout-after-expired').prop('checked'));
  },
  initialize: function() {
    this.hasEndDate = false;
  },
  syncView: function() {
    var self = this;
    if (this.model.get('start_date')) {
      this.$el.find(".date-field.start-date .picker").datepicker(
        'setDate',
        moment(this.model.get('start_date')).format("MM/DD/YYYY")
      );
    }
    if (this.model.get('end_date')) {
      this.toggleEndDateOption();
      this.$el.find(".date-field.end-date .picker").datepicker(
        'setDate',
        moment(this.model.get('end_date')).format("MM/DD/YYYY")
      );
    }

    if (this.model.get('soldout_after_expired')) {
      this.$el.find('.soldout-after-expired').prop('checked', this.model.get('soldout_after_expired'));
    }
  },
  render: function() {
    var self = this;
    this.$el.find(".date-field .picker").datepicker();
    this.$el.find(".date-field.start-date .picker").datepicker('option', 'onSelect', function(dateText, inst){
        var end_date = self.$el.find(".date-field.end-date .picker").datepicker('getDate');
        var start_date = new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay);
        start_date.setDate(start_date.getDate()+1);
        if (end_date.getTime() < start_date.getTime()) {
          self.$el.find(".date-field.end-date .picker").datepicker(
            'setDate',
            $.datepicker.formatDate('mm/dd/yy', start_date)
          );
        }
        self.$el.find(".date-field.end-date .picker").datepicker(
          'option','minDate', new Date(start_date)
        );

      });
    if (this.model.id) {
      this.syncView();
    }
    return this;
  },
});

FancyBackbone.Views.Product.NewTaxView = Backbone.View.extend({
  events: {
    'change input.charge-taxes-button': 'onChangeChargeTaxesButton',
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
  syncModel: function() {
    var $chargeTaxButton = this.$el.find("input.charge-taxes-button");
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
  syncView: function() {
    if (this.model.get('tax_code')) {
      this.$el.find("input.charge-taxes-button").prop("checked", true);
      this.$el.find(".tax-cloud-view").show();
    }
  },
  render: function() {
    if (this.model.id) {
      this.syncView();
    }
    return this;
  }
});

FancyBackbone.Views.Product.NewStatusView = Backbone.View.extend({

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
  			this.$el.find('input#status_activated').prop('checked', true)
  		} else {
  			this.$el.find('input#status_deactivated').prop('checked', true)
  		}
  		if (!this.model.get('seller_owns_thing')) {
  			this.$el.find('input#status_activated').prop('disabled', true)
  			this.$el.find('.status .label .tooltip').show();
  		}
      if (this.model.get('marked_soldout')) {
        this.$el.find('input#marked_soldout').prop('checked', true);
      }
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

FancyBackbone.Views.Product.ShippingRateRuleTableView = Backbone.View.extend({
  template: FancyBackbone.Utils.loadTemplate("product_shipping_rate_rule_table"),
  initialize: function(options) {
    this.data = options.data;
  },
  render: function() {
    this.$el.html(this.template(this.data));
    if (this.data.country_code == 'us') {
      this.$el.find("table").addClass("usa");
    } else {
      this.$el.find("table").addClass("world");
    }
    return this;
  },
});

FancyBackbone.Views.Product.ShippingRateGroupView = Backbone.View.extend({
  renderShippingRateRule: function(shippingRateRule) {
    var tableView = new FancyBackbone.Views.Product.ShippingRateRuleTableView({
      data: shippingRateRule
    });
    this.$el.append(tableView.render().$el);
  },
  renderShippingRateRules: function(shippingRateRules) {
    _.map(shippingRateRules, this.renderShippingRateRule, this);
  },
  render: function() {
    var that = this;
    this.model.fetch().success(function() {
      that.renderShippingRateRules(that.model.get('shipping_rate_rules'));
    });
    return this;
  },
});

FancyBackbone.Views.Product.NewShippingView = Backbone.View.extend({
  events: {
    'change select': 'onSelectChange',
    'change input.ships-internationally': 'onChangeShipInternationally',
    'change input[name="shipping-type"]': 'onChangeShippingType',
    'click .select-rate': 'showShippingRatesPopup',
  },
  showShippingRatesPopup: function() { 
    $.dialog('show_rate').open(); 
  },
  onChangeShipInternationally: function() {
    var $intl_ship = this.$el.find("input.ships-internationally");
    var international_shipping = $intl_ship.prop("checked");
    if (international_shipping) {
      this.$el.find("input.charge-international-shipping").prop('disabled', false);
    } else {
      this.$el.find("input.charge-international-shipping").prop('disabled', true);
      this.$el.find("input.charge-international-shipping").prop('checked', false);
    }
  },
  onChangeShippingType: function() {
    var $selected_type = this.$el.find('input[name="shipping-type"]:checked');
    var selected_type = $selected_type.val();
    if (selected_type == '1' || selected_type =='2') {
        this.$el.find("dd.custom-shipping").hide();
        this.$el.find("dd.system-rule").hide();
        this.$el.find("dd.tiered-shipping").show();
        this.$el.find("dd.shipping-window").show();
        this.onSelectChange();
    }
    else if(selected_type == '0'){
        this.$el.find("dd.custom-shipping").show();
        this.$el.find("dd.system-rule").hide();
        this.$el.find("dd.tiered-shipping").hide();
        this.$el.find("dd.shipping-window").show();
    }
    else {
        this.$el.find("dd.custom-shipping").hide();
        this.$el.find("dd.system-rule").show();
        this.$el.find("dd.tiered-shipping").hide();
        this.$el.find("dd.shipping-window").show();
        $(".data-field .usa table").empty().append($(".weight-based-rates .domestic").clone());
        $(".data-field .world table").empty().append($(".weight-based-rates .international").clone());
    }
  },
  updateShippingRateGroupView: function(shippingRateGroupId) {
    if (this.shippingRateGroupView) {
      this.shippingRateGroupView.remove();
    }
    
    var shippingRateGroup = this.shippingRateGroupCollection.get(shippingRateGroupId);
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
  },
  onSelectChange: function() {
    this.updateShippingRateGroupView(this.selectView.getSelectedValue());
  },
  initialize: function() {
    this.shippingRateGroupCollection = window.shippingRateGroupCollection;
  },
  renderShippingRateGroupsSelect: function() {
    this.selectView = new FancyBackbone.Views.Base.SelectView({
      defaultOption: false,
      el: this.$el.find("select"),
      options: _.map(this.shippingRateGroupCollection.models, function(shippingRateGroup) {
        return shippingRateGroup.createSelectOption();
      }),
    }).render();
    this.selectView.selectValue(this.shippingRateGroupCollection.models[0].createSelectOption().value);
    //this.updateShippingRateGroupView(this.selectView.getSelectedValue());
  },
  render: function() {
    this.renderShippingRateGroupsSelect();
    if (this.model.id) {
      this.syncView();
    } else {
      this.$el.find('input[name="shipping-type"]')[2].checked = true;
      this.onChangeShippingType();
    }
    return this;
  },
  syncModel: function() {
    var ships_internationally = this.$el.find('input.ships-internationally').is(':checked');
    var charge_domestic = this.$el.find('input.charge-domestic-shipping').is(':checked');
    var charge_international = this.$el.find('input.charge-international-shipping').is(':checked');

    this.model.set('international_shipping', ships_internationally);
    this.model.set('charge_domestic_shipping', charge_domestic);
    this.model.set('charge_international_shipping', charge_international);

    var $selected_type = this.$el.find('input[name="shipping-type"]:checked');
    var selected_type = $selected_type.val();
    var shippping_rate_group_id = this.selectView ? this.selectView.getSelectedValue() : -1;
    if (selected_type == '1' || selected_type == '2') {
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
        this.model.set('shipping_rate_group_id', this.selectView.getSelectedValue());
    }
    this.model.set('expected_delivery_day_1', this.$el.find('input.expected_delivery_day_1').val());
    this.model.set('expected_delivery_day_2', this.$el.find('input.expected_delivery_day_2').val());
    this.model.set('expected_delivery_day_intl_1', this.$el.find('input.expected_delivery_day_intl_1').val());
    this.model.set('expected_delivery_day_intl_2', this.$el.find('input.expected_delivery_day_intl_2').val());
  },
  syncView: function() {
    var shippingRateGroupId = this.model.get('shipping_rate_group_id');
    if (shippingRateGroupId && this.shippingRateGroupCollection.get(shippingRateGroupId)) {
      this.selectView.selectValue(shippingRateGroupId);
      this.updateShippingRateGroupView(shippingRateGroupId);
      this.$el.find('input.use-tiered-shipping').click();
    } else {
      this.$el.find('input.use-system-shipping').click();
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
        this.$el.find('input.ships-internationally').prop('checked', true);
    }else{
        this.$el.find('input.ships-internationally').prop('checked', false);
    }
    if (this.model.get('charge_international_shipping')) {
        this.$el.find('input.charge-international-shipping').prop('checked', true);
    }else{
        this.$el.find('input.charge-international-shipping').prop('checked', false);
    }
    if (this.model.get('charge_domestic_shipping')) {
        this.$el.find('input.charge-domestic-shipping').prop('checked', true);
    }else{
        this.$el.find('input.charge-domestic-shipping').prop('checked', false);
    }
    var use_custom_shipping = this.model.get('use_custom_shipping');
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
        if (domestic_incremental) {
           this.$el.find('input.custom-incremental-domestic').val(domestic_incremental);
        }

        var international_incremental = this.model.get('custom_international_incremental_fee');
        if (international_incremental) {
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

  }
});

FancyBackbone.Views.Product.NewMiscellaneousView = Backbone.View.extend({
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

FancyBackbone.Views.Product.NewView = Backbone.View.extend({
  events: {
    'click .add-detail button.btn-add': 'onAddOptionClick',
    'click button.btn-save': 'onSaveClick',
    'click button.btn-delete': 'onDeleteClick',
  },
  highlightErrors: function(errorFields) {
    //if (errorFields) {      
    //  window.alert("Please check these fields: " +  $.map(errorFields, function(t){var words = t.split("_"); return $.map(words, function(t){return t.charAt(0).toUpperCase() + t.slice(1)}).join(" ")  }).join(", ") );
    //}
    var that = this;
    _.each(errorFields, function(errorField) {
      var field = that.$el.find("*[name=" + errorField + "]");
      if( !field.length) field = that.$el.find("*[name=" + errorField.replace('_','-') + "]")
      field.parent().addClass("error");
      if (errorField == 'options') {
        that.$el.find('.multiple-option-frm').addClass("error");
      }
      if(errorField == 'image'){
        that.$el.find('.add-photos > dd.data-cont').addClass("error");
      }
      if(errorField == 'description'){
        that.$el.find('p.description').addClass("error");
      }
      if(errorField == 'tax_code'){
        that.$el.find('div.tax-cloud-view').addClass("error");
      }
      if(errorField == 'end_date'){
        that.$el.find('div.end-date.date-field').addClass("error");
      }
      if(errorField == 'shipping_options') {
        that.$el.find('label.shipping-rate-label').addClass("error");
        alertify.alert('Please use Flat Rates or Custom Rates for items over 150 lbs.');
      }
      if(errorField == 'expected_delivery_day' || errorField == 'expected_delivery_day_intl') {
        that.$el.find('li.'+errorField).addClass("error");
      }
      if($.inArray(errorField, ['weight', 'height', 'length', 'width'])!=-1){
        that.$el.find("p.weight-based").addClass("error");
        if( that.model.get('use_warehouse')){
          that.$el.find("p.weight-based").html("You are using Fancy Warehouse. Please fill out dimensions and weight.");
        }else{
          that.$el.find("p.weight-based").html("This product uses weight-based shipping rate. Please fill out dimensions and weight.");
        }
      }
      that.$el.find(".error-comment").show();
    });
  },
  prefillOptionDimension: function() { 
    $('div.popup.add-option div.ltxt p.length input').val(this.$el.find('input[name=length]').val());
    $('div.popup.add-option div.ltxt p.height input').val(this.$el.find('input[name=height]').val());
    $('div.popup.add-option div.ltxt p.width input').val(this.$el.find('input[name=width]').val());
    $('div.popup.add-option div.ltxt p.weight input').val(this.$el.find('input[name=weight]').val())
  },
  onAddOptionClick: function(event) {
    event.preventDefault();
    window.popups.viewAddSaleItemOptions.render(null, this.model, false);
    this.prefillOptionDimension(); 
  },
  successCallback: function() {
    window.location.pathname = "/merchant/products";
  },
  onSaveClick: function(event) {
    event.preventDefault();
    this.syncModel();
    var validated = true;
    this.$el.find(".error-comment").hide();
    this.$el.find(".error").removeClass("error");
    try {
      this.model.validateFields();
    } catch (errors) {
      this.highlightErrors(errors);
      validated = false;
    }
    if (validated) {
      this.$el.find("button.btn-save").prop("disabled", true);
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
        that.$el.find("button.btn-save").prop("disabled", false);
      });
    }
  },
  onDeleteClick: function(event) {
    event.preventDefault();
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
  syncModel: function() {
    _.each(this.subviews, function(subview) {
      subview.syncModel();
    });
  },
  createNewInfoView: function() {
    return new FancyBackbone.Views.Product.NewInfoView({
      el: this.$el.find(".add-info"),
      model: this.model
    }).render();
  },
  createNewTagsView: function() {
    return new FancyBackbone.Views.Product.NewTags({
      el: this.$el.find(".add-tags"),
      model: this.model,
    }).render();
  },
  createNewDetailView: function() {
    return new FancyBackbone.Views.Product.NewDetailView({
      el: this.$el.find(".add-detail"),
      model: this.model
    }).render();
  },
  createNewImageListView: function() {
    return new FancyBackbone.Views.Product.NewImageListView({
      el: this.$el.find(".add-photos"),
      model: this.model
    }).render();
  },
  createNewDurationView: function() {
    return new FancyBackbone.Views.Product.NewDurationView({
      el: this.$el.find(".add-duration"),
      model: this.model
    }).render();
  },
  createNewTaxView: function() {
    return new FancyBackbone.Views.Product.NewTaxView({
      el: this.$el.find(".add-tax"),
      model: this.model
    }).render();
  },
  createNewStatusView: function() {
    return new FancyBackbone.Views.Product.NewStatusView({
      el: this.$el.find(".add-status"),
      model: this.model
    }).render();
  },
  createNewShippingView: function() {
    return new FancyBackbone.Views.Product.NewShippingView({
      el: this.$el.find(".add-shipping"),
      model: this.model
    }).render();
  },
  createNewMiscellaneousView: function () {
    return new FancyBackbone.Views.Product.NewMiscellaneousView({
      el: this.$el.find(".add-miscellaneous"),
      model: this.model
    }).render();

  },
  render: function() {
    this.subviews = [
      this.createNewInfoView(this.hcc),
      this.createNewTagsView(),
      this.createNewDetailView(),
      this.createNewImageListView(),
      this.createNewDurationView(),
      this.createNewDurationView(),
      this.createNewTaxView(),
      this.createNewShippingView(),
      this.createNewStatusView(),
      this.createNewMiscellaneousView(),
    ];
    this.$el.find('.tooltip').each(function(){
      var w = $(this).find('em').width();
      $(this).find('em').css('margin-left',-w/2-5+'px');
    });
    return this;
  },
});

FancyBackbone.Views.Product.AdminSeniorNewInfoView = FancyBackbone.Views.Product.NewInfoView.extend({
  syncModel: function() {
    this._super();
    //this.model.set('unit_cost', this.$el.find('input[name=unit-cost]').val().trim());
  },
  syncView: function() {
    this._super();
    //this.$el.find("input[name=unit-cost]").val(this.model.get('unit_cost'));
  },
});

FancyBackbone.Views.Product.AdminSeniorNewDetailView = FancyBackbone.Views.Product.NewDetailView.extend({
  events: {
    'click .multiple-option-frm a.btn-del': 'onRemoveOptionClick',
    'click .multiple-option-frm a.btn-edit': 'onEditOptionClick',
  },
  createOption: function() {
    var productOption = this._super();
    //var $editingRow = this.getEditingRow();
    //productOption.set('unit_cost', $('div.popup.add-option div.ltxt p.unit-cost input').val().trim());

    return productOption;
  },
  createNewOptionRow: function(option) {
    var $newOptionRow = this._super(option);
    return $newOptionRow;
  },
  onEditOptionClick: function(event) {
    event.preventDefault();
    var $row = $(event.currentTarget).closest("dl");
    var option = $row.data("model");
    window.popups.viewAddSaleItemOptions.render(option, this.model, true);
  },
  onRemoveOptionClick: function(event) {
    event.preventDefault();
    var $row = $(event.currentTarget).closest("dl");
    var option = $row.data("model");
    this.model.get("options").remove(option);
    $row.remove();
  },

});

FancyBackbone.Views.Product.AdminSeniorNewView = FancyBackbone.Views.Product.NewView.extend({
  onAddOptionClick: function(event) {
    event.preventDefault();
    if (window.popups && window.popups.viewAddSaleItemOptions) { 
      window.popups.viewAddSaleItemOptions.render(null, this.model, true);
      this.prefillOptionDimension();  
    }
  },
  createNewDetailView: function() {
    return new FancyBackbone.Views.Product.AdminSeniorNewDetailView({
      el: this.$el.find(".add-detail"),
      model: this.model
    }).render();
  },
  createNewInfoView: function() {
    return new FancyBackbone.Views.Product.AdminSeniorNewInfoView({
      el: this.$el.find(".add-info"),
      model: this.model
    }).render();
  },
});
