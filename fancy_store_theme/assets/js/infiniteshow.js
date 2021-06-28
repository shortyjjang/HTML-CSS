;(function($){
		
	var defaults = {
		loaderSelector : '#loading-indicator', // an element to be displayed while calling data via ajax.
		itemSelector : '.stream > li',
		streamSelector : '.stream',
		direction : 'vertical',
		prepare   : 4000, // indicates how many it should prepare (in pixel)		
	};

	$.fn.infiniteshow = function(){
		var $self = this, 
			calling = false,
			options = defaults,
			$doc = $(document),
			$win = $(window),
			ih   = options.direction=='horizontal'?$win.innerWidth():$win.innerHeight();		

		for(var k in options) options[k] = $self.attr('data-'+k) || options[k];

		function docSize() {
			var d = document;
			if(options.direction=='horizontal')
				return Math.max(d.body.scrollHeight, d.documentElement.scrollHeight);
			else
				return Math.max(d.body.scrollWidth, d.documentElement.scrollWidth);
		};

		function onScroll() {
			var nextpage = $self.attr('data-nextpage');
			if (calling || !nextpage) return;

			calling = true;

			var rest = docSize() - options.direction=='horizontal'?$doc.scrollTop():$doc.scrollLeft();
			if (rest > options.prepare){
				calling = false;
				return;
			}

			var $loader = $(options.loaderSelector).show();

			function appendThings(data){
				var $sandbox = $('<div>'),					
					$contentBox = $self.find(options.streamSelector),
					nextPage,					
					$rows;

				$sandbox[0].innerHTML = data.replace(/^[\s\S]+<body.+?>|<((?:no)?script|header|nav)[\s\S]+?<\/\1>|<\/body>[\s\S]+$/ig, function(match, $1) {
					if ($1 == 'script' && $(match).attr('type') == 'application/json') {
						return match;
					} else {
						return '';
					}
				});
				$rows = $sandbox.find(options.itemSelector);				
				$contentBox.append($rows);
				nextPage = $sandbox.find("[data-nextpage]").attr("data-nextpage");
				$self.attr('data-nextpage',nextPage);
				$self.trigger("loaded");

				// Triggers scroll event again to get more data if the page doesn't have enough data still.
				onScroll();

				$('<style></style>').appendTo($(document.body)).remove();
			}


			var url = location.pathname + location.search.replace(/(\?|&)page=[0-9]*&?/,'$1');
			url = url == location.pathname ? url + '?' : url;
			$.ajax({
				url : url+'&page='+nextpage,
				dataType : 'html',
				success : function(data, st, xhr) {
					appendThings(data);
				},
				error : function(xhr, st, err) {
					url = '';
				},
				complete : function(){
					calling = false;
					$loader.hide();
				}
			});
		};

		$win.off('resize.infiniteshow').on('resize.infiniteshow', function(){ 
			ih = options.direction=='horizontal'?$win.innerWidth():$win.innerHeight();		
			onScroll(); 
		});
		$win.off('scroll.infiniteshow').on('scroll.infiniteshow', onScroll);
		
		onScroll();

	}

	$("[data-component='infiniteshow']").infiniteshow();

})(jQuery);