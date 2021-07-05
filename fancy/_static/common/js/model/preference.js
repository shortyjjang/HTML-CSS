(function(){
	'use strict';

	namespace('Fancy.Model').Preference = Backbone.Model.extend({
		get : function(attr) {
			var attrs = this.attributes, names, name;

			if (attr in attrs) {
				return attrs[attr];
			}

			var regex = new RegExp('^'+attr.replace(/\./g,'\\.')+'\\.'), ret = {};

			for (attr in attrs) {
				if (!attrs.hasOwnProperty(attr) || !regex.test(attr)) continue;
				ret[attr.replace(regex,'$.')] = attrs[attr];
			}

			ret = this.toJSON(ret);

			return ret.$ || null;
		},
		set_ : function(attrs) {
			var options={}, current = this.attributes, changed = _.clone(attrs);

			Backbone.Model.prototype.set.call(this, this.flat(attrs));

			// set dummary object to trigger change event
			this.changed = changed;
			for (var key in changed) {
				this.trigger('change:'+key, this, null, options);
			}
			this.trigger('change', this, options);

			return this;
		},
		toJSON : function(attrs) {
			var ret = {}, names, next, o, i, c;

			if (!attrs) attrs = _.clone(this.attributes);

			for (var attr in attrs) {
				if (!attrs.hasOwnProperty(attr)) continue;

				names = attr.split('.');
				o = ret;

				for (i=0,c=names.length; i < c - 1; i++) {
					next = names[i+1];
					if (!(names[i] in o)) {
						if (isNaN(next)) {
							o[names[i]] = {};
						} else {
							o[names[i]] = [];
							names[i+1]  = parseInt(next);
						}
					}
					o = o[names[i]];
				}

				o[names[i]] = attrs[attr];
			}

			return ret;
		},
		flat : function(obj, key, ret) {
			var name;

			obj || (obj={});
			key || (key='');
			ret || (ret={});

			for (var x in obj) {
				if (!obj.hasOwnProperty(x)) continue;

				name = (key ? key+'.':'')+x;
				if (typeof obj[x] == 'object') {
					this.flat(obj[x], name, ret);
					delete obj[x];
				} else {
					ret[name] = obj[x];
				}
			}

			return ret;
		},
		parse : function(attrs, options) {
			return this.flat(attrs);
		}
	});
})();
