FancyBackbone.Models.Admin = FancyBackbone.Models.Admin || {};
FancyBackbone.Models.Admin.Merchant = FancyBackbone.Models.Admin.Merchant || {};

FancyBackbone.Collections.Admin = FancyBackbone.Collections.Admin || {};
FancyBackbone.Collections.Admin.Merchant = FancyBackbone.Collections.Admin.Merchant || {};

FancyBackbone.Models.Admin.Merchant.WarehousingFeeHistory = Backbone.RelationalModel.extend({
    initialize: function (options) {
    },
});

FancyBackbone.Collections.Admin.Merchant.WarehousingFeeHistoryCollection = Backbone.Collection.extend({
    model: FancyBackbone.Models.Admin.Merchant.WarehousingFeeHistory,
});


FancyBackbone.Models.Admin.Merchant.WarehousingFee = Backbone.RelationalModel.extend({
    initialize: function (options) {
    },
    relations: [{
        type: Backbone.HasMany,
        key: 'fee_histories',
        relatedModel: FancyBackbone.Models.Admin.Merchant.WarehousingFeeHistory,
        collectionType: FancyBackbone.Collections.Admin.Merchant.WarehousingFeeHistoryCollection,
        includeInJSON: ['action_type_display', 'action_username', 'action_url', 'note', 'date_created'],
    }],
});

FancyBackbone.Collections.Admin.Merchant.WarehousingFeeCollection = Backbone.Collection.extend(_.extend(
    {},
    FancyBackbone.Mixins.FormatURLMixin,
    {
        model: FancyBackbone.Models.Admin.Merchant.WarehousingFee,
        urlFormat: '/rest-api/v1/warehousing_fee',
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