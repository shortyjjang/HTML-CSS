if(typeof LogExposed != 'undefined') LogExposed.from = 'seller-profile'
$(function() {
    $.infiniteshow({
        itemSelector:'#content ul.itemList > li',
        streamSelector:'#content ul.itemList',
        loaderSelector:'#infscr-loading-dummy',
        dataKey:null,
        post_callback: function($items, restored){ 
            $items.find(".video_player").videoPlayer({autoplay:true, muted:true});
            $(window).trigger('resize');
        }
    })
    $(".video_player").videoPlayer({autoplay:true, muted:true});
    $(document).on('click', '#muteBtn.btn-mute', function(){
        $("#muteBtn.btn-mute").not(this).trigger('click');
    })


    var SlideH, mSize = 920;
    if ($(window).width()<mSize) {
        SlideH = 260;
    } else {
        SlideH = 390;
    }

    $(document)
        .on('click', '.itemListElement .detail-overlay .figure-list a', function(){
            var $this = $(this), $a = $this.closest(".itemListElement").find("a.main-link"), url = $a.attr("href"), q = url.indexOf("?");
            if (q < 0) {
                url = url  + '?image=' + $this.data("iid");
            } else {
                var param = $.parseString(url.substr(q+1))
                param['image'] = $this.data("iid");
                url = url.substr(0, q+1) + $.param(param);
            }
            if($(window).width()>920){
                $this
					.closest('.itemListElement')
						.find('.figure-list a').removeClass('current').end()
						.find('.figure').removeClass('fit')
							.find('img').css('background-image','url('+$this.data('image')+')').end()
						.addClass($this.attr('class')).end()
					.end()
				.addClass('current');
                $a.attr('href', url);
            } else {
                location.href = url;
            }
        })
        .on('hover', '.tooltip', function(){
            $(this).find('em').css('margin-left',-$(this).find('em').outerWidth()/2+'px');
        });
        
    if ($(window).width()<mSize) {
        $('[data-mobile_image_url]').each(function(){
            $(this).css('background-image','url('+$(this).data('mobile_image_url')+')');
        });
        $('[data-mobile_video_url]').each(function(){
            $(this).html("<source src='"+$(this).data('mobile_video_url')+ "'/>")[0].load();
        });
    }else{
        $('[data-desktop_image_url]').each(function(){
            $(this).css('background-image','url('+$(this).data('desktop_image_url')+')');
        });
        $('[data-desktop_video_url]').each(function(){
            $(this).html("<source src='"+$(this).data('desktop_video_url')+ "'/>")[0].load();
        });
    }
    $('.summary .bio').find('.bio-wrapper-full').removeAttr('style');


    var slide = $('#slides:not(.noslideshow)').slick({
          infinite: true,
          dots: true,
          fade: false,
          autoplay: true,
          autoplaySpeed: 5000,
        }).on('beforeChange', function(event, slick, currentSlide, nextSlide){
            var $item = $("#slides [data-slick-index="+nextSlide+"]"), isMobile=$(window).width()<=mSize;
            if($item.find("video").length){
                var src = $item.find("video").data(isMobile?'mobile_video_url':'desktop_video_url');
                if(src != $item.find("video source").attr('src')) $item.find('video').html("<source src='"+src+ "'/>")[0].load();
            }else{
                var src = $item.data(isMobile?'mobile_image_url':'desktop_image_url');
                var $slide = $("#slides [data-cover='"+$item.data('cover')+"']");
                $slide.css('background-image','url("'+ src + '")');
            }
        })

    $('.fullscreen').click(function(){
        $('body').toggleClass('fullscreen');
        if ($('body').hasClass('fullscreen')) {
            if ($('#slides').hasClass('noslideshow')) {
                var $current = $(".slide-item");
            }else{
                var $current = $(".slick-active");
            }
            var image_url=$current.data('mobile_image_url'), height=$current.height(), detail=$current.html();
            $('.cover').prepend('<div class="full-cover"><div class="slide-item"><span class="bg" style="background-image:url('+image_url+');"></span>'+detail+'</div></div>');
        }else{
            $('.cover').find('.full-cover').remove();
            $('#slides:not(.noslideshow)')[0] && $('#slides:not(.noslideshow)')[0].slick.setPosition();
            $(window).trigger('resize');
        }
        return false;
    });

    $(window).resize(function(){
        var width = $(window).width(), height = $(window).height(), headerHeight = $('#header').height(), isMobile=width<=mSize;

        if (isMobile) {
            SlideH = 260;
        } else {
            SlideH = 390;
        }
        
        if ($(window).width()<mSize) {
            $('[data-mobile_image_url]').each(function(){
                $(this).css('background-image','url('+$(this).data('mobile_image_url')+')');
            });
            $('[data-mobile_video_url]').each(function(){
                if ($(this).find('source').attr('src') != $(this).data('mobile_video_url')) {
                    $(this).html("<source src='"+$(this).data('mobile_video_url')+ "'/>")[0].load();
                }
            });
        }else{
            $('[data-desktop_image_url]').each(function(){
                $(this).css('background-image','url('+$(this).data('desktop_image_url')+')');
            });
            $('[data-desktop_video_url]').each(function(){
                if ($(this).find('source').attr('src') != $(this).data('desktop_video_url')) {
                    $(this).html("<source src='"+$(this).data('desktop_video_url')+ "'/>")[0].load();
                }
            });
        }
        /*
        if( ($(".summary #slides").height()==SlideH && height-headerHeight-$(".summary").height() < 250) || $(".summary #slides").height()<SlideH){
            var _height = Math.min(SlideH, height-headerHeight-300);
            $(".summary #slides, .summary #slides .slidesjs-container, .summary #slides .slidesjs-container .slidesjs-control").css('height', Math.max(_height, 260)+'px');
        }else{
            $(".summary #slides, .summary #slides .slidesjs-container, .summary #slides .slidesjs-container .slidesjs-control").css('height', SlideH+'px');
        }*/

    }).trigger('resize');
    
    var $win = $(window);
    var $body = $('html,body');

    $.ajaxPage({
        contentSelector : '.store-content',
        scrollTop: false,
        setLoading : function(isLoading){
            if(isLoading) $('.store-content').addClass('loading');
            else $('.store-content').removeClass('loading');
        },
        success : function($content){
            $.infiniteshow({
                itemSelector:'#content ul.itemList > li',
                streamSelector:'#content ul.itemList',
                loaderSelector:'#infscr-loading-dummy',
                dataKey:null,
                post_callback: function($items, restored){ 
                    $items.find(".video_player").videoPlayer({autoplay:true, muted:true});
                    // invoke video initialize code by triggering resize event
                    $win.trigger('resize');
                }
            })
            // invoke video initialize code by triggering resize event
            $body.find(".video_player").videoPlayer({autoplay:true, muted:true});
            $win.trigger('resize');
        }
    })

    $(".page-info")
        .on("mouseover", "ul.tab li", function(e){
			if($(this).find('.subcategories').length<1) return;
			if ($(window).width()<920) return;
			$(this).addClass('hover');
		})
        .on("mouseleave", "ul.tab li", function(e){
			if($(this).find('.subcategories').length<1) return;
			if ($(window).width()<920) return;
			$(this).removeClass('hover');
		})
        .on("click", ".subcategories a[cid], ul.tab a[cid]", function(e){
            e.preventDefault();
            var cid = $(this).attr('cid'), url = location.pathname, args = $.extend({}, location.args), query;

			if ($(this).closest('small').hasClass('subcategories')){
				$(".page-info a").removeClass('current');
				$(".page-info").find('.subcategories').find('a[cid="'+cid+'"]').addClass('current');
				$(".page-info .tab").find('a[cid="'+$(this).closest('.subcategories').attr('cid')+'"]').addClass('current');
				$(this).closest('.subcategories').removeClass('show');
			} else {
				$(this).closest('.tab').find('li > a').removeClass('current');
				$(".page-info").find('a[cid="'+cid+'"]').addClass('current');
				if ($(window).width()<920 && $(this).closest('li').find('.subcategories').length) {
					if ($('.page-info').find('> .subcategories[cid="'+$(this).attr('cid')+'"]').hasClass('show')) {
						$(this).closest('.tab').find('li').removeClass('hover');
						$('.page-info').find('> .subcategories').removeClass('show').slideUp();
					}else{
						$(this).closest('.tab').find('li').removeClass('hover').end().end().closest('li').addClass('hover');
						$('.page-info').find('> .subcategories').removeClass('show').hide();
						$('.page-info').find('> .subcategories[cid="'+$(this).attr('cid')+'"]').addClass('show').slideDown();
					}
				}
			}
			$.ajaxPage.changeParam('category', cid);
			return false;
        })
        .on("change", "select[name='category']", function(e){
            e.preventDefault();
            var cid = $(this).val(), url = location.pathname, args = $.extend({}, location.args), query;

            $.ajaxPage.changeParam('category', cid);
        })
        .on("click", "[name='order_by'] a", function(){
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
        })
        .on("change", "select[name='order_by']", function(){
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
})