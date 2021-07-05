FancyBackbone.Models.Customer = FancyBackbone.Models.Customer || {};

FancyBackbone.Models.Customer.List = Backbone.RelationalModel.extend({
    getUrlWithParam: function() {
        if (this.get('sort_option'))
            return _.str.sprintf(
                '/rest-api/v1/seller/%s/customer?page=%s&per_page=%s&sort_option=%s&sort_ascending=%s',
                this.get('seller'), this.get('page'), this.get('per_page'), this.get('sort_option'), this.get('sort_ascending')
            );
        else
            return _.str.sprintf(
                '/rest-api/v1/seller/%s/customer?page=%s&per_page=%s',
                this.get('seller'), this.get('page'), this.get('per_page')
            );
    },
    url: function() {
        var url = this.getUrlWithParam();
        if (this.get('search_str')) {
            return url + _.str.sprintf('&%s=%s', this.get('search_key'), this.get('search_str'));
        } else {
            return url;
        }
    },
});
