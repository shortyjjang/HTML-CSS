// ([pathname,] [params,] [bool or array])
FancyBackbone.Utils.makeURL = function () {
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

    var extendParam = _.first(args);
    if (_.isBoolean(extendParam)) {
        if (extendParam) {
            params = _.extend($.url().param(), params);
        }
        args = _.rest(args);
    } else if (_.isArray(extendParam)) {
        params = _.extend(
            _.pick($.url().param(), extendParam),
            params
        );
        args = _.rest(args);
    }

    return pathname + "?" + $.param(params);
};