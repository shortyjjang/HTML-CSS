if (!window.Fancy) window.Fancy = {};
if ("ontouchstart" in document.documentElement) {
	document.body.classList.add('touchscreen');
}else{
	document.body.classList.remove('touchscreen');
}

// top menu bar
jQuery(function($) {
    var $header = $("#header"),$cur = null,cur_len = 0,timer,sc,$container = $(".container:visible"),$submenu = $(".navigation");
    var delay = 0, mobileW = 900;

    clearTimeout(timer);

	$header
		.on('click','.m_menu',function(e){
			$header.toggleClass('open').find('.gnb').removeClass('active');
			return false;
		})
		.on('click','.menu-contain-you a.close',function(e){
			$(this).closest('.gnb').removeClass('active');
			return false;
		})
		.on("click", ".gnb > .mn-you", function(e) {
			e.preventDefault();
			if (!$(this).closest("li").hasClass("active")) {
				$header.find(".gnb-wrap > li").removeClass("active");
				$(this).closest("li").addClass("active");
			}else {
				$header.find(".gnb-wrap > li").removeClass("active");
            }
			return false;
		})
		.on("click",".gnb a.mn-cart", function(e) {
            e.preventDefault();
            Fancy.Cart.togglePopup();
		})
		.on("click", ".logo, .logo a", function() {
			if ($("body").hasClass("home")) {
				$(window).scrollTop(0);
				return false;
			}
		})
        .find("li > a").each(function() {
            var $this = $(this), path = $this.attr("href");
            if (path == "/" || path == "#") return;
            if (location.pathname.indexOf(path) == 0 && path.length > cur_len) {
                $cur = $this;
                cur_len = path.length;
            }
        })
        .on("touchstart", "a[href]", function() {
            var $this = $(this),
                path = $this.attr("href");
            if (path == "/" || path == "#" || $this.next("div")[0]) return;
            location.href = path;
        });
    if ($cur) $cur.addClass("current");

    $submenu
		.on('click','a.close',function(e){
			$header.toggleClass('open');
			return false;
		})
        .on("click", "li > a, li > em", function(e) {
			if('ontouchstart' in document.documentElement || $(window).width() <= mobileW) {
				if ($(this).closest("li").find("> ul").length) {
					$(this).closest("li").toggleClass("hover");
					return false;
				}
			}
        })
        .find("li > a").each(function() {
            var $this = $(this), path = $this.attr("href");
            if (path == "/" || path == "#") return;
            if (location.pathname.indexOf(path) == 0 && path.length > cur_len) {
                $cur = $this;
                cur_len = path.length;
            }
        });

    $("#cart_popup .btn-cart-checkout").click(function(e) {
        e.preventDefault();
        var $btn = $(this);
        if ($btn.hasClass("loading")) return;

        $btn.addClass("loading");
        $.ajax({
            type : 'POST',
            url  : '/rest-api/v1/checkout',
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify({"payment_gateway": 6}),
            processData : false,
            success  : function(res){
                try {
                    var items = TrackingEvents.Util.extractSalesFromCart(res.sale_items_freeze);
                    TrackingEvents.beginCheckout(res.total_prices, items);
                } catch(e) { console.warn(e); }
				document.location.href= "/checkout";
            }
        }).fail(function(xhr) {
            var message = "Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText;
            try {
                var res = JSON.parse(xhr.responseText);
                if (res && res.error) message = res.error;
            } catch (e) {
            }
            alertify.alert(message, function() { location = '/cart'});
        });
        if (dataLayer) {
            dataLayer.push({'event': 'Checkout_Button', 'product_id': undefined, 'products_info': undefined, 'revenue': undefined, 'producst': undefined, 'option_id': undefined });
        }
    });

});

(function(){
    var $search_form = $('#header form.search');
    var $textbox = $search_form.find('#search-query');
    var $suggest = $search_form.find('.keyword');
    var $users   = $search_form.find('dl.user');
    var $stores  = $search_form.find('dl.store');
    var $searchButton = $search_form.find('#search-button');
    var prev_keyword = '', timer = null,
        searched_query = $textbox.attr('data-query'), mobileW = 900;
    var keys = {
            13 : 'ENTER',
            27 : 'ESC',
            38 : 'UP',
            40 : 'DOWN'
        };

    $search_form
		.on('submit', function(e){
			var v = $.trim($textbox.val());
			if(!v) return false;

			if($suggest.find('li.hover a').filter(':visible')[0]){
				e.preventDefault();
			}
		})
		.on('click', '#search-button', function(e){
            if ($textbox.is(':visible') && $textbox.css('opacity') != 0) {
                $suggest.hide();
                $search_form.data("submitted", true);
                $search_form.submit();
            }
            $(this).closest('.search').addClass('focus');
		})
		.on('click', 'a.remove', function(e){
            $search_form.removeClass('focus')
				.find('a.remove, .keyword').hide();
			$textbox.val('')
			return false;
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
                if( $search_form.has($(e.relatedTarget)).length ) return;
                setTimeout( function(){
                    if ($search_form.data("submitted")) {
                        $search_form.data("submitted", null); return;
                    }
                    $suggest.hide();$search_form.removeClass('focus').width('').find('a.remove').hide();
                    $textbox.attr('data-suggest', null);
                }, 200);
            }
        })
        // search things and users as user types
        .on({
            keyup : function(event){
                var kw = $textbox.val();
                $textbox.attr('data-prev-val',kw);

                if(keys[event.which]) return;
                if(!kw.length) {
                    $textbox.attr('data-suggest', null);
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
                    timer = setTimeout(function(){ 
						find(kw);
						$search_form.find('a.remove').show();
					}, 100);
                }
            },
            keydown : function(event){
                var k = keys[event.which];
                if($suggest.is(':hidden') || !k) return;

                var $items = $suggest.find('li:visible'), $selected = $suggest.find('li.hover'), idx;

                if(k === 'ESC') {
					return $suggest.hide();
				}
                if(k === 'ENTER') {
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

    $suggest
		.delegate('li', 'mouseover', function(){
			$suggest.find('li.hover').removeClass('hover'); $(this).addClass('hover');
		})
		.delegate('.recently > li, .result ul > li', 'mouseenter', function(){ 
			$textbox.attr('data-prev-val', $textbox.val());
			var val = $(this).find("a:eq(0)").text();
			if( $(this).find("a:eq(0) b")[0] ){
				val = $(this).find("a:eq(0) b").text();
			}
			$textbox.val( val );        
		})
		.delegate('.recently > li, .result ul > li', 'mouseleave', function(){ 
			$textbox.val( $textbox.attr('data-prev-val') ).removeAttr('data-prev-val');
		});

    var suggestXhr = null;
    function find(word){
        if ($textbox.attr('data-suggest') == word) return;
        var data = { q:word };
        $textbox.attr('data-suggest', word);
        if (suggestXhr != null) suggestXhr.abort(); 
        suggestXhr = $.ajax({
            type : 'GET',
            url  : '/search-suggestions.json',
            data : data,
            dataType : 'json',
            success  : function(json){
                suggestXhr = null;
                if ($textbox.attr('data-suggest') != word) return false;
                try {
                    if(json.fancy_services && json.fancy_services.length) suggestion_fancy_service(json, word);
                    else if(json.gift_services && json.gift_services.length) suggestion_gift_service(json, word);
                    else if(json.keywords && json.keywords.length) suggestion_keyword(json, word);
                    else if(json.users && json.users.length) suggestion_user(json, word);
                    else{
                        hide_all();
                    }
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
            $search_form.find('.keyword, .default').show();
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

    $search_form
		.find('ul.recently').on('click', 'li .del', function(e){
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
		})
		.find('dl.recently').on('click', '.clear-all', function(e) {
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
