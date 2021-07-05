FancyBackbone.Views.Admin = FancyBackbone.Views.Admin || {};
FancyBackbone.Views.Admin.Merchant = FancyBackbone.Views.Admin.Merchant || {};
FancyBackbone.Views.Admin.Merchant.WarehousePayment = FancyBackbone.Views.Admin.Merchant.WarehousePayment || {};

FancyBackbone.Views.Admin.Merchant.WarehousePayment.PaginationView = FancyBackbone.Views.Base.TemplateView.extend({
    template: FancyBackbone.Utils.loadTemplate("warehouse_payment_pagination"),
    templateHelpers: {
        getPageURL: function (page) {
            return FancyBackbone.Utils.makeURL({page: page}, true);
        }
    },
    templateData: function () {
        return {
            page: this.collection.page,
            page_links: this.collection.page_links,
            prev: this.collection.prev,
            next: this.collection.next
        }
    },
    events: {
        'click .page-number': 'onClickPageNumber'
    },
    initialize: function (options) {
        this.collection = options.collection;
    },
    onClickPageNumber: function (e) {
        e.preventDefault();
        var $currentTarget = $(e.currentTarget);

        if (!$currentTarget.is(".disabled")) {
            var href = $currentTarget.attr('href');
            window.router.navigate(href, {trigger: true});
        }
    }
});
