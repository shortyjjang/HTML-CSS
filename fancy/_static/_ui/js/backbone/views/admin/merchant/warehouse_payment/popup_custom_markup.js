FancyBackbone.Views.Admin = FancyBackbone.Views.Admin || {};
FancyBackbone.Views.Admin.Merchant = FancyBackbone.Views.Admin.Merchant || {};
FancyBackbone.Views.Admin.Merchant.WarehousePayment = FancyBackbone.Views.Admin.Merchant.WarehousePayment || {};

FancyBackbone.Views.Admin.Merchant.WarehousePayment.CustomMarkupPopupWarehousingFeeItem = FancyBackbone.Views.Base.TemplateView.extend({
    tagName: 'tr',
    template: 'warehouse_payment_popup_custom_markup_warehousing_fee_item',
    templateData: function () {
        return {
            index: this.options.index,
            markupDefinition: this.options.markupDefinition
        }
    },
    initialize: function (options) {
        this._super();
        this.options = options;
    },
    events: {
        'change #threshold': 'onChangeThreshold',
        'change #markup': 'onChangeMarkup',
    },
    onChangeThreshold: function (e) {
        var $input = $(e.currentTarget);
        this.options.markupDefinition['threshold'] = $input.val();
    },
    onChangeMarkup: function (e) {
        var $input = $(e.currentTarget);
        this.options.markupDefinition['markup'] = $input.val();
    },
});

FancyBackbone.Views.Admin.Merchant.WarehousePayment.CustomMarkupPopup = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'warehouse_payment_popup_custom_markup',
    initialize: function (options) {
        this._super();
        this.warehousingFeeItemViews = [];
        this.warehousingFeeModels = [];
    },
    events: {
        'click .btn-del': 'onClickDeleteButton',
        'click .add_new_tier': 'onClickAddNewTier',
        'click .btn-cancel': 'onClickCancelButton',
        'click .btn-close': 'onClickCloseButton',
        'click .btn-apply': 'onClickApplyButton',
    },
    onClickDeleteButton: function (e) {
        if (this.markupDefinitionList.length == 2) {
            alert('There should be two markup definitions at least.');
            return false;
        }
        var $delBtn = $(e.currentTarget);
        var markupIndex = parseInt($delBtn.attr('markupIndex'));

        this.markupDefinitionList.splice(markupIndex, 1);
        this.renderWarehousingFeeMarkup();
    },
    onClickAddNewTier: function (e) {
        this.markupDefinitionList.push({ threshold: null, markup: "0" });
        this.renderWarehousingFeeMarkup();
    },
    onClickCancelButton: function () {
        this.closePopup();
    },
    onClickCloseButton: function () {
        this.closePopup();
    },
    onClickApplyButton: function (e) {
        var warehousingFeeMarkup, threshold, markup, i;
        var that = this;

        // remove empty rows
        var removeFromIndex = -1;
        for (i=this.markupDefinitionList.length - 1; i >= 0; i--) {
            warehousingFeeMarkup = this.markupDefinitionList[i];
            if (!$.trim(warehousingFeeMarkup.threshold) && !$.trim(warehousingFeeMarkup.markup)) {
                removeFromIndex = i;
            } else {
                break;
            }
        }

        if (removeFromIndex == 0) {
            alert('Please enter markup definitions.');
            return false;
        } else if (removeFromIndex > -1) {
            this.markupDefinitionList.splice(removeFromIndex, this.markupDefinitionList.length - removeFromIndex);
            this.renderWarehousingFeeMarkup();
        }

        for (i=0; i< this.markupDefinitionList.length; i++) {
            warehousingFeeMarkup = this.markupDefinitionList[i];
            threshold = parseInt(warehousingFeeMarkup['threshold']);
            markup = parseFloat(warehousingFeeMarkup['markup']);

            if (_.some([threshold, markup], isNaN)) {
                alert('Please check values.');
                this.renderWarehousingFeeMarkup();
                return false;
            }

            warehousingFeeMarkup['threshold'] = threshold;
            warehousingFeeMarkup['markup'] = markup;
        }

        var warehousingFeeMarkupLastLast = this.markupDefinitionList[this.markupDefinitionList.length - 2];
        var warehousingFeeMarkupLast = this.markupDefinitionList[this.markupDefinitionList.length - 1];
        var threshold1 = parseInt(warehousingFeeMarkupLastLast['threshold']);
        var threshold2 = parseInt(warehousingFeeMarkupLast['threshold']);
        if (threshold1 != threshold2) {
            alert('Last two markups should have same threshold values.');
            return false;
        }

        this.renderWarehousingFeeMarkup();

        var markupDefinitionList = JSON.parse(JSON.stringify(this.markupDefinitionList));
        _.each(markupDefinitionList, function (markupDefinition) {
            markupDefinition.markup = markupDefinition.markup / 100;
        });

        var dfds = [];
        for (i=0; i < this.warehousingFeeModels.length; i++) {
            var model = this.warehousingFeeModels[i];
            model.set('markup_definitions', JSON.stringify(markupDefinitionList));
            dfds.push(model.save());
        }

        $.when.apply($, dfds).done(function () {
            that.closePopup();
        }).fail(function (jqXHR) {
            if (jqXHR.responseJSON.message) {
                alert(jqXHR.responseJSON.message);
            }
        });
    },
    clearWarehousingFeeMarkupViews: function () {
        var that = this;
        _.each(this.warehousingFeeItemViews, function (warehousingFeeItemView) {
            that.stopListening(warehousingFeeItemView);
            warehousingFeeItemView.remove();
        });
        this.warehousingFeeItemViews = [];
    },
    renderWarehousingFeeMarkup: function () {
        var that = this;
        var $listBody = this.$('div table.tb-type2 tbody');

        this.clearWarehousingFeeMarkupViews();

        _.each(this.markupDefinitionList, function (markupDefinition, index) {
            var warehousingFeeItemView = new FancyBackbone.Views.Admin.Merchant.WarehousePayment.CustomMarkupPopupWarehousingFeeItem({
                markupDefinition: markupDefinition,
                index: index,
            }).render();
            that.warehousingFeeItemViews.push(warehousingFeeItemView);
            $listBody.append(warehousingFeeItemView.$el);
        }, this);
    },
    render: function (warehousingFeeModels) {
        this.warehousingFeeModels = warehousingFeeModels;

        if (this.warehousingFeeModels.length == 1) {
            var markupDefinitionList = JSON.parse(this.warehousingFeeModels[0].get('markup_definitions'));
            _.each(markupDefinitionList, function (markupDefinition) {
                markupDefinition.markup = markupDefinition.markup * 100; // convert to percent
            });

            this.markupDefinitionList = markupDefinitionList;
        } else {
            var defaultMarkupLevels = 4;
            this.markupDefinitionList = _.map(_.range(defaultMarkupLevels), function () {
                return {threshold: null, markup: null}
            });
        }

        this._super();
        this.renderWarehousingFeeMarkup();
        this.openPopup();

        return this;
    },
    openPopup: function () {
        $.dialog("custom_vol").open();
    },
    closePopup: function () {
        $.dialog("custom_vol").close();
    }
});
