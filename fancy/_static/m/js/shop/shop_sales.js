$(function(){

	// set a flag to check if the stream is restored
	var $stream = $('.shop .stream li').attr('loc', location.pathname.replace(/\//g, '-').substr(1)), $last;
	$last = $stream.find('>li:last-child');
	$.infiniteshow({itemSelector:'.shop .stream li'});
	$stream.data('restored', $last[0] !== $stream.find('>li:last-child')[0]);

				
	$('.category').delegate('select[name=category]','change',function(event){
		event.preventDefault();
		
		var url = $(this).val(), args = $.extend({}, location.args), query;

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	// keyword search
	$('.keyword input[type=text]')
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
			var hasVal = !!$(this).val().replace("Filter by keyword","");
			$(this).parent().find('.btn-remove').css({opacity:hasVal?1:0}).end()
		})
		.keyup();

	// remove keyword
	$('.keyword .btn-remove').click(function(event){
	    event.preventDefault();
	    $(this).parent().find('input[type=text]').val('').keyup();	    

	    var url = location.pathname, args = $.extend({}, location.args), query;

		event.preventDefault();
		delete args.q;

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	})

    // discount range
    $(".category select[name='discount-range']").change(function(event){
    	event.preventDefault();

		var discount_range = $(this).val(), url = location.pathname, args = $.extend({}, location.args), query;

		if(discount_range){
			args.discount = discount_range;			
		} else {
			delete args.discount;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	// sort option
    $('.category select[name=sort]').change(function(event){
    	event.preventDefault();
    	
		var sort_by_price = $(this).val(), url = location.pathname, args = $.extend({}, location.args), query;

		if(sort_by_price){
			args.sort_by_price = sort_by_price;
		} else {
			delete args.sort_by_price;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

    // price range
    $('.others select[name=price]').change(function(event){

		var price = $(this).val(), url = location.pathname, args = $.extend({}, location.args), query;

		if(price && args.p != price){
			args.p = price;
		} else {
			delete args.p;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

    // search by color
    $('.others select[name=color]').change(function(event){
    	event.preventDefault();
    	
		var color = $(this).val(), url = location.pathname, args = $.extend({}, location.args), query;

		if(color ){
			args.c = color;			
		} else {
			delete args.c;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	// fancyd / wanted
    $('.category select[name=yourlist]').change(function(event){
    	event.preventDefault();

    	if( $(this).attr('require_login')) return require_login();
    	
		var action = $(this).val(), url = location.pathname, args = $.extend({}, location.args), query;

		delete args.fancyd;
		delete args.wanted;
		if(action){
			args[action] = 'true';
		}
		if(query = $.param(args)) url += '?'+query;

		if( $('#contain .open-app').is(":visible") ){
			setDeepLink(args.fancyd, args.wanted);
		}

		loadPage(url);
	});

	// intl / us shipping
    $('.others select[name=shipping]').change(function(event){
    	event.preventDefault();
    	
		var action = $(this).val(), url = location.pathname, args = $.extend({}, location.args), query;

		delete args.ship_intl;
		delete args.ship_us;
		if(action){
			args[action] = 'true';
		}
		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	function loadPage(url, skipSaveHistory){
		var $win = $(window), $stream  = $('.shop .stream');

		if (!$stream.length) return;

		var $lis = $stream.find('>li');


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
					
				
				$stream.html( $html.find('.shop .stream').html() );

				if($new_more.length) $('.pagination').append($new_more);
				$more.remove();

				(function(){

					// reset infiniteshow
					$.infiniteshow({itemSelector:'.shop .stream li'});
					$win.trigger('scroll');
				})();
			}
		});
	};


	$(window).on('popstate', function(event){
		var e = event.originalEvent, $stream;
		if(!e || !e.state) return;

		$stream = $('.shop .stream');
		if ($stream.data('restored')) {
			$stream.data('restored', false);
		} else {
			loadPage(event.originalEvent.state.url, true);
		}
	});

});