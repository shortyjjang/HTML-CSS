(function(Backbone, FancyBackbone, $, _){
    "use strict";
    FancyBackbone.Views.Home = FancyBackbone.Views.Home || {};
    FancyBackbone.Views.Home.TopMenuView = Backbone.View.extend({
        el: $("#home-top-menu"),
        events: {
            'click .top-menu-btn, .trick': 'menuButtonTapped',
        },
        menuButtonTapped: function(event) {
            event.preventDefault();
            this.$el.toggleClass('opened');
        },
        initialize: function() {
            this.$viewButtons = this.$('.viewer li');
            this.$wrapper = this.$el.closest('.wrapper-content');
            this.positionViewButtonTooltips();
        },
        positionViewButtonTooltips: function() {
            _.each(this.$viewButtons, function(viewButton) {
                var $tip = $(viewButton).find('span');
                $tip.css('margin-left', -$tip.width()/2 - 8 + 'px');
            });
            return this;
        },
    });
    FancyBackbone.Views.Home.TopMenuView.getInstance = _.memoize(function() {
        return new FancyBackbone.Views.Home.TopMenuView();
    });
})(Backbone, window.FancyBackbone, jQuery, _);
