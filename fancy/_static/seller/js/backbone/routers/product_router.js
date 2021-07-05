FancyBackbone.SubRouters.ProductListingRouter = Backbone.SubRoute.extend({
  routes: {
    "": "view",
  },
  initialize: function() {
    this.productListingSubnavView = window.productListingSubnavView;
    this.productListingView = window.productListingView;
  },
  view: function(params) {
    window.params = params = _.extend(
      {
        status: 'all',
        page: 1,
      },
      params
    );
    var status = params.status;
    var page = params.page;
    var sort = null;
    var ascending = null;
    var search = null;
    if (params && params['search-field'] && params['search-text']) {
      search = {
        field: params['search-field'],
        text: params['search-text'],
      };
    }
    if (params && params['sort'] && params['ascending']) {
      sort = {
        sort: params['sort'],
        ascending: params['ascending'],
      }
    }
    if (FancyBackbone.Models.Product.Product.isValidStatus(status)) {
      this.productListingSubnavView.setActiveTab(status);
      this.productListingView.updateContents(status, page, search, sort);
    }
  },
});

FancyBackbone.Routers.ProductListingRouter = Backbone.Router.extend({
  routes: {
    "merchant/products(/)": "productIndex",
  },
  productIndex: function() {
    this.productListingRouter = this.productListingRouter || new FancyBackbone.SubRouters.ProductListingRouter("merchant/products(/)");
  },
});


FancyBackbone.Routers.ProductLogisticsNewRouter = Backbone.Router.extend({
  routes: {
    "merchant/products/logistics(/)": "logisticsIndex",
  },
  getDefaultParamsForTab: function(tab) {
    if (tab == 'sales') {
      return {
        filter: 'pending',
        page: 1,
        'search-text': '',
        'search-field': 'sale-id',
      };
    } else {
      return {
        warehouse: 0,
        'search-field': 'sale-id',
        'search-text': '',
        page: 1,
      };
    }
  },
  getCollectionFilterParamKeysForTab: function(tab) {
    if (tab == 'sales') {
      return ['filter', 'page', 'search-field', 'search-text'];
    } else {
      return ['warehouse', 'page', 'search-field', 'search-text'];
    }
  },
  logisticsIndex: function(params) {
    params = params || {};
    params.tab = params.tab || 'sales';
    _.defaults(params, this.getDefaultParamsForTab(params.tab));
    if (!(FancyBackbone.App.getLayout() instanceof FancyBackbone.Views.Product.LogisticsNew.Layout)) {
      this.params = params;
      FancyBackbone.App.setLayout(new FancyBackbone.Views.Product.LogisticsNew.Layout({
        el: $("#content"),
        params: params
      }).render());
    } else {
      var diffKeys = _.filter(
        _.union(_.keys(this.params), _.keys(params)),
        function(key) {
          return this.params[key] != params[key];
        },
        this
      );
      this.params = params;
      if (_.contains(diffKeys, 'tab')) {
        FancyBackbone.App.eventAggregator.trigger(
          'change:tab',
          this.params
        );
      } else if (_.intersection(diffKeys, this.getCollectionFilterParamKeysForTab(params.tab)).length > 0) {
        FancyBackbone.App.eventAggregator.trigger(
          'change:collection-filter',
          this.params
        );
      }
    }
  },
});
