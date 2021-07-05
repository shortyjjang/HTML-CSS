jQuery(function($) {

	var fb_source = $('#fb_source').attr('value');
	if (fb_source != undefined) {
		fb_source = fb_source.trim();
	}
	window.fbAsyncInit = function(){
		FB.init({appId: '727093554165994', version: 'v2.8', status: true, cookie: true, xfbml: true,oauth : true});
		if (fb_source != undefined && fb_source.length > 0) {
			FB.getLoginStatus(fbAutoLogin);
		}
	};

    function fbAutoLogin(response) {
        if(response && response.status == 'connected') {
			FB.login(
				function(response2) {
					if (response2.authResponse) onFBConnected('', fb_source);
				},
				{scope:'email,user_friends,public_profile'}
			);
        }
    }

    (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.async = 'async';
            js.src = "//connect.facebook.com/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

	$('a.facebook,button.facebook').on('click',function(){
        var expire = new Date();
        expire.setDate(expire.getDate() - 1);
        document.cookie = 'ck_sns_su' + '=; path=/; expires='+expire.toUTCString();

		if(!window.FB) return false;

	    $.post("/fb_signup_log/open");
		FB.login(
			function(response2) {
                if (response2.authResponse) {
	                $.post("/fb_signup_log/connected");
                    onFBConnected('', false);
                }
                else {
                    FB.getLoginStatus(function(response) {
                        if (response.status === 'connected') {
                        } else if (response.status === 'not_authorized') {
	                        $.post("/fb_signup_log/canceled");
                        } else {
                        }
                    });
                }
			},
			{scope:'email,user_friends,public_profile'}
		);
		return false;
	});
});

function onFBConnected(perms, fb_source) {
    var param = {}
    param['perms']=perms;
    var next_u = $('input.next_url').val() || '';
    var from_oauth_authorize = null;

	if (fb_source != undefined && fb_source.length > 0) {
		param['fb_source'] = fb_source;
	}

    if(typeof(next_u) != undefined && next_u != null){
        param['next_url']=next_u;
    }
    
    
    var referrer = null;
    if($('input.referrer').length>0)
        referrer = $('input.referrer').val();

    var request_ids = null;
    if($('input.request_ids').length>0)
        request_ids = $('input.request_ids').val();

    var invitation_key = null;
    if($('input.invitation_key').length>0)
        invitation_key = $('input.invitation_key').val();

    if(typeof(referrer) != undefined && referrer != null){
		param['referrer']=referrer;
    }

    if(typeof(request_ids) != undefined && request_ids != null){
		param['request_ids']=request_ids;
    }

    if(typeof(invitation_key) != undefined && invitation_key != null){
		param['invitation_key']= invitation_key;
    }
    
    if($('input.from_oauth_authorize').length>0)
        from_oauth_authorize = $('input.from_oauth_authorize').val();
    if(typeof(from_oauth_authorize) != undefined && from_oauth_authorize != null){
        param['from_oauth_authorize']=from_oauth_authorize;
     }

    var signup_forced = ($.cookie.get('signup-forced')=='true');

	$.post("/login_fb_user.json", param,
		function(json){
			if (json.status_code==1 && json.url ) {
				var url = json.url;
                if (url.indexOf('/register') == 0) {
                    showFacebookSignup();
                } else {
                    try {track_event('Complete Login', {'channel':'facebook', 'forced':signup_forced});} catch(e){}
                    try {
                        if((!signup_forced) && json.is_seller) {
                            processNextUrl(url, '/merchant/dashboard');
                            return;
                        }
                    } catch(e) {}
                    processNextUrl(url);
                }
			} else if (json.status_code == 1) {
                showFacebookSignup();
			} else if (json.status_code === 0 && json.message) {
				alert(json.message);
			} else {
				alertify.alert('failed');
                console.log(json);
			}
		}, "json")
        .fail(function(xhr) {
            if(xhr.status==403) {
                alert("It looks like your browser is set to block cookies. Please check your browser settings and enable cookies.");
            } else if(xhr.status>=400) {
                alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            }
        });
	return false;
}

function showFacebookSignup(){
    $.get("/sns_signup_info.json", {}, function(json){
        console.log(json);

        $('.signup .frm .sns')
            .find('[name=email]').val(json.email||"").end()
            .find('[name=firstname]').val(json.first_name||"").end()
            .find('[name=lastname]').val(json.last_name||"").end()
            .find('[name=username]').val(json.username||"").end()
            .find('[name=next_url]').val(json.next_url_after_login||"/").end()
            .trigger('open', 'facebook');
    });
}
