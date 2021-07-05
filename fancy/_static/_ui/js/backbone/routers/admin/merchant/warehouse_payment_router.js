FancyBackbone.Routers.Admin = FancyBackbone.Routers.Admin || {};
FancyBackbone.Routers.Admin.Merchant = FancyBackbone.Routers.Admin.Merchant || {};

FancyBackbone.Routers.Admin.Merchant.WarehousePaymentRouter = Backbone.Router.extend({
    routes: {
        "_admin/merchant/warehouse-payment(/)": "index"
    },
    defaultParams: {
        page: 1,
        ordering: '',
        min_from_date: moment().subtract({M: 6}).format('YYYY-MM-DD'),
        max_to_date: moment().add({M: 6}).format('YYYY-MM-DD'),
    },
    index: function (params) {
        params = params || {};
        _.defaults(params, this.defaultParams);

        this.params = params;

        if (!window.view) {
            window.view = new FancyBackbone.Views.Admin.Merchant.WarehousePayment.MainView({
                el: $('.main-view'),
                params: this.params
            }).render(true);
        } else {
            window.view.fetchCollection(this.params);
        }
    },
});