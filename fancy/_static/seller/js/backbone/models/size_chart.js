FancyBackbone.Models.SizeChart = Backbone.RelationalModel.extend({
  urlRoot: '/rest-api/v1/sizecharts/',
  createSelectOption: function(measure) {
    return {
      value: this.id,
      display: this.get('category'),
      measure: measure,
    };
  },
  getSizes: function(measure) {
    var sizes;
    _.each(this.get('chart'), function(v){
      if(v.measure == measure){
        sizes = v;
      }
    })
    return sizes;
  }
});

FancyBackbone.Collections.SizeChartCollection = Backbone.Collection.extend({
  model: FancyBackbone.Models.SizeChart,
  url: "/rest-api/v1/sizecharts",
  parse: function(response) {
    return response.sizecharts;
  },
});
