FancyBackbone.Models.Product = FancyBackbone.Models.Product || {};
FancyBackbone.Collections.Product = FancyBackbone.Collections.Product || {};

FancyBackbone.Models.Product.Product = Backbone.RelationalModel.extend({
  urlRoot: function() {
    var sellerId = this.get('user') ? this.get('user').id : this.get('seller_id_str');
    return _.str.sprintf("/rest-api/v1/seller/%s/products", sellerId);
  },
  save: function(key, value, options) {
      var seller_tags = this.get('seller_tags'),
          seller_collections = this.get('seller_collections'),
          harmonized_commodity_code_list = this.get('harmonized_commodity_code_list');
      this.unset('seller_tags').unset('seller_collections').unset('harmonized_commodity_code_list');
      var result = Backbone.RelationalModel.prototype.save.call(this, key, value, options);
      this.set('seller_tags', seller_tags).set('seller_collections', seller_collections).set('harmonized_commodity_code_list', harmonized_commodity_code_list);
      return result;
  },
  idAttribute: 'id_str',
  relations: [{
    type: Backbone.HasMany,
    key: 'images',
    relatedModel: 'Product.Image',
    collectionType: 'Product.ImageCollection',
    reverseRelation: {
      key: 'product',
      includeInJSON: false,
    }
  }, {
    type: Backbone.HasMany,
    key: 'videos',
    relatedModel: 'Product.Video',
    collectionType: 'Product.VideoCollection',
    reverseRelation: {
      key: 'product',
      includeInJSON: false,
    }
  }, {
    type: Backbone.HasMany,
    key: 'options',
    relatedModel: 'Product.Option',
    collectionType: 'Product.OptionCollection',
    collectionOptions: function(product) {
      return {
        url: product.url() + "/options",
      };
    },
    reverseRelation: {
      key: 'product',
      includeInJSON: false,
    }
  }, {
    type: Backbone.HasMany,
    key: 'categories',
    relatedModel: 'Product.Category',
    collectionType: 'Product.CategoryCollection',
    collectionOptions: function(product) {
      return {
        url: product.url() + "/categories",
      };
    },
    reverseRelation: {
      key: 'product',
      includeInJSON: false,
    }
  }],
  is_locked_field: function(field) {
    var lockfields = this.get('lockfields');
    for(var i in lockfields) {
        if(field==lockfields[i]) return true;
    }
    return false;
  },
  is_affiliate_product: function() {
    var user = this.get('user');
    if(user && user.id!=this.get('seller_id')) {
        return true;
    }
    return false;
  },
  validateFields: function() {
    var that = this;
    var validationErrors = [];
    if (!this.get('title')) {
      validationErrors.push('title');
    }
    if (!this.get('description') && (this.get('user').id != "31500760")) {
      validationErrors.push('description');
    }

    if (!this.get("options").length && (!this.get('retail_price') || !this.get('retail_price').replace(/,/g, '').isNumber())) {
      validationErrors.push('price');
    }
    if (!this.get("options").length && this.get('retail_price')!=this.get('price') && this.get('price')!='' && !this.get('price').replace(/,/g, '').isNumber() ) {
      validationErrors.push('sale_price');
    }

    if( ( this.get('charge_domestic_shipping') || this.get('charge_international_shipping') )
        && ( this.get('use_warehouse') || (this.get('use_custom_shipping') == 0 && this.get('shipping_rate_group_id') == -1) ) ){
      _.each(['weight', 'height', 'length', 'width'], function(fieldName) {
        if (fieldName != "weight" && !this.get(fieldName)) return;
        if (!this.get(fieldName) || !this.get(fieldName).isNumber()) {
          validationErrors.push(fieldName);
        }
      }, this);


      //if (this.get("options").length){
      // this.get('options').each(function(v){
      //   var errorFields = [];
      //  _.each(['weight', 'height', 'length', 'width'], function(fieldName) {
      //    if (fieldName != "weight" && !v.get('prod_'+fieldName)) return;
      //    if (!v.get('prod_'+fieldName) || !v.get('prod_'+fieldName).isNumber()) {
      //      errorFields.push(fieldName);              
      //    }
      //  }, this);
      //    if(errorFields.length){
      //      validationErrors.push("option "+v.id+" "+errorFields.join(","));
      //    }          
      //  })      
      //}
    }

    if (this.get('start_date') && moment(this.get('start_date', 'YY/MM/DD')) == 'Invalid Date'){
      validationErrors.push(start_date)
    }
    if (this.get('end_date')) {
      var startDate = moment(this.get('start_date', 'YY/MM/DD'));
      var endDate = moment(this.get('start_date', 'YY/MM/DD'));
      if ( moment(this.get('end_date', 'YY/MM/DD')) == 'Invalid Date'){
        validationErrors.push(end_date);
      }else if (endDate < startDate) {
        validationErrors.push("duration");
      }
    }

    var this_quantity = this.get('quantity');
    if (this_quantity !== null && this_quantity!=='' && typeof(this_quantity)=='string' && this_quantity.toLowerCase().startsWith('inf')) {
      validationErrors.push(fieldName);
    }

    _.each(['tax_code'], function(fieldName) {
      if (this.get(fieldName) !== null && !this.get(fieldName).isInt()) {
        validationErrors.push(fieldName);
      }
    }, this);

    if (this.get("use_custom_shipping") == 1){
      if( this.get('charge_domestic_shipping') && !this.get("custom_domestic_charge") ) validationErrors.push("custom_charge_domestic");
      //if( !this.get("custom_domestic_incremental_fee") ) validationErrors.push("custom_incremental_domestic");

      if( this.get("international_shipping")){
        if( this.get('charge_international_shipping') && !this.get("custom_international_charge") ) validationErrors.push("custom_charge_international");
        //if( !this.get("custom_international_incremental_fee") ) validationErrors.push("custom_incremental_international");        
      }
    }

    if ( !this.get("shipping_profile_id") || this.get('use_custom_shipping_window') ){
      if (this.get("expected_delivery_day_1") == "" || this.get("expected_delivery_day_2") == "") {
        validationErrors.push("expected_delivery_day");
      }
      if (parseInt(this.get("expected_delivery_day_1")) > parseInt(this.get("expected_delivery_day_2"))) { 
        validationErrors.push("expected_delivery_day"); 
      }
      if (this.get('international_shipping')) { 
        if (this.get("expected_delivery_day_intl_1") == "" || this.get("expected_delivery_day_intl_2") == "") {
          validationErrors.push("expected_delivery_day_intl");
        }
        else if (parseInt(this.get("expected_delivery_day_intl_1")) > parseInt(this.get("expected_delivery_day_intl_2"))) {
          validationErrors.push("expected_delivery_day_intl");
        }
      }
    }
    
    if (!this.get("images").length){
      validationErrors.push("image");
    }
    
    if (!this.get("categories").length){
      validationErrors.push("category_ids");
    }

    var isDiscounted = this.get('retail_price') && ( parseFloat(this.get('retail_price')) > parseFloat(this.get('price') ) );
    if (this.get("options").length){
        this.get('options').each(function(v){
            if(!v.get('name')) validationErrors.push("option "+(v.id||v.get('tid'))+" name");
            if(!v.get('retail_price') || !v.get('retail_price').replace(/,/g, '').isNumber() ) validationErrors.push("option "+(v.id||v.get('tid'))+" price");
            if(v.get('price') && v.get('price')!=v.get('retail_price') && !v.get('price').replace(/,/g, '').isNumber() ) validationErrors.push("option "+(v.id||v.get('tid'))+" sale_price");
            var retail_price = v.get('retail_price');
            if(retail_price > 0 ){
                var isDiscountedOption = retail_price && ( parseFloat(retail_price) >= parseFloat(v.get('price') ) );
                if(isDiscounted && !isDiscountedOption) validationErrors.push("option "+(v.id||v.get('tid'))+" retail_price cannot be lower than it's price ");
            }
        })      
    }

    if (this.get("option_meta").length){
      $(this.get('option_meta')).each(function(i,v){
        if(!v.name) validationErrors.push("option_meta name");
        if(!v.values.length) validationErrors.push("option_meta values "+v.name);
      })
    }

    var returnPolicy = this.get("return_policy");
    var customReturnPolicyDays = this.get("custom_return_policy_days");
    if (!returnPolicy) {
      validationErrors.push("return_policy");
    } else {
      if (returnPolicy == 4 && (!customReturnPolicyDays || !customReturnPolicyDays.isNumber())) { // custom day returns
        validationErrors.push("custom_return_policy_days");
      }
    }

    var exchangePolicy = this.get("exchange_policy");
    var customExchangePolicyDays = this.get("custom_exchange_policy_days");
    if (!exchangePolicy) {
      validationErrors.push("exchange_policy");
    } else {
      if (exchangePolicy == 4 && (!customExchangePolicyDays || !customExchangePolicyDays.isNumber())) { // custom day exchanges
        validationErrors.push("custom_exchange_policy_days");
      }
    }

    var customReturnExchangePolicyDescription = this.get('custom_return_exchange_policy_description');
    if (customReturnExchangePolicyDescription !== null) {
      if (!customReturnExchangePolicyDescription) {
        validationErrors.push("return_exchange_policy_description");
      }
    }

    if (!_.isEmpty(validationErrors)) {
      throw validationErrors;
    }
  },
}, {
  STATUS: ['all', 'active', 'affiliate', 'pending', 'sold_out', 'expired', 'coming_soon', 'awaiting', 'on_sale'],
  isValidStatus: function(status) {
    return _.include(FancyBackbone.Models.Product.Product.STATUS, status);
  }
});

FancyBackbone.Collections.Product.ProductCollection = Backbone.Collection.extend(_.extend(
  {},
  FancyBackbone.Mixins.PaginatedCollectionMixin,
  {
    url: function() {
      return _.str.sprintf("/rest-api/v1/seller/%s/products", window.seller.id);
    },
    parse: function(response) {
      this.parsePageInfo(response);
      return response.products;
    },
  }
));
