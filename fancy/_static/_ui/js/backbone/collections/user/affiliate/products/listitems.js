FancyBackbone.Collections.User = FancyBackbone.Collections.User || {};
FancyBackbone.Collections.User.Affiliate = FancyBackbone.Collections.User.Affiliate || {};
FancyBackbone.Collections.User.Affiliate.Products = FancyBackbone.Collections.User.Affiliate.Products || {};

FancyBackbone.Collections.User.Affiliate.Products.ListItems = Backbone.Collection.extend({
    url: function() {
        return _.str.sprintf('/affiliate/products/list/%s', this.page);
    },
    initialize: function(options) {
        this.username = options.username;
        this.page = 1;
        this.perPage = 50;
    },
    getData: function() {
        return _.map(_.first(this.models, this.perPage), function(model) {
            return model.attributes;
        });
    },
});