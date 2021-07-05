;(function(){
	'use strict';
	
	var Model = namespace('Fancy.Model'), Collection = namespace('Fancy.Collection');
	
	Model.Theme = Backbone.Model.extend({
		urlRoot : '/rest-api/v1/themes',
		validate : function(attrs, options) {
			_.map(attrs, _.trim);
			if (!attrs.name) return 'Please enter theme name.';
			if (!attrs.theme_root) return 'Theme root is not defined.';
		},
		screenshot : function() {
			var name = this.get('name').toLowerCase();
			return '/shop/themes/' + name + '/screenshot.png';
		},
		editorForm : function(callback) {
			var self = this;
			if (!this.get('editor_form')) {
				this.fetch().done(function(){
					callback(self.get('editor_form'));
				});
			} else {
				callback(self.get('editor_form'));
			}
		},
		getDefaults : function(callback) {
			var self = this;
			if (!this.get('defaults')) {
				this.fetch().done(function(){
					callback(self.get('defaults')||{});
				});
			} else {
				callback(self.get('defaults')||{});
			}
		}
	});
	
	Collection.Themes = Backbone.Collection.extend({
		model : Model.Theme,
		url   : '/rest-api/v1/themes',
		parse : function(json, options) {
			return json.themes || [];
		}
	});
})();
