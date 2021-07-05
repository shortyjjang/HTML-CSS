FancyBackbone.Models.Collection = FancyBackbone.Models.Collection || {};

FancyBackbone.Models.Collection.ItemList = Backbone.RelationalModel.extend({
    url: function() {
        return _.str.sprintf(
                '/rest-api/v1/seller/%s/collections/%s/items?page=%s&limit=%s',
                this.get('seller'), this.get('collection'), this.get('page'), this.get('per_page')
            );
    },
});
