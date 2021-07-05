FancyBackbone.Views.Product = FancyBackbone.Views.Product || {};
FancyBackbone.Views.Product.LogisticsNew = FancyBackbone.Views.Product.LogisticsNew || {};
FancyBackbone.Views.Product.LogisticsNew.PurchaseOrder = FancyBackbone.Views.Product.LogisticsNew.PurchaseOrder || {};

FancyBackbone.Views.Product.LogisticsNew.PurchaseOrder.ControllerView = FancyBackbone.Views.Base.TemplateView.extend({
  template: 'product_logistics_purchase_order_controller.new',
  className: "search-frm controller-view",
  events: {
    'change select[name=po_tab]': 'onTabSelectChange',
    'click ul[name=search-field] li a[value]': 'onFilterOptionChange',
    "keyup input[name=search-text]": "onSearchTextChange",
    'change select[name=action]': 'onActionSelectChange',
    'click .dropdown ul a[value]': 'onActionSelectChange',
    'click .search-frm a.remove': 'onRemoveClick',  
  },
  onActionSelectChange: function(event) {
    var action = this.$('select[name=action]').val() || $(event.target).attr("value");
    if (action) {
      var eventName = _.str.sprintf('action:%s-selected-purchase-orders', action);
      FancyBackbone.App.eventAggregator.trigger(eventName);
    }
    this.$('select[name=action]').val('');
    $(event.target).closest(".dropdown").removeClass("opened");
  },
  initialize: function(params) {
    this._super();
    if( !this.$("ul[name=search-field] li a[value='"+params['search-field']+"']")[0] ) params['search-field'] = 'purchase-order-id';
    this.params = params;
    this.listenTo(FancyBackbone.App.eventAggregator, 'change:selected-status-set', _.bind(this.onSelectedStatusSetChange, this));
  },
  onSelectedStatusSetChange: function(selectedStatusSet, selectedCount) {
    var $select = this.$('.dropdown.bulk > a.toggle-button');
    $select.text(gettext('Select item')).closest('.dropdown').addClass('disabled');
    if(selectedCount > 0){
      $select.html("<b>"+selectedCount+"</b> "+gettext('Actions')).closest('.dropdown').removeClass('disabled');
    }

    var availableActions = [];
    if(selectedCount==1){
      availableActions = _.intersection.apply(
        _,
        _.map(
          selectedStatusSet,
          function(num){return FancyBackbone.Models.PurchaseOrder.PurchaseOrder.getListItemActionByStatusAndItem(num, 1)},
          FancyBackbone.Models.PurchaseOrder.PurchaseOrder
        )
      );
    }else{
      availableActions = _.intersection.apply(
        _,
        _.map(
          selectedStatusSet,
          FancyBackbone.Models.PurchaseOrder.PurchaseOrder.getAvailableActionsByStatus,
          FancyBackbone.Models.PurchaseOrder.PurchaseOrder
        )
      );
    }
    $select.next().empty();
    _.each(availableActions, function(action) {
      $select.next().append("<li><a href='#' value='"+action+"'>"+ gettext(_.str.capitalize(action)) +"</a></li>");      
    });
  },
  onTabSelectChange: function(event) {
    var href = FancyBackbone.Utils.makeURL(
      {
        tab: this.$("select[name=po_tab]").val(),
      },
      ['filter', 'tab', 'search-field', 'search-text']
    );

    window.router.navigate(href, {trigger: true});
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
  render: function() {
    var that = this;
    
    this._super();    
    this.$el.find("ul.tab3 > li > a.current[tab]").removeClass("current");
    this.$el.find("ul.tab3 > li > a[tab="+this.params.tab+"]").addClass("current");
    this.$("input[name=search-field]").val(this.params['search-field']);
    this.$("input[name=search-text]").val(this.params['search-text']);
    if(this.params['search-text']){
      this.$("a.remove").show();
    }

    return this;
  },
});

FancyBackbone.Views.Product.LogisticsNew.PurchaseOrder.ListItemView = FancyBackbone.Views.Base.TemplateModelView.extend({
  template: 'product_logistics_purchase_order_list_item.new',
  tagName: 'tr',
  events: {
    'click td': 'onTitleClick',
    'click a[action]': 'onActionClick'    
  },
  onActionClick: function(event) {
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    var action = $currentTarget.attr('action');
    if (action == 'remove') {
      this.model.destroy().done(function() {
        window.location.reload(false);
      }).fail(function() {
        alert(gettext("Please try this again later."));
      });
    } else if (action == 'edit') {
      window.popups.createPurchaseOrder.renderEdit(this.model);
    } else if (_.contains(['send', 'cancel'], action)) {
      if (action == 'send') {
        if (this.model.get('status').toLowerCase() != 'pending') {
          alert('This purchase order has already been sent.');
          return false;
        }
        if (this.model.get('tracking_id') === null && this.model.get('order_ref_num') === null) {
          alert('Please enter tracking # or order reference #');
          return false;
        }
      }

      this.model.save({action: action}).done(function() {
        console.log("Finished");
        window.location.reload(false);
      }).fail(function() {
        console.log("Failed");
        alert(gettext("Please try this again later."));
      });
    } else if (action == 'view edits') {
        window.popups.purchaseOrderSnapshot.renderSnapshot(this.model);
    }
  },
  isSelected: function() {
    return this.$('input[name=select]').prop('checked');
  },
  setSelectedStatus: function(selected) {
    this.$('input[name=select]').prop('checked', selected);
  },  
  updateDetailViewSelection: function() {
    var checked = this.$('input[name=select]').prop('checked');
    if (this.getSubview('detail')) {
      this.getSubview('detail').$('input[type=checkbox]').prop('checked', checked);
    }
  },
  toggleDetailView: function() {
    if (this.getSubview('detail')) {
      this.$el.removeClass("active");
      this.removeSubview('detail');
    } else {
      this.$el.addClass("active");
      this.$el.after(
        this.setSubview('detail', new FancyBackbone.Views.Product.LogisticsNew.PurchaseOrder.ListItemDetailView({
          model: this.model
        })).render().$el
      );
      this.listenTo(this.getSubview('detail'), 'change:checkAllStatus', this.onAllPendingSaleOrderItemsSelectedChange);
      this.updateDetailViewSelection();
    }
  },
  onTitleClick: function(event) {
    if( !$(event.target).is("a *, input")){
      event.preventDefault();
      this.toggleDetailView();
    }
  }
});


FancyBackbone.Views.Product.LogisticsNew.PurchaseOrder.ListItemDetailView = FancyBackbone.Views.Base.TemplateModelView.extend({
  template: 'product_logistics_purchase_order_list_item_detail',
  tagName: 'tr',
  className: 'sales-detail',
  events: {
    'click .view a': 'onViewOrdersClick'
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
  },
  onViewOrdersClick: function(event) {
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    var itemNumber = $currentTarget.closest('tr').attr('item-number');
    var saleOrderCollection = new FancyBackbone.Collections.SaleOrderCollection({
      url: _.str.sprintf(
        "/rest-api/v1/seller/%s/purchase-orders/%s/item-profiles/%s/sale-orders",
        FancyBackbone.App.seller.id,
        this.model.id,
        itemNumber
      )
    });
    window.popups.viewOrders.render(saleOrderCollection);
  },
  onTooltipHover: function(event) {
    var $em = $(event.currentTarget).find("em");
    var width = $em.width();
    $em.css('margin-left',-width/2-5+'px');
  },
  render: function() {
    this._super();
    _.defer(_.bind(function() {
      this.$el.find('.tooltip').each(function(){
        var w = $(this).find('em').outerWidth();
        $(this).find('em').css('margin-left',-(w/2)-5+'px');
      });
    }, this));
    return this;
  }
});

FancyBackbone.Views.Product.LogisticsNew.PurchaseOrder.ListView = FancyBackbone.Views.Base.TemplateCollectionView.extend({
  template: 'product_logistics_purchase_order_list.new',
  className: "table",
  listItemViewClass: FancyBackbone.Views.Product.LogisticsNew.PurchaseOrder.ListItemView,
  listSelector: "table.sales > tbody",
  events: {
    'change th input[name=select-all]': 'onSelectAllChanged',
    'change td input[name=select]': 'onSelectIndividualChanged',
  },
  initialize: function(options) {
    this._super();
    window.collection = this.collection = options.collection;
  },
  updateSelectedStatuseSet: function() {
    var selectedItems = _.filter(this.listItemViews, function(listItemView) {
        return listItemView.isSelected();
      })
    var stasuses = _.uniq(_.map(
      selectedItems,
      function(selectedListItemView) {
        return selectedListItemView.model.get('status').toLowerCase();
      }
    ));
    FancyBackbone.App.eventAggregator.trigger('change:selected-status-set', stasuses, selectedItems.length);
  },
  onSelectAllChanged: function(event) {
    var $currentTarget = $(event.currentTarget);
    var selectedStatus = $currentTarget.prop('checked');
    _.each(this.listItemViews, function(listItemView) {
      listItemView.setSelectedStatus(selectedStatus);
    });
    this.updateSelectedStatuseSet();
  },
  onSelectIndividualChanged: function() {
    var allSelected = _.every(
      this.listItemViews,
      function(listItemView) {
        return listItemView.isSelected();
      }
    );
    this.$('th input[name=select-all]').prop('checked', allSelected);
    this.updateSelectedStatuseSet();
  },
  getSelectedPurchaseOrders: function() {
    return _.map(
      _.filter(this.listItemViews, function(listItemView) {
        return listItemView.isSelected();
      }),
      function(selectedListItemView) {
        return selectedListItemView.model;
      }
    );
  },
  render: function() {
    this._super();
        if( !this.collection.length){
      this.$el.find(this.listSelector).html("<tr><td colspan=\"8\" class=\"empty\">No Purchase Orders found</td></tr>");
    }

    this.updateSelectedStatuseSet();
    return this;
  }
});

FancyBackbone.Views.Product.LogisticsNew.PurchaseOrder.PaginationView = FancyBackbone.Views.Base.PaginationView.extend({
  templateHelpers: {
    getPageURL: function(page) {
      return FancyBackbone.Utils.makeURL(
        {
          page: page,
        },
        true
      );
    }
  },
  templateData: function() {
    return {
      currentPage: this.collection.currentPage,
      maxPage: this.collection.maxPage,
    };
  },
  initialize: function(options) {
    this._super();
    this.collection = options.collection;
  }
});

FancyBackbone.Views.Product.LogisticsNew.PurchaseOrder.ContentsView = FancyBackbone.Views.Base.View.extend({
  className: 'remote-data',
  initialize: function(options) {
    this._super();
    this.collection = options.collection;
    this.listenTo(FancyBackbone.App.eventAggregator, 'change:collection-filter', _.bind(this.onCollectionFilterChange, this));
    this.listenTo(FancyBackbone.App.eventAggregator, 'action:edit-selected-purchase-orders', _.bind(this.editSelectedPurchaseOrders, this));
    this.listenTo(FancyBackbone.App.eventAggregator, 'action:duplicate-selected-purchase-orders', _.bind(this.duplicateSelectedPurchaseOrders, this));
    this.listenTo(FancyBackbone.App.eventAggregator, 'action:cancel-selected-purchase-orders', _.bind(this.cancelSelectedPurchaseOrders, this));
    this.listenTo(FancyBackbone.App.eventAggregator, 'action:send-selected-purchase-orders', _.bind(this.sendSelectedPurchaseOrders, this));
    this.listenTo(FancyBackbone.App.eventAggregator, 'action:remove-selected-purchase-orders', _.bind(this.removeSelectedPurchaseOrders, this));
    this.listenTo(FancyBackbone.App.eventAggregator, 'action:print-selected-purchase-orders', _.bind(this.printSelectedPurchaseOrders, this));
  },
  getActionURL: function(action) {
    return _.str.sprintf(
      "/rest-api/v1/seller/%s/purchase-orders/%s",
      window.seller.id,
      action
    );
  },
  getSelectedPurchaseOrderIds: function() {
    return _.map(
      this.getSubview('list').getSelectedPurchaseOrders(),
      function(purchaseOrder) {
        return purchaseOrder.id;
      }
    );
  },
  doAction: function(action) {
    var purchaseOrders = this.getSubview('list').getSelectedPurchaseOrders(),
        i, purchaseOrder;

    // validate purchase orders
    if (action == 'send') {
      for (i=0; i < purchaseOrders.length; i++) {
        purchaseOrder = purchaseOrders[i];

        if (purchaseOrder.get('status').toLowerCase() != 'pending') {
          alert(_.str.sprintf('Purchase order #%s has already been sent.', purchaseOrder.id));
          return false;
        }
        if (purchaseOrder.get('tracking_id') === null && purchaseOrder.get('order_ref_num') === null) {
          alert(_.str.sprintf('Please enter tracking # or order reference # for purchase order #%s.', purchaseOrder.id));
          return false;
        }
      }
    }

    var purchaseOrderIds = this.getSelectedPurchaseOrderIds();
    $.ajax({
      url: this.getActionURL(action),
      data: {
        purchase_order_ids: purchaseOrderIds,
      },
      dataType: 'json',
      type: 'POST',
      traditional: true,
    }).done(function(data, statusText, xhr) {
      if (xhr.status == 206) {
        alert(gettext("Please contact your manager to authorize this Purchase Order."));
      }
      window.location.reload(false);
    }).fail(function() {
      alert(gettext('Please try again later.'));
    });
  },
  editSelectedPurchaseOrders: function() {
    window.popups.createPurchaseOrder.renderEdit(this.getSubview('list').getSelectedPurchaseOrders()[0]);
  },
  duplicateSelectedPurchaseOrders: function() {
    var purchaseOrder = this.getSubview('list').getSelectedPurchaseOrders()[0];    
    window.popups.createPurchaseOrder.renderNew([],purchaseOrder);
  },
  cancelSelectedPurchaseOrders: function() {
    this.doAction('cancel');
  },
  sendSelectedPurchaseOrders: function() {
    this.doAction('send');
  },
  removeSelectedPurchaseOrders: function() {
    this.doAction('remove');
  },
  printSelectedPurchaseOrders: function() {
    var purchaseOrderIds = this.getSelectedPurchaseOrderIds();
    var url = FancyBackbone.Utils.makeURL(
      "/merchant/purchase-orders/print",
      {
        po_ids: JSON.stringify(purchaseOrderIds)
      },
      ['seller_id']
    );
    window.open(url);
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
  render: function() {
    this.$el.append(
      this.setSubview('list', new FancyBackbone.Views.Product.LogisticsNew.PurchaseOrder.ListView({
        collection: this.collection,
      })).render().$el
    );
    this.$el.append(
      this.setSubview('pagination', new FancyBackbone.Views.Product.LogisticsNew.PurchaseOrder.PaginationView({
        collection: this.collection,
      })).render().$el
    );
    return this;
  },
});

