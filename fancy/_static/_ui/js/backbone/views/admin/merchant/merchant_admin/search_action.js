FancyBackbone.Views.Admin = FancyBackbone.Views.Admin || {};
FancyBackbone.Views.Admin.Merchant = FancyBackbone.Views.Admin.Merchant || {};
FancyBackbone.Views.Admin.Merchant.MerchantAdmin = FancyBackbone.Views.Admin.Merchant.MerchantAdmin || {};

FancyBackbone.Views.Admin.Merchant.MerchantAdmin.SearchActionView = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'merchant_admin_search_action',
    events: {
        'keyup .search_query': 'onKeyupSearchQuery',
        'change select[name="action"]': 'onChangeAction'
    },
    initialize: function (options) {
        this._super();
        this.params = options.params;

        if (this.params['merchant_name']) {
            this.search_key = 'merchant_name';
            this.search_query = this.params['merchant_name'];
        } else if (this.params['admin_name']) {
            this.search_key = 'admin_name';
            this.search_query = this.params['admin_name'];
        } else {
            this.search_key = '';
            this.search_query = '';
        }
    },
    templateData: function () {
        return {
            search_key: this.search_key,
            search_query: this.search_query
        };
    },
    onKeyupSearchQuery: function (e) {
        if (e.which === 13) { // enter key
            var searchParam = {'merchant_name': null, 'admin_name': null};  // list all available search keys
            var searchKey = $.trim(this.$('select[name="search_key"]').val());
            searchParam[searchKey] = $.trim($(e.currentTarget).val());
            window.router.navigate(FancyBackbone.Utils.makeURL(searchParam, true), {trigger: true});
        }
    },
    onChangeAction: function (e) {
        FancyBackbone.App.eventAggregator.trigger('change:action', $(e.currentTarget).val());
        $(e.currentTarget).val('');
    }
});