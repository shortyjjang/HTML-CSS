FancyBackbone.Views.Insights.Popups = FancyBackbone.Views.Insights.Popups || {};

FancyBackbone.Views.Insights.Popups.TitleView = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate('insights_title_view'),
    tagName: 'p',
    className: 'ltit',
    initialize: function(options) {
        this.sub_title = options.sub_title;
    },
    render: function() {
        this.$el.html(this.template({
            'sub_title': this.sub_title,
        }));
        return this;
    }
});

FancyBackbone.Views.Insights.Popups.BestSellerPopup = FancyBackbone.Views.Insights.BestSellerView.extend({
  events: {
    'click a.btns-gray-embo': 'onClickLoadMore',
  },
  onClickLoadMore: function(event) {
    event.preventDefault();
    this.$el.find("li.more > a").addClass('loading');
    this.page++;
    var collectionDfd = this.collection.fetch({
      data: {
        'page': this.page,
        'per_page': 10,
      }
    });
    var that = this;
    collectionDfd.always(function() {
      that._appendContents();
      if (that.page >= that.collection.maxPage) {
        that.$el.find("li.more").remove();
      }
      that.$el.find("li.more > a").removeClass("loading");
    });
  },
  render: function(collection) {
    this.$el.html(this.template());

    this._renderCloseButton();
    this.open();
    this.$el.find(".table").addClass("loading");

    this.collection = collection;
    this.page = 1;
    var collectionDfd = this.collection.fetch({
      data: {
        'page': 1,
        'per_page': 10,
      }
    });
    var that = this;
    collectionDfd.always(function() {
      that._render();
      that._renderMoreButton();
      that.$el.find(".table").removeClass("loading");
    });
    return this;
  },
  _renderMoreButton: function() {
    if (this.page < this.collection.maxPage) {
      this.$el.find("ul").append($("<li class='more'>").html("<a href='#' class='btns-gray-embo'>Load more</a>"));
    }
  },
  _renderCloseButton: function() {
    this.$el.find('a.view').hide();
    this.$el.find('.ly-close').show();
  },
  _renderTitle: function() {
    this.$el.prepend(new FancyBackbone.Views.Insights.Popups.TitleView({
      sub_title: 'Best Sellers',
    }).render().$el);
  },
  open: function() {
    $.dialog("best-seller-view").open();
  },
  onClickClose : function(){
    this.$el.find('ul').html('');
    $.dialog("best-seller-view").close();
  },
});

FancyBackbone.Views.Insights.Popups.TrafficSourcePopup = Backbone.View.extend({
  template: FancyBackbone.Utils.loadTemplate('insights_traffic_source_detail_popup'),
  setOptions: function(options) {
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.sellerId = options.sellerId;
  },
  render: function(options) {
    this.setOptions(options);
    this.$el.html(this.template());
    this.$el.prepend(new FancyBackbone.Views.Insights.Popups.TitleView({
      sub_title: 'Traffic Sources',
    }).render().$el);
    this.$el.addClass("loading");
    this.open();

    var that = this;
    this.$el.find('.dashboard').append(that._createView(FancyBackbone.Views.Insights.TrafficBySnsView));
    this.$el.find('.dashboard').append(this._createView(FancyBackbone.Views.Insights.TrafficBySearchView));
    this.$el.find('.dashboard').append(this._createView(FancyBackbone.Views.Insights.TrafficByCountryView));
    this.$el.find('.dashboard').append(this._createView(FancyBackbone.Views.Insights.TopSearchView));

    this.$el.removeClass("loading");
  },
  _createView: function(viewClass) {
    var that = this;
    return new (viewClass)({
      user: window.seller,
      range: that.range,
      dateFrom: that.dateFrom,
      dateTo: that.dateTo,
    }).render().$el;
  },
  open: function() {
    $.dialog("default-traffic").open();
  },
  onClickClose : function(){
    this.$el.find('.dashboard').html('');
    $.dialog("default-traffic").close();
  },
});