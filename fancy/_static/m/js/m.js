(function($){

function shake(obj,css) {
	var $obj = $(obj), init = parseInt($obj.css(css=(css||'left'))) || 0, center={}, left={}, right={}, left2={}, right2={};

	center[css] = init+'px';
	left[css]   = (init-15)+'px';
	right[css]  = (init+12)+'px';
	left2[css]  = (init-9)+'px';
	right2[css] = (init+6)+'px';

	$obj.animate(left, 75).animate(right, 135).animate(left2,105).animate(right2,75).animate(center,30);
}

var $win = $(window), $doc = $(document);

$.cookie = {
	'get' : function(name){
		var regex = new RegExp('(^|[ ;])'+name+'\\s*=\\s*([^\\s;]+)');
		return regex.test(document.cookie)?unescape(RegExp.$2):null;
	},
	'set' : function(name, value, days){
		var expire = new Date();
		expire.setDate(expire.getDate() + (days||0));
		document.cookie = name+'='+escape(value)+(days?';expires='+expire.toUTCString():'');
	}
};

// Workaround for Android scroll event bug:
//  Sometimes Android default web browser doesn't fire scroll event.
$(function(){
	var $body = $('body'), _st = $body.scrollTop(), _timer = null;

	$win.on('scroll.workaround', function(event){
		_st = $body.scrollTop();
	});

	$body.on('touchmove touchend', function(){
		var st = $body.scrollTop();
		if(_st != st) {
			clearTimeout(_timer);
			_timer = setTimeout(function(){ $win.trigger('scroll.workaround'); }, 50);
		}
	});
});

// escapeHTML
$.escapeHTML = function(s){var m={'&':'amp','<':'lt','>':'gt','"':'quot'};return s.replace(/&|<|>|\"/g,function(c){return m[c]?'&'+m[c]+';':c})};

// template
$.fn.template = function(args) {
	if(!args) args = {};
	var html = this.html().replace(/##([A-Z0-9_]+)##/g, function(whole,name){
		return args[name] || '';
	});

	return $(html);
};

// parse query string - equivalent to parse_string php function
jQuery.parseString = function(str){
	var args = {};
	str = str.split(/&/g);
	for(var i=0;i<str.length;i++){
		if(/^([^=]+)(?:=(.*))?$/.test(str[i])) args[RegExp.$1] = decodeURIComponent(RegExp.$2);
	}
	return args;
};
location.args = jQuery.parseString(location.search.substr(1));

// check iOS
(function(p){
 	if(!navigator.userAgent.match(/iPad|iPhone|iPod/i)) return;

	$('body').addClass('ios');

})(navigator.platform);

// csrf
$.ajaxPrefilter(function(options, originalOptions, jqXHR){
	if(options.type.toUpperCase() == 'POST'){
		var v = $.cookie.get('csrftoken');
		if(v && v.length){
			if(!options.headers) options.headers = {};
			options.headers['X-CSRFToken'] = v;
		}
		// prevent cache to avoid iOS6 POST bug
		options.url += ((options.url.indexOf('?') > 0)?'&':'?')+'_='+(new Date).getTime();
	}
});

// hide address bar
$win.load(function(){
	setTimeout(function(){ window.scrollTo(0,document.body.scrollTop||1) },0);
});

// get-app overlay
(function(){
	var $ov=$('#get-app'),$get=$ov.find('.step1 a.btn.blue'),$con=$ov.find('p.continue>a'),ua=navigator.userAgent.toLowerCase(),ckey='skip_mobile_app_overlay';

	if($.cookie.get(ckey) === '1') return $ov.remove();

	// when click mobile os icons
	$ov.find('span.ic').click(function(){
		$get.click();
		return false;
	});

	// continue to browse
	$con.click(function(){
		$.cookie.set(ckey, '1', 14);
		$ov.remove();
		return false;
	});

    function iOSVersion() {}

	if(/android|ip[oa]d|iphone/.test(ua)){
		$get
			.click(function(){
				$.cookie.set(ckey, 1, 14);
				// check whether native app is installed
				var clickedAt = +new Date, $link = $('#__fancy_app__');
				if(!$link.length) $link = $('<iframe id="__fancy_app__"></iframe>').hide().appendTo('body');
				setTimeout(function(){
					if(+new Date - clickedAt >= 2000) return;
					if(/android/.test(ua)){
						$('div.seq').addClass('step2');
					}else{
						$link.attr('src', 'http://itunes.apple.com/us/app/fancy/id407324335?mt=8');
					}
				},500);
				$link.attr('src', 'fancy://app');
				return false;
			});
	}else if (/windows (ce|phone)/.test(ua)){
		$get.attr('href','http://www.windowsphone.com/s?appid=884d66ff-264b-4e82-b07b-291c804fc3e1');
	}else{
		$get.click(function(){ alert(lang.NotSupportedDevice); $con.click(); return false });
		$ov.remove();
	}

	try{ $ov.show();  }catch(e){};
})();

// search
$('button.btn-search').click(function(){
	$('div.search-top').toggleClass('visible');
	$('#h .btn-search').toggleClass('visible');
	$('#h .btn-signup').toggleClass('visible');
	$('.popup').hide();
	return false;
});

// language popup and browse menu
(function(){
	var $active = null;
	$('.poplink')
		.click(function(event){
			var $par = $(this).parent();

			if (!$par.hasClass('active')) {
				$doc.trigger('popup');
				$('#h div.search-top, #h .btn-signup, #h .btn-search').removeClass('visible');
				$active = $par;
			}

			$par.toggleClass('active');

			return false;
		})
		.each(function(){
			// move left position of the upward arrow
			var $this = $(this), $layer = $($this.attr('href'));
			$layer.find('>i.arrow').css('left', ($this.offset().left+parseInt($this.innerWidth()/2)-5)+'px');
		});
	$('.popup').click(function(event){ return $(event.target).is('a,button,input') });
	$doc.on({
		touchstart : function(event){
			if(!$active) return;
			if(!$(event.target).closest('.popup,.poplink').length) $doc.trigger('popup');
		},
		popup : function(){
			if($active) {
				$active.removeClass('active');
				$active = null;
			}
		}
	});
})();

// fancy
$doc.on('click', '.fancy,.fancyd', function(){
	var $btn=$(this), params={'tag':''}, url, v, is_fancyd;
	if($(this).attr('v') ) return;

	if($btn.attr('require_login')) return require_login();
	if($btn.hasClass('loading')) return false;

	if (v=$btn.attr('tid')) params['thing_id'] = v;
	if (v=$btn.attr('rtid')) params['rtid'] = v;

	is_fancyd = !!params['rtid'];
	url = is_fancyd?'/delete_reaction_tag.xml':'/add_reaction_tag.xml';
	params.http_referer = document.referrer;

	var current_url = $(location).attr('href');
	if (current_url.search('utm=rec') > 0) {
		url += '?utm=rec';
	}

	$btn.addClass('loading');

	$.ajax({
		type : 'post',
		url  : url+'?t='+(new Date).getTime(),
		data : params,
		dataType : 'xml',
		success  : function(xml) {
			var $xml=$(xml),$st=$xml.find('status_code');
			if($st.text() == 1){
				$btn.removeClass('loading').toggleClass('fancy fancyd').attr('rtid',$xml.find('id').text());
				$btn[0].lastChild.nodeValue = ' '+(is_fancyd?lang['Fancy']:lang['Fancy\'d']);
			}
		},
		complete : function(){
			$btn.removeClass('loading');
		}
	});

	return false;
});

// following
$doc.on('click', '.follow,.following', function(){
	var $btn=$(this), url, params={}, following=$btn.hasClass('following');

	if($btn.attr('require_login')) return require_login();
	if($btn.hasClass('loading')) return false;
	if(!$btn.attr("lid") && !$btn.attr("uid") && !$btn.attr("eid") && !$btn.attr("sid")) return;

	if($btn.attr('lid')){
		params['lid'] = $btn.attr('lid');
		params['loid'] = $btn.attr('loid');

		url = following?'/unfollow_list.xml':'/follow_list.xml';
	}else{
		if($btn.attr("uid")){
			params['user_id'] = $btn.attr('uid');	
		}
		if($btn.attr("eid")){
			params['directory_entry_id'] = $btn.attr('eid');	
		}
		if($btn.attr("sid")){
			params['seller_id'] = $btn.attr('sid');
		}

		url = following?'/delete_follow.xml':'/add_follow.xml';
	}

	$btn.addClass('loading');

	$.ajax({
		type : 'post',
		url  : url,
		data : params,
		dataType : 'xml',
		success  : function(xml){
			var $xml = $(xml), $st = $xml.find('status_code');
			if(!$st.length) return;
			if($st.text() == 0) {
				var $msg = $xml.find('message');
				if($msg.text()) alert($msg.text());
				return;
			}
			$btn.toggleClass('follow following');
			$btn[0].lastChild.nodeValue = following?lang.Follow+(params['seller_id']?' Store':''):lang.Following+(params['seller_id']?' Store':'');
		},
		complete : function(){
			$btn.removeClass('loading');
		}
	});

	return false;
});

// comments
$('.comment form').submit(function(){
	var $form = $(this), elem = this.elements, params = {}, v;

	for (var i=0,c=elem.length; i < c; i++) {
		if (!elem[i].name) continue;
		v = $.trim(elem[i].value);
		if (!v) {
			elem[i].focus();
			shake(this);
			return false;
		}
		params[elem[i].name] = v;
	}

	params['comment'] = params['comment'].replace(/(@([a-z0-9_]*))/gi, '<a href=\"/$2\">$1</a>');

	$form.find('input:text,button').prop('disabled',true);

	$.ajax({
		type  : 'post',
		url   : '/add_comment.xml',
		data  : params,
		dataType : 'xml',
		success  : function(xml){
			var $xml = $(xml), $st = $xml.find('status_code');

			$form.find('input:text,button').removeAttr('disabled');

			if (!$st.length) return;
			if ($st.text() == 0) return alert($xml.find('message').text());

			var cid = $xml.find('comment_id').text(), $list = $form.prev('ul.comment-list'), $tpl = $list.find('>li:first').clone().show();
			$tpl.find('span.msg').html(params['comment']).end().appendTo($list);

			elem['comment'].value = '';
			elem['comment'].focus();
		}
	});

	return false;
});

// horizontal scrolling
(function(){
	var start_x, start_scroll_x, began;
	$('.hscroll')
		.on('touchstart', function(event){
			began = false;
			start_x = event.originalEvent.touches[0].pageX;
			start_scroll_x = this.scrollLeft || 0;
		})
		.on('touchmove', function(event){
			var dx = start_x - event.originalEvent.touches[0].pageX, v;
			if (!began && Math.abs(dx) > 10) began = true;
			if (began) {
				this.scrollLeft = start_scroll_x + dx;
				event.preventDefault();
			}
		});
})();

// placeholder
if(!('placeholder' in document.createElement('input'))) {
	$(function(){
		$('input[placeholder],textarea[placeholder]')
			.each(function(){
				if(!$.trim(this.value)) this.value = this.getAttribute('placeholder');
			})
			.focus(function(){
				var $this = $(this), v = $.trim($this.val());
				if (!v || v == $this.attr('placeholder')) $this.val('');
			})
			.blur(function(){
				var $this = $(this), v = $.trim($this.val());
				if (!v) $this.val($this.attr('placeholder'));
			});
	});
}

})(jQuery);

// Infiniteshow
(function($){
	var options;
	var defaults = {
		loaderSelector : '#infscr-loading', // an element to be displayed while calling data via ajax.
		nextSelector : 'a.btn-more', // an elements which heads for next data.
		itemSelector : '#content .inside-content .figure-row',
		prepare : 3000, // indicates how many it should prepare 
		dataType : 'html', // the type of ajax data.
		success : function(data){}, // a function to be called when the request succeeds.
		error : function(){ }, // a function to be called if the request fails.
		comeplete : function(xhr, st){} // a function to be called when the request finishes (after success and error callbacks are executed).
	};

	$.infiniteshow = function(opt) {
		options = $.extend({}, defaults, opt);

		var $win = $(window),
			$doc = $(document),
			$end = $('#page-end'),
			ih   = $win.innerHeight(),
			$url = $(options.nextSelector).hide(),
			url  = $url.attr('href'),
			bar  = $('div.pagination'),
			cur  = '',
			ts   = '',
			calling = false;

		function docHeight(){ return $end[0].offsetTop };

		$win.on('resize.infiniteshow', function(){
			ih = $win.innerHeight();
			$win.trigger('scroll.infiniteshow');
		});

		$win.on('beforeunload', function(){
			if(cur && ts && window.history && 'pushState' in window.history) {
				//try { history.pushState(ts, document.title, cur) }catch(e){};
			}
		});

		$win.on('scroll.infiniteshow', function(){
			if (calling || !url || options.disabled) return;

			var rest = docHeight() - $doc.scrollTop();
 			if (rest > options.prepare) return;

			var $loader = $(options.loaderSelector).show();
			
			calling = true;

			$.ajax({
				url : url,
				dataType : options.dataType,
				success : function(data, st, xhr) {
					var $sandbox = $('<div>'),
						$contentBox = $(options.itemSelector).parent(),
						$next, $rows;

					$sandbox[0].innerHTML = data.replace(/^[\s\S]+<body.+?>|<((?:no)?script|header|nav)[\s\S]+?<\/\1>|<\/body>[\s\S]+$/ig, '');
					$next = $sandbox.find(options.nextSelector);
					$rows = $sandbox.find(options.itemSelector);

					$rows.find('img').each(function(){
						var mw=document.body.offsetWidth-30,w=this.getAttribute('width'),h=this.getAttribute('height'),nw,nh;
						nh = (mw<w)?Math.floor(mw/w*h):h;
						if(nh < 400) this.style.minHeight = nh+'px';
					});

					// update current url
					cur = $url.attr('href');
					ts  = $url.attr('ts');

					$contentBox.append($rows);
					if ($next.length) {
						url = $next.attr('href');
						$url.attr({
							'href' : $next.attr('href'),
							'ts'   : $next.attr('ts')
						});
					} else {
						url = '';
					}

					$loader.hide();
					calling = false;

					// Triggers scroll event again to get more data if the page doesn't have enough data still.
					$win.trigger('scroll.infiniteshow');

                    if (options.post_callback != null) {
                        options.post_callback($rows);
                    }

				},
				error : function(xhr, st, err) {
					$loader.hide();
					calling = false;
					url = '';
				}
			});
		});

		$win.trigger('scroll.infiniteshow');
	};

	$.infiniteshow.option = function(name, value) {
		if (typeof(value) == 'undefined') return options[name];
		options[name] = value;

		if (name == 'disabled' && !value) $win.trigger('scroll.infiniteshow');
	};
})(jQuery);


function require_login(extra_params) {
    var next_param = (/^\/login/.test(location.pathname)?'':'?next='+encodeURIComponent(location.href));
    var url = '/signup' + next_param;
    if (extra_params != undefined && Object.keys(extra_params).length > 0) {
	var params = (next_param == '') ? '?' : '&';
	var extra_params_list = [];
	for(k in extra_params) {
	    var param = k + '=' + extra_params[k];
	    extra_params_list.push(param);
	}
	params += extra_params_list.join('&');
	url += params;
    }
    location.href = url;
    return false;
};


// gift-banner
(function($){

	// banner close button
	$('.top-banner .close').click(function(event){
		event.preventDefault();

		var $this = $(this), cookie_name = $this.attr('rel'), expires = new Date();
		$this.closest('.top-banner').hide();
		expires.setDate(expires.getDate() + 14); // two weeks
		document.cookie = cookie_name + '=true; path=/; expires='+expires.toUTCString();
	});

    $(".gift-banner button.btn-do").click(function() {
        $('.gift-expert-popup').css('height',$(document).height()+'px').show();
    });

    $("#gift-popup a.menuitem-gift-recommend").click(function(){
        var login_require = $(this).attr('require_login'); 
        if (typeof(login_require) != undefined && login_require != null && login_require=='true'){ 
            return require_login();
        }
        $('#browse-link').click();
        $('.gift-expert-popup').show();
    });

    $(".gift-banner button.btn-no").click(function() {
        $('.gift-banner').hide();
		var expire = new Date();
		expire.setDate(expire.getDate() + 14);
		document.cookie = 'hide_gift_banner=true;expires='+expire;
    });

    $(".gift-expert-popup").click(function(event) {
        if (!$(event.target).is('textarea') && !$(event.target).is('button')) {
            $(this).hide();
        }
    });
    $(".gift-expert-popup textarea").each(function(){
		var curVal = $(this).val();
		$(this).css('color','#999');
		$(this).focus(function(){
			if($(this).val()==curVal){
				$(this).val('').css('color','#111');
			}
		});
		$(this).blur(function(){
			if($(this).val()==''){
				$(this).val(curVal).css('color','#999');
			}
		});
	});

    $(".gift-expert-popup button.btn-send").click(function() {
        var txt_area = $(".gift-expert-popup textarea");
        var default_txt = $(".gift-expert-popup span.default-text").text();
        var txt = txt_area.val();
        if (txt == default_txt || txt.length < 20) {
            alert("Please give us some more details so we can help you find an amazing gift!");
            return false;
        }
        $.ajax({
            url: '/ask_gift_expert.json',
            type: 'post',
            data: {text: txt},
            dataType: 'json',
            success: function(json) {
                if (json.status_code == 1) {
                    alert(json.message);
                    $('.gift-expert-popup').hide();
                    $(".gift-banner button.btn-no").click();
                }
                else {
                    alert(json.message);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("failed to send an email");
            }
        });
    });

	(function(){
		var sending = false;
		$('.confirm-email-box a.resend').click(function(event){
			var $this = $(this).attr('href', '#');

			event.preventDefault();

			if(sending) return;
			sending = true;

			$.ajax({
				type : 'post',
				url  : '/send_email_confirmation.json',
				data : {resend : true},
				success : function(response){
					if (typeof response.status_code == 'undefined') return;
					if (response.status_code == 1) {
						$this.parent().css('opacity','0').css('opacity','1').html(gettext('Success! You should receive a new confirmation email soon.'));
					} else if (response.status_code == 0) {
						if(response.message) alert(response.message);
					}
				},
				complete : function(){
					sending = false;
				}
			});
		});
	})();
})(jQuery);
// new layout
$(document).ready(function(){
	$("#wrap").find('#aside_left, #aside_right').css('min-height',$(window).height()+'px');
	$("#wrap").delegate(".show_left #content","click",function(e){ 
		$('#header a.nav').trigger("click");
		$('#wrap').removeClass('show_search');
	})
	$("#wrap").delegate(".show_right #content","click",function(e){ $('#header a.cart').trigger("click") })

	$('#header a').click(function(){
		if ($(this).hasClass('nav')==true) {
			$('#wrap').removeClass('show_right').toggleClass('show_left');
			return false;
		}
		if ($(this).hasClass('cart')==true) {
			$('#wrap').removeClass('show_left').toggleClass('show_right');
			return false;
		}
	});
	$('.lnb .show_more').click(function(){
		if($(this).parents('dl').hasClass('show')==true){$(this).find('b').text(gettext('Show More')).parents('dl').removeClass('show');}
		else{$(this).find('b').text(gettext('Show Less')).parents('dl').addClass('show');}
		return false;
	});
	$('.lnb .show-shop').click(function(){
		$(this).parents('.lnb').addClass('show_sub');
		return false;
	});
	$('.lnb .hide-sub').click(function(){
		$(this).parents('.lnb').removeClass('show_sub');
		return false;
	});
	$('.search-top input').focus(function(){
		$('#wrap').addClass('show_search').removeAttr('style');
	});
	$('.search-top .btn-remove').click(function(){
		$(this).parents('.search-top').find('input').val('');
		$(".search-result").hide();
	});
	$('#aside_left .search-top .btn-cancel').click(function(){
		$('#wrap').removeClass('show_search').removeClass('show_left');
	});
	
	var searchTimer;
	$('.search-top input').bind("propertychange keyup input paste", function(){
		if(searchTimer) clearTimeout(searchTimer);
		var word = $(".search-top input").val();	
		if(word) $('.search-top .btn-remove').show();
		searchTimer = setTimeout( (function(q){searchSuggestion(q);}).bind(this,word) ,200);
	});
	$('.search-top input').bind("keyup", function(e){
		if (e.keyCode && e.keyCode == 13){
			var word = $(".search-top input").val();
			document.location.href = "/search?q="+word;
		}
	});

});

function searchSuggestion(word){
	var $result = $(".search-result");
	var $things = $result.find(".search-thing");	
	var $users = $result.find(".search-people");
	var $tpl_thing = $("#tpl-search-suggestions-things");
	var $tpl_user = $("#tpl-search-suggestions-people");
	$things.find("a.more").addClass("loading");
	$.ajax({
		type : 'GET',
		url  : '/search-suggestions.json',
		data : {q:word,thing_limit:8},
		dataType : 'json',
		success  : function(json){			
			$things.find("a.more").removeClass("loading");
			try {
				if(json.things.length) $things.show().find("dd").remove();
				$.each(json.things, function(i,v,a){
					$tpl_thing.template({URL:v.html_url + '?utm=rec', IMG_URL:v.thumb_url, TITLE:v.name}).appendTo($things);
				});
				$result.find("a.more").attr("href","/search?q="+word);

				if(json.users.length) $users.show().find("dd").detach();
				$.each(json.users, function(i,v,a){
					$tpl_user.template({URL:v.html_url + '?utm=rec', IMG_URL:v.image_url, USERNAME:v.username, FULLNAME:v.fullname}).appendTo($users);
				});
				$result.show();
			} catch(e) {
				console.log(e);
			}
		}
	});
}

