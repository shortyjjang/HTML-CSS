FancyBackbone.Models.MeasuringGuide = Backbone.RelationalModel.extend({
  idAttribute: 'id',
  urlRoot: function() {
    return _.str.sprintf("/rest-api/v1/seller/%s/sizeguides", this.get('user').id);
  },
  createSelectOption: function() {
    return {
      value: this.id,
      display: this.get('title')
    };
  },
});

FancyBackbone.Collections.MeasuringGuideCollection = Backbone.Collection.extend({
  url: function() {
    return _.str.sprintf("/rest-api/v1/seller/%s/sizeguides", this.user.id);
  },
  model: function() {
    return new FancyBackbone.Models.MeasuringGuide({user: this.user});
  },
  parse: function(response) {
    return response.sizeguides;
  },
});
