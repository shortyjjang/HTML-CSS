$(document).ready(function() {
	// check from_twitter_auth parameter
	if(/\?from_twitter_auth=1/.test(location.search)){
		$.ajax({
			type : 'post',
			url  : '/apps/twitter/check.json',
			dataType : 'json',
			success  : function(json) {
				if(json.status_code) {
					request();
				}
			}
		});
	}

    $('a.twitter,button.twitter').click(function() {
        var expire = new Date(), mobile = false;
        expire.setDate(expire.getDate() - 1);
        document.cookie = 'ck_sns_su' + '=; path=/; expires='+expire.toUTCString();

        var loc = location.protocol+'//'+window.location.host, url=location.search, param = {'location':loc}, popup;

		if(/(?:iPad|iPhone);/.test(navigator.userAgent)){
			mobile = true;

			url = url.replace(/[\?&]from_twitter_auth=1/g,'').replace(/^[\?&]/,'');
			url = loc+location.pathname+'?from_twitter_auth=1&'+url;

			param.next = url;
		} else {
			popup = window.open(null, '_blank', 'height=400,width=800,left=250,top=100,resizable=yes', true);
		}

        $.post("/apps/twitter/login.json",param, 
            function(json){
				if (json.status_code==1) {
					if(mobile) {
						location.href = json.url;
						return;
					}

					popup.location.href = json.url;
					twitterConnected(
						popup,
						json.url,
						function(json){
							if(json.status_code==1){
								request();
							}
						}
					);
                } else if (json.status_code==0) {
					popup.close();
                    alert(json.message);
                }
        }, "json");
        return false;
    });

	function request(){
		var next_u, referrer, from_oauth_authorize, invitation_key, params={};

		next_u   = $('input.next_url').val() || null;
		referrer = $('input.referrer').val() || null;
		from_oauth_authorize = $('input.from_oauth_authorize').val() || null;
		invitation_key = $('input.invitation_key').val() || null;

		if(next_u) params['next_url']=next_u;
		if(referrer) params['referrer']=referrer;
		if(invitation_key) params['invitation_key']=invitation_key;
		if(from_oauth_authorize) params['from_oauth_authorize']=from_oauth_authorize;

        var signup_forced = ($.cookie.get('signup-forced')=='true');

		$.ajax({
			type : 'POST',
			url  : '/login_twitter_user.json',
			data : params,
			dataType : 'json',
			success  : function(json){
				var status_code = json.status_code, url = json.url;
				if (status_code==1) {
                    if (url) {
                        if (url.indexOf('/register') == 0) {
                            // need to register
                            if(window.simpleRegister && next_u=='/checkout') {
                                // process register
                                window.simpleRegister({
                                    'sns-type': 'twitter',
                                    'username': json.username
                                });
                            } else {
                                // redirect to register page.
                                showTwitterSignup();
                            }
                        } else {
                            try {track_event('Complete Login', {'channel':'twitter', 'forced':signup_forced}); } catch(e) {}
                            if(signup_forced || json.is_seller==0) {
    						    processNextUrl(url);
                            } else {
    						    processNextUrl(next_u, '/merchant/dashboard');
                            }
                        }
					} else if(referrer) {
						showTwitterSignup();
					} else {
						showTwitterSignup();
					}
				} else if (status_code == 0) {
					  alert(json.message);
				}
			}
         }).fail(function(xhr) {
            if(xhr.status==403) {
                alert("It looks like your browser is set to block cookies. Please check your browser settings and enable cookies.");
            } else if(xhr.status>=400) {
                alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            }
        });
	};
});


var twitterConnected = function(popup,url,success, failure) {
	//var modal = window.open(url, '_blank', 'height=400,width=800,left=250,top=100,resizable=yes', true);
	var wait  = function() {
		setTimeout(function() {
			if (popup == null) {
				failure(); // When does this happen?
				return;
			}
			if (popup.closed) {
				$.post('/apps/twitter/check.json',function(json) {
					if (json.status_code>0) {
						success(json);
					}
					else {
						failure();
					}
				}, "json");
			}
			else {
				wait();
			}
		}, 25);
	};
	wait();
};

function showTwitterSignup(){
    $.get("/sns_signup_info.json", {}, function(json){
        console.log(json);

        $('.signup .frm .sns')
            .find('[name=email]').val(json.email||"").end()
            .find('[name=firstname]').val(json.first_name||"").end()
            .find('[name=lastname]').val(json.last_name||"").end()
            .find('[name=username]').val(json.username||"").end()
            .find('[name=next_url]').val(json.next_url_after_login||"/").end()
            .trigger('open', 'twitter');
    });
}