// CSRF
(function($){
	function sameOrigin(url) {
		// url could be relative or scheme relative or absolute
		var host = location.host; // host + port
		var protocol = location.protocol;
		var sr_origin = '//' + host;
		var origin = protocol + sr_origin;
		// Allow absolute or scheme relative URLs to same origin
		return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
			(url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
			// or any other URL that isn't scheme relative or absolute i.e relative.
			!(/^(\/\/|https?:).*/.test(url));
	}
	$.ajaxPrefilter(function(options, originalOptions, jqXHR){
		if(/^(POST|PUT|DELETE)$/i.test(options.type) && sameOrigin(options.url)){

			var v;
			if (typeof($.cookie) == 'function') {
				v = $.cookie('csrftoken');
			} else {
				v = $.cookie.get('csrftoken');
			}
			if(v && v.length){
				if(!options.headers) options.headers = {};
				options.headers['X-CSRFToken'] = v;
			}
			// prevent cache to avoid iOS6 POST bug
			if (!/[&\?]_=\d+/.test(options.url)) {
				options.url += ((options.url.indexOf('?') > 0)?'&':'?')+'_='+(new Date).getTime();
			}
		}
	});
})(jQuery);