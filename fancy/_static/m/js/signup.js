jQuery(function($){
    var channel = '';
	$('a.with-email').click(function(){
		$('.before').hide();
		$('.after').show();
		return false;
	});

	function success_json(json) {
		if(json.status_code===undefined) return false;
		if(json.status_code == 1) {
            try {track_event('Complete Signup', {'channel':channel, 'via':'mobile'});} catch(e){}
	        location.href = $('form.frm').find('.next_url').val() || '/?channel='+channel;
            return;
		} else if (json.status_code == 0) {
			var msg = json.message;
            alert(msg);
			$('form').addClass('has-error').find('.error > span').hide().filter('.from-server').show().text(msg);
		}
	};

	function success_xml(xml) {
		var $xml = $(xml), $st = $xml.find('status_code');
		if (!$st.length) return;
		if ($st.text() == 1) {
            try {track_event('Complete Signup', {'channel':channel, 'via':'mobile'});} catch(e){}
	        location.href = $('form.frm').find('.next_url').val() || '/?channel='+channel;
            return;
		}

		var $msg = $xml.find('message');
		if ($msg.length) {
            alert($msg.text());
			$('form').addClass('has-error').find('.error > span').hide().filter('.from-server').show().text($msg.text());
		}
	};

	$('form.frm')
		.find('input[type="text"],input[type="email"],input[type="password"]')
			.keypress(function(){ $(this.form).filter('.has-error').removeClass('has-error') })
			// workaround for mobile chrome on iOS - https://app.asana.com/0/369567867430/9678474739986
			.on('touchend', function(){
				var field = this;
				setTimeout(function(){ field.focus(); }, 300); 
			})
		.end()
		.submit(function(){
			var $form = $(this), elem = this.elements, params = {}, n, v;
			var type = $form.attr('type');
			var sns = $form.attr('rel');
			var t = ({
                email : {url:'/invitation_signup.json', dataType:'json', callback:success_json, channel: 'fancy'},
				facebook : {url:'/facebook_signup.xml', dataType:'xml', callback:success_xml, channel: 'facebook'},
				twitter  : {url:'/twitter_signup.xml', dataType:'xml', callback:success_xml, channel: 'twitter'},
				social  : {url:'/social/signup_'+sns+'.json', dataType:'json', callback:success_json, channel: sns}
			})[type];

			function error(type){
				var field = type.replace(/^[^-]+-/, '');
				$form.addClass('has-error').find('.error > span').hide().filter('.'+type).show();
                msg = $form.find('.error > span').filter('.'+type).text()
                if(msg) alert(msg)
				elem[field].focus();
				return false;
			};

			for (var i=0; i < elem.length; i++) {
				if(!(n=elem[i].name) || (/^(checkbox|radio)$/i.test(elem[i].type) && !elem[i].checked) || !(v=$.trim(elem[i].value)).length) continue;
				params[n] = v;
			}

			if (!params.username) return error('enter-username');
			if (params.username.length < 2) return error('short-username');
			if (/\W/.test(params.username)) return error('invalid-username');
				if (elem.email) {
				if (!params.email) return error('enter-email');
				if (!/^[\w\.%+-]+@[\w\.\-]+\.[A-Za-z]{2,4}$/.test(params.email)) return error('invalid-email');
			}
			if (elem.password && !params.password) return error('enter-password');

            if($('#signup-recaptcha').length>0) {
                try {
                    var g_recaptcha_response = grecaptcha.getResponse(g_recaptcha_widget)
                    params['grecaptcha'] = g_recaptcha_response;
                } catch(e) {
                    console.log('failed to get g-recaptcha response',e);
                }
            }
            if($('#captcha-answer').length>0) params['captcha_answer'] = $('#captcha-answer').val();

			$form.find(':button:submit').addClass('disabled').prop('disabled',true).addClass('loading');

            channel = t.channel;
            $.ajax({
                type : 'post',
                url  : t.url,
                data : params,
                headers  : {'X-CSRFToken':$.cookie.get('csrftoken')},
                dataType : t.dataType,
                success  : t.callback,
                complete : function(){
                    $form.find(':button:submit').removeClass('disabled').prop('disabled',false);
                },
                error : function(xhr) {
                    if(xhr.status==403) {
                        alert("It looks like your browser is set to block cookies. Please enable cookies in your browser settings.");
                    } else if(xhr.status>=400) {
                        alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
                    }
                }
            }).always(function() {
			    $form.find(':button:submit').removeClass('disabled').prop('disabled',null).removeClass('loading');
            });
			return false;
		});
});

// email confirmation
(function(a){
	if(a && a.next && /^\/confirm_email\/([a-zA-Z0-9]+)/.test(a.next)){
		try{ location.href = 'fancy://email_confirmation?key='+RegExp.$1 }catch(e){};
	}
})(location.args);


jQuery(function($){
    var form_signup = $('.sign.signup form');
    form_signup
    .on('click', '.btn-signup', function(event) {
        event.preventDefault();
        var $this = $(this);
        $this.prop('disabled','disabled');
        $this.addClass('loading');
        var $email = $this.parent().find('input[name="email"]');
        var email = $.trim($email.val())||'';
        var params = {'email':email};
        $.get('/check-field/email', params, function(response) {
            if (response.status_code != undefined && response.status_code == 1) {
                onBeginSignup();
                $this.parent().find('input[name="username"]').val(response.username).change();
                $this.parent().find('input[name="username"]').parent().find('.url span').text(response.username);
                $this.parent().find('input[name="email"]').val(response.email);
                $this.parent().find('input[name="fullname"]').val(response.fullname).focus();
                try { track_event('Begin Signup', { 'channel': 'fancy', 'via':'mobile'}); } catch (e) {}
                $this.hide().closest('.signup-frm').find('h2').toggle().end().find('.introduction, .sns, .others').hide().end().find('.sns-frm').find('p,label').removeAttr('style').end().end().find('.terms,button:submit').show();
                $this.closest('.signup-frm').find('span.captcha').show();
            } else if (response.status_code != undefined && response.status_code == 0) {
                var msg = response.message;
                var error = response.error;
                alert(msg);
                return;
            }
        }, 'json')
        .fail(function(xhr) {
            alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
        })
        .always(function() {
            $this.prop('disabled',null);
            $this.removeClass('loading');
        });
    });

    var g_recaptcha_widget = null;
    var onBeginSignup = function() {
        if($('#signup-recaptcha').length>0) {
            $('.btn-signup').prop('disabled',true);
            g_recaptcha_widget = grecaptcha.render('signup-recaptcha', {
                'sitekey' : '6LfYcBwTAAAAAOH_zqWpB63-LuIbbj-INnVYQBU3',
                'callback': function() { $('.btn-signup').prop('disabled',false); },
                'expired-callback': function() { $('.btn-signup').prop('disabled',true); }
            });
        }
    }
});

jQuery(function($){
    var form_signin = $('.sign.signin form');
    form_signin
    .on('click', '.btn-signin', function(event) {
        event.preventDefault();
        var $this = $(this);
        var $username = form_signin.find('input[name="username"]');
        var $user_password = form_signin.find('input[name="password"]');
        var username = $.trim($username.val())||'';
        var password = $.trim($user_password.val())||'';

        var usernameRegEx = /^[a-zA-Z0-9_]+$/;
        // see common/util.js to change emailRegEx
        if(!(emailRegEx.test(username) || usernameRegEx.test(username))) {
            alert(gettext('Please enter username.'));
            return;
        }
        if(password.length<6) {
            alert(gettext('The login details are incorrect. You can click “Forgot your password?” below.'));
            return;
        }

        $this.prop('disabled','disabled').css({'cursor': 'default'});
        $this.addClass('loading');
        $.post('/login.json', {'username':username, 'password':password, 'callback':''}, function(response){
            if (response.status_code != undefined && response.status_code == 1) {
                try {track_event('Complete Login', {'channel':'fancy','via':'mobile'});} catch(e){}
                var next = form_signin.find('.next_url').val()||'/';
                if(next) {
                    document.location = next;
                } else {
                    document.location = '/';
                }
            } else if (response.status_code != undefined && response.status_code == 0) {
                alert(gettext('The login details are incorrect. You can click “Forgot your password?” below.'));
            }
        }, 'json')
        .fail(function(xhr) {
            try {
                err = JSON.parse(xhr.responseText);
                err = err.message || err.error;
                if(err) {
                    alert(err);
                    return;
                }
            } catch(e) {
            }
            if(xhr.status==403) {
                alert("It looks like your browser is set to block cookies. Please enable cookies in your browser settings.");
            } else {
                alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            }
        })
        .always(function() {
            $this.prop('disabled',null).css({'cursor': ''});
            $this.removeClass('loading');
        })
    });
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
    var form_complete = $('.setup_account .frm');
    form_complete.on('click', '.btn-signup', function(event) {
        event.preventDefault();
        $this = $(this);
        $form = form_complete;

        var $username = $form.find('input[name="username"]');
        var $email = $form.find('input[name="email"]');
        var $user_password = $form.find('input[name="user_password"]');

        var username = $.trim($username.val())||'';
        var email = $.trim($email.val())||'';
        var password = $.trim($user_password.val())||'';
        var fullname = $.trim($form.find('input[name="fullname"]').val())||'';

        var error = null;
        if(username.length<1) error = gettext('Username is required.');
        if(username.length<2) error = gettext('Username is too short.');
        if(/W/.test(username)) error = gettext('Please use alphanumeric characters for your username.');
        if (email.length<1) error = gettext('Please enter email address.');
        if (!/^[\w\.%+-]+@[\w\.\-]+\.[A-Za-z]{2,4}$/.test(email)) error = gettext('A valid email address is required.');
        if(password.length<6) error = gettext('Password should be 6 characters or more.');
        if(error) {
            alert(error);
            return;
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

        var channel = $this.attr('data-snstype') || 'fancy';

        $this.addClass('loading');
        $.post('/settings_account_signup_detail.json', param, function(response) {
                if (response.status_code != undefined && (response.status_code == 1 || response.status_code == 2)) {
                    try {track_event('Complete Signup', {'channel':channel, 'via':'mobile'});} catch(e){}
                    location.href = '/?channel='+channel;
                } else if (response.status_code != undefined && response.status_code == 0) {
                    var msg = response.message;
                    alert(msg);
                }
        }, 'json')
        .fail(function(xhr) {
            alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
        })
        .always(function() {
            $this.removeClass('loading');
        });
    });
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
                url: `/rest-api/v1/things/${queries.action_param}`,
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
