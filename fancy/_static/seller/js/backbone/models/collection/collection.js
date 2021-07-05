FancyBackbone.Models.Collection = FancyBackbone.Models.Collection || {};

FancyBackbone.Models.Collection.Collection = Backbone.RelationalModel.extend({
    url: function() {
        return _.str.sprintf(
                '/rest-api/v1/seller/%s/collections/%s/',
                this.get('seller'), this.get('collection')
            );
    },
});
