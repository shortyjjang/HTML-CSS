jQuery(function($){
	var $img = $('.figure-image > img'), $embed = $('.embed');
	$('<img style="position:absolute;left:-9999px;top:-9999px">')
		.load(function(){
			$img.css('max-width', this.width);
			$img.closest('.embed').css('max-width', this.width+30);
			//$('.btn-fancy').css({'top':parseInt($img.height()/2)-25, 'margin-top':0});
		})
		.attr('src', $img.attr('src'));

	// fancy
	$('.btn-fancy').click(function(event){
		if (require_login) return true;

		event.preventDefault();

		var $btn = $(this), params = {'tag':''}, url, v, is_fancyd;

		if ($btn.hasClass('loading')) return;
		if (v=$btn.attr('tid')) params['thing_id'] = v;
		if (v=$btn.attr('rtid')) params['rtid'] = v;
		params['http_referer'] = document.referrer

		is_fancyd = !!params['rtid'];
		url = is_fancyd?'/delete_reaction_tag.xml':'/add_reaction_tag.xml';

		$btn.addClass('loading');

		$.ajax({
			type : 'post',
			url  : url+'?t='+(new Date).getTime(),
			data : params,
			headers  : {'X-CSRFToken':$.cookie.get('csrftoken')},
			dataType : 'xml',
			success  : function(xml) {
				var $xml = $(xml), $st = $xml.find('status_code');

				if (!$st.length || $st.text() != 1) return;

				if (is_fancyd) {
					$btn.removeAttr('rtid');
				} else {
					$btn.attr('rtid', $xml.find('id').text());
				}

				$btn
					.toggleClass('fancy fancyd')
					.each(function(){
						this.lastChild.nodeValue = is_fancyd?lang['Fancy']:lang['Fancy\'d'];
					});
			},
			complete : function(){
				$btn.removeClass('loading');
			}
		});
	});
});

jQuery.cookie = {
	'get' : function(name){
		var regex = new RegExp('(^|[ ;])'+name+'\\s*=\\s*([^\\s;]+)');
		return regex.test(document.cookie)?unescape(RegExp.$2):null;
	},
	'set' : function(name, value, days){
		var expire = new Date();
		expire.setDate(expire.getDate() + (days||0));
		document.cookie = name+'='+escape(value)+(days?';expires='+expire:'');
	}
};
