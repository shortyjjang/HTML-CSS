$(function(){

	$('script[type="fancy/template"]').each(function(){
		var $tpl = $(this);
		$tpl.parent().data('template', _.template($tpl.remove().html()));
	});

	// main 
	$("#header")
		.find(".navigation")
			.find("a[data-type], a[data-category]")
				.click(function(e){
					e.preventDefault();
					var type = $(this).data('type');
					var path = $(this).attr('href');
					showOverlay(path, type);
				})
			.end()

	$(".slide a.slide-item").click(function(e){
		e.preventDefault();
		$(".navigation ul li a[data-type=new]").click();		
	})

	$(".navigation ul li a.designer").click(function(e){
		e.preventDefault();
		$('.overlay-designer').show();
		//History.pushState({ page: 'designer', item: 0 }, 'Fancy', '/shop/designers?concept');
	})

	function restoreOverlay(path, type, params){
		var categories = [];
    	if(type){
			categories = $("#header .navigation").find("a[data-type='"+type+"']").data("subcategories");
    	}else{
			categories = $("#header .navigation").find("a[href='"+path+"']").data("subcategories");
    	}
    	setCategoryFilters(categories);
		$('.overlay-thing').show().find(".inner").hide();
		resetCondition(path, type, params);
		reloadPage();
	}

	function restoreThing(path, type, params, thingId, thingIndex){
		var categories = [];
    	if(type){
			categories = $("#header .navigation").find("a[data-type='"+type+"']").data("subcategories");
    	}else{
			categories = $("#header .navigation").find("a[href='"+path+"']").data("subcategories");
    	}
    	setCategoryFilters(categories);
    	if(needReload(path, type, params)){
			$('.overlay-thing').show().find(".inner").hide();
			resetCondition(path, type, params, thingId, thingIndex);	
			reloadPage();
    	}else{
    		$('.overlay-thing').show().find(".inner").show();
    		showThing(thingIndex);
    	}
	}

	History.Adapter.bind(window, 'statechange', function() {
		var state = History.getState();
		var page = state.data.page;
	    if(page=='overlay'){
	    	var path = state.data.path;
	    	var type = state.data.type;
	    	var params = state.data.params||null;
	    	restoreOverlay(path, type, params);
		}else if(page=='thing'){
	    	var params = state.data.params;
	    	var path = state.data.path;
	    	var type = state.data.type;
	    	var thingIndex = state.data.index;
	    	var thingId = state.data.thing_id;
	    	restoreThing(path, type, params, thingId, thingIndex);
	    }else if(page=='designer'){
	    	$('.overlay-designer').show();
	    }else{
	    	$('.overlay-designer, .overlay-thing').hide();
	    }
	});

	// overlay
	function setCategoryFilters(categories){
		var $list = $(".overlay-thing .filter-menu ._category ul");
		$list.empty();

		if(categories.length){
			$list.closest("._category").show();
			$('<li><a href="#" data-param="subcategory" data-value="">All</a></li>').appendTo($list);
			$(categories).each(function(){
				$('<li><a href="#" data-param="subcategory" data-value="'+this.name+'">'+this.display+'</a></li>').appendTo($list);
			})
		}else{
			$list.closest("._category").hide();
		}
	}

	function showOverlay(_path, _type){
		path = _path;
		type = _type;
		History.pushState({ page: 'overlay', path: path, type: type }, 'Fancy', getUrl());
	}

	var cursor = null;
	var next_cursor = null;
	var things = [];
	var params = {};
	var currentThingIndex = -1;
	var path = null;
	var type = null;
	var defaultLimit = 15;
	var limit = defaultLimit;
	var sort_by = 'popular';
	var loading = false;
	var fancyd_users_count = 7;
	var showSpecificThingId = null;
	var showSpecificThing = null;

	$(window).on('beforeunload', function(){
		var state = {
			cursor : cursor,
			next_cursor : next_cursor,
			things : things,
			params : params,
			index : currentThingIndex,
			thing_id : things[currentThingIndex] && things[currentThingIndex].id_str || null,
			path : path,
			type : type,
		}
		$.jStorage.set('shop_v5_state', JSON.stringify(state));
	})
	$(function(){
		var state = {};
		try{
			state = JSON.parse($.jStorage.get('shop_v5_state'));
		}catch(e){
			state = {};
		}
		if( state.path && state.path.toLowerCase() == init.path.toLowerCase()
				&& state.type == init.type 
				&& (state.subcategory||"") == init.subcategory
				&& (state.params.p||"") == init.p
				&& (state.params.brands||"") == init.brands
				&& (state.params.status||"") == init.status){
			cursor = state.cursor;
			next_cursor = state.next_cursor;
			params = state.params;
			things = state.things;
			currentThingIndex = 0;
			showSpecificThingId = null;
			if( state.index && state.thing_id ){
				var thing = things[state.index];
				if(thing.id_str == state.thing_id){
					currentThingIndex = state.index;
				}
			}else if (init.thing_id){
				showSpecificThingId = init.thing_id;	
			}
		}else{
			params.subcategory = init.subcategory;
			params.p = init.p;
			params.brands = init.brands;
			params.status = init.status;
			currentThingIndex = 0; 
			showSpecificThingId = init.thing_id;
		}
		path = init.path;
		type = init.type;
			
		if( init.thing_id ){
			restoreThing(path, type, params, showSpecificThingId, currentThingIndex||0);
		}else if(path.split("/").length > 3 || type){
			restoreOverlay(path, type, params);
		}
	})

	function needReload(_path, _type, _params){
		return !things.length || path!=_path || type!=_type || params.p!=_params.p || params.status!=_params.status || params.subcategory!=_params.subcategory;
	}

	function getUrl(){
		var url = path;
		if(params.subcategory) url+="/"+params.subcategory;
		var query = [];
		if(shop_v5_param) query.push(shop_v5_param+'=true');
		if(type) query.push("type="+type);
		if(params.p) query.push("p="+params.p);
		if(params.brands) query.push("brands="+params.brands);
		if(params.status) query.push("status="+params.status);
		if(currentThingIndex>-1) query.push("index="+currentThingIndex);
		var thing = things[currentThingIndex];
		if(thing) query.push("thing_id="+thing.id_str);
		if(query.length)
			url += "?"+query.join("&");

		return url;
	}

	function showThing(index){
		var thing = things[index];
		showSpecificThing = null;
		if(!thing) return;
		
		currentThingIndex = index;
		var saleitem = thing.sales[0];
		var seller = saleitem.seller;
		var $el  = $(".overlay-thing")
		$el
			.find(".inner").show().end()
			.find(".product-item").show().end()
			.find(".product-item.empty-result").hide().end()
			
		var tpl = $el.find(".product-item.current").data('template');
		var $product = tpl({thing:thing, saleitem:saleitem, seller:seller});
		$el.find(".product-item.current").empty().append($product);
		
		if(index==0){
			$el.find("a.prev").hide();
		}else{
			var prevThing = things[index-1];
			$el.find("a.prev").show()
				.find('span').css('background-image','url('+prevThing.image_url+')').end()
		}
		if(index==things.length-1){
			$el.find("a.next").hide();	
		}else{
			var nextThing = things[index+1];
			$el.find("a.next").show()
				.find('span').css('background-image','url('+nextThing.image_url+')').end()
		}
		if(typeof LogExposed != 'undefined') LogExposed.addLog(thing.id_str);
	}

	function resetCondition(_path, _type, _params, _thingId, _thingIndex){
		if(_path || _type){
			path = _path;
			type = _type;
			$(".overlay-thing .list_header .filter-group").removeClass("show").find("li a").removeClass("selected");

			if(_type == 'new'){
				sort_by = 'newest';
			}else{
				sort_by = 'popular';
			}

			if(_type == 'preorder'){
				$(".overlay-thing .list_header ._status li a[data-value='pre-order']").trigger("click");
				$(".overlay-thing .list_header ._status").hide();
			}else{
				$(".overlay-thing .list_header ._status").show();
			}

			if(_params){
				if(params.status){
					var $sel = $(".overlay-thing .list_header ._status li a[data-value='"+params.status+"']");
					$sel.addClass('selected').closest('.filter-group').find("h4").html($sel.text()+"<a href='#'></a>");
				}else{
					$(".overlay-thing .list_header ._status h4").html("Status<a href='#'></a>");
				}
				if(params.p){
					var $sel = $(".overlay-thing .list_header ._price li a[data-value='"+params.p+"']");
					$sel.addClass('selected').closest('.filter-group').find("h4").html($sel.text()+"<a href='#'></a>");
				}else{
					$(".overlay-thing .list_header ._price h4").html("Price<a href='#'></a>");
				}
				if(params.brands){
					var $sel = $(".overlay-thing .list_header ._brands li a[data-value='"+params.brands+"']");
					$sel.addClass('selected').closest('.filter-group').find("h4").html($sel.text()+"<a href='#'></a>");
				}else{
					$(".overlay-thing .list_header ._brands h4").html("Designer<a href='#'></a>");
				}
				if(params.subcategory){
					var $sel = $(".overlay-thing .list_header ._category li a[data-value='"+params.subcategory+"']");
					$sel.addClass('selected').closest('.filter-group').find("h4").html($sel.text()+"<a href='#'></a>");
				}else{
					$(".overlay-thing .list_header ._category h4").html("Categories<a href='#'></a>");
				}
			}
			showSpecificThingId = null;
			showSpecificThing = null;
			if(_thingId){
				showSpecificThingId = _thingId;
			}
			if(_thingIndex>0){
				showSpecificThing = _thingIndex;
				if(_thingIndex>14) limit = _thingIndex+1;
			}
		}else{
			limit = defaultLimit;
			showSpecificThingId = null;
		}

		var status = $(".overlay-thing .list_header ._status li a.selected").data('value');
		var subcategory = $(".overlay-thing .list_header ._category li a.selected").data('value');
		var brands = $(".overlay-thing .list_header ._brands li a.selected").data('value');
		var price = $(".overlay-thing .list_header ._price li a.selected").data('value');
		params = {seller_ids:category_seller_ids.join(","), subcategory:subcategory, status:status, brands:brands, p:price, limit:limit, sort_by:sort_by, fancyd_users_count:fancyd_users_count};
		if(showSpecificThingId){
			params.first_thing_id = showSpecificThingId;
		}
		things = [];
		cursor = null;
		next_cursor = null;
		currentThingIndex = -1;
	}

	function reloadPage(){
		$(".overlay-thing .wrapper-overlay-thing").addClass('loading');
		requestItems()
	}

	function requestItems(){
		if(loading) return;
		loading = true;
		var url = '/rest-api/v1'+path;
		params.cursor = next_cursor;
		if(params.subcategory) url = url + "/" + params.subcategory;
		$.get(url, params)
			.done(function(res){
				cursor = res.cursor;
				next_cursor = res.next_cursor;
				things = things.concat(res.things);
				if(currentThingIndex<0){
					$(".overlay-thing")
						.find(".inner").show().end();

					if(things.length){
						//History.replaceState({ page: 'thing', path: path, type: type, params:params, index: showSpecificThing||0}, 'Fancy', getUrl());
						showThing(showSpecificThing||0);
					}else{
						$(".overlay-thing")
							.find(".product-item").hide().end()
							.find(".product-item.empty-result").show().end()
							.find("a.prev, a.next").hide().end()		
					}
				}else{
					if(res.things.length && $(".overlay-thing a.next").is(":hidden")){
						var nextThing = res.things[0];
						$(".overlay-thing a.next").show()
							.find('span').css('background-image','url('+nextThing.image_url+')').end();
					}
				}
			})
			.fail(function(){
				$(".overlay-thing")
					.find(".inner").show().end()
					.find(".product-item").hide().end()
					.find(".product-item.empty-result").show().end()
					.find("a.prev, a.next").hide().end()
			})
			.always(function(){
				loading = false;
				$(".overlay-thing .wrapper-overlay-thing").removeClass('loading');
			})
	}

	function prev(){
		if(currentThingIndex>0){
			currentThingIndex = currentThingIndex-1;
			History.pushState({ page: 'thing', path: path, type: type, params:params, index: currentThingIndex}, 'Fancy', getUrl());
		}
	}

	function next(){
		if(currentThingIndex<things.length-1){
			currentThingIndex = currentThingIndex+1;
			History.pushState({ page: 'thing', path: path, type: type, params:params, index: currentThingIndex}, 'Fancy', getUrl());
			if(things.length - currentThingIndex < 5 && next_cursor){
				requestItems();
			}
		}
	}

	$("._list_section")
		.find("a.prev").click(function(e){
			e.preventDefault();
			prev();
		}).end()
		.find("a.next").click(function(e){
			e.preventDefault();
			next();
		}).end()
		.find(".filter-group")
			.on('click', "h4 a", function(e){
					e.preventDefault();
					var $current = $(this).closest(".filter-group");
					if($current.hasClass("show")){
						$current.removeClass("show");
					}else{
						$current.closest('.filter-menu').find(".filter-group").removeClass('show');
						$current.addClass('show');
					}
				})
			.on('click', "li a", function(e){
					e.preventDefault();
					var key = $(this).data('param'), value = $(this).data('value');
					if($(this).hasClass('selected')){
						params[key] = '';
					}else{
						params[key] = value;	
					}
					resetCondition(path, type, params);
					History.pushState({ page: 'overlay', path: path, type: type, params:params, index: showSpecificThing||0}, 'Fancy', getUrl());
				})
		.end()
		.find(".product-item.current")
			.on('click', '.showcase-pager li a', function(e){
				e.preventDefault();
				var imageUrl = $(this).data("image-url");
				$(this).closest('.showcase').find("._image_url").attr('src', imageUrl);
			})
			.on('change', 'select[name=options]', function(e){
				var price = $(this).find("option:selected").data("price");
				$(this).closest('.details').find(".price .money").text("$"+price);
			})
		.end()
		.find("a.reset_filters")
			.click(function(e){
				e.preventDefault();
				params.q = '';
				params.subcategory = '';
				params.brands = '';
				resetCondition(path, type, params);
				History.pushState({ page: 'overlay', path: path, type: type, params:params, index: showSpecificThing||0}, 'Fancy', getUrl());
			})

	$('._list_section')
		.find(".product-item.current")
			.swipe({
				//allowPageScroll:"horizontal",
				threshold:30,
				triggerOnTouchEnd:false,
				excludedElements:'input, select, .noSwipe, a, button',
				swipeLeft:function(e){
					next();
				},
				swipeRight:function(e){
					prev();
				}
			});


})