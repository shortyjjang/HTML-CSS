(function(){
	if(!window.jQuery) return setTimeout(arguments.callee, 10);

	jQuery(function($){
		$('.btn-url-t').click(function() {
			var message = "Join me on Fancy and discover amazing things! " + $('#message-to-post').val();
			var param = {};
			var popup = window.open("https://twitter.com/intent/tweet?text=" + message, 'twitter', 'height=420,width=550,resizable=yes', true);
			return false;
		});
	});

	var twitterConnected0 = function(popup,url,success, failure) {
		//var modal = window.open(url, '_blank', 'height=400,width=800,left=250,top=100,resizable=yes', true);
		var wait  = function() {
			setTimeout(function() {
				if (popup == null) {
					failure(); // When does this happen?
					return;
				}
				if (popup.closed) {
								success()
				}
				else {
					wait();
				}
			}, 25);
		};
		wait();
	};
})();
