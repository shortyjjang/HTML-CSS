FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.ChangeEndDatePopup = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'popup_change_end_date',
    events: {
        'click .btn-change': 'onChangeButtonClick'
    },
    templateData: function () {
        return {
        };
    },
    open: function (endDate) {
        this.$el.find('.date').datepicker().datepicker('setDate', moment(endDate).format('MM/DD/YYYY'));
        $.dialog("change_end").open();
    },
    validateData: function () {
        var newEndDate = this.$el.find('.date').datepicker('getDate');
        if (newEndDate.getTime() < moment(this.startDate).toDate().getTime()) {
            alert(gettext('End date cannot be before start date.'));
            this.$el.find('.date').datepicker('setDate', moment(this.endDate).format('MM/DD/YYYY'));
            return false;
        }

        return true;
    },
    syncModel: function () {
        this.productDetail.set('start_date', moment(this.startDate).format('MM/DD/YYYY'));
        this.productDetail.set('end_date', moment(this.$el.find('.date').datepicker('getDate')).format('MM/DD/YYYY'));
    },
    saveProductDetail: function () {
        var that = this;
        this.productDetail.save().success(function () {
            that.sourceView.render();
        }).error(function (jqXHR) {
            var message = jqXHR.responseJSON && jqXHR.responseJSON.message || gettext('Failed to change end date. Please try again later.');
            alert(message);
        }).always(function () {
            $.dialog("change_end").close();
        });
    },
    onChangeButtonClick: function () {
        if (this.validateData()) {
            this.syncModel();
            this.saveProductDetail();
        }
    },
    render: function (sourceView, product) {
        var that = this;
        var superFn = this._super;
        superFn.apply(that);

        this.sourceView = sourceView;
        this.product = product;
        this.startDate = product.get('start_date');
        this.endDate = product.get('end_date');

        this.productDetail = FancyBackbone.Models.Product.Product.find({
            id_str: product.get('id_str'),
            user: window.seller
        });

        $.when(this.productDetail.fetch()).done(function () {
            that.open(that.productDetail.get('end_date'));
        });
        return this;
    }
});