$(document).ready(function() {
    $('.result-contents.result-picks, .result-contents.result-sns').on('click', 'button.btn-findall', function() {
        var user_ids = new Array();
        var $followBtns = $(this).closest('.select-list').find('a.follow-user-link');
        $followBtns.addClass('loading');
        $followBtns.each(function(){
            user_ids.push($(this).attr('uid'));
        });
        var param = {};
        param['user_ids'] = user_ids.join(',');
        $.post("/add_follows.xml",param,
            function(xml){
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    $followBtns.removeClass('loading');
                    $followBtns.each(function(){
                        $(this).text(gettext('Following'));
                        $(this).addClass('following');
                    });
                }
            }, "xml");
    });
    $('#sidebar .search-keyword').on('keypress', function(e) {
        if (e.keyCode == 13) {
            var keyword = $(this).val();
            location.href = "/find-friends?tab=search&key="+encodeURIComponent(keyword);
        }
    });
    $('#sidebar .search-keyword').on('focus', function(e) {
		$(this).closest('.find-keyword').addClass('focus');
	});
    $('#sidebar .search-keyword').on('blur', function(e) {
		if($(this).val()==''){$(this).closest('.find-keyword').removeClass('focus');}
	});
    $('.find-type a').click(function(e){
        e.preventDefault();
        var location_href =  "/find-friends";
        if ($(this).hasClass("facebook")) { location_href +="?type=facebook"}
        else if ($(this).hasClass("twitter")) { location_href +="?type=twitter"}
        else if ($(this).hasClass("google")) { location_href +="?type=google"}
        else if ($(this).hasClass("gmail")) { location_href +="?type=gmail"}
        location.href = location_href;
    });
    $('.btns-white.btn-connect').click(function() {
        var $btn = $(this);
        $('#content').addClass('loading');
        if ($btn.attr('type') == 'facebook') {
            var params = {scope:'email,user_friends'};
            if( $btn.attr('auth_type') )
                params.auth_type = $btn.attr('auth_type');

            FB.login(function(response2) {
                if (response2.authResponse) {
                    $.post('/link_or_update_fb_user.xml', {}, function(xml){
			location.reload();
                    }, 'xml');
                }
            }, params);
        } else if ($btn.attr('type') == 'twitter') {
            var loc = location.protocol+"//"+location.host;
            var param = {'location':loc};
            var popup = window.open(null, '_blank', 'height=400,width=800,left=250,top=100,resizable=yes', true);			
            $.post('/find_friends_twitter.xml', param, function(xml) {
                var $xml = $(xml);
                if ($xml.find('status_code').length>0 && $xml.find('status_code').text()==1) {
                    popup.location.href = $xml.find("url").text();						
                    twitterConnected0(popup,$xml.find("url").text(), function(xml){
                        if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1){
                            $.post('/find_friends_get_twitter_friends_on_fancy', null,
                                function(html) {
                                    $('.connect-sns.twitter').hide();
                                    if($.trim(html).length == 0) {
                                        $('.connect-sns.empty').empty()
                                        $('.connect-sns.empty').html('<p><i class="icon"></i><b>No Twitter friends found</b> Connect to a different network to find your friends on Fancy.</p>').show();
                                    }
                                    else{
                                        $('.followers-listing.after').empty()
                                        $('.followers-listing.after').html(html).show();
                                        $.infiniteshow({itemSelector:'.followers-listing > .vcard'});
                                    }
                                }, 'html');
                        }
                    }, function(xml){})
                } else if ($xml.find("status_code").length>0 && $xml.find("status_code").text()==0) {
                    alertify.alert($(xml).find("message").text());
                    $('#content').removeClass('loading');
                }  
            }, 'xml');
        } else if ($btn.attr('type') == 'gmail') {
            var loc = location.protocol+'//'+location.host;
            var param = {'location':loc};
            var popup = window.open(null, '_blank', 'height=550,width=900,left=250,top=100,resizable=yes', true);
            $.post('/find_friends_gmail.xml', param, function(xml){
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    popup.location.href = $(xml).find("url").text();
                    gmailConnected0(popup,$(xml).find("url").text(),
                        function(xml){
                            if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1){
                                $.post('/find_friends_get_gmail_friends_on_fancy', null,
                                    function(html) {
                                        $('.connect-sns.gmail').hide();
                                        if($.trim(html).length == 0) {
                                            $('.connect-sns.empty').empty()
                                            $('.connect-sns.empty').html('<p><i class="icon"></i><b>No Gmail friends found</b> Connect to a different network to find your friends on Fancy.</p>').show();
                                        }
                                        else{
                                            $('.followers-listing.after').empty()
                                            $('.followers-listing.after').html(html).show();
                                            $.infiniteshow({itemSelector:'.followers-listing > .vcard'});
                                        }
                                    }, 'html');
                            } else if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0 && $(xml).find("message").length>0){
                                alertify.alert($(xml).find("message").text());
                                $('#content').removeClass('loading');
                            }
                        }, function(xml){})
                } else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                    alertify.alert($(xml).find("message").text());
                    $('#content').removeClass('loading');
                }
            }, 'xml');
        }
    });
    $('.result-sns .select-list').on('click', '.sns-back', function() {
        $('.btns-gray-embo.btn-find').removeClass('loading');
        $('.result-sns .select-list').hide();
        $('.result-sns .select-type').show();
    });

    var twitterConnected0 = function(popup,url,success, failure) {
        var wait  = function() {
            setTimeout(function() {
                if (popup == null) {
                    failure(); // When does this happen?
                    return;
                }
                if (popup.closed) {
                    $.post('/link_or_update_tw_user.xml',function(xml) {
                        if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                            success(xml);
                        }
                        else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                            alertify.alert($(xml).find("message").text());
                            failure();
                        }
                        else {
                            /*failure();*/
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

    var gmailConnected0 = function(modal,url,success, failure) {
        var wait  = function() {
            setTimeout(function() {
                if (modal == null) {
                    failure(); // When does this happen?
                    return;
                }
                if (modal.closed) {
                    $.post('/find_friends/google/check.xml',function(xml) {
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

    var googleConnected = false;

    var gplus_ff_authResult = null;
    var gplus_url = null;
    function gplus_friend_frinds_post() {
        $.post(gplus_url, gplus_ff_authResult, function(json){
            var code = json.status_code;
            if (code == 0) {
                alertify.alert(json.message);
            } else {
                $.post(
                    '/find_friends_get_friends_social_on_fancy?backend=google',
                    null,
                    function(html) {
                        $('.connect-sns.google').hide();
                        if($.trim(html).length == 0) {
                            $('.connect-sns.empty').empty()
                            $('.connect-sns.empty').html('<p><i class="icon"></i><b>No Gmail friends found</b> Connect to a different network to find your friends on Fancy.</p>').show();
                        }
                        else{
                            $('.followers-listing.after').empty()
                            $('.followers-listing.after').html(html).show();
                            $.infiniteshow({itemSelector:'.followers-listing > .vcard'});
                        }
                        googleConnected = true;
                    },
                    'html'
                );
            }
        }, "json");
    }

    function initialize_gplus() {
        if (typeof gapi == "undefined") {
            setTimeout(initialize_gplus, 50);
            return;
        }
        
        $("#fancy-gplus-link").on('click', function() {
            gplus_clicked = true;
            return false;
        });
        
        if ($('#fancy-gplus-link').length > 0) {
			link_options.approvalprompt = 'force';
            link_options.callback = function(authResult) {
                if (!gplus_clicked || authResult.error == 'access_denied') return false;

                var url = location.protocol == 'https:' ? '/social/link_google.json' : '/link_google.json';
                authResult['update'] = true;

                if (!googleConnected) {
                    var $btn = $('#fancy-gplus-link');
                    gplus_url = url;
					var fields = ['access_token', 'state', 'token_type', 'expires_in', 'code', 'update', 'id_token'];
					gplus_ff_authResult = {};
					for (var i=0;i<fields.length;i++) {
						var field = fields[i];
						gplus_ff_authResult[field] = authResult[field];
					}
                    setTimeout(gplus_friend_frinds_post, 1);
                }
            };
            
            gapi.signin.render('fancy-gplus-link', link_options);
        }
    }
    initialize_gplus();
	$.infiniteshow({itemSelector:'#content .followers-listing > .vcard'});
});
