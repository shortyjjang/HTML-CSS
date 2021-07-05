FancyBackbone.Models.Collection = FancyBackbone.Models.Collection || {};

FancyBackbone.Models.Collection.List = Backbone.RelationalModel.extend({
    url: function() {
        return _.str.sprintf(
                '/rest-api/v1/seller/%s/collections?page=%s&limit=%s',
                this.get('seller'), this.get('page'), this.get('per_page')
            );
    },
});
