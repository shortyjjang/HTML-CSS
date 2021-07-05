$(function(){
	
	var $stream = $('ul.figure-shop').attr('loc', location.pathname.replace(/\//g, '-').substr(1)), $last;
	$last = $stream.find('>li:last-child');
	$.infiniteshow({itemSelector:'ul.figure-shop > li'});
	$stream.data('restored', $last[0] !== $stream.find('>li:last-child')[0]);
	if(!$stream.find('> li').length) $('div.empty-result').show();

	$('select.category').change( function(event){
		$opt = $(this).find("[value='"+ $(this).val()+"']");
		$(this).prev().html( $opt.text() );
		var url = $(this).val(), args = $.extend({}, location.args), query;

		if(args.categories) delete args.categories;
		if(query = $.param(args)){
			if(url.indexOf("?")>0) url += '&'+query;
			else url += '?'+query;
		} 

		loadPage(url);
	});


	// filter option
    $('.seller-filter .btn-done').click(function(event){
    	var $filter = $('.seller-filter');
    	$.dialog('seller-filter').close();
    	var url = location.pathname, args = $.extend({}, location.args), query;
		var sort_by_price = $filter.find('[name=sort]').val()
		var price = $filter.find('[name=price]').val()
		var color = $filter.find('[name=color]').val()
		
		if(sort_by_price){
			args.sort_by_price = sort_by_price;
		} else {
			delete args.sort_by_price;
		}

		if(price){
			args.p = price;
		} else {
			delete args.p;
		}

		if(color){
			args.c = color;
		} else {
			delete args.c;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});


	function loadPage(url, skipSaveHistory){
		var $win = $(window), $stream  = $('ul.figure-shop');

		var $lis     = $stream.find('>li'),
			scTop    = $win.scrollTop(),
			stTop    = $stream.offset().top,
			winH     = $win.innerHeight(),
			headerH  = $('#header').height(),
			useCSS3  = Modernizr.csstransitions,
			firstTop = -1,
			maxDelay = 0,
			begin    = Date.now();

		if(useCSS3){
			$stream.addClass('use-css3').removeClass('fadein');

			$lis.each(function(i,v){
				if(!inViewport(v)) return;
				if(firstTop < 0) firstTop = v.offsetTop;

				var delay = Math.round(Math.sqrt(Math.pow(v.offsetTop - firstTop, 2)+Math.pow(v.offsetLeft, 2)));

				v.className += ' anim';
				setTimeout(function(){ v.className += ' fadeout'; }, delay+10);

				if(delay > maxDelay) maxDelay = delay;
			});
		}

		if(!skipSaveHistory && window.history && history.pushState){
			history.pushState({url:url}, document.title, url);
		}
		location.args = $.parseString(location.search.substr(1));

		$("#content").addClass("loading");
						
		$.ajax({
			type : 'GET',
			url  : url,
			dataType : 'html',
			success  : function(html){
				
				$stream.attr('loc', location.pathname.replace(/\//g, '-').substr(1));

				var $html = $($.trim(html)),
				    $more = $('.pagination > a'),
				    $new_more = $html.find('.pagination > a');
					
				$stream.html( $html.find('ul.figure-shop').html() );

				if(!$stream.find('> li').length){
					$stream.css('height','');
					$('div.empty-result').show();	
				} 
				else $('div.empty-result').hide();

				if($new_more.length) $('.pagination').append($new_more);
				$more.remove();
				$("#content").removeClass("loading");

				(function(){
					if(useCSS3 && (Date.now() - begin < maxDelay+300)){
						return setTimeout(arguments.callee, 50);
					}

					$stream.addClass('fadein').html( $html.find('ul.figure-shop').html() );
					
					if(useCSS3){
						$win.scrollTop(scTop);
						scTop = $win.scrollTop();
						stTop = $stream.offset().top;
						
						firstTop = -1;
						$stream.find('>li').each(function(i,v){
							if(!inViewport(v)) return;
							if(firstTop < 0) firstTop = v.offsetTop;
							
							var delay = Math.round(Math.sqrt(Math.pow(v.offsetTop - firstTop, 2)+Math.pow(v.offsetLeft, 2)));
							
							v.className += ' anim';
							setTimeout(function(){ v.className += ' fadein'; }, delay+10);
							
							if(delay > maxDelay) maxDelay = delay;
						});

						setTimeout(function(){ $stream.removeClass('use-css3 fadein').find('li.anim').removeClass('anim fadein'); }, maxDelay+300);
					}

					// reset infiniteshow
					$.infiniteshow({itemSelector:'ul.figure-shop li'});
					$win.trigger('scroll');
				})();
			}
		});

		function inViewport(el){
			return (stTop + el.offsetTop + el.offsetHeight > scTop + headerH) && (stTop + el.offsetTop < scTop + winH);
		};
	};


	$(window).on('popstate', function(event){
		var e = event.originalEvent, $stream;
		if(!e || !e.state) return;

		$stream = $('ul.figure-shop');
		if ($stream.data('restored')) {
			$stream.data('restored', false);
		} else {
			loadPage(event.originalEvent.state.url, true);
		}
	});

	// contact

	$contactPopup = $(".popup.seller-contact");
	$contactPopup
		.find(".btn-cancel").click(function(e){
			$.dialog('seller-contact').close();
		})
		.end()
		.find('.btn-send').click(function(e){
			var from_email = $contactPopup.find("input[name=from-email]").val();
			var from_name = $contactPopup.find("input[name=from-name]").val();
			var seller_username = $contactPopup.find("input[name=seller-username]").val();
			var copy_email = $contactPopup.find("#copy-email")[0].checked;
			var subject = $contactPopup.find("input[name=subject]").val();
			var message = $contactPopup.find("textarea[name=message]").val();

			if(!subject){
				alert("Please enter subject");
				$contactPopup.find("input[name=subject]").focus();
				return;
			}
			if(!message){
				alert("Please enter message");
				$contactPopup.find("textarea[name=message]").focus();
				return;
			}

			var params = {
				from_email : from_email,
				from_name : from_name,
				seller_username : seller_username,
				copy_email : copy_email,
				subject : subject,
				message : message
			}
			$.ajax({
				type : 'post',
				url  : '/send_email_to_seller.json',
				data : params,
				dataType : 'json',
				success  : function(json){					
					// to do something?
					if (json.status_code) {
						//alert(gettext("Email Sent"));						
					}else{
						//alert(gettext("Failed"));
					}
					$contactPopup.find("input[name=subject]").val("");
					$contactPopup.find("textarea[name=message]").val("");
					$.dialog('seller-contact').close();
				},
				error : function(){
					//alert(gettext("Failed"));
					$contactPopup.find("input[name=subject]").val("");
					$contactPopup.find("textarea[name=message]").val("");
					$.dialog('seller-contact').close();
				}
			});
		})
		.end()

	var $win=$(window),$doc=$(document),$ov_share=$('#pop_wrap .share_thing'),$add=$ov_share.find('span.add'),$list=$ov_share.find('.user-list'),$tpl=$list.find('>script').remove(),$name=$add.prev('script').remove();

	
	var txt_add = $add.text().split('|');
	var is_ios = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );	
	$ov_share
		.on({
			show : function(){
				var $this = $(this), cmt, url, img, enc_cmt, enc_url, enc_img;

				url = location.protocol+'//'+location.hostname+location.pathname;
				enc_url = encodeURIComponent(url);

				cmt = '';
				enc_cmt = encodeURIComponent(cmt);
				img = '';
				enc_img = encodeURIComponent(img);

				// initialize
				$this
					.find('input:text:not([name=url]),textarea').val('').end()
					.find('span.add').text(txt_add[0]).end()
					.find('.user-list').hide().end()
					.find('b.name').remove().end()
					.find('.sh-frm').removeClass('focus').end();

				$this
					.show()					
					.find('>form')
						.find('.share-via')
							.find('a.tw').attr('href', 'http://twitter.com/share?text='+enc_cmt+'&url='+enc_url+'&via=fancy').end()
							.find('a.fb').attr('href', 'http://www.facebook.com/sharer.php?u='+enc_url).end()
							.find('a.gg').attr('href', 'https://plus.google.com/share?url='+enc_url).end()
							.find('a.su').attr('href', 'http://www.stumbleupon.com/submit?url='+enc_url+'&title='+enc_cmt).end()
							.find('a.tb').attr('href', 'http://www.tumblr.com/share/link?url='+enc_url+'&name='+enc_cmt+'&description='+enc_cmt).end()
							.find('a.li').attr('href', 'http://www.linkedin.com/shareArticle?mini=true&url='+enc_url+'&title='+enc_cmt+'&source=thefancy.com').end()
							.find('a.vk').attr('href', 'http://vkontakte.ru/share.php?url='+enc_url).end()
							.find('a.wb').attr('href', 'http://service.weibo.com/share/share.php?url='+enc_url+'&appkey=&title='+enc_cmt+'&pic='+enc_img).end()
							.find('a.mx')
								.unbind('click')
								.click(function(){
									try { window.open('http://mixi.jp/share.pl?u='+enc_url+'&k=91966ce7669c34754b21555e4ae88eedce498bf0','share','width=632,height=456').focus(); } catch(e){};
									return false;
								})
							.end()
							.find('a.qz').attr('href', 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+enc_url).end()
							.find('a.rr').attr('href', 'http://share.renren.com/share/buttonshare.do?link='+enc_url+'&title='+enc_cmt).end()
							.find('a.od').attr('href', 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=2&st.noresize=on&st._surl='+enc_url).end()
							.find('a.od').attr('href', 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=2&st.noresize=on&st._surl='+enc_url).end()
						.end();

				var $this = $(this).trigger('reset');
	            var g = $this.find("#gplus-share");				
				var username = $this.find('form').attr('username');
				var txt = $this.find('form').attr('tagline');
	            var deeplink = "shop/" + username;
	            var actiondeeplink = deeplink + "?action=follow";
	            var options = { 
	                'scope' : scope_, 
	                'clientid': clientid_, 'contenturl': url,
	                'contentdeeplinkid': deeplink, 'targetdeeplinkid': deeplink,
	                'calltoactionlabel': "FOLLOW",
	                'calltoactionurl': url + "?action=follow",
	                'calltoactiondeeplinkid': actiondeeplink,
	                'cookiepolicy': cookiepolicy_url,
	                'prefilltext': txt
	            };
	            $this.find("#gplus-share")
	                .attr("href", "#").attr("target", "")
	                .on("click", function() { $ov_share.hide(); });
	            gapi.interactivepost.render("gplus-share", options);

				if (is_ios) {
					var url = "whatsapp://send?text=";
					url += [enc_cmt, enc_url].join(' ');
					$('.share_whatsapp').show().find('a').attr('href', url);
				}
			},
			hide : function(){
				var $this = $(this);
				$this.hide();
			},
			click : function(event){
				if(event.target === this) $(this).trigger('hide');
			},
			touchstart : function(event){
				if(event.target === this) $(this).trigger('hide');
			}
		})
	
});
