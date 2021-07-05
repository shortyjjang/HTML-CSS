FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.WarehouseRestrictionPopup = FancyBackbone.Views.Base.TemplateView.extend({
  template: 'popup_warehouse_restriction',
  events: {
    'click .btn-save': 'onSaveButtonClick',
    'change input[name=lock]': 'onLockWarehouseChange',
    'change input[name=disallow]': 'onDisallowWarehouseChange',
  },
  templateData: function() {
    return {
      product: this.product.toJSON(),
      saleOrderItem: this.saleOrderItem.toJSON(),
      warehouses: this.warehouses.toJSON(),
    };
  },
  getLockedWarehouseVal: function() {
    var warehouseRestriction = this.saleOrderItem.get("warehouse_restriction");
    var lockedWarehouse = warehouseRestriction ? warehouseRestriction.get("locked") : null;
    return lockedWarehouse ? lockedWarehouse.id_str : "none";
  },
  getDisallowedWarehouseIds: function() {
    var warehouseRestriction = this.saleOrderItem.get("warehouse_restriction");
    var disallowedWarehouses = warehouseRestriction ? warehouseRestriction.get("disallowed") : [];
    return _.pluck(disallowedWarehouses, 'id_str');
  },
  onLockWarehouseChange: function() {
     this.$el.find('input[name=disallow]').val([]);
  },
  onDisallowWarehouseChange: function() {
    this.$el.find('input[name=lock]').val(["none"]);
  },
  open: function() {
    $.dialog("restrictions").open();
  },
  onSaveButtonClick: function() {
    var warehouseRestriction = this.saleOrderItem.get("warehouse_restriction");
    if (warehouseRestriction) {
      var lockedWarehouseId = this.$el.find('input[name=lock]:checked').val();
      var disallowedWarehouseIds = _.map(
        this.$el.find(".disallow input:checked"),
        function(input) {
          return parseInt($(input).val(), 10);
        }
      );
      var data = {
        locked_warehouse_id: lockedWarehouseId == "none" ? null : parseInt(lockedWarehouseId, 10),
        disallowed_warehouse_ids: disallowedWarehouseIds,
      };
      warehouseRestriction.save(data).done(function() {
        $.dialog("restrictions").close();
      });
    }
  },
  render: function(product, saleOrderItem) {
    this.product = product;
    this.saleOrderItem = saleOrderItem;
    var that = this;
    var superFn = this._super;
    FancyBackbone.App.SharedResources.fetchWarehouses().done(function(warehouses) {
      that.warehouses = warehouses;
      superFn.apply(that);
      that.$el.find('input[name=lock]').val([that.getLockedWarehouseVal()]);
      that.$el.find('input[name=disallow]').val(that.getDisallowedWarehouseIds());
      that.open();
    });
    return this;
  },
});