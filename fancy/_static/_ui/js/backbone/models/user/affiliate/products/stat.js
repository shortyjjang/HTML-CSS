FancyBackbone.Models.User = FancyBackbone.Models.User || {};
FancyBackbone.Models.User.Affiliate = FancyBackbone.Models.User.Affiliate || {};
FancyBackbone.Models.User.Affiliate.Products = FancyBackbone.Models.User.Affiliate.Products || {};

FancyBackbone.Models.User.Affiliate.Products.Stat = Backbone.RelationalModel.extend({
    url: function() {
        return '/affiliate/products/list/0';
    },
    defaults: {
        total: 0,
    },
});