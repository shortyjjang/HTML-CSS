jQuery(function($){
    var $win = $(window), $stream = $('ol.stream'), $func, $btnShare, $items, itemW, itemH, itemT, winH, resizeTimer, htmlCache;
	var COLS = 3;

	$items = $stream.find('>li');
	if(!$items.eq(0).length) return;

	itemW  = $items.eq(0).outerWidth();
	itemH  = $items.eq(0).outerHeight();
	itemT  = $items.eq(0).offset().top;
	winH   = $win.height();

	// function buttons
	$func = $('<span class="buttons" />')
		.append('<span class="show_cart"><button class="btn-cart"><span class="icon"></span></button></span>')
		.append('<button type="button" class="btn-share" action="buy"><i class="icon"></i></button>');
	$btnCart = $func.find('button.btn-cart');
	$btnShare = $func.find('button.btn-share'); 

	// show share icon
	$stream.on('mouseover', '.figure-item', function(){
		var $this = $(this), $li = $this.closest('li[tid]');

		if (!$li.length) {
			$func.remove();
			return;
		}
		if( $this.attr('data-id') ){
			$btnCart.data('updateAttrs', function() {
				var attrs, attr, i = 0;
				attrs = $this[0].attributes;
				while(attr = attrs[i++]){
					if (/^(class|style)$/i.test(attr.nodeName.toLowerCase())) continue;
					$btnCart.attr(attr.nodeName, attr.nodeValue);
				}
			});
			$btnCart.show();
		}else{
			$btnCart.hide();
		}
		$btnShare.data('updateAttrs', function() {
			var attrs, attr, i = 0;
			attrs = $li[0].attributes;
			while(attr = attrs[i++]){
				if (/^(class|style)$/i.test(attr.nodeName.toLowerCase())) continue;
				$btnShare.attr(attr.nodeName, attr.nodeValue);
			}
		});
		if(!$this.find("span.buttons").length)
			$func.appendTo(this);
	});
	
	$win
		.resize(function(){
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function(){
				winH = $win.height();
				$win.trigger('scroll');
			}, 100);
		})
		.scroll(function(){
			return;
			var $children, rowMax, rowIdx, startRow, endRow, rowsInViewport, prevRowIdx, prevStartRow, prevEndRow;

			rowMax = Math.ceil($items.length / COLS);
			rowsInViewport = Math.max(Math.ceil(winH / itemH), 5);

			rowIdx   = Math.min(Math.max(Math.floor(($win.scrollTop() - itemT) / itemH), 0), rowMax); // the first row in the viewport
			startRow = Math.max(rowIdx - rowsInViewport, 0);
			endRow   = Math.min(rowIdx + rowsInViewport * 2, rowMax);
			
			prevRowIdx = $win.data('prev-row-idx') || -1;
			if (rowIdx == prevRowIdx) return;
			
			$children = $stream.children();

			prevStartRow = parseInt($children.eq(0).css('top')) / itemH;
			prevEndRow = parseInt($children.eq(-1).css('top')) / itemH;

			if (ordered(startRow, prevStartRow, endRow) && prevEndRow >= endRow) {
				$children.slice((endRow - prevStartRow) * COLS).remove();
				$items.slice(startRow*COLS, prevStartRow*COLS).prependTo($stream);
			} else if (ordered(startRow, prevEndRow, endRow) && prevStartRow <= startRow) {
				$children.slice(0, (startRow - prevStartRow) * COLS).remove();
				$items.slice(prevEndRow*COLS).appendTo($stream);
			} else {
				$stream.empty().append($items.slice(startRow*COLS, endRow*COLS));
			}

			$win.data('prev-row-idx', rowIdx);
		});

	// cache
	(function(){
		var key = 'tmp1.profile.'+$stream.attr('loc'), $nav = $('.pagination'), cached, html;

		// save cache
		$win.on('unload', function(){
			$.jStorage.set(
				key,
				{
					ts     : $nav.find('>a.btn-more').attr('ts'),
					next   : $nav.find('>a.btn-more').attr('href'),
					height : $stream.css('height'),
					latest : $items.eq(0).attr('tid'),
					items  : htmlCache || ''
				},
				{TTL:60000} // 60 seconds
			);
		});

		cached = $.jStorage.get(key, {});
		$.jStorage.deleteKey(key);

		if (!cached.latest || cached.latest !== $stream.children(':first-child').attr('tid') || !cached.items || !cached.items.length) {
			return updateItems();
		}

		$items = $('<ol />').html(htmlCache=cached.items).children();
		$stream.empty().append($items);
		$nav.find('>a.btn-more,>a.btn-next').attr({ts:cached.ts, href:cached.next});
		
		if (cached.height) $stream.css('height', cached.height);
	})();

	setTimeout(function(){ $win.scroll(); }, 1);
	
    $.infiniteshow({
        itemSelector:'#content ol.stream > li',
        streamSelector:'#content ol.stream',
		post_callback : function($added){
			updateItems($added, $items.length);
		},
        prefetch : true,
        newtimeline : true
    });
	
	if(navigator.userAgent.indexOf('MSIE') > -1) $.infiniteshow.option('prepare', 1000);
	
	function updateItems($elems){
		
	};
	
	function ordered(n1, n2, n3) {
		return (n1 < n2) && (n2 < n3);
	};
});

