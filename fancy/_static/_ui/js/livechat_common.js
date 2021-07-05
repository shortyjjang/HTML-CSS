jQuery(function($) {
    function apply_livechat_json(message) {
        var $li = $('.livechat-dialog').find('li[data-live-chat-id='+message.id+']');

        $li.find('>.option>.vote,>.vote').html(message.votecount);
        if(message.i_voted) {
            $li.find('>.option>.vote,>.vote').addClass('downvote');
            $li.find('>.option>.vote,>.vote').removeClass('upvote');
        } else {
            $li.find('>.option>.vote,>.vote').removeClass('downvote');
            $li.find('>.option>.vote,>.vote').addClass('upvote');
        }
    }
    $(document).delegate('.livechat-dialog .vote', 'click', function(event) {
        event.preventDefault();
        if($(this).attr('require_login')) {
            require_login(g_request_full_path);
            return;
        }

        var $dialog = $(this).closest('.livechat-dialog');
        var chat_id = $dialog.data('id');

        var $li = $(this).closest('li');
        var message_id = $li.data('live-chat-id');

        var url = '/rest-api/v1/livechat/vote/'+chat_id+'/'+message_id;
        var method = 'POST';
        if($(this).hasClass('downvote')) {
            method = 'DELETE';
        } else {
            try{track_event('Fancy Live Chat Message', {'chat_id':chat_id,'message_id':message_id});}catch(e){}
        }
        $.ajax({
            type: method,
            url: url,
            dataType: 'json',
            success: function(json) {
                if(json.status_code==1 && json.message) {
                    apply_livechat_json(json.message);
                }
            }
        })
    });
});
