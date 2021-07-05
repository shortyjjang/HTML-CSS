$(function() {
    (function(d){d.fn.shuffle=function(c){c=[];return this.each(function(){c.push(d(this).clone(true))}).each(function(a,b){d(b).replaceWith(c[a=Math.floor(Math.random()*c.length)]);c.splice(a,1)})};d.shuffle=function(a){return d(a).shuffle()}})(jQuery);

    var $parents = $("#topBanner");
    $parents.find('.slide_item').shuffle();
    $("#topBanner .slide_item").eq(0).show();

    var onTransition = false;
   $parents
        .find(".prev")
			.click(function(e) {
				e.preventDefault();
				var $this = $(this);
				var collection = $parents.find('.slide_item:visible');
				var prevCollection = collection.prev();

				if (onTransition) return;
				if ($this.hasClass("disabled")) return;

				if (prevCollection[0]) {
					onTransition = true;
					prevCollection
						.show()
						.addClass("prevFadeIn", function() {
							prevCollection.removeClass("prevFadeIn");
							collection.hide();
							onTransition = false;
					});

					$parents.find(".next").removeClass("disabled");
					if (!prevCollection.prev().length) {
						$parents.find(".prev").addClass("disabled");
					}
				}
				return false;
			})
        .end()
        .find(".next")
			.click(function(e) {
				e.preventDefault();
				var $this = $(this);
				var collection = $parents.find('.slide_item:visible');
				var nextCollection = collection.next();

				if (onTransition) return;
				if ($this.hasClass("disabled")) return;

				if (nextCollection[0]) {
					onTransition = true;
					nextCollection
						.show()
						.addClass("nextFadeIn", function() {
							nextCollection.removeClass("nextFadeIn");
							collection.hide();
							onTransition = false;
					});

					$parents.find(".prev").removeClass("disabled");
					if (!nextCollection.next(".slide_item").length ) {
						$parents.find(".next").addClass("disabled");
					}
				}
				return false;
			})
        .end();
});
