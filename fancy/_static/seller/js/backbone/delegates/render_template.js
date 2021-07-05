FancyBackbone.Delegates.renderTemplate = function(template, templateData, templateHelpers) {
  var templateFunc = _.isFunction(template) ? template : JST[template];
  return templateFunc(_.extend(
    {},
    templateData,
    templateHelpers
  ));
};
