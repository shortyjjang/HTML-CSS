jQuery(function($) {
    var search_user_ajax = null;
    // workaround for disabling autocomplete
    setTimeout(function(){
        $('input.recipient_info').val('')
    }, 0);
    $('.recipient input.recipient_info').keyup(function(event) {
        var $this = $(this);
        var val = $this.val();

        if(search_user_ajax) {
            search_user_ajax.abort();
            search_user_ajax = null;
        }

        $('.recipient input[name="recipient_id"]').val("");

        if(val.search('@')>=0) {
            return;
        }

        search_user_ajax = $.get('/search-users.json', {'term':val}, function(res) {
            $('.recipient .user-list').hide();
            $('.recipient .user-list li').remove();
            for(var i in res) {
                var u = res[i];
                $('.recipient .user-list').append('<li data-username="'+u.username+'" data-fullname="'+u.fullname+'" data-uid="'+u.id+'"><img style="background-image: url(\''+u.profile_image_url+'\')" /><b>'+u.fullname+'</b><small>@'+u.username+'</small></li>');
            }
            if($('.recipient .user-list>li').length>0) {
                $('.recipient .user-list').show();
            }
        }).fail(function(xhr) {
            $('.recipient .user-list').hide();
            $('.recipient .user-list li').remove();
        });
    });
    $('.recipient .user-list').delegate('li', 'click', function(event) {
        var username = $(this).data('username');
        var name = $(this).data('fullname');
        var uid = $(this).data('uid');
        $('.recipient input.recipient_info').val(username);
        $('.recipient input[name="recipient_id"]').val(uid);
        $('.figure-product.gift-card .frm input[name="recipient_name"]').val(name);
        $('.recipient .user-list').hide();
    });

    function retrieve_giftcard_info() {
        var $scope = $('.figure-product.gift-card .frm');
        var param = {};
        param['is_giftcard'] = true;
        param['recipient_id'] = $scope.find('input[name="recipient_id"]').val();
        param['recipient_email'] = $scope.find('input.recipient_info').val();
        param['recipient_name'] = $scope.find('input[name="recipient_name"]').val();
        param['message'] = $scope.find('textarea[name="message"]').val();
        return param;
    }

    $('.figure-product.gift-card .frm .btn-buy-giftcard').click(function(event){
        event.preventDefault();
        var $this = $(this);
        if ($this.hasClass('soldout')) {
            return;
        }
        if($this.hasClass('login-required')) {
            return;
        }

        var $scope = $('.figure-product.gift-card .frm');

        var param = {}
        var prefix = $this.attr('prefix') || $this.attr('data-prefix') || '';
        if(prefix) prefix += '-';

        param['seller_id'] = $this.attr('data-seller-id');
        param['quantity']  = 1;

        // quantity
        param['quantity'] = 1;

        // option
        if($scope.find('#'+prefix+'option_id').length) {
            param['option_id'] = $scope.find('#'+prefix+'option_id').val();
        }

        param['sale_item_id'] = $this.attr('data-sale-item-id');
        giftcard = retrieve_giftcard_info();
        for(var k in giftcard) {
            param[k] = giftcard[k];
        }

        if($this.hasClass('loading')) return;
        $this.addClass('loading');

        note_info = {};
        note_info[param['seller_id']] = param['message'];
        params = {
            'express':JSON.stringify(param),
            'note_info':JSON.stringify(note_info)
        }

        $.ajax({
            type: 'POST',
            url:  '/rest-api/v1/checkout',
            data: params,
            success: function(json) {
                console.log('Checkout object',json);
                if (json.error) {
                    console.trace(json.error)
                } else {
                    location.href = "/checkout?express"
                }
            }
        }).fail(function(xhr,statusText,error) {
            try {
                if(xhr.responseJSON.error) {
                    alert(xhr.responseJSON.error);
                    return;
                }
            } catch(e) {
            }
            alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
        }).always(function() {
            $this.removeClass('loading');
        });

    });

    window.retrieve_giftcard_info = retrieve_giftcard_info;
})
