(function($){
	var options;
    var defaults = {
        contentSelector : '#content',
        extraSelector : null,
        dataType  : 'html', // the type of ajax data.
        scrollTop: true,
        setLoading : function(isLoading){},
        beforeLoad : function(){},
        success   : function($content){}, // a function to be called when the request succeeds.
        error    : function(xhr, st){}, // a function to be called if the request fails.
        complete : function(xhr, st){} // a function to be called when the request finishes (after success and error callbacks are executed).
    };

	$.ajaxPage = function(option){
		options = $.extend({}, defaults, option);
		var $win = $(window),
			$content = $(options.contentSelector),
			loc = $content.attr('loc'),
			ajax = null;

		$.ajaxPage.changeUrl = function(url, keepParam){
		    var args = $.extend({}, location.args), query;
		    if(keepParam && (query = $.param(args))) url += '?'+query;
	            loadPage(url);
		}

		$.ajaxPage.changeParam = function(name, value){
			var url = location.pathname, args = $.extend({}, location.args), query;
			if(value) {
				args[name] = value;
			} else {
				delete args[name];
			}
            for(k in args) {
                args[k] = decodeURIComponent(args[k]).replace(/\+/g,' ');
            }
			if(query = $.param(args)) url += '?'+query;
			loadPage(url);
		}

		$.ajaxPage.changeUrlReloadCustomFilter = function(url, keepParam){
		    var args = $.extend({}, location.args), query;
		    if(keepParam && (query = decodeURIComponent($.param(args)))) url += '?'+query;
            loadPage(url, false, '.custom-filters');
		}
		$.ajaxPage.reset = function(){
			var url = location.pathname, args = $.extend({}, location.args);
			if( 'new' in args ) url+="?new";
			loadPage(url);
		}

		function loadPage(url, skipSaveHistory, extraSelector){
			console.log(url);
			var $win = $(window);
			var dummy  = (new Date()).getTime(); // dummy data to prevent browser cache

			if (!$content.length) return;

			options.setLoading(true);
			options.beforeLoad();

			if(!skipSaveHistory && window.history && history.pushState){
				history.pushState({url:url}, document.title, url);
			}
			location.args = $.parseString(location.search.substr(1));
            if(options.scrollTop) {
    			$win.scrollTop(0).trigger('scroll');
            }

			if(ajax) ajax.abort();
			if(url.indexOf('?')>-1) url = url+'&'+dummy;
			else url = url+'?'+dummy;

		        if(extraSelector) {
			    if(url.indexOf('?')>-1) url = url+'&sidebar=true';
			    else url = url+'?sidebar=true';
			}
			
			ajax = $.ajax({
				type : 'GET',
				url  : url,
				dataType : 'html',
				success  : function(html){
				    $content.attr('loc', location.pathname.replace(/\//g, '-').substr(1));
				    
				    var $html = $($.trim(html))

                    function _update_extra_content(selector) {
                        var selectors = selector
                        if(!Array.isArray(selectors)) {
                            selectors = [selector];
                        }

                        for(var i in selectors) {
                            var s = selectors[i]

                            var $extraContent = $(s);
                            if($extraContent.length > 1) {
                                console.error("Multiple Extra Content Found with selector: "+s);
                            } else if($extraContent.length>0) {
                                var found = false;
                                $html.each(function(i,elem) {
                                    var $elem = $(elem);
                                    if($elem.find(s).length) {
                                        $extraContent.html( $elem.find(s).html() );
                                        $extraContent.show();
                                        found = true;
                                        return false;
                                    }
                                });
                                if(!found) {
                                    $extraContent.hide();
                                }
                            }
                        }
                    }

				    $content.html( $html.find(options.contentSelector).html() );

                    if(extraSelector) {
                        _update_extra_content(extraSelector);
                    }
                    if(options.extraSelector) {
                        _update_extra_content(options.extraSelector);
                    }

				    options.setLoading(false);
				    options.success($content, $html);
				}
			}).fail(options.error).always(options.complete)
		};

		var historyTraversal= false;
		$(window).bind("pageshow", function ( event ) {
	        historyTraversal = event.persisted || ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
	    });

		$(window).on('popstate', function(event){
			var e = event.originalEvent;

			if(historyTraversal) { historyTraversal=false; return; }
			if(!e || !e.state) return;
			loadPage(event.originalEvent.state.url, true);
		});

	}


})(jQuery);
