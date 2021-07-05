$(function(){

	
	$("#content").removeClass("loading");
	// Old category select
	$('.product .category .menu_slide').delegate('a','click',function(event){
		event.preventDefault();
		$('.category a.current').removeClass('current');
		$(this).addClass('current');
		var url = $(this).attr('href'), cid = $(this).attr('rel'), args = $.extend({}, location.args), query;
		if( typeof cid != 'undefined' ){
			url = location.pathname;
			if(cid){
				args.cid = cid;
			}else{
				delete args.cid;
			}
		}
		if( $(".product .category").is("[browse]") ) args.browse = '';

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});
	// New category select
	$('#refine-by-category').on('change', function(event){
		event.preventDefault();
		var url = '', cid = $(this).val(), args = $.extend({}, location.args), query;
		if( typeof cid != 'undefined' ){
			url = location.pathname;
			if(cid){
				args.cid = cid;
			}else{
				delete args.cid;
			}
		}
		//if( $(".product .category").is("[browse]") ) args.browse = '';

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	$('.brand').delegate('ul a','click',function(event){
		event.preventDefault();
		$('.brand a.current').removeClass('current');
		$(this).addClass('current');
		var bid = $(this).attr('rel'), url = location.pathname, args = $.extend({}, location.args), query;
		if(bid){
			args.b = bid;
		}else{
			delete args.b;
		}
		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	// keyword search
	$('#sidebar .keyword input[type=text]')
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
	$('#sidebar .keyword .remove').click(function(event){
	    event.preventDefault();
	    $(this).parent().find('input[type=text]').val('').keyup();	    

	    var url = location.pathname, args = $.extend({}, location.args), query;

		event.preventDefault();
		delete args.q;

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	})

    // discount range
    $('#sidebar .sales ul li input[name=sales]').click(function(event){
    	event.preventDefault();

		var discount_range = $(this).val(), url = location.pathname, args = $.extend({}, location.args), query;

		$('#sidebar .sales li.selected').removeClass("selected");
		if(discount_range && args.discount != discount_range){
			args.discount = discount_range;			
			$(this).closest("li").addClass("selected");		
		} else {
			delete args.discount;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});


    // discount range
    $('#sidebar .sales .selector > a').click(function(event){
    	event.preventDefault();

		var discount_range = $(this).hasClass('selected')?'':'1-100', url = location.pathname, args = $.extend({}, location.args), query, label = $(this).find('option:selected').html();

		if(discount_range){
			args.discount = discount_range;
			$(this).addClass('selected');
		} else {
			$(this).removeClass('selected');
			delete args.discount;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	// sort option
    $('.sort ul li [name=sort]').change(function(event){
    	event.preventDefault();
    	
		var sort_by_price = $(this).val(), url = location.pathname, args = $.extend({}, location.args), query;

		$('#sidebar .sort li.selected').removeClass("selected");
		$(this).closest("li").addClass("selected");
		if(sort_by_price){
			args.order_by = sort_by_price;
		} else {
			delete args.order_by;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

    $('#sort-by').change(function(event){
    	event.preventDefault();
    	
		var sort_by_price = $(this).val(), url = location.pathname, args = $.extend({}, location.args), query;

		var sortName = $(this).find('option:selected').text();
    $('.sort-by-display').text(sortName);

		if(sort_by_price){
			args.order_by = sort_by_price;
		} else {
			delete args.order_by;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

    // price range
    $('#sidebar .price input[type=radio]').click(function(event){

		var price = $(this).val(), url = location.pathname, args = $.extend({}, location.args), query;

		$('#sidebar .price li.selected').removeClass("selected");
		if(price && args.p != price){
			args.p = price;
			$(this).closest("li").addClass("selected");
		} else {
			delete args.p;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

    // price range
    $('#sidebar .price button.btn-apply').click(function(event){

		var min_price = $(this).parent().find("input[name=min_price]").val(), max_price = $(this).parent().find("input[name=max_price]").val(), url = location.pathname, args = $.extend({}, location.args), query;

		$('#sidebar .price li.selected').removeClass("selected");

		if(min_price || max_price){
			var price = min_price+"-"+max_price;
			args.p = price;
			$('#sidebar .price li:last').addClass("selected");
		}else{
			delete args.p;
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


    // search by color
    $('#sidebar .color li input[type=checkbox]').click(function(event){
    	event.preventDefault();
    	event.stopPropagation();

		var color = $(this).val(), url = location.pathname, args = $.extend({}, location.args), query;

		$('#sidebar .color li.checked').removeClass('checked');
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
	$('#sidebar .color').delegate('li.checked', 'click', function(event){

		var url = location.pathname, args = $.extend({}, location.args), query;

		$('#sidebar .color li.checked').removeClass('checked');
		delete args.c;

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});


    // fancyd 
    $('#sidebar input[name=fancyd]').change(function(event){

    	if( $(this).attr('require_login') ){
    		require_login();
    		return;
    	}
    	
		var is = this.checked, url = location.pathname, args = $.extend({}, location.args), query;

		if(is){
			args.fancyd = 'true';
			$(this).closest("li").addClass("selected");
		} else {
			delete args.fancyd;
			$(this).closest("li").removeClass("selected");
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

    // wanted 
    $('#sidebar input[name=wanted]').change(function(event){
    	
    	if( $(this).attr('require_login') ){
    		require_login();
    		return;
    	}

		var is = this.checked, url = location.pathname, args = $.extend({}, location.args), query;

		if(is){
			args.wanted = 'true';
			$(this).closest("li").addClass("selected");
		} else {
			delete args.wanted;
			$(this).closest("li").removeClass("selected");
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});


    // intl_shipping 
    $('#sidebar input[name=ship_intl]').change(function(event){
    	
		var is = this.checked, url = location.pathname, args = $.extend({}, location.args), query;

		if(is){
			args.intl = 'true';
			$(this).closest("li").addClass("selected");
			if(args.usonly){
				delete args.usonly;
				$('#sidebar input[name=ship_us]').removeAttr('checked').closest("li").removeClass("selected");
			}
		} else {
			delete args.intl;
			$(this).closest("li").removeClass("selected");
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

    // us_shipping 
    $('#sidebar input[name=ship_us]').change(function(event){
    	
		var is = this.checked, url = location.pathname, args = $.extend({}, location.args), query;

		if(is){
			args.usonly = 'true';
			$(this).closest("li").addClass("selected");
			if(args.intl){
				delete args.intl;
				$('#sidebar input[name=ship_intl]').removeAttr('checked').closest("li").removeClass("selected");
			}
		} else {
			delete args.usonly;
			$(this).closest("li").removeClass("selected");
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

    // immediate shipping
    $('#sidebar .option input[name=is]').change(function(event){
    	
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

    // sameday shipping
    function filterBySamedayShipping(){    	
		var ss = $('#sidebar .option input[name=ss]')[0].checked, areakey = $("input[name=areakey]").val(), url = location.pathname, args = $.extend({}, location.args), query;

		if(ss){
			args.ss = 'true';
			args.areakey = areakey;
			$('#sidebar .option input[name=ss]').closest("li").addClass("selected");
		} else {
			delete args.ss;
			delete args.areakey;
			$('#sidebar .option input[name=ss]').closest("li").removeClass("selected").parent().next("fieldset").hide();
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	}
    $('#sidebar .option input[name=ss]').change(function(event){
    	if(this.checked){
    		$(this).closest("li").addClass("selected").parent().next("fieldset").show();
    		if( !$('input[name=areakey]').val() ){
    			$('#search-sameday-zip').focus();
    			return;
    		}    		
    	}else{
    		$(this).closest("li").removeClass("selected").parent().next("fieldset").hide();
    	}
    	filterBySamedayShipping();
    	
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
		$('#infscr-loading').hide();
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

				var $html = $($.trim(html)),
				    $more = $('.pagination > a'),
				    $new_more = $html.find('.pagination > a');
					
				
				$stream.html( $html.find('#content ol.stream').html() || '' );

				$('#content').removeClass('loading');
				if(!$stream.find('> li').length) $('div.empty').show();
				else $('div.empty').hide();

				var $mixpanel = $html.filter('script#mixpanel_script');
                if ($mixpanel) $.globalEval($mixpanel.html()); 

				var $category = $html.find("#sidebar .cate.category");
				var $current_category = $("#sidebar .cate.category");
				var new_title = $category.find(">dt a").text(); 
				var current_title = $current_category.find(">dt a").text(); 
				var new_path = $category.find(">dt a").attr('href');
				var current_path = $current_category.find(">dt a").attr('href');
				new_path = new_path?new_path.replace("/browse",''):'';
				current_path = current_path?current_path.replace("/browse",''):'';
				if(current_path != new_path){
					$current_category.find("> dt").html( $category.find("> dt").html());
					
					if( $current_category.find("> dt a").length )
						$current_category.find("a.btn-reset").show();
					else
						$current_category.find("a.btn-reset").hide();

					if( current_path.split("/").length < new_path.split("/").length){
						$current_category.find("ul").after( $category.find("ul").parent().html());

						if(new_title!=current_title){
							$current_category.find(".menu_slide").animate({left:'-'+$current_category.find("ul:last").width()+'px', height: ($current_category.find('ul:last').height()+10)+'px'}, 250, 'linear', function(){
								$current_category.find("ul:first").remove();
								$current_category.find(".menu_slide").css({left:0});
							});	
						}else{
							$current_category.find("ul:first").remove();
						}
						
					}else if( current_path.split("/").length > new_path.split("/").length){
						$current_category.find("ul").before( $category.find("ul").parent().html());
						if(new_title!=current_title){
							$current_category.find(".menu_slide").css({left:'-'+$current_category.find("ul:last").width()+'px'});
							$current_category.find(".menu_slide").animate({left:'0', height: ($current_category.find('ul:first').height()+10)+'px'}, 250, 'linear', function(){
								$current_category.find("ul:last").remove();
							});
						}else{
							$current_category.find("ul:last").remove();
						}
					}	
				}
				
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
					$.infiniteshow({itemSelector:'#content .stream > li', 
						post_callback:function(){ 
							try{show3cols();}catch(e){}
						}
					});

					try{show3cols(true);}catch(e){}
					$("#sidebar").removeClass("fixed").removeClass("fixedBottom");
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

	$('.recommend-lists-toggle').click(function(e) {
		e.preventDefault();
		var $ul = $(this).closest('.wrapper').find('.stores');
		if ($ul.hasClass('show-fold')) {
			$ul.removeClass('show-fold');
			$(this).text('See More');
		} else {
			$ul.addClass('show-fold');
			$(this).text('See Less');
		}
	});
	window.searchLoadPage = loadPage;
});
