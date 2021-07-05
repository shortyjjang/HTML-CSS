FancyBackbone.Mixins.FormatURLMixin = {
  url: function() {
    var params = _.flatten([_.result(this, 'urlFormat'), _.result(this, 'urlParams')]);
    return _.str.sprintf.apply(null, params);
  },
};
