(function(factory){
	if (typeof define == 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}
}(function($){
	function csrfSafeMethod(method) {
		return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}
	$.ajaxSetup({
		crossDomain: false, // obviates need for sameOrigin test
		beforeSend: function(xhr, settings) {
			if (!csrfSafeMethod(settings.type)) {
				var token = '', match = document.cookie.match(/\bcsrftoken=([^;]+)/);

				if (match) {
					token = match[1];
					xhr.setRequestHeader("X-CSRFToken", token);
				}
			}
		}
	});
}));
