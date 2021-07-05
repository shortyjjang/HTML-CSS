$(function(){


	// set a flag to check if the stream is restored
	$('#pop_wrap ._save').click(function(event){
		event.preventDefault();
		var url = location.pathname, cid = $("#pop_wrap .sub-category").val(), args = $.extend({}, location.args), query;
		if(cid){
			args.cid = cid;
		}else{
			delete args.cid;
		}
		if(query = $.param(args)) url += '?'+query;
		closePop('shop-by');

		loadPage(url);
	});
	
	function loadPage(url, skipSaveHistory){
		var $win = $(window), $stream  = $('#content');

		if (!$stream.length) return;

		var $lis     = $stream.find('>dl'),
			scTop    = $win.scrollTop(),
			stTop    = $stream.offset().top,
			winH     = $win.innerHeight(),
			headerH  = $('#header-new').height(),
			useCSS3  = Modernizr.csstransitions,
			firstTop = -1,
			maxDelay = 0,
			begin    = Date.now();

		$('#content').addClass('loading');
		$("#sidebar").removeClass("fixed fixedTop").removeAttr('style');
		
		if(useCSS3){
			$stream.addClass('use-css3').removeClass('fadein').parents('#content').addClass('loading');

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

		$.ajax({
			type : 'GET',
			url  : url,
			dataType : 'html',
			success  : function(html){
				
				$stream.attr('loc', location.pathname.replace(/\//g, '-').substr(1));

				var $html = $($.trim(html));
					
				
				$stream.html( $html.find('#content').html() );

				$('#content').removeClass('loading');
				
				(function(){
					if(useCSS3 && (Date.now() - begin < maxDelay+300)){
						return setTimeout(arguments.callee, 50);
					}

					$stream.addClass('fadein').html( $html.find('#content').html() );
					if(!$stream.find("dl.wrap").length){
						$stream.find(".empty-result").show();
					}else{
						$stream.find(".empty-result").hide();
					}
					
					if(useCSS3){
						$win.scrollTop(scTop);
						scTop = $win.scrollTop();
						stTop = $stream.offset().top;
						
						firstTop = -1;
						$stream.find('>dl').each(function(i,v){
							if(!inViewport(v)) return;
							if(firstTop < 0) firstTop = v.offsetTop;
							
							var delay = Math.round(Math.sqrt(Math.pow(v.offsetTop - firstTop, 2)+Math.pow(v.offsetLeft, 2)));
							
							v.className += ' anim';
							setTimeout(function(){ v.className += ' fadein'; }, delay+10);
							
							if(delay > maxDelay) maxDelay = delay;
						});

						setTimeout(function(){ $stream.removeClass('use-css3 fadein').find('dl.anim').removeClass('anim fadein').parents('#content').removeClass('loading'); }, maxDelay+300);
					}

					$win.scrollTop(0).trigger('scroll');
				})();
			}
		});

		function inViewport(el){
			return (stTop + el.offsetTop + el.offsetHeight > scTop + headerH) && (stTop + el.offsetTop < scTop + winH);
		};
	};


});