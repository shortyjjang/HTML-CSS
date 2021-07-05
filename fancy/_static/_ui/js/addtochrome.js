(function($){

$(window).load(function(){
	var isChrome = /Chrome\/\d+/i.test(navigator.userAgent), ls = window.localStorage;

 	if( 
		!isChrome ||
		!ls ||
		(ls['hide_extension_box'] && ls['hide_extension_box'] == 'Y') ||
		$('body').hasClass('fancyChrome')
	) return;

	var $atc = $('.addToChrome'), $container = $('#header+.container').animate({'padding-top':'+=55px'},'fast');

	$atc
		.slideDown('fast')
		.find('button.close')
			.click(function(){
				$atc.slideUp('fast').filter(':not(.top)').parent({'padding-top':'-=20px'}, 'fast');
				$container.animate({'padding-top':'-=55px'}, 'fast');
				ls['hide_extension_box'] = 'Y';
			})
		.end()
		.filter(':not(.top)')
		.parent().animate({'padding-top':'+=20px'}, 'fast');
});

})(jQuery);
