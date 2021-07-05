// Infiniteshow
(function($){
    var options;
    var defaults = {
        dataKey : '',
        loaderSelector : '#infscr-loading', // an element to be displayed while calling data via ajax.
        itemSelector : '#content .inside-content .figure-row',
        nextSelector   : 'a.btn-more', // elements which head for next data.
        streamSelector : '.stream',
        prepare   : 4000, // indicates how many it should prepare (in pixel)
        prefetch  : false, // whether or not prefetch next page
        newtimeline : false, // is new timeline
        dataType  : 'html', // the type of ajax data.
        autoload  : true, // autoload next page
        changeurl : false,
        success   : function(data){}, // a function to be called when the request succeeds.
        error    : function(){ }, // a function to be called if the request fails.
        comeplete : function(xhr, st){} // a function to be called when the request finishes (after success and error callbacks are executed).
    };

    $.infiniteshow = function(opt) {
        options = $.extend({}, defaults, opt);

        var $win = $(window),
            $doc = $(document),
            // ih   = $win.innerHeight(),
            $url = $(options.nextSelector),
            $str = $(options.streamSelector),
            loc  = $str.attr('loc'),
            url  = $url.attr('href'),
            // bar  = $('div.pagination'),
            ttl  = 5 * 60 * 1000,
            calling = false,
            prefetching = false,
            ignorePrefecth = false,
            lastFetchedUrl = null,
            ajax = null,
            prefetchajax = null;

        var keys = {
            timestamp : 'fancy.'+options.dataKey+'.timestamp.'+loc,
            stream  : 'fancy.'+options.dataKey+'.stream.'+loc,
            latest  : 'fancy.'+options.dataKey+'.latest.'+loc,
            nextURL : 'fancy.'+options.dataKey+'.nexturl.'+loc,
            scrollTop : 'fancy.'+options.dataKey+'.scrollTop.'+loc,
            prefetch : 'fancy.prefetch.stream.'+loc
        };

        if( options.autoload ) $url.hide();
        else{
            $url.click(function(e){
                e.preventDefault();
                loadMore();
            })
        }

        // restore strem data just for browser history traversal
        $(window).bind("pageshow", function ( event ) {
          var historyTraversal = event.persisted || ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
          if(historyTraversal){
            // restore stream data and fancyd state
            (function(){
                if (!options.dataKey) return;
                if ( location.args.add_article || location.args.add_thing ) return;
                
                var data      = $.jStorage.get(keys.stream, ''),
                    latest    = $.jStorage.get(keys.latest, ''),
                    nextURL   = $.jStorage.get(keys.nextURL, ''),
                    timestamp = $.jStorage.get(keys.timestamp, 0),
                    scrollTop = $.jStorage.get(keys.scrollTop, 0);

                $.jStorage.deleteKey(keys.prefetch);
                if(!data || (+new Date - timestamp > ttl)){
                    for(var name in keys) $.jStorage.deleteKey(keys[name]);
                    return;
                }
                if(ajax) ajax.abort();
                if(prefetchajax) prefetchajax.abort();

                $url.attr('href', url=nextURL);
                $str.html(data);
                var $rows = $(options.itemSelector);
                if (options.post_callback != null) {
                    options.post_callback($rows, true);
                }
                if(latest) $str.attr('ts',latest);
                if(scrollTop) $(window).scrollTop(scrollTop);

                if(options.prefetch) prefetch(nextURL);

                // get fancyd state only for latest 100 items
                var tids = [], aids = [], items = {}, articles = {};
                $(options.itemSelector).find(".button.fancy,.button.fancyd").each(function(){
                    var $btn = $(this), tid = $btn.attr('tid'), aid = $btn.attr('aid');
                    if(tid){
                        $btn.removeClass('disabled loading').prop('disabled', false).find('span[style]').removeAttr('style');
                        tids.push( tid );
                        items[tid] = $btn;
                    }
                    if(aid){
                        $btn.removeClass('disabled loading').prop('disabled', false).find('span[style]').removeAttr('style');
                        aids.push( aid );
                        articles[aid] = $btn;
                    }
                });

                if(tids.length){
                    $.ajax({
                        type : 'POST',
                        url  : '/user_fancyd_things.json',
                        data : {object_ids : tids.join(',')},
                        dataType : 'json',
                        success  : function(json){
                            var fancyd = {}, $btn;
                            for(var i=0,c=json.length; i < c; i++){
                                fancyd[ json[i].object_id ] = json[i].id;
                            }

                            for(var k in items){
                                if(fancyd[k]){
                                    $btn = items[k].filter('.button.fancy');
                                    if($btn.length ){
                                        $btn.toggleClass('fancy fancyd').attr('rtid', fancyd[k]);
                                        if( !isNaN( $btn.contents().get(-1).nodeValue ) ){
                                            $btn.contents().get(-1).nodeValue = (parseInt($btn.contents().get(-1).nodeValue) + 1);
                                        }
                                    }
                                } else {
                                    $btn = items[k].filter('.button.fancyd');
                                    if($btn.length){
                                        $btn.toggleClass('fancy fancyd').removeAttr('rtid');
                                        if( !isNaN( $btn.contents().get(-1).nodeValue ) ){
                                            $btn.contents().get(-1).nodeValue = (parseInt($btn.contents().get(-1).nodeValue) - 1);
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                if(aids.length){
                    $.ajax({
                        type : 'POST',
                        url  : '/user_fancyd_articles.json',
                        data : {object_ids : aids.join(',')},
                        dataType : 'json',
                        success  : function(json){
                            var fancyd = {}, $btn;
                            for(var i=0,c=json.length; i < c; i++){
                                fancyd[ json[i].object_id ] = true;
                            }

                            for(var k in articles){
                                if(fancyd[k]){
                                    $btn = articles[k].filter('.button.fancy');
                                    if($btn.length ){
                                        $btn.toggleClass('fancy fancyd')
                                        if( !isNaN($btn.contents().get(-1).nodeValue) ){
                                            $btn.contents().get(-1).nodeValue = (parseInt($btn.contents().get(-1).nodeValue) + 1);
                                        }
                                    } 
                                } else {
                                    $btn = articles[k].filter('.button.fancyd');
                                    if($btn.length ){
                                        $btn.toggleClass('fancy fancyd');
                                        if( !isNaN($btn.contents().get(-1).nodeValue) ){
                                            $btn.contents().get(-1).nodeValue = (parseInt($btn.contents().get(-1).nodeValue) - 1);
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            })();
          }
          onScroll();
        });

        function docHeight() {
            var d = document;
            return Math.max(d.body.scrollHeight, d.documentElement.scrollHeight);
        };

        function prefetch(url){
            prefetching = true;
            if(!url || typeof url == 'object') url = $url.attr('href');
            if(url==lastFetchedUrl){
                $.jStorage.deleteKey(keys.prefetch);
                prefetching = false;
                return;
            }
            lastFetchedUrl = url;
            
            if(prefetchajax) prefetchajax.abort();
            prefetchajax = $.ajax({
                url : url,
                dataType : options.dataType,
                success : function(data, st, xhr) {
                    if(!ignorePrefecth)
                        $.jStorage.set(keys.prefetch,data,{TTL:ttl});
                    ignorePrefecth = false;
                    prefetching = false;
                },
                error : function(xhr, st, err) {
                    $.jStorage.deleteKey(keys.prefetch);
                    ignorePrefecth = false;
                    prefetching = false;
                }
            });
        }

        function loadMore() {
            
            url = $url.attr('href');
            if(!url){
                $url = $(options.nextSelector).hide();
                url = $url.attr('href');
            }
            if (calling || !url || options.disabled ) return;

            calling = true;

            var $loader = $(options.loaderSelector).show();

            function appendThings(data){
                if (options.disabled) {
                    $.jStorage.deleteKey(keys.prefetch);
                    return;
                }
                var _contentBox = $(options.itemSelector).parent();
                if (_contentBox.length === 0 || _contentBox.length > 1) {
                    _contentBox = $(options.streamSelector);
                }
                var $sandbox = $('<div>'),
                    $contentBox = _contentBox,
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

                if(options.changeurl){
                    history.pushState({}, 'Gear', url);
                }
                if ($next.length) {
                    url = $next.attr('href');
                    $url.attr({
                        'href' : $next.attr('href'),
                        'ts'   : $next.attr('ts')
                    });
                    if(options.prefetch) prefetch($next.attr('href'));
                } else {
                    url = '';
                    $url.attr({
                        'href' : '',
                        'ts'   : ''
                    }).hide();
                }

                if(!options.newtimeline)
                    $win.trigger('savestream.infiniteshow');

                // Triggers scroll event again to get more data if the page doesn't have enough data still.
                onScroll();

                if (options.post_callback != null) {
                    options.post_callback($rows);
                }
                $('<style></style>').appendTo($(document.body)).remove();
            }
            var data;
            if( options.prefetch && !prefetching && (data=$.jStorage.get(keys.prefetch)) ){
                $.jStorage.deleteKey(keys.prefetch);
                appendThings(data);
                calling = false;
                $loader.hide();
            }else{
                if(prefetching) {
                    calling = false;
                    setTimeout(onScroll,300);
                    return;
                }
                $.jStorage.deleteKey(keys.prefetch);
                if(ajax) ajax.abort();
                ajax = $.ajax({
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
            }
        };

        function onScroll() {

            if (document.body.className.indexOf('overlay-on') !== -1) {
                return;
            }
            if (calling || options.disabled || !options.autoload) return;

            var rest = docHeight() - $doc.scrollTop();
            if (rest > options.prepare){
                calling = false;
                return;
            }

            loadMore();
        };

        function saveScrollTop() {
            loc = $str.attr('loc');
            if(!$str.length || !options.dataKey) return;
            var keys = {
                scrollTop : 'fancy.'+options.dataKey+'.scrollTop.'+loc
            };
            $.jStorage.set(keys.scrollTop, $(window).scrollTop(), {TTL:ttl});
        };

        $win.off('resize.infiniteshow').on('resize.infiniteshow', function(){ ih = $win.innerHeight(); onScroll(); });
        $win.off('scroll.infiniteshow').on('scroll.infiniteshow', _.throttle(function(){
            onScroll();
        },50));
        $win.unload(function(){
            saveScrollTop();
        })
        $win.off('savestream.infiniteshow').on('savestream.infiniteshow', function(){
            loc = $str.attr('loc');
            if(!$str.length || !options.dataKey) return;

            var keys = {
                timestamp : 'fancy.'+options.dataKey+'.timestamp.'+loc,
                stream  : 'fancy.'+options.dataKey+'.stream.'+loc,
                latest  : 'fancy.'+options.dataKey+'.latest.'+loc,
                nextURL : 'fancy.'+options.dataKey+'.nexturl.'+loc,
                scrollTop : 'fancy.'+options.dataKey+'.scrollTop.'+loc
            };

            var data = $str.html().replace(/>\s+</g,'><');
            setTimeout(function(){
                $.jStorage.set(keys.timestamp, +new Date, {TTL:ttl});
                $.jStorage.set(keys.stream, data, {TTL:ttl});
                $.jStorage.set(keys.nextURL, url, {TTL:ttl});
                $.jStorage.set(keys.latest, $str.attr('ts'), {TTL:ttl});
                $.jStorage.set(keys.scrollTop, $(window).scrollTop(), {TTL:ttl});
            },10);
            
        });
        $win.off('prefetch.infiniteshow').on('prefetch.infiniteshow', prefetch);
        $win.unload(function(){
            $.jStorage.deleteKey(keys.prefetch);
        })

        $.infiniteshow.option = function(name, value) {
            if (typeof(value) == 'undefined') return options[name];
            options[name] = value;

            if (name == 'disabled' && !value) onScroll();
        };

        $.infiniteshow.abort = function(){
            $.jStorage.deleteKey(keys.prefetch);
            if(ajax) ajax.abort();
            if(prefetchajax) prefetchajax.abort();
        };
    };
})(jQuery);