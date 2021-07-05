
FancyBackbone.Views.Popup.PurchaseOrderSnapshotListItem = FancyBackbone.Views.Base.TemplateModelView.extend({
  template: 'popup_purchase_order_snapshot_list_item',
  templateData: function() {
      return _.extend(
        {
          currencies: [],
        },
        this._super()
      );
    },
  tagName: 'tr',
});

FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.PurchaseOrderSnapshotPopup = FancyBackbone.Views.Base.TemplateCollectionView.extend({
  template: 'popup_view_purchase_order_snapshots',
  listItemViewClass: FancyBackbone.Views.Popup.PurchaseOrderSnapshotListItem,
  listSelector: 'table.tb-orders tbody',
  renderSnapshot: function(purchaseOrder) {
    this.purchaseOrder = purchaseOrder;
    this.snapshots = purchaseOrder.get('snapshots');
    this.collection = purchaseOrder.get('item_profiles');

    return this.render();
  }, events: {
    'change select[name=snapshot_version]': 'onVersionSelectChange',
  },
  onVersionSelectChange: function(event) {
    var index = this.$el.find('select[name=snapshot_version]').prop("selectedIndex");
    if (index < this.snapshots.length) {
      this.syncViewWithSnapshot(index);
    }
    else {
      this.syncViewWithPurchaseOrder();
    }
  },
  render: function() {
    this._super.apply(this);
    this.open();
    this.syncViewWithPurchaseOrder();
    return this;
  },
  open: function() {
    $.dialog("po_edit_history").open();

  },
  getDateDisplay: function(datetime) {
    displayDate = '';
    if (datetime) {
        displayDate = moment.utc(datetime).format("MM/DD/YYYY");
    }
    return displayDate;
  },
  templateData: function() {
    return {
     purchaseOrder: this.purchaseOrder.toJSON(),
     eta_date: this.getEta
    };
  },
  syncViewWithPurchaseOrder: function() {

    this.$el.find("input.modified-date").val(this.purchaseOrder.get('date_last_modified'));
    this.$el.find("select.po-status option:selected").text(this.purchaseOrder.get('status'));
    this.$el.find("dl.comment textarea").text(this.purchaseOrder.get('comment'));
    this.$el.find(".shipping .carrier option:selected").text(this.purchaseOrder.get('carrier_display'));
    this.$el.find(".shipping .service_level option:selected").text(this.purchaseOrder.get('service_level_display'));
    this.$el.find(".shipping .tracking_id").val(this.purchaseOrder.get('tracking_id'));
    this.$el.find(".shipping .order_ref_num").val(this.purchaseOrder.get('order_ref_num'));
    this.$el.find(".shipping .eta").val(this.getDateDisplay(this.purchaseOrder.get('eta')));

    this.$el.find(".tb-orders tbody tr").each(function() {
        var $input_qty = $(this).find('input.quantity');
        var $td_qty = $(this).find('td.quantity');

        $input_qty.val($input_qty.attr('current-value'));
        $td_qty.text($input_qty.attr('current-value'));
    })
  },
  syncViewWithSnapshot: function(snapshot_index) {
    snapshot = this.snapshots[snapshot_index];
    this.$el.find("input.modified-date").val(snapshot.date_modified);
    this.$el.find("select.po-status option:selected").text(snapshot.status);
    this.$el.find("dl.comment textarea").text(snapshot.comments);
    this.$el.find(".shipping .carrier").val(snapshot.carrier);
    this.$el.find(".shipping .service_level option:selected").text(snapshot.service_level);
    this.$el.find(".shipping .tracking_id option:selected").text(snapshot.primary_tracking_id);
    this.$el.find(".shipping .order_ref_num").val(snapshot.order_ref_num);
    this.$el.find(".shipping .eta").val(this.getDateDisplay(snapshot.eta));

    this.$el.find(".tb-orders tbody tr").each(function() {
        var $input_qty = $(this).find('input.quantity');
        var $td_qty = $(this).find('td.quantity');
        var qty = snapshot.quantity_info[$input_qty.attr('item-no')];
        $input_qty.val(qty);
        $td_qty.text(qty);

    })
  },
});
