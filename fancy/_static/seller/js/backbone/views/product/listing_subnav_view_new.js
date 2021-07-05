FancyBackbone.Views.Product = FancyBackbone.Views.Product || {};

FancyBackbone.Views.Product.ListingSubnavViewNew = Backbone.View.extend({
  template: FancyBackbone.Utils.loadTemplate("product_listing_subnav_v2"),
  events: {
    "click li a:not(.current)": "onNavTabButtonClick"
  },
  initialize: function(args) {
    if(args && args.includeAffiliate) this.includeAffiliate = args.includeAffiliate;
    if(args && args.whitelabel) this.whitelabel = args.whitelabel;

    this.model = new FancyBackbone.Models.Product.Stat({user: window.seller});
    window.seller.get("product_stat");
    var that = this;
    this.model.fetch({
      data: _.pick(window.params, ['seller_id'])
    }).success(function() {
      that.render();
      that.$el.find(".controller.right").show();
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
    this.setExportURL(tabName);
  },

  setExportURL: function(tabName) {
    var queryString = $.param(_.pick(window.params, ['seller_id'])); 
    var exportURL = "/merchant/products.csv?status=" + tabName + '&' + queryString;
    this.$el.find(".btn-export").attr('href', exportURL);
  },

  render: function() {
    var queryString = $.param(_.pick(window.params, ['seller_id']));
    var currentStatus = this.$el.find("a.current").attr('name') || '';
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
          exportURL: "/merchant/products.csv?status=" + currentStatus + '&' + queryString,
          includeAffiliateTab: this.includeAffiliate,
          whitelabel: this.whitelabel
        },
        this.model.attributes
      )
    ));
    if (this.activeTab) {
      this.setActiveTab(this.activeTab);
    }
    this.$el.find(".controller.right").hide();
    return this;
  },
});
