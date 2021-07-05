FancyBackbone.Views.Admin = FancyBackbone.Views.Admin || {};
FancyBackbone.Views.Admin.Merchant = FancyBackbone.Views.Admin.Merchant || {};
FancyBackbone.Views.Admin.Merchant.WarehousePayment = FancyBackbone.Views.Admin.Merchant.WarehousePayment || {};

FancyBackbone.Views.Admin.Merchant.WarehousePayment.ViewInvoicePopup = FancyBackbone.Views.Base.TemplateView.extend({
    model: FancyBackbone.Models.Admin.Merchant.WarehousingFee,
    template: FancyBackbone.Utils.loadTemplate("warehouse_payment_popup_view_invoice"),
    templateData: function () {
        return {
            model: this.model.toJSON(),
            today_date: new Date().toString().split(' ').splice(1,3).join(', '),
            warehousing_fee: this.warehousing_fee
        }
    },
    templateHelpers: {
        displayFee: function (fee) {
            return (fee? numeral(fee).format("$0,0.[0000]"): "N/A");
        },
        displayQty: function (qty) {
            return (qty? numeral(qty).format("0,0"): "N/A");
        },
        displayDatetime: function (datetime) {
            return (datetime? moment(datetime).format('YYYY-MM-DD HH:mm:ss'): "N/A");
        }
    },
    initialize: function (options) {
        this._super();
    },
    events: {
        'click button.ly-close': 'onClickCloseButton',
        'click button.btn-done': 'onClickCloseButton',
        'click button.btn-print': 'onClickPrintButton'
    },
    onClickCloseButton: function () {
        this.closePopup();
    },
    onClickPrintButton: function () {
        console.log("Print Invoice");
        var originalStyleCSS = this.el.style.cssText;
        this.el.style.marginTop = "0px";
        this.el.style.marginLeft = "0px";
        this.el.style.width = "100%";
        $(this.el).find('.data-field')[0].style.height = "1700px";
        $(this.el).find('.btn-area').hide();
        $(this.el).print();
        $(this.el).find('.data-field')[0].style.height = "666px";
        $(this.el).find('.btn-area').show();
        this.el.style.cssText = originalStyleCSS;
    },
    render: function (warehousing_fee) {
        var superFn = this._super;
        var that = this;
        this.model = warehousing_fee;

        warehousing_fee.fetch().done(function () {
            that.warehousing_fee = warehousing_fee;
            superFn.apply(that);
            that.openPopup();
        });
        return this;
    },
    openPopup: function () {
        $.dialog("show_invoice").open();
    },
    closePopup: function () {
        $.dialog("show_invoice").close();
    }
});
