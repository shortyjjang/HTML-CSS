FancyBackbone.Views.Admin = FancyBackbone.Views.Admin || {};
FancyBackbone.Views.Admin.Merchant = FancyBackbone.Views.Admin.Merchant || {};
FancyBackbone.Views.Admin.Merchant.WarehousePayment = FancyBackbone.Views.Admin.Merchant.WarehousePayment || {};

//noinspection JSUnusedLocalSymbols
FancyBackbone.Views.Admin.Merchant.WarehousePayment.WarehousingFeeHistoryPopup = FancyBackbone.Views.Base.TemplateModelView.extend({
    template: FancyBackbone.Utils.loadTemplate("warehouse_payment_popup_fee_history"),
    initialize: function (options) {
        this._super();
    },
    events: {
    },
    render: function (warehousing_fee) {
        var superFn = this._super;
        var that = this;

        warehousing_fee.fetch().done(function () {
            that.model = warehousing_fee;
            superFn.apply(that);
            $.dialog("fee_history").open();
        });
        return this;
    }
});
