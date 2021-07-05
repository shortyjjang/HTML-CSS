
var $win = $(window);

(function($){

// function shake(obj,css) {
//     var $obj = $(obj), init = parseInt($obj.css(css=(css||'left'))) || 0, center={}, left={}, right={}, left2={}, right2={};

//     center[css] = init+'px';
//     left[css]   = (init-15)+'px';
//     right[css]  = (init+12)+'px';
//     left2[css]  = (init-9)+'px';
//     right2[css] = (init+6)+'px';

//     $obj.animate(left, 75).animate(right, 135).animate(left2,105).animate(right2,75).animate(center,30);
// }

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

// check iOS
(function(p){
    if(!navigator.userAgent.match(/iPad|iPhone|iPod/i)) return;

    $('body').addClass('ios');

    if(!window.navigator.standalone){
        var height = document.documentElement.clientHeight;
    }
    


})(navigator.platform);

// hide address bar
$win.load(function(){
    setTimeout(function(){ window.scrollTo(0,document.body.scrollTop||1) },0);
});


// open-app in chrome >=28

(function(){
    var ua=navigator.userAgent.toLowerCase();
    function chromeVersion() {
        if (/chrome/i.test(navigator.userAgent)) {
            var v = (navigator.appVersion).match(/Chrome\/(\d+)?/);
            return parseInt(v[1], 10);
        }
    }

    if (/android/i.test(ua) && /chrome/i.test(ua) && chromeVersion()>=28){
        $("<a href='intent://app#Intent;scheme=fancy;package=com.thefancy.app;end' class='app'></a>").appendTo("#header");
    }
})();

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


function require_login(extra_params, next) {
    next = next || location.href;
    var next_param = (/^\/login/.test(location.pathname)?'':'?next='+encodeURIComponent(next));
    var url = '/signup' + next_param;
    if (extra_params && Object.keys(extra_params).length > 0) {
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
        $('#notibar-email-confirm a:not([href^="/"]), .confirm-email-box a.resend').click(function(event){
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

    $('#pop_wrap input').focusin(function(){
        $('#pop_wrap').addClass('focus');
    });
    $('#pop_wrap input').focusout(function(){
        setTimeout(function(){$('#pop_wrap').removeClass('focus');},100);
    });

    var $current = $("#header .header-menu a.current");

    $('#header a.nav').click(function(){
        $current.toggleClass('current');
        $(this).toggleClass('current');
        $('#wrap').removeClass('show_right').toggleClass('show_left');
        return false;
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
    $('#aside_left .search-top input').focus(function(){
        $('#wrap').addClass('show_search');
    });
    $('#aside_left .search-top .btn-remove').click(function(){
        $(this).hide().parents('.search-top').find('input').val('');
        $("#aside_left .search-result").hide();
    });
    $('#aside_left .search-top .btn-cancel').click(function(){
        $('#wrap').removeClass('show_search').removeClass('show_left');
    });
    
    $('.option-list a.share').click(function(){
        x=$(this).position();
        var top = x.top;
        openPop('share_thing');
        //$('#pop_wrap .share_thing').css('margin-top', Math.max(50,top-($('#pop_wrap .share_thing').height()))+'px');
        if ($(this).attr('require_login') == 'true') return require_login();
        $("#ov-share").trigger('show');
        return false;
    });
    $('.popup.share_thing dt a').click(function(){
        $('.share_thing dl').removeClass('current');
        $(this).parents('dl').addClass('current');
        return false;
    });
    $('#pop_wrap').on('click', function(event){
        var prev_dialog = $('.popup.'+$(this).hasClass());
        if( $('#pop_wrap').hasClass('new-dialog') ) return;
        if(event.target === this && prev_dialog) {
            closePop();
        }
    });


    // add to list
    (function(){

        function addNewCategory(){

            var $inp = $("#pop_wrap .add_list input#quick-create-list");
            var $categoryList = $('#pop_wrap .add_list ul.lists');
            
            var val = $.trim( $inp.val() );
            if (!val) return false;

            $.ajax({
                type  : 'post',
                url   : '/create_list.xml',
                data  : {'list_name': val},
                cache : false,
                dataType : 'xml',
                success  : function(xml) {
                    var $xml = $(xml), $st = $xml.find('status_code');
                    if (!$st.length || $st.text() != 1) return;
                    if($xml.find("created").text()=='False'){
                        alert("A list with this name already exists");
                        return;
                    }
                    var lid = $xml.find('list_id').text();
                    
                    var opt = $("<li><input type='checkbox' id='cate_"+lid+"' value='"+lid+"'><label for='cate_"+lid+"'> "+val+"</label></li>");
                    $categoryList.prepend(opt);

                    $inp.val('');
                }
            });
        }

        $('.figure-product a.list, .figure-button a.list').click(function(){
            var $this = $(this);

            if ($this.attr('require_login') == 'true') return require_login();

            var x=$(this).position();
            var top = x.top;
            var tid = $this.attr('tid');
            openPop('add_list');

            var $layer = $('#pop_wrap .add_list'), $b = $('body'), $sel = $layer.find('ul').html('<li>Loading...</li>');

            $layer.find('.lists').attr('tid', $this.attr('tid'));

            var param = {'tid':tid};
            if($this.attr("rtid")) param.rtid = $this.attr("rtid");
            param.http_referer = document.referrer;

            var url = '/_get_list_checkbox.html';
            var current_url = $(location).attr('href');
            if (current_url.search('utm=rec') > 0) {
                url += '?utm=rec';
            }

            $.ajax({
                type  : 'get',
                url   : url,
                data  : param,
                cache : false,
                dataType : 'html',
                success  : function(html) {
                    $sel.html('');

                    var opt = $("<li class='wishlist'><input type='checkbox' id='wanted_"+tid+"' value='on'><label for='wanted_"+tid+"'>Wish List</label></li>");
                    if($(html).filter("[name=wanted]").val()=="true") opt.find("input").attr('checked', 'checked');
                    $sel.append(opt);

                    html.replace(/name="(\d+)"[^>]+>([^<]+)<\/label>/g, function($0,$1,$2){
                        var opt = $("<li class='list'><input type='checkbox' id='cate_"+$1+"' value='"+$1+"'><label for='cate_"+$1+"'>"+$2+"</label></li>");
                        if($0.indexOf('checked') > -1) opt.find("input").attr('checked', 'checked');
                        $sel.append(opt);
                    });
                    centerPop('add_list');
                }
            });

            return false;
        });

        $('#pop_wrap .add_list')
            .on('change', '.lists li.list input', function(e){
                var $this = $("#pop_wrap .add_list .lists");

                if ($this.hasClass('loading')) return false;
                $this.addClass('loading');

                var checked_list_ids = [], unchecked_list_ids = [];
                checked_list_ids = $.map( $this.find("li input[type=checkbox]:checked"), function(i) {
                    return $(i).val();
                });

                unchecked_list_ids = $.map( $this.find("li input[type=checkbox]:not(:checked)"), function(i) {
                    return $(i).val();
                });

                var params = {};
                params['tid'] = $this.attr('tid');
                params['checked_list_ids'] = checked_list_ids.join(',');
                params['unchecked_list_ids'] = unchecked_list_ids.join(',');
                            
                function save(){
                    $.ajax({
                        type : 'post',
                        url : '/save_list_items',
                        data : params,
                        dataType : 'xml',
                        success  : function(xml) {
                            var $xml = $(xml), $st = $xml.find('status_code');
                            if (!$st.length || $st.text() != 1) return;

                            closePop();
                            $this.removeClass('loading');
                        }
                    });
                };

                save();

                e.preventDefault();
                return false;           
            })
            .on('change', '.lists li.wishlist input', function(e){
                var $this = $(this), tid = $this.closest('.lists').attr('tid');
                
                params = { owned: false, wanted: $this.prop('checked') }
                
                $.ajax('/rest-api/v1/things/'+tid, { type:'PUT', data: params })

            })
            .find('input#quick-create-list')
                .keydown(function(event,force){
                    if (!force && (!event.keyCode || event.keyCode != 13)) return true;

                    addNewCategory();

                    event.preventDefault();
                    return false;
                })
                .submit(function(e){
                    e.preventDefault();
                    return false;
                })
            .end()
            .find('button.btn-create')
                .click(function(e){
                    var $inp = $("input[name=new-category]");

                    addNewCategory();

                    e.preventDefault();
                    return false;
                })
            .end()
            .find(".search input:text")
                .on('change keyup paste', function(e){
                    var $this = $(this), val = $this.val().toLowerCase(), $list = $('#pop_wrap .add_list ul.lists li');
                    if(!val){
                        $list.show();
                        return;
                    }
                    $list.each(function(){
                        var $li = $(this), name = $li.find("label").text().trim().toLowerCase();
                        if( name.indexOf(val) > -1){
                            $li.show();
                        }else{
                            $li.hide();
                        }
                    })

                })

    })();

});

function centerPop(str){
    if ($('#pop_wrap').find('.'+str).height()>$(window).height()) {
        $('#pop_wrap').find('.'+str).css('margin-top','10px');
    }else{
        $('#pop_wrap').find('.'+str).css('margin-top',Math.max(($(window).height()-$('#pop_wrap').find('.'+str).height())/2)+'px');
    }
}
function openPop(str) {
    $('#pop_wrap').addClass(str).show();
    if ($('#pop_wrap').find('.'+str).height()>$(window).height()) {
        $('#pop_wrap').find('.'+str).css('margin-top','10px');
    }else{
        $('#pop_wrap').find('.'+str).css('margin-top',Math.max(($(window).height()-$('#pop_wrap').find('.'+str).height())/2)+'px');
    }
    setTimeout(function(){$('body').addClass('fixed');},300);
    return false;
}
function closePop() {
    $('body').removeClass('fixed');
    $('#pop_wrap').removeAttr('class').removeAttr('style').hide().find('.popup').removeAttr('style');
    return false;
}

// profile header slide 
$(function(){
    var bioWidth = $(".profile .scroll-wrap").width();
    $('.profile .scroll').swipe({
        //allowPageScroll:"horizontal",
        threshold:30,
        triggerOnTouchEnd:false,
        swipeLeft:function(e){
            $('.profile .scroll').animate({scrollLeft: (bioWidth/2)+"px"},300,"easeInOutExpo");
            $('.profile .pagination a').removeAttr('class');
            $('.profile .pagination a:last-child').addClass('current');
        },
        swipeRight:function(e){
            $('.profile .scroll').animate({scrollLeft:"0px"},300,"easeInOutExpo");
            $('.profile .pagination a').removeAttr('class');
            $('.profile .pagination a:first-child').addClass('current');
        }
    });
    $('.profile .pagination a:last-child').click(function(){
        $('.profile .scroll').scrollLeft($('.scroll').width());
        $('.profile .pagination a').removeAttr('class');
        $(this).addClass('current');
    });
    $('.profile .pagination a:first-child').click(function(){
        $('.profile .scroll').scrollLeft(0);
        $('.profile .pagination a').removeAttr('class');
        $(this).addClass('current');
    });
});

// workaround for  label for working
$(".category-list").click(function(e){
    e.stopPropagation();
}) 


jQuery(function($){
    // common popup script
    var $container = $('#pop_wrap'), prev_dialog=null, duration=300, distance=100, container_h;
    var $win = $(window), $body = $('body');

    $container
        .on('click', function(event){
            if(event.target === this && prev_dialog) {
                if ($container.hasClass('create_po')==true) {
                    var ans=confirm("You haven't finished PO yet. Do you want to leave without finishing? Are you sure you want to close this popup?") 
                    if(ans ==true) {event.preventDefault();prev_dialog.close();}
                }
                else if( !$container.hasClass("update-browser") ) {
                    event.preventDefault();
                    prev_dialog.close();
                }
            }
        })
        .delegate('.ly-close,.btn-close,.btn-cancel', 'click', function(event){
            if ($container.hasClass('create_po')==true) {
                var ans=confirm("You haven't finished PO yet. Do you want to leave without finishing? Are you sure you want to close this popup?") 
                if(ans ==true) {
                    event.preventDefault();
                    if(prev_dialog) prev_dialog.close();
                }
            }else{
                event.preventDefault();
                if(prev_dialog) prev_dialog.close();
            }
        });

    // ESC to close a popup
    $body.on('keyup.popup', function(event){
        if(event.keyCode == 27 && prev_dialog) prev_dialog.close();
    });

    // dialog
    $.dialog = function(popup_name){
            var $popup = $container.find('>.'+popup_name);
            return {
                name : popup_name,
                $obj : $popup,
                loading : function() {
                    var $c = $container.addClass(popup_name).show();
                    setTimeout(function(){ $c.css('opacity',1); },1);
                    this.$obj.hide();
                    prev_dialog = this;
                    $container.data('lastest_popup_name', popup_name);
                    $container.find('.loader').show();
                    return this;
                },   
                open : function(){
                    var $c,h,mt,sc=$win.scrollTop();
                    if(prev_dialog) prev_dialog.close(true);

                    $('body').addClass('fixed');
                    $container.addClass('new-dialog');
                    if(!container_h) container_h = $container.height();
                    $container.height( $(document).height() );
                    
                    if($win.innerHeight() < $body[0].scrollHeight) {
                        $body.css('overflow-y','scroll');
                    }
                    $container.find('.loader').hide();
                    $c = $container.addClass(popup_name).show().data('scroll-top',sc);

                    this.center().$obj.trigger('open', arguments).show().siblings('.popup').css('display','');

                    if($c.length) {
                        if(Modernizr.csstransitions && !$popup.hasClass('no-slide')){
                            mt = this.center(true);
                            ml = $(window).width()-$popup.width();
                            $popup.removeClass('animated').css({marginTop:(mt+distance)*2+'px',marginLeft:ml/2+'px',opacity:0});
                            setTimeout(function(){ $popup.addClass('animated') }, 1);
                            setTimeout(function(){ $popup.css({marginTop:mt+'px',opacity:1}) }, 10);
                        }
                        setTimeout(function(){ $c.css('opacity',1); },1);

                        $('#container-wrapper > .container').css('top',-sc+'px');
                        $win.scrollTop(0); // workaround for mac chrome
                    }

                    prev_dialog = this;
                    $container.data('lastest_popup_name', popup_name);

                    return this;
                },
                close : function(keep_container){
                    if(!this.showing() || !this.can_close()) return;
                    $container.find('.loader').hide();
                    $c = $container.eq(keep_container?1:0).end();
                    $('body').removeClass('fixed');
                    $container.removeClass('new-dialog');
                    $body.css('overflow-y','');

                    if(keep_container) {
                        $container.removeClass(popup_name);
                    } else {
                        // restore scroll position
                        $('#container-wrapper > .container').css('top',0);
                        $win.scrollTop($c.data('scroll-top'));

                        if(Modernizr.csstransitions) {
                            $container.css('opacity', 0);
                            setTimeout(function(){ $container.removeClass(popup_name).hide() },duration+100);
                        } else {
                            $container.removeClass(popup_name).hide();
                        }
                    }

                    $popup.trigger('close').hide();
                    prev_dialog = null;
                    return this;
                },
                center : function(return_value){
                    var mt = Math.max(Math.floor((container_h-this.$obj.outerHeight())/2)+(+this.$obj.attr('data-offset')||0)-20,5);
                    if($popup.attr('data-margin-top')) mt = $popup.attr('data-margin-top');
                    
                    if(return_value) return mt;

                    this.$obj.css('margin-top', mt+'px');
                    return this;
                },
                showing : function(){
                    return $container.is(':visible') && $container.hasClass(popup_name);
                },
                can_close : function(){ return true }
            };
        };
});

jQuery(function($) {
    $('#content').delegate('.btn-live', 'click', function() {
        var $this = $(this);
        var chat_id = $(this).attr('livechat-id');
        if($this.attr('require_login')) {
            window.require_login(null, '/livechat/'+chat_id);
            return;
        }
        location.href = $this.data('url');
    });
    $('#content').delegate('.livechat .btn-notify', 'click', function() {
        event.stopPropagation();
        event.preventDefault();
        var chat_id = $(this).attr('livechat-id');
        if($(this).attr('require_login')) {
            window.require_login(null,'/livechat/'+chat_id+'?subscribe');
            return;
        }
        $.post('/rest-api/v1/livechat/subscribe/'+chat_id, function() { });
        $(this).parent().find('.btn-subscribed').show();
        $(this).hide();
        try{track_event('Subscribe to Live Chat', {'chat_id':chat_id});}catch(e){}

    });
    $('#content').delegate('.livechat .btn-subscribed', 'click', function() {
        var chat_id = $(this).attr('livechat-id');
        $.ajax({
            url:'/rest-api/v1/livechat/subscribe/'+chat_id,
            type:'DELETE',
            success:function(json) {
            }
        });
        $(this).parent().find('.btn-notify').show();
        $(this).hide();
    });

    $(document).on('click', '.follow, .following', function(){
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
                if($btn[0].lastChild.nodeValue) $btn[0].lastChild.nodeValue = following?lang.Follow+(params['seller_id']?' Store':''):lang.Following+(params['seller_id']?' Store':'');
                if($btn.find('span')[0]) $btn.find('span').text( following?lang.Follow+(params['seller_id']?' Store':''):lang.Following+(params['seller_id']?' Store':'') );
    
            },
            complete : function(){
                $btn.removeClass('loading');
            }
        });
    
        return false;
    });
});
