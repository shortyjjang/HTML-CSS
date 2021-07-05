FancyBackbone.Models.Common = FancyBackbone.Models.Common || {};

FancyBackbone.Models.Common.Thing = Backbone.Model.extend({
    url: function() {
        return _.str.sprintf('/rest-api/v1/things/%s', this.get('thing_id'));
    },
});