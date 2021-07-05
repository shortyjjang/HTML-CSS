FancyBackbone.Utils.parseQueryString = function(queryString) {
  var params = {};
  if (queryString) {
    _.each(
      _.map(decodeURI(queryString).split(/&/g), function(el) {
        var aux = el.split('='), ret = {};
        if (aux.length >= 1) {
          var key = aux[0];
          var val;
          if (aux.length == 2) {
            val = aux[1];
          }
          ret[aux[0]] = val;
        }
        return ret;
      }),
      function(query) {
        _.extend(params, query);
      }
    );
  }
  return params;
};