FancyBackbone.Views.Base = FancyBackbone.Views.Base || {};

FancyBackbone.Views.Base.TemplateView = FancyBackbone.Views.Base.View.extend({
    templateHelpers: {},
    templateData: {},
    templateNumberFormatters: {
        formatInteger: FancyBackbone.Delegates.NumberFormatters.integer,
        formatPrice: FancyBackbone.Delegates.NumberFormatters.price,
        formatFloat: FancyBackbone.Delegates.NumberFormatters.float,
        formatGeneric: FancyBackbone.Delegates.NumberFormatters.format
    },
    renderTemplate: function () {
        return FancyBackbone.Delegates.renderTemplate(
            this.template,
            _.extend(
                {},
                _.result(this, 'templateNumberFormatters'),
                _.result(this, 'templateHelpers')
            ),
            _.result(this, 'templateData')
        );
    },
    render: function () {
        this.$el.html(this.renderTemplate());
        return this;
    }
});
