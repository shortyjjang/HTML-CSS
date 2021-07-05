jQuery(function($){
	var $graph = $('.graph'), $bar = $graph.find('.bar'), $num = $bar.find('.bubble > b'), credit = parseInt($num.text()) || 0;

	if (!credit) return;

	$graph.addClass('show');

	function getWidth(){
		var prev_v = 0, prev_w = 0, w = $bar[0].parentNode.offsetWidth - 6;

		$graph.find('ol > li').each(function(idx,el){
			var num = parseInt($(this).attr("data"));
			if (credit == num) {
				w = this.offsetLeft - 2;
				return false;
			} else if (credit < num) {
				w = (credit-prev_v)/(num-prev_v)*(this.offsetLeft - prev_w) + prev_w - 2;
				return false;
			} else {
				prev_v = num;
				prev_w = this.offsetLeft;
			}
		});

		return w;
	}

	$(window).resize(function(){
		$bar.css('width',getWidth()+'px');
	});

	$(window).load(function(){
		var progress = 0;

		$bar.css('width', getWidth()+'px');
		(function(){
			$num.text((credit*progress)>>0);
			if (progress < 1) setTimeout(arguments.callee, 50);
			progress = Math.min(progress+0.1, 1);
		})();
	});
});
