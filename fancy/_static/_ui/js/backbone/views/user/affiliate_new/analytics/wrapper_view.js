FancyBackbone.Views.User.AffiliateNew.Analytics.WrapperView = Backbone.View.extend({
  tagName: 'div',
  className: 'default-overview after',
  initialize: function(options) {
    this.tagName = options.tagName ? options.tagName : 'div';
    this.className = options.className ? options.className : 'default-overview after';
    this.viewClass = options.viewClass;
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.username = options.username;
  },
  reloadContents: function(options) {
    this.$el.find("dl.data").addClass("loading");
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.username = options.username;
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
    var that = this;
    return new (viewClass)({
      username: that.username,
      range: that.range,
      dateFrom: that.dateFrom,
      dateTo: that.dateTo,
    });
  }
});