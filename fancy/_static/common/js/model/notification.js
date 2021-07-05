!function(){
	var Model = namespace('Fancy.Model');
	Model.Notification = Backbone.Model.extend({
		initialize : function(){
		}
	});

	var Collection = namespace('Fancy.Collection');
	Collection.Notifications = Backbone.Collection.extend({
		model : Model.Notification,
		parse : function(json, options) {
			return json.notifications || [];
		}
	});
}();
