$(function(){
    
    // set a flag to check if the stream is restored
    var $stream = $('#content .itemList').attr('loc', location.pathname.replace(/\//g, '-').substr(1)), $last;
    $last = $stream.find('>li:last-child');
    $.infiniteshow({
        streamSelector:'#content .itemList', 
        itemSelector:'#content .itemList > li', 
        dataKey:'gear-category2',
        post_callback: function($items, restored){ 
            $items.find(".video_player").videoPlayer({autoplay:true, muted:true});
            $(window).trigger('resize');
        }
    });
    $(".video_player").videoPlayer({autoplay:true, muted:true});
    $(document).on('click', '#muteBtn.btn-mute', function(){
        $("#muteBtn.btn-mute").not(this).trigger('click');
    })

    $('.page-info').on('click', '.category > a', function(event) {
        $(this).closest('.category').toggleClass('opened').find('ul').slideToggle();
        return false;
    });

    $("#content").removeClass("loading");
	$('.page-info .category > a b').text($('.page-info .category li:not(.hidden)').length+' SUBCATEGORIES');

    $stream.data('restored', $last[0] !== $stream.find('>li:last-child')[0]);
    if(!$stream.find('> li').length) $('div.empty-result').show();

    var $win = $(window)
    var $body = $('html,body')

    $.ajaxPage({
        contentSelector : '#content',
        extraSelector : ['.cover','.page-info .sort','.sort-overlay'],
        scrollTop: false,
        setLoading : function(isLoading){
            if(isLoading) $('#content').addClass('loading');
            else $('#content').removeClass('loading');
        },
        beforeLoad : function(){
            $('div.empty-result').hide();
        },
        success : function($content){
            $.infiniteshow({
                streamSelector:'#content .itemList', 
                itemSelector:'#content .itemList > li', 
                dataKey:'gear-category2',
                post_callback: function($items, restored){ 
                    $items.find(".video_player").videoPlayer({autoplay:true, muted:true});
                    // invoke video initialize code by triggering resize event
                    $win.trigger('resize');
                }
            });
            if($.ajaxPage.scrollto_target) {
                $body.animate({scrollTop: $($.ajaxPage.scrollto_target).offset().top-($('header').height()+10)},'fast');
            } else {
                //$win.scrollTop(0).trigger('scroll');
            }
            // invoke video initialize code by triggering resize event
            $body.find(".video_player").videoPlayer({autoplay:true, muted:true});
            $win.trigger('resize');

            // update admin header organize category href
            var organizeCategoryUrl = "/admin/organize-category";
            var categoryId = $content.find("[data-category-id]").data('category-id');
            var sale = $content.find("[data-discounted_only]").data('discounted_only');
            if(categoryId) organizeCategoryUrl = organizeCategoryUrl + "/"+categoryId;
            if(sale) organizeCategoryUrl = organizeCategoryUrl + "?for=sales";
            $(".quick-admin ._organize_category").attr('href', organizeCategoryUrl );
            
            if($.ajaxPage._onSuccess) {
                $.ajaxPage._onSuccess($content);
            }

            // override extraSelector show
            $('.page-info .sort').attr('style',null);
        },
        complete : function() {
            $.ajaxPage.scrollto_target = null;
            $.ajaxPage._onSuccess = null;
        }
    })

    $("#container-wrapper").on('click','[name=brand] a',function(event){
        event.preventDefault();
        var brand = $(this).attr('data-brand');
		var $sortBrand = $(this).closest('dd, li.brand').find('a[data-brand="'+brand+'"]'), $sortOpt = $(this).closest('dd, li.brand').find('option[value="'+brand+'"]'), sortLabel = $sortBrand.text();

        if($(this).hasClass('disabled')) return;

        $(this).closest('dd, li.brand')
			.find('small a.selected').removeClass('selected').end()
			.find('> .selected b').text( sortLabel ).end()
			.find('select option').removeAttr('selected').end()
		.removeClass('opened');
		$sortBrand.addClass('selected');
		$sortOpt.attr('selected','selected');
        $.ajaxPage.changeParam('brand', brand);
    });
    $("#container-wrapper").on('change','select[name=brand]',function(event){
        event.preventDefault();
        var brand = $(this).val();
		var $sortBrand = $(this).closest('dd, li.brand').find('a[data-brand="'+brand+'"]'), $sortOpt = $(this).closest('dd, li.brand').find('option[value="'+brand+'"]'), sortLabel = $sortBrand.text();
        $(this).closest('dd, li.brand')
			.find('small a.selected').removeClass('selected').end()
			.find('> .selected b').text( sortLabel ).end()
			.find('select option').removeAttr('selected').end()
		.removeClass('opened');
		$sortBrand.addClass('selected');
		$sortOpt.attr('selected','selected');
        $.ajaxPage.changeParam('brand', brand);
    });

    $("#container-wrapper").on('click','.page-info a.select-category', function(event) {
        event.preventDefault();
        var url = $(this).attr('href');
        openCategory(this);

        $.ajaxPage._onSuccess = function($content) {
			if($('.page-info .category li:not(.hidden)').length) {
				$('.page-info .category').show().removeClass('opened').find('ul').hide();
			} else {
				$('.page-info .category').hide().removeClass('opened').find('ul').hide();
			}
			$('.page-info .category > a b').text($('.page-info .category li:not(.hidden)').length+' SUBCATEGORIES');
        }
        $.ajaxPage.changeUrlReloadCustomFilter(url, true);
    });

    $("#container-wrapper").on('click','[name=order_by] a',function(event){
        event.preventDefault();
        var order_by = $(this).attr('data-sorting-order');
		var $sortLink = $(this).closest('dd').find('a[data-sorting-order="'+order_by+'"]'), $sortOpt = $(this).closest('dd').find('option[value="'+order_by+'"]'), sortLabel = $sortLink.text();
        $(this).closest('dd')
			.find('small a.selected').removeClass('selected').end()
			.find('> .selected b').text( sortLabel ).end()
			.find('select option').removeAttr('selected').end()
		.removeClass('opened');
		$sortLink.addClass('selected');
		$sortOpt.attr('selected','selected');
        $.ajaxPage.changeParam('order_by', order_by);
    });
    $("#container-wrapper").on('change','select[name=order_by]',function(event){
        event.preventDefault();
        var order_by = $(this).val();
		var $sortLink = $(this).closest('dd').find('a[data-sorting-order="'+order_by+'"]'), $sortOpt = $(this).closest('dd').find('option[value="'+order_by+'"]'), sortLabel = $sortLink.text();
        $(this).closest('dd')
			.find('small a.selected').removeClass('selected').end()
			.find('> .selected b').text( sortLabel ).end()
			.find('select option').removeAttr('selected').end()
		.removeClass('opened');
		$sortLink.addClass('selected');
		$sortOpt.attr('selected','selected');
        $.ajaxPage.changeParam('order_by', order_by);
    });

    $('#content').on('click', '.btn-reset', function(event){
        $.ajaxPage.reset();
    })

    function openCategory(category) {
        var title = $(category).data('title') || $(category).text();
        var id = $(category).data('id');

        if(id) {
            $('.page-info .breadcrumbs').removeClass('hidden').find('a.select-category').addClass('hidden').end().find('.all-category').removeClass('hidden');
            $('.page-info .category li').addClass('hidden');
            $('.page-info .category li.child-of-'+id).removeClass('hidden');
            $('.page-info .category-title').text(title);

            $('.page-info .breadcrumbs a.select-category:not(.all-category)').addClass('hidden');
            var ancestor_ids = ancestor_category_ids[id];
            for(i in ancestor_ids) {
                var ancestor_id = ancestor_ids[i];
                if(ancestor_id!=id) {
                    $('.page-info .breadcrumbs #breadcrumbs-'+ancestor_id).removeClass('hidden');
                }
            }
        } else {
            $('.page-info .breadcrumbs').addClass('hidden').find('a.select-category').addClass('hidden').end().find('.all-category').removeClass('hidden');
            $('.page-info .category li').addClass('hidden');
            $('.page-info .category li.root-category').removeClass('hidden');
            $('.page-info .category-title').text(title);
        }
		if($('.page-info .category li:not(.hidden)').length) {
			$('.page-info .category').show().removeClass('opened').find('ul').hide();
		} else {
			$('.page-info .category').hide().removeClass('opened').find('ul').hide();
		}
        $('.page-info .category > a b').text($('.page-info .category li:not(.hidden)').length+' SUBCATEGORIES');

        if(window.VIEW != 'search') {
            document.title = title + (window.discounted_only?" Sale Items":"") + " | Gear.com";
        }
    }

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

    $('.sort-header')
        .find('a').on('click',function(){
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

});