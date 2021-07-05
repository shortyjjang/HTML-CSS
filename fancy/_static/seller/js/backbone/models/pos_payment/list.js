FancyBackbone.Models.PosPayment = FancyBackbone.Models.PosPayment || {};

FancyBackbone.Models.PosPayment.List = Backbone.RelationalModel.extend({
    getUrlWithParam: function() {
        return _.str.sprintf(
            '/rest-api/v1/seller/%s/pos/payments/?cursor=%s',
            this.get('seller'), this.get('cursor')
        );
    },
    url: function() {
        var url = this.getUrlWithParam();
        if (this.get('status')) {
            return url + _.str.sprintf('&status=%s', this.get('status'));
        } else {
            return url;
        }
    },
});
