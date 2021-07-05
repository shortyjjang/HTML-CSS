FancyBackbone.Views.Product = FancyBackbone.Views.Product || {};
FancyBackbone.Views.Product.LogisticsNew = FancyBackbone.Views.Product.LogisticsNew || {};

FancyBackbone.Views.Product.LogisticsNew.Layout = FancyBackbone.Views.Base.Layout.extend({
  template: 'product_logistics_layout.new',
  initialize: function(options) {
    this._super();
    this.params = options.params;
    this.listenTo(FancyBackbone.App.eventAggregator, 'change:tab', _.bind(this.onParamTabChange, this));
  },
  getCollection: function() {
    var ret;
    if (this.activeTab == 'sales') {
      ret = FancyBackbone.App.seller.get('item_profiles');
      ret.filter = this.params.filter;
    } else {
      ret = FancyBackbone.App.seller.get('purchase_orders');
      if (this.activeTab == 'po_saved') {
        ret.status = 'saved';
      } else if (this.activeTab == 'po_active') {
        ret.status = 'active';
      } else if (this.activeTab == 'po_canceled') {
        ret.status = 'canceled';
      } else if (this.activeTab == 'po_history') {
        ret.status = 'history';
      }
    }
    return ret;
  },
  onParamTabChange: function(params) {
    this.params = params;
    this.setActiveTab(params.tab);
  },
  setActiveTab: function(tab) {
    this.activeTab = tab;
    this.changeControllerView();
    this.changeContentsView();

    this.$el.find('.wrapper').removeClass('product purchase').addClass(tab=='sales'?'product':'purchase');
  },
  changeControllerView: function() {
    this.setSubview('controller', new (this.getControllerViewClass())(
      this.params
    )).render().$el.appendTo(this.$('._controller'));
  },
  fetchCollection: function(collection) {
    return collection.fetch({
      data: {
        page: this.params.page,
        'search-field': this.params['search-field'],
        'search-text': this.params['search-text'],
      }
    });
  },
  changeContentsView: function() {
    var contentsView = this.getSubview('contents');
    if (contentsView) {
      contentsView.$el.addClass("loading");
    } else {
      this.renderLoading();
    }
    var collection = this.getCollection();
    var collectionDfd = this.fetchCollection(collection);
    var that = this;
    collectionDfd.always(function() {
      that.renderContents(collection);
    });
  },
  getControllerViewClass: function() {
    if (this.activeTab == 'sales') {
      return FancyBackbone.Views.Product.LogisticsNew.ItemProfile.ControllerView;
    } else {
      return FancyBackbone.Views.Product.LogisticsNew.PurchaseOrder.ControllerView;
    }
  },
  getContentsViewClass: function() {
    if (this.activeTab == 'sales') {
      return FancyBackbone.Views.Product.LogisticsNew.ItemProfile.ContentsView;
    } else {
      return FancyBackbone.Views.Product.LogisticsNew.PurchaseOrder.ContentsView;
    }
  },
  renderContents: function(collection) {
    this.removeSubview('loading');
    this.setSubview('contents', new (this.getContentsViewClass())({
      collection: collection,
    })).render().$el.appendTo(this.$("._main"));
  },
  renderLoading: function() {
    this.setSubview('loading', new FancyBackbone.Views.Base.LoadingView(
    )).render().$el.appendTo(this.$('._main'));
  },
  render: function() {
    this._super();
    this.$('> .ptit, > .menu').remove();
    this.setSubview('subnav', new FancyBackbone.Views.Product.LogisticsNew.SubNavView({
      activeTab: this.params.tab,
    })).render().$el.prependTo(this.$el);

    this.setSubview('title', new FancyBackbone.Views.Product.LogisticsNew.TitleView(
    )).render().$el.prependTo(this.$el);
    
    this.setActiveTab(this.params.tab);
    return this;
  },
});