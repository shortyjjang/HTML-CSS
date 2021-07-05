FancyBackbone.Views.Insights.TrafficOverallView = FancyBackbone.Views.Base.View.extend({
  template: FancyBackbone.Utils.loadTemplate('insights_traffic_overall_view'),
  itemTemplate: FancyBackbone.Utils.loadTemplate('insights_traffic_overall_item_view'),
  tagName: 'div',
  className: '',
  events: {
    'click .paging a': 'onPageNavButtonClick',
  },
  onPageNavButtonClick: function(event) {
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    if (!$currentTarget.is(".current") && !$currentTarget.is(".disabled")) {
      this.render( $currentTarget.attr('page') );
    }
  },
  initialize: function(options) {
    this._super();
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.sellerId = options.sellerId;

    this.collection = window.seller.get('insights_traffic_overall');
    this.collection.range = this.range;
    this.collection.dateFrom = this.dateFrom ? this.dateFrom.format("YYYY/MM/DD") : "";
    this.collection.dateTo = this.dateTo ? this.dateTo.format("YYYY/MM/DD") : "";
    
  },
  render: function(page) {
    var that = this;
    this.$el.html(this.template()).closest('.wrapper').addClass('loading');

    this.collection.fetch({ data: $.param({ page: page||1}) }).success(function() {
      var data = that.collection.models;
      if ( data.length === 0 ) {
        that.$el.find("tbody").append($("<tr class='empty'>").html("<td colspan=2>"+gettext("No data is available.")+"</td>"));
      } else {
        _.each(data, function(trafficSourceData) {
          var $el = $("<tr>");
          $el.html(that.itemTemplate(trafficSourceData.attributes));
          that.$el.find("tbody").append($el);
        }, that);
        that.$el.append(
          that.setSubview('paging', new FancyBackbone.Views.Insights.TrafficOverallPaginationView({
            collection: that.collection
          })).render().$el
        );
      }
      that.$el.closest('.wrapper').removeClass('loading');
    });
    return this;
  }
});

FancyBackbone.Views.Insights.TrafficOverallPaginationView = FancyBackbone.Views.Base.TemplateView.extend({
  template: 'insights_section_pagination',
  className : 'paging',
  
  templateData: function() {
    return {
      currentPage: this.collection.currentPage,
      maxPage: this.collection.maxPage,
    };
  },
  initialize: function(options) {
    this._super();
    this.collection = options.collection;
  }

});

FancyBackbone.Views.Insights.TrafficFancyView = FancyBackbone.Views.Base.View.extend({
  template: FancyBackbone.Utils.loadTemplate('insights_traffic_fancy_view'),
  itemTemplate: FancyBackbone.Utils.loadTemplate('insights_traffic_fancy_item_view'),
  tagName: 'div',
  className: '',
  events: {
    'click .paging a': 'onPageNavButtonClick',
  },
  onPageNavButtonClick: function(event) {
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    if (!$currentTarget.is(".current") && !$currentTarget.is(".disabled")) {
      this.render( $currentTarget.attr('page') );
    }
  },
  initialize: function(options) {
    this._super();
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.sellerId = options.sellerId;

    this.collection = window.seller.get('insights_traffic_fancy');
    this.collection.range = this.range;
    this.collection.dateFrom = this.dateFrom ? this.dateFrom.format("YYYY/MM/DD") : "";
    this.collection.dateTo = this.dateTo ? this.dateTo.format("YYYY/MM/DD") : "";
    
  },
  render: function(page) {
    var that = this;
    this.$el.html(this.template()).closest('.wrapper').addClass('loading');

    this.collection.fetch({ data: $.param({ page: page||1}) }).success(function() {
      var data = that.collection.models;
      if ( data.length === 0 ) {
        that.$el.find("tbody").append($("<tr class='empty'>").html("<td colspan=2>"+gettext("No data is available.")+"</td>"));
      } else {
        _.each(data, function(trafficSourceData) {
          var $el = $("<tr>");
          $el.html(that.itemTemplate(trafficSourceData.attributes));
          that.$el.find("tbody").append($el);
        }, that);
        that.$el.append(
          that.setSubview('paging', new FancyBackbone.Views.Insights.TrafficFancyPaginationView({
            collection: that.collection
          })).render().$el
        );
      }
      that.$el.closest('.wrapper').removeClass('loading');
    });
    return this;
  }
});

FancyBackbone.Views.Insights.TrafficFancyPaginationView = FancyBackbone.Views.Base.TemplateView.extend({
  template: 'insights_section_pagination',
  className : 'paging',
  
  templateData: function() {
    return {
      currentPage: this.collection.currentPage,
      maxPage: this.collection.maxPage,
    };
  },
  initialize: function(options) {
    this._super();
    this.collection = options.collection;
  }

});

FancyBackbone.Views.Insights.MostSearchedView = FancyBackbone.Views.Base.View.extend({
  template: FancyBackbone.Utils.loadTemplate('insights_most_searched_view'),
  itemTemplate: FancyBackbone.Utils.loadTemplate('insights_most_searched_item_view'),
  tagName: 'div',
  className: '',
  events: {
    'click .paging a': 'onPageNavButtonClick',
  },
  onPageNavButtonClick: function(event) {
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    if (!$currentTarget.is(".current") && !$currentTarget.is(".disabled")) {
      this.render( $currentTarget.attr('page') );
    }
  },
  initialize: function(options) {
    this._super();
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.sellerId = options.sellerId;

    this.collection = window.seller.get('insights_search_keyword');
    this.collection.range = this.range;
    this.collection.dateFrom = this.dateFrom ? this.dateFrom.format("YYYY/MM/DD") : "";
    this.collection.dateTo = this.dateTo ? this.dateTo.format("YYYY/MM/DD") : "";
    
  },
  render: function(page) {
    var that = this;
    this.$el.html(this.template()).closest('.wrapper').addClass('loading');

    this.collection.fetch({ data: $.param({ page: page||1}) }).success(function() {
      var data = that.collection.models;
      if ( data.length === 0 ) {
        that.$el.find("tbody").append($("<tr class='empty'>").html("<td colspan=5>"+gettext("No data is available.")+"</td>"));
      } else {
        _.each(data, function(trafficSourceData) {
          var $el = $("<tr>");
          $el.html(that.itemTemplate(trafficSourceData.attributes));
          that.$el.find("tbody").append($el);
        }, that);
        that.$el.append(
          that.setSubview('paging', new FancyBackbone.Views.Insights.TrafficOverallPaginationView({
            collection: that.collection
          })).render().$el
        );
      }
      that.$el.closest('.wrapper').removeClass('loading');
    });
    return this;
  }
});


FancyBackbone.Views.Insights.MostSearchedPaginationView = FancyBackbone.Views.Base.TemplateView.extend({
  template: 'insights_section_pagination',
  className : 'paging',
  
  templateData: function() {
    return {
      currentPage: this.collection.currentPage,
      maxPage: this.collection.maxPage,
    };
  },
  initialize: function(options) {
    this._super();
    this.collection = options.collection;
  }

});

FancyBackbone.Views.Insights.MostImpressionView = FancyBackbone.Views.Base.View.extend({
  template: FancyBackbone.Utils.loadTemplate('insights_most_impression_view'),
  itemTemplate: FancyBackbone.Utils.loadTemplate('insights_most_impression_item_view'),
  tagName: 'div',
  className: '',
  events: {
    'click .paging a': 'onPageNavButtonClick',
  },
  onPageNavButtonClick: function(event) {
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    if (!$currentTarget.is(".current") && !$currentTarget.is(".disabled")) {
      this.render( $currentTarget.attr('page') );
    }
  },
  initialize: function(options) {
    this._super();
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.sellerId = options.sellerId;

    this.collection = window.seller.get('insights_most_impressions');
    this.collection.range = this.range;
    this.collection.dateFrom = this.dateFrom ? this.dateFrom.format("YYYY/MM/DD") : "";
    this.collection.dateTo = this.dateTo ? this.dateTo.format("YYYY/MM/DD") : "";
    
  },
  render: function(page) {
    var that = this;
    this.$el.html(this.template()).closest('.wrapper').addClass('loading');

    this.collection.fetch({ data: $.param({ page: page||1}) }).success(function() {
      var data = that.collection.models;
      if ( data.length === 0 ) {
        that.$el.find("tbody").append($("<tr class='empty'>").html("<td colspan=2>"+gettext("No data is available.")+"</td>"));
      } else {
        _.each(data, function(trafficSourceData) {
          var $el = $("<tr>");
          $el.html(that.itemTemplate(trafficSourceData.attributes));
          that.$el.find("tbody").append($el);
        }, that);
        that.$el.append(
          that.setSubview('paging', new FancyBackbone.Views.Insights.MostImpressionPaginationView({
            collection: that.collection
          })).render().$el
        );
      }
      that.$el.closest('.wrapper').removeClass('loading');
    });
    return this;
  }
});

FancyBackbone.Views.Insights.MostImpressionPaginationView = FancyBackbone.Views.Base.TemplateView.extend({
  template: 'insights_section_pagination',
  className : 'paging',
  
  templateData: function() {
    return {
      currentPage: this.collection.currentPage,
      maxPage: this.collection.maxPage,
    };
  },
  initialize: function(options) {
    this._super();
    this.collection = options.collection;
  }

});

FancyBackbone.Views.Insights.MostActiveView = FancyBackbone.Views.Base.View.extend({
  template: FancyBackbone.Utils.loadTemplate('insights_most_active_view'),
  itemTemplate: FancyBackbone.Utils.loadTemplate('insights_most_active_item_view'),
  tagName: 'div',
  className: '',
  events: {
    'click .paging a': 'onPageNavButtonClick',
  },
  onPageNavButtonClick: function(event) {
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    if (!$currentTarget.is(".current") && !$currentTarget.is(".disabled")) {
      this.render( $currentTarget.attr('page') );
    }
  },
  initialize: function(options) {
    this._super();
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.sellerId = options.sellerId;

    this.collection = window.seller.get('insights_most_active');
    this.collection.range = this.range;
    this.collection.dateFrom = this.dateFrom ? this.dateFrom.format("YYYY/MM/DD") : "";
    this.collection.dateTo = this.dateTo ? this.dateTo.format("YYYY/MM/DD") : "";
    
  },
  render: function(page) {
    var that = this;
    this.$el.html(this.template()).closest('.wrapper').addClass('loading');

    this.collection.fetch({ data: $.param({ page: page||1}) }).success(function() {
      var data = that.collection.models;
      if ( data.length === 0 ) {
        that.$el.find("tbody").append($("<tr class='empty'>").html("<td colspan=2>"+gettext("No data is available.")+"</td>"));
      } else {
        _.each(data, function(trafficSourceData) {
          var $el = $("<tr>");
          $el.html(that.itemTemplate(trafficSourceData.attributes));
          that.$el.find("tbody").append($el);
        }, that);
        that.$el.append(
          that.setSubview('paging', new FancyBackbone.Views.Insights.MostActivePaginationView({
            collection: that.collection
          })).render().$el
        );
      }
      that.$el.closest('.wrapper').removeClass('loading');
    });
    return this;
  }
});

FancyBackbone.Views.Insights.MostActivePaginationView = FancyBackbone.Views.Base.TemplateView.extend({
  template: 'insights_section_pagination',
  className : 'paging',
  
  templateData: function() {
    return {
      currentPage: this.collection.currentPage,
      maxPage: this.collection.maxPage,
    };
  },
  initialize: function(options) {
    this._super();
    this.collection = options.collection;
  }

});

FancyBackbone.Views.Insights.MostPopularView = FancyBackbone.Views.Base.View.extend({
  template: FancyBackbone.Utils.loadTemplate('insights_most_popular_view'),
  itemTemplate: FancyBackbone.Utils.loadTemplate('insights_most_popular_item_view'),
  tagName: 'div',
  className: '',
  events: {
    'click .paging a': 'onPageNavButtonClick',
  },
  onPageNavButtonClick: function(event) {
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    if (!$currentTarget.is(".current") && !$currentTarget.is(".disabled")) {
      this.render( $currentTarget.attr('page') );
    }
  },
  initialize: function(options) {
    this._super();
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.sellerId = options.sellerId;

    this.collection = window.seller.get('insights_popular_item');
    this.collection.range = this.range;
    this.collection.dateFrom = this.dateFrom ? this.dateFrom.format("YYYY/MM/DD") : "";
    this.collection.dateTo = this.dateTo ? this.dateTo.format("YYYY/MM/DD") : "";
    
  },
  render: function(page) {
    var that = this;
    this.$el.html(this.template()).closest('.wrapper').addClass('loading');

    this.collection.fetch({ data: $.param({ page: page||1}) }).success(function() {
      var data = that.collection.models;
      if ( data.length === 0 ) {
        that.$el.find("tbody").append($("<tr class='empty'>").html("<td colspan=2>"+gettext("No data is available.")+"</td>"));
      } else {
        _.each(data, function(trafficSourceData) {
          var $el = $("<tr>");
          $el.html(that.itemTemplate(trafficSourceData.attributes));
          that.$el.find("tbody").append($el);
        }, that);
        that.$el.append(
          that.setSubview('paging', new FancyBackbone.Views.Insights.MostPopularPaginationView({
            collection: that.collection
          })).render().$el
        );
      }
      that.$el.closest('.wrapper').removeClass('loading');
    });
    return this;
  }
});

FancyBackbone.Views.Insights.MostPopularPaginationView = FancyBackbone.Views.Base.TemplateView.extend({
  template: 'insights_section_pagination',
  className : 'paging',
  
  templateData: function() {
    return {
      currentPage: this.collection.currentPage,
      maxPage: this.collection.maxPage,
    };
  },
  initialize: function(options) {
    this._super();
    this.collection = options.collection;
  }

});

FancyBackbone.Views.Insights.TrafficBySnsView = Backbone.View.extend({
  template: FancyBackbone.Utils.loadTemplate('insights_traffic_by_sns_view'),
  tagName: 'dl',
  className: 'sns',
  initialize: function(options) {
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.sellerId = options.sellerId;

    this.model = new FancyBackbone.Models.Insights.TrafficBySnsData({
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
    });
    return this;
  }
});

FancyBackbone.Views.Insights.TrafficBySearchView = Backbone.View.extend({
  template: FancyBackbone.Utils.loadTemplate('insights_traffic_by_search_view'),
  tagName: 'dl',
  className: 'sns',
  initialize: function(options) {
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.sellerId = options.sellerId;

    this.model = new FancyBackbone.Models.Insights.TrafficBySearchData({
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
    });
    return this;
  }
});

FancyBackbone.Views.Insights.TrafficByCountryView = Backbone.View.extend({
  template: FancyBackbone.Utils.loadTemplate('insights_traffic_by_country_view'),
  itemTemplate: FancyBackbone.Utils.loadTemplate('insights_traffic_by_country_item_view'),
  tagName: 'dl',
  className: 'country',
  initialize: function(options) {
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.sellerId = options.sellerId;

    this.model = new FancyBackbone.Models.Insights.TrafficByCountryData({
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
      var data = that.model.get('view_by_country');
      if ( data.length === 0 ) {
        that.$el.find("ul").append($("<li class='empty'>").html(gettext("No data is available.")));
      } else {
        _.each(that.model.get('view_by_country'), function(trafficSourceData) {
          var $el = $("<li>");
          $el.html(that.itemTemplate(trafficSourceData));
          that.$el.find("ul").append($el);
        }, that);
      }
    });
    return this;
  }
});

FancyBackbone.Views.Insights.TopSearchView = Backbone.View.extend({
  template: FancyBackbone.Utils.loadTemplate('insights_top_search_view'),
  itemTemplate: FancyBackbone.Utils.loadTemplate('insights_top_search_item_view'),
  tagName: 'dl',
  className: 'top-search',
  initialize: function(options) {
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.sellerId = options.sellerId;

    this.collection = new FancyBackbone.Collections.Insights.TopSearchData({
      user: window.seller,
      range: this.range,
      dateTo: this.dateTo,
      dateFrom: this.dateFrom,
    });
  },
  render: function() {
    var that = this;
    this.$el.html(this.template());

    this.collection.fetch().success(function() {
      if ( that.collection.models.length === 0 ) {
        that.$el.find("ul").append($("<li class='empty'>").html(gettext("No data is available.")));
      } else {
        _.each(that.collection.models, function(keyword) {
          var $el = $("<li>");
          $el.html(that.itemTemplate(keyword.attributes));
          that.$el.find("ul").append($el);
        }, that);
      }
    });
    return this;
  },
});
