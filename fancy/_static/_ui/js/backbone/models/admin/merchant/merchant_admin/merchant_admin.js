FancyBackbone.Models.Admin = FancyBackbone.Models.Admin || {};
FancyBackbone.Models.Admin.Merchant = FancyBackbone.Models.Admin.Merchant || {};

FancyBackbone.Collections.Admin = FancyBackbone.Collections.Admin || {};
FancyBackbone.Collections.Admin.Merchant = FancyBackbone.Collections.Admin.Merchant || {};

FancyBackbone.Models.Admin.Merchant.MerchantAdmin = Backbone.RelationalModel.extend({
    urlRoot: '/rest-api/v1/merchant_admin',
    initialize: function (options) {
    }
});

FancyBackbone.Collections.Admin.Merchant.MerchantAdminCollection = Backbone.Collection.extend(_.extend(
    {},
    FancyBackbone.Mixins.FormatURLMixin,
    {
        model: FancyBackbone.Models.Admin.Merchant.MerchantAdmin,
        urlFormat: '/rest-api/v1/merchant_admin',
        urlParams: function () {
            return [];
        },
        initialize: function (options) {
        },
        parse: function(response) {
            this.page = response.page;
            this.page_links = response.page_links;
            this.count = response.count;
            this.prev = response.previous;
            this.next = response.next;
            this.results = response.results;

            return this.results;
        }
    }
));