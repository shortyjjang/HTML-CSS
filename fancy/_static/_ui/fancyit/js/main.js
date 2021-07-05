jQuery(function($) {
    $('a.btn-close').click(function(e) {
        e.preventDefault();
        var p = null;
        if (parent.postMessage)
            p = parent
        else if(parent.document.postMessage)
            p = parent.document
        
        if(p != undefined && p != null)
            p.postMessage('fancy.fancyit.close','*');
    });
      
    window.fbAsyncInit = function() {
		FB.init({appId: '180603348626536', version: 'v2.8', status: true,cookie: true, xfbml: true,oauth : true});
    
    };

    (function() {
      var e = document.createElement('script');
      e.type = 'text/javascript';
      e.src = document.location.protocol + '//connect.facebook.com/en_US/sdk.js';
      e.async = true;
      document.getElementById('fb-root').appendChild(e);
    }());

    $('a.sign-in-link,a.btn-fb,a.btn-tw').click(function(){
        var modal = window.open('/fancyit/login?close', 'signin', 'width=470, height=550');
        var wait  = function() {
            setTimeout(function() {
                if (modal == null) {
                    //failure(); // When does this happen?
                    location.reload(false);
                    return;
                }
                if (modal.closed) {
                    location.reload(false);
                }
                else {
                    wait();
                }
            }, 25);
        };
        wait();
        return false;

    });

    $('a.button.facebook').click(function(){
        FB.getLoginStatus(function(response){
            if (response.authResponse) {
                onFBConnected('');                
            }
            else{
                FB.login(function(response2) {
                    if (response2.authResponse) {
                        //if (response.perms) {
                            onFBConnected('');
                        //} else {
                        //}
                    } else {
                    }
                }, {scope:'email,user_friends'});
            }
        });
        return false;
    });

    $('a.button.twitter').click(function() {
        var loc = document.location.protocol+"//"+document.location.host;
        var param = {};
        var selectedRow = $(this);
        var popup = window.open(null, '_blank', 'height=400,width=800,left=250,top=100,resizable=yes', true);
        $.post("/apps/twitter/login.xml",param, 
            function(xml){
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    popup.location.href = $(xml).find("url").text();
                    
					twitterConnected(popup,$(xml).find("url").text(),
						function(xml){
							if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1){
                                param = {};
                                $.post("/login_twitter_user.xml",param, 
                                    function(xml){
                                          if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1 && $(xml).find("url").length>0) {
                                            if($(xml).find("url").text() == '/register'){
                                                //window.open('/register', '_blank');
                                                window.location="/register?close"
                                            }
                                            else{
                                                location.reload(false);                                                
                                            }
                                          }
                                          else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                                            //window.open('/register', '_blank');
                                            window.location="/register?close"
                                          }
                                          else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                                              alert($(xml).find("message").text());
                                          }
                                          else {
                                              //alert('failed');
                                          }
                                }, "xml");
							}
							else{
							}
						},
						function(xml){
						})
                }
                else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
					popup.close()
                    alert($(xml).find("message").text());
                }  
        }, "xml");
        return false;
    });      
});


function onFBConnected(perms) {
    var param = {perms:perms};

	$.ajax({
		type : 'post',
		url  : '/login_fb_user.xml',
		data : param,
		dataType : 'xml',
		success  : function(xml){
			var $xml = $(xml), $st = $xml.find('status_code'), url = $xml.find('url').text() || '';

			if(!$st.length) return;
			if($st.text() == 1){
				if(!url || /\^\/register/.test(url)){
					window.location.href = url + (url.indexOf('?')<0?'?':'&')+'close';
				} else {
					location.reload(false);
				}
			} else {
				alert($xml.find('message').text());
			}
		}
	});

	return false;
}

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
