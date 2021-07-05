// CSRF
(function($){
	function getCookie(name) {
        var regex = new RegExp('(^|[ ;])'+name+'\\s*=\\s*([^\\s;]+)');
        return regex.test(document.cookie)?unescape(RegExp.$2):null;
	}
	function sameOrigin(url) {
		// url could be relative or scheme relative or absolute
		var host = document.location.host; // host + port
		var protocol = document.location.protocol;
		var sr_origin = '//' + host;
		var origin = protocol + sr_origin;
		// Allow absolute or scheme relative URLs to same origin
		return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
			(url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
			// or any other URL that isn't scheme relative or absolute i.e relative.
			!(/^(\/\/|https?:).*/.test(url));
	}
	$.ajaxPrefilter(function(options, originalOptions, jqXHR){
		if(options.type.toUpperCase() == 'POST' && sameOrigin(options.url)){
			var v = getCookie('csrftoken');
			if(v && v.length){
				if(!options.headers) options.headers = {};
				options.headers['X-CSRFToken'] = v;
			}
			// prevent cache to avoid iOS6 POST bug
			options.url += ((options.url.indexOf('?') > 0)?'&':'?')+'_='+(new Date).getTime();
		}
	});
})(jQuery);

jQuery(function($){
	$(window).ready(function(){
		$('#content').css('min-height',($(window).height()-326)+'px');
	});
	$(window).resize(function(){
		$('#content').css('min-height',($(window).height()-326)+'px');
	});
	$(window).scroll(function () {
		if ($(this).scrollTop() < 47) {
			$('#header').removeClass('fixed');
		} else {
			$('#header').addClass('fixed');
		}
	});
	if (navigator.platform.indexOf('Win') != -1 || navigator.userAgent.indexOf('Firefox') != -1) {
		$('.select-round').css('text-indent','0');
	}
});
