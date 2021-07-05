$(function(){
    function initialize() {
        $(".video_player").videoPlayer({autoplay:true, muted:true});
    }

    var infiniteshow_options = {
        itemSelector:'#content .itemList > ol > li,#content .followerList > ol > li,#content .collectionList > ul > li',
        streamSelector:'#content .itemList,#content .followerList, #content .collectionList',
        loaderSelector:'#infscr-loading-dummy',
        post_callback: function($items, restored){
            $items.find(".video_player").videoPlayer({autoplay:true, muted:true});
        }
    }
    $.infiniteshow(infiniteshow_options)

    var $win = $(window)
    var $body = $('html,body')

    $.ajaxPage({
        contentSelector : '#content',
        extraSelector : ['#banner', '#cover',],
        scrollTop: false,
        setLoading : function(isLoading){
            if(isLoading) $('#content').addClass('loading');
            else $('#content').removeClass('loading');
        },
        beforeLoad : function(){
            $('div.empty-result').hide();
        },
        success : function($content, $html){
            $.infiniteshow(infiniteshow_options)
            initialize()

            if($.ajaxPage.scrollto_target) {
                $body.animate({scrollTop: $($.ajaxPage.scrollto_target).offset().top-($('header').height()+10)},'fast');
            } else {
                //$win.scrollTop(0).trigger('scroll');
            }
            // invoke video initialize code by triggering resize event
            $body.find(".video_player").videoPlayer({autoplay:true, muted:true});
            $win.trigger('resize');

            $html.find('#search-filter li.category small.menu').each(function(i,elem) {
                var $elem = $(elem);
                var id = $elem.data('id');
                var is_current = $elem.hasClass('current');

                if(is_current) {
                    $body.find('#search-filter li.category small.menu.category-'+id).addClass('current').show();
                    $elem.find('a.child-item').each(function(j,child) {
                        var $child = $(child);
                        if($child.hasClass('empty')) {
                            $body.find('#search-filter a#'+$child.attr('id')).hide();
                        } else {
                            $body.find('#search-filter a#'+$child.attr('id')).show();
                        }
                    });
                } else {
                    $body.find('#search-filter li.category small.menu.category-'+id).removeClass('current').hide();
                }
            });
            $html.find('#search-filter li.brand small a.menu').each(function(i,elem) {
                var $elem = $(elem);
                var brand = $elem.data('brand');
                var count = $elem.data('count');
                var selected = $elem.hasClass('selected');
                var $item = $body.find('#search-filter li.brand small > a[data-brand="'+brand+'"].menu');
                $item.data('count', count);
                if(selected) $item.addClass('selected');
                else $item.removeClass('selected');
                if(!$item.hasClass('all')) {
                    if(count>0) $item.removeClass('disabled');
                    else $item.addClass('disabled');
                }
            });
        }
    })

    initialize();

    $(".sort-overlay")
	.on('click','ul',function(event){
		if(event.target === this){
			if ($(window).width()<920) {
				var sc = $('#wrap').position().top;
				$('#wrap').css('top','');
				$(window).scrollTop(-sc);
			}
			$('.sort-overlay li').hide().css('top','').css('left','');
			$('body').removeClass('show_sort');
		}
	})
	.on('click','ul',function(event){
		if(event.target === this){
			if ($(window).width()<920) {
				var sc = $('#wrap').position().top;
				$('#wrap').css('top','');
				$(window).scrollTop(-sc);
			}
			$('.sort-overlay li').hide().css('top','').css('left','');
			$('body').removeClass('show_sort');
		}
	})
	.on('click','a.close',function(event){
		if ($(window).width()<920) {
			var sc = $('#wrap').position().top;
			$('#wrap').css('top','');
			$(window).scrollTop(-sc);
		}
		$('.sort-overlay li').hide().css('top','').css('left','');
		$('body').removeClass('show_sort');
		return false;
	})
	.on('click','[name=brand] a',function(event){
        event.preventDefault();

        if($(this).hasClass('disabled') || $(this).hasClass('close') || $(this).hasClass('label')) return;

        var brand = $(this).attr('data-brand');
		var $sortBrand = $(this).closest('li').find('a[data-brand="'+brand+'"]'), sortLabel = $sortBrand.text();
        $(this).closest('small').find('a.selected').removeClass('selected').end().end().addClass('selected');
		$('.sort-header .brand b').text( sortLabel );
        $.ajaxPage.changeParam('brand', brand);
		if ($(window).width()<920) {
			var sc = $('#wrap').position().top;
			$('#wrap').css('top','');
			$(window).scrollTop(-sc);
		}
		$('.sort-overlay li').hide().css('top','').css('left','');
		$('body').removeClass('show_sort');
        $(".banner").hide();
		return false;
    })
	.on('click','[name=order_by] a',function(event){
        event.preventDefault();

        if($(this).hasClass('disabled') || $(this).hasClass('close') || $(this).hasClass('label')) return;

        var order_by = $(this).attr('data-sorting-order');
		var $sortLink = $(this).closest('li').find('a[data-sorting-order="'+order_by+'"]'), sortLabel = $sortLink.text();
        $(this).closest('small').find('a.selected').removeClass('selected').end().end().addClass('selected');
		$('.sort-header .sortable b').text( sortLabel );
        $.ajaxPage.changeParam('order_by', order_by);
		if ($(window).width()<920) {
			var sc = $('#wrap').position().top;
			$('#wrap').css('top','');
			$(window).scrollTop(-sc);
		}
		$('.sort-overlay li').hide().css('top','').css('left','');
		$('body').removeClass('show_sort');
        $(".banner").hide();
		return false;
    })
	.on('click','[name=category] a',function(event){
		event.preventDefault();

        if($(this).hasClass('disabled') || $(this).hasClass('close') || $(this).hasClass('label')) return;

		var url = $(this).attr('href');
		openCategory($(this));
        $(".banner").hide();
		if( ! ('saleitems' in location.args)) location.args.saleitems = true;
		$.ajaxPage.changeUrlReloadCustomFilter(url, true);

		return false;
	});

	$('.sort-header').find('a').on('click',function(){
        if($('#content').hasClass('loading')) return false;

		var $overlay = $('.sort-overlay .'+$(this).closest('li').attr('class'));

		$('body').toggleClass('show_sort');
		$overlay.toggle().css('top',$(this).offset().top+$(this).outerHeight()+'px').css('left',$(this).offset().left+'px');
		return false;
	}).end()
	.find('label').on('click',function(){
        if($('#content').hasClass('loading')) return false;

		var $overlay = $('.sort-overlay .'+$(this).closest('li').attr('class')), sc = $(window).scrollTop();

		$('#wrap').css('top',-sc+'px');
		$('body').addClass('show_sort');

		$overlay.toggle().css('top','').css('left','').find('small').removeClass('fix');
		if($overlay.find('small').removeClass('fix').outerHeight()>$(window).height()){
			$overlay.find('small').addClass('fix');
		}else{
			$overlay.find('small').removeClass('fix');
		}
	});

	$(window).resize(function(){
		var $overlay = $('.sort-overlay li:visible');
		if($(window).width()<920){
			if($('body').hasClass('show_sort')){
				$overlay.css('top','').css('left','').find('small').removeClass('fix');
				if($overlay.find('small').removeClass('fix').outerHeight()>$(window).height()){
					$overlay.find('small').addClass('fix');
				}else{
					$overlay.find('small').removeClass('fix');
				}
			}
		}
	});

    $('#content').on('click', '.btn-reset', function(event){
        $.ajaxPage.reset();
    })

	function openCategory($category) {
        if(typeof $category!='object') {
            $category = $('.sort-overlay .category li a[data-id='+$category+']')
        }

        $('.sort-overlay .category a.selected').removeClass('selected')
        $('.sort-overlay .category small').hide()
        $('.sort-overlay .category').removeClass('opened')

        var category_id = $category.data('id')
        var $li = $category.closest('li')
        var url = $category.attr('href')
        var title = $category.html() || "All Categories"
        var $subcategories = $('.sort-overlay .category small.category-'+category_id);

        if($subcategories.find("a:not(.back,.close)").length){
            $subcategories.show();
        }else{
            $category.addClass('selected').closest('small').show();
			if ($(window).width()<920) {
				var sc = $('#wrap').position().top;
				$('#wrap').css('top','');
				$(window).scrollTop(-sc);
			}
			$('.sort-overlay li').hide().css('top','').css('left','');
			$('body').removeClass('show_sort');
        }
        $('.sort-header .category b').html( title );

        if(window.VIEW != 'search') {
    		document.title = 'Gear - '+title
        }
    }


});
