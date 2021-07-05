FancyBackbone.Views.Ads = FancyBackbone.Views.Ads || {};

var container = "#merchant-ad-carousel"
var adview__viewed = {};
var adview__setCurrentSpot = function(spot) {
    var $container = $(container);
    $container.children("ul").data('spot', spot);
    $container.find("li").hide();
    var $spot = $container.find('li[data-spot=' + spot + ']');
    $spot.show();
    if ( adview__viewed[spot]) {
	} else {
		$.post("/rest-api/v1/merchant_ads/" + $spot.data('id') + "/viewed", {"spot" : spot}, function(res) {
			adview__viewed[spot] = true;		  
		});
	}
}

var adview__onPrevClick = function(event) {
    event.preventDefault();
    var $container = $(container);
    var current_spot = $container.children("ul").data('spot');
    var max_spot = $container.find("li").length;
    if (current_spot == 1) 
      prev_spot = max_spot;
    else
	  prev_spot = current_spot - 1;
    adview__setCurrentSpot(prev_spot);
  }
 
var adview__onNextClick = function(event) {
    event.preventDefault();
    var $container = $(container);
    var current_spot = $container.children("ul").data('spot');
    var max_spot = $container.find("li").length;
    if (current_spot == max_spot) 
      next_spot = 1;
    else
      next_spot = current_spot + 1;
    adview__setCurrentSpot(next_spot);
}

var adview__check_container_available = function(){
    var dfd = new $.Deferred();
    count = 0;
    var container_timer = setInterval(function() {
      if ($(container).length > 0) {
        clearInterval(container_timer);
        dfd.resolve('container ready');
      } else {
        if (count >= 10) {
          clearInterval(container_timer);
          dfd.reject();
        }
        count +=1;
      }
    }, 500);
    return dfd.promise();
}


var adview__addContainerEvents = function() {
	$(container).on('click', '.paging a.prev', adview__onPrevClick);
	$(container).on('click', '.paging a.next', adview__onNextClick);
}


var adview__show_container = function($el) {
	$(container).find('ul').replaceWith($el);
	$(container).show();
}

var adview__hide_container = function() {
	$(container).hide();
}

FancyBackbone.Views.Ads.CarouselView = Backbone.View.extend({
  initialize: function(options) {
	  if (options.placement_key) {
		  this.placement_key = options.placement_key;
	  }
  },
  placement_key: null,
  tagName : 'ul',
  loadTemplate: function() {
	  var template_name;
      if ($(container).hasClass('box')) {
		  template_name = "ads_banner_item";
	  } else {
		  template_name = "ads_logo_item";		  
	  }
	  return FancyBackbone.Utils.loadTemplate(template_name);
  },

  fetch_and_render : function() {
	that = this;
    this.collection = new FancyBackbone.Collections.Ad.AdCollection({placement_key : this.placement_key})
    this.collection.fetch({}).success(function() {
		that._render();
	});
  },

  render: function() {
    that = this;
    $.when(adview__check_container_available()).done(function(result) {
		console.log(result);
        adview__addContainerEvents();
		that.fetch_and_render();
	}).fail(function(result) {
		console.log('failed to find an Ad slot.');
	});
    return this;
  },

  _render: function(redraw) {
    this.$el.empty();
    if (this.collection.models.length > 0) {
      _.each(this.collection.models, function(item) {
        var template = this.loadTemplate();
        this.$el.append(template(item.attributes));
      }, this);
		
	  adview__show_container(this.$el);
      adview__setCurrentSpot(1);
    } else {
      adview__hide_container(this.$el);
	}
  }

});