FancyBackbone.Utils.loadTemplate = function(key) {
  var compiledTemplate = null;
  return function(templateVarDict) {
    if (compiledTemplate === null) {
      compiledTemplate = JST[key];
    }
    return compiledTemplate(templateVarDict);
  };
};