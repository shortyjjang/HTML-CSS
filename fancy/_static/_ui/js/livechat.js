var ALERT = window.alertify ? window.alertify.alert : window.alert;
var CONFIRM = window.alertify ? window.alertify.confirm : function(message, callback) {
    callback(window.confirm(message));
};

jQuery(function($) {
	$.infiniteshow({
        itemSelector:'#livechat-stream > ul > li',
        streamSelector:'#livechat-stream'
    });

    var fn_countdown = null;
    var start_live = null;

    var start_refresh = null;

    start_live = function() {
        try {
            var itervalId = $('.chat-timer').attr('interval-id');
            clearInterval(parseInt(intervalId));
        } catch(err) { }

        $('#chat-timer').hide();
        $('#summary .btn-live').show();
        $('#livechat-detail').show();
        $('#livechat-detail .sort select').change(); // load messages initially.

        start_refresh();
    }

    if($('.chat-timer').length>0) {
        fn_countdown = function(total_seconds) {
            if(total_seconds<0) {
                total_seconds = 0;
            }
            var total_minutes = Math.floor(total_seconds/60);
            var total_hours = Math.floor(total_minutes/60);
            var total_days = Math.floor(total_hours/24);
            var seconds = ''+total_seconds%60;
            var minutes = ''+total_minutes%60;
            var hours = ''+total_hours%24;
            var days = ''+total_days;
            seconds = (seconds<10?'0':'')+seconds;
            minutes = (minutes<10?'0':'')+minutes;
            hours = (hours<10?'0':'')+hours;
            days = (days<10?'0':'')+days;

            $('#count-seconds span').html(seconds);
            $('#count-minutes span').html(minutes);
            $('#count-hours span').html(hours);
            $('#count-days span').html(days);

            if(days<=0) {
                $('#count-days').addClass('zero');
                if(hours<=0) {
                    $('#count-hours').addClass('zero');
                    if(minutes<=0) {
                        $('#count-minutes').addClass('zero');
                        if(seconds<=0) {
                            start_live();
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        var check_interval = 600000;
        var initial_time = new Date();
        var total_seconds = parseInt($('.chat-timer').data('total-seconds'));
        var check_time = new Date(initial_time.getTime() + check_interval);
        var intervalId = setInterval(function() {
            var now = new Date();
            var elapsed = (now - initial_time)/1000;
            if(fn_countdown(Math.floor(total_seconds - elapsed))) {
            }

            if(now>check_time) {
                // fetch live chat from server and check status
                check_time = new Date(now.getTime() + check_interval);
                $.get('/rest-api/v1/livechat/'+g_livechat.id, function(json) {
                    if(json.status_code==1) {
                        if(json.is_live) {
                            start_live();
                            return;
                        }
                        total_seconds = json.livechat.seconds_to_go || 0;
                        initial_time = new Date();
                        if(fn_countdown(Math.floor(total_seconds))) {
                        }
                    }
                });
            }
        }, 1000);
        $('.chat-timer').attr('interval-id', intervalId);
    }

    var refreshId = null;

    function stop_refresh() {
        if(refreshId) {
            clearTimeout(refreshId);
            refreshId = null;
        }
    }

    apply_message = function($item) {
        var id = $item.data('live-chat-id');
        var $li = $('#livechat-stream').find('li[data-live-chat-id='+id+']');
        if($li.length<=0) return;

        var $existing_replies = $li.find('>ul');
        var $existing_reply_field = $li.find('>fieldset.for-reply');
        var $existing_edit_field = $li.find('>fieldset.for-edit');
        $item.find('>ul').replaceWith($existing_replies);
        if($existing_reply_field.length>0) {
            $item.find('>fieldset.for-reply').replaceWith($existing_reply_field);
        }
        if($existing_edit_field.length>0) {
            $item.find('>fieldset.for-edit').replaceWith($existing_edit_field);
        }
        $li.replaceWith($item);
    }

    var is_finished = $('#livechat-detail.livechat-finished').length>0;
    start_refresh = function() {
        if(g_is_old) return
        if(refreshId) {
            clearTimeout(refreshId);
            refreshId = null;
        }

        if($('#livechat-stream').data('refresh-url')) {
            if($('#livechat-stream li textarea:focus').length>0) {
                // do not fetch if any textarea is focused
                refreshId = setTimeout(function() { start_refresh(); }, 5000);
                return;
            }

            $.get($('#livechat-stream').data('refresh-url'), function(html) {
                var $resp = $(html);
                var timestamp = $resp.find('#livechat-stream').data('timestamp');
                var refresh_url = $resp.find('#livechat-stream').data('refresh-url');
                var filter_mine = $resp.find('.filter-mine select option:selected').val();
                var sorting_order = $resp.find('.sort select option:selected').val();
                if(!is_finished) {
                    is_finished = $resp.find('#livechat-detail.livechat-finished').length>0;
                    if(is_finished) {
                        if(!(g_is_moderator || g_is_host)) {
                            $('.livechat fieldset.frm').hide();
                        }
                        $('.livechat .btn-live').hide()
                        var finished_time = $resp.find('#livechat-detail.livechat-finished').data('finished-time');
                        $('#summary .info .finished-time, .summary .basic .finished-time').show().html(finished_time);

                        if($('.popup.livechat').length>0) {
                            // open live chat finished dialog
                            var url = $('.popup.livechat .share-finished-livechat').attr('href');
                            $.ajax({ type : 'post', url  : '/get_short_url.json', data : {url:url}, dataType : 'json', success  : function(json){
                                if(!json.short_url) return;
                                $('.popup.livechat .share-finished-livechat a').attr('href', json.short_url);
                                $.dialog('livechat').open();
                            }});
                        }

                        // do not stop refresh after chat finished.
                        // https://app.asana.com/0/86925821949654/329598897449252
                        // stop refreshing
                        //refresh_url = "";
                    }
                }

                var more = null;
                if(sorting_order!='newest') {
                    more = $('#livechat-stream .pagination a');
                    more = !!(more.length>0 && more.attr('href'));
                }
                $('#livechat-stream').data('timestamp', timestamp);
                $('#livechat-stream').data('refresh-url', refresh_url);

                if($resp.find('#livechat-stream li').length==0) {
                    return;
                }

                var participants = {}
                $('.livechat-sidebar .participants ul>li').each(function(i,item) {
                    participants[$(item).data('userid')] = true;
                });

                var first = $('#livechat-stream > ul > li:first-child');
                var last = $('#livechat-stream > ul > li:last-child');

                var votecount1 = parseInt(first.data('votecount'));    // votecount_1 >= votecount_2
                var votecount2 = parseInt(last.data('votecount'));
                var created1 = first.data('timestamp_created');
                var created2 = last.data('timestamp_created');
                var min_votecount = votecount1<votecount2?votecount1:votecount2;
                var max_votecount = votecount1<votecount2?votecount2:votecount1;
                var min_created = created1<created2?created1:created2;
                var max_created = created1<created2?created2:created1;

                var need_load_participants = false;
                var need_sort = true;
                var need_sort_replies_for = false;
                $resp.find('#livechat-stream li').each(function(i,item) {
                    var $item = $(item);
                    var id = $item.data('live-chat-id');
                    var item_status = $item.data('status');
                    var replied_to = $item.data('replied-to');

                    var existing_item = $('#livechat-stream').find('li[data-live-chat-id='+id+']');

                    if(!id) {
                        // Not a message item
                        // Maybe ".more-replies" button.
                        return true;
                    }

                    if(item_status=="removed") {
                        if(existing_item.length>0) {
                            existing_item.remove();
                        }
                        return true;
                    }

                    if(!participants[$item.data('userid')]) {
                        need_load_participants = true;
                    }

                    if(existing_item.length==0) {
                        var $parent = null;

                        if(replied_to) {
                            $parent_li = $('#livechat-stream').find('li[data-live-chat-id='+replied_to+']')
                            if($parent_li.length==0) {
                                // there is no root message
                                return true;
                            }
                            $parent = $parent_li.find('>ul');
                            if($parent.length==0) {
                                $parent_li.append('<ul>');
                                $parent = $parent_li.find('>ul');
                            }
                            if(sorting_order!='popular') {
                                $parent.append('<li data-live-chat-id='+id+'></li>');
                            } else {
                                var item_votecount = parseInt($item.data('votecount')) || 0;
                                var item_created = $item.data('timestamp_created');
                                if(min_votecount>item_votecount || (min_votecount==item_votecount && max_created<item_created)) {
                                    if(more) {
                                        // item is out of range of currently exposed timeline.
                                        // skip this item
                                        console.log('skip',$item);
                                        return true;
                                    }
                                }

                                $parent.append('<li data-live-chat-id='+id+'></li>');
                                need_sort_replies_for = $parent;
                            }
                        } else {
                            var item_votecount = parseInt($item.data('votecount')) || 0;
                            var item_created = $item.data('timestamp_created');
                            if(sorting_order=='popular') {
                                if(min_votecount>item_votecount || (min_votecount==item_votecount && max_created<item_created)) {
                                    if(more) {
                                        // item is out of range of currently exposed timeline.
                                        // skip this item
                                        console.log('skip',$item);
                                        return true;
                                    }
                                }
                            } else if(sorting_order=='oldest') {
                                if(max_created<item_created) {
                                    if(more) {
                                        // item is out of range of currently exposed timeline.
                                        // skip this item
                                        console.log('skip',$item);
                                        return true;
                                    }
                                }
                            } else if(sorting_order=='newest') {
                                if(min_created>item_created) {
                                    if(more) {
                                        // item is out of range of currently exposed timeline.
                                        // skip this item
                                        console.log('skip',$item);
                                        return true;
                                    }
                                }
                            }

                            $parent = $('#livechat-stream > ul');
                            if(sorting_order=='newest') {
                                $parent.prepend('<li data-live-chat-id='+id+'></li>');
                            } else {
                                $parent.append('<li data-live-chat-id='+id+'></li>');
                            }
                            need_sort = true;
                        }
                    } else {
                        if(sorting_order=='popular') {
                            need_sort = true;
                        }
                    }

                    apply_message($item);
                });

                if(need_sort || need_sort_for_replies) {
                    var sort_function = null;
                    if(sorting_order=='popular') {
                        sort_function = function(a,b) {
                            var $a = $(a);
                            var $b = $(b);
                            var v1 = parseInt($a.data('votecount'));
                            var v2 = parseInt($b.data('votecount'));
                            if(v1>v2) return -1;
                            if(v1<v2) return 1;
                            var d1 = $a.data('timestamp_created');
                            var d2 = $b.data('timestamp_created');
                            if(d1<d2) return -1;
                            if(d1>d2) return 1;
                            var i1 = parseInt($a.data('live-chat-id'));
                            var i2 = parseInt($b.data('live-chat-id'));
                            if(i1<i2) return -1;
                            if(i1>i2) return 1;
                            return 0;
                        }
                    } else if(sorting_order=='oldest') {
                        sort_function = function(a,b) {
                            var $a = $(a);
                            var $b = $(b);
                            var d1 = $a.data('timestamp_created');
                            var d2 = $b.data('timestamp_created');
                            if(d1<d2) return -1;
                            if(d1>d2) return 1;
                            var i1 = parseInt($a.data('live-chat-id'));
                            var i2 = parseInt($b.data('live-chat-id'));
                            if(i1<i2) return -1;
                            if(i1>i2) return 1;
                            return 0;
                        }
                    } else if(sorting_order=='newest') {
                        sort_function = function(a,b) {
                            var $a = $(a);
                            var $b = $(b);
                            var d1 = $a.data('timestamp_created');
                            var d2 = $b.data('timestamp_created');
                            if(d1>d2) return -1;
                            if(d1<d2) return 1;
                            var i1 = parseInt($a.data('live-chat-id'));
                            var i2 = parseInt($b.data('live-chat-id'));
                            if(i1>i2) return -1;
                            if(i1<i2) return 1;
                            return 0;
                        }
                    }
                    if(!!sort_function) {
                        if(need_sort_replies_for) {
                            var items = need_sort_replies_for.find('>li[data-live-chat-id]').sort(sort_function)
                            need_sort_replies_for.find('>li[data-live-chat-id]').detach()
                            var more_replies = need_sort_replies_for.find('>li').detach()
                            items.each(function(i,item) {
                                need_sort_replies_for.append($(item))
                            })
                            need_sort_replies_for.append($(more_replies))
                        }
                        if(need_sort) {
                            var items = $('#livechat-stream > ul > li').sort(sort_function);
                            $('#livechat-stream > ul > li').detach();
                            items.each(function(i,item) {
                                $('#livechat-stream > ul').append($(item));
                            });
                        }
                    }
                }

                if(window.load_participants) {
                    if(need_load_participants) {
                        window.load_participants();
                    }
                }
            })
            .always(function() {
                refreshId = setTimeout(function() { start_refresh(); }, 5000);
            });
        }
    }


    window.update_livechat_summary = function() {
        var livechat_id = $('#summary').attr('object-id');
        if(!parseInt(livechat_id)) {
            return;
        }
    }

    var hash = window.location.hash.substring(1);
    if(hash) {
        var ids = hash.split('-');
        var parent_id = null;
        var message_id = hash;
        if(ids.length>1) {
            parent_id = ids[0];
            message_id = ids[1];
        }
        var $parent_message = null;
        var $message = null;
        $('#livechat-stream li').each(function(i,li) {
            var id = $(li).data('live-chat-id');
            if((!!parent_id) && id==parent_id) {
                $parent_message = $(li);
            }
            if(id==message_id) {
                $message = $(li);
            }
        });

        var header_height = 0;
        try {
            if($('header').length>0) {
                header_height = parseInt($('header').height());
            }
        } catch(e) {}
        if($message) {
            setTimeout(function() {
                $(document).scrollTop($message.offset().top - header_height);
            }, 1);
        } else if($parent_message) {
            setTimeout(function() {
                $(document).scrollTop($parent_message.offset().top - header_height);
            }, 1);
        }
    }

    $('#livechat-stream > ul').bind('DOMSubtreeModified', function() {
        var $panel = $('#livechat-stream').closest('.livechat-panel');
        if($('#livechat-stream>ul>li').length>0) {
            if($panel.hasClass('empty')) {
                $panel.removeClass('empty');
            }
        } else {
            if(!$panel.hasClass('empty')) {
                $panel.addClass('empty');
            }
        }
    });

    if($('.chat-timer').length<=0) {
        refreshId = setTimeout(function() { start_refresh(); }, 5000);
    }

    function update_search_condition() {
        var url = g_livechat.html_url;
        var filter_mine = $('.livechat-panel .filter-mine select').val();
        var order_by = $('.livechat-panel .sort select').val()

        var params = [];
        if(filter_mine=='true') {
            params.push('filter_mine=true');
        }
        if(order_by=='newest' || order_by=='oldest') {
            params.push('order_by='+order_by);
        }
        params = params.join('&');
        if(params.length>0) {
            url +='?'+params;
        }

        try {
            if(url!=location.href) {
                history.replaceState(null,null,url)
            }
        } catch(e) {
        }

        start_refresh();
        $.get(url, function(html) {
            var $resp = $(html);
            var timestamp = $resp.find('#livechat-stream').data('timestamp');
            var refresh_url = $resp.find('#livechat-stream').data('refresh-url');
            $('#livechat-stream').data('timestamp', timestamp);
            $('#livechat-stream').data('refresh-url', refresh_url);
            $('#livechat-stream>ul>li').remove();
            $resp.find('#livechat-stream > ul > li').each(function(i, item) {
                $('#livechat-stream>ul').append(item);
            });
            $('#livechat-stream a.btn-more').replaceWith($resp.find('#livechat-stream a.btn-more'));
        });
    }

    $('.livechat-panel .combo select').change(function() {
        $(this).parent().find('span').html($(this).find('option:selected').html());
        update_search_condition();
    });

    $('.livechat-dialog').delegate('.more-replies', 'click', function(event) {
        // Load more replies

        event.preventDefault();
        var $this = $(this);
        var $li = $this.parent();
        var $ul = $li.parent();
        var url = $this.data('url');
        $li.addClass('loading');
        $.get(url, function(json) {
            if(json.status_code==1) {
                if($this.data('order-by') != 'popular') {
                    for (i in json.messages) {
                        $ul.prepend(json.messages[i].rendered)
                    }

                    if(json.cursor) {
                        url = url.replace(/cursor=[0-9]+/g,'cursor='+json.cursor);
                        $this.data('url', url);
                        $ul.prepend($li);
                    } else {
                        $li.remove();
                    }
                } else {
                    for (i in json.messages) {
                        $ul.append(json.messages[i].rendered)
                    }

                    if(json.cursor) {
                        url = url.replace(/cursor=[0-9]+/g,'cursor='+json.cursor);
                        $this.data('url', url);
                        $ul.append($li);
                    } else {
                        $li.remove();
                    }
                }
            }
        })
        .fail(function(xhr) {
        })
        .always(function() {
            $li.removeClass('loading');
        });
    });

    var handle_delete_response = null;
    handle_delete_response = function(json,ask,url,message,all) {
        if(json.status_code==1) {
            if('deleted_ids' in json) {
                var deleted_ids = {};
                var hidden_ids = {};
                for(var i in json.deleted_ids) {
                    deleted_ids[json.deleted_ids[i]] = true;
                }
                for(var i in json.hidden_ids) {
                    hidden_ids[json.hidden_ids[i]] = true;
                }
                $('.livechat-dialog li').each(function(i,item) {
                    if($(item).data('live-chat-id') in deleted_ids) {
                        console.log('delete',$(item));
                        $(item).remove();
                    } else if($(item).data('live-chat-id') in hidden_ids) {
                        console.log('hide',$(item));
                        $(item).find('>.dialog').html('This comment has been deleted.');
                        $(item).find('>.option').remove();
                        $(item).find('>.frm.for-reply').remove();
                    }
                });
            } else {
                location.reload();
                return;
            }
        } else if(ask && json.status_code==0 && json.error=="ask-delete-replies") {
            CONFIRM(message || "Do you want to delete all replies to this comment too?", function(e) {
                $.ajax({
                    type: 'DELETE',
                    url: url,
                    dataType: 'json',
                    data: {'delete_replies':((!!e)?'true':'false'),'all':all?'true':'false'},
                    success: function(json) {
                        handle_delete_response(json, false, url, message, all);
                    }
                });
            });
        }
    }


    $('.livechat-dialog').delegate('li .del-button', 'click', function(event) {
        event.preventDefault();

        var $dialog = $('.livechat-dialog');
        var chat_id = $dialog.data('id');

        var $li = $(this).closest('li');
        var message_id = $li.data('live-chat-id');

        var url = '/rest-api/v1/livechat/message/'+chat_id+'/'+message_id;

        CONFIRM('Are you sure you want to delete this comment?', function(e) {
            if(!e) { return; }

            $.ajax({
                type: 'DELETE',
                url: url,
                dataType: 'json',
                success: function(json) {
                    handle_delete_response(json, true, url, null, false);
                }
            });
        });
    });

    $('.livechat-dialog').delegate('li .del-all-button', 'click', function(event) {
        event.preventDefault();

        var $dialog = $('.livechat-dialog');
        var chat_id = $dialog.data('id');

        var $li = $(this).closest('li');
        var message_id = $li.data('live-chat-id');
        var username = $li.find('.username').html();

        var url = '/rest-api/v1/livechat/message/'+chat_id+'/'+message_id;
        var method = 'DELETE';

        CONFIRM('Are you sure you want to delete all comments by '+username+'?', function(e) {
            if(!e) { return; }

            $.ajax({
                type: method,
                url: url,
                dataType: 'json',
                data:{'all':'true'},
                success: function(json) {
                    handle_delete_response(json, true, url, "Do you want to delete all replies to these comment too?", true);
                }
            });
        });
    });

    $('.livechat-panel').delegate('textarea.text', 'focus', function(event) {
        if($(this).attr('require_login')) {
            event.preventDefault();
            require_login(g_request_full_path);
            return;
        }
    });
    $('.livechat-dialog').delegate('.reply', 'click', function(event) {
        if($(this).attr('require_login')) {
            event.preventDefault();
            require_login(g_request_full_path);
            return;
        }

        $li = $(this).closest('li');
        var $frm = $li.find('>.frm.for-reply');
        if($frm.hasClass('off')) {
            $frm.removeClass('off');
            $textarea = $frm.find('textarea');
            $textarea.focus();
            $textarea.val($li.data('user-tags'));
            $textarea.siblings('.btn-submit').removeAttr('disabled');
        } else {
            $frm.addClass('off');
        }
    });
    $('.livechat-dialog').delegate('.edit-button', 'click', function(event) {
        $li = $(this).closest('li');
        var $frm = $li.find('>.frm.for-edit');
        if($frm.hasClass('off')) {
            $frm.removeClass('off');
            $textarea = $frm.find('textarea');
            $textarea.focus();
            $textarea.val($li.data('message'));
            $textarea.siblings('.btn-submit').removeAttr('disabled');
        } else {
            $frm.addClass('off');
        }
    });

    $('.livechat-panel').delegate('.question .btn-submit,.for-comment .btn-submit,.for-reply .btn-submit', 'click', function(event) {
        var $button = $(this);
        var reply_to = $(this).data('reply-to');
        var param = {};
        var message = ''+$(this).parent().find('textarea').val();
        if(!message || message.length<1) {
            return;
        }
        param['message'] = message;
        param['reply_to_id'] = reply_to||null;
        param['livechat_id'] = g_livechat.id;
        param['render'] = 'true';
        try{track_event('Send Live Chat Message', {'chat_id':g_livechat.id, 'reply_to':reply_to||null});}catch(e){}
        $.post('/rest-api/v1/livechat/message/'+g_livechat.id, param, function(response) {
            if(response.status_code!=1) {
                var msg = response.error || "Sorry your message could not be posted";
                ALERT(msg);
                return;
            }

            $button.parent('.frm.for-reply').addClass('off');
            $button.parent('.frm').find('textarea').val('');

            if(response.message) {
                if(reply_to) {
                    $('.livechat-dialog').find('> ul > li').each(function(i, item) {
                        if($(item).data('live-chat-id')==response.message.reply_to_root) {
                            $(item).find('>ul').append(response.message.rendered);
                        }
                    });
                }
            }

            start_refresh();
        }).fail(function(xhr) {
            ALERT("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
        }).always(function() {
        });
    });

    $('.livechat-panel').delegate('.for-edit .btn-submit', 'click', function(event) {
        var $button = $(this);
        var param = {};
        var message_id = $(this).data('message-id');
        var message = ''+$(this).parent().find('textarea').val();
        if(!message || message.length<1) {
            return;
        }
        param['message'] = message;
        param['livechat_id'] = g_livechat.id;
        $.ajax({
            type: 'PUT',
            url: '/rest-api/v1/livechat/message/'+g_livechat.id+'/'+message_id,
            dataType: 'json',
            data: param,
            success: function(json) {
                if(json.status_code!=1) {
                    var msg = json.error || "Sorry your message could not be edited";
                    ALERT(msg);
                    return;
                }

                $button.parent('.frm.for-edit').addClass('off');

                if(json.message && json.message.rendered) {
                    $item = $(json.message.rendered)
                    apply_message($item);
                }

                start_refresh();
            }
        }).fail(function(xhr) {
            ALERT("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
        }).always(function() {
        });
    });

    if(g_is_moderator) {
        $('.livechat-dialog').delegate('li .approve-button', 'click', function(event) {
            var $dialog = $('.livechat-dialog');
            var chat_id = $dialog.data('id');

            var $li = $(this).closest('li');
            var message_id = $li.data('live-chat-id');

            var url = '/rest-api/v1/livechat/approve/'+chat_id+'/'+message_id;

            var message = $li.find('.dialog').html().replace(/\<b.*\/b\>/,'');

            var method = 'POST';

            $.ajax({
                url:url,
                type:method,
                data:{'render':'true'},
                dataType:'json',
                success:function(json) {
                    if(json.status_code==1 && json.message && json.message.rendered) {
                        $item = $(json.message.rendered)
                        apply_message($item);
                    }
                }
            });
        });
    }

});

jQuery(function($) {
    // there is click event handler in the user/profile.js file.
    // so I have to clear click event handlers embedded in the tag.
    // unless, handlers will toggle 'opened' class twice.
    // then upload image popup won't open.
    $(document).find('.menu-title, .menu-content').attr('onclick',null);
});

jQuery(function($) {
    $('#edit-chat-setting').click(function() {
        $.get('/rest-api/v1/livechat/'+g_livechat.id, function(json) {
            apply_livechat_edit(json.livechat);
            $add_livechat.open();
        });
    });
});
jQuery(function($) {
    function adjust_rows($this,add_line) {
        var value = $this.val();
        var lines = value.split(/\r\n|\r|\n/).length+add_line;
        lines = lines>5?5:lines;
        lines = lines<1?1:lines;
        var current_lines = $this.attr('rows');
        if(lines!=current_lines) {
            $this.attr('rows',lines);
            var margin_top = parseInt($this.css('margin-top').replace(/[^0-9]+/g,''));
            var margin_bottom = parseInt($this.css('margin-bottom').replace(/[^0-9]+/g,''));
            var padding_top = parseInt($this.css('padding-top').replace(/[^0-9]+/g,''));
            var padding_bottom = parseInt($this.css('padding-bottom').replace(/[^0-9]+/g,''));
            var line_height = parseInt($this.css('line-height').replace(/[^0-9]+/g,''));
            $this.css('height',(margin_top+margin_bottom+padding_top+padding_bottom+line_height*lines)+'px');
            //$this.css('height','initial');
        }
    }

    $('.livechat-detail').delegate('textarea.variable-rows', 'keydown', function(event) {
        if(event.keyCode==13 && !event.metaKey) {
            adjust_rows($(this),1);
        }
    });
    $('.livechat-detail').delegate('textarea.variable-rows', 'keyup', function(event) {
        adjust_rows($(this),0);
    });

    $('.livechat-panel').delegate('textarea.user-tag', 'keyup', function(event) {
        var $this = $(this);
        var value = $this.val();
        var caretPosition = this.selectionStart;
        var subvalue = value.substring(0,caretPosition);
        var taginfo = /@[^ \n@]+$/.exec(subvalue);
        if(!taginfo) {
            $this.parent().find('.userlist>.listing').hide();
            return;
        }

        $this.data('caret-position', caretPosition);

        var tag = taginfo[0].substring(1);
        if(tag.length<2) return;

        var fn = arguments.callee;
        if(fn.xhr) { try { fn.xhr.abort(); } catch(e) { } }

        var $dialog = $('.livechat-dialog');
        var chat_id = $dialog.data('id');

        var xhr = $.get('/search-users.json', {term:tag,limit:7,filter_messages_permission:false,livechat:chat_id},function(res) {
            var $ul = $this.parent().find('.userlist > .listing > ul');
            var template = $ul.find("script").html();
            var json = res;
            $ul.find('li').remove();
            if(json.length) {
                for(var i=0,c=json.length; i < c; i++) {
                    var $item = $(template);
                    $item.find("b.fullname").html((json[i].fullname||json[i].username)).end()
                         .find("span.username").html(json[i].username).end()
                         .find("img").css('background-image',"url('"+json[i].image_url+"')").end()
                         .data('uid', json[i].id)
                    $item.appendTo($ul);
                }
            }
            if( !$ul.find("li").length ){
                $ul.append('<li class="empty">No users found</li>');
            }
            $this.parent().find('.userlist>.listing').show();
        });
        fn.xhr = xhr;
    });
    $('.livechat-panel').delegate('.userlist > .listing > ul > li > a', 'click', function(event) {
        event.preventDefault();
        var username = $(this).find('.username').text();
        var $userlist = $(this).closest('.userlist');
        $userlist.find('.listing').hide();

        var $textarea = $userlist.siblings('textarea.user-tag');
        var text = $textarea.val();
        var caretPosition = $textarea.data('caret-position');
        if(!caretPosition) return;

        var subvalue = text.substring(0, caretPosition);
        var tag_start = subvalue.lastIndexOf("@");
        var tag_finish = caretPosition;
        if(tag_start<0) return;

        text = text.substring(0,tag_start)+'@'+username+' '+text.substring(tag_finish);
        $textarea.val(text);
        $textarea.focus();
        newCaretPosition = tag_start+username.length+2;
        $textarea[0].setSelectionRange(newCaretPosition, newCaretPosition);
    });

    $('.livechat-panel').delegate('textarea.disable-empty-submit', 'keyup', function(event) {
        var button_selector = $(this).data('submit-button');
        if(button_selector) {
            if((''+$(this).val()).length==0) {
                $(this).siblings(button_selector).attr('disabled',true);
            } else {
                $(this).siblings(button_selector).removeAttr('disabled');
            }
        }
    });
});
