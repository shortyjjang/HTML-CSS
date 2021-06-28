jQuery(function($){

	$.fn.tabPage = function() {
		this.on('click', 'a.link_', function(event){
			event.preventDefault();

			var $tab = $(event.delegateTarget), $link = $(this), $links = $tab.find('a.link_'), $pages;

			$links.removeClass('current').each(function(){
				var $page = $(this.getAttribute('href'));
				$pages = $pages ? $pages.add($page) : $page;
			});
			$pages.removeClass('current');

			$link.addClass('current');
			$($link.attr('href')).addClass('current');
		});

		this.each(function(){ $(this).find('a.link_:first').click() });
	};

	$('[data-component="tabpage"]').tabPage();

});
