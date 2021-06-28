
jQuery(function($){
	//header 메뉴 열기
	var $header = $('#header'), $nav = $header.find('.submenu'), nav_timer = true;
	$header
	.on('mouseleave','.navigation',function(){
		if ($(window).width() < 900 || nav_timer === false) return;
		nav_timer = setTimeout(function(){
			$nav.slideUp('100')
		},100);
	})
	.on('mouseover','.navigation',function(){
		if ($(window).width() < 900) return;
		nav_timer = false;
		$nav.slideDown('100', function(){
			nav_timer = true;
		});
	})
	.on('click','li > a', function(){
			if ($(window).width() > 900) return;
			$(this).closest('li').toggleClass('opened');
			if ($(this).closest('li').hasClass('opened')) {
				$(this).closest('li').find('small').slideDown();
			}else{
				$(this).closest('li').find('small').slideUp();
			}
			return false;
	})
	.on('click','.menu', function(){
		$header.toggleClass('open');
		if ($(window).width() < 900) return;
		nav_timer = false;
		if ($header.hasClass('open')) {
			$nav.slideDown('100');
		}else{
			$nav.slideUp('100',function(){
				nav_timer = true;
			});
		}
		return false;
	});
});

//서브메뉴 전용
jQuery(function($){
	if ($('body').hasClass('index')) return;

	// breadcrumb
	var depth1 = (parseInt($('#content').attr('main-menu')) - 1), depth2 = (parseInt($('#content').attr('sub-menu')) - 1), $nav = $('#header .navigation li:eq('+depth1+')'), $mainmenu = $nav.find('> a'), $sub = $nav.find('.submenu');

	if (depth1 === 4) $sub = $('#footer .privacy-menu');
	var $submenu = $sub.find('a:eq('+depth2+')')


	for (i=0;i<$('#header .navigation li').length ;i++ ) {
		var $menu = $('#header .navigation li:eq('+ i +') > a');
		$('.breadcrumb .main-menu small').append('<a href="'+$menu.attr('href')+'">'+$menu.text()+'</a>');
	}

	$('.breadcrumb').find('.breadcrumb-menu > a').on('click',function(){
		$(this).closest('.breadcrumb-menu').toggleClass('open');
		return false;
	});

	if (depth1 === 4) {
		$('.breadcrumb').find('.main-menu').find('>a').attr('href','#').text('이용약관')
	}else{
		$('.breadcrumb').find('.main-menu')
			.find('>a').attr('href',$mainmenu.attr('href')).text($mainmenu.text()).end()
			.find('>small a:eq('+depth1+')').addClass('current').end();
		$mainmenu.addClass('current');
	}

	$('.breadcrumb').find('.sub-menu')
		.find('>a').attr('href',$submenu.attr('href')).text($submenu.text()).end()
		.find('small').html($sub.html()).end()
	$submenu.addClass('current');

	$('.page-cover').height($(window).height()*0.3);

	//텍스트 슬라이딩 애니메이션
	var $window = $('body'), $section = $('#content > *'), parxTop = [], marginT = parseInt($('#container-wrapper').css('padding-top')), availH = $(window).height() - marginT;

	$section.each(function(){
		$(this).attr('section-offset', $(this).offset().top - marginT);
	});
	$('body').scroll(function(){
		$section.each(function(){
			if ($('.mngparx_container').length > 0 || depth1 === 4) return;
			var sc = $('body').scrollTop(), max = $(document).height() - availH;
			if (sc > parseInt($(this).attr('section-offset')) - availH) {
				$(this).addClass('show');
			}else if (max < sc) {
				$(this).addClass('show');
			}
		});
	});
});