FancyBackbone.Views.Insights = FancyBackbone.Views.Insights || {};

FancyBackbone.Views.Insights.TrafficSourceView = Backbone.View.extend({
  template: FancyBackbone.Utils.loadTemplate('insights_traffic_source_view'),
  tagName: 'div',
  className: 'traffic wrapper',
  events: {
    'click h3.stit': 'onClickOpenPopup',
    'click a.view': 'onClickOpenPopup',
  },
  initialize: function(options) {
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.sellerId = options.sellerId;

    this.model = new FancyBackbone.Models.Insights.TrafficSourceData({
      user: window.seller,
      range: this.range,
      date_from_str: this.dateFrom ? this.dateFrom.format("YYYY/MM/DD") : "",
      date_to_str: this.dateTo ? this.dateTo.format("YYYY/MM/DD") : "",
    });
  },
  onClickOpenPopup: function(event) {
    event.preventDefault();
    window.popups.trafficSource.render({
      range: this.range,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      sellerId: this.sellerId
    });
  },
  getQueryString: function() {
    var params = {
      range: this.range,
    };
    if (this.range == 'specific') {
      params.date_from = this.dateFrom.format("YYYY/MM/DD");
      params.date_to = this.dateTo.format("YYYY/MM/DD");
    }
    if (this.sellerId) {
      params.seller_id = this.sellerId;
    }
    return $.param(params);
  },
  render: function() {
    var that = this;
    this.model.fetch().success(function() {
      that.$el.html(that.template(that.model.attributes));
      that.$el.prepend(new FancyBackbone.Views.Insights.SubTitleView({
        sub_title: 'Traffic Sources',
      }).render().$el);
      that.$el.find(".stit").css('cursor', 'pointer');
    });
    return this;
  }
});

FancyBackbone.Views.Insights.ConversionView = Backbone.View.extend({
  template: FancyBackbone.Utils.loadTemplate('insights_conversion_view'),
  tagName: 'div',
  className: 'conversions wrapper',
  initialize: function(options) {
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.sellerId = options.sellerId;

    this.model = new FancyBackbone.Models.Insights.ConversionData({
      user: window.seller,
      range: this.range,
      date_from_str: this.dateFrom ? this.dateFrom.format("YYYY/MM/DD") : "",
      date_to_str: this.dateTo ? this.dateTo.format("YYYY/MM/DD") : "",
    });
  },
  render: function() {
    var that = this;
    this.model.fetch().success(function() {
      that.$el.html(that.template(that.model.attributes));
      that.$el.prepend(new FancyBackbone.Views.Insights.SubTitleView({
        sub_title: 'Conversions',
      }).render().$el);
    });
    return this;
  }
});

FancyBackbone.Views.Insights.ReferralView = Backbone.View.extend({
  template: FancyBackbone.Utils.loadTemplate('insights_referral_view'),
  trafficSourceItemTemplate: FancyBackbone.Utils.loadTemplate('insights_traffic_source_item_view'),
  tagName: 'dl',
  className: 'referrals',
  initialize: function(options) {
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.sellerId = options.sellerId;

    this.model = new FancyBackbone.Models.Insights.ReferralData({
      user: window.seller,
      range: this.range,
      date_from_str: this.dateFrom ? this.dateFrom.format("YYYY/MM/DD") : "",
      date_to_str: this.dateTo ? this.dateTo.format("YYYY/MM/DD") : "",
    });
  },
  render: function() {
    var that = this;
    this.$el.html(this.template());

    this.model.fetch().success(function() {
      var data = that.model.get('traffic_sources');
      if ( data.length === 0 ) {
        that.$el.find("ul").append($("<li class='empty'>").html(gettext("No data is available.")));
      } else {
        _.each(that.model.get('traffic_sources'), function(trafficSourceData) {
          var $el = $("<li>");
          $el.html(that.trafficSourceItemTemplate(trafficSourceData));
          that.$el.find("ul").append($el);
        }, that);
      }
    });
    return this;
  },
});