FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.ImportImageFromUrl = FancyBackbone.Views.Base.TemplateView.extend({
  template: 'popup_import_image_from_url',
  events: {
    'click .btn-save': 'onImportButtonClick',
  },
  open: function() {
    this.render();
    $.dialog("import-url").open();
  },
  onImportButtonClick: function() {
    var url = this.$el.find('input:text').val();
    FancyBackbone.App.eventAggregator.trigger("import:saleitemimage", url);
    $.dialog("import-url").close();
  },
  render: function() {
    var that = this;
    var superFn = this._super;
    superFn.apply(that);
    return this;
  },
});
