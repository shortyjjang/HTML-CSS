// Script for embedded widget
// @endpoint : /embed/[thing_id]
// @template : thingbox.html
jQuery(function($){
	$('.figure')
		.mouseenter(function(){
			var $btn = $(this).find('.fancy-container').show().find('.button'), maxW;
			if($btn.hasClass('fancyd')) {
				maxW = Math.max(
					$btn.find('b').text(lang['Unfancy']).end().width(),
					$btn.find('b').text(lang['Fancy\'d']).end().width()
				);
				$btn.width(maxW);
			}
		})
		.mouseleave(function(){
			$(this).find('.fancy-container').hide().find('.button').css('width','auto');
		})
		.delegate(
			'a.button',
			{
				'mouseover' : function(){
					var $btn = $(this);
					if($btn.hasClass('fancyd')) $btn.find('>b').text(lang['Unfancy']);
				},
				'mouseout' : function(){
					var $btn = $(this);
					if($btn.hasClass('fancyd')) $btn.find('>b').text(lang['Fancy\'d']);
				}
			}
		);

	$('button.btn-buy')
		.click(function(){
			return false;
		});

	// fancy
	$('.fancy,.fancyd').click(function(){
		if (require_login) return true;

		var $btn = $(this), params = {'tag':''}, url, v, is_fancyd, $all_btn = $('.fancy,.fancyd');

		if ($btn.hasClass('loading')) return false;
		if (v=$btn.attr('tid')) params['thing_id'] = v;
		if (v=$btn.attr('rtid')) params['rtid'] = v;
		params['http_referer'] = document.referrer

		is_fancyd = !!params['rtid'];
		url = is_fancyd?'/delete_reaction_tag.xml':'/add_reaction_tag.xml';

		$all_btn.addClass('loading');

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
					$all_btn.removeAttr('rtid');
				} else {
					$all_btn.attr('rtid', $xml.find('id').text());
				}

				$all_btn
					.toggleClass('fancy fancyd')
					.each(function(){
						this.lastChild.nodeValue = is_fancyd?lang['Fancy']:lang['Fancy\'d'];
					});
			},
			complete : function(){
				$all_btn.removeClass('loading');
			}
		});

		return false;
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
