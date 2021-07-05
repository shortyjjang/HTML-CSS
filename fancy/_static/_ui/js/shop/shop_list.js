$(function(){

	// set a flag to check if the stream is restored
	var $stream = $('#content .stream').attr('loc', location.pathname.replace(/\//g, '-').substr(1)), $last;
	$last = $stream.find('>li:last-child');
	$.infiniteshow({itemSelector:'#content .stream > li'});
	$stream.data('restored', $last[0] !== $stream.find('>li:last-child')[0]);
	if(!$stream.find('> li').length) $('div.empty-result').show();
				
	if( $('.search_cate').attr('current_category') ){
		$('.search_cate').find('a[rel=\''+$('.search_cate').attr('current_category')+'\']')
			.addClass('current')
			.parents('li').addClass('open').find('> i').addClass('on').end().find("> ul").show()
	}

	$('.shop .search_keyword input').focus(function(){$(this).parents('dd').find('.ic-search').addClass('on');});
	$('.shop .search_keyword input').blur(function(){if ($(this).val() == '' ){
		$(this).parents('dd').find('.ic-search').removeClass('on');
	}});
	
	$('.search_color a').hover(function(){
		var W = $(this).find('span').width()/2;
		$(this).find('span').css('margin-left',-W-8+'px');
	});
	$('.search_color a').click(function(){
		$(this).toggleClass('checked');
		return false;
	});
	$('.search_cate').delegate('i.opener','click',function(){
		$(this).toggleClass('on').parent().toggleClass('open');
		if($('.search_cate li.open').length<1){
			$(this).parents('dl').removeClass('selected');
		}else {
			$(this).parents('dl').addClass('selected');
		}
		if ($(this).parents('ul').hasClass('trd')==true) {
			$(this).parent('li').find('.last').toggle();
		} else if ($(this).parents('ul').hasClass('scd')==true) {
			$(this).parent('li').find('.trd').toggle();
		}else if ($(this).parents('ul').hasClass('fst')==true) {
			$(this).parent('li').find('.scd').toggle();
		} 
		return false;
	});
	$('#sidebar dl._option > dt').click(function(){
		$(this).parents('dl').toggleClass('close open')
	})

	$('#sidebar dl.search_color a.more').click(function(e){
		$(this).hide().parents('dl').find('li.hidden').removeClass('hidden');
		e.preventDefault();
	})

	$("#content .lists-option .sort > a").click(function(){
		$(this).toggleClass('current');
		$(this).parents(".option").toggleClass("show");
		$("#content .lists-option .sort > ul").toggle();
		return false;
	})

	$("#content .lists-option .trick").click(function(){
		$(this).parents(".option").find('.selector').removeClass('current');
		$(this).parents(".option").removeClass("show");
		$("#content .lists-option .sort > ul").hide();
		return false;
	})

	$('.search_cate').delegate('a','click',function(event){
		event.preventDefault();
		$('.search_cate a.current').removeClass('current');
		$(this).addClass('current');
		var url = $(this).attr('href'), args = $.extend({}, location.args), query;

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	// keyword search
	$('#sidebar .search_keyword input[type=text]')
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
			var hasVal = !!$.trim(this.value);
			$(this).parent().find('.remove').css({opacity:hasVal?1:0}).end()
		})
		.keyup();

	// remove keyword
	$('#sidebar .search_keyword .remove').click(function(event){
	    event.preventDefault();
	    $(this).parent().find('input[type=text]').val('').keyup();
	    $(this).parent().find('.ic-search').removeClass('on');

	    var url = location.pathname, args = $.extend({}, location.args), query;

		event.preventDefault();
		delete args.q;

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	})

	// sort option
    $('.option .sort ul li a').click(function(event){
    	event.preventDefault();
    	$("#content .lists-option .sort > a").trigger('click')

		var sort_by_price = $(this).attr('rel'), url = location.pathname, args = $.extend({}, location.args), query;

		if(sort_by_price){
			args.sort_by_price = sort_by_price;
		} else {
			delete args.sort_by_price;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

    // price range
    $('#sidebar .search_price input[type=radio]').click(function(event){

		var price = $(this).val(), url = location.pathname, args = $.extend({}, location.args), query;

		if(price){
			args.p = price;
		} else {
			delete args.p;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

    // search by color
    $('#sidebar .search_color li a').click(function(event){
    	event.preventDefault();

		var color = $(this).attr('rel'), url = location.pathname, args = $.extend({}, location.args), query;

		if(color && $(this).is('.checked') ){
			args.c = color;
		} else {
			delete args.c;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

    // immediate shipping
    $('#sidebar .search_opt input[name=is]').click(function(event){
    	
		var is = this.checked, url = location.pathname, args = $.extend({}, location.args), query;

		if(is){
			args.is = 'true';
		} else {
			delete args.is;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

    // sameday shipping
    function filterBySamedayShipping(){    	
		var ss = $('#sidebar .search_opt input[name=ss]')[0].checked, areakey = $("input[name=areakey]").val(), url = location.pathname, args = $.extend({}, location.args), query;

		if(ss){
			args.ss = 'true';
			args.areakey = areakey;			
		} else {
			delete args.ss;
			delete args.areakey;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	}
    $('#sidebar .search_opt input[name=ss]').click(function(event){
    	if(this.checked){
    		$('#sidebar .search_opt fieldset').show();
    		if( !$('input[name=areakey]').val() ){
    			$('#search-sameday-zip').focus();
    			return;
    		}    		
    	}else{
    		$('#sidebar .search_opt fieldset').hide();
    	}
    	filterBySamedayShipping();
    	
	});


	function setOptions(params){
		// set priace range
		$('#sidebar .search_price input[type=radio]').removeAttr('checked');
		if(params.p){
			$('#sidebar .search_price input[value='+params.p+']').attr('checked','true');	
		}else{
			$('#sidebar .search_price input[value=-1]').attr('checked','true');	
		}
		
		// set color
		$('#sidebar .search_color li a.checked').removeClass('checked');
		if(params.c) $('#sidebar .search_color li a[rel='+params.c+']').addClass('checked');

		// set sort order
		$('.option .sort ul li').show()
		var $el = $('.option .sort ul li:eq(0) a');
		if(params.sort_by_price) $el = $('.option .sort ul li a[rel='+params.sort_by_price+']')
		$('.option .sort > a.selector span').text( $el.text() );
		$el.parent().hide();



	}

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

		setOptions(location.args);
						
		$.ajax({
			type : 'GET',
			url  : url,
			dataType : 'html',
			success  : function(html){

				setOptions(location.args);
				
				$stream.attr('loc', location.pathname.replace(/\//g, '-').substr(1));

				var $html = $($.trim(html)),
				    $more = $('.pagination > a'),
				    $new_more = $html.find('.pagination > a');
					
				$('.timeline ._category_title').html( $html.find('.timeline ._category_title').html() );
				$('#sidebar .search_cate').html( $html.find('#sidebar .search_cate').html() );
				if( $html.find('.search_cate').attr('current_category') ){
					$('.search_cate').find('a[rel=\''+$html.find('.search_cate').attr('current_category')+'\']')
						.addClass('current')
						.parents('li').addClass('open').find('> i').addClass('on').end().find("> ul").show()
				}
				$('h2.linemap').html( $html.find('h2.linemap').html() );

				$stream.html( $html.find('#content ol.stream').html() );

				if(!$stream.find('> li').length) $('div.empty-result').show();
				else $('div.empty-result').hide();

				if($new_more.length) $('.pagination').append($new_more);
				$more.remove();

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
					$.infiniteshow({itemSelector:'#content .stream > li'});
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

		$stream = $('#content .stream');
		if ($stream.data('restored')) {
			$stream.data('restored', false);
		} else {
			loadPage(event.originalEvent.state.url, true);
		}
	});


	// Search Sameday Area
	var area_cache = {};
	
	var search_area_by_first_3 = function(query) {
		var dfd = new $.Deferred();
		var query_first_3 = query.substr(0, 3);
		var areas    = area_cache[query_first_3];
		if (areas) {
			result = areas.filter(function(x){ return x[x.key].toUpperCase().indexOf(query) >=0 });
			dfd.resolve(result);
		} else {
			var param = {area : query_first_3};
			$.post("/search_sds_area.json", param, function(json) {
				area_cache[query_first_3] = json;
				result = json.filter(function(x){ return x[x.key].toUpperCase().indexOf(query) >=0 });
				dfd.resolve(result);
			}, 'json');
		}
		return dfd.promise();
	};

	var $list = $('.zip-list');
	$list
	.on('key.up key.down', function(event){
		if ($list.is(':hidden')) return false;
		var $items = $list.children('li'), up = (event.namespace=='up'), idx = Math.min(Math.max($items.filter('.on').index()+(up?-1:1),0), $items.length-1);
		var $on = $items.removeClass('on').eq(idx).addClass('on'), bottom;
		if (up) {
			if (this.scrollTop > $on[0].offsetTop) this.scrollTop = $on[0].offsetTop;
		} else {
			bottom = $on[0].offsetTop - this.offsetHeight + $on[0].offsetHeight;
			if (this.scrollTop < bottom) this.scrollTop = bottom;
		}
	})
	.on('mouseover', 'li', function(event){
		event.preventDefault();
		$list.children('li').removeClass('on');
		$(this).addClass('on');
		return false;
	})
	.on('key.enter', function(){
		var $on = $list.children('li.on');
		if ($on.length > 0) {
			$on.click();
		} else {
			$list.children('li').eq(0).click();
		}
	})
	.delegate('li', 'click', function(event){
		event.preventDefault();
		var $li = $(this), area = $li.data();

		if(!area || !area.key){
			return;
		}
		if(area.key=='zipcode'){
			current_area_val = area.zipcode+", "+area.name;
		}else{
			current_area_val = area.name+", "+(area.state?area.state:area.country);
		}
		$('#search-sameday-zip').val(current_area_val);
		$('#search-sameday-zip').attr('_value',area.name);

		$('input[name=areakey]').val(area.area_key);

		$list.hide();

		filterBySamedayShipping();		
	});

	var $inp = $('#search-sameday-zip');	
	var current_area_val;
	var prev_val = '';

	$inp.on({
		changed : function(event) {
			var val =  $inp.val();
			if (val && val.length > 0) {
				$inp.parents('fieldset').find('.remove').show();
			}else{
				$inp.parents('fieldset').find('.remove').hide();
			}
			if (val && val.length > 2) {
				$.when(search_area_by_first_3(val.toUpperCase())).done(function(areas) {
					$list.empty();
					var $htmls = [], html;
					var until = Math.min(areas.length, 10);
					if (until > 0) {
						for(var i=0;i<until;i++) {
							var area = areas[i], $html;
							if (area.key == 'zipcode') {
								$html = $("<li><a href='#'><i class='ic-location'></i><b>" +area.zipcode+ "</b> " +area.name+"</a></li>");
							} else {
								$html = $("<li><a href='#'><i class='ic-location'></i><b>" +area.name+ "</b> " + (area.state ? area.state : area.country) + "</a></li>");
							}
							if (i==0) {
								$html.addClass('on');
							}
							$html.data(area);
							$list.append($html);
						}						
					}
					$list.show();
				});
			} else {
				$list.hide();
			}
		},

		keydown : function(event) {
			setTimeout(function(){var val=$.trim($inp.val());if(val==prev_val)return;prev_val=val;$inp.trigger('changed')}, 10);
			switch(event.keyCode) {
				case 13:
				$list.trigger('key.enter');
				break;
				case 38: $list.trigger('key.up'); return false;
				case 40: $list.trigger('key.down'); return false;
			}
		},

		focus : function(event){
			current_area_val = $('#search-sameday-zip').val();
			//$('#search-sameday-zip').val( $('#search-sameday-zip').attr("_value") );
			setTimeout(function(){$('#search-sameday-zip').select();},100);
		},

		blur : function(event){
			setTimeout(function(){
				$list.hide();
				$('#search-sameday-zip').val( current_area_val );
			},100);
		}
	});
});