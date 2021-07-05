FancyBackbone.Views.Base = FancyBackbone.Views.Base || {};

FancyBackbone.Views.Base.Layout = FancyBackbone.Views.Base.TemplateView.extend({
  initialize: function(options) {
    this.subviews = {};
  },
  renderContents: function() { },
  renderLoading: function() { },
  render: function() {
    this._super();
    return this;
  },
});
