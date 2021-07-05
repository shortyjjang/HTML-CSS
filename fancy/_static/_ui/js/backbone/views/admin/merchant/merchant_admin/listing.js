FancyBackbone.Views.Admin = FancyBackbone.Views.Admin || {};
FancyBackbone.Views.Admin.Merchant = FancyBackbone.Views.Admin.Merchant || {};
FancyBackbone.Views.Admin.Merchant.MerchantAdmin = FancyBackbone.Views.Admin.Merchant.MerchantAdmin || {};

FancyBackbone.Views.Admin.Merchant.MerchantAdmin.ListingHeaderView = FancyBackbone.Views.Base.TemplateModelView.extend({
    template: 'merchant_admin_listing_header',
    templateData: function () {
        return {
            ordering: this.ordering
        }
    },
    initialize: function (options) {
        this._super();
        this.ordering = options.ordering;
    }
});

FancyBackbone.Views.Admin.Merchant.MerchantAdmin.ListingItemView = FancyBackbone.Views.Base.TemplateModelView.extend({
    tagName: 'tr',
    template: 'merchant_admin_listing_item'
});

FancyBackbone.Views.Admin.Merchant.MerchantAdmin.ListingView = FancyBackbone.Views.Base.TemplateCollectionView.extend({
    listItemViewClass: FancyBackbone.Views.Admin.Merchant.MerchantAdmin.ListingItemView,
    listSelector: '.listing-item-view',
    template: FancyBackbone.Utils.loadTemplate("merchant_admin_listing"),
    templateData: function () {
        return {
            model_list: this.collection.results,
            ordering: this.ordering
        }
    },
    initialize: function (options) {
        this._super();
        this.collection = options.collection;
        this.ordering = options.ordering;
    },
    events: {
        'click a.merchant-name-header': 'onClickMerchantNameHeader',
        'click a.admin-name-header': 'onClickAdminNameHeader',
        'click input.checkbox-header': 'onClickCheckboxHeader',
    },
    onClickCheckboxHeader: function (e) {
        var headerChecked = $(e.currentTarget).prop('checked');
        this.$('.listing-item-view tr td input[type="checkbox"]').prop('checked', headerChecked);
    },
    onClickMerchantNameHeader: function (e) {
        e.preventDefault();

        // toggle ordering
        var ordering;
        if (this.ordering == 'merchant_name') {
            ordering = '-merchant_name';
        } else if (this.ordering == '-merchant_name') {
            ordering = 'merchant_name';
        } else {
            ordering = 'merchant_name';
        }

        window.router.navigate(FancyBackbone.Utils.makeURL({'ordering': ordering}, true), {trigger: true});
    },
    onClickAdminNameHeader: function (e) {
        e.preventDefault();

        // toggle ordering
        var ordering;
        if (this.ordering == 'admin_name') {
            ordering = '-admin_name';
        } else if (this.ordering == '-admin_name') {
            ordering = 'admin_name';
        } else {
            ordering = 'admin_name';
        }

        window.router.navigate(FancyBackbone.Utils.makeURL({'ordering': ordering}, true), {trigger: true});
    },
    renderListingHeader: function () {
        if (this.listHeaderView) this.listHeaderView.remove();

        this.listHeaderView = new FancyBackbone.Views.Admin.Merchant.MerchantAdmin.ListingHeaderView({
            ordering: this.ordering
        });
        this.$('thead').html(this.listHeaderView.renderTemplate());

        return this;
    },
    renderListingItems: function () {
        this.clearListItemViews();
        this.collection.each(this.addListItemModel, this);
    },
    render: function () {
        this._super();
        this.renderListingHeader();
    }
});
