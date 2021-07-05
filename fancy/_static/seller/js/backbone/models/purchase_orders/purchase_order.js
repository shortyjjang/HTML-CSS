FancyBackbone.Models.PurchaseOrder = FancyBackbone.Models.PurchaseOrder || {};
FancyBackbone.Collections.PurchaseOrder = FancyBackbone.Collections.PurchaseOrder || {};

FancyBackbone.Models.PurchaseOrder.PurchaseOrder = Backbone.RelationalModel.extend({
  urlRoot: function() {
    var sellerId = this.get('user') ? this.get('user').id : this.get('seller_id_str');
    return _.str.sprintf("/rest-api/v1/seller/%s/purchase-orders", sellerId);
  },
  idAttribute: 'id_str',
  relations: [
    {
      type: Backbone.HasMany,
      key: 'item_profiles',
      relatedModel: 'ItemProfile',
      collectionType: 'ItemProfileCollection',
      includeInJSON: ['item_number', 'quantity', 'product', 'sale_item_option', 'unitcost', 'unitdiscount', 'currency'],
    }, {
      type: Backbone.HasMany,
      key: 'sale_order_items',
      relatedModel: 'SaleOrderItem',
      collectionType: 'SaleOrderItemCollection',
      includeInJSON: ['id', 'quantity', 'sale_order'],
    },
  ],
}, {
  getListItemActionByStatusAndItem: function(status, snapshots) {
    if (snapshots > 0) {
        return this.statusActionMapWithSnapshots[status.toLowerCase()];
    }

    return this.getAvailableActionsByStatus(status);
  },
  getAvailableActionsByStatus: function(status) {
    status = status.toLowerCase();
    return this.statusActionMap[status] || [];
  },
  statusActionMap: {
    'pending': ['send', 'remove', 'print'],
    'locked': ['remove', 'print'],
    'active': ['cancel', 'print'],
    'canceled': ['print'],
    'finished': ['print'],
  },
  statusActionMapWithSnapshots: {
    'pending': ['send', 'remove', 'edit', 'print'],
    'locked': ['remove', 'edit', 'print'],
    'active': ['cancel', 'edit', 'duplicate', 'print'],
    'canceled': ['edit', 'duplicate', 'print'],
    'finished': ['edit', 'duplicate', 'print'],
  },
 }
);

FancyBackbone.Collections.PurchaseOrder.PurchaseOrderCollection = Backbone.Collection.extend(_.extend(
  {},
  FancyBackbone.Mixins.PaginatedCollectionMixin,
  FancyBackbone.Mixins.FormatURLMixin,
  {
    urlFormat: "/rest-api/v1/seller/%s/purchase-orders/%s",
    urlParams: function() {
      return [
        this.user.id,
        this.status
      ];
    },
    parse: function(response) {
      this.parsePageInfo(response);
      this.status = response.status;
      return response.purchase_orders;
    },
  }
));
