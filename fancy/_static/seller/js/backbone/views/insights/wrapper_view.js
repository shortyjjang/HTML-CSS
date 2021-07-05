FancyBackbone.Views.Insights.WrapperView = Backbone.View.extend({
  tagName: 'div',
  className: 'default-overview after',
  initialize: function(options) {
    this.tagName = options.tagName ? options.tagName : 'div';
    this.className = options.className ? options.className : 'default-overview after';
    this.viewClass = options.viewClass;
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.sellerId = options.sellerId;
  },
  reloadContents: function(options) {
    this.$el.find("dl.data").addClass("loading");
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.sellerId = options.sellerId;
    this.render();
  },
  render: function() {
    this.views = [];
    var that = this;
    _.each(this.viewClass, function(view) {
      that.views.push(that._createView(view));
    });
    _.each(this.views, function(view) {
      that.$el.append(view.render().$el);
    });
    return this;
  },
  _createView: function(viewClass) {
    if (viewClass == FancyBackbone.Views.Insights.BestSellerView) {
      var bestSellerCollection = window.seller.get('insights_best_sellers');
      bestSellerCollection.range = this.range;
      bestSellerCollection.dateFrom = this.dateFrom;
      bestSellerCollection.dateTo = this.dateTo;
      return new FancyBackbone.Views.Insights.BestSellerView({
        collection: bestSellerCollection,
        sortField: 'quantity_ordered',
        sortDir: 'desc',
      });
    } else {
      var that = this;
      return new (viewClass)({
        user: window.seller,
        range: that.range,
        dateFrom: that.dateFrom,
        dateTo: that.dateTo,
      });
    }
  }
});