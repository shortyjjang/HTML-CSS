jQuery(function($){
    var $win = $(window), $stream = $('ol.stream'), $func, $btnShare, $items, itemW, itemH, itemT, winH, resizeTimer, htmlCache;
	var COLS = 3;

	$items = $stream.find('>li');

	if(!$items[0] ) return;

	itemW  = $items.eq(0).outerWidth();
	itemH  = $items.eq(0).outerHeight();
	itemT  = $items.eq(0).offset().top;
	winH   = $win.height();
	
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
		var start = 0;
		
		if ($elems) {
			start = $items.length;
		} else {
			$elems = $items;
		}

		$elems.each(function(idx){
			idx += start;
			$(this).css({position:'absolute', top:Math.floor(idx / 3) * itemH, left:(idx % 3) * itemW});
		});

		// $.add doesn't ensure to keep the order of items.
		// So, I make an array of elements first then change it to jQuery object
		if (start) $items = $($items.get().concat($elems.get()));
		if (htmlCache) {
			htmlCache += $('<ol />').append($elems.clone()).html();
		} else {
			htmlCache = $('<ol />').append($items.clone()).html();
		}
		$stream.height( Math.ceil( $items.length / 3 ) * itemH);
	};
	
	function ordered(n1, n2, n3) {
		return (n1 < n2) && (n2 < n3);
	};
});

