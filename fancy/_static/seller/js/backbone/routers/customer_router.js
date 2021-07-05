FancyBackbone.Routers.CustomerRouter = Backbone.Router.extend({
  routes: {
    "merchant/orders/customer(/)": "dashboardIndex",
  },
  initialize: function() {
    this.view = window.customerListView;
  },
  dashboardIndex: function(params) {
    params = params || {};
    var page = params.page || 1,
        per_page = params.per_page || 20,
        sellerId = params.seller_id || null,
        sort_option = params.sort_option || null,
        sort_ascending = params.sort_ascending || null;
    this.view.updateView(sellerId, page, per_page, sort_option, sort_ascending);
  },
});
