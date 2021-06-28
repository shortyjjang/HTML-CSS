jQuery(function($){
	var $win = $(window), $html = $('html'), $sidebar = $('#sidebar'), $content = $('#content'), $clone, top = $sidebar.offset()?$sidebar.offset().top:0, margin = 85;

	if(!$sidebar[0]) return;
	// clone sidebar to get margin left
	$clone = $sidebar.clone().empty();

	$win.scroll(function(event){

		if ($win.width()<700){
			if ($win.height()>$('#checkout').height()) {
				$('#checkout').removeClass('fixed');
			}else{
				if ($win.scrollTop()>$(document).height()-$win.height()-100){
					$('#checkout').addClass('fixed');
				}
			}
		}else{
			var winH = $win.height(), barH = $sidebar.height(), conH = $content.height(), scTop = $win.scrollTop(), toTop = false;
			
			if(conH < barH) return;
			
			toTop = (barH + margin < winH);
			
			function reset(){
				if ($html.hasClass('fixed')) return;
				$sidebar.removeClass('fixed fixedTop fixedBottom').css('margin-left','');
			};

			function updateMargin(){
				var left, sbLeft;
				$clone.insertBefore($sidebar);
				left = $clone.offset().left;
				sbLeft = $sidebar.offset().left;
				if(left != sbLeft) $sidebar.css('margin-left', parseInt($sidebar.css('margin-left'))+left-sbLeft);
				$clone.remove();
			};

			if(toTop) {
				if(scTop + margin > top) {
					$sidebar.addClass('fixed fixedTop').removeClass('fixedBottom');
					updateMargin();
				} else {
					reset();
				}
			} else {
				if(scTop + winH > top + barH) {
					$sidebar.addClass('fixed fixedBottom').removeClass('fixedTop');
					updateMargin();
				} else {
					reset();
				}
			}
		}
	});
	$win.resize(function(){ $win.trigger('scroll') });
});
