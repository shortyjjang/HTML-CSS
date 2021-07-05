$(function(){

	// set a flag to check if the stream is restored
	var $stream = $('#content .stream').attr('loc', location.pathname.replace(/\//g, '-').substr(1)), $last;
	$last = $stream.find('>li:last-child');
	$.infiniteshow({itemSelector:'#content .stream > li', 
					post_callback:function(){ 
						if ($('.wrapper-content').hasClass('refine')) {
							show3cols();
						}
						else {
							show4cols();
						}
					}});
	if ($('.wrapper-content').hasClass('refine')) {
		show3cols(true);
	}
	else {
		show4cols(true);
	}
	$("#content").removeClass("loading");
	
	$stream.data('restored', $last[0] !== $stream.find('>li:last-child')[0]);
	if(!$stream.find('> li').length) $('div.empty-result').show();
				
	$('.product .category').delegate('a','click',function(event){
		if ($(this).hasClass('more')) return;

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

	$('#sidebar .gender ul li input[name=rg]').click(function(){
		var gender = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		$('#sidebar .gender li.selected').removeClass("selected");		

		if(gender && gender != args.rg){
			args.rg = gender;
			$(this).closest("li").addClass("selected");			
		} else {
			delete args.rg;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	// sort option
    $('#sidebar .sort ul li input[name=sort]').change(function(event){
    	event.preventDefault();
    	
		var sort_by_price = $(this).val(), url = location.pathname, args = $.extend({}, location.args), query;

		$('#sidebar .sort li.selected').removeClass("selected");
		$(this).closest("li").addClass("selected");
		if(sort_by_price){
			args.sort_by_price = sort_by_price;
		} else {
			delete args.sort_by_price;
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
		max: $( ".price .amount .max" ).text(),
		values: [ parseInt($( ".price .amount .min" ).text()), parseInt($( ".price .amount .max" ).text()) ],
		slide: function( event, ui ) {
			$( ".price .amount .min" ).text( ui.values[ 0 ] );
			$( ".price .amount .max" ).text( ui.values[ 1 ] );			
		},
		change: function( event, ui ) {
			var min_price = ui.values[ 0 ], max_price = ui.values[ 1 ], url = location.pathname, args = $.extend({}, location.args), query;

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
    /*$('#sidebar input[name=fancyd]').change(function(event){

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
	});*/

    // wanted 
    /* $('#sidebar input[name=wanted]').change(function(event){
    	
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
	}); */

    // intl_shipping 
    $('#sidebar select[name=ship_intl]').change(function(event){
    	
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
					
				
				$stream.html( $html.find('#content ol.stream').html() );
				$("div.linemap").html( $html.find("div.linemap").html() );

				$('#content').removeClass('loading');
				if(!$stream.find('> li').length) $('div.empty-result').show();
				else $('div.empty-result').hide();

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
							if ($('.wrapper-content').hasClass('refine')) {
								show3cols();
							}
							else {
								show4cols();
							}
						}
					});

					if ($('.wrapper-content').hasClass('refine')) {
						show3cols(true);
					}
					else {
						show4cols(true);
					}
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

	var code = null;

	$('.search .sub-category').change(function(){
		var $this = $(this), url = this.value, text = $this.find('>option').eq(this.selectedIndex).text(),issibling = $this.find('>option').eq(this.selectedIndex).hasClass('sibling');

        if (issibling)
		    $('ul.breadcrumbs').find('.last').remove();
		$('ul.breadcrumbs').append('<li class="last">/ <a href="#">'+text+'</a></li>');

		if(url) loadPage(url);
	});

	/* $('.search .price-range').change(function(){
		var range = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(range != '-1'){
			args.p = range;
		} else {
			delete args.p;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	}); */

	/* $('.search .color-filter').change(function(){
		var color = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(color){
			args.c = color;
		} else {
			delete args.c;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	}); */
    
    $('.search .sort-by-price').change(function(){
		var sort_by_price = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(sort_by_price){
			args.sort_by_price = sort_by_price;
		} else {
			delete args.sort_by_price;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});
	
	$( "#slider-range" ).slider({
		range: true,
		min: 0,
		max: $( ".price .amount .max" ).text(),
		values: [ $( ".price .amount .min" ).text(), $( ".price .amount .max" ).text() ],
		slide: function( event, ui ) {
			$( ".price .amount .min" ).text( ui.values[ 0 ] );
			$( ".price .amount .max" ).text( ui.values[ 1 ] );
			var min_price = $(this).parent().find(".price .min").val(), max_price = $(this).parent().find(".price .max").val(), url = location.pathname, args = $.extend({}, location.args), query;

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

	$( ".price .amount .min" ).text( $( "#slider-range" ).slider( "values", 0 ) );
	$( ".price .amount .max" ).text( $( "#slider-range" ).slider( "values", 1 ) );

     $('.relationship').change(function(){
		var relationship = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(relationship){
			args.rel = relationship;
		} else {
			delete args.rel;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});
/*
	$('.search .se-gender').change(function(){
		var gender = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(gender){
			args.sg = gender;
		} else {
			delete args.sg;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	$('.search .re-gender').change(function(){
		var gender = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(gender){
			args.rg = gender;
		} else {
			delete args.rg;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	}); */
    $('#immediateShipping').change(function(){
        var v = this.value, url = location.pathname, args = $.extend({}, location.args), query;

        //if (this.checked) {
        //    args.is = v;
        //    $(this).closest('label').addClass('on');
        //} else {
        //    delete args.is;
        //    $(this).closest('label').removeClass('on');
        //}
        if ($(this).closest('label').hasClass('on')) {
            delete args.is;
            $(this).closest('label').removeClass('on');
        } else {
            args.is = v;
            $(this).closest('label').addClass('on');
        }

        if(query = $.param(args)) url += '?'+query;

        loadPage(url);
    });


	$('.search .search-string')
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
			$(this).parent()
				.find('.del-val').css({opacity:hasVal?1:0}).end()
				.find('.label').css({opacity:hasVal?0:1});
		})
		.keyup();

	$('.search .filter-age')
		.hotkey('ENTER', function(event){
			var ra = $.trim(this.value), url = location.pathname, args = $.extend({}, location.args), query;

			event.preventDefault();

			if(ra) {
				args.ra = ra;
			} else {
				delete args.ra;
			}

			if(query = $.param(args)) url += '?'+query;

			loadPage(url);
		})
		.keyup(function(){
			var hasVal = !!$.trim(this.value);
			$(this).parent()
				.find('.del-val').css({opacity:hasVal?1:0}).end()
				.find('.label').css({opacity:hasVal?0:1});
		})
		.keyup();

	$('.search-frm .del-val').click(function(event){
	    event.preventDefault();
	    $(this).next('.search-string').val('').keyup();
	    var $age = $(this).next('.filter-age');
	    if ($age.length > 0) {
		    $age.val('').keyup();
	    }
	});

	$('ul.breadcrumbs').on('click', 'a', function(event){
		event.preventDefault();
		$(this).closest('li').nextAll('li').remove();
		loadPage(this.getAttribute('href'));
	});

	var $select = $('.shop div.outside select,.shop .search-frm select');
	$select.selectBox();
	$select.each(function(){
		var $this = $(this);
		if($this.css('display') != 'none') $this.css('visibility', 'visible');
	});
	
	// color palette
	$('.color-filter-selectBox-dropdown-menu')
		.addClass('palette')
		.find('>li >a').each(function(){
			var $this = $(this), color = $this.attr('rel');

			if(!color) return;
			$this.prepend('<i class="color '+color+'" /> ');
		});
 
  	// set a flag to check if the stream is restored
	(function(){
		var $stream = $('#content .stream').attr('loc', (location.pathname.replace(/\//g, '-')+location.search).substr(1)), $last;

		$last = $stream.find('>li:last-child');
		$.infiniteshow({itemSelector:'#content .stream > li',dataKey:'shop'});
	})();

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
						
		$.ajax({
			type : 'GET',
			url  : url,
			dataType : 'html',
			success  : function(html){
				$('.price-range').selectBox('value', location.args.p || '-1');
				$('.relationship').selectBox('value', location.args.rel || '');
				$('.color-filter').selectBox('value', location.args.c || '');
				$('.sort-by-price').selectBox('value', location.args.sort_by_price || '');
				$('.se-gender').selectBox('value', location.args.sg || '');
				$('.re-gender').selectBox('value', location.args.rg || '');
				$('.filter-age').val(location.args.ra || '').keyup();
				$('.search-string').val(location.args.q || '').keyup();
                if(location.args.is){
                    $('#immediateShipping').closest('label').addClass('on')
                }
                else{
                    $('#immediateShipping').closest('label').removeClass('on')
                }

				$stream.attr('loc', (location.pathname.replace(/\//g, '-')+location.search).substr(1));

				var $html = $($.trim(html)),
				    $more = $('.pagination > a'),
				    $new_more = $html.find('.pagination > a'),
					$cate_sel = $('.shop-select.sub-category'),
				    $new_cate_sel = $html.find('.shop-select.sub-category');

				$('ul.breadcrumbs').html( $html.find('ul.breadcrumbs').html() );
				$cate_sel.html( $new_cate_sel.html() ).selectBox('destroy').selectBox();
				if($new_cate_sel.attr('edge')){
					$cate_sel.attr('edge', 'true');
					$('ul.sub-category-selectBox-dropdown-menu > li').removeClass('subcategory');
				} else {
					$cate_sel.removeAttr('edge', '');
					$('ul.sub-category-selectBox-dropdown-menu > li:not(:first-child)').addClass('subcategory');
				}

				$stream.html( $html.find('#content > ol.stream').html() );

				if($new_more.length) $('.pagination').append($new_more);
				$more.remove();

                if (typeof window.sociomantic === "object") {
                    var $bc = $html.find('ul.breadcrumbs');
                    var c = $.grep($bc.attr('data-category').split(','), function(x) { return x != ''; });
                    sociomantic.sonar.adv['fancy-us'].clear();
                    window.product = { category: c };
                    sociomantic.sonar.adv['fancy-us'].track();
                }

                var $mixpanel = $html.filter('script#mixpanel_script');
                if ($mixpanel) $.globalEval($mixpanel.html()); 

				(function(){
					if(useCSS3 && (Date.now() - begin < maxDelay+300)){
						return setTimeout(arguments.callee, 50);
					}

					$stream.addClass('fadein').html( $html.find('#content > ol.stream').html() );
					
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
					$.infiniteshow({itemSelector:'#content .stream > li'});
					$win.trigger('scroll');

				})();
			}
		});

		function inViewport(el){
			return (stTop + el.offsetTop + el.offsetHeight > scTop + headerH) && (stTop + el.offsetTop < scTop + winH);
		};
	};
    var tooltip = function(target) {
        var $target = $(target);
        if (!$('#tooltip').length) {
            $('<span>').attr('id','tooltip').appendTo(document.body);
        }
        var $tooltip = $('#tooltip').show();

        $tooltip.text($target.text());
        var o = $target.offset();
        o.left = Math.round(o.left - ($tooltip.width() + 16 - $target.width()) / 2); //16:#tooltip's padding
        o.top = Math.round(o.top - ($tooltip.height() + 9));
        $('#tooltip').offset(o);
    };

    $(document).delegate('.tooltip','mouseenter',function() {
        tooltip(this);
    });
    $(document).delegate('.tooltip','mouseleave',function() {
        $('#tooltip').hide();
    });
	function attachHotkey(){
		$(document).on('keydown.shop', function(event){
			var key = event.which, tid, $li;
			if( $("#popup_container").hasClass("full") || !dlg_detail.showing() || (key != 37 /* LEFT */ && key != 39 /* RIGHT */)) return;

			event.preventDefault();

			dlg_detail.$obj.find(key==37?'>.btn-prev':'>.btn-next').click();
		});
	};

	function detachHotkey(){
		$(document).off('keydown.shop');
	};

	(function(){
		var $cate_sel = $('.shop-select.sub-category')
		if($cate_sel.attr('edge')){
			$('ul.sub-category-selectBox-dropdown-menu > li').removeClass('subcategory');
		} else {
			$('ul.sub-category-selectBox-dropdown-menu > li:not(:first-child)').addClass('subcategory');
		}
	})();

	$(window).on('popstate', function(event){
		var e = event.originalEvent, $stream;
		if(!e || !e.state) return;

		$stream = $('#content .stream');
		if ($stream.data('restored') || typeof $stream.data('restored') == 'undefined') {
			$stream.data('restored', false);
		} else {
			loadPage(event.originalEvent.state.url, true);
		}
	});

	if(window.history && history.replaceState && !history.state){
		history.replaceState({url:location.href}, document.title, location.href);
	}
});
