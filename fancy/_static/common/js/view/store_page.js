;(function(){
	var $win = $(window);

	namespace('Fancy.View').StorePage = Backbone.View.extend({
		initialize : function(options) {
			this.options = options = _.extend({}, options);

			this.$('script[type="template"]').each(function(){
				var $tpl = $(this);
				$tpl.parent().data('template', _.template($tpl.remove().html()));
			});

			_.bindAll(this, 'render');

			if (this.model) this.changeModel(this.model);
			if (options.settings) this.settings = options.settings;
			if (options.styles) this.styles = options.styles;

			manager.add(this);

			// set live style settings
			this.applyStyleSetting();
		},
		open : function() {
			var self = this;

			_.each(manager.views, function(view){ if (view !== self ) {view.close();} });

			$win.scrollTop(0);
			this.$el.show();
			this.trigger('open');

			return this;
		},
		close : function() {
			this.$el.hide();
			this.trigger('close');

			return this;
		},
		changeModel : function(model) {
			var old = this.model;
			this.model = model;

			if (old !== model) {
				this.trigger('change:model', model, old);
			}

			return this;
		},
		applyStyleSetting : function() {
			var self = this, styles = this.options.styles;

			if (!styles || !_.size(styles)) return;

			_.each(styles, function(rules, key){
				if (!_.isArray(rules)) rules = [rules];

				for (var i=0, c=rules.length, m, fn; i < c; i++) {
					if (m = /^(.+)\s+@([\w-]+)$/.exec(rules[i])) {
						self.listenTo(self.settings, 'change:'+key, _.bind(self.onChangeStyleSetting, self, key, m[1]/*css rule*/, m[2].toLowerCase()/* property */));
					}
				}

				if (self.settings.has(key)) {
					self.settings.trigger('change:'+key, self.settings, self.settings.get(key));
				}
			});
		},
		onChangeStyleSetting : function(key, css, property, model, val, options) {
			if (val) {
				switch (property) {
					case 'background-image':
						val = 'url('+val+')';
						break;
					case 'display':
						val = (val === false || val == 'none') ? 'none' : '';
						break;
					case 'visibility':
						val = (val === false || val == 'hidden') ? 'hidden' : '';
						break;
				}
				CSS.set(css, property+':'+val);
			} else {
				CSS.remove(css+' @'+property);
			}
		},
		render : function() {
			return this;
		}
	});

	var manager = {
		views : [],
		get : function(id) {
			return _.find(this.views, function(view){ return view.$el[0].id == id; });
		},
		add : function(view) {
			this.views.push(view);
		},
		del : function(view) {
			this.views = _.without(this.views, view);
		}
	};
})();
