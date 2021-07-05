(function(Backbone, FancyBackbone, $){
    "use strict";
    FancyBackbone.Models.Thing = Backbone.RelationalModel.extend({
        urlRoot: '/rest-api/v1/things/',
        idAttribute: 'thing_id_str',
        relations: [{
            type: Backbone.HasMany,
            key: 'reaction_tags',
            relatedModel: 'ReactionTag',
            includeInJSON: false,
            reverseRelation: {
                key: 'thing',
                includeInJSON: false,
            }
        }],
        addReactionTag: function(tag, options) {
            var reactionTag = new FancyBackbone.Models.ReactionTag();
            var jqXhr = reactionTag.save({tag: tag, thing: this, utm: options.utm}, {wait: true});

            if (jqXhr) {
                if (options && options.before) {
                    options.before();
                }
                if (options && options.complete) {
                    jqXhr.complete(options.complete);
                }
            }
        },
        removeReactionTag: function(tag, options) {
            var reactionTag = this.get('reaction_tags').findWhere({tag: tag});
            if (!reactionTag) return;
            var jqXhr = reactionTag.destroy({wait: true});
            if (jqXhr) {
                if (options && options.before) {
                    options.before();
                }
                if (options && options.complete) {
                    jqXhr.complete(options.complete);
                }
            }
        },
        findReactionTag: function(tag) { return this.get('reaction_tags').findWhere({tag: tag}); },
        doLike: function(options) { this.addReactionTag('like', options); },
        unLike: function(options) { this.removeReactionTag('like', options); },
    });
})(Backbone, FancyBackbone, jQuery);
