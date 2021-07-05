/**
 * Data binding view for BackboneJS.
 *
 * The 'bind:change' event will be fired when data is applied to the related DOM.
 * The 'bind:assign' event triggers DOM-to-model data assignment.
 *
 * Attribute binding:
 *   <element data-bind="PROPERTY_NAME=@ATTRIBUTE_NAME">
 *
 * Data binding using jQuery.data():
 *   <element data-bind="PROPERTY_NAME=&ATTRIBUTE_NAME">
 *
 * Text binding:
 *   <element data-bind="PROPERTY_NAME=:text">
 *
 * HTML binding:
 *   <element data-bind="PROPERTY_NAME=:html">
 *
 * HTML binding with template:
 *   <element data-bind="PROPERTY_NAME=:html">
 *     <script type="template">
 *     TEMPLATE_CODE
 *     </script>
 *   </element>
 *
 *   Template element should be a child node of bound element.
 *
 * Default binding:
 *   <element data-bind="PROPERTY_NAME">
 *
 *   With default binding, DataBinding instance automatically uses
 *   appropriate attribute or property like followings:
 *   - input[type="text"], input[type="radio"], textarea, select : 'value' property
 *   - .editable (contentEditabled) element : 'innerHTML' property
 *   - input[type="checkbox"] : 'checked' property
 *   - img, input[type="image"] : 'src' attribute
 *
 *   Note that <img> and <input type="image"> support only model-to-element one-way binding.
 */
(function(){
	namespace('Fancy.View').DataBinding = Backbone.View.extend({
		_bindingMap : null,
		initialize : function(options) {
			this.listenTo(this.model, 'change', _.bind(this.onModelChange, this));
		},
		setElement : function(el){
			var self = this, $el = $(el);

			Backbone.View.prototype.setElement.call(this, el);

			if (this.$el) this.$el.find('[data-bind]').off('.'+this._id);
			if (!this._bindingMap) this._bindingMap = {};
			if (!this._id) this._id = 'databinding-'+this.cid;

			function triggerAssign(){ $(this).trigger('bind:assign') };

			$el.find('[data-bind]').each(function(event){
				var $this = $(this), info = self.parse($this.attr('data-bind'));

				info.$el = $this;
				info.event = self.getEvent($this);

				if (!info.property) return;

				// convert info into a manager object
				if (!self._bindingMap[info.property]) {
					self._bindingMap[info.property] = [];
				}
				self._bindingMap[info.property].push(info);
				self.trainManager(info).set();

				// add event listener
				info.$el.on('bind:assign', info.get);
				if (info.event) info.$el.on(info.event + '.' + self._id, triggerAssign);
			});

			this.$el = $el;

			return this;
		},
		trainManager : function(info) {
			var $el = info.$el, self = this, methods = {}, $tpl;

			if (info.type == 'auto') {
				// automatic selection
				if ($el.is('input[type="text"],textarea,select')) {
					_.extend(info, {type:'prop', key:'value'});
				} else if ($el.is('input[type="checkbox"]')) {
					_.extend(info, {type:'prop', key:'checked'});
				} else if ($el.is('img, input[type="image"]')) {
					_.extend(info, {type:'attr', key:'src'});
				} else {
					_.extend(info, {type:'prop', key:'html'});
				}
			}

			if (($tpl=$el.find('>script[type="template"]')).length) {
				$el.data('template', _.template($tpl.remove().html()));
			}

			_.extend(info, this.bindingMethods(info));
			_.bindAll(info, 'get', 'set');

			return info;
		},
		bindingMethods : function(info) {
			var self = this, getter, setter;

			if (info.type == 'prop') {
				if (info.key == 'text') {
					getter = function(o){ return o.$el.text() };
					setter = function(o,v){ o.$el.text(v) };
				} else if (info.key == 'html') {
					getter = function(o){ return o.$el.html() };
					setter = function(o,v){ var t=o.$el.data('template'),w={};if(_.isFunction(t)){w[o.property]=v;v=t(w)}; o.$el.html(v) };
				}
			} 

			if (!getter && !setter) {
				getter = function(o){ return o.$el[o.type](o.key) };
				setter = function(o,v){ o.$el[o.type](o.key, v) };
			}

			return {
				get : function() {
					var v = getter(this);
					self.model.set(this.property, v);
					return v;
				},
				set : function() {
					var v = self.model.get(this.property) || null;
					setter(this, v);
					this.$el.trigger('bind:change');
					return this;
				}
			};
		},
		onModelChange : function() {
			var attrs = this.model.changedAttributes(), i, info;
			for (var attr in attrs) {
				if (!attrs.hasOwnProperty(attr)) continue;
				if (!this._bindingMap[attr]) continue;

				i = 0;
				while (info = this._bindingMap[attr][i++]) {
					info.set();
				}
			}
		},
		parse : function(bindStr) {
			var regex = /^([\w\.\-]+)(?:\s*=\s*([:@&])([\w-]+))?$/, ret = {};
			var match = regex.exec(bindStr||'');

			if (!match) return ret;

			ret.property = match[1];
			ret.key = match[3];
			switch (match[2]) {
				case '@': ret.type = 'attr'; break;
				case ':': ret.type = 'prop'; break;
				case '&': ret.type = 'data'; break;
				default:  ret.type = 'auto';
			}

			return ret;
		},
		getEvent : function($el) {
			if ($el.is('input[type="text"],textarea,.editable')) {
				return 'blur';
			} else if ($el.is('input[type="radio"],input[type="checkbox"]')) {
				return 'click';
			} else if ($el.is('select')) {
				return 'change';
			}

			return '';
		}
	});
})();
