FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};

FancyBackbone.Views.Popup.DemoProductHelpPopup = FancyBackbone.Views.Base.TemplateView.extend({
  template: FancyBackbone.Utils.loadTemplate('popup_demo_product_help'),
  events: {
    'click .btn-okay': 'onOkayButtonClick'
  },
  render: function(saleOrderCollection) {
    this.$el.html(this.template({}));
    return this;
  },
  open: function() {
    this.$el.show();
    $.dialog("demo_help").open();
  },
  close: function() {
    $.dialog("demo_help").close();
  },
  onOkayButtonClick: function() {
    this.close();
  }
});