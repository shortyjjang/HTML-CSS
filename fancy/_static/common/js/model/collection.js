(function(){

'use strict';

var Model = namespace('Fancy.Model');
Model.Collection = Backbone.Model.extend({
	defauls : {
		description : '',
		item_count  : 0,
		image_url   : '/_ui/images/common/blank.gif'
	}
});

var Collection = namespace('Fancy.Collection');
Collection.Collections = Backbone.Collection.extend({
	model : Model.Collection,
	parse : function(json, options) {
		try {
			return json.collections.collections;
		} catch(e) {
			return [];
		}
	}
});

})();
