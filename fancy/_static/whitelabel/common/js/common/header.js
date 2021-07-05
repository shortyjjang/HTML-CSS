jQuery(function($){
	$('html').removeClass('menu');

	var menuTimer, sc;
	$('#header')
		.find('.m_menu').click(function(){
			$('.navigation').removeClass('submenu').find('.menu-wrapper').css('height','').end().find('.dropdown').removeClass('show');
			if ($('html').hasClass('menu')) {
				sc = $('#wrap > #container-wrapper').position().top;
				$('html').removeClass('menu');
				$('#wrap > #container-wrapper').css('top','');
				$(window).scrollTop(-sc);
			}else{
				sc = $(window).scrollTop();
				$('html').addClass('menu');
				$('#wrap > #container-wrapper').css('top',-sc+'px');
			}
			return false;
		}).end()
		.find(".menu li").hover(function(){
			if ($(window).width()>800 || $(this).hasClass('more')) {
				var $this = $(this), $currentLi = $(this).closest('.menu').find('li.hover');
				if(menuTimer) clearTimeout(menuTimer);
				if ($(this).hasClass('more') && $(window).width() < 720) return;
				if($currentLi.length && $currentLi[0]!=this){
					$currentLi.removeClass('hover');
					$('#header .dropdown.'+$currentLi.find('a').data('submenu')).removeClass('show');
					$this.addClass('hover');
					$('#header .dropdown.'+$this.find('a').data('submenu')).addClass('show');
				}else{
					menuTimer = setTimeout(function(){
						$this.addClass('hover');
						$('#header .dropdown.'+$this.find('a').data('submenu')).addClass('show');
					},300)
				}
			}
		}, function(e){
			if( $(e.relatedTarget).hasClass('show') ) return;
			if ($(window).width()>800 || $(this).hasClass('more')) {
				var $this = $(this);
				if(menuTimer) clearTimeout(menuTimer);
				if ($(this).hasClass('more') && $(window).width() < 720) return;
				menuTimer = setTimeout(function(){
					$this.removeClass('hover');
					$('#header .dropdown.'+$this.find('a').data('submenu')).removeClass('show');
				},200)
			}
		}).end()
		.find(".dropdown")
			.mouseenter(function(e){
				if(menuTimer) clearTimeout(menuTimer);
			})
			.mouseleave(function(e){
				if( $(e.relatedTarget).is('ul.menu *') ) return;
				var $this = $(this), $currentLi = $(this).closest('.scrolling').find('li.hover');
				if($currentLi.length){
					menuTimer = setTimeout(function(){
						$currentLi.removeClass('hover');
						$('#header .dropdown.'+$currentLi.find('a').data('submenu')).removeClass('show');
					},200);
				}
			})

	$('.navigation')
		.find('.close_menu').click(function(){
			var sc = $('#wrap > #container-wrapper').position().top;
			$('html').removeClass('menu');
			$(this).closest('.navigation')
				.removeClass('submenu')
				.find('.menu-wrapper').css('height','').end()
				.find('.dropdown').removeClass('show');
			$('#wrap > #container-wrapper').css('top','');
			$(window).scrollTop(-sc);
			return false;
		}).end()
		.find('li > a').click(function(){
			if ($(window).width() < 720 && $(this).data('submenu') && $(this).data('submenu').length > 0) {
				$(this).closest('.navigation')
					.addClass('submenu')
					.find('.menu-wrapper').height($(this).closest('.navigation').find('.dropdown.'+$(this).data('submenu')+' dl').height()).end()
					.find('.dropdown.'+$(this).data('submenu')).addClass('show').end();
				return false;
			}
		}).end()
		.find('.dropdown dt a').click(function(){
			if ($(window).width()<720) {
				$(this).closest('.navigation')
					.removeClass('submenu')
					.find('.menu-wrapper').height('').end()
					.find('.dropdown').removeClass('show').end()
				return false;
			}
	});

    $('#header .lang > a,#footer .lang > a').click(function(event) {
		$(this).closest('.lang').toggleClass('opened');
		return false;
    });

    $('#header .lang small a,#footer .lang small a').click(function(event) {
        event.preventDefault();
        var lang_code = $(this).attr('href').replace(/[^a-z]/,'');
        if(!lang_code.match(/^[a-z]{2}$/)) return;

        $.cookie.set('lang',lang_code,14);
        location.reload();
    });

	$(window).resize(function(){
		if ($(window).width() < 720 ){
			if ($('html').hasClass('menu')) {
				$('.navigation').find('.menu-wrapper').css({height:''},function(){
					$('.navigation.submenu').find('.menu-wrapper').height($('body > .navigation .dropdown.show dl').height());
				});
			}
		}else{
			$('#wrap > #container-wrapper').css('top','');
		}
	});
});
