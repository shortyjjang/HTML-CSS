$(document).ready(function() {
	// check from_twitter_auth parameter
	if(/\?from_twitter_auth=1/.test(location.search)){
		$.ajax({
			type : 'post',
			url  : '/apps/twitter/check.xml',
			dataType : 'xml',
			success  : function(xml) {
				if($(xml).find('status_code').length) {
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

        $.post("/apps/twitter/login.xml",param, 
            function(xml){
				var $xml = $(xml), $st = $xml.find('status_code'), $url = $xml.find('url');
				if (!$st.length) return;
                if ($st.text()==1) {
					if(mobile) {
						location.href = $xml.find('url').text();
						return;
					}

					popup.location.href = $url.text();
					twitterConnected(
						popup,
						$url.text(),
						function(xml){
							var $xml = $(xml), $st = $xml.find('status_code');

							if($st.length && $st.text()==1){
								request();
							}
						}
					);
                } else if ($st.text()==0) {
					popup.close();
                    alert($xml.find("message").text());
                }
        }, "xml");
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
			url  : '/login_twitter_user.xml',
			data : params,
			dataType : 'xml',
			success  : function(xml){
				var $xml = $(xml), $st = $xml.find('status_code'), $url = $xml.find('url');
				if(!$st.length) return;
				if ($st.text()==1) {
                    if ($url.length) {
                        if ($url.text().indexOf('/register') == 0) {
                            // need to register
                            if(window.simpleRegister && next_u=='/checkout') {
                                // process register
                                window.simpleRegister({
                                    'sns-type': 'twitter',
                                    'username': $xml.find('username').text()
                                });
                            } else {
                                // redirect to register page.
                                processNextUrl(next_u || '', null, $url.text());
                            }
                        } else {
                            try {track_event('Complete Login', {'channel':'twitter', 'forced':signup_forced}); } catch(e) {}
                            if(signup_forced || $xml.find('is_seller').text()==0) {
    						    processNextUrl($url.text());
                            } else {
    						    processNextUrl(next_u, '/merchant/dashboard');
                            }
                        }
					} else if(referrer) {
   						processNextUrl(next_u, null, '/register?referrer='+(referrer));
					} else {
   						processNextUrl(next_u, null, '/register');
					}
				} else if ($st.text() == 0) {
					  alert($xml.find("message").text());
				}
			}
         }).fail(function(xhr) {
            if(xhr.status==403) {
                alert("It looks like your browser is set to block cookies. Please enable cookies in your browser settings.");
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
				$.post('/apps/twitter/check.xml',function(xml) {
					if ($(xml).find("status_code").length>0) {
						success(xml);
					}
					else {
						failure();
					}
				}, "xml");
			}
			else {
				wait();
			}
		}, 25);
	};
	wait();
};
