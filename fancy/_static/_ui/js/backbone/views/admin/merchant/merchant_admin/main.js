FancyBackbone.Views.Admin = FancyBackbone.Views.Admin || {};
FancyBackbone.Views.Admin.Merchant = FancyBackbone.Views.Admin.Merchant || {};
FancyBackbone.Views.Admin.Merchant.MerchantAdmin = FancyBackbone.Views.Admin.Merchant.MerchantAdmin || {};

FancyBackbone.Views.Admin.Merchant.MerchantAdmin.MainView = FancyBackbone.Views.Base.View.extend({
    events: {
        'click .btn-add': 'onClickAddBtn',
        'click .btn-del': 'onClickDelBtn'
    },
    initialize: function (options) {
        this._super();
        this.params = options.params;
        this.collection = new FancyBackbone.Collections.Admin.Merchant.MerchantAdminCollection({
        });
        this.listenTo(this.collection, 'reset', this.renderListingItemAndPagination);
        this.listenTo(this.collection, 'remove', this.renderListingItemAndPagination);
        this.listenTo(FancyBackbone.App.eventAggregator, 'change:action', this.onChangeAction);
    },
    onChangeAction: function (value) {
        var that = this,
            checkedModels = [];

        _.each(this.$('.listing-item-view tr td input[type="checkbox"]:checked'), function (element) {
            checkedModels.push(that.collection.get($(element).attr('model-id')));
        });

        if (checkedModels.length == 0) {
            alert('Please select row(s).');
            return false;
        }

        if (value == 'delete') {
            if (!window.confirm('Are you sure you want to delete selected row(s)?')) {
                return false;
            }

            var dfds = [];
            _.each(checkedModels, function (model) {
                dfds.push(model.destroy());
            });

            $.when.apply($, dfds).done(function () {
                that.fetchCollection().fail(function (jqXHR) {
                    if (jqXHR.status == 404) {
                        // Current page is removed.
                        that.navigateToLastPage();
                    }
                });
            });
        }
    },
    onClickAddBtn: function (e) {
        var $inputMerchantName = this.$('input.merchant-name');
        var merchantName = $.trim($inputMerchantName.val());
        var $inputAdminName = this.$('input.admin-name');
        var adminName = $.trim($inputAdminName.val());
        var adminGroups = [];
        var $chkboxAccountManager = this.$('#group_account_manager');
        var $chkboxSalesLead = this.$('#group_sales_lead');
        var addAdminToCheckedGroup = this.$('#group_add').is(':checked');
        var adminGroupNameById = {};
        adminGroupNameById[$chkboxAccountManager.val()] = $chkboxAccountManager.attr('display-value');
        adminGroupNameById[$chkboxSalesLead.val()] = $chkboxSalesLead.attr('display-value');

        // Validate inputs
        if (!merchantName) {
            alert('Please enter merchant name.');
            $inputMerchantName.focus();
            return false;
        }

        if (!adminName) {
            alert('Please enter admin name.');
            $inputAdminName.focus();
            return false;
        }

        if ($chkboxAccountManager.is(':checked')) {
            adminGroups.push($chkboxAccountManager.val());
        }

        if ($chkboxSalesLead.is(':checked')) {
            adminGroups.push($chkboxSalesLead.val());
        }

        if (adminGroups.length == 0) {
            alert('Please select admin group(s).');
            return false;
        }

        var that = this,
            dfds = [],
            failedGroups = [],
            failedMessages = [],
            successGroups = [],
            $btnAdd = $(e.currentTarget);

        $btnAdd.prop('disabled', true);
        _.each(adminGroups, function (element) {
            var deferred = $.Deferred();
            dfds.push(deferred);
            var adminGroupId = parseInt(element);

            var merchantAdmin = new FancyBackbone.Models.Admin.Merchant.MerchantAdmin();
            merchantAdmin.save({
                merchant_name: merchantName,
                admin_name: adminName,
                admin_group: adminGroupId,
                add_admin_to_checked_group: addAdminToCheckedGroup
            }).done(function () {
                successGroups.push(adminGroupNameById[adminGroupId])
            }).fail(function (jqXHR) {
                var msg = jqXHR.responseJSON['message'];
                failedMessages.push(msg? msg: '');
                failedGroups.push(adminGroupNameById[adminGroupId])
            }).always(function () {
                deferred.resolve();
            });
        });

        $.when.apply($, dfds).done(function () {
            var successMsg = '', failMsg = '';
            if (successGroups.length > 0) {
                successMsg += _.str.sprintf('Successful: %s', successGroups);
            }

            if (failedGroups.length > 0) {
                var details = [];
                _.each(failedGroups, function (failedGroup, index) {
                    var detail = failedGroup;
                    if (failedMessages[index]) {
                        detail += _.str.sprintf(' (%s)', failedMessages[index]);
                    }
                    details.push(detail);
                });

                failMsg += _.str.sprintf('Failed: %s', details.join(', '));
            }

            $btnAdd.prop('disabled', false);

            that.listenToOnce(that.collection, 'reset', function () {
                alert(_.filter([successMsg, failMsg], function (msg) { return msg; }).join('\n'));
            });

            that.fetchCollection();
        });
    },
    onClickDelBtn: function (e) {
        e.preventDefault();
        if (!window.confirm('Are you sure you want to delete?')) {
            return false;
        }

        var that = this;
        var model = this.collection.get($(e.currentTarget).attr('model-id'));
        model.destroy().done(function () {
            that.fetchCollection().fail(function (jqXHR) {
                if (jqXHR.status == 404) {
                    // Current page is removed.
                    that.navigateToLastPage();
                }
            });
        });
    },
    showLoading: function () {
        this.$('#infscr-loading').show();
    },
    hideLoading: function () {
        this.$('#infscr-loading').hide();
    },
    navigateToLastPage: function () {
        this.hideLoading();
        var lastPageUrl = FancyBackbone.Utils.makeURL({page: 'last'}, true);
        window.router.navigate(lastPageUrl, {trigger: true});
    },
    fetchCollection: function (params) {
        params = params || this.params;
        this.params = _.clone(params);

        if (_.has(params, 'ordering')) {
            params['ordering'] = params['ordering'].replace('merchant_name', 'merchant__username');
            params['ordering'] = params['ordering'].replace('admin_name', 'admin__username');
        }

        // render listing header view before fetching collection
        this.listingView.ordering = this.params['ordering']? this.params['ordering']: '';
        this.listingView.renderListingHeader();

        // hide listing item view & pagination view
        this.listingView.clearListItemViews();

        if (this.paginationView) {
            this.paginationView.remove();
            this.paginationView = null;
        }

        this.showLoading();

        return this.collection.fetch({
            reset: true,
            data: params
        });
    },
    templateData: function () {
        var params = _.clone(this.params);

        if (_.has(this.params, 'merchant_name')) {
            params['searchKey'] = 'merchant_name';
            params['searchQuery'] = this.params['merchant_name'];
        } else {
            params['searchKey'] = params['searchQuery'] = '';
        }

        return params;
    },
    renderPaginationView: function () {
        if (this.paginationView) {
            this.paginationView.remove();
            this.paginationView = null;
        }

        this.paginationView = new FancyBackbone.Views.Admin.Merchant.MerchantAdmin.PaginationView({
            el: '<div class="pagination"></div>',
            collection: this.collection
        });

        if (this.listingView) {
            this.listingView.$el.after(this.paginationView.render().$el);
        }
    },
    renderListingItemAndPagination: function () {
        this.hideLoading();

        // render listing items view & pagination view
        this.listingView.renderListingItems();
        this.renderPaginationView();
    },
    renderSearchActionView: function () {
        if (this.searchActionView) this.searchActionView.remove();

        this.searchActionView = new FancyBackbone.Views.Admin.Merchant.MerchantAdmin.SearchActionView({
            el: '.search-action-view',
            params: this.params
        });

        this.$('div.data-field').prepend(this.searchActionView.render().$el);

        return this.searchActionView;
    },
    renderListingView: function () {
        if (this.listingView) this.listingView.remove();

        this.listingView = new FancyBackbone.Views.Admin.Merchant.MerchantAdmin.ListingView({
            el: 'div.listing-view',
            collection: this.collection,
            ordering: this.params['ordering']? this.params['ordering']: ''
        });
        this.listingView.render();

        return this.listingView;
    },
    render: function () {
        this._super();

        this.renderSearchActionView();
        this.renderListingView();
        this.renderPaginationView();

        return this;
    }
});