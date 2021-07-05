$(function(){
    $.change_param = function(param,value) {
        // Change a field from url params.
        // and set it as url in the browsers'ss address window.
        var args = location.args
        args[param] = value
        if(value==null||value==undefined||value=='') {
            delete args[param]
        }
        var search = []
        for(k in args) {
            search.push(k+'='+args[k])
        }
        var search_param = search.join('&')
        var path = location.origin+location.pathname+(search_param?('?'+search_param):'')
        history.replaceState({url:path}, document.title, path)    

        location.args = args
    }

	// set a flag to check if the stream is restored
	var $stream = $('#content .itemList').attr('loc', location.pathname.replace(/\//g, '-').substr(1)), $last;
	$last = $stream.find('>li:last-child');
	$.infiniteshow({streamSelector:'#content .itemList', itemSelector:'#content .itemList > li', dataKey:'gear-category'});
	$("#content").removeClass("loading");

	$stream.data('restored', $last[0] !== $stream.find('>li:last-child')[0]);
	if(!$stream.find('> li').length) $('div.empty-result').show();

    var $win = $(window);
    var $body = $('html,body');

    $.ajaxPage({
		contentSelector : '#content',
        extraSelector : '.custom-filters',
        scrollTop: false,
		setLoading : function(isLoading){
			if(isLoading) $('#content').addClass('loading');
			else $('#content').removeClass('loading');
		},
		beforeLoad : function(){
			$('div.empty-result').hide();
		},
		success : function($content){
			$.infiniteshow({streamSelector:'#content .itemList', itemSelector:'#content .itemList > li', dataKey:'gear-category'});
            if($.ajaxPage.scrollto_target) {
                $body.animate({scrollTop: $($.ajaxPage.scrollto_target).offset().top-($('header').height()+10)},'fast');
            } else {
                //$win.scrollTop(0).trigger('scroll');
            }

            if($content.find('.itemList').length>0) {
                $.change_param('tags',$content.find('.itemList').data('refined-tags'))
            }
            restoreFilter()
		},
        complete : function() {
            $.ajaxPage.scrollto_target = null
            $('.inner .sort').removeClass('opened')
        }
	})

    function restoreFilter(){
        var category_id = $("a[href='"+location.pathname+"'][data-id]").data('id'), args = location.args;
        if(category_id) openCategory(category_id);
        $('#sidebar .keyword input[type=text]').val(args.q);
        changeSortingOrder( args.order_by )
        if(args.price){
            $( "#slider-range" ).attr('do-not-fetch',true);
            $( "#slider-range" ).slider('values', args.price.split(",")[0], args.price.split(",")[1]);
            $( "#slider-range" ).removeAttr('do-not-fetch');
        }
    }
	
	$('#sidebar .category').delegate('ul a,a#all-categories-sidebar','click',function(event){
	    event.preventDefault();
	    var url = $(this).attr('href');
	    openCategory($(this));
	    $.ajaxPage.changeUrlReloadCustomFilter(url, true);
	});

    $('.inner .breadcrumbs').delegate('a','click',function(event){
        event.preventDefault();
	    var url = $(this).attr('href');
        openCategory($(this).data('id'))
        $.ajaxPage.changeUrlReloadCustomFilter(url, true);
    });

    $('.inner .sort').delegate('a.label','click',function(event){
        event.preventDefault()
        $(this).closest('.sort').toggleClass('opened')
    })
	$('.inner .sort').delegate('a','click',function(event){
		event.preventDefault();

        var sorting_order = $(this).data('sorting-order')
        if(!sorting_order) return

    	var url = $(this).attr('href');
        changeSortingOrder($(this).data('sorting-order'))
        $.ajaxPage.changeParam('order_by', $(this).data('sorting-order'));
	});

	// keyword search
	$('#sidebar .keyword input[type=text]')
		.hotkey('ENTER', function(event){
			var q = $.trim(this.value);
			event.preventDefault();
			$.ajaxPage.changeParam('q', q);
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

	    $.ajaxPage.changeParam('q', '');
	})

    $('#sidebar').on('click', '.refine dt', function(event) {
        event.preventDefault()
        console.log($(this).next('dd'))
        $(this).next('dd').toggleClass('show')
    })

	$('#sidebar').on('click', '.filter a.reset', function(event){
	    event.preventDefault();
	    var $inputs = $(this).parents(".filter").find("input:checked");
	    if ($inputs.length > 0) {
		$(this).parents(".filter").find("input").prop('checked', false).change();
	    }
	});

	$('#sidebar').on('change', '.filter input.custom_option', function(event){
	    var allvalarr = [];
	    $('#sidebar .filter.custom-filter').each(function() {
		var valarr = [];
		$(this).find('input:checked').each(function() {
		    valarr.push($(this).val());
		});
		if (valarr.length > 0) {
		    allvalarr.push(valarr.join("|"))
		}
	    });
	    $.ajaxPage.changeParam('tags', allvalarr.join(","));
	})


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

			$( ".price .amount .min" ).text( min_price || 1 );
			$( ".price .amount .max" ).text( max_price + (max_price==1000?"+":"") );	

			//if(max_price==1000) max_price="";
			if(max_price && !min_price) min_price = "1"

			var price = '';
			if(min_price || max_price){				
				price = min_price+","+max_price;
			}
            if($(this).attr('do-not-fetch')=='true') {
                return
            }
			$.ajaxPage.changeParam('price', price);
		}
	});

	$('#content').on('click', '.btn-reset', function(event){
		$('#sidebar .keyword input[type=text]').val('');
		$( "#slider-range" ).slider('option', "values", [0, 1000]);
		$.ajaxPage.reset();
	})

	function openCategory($category) {
        if(typeof $category!='object') {
            $category = $('#sidebar .category li a[data-id='+$category+']')
        }

        $('#sidebar .category li.opened a.current').removeClass('current')
        $('#sidebar .category li.opened small').hide()
        $('#sidebar .category li.opened').removeClass('opened')

        var category_id = $category.data('id')
        var $li = $category.closest('li')
        var url = $category.attr('href')
        var title = $category.html() || "All Categories"

        $li.addClass('opened')
        $li.find('>small').show()
        $category.addClass('current')
        $category.next('small').show()
        var p = $category.parent('small')
        while(p.length>0) {
            p.prev('a').addClass('current')
            p.show()
            p = p.parent('small')
        }

        categories = ['<a href="/shop/category">SHOP</a>']
        $li.find('a.current').each(function() {
            categories.push('<a href="'+$(this).attr('href')+'" data-id='+$(this).data('id')+'>'+$(this).html()+'</a>')
        })
        categories = categories.join('/')
        $('.page-info .inner .breadcrumbs').html(categories)

        if(window.VIEW != 'search') {
    		document.title = 'Gear - '+title
        }
    }

    function changeSortingOrder(sorting_order) {
        $('.page-info .inner .sort li a').each(function() {
            if($(this).data('sorting-order')==sorting_order) {
                $(this).addClass('current')
            } else {
                $(this).removeClass('current')
            }
        })
    }

});
