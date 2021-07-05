var area_cache = {};

$(document).ready(function() {
	$('.sameday-cities dt a').click(function(e){
		e.preventDefault();
		$(this).parents('dl').toggleClass('show');
		return false;
	});

    var search_area_by_first_3 = function(query) {
		var dfd = new $.Deferred();
		var query_first_3 = query.substr(0, 3);
		var areas    = area_cache[query_first_3];
		if (areas) {
		    result = areas.filter(function(x){ return x[x.key].toUpperCase().indexOf(query) >=0 });
		    dfd.resolve(result);
		} else {
		    var param = {area : query_first_3};
		    $.get("/search_sds_area.json", param, function(json) {
				area_cache[query_first_3] = json;
				result = json.filter(function(x){ return x[x.key].toUpperCase().indexOf(query) >=0 });
				dfd.resolve(result);	    
		    }, 'json');
		}
		return dfd.promise();
    }

    var $list = $('.search-list');

	var open_result_page = function(area) {
		window.location.replace(area.url);
		return false;
    }

    $list       
        .delegate('li', 'click', function(event){
	    	event.preventDefault();
            var $li = $(this), area = $li.data();
	    	return open_result_page(area);
        });

    var $inp = $('#search-sameday-zip');
    var prev_val = '';

    $inp.bind("propertychange keyup input paste", function(event) {
		    var val =  $inp.val();
		    if (val && val.length > 2) {
				$.when(search_area_by_first_3(val.toUpperCase())).done(function(areas) {
				    $list.find("li").remove();
				    var $htmls = [], html;
				    var until = Math.min(areas.length, 10);
				    if (until > 0) {
						for(var i=0;i<until;i++) {
						    var area = areas[i], $html;
						    if (area.key == 'zipcode') {
								$html = $("<li><a href='#'><span class='sameday_location'></span>" +area.zipcode+ " <small>" +area.name+"</small></a></li>");
						    } else {
								$html = $("<li><a href='#'><span class='sameday_location'></span>" +area.name+ " <small>" + (area.state ? area.state : area.country) + "</small></a></li>");
						    }
						    if (i==0) {
								$html.addClass('on');
						    }
						    $html.data(area);
						    $list.find("ul").append($html);
						}
				    }
					$list.show();
					$("#content .search-city").nextAll(".wrap").hide();
				});
		    } else {
				$list.hide();
				$("#content .search-city").nextAll(".wrap._index").show();
		    }
		}
    );

	$(".search-city a.del").click(function(e){
		e.preventDefault();
		$inp.val("");
		$list.find("li").remove().end().hide();		
		$("#content .search-city").nextAll(".wrap._index").show();
	});

	$(".search-city button.btn-blue").click(function(e){
		if( $inp.val() && $(".search-list").is(":hidden"))
			window.location.replace("/same-day-delivery/"+$inp.val());
	})

	$("a.more").click(function(e){
		e.preventDefault();
		$("#content .wrap").hide();
		$("#content .wrap._all").show();
		history.pushState({'view_sds_cities':true});
	})


	$(window).on('popstate', function(e){
		if( $("#content .wrap._all").is(":visible") ) {			
			$(".search-city a.del").trigger("click");
			$("#content .wrap").show();
			$("#content .wrap._all").hide();
			e.preventDefault();
		}
	});

    var $wrapper = $('.wrap.sameday-list');

	$("#check_sale").change(function(){
		$(this).parents('.switch-filter').toggleClass('on');
		$('.select-filter dd').toggle();

		var url = location.pathname, args = $.extend({}, location.args), query;
		if(!this.checked){
			delete args.p;
			delete args.c;
			delete args.order_by;
            delete args.b;
		}
		if(query = $.param(args)) url += '?'+query;
		loadPage(url);
	})

	$wrapper.delegate(".category","change", function(){
		var cid = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(cid != "-1"){
			args.cid = cid;
		} else {
			delete args.p;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	$(".select-filter .price-range").change(function(){
		var range = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(range != '-1'){
			args.p = range;
		} else {
			delete args.p;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	$(".select-filter .color-filter").change(function(){
		var color = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(color){
			args.c = color;
		} else {
			delete args.c;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});
    
    $(".select-filter .sort-by-price").change(function(){
		var order_by = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(order_by){
			args.order_by = order_by;
		} else {
			delete args.order_by;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

    $(".select-filter .brand").change(function () {
        var brand = this.value, url = location.pathname, args = $.extend({}, location.args), query;

        if (brand) {
            args.b = brand;
        } else {
            delete args.b;
        }

        if (query = $.param(args)) url += '?' + query;

        loadPage(url);
    });

    var loadPage = function(url, skipSaveHistory){

		var $win = $(window), $stream  = $('#content ul.stream');
		if (!$stream.length) return;

		var $lis     = $stream.find('>li'),
		scTop    = $win.scrollTop(),
		stTop    = $stream.offset().top,
		winH     = $win.innerHeight(),
		headerH  = $('#header').height(),
		firstTop = -1,
		maxDelay = 0,
		begin    = Date.now();

	    $stream.addClass('use-css3').removeClass('fadein');

	    $lis.each(function(i,v){

			if(!inViewport(v)) return;
			if(firstTop < 0) firstTop = v.offsetTop;

			var delay = Math.round(Math.sqrt(Math.pow(v.offsetTop - firstTop, 2)+Math.pow(v.offsetLeft, 2)));

			v.className += ' anim';
			setTimeout(function(){ v.className += ' fadeout'; }, delay+10);

			if(delay > maxDelay) maxDelay = delay;
	    });

		if(!skipSaveHistory && window.history && history.pushState){
		    history.pushState({url:url}, document.title, url);
		}

		location.args = $.parseString(location.search.substr(1));
		
		$.ajax({
		    type : 'GET',
		    url  : url,
		    dataType : 'html',
		    success  : function(html){
				var $html = $($.trim(html));
				//$('div.search-result').removeClass().attr('class', $html.find('div.search-result').attr('class'));
				
				$('div.pagination').html($html.find('div.pagination').html()||"");
				$('p.no-result').remove();
				$html.find('p.no-result').insertBefore( $("ul.stream") );				
				$('div.sameday-list h2.tit').html( $html.find('div.sameday-list h2.tit').html() );
				$('dl.sameday_result dt').html( $html.find('dl.sameday_result dt').html() );

				(function(){
				    if( (Date.now() - begin < maxDelay+300)){
						return setTimeout(arguments.callee, 50);
				    }

				    $stream.addClass('fadein').html( $html.find('#content ul.stream').html() );
				    
			    	$win.scrollTop();
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
			    
				    // reset infiniteshow
				    $.infiniteshow({itemSelector:'#content .stream > .stream-item'});
				    $win.trigger('scroll');
				})();
		    }
		});

		function inViewport(el){
		    return (stTop + el.offsetTop + el.offsetHeight > scTop + headerH) && (stTop + el.offsetTop < scTop + winH);
		};	
    };
});


// try native app for this page
(function(){
	var p = navigator.platform, iOS = p&&/^iP(ad|hone|od)$/.test(p), Android = !iOS&&/android/i.test(navigator.userAgent);
	if(iOS || Android) {
	    var domain = document.referrer ? document.referrer.split('/')[2] : '';
        if(!domain || !/m\.fancy\.com$/i.test(domain)){
        	try {location.href='fancy:/'+location.pathname; }catch(e){};	
        }
	}
})();
