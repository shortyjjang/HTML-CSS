FancyBackbone.Models.State = Backbone.RelationalModel.extend({
  idAttribute: 'code',
});

FancyBackbone.Collections.StateCollection = Backbone.Collection.extend({
  url: '/rest-api/v1/states',
  model: FancyBackbone.Models.State,
});
