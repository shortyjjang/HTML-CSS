window.show_overlay_on_timeline = function() {
	$('#content')
		.delegate(
			'.figure-product',
			{
				mouseover : function(){
					var $this = $(this), $timeline = $this.find('.timeline');
					if (!$timeline.length) return;

					var $img = $this.find('img'), pos = $img.position(), w = $img.width(), h = $img.height();
					if (w>640) w=640;
					$timeline
						.filter(':hidden').css('opacity',0).end()
						.show()
						.stop()
						.css({width:(w-54)+'px',height:(h-12)+'px',top:pos.top+'px',left:pos.left+'px'})
						.fadeTo(200,1);

					if (h < 110) $timeline.find('.btn-share').hide();
				},
				mouseleave : function(event){
					var $timeline = $(this).find('.timeline').stop().fadeTo(100,0,function(){$timeline.hide()});
				}
			}
		);
};

show_overlay_on_timeline();
