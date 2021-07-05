(function($){

var args = {}, hash, saving = false, isRetina = window.devicePixelRatio > 1, params = {};

if(/^#data:/.test(hash=location.hash)) args = unparam(location.hash.substr(6));
onData(args);

jQuery(function(){
	$('.btn-cancel').click(function(){ send({cmd:'reset'}) });
	$('.btn-close').click(function(){ send({cmd:'close'}) });

	$('.figure-product a.remove').click(function(event){
		event.preventDefault();
		$('.figcaption').text('').focus();
	});

	// toggle sidemenu
	$('dl > dt > a').click(function(event){
		var $this = $(this), $dl = $this.closest('dl'), $dd;

		try{event.preventDefault()}catch(e){};

		$dl.toggleClass('on').siblings('dl').removeClass('on');

		if($dl.hasClass('on')){
			$dd = $dl.find('dd');
			$dd.css('margin-top', -$dd.height()/2);
		}
	});

	// category
	$('dl.category li > a').click(function(event){
		var $this = $(this);

		event.preventDefault();

		$this.closest('dl').find('dt > a > .value').text($this.text()).end().removeClass('on');
		$this.closest('li').addClass('selected').siblings('.selected').removeClass('selected');
		params.category = $this.parent().data('name');
	});

	// user list
	$('dl.list')
		.find('li')
			.each(function(){
				var $this = $(this), img = $this.data('thumbnail');

				if(img) {
					img = getResizedURL($this.data('thumbnail'),30,30);
					$this.find('img').css('background-image','url("'+img+'")');
				} else {
					$this.addClass('empty');
				}
			})
		.end()
		.on('click', 'li > a', function(event){
			var $this = $(this);

			event.preventDefault();

			$this.closest('dl').find('dt > a > .value').text($this.text()).end().removeClass('on');
			$this.closest('li').addClass('selected').siblings('.selected').removeClass('selected');
			params.list_ids = $this.parent().data('lid');
		});

	// create list
	$('.btn-create').click(function(){
		var $this = $(this), $name = $('#new-list-name'), txt = $.trim($name.val());

		if (!txt) {
			$name.focus();
			return alert('Please enter list name');
		}

		$this.prop('disabled', true);

		$.ajax({
			type : 'post',
			url  : '/create_list.xml',
			data : {list_name:txt},
			dataType : 'xml',
			headers  : {'X-CSRFToken':$('input[name="csrfmiddlewaretoken"]').val()},
			success  : function(xml){
				var $xml = $(xml), $st = $xml.find('status_code'), lid = $xml.find('list_id').text();
				if(!$st.length || $st.text() != 1) {
					if($xml.find('message').length) alert($xml.find('message').text());
					return;
				}

				var $ul = $('dl.list > dd > ul'), $li;
				$li = $('<li data-lid="'+lid+'" class="empty"><a href="#"><img src="/_ui/images/common/blank.gif"> '+txt.replace('<','&lt;')+'</a></li>').prependTo($ul).css('opacity',0);
				$ul[0].scrollTop = 0;

				setTimeout(function(){ $li.animate({opacity:1}, 400) }, 0);

				$name.val('');
			},
			complete : function(){
				$this.prop('disabled', false);
			}
		});

	});
	$('#new-list-name').keyup(function(event){
		if(event.keyCode == 13) {
			event.preventDefault();
			$('.btn-create').click();
		}
	});

	// comment
	(function(){
		var $comment = $('div.comment'), placeholder = $comment.attr('placeholder');
		$comment
			.focus(function(){
				var $this = $(this).removeClass('placeholder'), txt = $.trim($this.text());
				if (txt == placeholder) setTimeout(function(){ $this.text('') }, 0);
			})
			.blur(function(){
				var $this = $(this), txt = $.trim($this.text());
				if (!txt || txt == placeholder) $this.text(placeholder).addClass('placeholder');
			})
			.on('paste', function(){
				if ($comment.html().indexOf('<')) {
					setTimeout(function(){ $comment.text($comment.text()); }, 0);
				}
			})
			.on('keyup', function(event){
				if (event.keyCode == 13) $(this).trigger('paste');
			})
	})();

	$('.btn-fancy').click(function(event){
		var $this = $(this);

		if($this.prop('disabled')) return;

		params.via = 'bookmarklet';
		params.name = $.trim($('h2.figcaption').text());
		params.comment = $.trim($('div.comment').text());

		if(params.comment == $('.comment').attr('placeholder')) params.comment = '';
		if(!params.name) return alert('Please enter name');
		if(!params.category) {
			$('dl.category > dt > a').click();
			return alert('Please choose category');
		}

		$this.prop('disabled', true);

		$.ajax({
			type : 'POST',
			url  : '/add_new_sys_thing.json',
			data : params,
			headers  : {'X-CSRFToken':$('input[name="csrfmiddlewaretoken"]').val()},
			dataType : 'json',
			success  : function(json){
				if(json.status_code == 1){
					var url = 'http://'+location.hostname+json.thing_url;
					$('.tagger-widget,.tagger-error').hide();
					$('.tagger-done').show().find('a.thing-url_').attr('href', url);
					$('.share-via').trigger('open', [url]);
					send({cmd:'done'});
				} else {
					alert(json.message || 'An error occurred while requesting the server.\nPlease try again later.');
					$('.btn-cancel').click();
				}
			},
			complete : function(){
				$this.prop('disabled',false);
			}
		});
	});

	$('.tagger-done a.show').click(function(event){
		event.preventDefault();
		$(this).toggleClass('show less').prev('ul').toggleClass('less');
	});

	$('.share-via')
		.on('open', function(event, url){
			var $this=$(this), txt=params.name, img=params.photo_url, enc_url, enc_txt, enc_img;

			enc_url = encodeURIComponent(url);
			enc_txt = encodeURIComponent(txt);
			enc_img = encodeURIComponent(img);

			$this
				.find('a.tw').attr('href', 'http://twitter.com/share?text='+enc_txt+'&url='+enc_url+'&via=fancy').data({width:540,height:300}).end()
				.find('a.fb').attr('href', 'http://www.facebook.com/sharer.php?u='+enc_url).data({url:url,text:txt}).end()
				.find('a.gg').attr('href', 'https://plus.google.com/share?url='+enc_url).end()
				.find('a.su').attr('href', 'http://www.stumbleupon.com/submit?url='+enc_url+'&title='+enc_txt).end()
				.find('a.tb').attr('href', 'http://www.tumblr.com/share/link?url='+enc_url+'&name='+enc_txt+'&description='+enc_txt).end()
				.find('a.li').attr('href', 'http://www.linkedin.com/shareArticle?mini=true&url='+enc_url+'&title='+enc_txt+'&source=fancy.com').end()
				.find('a.vk').attr('href', 'http://vkontakte.ru/share.php?url='+enc_url).end()
				.find('a.wb').attr('href', 'http://service.weibo.com/share/share.php?url='+enc_url+'&appkey=&title='+enc_txt+(img?'&pic='+enc_img:'')).end()
				.find('a.mx').attr('href', 'http://mixi.jp/share.pl?u='+enc_url+'&k=91966ce7669c34754b21555e4ae88eedce498bf0').data({width:632,height:456}).end()
				.find('a.qz').attr('href', 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+enc_url).end()
				.find('a.rr').attr('href', 'http://share.renren.com/share/buttonshare.do?link='+enc_url+'&title='+enc_txt).end()
				.find('a.od').attr('href', 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=2&st.noresize=on&st._surl='+enc_url).end()
		})
		.on('click', 'li > a[href]:not(.fb,.gg)', function(event){
			var $this = $(this);

			event.preventDefault();

			var w = $this.data('width') || 620, h = $this.data('height') || 380, t = Math.max(Math.round((screen.availHeight-h-80)/2), 20), l = Math.max(Math.round((screen.availWidth-w)/2), 5);
			try{ window.open($this.attr('href'), $this.attr('class'), 'top='+t+',left='+l+',width='+w+',height='+h+',menubar=no,status=no,toobar=no,location=no,personalbar=no,scrollbars=no,resizable=yes').focus(); }catch(e){};
		})
});

window.onhashchange = function(){
	if(/^#data:/.test(location.hash)) {
		$.extend(args, data = unparam(location.hash.substr(6)));
		onData(data);
	}
};

function onData(data){
	init();

	if(data.error) {
		$('.tagger-done,.tagger-widget').hide();
		$('.tagger-error').show();
	}
	if(params.photo_url=data.img) {
		var img = new Image, $img = $('#product_image');
		img.onload = function(){
			if (this.width > this.height) {
				$img.css({width:Math.min(this.width,260), height:'auto'});
			} else {
				$img.css({width:'auto', height:Math.min(this.height,260)});
			}
		};
		img.src = data.img;

		$img.attr('src', data.img);
	}
	if(data.title) $('.figcaption').text(data.title);
	if(data.loc || data.path) params.tag_url = (data.loc||'')+(data.path||'/');
};

function init(){
	params = {user_key:$('#user_key').val()};
	$('.figcaption, .comment').each(function(){ $(this).text($(this).attr('placeholder')||'') });
	$('dl').removeClass('on').find('.value').text('');
	$('.tagger-done,.tagger-error').hide();
	$('.tagger-widget').show();
};

// send data to parent window
function send(data){var p=window.parent,d=$.param(data),u=args.loc+'#data:'+d,l=args.loc.match(/^https?:\/\/[^\/]+/)[0];try{p.postMessage(d,l)} catch(e1){try{p.location.replace(u)}catch(e){p.location.href=u}}};
// unparam
function unparam(s){ var a={},i,c;s=s.split('&');for(i=0,c=s.length;i<c;i++)if(/^([^=]+?)(=(.*))?$/.test(s[i]))a[RegExp.$1]=decodeURIComponent(RegExp.$3||'');return a };
// resized image
function getResizedURL(u,w,h){if(isRetina){w*=2;h*=2};return u.replace(/^(https?:\/\/cf\d+)\.(\w+)\.com/,'$1.thingd.com/resize/'+w+'x'+h+'/$2').replace('/thefancy/', '/thingd/')};

})(jQuery);
