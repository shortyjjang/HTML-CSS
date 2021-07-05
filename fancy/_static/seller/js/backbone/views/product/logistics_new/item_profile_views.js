FancyBackbone.Views.Product = FancyBackbone.Views.Product || {};
FancyBackbone.Views.Product.LogisticsNew = FancyBackbone.Views.Product.LogisticsNew || {};
FancyBackbone.Views.Product.LogisticsNew.ItemProfile = FancyBackbone.Views.Product.LogisticsNew.ItemProfile || {};

FancyBackbone.Views.Product.LogisticsNew.ItemProfile.ControllerView = FancyBackbone.Views.Base.TemplateView.extend({
  template: 'product_logistics_item_profile_controller.new',
  className: "search-frm controller-view",
  events: {
    'click ul[name=search-field] li a[value]': 'onFilterOptionChange',
    "keyup input[name=search-text]": "onSearchTextChange",
    'change select[name=action]': 'onActionSelectChange',
    'click .dropdown ul a[value]': 'onActionSelectChange',
    'click .search a.remove': 'onRemoveClick',  
  },
  initialize: function(params) {
    this._super();
    if( !this.$("ul[name=search-field] li a[value='"+params['search-field']+"']")[0] ) params['search-field'] = 'sale-id';
    this.params = params;
    this.listenTo(FancyBackbone.App.eventAggregator, 'change:selected-status-set', _.bind(this.onSelectedStatusSetChange, this));
  },
  onSelectedStatusSetChange: function(selectedCount) {
    var $select = this.$('.dropdown.bulk > a.toggle-button');
    $select.text(gettext('Select item')).closest('.dropdown').addClass('disabled');
    if(selectedCount > 0){
      $select.html("<b>"+selectedCount+"</b> "+gettext('Actions')).closest('.dropdown').removeClass('disabled');
    }
  },
  onFilterOptionChange: function(e) {
    e.preventDefault();
    var filterOption = $(e.target).attr('value');
    this.$el.find("input[name=search-field]").val(filterOption);
    $(e.target).closest('.dropdown').removeClass('opened')
  },
  onSearchTextChange: function(event) {
    if (event.keyCode == 13) {
      var searchField = this.$el.find("input[name=search-field]").val();
      var searchText = this.$el.find("input[name=search-text]").val();
      var href = FancyBackbone.Utils.makeURL(
        {
          'search-field': searchField,
          'search-text': searchText,
        },
        ['filter', 'tab']
      );
      if(searchText){
        this.$("a.remove").show();
      }
      window.router.navigate(href, {trigger: true});
    }
  },
  onRemoveClick: function(e){
    e.preventDefault();
    this.$el.find("input[name=search-text]").val('');
    var searchField = this.$el.find("input[name=search-field]").val();
    var searchText = this.$el.find("input[name=search-text]").val();
    var href = FancyBackbone.Utils.makeURL(
      {
        'search-field': searchField,
        'search-text': searchText,
      },
      ['filter', 'tab']
    );
    this.$("a.remove").hide();
    window.router.navigate(href, {trigger: true});
  },
  onActionSelectChange: function(event) {
    var action = this.$('select[name=action]').val() || $(event.target).attr("value");
    if (action) {
      switch(action){
        case "create":
          var eventName = 'action:open-create-po-popup';
          break;
        case "add-po":
          var eventName = 'action:open-add-to-current-po-popup';
          break;
      }
      FancyBackbone.App.eventAggregator.trigger(eventName);
    }
    this.$('select[name=action]').val('');
    $(event.target).closest(".dropdown").removeClass("opened");
  },
  render: function() {
    this._super();
    //this.$el.find("select[name=filter]").val(this.params.filter);
    this.$el.find("ul.tab3 > li > a.current[tab]").removeClass("current");
    this.$el.find("ul.tab3 > li > a[tab="+this.params.filter+"]").addClass("current");
    this.$el.find("input[name=search-field]").val(this.params['search-field']);
    this.$el.find("input[name=search-text]").val(this.params['search-text']);
    if(this.params['search-text']){
      this.$("a.remove").show();
    }
    return this;
  },
});

FancyBackbone.Views.Product.LogisticsNew.ItemProfile.ListItemDetailView = FancyBackbone.Views.Base.TemplateModelView.extend({
  template: 'product_logistics_item_profile_list_item_detail.new',
  tagName: 'tr',
  className: 'detail-view',
  events: {
    'click input[name=warehouse]': 'onWarehouseRadioClick',
    'click .edit-warehouse-restriction': 'onEditWarehouseRestrictionClick',
    'click a.btn-edit.disabled': 'onDeletedProductEditClick',
    'change input.select-all-pending-sale-order-items': 'onSelectAllPendingSaleOrderItemsChange',
    'change tr.pending-sale-order-item input[type=checkbox]': 'onSelectPendingSaleOrderItemChange',
  },
  templateHelpers: {
    sum: function(list) {
      return _.reduce(list, function(left_reduced_val, new_val) {
        return left_reduced_val + new_val;
      }, 0);
    },
    getProductEditURL: function(product) {
      return FancyBackbone.Utils.makeURL(
        _.str.sprintf('/merchant/products/%s/edit', product.id_str),
        false
      );
    },
  },
  initialize: function() {
    this._super();
    this.pendingSaleOrderItemsCollection = this.model.get('pending_sale_order_items');
    this.pendingSaleOrderItemsCollection.each(function(selrOrderItem) {
      var warehouseRestriction = selrOrderItem.get("warehouse_restriction");
      this.listenTo(warehouseRestriction, "change", _.bind(this.render, this));
    }, this);
  },
  onDeletedProductEditClick: function(e){
    alertify.alert("This product has been deleted.");
    e.preventDefault();
  },
  onSelectAllPendingSaleOrderItemsChange: function(event) {
    var checked = $(event.currentTarget).prop('checked');
    this.$('tr.pending-sale-order-item input[type=checkbox]').prop('checked', checked);
    this.trigger('change:checkAllStatus', checked);
  },
  onSelectPendingSaleOrderItemChange: function(event) {
    var allChecked = _.every(this.$('tr.pending-sale-order-item input[type=checkbox]'), function(pendingSaleOrderItemSelectInput) {
      return $(pendingSaleOrderItemSelectInput).prop('checked');
    });
    this.$('input.select-all-pending-sale-order-items').prop('checked', allChecked);
    this.trigger('change:checkAllStatus', allChecked);
  },
  onEditWarehouseRestrictionClick: function(event) {
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    var saleOrderIdStr = $currentTarget.closest("tr").attr("sale-order-id");
    window.popups.warehouseRestriction.render(
      this.model.get("product"),
      this.model.get('pending_sale_order_items').find(
        function(saleOrderItem) {
          return saleOrderItem.get('sale_order').id_str == saleOrderIdStr;
        }
      )
    );
    // window.popups.warehouseRestriction.setContents({
    //   product: this.model.get("product"),
    //   saleOrderItem: this.model.get('pending_sale_order_items').find(
    //     function(saleOrderItem) {
    //       return saleOrderItem.get('sale_order').id_str == saleOrderIdStr;
    //     }
    //   ),
    // });
    // window.popups.warehouseRestriction.open();
  },
  onWarehouseRadioClick: function(event) {
    var warehouseId = $(event.currentTarget).val();
    var selector;
    if (warehouseId == -1) {
      selector = "td[warehouse-id]";
    } else {
      selector = "td[warehouse-id=" + warehouseId + "]";
    }
    this.$el.find("tr.pending-sale-order-item").removeClass("highlight");
    this.$el.find("tr.active-purchase-order-item").removeClass("highlight");
    this.$el.find(selector).closest("tr").addClass("highlight");
  },
  onTooltipHover: function(event) {
    var $em = $(event.currentTarget).find("em");
    var width = $em.width();
    $em.attr('style','margin-left:'+(-width/2-4)+'px !important;');
  },
  render: function() {
    this._super();
    _.defer(_.bind(function() {
      this.$el.find('.tooltip').each(function(){
        var w = $(this).find('em').outerWidth();
        $(this).find('em').attr('style','margin-left:'+(-w/2)+'px !important');
      });
    }, this));
    return this;
  },
  getAllSelectedPendingSaleOrderItems: function() {
    var that = this;
    return _.map(this.$('tr.pending-sale-order-item input[type=checkbox]:checked'), function(selectedPendingSaleOrderItemSelectInput) {
      var $input = $(selectedPendingSaleOrderItemSelectInput);
      var saleOrderItemId = $input.closest("tr").attr("sale-order-item-id");
      return that.model.get('pending_sale_order_items').get(saleOrderItemId);
    });
  },
});

FancyBackbone.Views.Product.LogisticsNew.ItemProfile.ListItemView = FancyBackbone.Views.Base.TemplateModelView.extend({
  template: 'product_logistics_item_profile_list_item.new',
  tagName: 'tr',
  events: {
    'click td': 'onTitleClick',
    'click .tag a': 'onTagClick',
    'change input.select-all-pending-sale-order-items': 'onSelectAllPendingSaleOrderItemsChange',
  },
  templateHelpers: {
    getTagURL: function(tag) {
      return FancyBackbone.Utils.makeURL(
        {
          'search-field': 'tag-id',
          'search-text': tag.id
        },
        ['filter', 'tab']
      );
    },
  },
  onSelectAllPendingSaleOrderItemsChange: function(event) {
    this.updateDetailViewSelection();
    var checked = this.$('input.select-all-pending-sale-order-items').prop('checked');
    this.trigger('change:checkAllStatus', checked);
  },
  updateDetailViewSelection: function() {
    var checked = this.$('input.select-all-pending-sale-order-items').prop('checked');
    if (this.getSubview('detail')) {
      this.getSubview('detail').$('input[type=checkbox]').prop('checked', checked);
    }
  },
  areAllPendingSaleOrderItemsSelected: function() {
    return this.$('input.select-all-pending-sale-order-items').prop('checked');
  },
  toggleDetailView: function() {
    if (this.getSubview('detail')) {
      this.removeSubview('detail');
      this.$el.removeClass("active");
    } else {
      this.$el.addClass("active");
      this.$el.after(
        this.setSubview('detail', new FancyBackbone.Views.Product.LogisticsNew.ItemProfile.ListItemDetailView({
          model: this.model
        })).render().$el
      );
      this.listenTo(this.getSubview('detail'), 'change:checkAllStatus', this.onAllPendingSaleOrderItemsSelectedChange);
      this.updateDetailViewSelection();
    }
  },
  onAllPendingSaleOrderItemsSelectedChange: function(checked) {
    this.$('input.select-all-pending-sale-order-items').prop('checked', checked);
    this.trigger('change:checkAllStatus', checked);
  },
  onTitleClick: function(event) {
    if( !$(event.target).is("a *, input")){
      event.preventDefault();
      this.toggleDetailView();
    }
  },
  onTagClick: function(event) {
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    var href = $(event.currentTarget).attr('href');
    window.router.navigate(href, {trigger: true});
  },
  getAllSelectedPendingSaleOrderItems: function() {    
    if (this.getSubview('detail')) {
      return this.getSubview('detail').getAllSelectedPendingSaleOrderItems();
    } else {
      if (this.areAllPendingSaleOrderItemsSelected()) {
        var models = this.model.get('pending_sale_order_items').models;
        if( models.length == 0){
          models = [new FancyBackbone.Models.SaleOrderItem({
            item_profile: this.model,
            sale_order : {is_vip:0},
            quantity : 0
          })]
        }
        return models;
      } else {
        return [];
      }
    }
  },
  isSelected: function() {
    return this.getAllSelectedPendingSaleOrderItems().length > 0;
  },
});

FancyBackbone.Views.Product.LogisticsNew.ItemProfile.ListView = FancyBackbone.Views.Base.TemplateCollectionView.extend({
  template: 'product_logistics_item_profile_list.new',
  className: "table",
  listItemViewClass: FancyBackbone.Views.Product.LogisticsNew.ItemProfile.ListItemView,
  listSelector: "table > tbody",
  events: {
    'change input.select-all-item-profiles': 'onSelectAllItemProfilesChange',
    'change input.select-all-pending-sale-order-items': 'onSelectIndividualChanged',
    'change .pending-sale-order-item input[type=checkbox]': 'onSelectIndividualChanged'
  },
  initialize: function(options) {
    this._super();
    this.collection = options.collection;
  },
  updateSelectedStatuseSet: function() {
    var selectedItems = _.filter(this.listItemViews, function(listItemView) {
        return listItemView.isSelected();
      })
    FancyBackbone.App.eventAggregator.trigger('change:selected-status-set', selectedItems.length);
  },
  createListItemView: function(listItemModel) {
    var itemProfileView = this._super(listItemModel);
    this.listenTo(itemProfileView, 'change:checkAllStatus', this.onItemProfileViewAllPendingSaleOrderItemsSelectedChange);
    return itemProfileView;
  },
  onItemProfileViewAllPendingSaleOrderItemsSelectedChange: function() {
    this.$("input.select-all-item-profiles").prop('checked', _.every(this.listItemViews, function(itemProfileView) {
      return itemProfileView.areAllPendingSaleOrderItemsSelected();
    }));
  },
  onSelectAllItemProfilesChange: function(event) {
    var checked = $(event.currentTarget).prop('checked');
    this.$('input[type=checkbox]').prop('checked', checked);
    this.updateSelectedStatuseSet();
  },
  onSelectIndividualChanged: function() {
    this.updateSelectedStatuseSet();
  },
  areAllItemProfilesSelected: function() {
    return this.$('input.select-all-item-profiles').prop('checked');
  },
  getAllSelectedPendingSaleOrderItems: function() {
    return _.flatten(_.map(this.listItemViews, function(listItemView) {
      return listItemView.getAllSelectedPendingSaleOrderItems();
    }));
  },
  render: function() {
    this._super();
    if( !this.collection.length){
      this.$el.find(this.listSelector).html("<tr><td colspan=\"9\" class=\"empty\">No products found</td></tr>");
    }
    _.defer(_.bind(function() {
      this.$el.find('.tooltip').each(function(){
        var w = $(this).find('em').outerWidth();
        $(this).find('em').attr('style','margin-left:'+(-w/2)+'px !important');
      });
    }, this));
    return this;
  },
});

FancyBackbone.Views.Product.LogisticsNew.ItemProfile.PaginationView = FancyBackbone.Views.Base.TemplateView.extend({
  template: 'product_logistics_item_profile_pagination.new',
  tagName: 'div',
  className: 'pagination',
  events: {
    'click a': 'onPageNavButtonClick',
  },
  templateData: function() {
    return {
      prevPageURL: FancyBackbone.Utils.makeURL({page: this.collection.currentPage - 1}, true),
      currentPageURL: FancyBackbone.Utils.makeURL(true),
      nextPageURL: FancyBackbone.Utils.makeURL({page: this.collection.currentPage + 1}, true),
      currentPage: this.collection.currentPage,
      hasPrevPage: this.collection.hasPrevPage,
      hasNextPage: this.collection.hasNextPage,
    };
  },
  onPageNavButtonClick: function(event) {
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    if (!$currentTarget.is(".current") && !$currentTarget.is(".disabled")) {
      var href = $(event.currentTarget).attr('href');
      window.router.navigate(href, {trigger: true});
    }
  },
  initialize: function(options) {
    this._super();
    this.collection = options.collection;
  },
});

FancyBackbone.Views.Product.LogisticsNew.ItemProfile.ContentsView = FancyBackbone.Views.Base.View.extend({
  className: 'remote-data',
  initialize: function(options) {
    this._super();
    this.collection = options.collection;
    this.listenTo(FancyBackbone.App.eventAggregator, 'change:collection-filter', _.bind(this.onCollectionFilterChange, this));
    this.listenTo(FancyBackbone.App.eventAggregator, 'action:open-create-po-popup', _.bind(this.openCreatePurchaseOrderPopup, this));
    this.listenTo(FancyBackbone.App.eventAggregator, 'action:open-add-to-current-po-popup', _.bind(this.openAddToCurrentPurchaseOrderPopup, this));
  },
  onCollectionFilterChange: function(params) {
    this.collection.filter = params.filter;
    var collectionDfd = this.collection.fetch({
      data: _.pick(params, ['page', 'search-text', 'search-field'])
    });
    this.$el.addClass("loading");
    var that = this;
    collectionDfd.always(function() {
      that.$el.removeClass("loading");
      that.render();
    });
  },
  openCreatePurchaseOrderPopup: function() {
    var saleOrderItems = this.getSubview('list').getAllSelectedPendingSaleOrderItems();
    if (saleOrderItems.length > 0) {
      window.popups.createPurchaseOrder.renderNew(saleOrderItems);
    } else {
      alert(gettext("Please select at least one sale item or pending order."));
    }
  },  
  openAddToCurrentPurchaseOrderPopup: function() {
    var saleOrderItems = this.getSubview('list').getAllSelectedPendingSaleOrderItems();
    if (saleOrderItems.length > 0) {
      window.popups.addToPurchaseOrder.renderNew(saleOrderItems);
    } else {
      alert(gettext("Please select at least one sale item or pending order."));
    }
  },
  render: function() {
    this.$el.append(
      this.setSubview('list', new FancyBackbone.Views.Product.LogisticsNew.ItemProfile.ListView({
        collection: this.collection,
      })).render().$el
    );
    this.$el.append(
      this.setSubview('pagination', new FancyBackbone.Views.Product.LogisticsNew.ItemProfile.PaginationView({
        collection: this.collection,
      })).render().$el
    );
    return this;
  },
});

