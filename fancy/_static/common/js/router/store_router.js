;(function(){
	namespace('Fancy.Router').StoreRouter = Backbone.Router.extend({
		routes : {
			'' : 'home',
            'home/:id' : 'homecover',
			'shop(/)' : 'shop',
			'shop/:query' : 'search',
			'thing/:id' : 'thing',
			'collection/:id' : 'collection',
			'about(/)' : 'about',
			'contact(/)' : 'contact',
            'cart(/)' : 'cart'
		},
		initialize : function(options) {
			this.options = options = _.extend({}, options);
            this.install_internal_link_hook();
		},
        install_internal_link_hook : function () {
            $(document).ready(function () {
                $(document).on("click", "a[href^='" + Backbone.history.root + "']", function (event) {
                    var href = $(event.currentTarget).attr('href');
                    // Remove leading slashes and hash bangs (backward compatablility)
                    var fragment = Backbone.history.getFragment(href.replace(new RegExp("^" + Backbone.history.root), "").replace('#!/', ''));
                    var match = _.any(Backbone.history.handlers, function(handler) {
                        if (handler.route.test(fragment)) {
                            handler.callback(fragment);
                            return true;
                        }
                    });
                    // Allow shift+click for new tabs, etc.
                    if (match && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
                        event.preventDefault();
                        // Instruct Backbone to trigger routing events
                        Backbone.history.navigate(fragment, { trigger: true });
                        return false;
                    }
                });
            });
        }
	});
})();
