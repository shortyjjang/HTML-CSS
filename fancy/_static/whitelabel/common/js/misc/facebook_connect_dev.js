jQuery(function($) {
	window.fbAsyncInit = function(){
	};

    function fbAutoLogin(response) {
    }

	$('a.facebook,button.facebook').on('click',function(){
        onFBConnected('', false);
	});
});

function onFBConnected(perms, fb_source) {
    showFacebookSignup();
}

function showFacebookSignup(){
    var json = {
        'first_name':'snsuser',
        'last_name':'facebook',
        'email':'jaemok+facebook@dev.fancy.com',
        'username':'jaemok_facebook',
    }

    $('.signup .frm .sns')
        .find('[name=email]').val(json.email||"").end()
        .find('[name=firstname]').val(json.first_name||"").end()
        .find('[name=lastname]').val(json.last_name||"").end()
        .find('[name=username]').val(json.username||"").end()
        .find('[name=next_url]').val(json.next_url_after_login||"/").end()
        .trigger('open', 'facebook');
}

