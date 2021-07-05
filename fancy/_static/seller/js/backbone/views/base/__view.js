FancyBackbone.Views.Base = FancyBackbone.Views.Base || {};

FancyBackbone.Views.Base.View = Backbone.View.extend({
  initialize: function(options) {
    this.subviews = {};
  },
  setSubview: function(subviewName, subview) {
    this.removeSubview(subviewName);
    this.subviews[subviewName] = subview;
    return subview;
  },
  getSubview: function(subviewName) {
    return this.subviews[subviewName];
  },
  removeSubview: function(subviewName) {
    if (_.has(this.subviews, subviewName)) {
      this.subviews[subviewName].remove();
      delete this.subviews[subviewName];
    }
  },
  removeAllSubviews: function() {
    _.each(_.keys(this.subviews), this.removeSubview, this);
  },
  remove: function() {
    this.removeAllSubviews();
    this._super();
  },
});
