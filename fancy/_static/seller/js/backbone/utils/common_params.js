FancyBackbone.Utils.commonParams = (function() {
  return _.pick($.url().param(), ['seller_id']);
})();
