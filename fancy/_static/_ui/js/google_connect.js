function initialize_google_auth(auth2) {
    if (window.___gcfg.isSignedOut) {
        if (auth2.isSignedIn.get()) {
            auth2.signOut().then(function() { console.log('signed out google'); }, function() { console.log('failed to sign out google') });
        }
    }
    $('#fancy-g-signin, #fancy-g-signin-sidebar, #fancy-g-signup, #fancy-g-checkout').on('click', function() {
        var nextpath = $(this).attr("next") || '/';
        var options = new gapi.auth2.SigninOptionsBuilder();
        options.setAppPackageName('com.example.app');
        auth2.signIn(options).then(function(googleUser) {
            $.ajax({ 
                url: '/social/check_login_google.json', method: 'POST', dataType: 'json',
                data: {
                    'id_token': googleUser.getAuthResponse().id_token,
                    'next': nextpath, 
                    'origin': location.pathname,
                }
            }).then(function(json) {
                console.log(json);
                if (!json.status_code) {
                    alert(json.message || "Sorry, we couldn't sign you in. Please try again.");
                    return;
                }
                var signup_forced = ($.cookie.get('signup-forced')=='true');

                if(json.url && json.url.indexOf('/social/register/')==0) {
                    processNextUrl(nextpath, null, json.url);
                } else {
                    try {track_event('Complete Login', {'channel':'google', 'forced':signup_forced}); } catch(e) {}

                    if((!signup_forced) && json.is_seller==1) {
                        processNextUrl(nextpath, '/merchant/dashboard');
                    } else {
                        processNextUrl(nextpath);
                    }
                }
            }).fail(function(xhr) {
                alert("Sign in failed. Please try again later.");
            });
        }, function(resp) {
            console.log(resp);
        });
    });

    $('#fancy-g-link').on('click', function() {
        if (!$(this).hasClass("current")) return;
        var options = new gapi.auth2.SigninOptionsBuilder();
        options.setAppPackageName('com.example.app');

        auth2.signIn(options).then(function(googleUser) {
            console.log(googleUser);
            // timer for ios mobile safari and refresh
            var refreshTimer = setTimeout(function(){location.reload();}, 2000);

            $.ajax({ 
                url: '/social/link_google.json', method: 'POST', dataType: 'json',
                data: {
                    'id_token': googleUser.getAuthResponse().id_token,
                    'origin': location.pathname,
                }
            }).then(function(json) {
                console.log(json);
                if(refreshTimer) clearTimeout(refreshTimer); // clear timer when callback excuted
                if (!json.status_code) {
                    alert(json.message || "Sorry, we couldn't link your account. Please try again.");
                    return;
                }
                if (json.url)  {
                    location.href = json.url;
                } else {
                    var name = json.name;

                    // gplus exclusive
                    var $glink = $('#fancy-g-link');
                    var $subscribe = $('#fancybox-subscribe');
                    if ($glink.length > 0 && $subscribe.length > 0){
                        $glink.hide();
                        $subscribe.show();
                    }
                    var $onoff = $('.network .google');
                    if ($onoff.length > 0) {
                        var html_str = 'Connected to Google as <a href="https://plus.google.com/" target="_blank">'+name+'</a>';
                        $onoff.find("div.after-on").html(html_str);
                        $onoff.find(".switch button.btn-switchoff").removeClass("current");
                        $onoff.find(".switch button.btn-switchon").addClass("current");
                        $onoff.find(".after-on").show().end().find(".after-off").hide();
                    }
                }
            }).fail(function(xhr) {
                alert("Sign in failed. Please try again later.");
            });
        }, function(resp) {
            console.log(resp);
        });
    });

    $('.network .google .switch button.btn-switchon.current').on('click',function(){
    	var parent = $(this).parents("div.after").first();
        var type = 'google';
        var unlink_url  = ['/social/unlink', type].join('_') + '.json';
        if (confirm('Do you really want to remove Google connection?')) {
                $.post(unlink_url, {}, function(json){
                    var code = json.status_code;
                    if (code == 0) {
                             alert(json.message);
                    } else {
                        var parent = $(".network .google");
                        parent.find(".switch button.btn-switchon").removeClass("current");
                        parent.find(".switch button.btn-switchoff").addClass("current");
                        parent.find(".after-off").show().end().find(".after-on").hide();
            }
                }, "json");
        }
        return false;
    });
}

function initialize_google() {
    if (typeof gapi == "undefined") {
        setTimeout(initialize_google, 50);
        return;
    }
    gapi.load('auth2', function() {
        initialize_google_auth(gapi.auth2.init({
            client_id: "870365319043-ljas5u3l1p8uv7a343i6ludrpmkv5mpj.apps.googleusercontent.com",
            scope: "openid profile email",
            fetch_basic_profile: false,
            cookie_policy: document.location.protocol+"//"+document.location.host,
            ux_mode: 'popup'
        }));
    });
}
