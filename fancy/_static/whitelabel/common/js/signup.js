var ALERT = window.alertify ? window.alertify.alert : window.alert;

function openLogin(){
    $("#popup_container")
        .css('background-image','url("'+window.signupBackgroundImage+'")');
    $.dialog('sign').open();
    $("#popup_container")
        .addClass('login').find('.signup').attr('class','signup login').end().end()
    try { dataLayer.push({'event': 'Login_Begin' });} catch(e){}
}

function openSignup(email){
    $("#popup_container")
        .css('background-image','url("'+window.signupBackgroundImage+'")');

    if(email && emailRegEx.test($.trim(email))) {
        $('#signup-form input[name="email"]').val(email);
    } else {
        $('#signup-form input[name="email"]').val('');
    }
    $.dialog('sign').open();
    $("#popup_container")
        .addClass('signup').find('.signup').attr('class','signup').end().end()
    try { dataLayer.push({'event': 'Signup_Begin' });} catch(e){}
}

jQuery(function($) {
    var TEST = false;

    var params = location.search.substr(1).split("&");
    for(var i=0; i<params.length; i++) {
        if(params[i]=="TEST") {
            TEST = true;
        }
    }

    var dlg_signup = $.dialog('sign');
    var dlg_forgot_pw = $.dialog('reset_pw');

    var dialogs = {
        'sign': dlg_signup,
        'reset_pw': dlg_forgot_pw
    }

    /*
    var dlg_reset_pw_email_sent = $.dialog('popup.sign.reset_pw_email_sent');
    var dlg_complete = $.dialog('popup.sign.complete');
    */
    var form_signup = $('.signup .frm .default');
    var form_signup_detail = $('.signup .frm .email');
    var form_sns_signup_detail = $('.signup .frm .sns');
    var form_signin = $('.signup .frm .signin');
    var form_forgot_password = $('.popup.reset_pw .default');

    var form_reset_password = $('.popup.change_pw fieldset');
    //var form_reset_pw_email_sent = $('.sign.reset_pw_email_sent .frm');
    //var form_complete = $('.sign.complete .frm');

    var form_seller_signup = $('.signup .frm .seller');

    window.signup = {
        dlg_signup: dlg_signup,
        form_signup: form_signup,
        form_signup_detail: form_signup_detail,
        form_sns_signup_detail: form_sns_signup_detail,
        is_narrow_screen: function() {
            try {
                return window.matchMedia('(max-width: 800px)').matches
            } catch(e) {
            }
            return false
        },
        check_email_error : function() {
            var field = this;

            // see common/util.js to change emailRegEx
            if(emailRegEx.test($.trim($(this).val()))) {
                $(field).removeClass('error');
                $(field).parent().removeClass('error');
                return true;
            }
            return false;
        },
        check_password_error : function() {
            var field = this
            var password = $(field).val()
            if(password.match(/^(?=.*[^a-zA-Z])(?=.*[a-zA-Z]).{6,}$/)) {
                $(field).removeClass('error');
                $(field).parent().removeClass('error');
                return true;
            }
            return false;
        },
        check_storename_error : function() {
            var field = this;
            var storename = $(field).val();
            if(storename.length>=3 && storename.length<=30 && storename.match('^[a-zA-Z0-9_ ]+$')) {
                $(field).removeClass('error');
                $(field).parent().removeClass('error');
                return true;
            }
            return false;
        },
        check_username_error : function() {
            var field = this;
            var username = $(field).val();
            if(username.length>=3 && username.length<=30 && username.match('^[a-zA-Z0-9_]+$')) {
                $(field).removeClass('error');
                $(field).parent().removeClass('error');
                $(field).parent().parent().find('.username_suggest').removeClass('error');
                return true;
            }
            return false;
        },
        check_name_error : function() {
            var field = this;
            var name = $.trim($(field).val())||'';
            if(name.length>=1 && name.length<=30) {
                $(field).removeClass('error');
                $(field).parent().removeClass('error');
                return true;
            }
            return false;
        },

        check_email_signin_error : function(e) {
            var field = this;
            var usernameRegEx = /^[a-zA-Z0-9_]+$/;
            var value = $(field).val();

            // see common/util.js to change emailRegEx
            if(emailRegEx.test($.trim(value)) || usernameRegEx.test($.trim(value))) {
                $(field).removeClass('error');
                $(field).parent().removeClass('error');
                return true;
            }
            return false;
        },

        show_error : function($field,msg) {
            if(this.is_narrow_screen()) {
                ALERT(msg)
            } else {
                $field.addClass('error');
                $field.parent().addClass('error');
                if($field.next().hasClass('error-msg')) {
                    $field.next().html('<span class="icon"></span>'+msg);
                } else {
                    ALERT(msg)
                }
                $field.focus();
            }
        },

        check_email_signin : function() {
            var field = this;
            var usernameRegEx = /^[a-zA-Z0-9_]+$/;
            var value = $(field).val();

            if(value.length<1) {
                var error_msg = gettext('Please enter your email address.')
                if($(field).parent().hasClass('hidden-email')) {
                    ALERT(error_msg);
                } else {
                    signup.show_error($(field), error_msg)
                }
                return false;
            } else if(!(emailRegEx.test($.trim(value)) || usernameRegEx.test($.trim(value)))) { // see common/util.js to change emailRegEx
                signup.show_error($(field), gettext('Please use alphanumeric characters for your username.'))
                return false;
            }
            return true;
        },

        check_email : function(e) {
            var field = this;
            if($(field).val().length<1) {
                var error_msg = gettext('Please enter your email address.')
                if($(field).parent().hasClass('hidden-email')) {
                    ALERT(error_msg);
                } else {
                    signup.show_error($(field), error_msg)
                }
                return false;
            } else if(!emailRegEx.test($.trim($(this).val()))) { // see common/util.js to change emailRegEx
                signup.show_error($(field), gettext('A valid email address is required.'))
                return false;
            }
            return true;
        },

        check_password : function(e, check_all) {
            var field = this
            password = $(field).val()
            if(!password.match(/^(?=.*[^a-zA-Z])(?=.*[a-zA-Z]).{6,}$/)) {
                signup.show_error($(field), gettext('Your password must contain at least six letters, and include a number or symbol.'))
                return false;
            }
            return true;
        },

        check_storename : function(e, check_all) {
            if(e && e.type=="keyup" && e.which==13) {
                return false;
            }

            $(this).parent().find('.url b').text($(this).val());

            var field = this;

            if($(this).val().length>0 && !$(this).val().match('^[a-zA-Z0-9_ ]+$')) {
                signup.show_error($(field), gettext('Please use alphanumeric characters for your username.'))
                return false;
            }

            var storename_transformed = $(this).val().replace(/ /g,'')

            if(check_all && storename_transformed.length<3) {
                var error_msg = ($(this).val().length<1) ? gettext('Store name is required.') : gettext('Store name is too short.')
                signup.show_error($(field), error_msg)
                return false;
            }
            if(storename_transformed.length>30) {
                signup.show_error($(field), gettext('Store name is too long.'))
                return false;
            }

            return true;
        },

        check_username_request : null,
        check_username : function(e, check_all) {
            if(e && e.type=="keyup" && e.which==13) {
                return false;
            }

            if(signup.check_username_request) {
                signup.check_username_request.abort();
                signup.check_username_request = null;
            }
            $(this).parent().find('.url b').text($(this).val());

            var field = this;

            if($(this).val().length>0 && !$(this).val().match('^[a-zA-Z0-9_]+$')) {
                signup.show_error($(field), gettext('Please use alphanumeric characters for your username.'))
                return false;
            }

            if(check_all && $(this).val().length<3) {
                var error_msg = ($(this).val().length<1) ? gettext('Username is required.') : gettext('Username is too short.')
                signup.show_error($(field), error_msg)
                return false;
            }
            if($(this).val().length>30) {
                signup.show_error($(field), gettext('Username is too long.'))
                return false;
            }

            return true;
        },

        check_name : function(check_all) {
            var field = this;
            var name = $.trim($(field).val())||'';

            if(check_all && name.length<1) {
                signup.show_error($(field), gettext('Name is required'))
                return false;
            }
            if($(this).val().length>30) {
                signup.show_error($(field), gettext('Name is too long.'))
                return false;
            }

            return true;
        }
    }


    $('.signup-required').click(function(event) {
        event.preventDefault();
        $('#popup_container').addClass('animation')
        $('.popup.sign .signup').removeClass('login').removeClass('email sns').removeClass('seller')
        setTimeout(function(){$('#popup_container').removeClass('animation');},450)
        dlg_signup.open();
        form_signup.trigger('open')
    });

    $('.login-required').click(function(event) {
        // open signup dialog instead of login dialog. requested by NYC
        event.preventDefault();
        $('#popup_container').addClass('animation')
        $('.popup.sign .signup').removeClass('login').removeClass('email sns').removeClass('seller')
        setTimeout(function(){$('#popup_container').removeClass('animation');},450)
        dlg_signup.open();
        form_signup.trigger('open')
        /*
        event.preventDefault();
        $('#popup_container').addClass('animation')
        $('.popup.sign .signup').addClass('login').removeClass('email sns').removeClass('seller')
        $('.popup.sign .slideshow').trigger('reset')
        $('.popup.sign .slideshow .pagination a:first').trigger('click')
        setTimeout(function(){$('#popup_container').removeClass('animation');},450)
        dlg_signup.open()
        form_signin.trigger('open')*/
    });

    $('.seller-required').click(function(event) {
        event.preventDefault();
        $('#popup_container').addClass('animation')
        $('.popup.sign .signup').addClass('seller').removeClass('login').removeClass('email sns')
        setTimeout(function(){$('#popup_container').removeClass('animation');},200)
        dlg_signup.open();
        form_seller_signup.trigger('open')
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
            next = decodeURIComponent(next); // FIXME: next_url should come unencoded
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
                nextUrl = decodeURIComponent(forceTo);
            } else if (redirectTo) {
                redirectTo = decodeURIComponent(redirectTo);
                if (nextUrl) {
                    trailing = (redirectTo.indexOf('?') === -1 ? '?' : '&') + 'next=' + encodeURIComponent(nextUrl);
                }
                nextUrl = redirectTo + trailing;
            }

            // list of actions before redirect.
            if (queries.action === 'fancy_thing') {
                $.ajax({
                    type: 'PUT',
                    url: '/rest-api/v1/things/${queries.action_param}',
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

    function gotoSignupSns(sns) {
        $('.popup.sign')
            .find('.signup').removeClass('login email').addClass('sns').addClass('show')
                .find("> .sign-form > div.sns").hide().end()
                .find("#signup-form-"+sns).show().end()
				.find('h3').find('span').hide().end().find('span.'+sns).show().end();
        setTimeout(function(){
            $('.popup.sign .signup').removeClass('show')
            $('.popup.sign .signup').find('input:text:visible:first').focus()
        },220)
    }
    function gotoSignupEmail() {
        $('.popup.sign').find('.signup').removeClass('login sns').addClass('email').addClass('show')
        setTimeout(function(){
            $('.popup.sign .signup').removeClass('show')
            $('.popup.sign .signup').find('input[name="firstname"]').focus()
        },220)
    }
    function gobackSignup() {
        $('.popup.sign').find('.signup').removeClass('login sns email').addClass('hide')
        setTimeout(function(){
            $('.signup').removeClass('hide');
        },220)
    }
    function gotoLogin() {
        $('.popup.sign').find('.signup').addClass('login').removeClass('sns email')
        form_signin.trigger('open')
    }
    function gotoSignup() {
        $('.popup.sign').find('.signup').removeClass('login sns email')
        form_signup.trigger('open')
    }

    // signup first phase dialog/form
    dlg_signup.$obj
    .on('click', '#btn-go-back-signup', function(event) {
        gobackSignup()
        
        return false
    }).on('click', '#btn-goto-signup', function(event) {
        gotoSignup()
        return false
    }).on('click', '#btn-goto-signin', function(event) {
        gotoLogin()
        return false
    })
    .on('click', '.popup-close', function(event) {
        $('#popup_container').removeData('modal');
        dlg_signup.close()
    })

    dlg_signup.before_close = function(after_close) {
        $('#popup_container').addClass('closing_animation');
        $('#popup_container').css('background-image', 'none') 
        setTimeout(function(){if(after_close) {after_close()} $('#popup_container').removeClass('closing_animation')},300)

        if(window.pre_opened_dialog_name=='sign') {
            if(window.history && window.history.pushState) {
                document.title = window.default_title
                window.history.pushState({url:"/"}, window.default_title, "/")
            } else {
                location.href = "/"
            }
            window.pre_opened_dialog_name = null
        }
    }
    dlg_forgot_pw.before_close = function(after_close) {
        $('#popup_container').addClass('closing_animation');
        $('#popup_container').css('background-image', 'none') 
        setTimeout(function(){if(after_close) {after_close()} $('#popup_container').removeClass('closing_animation')},300)

        if(window.pre_opened_dialog_name=='reset_pw') {
            if(window.history && window.history.pushState) {
                document.title = window.default_title
                window.history.pushState({url:"/"}, window.default_title, "/")
            } else {
                location.href = "/"
            }
            window.pre_opened_dialog_name = null
        }
    }

    var backgroundArray = []
    if (dlg_signup.$obj.data('signup-bg')) {
        backgroundArray = dlg_signup.$obj.data('signup-bg').split(',')
    }

    // handle pre-opened dialogs
    if ( window.pre_opened_dialog_name ) {
        if(pre_opened_dialog_name in dialogs) {
            dialogs[pre_opened_dialog_name].open()
        }
    }

    form_signup
    .on('open', function(event) {
        event.preventDefault()
        form_signup.find('input[name="email"]').focus().val('')

        form_signup.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        })
        try {track_event('Signup Popup', {'channel': 'gear'});} catch(e) {}
        try { dataLayer.push({'event': 'Signup_Begin' });} catch(e){}
    }).on('keyup', 'input[name="email"]', function(event) {
        if(event.which == 13){
            event.preventDefault();
            form_signup.find('.btn-signup').click();
        }
    })
    .on('keyup', 'input.error[name="email"]', signup.check_email_error)
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
            if(!signup.check_email.call($email, true)) {
                return;
            }
        }

        var that = this;
        if(!TEST) {
            $(that).prop('disabled',true);
        }

        var params = {'email':email};
        //if(referrer) params['referrer'] = referrer;
        //if(invitation_key) params['invitation_key'] = invitation_key;
        $.get('/check-field/email', params, function(response) {
            if (response.status_code != undefined && response.status_code == 1) {
                form_signup.username = response.username;
                form_signup.email = response.email;

                dlg_signup.$obj.addClass('email').addClass('show');
                setTimeout(function(){$('.popup').removeClass('show');},220);

                onBeginSignup(true);
                try { track_event('Begin Signup', { 'channel': 'gear' }); } catch (e) {}
                
            } else if (response.status_code != undefined && response.status_code == 0) {
                var msg = response.message;
                var error = response.error;
                signup.show_error($email, msg)
                return;
            }
        }, 'json')
        .fail(function(xhr) {
            ALERT("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
        })
        .always(function() {
            $(that).prop('disabled',false);
        });
    })


    // signup second phase (detail) dialog/form
    form_signup_detail
    .on('open', function(event) {
        event.preventDefault()
        form_signup_detail.find('input[name="username"]').val(form_signup.username)
        form_signup_detail.find('input[name="email"]').val(form_signup.email)
        gotoSignupEmail()
        return false
    })
    .on('keyup', 'input.error[name="email"]', signup.check_email_error)
    .on('keyup', 'input.error[name="user_password"]', signup.check_password_error)
    .on('keyup', 'input.error[name="firstname"]', signup.check_name_error)
    .on('keyup', 'input.error[name="lastname"]', signup.check_name_error)
    .on('keyup', 'input:text, input:password', function(event) {
        if($(this).val() && event.which == 13){
            event.preventDefault();
            var $next = $(this).closest('p').next('p').find("input:text:visible, input:password:visible");
            if($next.length) $next.focus();
            else $(this).closest('fieldset').find('.btn-signup').click();
        }
    })
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

        var $firstname = $form.find('input[name="firstname"]');
        var $lastname = $form.find('input[name="lastname"]');
        var $email = $form.find('input[name="email"]');
        var $user_password = $form.find('input[name="user_password"]');

        var firstname = $.trim($firstname.val())||'';
        var lastname = $.trim($lastname.val())||'';
        var email = $.trim($email.val())||'';
        var password = $.trim($user_password.val())||'';
        var referrer = $.trim($form.find('input[name="referrer"]').val())||'';
        var invitation_key = $.trim($form.find('input[name="invitation_key"]').val())||'';
        var user_id = $.trim($form.find('input[name="user_id"]').val())||'';
        var is_brand_store = $('#brandSt').is(':checked');

        var sns_type = 'email';

        if(!signup.check_name.call($firstname, true)) {
            return;
        }
        if(!signup.check_name.call($lastname, true)) {
            return;
        }
        if($email.length>0) {
            if(!signup.check_email.call($email, true)) {
                $form.find('.hidden-email').show();  
                return;
            }
        }
        if($user_password.length>0) {
            // do not enter password for social signup
            if(!signup.check_password.call($user_password, null, true)) {
                return;
            }
        }

        var param = {
            'fullname'  : firstname+' '+lastname,
            'firstname'  : firstname,
            'lastname'  : lastname
        };
        if(invitation_key.length>0) param['invitation_key'] = invitation_key;
        if(referrer.length>0) param['referrer'] = referrer;
        if(user_id.length>0) param['user_id'] = user_id;
        if(email.length>0) param['email'] = email;

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

        $this.prop('disabled',true).css({'cursor': 'default'});

        // email signup
        https_post="/email_signup.json";

        // use xhr when current page is on https, else use iframe proxy
        $.post(https_post, param, function(response) {
            if (response.status_code != undefined && response.status_code == 1) {
                signup.onCompleteSignup('gear');
                var param = $.jStorage.get('fancy_add_to_cart', null);
                if (param && param['thing_id']) {
                    processNextUrl(next_url, '/things/' + param['thing_id']);
                } else if (document.URL.indexOf('seller-signup') > 0) {
                    processNextUrl(next_url, '/seller-signup');
                } else if (activate_url) {
                    processNextUrl(next_url, activate_url);
                } else {
                    processNextUrl(next_url, next_url||location.href)
                    //processNextUrl(next_url, null, parseTransformUrl({ url: '/', appendingParams: {channel:'gear', popup: 'onboarding'}}).url)
                }
            } else if (response.status_code != undefined && response.status_code == 0) {
                var msg = response.message;
                var error = response.error;
                if (response.error != undefined && response.error.indexOf('email')>=0){
                    $form.find('.hidden-email').show();  

                    if($email.parent().hasClass('hidden-email')) {
                        ALERT(msg);
                    } else {
                        signup.show_error($email, msg)
                    }
                } else {
                    ALERT(msg);
                }
            }
        }, 'json')
        .fail(function(xhr) {
            try {
                err = JSON.parse(xhr.responseText);
                err = err.message || err.error;
                if(err) {
                    ALERT(err);
                    return;
                }
            } catch(e) {
            }
            if(xhr.status==403) {
                ALERT("It looks like your browser is set to block cookies. Please check your browser settings and enable cookies.");
            } else if(xhr.status>=400) {
                ALERT("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            }
        })
        .always(function() {
            $this.prop('disabled',false).css({'cursor': ''});
        });
    })
    ;


    form_sns_signup_detail
    .on('open', function(event, sns) {
        event.preventDefault();
        gotoSignupSns(sns);
        return false
    })
    .on('keyup', 'input.error[name="email"]', signup.check_email_error)
    .on('keyup', 'input.error[name="user_password"]', signup.check_password_error)
    .on('keyup', 'input.error[name="firstname"]', signup.check_name_error)
    .on('keyup', 'input.error[name="lastname"]', signup.check_name_error)
    .on('keyup', 'input:text, input:password', function(event) {
        if($(this).val() && event.which == 13){
            event.preventDefault();
            var $next = $(this).closest('p').next('p').find("input:text:visible, input:password:visible");
            if($next.length) $next.focus();
            else $(this).closest('fieldset').find('.btn-signup').click();
        }
    })
    .on('click', '.btn-signup', function(event) {
        event.preventDefault();

        var $this = $(this);
        if( $this.attr('disabled') ) return;

        var $form = $this.closest('.sns');

        $form.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });

        var activate_url = $('.container').is('.activate_mode') ? '/activate-login?success=true' : '';
        var next_url = $form.find('input.next_url').val() || '';

        var $firstname = $form.find('input[name="firstname"]');
        var $lastname = $form.find('input[name="lastname"]');
        var $email = $form.find('input[name="email"]');
        var $user_password = $form.find('input[name="user_password"]');

        var firstname = $.trim($firstname.val())||'';
        var lastname = $.trim($lastname.val())||'';
        var email = $.trim($email.val())||'';
        var password = $.trim($user_password.val())||'';
        var referrer = $.trim($form.find('input[name="referrer"]').val())||'';
        var invitation_key = $.trim($form.find('input[name="invitation_key"]').val())||'';
        var user_id = $.trim($form.find('input[name="user_id"]').val())||'';
        var is_brand_store = $('#brandSt').is(':checked');

        var sns_type = $form.attr('sns-service');
        
        if(!signup.check_name.call($firstname, true)) {
            return;
        }
        if(!signup.check_name.call($lastname, true)) {
            return;
        }
        if(!signup.check_email.call($email, true)) {
            return;
        }
        
        var param = {
            'fullname'  : firstname+' '+lastname,
            'firstname'  : firstname,
            'lastname'  : lastname
        };
        if(invitation_key.length>0) param['invitation_key'] = invitation_key;
        if(referrer.length>0) param['referrer'] = referrer;
        if(user_id.length>0) param['user_id'] = user_id;
        if(email.length>0) param['email'] = email;

        if($('#signup-recaptcha').length>0) {
            try {
                var g_recaptcha_response = grecaptcha.getResponse(g_recaptcha_widget)
                param['grecaptcha'] = g_recaptcha_response;
            } catch(e) {
                console.log('failed to get g-recaptcha response',e);
            }
        }
        if($('#captcha-answer').length>0) param['captcha_answer'] = $('#captcha-answer').val();

        $this.prop('disabled',true).css({'cursor': 'default'});

        // proceed registration
        if(sns_type==='facebook') {
            // facebook signup
            //var post_to_facebook = $('#fb-wall').is(':checked');
            var post_to_facebook = $('#fb-wall').prop('checked');
            var fb_request_id = $this.attr('fbrid');

            param['post_to_facebook']=post_to_facebook;
            if(fb_request_id != undefined) { param['fb_request_id']=fb_request_id; }
            if (location.args['next']) param['next'] = location.args['next'];

            $this.attr('disabled', true).css({'cursor': 'default'});
            $.post("/facebook_signup.json",param, function(json) {
                if (json.status_code === 1) {
                    // success
                    signup.onCompleteSignup('gear_facebook');

                    if (document.URL.indexOf('/seller-signup') > -1) {
                        processNextUrl(next_url, "/seller-signup");
                    } else if (activate_url) {
                        processNextUrl(next_url, activate_url);
                    } else {
                        processNextUrl(next_url, next_url||location.href)
                        //processNextUrl(next_url, null, parseTransformUrl({ url: '/', appendingParams: {channel:'gear_facebook'}}).url)
                    }
                } else if (json.status_code === 0) {
                    // failed create account with facebook id
                    var err = json.error||'';
                    var msg = json.message;
                    if(err.indexOf('email')>=0) {
                        if(err == "email_duplicate"){
                            var email = json.email;
                            $email.val(email);
                        }
                        var msg = json.message;
                        $email.val(email);
                        $form.find('.hidden-email').show();  

                        signup.show_error($email, msg)
                    } else if(err.indexOf('firstname')>=0) {
                        signup.show_error($firstname, msg)
                    } else if(err.indexOf('lastname')>=0) {
                        signup.show_error($lastname, msg)
                    } else {
                        var msg = json.message;
                        ALERT(msg);
                    }
                }
            }, "json")
            .fail(function(xhr) {
                ALERT("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            })
            .always(function() {
                $this.prop('disabled',false).css('cursor','');
            });
        } else if(sns_type=='twitter') {
            // twitter signup
            var follow_fancy = false;
            var post_to_twitter = false;
            param['follow_fancy']=follow_fancy;
            param['post_to_twitter']=post_to_twitter;
            if (location.args['next']) param['next'] = location.args['next'];

            $this.prop('disabled',true).css({'cursor':'default'});
            $.post("/twitter_signup.json",param, function(json){
                if (json.status_code == 1) {
                    // success
                    signup.onCompleteSignup('gear_twitter');
                    
                    if (document.URL.indexOf('/seller-signup') > -1) {
                        processNextUrl(next_url, '/seller-signup');
                    } else if (activate_url) {
                        processNextUrl(next_url, activate_url);
                    } else {
                        processNextUrl(next_url, next_url||location.href)
                        //processNextUrl(next_url, null, parseTransformUrl({ url: '/', appendingParams: {channel:'gear_twitter'}}).url);
                    }
                } else if (json.status_code === 0) {
                    var err = json.error||'';
                    var msg = json.message;
                    if (err.indexOf('email')>=0){
                        signup.show_error($email,msg)
                    } else if(err.indexOf('firstname')>=0) {
                        signup.show_error($firstname,msg)
                    } else if(err.indexOf('lastname')>=0) {
                        signup.show_error($lastname,msg)
                    } else {
                        ALERT(msg);
                    }
                }
            }, "json")
            .fail(function(xhr) {
                ALERT("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            })
            .always(function() {
                $this.prop('disabled',false).css('cursor','');
            });
        } 
    })

    form_seller_signup
    .on('open', function(event) {
        event.preventDefault()
        form_seller_signup.find('input[name="storename"]').focus()
        return false
    })
    .on('keyup', 'input[name="email"]', function(event) {
        if(event.which == 13){
            event.preventDefault();
            form_seller_signup.find('.btn-signup').click();
        }
    })
    .on('keyup', 'input.error[name="storename"]', signup.check_storename_error)
    .on('keyup', 'input.error[name="password"]', signup.check_password_error)
    .on('keyup', 'input.error[name="email"]', signup.check_email_error)
    .on('click', '.btn-signup', function(event) {
        event.preventDefault()
        if( $(this).attr('disabled') ) return
        
        form_signup.find('input.error').each(function() {
            $(this).removeClass('error')
            $(this).next().removeClass('error')
            $(this).parent().removeClass('error')
        });

        var $storename = $(this).parent().find('input[name="storename"]')
        var $firstname = $(this).parent().find('input[name="firstname"]')
        var $lastname = $(this).parent().find('input[name="lastname"]')
        var $email = $(this).parent().find('input[name="email"]')
        var $referrer = $(this).parent().find('input[name="referrer"]')
        var $invitation_key = $(this).parent().find('input[name="invitation_key"]')
        var $user_id = $(this).parent().find('input[name="user_id"]')
        var $password = $(this).parent().find('input[name="password"]')

        if(!signup.check_storename.call($storename, null, true)) {
            return;
        }

        if($firstname.val().length==0 || $lastname.val().length==0) {
            ALERT(gettext("Please enter your full name"));
            return;
        }

        if($password.length>0) {
            // do not enter password for social signup
            if(!signup.check_password.call($password, null, true)) {
                return;
            }
        }

        var email = $.trim($email.val())||''
        var referrer = $.trim($referrer.val())||null
        var invitation_key = $.trim($invitation_key.val())||null
        var user_id = $.trim($user_id.val())||null
        var password = $password.val() || null

        var that = this;
        if(!TEST) {
            $(that).prop('disabled',true);
        }

        var $form = $('#merchant-signup form')

        if($email.length>0) {
            var params = {'email':email};
            //if(referrer) params['referrer'] = referrer;
            //if(invitation_key) params['invitation_key'] = invitation_key;
            $.get('/check-field/email', params, function(response) {
                if (response.status_code != undefined && response.status_code == 1) {
                    form_signup.username = response.username;
                    form_signup.email = response.email;

                    //onBeginSignup(true);
                    try { track_event('Begin Signup', { 'channel': 'gear/merchant' }); } catch (e) {}

                    $form.submit()
                } else if (response.status_code != undefined && response.status_code == 0) {
                    var msg = response.message;
                    var error = response.error;
                    signup.show_error($email,msg)
                    return;
                }
            }, 'json')
            .fail(function(xhr) {
                ALERT("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            })
            .always(function() {
                $(that).prop('disabled',false);
            });
        } else {
            $form.submit()
        }
    })

    form_signin
    .on('open', function(event) {
        event.preventDefault()
        form_signin.find('input[name="username"]').focus().val('')
        try { dataLayer.push({'event': 'Login_Begin' });} catch(e){}
        return false
    }).on('keyup', 'input[name="username"],input[name="user_password"]', function(event) {
        if(event.which == 13){
            event.preventDefault();
            form_signin.find('.btn-signin').click();
        }
    })
    .on('keyup', 'input.error[name="username"]', signup.check_email_signin_error)
    .on('keyup', 'input.error[name="user_password"]', signup.check_password_error)
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

        if(!signup.check_email_signin.call($username)) {
            return;
        }
        if(!signup.check_password.call($user_password, null, true)) {
            return;
        }

        $this.prop('disabled',true).css({'cursor': 'default'});

        // proceed signin
        $.post('/login.json', {'username':username, 'password':password, 'callback':''}, function(response){
            if (response.status_code != undefined && response.status_code == 1) {
                try {track_event('Complete Login', {'channel':'gear'});} catch(e){}
                try { dataLayer.push({'event': 'Login_Complete' });} catch(e){}
                var next = form_signin.find('.next_url').val() || '';
                if(next) {
                    processNextUrl(next);
                } else if(response.is_seller==true) {
                    processNextUrl(next, "/merchant/dashboard")
                } else {
                    processNextUrl(next, location.href)
                }
            } else if (response.status_code != undefined && response.status_code == 0) {
                if (response.wrong!=undefined && response.wrong.indexOf('username')>=0){
                    signup.show_error($username,gettext('The login details you provided are incorrect. Please try again.'))
                } else if (response.wrong != undefined && response.wrong.indexOf('password')>=0) {
                    signup.show_error($user_password,gettext('The password for this account is incorrect.'))
                } else {
                    ALERT(response.message);
                }
            }
        }, 'json')
        .fail(function(xhr) {
            try {
                err = JSON.parse(xhr.responseText);
                err = err.message || err.error;
                if(err) {
                    ALERT(err);
                    return;
                }
            } catch(e) {
            }
            if(xhr.status==403) {
                ALERT("It looks like your browser is set to block cookies. Please check your browser settings and enable cookies.");
            } else if(xhr.status>=400) {
                ALERT("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            }
        })
        .always(function() {
            $this.prop('disabled',false).css({'cursor': ''});
        })
    })
    .on('click', 'a.find-pw', function(event) {
        // popup dialog based signin
        event.preventDefault();
        dlg_forgot_pw.open();
    })

    dlg_forgot_pw.$obj
    .on('open', function(event, params) {
        dlg_forgot_pw.$obj.find('input[name="email"]').val('').focus();
        dlg_forgot_pw.$obj.removeClass('sent')
        $("#popup_container").css('background-image','url("'+window.signupBackgroundImage+'")').css('background-size','cover');
    });

    form_forgot_password
    .on('keyup', 'input.error[name="email"]', signup.check_email_error)
    .on('click', '.btn-reset', function(event) {
        event.preventDefault();

        $this = $(this);
        $form = form_forgot_password;

        var $email = $form.find('input[name="email"]');
        var $pid = $form.find('input[name="pid"]');

        var email = $.trim($email.val())||'';
        var pid = $.trim($pid.val())||'';

        if(!signup.check_email.call($email, true)) {
            return;
        }

        var param = {
            'email'  : email,
            'pid'    : pid
        };

        $this.prop('disabled',true).css({'cursor': 'default'});

        // post forgot_password
        $.post("/reset_password.xml",param, function(xml){
            if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                $email.val('')
                var message = $(xml).find('message').text()
                // overlay popup version
                dlg_forgot_pw.$obj.addClass('sent')
            } else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                var msg = $(xml).find("message").text()
                ALERT(msg)
            }  
        }, "xml")
        .fail(function(xhr) {
            ALERT("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText)
        })
        .always(function() {
            $this.prop('disabled',false).css({'cursor': ''})
        })
    })

    form_reset_password
    .on('keyup', '.new input.error[type="password"]', signup.check_password_error)
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

        if(!signup.check_password.call($newpassword, null, true)) {
            return;
        }
        if(newpassword != confirmpassword) {
            if(signup.is_narrow_screen()) {
                ALERT(gettext("Please confirm your password."))
            } else {
                $confirmpassword.addClass('error');
                $confirmpassword.parent().addClass('error');
            }
            return;
        }

        var param = {
            'password': newpassword,
            'code': code,
	    'pid' : pid,
            'callback' : ''
        };

        $this.prop('disabled',true).css({'cursor': 'default'});

        // post forgot_password
        $.post("/reset_password/reset_request.json",param, function(response){
            if (response.status_code != undefined && response.status_code == 1) {
                ALERT('Your password has been changed.', function(closeEvent) {
                    location.href = '/login';
                });
            } else if (response.status_code != undefined && response.status_code == 0) {
                ALERT(response.message);
            }
        }, "json")
        .fail(function(xhr) {
            ALERT("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
        })
        .always(function() {
            $this.prop('disabled',false).css({'cursor': ''});
        });
    })

    var g_recaptcha_widget = null;
    var onBeginSignup = function() {
        if($('#signup-recaptcha').length>0) {
            form_signup.find('.btn-signup').prop('disabled',true);
            g_recaptcha_widget = grecaptcha.render('signup-recaptcha', {
                'sitekey' : '6LfYcBwTAAAAAOH_zqWpB63-LuIbbj-INnVYQBU3',
                'callback': function() { $('.btn-signup').prop('disabled',false); },
                'expired-callback': function() { $('.btn-signup').prop('disabled',true); }
            });
        }

        if($('.captcha-image').length>0) {
            $.get('/signup/captcha.json', function(response) {
                if(response.image) {
                    $('.captcha-image').attr('src',"data:image/jpeg;base64,"+response.image);
                }
            });
        }
        form_signup_detail.trigger('open')
    }

    signup.onCompleteSignup = function(channel) {
        try {track_event('Complete Signup', {'channel':channel, 'via':'web'});} catch(e){}
        try { fbq('track', 'CompleteRegistration'); } catch (e) {}
        try { dataLayer.push({'event': 'Signup_Complete' }); } catch(e){}
    }
});

jQuery(function($) {
    $('.reload-captcha').click(function(event) {
        event.preventDefault();
        $.get('/signup/captcha.json', function(response) {
            if(response.image) {
                $('.captcha-image').attr('src',"data:image/jpeg;base64,"+response.image);
            }
        });
    })
});

jQuery(function($) {
    $('.not-implemented').click(function(e) {
        ALERT("Not implemented yet. We are working on it.")
    })
})

// slideshow
jQuery(function($) {    
    var $cover = $('.popup.sign .slideshow').show(), $slide = $cover.find('ul'), $paging = $cover.find('.pagination');
    $paging.find('a:first').addClass('current');

    // start slideshow
    var slideTimer;

    function startAutoSlide(){
        slideTimer = setInterval(function(){
          if($('.popup.sign').is(':visible') ){
              var $current = $paging.find('a.current');
              if ($current.next('a').length) {
                $current.next('a').trigger('click');
              } else {
                $paging.find('a:first').trigger('click');
              }
          }
        }, 4000);
    } 

    if(!$cover.hasClass('no-auto')) {
        startAutoSlide();

        $cover.hover(function(){
            if(slideTimer) clearInterval(slideTimer);
        }, function(){
            startAutoSlide();
        })
    }

    $cover.bind('reset', function(){
        var $slides = $cover.find('ul li');
        $slides.css('opacity', '0').filter(':eq(0)').css('opacity','1');
        $paging.find("a.current").removeClass('current').end().find("a:eq(0)").addClass('current');  
    })

    $paging.find("a").click(function(event){
      event.preventDefault();
      $this = $(event.currentTarget);
      if($this.hasClass('current')) return;
      var idx = $this.prevAll("a").length;
      var currentIdx = $paging.find('a.current').prevAll("a").length;
      var $slides = $cover.find('ul li');
      var $slide = $slides.eq(idx);
      var $currentSlide = $slides.eq(currentIdx);
      var width = $slide.width();
      if(idx > currentIdx){
        $slide.css('opacity','0');
        $currentSlide.css('opacity','0');
      }else{
        $slide.css('opacity','0');
        $currentSlide.css('opacity','0');
      }
      $slide.css('opacity','1');
      
      $paging.find('a.current').removeClass('current');
      $this.addClass("current");
    });

    $(window).resize(function(){
        var $slides = $cover.find('ul li');
        var currentIdx = $paging.find('a.current').prevAll("a").length;
        var $currentSlide = $slides.eq(currentIdx);
        var width = $currentSlide.width();
        $currentSlide.prevAll().css('opacity','0');
        $currentSlide.nextAll().css('opacity','0');

    })
})
