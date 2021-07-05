/**
 * script for /add page
 **/
jQuery(function($){
	if ($('#upfile').prop('disabled')) {
		$('.frm-up').hide().prev('.sorry').show();
	}

	$('form.frm-add')
		.submit(function(){
			var $form = $(this), elems = this.elements, params = {}, n, v;
			params['via'] = 'm/add';

			for(var i=0,c=elems.length; i < c; i++) {
				n = elems[i].name;
				v = $.trim(elems[i].value);

				if (!v) {
					if (n == 'name') {
						elems[i].focus();
						elems[i].parentNode.className += 'invalid';
						return false;
					}
					continue;
				}
				params[n] = v;
			}

			if(params['category'] < 0) delete(params['category']);
			if(!params['note']) params['note'] = '';

			$form.find('button').prop('disabled', true);

			$.ajax({
				type : 'post',
				url  : '/add_new_thing.xml',
				data : params,
				dataType : 'xml',
				headers  : {'X-CSRFToken':$.cookie.get('csrftoken')},
				success  : function(xml){
					var $xml = $(xml), $st = $xml.find('status_code');
					if (!$st.length) return;
					if ($st.text() == 1) {
						var url = $xml.find('thing_url').text();
						if (url) location.href = 'http://'+location.host+url;
						return;
					}
					if ($xml.find('message').text()) {
						alert($xml.find('message').text());
					}
				},
				error : function(){
					alert('Oops! Something went wrong during upload');
					$form.find('button').prop('disabled', false);
				}
			});

			return false;
		})
		.find('input.rnd')
			.focus(function(){ $(this).parent().removeClass('invalid') })
			.keypress(function(){ $(this).parent().removeClass('invalid') })
		.end()
});

// check whether user agent supports data url
(function($){
	var im = new Image();
	im.onload = im.onerror = function(){
		if(this.width == 1 && this.height == 1) $('.pic').show();
	};
	im.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
})(jQuery);
