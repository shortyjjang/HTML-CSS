(function(){
	var dpr = window.devicePixelRatio;
	window.isRetina = typeof(dpr)=='number' && dpr > 1;

	location.args = {};
	var str = location.search.substr(1).split(/&/g);
	for(var i=0;i<str.length;i++){
		if(/^([^=]+)(?:=(.*))?$/.test(str[i])) location.args[RegExp.$1] = decodeURIComponent(RegExp.$2);
	}
})();

function writeImage(src, name){
	var size = window.thumbnailSize || 'm', len = 145;

	switch(size){
		case 's': len = 80; break;
		case 'm': len = 145; break;
		case 'l': len = 230; break;
		case 'c': len = window.thumbnailLen; break;
	}
	var resize_len = len;
	if(isRetina) resize_len *= 2;

	src = src.replace(/^(https?:\/\/[\w\.\-]+)/,'$1/resize/'+resize_len+'x'+resize_len+'/thingd');
	src = src.replace(/^(https?:\/\/)[\w\-]+(-ec\d+\.)/, '$1resize$2');
	html = '<img src="'+src+'" width="'+len+'" height="'+len+'" alt="'+name+'">';

	document.write(html);
};

jQuery(function($){
	var $wdg = $('#widget'), $list = $('ul.widget-list.first'), l=location, loc=l.args.loc;

	function resize(second){
		var h = $wdg.outerHeight();

 		if(!window.postMessage || !loc) return;

		w  = $list.clone().css({position:'absolute',visibility:'hidden'}).insertBefore($list).outerWidth();
		w += parseInt($wdg.css('padding-left')) + parseInt($wdg.css('padding-right')) + parseInt($wdg.css('border-left-width')) + parseInt($wdg.css('border-right-width'));
		$list.prev().remove();

		parent.postMessage('resize-widget\t'+location.args.id+','+w+','+h, loc);
	};
	resize();

	$("ul.widget-list").delegate('li a[tid]','click',function(event){
		if(!window.postMessage || !loc) return;

		event.preventDefault();
		parent.postMessage('open-widget\t'+'//'+location.host+'/embed/buy/'+this.getAttribute('tid'), loc);
	});

	// Infiniteshow
	(function($){
	    var options;
	    var defaults = {
	        dataKey : '',
	        container : $(window),
	        loaderSelector : '#infscr-loading', // an element to be displayed while calling data via ajax.
	        itemSelector : '#content .inside-content .figure-row',
	        nextSelector   : 'a.btn-more', // elements which head for next data.
	        streamSelector : '.stream',
	        prepare   : 4000, // indicates how many it should prepare (in pixel)
	        dataType  : 'html', // the type of ajax data.
	        success   : function(data){}, // a function to be called when the request succeeds.
	        error    : function(){ }, // a function to be called if the request fails.
	        comeplete : function(xhr, st){} // a function to be called when the request finishes (after success and error callbacks are executed).
	    };

	    $.infiniteshow = function(opt) {
	        options = $.extend({}, defaults, opt);

	        var $win = $(window),
	            $doc = $(document),
	            ih   = options.container.innerHeight(),
	            $url = $(options.nextSelector).hide(),
	            $str = $(options.streamSelector),
	            loc  = $str.attr('loc'),
	            url  = $url.attr('href'),
	            bar  = $('div.pagination'),
	            ttl  = 5 * 60 * 1000,
	            calling = false;
	            lastFetchedUrl = null;
	        
	        function docHeight() {
	            var d = document;
	            return Math.max(d.body.scrollHeight, d.documentElement.scrollHeight);
	        };

	        function onScroll() {

	            url = $url.attr('href');
	            if(!url){
	                $url = $(options.nextSelector).hide();
	                url = $url.attr('href');
	            }
	            if (calling || !url || options.disabled) return;

	            calling = true;
	            
	            var rest = docHeight() - $doc.scrollTop();
	            if (rest > options.prepare){
	                calling = false;
	                return;
	            }

	            var $loader = $(options.loaderSelector).show();

	            function appendThings(data){
	                if (options.disabled) {
	                    return;
	                }
	                var $sandbox = $('<div>'),
	                    $contentBox = $(options.itemSelector).parent(),
	                    $next, $rows;

	                $sandbox[0].innerHTML = data.replace(/^[\s\S]+<body.+?>|<((?:no)?script|header|nav)[\s\S]+?<\/\1>|<\/body>[\s\S]+$/ig, function(match, $1) {
	                    if ($1 == 'script' && $(match).attr('type') == 'application/json') {
	                        return match;
	                    } else {
	                        return '';
	                    }
	                });
	                $next = $sandbox.find(options.nextSelector);
	                $rows = $sandbox.find(options.itemSelector);

	                $contentBox.append($rows);
	                if ($next.length) {
	                    url = $next.attr('href');
	                    $url.attr({
	                        'href' : $next.attr('href'),
	                        'ts'   : $next.attr('ts')
	                    });
	                } else {
	                    url = '';
	                    $url.attr({
	                        'href' : '',
	                        'ts'   : ''
	                    });
	                }

	                
	                // Triggers scroll event again to get more data if the page doesn't have enough data still.
	                onScroll();

	                if (options.post_callback != null) {
	                    options.post_callback($rows);
	                }
	                $('<style></style>').appendTo($(document.body)).remove();
	            }

	            $.ajax({
	                url : url,
	                dataType : options.dataType,
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

	        options.container.off('resize.infiniteshow').on('resize.infiniteshow', function(){ ih = options.container.innerHeight(); onScroll(); });
	        options.container.off('scroll.infiniteshow').on('scroll.infiniteshow', onScroll);
	        
	        onScroll();

	        $.infiniteshow.option = function(name, value) {
	            if (typeof(value) == 'undefined') return options[name];
	            options[name] = value;

	            if (name == 'disabled' && !value) onScroll();
	        };
	    };
	})(jQuery);

});