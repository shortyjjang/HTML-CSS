;(function(){
	var Model = namespace('Fancy.Model'), Collection = namespace('Fancy.Collection');

	Model.Address = Backbone.Model.extend({
		urlRoot : '/rest-api/v1/addresses/',
		defaults : {
			is_default : false
		},
		validate : function(attrs, options) {
			var required = 'alias full_name address1 city phone zip'.split(' '), k, i, c;

			for (i=0,c=required.length; i < c; i++) {
				k = required[i];
				if (!attrs[k].length) return 'Please enter '+k+'.';
			}

			if (attrs.country == 'US') {
                if (attrs.state == '') return 'Please select your state.';
				if (!/^\d{5}(?:[-\s]\d{4})?$/.test(attrs.zip)) return 'Invalid zip code.';
			}
		}
	});

	Collection.Addresses = Backbone.Collection.extend({
		url : '/rest-api/v1/addresses/',
		model : Model.Address,
		parse : function(json) {
			return (json||{}).addresses || [];
		},
		getDefaultAddr : function() {
			return this.findWhere({is_default:true}) || this.at(0) || null;
		}
	});
})();
