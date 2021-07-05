_.extend(FancyBackbone.App, (function() {
  var layout = null;
  return {
    setLayout: function(newLayout) {
      if (layout) {
        layout.remove();
      }
      layout = newLayout;
    },
    getLayout: function() {
      return layout;
    }
  };
})());