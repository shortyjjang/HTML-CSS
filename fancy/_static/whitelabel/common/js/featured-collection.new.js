$(function(){
    
    var SlideH, mSize = 920;
	$(window).load(function(){
		if (location.hash != '') {
			$(window).scrollTop($(location.hash).offset().top - $('#header').height()-20);
		}
	});
	$('.collections .collection-devider h3 small a[href^="#"]').click(function(){
		$('html,body').animate({
			scrollTop: ($($(this).attr('href')).offset().top - $('#header').height()-20)
		}, 300);
		return false;
	});

    $('.collections .itemListElement .detail-overlay .figure-list a').click(function(){
        var $this = $(this), $a = $this.closest(".itemListElement").find("a.main-link"), url = $a.attr("href"), q = url.indexOf("?");
        if (q < 0) {
            url = url  + '?image=' + $this.data("iid");
        } else {
            var param = $.parseString(url.substr(q+1))
            param['image'] = $this.data("iid");
            url = url.substr(0, q+1) + $.param(param);
        }
        if($(window).width()>920){
            $this.closest('.itemListElement').find('.figure-list a').removeClass('current').end().find('.figure img')
                   .css('background-image','url('+$this.data('image')+')').end().end().addClass('current');
            $a.attr('href', url);
        } else {
            location.href = url;
        }
    });

    if ($(window).width()<mSize) {
        $('[data-mobile_image_url]').each(function(){
            $(this).css('background-image','url('+$(this).data('mobile_image_url')+')');
        });
        $('[data-mobile_video_url]').each(function(){
            $(this).html("<source src='"+$(this).data('mobile_video_url')+ "'/>")[0].load();
        });
		if($('.collection-description .description').height() < 40) {
			$('.collection-description .more').hide();
		}else{
			$('.collection-description .more').css('display','');
		}
    }else{
        $('[data-desktop_image_url]').each(function(){
            $(this).css('background-image','url('+$(this).data('desktop_image_url')+')');
        });
        $('[data-desktop_video_url]').each(function(){
            $(this).html("<source src='"+$(this).data('desktop_video_url')+ "'/>")[0].load();
        });
		if($('.collection-description .description').height() < 49) {
			$('.collection-description .more').hide();
		}else{
			$('.collection-description .more').css('display','');
		}
    }

    $(window).resize(function(){
        var width = $(window).width(), height = $(window).height(), headerHeight = $('#header').height(), isMobile=width<=mSize;
        $(".slide-item").each(function(){
        var $currentSlide = $(this);
            if($currentSlide.find("video").length){
                var src = $currentSlide.find("video").data(isMobile?'mobile_video_url':'desktop_video_url');
                if(src != $currentSlide.find("video source").attr('src')) $currentSlide.find('video').html("<source src='"+src+ "'/>")[0].load();
            }else{
                var src = $currentSlide.data(isMobile?'mobile_image_url':'desktop_image_url');
                $currentSlide.css('background-image','url("'+ src + '")');
            }
        });
        
        if ($(window).width()<mSize) {
            $('[data-mobile_image_url]').each(function(){
                $(this).css('background-image','url('+$(this).data('mobile_image_url')+')');
            });
            $('[data-mobile_video_url]').each(function(){
                if ($(this).find('source').attr('src') != $(this).data('mobile_video_url')) {
                    $(this).html("<source src='"+$(this).data('mobile_video_url')+ "'/>")[0].load();
                }
            });
			if($('.collection-description .description').height() < 40) {
				$('.collection-description .more').hide();
			}else{
				$('.collection-description .more').css('display','');
			}
        }else{
            $('[data-desktop_image_url]').each(function(){
                $(this).css('background-image','url('+$(this).data('desktop_image_url')+')');
            });
            $('[data-desktop_video_url]').each(function(){
                if ($(this).find('source').attr('src') != $(this).data('desktop_video_url')) {
                    $(this).html("<source src='"+$(this).data('desktop_video_url')+ "'/>")[0].load();
                }
            });
			if($('.collection-description .description').height() < 49) {
				$('.collection-description .more').hide();
			}else{
				$('.collection-description .more').css('display','');
			}
        }
    }).trigger('resize');

    
    $('.tooltip').hover(function(){
        $(this).find('em').css('margin-left',-$(this).find('em').outerWidth()/2+'px');
    });

    $(".video_player").videoPlayer({autoplay:true, muted:true});
  
    if ($(window).width()<mSize) {
        var SlideH = 260;
    }else{
        var SlideH = 400;
    }
    $('#slides:not(.noslideshow)').slidesjs({
        width: $(window).width(),
        height: SlideH,
        navigation: {
            effect: "slide"
        },
        pagination: {
            effect: "slide"
        },
        effect: {
            slide: {
                speed: 200
            }
        },
        play: {
        active: false,
        effect: "slide",
        interval: 120004444,
        auto: true,
        swap: false,
        pauseOnHover: true,
        restartDelay: 80004444

      }
    });

    var $win = $(window)
    var $body = $('html,body')

    $.ajaxPage({
        contentSelector : '.featured',
        extraSelector : '.breadcrumbs',
        scrollTop: false,
        setLoading : function(isLoading){
            if(isLoading) $('.featured').addClass('loading');
            else $('.featured').removeClass('loading');
        },
        beforeLoad : function(){
        },
        success : function($content){
            var sortLabel = $('[name=order_by] .selected').text();
            if(sortLabel == 'Default') sortLabel = 'Sort';
            $(".sort").find("a.selected").text( sortLabel );
        },
        complete : function() {
        }
    })

    $("[name='order_by'] a").click(function(){
        event.preventDefault();
        var $this = $(this), url = $this.attr('href');
        $this.closest('small').find('a.selected').removeClass('selected').end().end().addClass('selected');
        if( $(".sort").hasClass('show')) $this.closest('dd').removeClass('opened');
        $.ajaxPage.changeUrl(url);
    });

});
