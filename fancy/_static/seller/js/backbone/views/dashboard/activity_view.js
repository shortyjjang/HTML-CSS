FancyBackbone.Views.Dashboard = FancyBackbone.Views.Dashboard || {};

FancyBackbone.Views.Dashboard.ShopActivityView = Backbone.View.extend({
  tagName: 'div',
  className: 'shop-activity-view wrapper',
  template: FancyBackbone.Utils.loadTemplate('dashboard_shop_activity_view'),
  activityItemTemplate: FancyBackbone.Utils.loadTemplate('dashboard_shop_activity_item_view'),
  events: {
    'click .btn-area .more': 'onLoadMoreClick',
  },
  onLoadMoreClick: function(e) {
    e.preventDefault();
    this.page++;
    this.reloadContents();
  },
  reloadContents: function() {
    var collectionDfd = this.collection.fetch({
      data: {
        'page': this.page,
      }
    });
    var that = this;
    collectionDfd.always(function() {
      that.renderActivityItems();
    });
  },
  initialize: function(options) {
    this.collection = options.collection;
    this.sub_title = options.subTitle;
    this.page = 1;
  },
  render: function() {
    this.$el.html(this.template({
      hasMoreButton: this.page < this.collection.maxPage,
    }));

    this.renderActivityItems();
    return this;
  },
  renderActivityItems: function() {
    if( this.collection.models.length === 0 && this.page === 1 ){
      this.$el.find("ul").append($("<li class='empty'>").html(gettext("No data is available for the current selection.")));
      this.$el.find(".btn-area").remove();
    } else {
      _.each(this.collection.models, function(shopActivity) {
        var $el = $("<li>");
        $el.html(this.activityItemTemplate(shopActivity.attributes));
        this.$el.find("ul").append($el);
      }, this);
    }
    if (this.page >= this.collection.maxPage || !this.collection.maxPage) {
      this.$el.find(".btn-area").remove();
    }
  }
});

FancyBackbone.Views.Dashboard.ActivityContentView = Backbone.View.extend({
  template: FancyBackbone.Utils.loadTemplate('dashboard_activity_view'),
  tagName: 'div',
  id: 'content',
  initialize: function(options) {
    this.shopActivities = window.seller.get('dashboard_shop_activities');
    
    this.shopActivitieView = new FancyBackbone.Views.Dashboard.ShopActivityView({
      collection: this.shopActivities,
      subTitle: 'Feed',
    });
  },
  render: function() {
    this.$el.html(this.template());
    var that = this;
    this.shopActivities.fetch().success(function() {
      that.$el.find('.shop-activity-view').append(that.shopActivitieView.render().$el);
    });
    return this;
  },
});

FancyBackbone.Views.Dashboard.ActivityView = Backbone.View.extend({
  initialize: function() {
    this.contentView = new FancyBackbone.Views.Dashboard.ActivityContentView();
  },
  render: function() {
    this._super();
    this.$el.append(gettext('<h2 class="ptit embo">Dashboard <span class="arrow">Shop Activity</span> <b>Shop Activity</b></h2>'));
    this.$el.append(this.contentView.render().$el);
    return this;
  },
});