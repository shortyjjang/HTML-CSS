jQuery(function($) {
    $(document).delegate('.btn-follow > a.following', 'mouseout', function(event) {
        $button = $(event.target)
        $button.parent().removeClass('follow')
    })

    $(document).delegate('.btn-follow > a.follow,.btn-follow > a.unfollow', 'click', function(event) {
        event.preventDefault()

        $button = $(event.target)

        var username = $button.data('username')
        var is_store = $button.data('store')

        if(!username) return
        if($button.hasClass('login-required')) return

        var url = "/follow.json"
        if($button.hasClass('unfollow')) {
            url = "/unfollow.json"
        }

        $button.prop('disabled', true)
        var params =  { 'username': username }
        if(is_store) {
            params['store'] = 'true'
        }
        $.post(url, params, function(res) {
            console.log(res)
            if(res.status_code!=1) {
                if(res.message) {
                    alertify.alert(res.message)
                    return
                } else {
                    alertify.alert("Error occured. please try again.")
                }
            } else {
                if($button.hasClass('follow')) {
                    $button.parent().removeClass('follow').addClass('following')
                } else {
                    $button.parent().removeClass('following').addClass('follow')
                }
            }
        }).fail(function(xhr) {
            alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
        }).always(function() {
            $button.prop('disabled', null)
        })
    })
})
