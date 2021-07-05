FancyBackbone.Views.Admin = FancyBackbone.Views.Admin || {};
FancyBackbone.Views.Admin.Merchant = FancyBackbone.Views.Admin.Merchant || {};
FancyBackbone.Views.Admin.Merchant.WarehousePayment = FancyBackbone.Views.Admin.Merchant.WarehousePayment || {};

FancyBackbone.Views.Admin.Merchant.WarehousePayment.CustomCostPopup = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'warehouse_payment_popup_custom_cost',
    initialize: function (options) {
        this._super();
        this.warehousingFeeModel = null;
    },
    events: {
        'click .btn-cancel': 'onClickCancelButton',
        'click .btn-save': 'onClickSaveButton',
    },
    onClickCancelButton: function (e) {
        this.closePopup();
    },
    onClickSaveButton: function (e) {
        var warehousingFeeModel = this.warehousingFeeModel;
        var original_rate_constants = {};

        for (var key in warehousingFeeModel.get('original_rate_constants')) {
            original_rate_constants[key] = $('#'+key.toLowerCase()).val();
        }

        warehousingFeeModel.set('original_rate_constants', original_rate_constants);
        warehousingFeeModel.save({original_rate_constants: original_rate_constants});

        this.closePopup();
    },
    render: function (warehousingFeeModel) {
        this.warehousingFeeModel = warehousingFeeModel;

        this._super();
        for (var key in warehousingFeeModel.get('original_rate_constants')) {
            $('#'+key.toLowerCase()).val(warehousingFeeModel.get('original_rate_constants')[key]);
        }
        this.openPopup();

        return this;
    },
    openPopup: function () {
        $.dialog("custom_cost").open();
    },
    closePopup: function () {
        $.dialog("custom_cost").close();
    }
});

