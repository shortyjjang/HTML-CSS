FancyBackbone.Views.Base = FancyBackbone.Views.Base || {};

FancyBackbone.Views.Base.SelectOptionView = Backbone.View.extend({
  tagName: 'option',
  initialize: function(options) {
    this.option = options.option;
  },
  render: function() {
    this.$el.text(this.option.display);
    this.$el.val(this.option.value);
    if(this.option.attr){
      for( var k in this.option.attr){
        this.$el.attr(k, this.option.attr[k]);
      }
    }
    return this;
  },
});

FancyBackbone.Views.Base.SelectView = Backbone.View.extend({
  tagName: 'select',
  initialize: function(options) {
    this.options = options.options;
    if (options.defaultOption === false) {
      this.defaultOption = false;
    } else {
      this.defaultOption = options.defaultOption || {
        value: '',
        display: '',
      };
    }
  },
  createOptionViewWithOption: function(option) {
    return new FancyBackbone.Views.Base.SelectOptionView({option: option});
  },
  render: function() {
    if (this.defaultOption) {
      this.$el.append(this.createOptionViewWithOption(this.defaultOption).render().$el);
    }
    _.each(this.options, function(option) {
      this.$el.append(this.createOptionViewWithOption(option).render().$el);
    }, this);
    return this;
  },
  selectValue: function(value) {
    this.$el.val(value);
  },
  getSelectedValue: function() {
    var v = this.$el.val();
    return v ? v.trim() : v;
  },
});
