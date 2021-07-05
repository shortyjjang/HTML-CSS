// Show someone dialogs and buttons
jQuery(function($){
    var prev_val = "";
    var $name = $('<b class="name"><button type="button" class="btn-del">Delete</button></b>');
    var $item = $('<i class="user"><a><img src="" /> <b>Hannah McDonald</b> <small>hannahmc</small></a></i>');
    var txt_add = null;


    // expand textarea automatically
    $.fn.autoExpandWithMax = function(){
        var $ta=this,$clone,timer=null,mh=$ta.attr('min-height')||40;

        function resize(){
            var h = $clone.val($ta.val()).get(0).scrollHeight;
            var maxHeight = parseInt($ta.attr('max-height'));
            if( h > maxHeight){
                $ta.css('overflow', "auto");
            }else{
                $ta.css('overflow', "hidden");
            }

            var h = Math.min(maxHeight, Math.max(h,mh));

            $ta.css('height', h+"px");
        };

        function onkeydown(event){
            this.scrollTop = 0;
            clearTimeout(timer);
            timer = setTimeout(resize,50);
        };

        $ta.nextAll('textarea').remove();
        if($clone) $clone.remove();
        $clone = $ta.clone().removeAttr('id').removeAttr('name').removeAttr('style').css({padding:0,margin:0}).addClass('no-effect').attr('tabindex','-1').insertAfter($ta);

        $ta.css('overflow','hidden').off('keydown.expand').on('keydown.expand',onkeydown);

        return $ta;
    };

    $('#content')
        .delegate('.btn-someone', 'click', function(event){
            event.preventDefault();
            if(!txt_add){
                txt_add = $(this).closest(".buttons").find(".show_someone .email-frm .add").text().split('|');
            }
            $(this).closest(".buttons").find(".show_someone")
                    .find(".success").hide().end()
                    .find(".frm, .email-frm").show().end()
                    .find(".email-frm b.name").remove().end()
                    .find("input:text").val('').end()
                    .find(".frm > .user-list i.user, .frm > .user-list i.load-more").remove().end()
                    .find(".frm > .user-list > i.result, .frm > .send.after").hide().end()
                    .find(".frm > .user-list > i.empty").show().end()
                    .find(".email-frm .add").text(txt_add[0]).show().end()
                    .find(".email-frm .text").attr('placeholder',txt_add[0]).end()
                    .find("textarea:eq(0)").val('').autoExpandWithMax();

            show_placeholder($(this).closest(".buttons").find(".show_someone"));

            $(this).closest('.buttons').find('.menu-container').removeClass('opened').find('.show_someone').show();
            //$(this).closest(".buttons").find(".show_someone .email-frm .add").click();
            var showSomeoneTimer = null;
            $(this).closest(".buttons").find(".show_someone .user-list").off('scroll').on('scroll', function(){
                var $this = $(this);
                if(showSomeoneTimer) return;
                showSomeoneTimer = setTimeout(function(){
                    showSomeoneTimer = null;
                    if( $this.find("i.load-more:not(.loading)")[0] && $this.scrollTop()+100 > $this.find("i.load-more:not(.loading)").offset().top )
                    $this.find("i.load-more:not(.loading)").mousedown();
                }, 50)
            });
            return false;
        })
        .delegate('em.show_someone', 'mouseover', function(event){
			if ($(event.target).hasClass('trick')===false) {
				if ($('html').hasClass('fixed')===false) {
					var sc=$(window).scrollTop();
					var ww = $('#container-wrapper').width();
					$('html').addClass('fixed');
					$('#container-wrapper').find('.container').css('top',-sc+'px').end().css('padding-right',$(window).width()-ww+'px');
					$('#header-new').css('padding-right',$(window).width()-ww+'px');
				}
			}
        })
        .delegate('em.show_someone .trick', 'mouseover', function(event){
			if ($('html').hasClass('fixed')===true) {
				var sc=$('#container-wrapper > .container').position().top;
				$('html').removeClass('fixed');
				$(window).scrollTop(-sc);
				$('#container-wrapper').find('.container').css('top','0px').end().css('padding-right','0');
				$('#header-new').css('padding-right','0px');
			}
        })
        .delegate('em.show_someone .email-frm', 'click', function(event){
            var $el = $(this).closest('.show_someone');
            $el.find(".email-frm").addClass("focus");
            $el.find(".add").hide();
            if($el.find(".add").text()==txt_add[0]){
                $el.find(".email-frm .text").show().focus();
            }
            show_placeholder($el);
            //$el.find(".user-list").find("i.user").remove().end().find("i.result").hide();
            prev_val = '';
        })
        .delegate('em.show_someone .email-frm input:text', 'changed', function(event){
            var v = $.trim($(this).val());
            var $list = $(this).closest('.show_someone').find(".user-list");
            if(!v.length || v.indexOf('@') >= 0){
                try {
                    if(xhr && xhr.abort) xhr.abort();
                } catch(e){};
                $list.find("i.result").hide().end().find("i.user,i.load-more").remove();
                if(!v.length){
                    show_placeholder($(this).closest('.show_someone'));
                }
                return;
            }
            $list.find("i.user").remove();
            request_username($(this).closest('.show_someone'), v);
        })
        .delegate('em.show_someone .email-frm input:text', 'blur', function(event){
            var v = $.trim($(this).val());
            var $el = $(this).closest('.show_someone');
            var $add = $el.find(".add");
            var $list = $el.find(".user-list");

            if(v.indexOf('@') >= 0) {
                $name.clone()
                    .prepend(document.createTextNode(v))
                    .attr('email', v)
                    .insertBefore($add);
                $add.text(txt_add[1]).hide();
                $(this).attr('placeholder',txt_add[1]);
            }

            $el.find(".email-frm").removeClass("focus");
            if($add.text()==txt_add[0]) $add.show();
            $(this).hide().val('');
            if(!$el.find(".email-frm b.name").length){
                $el.find(".frm .send.after").hide();
                show_placeholder($el);
            }
        })
        .delegate('em.show_someone .email-frm b.name .btn-del', 'click', function(event){
            var $el = $(this).closest('.show_someone');
            var uid = $(this).closest('b.name').attr('uid');
            $(this).closest('b.name').remove();
            if(uid){
                $el.find(".frm .user-list i[uid="+uid+"]").removeClass("on");
            }
            if(!$el.find(".email-frm b.name").length){
                $el.find(".frm .send.after").hide();
                $el.find(".email-frm .add").text(txt_add[0]).show();
                $el.find(".email-frm .text").attr('placeholder',txt_add[0]);
                show_placeholder($el);
            }
        })
        .delegate('em.show_someone .email-frm input:text', 'keydown', function(event){
            var v = $.trim($(this).val());
            var $inp = $(this);
            var $el = $(this).closest('.show_someone');
            var $add = $el.find(".add");
            var $list = $el.find(".user-list");

            setTimeout(function(){var val=$.trim($inp.val());if(val==prev_val)return;prev_val=val;$inp.trigger('changed')}, 10);

            switch(event.keyCode) {
                case 8: // backspace
                    if ($inp.val().length != 0) return true;
                    var $names = $el.find('b.name');
                    if ($names.length > 0) $names.eq(-1).remove();
                    if(!$el.find(".email-frm b.name").length){
                        $el.find(".frm .send.after").hide();
                        $el.find(".email-frm .add").text(txt_add[0]);
                        $el.find(".email-frm .text").attr('placeholder',txt_add[0]);
                        show_placeholder($el);
                    }
                    return false;
                case 9: // tab
                case 13: // enter
                case 32: // space
                case 186: // ';'
                case 188: // ','
                    if ($inp.val().indexOf('@') > 0) {
                        setTimeout(function(){
                            var email = $.trim($inp.val());
                            $inp.val('');
                            $name.clone()
                                .prepend(document.createTextNode(email))
                                .attr('email', email)
                                .insertBefore($add);

                            $add.text(txt_add[1]).hide();//.click();
                            $el.find(".email-frm .text").attr('placeholder',txt_add[1]).hide();
                            $el.find(".frm > .send.after").show().end();
                            $el.removeClass('hover');
                        }, 10);
                    } else {
                        if ( event.keyCode == 9 && $list.is(':hidden')) return true;
                        if ( event.keyCode == 32 ) return true;
                        $list.trigger('key.enter');
                    }
                    return false;
                case 38: $list.trigger('key.up'); return false;
                case 40: $list.trigger('key.down'); return false;
            }
        })
        .delegate('em.show_someone .user-list', 'key.up key.down', function(event){
            var $el = $(this).closest('.show_someone');
            var $list = $el.find(".user-list");
            if ($list.is(':hidden')) return false;

            var $items = $list.children('i.user'), up = (event.namespace=='up'), idx = Math.min(Math.max($items.filter('.selected').index()-2+(up?-1:1),0), $items.length-1);
            var $on = $items.removeClass('selected').eq(idx).addClass('selected'), bottom;

            if (idx === $items.length-3) {
                $el.addClass('hover');
            }else{
                $el.removeClass('hover');
            }

            if (up) {
                if (this.scrollTop > $on[0].offsetTop) this.scrollTop = $on[0].offsetTop;
            } else {
                bottom = $on[0].offsetTop - this.offsetHeight + $on[0].offsetHeight;
                if (this.scrollTop < bottom) this.scrollTop = bottom;
            }
        })
        .delegate('em.show_someone .user-list', 'key.enter', function(event){
            var $el = $(this).closest('.show_someone');
            var $list = $el.find(".user-list");
            $list.filter(':visible').children('i.selected').mousedown();
        })
        .delegate('em.show_someone .user-list i.user:not(.load-more)', 'mousedown', function(event){

            var $el = $(this).closest('.show_someone');
            var $inp = $el.find("input:text");
            var $add = $el.find(".add");
            var $list = $el.find(".user-list");
            var $item = $(this);

            if( $(this).hasClass("on") ){
                $el.find("b.name[uid='"+ $(this).attr("uid")+"'] .btn-del").click();
                return;
            }

            if(!$add.is(":visible")){
                var uid = $el.find("b.name").attr('uid');
                $el.find("b.name").remove();
                if(uid){
                    $el.find(".frm .user-list i[uid="+uid+"]").removeClass("on");
                }
            }

            $name.clone()
                .prepend(document.createTextNode($item.find('b').text()))
                .attr('uid', $item.attr('uid'))
                .attr('username', $item.attr('username'))
                .attr('fullname', $item.attr('fullname'))
                .attr('image_url', $item.attr('image_url'))
                .insertBefore($add);

            $add.text(txt_add[1]).hide();
            $el.find(".email-frm .text").attr('placeholder',txt_add[1]);
            setTimeout(function(){ $inp.val('');$el.click(); }, 10);

            $el.find(".frm > .send.after").show();
            $el.removeClass('hover');
            $(this).addClass("on");
            //$list.find("i.user").remove().end().find("i").hide();
        })
        .delegate('em.show_someone .user-list i.user:not(.load-more)', 'mousemove', function(event){
            var $el = $(this).closest('.show_someone');
            var $list = $el.find(".user-list");
            var $item = $(this);
            $list.find("i.selected").removeClass("selected");
            $(this).addClass("selected");

            $el.removeClass("hover");
            if(!$item.next().length && !$el.find(".send.after").is(":visible")){
                $el.addClass("hover");
            }
            //$list.find("i.user").remove().end().find("i").hide();
        })
        .delegate('em.show_someone .user-list i.load-more', 'mousedown', function(){
            var $this = $(this);
            var $el = $(this).closest('.show_someone');
            var $inp = $el.find("input:text");
            $this.addClass('loading');
            request_username($(this).closest('.show_someone'), $.trim($inp.val()), $this.data('cursor'), function(){ $this.removeClass('loading') });
            return false;
        })
        .delegate('em.show_someone .success', 'click', function(event){
            $(this).closest('.buttons').find('.menu-container').removeClass('opened').find('.show_someone').hide().closest('li').removeClass('active');
			if ($('html').hasClass('fixed')===true) {
				var sc=$('#container-wrapper > .container').position().top;
				$('html').removeClass('fixed');
				$(window).scrollTop(-sc);
				$('#container-wrapper').find('.container').css('top','0px').end().css('padding-right','0');
					$('#header-new').css('padding-right','0px');
			}
        })
        .delegate('em.show_someone .btn-send', 'click', function(e){
            e.preventDefault();
            e.stopPropagation();
            var $this = $(this);
            var $el = $(this).closest('.show_someone');
            var $this = $(this), params, emails=[], users=[], endpoint;

            $this.disable();

            params = {
                type : 'nt',
                url  : $el.attr('turl'),
                name : $el.attr('tname'),
                oid  : $el.attr('tid'),
                ooid  : $el.attr('uid'),
                message :$.trim( $el.find('.frm textarea:eq(0)').val())
            };
            endpoint = "/share-with-someone.json";

            $el.find('.email-frm b.name').each(function(){
                var $b = $(this);
                if ($b.attr('email')) {
                    emails.push($b.attr('email'));
                } else {
                    users.push($b.attr('uid'));
                }
            });

            if(!emails.length && !users.length){
                $this.disable(false);
                return false;
            }

            params.emails = emails.join(',');
            params.users  = users.join(',');

            var count = emails.length + users.length;

            if(params.users){
                endpoint = "/messages/send-message.json";
                params = {
                    user_id : users[0],
                    things : params.oid,
                    message : params.message
                }
            }

            $.ajax({
                type : 'post',
                url  : endpoint,
                data : params,
                dataType : 'json',
                success  : function(json){
                    if(!json) return;
                    if(json.status_code) {
                        var msg = "";
                        if( count == 1){
                            msg = 'This has been shown to '+ $el.find(".email-frm b.name").text().replace('Delete','')+'.';
                        }else{
                            msg = 'This has been shown to '+count+' friends.';
                        }
                        $el.find(".success").html('<em class="circle"></em><b>Success!</b> '+msg).show().end().find(".email-frm, .frm").hide();

                        if(users.length){
                            var tmp_recent = []
                            $(users).each(function(){
                                var uid = this+'';
                                var $user = $el.find('.email-frm b.name[uid='+uid+']');
                                tmp_recent.push( {id:uid, fullname: $user.attr('fullname'), username: $user.attr('username'), image_url: $user.attr('image_url')})
                            })
                            $(recent_shownto_or_following).each(function(){
                                if( users.indexOf(this.id+'') == -1 ){
                                    tmp_recent.push(this);
                                }
                            })
                            recent_shownto_or_following = tmp_recent;
                        }
                        setTimeout(function(){
                            $el.hide().closest("li").removeClass("active");
                        },3000);
                    } else {
                        alertify.alert(json.message);
                    }
                },
                complete : function(){
                    $this.disable(false);
                }
            });
            return false;
        });

    function show_placeholder($el){
            $el.find(".frm > .user-list > i.user, .frm > .user-list > i.load-more").remove();
            $el.find(".frm > .user-list > i.result").hide();
            if(recent_shownto_or_following.length>0){
                $el.find(".frm > .user-list > i.empty").hide();
                add_items( $el.find(".frm > .user-list"), recent_shownto_or_following );
            }else{
                $el.find(".frm > .user-list > i.empty").show();
            }
    }

    function request_username($el, val, cursor, oncomplete){

        var $inp = $el.find(".email-frm input:text"), $list = $el.find(".user-list"), $empty = $el.find("i.empty"), $result = $el.find("i.result");
        // remove timer and stop previous request
        try {
            if(xhr && xhr.abort) xhr.abort();
        } catch(e){};

        cursor = cursor || 1;

        $result.hide();
        $empty.hide();
        var $more = $list.find('>i.load-more');
        if(!$more.length) $more = $('<i class="load-more"><span>'+gettext('Load more...')+'</span></i>');
        $more.appendTo($list).addClass("loading");
        $list.show();

        xhr = $.ajax({
            type : 'get',
            url  : '/search-users.json',
            data : {'term':val,'cursor':cursor,filter_messages_permission:true},
            dataType : 'json',
            success  : function(json){
                if(val != $.trim($inp.val())) return;

                var list=[], exists={}, i, c;

                $el.find('>b.name[uid]').each(function(){ exists[this.getAttribute('uid')] = true });

                if(json && json.list && json.list.length){
                    for(i=0,c=json.list.length; i < c; i++){
                        if(!exists[json.list[i].id]) list.push(json.list[i]);
                    }
                }

                if (list.length) {
                    if(json.next) list.next = json.next;
                    add_items($list, list);
                    $list.find('>i.user:first').addClass('selected');
                    $result.hide();
                    if(!cursor) $list.scrollTop(0);
                } else if(cursor == 1) {
                    $result.show();
                    $list.find('>i.load-more').remove();
                }
            },
            complete : oncomplete || $.noop
        });
    };

    function add_items($list, list){
        var $more = $list.find('>i.load-more');

        for(var i=0,c=list.length; i < c; i++) {
            var $user = $item.clone()
                .attr('uid', list[i].id)
                .attr('username', list[i].username)
                .attr('fullname', list[i].fullname)
                .attr('image_url', list[i].image_url)
                .find('img').attr('src', list[i].image_url).end()
                .find('b').text(list[i].name||list[i].fullname||list[i].username).end()
                .find('small').text('@'+list[i].username).end()
                .appendTo($list);
            if( $list.closest(".show_someone").find("b.name[uid='"+list[i].id+"']").length ){
                $user.addClass('on');
            }
        }

        if(list.next) {
            if(!$more.length) $more = $('<i class="load-more"><span>'+gettext('Load more...')+'</span></i>');
            $more.data('cursor', list.next).removeClass("loading").appendTo($list);
        } else {
            $more.remove();
        }
    };

});

// add bot class for ...
jQuery(function($){
    $('#content').delegate('.show_cart, .menu-container:not(.on-home)', 'click', function(){
        var top = $(window).scrollTop();
        $(this).find("em.sale-item-input, small.menu-content, em.show_share, em.show_someone").removeClass("bot").filter(":visible").each(function(){
            var $el = $(this);
            if( $el.offset().top < top + 85 )
                $el.addClass("bot");
        })
    })
});