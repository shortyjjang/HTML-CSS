(function($) {
    "use strict";
    var require_login = function(next, action, action_param, show_login) {
        if(!next) {
            var path = location.pathname.toString();
            if(typeof(next) != 'string' || /^#/.test(next)) next = '';
            if(!next && path !='/' && !/^\/login/.test(path)) next = location.pathname+location.search;
        }

        if (action) {
            next += '&action='+action
            if (action_param) {
                next += '&action_param='+action_param
            }
        }

        if( $(".popup.sign.signup")[0] ){
            $('#fancy-g-signup,#fancy-g-signin').attr('next', next);
            var $social = $('.social');
            if ($social.length > 0) {
                $social.attr('next', next);
            }
            $(".popup.sign.signup,.popup.sign.signin,.popup.sign.register")
                .find('input.next_url').val(next).end()
                .find('a.signup').attr('href','/register?next='+encodeURIComponent(next)).end()
                .find('a.signin').attr('href','/login?next='+encodeURIComponent(next));
            if (!!show_login) $.dialog('popup.sign.signin').open();
            else $.dialog('popup.sign.signup').open();
        } else {
            if (!!show_login) location.href = '/login'+(next?'?next='+encodeURIComponent(next):'');
            else location.href = '/signup'+(next?'?next='+encodeURIComponent(next):'');
        }
        return false;
    }

    $(function() {
        $('#content, #sidebar, #slideshow-box, .profile').delegate('.fancyd, .fancy, .add', 'click', function(event) {
            event.preventDefault();
            var $this = $(this), login_require = $this.attr('require_login');
            var tid;
            if (login_require && login_require=='true') {
                tid = $(this).attr('tid');
                if (tid) {
                    return require_login(null, 'fancy_thing', tid);
                } else {
                    return require_login();
                }
            }
        });
    });
})($);
