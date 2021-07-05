jQuery(function($) {
    var $search = $('.header-wrapper .search, .header-mini .search');

    $search.each(function(){
        initSearch( $(this) );
    })

    function initSearch($search){
        var $search_form = $search.find('form'),
            $textbox = $search_form.find('#keyword-search-input, #keyword-search-input-mini'),
            $suggest = $search_form.find('.keyword'),
			$remove = $search_form.find('.cancel'),
            prev_keyword = '', timer = null,
            searched_query = $textbox.attr('data-query');
            keys = {
                13 : 'ENTER',
                27 : 'ESC',
                38 : 'UP',
                40 : 'DOWN'
            };

        $search_form.on('submit', function(e){
            e.preventDefault()
            var v = $.trim($textbox.val());
            v = v.replace(/\//g,' ')

            if(!v) return false;

            if (window.searchTarget) {
                window.location = '/s/'+encodeURIComponent(v).replace(/%20/g, "+")+("?"+window.searchTarget);
            } else {
                window.location = '/s/'+encodeURIComponent(v).replace(/%20/g, "+");
            }

            /*if($suggest.find('li.hover a')[0]){
                e.preventDefault();
            }*/
        });

		$remove
			.on({
                click : function(e){
                    e.preventDefault();
					$textbox.val('');
					$suggest.hide();
				}
			});

        $textbox
            // highlight submit button when the textbox is focused.
            .on({
                focus : function(){
                    
                    if ($(this).val() || searched_query){
                        if( !$(this).val() && searched_query ){
                            $(this).val(searched_query).select();
                        }
                        prev_keyword = '';
                        $(this).trigger('keyup');
                        return;
                    }
                    hide_all();
                },
                blur  : function(e){
                    if( $(e.relatedTarget).is("div.keyword *") ) return;
                    //if( $textbox.val().length>0 ) return;
                    setTimeout( function(){$suggest.hide();}, 200);
                }
            })
            // search things and users as user types
            .on({
                keyup : function(event){
                    var kw = $.trim($textbox.val());
                    $textbox.attr('data-prev-val',kw);

                    if(keys[event.which]) return;
                    if(!kw.length) {
                        hide_all();
                        return ;
                    }
                    if(kw.length && kw != prev_keyword ) {
                        prev_keyword = kw;
                        if( $search_form.find('ul.keywords li').length ){
                            show_only_this_part( $search_form.find('ul.keywords'));  
                        }else{
                            hide_all();
                        }

                        clearTimeout(timer);
                        timer = setTimeout(function(){ find(kw); }, 500);
                    }
                },
                keydown : function(event){
                    var k = keys[event.which];
                    if($suggest.is(':hidden') || !k) return;

                    var $items = $suggest.find('li:visible'), $selected = $suggest.find('li.hover'), idx;

                    if(k == 'ESC') {
						return;
						$suggest.hide();
					}
                    if(k == 'ENTER') {
                        if($selected.length) {
                            window.location.href = $suggest.find('li.hover a').attr('href');
                        } else {
                            $search_form.submit();
                        }
                        return;
                    }

                    if(!$selected.length) {
                        $selected = $items.eq(0).mouseover();
                        return;
                    }

                    idx = $items.index($selected);

                    if(k == 'UP' && idx > 0) {
                        return $items.eq(idx-1).mouseover();
                    }
                    if(k == 'DOWN' && idx < $items.length-1) {
                        return $items.eq(idx+1).mouseover();
                    }
                }
            });

        $suggest.delegate('li', 'mouseover', function(){ $suggest.find('li.hover').removeClass('hover'); $(this).addClass('hover'); });
        $suggest.delegate('.result ul > li', 'mouseenter', function(){ 
            $textbox.attr('data-prev-val', $textbox.val());
            var val = $(this).find("a:eq(0)").text();
            if( $(this).find("a:eq(0) b")[0] ){
                val = $(this).find("a:eq(0) b").text();
            }
            $textbox.val( val );        
        });
        $suggest.delegate('.result ul > li', 'mouseleave', function(){ 
            $textbox.val( $textbox.attr('data-prev-val') ).removeAttr('data-prev-val');
        });

        function find(word){
            $.ajax({
                type : 'GET',
                url  : '/search-suggestions.json',
                data : {q:word},
                dataType : 'json',
                success  : function(json){
                    console.log(json);
                    try {
                        if(json.suggestions && json.suggestions.length) suggestion_keyword(json, word);
                        else{
                            hide_all();
                        }

                        //$suggest.removeClass('loading');
                    } catch(e) {
                        console.log(e);
                    }
                }
            });
        }

        function highlight(str, substr){
            var regex = new RegExp('('+encodeURIComponent(substr.replace(/ /g,'____')).replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&').replace(/(____)+/g,'|')+')', 'ig');
            return str.replace(regex, '<strong>$1</strong>');;
        }

        function hide_all() {        
            $search_form.find('.keyword, .result').hide().find("> dl, > ul").hide();
        }

        function show_only_this_part($part) {
            hide_all();

            $part.show().parent().show();
            $suggest.show();
        }

        var $tpl_suggestions_string = $search_form.find('> script').remove();
        
        var $keywords = $search_form.find('ul.keywords');
        function suggestion_keyword(json_data, word) {
            show_only_this_part( $search_form.find('.keywords'));

            $keywords.empty().show();
            _.each(json_data.suggestions, function(keyword){
                $tpl_suggestions_string.template({STRING: $("<div>").text(keyword.replace(/ /g, "+")).html(), NAME: highlight($("<div>").text(keyword).html(), word)}).appendTo($keywords);
            });

            if(json_data.suggestions.length){
                $suggest.find(".keyword, .result").show();
            }
        }
    }

});
