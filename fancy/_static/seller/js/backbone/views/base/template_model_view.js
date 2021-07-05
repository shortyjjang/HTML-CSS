FancyBackbone.Views.Base = FancyBackbone.Views.Base || {};

FancyBackbone.Views.Base.TemplateModelView = FancyBackbone.Views.Base.TemplateView.extend({
  templateData: function() {
    return this.model.toJSON();
  }
});
