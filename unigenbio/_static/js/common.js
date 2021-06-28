
jQuery(function($){
	//페이지메뉴
	$('#header')
	.find('.navigation a').click(function(){
		if ($('#container-wrapper').hasClass('index')) {
			var menu = $(this).attr('href').replace('index.php','');
			if (menu === '#about') menu = '.aboutus';
			$('body').animate({scrollTop: $(menu).offset().top - $('.container').offset().top +'px'});
			if ($(menu).length) return false;
		}
	}).end()
	.find('a.menu').click(function(){
		$(this).closest('#header').toggleClass('open');
		return false;
	});
});