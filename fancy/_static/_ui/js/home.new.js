(function(){
	var $btns = $('.viewer li'), $stream = $('ol.stream'), $container=$('.container.timeline'), $wrapper = $('.wrapper-content'), first_id = 'stream-first-item_', latest_id = 'stream-latest-item_', vid = $stream.attr('vid');

    var feed = $('.sorting a[data-feed].active').data("feed");
    var category = $('.sorting a[data-feed].active').data("category");

	var feedName = "Everything";
	if(feed == 'following') feedName = 'Following'
	else if(feed =='recommend') feedName = 'Recommended'
	if( category && category != 'all'){
		feedName = $('.sorting a[data-feed].active').text();
	}

    $stream.data('feed-url', '/user-stream-updates?new&feed=' + feed);

	if(!vid){
		$stream.delegate('div.figure-item a', 'click', function(){
			var url = $(this).attr('href');
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
	$stream.on('itemloaded', function(){

		var $latest = $stream.find('>#'+latest_id).removeAttr('id'),
	 	    $first = $stream.find('>#'+first_id).removeAttr('id'),
		    $target=$(), viewMode;

		// merge sameuser thing 
		/*var userid = $latest.attr('tuserid');
		var $currents = $latest.prevUntil('li[tuserid!='+userid+"]");
		var $nexts = $latest.nextUntil('li[tuserid!='+userid+"]");
		var $group = $($currents).add($latest).add($nexts);
		$nexts.filter(".clear").removeClass("clear").find("a.vcard").detach();
		if($group.length>2){
			$group.removeClass("big mid").addClass("sm").each(function(i){
				if(i%3==0) $(this).addClass("clear");
			});

			if($group.length%3==2){
				$group.last().removeClass("sm").addClass("mid").prev().removeClass("sm").addClass("mid");
			}else if($group.length%3==1){
				$group.last().removeClass("sm").addClass("big");
			}
		}else if($group.length==2){
			$group.removeClass("big").addClass("mid");
		}*/
		
		var forceRefresh = false;

		if(!$first.length || !$latest.length) {
			$target = $stream.children('li');
		} else {
			var newThings = $first.prevAll('li');			
			if(newThings.length) forceRefresh = true;
			$target = newThings.add($latest.nextAll('li'));
		}

		$stream.find('>li:first-child').attr('id', first_id);
		$stream.find('>li:last-child').attr('id', latest_id);

	    if( $stream.attr('mode')) 
	    	viewMode = $stream.attr('view')=='vertical' ? 'vertical' : ($stream.attr('view')=='normal' ? 'grid':'classic');
	    else 
	    	viewMode = $container.hasClass('vertical') ? 'vertical' : ($container.hasClass('normal') ? 'grid':'classic');


		if(viewMode=='classic'){
			$target.find(".figure.grid > img").each(function(){
				$(this).attr("src", $(this).attr('data-src'));
			});
			$target.find(".figure.grid").each(function(){
				var $grid_img = $(this);
				
				if($grid_img.height()>400){
					$grid_img.css("background-image", "url("+$grid_img.attr("data-ori-url")+")");					
				}else{
					$grid_img.css("background-image", "url("+$grid_img.attr("data-310-url")+")");
				}
			});
		}else if(viewMode=='vertical'){
			$target.find(".figure.vertical > img").each(function(){
				var $this = $(this);
				$this.attr('src', $this.attr('data-src'));
			})	
		}else if(viewMode=='grid'){
			$target.find(".figure.grid").each(function(){
				var $grid_img = $(this);
				if($grid_img.height()>400){
					$grid_img.css("background-image", "url("+$grid_img.attr("data-ori-url")+")");					
				}else{
					$grid_img.css("background-image", "url("+$grid_img.attr("data-310-url")+")");
				}
			});
		}

		if(viewMode == 'vertical'){
			$('#infscr-loading').show();
			setTimeout(function(){
				arrange(forceRefresh);
				$('#infscr-loading').hide();
			},10);
		}

		$target.find("form.comment-form").each(function(){
			if( typeof initCommentForm != "undefined") initCommentForm($(this));
		})

	});
	$stream.trigger('itemloaded');
	
	// $btns.each(function(){
	// 	var $tip = $(this).find('span');
	// 	$tip.css('margin-left', -$tip.width()/2 - 8 + 'px');
	// });
	//$btns.hover(function(){$container.css('z-index','11');},function(){$container.css('z-index','0');});
	$btns.click(function(event){
		event.preventDefault();
		if($wrapper.hasClass('anim')) return;
		
		var $btn = $(this);

		
		if(/\b(normal|vertical|classic)\b/.test($btn.attr('class'))){
			var timelineView = RegExp.$1;
			$wrapper.trigger('timelineViewChanged', [timelineView]);
			setView(timelineView);
			// hightlight this button only
			$btns.find('a.current').removeClass('current');
			$btn.find('a').addClass('current');
		}
	});

	$wrapper.on('redraw', function(event){
		var curMode = '';
		if(/\b(normal|vertical|classic)\b/.test($container.attr('class'))) curMode = RegExp.$1;
		if(curMode) setView(curMode, true);
	});

	function showLoading() {
		if(!window.Modernizr || !Modernizr.csstransitions ){
			$wrapper.find('.spinner').show().end();
			$wrapper.addClass('loading');
			$wrapper.trigger('before-fadeout');
		} else {
			$wrapper.trigger('before-fadeout').addClass('anim').addClass('loading');	
		}
	};

	function setView(mode, force){
		if(!force && $container.hasClass(mode)) return;
		var $items = $stream.find('>li');

		if($items.length>100){
			$items.filter(":eq(100)").nextAll().detach();			
		}

		if(!window.Modernizr || !Modernizr.csstransitions ){
			$wrapper.removeClass('loading');

			$wrapper.trigger('before-fadein');
			switchTo(mode);	

			
			$stream.find('>li').css('opacity',1);
			$wrapper.trigger('after-fadein');
			return;
		}
		$stream.attr('view', mode);

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
		for(i=0,c=Math.min(visibles.length,10),thefirst=null; i < c; i++){
			v = visibles[i];
			
			if( !thefirst || (thefirst.offsetLeft > v.offsetLeft) || (thefirst.offsetLeft == v.offsetLeft && thefirst.offsetTop > v.offsetTop) ) {
				thefirst = v;
			}
		}

		if(visibles.length==0) fadeIn();
		// fade out elements using delay based on the distance between each element and the first element.
		for(i=0,c=visibles.length; i < c; i++){
			v = visibles[i];

			d = Math.sqrt(Math.pow((v.offsetLeft - thefirst.offsetLeft),2) + Math.pow(Math.max(v.offsetTop-thefirst.offsetTop,0),2));
			delayOpacity(v, 0, d/5);

			if(i == c -1){
				setTimeout(fadeIn,300+d/5);
			}
		}

		function fadeIn(){
			$wrapper.trigger('before-fadein');

			if($wrapper.hasClass("wait")){
				setTimeout(fadeIn, 50);
				return;
			}

			var currentMode = $stream.attr('view');
			if(!currentMode)
				currentMode = $container.hasClass('vertical')?'vertical':($container.hasClass('classic')?'classic':'normal')
		    
			if(currentMode=='normal'){
				$items.each(function(i,v,a){
					var $li = $(this);
					var $grid_img = $li.find(".figure.grid");
					
					if($li.height()>400){
						$grid_img.css("background-image", "url("+$grid_img.attr("data-ori-url")+")");					
					}else{
						$grid_img.css("background-image", "url("+$grid_img.attr("data-310-url")+")");
					}
				});
			}

			var i, c, v, thefirst, COL_COUNT, visibles = [], item;
			
			if($items.length !== $stream.get(0).childNodes.length || $items.get(0).parentNode !== $stream.get(0)) $items = $stream.find('>li');
			$stream.height($stream.parent().height());
			
			$wrapper.removeClass('loading').removeClass('anim');

			switchTo(mode);

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
			
			$wrapper.addClass('anim');

			$(visibles).css({opacity:0,visibility:''});
			COL_COUNT = Math.floor($stream.width()/$(visibles[0]).width());

			// get the first animated element
			for(i=0,c=Math.min(visibles.length,COL_COUNT),thefirst=null; i < c; i++){
				v = visibles[i];
				
				if( !thefirst || (thefirst.offsetLeft > v.offsetLeft) || (thefirst.offsetLeft == v.offsetLeft && thefirst.offsetTop > v.offsetTop) ) {
					thefirst = v;
				}
			}

			// fade in elements using delay based on the distance between each element and the first element.
			if(visibles.length==0) done();
			for(i=0,c=visibles.length; i < c; i++){
				v = visibles[i];

				d = Math.sqrt(Math.pow((v.offsetLeft - thefirst.offsetLeft),2) + Math.pow(Math.max(v.offsetTop-thefirst.offsetTop,0),2));
				delayOpacity(v, 1, d/5);

				if(i == c -1) setTimeout(done, 300+d/5);
			}
		};

		function done(){
			$wrapper.removeClass('anim');
			/*if(prevVisibles && prevVisibles.length) {
				for(var i=0,c=visibles.length; i < c; i++){
					if(visibles[i].style.opacity == '0') visibles[i].style.opacity = 1;
				}
			}*/
			$stream.find('>li').css('opacity',1);
			
			$wrapper.trigger('after-fadein');
		};
		
		function delayOpacity(element, opacity, interval){
			setTimeout(function(){ element.style.opacity = opacity }, Math.floor(interval));
		};
		
		function switchTo(mode){
			var currentMode = $container.hasClass('vertical')?'vertical':($container.hasClass('classic')?'classic':'normal')
			$container.removeClass('vertical normal classic').addClass(mode);
			if(mode == 'vertical') {
				arrange(true);
				$.infiniteshow.option('prepare',2000);
			} else {
				$stream.css('height','');
				$.infiniteshow.option('prepare',4000);
			}

			if(mode=='classic'){
				$stream.find("li.big .figure.grid > img").each(function(){
					$(this).attr("src", $(this).attr('data-src'));
				});
				$stream.find("li.mid .figure.grid, li.sm .figure.grid").each(function(){
					var $grid_img = $(this);
					
					if($grid_img.height()>400){
						$grid_img.css("background-image", "url("+$grid_img.attr("data-ori-url")+")");					
					}else{
						$grid_img.css("background-image", "url("+$grid_img.attr("data-310-url")+")");
					}
				});
			}else if(mode=='vertical'){
				$stream.find("li .figure.vertical > img").each(function(){
					var $this = $(this);
					$this.attr('src', $this.attr('data-src'));
				})	
			}else if(mode=='normal'){
				$stream.find("li .figure.grid").each(function(){
					var $grid_img = $(this);
					if($grid_img.height()>400){
						$grid_img.css("background-image", "url("+$grid_img.attr("data-ori-url")+")");					
					}else{
						$grid_img.css("background-image", "url("+$grid_img.attr("data-310-url")+")");
					}
				});
			}
			
			if($.browser && $.browser.msie) $.infiniteshow.option('prepare',1000);
			$.cookie.set('timeline-view',mode,9999);
		};

	};
	
	var bottoms = [0,0,0,0];
	function arrange(force_refresh){
		
		var i, c, x, w, h, nh, min, $target, $marker, $first, $img, COL_COUNT, ITEM_WIDTH;

		var ts = new Date().getTime();
		
		$marker = $stream.find('li.page_marker_');

		if(force_refresh || !$marker.length) {
			force_refresh = true;
			bottoms = [0,0,0,0];
			$target = $stream.children('li');
		} else {
			$target = $marker.nextAll('li');
		}

		if(!$target.length) return;

		$first = $target.eq(0);
		$target.eq(-1).addClass('page_marker_');
		$marker.removeClass('page_marker_');
			
		//ITEM_WIDTH  = parseInt($first.width());
		//COL_COUNT   = Math.floor($stream.width()/ITEM_WIDTH);
		ITEM_WIDTH = 247;
		COL_COUNT = 4;
		
		for(i=0,c=$target.length; i < c; i++){
			min = Math.min.apply(Math, bottoms);			

			for(x=0; x < COL_COUNT; x++) if(bottoms[x] == min) break;

			//$li = $target.eq(i);
			$li = $($target[i]);
			$img = $li.find('.figure.vertical > img');
			if(!(nh = $img.attr('data-calcHeight'))){
				w = +$img.attr('data-width');
				h = +$img.attr('data-height');

				if(w && h) {
					//nh = $img.width()/w * h;
					nh = 231/w * h;
					nh = Math.max(nh,150);
					$img.attr('height', nh).data('calcHeight', nh);
				}else{
					nh = $img.height();
				}
				//$li.find("a.button.fancy, a.button.fancyd").css('top', Math.ceil(nh/2)+"px");
			}

			$li.css({top:bottoms[x], left:x*ITEM_WIDTH})
			if(!$li.attr("src")) $li.attr('src', $li.attr('data-src'));
			bottoms[x] = bottoms[x] + nh + 20;
		}
		
		$stream.height(Math.max.apply(Math, bottoms));	
		
	};
	$wrapper.on('arrange', function(){ arrange(true); });

	$notibar = $('.new-content');
	$notibar.off('click').on('click', function(){
		setTimeout(function(){
			$.jStorage.flush();
		    //$.jStorage.deleteKey('fancy.prefetch.stream.new');
		    //$.jStorage.deleteKey('first-'+vid+'-featured.new');
		    //$.jStorage.deleteKey('first-'+vid+'-all.new');
		    //$.jStorage.deleteKey('first-'+vid+'-following.new');
			$stream.trigger('itemloaded');	

			if( $container.hasClass("normal") ){					
				$stream.find("li").each(function(i,v,a){
					var $li = $(this), src_g;
					var $grid_img = $li.find(".figure.grid");

					if($grid_img.height()>400){
						$grid_img.css("background-image", "url("+$grid_img.attr("data-ori-url")+")");
					}else{
						$grid_img.css("background-image", "url("+$grid_img.attr("data-310-url")+")");
					}
				});
			}		
		},100);
	});

	// feed selection
	var $feedtabs = $('.sorting a[data-feed]');	
	var init_ts = $stream.attr("ts");
	var ttl  = 5 * 60 * 1000;

	$feedtabs.click(function(e){
		var $el = $(e.currentTarget);
		var tab = $el.attr("data-feed")||"featured";
		var category = $el.attr("data-category")||"all";
		$('.sorting a.current').html($el.text()+" <i class='arrow'></i><i class='arrow2'></i>");
		$('.sorting .trick').trigger("click");
		switchTab(tab, category);
		e.preventDefault();
	});

	function switchTab(tab, category){
		if(!tab) tab = 'featured';
		if(!category) category = "all";
		$feedtabs.filter(".active").removeClass("active");

		$.jStorage.deleteKey("fancy.prefetch.stream.new");
		
		var $currentTab = $feedtabs.filter("a[data-feed="+tab+"]");
		if(tab=='featured') $currentTab = $currentTab.filter("[data-category="+category+"]");
		
		$currentTab.addClass("active");

		$url = $('a.btn-more').hide();
		$win = $(window);

		var result = null, resultFromCache = false;
		$wrapper.addClass("wait");
		$("#content .recommend-follow").hide();
		// hide notibar if it showing
		$notibar.hide();
		$stream.attr('ts','').data('feed-url', '/user-stream-updates?new&feed='+tab+'&category='+category);
		var loc = tab+"."+category;
		var keys = {
			timestamp : 'fancy.home.timestamp.'+loc,
			stream  : 'fancy.home.stream.'+loc,
			latest  : 'fancy.home.latest.'+loc,
			nextURL : 'fancy.home.nexturl.'+loc
		};

		result = $.jStorage.get('first-'+vid+'-'+tab+'-'+category+'.new');
		

		var swapContent = function(){
			if(!result){
				setTimeout(swapContent,50);
				return;
			}

			if($wrapper.hasClass("swapping")) return;
			$wrapper.addClass("swapping");
			$stream.find(">li").detach();

			$container.removeClass('pattern2 pattern3');			
			if( $container.hasClass("normal") ){
				var patterns = ['','pattern2','pattern3'];
				var pattern = patterns[Math.floor(Math.random()*3)]
				if(pattern){
					$container.addClass(pattern);
				}				
				$stream.find("li").each(function(i,v,a){
					var $li = $(this), src_g;
					var $grid_img = $li.find(".figure.grid");

					if($grid_img.height()>400){
						$grid_img.css("background-image", "url("+$grid_img.attr("data-ori-url")+")");
					}else{
						$grid_img.css("background-image", "url("+$grid_img.attr("data-310-url")+")");
					}
				});
			}

			var $sandbox = $('<div>'),
		    $contentBox = $('#content ol.stream'),
			$next, $rows;

			$sandbox[0].innerHTML = result.replace(/^[\s\S]+<body.+?>|<((?:no)?script|header|nav)[\s\S]+?<\/\1>|<\/body>[\s\S]+$/ig, '');
			$next = $sandbox.find('a.btn-more');
			$rows = $sandbox.find('#content ol.stream > li');
			
			$contentBox.append($rows);
			if(tab=='following' && !$rows.length){
				$("#content .recommend-follow").show();
			}
			if(window.Modernizr && Modernizr.csstransitions )	$rows.css('opacity',0);

			$stream.trigger('itemloaded');

			// get fancyd state if the result comes from cache
			(function(){
				if(!resultFromCache) return;

				var ids = [];
				$rows.each(function(){ 
					var tid = this.getAttribute('tid'); 
					if(tid) ids.push(tid) 
				});

				if(!ids.length) return;

				$.ajax({
					type : 'GET',
					url  : '/user_fancyd_things.json',
					data : {object_ids:ids.join(',')},
					dataType : 'json',
					success : function(json){
						var ids = {};

						$.each(json, function(i,v){ ids[v.object_id] = v.id });
						$rows.each(function(){
							var $this = $(this), btn, rtid;
							if(rtid=ids[this.getAttribute('tid')]) {
								btn = $this.find('a.button.fancy').attr('rtid', rtid).toggleClass('fancy fancyd').get(0);
								if(btn) btn.lastChild.nodeValue = gettext("Fancy'd");
							} else {
								btn = $this.find('a.button.fancyd').removeAttr('rtid').toggleClass('fancy fancyd').get(0);
								if(btn) btn.lastChild.nodeValue = gettext("Fancy");
							}
						});
					}
				});
			})();

			if ($next.length) {
				if(!$url[0]){
					$url = $("<div class='pagination' style='display:none'><a href='' class='btn-more' ts='' ><span>Show more...</span></a>").appendTo($("#content")).find("a.btn-more");
				}

				url = $next.attr('href');
				$url.attr({
					'href' : $next.attr('href'),
					'ts'   : $next.attr('ts')
				});
				$stream.attr("ts",$currentTab.data("ts")||init_ts);
				$(window).trigger("prefetch.infiniteshow");
			} else {
				url = ''
				$url.attr({
					'href' : '',
					'ts'   : ''
				});
			}
			
			var feedName = "Everything";
			if(tab == 'following') feedName = 'Following'
			else if(tab =='recommend') feedName = 'Recommended'
			//else if(tab =='all') feedName = 'Everything'
			if( category && category != 'all'){
				feedName = $feedtabs.filter('[data-category='+category+']').text();
			}

			Fancy.slideshow.reset();

			$wrapper.removeClass("wait");
			$wrapper.removeClass("swapping");
		}

		var done = function(){
			//setTimeout(function(){$('#content ol.stream > li').css('opacity',1)},500);
		}

		
		showLoading();

		if(result){
			resultFromCache = true;
			$stream.trigger("changeloc");
			$wrapper.off('before-fadein').on('before-fadein', swapContent);
			$wrapper.off('after-fadein').on('after-fadein', done);
			$wrapper.trigger("redraw");
		} else {
			$.ajax({
				url : '/?feed='+tab+'&category='+category,
				dataType : 'html',
				success : function(data, st, xhr) {
                    try { track_event('Timeline', { 'type': category == "all" ? tab : category, 'view': $stream.attr('view') }); } catch (e) {}
					result = data;
					$.jStorage.set('first-'+vid+'-'+tab+'-'+category+'.new', result, {TTL:5*60*1000});
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
		
		$.cookie.set('timeline-feed',tab,9999);
		$.cookie.set('timeline-category',category,9999);
	}

	$stream.on('changeloc',function(){
		$stream.attr("loc", ($feedtabs.filter(".active").attr("data-feed")||"featured")+"."+($feedtabs.filter(".active").attr("data-category")||"all") );
	})

	if("vertical"==$stream.attr('view')){
		$wrapper.trigger("arrange");		
	}
	$(window).trigger("prefetch.infiniteshow");
	$(window).unload(function(){
			$.jStorage.flush();
	});

	/*$stream.delegate('.figure-item',"mouseover",function(){
		if ($(this).parents('.timeline').hasClass('classic')==true) {
			$(this).find('.price').css('margin-top',($(this).find('.figure.grid').height()-$(this).find('.figure.grid img').height())/2+'px').css('margin-left',($(this).find('.figure.grid').width()-$(this).find('.figure.grid img').width())/2+'px');
			$(this).find('.share').css('margin-top',($(this).find('.figure.grid').height()-$(this).find('.figure.grid img').height())/2+'px').css('margin-right',($(this).find('.figure.grid').width()-$(this).find('.figure.grid img').width())/2+'px');
		}else{
			$(this)//.find('.figure.grid .back').removeAttr('style').end()
			.find('.price').removeAttr('style').end()
			.find('.figure.grid .share').removeAttr('style');
		}
	});*/

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
})();
