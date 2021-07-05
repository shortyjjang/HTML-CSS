// In homepage, check whether there are some news.
jQuery(function($){
	var $stream = $('.stream'), $notibar = $('.new-content'), $counter = $notibar.find('span');

	function check(no_timer) {
		var ts = $stream.attr('ts'), c = +(new Date);

		//if (!ts) return;
		//don't stop timer when ts is null for new-timeline
		if (!ts || !no_timer) return setTimeout(function(){ check(true) }, 30000);

		var url = $stream.data('feed-url') || '/user-stream-updates?';
		$.ajax({
			url : url + '&ts='+ts+'&c='+c,
			dataType : 'html',
			success : function(data){
				if (!data) return check();
				if(url && url != $stream.data('feed-url')) return check(); // when the feed-url is changed

				var $data = $(data), $items = $data.filter('li'), new_ts = $data.filter('input').val(), count=0;
				if (!$items.length || !new_ts) return check();

				count = parseInt($notibar.find('span').text(), 10) + $items.length;
				$stream.attr('ts', new_ts).data('extra-feed-items', $items.add($stream.data('extra-feed-items')||[]));
				var top = 42;
				$notibar.html( gettext((count>1)?'{{num}} new things':'{{num}} new thing').replace('{{num}}', '<span>'+count+'</span>') ).show().css('top',top+'px');
				show_overlay_on_timeline();

				$(".sorting a.current").attr("data-ts",new_ts);

				// empty cache for new timeline
				if(sessionStorage){
					sessionStorage.removeItem("feed-all");
					sessionStorage.removeItem("feed-featured");
					sessionStorage.removeItem("feed-following");					
					//sessionStorage.removeItem("feed-suggestions");
				}
				check();
			},
		});
	}

	// requests after 12 seconds
	check();

	$notibar.click(function(){
		var $extras = $stream.data('extra-feed-items');//.hide();

		$stream.prepend($extras).data('extra-feed-items', null);
		//$extras.fadeIn('fast');

		$notibar.css('top',0).hide();//hide();
		$counter.text(0);

		// save streaam data
		$(window).trigger('savestream.infiniteshow');

		// scroll to top
		$("#scroll-to-top").trigger("click");

		return false;
	});
});
