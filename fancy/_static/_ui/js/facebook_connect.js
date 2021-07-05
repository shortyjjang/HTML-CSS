jQuery(function($) {

	var fb_source = $('#fb_source').attr('value');
	if (fb_source != undefined) {
		fb_source = fb_source.trim();
	}
	window.fbAsyncInit = function(){
		FB.init({appId: '180603348626536', version: 'v2.8', status: true, cookie: true, xfbml: true,oauth : true});
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
				{scope:'email,user_friends'}
			);
        }
    }
	// add script
	$('<script src="https://connect.facebook.net/en_US/sdk.js" defer async></script>').appendTo('#fb-root');
	  
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
			{scope:'email,user_friends'}
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

	$.post("/login_fb_user.xml", param,
		function(xml){
			if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1 && $(xml).find("url").length>0) {
				var url = $(xml).find("url").text();
                if (url.indexOf('/register') == 0) {
                    // need to register
                    if(window.simpleRegister && next_u=='/checkout') {
                        // process register
                        window.simpleRegister({
                            'sns-type': 'facebook',
                        });
                    } else {
                        // redirect to register page.
                        processNextUrl(next_u, null, url);
                    }
                } else {
                    try {track_event('Complete Login', {'channel':'facebook', 'forced':signup_forced});} catch(e){}
                    try {
                        if((!signup_forced) && $(xml).find('is_seller')=='1') {
                            processNextUrl(url, '/merchant/dashboard');
                            return;
                        }
                    } catch(e) {}
                    processNextUrl(url);
                }
			} else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                processNextUrl(next_u, null, '/register');
			} else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
				alert($(xml).find("message").text());
			} else {
				//alert('failed');
			}
		}, "xml")
        .fail(function(xhr) {
            if(xhr.status==403) {
                alert("It looks like your browser is set to block cookies. Please enable cookies in your browser settings.");
            } else if(xhr.status>=400) {
                alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            }
        });
	return false;
}
