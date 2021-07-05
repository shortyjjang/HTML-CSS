(function(Backbone, FancyBackbone, $){
    "use strict";
    FancyBackbone.Models.ReactionTag = Backbone.RelationalModel.extend({
        idAttribute: 'id_str',
        urlRoot: function() {
            return this.get('thing').url() + '/reaction-tags';
        },
    });
})(Backbone, FancyBackbone, jQuery);
