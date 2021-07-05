FancyBackbone.Views.Product = FancyBackbone.Views.Product || {};

FancyBackbone.Views.Product.ListingSubnavView = Backbone.View.extend({
  template: FancyBackbone.Utils.loadTemplate("product_listing_subnav"),
  className: 'subnav',
  events: {
    "click li a:not(.current)": "onNavTabButtonClick",
  },
  initialize: function() {
    this.model = new FancyBackbone.Models.Product.Stat({user: window.seller});
    window.seller.get("product_stat");
    var that = this;
    this.model.fetch({
      data: _.pick(window.params, ['seller_id'])
    }).success(function() {
      that.render();
    });
  },
  onNavTabButtonClick: function(event) {
    event.preventDefault();
    var href = $(event.currentTarget).attr('href');
    window.router.navigate(href, {trigger: true});
  },
  setActiveTab: function(tabName) {
    this.$el.find("a.current").removeClass("current");
    this.$el.find("a[name=" + tabName + "]").addClass("current");
    this.activeTab = tabName;
  },
  render: function() {
    this.$el.html(this.template(
      _.extend(
        {
          getSubnavURLWithStatus: function(status) {
            var queryString = $.param(_.extend(
              _.pick(window.params, ['seller_id']),
              {
                status: status,
              }
            ));
            return location.pathname + "?" + queryString;
          },
        },
        this.model.attributes
      )
    ));
    if (this.activeTab) {
      this.setActiveTab(this.activeTab);
    }
    return this;
  },
});
