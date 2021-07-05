$(function(){

	// set a flag to check if the stream is restored
	var $stream = $('#content .stream').attr('loc', location.pathname.replace(/\//g, '-').substr(1)), $last;
	$last = $stream.find('>li:last-child');
	$.infiniteshow({itemSelector:'#content .stream > li'});
	$("#content").removeClass("loading");
	
	$stream.data('restored', $last[0] !== $stream.find('>li:last-child')[0]);
	if(!$stream.find('> li').length) $('div.empty-result').show();
				
	$('#sidebar .categories').delegate('ul a.title','click',function(event){
		event.preventDefault();
		var url = $(this).attr('href'), args = $.extend({}, location.args), query;

		if(query = $.param(args)) url += '&'+query;

		loadPage(url);
	});

	$('#content .sub-menu').delegate('ul.menu a','click',function(event){
		event.preventDefault();

    	var url = $(this).attr('href'), args = $.extend({}, location.args), query;

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	$('#content .breadcrumb').delegate('a','click',function(event){
		event.preventDefault();

    	var url = $(this).attr('href'), args = $.extend({}, location.args), query;

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	// keyword search
	$('.refine_menu .keyword input[type=text]')
		.hotkey('ENTER', function(event){
			var q = $.trim(this.value), url = location.pathname, args = $.extend({}, location.args), query;

			event.preventDefault();

			if(q) {
				args.q = q;
			} else {
				delete args.q;
			}

			if(query = $.param(args)) url += '?'+query;

			loadPage(url);
		})
		.keyup(function(){
			var hasVal = !!$(this).val().replace("Filter by keyword","");
			$(this).parent().find('.remove').css({opacity:hasVal?1:0}).end()
		})
		.keyup();

	// remove keyword
	$('.refine_menu .keyword .remove').click(function(event){
	    event.preventDefault();
	    $(this).parent().find('input[type=text]').val('').keyup();	    

	    var url = location.pathname, args = $.extend({}, location.args), query;

		event.preventDefault();
		delete args.q;

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	})

	// search by color
    $('.refine_menu .color li input[type=checkbox]').click(function(event){
    	event.preventDefault();
    	event.stopPropagation();

		var color = $(this).val(), url = location.pathname, args = $.extend({}, location.args), query;

		$('.refine_menu .color li.checked').removeClass('checked');
		if(color && $(this).is(':checked') ){			
			args.c = color;
			$(this).closest("li").addClass("checked");
		} else {
			delete args.c;
			$(this).closest("li").removeClass("checked");
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});
	$('.refine_menu .color').delegate('li.checked', 'click', function(event){

		var url = location.pathname, args = $.extend({}, location.args), query;

		$('.refine_menu .color li.checked').removeClass('checked');
		delete args.c;

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});


    // intl_shipping 
    $('.refine_menu select[name=ship_intl]').change(function(event){
    	
		var val = $(this).val(), url = location.pathname, args = $.extend({}, location.args), query;

		var is = (val == "ship_intl");
		var us = (val == "ship_us");

		if(is){
			args.intl = 'true';
			if(args.usonly){
				delete args.usonly;
			}
		} else {
			args.usonly = 'true';
			if(args.intl){
				delete args.intl;
			}
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	}); 

    // immediate shipping
    $('.refine_menu .option input[name=is]').change(function(event){
    	
		var is = this.checked, url = location.pathname, args = $.extend({}, location.args), query;

		if(is){
			args.is = 'true';
			$(this).closest("li").addClass("selected");
		} else {
			delete args.is;
			$(this).closest("li").removeClass("selected");
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	$('.refine_menu .gender input[name=rg]').click(function(){
		var gender = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		$('.refine_menu .gender li.selected').removeClass("selected");		

		if(gender && gender != args.rg){
			args.rg = gender;
			$(this).closest("li").addClass("selected");			
		} else {
			delete args.rg;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	$( "#slider-range" ).slider({
		range: true,
		min: 0,
		max: 1000,
		step: 10,
		values: [ parseInt($( ".price .amount .min" ).text()), parseInt($( ".price .amount .max" ).text()) ],
		slide: function( event, ui ) {
			if(ui.values[1]-ui.values[0] < 10) return false;;
			$( ".price .amount .min" ).text( ui.values[ 0 ] || 1);
			$( ".price .amount .max" ).text( ui.values[ 1 ] + (ui.values[1]==1000?"+":""));			
		},
		change: function( event, ui ) {
			var min_price = ui.values[ 0 ], max_price = ui.values[ 1 ], url = location.pathname, args = $.extend({}, location.args), query;

			if(max_price==1000) max_price="";
			if(max_price && !min_price) min_price = "1"

			if(min_price || max_price){				
				var price = min_price+"-"+max_price;
				args.p = price;
			}else{
				delete args.p;
			}

			if(query = $.param(args)) url += '?'+query;

			loadPage(url);
		}
	});

	function loadPage(url, skipSaveHistory){
		var $win = $(window), $stream  = $('#content ol.stream');

		if (!$stream.length) return;

		var $lis     = $stream.find('>li'),
			scTop    = $win.scrollTop(),
			stTop    = $stream.offset().top,
			winH     = $win.innerHeight(),
			headerH  = $('#header-new').height(),
			useCSS3  = Modernizr.csstransitions,
			firstTop = -1,
			maxDelay = 0,
			begin    = Date.now();

		$('#content').addClass('loading');
		$stream.css('height','');
		$('div.empty-result').hide();
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

		$.infiniteshow.option('disabled', true);

		$.ajax({
			type : 'GET',
			url  : url,
			dataType : 'html',
			success  : function(html){
				
				$stream.attr('loc', location.pathname.replace(/\//g, '-').substr(1));

				var $html = $($.trim(html)),
				    $more = $('.pagination > a'),
				    $new_more = $html.find('.pagination > a');
					
				
				$stream.html( $html.find('#content ol.stream').html() );
				$(".filter div.breadcrumb").html( $html.find(".filter div.breadcrumb").html() );
				//if( $(".filter div.breadcrumb a").length ) $(".filter div.breadcrumb").show()
				//else $(".filter div.breadcrumb").hide();

				$(".filter ul.menu").html( $html.find(".filter ul.menu").html() );
				if( $html.find(".filter ul.menu").css('display')!='none'){
					if( $(".filter ul.menu li").length ) $(".filter ul.menu").show()
					else $(".filter ul.menu").hide();	
				}else{
					$(".filter ul.menu").hide();
				}
				
			
				$('#content').removeClass('loading');
				if(!$stream.find('> li').length) $('div.empty-result').show();
				else $('div.empty-result').hide();

				if($new_more.length) $('.pagination').append($new_more);
				$more.remove();

                var $mixpanel = $html.filter('script#mixpanel_script');
                if ($mixpanel) $.globalEval($mixpanel.html()); 


				(function(){
					if(useCSS3 && (Date.now() - begin < maxDelay+300)){
						return setTimeout(arguments.callee, 50);
					}

					$stream.addClass('fadein').html( $html.find('#content ol.stream').html() );
					
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

						setTimeout(function(){ $stream.removeClass('use-css3 fadein').find('li.anim').removeClass('anim fadein').parents('#content').removeClass('loading'); }, maxDelay+300);
					}

					// reset infiniteshow
					$.infiniteshow({itemSelector:'#content .stream > li', disabled:false});
					$win.scrollTop(0).trigger('scroll');
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

		$stream = $('#content .stream');
		if ($stream.data('restored')) {
			$stream.data('restored', false);
		} else {
			loadPage(event.originalEvent.state.url, true);
		}
	});

});
