(function(global, $){
	var $container, $mores, $current, $trick;
	
	function init(containerSelector, logged_in) {
		$container = $(containerSelector||'.stream');
		
		$mores = $('#timeline-more-menu').remove().children();

		$trick = $mores.filter('.trick')
					.on('click', function(event){
						if($current[0])  $current.closest('li, #slideshow').removeClass('active'); 
						$mores.filter('div, .trick').hide();
						if ($('html').hasClass('fixed')) {
							$('html').removeClass('fixed');
							$(window).scrollTop($('.container').attr('position'));
							$('.container').removeAttr('style');
						}
						return false;
					});

		$container.on('click', 'button.btn-share', function(event){
			event.preventDefault();
			event.stopPropagation();

			$current = $(this).closest("[data-tid]");
			$current.append($mores);

			repositionOverlay();
			$current.closest('li, #slideshow').addClass('active').find('.trick, #show-share').show();
			openSharePopup(location.protocol+'//'+location.hostname+$current.data('url'));
			return false;
		});

		if(logged_in){ 
			
			// init user's lists		
			initUserList();
			// init friend lists
			initFriendList();
		}else{
			$mores.filter('#show-share').find('.tit > a[href=#more-share-sns]').css('width','100%');
			$mores.filter('#show-share').find('.tit > a[href=#more-share-send]').hide();
		}
	}

	function repositionOverlay() {
		if ($current.offset().top-$(window).scrollTop() < $(window).height() - 250) {
			$mores.filter('[id]').addClass('bot');
		} else {
			$mores.filter('[id]').removeClass('bot');
		}
	}

	function initUserList() {	
		$mores.filter('#show-share').find('.tit > a').on('click', function(event){
			var $this = $(this), $indicator = $this.nextAll('.indicator');
			if ($this.is(':first-child')) {
				$indicator.css({left:12, right:'50%'});
			} else {
				$indicator.css({left:'50%', right:12});
			}
			$this.addClass('current').siblings('a').removeClass('current');
			$this.closest('#show-share').find($this.attr('href')).show().siblings().hide();
			if (!$this.is(':first-child')) {
				$this.closest('#show-share').find("#more-share-email").focus();
			}
			return false;
		}).end()
        .find('#more-share-sns .via a').click(function() {
            try {
                var $this = $(this);
                var t = { "fb": "Facebook", "tw": "Twitter", "gg": "GooglePlus", "tb": "Tumblr" }[$this.attr('class')];
                track_event('Complete Share', { "thing id": $this.attr('data-tid'), "type": t });
            } catch (e) {}
        }).end()
        .find('#more-share-link').on('copy', function() {
            try { track_event('Complete Share', { "thing id": $(this).attr('data-tid'), "type": "Clipboard" }); } catch (e) {}
        });


		$mores.find('#more-share-email').on('keyup', function(event){
			var val = $.trim(this.value);
			if (!val || this.prevVal === val) return;

			apiSearchFriend(this.prevVal = val).done(function(json){
				var result = [];

				$.each(json, function(){
					var $li = $('<li />'), $a = $('<a class="before-bg-share2" />').appendTo($li);
					$a.data(this);
					$('<img alt="" />').attr('src', this.profile_image_url).appendTo($a);
					$('<b />').text(this.fullname).appendTo($a);
					$('<small />').text('@'+this.username).appendTo($a);
					result.push($li[0]);
				});

				var $send = $('#more-share-send');
				if (result.length) {
					$send.find('> .empty').hide();
					$send.find('> .send').show();
					$send.find('> .lists').show().empty().append(result);
				} else {
					$send.children('.lists, .send').hide();
					$send.find('> .empty').removeClass('default').addClass('no-result').show();
				}
			});
		});
	}

	var shortcutURL = {};
	function openSharePopup(url) {
        track_event('Share', { 'thing id': $current.attr('data-tid') });
		var $link = $mores.find('#more-share-link');
		var title =$current.data('title'), img = 'https://'+$current.data('img');
        $("#show-share .via a").attr('data-tid', $current.attr('data-tid'));
        $link.attr('data-tid', $current.attr('data-tid'))
		updateSocialLink($link.val(), title, img);
		if (!shortcutURL[url]) {
			if (window.viewer && viewer.username) url += '?ref='+viewer.username;
			$link.val(url);

			$.post('/get_short_url.json', {thing_id:$current.attr('data-tid')}).done(function(data){
				if(data.short_url) {
					shortcutURL[url] = data.short_url;
					$link.val(data.short_url);
					updateSocialLink($link.val(), title, img);
				}
			});
		} else {
			$link.val(shortcutURL[url]);
		}

		// select first tab
		$mores.filter('#show-share').find('.tit > a:first-child').click();

		clearFriendList();
	}

	$(window).on('scrollstop', function(){
		var scrollTop = $(window).scrollTop();
		var windowHeight = $(window).height();
		$(".stream li.active").each(function(){
			var $this = $(this);
			if( $this.offset().top + $this.height() < scrollTop || $this.offset().top > scrollTop + windowHeight){
				$trick.click();
			}
		})
	});

	function updateSocialLink(url, txt, img) {
		url = encodeURIComponent(url);
		txt = encodeURIComponent(txt);
		img = encodeURIComponent(img);

		$('#show-share .via')
			.find('a.tw').attr('href', 'http://twitter.com/share?text='+txt+'&url='+url+'&via=fancy').data({width:540,height:300}).end()
			.find('a.fb').attr('href', 'http://www.facebook.com/sharer.php?u='+url).data({url:url,text:txt}).end()
			.find('a.gg').attr('href', 'https://plus.google.com/share?url='+url).end()
			.find('a.tb').attr('href', 'http://www.tumblr.com/share/link?url='+url+'&name='+txt+'&description='+txt).end();
			/*
			.find('a.li').attr('href', 'http://www.linkedin.com/shareArticle?mini=true&url='+enc_url+'&title='+enc_txt+'&source=thefancy.com').end()
			.find('a.vk').attr('href', 'http://vkontakte.ru/share.php?url='+enc_url).end()
			.find('a.wb').attr('href', 'http://service.weibo.com/share/share.php?url='+enc_url+'&appkey=&title='+enc_txt+(img?'&pic='+enc_img:'')).end()
			.find('a.mx').attr('href', 'http://mixi.jp/share.pl?u='+enc_url+'&k=91966ce7669c34754b21555e4ae88eedce498bf0').data({width:632,height:456}).end()
			.find('a.qz').attr('href', 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+enc_url).end()
			.find('a.rr').attr('href', 'http://share.renren.com/share/buttonshare.do?link='+enc_url+'&title='+enc_txt).end()
			.find('a.od').attr('href', 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=2&st.noresize=on&st._surl='+enc_url).end()
			*/
	}

	function apiSearchFriend(str) {
		if (apiSearchFriend.xhr) apiSearchFriend.xhr.abort();
		apiSearchFriend.xhr = $.get('/search-users.json', {
			term: str,
			filter_messages_permission: true
		});

		return apiSearchFriend.xhr;
	}

	function initFriendList() {
		var $send = $mores.find('#more-share-send');
		$send.find('.lists').on('click', 'a', function(event){
			var $this = $(this), selected = !$this.hasClass('selected');
			$this.closest('ul').find('a').removeClass('selected');
			if (selected) $this.addClass('selected');
			$send.find('button.btn-send').prop('disabled', !selected);
			return false;
		});

		$send.find('.btn-send').click(function(event){
			var $this = $(this), text = $.trim($send.find('textarea').val());
			
			// users
			var users = $('#more-share-send a.selected').map(function(){ return $(this).data('id'); }).get();
			if (!users.length) return;

			var params = {things:$current.attr('data-tid'), user_id:users.join(',')};
			if(text) params.message = text;

			$this.prop('disabled', true);
			$.post('/messages/send-message.json', params)
				.done(function(json){
					if (json.status_code !== 1) {
						// TODO: show error message
						return;
					}

					clearFriendList();
					$mores.find('#more-share-send')
						.find('.empty').removeClass('default').addClass('success').end()
						.find('>.textbox').hide();
                    track_event('Complete Share', { "thing id": params.things, "type": "FancyMessage" });
				})
				.always(function(){
					$this.prop('disabled', false);
				});

			return false;
		});

		$send.find('.continue').on('click', function(event){
			clearFriendList();
			$send.find('#more-share-email').focus();
			return false;
		});

	}

	function clearFriendList() {
		// remove search history for users
		$mores.find('#more-share-email').val('');

		// clear all states
		$mores.find('#more-share-send')
			.find('.lists').hide().end()
			.find('.empty').show().removeClass('no-result success').addClass('default').end()
			.find('textarea').val('').end()
			.find('>.textbox').show().end()
			.find('>.send').hide().end()
			.find('.btn-send').prop('disabled', true);
	}

	global.MoreShareLagacy = {
		init: init
	};
})(window, jQuery);
