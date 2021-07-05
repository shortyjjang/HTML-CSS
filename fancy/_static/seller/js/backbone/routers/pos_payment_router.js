FancyBackbone.Routers.PosPaymentRouter = Backbone.Router.extend({
  routes: {
    "merchant/orders/pospayments(/)": "dashboardIndex",
  },
  initialize: function() {
    this.view = window.posPaymentListView;
  },
  dashboardIndex: function(params) {
    params = params || {};
    var next_cursor = params.next_cursor || '',
        status = params.status || '',
        sellerId = params.seller_id || null;
    this.view.updateView(sellerId, next_cursor, status);
  },
});
