jQuery(function($){
    function topOffset($el) { var offset = $el.offset(); return offset ? offset.top : 0; }

	var $win = $(window), $html = $('html'), $sidebar = $('#sidebar'), $content = $('#content'), $clone;
	if(!$sidebar[0]) return;
    var top = topOffset($sidebar), margin = topOffset($('#container-wrapper .container')) + parseInt($('#container-wrapper .container').css('padding-top'));

	// clone sidebar to get margin left
	$clone = $sidebar.clone().empty();

	$win.scroll(function(event){
		var winH = $win.height(), barH = $sidebar.outerHeight(), conH = $content.height(), scTop = $win.scrollTop(), toTop = false;
		
		if(conH < barH) return;
		
		toTop = (barH + margin < winH);
		
		function reset(){
			if ($html.hasClass('fixed')) return;
			$sidebar.removeClass('fixed fixedTop fixedBottom stop').css('top','');
		};

		function updateMargin(){
			var left, sbLeft;
			$clone.insertBefore($sidebar);
			left = $clone.offset().left;
			sbLeft = $sidebar.offset().left;
			$clone.remove();
		};

		if (conH > barH) {
			if(toTop) {
				if(scTop + margin > top) {
					$sidebar.addClass('fixed fixedTop').removeClass('fixedBottom').css('top', margin+'px');
					updateMargin();
					if (scTop > $('#container-wrapper').outerHeight() - $('#footer').outerHeight() - barH - margin) {
						$sidebar.addClass('stop');
					}else{
						$sidebar.removeClass('stop');
					}
				} else {
					reset();
				}
			} else {
				if(scTop + winH > top + barH) {
					$sidebar.addClass('fixed fixedBottom').removeClass('fixedTop').css('top','');
					updateMargin();
					if (scTop > $('#container-wrapper').outerHeight() - $('#footer').outerHeight() - winH) {
						$sidebar.addClass('stop');
					}else{
						$sidebar.removeClass('stop');
					}
				} else {
					reset();
				}
			}
		}
	});
	$win.resize(function(){ $win.trigger('scroll') });
});
