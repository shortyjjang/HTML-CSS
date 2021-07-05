FancyBackbone.Models.Ad = FancyBackbone.Models.Ad || {};
FancyBackbone.Collections.Ad = FancyBackbone.Collections.Ad || {};

FancyBackbone.Collections.Ad.AdCollection = Backbone.Collection.extend({
	initialize: function(options) {
	  if (options.placement_key) {
		  this.placement_key = options.placement_key;
	  }
	},
	placement_key: null,
    url: function() {
		return _.str.sprintf("/rest-api/v1/merchant_ads/placements/%s", this.placement_key);
    },
    parse: function(response) {
		return response.ads_choices;
    },
});