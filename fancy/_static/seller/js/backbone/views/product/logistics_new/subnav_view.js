FancyBackbone.Views.Product = FancyBackbone.Views.Product || {};
FancyBackbone.Views.Product.LogisticsNew = FancyBackbone.Views.Product.LogisticsNew || {};

FancyBackbone.Views.Product.LogisticsNew.SubNavView = FancyBackbone.Views.Base.TemplateView.extend({
  template: 'product_logistics_subnav.new',
  templateHelpers: {
    getURLForTab: function(tabName) {
      return "/merchant/products/logistics?" + $.param(_.extend(
        {},
        FancyBackbone.Utils.commonParams,
        {
          tab: tabName
        }
      ));
    },
  },
  tagName: 'ul',
  className: 'menu',
  events: {
    "click li a:not(.current)": "onNavTabButtonClick",
  },
  initialize: function(options) {
    this.model = new FancyBackbone.Models.PurchaseOrder.Stat({user: window.seller});
    this.modelDfd = this.model.fetch();
    this.activeTab = options.activeTab;
    this.listenTo(FancyBackbone.App.eventAggregator, 'change:tab', _.bind(this.onParamTabChange, this));
  },
  onParamTabChange: function(params) {
    this.setActiveTab(params.tab);
  },
  setActiveTab: function(tabName) {
    tabName = tabName || "sales";
    this.$el.find("a.current").removeClass("current");
    this.$el.find("a[name=" + (tabName=='sales'?'sales':'po_saved') + "]").addClass("current");
    this.activeTab = tabName;
  },
  onNavTabButtonClick: function(event) {
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    this.setActiveTab($currentTarget.attr('name'))
    var href = $(event.currentTarget).attr('href');
    window.router.navigate(href, {trigger: true});
  },
  render: function() {
    this._super();
    var that = this;
    this.setActiveTab(this.activeTab);
    return this;
  },
});
