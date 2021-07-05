jQuery(function($){
	var $result = $('#content > .search-result'), callback = null;

	if ($result.hasClass('thing')) {
		function adjustTitleWidth($new_items){
			if (!$new_items) $new_items = $result.find('.stream-item');
			if (!$new_items.find) return;
			$new_items.find('figure:has(b.price)').each(function(){
				var $this = $(this);
				$this.find('>figcaption').width( $this.width() - $this.find('>.price').width() - 5 );
			});
			$new_items.filter(':nth-child(4n+1)').addClass('clear');
		}
		adjustTitleWidth();
		callback = adjustTitleWidth;
	} else if ($result.hasClass('people')) {
		function searchPeople($new_items){
			if (!$new_items) $new_items = $result.find('.stream-item');
			$new_items.find('.photo img').load(function(){
				var $this = $(this);
				if($this.width()>$this.height()){
					$this.height('100px').css('margin-left',-($this.width()-100)/2+"px");
				}else{
					$this.width('100px').css('margin-top',-($this.height()-100)/2+"px");
				}
			});
		}
		searchPeople();
		$result.find('.photo img').trigger('load');
		callback = searchPeople;
	} else if ($result.hasClass('collections')) {
		$result
			.find('>.customize')
				.delegate('a', 'click', function(event){
					event.preventDefault();

					var $this = $(this), $list = $result.find('ul.stream.collection-list:first');
					if($this.hasClass('img_')){
						$list.addClass('showing-img');
					} else if($this.hasClass('list_')){
						$list.removeClass('showing-img');
					}
					$this.addClass('current').siblings().removeClass('current');
				})
			.end();
	}

	$.infiniteshow({itemSelector:'#content .stream > .stream-item', post_callback: callback});
});
