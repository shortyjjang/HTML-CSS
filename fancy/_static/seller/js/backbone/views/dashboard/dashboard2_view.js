FancyBackbone.Views.Dashboard2 = FancyBackbone.Views.Dashboard2 || {};

FancyBackbone.Views.Dashboard2.GetStartedView = Backbone.View.extend({
  events: {
    'click a.verify_phone': 'onClickVerifyPhone',
  },  
  onClickVerifyPhone: function(e){
    e.preventDefault();
    window.popups.verifyPhone.render();
  },
  syncModel: function(){
  },
  syncView: function(metadata) { 
  },
  initialize: function(){
  },
  render: function() {
    return this; 
  },
}); 

FancyBackbone.Views.Dashboard2.SellerTipsView = Backbone.View.extend({
  events: {
    'click a.close': 'onClickClose',
  },  
  addReadTipId: function(tipId){
    var readTipIds = ($.cookie.get('read_tips')||"").split(",");
    readTipIds.push(tipId);
    $.cookie.set('read_tips', readTipIds.join(","));
  },
  onClickClose: function(e){
    e.preventDefault();

    var $currentTip = this.$el.find("> .tip:visible");
    var tipId = $currentTip.data('tip-id');
    this.addReadTipId(tipId);
    $currentTip.remove();

    if( this.$el.find("> .tip").length ){
      this.$el.find("> .tip:eq(0)").fadeIn();
    }else{
      this.$el.fadeOut();
    }
  },
  syncModel: function(){
  },
  syncView: function(metadata) { 
  },
  initialize: function(){
  },
  render: function() {
    return this; 
  },
});  

FancyBackbone.Views.Dashboard2.InsightsView = Backbone.View.extend({
  events: {
    'change .date select': 'onRangeChange',
  },  
  onRangeChange: function(e){
    var range = $(e.target).val();
    this.$el.addClass('loading').find(".date em").html( $(e.target).find("option:selected").html() );
    this.setSummary(new FancyBackbone.Models.Insights.Summary({
      user: window.seller,
      range: range,
      date_from_str: "",
      date_to_str: "",
    }));
  },
  setSummary: function(model){
    var that = this;
    $.when.apply($, [model.fetch()]).done(function() {
      var values = model.get('current_values');
      var diff = model.getDiff();
      that.$el
        .find(".sales b").removeClass('up down').html( "$"+to_price_string(values.sales.toFixed(2)) ).end()
        .find(".views b").html( addCommas(values.view) ).end()
        .find(".fancys b").html( addCommas(values.fancyd) ).end()
        .find(".orders b").html( addCommas(values.orders) ).end()
        .removeClass('loading')
      if( diff.sales > 0 ){
        that.$el.find(".sales b").addClass('up');
      }else if(diff.sales < 0){
        that.$el.find(".sales b").addClass('down');
      }
    });

  },
  syncModel: function(){
  },
  syncView: function(metadata) { 
  },
  initialize: function(){
    this.setSummary(new FancyBackbone.Models.Insights.Summary({
      user: window.seller,
      range: 'monthly',
      date_from_str: "",
      date_to_str: "",
    }));
  },
  render: function() {
    return this; 
  },
}); 

FancyBackbone.Views.Dashboard2.NewsView = Backbone.View.extend({
  events: {
    'click a.more': 'onClickMore',
  },  
  onClickMore: function(e){
    var $news = $(e.target).closest("li");
    var $dialog = $.dialog("dashboard_news");
    $dialog.$obj
      .find("h3 b").html( $news.find("b.title").html() ).end()
      .find(".date").html( $news.find(".date").html() ).end()
      .find(".contents").html( $news.find(".article").data('contents') ).end();
    $dialog.open();
  },
  syncModel: function(){
  },
  syncView: function(metadata) { 
  },
  initialize: function(){
    $(function(){
      var $dialog = $.dialog("dashboard_news");
      $dialog.$obj
        .find("button._done").click(function(e){
          $dialog.close();
        });
    })  
  },
  render: function() {
    return this; 
  },
}); 

FancyBackbone.Views.Dashboard2.View = Backbone.View.extend({
  initialize: function() {
    
  },
  updateView: function(sellerId) {
    
  },
  createGetStartedView: function() {
    return new FancyBackbone.Views.Dashboard2.GetStartedView({
      el: this.$el.find(".wrapper.get-started"),
      model: this.model
    }).render();
  },
  createNewsView: function() {
    return new FancyBackbone.Views.Dashboard2.NewsView({
      el: this.$el.find(".wrapper.news"),
      model: this.model
    }).render();
  },
  createInsightsView: function() {
    return new FancyBackbone.Views.Dashboard2.InsightsView({
      el: this.$el.find(".wrapper.insights"),
      model: this.model
    }).render();
  },
  createSellerTipsView: function() {
    return new FancyBackbone.Views.Dashboard2.SellerTipsView({
      el: this.$el.find(".wrapper.tips"),
      model: this.model
    }).render();
  },

  render: function() {
    this.subviews = [
      this.createGetStartedView(),
      this.createNewsView(),
      this.createInsightsView(),
      this.createSellerTipsView(),
    ];
    return this;
  },
});