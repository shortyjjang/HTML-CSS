$(document).ready(function() {
    $('.btn-follow').on('click', function(e) {
        e.preventDefault();
        var $this = $(this), login_require = $this.attr('require_login');
        if (typeof(login_require) !== undefined && login_require === 'true')  return require_login();
        if ($this.hasClass('loading')) return;

        $this.toggleClass('loading');
        $.ajax({
            type : 'post',
            url  : $this.hasClass('follow') ? '/add_follow.xml' : '/delete_follow.xml',
            data : {
                user_id: $this.attr('uid'),
            },
            dataType : 'xml',
            success : function(xml){
                var $xml = $(xml), $status = $xml.find('status_code');
                if ($status.length && $status.text() == 1) {
                    $this.toggleClass('follow');
                    $this.toggleClass('following');
                }
            },
            complete : function(){
                $this.toggleClass('loading');
            }
        });
    });
});