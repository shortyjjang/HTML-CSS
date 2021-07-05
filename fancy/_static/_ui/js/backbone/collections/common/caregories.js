FancyBackbone.Collections.Common = FancyBackbone.Collections.Common || {};

FancyBackbone.Collections.Common.Categories = Backbone.Collection.extend({
    constructor: function(attributes, options) {
        Backbone.Collection.apply(this, arguments);
        if (options && options.root !== undefined) {
            this.root = options.root
        }
    },
    url: function() {
        return _.str.sprintf('/rest-api/v1/products/categories' + (this.root ? '?root' : ''));
    },
    getData: function() {
        return _.map(this.models, function(model) {
            return model.attributes;
        });
    },
});
