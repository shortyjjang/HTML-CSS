FancyBackbone.Views.PosPayment = FancyBackbone.Views.PosPayment || {};

FancyBackbone.Views.PosPayment.ListView = Backbone.View.extend({
    tagName: 'div',
    className: 'wrapper new-listing',
    template: FancyBackbone.Utils.loadTemplate('pos_payment_list'),
    listItemTemplate: FancyBackbone.Utils.loadTemplate('pos_payment_list_item'),
    emptyTemplate: FancyBackbone.Utils.loadTemplate('pos_payment_empty_list'),
    events: {
        'click ul.tab3 > li > a[status]': 'onStatusChange',
        'click .pagination4 > .prev:not(.disabled)': 'onChangePageToPrev',
        'click .pagination4 > .next:not(.disabled)': 'onChangePageToNext',
        'click .btn-export': 'onClickExportButton',
    },
    onStatusChange: function(e) {
        e.preventDefault();
        this.status = $(e.target).attr('status');
        this._render();
    },
    onChangePageToPrev: function(e) {
        e.preventDefault();
        if( this.previous_cursor ) this.cursor = this.previous_cursor;
        this._render();
    },
    onChangePageToNext: function(e) {
        e.preventDefault();
        if( this.next_cursor ) this.cursor = this.next_cursor;
        this._render();
    },
    onClickExportButton: function(e) {
        e.preventDefault();
        var params = location.args || {};
        if( this.status ) params.status = this.status;
        window.open('/merchant/orders/pospayments.csv' + '?' + $.param(params));
    },
    getQueryString: function() {
        var params = {
            next_cursor: this.next_cursor,
            previous_cursor: this.previous_cursor,
        };
        if (this.sellerId) {
            params.seller_id = this.sellerId;
        }
        if (this.status) {
            params.status = this.status;
        }
        return $.param(params);
    },
    initialize: function(options) {
        this.sellerId = window.seller.id;
        this.status = null;
    },
    renderInfo: function() {
        this.$el.html(this.template(this.model.attributes));
        if (this.model.attributes.payments.length > 0) {
            this.previous_cursor = this.model.attributes.previous_cursor;
            this.next_cursor = this.model.attributes.next_cursor;
            this._appendContents();
        }
        return this;
    },
    render: function() {
        this.$el.html();
        return this;
    },
    _render: function() {
        this.model = new FancyBackbone.Models.PosPayment.List({
            seller: this.sellerId,
            cursor: this.cursor,
            status: this.status,
            whitelabel: this.whitelabel
        });
        var that = this;
        this.model.fetch().success(function(json) {
            that.renderInfo();
        });
    },
    updateView: function(sellerId, next_cursor, status) {
        this.sellerId = sellerId ? sellerId : window.seller.id;
        this.next_cursor = next_cursor;
        this.status = status;
        this._render();
    },
    _appendContents: function() {
        var idx = 0;
        _.each(this.model.attributes.payments, function(payment) {
          var $el = $("<tr>");
          $el.html(this.listItemTemplate(payment));
          if(idx<4) $el.find(".userinfo-tooltip").addClass("bot");
          this.$el.find("tbody").append($el);
          idx++;
        }, this);
    },
});
