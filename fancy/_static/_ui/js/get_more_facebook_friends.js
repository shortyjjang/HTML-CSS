var FancyFBInvitePage = {
	
	/**
 	* Init function
 	*/
	init: function() {
		var have_more = jQuery('a#more-left');
		
		var stream = jQuery('.left .find-friends-list');

		if (stream.length) {
			FancyFBInvitePage.infiniteScroll();
		}		
	},
	
	infiniteScroll: function () {
		var stream = jQuery('.left .find-friends-list');

		if (!stream.length) {
			return;
		}
		jQuery('a#more-left').click(function (event) {
			event.preventDefault();
			FancyFBInvitePage.loadScroller(stream, true);
		});
	},
	
	loadScroller: function (stream, autoload) {
		var page = stream.data('page-number');
		var timestamp = null;
		if(page){
			jQuery('a#more-left').attr('ts',page);
			timestamp = page;
		}
		else{
			timestamp = jQuery('a#more-left').attr('ts');			
		}
		
		var instance = stream.infinitescroll({
				navSelector: "div.pagination-left", // selector for the paged navigation (it will be hidden)
				nextSelector: "a#more-left",	// selector for the NEXT link (to page 2)
				itemSelector: ".find-friends-list > li", // selector for all items you'll retrieve
				timestamp:timestamp,
				timestampSelector: "a#more-left",
				isPaused: true
			}).data('infinitescroll');
		

		
		if (page) {
			instance.options.timestamp = page;
			if (autoload === true) 
				instance.retrieve();
		}
		else if (autoload === true) {
			instance.retrieve();
		}
		
		jQuery('a.pagination-left').show();
		return instance;
	}
		
	

};

var FancyFBInvitePageRightSide = {
	
	/**
 	* Init function
 	*/
	init: function() {
		var have_more = jQuery('a#more-right');
		
		var stream = jQuery('.right .find-friends-list');

		if (stream.length) {
			FancyFBInvitePageRightSide.infiniteScroll();
		}		
	},
	
	infiniteScroll: function () {
		var stream = jQuery('.right .find-friends-list');

		if (!stream.length) {
			return;
		}
		jQuery('a#more-right').click(function (event) {
			event.preventDefault();
			FancyFBInvitePageRightSide.loadScroller(stream, true);
		});
	},
	
	loadScroller: function (stream, autoload) {
		var page = stream.data('page-number');
		var timestamp = null;
		if(page){
			jQuery('a#more-right').attr('ts',page);
			timestamp = page;
		}
		else{
			timestamp = jQuery('a#more-right').attr('ts');			
		}
		
		var instance = stream.infinitescroll({
				navSelector: "div.pagination-right", // selector for the paged navigation (it will be hidden)
				nextSelector: "a#more-right",	// selector for the NEXT link (to page 2)
				itemSelector: ".find-friends-list > li", // selector for all items you'll retrieve
				timestamp:timestamp,
				timestampSelector: "a#more-right",
				isPaused: true
			}).data('infinitescroll');
		

		
		if (page) {
			instance.options.timestamp = page;
			if (autoload === true) 
				instance.retrieve();
		}
		else if (autoload === true) {
			instance.retrieve();
		}
		
		jQuery('a.pagination-right').show();
		return instance;
	}
		
	

};

(function () {
if (!Date.now) {
	Date.now = function now() {
		return +new Date();
	};
}
})();

$(document).ready(function() {
	FancyFBInvitePage.init();
	FancyFBInvitePageRightSide.init();
});
