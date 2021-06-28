
jQuery(function($){
	//첫번째 슬라이드쇼
	var $feature = $('.feature'), max = $feature.find('.slide-item').length;
	$feature
		.find('.paging a').click(function(){slideIntro($(this).index()-1);return false;}).end()
		.find('.slide-wrap').append('<div class="slide-item">'+$feature.find('.slide-item:eq(0)').html()+'</div>')
			.find('.slide-item:last-child').css('background-image','url('+$feature.find('.slide-item:eq(0)').data('background')+')').end()
		.end()
		.find('a.prev').click(function(){
			if ($feature.find('.paging a.current').index() === 0) {
				slideIntro(max-2);
			}else{
				slideIntro($feature.find('.paging a.current').index()-2);
			}
			return false;
		}).end()
		.find('a.next').click(function(){
			slideIntro($feature.find('.paging a.current').index());
			return false;
		}).end();

	function slideIntro(num){
		clearTimeout(timer);
		num = num + 1;
		if (num === max) {
			$feature.find('.slide-wrap').animate({left: num * -100 +'%'},'100',function(){
				$feature.find('.slide-wrap').css('left','0');
			});
			num = 0;
		}else{
			$feature.find('.slide-wrap').animate({left: num * -100 +'%'},'100');
		}
		$feature.find('.paging').find('a').removeClass('current').end().find('a:eq('+num+')').addClass('current');
		timer = setTimeout(function(){
			slideIntro(num);
		},6000);
	}

	var timer = setTimeout(function(){
		slideIntro(0);
	},6000);
});
jQuery(function($){
	//서비스 슬라이드쇼
	var $service = $('.service'), total = $service.find('.slide-item').length;
	$service
		.find('a.next').click(function(){
			if (parseInt($service.find('.paging b').text()) < total) {
				slideService('next',parseInt($service.find('.paging b').text())+1);
			}else {
				slideService('next',1);
			}
			return false;
		}).end()
		.find('a.prev').click(function(){
			if (parseInt($service.find('.paging b').text()) !== 1) {
				slideService('prev',parseInt($service.find('.paging b').text()) - 1);
			}else {
				slideService('prev',parseInt(total));
			}
		});

	function slideService(position,num){
		var num = parseInt(num), $current = $service.find('.slide-item:eq('+num+')').prev(), delay = 400, position = position;
		if (num === total) $service.find('.slide-item:last-child');
		var background = $current.data('background');
		$service.find('.section-wrapper').css('background',background);

		if (position == 'next') {
			if (num === total) {
				$service.find('.slide-item:last-child').css('visibility','visibile').animate({left:'0'},400)
					.prev().css({visibility:'hidden',left:'0'}).css('visibility','visible').animate({left:'-100%'},400).prev().css('visibility','hidden').end()
				$service.find('.slide-item:eq(0)').css({visibility:'hidden',left:'200%'}).css('visibility','visible').animate({left:'100%'},400).next().css('visibility','hidden').end()
			}else{
				$current.css('visibility','visibile').animate({left:'0'},400)
					.next().css({visibility:'hidden',left:'200%'}).css('visibility','visible').animate({left:'100%'},400).next().css('visibility','hidden').end().end()
					.prev().css({visibility:'hidden',left:'0'}).css('visibility','visible').animate({left:'-100%'},400).prev().css('visibility','hidden').end()
				if (num === 1) {
					$service.find('.slide-item:last-child').css({visibility:'hidden',left:'0'}).css('visibility','visible').animate({left:'-100%'},400).prev().css('visibility','hidden').end()
				}
			}
		}else {
			if (num === 1) {
				$current.css('visibility','visibile').animate({left:'0'},400)
					.next().css({visibility:'hidden',left:'0'}).css('visibility','visible').animate({left:'100%'},400).next().css('visibility','hidden').end().end()
				$service.find('.slide-item:last-child').css({visibility:'hidden',left:'-200%'}).css('visibility','visible').animate({left:'-100%'},400).prev().css('visibility','hidden').end()
			}else if (num === total) {
				$service.find('.slide-item:last-child').css('visibility','visibile').animate({left:'0'},400)
					.prev().css({visibility:'hidden',left:'-200%'}).css('visibility','visible').animate({left:'-100%'},400).prev().css('visibility','hidden').end()
				$service.find('.slide-item:eq(0)').css({visibility:'hidden',left:'0'}).css('visibility','visible').animate({left:'100%'},400).next().css('visibility','hidden').end().end()
			}else{
				$current.css('visibility','visibile').animate({left:'0'},400)
					.next().css({visibility:'hidden',left:'0'}).css('visibility','visible').animate({left:'100%'},400).next().css('visibility','hidden').end().end()
					.prev().css({visibility:'hidden',left:'-200%'}).css('visibility','visible').animate({left:'-100%'},400).prev().css('visibility','hidden').end()
			}
		}

		$service.find('.paging').find('b').text(num).end().find('span').text('/ '+total);
		if ((num + 1) < 10) $service.find('.paging').find('b').text('0' + num);
		if (total < 10) $service.find('.paging').find('span').text('/ 0' + total);
	}

	slideService('next',1);
});
jQuery(function($){
	//테크놀러지 애니메이션
	$('.technology').addClass('reset');
	$('body').scroll(function(){
		if ($(this).scrollTop() > $('.technology').offset().top - $('#container-wrapper').offset().top - $(window).height()/2 ) {
			$('.technology').addClass('ani').addClass('show');
		}
	});
});
jQuery(function($){
	//about 탭
	$('.aboutus .paging a').click(function(){
		var bg = $('.aboutus').find($(this).attr('href')).data('background');
		$(this).closest('.aboutus')
			.find('h2').text($(this).text()).end()
			.find('.inner').hide().css('margin-top','').end()
			.find($(this).attr('href')).show().end()
			.find('.paging a').removeClass('current').end()
			.find('.section-wrapper').css('background-image',"url('"+bg+"')").end()
		.end()
		.addClass('current');
		if ($(this).attr('href') === '#algorithms') {
			$(this).closest('.aboutus').find('h2, .paging').addClass('dark');
		}else{
			$(this).closest('.aboutus').find('h2, .paging').removeClass('dark');
		}
		$('.aboutus .about dl').css('margin-top','').css('margin-top',($('.aboutus').height() - parseInt($('.aboutus .section-wrapper').css('padding-top')) - $('.aboutus .about').height()) * 0.33 +'px');
		return false;
	});
});
jQuery(function($){
	//전체 레이아웃
	$('.section').each(function(){
		$(this).removeAttr('style').css('min-height',$(window).height() - $('#header').height() +'px');
		if ($(this).hasClass('intro')) {
			$(this)
				.find('h2').css('margin-top', ($(this).height()/2 - $(this).find('h1').height()/2 - $(this).find('p').height() - $(this).find('h2').height())/2 +'px').end()
				.find('h1').css('margin-top', ($(this).height()/2 - $(this).find('h1').height()/2 - $(this).find('p').height() - $(this).find('h2').height())/2 + $(this).find('p').height() + $(this).find('h2').height() + 'px');
		} else if ($(this).hasClass('feature')) {
			$(this)
				.find('.slide-wrap').css('min-height',$(window).height() - $('#header').height() +'px')
					.find('.slide-item').width($(this).width()).end()
				.width($(this).width() *  $(this).find('.slide-item').length);
		} else if ($(this).hasClass('aboutus')) {
			$(this).find('.about dl').css('margin-top','').css('margin-top',($(this).height() - parseInt($(this).find('.section-wrapper').css('padding-top')) - $(this).find('.about').height()) * 0.33 +'px');
		}
		if (location.hash == '#'+$(this).attr('id')) {
			$('body').animate({scrollTop: $(location.hash).offset().top - $('.container').offset().top+'px'});
		}
	});
	$(window).resize(function(){
		$('.section').each(function(){
			$(this).removeAttr('style').css('min-height',$(window).height() - $('#header').height() +'px');
			if ($(this).hasClass('intro')) {
				$(this)
					.find('h2').css('margin-top', ($(this).height()/2 - $(this).find('h1').height()/2 - $(this).find('p').height() - $(this).find('h2').height())/2 +'px').end()
					.find('h1').css('margin-top', ($(this).height()/2 - $(this).find('h1').height()/2 - $(this).find('p').height() - $(this).find('h2').height())/2 + $(this).find('p').height() + $(this).find('h2').height() + 'px');
			} else if ($(this).hasClass('feature')) {
				$(this)
					.find('.slide-wrap').css('min-height',$(window).height() - $('#header').height() +'px')
						.find('.slide-item').width($(this).width()).end()
					.width($(this).width() *  $(this).find('.slide-item').length);
			} else if ($(this).hasClass('aboutus')) {
				$(this).find('.about dl').css('margin-top','').css('margin-top',($(this).height() - parseInt($(this).find('.section-wrapper').css('padding-top')) - $(this).find('.about').height()) * 0.33 +'px');
			}
		});
	});
});
