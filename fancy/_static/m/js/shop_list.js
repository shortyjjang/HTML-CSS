jQuery(function($) {
	var code = null;

	$('#content .filter .sub-category').change(function(){
		var $this = $(this), url = this.value, text = $this.find('>option').eq(this.selectedIndex).text(),issibling = $this.find('>option').eq(this.selectedIndex).hasClass('sibling');

        if (issibling)
		    $('ul.breadcrumbs').find('.last').remove();
		$('ul.breadcrumbs').append('<li class="last">/ <a href="#">'+text+'</a></li>');

		if(url) loadPage(url);
	});

	$('#content .filter .price-range').change(function(){
		var range = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(range != '-1'){
			args.p = range;
		} else {
			delete args.p;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	$('#content .filter .color-filter').change(function(){
		var color = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(color){
			args.c = color;
		} else {
			delete args.c;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});
    
    $('#content .filter .sort-by-price').change(function(){
		var sort_by_price = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(sort_by_price){
			args.sort_by_price = sort_by_price;
		} else {
			delete args.sort_by_price;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});
	
	$('#content .filter .search-string')
		.keydown(function(event){
			if(!event.keyCode || event.keyCode!=13) return;
			
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

	$('.filter ._save').click(function(){
		var url = location.pathname, args = $.extend({}, location.args), query;

		// category
		var subcategory = $('.filter .sub-category').val();
		var range = $('.filter .price-range').val();
		var color = $('.filter .color-filter').val();
		var sort_by_price = $('.filter .sort-by-price').val();
		var q = $.trim($('.filter .search-string').val());
		if(subcategory) url = subcategory;
		if(range != '-1'){
			args.p = range;
		} else {
			delete args.p;
		}
		if(color){
			args.c = color;
		} else {
			delete args.c;
		}
		if(sort_by_price){
			args.sort_by_price = sort_by_price;
		} else {
			delete args.sort_by_price;
		}
		if(q) {
			args.q = q;
		} else {
			delete args.q;
		}

		if(query = $.param(args)) url += '?'+query;
		loadPage(url);

	});

	$('.search-frm .del-val').click(function(event){
	    event.preventDefault();
	    $(this).next('.search-string').val('').keyup();
	    var $age = $(this).next('.filter-age');
	    if ($age.length > 0) {
		    $age.val('').keyup();
	    }
		
	});

	$('ul.nav').on('click', 'a', function(event){
		event.preventDefault();
		$(this).closest('li').nextAll('li').remove();
		loadPage(this.getAttribute('href'));
	});
	

	$.infiniteshow({itemSelector:'#content .stream > li'});

	function loadPage(url){
		document.location.href = url;
	}
});
