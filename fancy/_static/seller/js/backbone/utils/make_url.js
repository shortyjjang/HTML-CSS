// ([pathname,] [params,] [bool or array])
FancyBackbone.Utils.makeURL = function() {
  var args = arguments;

  var pathname;
  if (_.isString(_.first(args))) {
    pathname = _.first(args);
    args = _.rest(args);
  } else {
    pathname = window.location.pathname;
  }

  var params;
  if (_.isObject(_.first(args))) {
    params = _.first(args);
    args = _.rest(args);
  } else {
    params = {};
  }

  if (_.isBoolean(_.first(args))) {
    if (_.first(args)) {
      params = _.extend($.url().param(), params);
    }
    args = _.rest(args);
  } else if (_.isArray(_.first(args))) {
    params = _.extend(
      _.pick($.url().param(), _.first(args)),
      params
    );
    args = _.rest(args);
  }

  params = _.extend(params, FancyBackbone.Utils.commonParams);

  return pathname + "?" + $.param(params);
};