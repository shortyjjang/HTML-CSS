FancyBackbone.Views.Base = FancyBackbone.Views.Base || {};

FancyBackbone.Views.Base.TemplateCollectionView = FancyBackbone.Views.Base.TemplateView.extend({
  initialize: function() {
    this._super();
    this.listItemViews = [];
  },
  createListItemView: function(listItemModel) {
    return new this.listItemViewClass({
      model: listItemModel
    }).render();
  },
  addListItemModel: function(listItemModel) {
    var listItemView = this.createListItemView(listItemModel);
    this.listItemViews.push(listItemView);
    this.$(this.listSelector).append(listItemView.$el);
  },
  clearListItemViews: function() {
    var that = this;
    _.each(this.listItemViews, function(listItemView) {
      that.stopListening(listItemView);
      listItemView.remove();
    });
    this.listItemViews = [];
  },
  render: function() {
    this.clearListItemViews();
    this._super();
    this.collection.each(this.addListItemModel, this);
    return this;
  },
  remove: function() {
    this.clearListItemViews();
    this._super();
  }
});
