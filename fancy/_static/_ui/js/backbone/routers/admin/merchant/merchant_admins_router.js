FancyBackbone.Routers.Admin = FancyBackbone.Routers.Admin || {};
FancyBackbone.Routers.Admin.Merchant = FancyBackbone.Routers.Admin.Merchant || {};

FancyBackbone.Routers.Admin.Merchant.MerchantAdminRouter = Backbone.Router.extend({
    routes: {
        "_admin/merchant/merchant-admin(/)": "index"
    },
    defaultParams: {
        page: 1,
        ordering: ''
    },
    index: function (params) {
        params = params || {};
        _.defaults(params, this.defaultParams);

        this.params = params;

        if (!window.view) {
            window.view = new FancyBackbone.Views.Admin.Merchant.MerchantAdmin.MainView({
                el: $('.main-view'),
                params: this.params
            }).render();
        }

        window.view.fetchCollection(this.params).fail(function (jqXHR) {
            if (jqXHR.status == 404) {
                // Current page has been removed.
                window.view.navigateToLastPage();
            }
        });
    }
});