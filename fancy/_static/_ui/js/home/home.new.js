(function(){
	var $stream = $('.timeline #content ol.stream'), $container=$('.container.timeline'), $wrapper = $('.wrapper-content'), first_id = 'stream-first-item_', latest_id = 'stream-latest-item_', vid = $stream.attr('vid');

    var feedName = "Everything";
	
	if(!vid){
		$stream.delegate('div.figure-item a', 'click', function(){
			var $this = $(this), requireLogin = $this.attr('require_login'), url = $this.attr('href');
            url = url || '';

			if (requireLogin !== 'true') return;

			$('#fancy-g-signup,#fancy-g-signin').attr('next', url);
			$social = $('.social');
			if ($social.length > 0) {
				 $social.attr('next', url);
			}
			$(".popup.sign.signup")
				.find('input.next_url').val(url).end()
				.find('a.signup').attr('href','/register?next='+url).end()
				.find('a.signin').attr('href','/login?next='+url);
			$.dialog('popup.sign.signup').open();
			return false;
		});
	} else {
		$(function(){
			var $custom_checks = $('div.customize form.options input:checkbox');
			$custom_checks.click(function(){
				if (!$custom_checks.filter(':checked').length) $('#show_featured_items').prop('checked', true);
			});
		});
	}

	// show images as each image is loaded
	$stream.on('itemloaded', function(e, skipScroll){

		var $latest = $stream.find('>#'+latest_id).removeAttr('id'),
	 	    $first = $stream.find('>#'+first_id).removeAttr('id'),
		    $target=$();

		var forceRefresh = false;

		if(!$first.length || !$latest.length) {
			$target = $stream.children('li');
			setTimeout(function(){
				$target.find(".video_player").videoPlayer({autoplay:true});
			},10);			
		} else {
			var newThings = $first.prevAll('li');
			if(newThings.length) forceRefresh = true;
			$target = newThings.add($latest.nextAll('li'));

			setTimeout(function(){
				$target.find(".video_player").videoPlayer({autoplay:true,hidden:true });
			},10);
		}

		$stream.find('>li:first-child').attr('id', first_id);
		$stream.find('>li:last-child').attr('id', latest_id);

		if(!skipScroll){
			$(window).trigger("scroll.infiniteshow");	
		}
	});

	// show images as each image is loaded
	$stream.on('restored', function(e){
		var $target = $stream.children('li');
		$target.find("li[tid]").each(function(){
			$(this).attr('data-expose-id', $(this).attr('tid'));
		})
		$target.find(".video_player").videoPlayer({autoplay:true});

		$stream.find('>li:first-child').attr('id', first_id);
		$stream.find('>li:last-child').attr('id', latest_id);
	});

	$stream.trigger('itemloaded');

	$wrapper.on('redraw', function(event){
		setView(true);
	});

	var $win = $(window),
		scTop    = $win.scrollTop(),
		stTop    = $stream.offset().top,
		winH     = $win.innerHeight(),
		headerH  = $('#header-new').height(),
		firstTop = -1,
		maxDelay = 0,
		begin    = Date.now(),
		ajax     = null,
		prefetchajax = null;

	function inViewport(el){
		return (stTop + el.offsetTop + el.offsetHeight > scTop + headerH) && (stTop + el.offsetTop < scTop + winH);
	};

	function showLoading() {

		if(!window.Modernizr || !Modernizr.csstransitions ){
			$wrapper.find('.spinner').show().end();
			$wrapper.addClass('loading');
			$wrapper.trigger('before-fadeout');
		} else {
			$stream.addClass('use-css3').removeClass('fadein');

			$stream.find(">li,>dl").each(function(i,v){
				if(!inViewport(v)) return;
				if(firstTop < 0) firstTop = v.offsetTop;

				var delay = Math.round(Math.sqrt(Math.pow(v.offsetTop - firstTop, 2)+Math.pow(v.offsetLeft, 2)));

				v.className += ' anim';
				setTimeout(function(){ v.className += ' fadeout'; }, delay+10);

				if(delay > maxDelay) maxDelay = delay;
			});

			//$wrapper.trigger('before-fadeout').addClass('anim').addClass('loading');
		}
	};

	function setView(force){
		if(!force) return;

		var $items = $stream.find('>li,>dl');

		if($items.length>50){
			$items.filter(":eq(50)").nextAll().detach();
		}

		if(!window.Modernizr || !Modernizr.csstransitions ){
			$wrapper.removeClass('loading');

			$wrapper.trigger('before-fadein');
			
			$stream.find('>li,>dl').css('opacity',1);
			$wrapper.trigger('after-fadein');
			return;
		}

		var item,
		    $visibles, visibles = [], prevVisibles, thefirst,
		    offsetTop = $stream.offset().top,
		    hh = $('#header-new').height(),
		    sc = $(window).scrollTop(),
		    wh = $(window).innerHeight(),
			f_right, f_bottom, v_right, v_bottom,
			i, c, v, d, animated = 0;

		// get visible elements
		for(i=0,c=$items.length; i < c; i++){
			item = $items[i];
			if (offsetTop + item.offsetTop + item.offsetHeight < sc + hh) {
				//item.style.visibility = 'hidden';
			} else if (offsetTop + item.offsetTop > sc + wh) {
				//item.style.visibility = 'hidden';
				break;
			} else {
				visibles[visibles.length] = item;
			}
		}
		prevVisibles = visibles;
		// get the first animated element
		thefirst = visibles[0];

		if(visibles.length==0){
			$wrapper.trigger('before-fadein');
			fadeIn();
		}
		// fade out elements using delay based on the distance between each element and the first element.
		
		for(i=0,c=visibles.length; i < c; i++){
			v = visibles[i];

			d = Math.sqrt(Math.pow((v.offsetLeft - thefirst.offsetLeft),2) + Math.pow(Math.max(v.offsetTop-thefirst.offsetTop,0),2));
			delayOpacity(v, 0, d/5);

			if(i == c - 1){
				setTimeout(function(){
					$wrapper.trigger('before-fadein');
				}, d/5);
				setTimeout(function(){
					fadeIn()
				}, 200 + d/5);
			}
		}		

		function fadeIn(){

			if($wrapper.hasClass("wait")){
				setTimeout(fadeIn, 20);
				return;
			}

			var i, c, v, thefirst, COL_COUNT, visibles = [], item;

			if($items.length !== $stream.get(0).childNodes.length || $items.get(0).parentNode !== $stream.get(0)) $items = $stream.find('>li,>dl');
			$stream.height($stream.parent().height());

			// get visible elements
			for(i=0,c=$items.length; i < c; i++){
				item = $items[i];
				if (offsetTop + item.offsetTop + item.offsetHeight < sc + hh) {
					//item.style.visibility = 'hidden';
				} else if (offsetTop + item.offsetTop > sc + wh) {
					//item.style.visibility = 'hidden';
					break;
				} else {
					visibles[visibles.length] = item;
					item.style.opacity = 0;
				}
			}
			$(visibles).css({opacity:0,visibility:''});
			//$wrapper.addClass('anim');

			COL_COUNT = Math.floor($stream.width()/$(visibles[0]).width());

			// get the first animated element
			thefirst = visibles[0];
			
			// fade in elements using delay based on the distance between each element and the first element.
			if(visibles.length==0) done();

			for(i=0,c=visibles.length; i < c; i++){
				v = visibles[i];
				d = Math.sqrt(Math.pow((v.offsetLeft - thefirst.offsetLeft),2) + Math.pow(Math.max(v.offsetTop-thefirst.offsetTop,0),2));
				v.d = d/5;
			}
			for(i=0,c=visibles.length; i < c; i++){
				v = visibles[i];
				delayOpacity(v, 1, v.d);
				if(i == c -1) setTimeout(done, 300+v.d);
			}
			
		};

		function done(){			
			//$wrapper.removeClass('anim');
			$stream.find('>li,>dl').css('opacity',1);
			$wrapper.trigger('after-fadein');		
		};

		function delayOpacity(element, opacity, interval){
			setTimeout(function(){ $(element).animate({opacity:opacity}, 300)}, Math.floor(interval));
		};

        var feed = $("a.current[data-feed]").attr('data-feed');
        track_event('Timeline', { 'type': feed });
	};

	$notibar = $('.new-content');
	$notibar.off('click').on('click', function(){
		setTimeout(function(){
			$.jStorage.flush();
		    $stream.trigger('itemloaded');

		},100);
	});

	// category selection
	var init_ts = $stream.attr("ts");
	var ttl  = 5 * 60 * 1000;

	// feed selection
	var $feedtabs = $('.navigation .viewer li a[data-feed]');

	$feedtabs.click(function(e){
		var $el = $(e.currentTarget), login_require = $el.attr('require_login');
		if (typeof(login_require) != undefined && login_require === 'true')  return require_login();
		
		var feed = $el.attr("data-feed")||"featured";
		$feedtabs.filter('a.current').removeClass("current _switchNow _prefetching");
		$(this).addClass('current');
		window.st = new Date().getTime();
		if( $(this).hasClass('_prefetching') ){
			$(this).addClass('_switchNow');
		}else{
			switchTab(feed);
		}
		e.preventDefault();
	});

	if( $feedtabs.filter("a.current[data-feed]").attr('data-feed') == 'featured'){
		prefetchTab('recommended');
	}else{
		prefetchTab('featured');
	}

	function prefetchTab(feed){
		var result = $.jStorage.get('first-'+vid+'-'+feed+'.v4');
		if(!result){
			$feedtabs.filter("[data-feed="+feed+"]").addClass('_prefetching');
			if(prefetchajax) prefetchajax.abort();
			prefetchajax = $.ajax({
				url : '/?feed='+feed,
				dataType : 'html',
				success : function(data, st, xhr) {
					result = data;
					$.jStorage.set('first-'+vid+'-'+feed+'.v4', result, {TTL:5*60*1000});
					if( $feedtabs.filter("[data-feed="+feed+"]").hasClass('_switchNow') && $feedtabs.filter("[data-feed="+feed+"]").hasClass('current') ){
						$feedtabs.filter("[data-feed="+feed+"]").removeClass('_switchNow');
						switchTab(feed);
					}
				}
				,complete : function(){
					$feedtabs.filter("[data-feed="+feed+"]").removeClass('_prefetching');
				}
			});			
		}
	}

	function switchTab(feed, option){
		$.infiniteshow.abort();
		$.infiniteshow.option('disabled','true');

		if(ajax) ajax.abort();
		if(prefetchajax) prefetchajax.abort();
		
		$url = $('a.btn-more').hide();
		$win = $(window);

		var result = null, resultFromCache = false;
		$wrapper.addClass("wait");

		// hide notibar if it showing
		$notibar.hide();
		$stream.attr('ts','').data('feed-url', '/user-stream-updates?feed='+feed);
		var loc = "featured."+feed;
		var keys = {
			timestamp : 'fancy.home.v4.timestamp.'+loc,
			stream  : 'fancy.home.v4.stream.'+loc,
			latest  : 'fancy.home.v4.latest.'+loc,
			nextURL : 'fancy.home.v4.nexturl.'+loc
		};

        var jStorageKey = 'first-'+vid+'-'+feed+'.v4';

        if(feed!='livechat') {
    		result = $.jStorage.get(jStorageKey);
        }

        if(feed=='livechat') {
            url = '/?feed='+feed+(option?('&'+option):'');
        } else if (feed === 'article') {
            url = '/?feed=article';
        } else {
            url = '/';
        }
        window.history.pushState({},"",url);

		var swapContent = function(){
			if(!result){
				setTimeout(swapContent,20);
				return;
			}

			if($wrapper.hasClass("swapping")) return;
			$wrapper.addClass("swapping");
			$stream.find(">li,>dl").detach();

			$(window).scrollTop(0);

            if(feed=='livechat') {
                $('.container.timeline').addClass('livechat');
                $('.timeline #content ol.stream').addClass('livechat-list');
                $('.wrapper-content .filter').show();
                if(option=='history') {
                    $('.livechat.filter ul.menu').addClass('history').removeClass('upcoming');
                    try{track_event('View Live Chats History');}catch(e){}
                } else {
                    $('.livechat.filter ul.menu').addClass('upcoming').removeClass('history');
                    try{track_event('View Live Chats');}catch(e){}
                }
            } else {
                $('.container.timeline').removeClass('livechat');
                $('.timeline #content ol.stream').removeClass('livechat-list');
                $('.wrapper-content .filter').hide();
            }

			var $sandbox = $('<div>'),
		    $contentBox = $('.timeline #content ol.stream'),
			$next, $rows;

			$sandbox[0].innerHTML = result.replace(/^[\s\S]+<body.+?>|<((?:no)?script|header|nav)[\s\S]+?<\/\1>|<\/body>[\s\S]+$/ig, '');
			$next = $sandbox.find('a.btn-more');
			$rows = $sandbox.find('#content ol.stream > li,#content ol.stream > dl');

			$contentBox.append($rows);
			if(window.Modernizr && Modernizr.csstransitions )	$rows.css('opacity',0);

			$stream.trigger('itemloaded',[true]);

			// get fancyd state if the result comes from cache
			(function () {
				if(!resultFromCache) return;

				var ids = [], aids = [], items = {}, articles = {};
				$rows.each(function(){
					var $row = $(this);
                    var tid = ''+this.getAttribute('tid');
                    if(tid.match(/^[0-9]+$/)) {
    					ids.push(tid);
    					items[tid] = $row;
                    }
                    var aid = ''+this.getAttribute('aid');
                    if(aid.match(/^[0-9]+$/)) {
    					aids.push(aid);
    					$row.find('button.fancy').removeClass('disabled loading').prop('disabled', false).find('span[style]').removeAttr('style');
    					articles[aid] = $row;
                    }
				});

				if(ids.length){
					$.ajax({
						type : 'GET',
						url  : '/user_fancyd_things.json',
						data : {object_ids:ids.join(',')},
						dataType : 'json',
						success : function(json){
							var ids = {};

							$.each(json, function(i,v){ ids[v.object_id] = v.id });
							for(var k in items){
								var $this = $(items[k]), btn, rtid;
								if(rtid=ids[$this.attr('tid')]) {
									$this.find('button.fancy:not(.fancyd)').attr('rtid', rtid).addClass('fancyd').get(0);
								} else {
									$this.find('button.fancy.fancyd').removeAttr('rtid').removeClass('fancyd').get(0);
								}
							};
						}
					});
				}
				if(aids.length){
					$.ajax({
						type : 'GET',
						url  : '/user_fancyd_articles.json',
						data : {object_ids:ids.join(',')},
						dataType : 'json',
						success : function(json){
							var ids = {};

							$.each(json, function(i,v){ aids[v.object_id] = true });
							for(var k in articles){
								var $this = $(articles[k]), btn, rtid;
								if(aids[$this.attr('aid')]) {
									$this.find('button.fancy:not(.fancyd)').addClass('fancyd').get(0);
								} else {
									$this.find('button.fancy.fancyd').removeClass('fancyd').get(0);
								}
							};
						}
					});
				}
				
			})();

			if ($next.length) {
				if(!$url[0]){
					$url = $("<div class='pagination' style='display:none'><a href='' class='btn-more' ts='' ><span>Show more...</span></a>").appendTo($(".timeline #content")).find("a.btn-more");
				}
				url = $next.attr('href');
				$url.attr({
					'href' : $next.attr('href'),
					'ts'   : $next.attr('ts')
				});
				$stream.attr("ts",init_ts);
				$(window).trigger("prefetch.infiniteshow");
			} else {
				url = ''
				$url.attr({
					'href' : '',
					'ts'   : ''
				});
			}

			var feedName = "Everything";

			if(feed){
        if(feed=='livechat') feedName = 'LiveChat';
				if(feed=='recommended') feedName = 'Recommended';
				if(feed=='article') feedName = 'Article';
				else feedName = 'Featured'
			}
			$wrapper.removeClass("wait");
			$wrapper.removeClass("swapping");
		}

		var done = function(){
			//setTimeout(function(){$('#content ol.stream > li').css('opacity',1)},500);
			$.infiniteshow.option('disabled',null);
			if(feed=='recommended'){
                track_event_register({ attribution: 'Recommended' });
				$(window).trigger("scroll.infiniteshow");
			}else{
                track_event_register({ attribution: 'Timeline' });
				$(window).trigger("prefetch.infiniteshow");
			}
		}

		showLoading();

		if(result){
			resultFromCache = true;
			$stream.trigger("changeloc");
			$wrapper.off('before-fadein').on('before-fadein', swapContent);
			$wrapper.off('after-fadein').on('after-fadein', done);
			$wrapper.trigger("redraw");
		} else {
			if(ajax) ajax.abort();
			ajax =$.ajax({
				url : '/?feed='+feed+(option?('&'+option):''),
				dataType : 'html',
				success : function(data, st, xhr) {
					result = data;
                    if(feed!='livechat') {
    					$.jStorage.set(jStorageKey, result, {TTL:5*60*1000});
                    }
				},
				error : function(xhr, st, err) {
					url = '';
				},
				complete : function(){
					$stream.trigger("changeloc");
					$wrapper.off('before-fadein').on('before-fadein', swapContent);
					$wrapper.off('after-fadein').on('after-fadein', done);
					$wrapper.trigger("redraw");
				}
			});
		}

		$.cookie.set('timeline-feed',feed,9999);
	}

	$stream.on('changeloc',function(){
		var feed = ($feedtabs.filter(".current").attr("data-feed")||"featured");
		$stream.attr("loc", "featured."+feed );		
		if(typeof LogExposed != 'undefined') LogExposed.from = (feed=='recommended'?'recommended':'timeline');
	})

	$(window).load(function(){
		$(window).trigger("prefetch.infiniteshow");
	})
	$(window).unload(function(){
		//$.jStorage.flush();
	});

	$stream.find('select[name=option_id]').on('change', function(event) {
		var $this = $(this);
		var $selectedOption = $this.children('option:selected');
		var $quantitySelectTags = $this.siblings('select[name=quantity]');
		var remainingQuantity = parseInt($selectedOption.attr('remaining-quantity'));

		var currentlySelectedQuantity = parseInt($quantitySelectTags.val());
		if (currentlySelectedQuantity > remainingQuantity) {
			currentlySelectedQuantity = remainingQuantity;
		}
		$quantitySelectTags.empty();
		for (var i=1; i<=remainingQuantity && i<=10; i++) {
			$quantitySelectTags.append('<option value="' + i + '">' + i + '</option>');
		}
		$quantitySelectTags.val(currentlySelectedQuantity);
	});

	$stream
		.on('click', 'input[type="text"][readonly],textarea[readonly]', function(event){
			event.preventDefault();
			$(this).focus().select();
		})
		.on('keyup', 'input[name="email-recv"],textarea[name="email-msg"]', function(event){
			var $email = $(this).closest('.email'), recv = $.trim($email.find('input[name="email-recv"]').val()), msg = $.trim($email.find('textarea').val()), $btn = $email.find('button');
			// see common/util.js to change emailRegEx
			$btn[0].disabled = !(emailRegEx.test(recv) && msg);
		})
		.on('click', 'button[name="email-send"]', function(event){
			var $this = $(this);
			var $email = $this.closest('.email'), recv = $.trim($email.find('input[name="email-recv"]').val()), msg = $.trim($email.find('textarea').val());
			var $li = $email.closest('li'), tid = $li.attr('tid'), params;
			// see common/util.js to change emailRegEx
			if (!emailRegEx.test(recv)) return;

			if ($this.hasClass('loading')) return;
			$this.addClass('loading');

			params = {
				type : 'nt',
				url  : $li.find('input[name="share-link"]').val(),
				name : $.trim($li.find('figcaption > a').text()),
				oid  : $li.attr('tid'),
				ooid : $li.attr('tuserid'),
				emails : recv,
				message : msg
			};

			$.post('/share-with-someone.json', params)
				.then(function(data){
					alert('Sent!');
					$li.removeClass('active').find('.opened').removeClass('opened').end().find('.show_share').hide();
				})
				.always(function(){
					$this.removeClass('loading');
				});
		})
		.on('click', '.via > .more', function(event){
			event.preventDefault();
			$(this).closest('.via').toggleClass('show');
		})
		.on('mouseover', '.via > .others > a', function(event){
			var $em = $(this).find('em');
			$em.css('margin-left',-($em.width()/2)-13+'px');
		})
		.on('click', '.select-boxes2', function(event){
			event.preventDefault();
			$(this).closest('.customize').toggleClass('opened');
		})
		.on('click', '.sns > .via a:not(.more)', function(event){
			event.preventDefault();
			var $this = $(this);

			if ($this.is('.fb') && window.FB) {
				var params = {
					method: 'feed',
					link: $this.closest('.popup').data('url')||$this.data('url'),
					name: $this.data('text'),
					caption: '',
					description: ''
				};
				FB.ui(params, $.noop);
			} else {
				var w = $this.data('width') || 620, h = $this.data('height') || 380, t = Math.max(Math.round((screen.availHeight-h-80)/2), 20), l = Math.max(Math.round((screen.availWidth-w)/2), 5);
				try{ window.open($this.attr('href'), $this.attr('class'), 'top='+t+',left='+l+',width='+w+',height='+h+',menubar=no,status=no,toobar=no,location=no,personalbar=no,scrollbars=no,resizable=yes').focus(); }catch(e){};
			}
		})
		.on('mouseover', '.figure.gif', function(e){
			var src = $(this).find("img.gif").attr('src');
			$(this).find("img.gif").attr('src', '/_ui/images/common/blank.gif');
			$(this).addClass('on').find("img.gif").attr('src', src);
		})
		.on('mouseout', '.figure.gif', function(e){
			$(this).removeClass('on');
		})

	$(window).on('scrollstop', function(){
		var scrollTop = $(window).scrollTop();
		var windowHeight = $(window).height();
		$("ol.stream li.active").each(function(){
			var $this = $(this);
			if( $this.offset().top + $this.height() < scrollTop || $this.offset().top > scrollTop + windowHeight){
				$this.find(".show_cart.opened, .menu-container.opened").removeClass('opened').end().removeClass("active");
				$this.find(".menu-container .show_share, .menu-container .show_someone").hide();
			}
		})
	});

    $('.livechat.filter .menu li a').click(function(event) {
        event.preventDefault();
        var to_history = false;
        if($(this).hasClass('history')) {
            to_history = true;
        }
        if(to_history) {
            if($(this).closest('ul').hasClass('history')) {
                return;
            }
            switchTab('livechat', 'history');
        } else {
            if(!$(this).closest('ul').hasClass('history')) {
                return;
            }
            switchTab('livechat');
        }
    });
})();
