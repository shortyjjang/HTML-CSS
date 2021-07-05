jQuery(function($){
	// menu popup
	$('.menu-container')
		.on('click', '.btn-share,.more', function(event){
			$(this).closest('.menu-container').toggleClass('opened');
			return false;
		})
		.on('click', '.trick', function(event){
			$(this).closest('.menu-container').removeClass('opened');
			return false;
		})
		.on('click', '.more_sns', function(event){
			event.preventDefault();
			$(this).closest('.menu-content').addClass('others');
		})
		.on('click', '.back_sns', function(event){
			event.preventDefault();
			$(this).closest('.menu-content').removeClass('others');
		})
		.on('click', '.sns a[href^="http"]', function(event){
			event.preventDefault();

			var $this = $(this), w = $this.data('width') || 620, h = $this.data('height') || 380, t = Math.max(Math.round((screen.availHeight-h-80)/2), 20), l = Math.max(Math.round((screen.availWidth-w)/2), 5);
			try{ window.open($this.attr('href'), $this.attr('class'), 'top='+t+',left='+l+',width='+w+',height='+h+',menubar=no,status=no,toobar=no,location=no,personalbar=no,scrollbars=no,resizable=yes').focus(); }catch(e){};
		});

	// share via sns
	(function(){
		var $caption = $('a.figcaption'), url = 'http://'+location.hostname+$caption.attr('href'), txt = $caption.text(), img = location.protocol + $('.figure-image img').attr('src');
		var enc_url = encodeURIComponent(url), enc_txt = encodeURIComponent(txt), enc_img = encodeURIComponent(img);

		$('.sns')
			.find('a.tw').attr('href', 'http://twitter.com/share?text='+enc_txt+'&url='+enc_url+'&via=fancy').data({width:540,height:300}).end()
			.find('a.fb').attr('href', 'http://www.facebook.com/sharer.php?u='+enc_url).data({url:url,text:txt}).end()
			.find('a.gg').attr('href', 'https://plus.google.com/share?url='+enc_url).end()
			.find('a.su').attr('href', 'http://www.stumbleupon.com/submit?url='+enc_url+'&title='+enc_txt).end()
			.find('a.tb').attr('href', 'http://www.tumblr.com/share/link?url='+enc_url+'&name='+enc_txt+'&description='+enc_txt).end()
			.find('a.li').attr('href', 'http://www.linkedin.com/shareArticle?mini=true&url='+enc_url+'&title='+enc_txt+'&source=thefancy.com').end()
			.find('a.vk').attr('href', 'http://vkontakte.ru/share.php?url='+enc_url).end()
			.find('a.wb').attr('href', 'http://service.weibo.com/share/share.php?url='+enc_url+'&appkey=&title='+enc_txt+(img?'&pic='+enc_img:'')).end()
			.find('a.mx').attr('href', 'http://mixi.jp/share.pl?u='+enc_url+'&k=91966ce7669c34754b21555e4ae88eedce498bf0').data({width:632,height:456}).end()
			.find('a.qz').attr('href', 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+enc_url).end()
			.find('a.rr').attr('href', 'http://share.renren.com/share/buttonshare.do?link='+enc_url+'&title='+enc_txt).end()
			.find('a.od').attr('href', 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=2&st.noresize=on&st._surl='+enc_url).end()
	})();

	// fancy
	$('.btn-fancy,.btn-fancyd').click(function(event){
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
			dataType : 'xml',
			success  : function(xml) {
				var $xml = $(xml), $st = $xml.find('status_code');

				if (!$st.length || $st.text() != 1) return;

				if (is_fancyd) {
					$btn.removeAttr('rtid');
				} else {
					$btn.attr('rtid', $xml.find('id').text());
				}

				$btn.toggleClass('btn-fancy btn-fancyd').text(is_fancyd?lang['Fancy']:lang['Fancy\'d']);
			},
			complete : function(){
				$btn.removeClass('loading');
			}
		});
	});

	// short url
	$.post('/get_short_url.json', {thing_id:thingId}).then(function(data){
		if(data.short_url) $('#share-link-input').val(data.short_url);
	});

	// more actions
	$('#more-popup')
		.on('click', 'a.trigger', function(event){
			event.preventDefault();
			$(this).closest('ul').hide();
			$(this.getAttribute('href')).show().find('input[type="text"],textarea').focus().select();
		})
		.on('click', 'dt > .trick', function(event){
			$(this).closest('dl').hide().closest('.menu-content').find('>ul').show();
		});

	// fancy anywhere
	$('.btn-cart').click(function(event){
		event.preventDefault();
		var url = 'https://' + location.host + '/embed/buy/' + thingId;
		if(window.ref) url += '?ref='+ref;
		if(window.postMessage) {
			parent.postMessage('open\t'+url, loc);
		}
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

jQuery.ajaxPrefilter(function(options, originalOptions, jqXHR){
	if (options.type.toUpperCase() === 'POST') {
		if (!options.headers) options.headers = {};
		options.headers['X-CSRFToken'] = $.cookie.get('csrftoken');
	}
});

function message(type, message) {
	if(!window.postMessage) return;
	var msgObj = $.extend({}, message, {type:type, wname:window.name});
	parent.postMessage(JSON.stringify(msgObj), loc);
}

window.onload = function(){
	message('resize', {height:$('body').height()+2});
};
