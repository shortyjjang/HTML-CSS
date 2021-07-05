FancyBackbone.Models.Country = Backbone.RelationalModel.extend({
  urlRoot: '/rest-api/v1/countries/',
  createSelectOption: function() {
    return {
      value: this.id,
      display: this.get('display_name'),
    };
  },
});

FancyBackbone.Collections.CountryCollection = Backbone.Collection.extend({
  model: FancyBackbone.Models.Country,
  url: '/rest-api/v1/countries/',
  parse: function(response) {
    this.currentCountryCode = response.current_country_code || 'US';
    return response.countries;
  },
});
