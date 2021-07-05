FancyBackbone.Views.Base = FancyBackbone.Views.Base || {};

FancyBackbone.Views.Base.PaginationView = FancyBackbone.Views.Base.TemplateView.extend({
  template: 'base_pagination',
  className: 'pagination',
  events: {
    'click a': 'onPageNavButtonClick',
  },
  onPageNavButtonClick: function(event) {
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    if (!$currentTarget.is(".current") && !$currentTarget.is(".disabled")) {
      var href = $(event.currentTarget).attr('href');
      window.router.navigate(href, {trigger: true});
    }
  },
});