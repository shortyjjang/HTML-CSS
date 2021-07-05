jQuery(function($) {
    function get_time(prefix) {
        var hour = parseInt($('.add_livechat input[name="'+prefix+'_hour"]').val());
        var min = parseInt($('.add_livechat input[name="'+prefix+'_minute"]').val());
        var am_pm = $('.add_livechat select[name="'+prefix+'_am_pm"]').val();

        hour += (hour<12 && am_pm=="pm")?12:0;

        return ((hour*60) + min)*60
    }

    function check_livechattime() {
        var start_date = $('#start_date').datepicker('getDate');
        var end_date = $('#end_date').datepicker('getDate');

        if(start_date && end_date) {
            var start_datetime = new Date(start_date);
            var end_datetime = new Date(end_date);
            start_datetime.setSeconds(get_time('start'));
            end_datetime.setSeconds(get_time('end'));

            if(start_date && end_date && start_datetime>end_datetime) {
                return false;
            }
        }

        return true;
    }


    $('#start_date,#end_date').change(function() {
        if(!check_livechattime()) {
            var start_date = $('#start_date').datepicker('getDate');
            var start_datetime = new Date(start_date);
            start_datetime.setSeconds(get_time('start'));

            var new_date = new Date(start_datetime);
            if(get_time('start')>get_time('end')) {
                new_date.setSeconds(24*60*60)
            }
            $('#end_date').datepicker('setDate',new_date);
            $(this).blur();
        }
    });

    $add_livechat = $.dialog('add_livechat');

    function apply_edit(livechat) {
        if(livechat) {
            $('.popup.add_livechat').data('chat-id', livechat.id);

            $('.add_livechat input[name="username"]').val(livechat.host.username);
            $('.add_livechat input[name="host_as_store"]').prop('checked',!!livechat.host_as_store);
            $('.add_livechat input[name="is_test"]').prop('checked',!!livechat.test);
            $('.add_livechat input[name="tagline"]').val(livechat.tagline);
            $('.add_livechat input[name="title"]').val(livechat.title);
            $('.add_livechat textarea[name="profile"]').val(livechat.profile);

            //var start_date = livechat.start_date?new Date(Date.parse(livechat.start_date.replace('T',' '))):new Date();
            //var end_date = livechat.end_date?new Date(Date.parse(livechat.end_date.replace('T',' '))):new Date();
            var start_date = livechat.start_date?new Date(Date.parse(livechat.start_date)):new Date();
            var end_date = livechat.end_date?new Date(Date.parse(livechat.end_date)):new Date();
            $('.add_livechat #start_date').datepicker('setDate', start_date);
            $('.add_livechat #end_date').datepicker('setDate', end_date);

            var start_hour = start_date.getHours();
            var start_am_pm = start_hour>=12?'pm':'am';
            if(start_hour>12) start_hour -= 12;
            var start_min = start_date.getMinutes();
            start_hour = (start_hour<10?'0':'')+start_hour;
            start_min = (start_min<10?'0':'')+start_min;

            var end_hour = end_date.getHours();
            var end_am_pm = end_hour>=12?'pm':'am';
            if(end_hour>12) end_hour -= 12;
            var end_min = end_date.getMinutes();
            end_hour = (end_hour<10?'0':'')+end_hour;
            end_min = (end_min<10?'0':'')+end_min;

            if(livechat.category) {
                $('.add_livechat select[name="category"]').val(livechat.category);
            } else {
                $('.add_livechat select[name="category"] option:selected').removeProp('selected');
                $('.add_livechat select[name="category"] option:first').prop('selected',true);
            }

            $('.add_livechat input[name="start_hour"]').val(start_hour);
            $('.add_livechat input[name="start_minute"]').val(start_min);
            $('.add_livechat select[name="start_am_pm"]').val(start_am_pm);
            $('.add_livechat input[name="end_hour"]').val(end_hour);
            $('.add_livechat input[name="end_minute"]').val(end_min);
            $('.add_livechat select[name="end_am_pm"]').val(end_am_pm);
            $('.add_livechat select[name="timezone"]').val(livechat.timezone);
        } else {
            $('.popup.add_livechat').data('chat-id', null);

            $('.add_livechat input[name="username"]').val('');
            $('.add_livechat input[name="host_as_store"]').prop('checked',true);
            $('.add_livechat input[name="is_test"]').prop('checked',false);
            $('.add_livechat input[name="tagline"]').val('');
            $('.add_livechat textarea[name="profile"]').val('');

            $('.add_livechat select[name="category"] option:selected').removeProp('selected');
            $($('.add_livechat select[name="category"] option')[1]).prop('selected',true);

            var now = new Date();
            $('.add_livechat #start_date').datepicker('setDate', now);
            $('.add_livechat #end_date').datepicker('setDate', now);

            $('.add_livechat input[name="start_hour"]').val('00');
            $('.add_livechat input[name="start_minute"]').val('00');
            $('.add_livechat select[name="start_am_pm"]').val('am');
            $('.add_livechat input[name="end_hour"]').val('00');
            $('.add_livechat input[name="end_minute"]').val('00');
            $('.add_livechat select[name="end_am_pm"]').val('am');
            $('.add_livechat select[name="timezone"]').val('US/Eastern');
        }
    }


    $('.popup input[name="start_hour"]').keyup(function(event) {
        var hour = parseInt($(this).val());
        if(hour>=12) {
            $('.popup select[name="start_am_pm"]').val('pm');
        }
        if(hour==0) {
            $('.popup select[name="start_am_pm"]').val('am');
        }
    });
    $('.popup input[name="start_hour"]').change(function(event) {
        var hour = parseInt($(this).val());
        if(hour>=12) {
            $('.popup select[name="start_am_pm"]').val('pm');
        }
        if(hour==0) {
            $('.popup select[name="start_am_pm"]').val('am');
        }
    });
    $('.popup select[name="start_am_pm"]').change(function(event) {
        var hour = parseInt($('.popup input[name="start_hour"]').val());
        if($(this).val()=='am' && hour>=12) {
            hour = ''+(hour-12);
            if(hour.length<2) hour = '0'+hour;
            $('.popup input[name="start_hour"]').val(hour);
        }
        if($(this).val()=='pm' && hour==0) {
            $('.popup input[name="start_hour"]').val('12');
        }
    });
    $('.popup input[name="end_hour"]').keyup(function(event) {
        var hour = parseInt($(this).val());
        if(hour>=12) {
            $('.popup select[name="end_am_pm"]').val('pm');
        }
        if(hour==0) {
            $('.popup select[name="end_am_pm"]').val('am');
        }
    });
     $('.popup input[name="end_hour"]').change(function(event) {
        var hour = parseInt($(this).val());
        if(hour>=12) {
            $('.popup select[name="end_am_pm"]').val('pm');
        }
        if(hour==0) {
            $('.popup select[name="end_am_pm"]').val('am');
        }
    });
    $('.popup select[name="end_am_pm"]').change(function(event) {
        var hour = parseInt($('.popup input[name="end_hour"]').val());
        if($(this).val()=='am' && hour>=12) {
            hour = ''+(hour-12);
            if(hour.length<2) hour = '0'+hour;
            $('.popup input[name="end_hour"]').val(hour);
        }
        if($(this).val()=='pm' && hour==0) {
            $('.popup input[name="end_hour"]').val('12');
        }
    });

    window.apply_livechat_edit = apply_edit;

    $('#new-livechat').click(function(e) {
        e.preventDefault();

        apply_edit(null);
        $add_livechat.open();
    });

    $('.add_livechat .btn-cancel').click(function(e) {
        $add_livechat.close();
    });
    $('.add_livechat .btn-save').click(function(e) {
        e.preventDefault();

        var chat_id = $('.popup.add_livechat').data('chat-id');

        var category = $('.add_livechat select[name="category"]').val();
        var username = $('.add_livechat input[name="username"]').val();
        var host_as_store = $('.add_livechat input[name="host_as_store"]:checked').length>0;
        var is_test = $('.add_livechat input[name="is_test"]:checked').length>0;
        var tagline = $('.add_livechat input[name="tagline"]').val();
        var title = $('.add_livechat input[name="title"]').val();
        var profile = $('.add_livechat textarea[name="profile"]').val();
        var start_date = $('.add_livechat #start_date').val();
        var end_date = $('.add_livechat #end_date').val();
        var start_hour = $('.add_livechat input[name="start_hour"]').val();
        var start_min = $('.add_livechat input[name="start_minute"]').val();
        var start_am_pm = $('.add_livechat select[name="start_am_pm"]').val();
        var end_hour = $('.add_livechat input[name="end_hour"]').val();
        var end_min = $('.add_livechat input[name="end_minute"]').val();
        var end_am_pm = $('.add_livechat select[name="end_am_pm"]').val();
        var timezone = $('.add_livechat select[name="timezone"]').val();

        if(!username.match('^[a-zA-Z0-9_]+$')) {
            alertify.alert('Please enter a valid username');
            return;
        }

        if(!check_livechattime()) {
            alertify.alert("You can not set Start Date later than End Date.");
            return;
        }

        start_hour = parseInt(start_hour) || 0;
        start_hour = start_hour>=12?start_hour : ((start_am_pm=="pm"?12:0) + start_hour);
        start_min = parseInt(start_min) || 0;
        var start_time = start_hour * 60 + start_min;
        start_hour = parseInt(start_time/60);
        start_min = start_time - start_hour*60;
        start_hour = (start_hour<10?'0':'') + start_hour;
        start_min = (start_min<10?'0':'') + start_min;

        end_hour = parseInt(end_hour) || 0;
        end_hour = end_hour>=12?end_hour : ((end_am_pm=="pm"?12:0) + end_hour);
        end_min = parseInt(end_min) || 0;
        var end_time = end_hour * 60 + end_min;
        end_hour = parseInt(end_time/60);
        end_min = end_time - end_hour*60;
        end_hour = (end_hour<10?'0':'') + end_hour;
        end_min = (end_min<10?'0':'') + end_min;

        if(isNaN(start_hour+start_min)) {
            alertify.alert("Please enter vaild input for start time.");
            return;
        }
        if(isNaN(end_hour+end_min)) {
            alertify.alert("Please enter vaild input for end time.");
            return;
        }

        var params = {
            "hostname": username,
            "host_as_store": host_as_store,
            "test": is_test,
            "tagline": tagline,
            "title": title,
            "profile": profile,
            "start_date": start_date+' '+start_hour+':'+start_min,
            "end_date": end_date+' '+end_hour+':'+end_min,
            "timezone": timezone
        }
        if(category!="null") {
            params["category"] = category;
        }

        $.post(chat_id?('/rest-api/v1/livechat/'+chat_id):'/rest-api/v1/livechat', params, function(json) {
            if(json.status_code==1) {
                $add_livechat.close();
                location.reload();
                return;
            }

            alertify.alert(json.error?json.error:"An Unknown error has occurred.");
        },'json')
        .fail(function(xhr) {
            alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
        })
        .always(function() {
        });
    });
});

