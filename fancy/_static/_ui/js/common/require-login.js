window.require_login = function(next, action, action_param, show_login){
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
		$social = $('.social');
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
};