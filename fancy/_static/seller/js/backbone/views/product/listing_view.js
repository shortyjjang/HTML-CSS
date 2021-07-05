FancyBackbone.Views.Product = FancyBackbone.Views.Product || {};

FancyBackbone.Views.Product.OptionListItemView = Backbone.View.extend({
  tagName: 'tr',
  template: FancyBackbone.Utils.loadTemplate('product_option_list_item'),
  events: {
    'click a.add_qty': 'onAddQuantityClick'
  },
  onAddQuantityClick: function (event) {
      event.preventDefault();
      window.popups.addQuantity.render(this, this.model.get('product'), this.model);
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },
});

FancyBackbone.Views.Product.OptionListView = Backbone.View.extend({
  tagName: 'tr',
  template: FancyBackbone.Utils.loadTemplate("product_option_list"),
  initialize: function(options) {
    this.collection = options.collection;
    this.collectionDfd = this.collection.fetch({
      data: _.pick(window.params, ['seller_id'])
    });
  },
  renderOptionItem: function(option) {
    var view = new FancyBackbone.Views.Product.OptionListItemView({model: option}).render();
    this.$el.find("tbody").append(view.$el);
  },
  renderOptionItemViews: function() {
    _.map(this.collection.models, this.renderOptionItem, this);
  },
  render: function(options) {
    this.$el.html(this.template());
    var that = this;
    this.collectionDfd.success(function() {
      that.renderOptionItemViews();
      that.$el.find(".infscr-loading").hide();
      that.$el.find(".table").show();
    });
    return this;
  },
});

FancyBackbone.Views.Product.ListingItemView = Backbone.View.extend({
  tagName: 'tr',
  template: FancyBackbone.Utils.loadTemplate("product_listing_item"),
  events: {
    'click a.toggle-option': 'onOptionsClick',
    'click a.tooltip.end-date': 'onEndDateClick',
    'click a.add_qty': 'onAddQuantityClick',
    "click a.delete-sale": "onDeleteClick",
    "click a.del-sale": "onDeleteClick",
	'mouseover span.thumbnail' : 'onThumbnailOver',
	'mouseout span.thumbnail' : 'onThumbnailOut',
	'mousemove span.thumbnail' : 'onThumbnailMove'
  },
  onEndDateClick: function (event) {
      event.preventDefault();
      window.popups.changeEndDate.render(this, this.model);
  },
  onAddQuantityClick: function (event) {
      event.preventDefault();
      window.popups.addQuantity.render(this, this.model);
  },
  onOptionsClick: function(event){
    event.preventDefault();
    if (this.optionListView) {
      this.optionListView.remove();
      this.optionListView = null;
    } else {
      this.optionListView = new FancyBackbone.Views.Product.OptionListView({collection: this.model.get('options')}).render();
      this.$el.after(this.optionListView.$el);
    }
  },
  onDeleteClick: function(event) {
    event.preventDefault();
    if( !confirm("Are you sure you want to delete this sale item?") ) return;
    this.model.destroy().success(function() {
      window.location.pathname = "/merchant/products";
      window.location.reload(true);
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
  onThumbnailOver: function(event) {
	if (!this.$photobox) {
	  this.$photobox = $('body > .photobox');
	  if (!this.$photobox.length) {
		this.$photobox = $('<div class="photobox" />').appendTo('body');
	  }
	}

	var $target = $(event.currentTarget), stamp = new Date().getTime();
	var $photobox = this.$photobox.show().addClass('loading').attr('stamp', stamp).find('>img').remove().end();

	var img = new Image();
	img.onload = function() {
	  if ($photobox.attr('stamp') != stamp+'') return;
	  this.setAttribute('data-width', this.width);
	  this.setAttribute('data-height', this.height);
	  $photobox.removeClass('loading').append(this);

	  event.type = 'mousemove';
 	  $target.trigger(event);
	};
	img.src = $target.attr('data-image');

	event.type = 'mousemove';
  	$target.trigger(event);
  },
  onThumbnailOut: function(event) {
	this.$photobox.hide();
  },
  onThumbnailMove: function(event) {
	var loaded = !this.$photobox.hasClass('loading');
	var margin = 10, padding = 6, headerH = 44/* header's height */;
	var $win = $(window), winW = $win.width(), winH = $win.height(), areaW, areaH;
	var $img = this.$photobox.find('>img'), imgW = $img.attr('data-width'), imgH = $img.attr('data-height');

	rightAlign = event.clientX > winW / 2;

	this.$photobox.css({top:event.clientY-15,bottom:'',left:'',right:''});
	if (rightAlign) {
		this.$photobox.css({right: winW-event.clientX + 10});
	} else {
		this.$photobox.css({left: event.clientX + 15});
	}

	if (!loaded) return;

	areaW = (rightAlign ? event.clientX : winW - event.clientX) - margin * 2 - padding * 2;
	areaH = winH - headerH - margin * 2 - padding * 2;

	if (imgW / areaW > imgH / areaH) {
		if (imgW > areaW) {
			imgH *= areaW / imgW;
			imgW = areaW;
		}
	} else {
		if (imgH > areaH) {
			imgW *= areaH / imgH;
			imgH = areaH;
		}
	}
	$img.css({width:imgW, height:imgH});

	var top = Math.min(Math.max(event.clientY - imgH / 2, 44/* header's height*/ + margin), winH - imgH - margin * 2 - padding * 2);
	this.$photobox.css('top', top);
  },
  checked: function(checkedState) {
    var $checkbox = this.$el.find("input[type=checkbox]");
    if (!_.isUndefined(checkedState)) {
      $checkbox.prop("checked", checkedState);
    }
    return $checkbox.prop("checked");
  },
  render: function() {
    var isAffiliateProduct = this.model.is_affiliate_product();
    this.$el.html(this.template(
      _.extend(
        {
          getProductEditURL: function(productId) {
            var queryString = $.param(_.pick(window.params, ['seller_id']));
            return "/merchant/products/" + productId + "/edit?" + queryString;
          },
          getStorefrontURL : function(thingId){
            if( window.seller.get('use_storefront') )
              return "/store/"+ window.seller.get("username")+"/things/"+thingId;
            else
              return null;
          },
          isAffiliateProduct: isAffiliateProduct
        },
        this.model.attributes
      )
    ));
    return this;
  },
});

FancyBackbone.Views.Product.ListingView = Backbone.View.extend({
  ver: 'v1',
  template: FancyBackbone.Utils.loadTemplate("product_listing"),
  events: {
    "click .page-nav-buttons > .next": "onNextButtonClick",
    "click .page-nav-buttons > .prev": "onPrevButtonClick",
    "click .page-buttons > .page:not(.current)": "onPageButtonClick",
    "change thead input[type=checkbox]": "onHeadCheckboxStateChange",
    "change tbody input[type=checkbox]": "onRowCheckboxStateChange",
    // "click .buttons > .btn-del": "onDeleteButtonClick",
    "click ul[name=search-field] a": "onSearchFieldChange",
    "click a.remove": "onSearchTextRemove",
    "keyup input[name=search-text]": "onSearchTextChange",
    "click .bulk .activate-items": "onActivateItems",
    "click .bulk .deactivate-items": "onDeactivateItems",
    "click .bulk .delete-items": "onDeleteItems",
    "click .bulk .delete-affiliate-items": "onDeleteAffiliateItems",
    "click .bulk .manage-tags": "onManageTags",
    "click .bulk .add-to-collections": "onAddToCollections",
    "click .bulk .duplicate-sale-item": "onDuplicateSaleItem",
    "click .bulk .view-sale-item": "onViewSaleItem",
    "click .demo.title": "onClickDemoProduct",
    "click .check_action li a": "onSelectItems",
    "click .dropdown.check span.checkbox": "onItemCheckboxStateChange",
    "click .btn-export":"onClickBtnExport",
    "click .setting-menu .select-product":"onProductAction",
  },
  onSearchFieldChange: function(event) {

    event.preventDefault();
    this.$el.find("ul[name=search-field] a").removeAttr('selected');
    $(event.target).attr('selected','').closest('.dropdown').removeClass('opened');
    var searchField = this.$el.find("ul[name=search-field] a[selected]").attr("value");
    if(searchField=='id'){
      this.$el.find("input[name=search-text]").attr('placeholder','Search ID');
    }else if(searchField=='title'){
      this.$el.find("input[name=search-text]").attr('placeholder','Search Title');
    }else{
      this.$el.find("input[name=search-text]").attr('placeholder','Search');
    }

  },
  onSearchTextChange: function(event) {
    if (event.keyCode == 13) {
      var searchField = this.$el.find("select[name=search-field]").val();
      if(!searchField){
        searchField = this.$el.find("ul[name=search-field] a[selected]").attr("value");
      }
      if(!searchField){
        searchField = 'all';
      }
      var searchText = this.$el.find("input[name=search-text]").val();
      if (searchField && searchText) {
        var query = {
          status: this.productStatus,
          'search-field': searchField,
          'search-text': searchText,
        };
        this.$el.find("a.remove").show();
        var href = FancyBackbone.Utils.makeURL( location.pathname , query) ;
        window.router.navigate(href, {trigger: true});
      }
    }
  },
  onSearchTextRemove: function(event){
    event.preventDefault();
    var searchField = this.$el.find("select[name=search-field]").val();
    if(!searchField){
      searchField = this.$el.find("ul[name=search-field] a[selected]").attr("value");
    }
    if(!searchField){
      searchField = 'all';
    }
    var query = {
        status: this.productStatus,
        'search-field': searchField,
        'search-text': '',
      };
    var href = FancyBackbone.Utils.makeURL( location.pathname , query) ;
    window.router.navigate(href, {trigger: true});
  },
  onRowCheckboxStateChange: function(event) {
    var $headCheckbox = this.$el.find("thead input[type=checkbox]");
    var numChecked = _.filter(this.tableRows, function(row) {
      return row.checked();
    }).length;
    if(this.tableRows)
      $headCheckbox.prop("checked", numChecked == this.tableRows.length);
    this.updateHeader();
  },
  onHeadCheckboxStateChange: function(event) {
    var checkedState = $(event.currentTarget).prop("checked");
    _.each(this.tableRows, function(row) {
      row.checked(checkedState);
    });
  },
  onPageButtonClick: function(event) {
    event.preventDefault();
    var href = $(event.currentTarget).attr('href');
    window.router.navigate(href, {trigger: true});
  },
  onNextButtonClick: function(event) {
    event.preventDefault();
    if (this.collection && this.collection.maxPage > this.currentPage) {
      var href = $(event.currentTarget).attr('href');
      window.router.navigate(href, {trigger: true});
    }
  },
  onActivateItems: function(event) {
    event.preventDefault();
    this.$el.find(".dropdown.bulk").removeClass("opened");
    var ids = '';
    $('.table tbody').find('.title > input:checked').each(function(){
        if(ids.length>0)
            ids += ', ';
        ids +=''+$(this).attr('data-id');
    });
    this.activeItems(ids);
    return false;
  },
  activeItems : function(ids){
    $.ajax({
      url: '/merchant/products/activate-items.json',
      data: _.extend(_.pick(window.params, ['seller_id']), { ids: ids, }),
      dataType: 'json',
      type: 'POST',
      traditional: true,
    }).done(function(data, statusText, xhr) {
        if(data.status_code == 1){
            $('.actions .action-list').toggle();
            window.location.reload(false);
        }
        else if (data.status_code == 0){
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
  onDeactivateItems: function(event) {
    event.preventDefault();
    this.$el.find(".dropdown.bulk").removeClass("opened");
    var ids = '';
    $('.table tbody').find('.title > input:checked').each(function(){
        if(ids.length>0)
            ids += ', ';
        ids +=''+$(this).attr('data-id');
    });
    this.deactiveItems(ids);
    return false;
  },
  deactiveItems: function(ids){
    $.ajax({
      url: '/merchant/products/deactivate-items.json',
      data: _.extend(_.pick(window.params, ['seller_id']), { ids: ids, }),
      dataType: 'json',
      type: 'POST',
      traditional: true,
    }).done(function(data, statusText, xhr) {
        if(data.status_code == 1){
            $('.actions .action-list').toggle();
            window.location.reload(false);
        }
        else if (data.status_code == 0){
            if(data.message){
                alert(data.message);
            }
            else{
                alert(gettext('Please try again later.'));
            }
        }
    }).fail(function() {
      alert(gettext('Please try again later.'));
    });
  },
  onDeleteItems: function(event) {
    event.preventDefault();
    this.$el.find(".dropdown.bulk").removeClass("opened");
    var ids = '';
    var hasActiveItem = false;
    $('.table tbody').find('.title > input:checked').each(function(){
        if($(this).attr("status") == "pending" || $(this).attr("status") == "demo"){
          if(ids.length>0)
              ids += ', ';
          ids +=''+$(this).attr('data-id');
        }else{
          hasActiveItem = true;
        }
    });
    if(hasActiveItem){
      alertify.alert("Active products cannot be deleted. Please deactivate the product from your Products screen first.");
      return;
    }
    this.deleteItems(ids);
    return false;
  },  
  deleteItems: function(ids){
    if( ids=='demo'){
      $('.table tbody').find('tr').remove();
      return;
    }

    if( ids.split(",").length > 1){
      if( !confirm("Are you sure you want to delete "+ids.split(",").length+" products?") ) return;
    }else{
      if( !confirm("Are you sure you want to delete this product?") ) return;
    }

    $.ajax({
      url: '/merchant/products/delete-items.json',
      data: _.extend(_.pick(window.params, ['seller_id']), { ids: ids, }),
      dataType: 'json',
      type: 'POST',
      traditional: true,
    }).done(function(data, statusText, xhr) {
        if(data.status_code == 1){
            $('.actions .action-list').toggle();
            window.location.reload(false);
        }
        else if (data.status_code == 0){
            if(data.message){
                alert(data.message);
            }
            else{
                alert(gettext('Please try again later.'));
            }
        }
    }).fail(function() {
      alert(gettext('Please try again later.'));
    });
  },
  onDeleteAffiliateItems: function(event) {
    event.preventDefault();
    this.$el.find(".dropdown.bulk").removeClass("opened");
    var ids = '';
    var hasActiveItem = false;
    $('.table tbody').find('.title > input:checked').each(function(){
        if(ids.length>0) ids += ', ';
        ids +=''+$(this).attr('data-id');
    });
    this.deleteAffiliateItems(ids);
    return false;
  },  
  deleteAffiliateItems: function(ids){
    if( ids.split(",").length > 1){
      if( !confirm("Are you sure you want to delete "+ids.split(",").length+" affiliate products?") ) return;
    }else{
      if( !confirm("Are you sure you want to delete this affiliate product?") ) return;
    }

    $.ajax({
      url: '/merchant/affiliate-sale-items-edit',
      data: { sale_item_ids: ids.split(",") },
      dataType: 'json',
      type: 'DELETE',
    }).done(function(data, statusText, xhr) {
        if(data.status_code == 1){
            $('.actions .action-list').toggle();
            window.location.reload(false);
        }
        else if (data.status_code == 0){
            if(data.message) {
                alert(data.message);
            } else {
                alert(gettext('Please try again later.'));
            }
        }
    }).fail(function() {
      alert(gettext('Please try again later.'));
    });
  },
  onManageTags: function(event) {
    event.preventDefault();
    this.$el.find(".dropdown.bulk").removeClass("opened");
    var id = $('.table tbody').find('.title > input:checked').eq(0).attr('data-id');
    this.manageTags(id);
  },
  manageTags: function(id){
    window.popups.manageTags.open(this.collection._byId[id]);
  },
  onAddToCollections: function(event) {
    event.preventDefault();
    this.$el.find(".dropdown.bulk").removeClass("opened");
    var ids = '';
    $('.table tbody').find('.title > input:checked').each(function(){
        if(ids.length>0)
            ids += ', ';
        ids +=''+$(this).attr('data-id');
    });    
    this.addToCollections(ids);
  },
  addToCollections: function(ids){
    window.popups.addToCollections.open(ids); 
  },
  onDuplicateSaleItem: function(event) {
    event.preventDefault();
    this.$el.find(".dropdown.bulk").removeClass("opened");
    var id = $('.table tbody').find('.title > input:checked').eq(0).data('id');
    this.duplicateSaleItem(id);
  }, 
  duplicateSaleItem: function(id){

    $('#content .wrapper').addClass('loading');
    $.ajax({
        url: '/merchant/products/duplicate-item.json',
        data: _.extend(_.pick(window.params, ['seller_id']), { id: id, }),
        dataType: 'json',
        type: 'POST',
        traditional: true,
    }).done(function(data, statusText, xhr) {
        $('#content .wrapper').removeClass('loading');
        if(data.status_code == 1){
            $('.actions .action-list').toggle();
            window.location.reload(false);
        }
        else if (data.status_code == 0){
            if(data.message){
                alert(data.message);
            }
            else{
                alert(gettext('Please try again later.'));
            }
        }
    }).fail(function() {
        $('#content .wrapper').removeClass('loading');
        alert(gettext('Please try again later.'));
    });
  },
  onViewSaleItem: function(event) {
    event.preventDefault();
    this.$el.find(".dropdown.bulk").removeClass("opened");
    var url = $('.table tbody').find('.title > input:checked').eq(0).closest("td").find("input[name=saleitemurl]").val();
    this.viewSaleItem(url);
  },
  viewSaleItem: function(url){
    if(url){
      window.open(url);
    }
  },
  onProductAction: function(event){
    var $sel = $(event.target);
    var action = $sel.attr('data-value');
    if(!action) return;
    
    $sel.closest('.setting-menu').removeClass('opened');

    var sale_id = $sel.closest('ul').attr('sale-id');
    var $tr =  $sel.closest("tr");

    if(this.productStatus=='affiliate' && action!='delete-affiliate-items') {
        alert("Only delete to affiliate product is allowed.");
        return;
    }

    switch(action){
      case "activate-items":
        this.activeItems(sale_id);  
        break;
      case "deactivate-items":
        this.deactiveItems(sale_id);  
        break;
      case "delete-items":
        if($tr.find("input:checkbox").attr('status')!='pending'){
          alertify.alert("Active products cannot be deleted. Please deactivate the product from your Products screen first.");
          return;
        }
        this.deleteItems(sale_id);  
        break;
      case "delete-affiliate-items":
        this.deleteAffiliateItems(sale_id);  
        break;
      case "manage-tags":
        this.manageTags(sale_id);  
        break;
      case "add-to-collections":
        this.addToCollections(sale_id);  
        break;
      case "duplicate-sale-item":
        this.duplicateSaleItem(sale_id);  
        break;
      case "view-sale-item":
        var url = $tr.find("input[name=saleitemurl]").val();
        this.viewSaleItem(url);  
        break;
      case "edit":
        location.href = $sel.closest('tr').find('.item a').attr('href');
        break;
    }
  },
  onClickDemoProduct: function(event) {
    demoPopup = window.popups.demoProductHelp;
    demoPopup.render();
    demoPopup.open();
  },
  onPrevButtonClick: function(event) {
    event.preventDefault();
    if (this.collection && this.currentPage > 1) {
      var href = $(event.currentTarget).attr('href');
      window.router.navigate(href, {trigger: true});
    }
  },
  onSelectItems: function(event){
    event.preventDefault();
    var $this = $(event.target);
    $this.closest(".dropdown").removeClass("opened");
    var status = $this.closest("li").attr("data-status");
    var target = $("div.table").find(".title > input[type=checkbox]");
    if(status == "all"){
      target.attr('checked','checked');
    }else{
      target.removeAttr('checked');
      if(status != "none"){
        target.filter("[status='"+status+"']").attr('checked','checked');
      }
    }
    this.updateHeader();
  },
  onItemCheckboxStateChange: function(event) {
    var $this = $(event.target);
    if($this.hasClass('checked')){
      $("div.table").find(".title > input[type=checkbox]").removeAttr('checked');
    }else{
      $("div.table").find(".title > input[type=checkbox]").attr('checked','checked');
    }
    this.updateHeader();
  },
  onClickBtnExport: function(e){
      var href = $(e.target).attr('_href');
      var ids = '';
      $('.table tbody').find('.title > input:checked').each(function(){
          if(ids.length>0)
              ids += ',';
          ids +=''+$(this).attr('data-id');
      });    
      if(ids){
        href += "&sale_id="+ids;
      }else if( window.productListingSubnavView.activeTab !='all' ){
        href += "&status="+window.productListingSubnavView.activeTab
      }
      $(e.target).attr('href',href);
  },
  updateHeader: function(){
    var target = $("div.table").find(".title > input[type=checkbox]");
    var checked = target.filter(":checked");
    var unchecked = target.not(":checked");
    if(!unchecked.length){
      this.$el.find("div.dropdown.check > span.checkbox").addClass('checked all');
    }else if(checked.length){
      this.$el.find("div.dropdown.check > span.checkbox").removeClass('all').addClass('checked');
    }else{
      this.$el.find("div.dropdown.check > span.checkbox").removeClass('checked all');
    }
    var $action = this.$el.find("div.dropdown.bulk > a");
    $action.next().removeAttr('style');
    if(this.productStatus=="affiliate" && checked.length>0) {
	   this.$el.find("div.dropdown.bulk").removeClass('disabled');
      $action.html("<b>"+checked.length+"</b> Actions");
      $action.next().find("li").hide().end().find("li[type=affiliate]").show();
    }else if(checked.length==1){
	   this.$el.find("div.dropdown.bulk").removeClass('disabled');
      $action.html("<b>"+checked.length+"</b> Actions");
      $action.next().find("li").hide().end().find("li[type=single]").show();

      var status = $('.table tbody').find('.title > input:checked').attr('status');
      if( status != 'pending' && status != 'demo'){
        $action.next().find("li[type=single] .activate-items").parent().hide();        
      }else{
        $action.next().find("li[type=single] .deactivate-items").parent().hide();
        $action.next().find("li[type=single] .activate-items").parent().next("li.hr").show();
      }
      if( status != 'active' && status != 'sold out' ){
        $action.next().find("li[type=single] .view-sale-item").parent().hide();
      }
      $action.next().find("li[type=single] .delete-items").parent().next("li.hr").show();
    }else if(checked.length>1){
	   this.$el.find("div.dropdown.bulk").removeClass('disabled');
      $action.html("<b>"+checked.length+"</b> Actions");
      $action.next().find("li").hide().end().find("li[type=bulk]").show();

      if( !$('.table tbody').find('.title > input[status=pending]:checked').length ){
        $action.next().find("li[type=bulk] .activate-items").parent().hide();
      }else{
        $action.next().find("li[type=bulk] .activate-items").parent().next("li.hr").show();
      }
      if( !$('.table tbody').find('.title > input[status=pending]:checked').length ){
        $action.next().find("li[type=bulk] .delete-items").parent().hide();
      }
      $action.next().find("li[type=bulk] .delete-items").parent().next("li.hr").show();
    }else{
	   this.$el.find("div.dropdown.bulk").addClass('disabled');
      $action.text("Select Products");
      $action.next().hide().find("li").hide().end();
    }
    /*if( !checked.length){
      this.$el.find("p.selected-notify").hide();
    }else{
      this.$el.find("p.selected-notify").show().find("b").text( checked.length );
    }*/
  },
  updateContents: function(productStatus, page, search, sort) {
    this.$el.empty();
    this.search = search;
    this.sort = sort;
    this.currentPage = page;
    this.productStatus = productStatus;
    this.collection = null;
    this.render();
    this.collection = window.seller.get("products");
    var that = this;
    this.collection.fetch({
      reset: true,
      data: {
        status: productStatus,
        page: page,
        search: search,
        sort: sort,
      },
    }).success(function() {
      that.render();
    });
  },
  getURLOfPage: function(page) {
    var queryDict = _.extend(
      _.pick(window.params, ['seller_id']),
      {
        status: this.productStatus,
        page: page,
      }
    );
    if (this.search) {
      _.extend(queryDict, {
        'search-field': this.search.field,
        'search-text': this.search.text,
      });
    }
    if (this.sort) {
      _.extend(queryDict, {
        sort: this.sort['sort'],
        ascending: this.sort['ascending'],
      });
    }
    var queryString = $.param(queryDict);
    return location.pathname + "?" + queryString;
  },
  getStatusOfColumn: function(column) {
    var status = '';
    if(this.sort) {
      if(this.sort['sort'] == column) {
        var ascending = false;
        if(this.sort['ascending'] == true || this.sort['ascending'] == 'true')
            ascending = true;

        if(ascending)
          status = 'up';
        else
          status = 'down';
      }
    } else if(column == 'id') {
      status = 'down';
    }
    return status;
  },
  getURLOfColumn: function(column) {
    var queryDict = _.extend(
      _.pick(window.params, ['seller_id']),
      {
        status: this.productStatus,
      }
    );
    if (this.search) {
      _.extend(queryDict, {
        'search-field': this.search.field,
        'search-text': this.search.text,
      });
    }

    var sort_type = column;
    var ascending = true;

    if (this.sort) {
      if(this.sort['sort'] == column) {
        if(this.sort['ascending'] == true || this.sort['ascending'] == 'true')
            ascending = false;
      }
    } else if (sort_type == 'id') {
        ascending = false;
    }

    _.extend(queryDict, {
        sort: sort_type,
        ascending: ascending,
      });

    var queryString = $.param(queryDict);
    return location.pathname + "?" + queryString;
  },
  render: function() {

    if (this.collection && (this.collection.length > 0 || this.productStatus != 'all' || this.search)) {
      var queryString = $.param(_.pick(window.params, ['seller_id']));

      this.$el.html(this.template({
        currentPage: this.collection.currentPage,
        maxPage: this.collection.maxPage,
        productStatus: this.productStatus,
        getURLOfPage: _.bind(this.getURLOfPage, this),
        getURLOfColumn: _.bind(this.getURLOfColumn, this),
        getStatusOfColumn: _.bind(this.getStatusOfColumn, this),
        search: this.search || { field: 'all', text: '' },
        loading: false,
        has_products: true,
        exportURL: "/merchant/products.csv?" + queryString,
      }));

    this.$el.find("table.tb-type4 > tbody").empty();
      this.tableRows = this.collection.map(function(model) {
        var listItemView = new FancyBackbone.Views.Product.ListingItemView({model: model});
        if(this.whitelabel) {
            listItemView.template = FancyBackbone.Utils.loadTemplate("product_listing_item_whitelabel")
        } else {
            if(this.ver == 'v2') {
                listItemView.template = FancyBackbone.Utils.loadTemplate("product_listing_item_v2")
            }
        }
        this.$el.find("table.tb-type1 > tbody, table.tb-type4 > tbody").append(listItemView.render().$el);
        _.each(listItemView.$el.find('.tooltip > em'), function(element) {
          $(element).css('margin-left',-$(element).outerWidth()/2+'px');
        });
        return listItemView;
      }, this);

      if( !this.collection.length){
        this.$el.find("table.tb-type4 > tbody").html("<tr><td colspan=\"6\" class=\"empty\">No products found</td></tr>");
      }
    } else if (this.collection && this.collection.length <=0) {
      this.$el.html(this.template({
        loading: false,
        has_products: false,
      }));
      if( $("#popup_container").is(":hidden") )
        $.dialog('welcome_product').open();
    } else {
      this.$el.html(this.template({
        loading: true,
        has_products: false,
      }));
    }

    if(window.productListingSubnavView.activeTab == 'all'){
      this.$el.find(".check_action li").show();
    }else{
      this.$el.find(".check_action li").not("[data-status=all],[data-status=none]").hide();
    }    
    this.updateHeader();
    return this;
  }
});

