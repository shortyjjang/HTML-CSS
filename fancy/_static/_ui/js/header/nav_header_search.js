(function(){
    var $nav = $('#navigation').parent();
    var $search_form = $nav.find('form.search'),
        $textbox = $search_form.find('#search-query'),
        $suggest = $search_form.find('.keyword'),
        $users   = $search_form.find('dl.user'),
        $stores   = $search_form.find('dl.store'),
        prev_keyword = '', timer = null,
        searched_query = $textbox.attr('data-query');
    var keys = {
            13 : 'ENTER',
            27 : 'ESC',
            38 : 'UP',
            40 : 'DOWN'
        };

    $search_form.on('submit', function(e){
        var v = $.trim($textbox.val());
        if(!v) return false;

        if($suggest.find('li.hover a').filter(':visible')[0]){
            e.preventDefault();
        }
    });
	
	if ($(window).width() > 760) {$search_form.width($('#navigation').find('.inner').innerWidth() - $('#navigation').find('.logo').outerWidth() - $('#navigation').find('.gnb-wrap.right').outerWidth());}
	$(window).resize(function(){
		if ($(window).width() > 760) {
			$search_form.width($('#navigation').find('.inner').innerWidth() - $('#navigation').find('.logo').outerWidth() - $('#navigation').find('.gnb-wrap.right').outerWidth());
		}else{$search_form.width('');}
	});

    $textbox
        // highlight submit button when the textbox is focused.
        .on({
            focus : function(){
                if ($textbox.css('opacity') == 0) { // mobile
                    var val = $(this).val();
                    $(this).val('').val(val); // move the cursor to the end
                }
                $search_form.addClass('focus');
                
                if ($(this).val() || searched_query){
                    if( !$(this).val() && searched_query ){
                        $(this).val(searched_query).select();
                    }
                    prev_keyword = '';
                    $(this).trigger('keyup');
                    return;
                }
                
                if(!$suggest.find(".recently").is(":visible")){
                    hide_all();
                    $.ajax({
                        type : 'GET',
                        url  : '/search-gethistory.json',
                        dataType : 'json',
                        success  : function(json){
                            if(json.search_history && json.search_history.length) show_history(json);
                            //$suggest.removeClass('loading');
                        }
                    });
                }
            },
            blur  : function(e){
                if( $(e.relatedTarget).is("div.keyword *") ) return;
                //if( $textbox.val().length>0 ) return;
                setTimeout( function(){$suggest.hide();$search_form.removeClass('focus').width('');}, 200);
            }
        })
        // search things and users as user types
        .on({
            keyup : function(event){
                var kw = $textbox.val();
                $textbox.attr('data-prev-val',kw);

                if(keys[event.which]) return;
                if(!kw.length) {
                    if( $search_form.find('dl.recently ul li').length){
                        show_only_this_part( $search_form.find('dl.recently'));
                        $keywords.empty();
                    }else{
                        hide_all();
                    }
                    return ;
                }
                if(kw.length && kw != prev_keyword ) {
                    prev_keyword = kw;
                    if( $search_form.find('ul.keywords li').length ){
                        // show_only_this_part( $search_form.find('ul.keywords'));  
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
					return $suggest.hide();
				}
                if(k == 'ENTER') {
                    $suggest.hide();
                    if($selected.filter(':visible').length) {
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
    $suggest.delegate('.recently > li, .result ul > li', 'mouseenter', function(){ 
        $textbox.attr('data-prev-val', $textbox.val());
        var val = $(this).find("a:eq(0)").text();
        if( $(this).find("a:eq(0) b")[0] ){
            val = $(this).find("a:eq(0) b").text();
        }
        $textbox.val( val );        
    });
    $suggest.delegate('.recently > li, .result ul > li', 'mouseleave', function(){ 
        $textbox.val( $textbox.attr('data-prev-val') ).removeAttr('data-prev-val');
    });

    function find(word){
        $.ajax({
            type : 'GET',
            url  : '/search-suggestions.json',
            data : {q:word, home_v3:true},
            dataType : 'json',
            success  : function(json){
                try {
                    if(json.fancy_services && json.fancy_services.length) suggestion_fancy_service(json, word);
                    else if(json.gift_services && json.gift_services.length) suggestion_gift_service(json, word);
                    else if(json.keywords && json.keywords.length) suggestion_keyword(json, word);
                    else{
                        hide_all();
                        suggestion_user(json, word);
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
        $search_form.find('.keyword, .default, .result').hide().find("> dl, > ul").hide();
    }

    function show_only_this_part($part) {
        hide_all();

        $part.show().parent().show();
        $suggest.show();
        $search_form.addClass('focus');
    }

    var $tpl_search_recently = $('#tpl-search-recently').remove();
    var $tpl_suggestions_string = $('#tpl-search-suggestions-string').remove();
    var $tpl_suggestions_thing = $('#tpl-search-suggestions-thing').remove();
    var $tpl_suggestions_user = $('#tpl-search-suggestions-user').remove();

    var $recently = $search_form.find('dl.recently');
    function show_history(json) {
        show_only_this_part($search_form.find('dl.recently'));

        try {
            if(json.search_history && json.search_history.length) $recently.show().find("ul").empty();
            _.each(json.search_history, function(history){
                if(history)
                    $tpl_search_recently.template({TEXT: $("<div>").text(history).html()}).appendTo($recently.find("ul"));
            });
        } catch(e) {
            console.log(e);
        }
    }

    function suggestion_user(json_data, word) {
        var show = false;
        if(json_data.users && json_data.users.length){
            $users.show().find("ul").empty();
            _.each(json_data.users.slice(0,3), function(user){
                var $user = $tpl_suggestions_user.template({URL:user.html_url, IMG_URL:user.image_url, USERNAME:highlight(user.username, word), FULLNAME:$("<div>").text(user.name).html()})
                if(user.is_verified) $user.find("b").append('<span title="Verified account" class="ic-verified"></span>');
                $user.appendTo($users.find("ul"));
            });
            $users.find("dt > a").attr('href','/search?q='+word+'&for=users');
            show = true;
        }else{
            $users.hide();
        }

        if(json_data.stores && json_data.stores.length){        
            $stores.show().find("ul").empty();;
            _.each(json_data.stores.slice(0,3), function(user){
                if( !user.image_url ) user.image_url = '/_ui/images/common/placeholder_shop2.png';
                var $store = $tpl_suggestions_user.template({
                                        URL:user.html_url, 
                                        IMG_URL:user.image_url, 
                                        USERNAME:highlight(user.username, word), 
                                        FULLNAME:$("<div>").text(user.fullname).html()
                                    })
                $store.appendTo($stores.find("ul"));
            });
            $stores.find("dt > a").attr('href','/search?q='+word+'&for=brands');
            show = true;
        }else{
            $stores.hide();
        }
        if(show) {
            $suggest.find(".keyword, .result").show();
            $search_form.addClass('focus');
        }
    }

    var $services = $('.fancy-service');
    function suggestion_fancy_service(json_data, word) {
        show_only_this_part( $search_form.find('.fancy-service'));

        $services.show().find("ul").empty();
        _.each(json_data.fancy_services, function(service) {
            $services.find("ul").append($tpl_suggestions_thing.template({URL: service.url, NAME: highlight(service.name, word)}));
        });

        suggestion_user(json_data, word);
    }

    var $gift_services = $('.gift-service');
    function suggestion_gift_service(json_data, word) {
        show_only_this_part( $search_form.find('.gift-service'));

        $gift_services.show().find("ul").empty();
        _.each(json_data.gift_services, function(service) {
            $gift_services.find("ul").append($tpl_suggestions_thing.template({URL: service.url, NAME: highlight(service.name, word)}));
        });
    }

    var $keywords = $search_form.find('ul.keywords');
    function suggestion_keyword(json_data, word) {
        show_only_this_part( $search_form.find('.keywords'));

        $keywords.empty().show();
        _.each(json_data.keywords, function(keyword){
            $tpl_suggestions_string.template({STRING: $("<div>").text(keyword).html(), NAME: highlight($("<div>").text(keyword).html(), word)}).appendTo($keywords);
        });

        suggestion_user(json_data, word);
    }

    $search_form.find('ul.recently').on('click', 'li .del', function(e){
        e.preventDefault();
        var $this = $(this);
        var $selected = $this.closest('li');
        $.ajax({
            type : 'POST',
            url : '/search-deletehistory.json',
            data : { search_phrase: $selected.find('a[rel]').text() },
            dataType : 'json',
            success : function(json) {
                if (json.status_code == 1) {
                    $selected.mouseleave().remove();
                    if(!$search_form.find('dl.recently ul >li').length){
                        hide_all();
                    }
                } else if (json.status_code == 0) {
                    alert(json.message);
                }
            },
        });
    });

    $search_form.find('dl.recently').on('click', '.clear-all', function(e) {
        e.preventDefault();
        $.ajax({
            type : 'POST',
            url : '/search-deleteallhistory.json',
            dataType : 'json',
            success : function(json) {
                if (json.status_code == 1) {
                    $search_form.find('dl.recently ul').empty();
                    hide_all();
                } else if (json.status_code == 0) {
                    alert(json.message);
                }
            },
        });
    });


})();
