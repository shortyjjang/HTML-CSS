jQuery(function($){
    $('.action.after .email').on('click', function(e) {
        e.preventDefault();
        $.dialog('share_cart_email').open();
    });

    function isValidEmail(email) {
        if( email === "") {
            alert("Please enter recipient email address.");
            return false;
        }

        var re = /\S+@\S+\.\S+/;
        if( !re.test(email) ) {
            alert('Invalid Email address.');
            return false
        }

        return true;
    }
    
    $('.popup.share_cart_email .btn-cancel').click(function(e) {
        $('.share_cart_email .frm').find('.recipient, .msg').val('');
    });

    $('.popup.share_cart_email .btn-save').click(function(e) {
        var $this = $(this);
        var email = $('.share_cart_email .frm .recipient').val();
        var msg = $('.share_cart_email .frm .msg').val();
        var orderId = $this.data('id');
        
        if( !isValidEmail(email) ) {
            return;
        }

        $this.attr('disabled', true);
        $.post("/orders/" + orderId + '/send_order_share_email.json', {
                'message': msg,
                'recipient': email,
            }, function(json) {
                if (json.error) {
                    alert(json.error);
                } else {                    
                    alert('Successfully sent.');
                    $('.share_cart_email .frm').find('.recipient, .msg').val('');
                }
                $this.removeAttr('disabled');
                $.dialog('share_cart_email').close();
            }
        )
    });
});