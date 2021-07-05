jQuery(function($) {
    var TEST = false;

    var params = location.search.substr(1).split("&");
    for(var i=0; i<params.length; i++) {
        if(params[i]=="TEST") {
            TEST = true;
        }
    }

    var dlg_signup = $.dialog('popup.sign.signup');
    var dlg_signup_detail = $.dialog('popup.sign.register');
    var dlg_signin = $.dialog('popup.sign.signin');
    var dlg_forgot_pw = $.dialog('popup.sign.forgot_pw');
    var dlg_reset_pw_email_sent = $.dialog('popup.sign.reset_pw_email_sent');
    var dlg_complete = $.dialog('popup.sign.complete');
    var form_signup = $('.sign.signup form');
    var form_signup_detail = $('.sign.register form');
    var form_signin = $('.sign.signin form');
    var form_forgot_password = $('.sign.forgot_pw form');
    var form_reset_password = $('.sign.reset_pw form');
    var form_reset_pw_email_sent = $('.sign.reset_pw_email_sent form');
    var form_complete = $('.sign.complete form');

    var check_email_error = function() {
        var field = this;
        if(emailRegEx.test($.trim($(this).val()))) { // see common/util.js to change emailRegEx
            $(field).removeClass('error');
            $(field).parent().removeClass('error');
            return true;
        }
        return false;
    }
    var check_password_error = function() {
        var field = this;
        if($(field).val().length>=6) {
            $(field).removeClass('error');
            $(field).parent().removeClass('error');
            return true;
        }
        return false;
    }
    var check_username_error = function() {
        var field = this;
        var username = $(field).val();
        if(username.length>=3 && username.length<=30 && username.match('^[a-zA-Z0-9_]+$')) {
            $(field).removeClass('error');
            $(field).parent().removeClass('error');
            $(field).parent().parent().find('.username_suggest').removeClass('error');
            return true;
        }
        return false;
    }
    var check_email_signin_error = function(e) {
        var field = this;
        var usernameRegEx = /^[a-zA-Z0-9_]+$/;
        var value = $(field).val();

        if(emailRegEx.test($.trim(value)) || usernameRegEx.test($.trim(value))) { // see common/util.js to change emailRegEx
            $(field).removeClass('error');
            $(field).parent().removeClass('error');
            return true;
        }
        return false;
    }

    var check_email_signin = function() {
        var field = this;
        var usernameRegEx = /^[a-zA-Z0-9_]+$/;
        var value = $(field).val();

        if(value.length<1) {
            $(field).addClass('error');
            $(field).parent().addClass('error');

            if($(field).parent().hasClass('hidden-email')) {
                alertify.alert(gettext('Please enter email address.'));
            } else {
                var error = $(field).next();
                error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+gettext('Please enter email address.'));
            }
            return false;
        } else if(!(emailRegEx.test($.trim(value)) || usernameRegEx.test($.trim(value)))) { // see common/util.js to change emailRegEx
            $(field).addClass('error');
            $(field).parent().addClass('error');
            var error = $(field).next();
            error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+gettext('Please enter email address.'));
            return false;
        }
        return true;
    }
    var check_email = function(e) {
        var field = this;
        if($(field).val().length<1) {
            $(field).addClass('error');
            $(field).parent().addClass('error');

            if($(field).parent().hasClass('hidden-email')) {
                alertify.alert(gettext('Please enter email address.'));
            } else {
                var error = $(field).next();
                error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+gettext('Please enter email address.'));
            }
            return false;
        } else if(!emailRegEx.test($.trim($(this).val()))) { // see common/util.js to change emailRegEx
            $(field).addClass('error');
            $(field).parent().addClass('error');
            if($(field).parent().hasClass('hidden-email')) {
                alertify.alert(gettext('A valid email address is required.'));
            } else {
                var error = $(field).next();
                error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+gettext('A valid email address is required.'));
            }
            return false;
        }
        return true;
    }

    var check_password = function(e, check_all) {
        var field = this;
        if($(this).val().length<6) {
            $(field).addClass('error');
            $(field).parent().addClass('error');
            var error = $(field).next();
            error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+gettext('The login details are incorrect. You can click “Forgot your password?” below.'));
            return false;
        }
        return true;
    }

    var check_username_request = null;
    var check_username = function(e, check_all) {
        if(e && e.type=="keyup" && e.which==13) {
            return false;
        }

        if(check_username_request) {
            check_username_request.abort();
            check_username_request = null;
        }
        $(this).parent().find('.url b').text($(this).val());

        var field = this;

        if($(this).val().length>0 && !$(this).val().match('^[a-zA-Z0-9_]+$')) {
            $(field).addClass('error');
            $(field).parent().addClass('error');
            $(field).parent().parent().find('.username_suggest').removeClass('error');
            var error = $(field).next();
            error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+gettext('Please use alphanumeric characters for your username.'));
            return false;
        }

        if(check_all && $(this).val().length<3) {
            $(field).addClass('error');
            $(field).parent().addClass('error');
            $(field).parent().parent().find('.username_suggest').removeClass('error');
            var error = $(field).next();
            if($(this).val().length<1) {
                error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+gettext('Username is required.'));
            } else {
                error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+gettext('Username is too short.'));
            }
            return false;
        }
        if($(this).val().length>30) {
            $(field).addClass('error');
            $(field).parent().addClass('error');
            $(field).parent().parent().find('.username_suggest').removeClass('error');
            var error = $(field).next();
            error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+gettext('Username is too long.'));
            return false;
        }

        /*
        check_username_request = $.get('/check-field/username', { username : $(this).val() }, function(data) {
            if(data.status_code==1) {
                console.log(''+data.value + ' ' + data.exists);
            }

            if(data.error) {
                $(field).addClass('error');
                $(field).parent().addClass('error');
                $(field).parent().parent().find('.username_suggest').addClass('error');
                var error = $(field).next();
                //error.find('.error-level').text(gettext('Sorry')+',');
                //$(field).parent().find('.error-msg').text(gettext('This username is already in user'));
                error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+data.message);
            } else {
                $(field).removeClass('error');
                $(field).parent().removeClass('error');
                $(field).parent().parent().find('.username_suggest').removeClass('error');
            }
        }).always(function() {
            check_username = null;
        });
        */
        return true;
    }

    $('#navigation .mn-signup').click(function(event) {
        event.preventDefault();
        dlg_signup.open({'signup-clicked':true});
    });
    $('#navigation .mn-signin').click(function(event) {
        event.preventDefault();
        dlg_signin.open({'signup-clicked':true});
    });

    window.parseTransformUrl = function parseTransformUrl(options) {
        // it should be noted that the hostname will always be current hostname.
        var url = options.url || '';
        var filterKeys = options.filterKeys; /*:array<string>*/
        var appendingParams = options.appendingParams; /*object{key:value}*/

        // filter: to be filtered
        var anchor = document.createElement('a');
        anchor.setAttribute('href', url);
        var hostname = anchor.hostname;
        var pathname = anchor.pathname.replace(/^\/?/, '/');
        var queriesArray = [];
        var queries = {};

        var queriesString = '';
        var queriesForString;
        if (anchor.search) {
            queriesArray = anchor.search
                .substr(1, anchor.search.length)
                .split('&')
                .map(function(e){
                    return e.split('=');
                });

            queries = queriesArray.reduce(function(ret, queryMap){
                if (queryMap.length > 1) {
                    ret[queryMap[0]] = queryMap[1]
                } else {
                    if (queryMap[0]) {
                        ret[queryMap[0]] = true
                    }
                }
                return ret
            }, {})
        }
        if (appendingParams) {
            _.extend(queries, appendingParams)
        }

        if (filterKeys) {
            queriesForString = _.omit(_.clone(queries), filterKeys)
        } else {
            queriesForString = _.clone(queries)
        }

        queriesString = _.reduce(queriesForString, function(ret, val, key){
            var prepending;
            if (ret === '') {
                prepending = '?'
            } else {
                prepending = '&'
            }
            // single
            if (val === true) {
                ret += (prepending + (key||''))
            } else {
                ret += (prepending + (key||'') + '=' + (val||''))
            }
            return ret
        }, '');

        var url = 'https://' + hostname + pathname + queriesString

        return {
            url: url,
            queries: queries
        };
    }

    window.processNextUrl = function processNextUrl(next, forceTo, redirectTo) {
        try {
            var parsed, queries = {}, nextUrl;

            if (next) {
                if (next.indexOf('?') === -1 && next.indexOf('&') !== -1) {
                    next = next.replace('&', '?')
                }
                parsed = window.parseTransformUrl({
                    url: next,
                    filterKeys: ['action', 'action_param']
                });
                queries = parsed.queries;
                nextUrl = parsed.url;
                console.log('queries', queries, 'nextUrl', nextUrl)
            }

            var trailing = '';
            if (forceTo) {
                nextUrl = forceTo;
            } else if (redirectTo) {
                if (nextUrl) {
                    trailing = (redirectTo.indexOf('?') === -1 ? '?' : '&') + 'next=' + encodeURIComponent(nextUrl);
                }
                nextUrl = redirectTo + trailing;
            }

            // list of actions before redirect.
            if (queries.action === 'fancy_thing') {
                $.ajax({
                    type: 'PUT',
                    url: '/rest-api/v1/things/' + queries.action_param,
                    data: {
                        fancyd: true
                    }
                })
                .always(function(){
                    if (nextUrl) {
                        window.location.href = nextUrl;
                    }
                });
            } else if (queries.action === 'fancy_article') {
                $.ajax({
                    type: 'POST',
                    url: '/articles/save.json',
                    data: {
                        article_id: queries.action_param,
                        action: 'save'
                    }
                })
                .always(function(){
                    if (nextUrl) {
                        window.location.href = nextUrl;
                    }
                });
            } else {
                if (nextUrl) {
                    window.location.href = nextUrl;
                }
            }
        } catch(e){console.warn(e)}
    }

    // signup first phase dialog/form
    dlg_signup.$obj
    .on('open', function(event, params) {
        if(params && params['signup-clicked']) {
            // in case user clicks signin/signup button him/herself
            $.cookie.set('signup-forced', 'false');
        } else {
            // in case user clicks some button which requires signin
            $.cookie.set('signup-forced', 'true');
        }

        dlg_signup.$obj.find('input[name="email"]').val('').focus();

        dlg_signup.$obj.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });
        try {track_event('Signup Popup', {'channel': 'fancy', 'forced':$.cookie.get('signup-forced')=='true'}); } catch(e) {}
    })
    .on('click', 'a.signin', function(event) {
        event.preventDefault();
        if($.cookie.get('signup-forced')=='false') {
            dlg_signin.open({'signup-clicked':true});
        } else {
            dlg_signin.open();
        }
    })


    form_signup
    .on('keyup', 'input[name="email"]', function(event) {
        if(event.which == 13){
            event.preventDefault();
            form_signup.find('.btn-signup').click();
        }
    })
    .on('keyup', 'input.error[name="email"]', check_email_error)
    .on('click', '.btn-signup', function(event) {
        event.preventDefault();
        if( $(this).attr('disabled') ) return;
        
        form_signup.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });

        var $email = $(this).parent().find('input[name="email"]');
        var $referrer = $(this).parent().find('input[name="referrer"]');
        var $invitation_key = $(this).parent().find('input[name="invitation_key"]');
        var $user_id = $(this).parent().find('input[name="user_id"]');
        var email = $.trim($email.val())||'';
        var referrer = $.trim($referrer.val())||null;
        var invitation_key = $.trim($invitation_key.val())||null;
        var user_id = $.trim($user_id.val())||null;

        if(!TEST) {
            if(!check_email.call($email, true)) {
                return;
            }
        }

        var that = this;
        if(!TEST) {
            $(that).disable(true);
        }

        $(that).addClass('loading');

        if(dlg_signup.$obj.length>0) {
            // popup dialog based signup
            if(TEST) {
                dlg_signup_detail.email = email;
                dlg_signup_detail.open();
                return;
            }
            var params = {'email':email};
            //if(referrer) params['referrer'] = referrer;
            //if(invitation_key) params['invitation_key'] = invitation_key;
            $.get('/check-field/email', params, function(response) {
                if (response.status_code != undefined && response.status_code == 1) {
                    dlg_signup_detail.username = response.username;
                    dlg_signup_detail.email = response.email;
                    //dlg_signup_detail.fullname = response.fullname;
                    dlg_signup_detail.open();
                    // prevent detail stage cancelled.
                    dlg_signup_detail.close = function() {};

                    onBeginSignup(true);

                    try { track_event('Begin Signup', { 'channel': 'fancy', 'forced':$.cookie.get('signup-forced')=='true' }); } catch (e) {}
                } else if (response.status_code != undefined && response.status_code == 0) {
                    var msg = response.message;
                    var error = response.error;
                    $email.addClass('error');
                    $email.parent().addClass('error');
                    var error = $email.next();
                    error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+msg);
                    return;
                }
            }, 'json')
            .fail(function(xhr) {
                alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            })
            .always(function() {
                $(that).disable(false);
                $(that).removeClass('loading');
            });
        } else {
            // full page based signup
            if(TEST) {
                form_signup_detail.find('input[name="email"]').val(email);
                $('#container-wrapper .content.signup').hide();
                $('#container-wrapper .content.register').show();
                return;
            }
            var params = {'email':email};
            //if(referrer) params['referrer'] = referrer;
            //if(invitation_key) params['invitation_key'] = invitation_key;
            //if(user_id) params['user_id'] = user_id;
            $.get('/check-field/email', params, function(response) {
                if (response.status_code != undefined && response.status_code == 1) {
                    form_signup_detail.find('input[name="username"]').val(response.username).change();
                    form_signup_detail.find('input[name="username"]').parent().find('.url b').text(response.username);
                    form_signup_detail.find('input[name="email"]').val(response.email);
                    form_signup_detail.find('input[name="fullname"]').val(response.fullname).focus();

                    $('#container-wrapper .content.signup').hide();
                    $('#container-wrapper .content.register').show();

                    onBeginSignup(false);

                    try { track_event('Begin Signup', { 'channel': 'fancy', 'forced':($.cookie.get('signup-forced')=='true') }); } catch (e) {}
                } else if (response.status_code != undefined && response.status_code == 0) {
                    var msg = response.message;
                    var error = response.error;
                    $email.addClass('error');
                    $email.parent().addClass('error');
                    var error = $email.next();
                    error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+msg);
                    return;
                }
            }, 'json')
            .fail(function(xhr) {
                alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            })
            .always(function() {
                $(that).disable(false);
                $(that).removeClass('loading');
            });
        }
    });

    // signup second phase (detail) dialog/form
    dlg_signup_detail.$obj
    .on('open', function(){
        dlg_signup_detail.$obj.find('input[name="username"]').val(dlg_signup_detail.username).change();
        dlg_signup_detail.$obj.find('input[name="username"]').parent().find('.url b').text(dlg_signup_detail.username);
        dlg_signup_detail.$obj.find('input[name="email"]').val(dlg_signup_detail.email);
        dlg_signup_detail.$obj.find('input[name="fullname"]').val(dlg_signup_detail.fullname).focus();

        dlg_signup_detail.$obj.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });
    })
    .on('close', function(){
        if(!TEST) {
            location.href = '/?channel=fancy&popup=onboarding';
        }
    });

    form_signup_detail
    .on('keyup', 'input.error[name="email"]', check_email_error)
    .on('keyup', 'input.error[name="user_password"]', check_password_error)
    .on('keyup', 'input.error[name="username"]', check_username_error)
    .on('keyup', 'input[name="username"]', check_username)
    .on('click', '.btn-signup', function(event) {
        event.preventDefault();

        var $this = $(this);
        if( $this.attr('disabled') ) return;

        var $form = form_signup_detail;

        form_signup_detail.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });

        var activate_url = $('.container').is('.activate_mode') ? '/activate-login?success=true' : '';
        var next_url = $form.find('input.next_url').val() || '';

        var $username = $form.find('input[name="username"]');
        var $email = $form.find('input[name="email"]');
        var $user_password = $form.find('input[name="user_password"]');

        var username = $.trim($username.val())||'';
        var email = $.trim($email.val())||'';
        var password = $.trim($user_password.val())||'';
        var fullname = $.trim($form.find('input[name="fullname"]').val())||'';
        var referrer = $.trim($form.find('input[name="referrer"]').val())||'';
        var invitation_key = $.trim($form.find('input[name="invitation_key"]').val())||'';
        var user_id = $.trim($form.find('input[name="user_id"]').val())||'';
        var is_brand_store = $('#brandSt').is(':checked');

        var sns_type = $form.attr('sns-service');
        if(!sns_type) sns_type = 'email';

        if(!check_username.call($username, null, true)) {
            return;
        }
        if($email.length>0) {
            if(!(sns_type=='facebook' && email.length==0)) {
                if(!check_email.call($email, true)) {
                    $form.find('.hidden-email').show();  
                    return;
                }
            }
        }
        if($user_password.length>0) {
            // do not enter password for social signup
            if(!check_password.call($user_password, null, true)) {
                return;
            }
        }

        var param = {
            'username'  : username,
            'fullname'  : fullname
        };
        if(invitation_key.length>0) param['invitation_key'] = invitation_key;
        if(referrer.length>0) param['referrer'] = referrer;
        if(user_id.length>0) param['user_id'] = user_id;
        if(email.length>0) param['email'] = email;

        if ($form.find('button#subscribe').hasClass("on")) param['notify_updates'] = 'true';

        if($('#signup-recaptcha').length>0) {
            try {
                var g_recaptcha_response = grecaptcha.getResponse(g_recaptcha_widget)
                param['grecaptcha'] = g_recaptcha_response;
            } catch(e) {
                console.log('failed to get g-recaptcha response',e);
            }
        }
        if($('#captcha-answer').length>0) param['captcha_answer'] = $('#captcha-answer').val();

        if($user_password.length>0) param['password'] = password;

        $this.disable(true).css({'cursor': 'default'});
        $this.addClass('loading')

        // proceed registration
        if(sns_type==='facebook') {
            // facebook signup
            //var post_to_facebook = $('#fb-wall').is(':checked');
            var post_to_facebook = $('#fb-wall').hasClass('on');
            var fb_request_id = $this.attr('fbrid');

            param['post_to_facebook']=post_to_facebook;
            if(fb_request_id != undefined) { param['fb_request_id']=fb_request_id; }
            if (location.args['next']) param['next'] = location.args['next'];

            var close_w = false;
            if($form.find('#close_w').length){
                close_w = true;
            }

            $this.attr('disabled', true).css({'cursor': 'default'});
            $.post("/facebook_signup.xml",param, function(xml) {
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    // success
                    onCompleteSignup('facebook');
                    if(close_w){
                        window.close();
                    } else {
                        if (document.URL.indexOf('/seller-signup') > -1) {
                            processNextUrl(next_url, "/seller-signup");
                        } else if (activate_url) {
                            processNextUrl(next_url, activate_url);
                        } else {
                            processNextUrl(next_url, null, parseTransformUrl({ url: '/', appendingParams: {channel:'facebook', popup: 'onboarding'}}).url);
                        }
                    }
                } else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                    // failed create account with facebook id
                    var error_type = $(xml).find("error").text();
                    if(error_type.indexOf('email')>=0) {
                        if(error_type == "email_duplicate"){
                            var email = $(xml).find("email").text();
                            $email.val(email);
                        }
                        var msg = $(xml).find("message").text();
                        $email.val(email);
                        $form.find('.hidden-email').show();  

                        /*
                        $email.parent().addClass('error');
                        var $error = $email.next();
                        $error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+msg);
                        */
                        alertify.alert(msg);
                    } else if(error_type.indexOf('username')>=0) {
                        var msg = $(xml).find("message").text();
                        $username = $form.find('input[name="username"]');
                        $username.parent().addClass('error');
                        var $error = $username.next();
                        $error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+msg);
                    } else {
                        var msg = $(xml).find("message").text();
                        alertify.alert(msg);
                    }
                }
            }, "xml")
            .fail(function(xhr) {
                alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            })
            .always(function() {
                $this.disable(false).css('cursor','');
                $this.removeClass('loading');
            });
        } else if(sns_type=='twitter') {
            // twitter signup
            var follow_fancy = $('#follow-thefancy').hasClass('on');
            var post_to_twitter = $('#twitter').hasClass('on');
            param['follow_fancy']=follow_fancy;
            param['post_to_twitter']=post_to_twitter;
            if (location.args['next']) param['next'] = location.args['next'];

            var close_w = false;
            if($form.find('#close_w').length){
                close_w = true;
            }

            $this.disable(true).css({'cursor':'default'});
            $.post("/twitter_signup.xml",param, function(xml){
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    // success
                    onCompleteSignup('twitter');
                    if(close_w){
                        window.close();
                    } else{
                        if (document.URL.indexOf('/seller-signup') > -1) {
                            processNextUrl(next_url, '/seller-signup');
                        } else if (activate_url) {
                            processNextUrl(next_url, activate_url);
                        } else {
                            processNextUrl(next_url, null, parseTransformUrl({ url: '/', appendingParams: {channel:'twitter', popup: 'onboarding'}}).url);
                        }
                    }
                } else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                    var msg = $(xml).find("message").text();
                    var err = $(xml).find("error").text();
                    if (err != undefined && err.indexOf('email')>=0){
                        $email.addClass('error');
                        $email.parent().addClass('error');
                        var $error = $email.next();
                        $error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+msg);
                    } else if (err != undefined && err.indexOf('username')>=0) {
                        $username.addClass('error');
                        $username.parent().addClass('error');
                        var $error = $username.next();
                        $error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+msg);
                    } else {
                        alertify.alert(msg);
                    }
                }
            }, "xml")
            .fail(function(xhr) {
                alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            })
            .always(function() {
                $this.disable(false).css('cursor','');
                $this.removeClass('loading');
            });
        } else if(sns_type=='email') {
            function email_signup(recaptcha_token) {
                // email signup
                var http_post = "/invitation_signup";
                var https_post = "/invitation_signup.json";
                var from_popup = $this.attr('from_popup');
                var force_xhr = false;
                
                if (recaptcha_token) param['recaptcha_token'] = recaptcha_token;

                if (typeof(from_popup) != undefined && from_popup === 'true') {
                    https_post="/email_signup.json";
                    force_xhr = true;
                    //https_post="/settings_account_signup_detail.json";
                }

                // use xhr when current page is on https, else use iframe proxy
                if(force_xhr==true || document.location.protocol=="https:") {
                    $.post(https_post, param, function(response) {
                        if (response.status_code != undefined && response.status_code == 1) {
                            onCompleteSignup('fancy');
                            if (is_brand_store) {
                                processNextUrl(next_url, '/create-brand');
                            } else {
                                var param = $.jStorage.get('fancy_add_to_cart', null);
                                if (param && param['thing_id']) {
                                    processNextUrl(next_url, '/things/' + param['thing_id']);
                                } else if (document.URL.indexOf('seller-signup') > 0) {
                                    processNextUrl(next_url, '/seller-signup');
                                } else if (activate_url) {
                                    processNextUrl(next_url, activate_url);
                                } else {
                                    processNextUrl(next_url, null, parseTransformUrl({ url: '/', appendingParams: {channel:'fancy', popup: 'onboarding'}}).url)
                                }
                            }
                        } else if (response.status_code != undefined && response.status_code == 0) {
                            var msg = response.message;
                            var error = response.error;
                            if (response.error != undefined && response.error.indexOf('email')>=0){
                                $form.find('.hidden-email').show();  

                                $email.addClass('error');
                                $email.parent().addClass('error');
                                if($email.parent().hasClass('hidden-email')) {
                                    alertify.alert(msg);
                                } else {
                                    var $error = $email.next();
                                    $error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+msg);
                                }
                            } else if (response.error != undefined && response.error.indexOf('username')>=0) {
                                $username.addClass('error');
                                $username.parent().addClass('error');
                                var $error = $username.next();
                                $error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+msg);
                            } else {
                                alertify.alert(msg);
                            }
                        }
                    }, 'json')
                    .fail(function(xhr) {
                        try {
                            err = JSON.parse(xhr.responseText);
                            err = err.message || err.error;
                            if(err) {
                                alertify.alert(err);
                                return;
                            }
                        } catch(e) {
                        }
                        if(xhr.status==403) {
                            alertify.alert("It looks like your browser is set to block cookies. Please enable cookies in your browser settings.");
                        } else if(xhr.status>=400) {
                            alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
                        }
                    })
                    .always(function() {
                        $this.disable(false).css({'cursor': ''});
                        $this.removeClass('loading');
                    });
                } else {
                    window.is_brand_store = is_brand_store;
                    window.displayError = function(selector,msg) {
                        if(selector.search('email')>=0) {
                            $email.addClass('error');
                            $email.parent().addClass('error');
                            if($email.parent().hasClass('hidden-email')) {
                                alertify.alert(msg);
                            } else {
                                var $error = $email.next();
                                $error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+msg);
                            }
                        } else if(selector.search('username')>=0) {
                            $username.addClass('error');
                            $username.parent().addClass('error');
                            var $error = $username.next();
                            $error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+msg);
                        } else {
                            alertify.alert(msg);
                        }
                    }
                    $("#signup_iframe").detach();
                    $("#signup_form").detach();
                    $("<iframe name='signup_iframe' id='signup_iframe' style='height:0;width:0'></iframe>").appendTo(document.body);
                    $("<form id='signup_form' action='http://"+document.location.hostname+http_post+"' method='post' target='signup_iframe'></form>").appendTo(document.body);
                    for(var k in param){
                        $('#signup_form').append("<input type='hidden' name='"+k+"' value='"+param[k]+"'>");
                    }
                    $('#signup_form').append("<input type='hidden' name='csrfmiddlewaretoken' value='"+$("input[name=csrfmiddlewaretoken]").val()+"'>");
                    $('#signup_form').submit();
                }
            }

            if (window.execute_recaptcha) {
                window.execute_recaptcha(function(success, token) {
                    if (success) {
                        if (window.clear_recaptcha) clear_recaptcha();
                        email_signup(token);
                    }
                    else {
                        error('Please complete RECAPTCHA to continue')
                    }
                });
            } else {
                email_signup();
            }

        } else {
            // other sns signup
            var url = "/social/signup_"+sns_type+".json";

            $.post(url, param, function(response) {
                if (response.status_code != undefined && response.status_code == 1) {
                    onCompleteSignup(sns_type);
                    if (is_brand_store) {
                        location.href = '/create-brand';
                    } else {
                        var param = $.jStorage.get('fancy_add_to_cart', null);
                        if (param && param['thing_id']) {
                            processNextUrl(next_url, '/things/' + param['thing_id']);
                        } else if (document.URL.indexOf('seller-signup') > 0) {
                            processNextUrl(next_url, '/seller-signup');
                        } else if (activate_url) {
                            processNextUrl(next_url, activate_url);
                        } else {
                            processNextUrl(next_url, null, parseTransformUrl({ url: '/', appendingParams: {channel:'sns_type', popup: 'onboarding'}}).url)
                        }
                    }
                } else if (response.status_code != undefined && response.status_code == 0) {
                    var msg = response.message;
                    var error = response.error;
                    if (response.error != undefined && response.error.indexOf('email')>=0){
                        $form.find('.hidden-email').show();  

                        $email.addClass('error');
                        $email.parent().addClass('error');
                        if($email.parent().hasClass('hidden-email')) {
                            alertify.alert(msg);
                        } else {
                            var $error = $email.next();
                            $error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+msg);
                        }
                    } else if (response.error != undefined && response.error.indexOf('username')>=0) {
                        $username.addClass('error');
                        $username.parent().addClass('error');
                        var $error = $username.next();
                        $error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+msg);
                    } else {
                        alertify.alert(msg);
                    }
                }
            }, 'json')
            .fail(function(xhr) {
                alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            })
            .always(function() {
                $this.disable(false).css({'cursor': ''});
                $this.removeClass('loading');
            });
        }
    });

    // Sign In
    dlg_signin.$obj
    .on('open', function(event, params) {
        if(params && params['signup-clicked']) {
            // in case user clicks signin/signup button him/herself
            $.cookie.set('signup-forced','false');
        } else {
            // in case user clicks some button which requires signin
            $.cookie.set('signup-forced','true');
        }

        var email = params && params.email || '';

        dlg_signin.$obj.find('input[name="username"]').val(email).focus();
        dlg_signin.$obj.find('input[name="user_password"]').val('');

        dlg_signin.$obj.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });
    })
    .on('click', 'a.signup', function(event) {
        event.preventDefault();
        if($.cookie.get('signup-forced')=='false') {
            dlg_signup.open({'signup-clicked':true});
        } else {
            dlg_signup.open();
        }
    });

    form_signin
    .on('keyup', 'input[name="username"],input[name="user_password"]', function(event) {
        if(event.which == 13){
            event.preventDefault();
            form_signin.find('.btn-signin').click();
        }
    })
    .on('keyup', 'input.error[name="username"]', check_email_signin_error)
    .on('keyup', 'input.error[name="user_password"]', check_password_error)
    .on('keyup', 'input.error[name="username"],input.error[name="user_password"]', function(event) {
        form_signin.find('input.error[name="username"],input.error[name="user_password"]').parent().removeClass('error');
    })
    .on('click', '.btn-signin', function(event) {
        event.preventDefault();
        var $this = $(this);
        var $username = form_signin.find('input[name="username"]');
        var $user_password = form_signin.find('input[name="user_password"]');
        var username = $.trim($username.val())||'';
        var password = $.trim($user_password.val())||'';

        form_signin.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });

        if(!check_email_signin.call($username)) {
            return;
        }
        if(!check_password.call($user_password, null, true)) {
            return;
        }

        $this.disable(true).css({'cursor': 'default'});
        $this.addClass('loading');

        function email_login(recaptcha_token) {
            // proceed signin
            var payload = {'username':username, 'password':password, 'callback':''};
            if (recaptcha_token) payload['recaptcha_token'] = recaptcha_token;
            if(dlg_signin.$obj.length>0) {
                // popup dialog based signin
                $.post('/login.json', payload, function(response){
                    if (response.status_code != undefined && response.status_code == 1) {
                        try {track_event('Complete Login', {'channel':'fancy',forced:$.cookie.get('signup-forced')=='true'});} catch(e){}
                        var next = form_signin.find('.next_url').val() || '';
                        if(next && $.cookie.get('signup-forced')=='true') {
                            processNextUrl(next);
                        } else if(response.is_seller==true && $.cookie.get('signup-forced')=='false') {
                            processNextUrl(next, "/merchant/dashboard")
                        } else {
                            processNextUrl(next, location.href)
                        }
                    } else if (response.status_code != undefined && response.status_code == 0) {
                        if (response.wrong!=undefined && response.wrong.indexOf('username')>=0){
                            $username.addClass('error');
                            $username.parent().addClass('error');
                            $user_password.addClass('error');
                            var $error = $username.next();
                            $error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+gettext('The login details are incorrect. You can click “Forgot your password?” below.'));
                        } else if (response.wrong != undefined && response.wrong.indexOf('password')>=0) {
                            $user_password.addClass('error');
                            $user_password.parent().addClass('error');
                            var $error = $user_password.next();
                            $error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+gettext('The login details are incorrect. You can click “Forgot your password?” below.'));
                        } else {
                            alertify.alert(response.message);
                        }
                    }
                }, 'json')
                .fail(function(xhr) {
                    try {
                        err = JSON.parse(xhr.responseText);
                        err = err.message || err.error;
                        if(err) {
                            alertify.alert(err);
                            return;
                        }
                    } catch(e) {
                    }
                    if(xhr.status==403) {
                        alertify.alert("It looks like your browser is set to block cookies. Please enable cookies in your browser settings.");
                    } else if(xhr.status>=400) {
                        alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
                    }
                })
                .always(function() {
                    $this.disable(false).css({'cursor': ''});
                    $this.removeClass('loading');
                })
            } else {
                // full page based signin
                $.post('/login.json', payload, function(response){
                    if (response.status_code != undefined && response.status_code == 1) {
                        try {track_event('Complete Login', {'channel':'fancy',forced:$.cookie.get('signup-forced')=='true'});} catch(e){}
                        var next = form_signin.find('.next_url').val();
                        if(next && next != "/") {
                            processNextUrl(next);
                        } else {
                            if(response.is_seller==true) {
                                processNextUrl(next, "/merchant/dashboard")
                            } else {
                                processNextUrl(next, "/")
                            }
                        }
                    } else if (response.status_code != undefined && response.status_code == 0) {
                        if (response.wrong!=undefined && response.wrong.indexOf('username')>=0){
                            $username.addClass('error');
                            $username.parent().addClass('error');
                            $user_password.addClass('error');
                            var $error = $username.next();
                            $error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+gettext('The login details are incorrect. You can click “Forgot your password?” below.'));
                        } else if (response.wrong != undefined && response.wrong.indexOf('password')>=0) {
                            $user_password.addClass('error');
                            $user_password.parent().addClass('error');
                            var $error = $user_password.next();
                            $error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+gettext('The password for this account is incorrect.'));
                        } else {
                            alertify.alert(response.message);
                        }
                    }
                }, 'json')
                .fail(function(xhr) {
                    try {
                        err = JSON.parse(xhr.responseText);
                        err = err.message || err.error;
                        if(err) {
                            alertify.alert(err);
                            return;
                        }
                    } catch(e) {
                    }
                    if(xhr.status==403) {
                        alertify.alert("It looks like your browser is set to block cookies. Please enable cookies in your browser settings.");
                    } else {
                        alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
                    }
                })
                .always(function() {
                    $this.disable(false).css({'cursor': ''});
                    $this.removeClass('loading');
                })
            }
        }
        if (window.execute_recaptcha) {
            window.execute_recaptcha(function(success, token) {
                if (success) {
                    if (window.clear_recaptcha) clear_recaptcha();
                    email_login(token);
                }
                else {
                    $this.disable(false).css({'cursor': ''});
                    $this.removeClass('loading');
                    alertify.alert('Please complete RECAPTCHA to continue')
                }
            });
        } else {
            email_login();
        }

    });

	dlg_signin.$obj.find('a.forgot_pw').click(function(event) {
        if(dlg_signin.$obj.length>0) {
            // popup dialog based signin
            event.preventDefault();
            var $username = form_signin.find('input[name="username"]');
            var username = $.trim($username.val())||'';
            dlg_forgot_pw.open({email:username});
        } else {
            // full page based signin
        }
    });

    dlg_forgot_pw.$obj
    .on('open', function(event, params) {
        var email = params && params.email || '';
        dlg_forgot_pw.$obj.find('input[name="email"]').val(email).focus();
        return false
    });

    form_forgot_password
    .on('keyup', 'input.error[name="email"]', check_email_error)
    .on('click', '.btn-back', function(event) {
        event.preventDefault();
        if(dlg_signin.$obj.length>0) {
            // overlay popup version
            var $username = form_forgot_password.find('input[name="email"]');
            var username = $.trim($username.val())||'';
            dlg_signin.open({email:username});
        } else {
            // whole page version
            location.href="/login"
        }
    })
    .on('click', '.btn-reset', function(event) {
        event.preventDefault();

        $this = $(this);
        $form = form_forgot_password;

        var $email = $form.find('input[name="email"]');
        var $pid = $form.find('input[name="pid"]');

        var email = $.trim($email.val())||'';
	    var pid = $.trim($pid.val())||'';

        form_forgot_password.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });

        if(!check_email.call($email, true)) {
            return;
        }

        var param = {
            'email'  : email,
	    'pid' : pid
        };

        $this.disable(true).css({'cursor': 'default'});

        // post forgot_password
        $.post("/reset_password.xml",param, function(xml){
            if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                $email.val('');
                var message = $(xml).find('message').text();
                if(dlg_signin.$obj.length>0) {
                    // overlay popup version
                    dlg_reset_pw_email_sent.open();
                } else {
                    // whole page version
                    $('#container-wrapper .content.forgot_pw').css({'display':'none'});
                    $('#container-wrapper .content.reset_pw_email_sent').show();
                }
            } else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                var msg = $(xml).find("message").text();
                $email.addClass('error');
                $email.parent().addClass('error');
                var error = $email.next();
                error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+msg);
            }  
        }, "xml")
        .fail(function(xhr) {
            alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
        })
        .always(function() {
            $this.disable(false).css({'cursor': ''});
        });
    });

    form_reset_password
    .on('keyup', '.new input.error[type="password"]', check_password_error)
    .on('focus', '.confirm input.error[type="password"]', function(event) {
        $(this).removeClass('error');
        $(this).next().removeClass('error');
        $(this).parent().removeClass('error');
    })
    .on('keyup', '.confirm input.error[type="password"]', function(event) {
        if(event.which!=13) {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        }
    })
    .on('click', '.btn-reset', function(event) {
        event.preventDefault();

        $this = $(this);
        $form = form_reset_password;

        form_reset_password.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });

        var $newpassword = $form.find('.new input[type="password"]');
        var $confirmpassword = $form.find('.confirm input[type="password"]');
        var $code = $form.find('input[name="code"]');
        var $pid = $form.find('input[name="pid"]');

        var newpassword = $newpassword.val()||'';
        var confirmpassword = $confirmpassword.val()||'';
        var code = $code.val()||'';
        var pid = $pid.val()||'';

        if(!check_password.call($newpassword, null, true)) {
            return;
        }
        if(newpassword != confirmpassword) {
            $confirmpassword.addClass('error');
            $confirmpassword.parent().addClass('error');
            var error = $confirmpassword.next();
            //error.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="icon" d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM9,8V4H7V9H9V8Zm0,2H7v2H9V10Z"/></svg>'+gettext('Please confirm your password.'));
            return;
        }

        var param = {
            'password': newpassword,
            'code': code,
	    'pid' : pid,
            'callback' : ''
        };

        $this.disable(true).css({'cursor': 'default'});

        // post forgot_password
        $.post("/reset_password/reset_request.json",param, function(response){
            if (response.status_code != undefined && response.status_code == 1) {
                alertify.alert('Your password has been changed.', function(closeEvent) {
                    location.href = '/login';
                });
            } else if (response.status_code != undefined && response.status_code == 0) {
                alertify.alert(response.message);
            }
        }, "json")
        .fail(function(xhr) {
            alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
        })
        .always(function() {
            $this.disable(false).css({'cursor': ''});
        });
    });

    form_reset_pw_email_sent
    .on('click', '.btn-ok', function(event) {
        event.preventDefault();
        if(dlg_signin.$obj.length>0) {
            // overlay popup version
            dlg_signin.open();
        } else {
            // whole page version
            location.href="/login"
        }
    });

    var g_recaptcha_widget = null;
    var onBeginSignup = function(from_popup) {
        if($('#signup-recaptcha').length>0) {
            $('.btn-signup').prop('disabled',true);
            g_recaptcha_widget = grecaptcha.render('signup-recaptcha', {
                'sitekey' : '6LfYcBwTAAAAAOH_zqWpB63-LuIbbj-INnVYQBU3',
                'callback': function() { $('.btn-signup').prop('disabled',false); },
                'expired-callback': function() { $('.btn-signup').prop('disabled',true); }
            });
        }

        if(from_popup && $('.captcha-image').length>0) {
            $.get('/signup/captcha.json', function(response) {
                if(response.image) {
                    $('.captcha-image').attr('src',"data:image/jpeg;base64,"+response.image);
                }
            });
        }
    }
    var onCompleteSignup = function(channel) {
        try {track_event('Complete Signup', {'channel':channel, 'via':'web'});} catch(e){}
    }

    // signup second phase (detail) dialog/form
    dlg_complete.$obj
    .on('open', function(){
        dlg_complete.$obj.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });
        var username = dlg_complete.$obj.find('input[name="username"]').change().val();
        dlg_complete.$obj.find('input[name="username"]').parent().find('.url b').text(username);
        dlg_complete.$obj.find('input[name="email"]').change();
        dlg_complete.$obj.find('input[name="password"]').change();
        dlg_complete.$obj.find('input[name="fullname"]').focus();

        dlg_signup_detail.$obj.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });
    })
    .on('close', function(){
    });

    form_complete
    .on('keyup', 'input.error[name="email"]', check_email_error)
    .on('keyup', 'input.error[name="user_password"]', check_password_error)
    .on('keyup', 'input.error[name="username"]', check_username_error)
    .on('keyup', 'input[name="username"]', check_username)
    .on('click', '.btn-signup', function(event) {
        event.preventDefault();

        var $this = $(this);
        if( $this.attr('disabled') ) return;

        var $form = form_complete;

        form_complete.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });

        var $username = $form.find('input[name="username"]');
        var $email = $form.find('input[name="email"]');
        var $user_password = $form.find('input[name="user_password"]');

        var username = $.trim($username.val())||'';
        var email = $.trim($email.val())||'';
        var password = $.trim($user_password.val())||'';
        var fullname = $.trim($form.find('input[name="fullname"]').val())||'';


        if(!check_username.call($username, null, true)) {
            return;
        }
        if($email.length>0) {
            if(!check_email.call($email, true)) {
                $form.find('.hidden-email').show();  
                return;
            }
        }
        if($user_password.length>0) {
            // do not enter password for social signup
            if(!check_password.call($user_password, null, true)) {
                return;
            }
        }

        var param = {
            'username'  : username,
            'fullname'  : fullname,
            'email'     : email,
            'password'  : password
        };

        if($('#check-twitter').length) {
            param['post_to_twitter'] = $('#check-twitter .post').hasClass('on');
        }
        if($('#check-facebook').length) {
            param['post_to_facebook'] = $('#check-facebook .post').hasClass('on');
        }

        $this.disable(true).css({'cursor': 'default'});
        var channel = $this.attr('data-snstype') || 'fancy';
        $.post('/settings_account_signup_detail.json', param, function(response) {
                if (response.status_code != undefined && (response.status_code == 1 || response.status_code == 2)) {
                    onCompleteSignup('fancy');
                    location.href = '/?channel='+channel+'&popup=onboarding';
                } else if (response.status_code != undefined && response.status_code == 0) {
                    var msg = response.message;
                    alertify.alert(msg);
                }
        }, 'json')
        .fail(function(xhr) {
            alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
        })
        .always(function() {
            $this.disable(false).css({'cursor': ''});
        });
    });

    $('.reload-captcha').click(function(event) {
        event.preventDefault();
        $.get('/signup/captcha.json', function(response) {
            if(response.image) {
                $('.captcha-image').attr('src',"data:image/jpeg;base64,"+response.image);
            }
        });
    });

    $('.sign .sns button').on('focus',function(event){
        if($(this).closest('div').hasClass('default')){
            $(this).closest('.sns').removeClass('more');
            $(this).closest('.sns').scrollLeft(0);
        }else{
            $(this).closest('.sns').addClass('more');
        }
    });
});

