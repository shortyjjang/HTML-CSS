FancyBackbone.Views.Admin = FancyBackbone.Views.Admin || {};
FancyBackbone.Views.Admin.Merchant = FancyBackbone.Views.Admin.Merchant || {};
FancyBackbone.Views.Admin.Merchant.WarehousePayment = FancyBackbone.Views.Admin.Merchant.WarehousePayment || {};

FancyBackbone.Views.Admin.Merchant.WarehousePayment.WarehousingFeeView = FancyBackbone.Views.Base.TemplateModelView.extend({
    tagName: 'tr',
    template: 'warehouse_payment_warehousing_fee',
    templateHelpers: {
        displayFee: function (fee) {
            return (fee? numeral(fee).format("$0,0.[0000]"): "N/A");
        },
        displayQty: function (qty) {
            return (qty? numeral(qty).format("0,0"): "N/A");
        },
    },
    initialize: function () {
        this._super();
        this.detailView = null;
        this.$el.attr('warehousing_fee_id', this.model.id);
    },
    events: {
        'click input[type="checkbox"]': 'onClickCheckbox',
        'click': 'onClickMerchantName',
    },
    onClickCheckbox: function (e) {
        e.stopPropagation();
    },
    onClickMerchantName: function (e) {
        e.preventDefault();
        var $warehousingFeeRow = $(e.currentTarget);

        if (this.detailView === null) {
            this.detailView = new FancyBackbone.Views.Admin.Merchant.WarehousePayment.WarehousingFeeDetailView({
                model: this.model,
                warehousing_fee_view: this
            }).render();

            this.detailView.$el.insertAfter($warehousingFeeRow);
        } else {
            this.detailView.$el.toggle();
        }
    },
    remove: function () {
        if (this.detailView !== null) {
            this.detailView.remove();
        }
        this._super();
    }
});

FancyBackbone.Views.Admin.Merchant.WarehousePayment.WarehousingFeeDetailView = FancyBackbone.Views.Base.TemplateModelView.extend({
    tagName: 'tr',
    className: 'view-detail',
    id: function () {
        return _.str.sprintf("warehousing_fee_%s", this.model.id);
    },
    template: 'warehouse_payment_warehousing_fee_detail',
    templateHelpers: {
        displayFee: function (fee) {
            return (fee? numeral(fee).format("$0,0.[0000]"): "N/A");
        },
        displayDatetime: function (datetime) {
            return (datetime? moment(datetime).format('YYYY-MM-DD HH:mm:ss'): "N/A");
        }
    },
    initialize: function (options) {
        this._super();
        this.$el.css('display', 'table-row');
        this.warehousing_fee_view = options.warehousing_fee_view;
        this.listenTo(this.model, 'sync', this.onModelSync);
    },
    onModelSync: function () {
        console.log('called onModelSync');
        this.render();
        this.warehousing_fee_view.render();
    },
    events: {
        'click .btn-view-invoice': 'onClickViewInvoiceButton',
        'click .btn-save': 'onClickSaveButton',
        'click .btn-prepayment-charge': 'onClickPrepaymentChargeButton',
        'click .btn-fee-charge': 'onClickFeeChargeButton',
    },
    validateModel: function ($row, allow_null_values) {
        allow_null_values = (typeof allow_null_values !== 'undefined') ? allow_null_values : true;

        var i, j, $input, $inputs, regex, type, inputVal, fieldName,
            intRegex = (allow_null_values? /^\d*$/: /^\d+$/),
            floatRegex = (allow_null_values? /^\d*(\.\d+)?$/: /^\d+(\.\d+)?$/),
            $intInputs = $row.find('input[type="text"][value-type="int"]'),
            $floatInputs = $row.find('input[type="text"][value-type="float"]');

        var validationTargets = [
            { $inputs: $intInputs, regex: intRegex, type: 'integer' },
            { $inputs: $floatInputs, regex: floatRegex, type: 'float' }
        ];

        for (i=0; i< validationTargets.length; i++) {
            $inputs = validationTargets[i].$inputs;
            regex = validationTargets[i].regex;
            type = validationTargets[i].type;

            for (j=0; j<$inputs.length; j++) {
                $input = $($inputs[j]);
                inputVal = $input.val();
                fieldName = $input.closest('tr').find('td:first-child').text();

                if (!regex.test(inputVal)) {
                    alert(_.str.sprintf("Please check value '%s' of field '%s'. It should be of %s type.", inputVal, fieldName, type));
                    $input.focus();
                    return false;
                }

                if (inputVal < 0) {
                    alert(_.str.sprintf("Please check value '%s' of field '%s'. It should not be negative.", inputVal, fieldName));
                    $input.focus();
                    return false;
                }
            }
        }

        return true;
    },
    syncModel: function (model, $row) {
        _.each($row.find('input[type="text"][value-type]'), function (input) {
            var $input = $(input);
            model.set($input.attr('name'), $input.val());
        });
        return model;
    },
    onClickViewInvoiceButton: function (e) {
        e.preventDefault();
        window.popups.viewInvoice.render(this.model);
    },
    onClickSaveButton: function (e) {
        e.preventDefault();
        var $saveBtn = $(e.currentTarget);
        var $row = this.$el;

        if (this.validateModel($row, true)) {
            this.syncModel(this.model, $row);
            $saveBtn.prop('disabled', true);

            this.model.save().then(function () {
                $saveBtn.prop('disabled', false);
                console.log('model saved');
            }, function () {
                alert("Save failed. Please try again later.");
                $saveBtn.prop('disabled', false);
            });
        }
    },
    onClickPrepaymentChargeButton: function (e) {
        e.preventDefault();

        var $chargeBtn = $(e.currentTarget);
        var $row = this.$el;

        if (this.validateModel($row, true)) {
            if (window.confirm('Are you sure you want to charge prepayment?')) {
                this.syncModel(this.model, $row);
                $chargeBtn.prop('disabled', true);

                var data = this.model.toJSON();
                data.charge_prepayment = true;

                this.model.save(data).then(function () {
                    $chargeBtn.prop('disabled', false);
                    alert('Prepayment charged.');
                    console.log('model saved & prepayment charged');
                }, function (jqXHR) {
                    var errorMsg = "Charging prepayment failed.";
                    if (typeof(jqXHR.responseJSON.status_code) !== "undefined" && jqXHR.responseJSON.status_code == 0) {
                        errorMsg += " " + jqXHR.responseJSON.message;
                    }
                    errorMsg += " Please try again later.";

                    alert(errorMsg);
                    $chargeBtn.prop('disabled', false);
                });

                this.model.unset('charge_prepayment', { silent: true });
            }
        }
    },
    onClickFeeChargeButton: function (e) {
        e.preventDefault();

        var $chargeBtn = $(e.currentTarget);
        var $row = this.$el;

        if (this.validateModel($row, false)) {
            if (window.confirm('Are you sure you want to charge payment?')) {
                this.syncModel(this.model, $row);
                $chargeBtn.prop('disabled', true);

                var data = this.model.toJSON();
                data.charge_fee = true;

                this.model.save(data).then(function () {
                    $chargeBtn.prop('disabled', false);
                    alert('Warehousing fee charged.');
                    console.log('model saved & payment charged');
                }, function (jqXHR) {
                    var errorMsg = "Charging warehousing fee failed.";
                    if (typeof(jqXHR.responseJSON.status_code) !== "undefined" && jqXHR.responseJSON.status_code == 0) {
                        errorMsg += " " + jqXHR.responseJSON.message;
                    }
                    errorMsg += " Please try again later.";

                    alert(errorMsg);
                    $chargeBtn.prop('disabled', false);
                });

                this.model.unset('charge_fee', { silent: true });
            }
        }
    },
});

FancyBackbone.Views.Admin.Merchant.WarehousePayment.ListingView = FancyBackbone.Views.Base.TemplateCollectionView.extend({
    listItemViewClass: FancyBackbone.Views.Admin.Merchant.WarehousePayment.WarehousingFeeView,
    listSelector: 'table.tb-type1 tbody',
    template: FancyBackbone.Utils.loadTemplate("warehouse_payment_listing"),
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
        'click input[type="checkbox"].header': 'onClickHeaderCheckBox',
        'click a.merchant-name-header': 'onClickMerchantNameHeader',
        'click a.merchant-username-header': 'onClickMerchantUserNameHeader',
        'click a.period-header': 'onClickPeriodHeader',
        'click a.shipped-orders-header': 'onClickShippedOrdersHeader',
        'click a.prepayment-status-header': 'onClickPrepaymentStatusHeader',
        'click a.payment-status-header': 'onClickPaymentStatusHeader',
        'click a.total-fee-header': 'onClickTotalFeeHeader',
    },
    onClickHeaderCheckBox: function (e) {
        this.$('table tbody tr input[type="checkbox"]').prop('checked', $(e.currentTarget).is(':checked'));
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
    onClickMerchantUserNameHeader: function (e) {
        e.preventDefault();
        var ordering;
        if (this.ordering == 'merchant_username') {
            ordering = '-merchant_username';
        } else if (this.ordering == '-merchant_username') {
            ordering = 'merchant_username';
        } else {
            ordering = 'merchant_username';
        }

        window.router.navigate(FancyBackbone.Utils.makeURL({'ordering': ordering}, true), {trigger: true});
    },
    onClickShippedOrdersHeader: function (e) {
        e.preventDefault();
        var ordering;
        if (this.ordering == 'shipped_orders') {
            ordering = '-shipped_orders';
        } else if (this.ordering == '-shipped_orders') {
            ordering = 'shipped_orders';
        } else {
            ordering = 'shipped_orders';
        }
        window.router.navigate(FancyBackbone.Utils.makeURL({'ordering': ordering}, true), {trigger: true});
    },
    onClickPrepaymentStatusHeader: function (e) {
        e.preventDefault();
        var ordering;
        if (this.ordering == 'prepayment_status') {
            ordering = '-prepayment_status';
        } else if (this.ordering == '-prepayment_status') {
            ordering = 'prepayment_status';
        } else {
            ordering = 'prepayment_status';
        }
        window.router.navigate(FancyBackbone.Utils.makeURL({'ordering': ordering}, true), {trigger: true});
    },
    onClickPaymentStatusHeader: function (e) {
        e.preventDefault();
        var ordering;
        if (this.ordering == 'payment_status') {
            ordering = '-payment_status';
        } else if (this.ordering == '-payment_status') {
            ordering = 'payment_status';
        } else {
            ordering = 'payment_status';
        }
        window.router.navigate(FancyBackbone.Utils.makeURL({'ordering': ordering}, true), {trigger: true});
    },
    onClickTotalFeeHeader: function (e) {
        e.preventDefault();
        var ordering;
        if (this.ordering == 'total_fee') {
            ordering = '-total_fee';
        } else if (this.ordering == '-total_fee') {
            ordering = 'total_fee';
        } else {
            ordering = 'total_fee';
        }
        window.router.navigate(FancyBackbone.Utils.makeURL({'ordering': ordering}, true), {trigger: true});
    },
});
