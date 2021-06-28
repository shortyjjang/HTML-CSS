$(function(){

	$('#popup_container')
		.on('click', function(event){
			if(event.target === this) {
				$(this).hide().removeAttr('class');
			}
		});
	$('.popup .ly-close')
		.on('click', function(event){
				$(this).closest('#popup_container').hide().removeAttr('class');
		});

	$(window).scroll(function(){
		if ($(window).scrollTop()>1) {
			//$('#header').addClass('hide_nav');
		}
		if ($(window).scrollTop()<82) {
			//$('#header').removeClass('hide_nav');
			//$('#header .header-featured').css('transform','translateY('+ -$(window).scrollTop() +'px');
		}else{
			//$('#header').addClass('hide_nav');
			//$('#header .header-featured').css('transform','translateY(-82px');
		}
	});

	if ($(window).width()<771) {
		$('.navigation').height($('#container-wrapper').outerHeight()-$('#header').height()).find('.subMenu').height('');
		$('#header .menuPrincipal li').click(function(){
			$(this).toggleClass('hover');
		});
		$('.search .category .tit, #header .navigation nav.service > a, #header .navigation .category > a, #header .navigation .category .subDetailMenu > a, #header .navigation .subMenu .inner > li > a, #header .navigation .promoHeader > a').click(function(){
			$(this).closest('nav,div, li').toggleClass('hover');
			return false;
		});
	}else{
		$('.navigation').height('').find('.subMenu').height($('#container-wrapper').outerHeight()-$('#header').height());
		$('.booking .item-share .more-share-sns a').hover(function(){
			$(this).find('small').css('margin-left',-($(this).find('small').outerWidth()/2)+'px');
		});
		$('.card-product, #header .menuPrincipal li, #header .navigation .category .subMenuList > li, .index .service .inner > ul > li').hover(function(){
			$(this).addClass('hover');
		},function(){
			$(this).removeClass('hover');
		});

		$('#header .navigation nav').hover(function(){
			$(this).addClass('hover');
		},function(){
			$(this).find('.subMenuWrapper').removeClass('hover').find('.subDetailMenu').hide().closest('nav').removeClass('hover');
		})
		.find('.trick').click(function(){
			$(this).closest('nav').removeClass('hover');
			$(this).closest('nav').find('.subMenuWrapper').removeClass('hover').find('.subDetailMenu').hide();
			setTimeout(function(){
				$(this).closest('nav').removeClass('hover');
			},220);
		}).end()
		.find('.subMenuList a').hover(function(){
			$(this).closest('.subMenu').find('.subMenuWrapper').addClass('hover').end().find('.subDetailMenu').hide().end().find('.subDetailMenu[data-sub="'+$(this).attr('class')+'"]').show();
		});
	}
	$(window).resize(function(){
		if ($(window).width()<771) {
			$('.navigation').height($('#container-wrapper').outerHeight()-$('#header').height()).find('.subMenu').height('');
			$('#header .menuPrincipal li').click(function(){
				$(this).toggleClass('hover');
			});
			$('.search .category .tit, #header .navigation nav.service > a, #header .navigation .category > a, #header .navigation .category .subDetailMenu > a, #header .navigation .subMenu .inner > li > a, #header .navigation .promoHeader > a').click(function(){
				$(this).closest('nav,div, li').toggleClass('hover');
				return false;
			});
		}else{
			$('.navigation').height('').find('.subMenu').height($('#container-wrapper').outerHeight()-$('#header').height());
			$('.booking .item-share .more-share-sns a').hover(function(){
				$(this).find('small').css('margin-left',-($(this).find('small').outerWidth()/2)+'px');
			});
			$('.card-product, #header .menuPrincipal li, #header .navigation .category .subMenuList > li, .index .service .inner > ul > li').hover(function(){
				$(this).addClass('hover');
			},function(){
				$(this).removeClass('hover');
			});

			$('#header .navigation nav, #header .navigation .category').hover(function(){
				$(this).addClass('hover');
			},function(){
				$(this).find('.subMenuWrapper').removeClass('hover').find('.subDetailMenu').hide().closest('nav').removeClass('hover');
			})
			.find('.trick').click(function(){
				$(this).closest('nav').removeClass('hover');
				$(this).closest('nav').find('.subMenuWrapper').removeClass('hover').find('.subDetailMenu').hide();
				setTimeout(function(){
					$(this).closest('nav').removeClass('hover');
				},220);
			}).end()
			.find('.subMenuList a').hover(function(){
				$(this).closest('.subMenu').find('.subMenuWrapper').addClass('hover').end().find('.subDetailMenu').hide().end().find('.subDetailMenu[data-sub="'+$(this).attr('class')+'"]').show();
			});
		}
	});

	$(".slideshow")
		.data('index', 1)
		.data('max-index', $(".slideshow ul li").length )
		.on('slide', function(e, index, direction){
			if(index < 1) index = $(".slideshow").data('max-index');
			if(index > $(".slideshow").data('max-index')) index = 1;

			var $current = $(".slideshow").find("li.current");
			var $next = $('.slideshow').find("li:eq("+(index-1)+")");
			if(!$next.length) return;

			$current.removeClass('current');
			$next.addClass('current');
			$(".slideshow").data('index', index);
			if(direction=='left'){
				$current.animate({left:'100%'}, 300);
				$next.css('left','-100%');
			}else{
				$current.animate({left:'-100%'}, 300);
				$next.css('left','100%');
			}
			$next.animate({left:'0'}, 300).closest(".slider__index").find('style').html('.slider__index svg path {fill: '+$next.data('btn')+';}');;
		})
		.parent()
			.on('click', 'a.prev', function(e){
				e.preventDefault();
				var index = $(".slideshow").data('index');
				index--;
				$(".slideshow").trigger('slide', [index, 'left']);
			})
			.on('click', 'a.next', function(e){
				e.preventDefault();
				var index = $(".slideshow").data('index');
				index++;
				$(".slideshow").trigger('slide', [index, 'right']);
			})
		.end()

	function isMobile() {
	  try{ document.createEvent("TouchEvent"); return true; }
	  catch(e){ return false; }
	}

	$.fn.slidable = function(){
		var $this = $(this);
		var $ul = $this.find('ul');
		if(isMobile()){
			$this.find('a.prev, a.next').hide().end().css({'overflow':'auto','-webkit-overflow-scrolling':'touch'});
			return;
		}

		if( $this.find('a.prev').length ){
			function itemPerPage(){
				var itemPerPage = $this.width() / $this.find("li:eq(1)").width();
				if( itemPerPage % 1 < 0.15) itemPerPage = Math.floor(itemPerPage);
				else itemPerPage = Math.ceil(itemPerPage);
				return itemPerPage;
			}
			$this.data('index', 1)
				.on('slide', function(e, index){
					var $next = $this.find("li:eq("+(index-1)+")");
					if(!$next.length) return;

					var left = $next.position().left;
					var scrollWidth = $ul[0].scrollWidth;
					var width = $ul.width();
					if( scrollWidth - left <= width){
						left = scrollWidth-width;
						$this.find('a.next').hide();
					}else{
						$this.find('a.next').show();
					}
					if( left==0){
						$this.find('a.prev').hide();	
					}else{
						$this.find('a.prev').show();	
					}

					$this.data('index', index);
					$ul.animate({left: (0-left)+'px'}, 300);
				})
				.on('click', 'a.prev', function(e){
					e.preventDefault();
					var index = $this.data('index');
					index -= (itemPerPage()-1);
					$this.trigger('slide', [index]);
				})
				.on('click', 'a.next', function(e){
					e.preventDefault();
					var index = $this.data('index');
					index += (itemPerPage()-1);
					$this.trigger('slide', [index]);
				})

		}else if( $this.is(".autoscroll") ){
			var reverse = false;
			var isPaused = false;
			function autoslide(autoreverse){
				isPaused = false;
				var currentLeft = parseInt($ul.css('left'));
				var scrollWidth = $ul[0].scrollWidth;
				var width = $ul.width();
				var left = 0-(scrollWidth-width);
				if(reverse){
					left = 0 ;
				}

				$ul.stop().animate({left: left+'px'}, Math.abs(currentLeft-left)*10, 'linear', function(){
					if(isPaused || !autoreverse) return;
					reverse = !reverse;
					autoslide(true);
				})
			}
			$this
				.hover(function(e){
					isPaused = true;
					$ul.stop();
				}, function(){
					$ul.stop();
					autoslide(true);
				})
				.mousemove(function(e){
					var width = $(window).width();
					var cursor = e.clientX;
					if( cursor < width/4 ){
						if( !isPaused && reverse) return;
						reverse = true;
						autoslide(false);
					}else if(cursor > width*3/4){
						if( !isPaused && !reverse) return;
						reverse = false;
						autoslide(false);
					}else{
						isPaused = true;
						$ul.stop();
					}
				})
			autoslide(true);
		}

	}
	
	$(".sliding").each(function(){
		$(this).slidable();
	})
	
});