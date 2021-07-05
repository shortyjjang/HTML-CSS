$(function(){

   
	$('.shop .category ul.after li').each(function(){
		$(this).find('a').hover(function(){
			$('.shop .category ul.after li').removeClass('hover');
			$('.shop .category').removeClass('opened');
			$('.shop .category .sub-menu').hide();
			$(this).parents('li').addClass('hover');if($(this).hasClass('sub')==true){$('#'+$(this).attr('sub-code')).show();$('.shop .category').addClass('opened');}
		});
	});
	$('.shop .category').mouseleave(function(){
		$('.shop .category ul.after li').removeClass('hover');
		$('.shop .category').removeClass('opened');
		$('.shop .category .sub-menu').hide();
	});

	// NOT USED
	// $("#shop_subscribe_button").click(function(){
	// 	var email = $("#shop_subscribe_email").val();

	// 	if(!email){
	// 		alert("Please check your email address.");
	// 		$("#shop_subscribe_email").focus();
	// 		return false;
	// 	}

    //     // see common/util.js to change emailRegEx
	// 	if(email.search(emailRegEx) == -1){
	// 		alert('A valid email address is required');
	// 		$("#shop_subscribe_email").focus();
	// 		return false;
	// 	}

	// 	params = {email:email}
	// 	$.ajax({
	// 		type : 'post',
	// 		url  : '/shop/news-subscribe.json',
	// 		data : params,
	// 		dataType : 'json',
	// 		success : function(json){
	// 			console.log(json);
	// 			if(json && json.status_code==1){
	// 				alert('Thank you for subscribing. Your email address '+email+' has been added to our subscription list and you will start to receive our daily finds');		
	// 			}else{
	// 				alert('We’re unable to add your email address. Please try again later.');		
	// 			}
	// 		},
	// 		error:function (){
	// 		  alert('We’re unable to add your email address. Please try again later.');
	// 		}
	// 	});
	// });
	
	var $menu = $('.shop-v3 .sort .category'), timer = null, prevClass = '';
		$menu
			.on('mouseenter', 'a.category-title', function(event){
				var self = this;
				if ($menu.hasClass('opened')) return;
				//timer = setTimeout(function(){ $(self).click(); }, 500);
				timer =  $(self).click();
			})
			.on('click', 'a.category-title', function(event){
				event.preventDefault();
				clearTimeout(timer);
				$menu.toggleClass('opened');
			})
			.on('mouseleave', function(event){
				clearTimeout(timer);
				if( event.relatedTarget && !$(event.relatedTarget).closest(".category")[0] ){
					$menu.removeClass('opened').find('.category-menu').removeAttr('class').addClass('category-menu');
					$menu.find('a').removeClass('hover').removeClass('none');
				}
			});
			/*.on('mouseover', 'ul > li > a', function(event){
				var $this = $(this), sub = $this.attr('sub-menu');
				if ($this.hasClass('current')==true) {
					$this.removeClass('none');
				}else{
					$this.closest('.category-menu').find('a.current').addClass('none');
				}
				$this
					.closest('.category-menu')
						.find('a.hover').removeClass('hover').end()
					.end()
					.addClass('hover');
			});*/

    // improved submenu ux
    // the algorithm comes from http://bjk5.com/post/44698559168/breaking-down-amazons-mega-dropdown
    (function(){
        var $menu = $('.menu-content'), $items = $menu.find('> ul > li'), mouseLocs=[], $active=$items.filter(".active"), $activeNext=null, timer;

        if (!$menu.length) return;

		$(".category-menu").css({visibility:'hidden',display:'block'});
        $menu.css({visibility:'hidden',display:'block'});

        function cacheMenuOffset() {
            shopMenuOffset = $menu.offset();
            shopMenuOffset.bottom = shopMenuOffset.top + $menu.outerHeight();
            shopMenuOffset.right = shopMenuOffset.left + $menu.outerWidth();
        };
        cacheMenuOffset();

        $('a.category-title').on('mouseover focus', function(){ setTimeout(cacheMenuOffset, 10) });

        $items
            .each(function(){
                var $this = $(this), $sub = $('div.sub-category').css({visibility:'hidden',display:'block'}), offset = $sub.offset(), w = $sub.outerWidth(), h = $sub.outerHeight();
                if(offset){
	                $this.data(
	                    'submenu-offset',
	                    {
	                        top: offset.top - shopMenuOffset.top,
	                        left: offset.left + 561 - shopMenuOffset.left,
	                        bottom: offset.top + h - shopMenuOffset.top,
	                        right: offset.left + 561 + w - - shopMenuOffset.left
	                    }
	                );
	                $sub.css({visibility:'',display:''});
	            }
            })
            .mouseenter(function(event){
                if (!$active || !$active.length) {
                    $(this).trigger('activate');
                } else {
                    $activeNext = $(this);
                }
            })
            .mouseleave(function(event){
                var $this = $(this), loc = mouseLocs[mouseLocs.length - 1], prevLoc = mouseLocs[0], subOffset = $(this).data('submenu-offset'), dest = {x:0,y:0};
                if(!subOffset) return;
				dest.x = subOffset.left + shopMenuOffset.left;

                if (loc.y - prevLoc.y > 0) {
                    dest.y = subOffset.bottom + shopMenuOffset.top;
                } else {
                    dest.y = subOffset.top + shopMenuOffset.top;
                }

                clearTimeout(timer);
                $activeNext = null;

                if (Math.abs(slope(prevLoc, dest)) < Math.abs(slope(loc, dest))) {
                    timer = setTimeout(function(){
                        //if($active) $active.trigger('deactivate');
                        if($activeNext) {
                            $activeNext.trigger('activate');
                        } else {
                        	//if($active) $active.trigger('activate');
                            $menu.parent().trigger('mouseleave');
                        }
                    }, 300);
                } else {
                    $this.trigger('deactivate');
                }
            })
            .on('activate', function(){
            	var $this = $(this), $a = $this.find("a"), sub = $a.attr('sub-menu');
            	$this.closest('.category-menu').removeClass(prevClass);
				
				if ($a.hasClass('current')==true) {
					$a.removeClass('none');
				}else{
					$this.closest('.category-menu').find('a.current').addClass('none');
				}
				$a.closest('.category-menu')
						.find('a.hover').removeClass('hover').end()
					.end()
					.addClass('hover');

				if (sub != null) {
					$this
						.closest('.category-menu')
							.removeClass(prevClass).addClass(prevClass='show-'+sub)
						.end();
				}
                $active = $this;
            })
            .on('deactivate', function(){
                var $this = $(this), sub = $this.find("a").attr('sub-menu');
				$this
					.closest('.category-menu')
						.removeClass("show-"+sub)
					.end()
			    $active = null;
            })
            .on('mouseenter', 'div.sub-category', function(){
                clearTimeout(timer);
            });

		$(".category-menu").css({visibility:'',display:''});
        $menu.css({visibility:'',display:''});
        $menu.parent().mouseleave(function(){
            if (!$active) $(this).removeClass('hover');
        });

        $(document).mousemove(function(event){
            mouseLocs.push({x:event.pageX, y:event.pageY});
            if (mouseLocs.length > 3) {
                mouseLocs.shift();
            }
        });

        function slope(a, b) {
            return (b.y - a.y) / (b.x - a.x);
        };
    })();

});
