FancyBackbone.Views.Admin = FancyBackbone.Views.Admin || {};
FancyBackbone.Views.Admin.Merchant = FancyBackbone.Views.Admin.Merchant || {};
FancyBackbone.Views.Admin.Merchant.WarehousePayment = FancyBackbone.Views.Admin.Merchant.WarehousePayment || {};

FancyBackbone.Views.Admin.Merchant.WarehousePayment.MainView = FancyBackbone.Views.Base.View.extend({
    template: FancyBackbone.Utils.loadTemplate("warehouse_payment_main"),
    events: {
        'keyup input.search_query': 'onSearchQueryKeyup',
        'change select[name="action"]': 'onSelectActionChange',
    },
    initialize: function (options) {
        this._super();
        this.params = options.params;
        this.collection = new FancyBackbone.Collections.Admin.Merchant.WarehousingFeeCollection({
        });
        this.listenTo(this.collection, 'reset', this.onCollectionReset);
    },
    onSearchQueryKeyup: function (e) {
        if (e.which === 13) { // enter key
            var searchParam = {'merchant_name': null, 'merchant_username': null};  // list all available search keys
            var searchKey = this.$('select[name="search_key"]').val();
            searchParam[searchKey] = $.trim($(e.currentTarget).val());
            window.router.navigate(FancyBackbone.Utils.makeURL(searchParam, true), {trigger: true});
        }
    },
    onSelectActionChange: function (e) {
        var $select = $(e.currentTarget);
        var selected = $select.val();

        var that = this;
        var warehousingFeeModels = _.map(this.$('table tbody tr input[type="checkbox"]:checked'), function (input) {
            return that.collection.get($(input).closest('tr').attr('warehousing_fee_id'));
        });

        if (selected == 'custom_cost') {
            if (warehousingFeeModels.length != 1) {
                $select.val('');
                alert('Please select warehousing fee.');
                return false;
            }

            var warehousingFeeModel = warehousingFeeModels[0];
            window.popups.customCost.render(warehousingFeeModel);
            $select.val('');

        } else if (selected == 'custom_markup') {
            if (warehousingFeeModels.length == 0) {
                $select.val('');
                alert('Please select at least one warehousing fee to apply custom markup to.');
                return false;
            }

            window.popups.customMarkup.render(warehousingFeeModels);
            $select.val('');

        } else if (selected == 'view_fee_history') {
            if (warehousingFeeModels.length != 1) {
                $select.val('');
                alert('Please select warehousing fee.');
                return false;
            }

            var warehousingFeeModel = warehousingFeeModels[0];
            window.popups.feeHistory.render(warehousingFeeModel);
            $select.val('');

        } else if (selected == 'export_csv') {
            if (warehousingFeeModels.length == 0) {
                $select.val('');
                alert('Please select at least one warehousing fee to apply custom markup to.');
                return false;
            }

            var warehousingFeeModels = warehousingFeeModels;
            var fee_ids = '';
            for (var i=0; i < warehousingFeeModels.length; i++) {
                var warehousingFeeModel = warehousingFeeModels[i];
                fee_ids = fee_ids + warehousingFeeModel.get('id') + ',';
            }
            if (fee_ids.length) {
                fee_ids = fee_ids.slice(0, -1);
            }

            window.open('/_admin/merchant/warehouse-payment-csv?ids='+fee_ids);
            $select.val('');

        } else if (selected == 'view_invoice') {
            if (warehousingFeeModels.length != 1) {
                $select.val('');
                alert('Please select warehousing fee.');
                return false;
            }
            var warehousingFeeModel = warehousingFeeModels[0];
            window.popups.viewInvoice.render(warehousingFeeModel);
            $select.val('');
        }
    },
    onCollectionReset: function () {
        this.$('#infscr-loading').hide();
        this.renderListing();
    },
    fetchCollection: function (params) {
        params = params || {};

        this.params = _.clone(params);

        if (_.has(params, 'ordering')) {
            params['ordering'] = params['ordering'].replace('shipped_orders', 'shipped_order_qty');
            params['ordering'] = params['ordering'].replace('merchant_username', 'seller_profile__brand_name');
            params['ordering'] = params['ordering'].replace('merchant_name', 'seller__username,from_date,to_date');
        }

        if (this.listingView) {
            this.listingView.remove();
            this.listingView = null;
        }

        if (this.paginationView) {
            this.paginationView.remove();
            this.paginationView = null;
        }

        this.$('#infscr-loading').show();
        return this.collection.fetch({
            reset: true,
            data: params
        });
    },
    renderListing: function () {
        if (this.listingView) this.listingView.remove();
        this.listingView = new FancyBackbone.Views.Admin.Merchant.WarehousePayment.ListingView({
            el: '<div id="payment_listing" class="table"></div>',
            collection: this.collection,
            ordering: _.has(this.params, 'ordering') && this.params['ordering'] ? this.params['ordering']: 'merchant_name'
        });
        this.$('.search.after').after(this.listingView.render().$el);

        if (this.paginationView) this.paginationView.remove();
        this.paginationView = new FancyBackbone.Views.Admin.Merchant.WarehousePayment.PaginationView({
            el: '<div class="pagination"></div>',
            collection: this.collection
        });
        this.listingView.$el.after(this.paginationView.render().$el);
    },
    templateData: function () {
        var params = _.clone(this.params);

        if (this.params['merchant_name']) {
            params['searchKey'] = 'merchant_name';
            params['searchQuery'] = this.params['merchant_name'];
        } else if (this.params['merchant_username']) {
            params['searchKey'] = 'merchant_username';
            params['searchQuery'] = this.params['merchant_username'];
        } else {
            params['searchKey'] = params['searchQuery'] = '';
        }

        return params;
    },
    render: function (reloadCollection) {
        reloadCollection = reloadCollection || false;
        this._super();

        this.$el.html(this.template(this.templateData()));
        this.renderControllerView();

        if (reloadCollection) {
            // reload collection first and then render listing & pagination view
            this.fetchCollection(this.params);
        } else {
            // render listing & pagination view with current collection
            this.renderListing();
        }

        return this;
    },
    renderControllerView: function () {
        if (this.controllerView) this.controllerView.remove();

        this.controllerView = new FancyBackbone.Views.Admin.Merchant.WarehousePayment.MainControllerView({
            el: '.controller-view',
            params: this.params
        });

        this.$('.search.after').before(this.controllerView.render().$el);
    },
});

FancyBackbone.Views.Admin.Merchant.WarehousePayment.MainControllerView = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'warehouse_payment_main_controller',
    events: {
        'click .controller a.range-button': 'onClickRangeButton',
        'click .controller .btn-update': 'onClickRangeUpdate',
    },
    initialize: function (options) {
        this._super();
        this.min_from_date = options.params['min_from_date'];
        this.max_to_date = options.params['max_to_date'];
    },
    templateData: function () {
        return {
            min_from_date: this.min_from_date,
            max_to_date: this.max_to_date,
        };
    },
    onClickRangeButton: function (e) {
        e.preventDefault();

        if (this.$('#datepickers').is(':visible')) {
            this.hideDatePickers();
        } else {
            this.showDatePickers();
        }
    },
    hideDatePickers: function () {
        this.$('#datepickers').hide().find('.btn-update').removeClass('selected');
    },
    showDatePickers: function () {
        this.$('#datepickers').show().find('.btn-update').addClass('selected');
    },
    onClickRangeUpdate: function (e) {
        e.preventDefault();

        var selectedDates = this.kalendae.getSelectedAsDates();
        if (selectedDates.length != 2) {
            alert('Please select payment range.');
            return false;
        }

        this.hideDatePickers();

        var dateFormat = 'YYYY-MM-DD';
        this.min_from_date = moment(selectedDates[0]).format(dateFormat);
        this.max_to_date = moment(selectedDates[1]).format(dateFormat);
        this.render();

        var navigateURL = FancyBackbone.Utils.makeURL({
            'min_from_date': this.min_from_date,
            'max_to_date': this.max_to_date,
        }, true);
        window.router.navigate(navigateURL, {trigger: true});
    },

    render: function () {
        this._super();
        this.renderKalendae();

        return this;
    },
    renderKalendae: function () {
        this.kalendae = new Kalendae('datepickers', {
            months: 1,
            mode: 'range',
            selected: [this.min_from_date, this.max_to_date],
            dayOutOfMonthClickable: true,
            viewStartDate: this.min_from_date
        });
    }
});
