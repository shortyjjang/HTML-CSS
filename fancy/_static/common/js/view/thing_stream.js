;(function(){
	var View = namespace('Fancy.View');
	View.ThingStream = Backbone.View.extend({
		el   : 'ol.stream',
		data : null, // parameters to be used when the collection is fetched.
		request   : null,
		itemViews : {},
		events    : {
			'click .btn-cart' : 'openDetailDialog',
			'click .btn-share' : 'openShareDialog',
			'click .button.fancy' : 'openListDialog',
			'click .button.fancyd' : 'openListDialog'
		},
		initialize : function(options) {
			this.options = options = _.extend({defaults:{page:1},prepare:2000,subview:View.ThingStreamItem,collection:new Fancy.Collection.Things(),direction:'vertical'}, options);
			this.collection = options.collection;
			this.data = _.clone(this.options.defaults);
			if (options.el) this.setElement(options.el);
			if (options.url) this.collection.url = options.url;
			if (options.parse) this.collection.parse = option.parse;

			this.setContainer(options.container || window);
			_.bindAll(this, 'onScroll', 'onReset');

			this.trigger('initialize', this);
			this.collection.on('reset', this.onReset);
		},
		setElement : function(element) {
			Backbone.View.prototype.setElement.apply(this, arguments);
			this.setTemplate();
			return this;
		},
		setContainer : function(element) {
			this.$container = $(element);
			return this;
		},
		setTemplate : function() {
			var template = this.$el.data('template'), $tpl;
			if (!template) {
				$tpl = this.$el.find('>script[type="template"]');
				if ($tpl.length) {
					template = template = _.template($tpl.remove().html());
					this.$el.data('template', template);
				}
			}
			this.template = template;
		},
		openDetailDialog : function(event) {
			event.preventDefault();
		},
		openShareDialog : function(event) {
			event.preventDefault();
		},
		openListDialog : function(event) {
			event.preventDefault();
		},
		setEnable : function(enable) {
 			this.$container.off('scroll', this.onScroll);
			if (enable) {
				this.$container.on('scroll', this.onScroll);
				this.$container.trigger('scroll');
			}
			return this;
		},
		setData : function(data) {
			var o = data;
			if (typeof(data) != 'object' && arguments.length > 1) {
				o = {};
				o[data] = arguments[1];
			}
			_.extend(this.data, o);
			return this;
		},
		getData : function() {
			return _.clone(this.data);
		},
		clearData : function() {
			this.data = _.clone(this.options.defaults);
			if (location.search.indexOf('&test') >= 0) this.data['test'] = '';
			return this;
		},
		getQuery : function() {
			var data = this.getData(), qs = [];

			delete data['page'];

			for (var x in data) {
				if (data.hasOwnProperty(x) && data[x] !== '') {
					qs.push(x+'='+data[x]);
				}
			}

			// normalize
			qs.sort();

			return qs.join('&');
		},
		onScroll : function(event) {
			if (this.request) return;
			var needMoreLoad = false;

			if(this.options.direction == 'vertical'){
				var ctnHeight = this.$container.innerHeight(), el = this.$el.get(0), elTop = 0, elHeight = this.$el.height(), restHeight;
				while (el.offsetParent) {
					elTop += el.offsetTop;
					el = el.offsetParent;
				}

				restHeight = elTop + elHeight - ctnHeight - this.$container.scrollTop();

				if (restHeight < this.options.prepare)  needMoreLoad = true;
			}else{
				var ctnWidth = this.$container.innerWidth(), el = this.$el.get(0), elLeft = 0, elWidth = this.$el.width(), restWidth;
				while (el.offsetParent) {
					elTop += el.offsetTop;
					el = el.offsetParent;
				}

				restWidth = elLeft + elWidth - ctnWidth - this.$container.scrollLeft();

				if (restWidth < this.options.prepare)  needMoreLoad = true;
			}

			if (needMoreLoad) {
				var self = this;
				
				this.trigger('beforeload', this);

				var lastLength = this.collection.length;

				this.request = this.collection.fetch({
					remove   : false,
					data     : this.data,
					success  : function(collection, json, options) {
						json.next_page_num ? (self.data.page = json.next_page_num) : self.setEnable(false);

						collection.models = collection.models.filter(function(v){ return !(v.attributes && !v.attributes.sales);});

						if (collection.models.length <= lastLength) return;

						var models = _.rest(collection.models, lastLength);
						self.render(models);
					},
					complete : function(){
						self.request = false;
						self.trigger('afterload', self);
					}
				});
			}
		},
		render : function(models) {
			var self = this, content = [], newViews = [];

			_.each(models || this.collection.models || [], function(model){
				var itemView = new self.options.subview({template:self.template, model:model});

				if (self.itemViews[model.id]) {
					self.itemViews[model.id].$el.before(itemView.render().$el).remove();
					self.itemViews[model.id] = itemView;
				} else {
					newViews.push(itemView);
					content.push(itemView.renderHTML());
				}
			});

			this.$el.append(content.join(''));
			_.each(newViews, function(view){
				view.setElement('#'+view.id);
			});

			return this;
		},
		reset : function() {
			this.collection.reset();
			this.trigger('reset');
			return this;
		},
		onReset : function(event) {
			this.setEnable(false).$el.empty();
			_.extend(this.data, this.options.defaults);
			try { this.request.aboart(); } catch(e) {};
		}
	});

	View.ThingStreamItem = Backbone.View.extend({
		tagName : 'li',
		initialize : function(options){
			this.template = options.template;
			this.id = 'thing-stream-item-' + this.model.id;
			_.bindAll(this, 'onChange');
		},
		renderHTML : function() {
			return this.template({thing:this.model, _:_});
		},
		render : function() {
			var html = this.template({thing:this.model, _:_});
			var $el = $(html);

			this.setElement($el);

			return this;
		},
		onChange : function() {
		}
	});
})();
