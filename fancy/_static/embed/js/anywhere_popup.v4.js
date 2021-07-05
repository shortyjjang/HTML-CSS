(function($){
	// template
	$.fn.template = function(args) {
		if(!args) args = {};
		var html = this.html().replace(/##([a-zA-Z0-9_]+)##/g, function(whole,name){
			return args[name] || '';
		});

		return $(html);
	};

	$.cookie = {
		'get' : function(name){
			var regex = new RegExp('(^|[ ;])'+name+'\\s*=\\s*([^\\s;]+)');
			return regex.test(document.cookie)?unescape(RegExp.$2):null;
		},
		'set' : function(name, value, days){
			var expire = new Date();
			expire.setDate(expire.getDate() + (days||0));
			document.cookie = name+'='+escape(value)+(days?';expires='+expire:'');
		}
	};
	// parse query string - equivalent to parse_string php function
	$.parseString = function(str){
		var args = {};
		str = str.split(/&/g);
		for(var i=0;i<str.length;i++){
			if(/^([^=]+)(?:=(.*))?$/.test(str[i])) args[RegExp.$1] = decodeURIComponent(RegExp.$2);
		}
		return args;
	};
	$.getOpt = function(name){
		var opts = ((location.args && location.args.options) || '').split(',');
		if(opts.indexOf) return (opts.indexOf(name) != -1);

		for(var x in opts) if(opts[x] == name) return true;
		return false;
	};
	location.args = $.parseString(location.search.substr(1));

	window.fbAsyncInit = function(){
		FB.init({appId:'180603348626536', version: 'v2.8', status:true, cookie:true, xfbml:true, oauth:true});
	};

	function gettext(s){
		if(!window.catalog) window.catalog = {};
		return window.catalog[s] || s;
	};

	function htmlencode(s) {
		return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	};

	function serialize(form){
		var ret = {}, i, c, e, v;

		for(i=0,c=form.elements.length; i < c; i++){
			e = form.elements[i];
			v = $.trim(e.value);

			if(!e.name || !v.length) continue;
			if((e.type == 'checkbox' || e.type == 'radio') && !e.checked) continue;
			ret[e.name] = v;
		}

		return ret;
	};

	function getParam($form) {
		var arrParam = $form.serializeArray(), params = {}, i, c;

		for (i=0,c=arrParam.length; i < c; i++) {
			params[arrParam[i].name] = arrParam[i].value;
		}

		return params;
	};


	function formatMoney(money, sample){
		var type2 = /,23/.test(sample);

		if(typeof money == 'string') money = parseFloat(money.replace(/[^\d\.]+/g,''));

		money = (money+'').split('.');
			money[0] = money[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
		money = money.join('.');

		return money;
	};

	var check_email_error = function() {
        var field = this;
        // see common/util.js to change emailRegEx
        if(emailRegEx.test($.trim($(this).val()))) {
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

    var check_email = function(e) {
        var field = this;

        if($(field).val().length<1) {
            $(field).addClass('error');
            $(field).parent().addClass('error');

            if($(field).parent().hasClass('hidden-email')) {
                alert(gettext('Please enter email address.'));
            } else {
                var error = $(field).next().show();
                error.html('<i class="icon"></i>'+gettext('Please enter email address.'));
            }
            return false;
        } else if(!emailRegEx.test($.trim($(this).val()))) { // see common/util.js to change emailRegEx
            $(field).addClass('error');
            $(field).parent().addClass('error');
            if($(field).parent().hasClass('hidden-email')) {
                alert(gettext('A valid email address is required.'));
            } else {
                var error = $(field).next().show();
                error.html('<i class="icon"></i>'+gettext('A valid email address is required.'));
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
            error.html('<i class="icon"></i>'+gettext('Password should be 6 characters or more.'));
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
            error.html('<i class="icon"></i>'+gettext('Please use alphanumeric characters for your username.'));
            return false;
        }

        if(check_all && $(this).val().length<3) {
            $(field).addClass('error');
            $(field).parent().addClass('error');
            $(field).parent().parent().find('.username_suggest').removeClass('error');
            var error = $(field).next();
            if($(this).val().length<1) {
                error.html('<i class="icon"></i>'+gettext('Username is required.'));
            } else {
                error.html('<i class="icon"></i>'+gettext('Username is too short.'));
            }
            return false;
        }
        if($(this).val().length>30) {
            $(field).addClass('error');
            $(field).parent().addClass('error');
            $(field).parent().parent().find('.username_suggest').removeClass('error');
            var error = $(field).next();
            error.html('<i class="icon"></i>'+gettext('Username is too long.'));
            return false;
        }

        return true;
    }


	function log(message, error){
		var fn;
		if(window.console && (fn=window.console[error?'error':'log'])){
			fn(message);
		}
	};

	// CSRF
	function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = location.host; // host + port
        var protocol = location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|https?:).*/.test(url));
    }
	$.ajaxPrefilter(function(options, originalOptions, jqXHR){
		var url = location.protocol+'//'+location.host, regex = new RegExp('^('+url+'|/\\w)');
		if(/^(POST|PUT|DELETE)$/i.test(options.type) && sameOrigin(options.url)){
			var v = $.cookie.get('csrftoken');
			if(v && v.length){
				if(!options.headers) options.headers = {};
				options.headers['X-CSRFToken'] = v;
			}
			// prevent cache to avoid iOS6 POST bug
            if (!/[&\?]_=\d+/.test(options.url)) {
                options.url += ((options.url.indexOf('?') > 0)?'&':'?')+'_='+(new Date).getTime();
            }
		}
	});

	$(function(){
		var $w=$(window),$b=$('body'),$d=$(document),$wrap=$('#wrap'),$cnt=$('#container'), loc='';

		if(location.args && location.args.loc) {
			window.name = 'loc:'+(loc=location.args.loc);
		} else if(/^loc:(.+)$/.test(window.name)) {
			loc = RegExp.$1;
		}

		function moveTo(url){
			location.href = url;
		};

		function close(){
			try {
				parent.postMessage('close', loc);
			} catch(e) {
				try { window.close() } catch(ee){};
			};
		};

		// short version?
		if ($w.height() <= 620) $b.addClass('short');

		// fancy scrollbar
		//$b.fancyScroll();

		// resize
		function resize(second){
			var loc = (window.name||'').match(/^loc:(.+)$/), $desc, wrap_h;

			if($cnt.hasClass('sale')) {
				$desc = $cnt.find('.description');
				$desc.height($cnt.find('.figure-order')[0].offsetTop - $desc.offset().top);
			}

			if(window.postMessage && loc) return;

			$d.css('overflow','hidden');
			wrap_h = Math.min(screen.availHeight - 80, $wrap[0].offsetHeight);
			if($w.height() != wrap_h) {
				try { window.resizeBy(0,wrap_h-$w.height()) } catch(e){};
			}
			$d.css('overflow','auto');
			if(!second) setTimeout(function(){resize(1)}, 100);
		};
		resize();


		// signup
		(function(){
			if(!$('#signup, #register').length) return;

			var $signup = $(".signup"), $register = $(".register"), form_signup = $signup.find("form"), form_signup_detail = $register.find("form");

		    // signup first phase dialog/form
		    $signup.find('input[name="email"]').val('').focus();

			$signup.find('input.error').each(function() {
				$(this).removeClass('error');
				$(this).next().removeClass('error');
				$(this).parent().removeClass('error');
			});

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

		            if(!check_email.call($email, true)) {
		                return;
		            }

			        var that = this;
					$(that).prop('disabled',true);

		            var params = {'email':email};
		            $.get('/check-field/email', params, function(response) {
		                if (response.status_code != undefined && response.status_code == 1) {
		                    form_signup_detail.find('input[name="username"]').val(response.username).change();
		                    form_signup_detail.find('input[name="username"]').parent().find('.url b').text(response.username);
		                    form_signup_detail.find('input[name="email"]').val(response.email);
		                    form_signup_detail.find('input[name="fullname"]').val(response.fullname).focus();

		                    $('.signup').hide();
		                    $('.register').show().trigger("open");
                            onBeginSignup();
						} else if (response.status_code != undefined && response.status_code == 0) {
		                    var msg = response.message;
		                    var error = response.error;
		                    $email.addClass('error');
		                    $email.parent().addClass('error');
		                    var error = $email.next();
		                    error.html('<i class="icon"></i>'+msg);
		                    return;
		                }
		            }, 'json')
		            .fail(function(xhr) {
		                alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
		            })
		            .always(function() {
		                $(that).prop('disabled',false);;
		            });
		        
			    });


		    // signup second phase (detail) dialog/form
		    $register
			    .on('open', function(){
			        $register.find('input[name="username"]').val(form_signup_detail.find('input[name="username"]').val()).change();
			        $register.find('input[name="username"]').parent().find('.url b').text(form_signup_detail.find('input[name="username"]').val());
			        $register.find('input[name="email"]').val(form_signup_detail.find('input[name="email"]').val());
			        $register.find('input[name="fullname"]').val(form_signup_detail.find('input[name="fullname"]').val()).focus();

			        $register.find('input.error').each(function() {
			            $(this).removeClass('error');
			            $(this).next().removeClass('error');
			            $(this).parent().removeClass('error');
			        });
			    });

		    form_signup_detail
			    .on('keyup', 'input.error[name="email"]', check_email_error)
			    .on('keyup', 'input.error[name="user_password"]', check_password_error)
			    .on('keyup', 'input.error[name="username"]', check_username_error)
			    .on('keyup', 'input[name="username"]', check_username)
			    .on('click', '.btn-signup', function(event) {
			        event.preventDefault();

			        $this = $(this);
			        if( $this.attr('disabled') ) return;

			        var $form = form_signup_detail;

			        form_signup_detail.find('input.error').each(function() {
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
			        var referrer = $.trim($form.find('input[name="referrer"]').val())||'';
			        var invitation_key = $.trim($form.find('input[name="invitation_key"]').val())||'';
			        var user_id = $.trim($form.find('input[name="user_id"]').val())||'';
			        var next_url = $.trim($form.find("input[name=next_url]").val())
			        
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

			        if($user_password.length>0) param['password'] = password;

                    if($('#signup-recaptcha').length>0) {
                        try {
                            var g_recaptcha_response = grecaptcha.getResponse(g_recaptcha_widget)
                            params['grecaptcha'] = g_recaptcha_response;
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
			            var post_to_facebook = $('#fb-wall').hasClass('on');
			            var fb_request_id = $this.attr('fbrid');

			            param['post_to_facebook']=post_to_facebook;
			            if(fb_request_id != undefined) { param['fb_request_id']=fb_request_id; }
			            if (location.args['next']) param['next'] = location.args['next'];

			            $this.attr('disabled', true).css({'cursor': 'default'});
			            $.post("/facebook_signup.xml",param, function(xml) {
			                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
								location.href=next_url;
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
			                        $error.html('<i class="icon"></i>'+msg);
			                        */
			                        alert(msg);
			                    } else if(error_type.indexOf('username')>=0) {
			                        var msg = $(xml).find("message").text();
			                        $username = $form.find('input[name="username"]');
			                        $username.parent().addClass('error');
			                        var $error = $username.next();
			                        $error.html('<i class="icon"></i>'+msg);
			                    } else {
			                        var msg = $(xml).find("message").text();
			                        alert(msg);
			                    }
			                }
			            }, "xml")
			            .fail(function(xhr) {
			                alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
			            })
			            .always(function() {
			                $this.prop('disabled',false).css('cursor','');
			            });
			        } else if(sns_type=='twitter') {
			            // twitter signup
			            //var follow_fancy = $('#follow-thefancy').is(':checked');
			            //var post_to_twitter = $('#twitter').is(':checked');
			            var follow_fancy = $('#follow-thefancy').hasClass('on');
			            var post_to_twitter = $('#twitter').hasClass('on');
			            param['follow_fancy']=follow_fancy;
			            param['post_to_twitter']=post_to_twitter;
			            if (location.args['next']) param['next'] = location.args['next'];

			            $this.prop('disabled',true).css({'cursor':'default'});
			            $.post("/twitter_signup.xml",param, function(xml){
			                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
			                    // success
			                    location.href=next_url;
			                } else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
			                    var msg = $(xml).find("message").text();
			                    var err = $(xml).find("error").text();
			                    if (err != undefined && err.indexOf('email')>=0){
			                        $email.addClass('error');
			                        $email.parent().addClass('error');
			                        var $error = $email.next();
			                        $error.html('<i class="icon"></i>'+msg);
			                    } else if (err != undefined && err.indexOf('username')>=0) {
			                        $username.addClass('error');
			                        $username.parent().addClass('error');
			                        var $error = $username.next();
			                        $error.html('<i class="icon"></i>'+msg);
			                    } else {
			                        alert(msg);
			                    }
			                }
			            }, "xml")
			            .fail(function(xhr) {
			                alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
			            })
			            .always(function() {
			                $this.prop('disabled',false).css('cursor','');
			            });
			        } else if(sns_type=='email') {
			            // email signup
			            var https_post = "/email_signup.json";
			            var force_xhr = true;
		            
			            // use xhr when current page is on https, else use iframe proxy
			            $.post(https_post, param, function(response) {
			                    if (response.status_code != undefined && response.status_code == 1) {
			                        location.href=next_url;
			                    } else if (response.status_code != undefined && response.status_code == 0) {
			                        var msg = response.message;
			                        var error = response.error;
			                        if (response.error != undefined && response.error.indexOf('email')>=0){
			                            $form.find('.hidden-email').show();  

			                            $email.addClass('error');
			                            $email.parent().addClass('error');
			                            if($email.parent().hasClass('hidden-email')) {
			                                alert(msg);
			                            } else {
			                                var $error = $email.next();
			                                $error.html('<i class="icon"></i>'+msg);
			                            }
			                        } else if (response.error != undefined && response.error.indexOf('username')>=0) {
			                            $username.addClass('error');
			                            $username.parent().addClass('error');
			                            var $error = $username.next();
			                            $error.html('<i class="icon"></i>'+msg);
			                        } else {
			                            alert(msg);
			                        }
			                    }
			                }, 'json')
			                .fail(function(xhr) {
			                    if(xhr.status==403) {
			                        alert("It looks like your browser is set to block cookies. Please enable cookies in your browser settings.");
			                    } else if(xhr.status>=400) {
			                        alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
			                    }
			                })
			                .always(function() {
			                    $this.prop('disabled',false).css({'cursor': ''});
			                });
			        } else {
			            // other sns signup
			            var url = "/social/signup_"+sns_type+".json";

			            $.post(url, param, function(response) {
			                if (response.status_code != undefined && response.status_code == 1) {
			                    location.href=next_url;
			                } else if (response.status_code != undefined && response.status_code == 0) {
			                    var msg = response.message;
			                    var error = response.error;
			                    if (response.error != undefined && response.error.indexOf('email')>=0){
			                        $form.find('.hidden-email').show();  

			                        $email.addClass('error');
			                        $email.parent().addClass('error');
			                        if($email.parent().hasClass('hidden-email')) {
			                            alert(msg);
			                        } else {
			                            var $error = $email.next();
			                            $error.html('<i class="icon"></i>'+msg);
			                        }
			                    } else if (response.error != undefined && response.error.indexOf('username')>=0) {
			                        $username.addClass('error');
			                        $username.parent().addClass('error');
			                        var $error = $username.next();
			                        $error.html('<i class="icon"></i>'+msg);
			                    } else {
			                        alert(msg);
			                    }
			                }
			            }, 'json')
			            .fail(function(xhr) {
			                alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
			            })
			            .always(function() {
			                $this.prop('disabled',false).css({'cursor': ''});
			            });
			        }
			    });
		})();

		// signin
		(function(){
			if(!$('#signin').length) return;

			$('form.login_')
				.on('focus', 'input', function(){
					$(this).removeClass('error').parent().find("small.msg").hide();
				})
				.submit(function(event){
					var elems = this.elements, username = $.trim(elems.username.value), password = elems.password.value;
					if(username && password) return true;

					event.preventDefault();
					if(!username) $(this).find('input[name="username"]').addClass('error').parent().find('small.msg').show();
					if(!password) $(this).find('input[name="password"]').addClass('error').parent().find('small.msg').show();
				});

			$('.signin a.forgot_pw').click(function(e){
				e.preventDefault();
				$('#container')
					.find('div.signin, div.register,.signup').hide().end()
					.find('div.forgot_pw').show();
				resize();
			})

			$('.forgot_pw form')
			    .on('focus', 'input', function(){
					$(this).removeClass('error').parent().find("small.msg").hide();
				})
			    .on('click', '.btn-reset', function(event) {
			        event.preventDefault();

			        $this = $(this);
			        $form = $('.forgot_pw form');

			        var $email = $form.find('input[name="email"]');

			        var email = $.trim($email.val())||'';

			        $form.find('input.error').each(function() {
			            $(this).removeClass('error');
			            $(this).next().removeClass('error');
			            $(this).parent().removeClass('error');
			        });

			        if(!check_email.call($email, true)) {
			            return;
			        }

			        var param = {
			            'email'  : email
			        };

			        $this.attr('disabled',true).css({'cursor': 'default'});

			        // post forgot_password
			        $.post("/reset_password.xml",param, function(xml){
			            if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
			                $email.val('');
			                var message = "We've sent an email to your account.\nClick the link in the email to reset your password.\nIf you don't see the email, check other places it might be, like your junk, spam, social, or other folders."
		                    $('div.forgot_pw').hide();
		                    $('div.reset_pw_email_sent').show();
		                    resize();
			            } else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
			                var msg = $(xml).find("message").text();
			                $email.addClass('error');
			                $email.parent().addClass('error');
			                var error = $email.next().show();
			                error.html('<i class="icon"></i>'+msg);
			            }  
			        }, "xml")
			        .fail(function(xhr) {
			            alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
			        })
			        .always(function() {
			            $this.removeAttr('disabled').css({'cursor': ''});
			        });
			    })
			    ;
			$('.reset_pw_email_sent .btn-ok').click(function(){
				$('div.signin').show();
				$('div.reset_pw_email_sent').hide();
				resize();
			})

		})();


		// connect with facebook or twitter
		(function(){
			var is_join = !!$wrap.find('#signup').length;

			function request(url, params) {
				if (params == undefined) params = {};
				var elems = $('#container form')[0].elements, url, fail = true;

				for(var i=0,c=elems.length; i < c; i++) {
					if(elems[i].getAttribute('placeholder') == elems[i].value) continue;
					params[elems[i].name] = elems[i].value;
				}

				$('button,input:button').prop('disabled',true).addClass('disabled');

                var sns = 'facebook';
                if(url.search('^/login_twitter')==0) {
                    sns = 'twitter';
                }

				$.ajax({
					type : 'post',
					url  : url,
					data : params,
					dataType : 'xml',
					success  : function(xml) {
						var $xml = $(xml), $st = $xml.find('status_code'), url;

						if(!$st.length) return;
						if($st.text() == 0) return alert($xml.find('message').text());
						url = '/embed/register'+(params['next_url']?'?next='+encodeURIComponent(params['next_url']):''); 

						fail = false;
						moveTo(url);
					},
					complete : function(){
						var $waiting = $('#waiting:visible');
						$('button,input:button').prop('disabled',false).removeClass('disabled');

						if($waiting.length && fail){
							$('#signin').show();
							$waiting.hide();
						}
					}
				});
			};

			var signin = {
				facebook : function(){
					FB.login(
						function(response){ request('/login_fb_user.xml?t=' + (new Date().getTime())) },
						{scope:'email,user_friends'}
					);
				},
				twitter : function(){
					var popup = window.open('about:blank', '_blank', 'height=400,width=800,left=250,top=100,resizable=yes', true);
					$.ajax({
						type : 'post',
						url  : '/apps/twitter/login.xml',
						data : {location:location.protocol+'//'+location.host},
						dataType : 'xml',
						success  : function(xml) {
							var $xml=$(xml),$st=$xml.find('status_code'),params={};
							if($st.length > 0 && $st.text() == 1) {
								popup.location.href = $xml.find('url').text();
								(function(){
									try {
										if(popup && popup.opener) return setTimeout(arguments.callee, 10);
									} catch(e){ }

									$.ajax({
										type : 'post',
										url  : '/apps/twitter/check.xml',
										dataType : 'xml',
										success  : function(xml){
											if(!$(xml).find('status_code').text()) return;
											request('/login_twitter_user.xml?t=' + (new Date().getTime()));
										}
									});
								})();
							}
						}
					});
				}
			};

		    $('a.social,button.social').click(function() {
			var backend  = $(this).data('backend');
			window.popup = window.open(null, '_blank', 'height=400,width=800,left=250,top=100,resizable=yes', true);
			var auth_url = "/social/auth_dialog/" + backend + '/';
			popup.location.href = auth_url;
			$social = $(this);
			authenticate();

			function authenticate() {

			    var authtype = $social.data('type');
			    var backend  = $social.data('backend');
			    var nextpath = $('input[name="next_url"]').val()
			    var name     = 'ck_' + backend;
			    var origin   = location.pathname;
			    var url = '/auth_' + backend + '.json'
			    url = location.protocol == 'https:' ? '/social' + url : url;

			    if (!window.popup || !window.popup.closed) {
				setTimeout(authenticate, 50);
				return;
			    }

			    $.post(url, {}, function(json){

				if (!json.code) {
				    alert("Sorry, we couldn't sign you in. Please try again.");
				    return;
				}

				if (authtype == 'signin') {
				    url = '/check_login_' + backend + '.json';
				    url = location.protocol == 'https:' ? '/social' + url : url;
				    var params = {'embed' : 'true'}
				    if (json.code) params['code'] = json.code;
				    if (json.state) params['state'] = json.state;
				    if (json.redirect_state) params['redirect_state'] = json.redirect_state;
				    if (nextpath) params['next'] = nextpath;
				    $.post(url, params, function(json){
					if (!json.status_code) {
					    alert(json.message);
					} else {
                        if(!(json.url && /\/(login|register)/.test(json.url))) {
                            try{track_event('Complete Login', { channel: backend, via: 'embed' });}catch(e){}
                        }
					    var redirect_to = json.url ? json.url : nextpath;
					    location.href = redirect_to;
					}
				    });
				}
			    });
			}
		    });

			// facebook
			$('button.btn-fb').click(signin.facebook);

			// check from_fb_auth parameter
			if(location.args && location.args.from_fb_auth) {
				$('#signin').hide();
				$('#waiting').show();
				(function(){
					var fn = arguments.callee;
					if(!/\bfbsr_\d+=/.test(document.cookie)) return setTimeout(fn, 10);
                    request('/login_fb_user.xml?t=' + (new Date().getTime()));
				})();
            }

			// twitter
			$('button.btn-tw').click(signin.twitter);

			// check from_twitter_auth parameter
			if(location.args && location.args.from_twitter_auth){
				$.ajax({
					type : 'post',
					url  : '/apps/twitter/check.xml',
					dataType : 'xml',
					success  : function(xml) {
						if($(xml).find('status_code').length) {
							request('/login_twitter_user.xml?t=' + (new Date().getTime()));
						}
					}
				});
			}

			// sign in with google+
			(function(){
				var g_plus_clicked = false, opts, state, stateObj, result;

				opts = {
					clientid   : '870365319043-ljas5u3l1p8uv7a343i6ludrpmkv5mpj.apps.googleusercontent.com',
					accesstype : 'offline',
					apppackagename : 'com.thefancy.app',
					cookiepolicy : 'single_host_origin',
					scope : 'openid profile email',
					callback : function(result){
						var origin=location.pathname, next=$('input[name="next_url"]').val(), url, params={embed:'true'};

						if(!g_plus_clicked || !result || result.error == 'access_denied') return false;
						if(!result.code || !result.access_token){
							alert(gettext("Sorry, we couldn't sign you in. Please try again."));
							return location.reload();
						}

						url = '/check_login_google.json';
						url = location.protocol == 'https:' ? '/social' + url : url;

						if (result.code) params['code'] = result.code;
						if (result.state) params['state'] = result.state;
						if (result.redirect_state) params['redirect_state'] = result.redirect_state;
						if (next) params['next'] = next;

						$.post(url, params, function(json){
							if (!json.status_code) {
								alert(json.message);
							} else {
                                try{track_event('Complete Login', { channel: backend, via: 'embed' });}catch(e){}
								var redirect_to = json.url ? json.url : next;
								location.href = redirect_to;
							}
						});
					}
				};

				if ((state = location.args.state)) {
					stateObj = $.parseString(decodeURIComponent(state));

					result = {
						code : location.args.code,
						redirect_uri : location.protocol+'//'+location.hostname+location.pathname
					};

					if (stateObj.next) result.next = stateObj.next;
					if (location.args.error) {
						alert(gettext("Sorry, we couldn't sign you in. Please try again."));
						location.replace('/embed/signup?'+state);
					}

					$('button.btn-g').prop('disabled',true);

					$.ajax({
						type : 'POST',
						url  : '/social/check_login_google_with_auth.json',
						data : result,
						success : function(json){
							if (!json.status_code) {
								if (json.message) alert(json.message);
								location.replace('/embed/signup?'+state);
							} else {
								location.replace( json.url || stateObj.next );
							}
						},
						complete : function(){
							$('button.btn-gg').prop('disabled',false);
						}
					});
				}

				window.gplus_render = function(){
					var $btn_gplus = $('button.btn-gg').click(function(){ g_plus_clicked = true; });

					if($.getOpt('inframesign')){
						$btn_gplus.click(function(event){
							var $this=$(this).prop('disabled',true), url = 'https://accounts.google.com/o/oauth2/auth', params;

							if(!state) state = (location.search||'?').substr(1);

							params = {
								response_type : 'code',
								client_id : opts.clientid,
								redirect_uri : location.protocol+'//'+location.hostname+location.pathname,
								access_type : opts.accesstype,
								scope : opts.scope,
								state : state
							};

							url += '?'+$.param(params);

							location.href = url;
						});
					} else {
						$btn_gplus.each(function(){ gapi.signin.render(this, opts); });
					}
				};
			})();
		})();


		// thumbnails
		(function(){
			var $figure = $(".thum-list");

			$figure
				.on('click', 'a.prev', function(e){
					e.preventDefault();
					var $this = $(this);
					if($this.hasClass("disabled")) return;
					var $prev = $figure.find("li.current").prev();
					if($prev.length){
						$figure.find("li.current").removeClass("current");
						$prev.addClass("current");
						var idx = $prev.prevAll().length*100;
						$figure.find(".prev, .next").addClass('disabled');
						$figure.find("ul").animate({left: -idx+'%'},100,'linear', function(){
							if( $prev.prev().length ) $figure.find(".prev").removeClass('disabled');
							$figure.find(".next").removeClass('disabled');
						})
					}
				})
				.on('click', 'a.next', function(e){
					e.preventDefault();
					var $this = $(this);
					if($this.hasClass("disabled")) return;
					var $next = $figure.find("li.current").next();
					if($next.length){
						$figure.find("li.current").removeClass("current");
						$next.addClass("current");
						var idx = $next.prevAll().length*100;
						$figure.find(".prev, .next").addClass('disabled');
						$figure.find("ul").animate({left: -idx+'%'},100,'linear', function(){
							if( $next.next().length ) $figure.find(".next").removeClass('disabled');
							$figure.find(".prev").removeClass('disabled');
						})
					}
				})
			
		})();

		// currency approximately
		var str_currency = $('.currency .price').eq(0).text();

		function refresh_currency(){
			var $currency = $('.currency .price');
			
			$currency.text(str_currency);

			function text_currency(el, money, code, symbol, natural_name) {

				if(typeof(money) == 'number') {
					money = money.toFixed(2);
				}
				money = money.replace(/[ \.]00$/,'');

				var str = str_currency.replace('...', symbol+" "+money+' <small>'+code+'</small>');
				$(el).html(str);
	            $(el).attr('currency', code);
	            $(el).closest(".currency").find(".country > .code").html(natural_name);
			};

			function show_currency(el, code, set_code){
				var p = $(el).attr('price');

				if(window.numberType === 2) p = p.replace(/,/g, '.').replace(/ /g, '');
				p = p.replace(/,/g, '');

				if(set_code) {
					$.ajax({
						type : 'POST',
						url  : '/set_my_currency.json',
						data : {currency_code:code}
					});
				}

				if(code == 'USD') {
					$(el).attr('currency', code);
				    return $(el).closest(".currency").hide();
				}else{			
					$(el).closest(".currency").show();
				}

				text_currency(el, '...', code, '');
				
				$.ajax({
					type : 'GET',
					url  : '/convert_currency.json?amount='+p+'&currency_code='+code,
					dataType : 'json',
					success  : function(json){
						if(!json || typeof(json.amount)=='undefined') return;
						var price = json.amount.toFixed(2) + '', regex = /(\d)(\d{3})([,\.]|$)/;
						while(regex.test(price)) price = price.replace(regex, '$1,$2$3');

						if(window.numberType === 2) price = price.replace(/,/g, ' ').replace(/\./g, ',');

						text_currency(el, price, json.currency.code, json.currency.symbol, json.currency.natural_name);
					}
				});
			};

			// get currency
			$currency.each(function(i,v){
				var $this = $(v);
				if($this.attr('price') && parseFloat($this.attr('price'))>0){	
					if ($this.attr('currency')) {
		                show_currency(v, $this.attr('currency'));
					} else {
						setTimeout(function(){
							$.ajax({
								type : 'GET',
								url  : '/get_my_currency.json',
								dataType : 'json',
								success  : function(json){
									if(json && json.currency_code) show_currency(v, json.currency_code);
								}
							});
						},100)
					}
				}else{
					$this.closest(".currency").hide();
				}
			})
		};

		refresh_currency();

		// buying buttons
		(function(){
			function sessionData(key, value, remove){
				var cookie_key = 'store-'+key;

				if(value && typeof value == 'object'){
					if(window.JSON && JSON.stringify){
						value = JSON.stringify(value);
					} else if($.toJSON){
						value = $.toJSON(value);
					} else {
						log('Cannot get json string', true);
						return;
					}
				}

				if(remove){
					window.sessionStorage?sessionStorage.removeItem(key):$.cookie.set(cookie_key, '', -1);
				} else if(typeof value == 'undefined'){
					return window.sessionStorage?sessionStorage.getItem(key):$.cookie.get(cookie_key);
				} else {
					window.sessionStorage?sessionStorage.setItem(key, value):$.cookie.set(cookie_key, value);
				}
			};

			function checkLogin($btn, params){
				if($btn.attr('require_login') != 'true') return true;

				var url = 'https://'+location.hostname+'/embed/login?next='+encodeURIComponent(location.protocol+'//'+location.hostname+location.pathname);
				if(location.search) url += location.search;

				sessionData('cart-params', params);
				moveTo(url);
			};

			function checkData($btn, callback){
				var params;
				if($btn.length && ($btn.attr('require_login')!='true') && (params=sessionData('cart-params'))){
					params = $.parseJSON(params);
					callback(params);

					sessionData('cart-params','',true);
				}
			};

			// add to cart
			(function(){
				var $btn = $('.figure-order .btn-cart'), isGiftCard = $btn.hasClass('giftcard_');

				$btn.click(function(){
					var $this=$(this),$opt=$('#select'), params;

					if(isGiftCard){
						params = {
							recipient_name : $.trim($('[name=recipient_name]').val()),
							recipient_email : $.trim($('[name=recipient_email]').val()),
							recipient_username : $.trim($('[name=recipient_username]').val()),
							amount : $('[name=amount]').val(),
							message : $.trim($('[name=message]').val()),
						};

						if(!params.recipient_name){
							return alert(gettext('Please enter recipient name'));
						}
						if(!params.recipient_username && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(params.recipient_email)){
							return alert(gettext('A valid email address is required'));
						}
						if(!params.message){
							return alert(gettext('Please enter personal message'));
						}
					} else {
						params = {
							quantity : parseInt($('#quantity').val()),
							sale_item_id : $this.attr('sii'),
							seller_id    : $this.attr('sisi')
						};

						if($opt.length) params['option_id'] = $opt.val();

					}

                    if ($(this).attr('require_login') && !isGiftCard) { // if not logged in
                        var rest_params = {
                            cart_type: 'saleitem',
                            sale_id: params.sale_item_id,
                            seller_id: params.seller_id,
                            option_id: params.option_id,
                            quantity: params.quantity
                        };
                        $.ajax({
                            type: 'post', dataType: 'json', contentType: 'application/json',
                            url: '/rest-api/v1/carts',
                            data: JSON.stringify(rest_params),
                            success: function(response) {
                                window.open('/cart'); close();
                                //moveTo('/embed/cart_guest/' + rest_params.seller_id+'?from='+encodeURIComponent(document.location.href));
                            }
                        });
                        return false;
                    }
					else if(!checkLogin($this, params)) return;

					$this.prop('disabled', true);

					request(params);
				});

				function request(params){
					var url = isGiftCard ? '/create-gift-card.json' : '/add_item_to_cart.json';

					$.ajax({
						type : 'post',
						url  : url,
						data : params,
						dataType : 'json',
						success  : function(resp){
                            if(resp.status_code) {
                                if(isGiftCard){
                                    window.open('/gift-card/checkout'); close();
                                    //moveTo('/embed/gift-card/checkout');
                                }else{
                                    window.open('/cart?from='+encodeURIComponent(document.location.href)); close();
                                    //moveTo('/embed/cart?from='+encodeURIComponent(document.location.href));
                                }
							} else {
								if (resp.message) alert(resp.message);
							}
						},
						complete : function(){
							$btn.prop('disabled', false);
						}
					});
				};

				checkData($btn, request);

			})();

			// tabs
			$('ul.tab')
				.on('click', 'a', function(event){
					event.preventDefault();

					var $a = $(this), tab = $a.attr('href'), $tab = $(tab);
					$a.closest('ul').find('a').removeClass('current').end().end().addClass('current');
					$tab.show().siblings('div.text').hide();
				})
				.find('a:first').click();

			// suggestions
			(function(){
				var $tab = $('div.related > ul'), $tpl = $tab.find('>li:first'), isLoading=false, cursor, reachedEnd=false;

				if (!$tab.length) return;
				$tab.empty();

				function load(){
					if(isLoading || reachedEnd) return;
					var url = '/might_also_fancy.json?count=20&thing_id='+$tab.attr('data-tid')+'&lang='+$tab.attr('data-lang');
					if(cursor) url+='&cursor='+cursor;
					isLoading = true;

					$.ajax({
						url  : url,
						success : function(json) {
							if (!json || !json.results) return;
							if(!json.next_cursor){
								reachedEnd=true;
							}
							cursor = json.next_cursor;

							var i=0, item, price, type2 = /,23/.test($tpl.find('.price').attr('data-sample'));

							while (item = json.results[i++]) {
								if (!item.sales || !item.sales[0] || !item.sales[0].fancy_price) continue;

								price = ((+item.sales[0].fancy_price).toFixed(2)+'').replace(/(\d)(?=(\d{3})+\.)/g,'$1,');
								if (type2) price = price.replace(/,/g, ' ').replace(/\./g, ',');

								$tpl.clone().css('display', '')
									.find('a').attr('href', '/embed/buy/' + item.id).end()
									.find('img').css('background-image', 'url('+item.thumb_image_url_310+')').end()
									.find('.title').text(item.name).end()
									.find('.price').text('$'+price).end()
									.appendTo($tab);
							}
						},
						complete : function(){
							isLoading = false;
						}
					});
				}

				$tab.on('scroll', function(e){
					var scrollTop = $tab.scrollTop();
					var height = $tab[0].scrollHeight;
					if( scrollTop > height - $tab.height()*3 ) load();
				})

				load();

			})();
		})();


		(function(){
			
			function updateCalc(params, $container){
				if(!params || !params.cart_id || !$container || !$container.length) return;

				$.ajax({
					url  : '/rest-api/v1/carts',
					data : {cart_type:'saleitem'},
					success : function(json){
						var data = json.items;
						if(data.length){
							var tmp = {subtotal_price:0, available_before_shipping:true};
							$(data).each(function(){
								for(k in tmp){
									tmp[k] += parseFloat(this[k])||0;
								}
								if('available_before_shipping' in this)
									tmp['available_before_shipping'] = tmp['available_before_shipping'] && this['available_before_shipping'];
							})
							
							data = tmp;
						}

						$(json.items).each(function(i,v){
							var v = this;
							if(v.option_id){
								var id = 'item-'+v.sale_id+'-'+v.option_id;
								var $li = $("#"+id);
								if( parseInt(v.item_discount_percentage) > 0 ){
									$li.find("span.price").addClass('sales').html("<small class='before'>$"+formatMoney(v.item_retail_price)+"</small> $"+formatMoney(v.item_price));
								}else{
									$li.find("span.price").removeClass('sales').html("$"+formatMoney(v.item_price));
								}
							}
							
						})

						var subtotal = '$'+formatMoney(data.subtotal_price);
						$container.find(".subtotal_price_").find(".price").text(subtotal);
						$container.find(".currency .price").attr('price',data.subtotal_price);
						refresh_currency();

						updateQuantity();

					}
				});
			};

			function updateQuantity(){
				var item_count = 0;
				var $cart_in = $('#cart-saleitem').find('.qty select:visible').each(function(){ var v;if(v=parseInt( $(this).val() ))item_count+=v; }).end();
				var txt = (item_count>1)?gettext('{{items_count}} items in cart'):gettext('{{items_count}} item in cart');

				$cart_in.find('>h2').text(txt.replace('{{items_count}}', item_count));
			};

			// cart - update, remove
			$('form.merchant_')
				.on('change', 'select.option_', function(){
					var $this = $(this), xhr = $this.data('xhr'), siid = $this.attr('data-siid'), sale_item_cart_id = $this.attr('data-sicid'), oid = this.value, $row = $this.closest('.item_'), params;

					params = {
						cart_id : $this.attr('data-cid'),
						option_id : oid,
						seller_id : $row.attr('seller-id')
					};

					if($this.find('option:selected').data('remaining-quantity') < $this.closest('.item_').find('.qty > select').val()){
						var quantity = $this.find('option:selected').data('remaining-quantity');

						alert($this.find("option:selected").html()+" has only "+quantity+" in stock. We've updated the quantity for you.");
						params.quantity = $this.find('option:selected').data('remaining-quantity');				
					}
					

					try{ xhr.abort() }catch(e){};

					$.ajax({
						type : 'PUT',
						url  : '/rest-api/v1/carts/saleitem/items/'+sale_item_cart_id+'/',
						data : params,
						dataType : 'json',
						beforeSend : function(xhr){ $this.data('xhr', xhr) },
						success  : function(item) {
							if (oid != $this.val()) return;

							if (item.error_message_before_shipping) {
								$this.val($this.attr('data-optionid'));
								alert(item.error_message_before_shipping);
							} else {
								var id = 'item-'+siid+'-'+oid;

								if (!$('#'+id).length) {
									$row.attr('id', id).attr('data-sio', oid);
								}

								$this.attr('data-optionid', oid);
								updateCalc(params, $this.closest('form.merchant_'));
							}
						},
						complete : function(){
							$this.attr('href','#update').css('opacity', '');
						}
					});
				})
				.on('change', '.qty > select', function(){
					var $this = $(this), form = this.form, sale_item_cart_id = $this.attr('sicid'), unitPrice = parseFloat($this.attr('price')), xhr = $this.data('xhr'), $row = $this.closest('.item_'), params;

					params = {quantity:this.value, cart_id:$this.attr('cid'), seller_id : $row.attr('seller-id')};

					try { xhr.abort() } catch(e){};

					$.ajax({
						type : 'PUT',
						url  : '/rest-api/v1/carts/saleitem/items/'+sale_item_cart_id+'/',
						data : params,
						beforeSend : function(xhr){ $this.data('xhr', xhr); },
						select : function(item){
							if (item.error_message_before_shipping) {
								alert(item.error_message_before_shipping);
							}
						},
						complete : function(){
							updateCalc(params, $this.closest('form.merchant_'));
						}
					});
				})
				.on('click', '.remove-item_', function(event){
					var $this=$(this), $li=$this.closest('li'), params={}, url = '/remove_cart_item.json';

					params.cart_id = $this.data('cid');

					if($li.attr('seller-id')) params.seller_id = $li.attr('seller-id');
					if($this.data('sicid')) params.sale_item_cart_id = $this.data('sicid');
					
					$.ajax({
						type : 'post',
						url  : url,
						data : params,
						dataType : 'json',
						success  : function(resp) {
							if(resp.status_code) {
								var $li = $this.closest('li');
								var $form = $li.closest('form.merchant_');
								var $addback = $this.closest(".cart-item-detail").find("li.add-back");
								
								$addback
									.find("a")
										.html($li.find("b.title").html()).attr('href', $li.find("a.item").attr('href'))
									.end()
									.find("button.btn-cart")
										.attr("data-tid", $li.attr('data-tid')).attr("data-sid", $li.attr('data-sid')).attr("data-siid", $li.attr('data-siid')).attr('data-qty', $li.find(".qty select").val()).attr('data-sio', $li.find("select.option_").val()||null)
									.end()
								.show().insertAfter($li);
								if(resp.is_sold_out[params.sale_item_cart_id]){
									$addback.find("button.btn-cart").hide();
								}else{
									$addback.find("button.btn-cart").show();
								}

								$li.remove();

								if ($form.find('.item_').length) {
									updateCalc(params, $form);
								}else{
									document.location.reload();
								}

							} else {
								if(resp.message) alert(resp.message);
							}
						}
					});
				})
				// restore from deleted to cart
				.on('click', 'button.undo_:not(.disabled)', function(event){
					var $this = $(this), $form = $this.closest('form');

					event.preventDefault();

					var params = {
						seller_id    : $this.data('sid'),
						quantity     : $this.data('qty'),
						thing_id     : $this.data('tid'),
						sale_item_id : $this.data('siid')
					};

					if ($this.data('sio')) {
						params.option_id = $this.data('sio');
					}
					
					$this.attr('disabled', true);
					$.ajax({
						type : 'POST',
						url  : '/add_item_to_cart.json',
						data : params,
						dataType : 'json',
						success  : function(){location.reload();},
						complete : function(){}
					});
				})

				$("#cart-saleitem").submit(function(e){
					e.preventDefault();

					$(".btn-checkout_").attr('disabled', 'disabled');

					var $this = $(this);

					if($this.attr('loading')){
						setTimeout(function(){
							$("#cart-saleitem").submit();
						},200);
						return;
					}
					
					var params = {
						"payment_gateway": 6		
					};

					$.ajax({
						type : 'POST',
						url  : '/rest-api/v1/checkout',
						contentType: "application/json; charset=utf-8",
						data : JSON.stringify(params),
						processData : false,
						success  : function(res){
							document.location.href= "/embed/checkout";
						},
						fail : function(){
							$(".btn-checkout_").removeAttr('disabled');
						}
					});
				});

		})();

		(function(){

			if( !$("#wrap").hasClass("checkout") ) return; 

			function checkoutPutRequest(params, successCallback) {
				if (location.args) {
					$.extend(params, location.args);
				}
				$.ajax({
					type : 'PUT',
					url  : '/rest-api/v1/checkout',
					contentType: "application/json; charset=utf-8",
					data : JSON.stringify(params),
					processData : false,
					success  : successCallback
				});
			}


			$("select[name=country], select[name=country_code]").change(function(){
				var $wrapper = $(this).closest("div");
				$wrapper.find("[name=state]").hide();
				if($(this).val()=='US' || $(this).val()=='USA'){
					$wrapper.find("select[name=state]").show().val('AL');
				}else{
					$wrapper.find("input[name=state]").show().val('');
				}
			})

			var Checkout = {};

			Checkout.Shipping = {
				$el : $("#container > .checkout-shipping.wrapper"),
				open : function(){
					this.$el.show().filter(".confirm").hide().end().find("> .new").hide().end().find("> .saved, > div.btn-area").show().end().find(".btn-area a.cancel").hide();
					$(".checkout-header").find("li.current").removeClass("current").end().find("li.shipping").addClass("current");
					$(".btn-checkout").attr('disabled','disabled');
				},
				close : function(){
					this.$el.show().filter(":not(.confirm)").hide();
					var $addr = this.$el.find("ul.select_shipping li.selected");
					this.$el.filter(".confirm").find("h3.stit").html("<b>Shipping address</b> · "+$addr.data('nickname')+" <a href='#' class='back'>Change</a>").end().find(".saved.status_").show();

				},
				isOpened : function(){
					return this.$el.filter(".confirm").is(":hidden");
				},
				init: function(){
					var $wrapper = this.$el;
					this.$el
						.on('click', 'h3.stit a.back', function(e){
							e.preventDefault();
							Checkout.Payment.close();
							Checkout.Shipping.open();
						})
						.on('click', 'li input:radio', function(event){
							var $this = $(this), $li = $this.closest('li');
							
							$this.closest('ul').find('li').removeClass('selected').end().end().closest('li').addClass('selected');
							$wrapper.filter(".confirm").data('addr_id', $this.val()).find('.saved.status_ p').html( $li.find('label small').html() );
						})
						.on('click', '.select_ship_addr_', function(){
							var $this = $(this);
							var addressInfo = null;

							if( $wrapper.find(".new").is(":visible")){
								var $form = $wrapper.find(".new");
								var params = getParam($form);
								params.state = $form.find("[name=state]:visible").val();
								params.country_name = $form.find("select[name=country] option:selected").html();
								params.set_default = $form.find("input[name=set_default]")[0].checked;

								Checkout.Shipping.addShippingAddress(params, function(data){
									var $li = $( $wrapper.find("ul.select_shipping > script").html() );
									$wrapper.find("ul").append($li);
									for(k in data){
										if( $li.data(k) != undefined){
											$li.data(k, data[k]);
										}
									}
									$li.data('set_default', data.is_default?"True":"False").data('id', data.id);
									$li.find("b.title").html( data.nickname );
									$li.find("label small").html( data.fullname+", "+data.address1+(data.address2?(" "+data.address2):"")+", "+data.city+", "+(data.state?(data.state+", "):"")+data.country_name  );
									$li.find("input:radio").val( data.id ).click();

									addressInfo = {address_id: data.id};
									checkoutPutRequest(addressInfo, function(res){
										$wrapper.find(".btn-area a.new_shipping").show();
										Checkout.Shipping.close();
										if(Checkout.Payment.isConfirmed())
											Checkout.Review.open();
										else
											Checkout.Payment.open();
										refreshCheckout(res);
									});
								});
							}else{
								addressInfo = {address_id: $wrapper.filter(".confirm").data('addr_id') };
								if(!addressInfo.address_id){
									$wrapper.find("ul.select_shipping li input:radio:checked").click();
									addressInfo = {address_id: $wrapper.filter(".confirm").data('addr_id') };
									if(!addressInfo.address_id){
										alert('Please select a shipping address');
										return;
									}
								}
								checkoutPutRequest(addressInfo, function(res){
									Checkout.Shipping.close();
									if(Checkout.Payment.isConfirmed())
										Checkout.Review.open();
									else
										Checkout.Payment.open();
									refreshCheckout(res);
								});
							}					
								
							
						})
						.on('click', "a.new_shipping", function(e){
							e.preventDefault();

							var $this = $(this), $form = $wrapper.find(".new");
							$wrapper.find(" > .saved").hide().end().find("> .new").show().end().find(".btn-area a.new_shipping").hide().end().find(".btn-area a.cancel").show();

							$form.find('input,select').each(function() {
								var $this = $(this);
								var name = $this.attr('name');
								if(name=="set_default"){
									this.checked = false;
								}else{
									$this.val('');
								}
							});
							$form.find("select[name='country']").val('US').change();
						})
						.on('click', "a.cancel", function(e){
							e.preventDefault();
							$wrapper.find(" > .saved").show().end().find("> .new").hide().end().find(".btn-area a.new_shipping").show().end().find(".btn-area a.cancel").hide();
						})
				},
				addShippingAddress: function(params, callback){		
					function error(msg) {
						if (typeof gettext == 'function') msg = gettext(msg);
						alert(msg);
					}

					if (params.fullname.length < 1) return error('Please enter the full name.');
					if (params.nickname.length < 1) return error('Please enter the address nickname (Home, Work, etc).');
					if (params.address1.length < 1) return error('Please enter a valid address.');
					if (params.city.length < 1) return error('Please enter the city.');
					if (params.zip.length < 1) return error('Please enter the zip code.');
					if (params.country == 'US') {
						var phone = params.phone.replace(/\s+/g, ''); 
						if (phone.length < 10 || !phone.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/)) return error('Please specify a valid phone number.');
					}
					
					$.ajax({
						type : 'POST',
						url  : '/add_new_shipping_addr.json',
						data : params,
						dataType : 'json',
						success  : function(json) {
							var $op, html='';
							switch (json.status_code) {
								case 0:
								case 2:
									if (json.message) alert(json.message);
			                        break;
								case 1:
									callback(json);
									break;
							}
						},
						complete : function() {
							
						}
					});
				}

			}

			Checkout.Payment = {
				$el : $("#container > .checkout-payment.wrapper"),
				isConfirmed: function(){
					return !!this.$el.data("payment_id");
				},
				open : function(){
					this.$el.show().filter(".confirm").hide().end().find("> div, >form").hide().filter(".saved:not(.status_)").show().end().end().find(".btn-area").show().find("a.new_payment").show().end().find("a.cancel").hide();
					$(".checkout-header").find("li.current").removeClass("current").end().find("li.payment").addClass("current");
					
					if( !this.$el.find("ul.select_payment > li").length ){
						this.$el.find(" > .saved:not(.status_)").hide().end().find(">form.new").show().end().find(".btn-area a.new_payment").hide();
						var $addr = Checkout.Shipping.$el.find("ul.select_shipping li.selected");
						this.$el.find(".new label[for=billing_saved]").html( $addr.data('address1')+"<br/>"+($addr.data("address2")?($addr.data("address2")+"<br/>"):"")+$addr.data("city")+","+$addr.data("state")+"<br/>"+$addr.data("country_name") );
						this.$el.find(".new [name=shipping_street_address]").val($addr.data('address1'));
						this.$el.find(".new [name=shipping_street_address2]").val($addr.data('address2'));
						this.$el.find(".new [name=shipping_city]").val($addr.data('city'));
						this.$el.find(".new [name=shipping_country_code]").val( $addr.data('country'));
						this.$el.find(".new [name=shipping_state]").val($addr.data('state'));
						this.$el.find(".new [name=shipping_postal_code]").val($addr.data('zip'));
					}

					$(".btn-checkout").attr('disabled','disabled');
				},
				close : function(){
					if(this.$el.find(">div.status_").is(":visible")) return;
					this.$el.hide().filter(".confirm").show().end().find("> div, > form").hide().end().find("> div.status_").show();
					if(this.$el.data('payment_id')){
						var $card = this.$el.find("ul.select_payment li.selected");
						if($card.length){
							this.$el.filter(".confirm").find("h3.stit").html("<b>Payment method</b> · <span class='card "+$card.data('type').toLowerCase()+"'></span> "+$card.data('type')+" - Ending in "+$card.data('last_digits')+" <a href='#' class='back'>Change</a>");
						}
					}else{
						this.$el.hide();
					}
				},
				isOpened : function(){
					return this.$el.filter(".confirm").is(":hidden");
				},
				init : function(){
					var $wrapper = this.$el;
					function selectPayment($li){
							
							var payment_id = $li.find("input:radio").val();
							
							$li.closest('ul').find('li').removeClass('selected').end().end().addClass('selected');
							$wrapper.find(".status_").find(".billing_address_").html($li.data('billing_address'));
					}

					this.$el
						.on('click', 'h3.stit a.back', function(e){
							e.preventDefault();					
							Checkout.Shipping.close();
							Checkout.Payment.open();
						})
						.on('click', '.saved ul.select_payment li input:radio', function(event){
							var $this = $(this);					
							selectPayment( $this.closest('li') );
						})
						.on('click', '.select_payment_', function() {
							var $this = $(this);
							if( $wrapper.find(".new").is(":visible")){
								var $form = $wrapper.find(".new");
								var params = getParam($form);
								
								if($wrapper.find("#billing_saved")[0].checked){
									for(k in params){
										if( k.startsWith("shipping_") ){
											var k2 = k.replace('shipping_','');
											params[k2] = params[k];
											delete params[k];
										}
									}
								}else{
									params.country_code = $form.find('[name=country_code]').find('option[value='+params.country_code+']').attr('data-code2');
									params.state = $form.find("[name=state]:visible").val();
									params.set_default = false;
								}
								$this.addClass('loading').attr('disabled','disabled');

								Checkout.Payment.addNewCard(params, function(data){
									$this.removeClass('loading').removeAttr('disabled');

									if(!data.card_id){
										alert(data.message||"Please input valid credit card info");
										return;
									}

									var $li = $( $wrapper.find("ul.select_payment > script").html() );
									$wrapper.find("ul.select_payment").append($li);
									$li.data('holder_name', data.card_holder_name).data('last_digits', data.card_last_digits).data('type', data.card_type).data('billing_address', data.card_holder_name+", "+data.billing_address.address1+", "+data.billing_address.city+", "+data.billing_address.state+", "+data.billing_address.postal_code+", "+data.billing_address.country);
									$li.find("label").addClass( data.card_type.toLowerCase() );
									$li.find("b.title").html( data.card_type + " <small>ending in "+data.card_last_digits+"</small>");
									$li.find("small.exp").html( data.card_expiration );					
									$li.find("input:radio").val( data.card_id );
									selectPayment( $li );
									$wrapper.data('payment_id', $wrapper.find("li.selected input:radio").val());

									Checkout.Payment.close();
									Checkout.Review.open();
								}, function(){
									$this.removeClass('loading').removeAttr('disabled');
								});
							}else{

								$wrapper.data('payment_id', $wrapper.find("li.selected input:radio").val());
								if(!$wrapper.data('payment_id')){
									alert("Please select a credit card");
									return;
								}
								Checkout.Payment.close();
								Checkout.Review.open();
							}

						})
						.on('click', ".payment-coupon dt > a", function(e){
							e.preventDefault();
							$(this).toggleClass('opened').parent().next().toggle();
						})
						.on('click', ".payment-coupon button.btn-apply", function(){
							var $this = $(this);
							var code = $(this).prev().val();
							var couponInfo = {"apply_coupon":true, "coupon_code":code};

							checkoutPutRequest(couponInfo, function(res){
								if(res.error){
									if( res.error.match(/^Invalid coupon code/) ) res.error = "Invalid coupon code";
									$this.next().html(res.error).show();
								}else{
									refreshCheckout(res);
								}
							});
						})
						.on('click', ".payment-coupon a.remove-coupon_", function(e){
							e.preventDefault();
							var code = $(this).attr('code');
							var couponInfo = {"apply_coupon":false, "coupon_code":code};

							checkoutPutRequest(couponInfo, function(res){
								refreshCheckout(res);
							});
						})
						.on('click', "a.new_payment", function(e){
							var $form = $wrapper.find("form.new");

							$form.find('input,select').each(function() {
								var $this = $(this);
								var name = $this.attr('name');
								if(name=="set_default"){
									this.checked = false;
								}else{
									$this.val('');
								}
								if(name=='country'){
									$this.val('US').change();
								}
							});
							var $addr = Checkout.Shipping.$el.find("ul.select_shipping li.selected");
							$form.find("label[for=billing_saved]").html( $addr.data('address1')+"<br/>"+($addr.data("address2")?($addr.data("address2")+"<br/>"):"")+$addr.data("city")+","+$addr.data("state")+"<br/>"+$addr.data("country_name") );
							$form.find("[name=shipping_street_address]").val($addr.data('address1'));
							$form.find("[name=shipping_street_address2]").val($addr.data('address2'));
							$form.find("[name=shipping_city]").val($addr.data('city'));
							$form.find("[name=shipping_country_code]").val( $addr.data('country'));
							$form.find("[name=shipping_state]").val($addr.data('state'));
							$form.find("[name=shipping_postal_code]").val($addr.data('zip'));
							var defaultCountryCode = $wrapper.find(".select_payment li.selected").data('country_code')||'US';
							var defaultCountry = $form.find("[name=country_code] [data-code2="+defaultCountryCode+"]").val();
							$form.find("[name=country_code]").val(defaultCountry).change();
							$form.find("p.card_number").attr('class','card_number').end().find("dl.billing dd:eq(0) input#billing_saved").click();
							$form.find(".btn-save").removeAttr('disabled');

							$wrapper.find("form.new").show().end().find(".saved:not(.status_)").hide().end().find(".btn-area a.new_payment").hide().end().find(".btn-area a.cancel").show();
						})
						.on('click', "a.cancel", function(e){
							e.preventDefault();
							$wrapper.find(" > .saved").show().end().find("> .new").hide().end().find(".btn-area a.new_payment").show().end().find(".btn-area a.cancel").hide();
						})
						
					if( this.$el.find(".saved ul.select_payment li.selected input:radio").length )
						this.$el.find(".saved ul.select_payment li.selected input:radio").click();
				},
				addNewCard: function(params, callback, callback_error){
				
					function error(msg) {
						if (typeof gettext == 'function') msg = gettext(msg);
						callback_error();
						alert(msg);
					}
					
					// check required fields
					if (!params.name)return error('Please enter the full name.');
					if (!params.street_address) return error('Please enter a valid address.');
					if (!params.city) return error('Please enter the city.');
					if (!params.postal_code) return error('Please enter the zip code.');
				
					if (!Stripe.card.validateCardNumber(params.card_number)) return error('Please enter a valid card number.');
					if (!Stripe.card.validateCVC(params.security_code)) return error('Please enter a valid security code.');
					if (!Stripe.card.validateExpiry(params.expiration_month, params.expiration_year)) return error('Please enter a valid expiration date.');
					
			        Stripe.card.createToken({
			            number: params.card_number,
			            exp_month: params.expiration_month,
			            exp_year: params.expiration_year,
			            cvc: params.security_code,
			            name: params.name,
			            address_line1: params.street_address,
			            address_line2: params.street_address2,
			            address_city: params.city,
			            address_state: params.state,
			            address_zip: params.postal_code,
			            address_country: params.country_code
			        }, function (status, response) {
			            if (response.error) {
			                // we did something unexpected - check response.error for details
			                callback_error();
			                if ('message' in response.error) {
			                	alert(response.error.message);
			                }
			            } else {
			                var endpoint, payload;
			                endpoint = '/settings/cards/stripe/add-card.json';
			                payload = { 'card_token': response['id'], 
			                    'address1': params.street_address, 'address2': params.street_address2,
			                    'city': params.city, 'state': params.state, 'country': params.country_code,
			                    'postal_code': params.postal_code, 'set_default': params.set_default };
			                $.ajax({
			                    type: 'post', url: endpoint, data: payload,
			                    success : function(response) {
			                        callback(response);
			                    },
			                    complete : function() {
			                        
			                    }
			                });
			            }
			        });
				}
			}

			Checkout.Review = {
				open : function(){
					$(".checkout-review, .terms, .order-price-summary").show();
					$(".checkout-header").find("li.current").removeClass("current").end().find("li.review").addClass("current");
					if( $(".btn-checkout").attr('is-available') == 'true' ){
						$(".btn-checkout").removeAttr('disabled');
					}else{
						$(".btn-checkout").attr('disabled','disabled');
					}
				},
				close : function(){
					$(".order-price-summary, .checkout-review, .terms").hide();
				},
				init: function(){
					$('#container')			
						.on('change', '.checkout-review .delivery-option input:radio', function(event){
							var seller_id = $(this).closest('[seller_id]').attr('seller_id');
							var deliveryOption = $(this).val();
							var info = {"shipping_option":{}};
							info['shipping_option'][seller_id] = parseInt(deliveryOption);

							checkoutPutRequest(info, function(res) {
								refreshCheckout(res);
							});
						})
						.on('click', '.checkout-review .optional a.note', function(event){
							event.preventDefault();
							var seller_id = $(this).closest('[seller_id]').attr('seller_id');
							var note = $(this).data('note')||'';

							var scTop = $('#container').scrollTop();
							$('#container').attr('data-sctop', scTop);
							var marginTop = $("#wrap").css('marginTop');
							$('#wrap').attr('data-margintop', marginTop).css('marginTop','');

							$('#container > :not(.checkout-header, .edit_seller_note, .add_gift_msg):visible').attr('current','true').hide();

							var $layer = $('#container > .edit_seller_note');
							$layer.data('seller_id',seller_id).find("textarea.text").val(note);
							$layer.show().find("textarea.text").focus();
						})
						.on('click', '.wrapper.edit_seller_note button.btn-continue', function(){
							var seller_id = $(".edit_seller_note").data('seller_id');
							var note = $(".edit_seller_note").find("textarea").val();

							var noteInfo = {'note_info':{}};
							noteInfo.note_info[seller_id] = note;

							checkoutPutRequest(noteInfo, function(res) {
								refreshCheckout(res);
							});
							$('#container > [current=true]').removeAttr('current').show();
							$('#container > .edit_seller_note').hide();
							$('#container').scrollTop( $('#container').attr('data-sctop') );
							$('#wrap').css('marginTop', $('#wrap').attr('data-margintop') );

						})
						.on('click', '.wrapper.edit_seller_note button.btn-cancel', function(){
							$('#container > [current=true]').removeAttr('current').show();
							$('#container > .edit_seller_note').hide();

							$('#container').scrollTop( $('#container').attr('data-sctop') );
							$('#wrap').css('marginTop', $('#wrap').attr('data-margintop') );
						})
						.on('click', '.checkout-review .optional .note a.remove', function(event){
							event.preventDefault();
							var seller_id = $(this).closest('[seller_id]').attr('seller_id');
							var noteInfo = {'note_info':{}};
							noteInfo.note_info[seller_id] = '';

							checkoutPutRequest(noteInfo, function(res) {
								refreshCheckout(res);
							});
						})
						.on('click', '.checkout-review .optional a.gift', function(event){
							event.preventDefault();
							var seller_id = $(this).closest('[seller_id]').attr('seller_id');
							var is_gift = true;// $(this).data('is_gift')||false;
							var gift_message = $(this).data('gift_message')||'';
							var scTop = $('#container').scrollTop();
							$('#container').attr('data-sctop', scTop);
							var marginTop = $("#wrap").css('marginTop');
							$('#wrap').attr('data-margintop', marginTop).css('marginTop','');

							$('#container > :not(.checkout-header, .edit_seller_note, .add_gift_msg):visible').attr('current','true').hide();

							var $layer = $('#container > .add_gift_msg');
							
							$layer.data('seller_id',seller_id).find("textarea.text").val(gift_message);
							$layer.find("input:checkbox")[0].checked = is_gift;
							if(is_gift){
								$layer.find("textarea").removeAttr('disabled');	
							}else{
								$layer.find("textarea").attr('disabled','disabled');	
							}
							
							$layer.show().find("textarea").focus();	
						})
						.on('click', '.wrapper.add_gift_msg input:checkbox', function(){
							if( this.checked ){
								$(".popup.add_gift_msg textarea").removeAttr('disabled');	
							}else{
								$(".popup.add_gift_msg textarea").attr('disabled','disabled');	
							}
						})
						.on('click', '.wrapper.add_gift_msg button.btn-continue', function(){
							var seller_id = $(".wrapper.add_gift_msg").data('seller_id');
							var is_gift = $(".wrapper.add_gift_msg").find("input:checkbox")[0].checked;
							var gift_message = $(".wrapper.add_gift_msg").find("textarea").val();

							var giftInfo = {'gift_info':{}};
							giftInfo.gift_info[seller_id] = {"is_gift": is_gift, "gift_message": gift_message};

							checkoutPutRequest(giftInfo, function(res) {
								refreshCheckout(res);
							});

							$('#container > [current=true]').removeAttr('current').show();
							$('#container > .add_gift_msg').hide();
							$('#container').scrollTop( $('#container').attr('data-sctop') );
							$('#wrap').css('marginTop', $('#wrap').attr('data-margintop') );
						})
						.on('click', '.wrapper.add_gift_msg button.btn-cancel', function(){
							$('#container > [current=true]').removeAttr('current').show();
							$('#container > .add_gift_msg').hide();
							$('#container').scrollTop( $('#container').attr('data-sctop') );
							$('#wrap').css('marginTop', $('#wrap').attr('data-margintop') );
						})
						.on('click', '.checkout-review .optional .gift a.remove', function(event){
							event.preventDefault();
							var seller_id = $(this).closest('[seller_id]').attr('seller_id');
							var giftInfo = {'gift_info':{}};
							giftInfo.gift_info[seller_id] = {"is_gift": false, "gift_message": ''};

							checkoutPutRequest(giftInfo, function(res) {
								refreshCheckout(res);
							});

						})
						.on('click', '.checkout-review a.save_for_later', function(e){
							e.preventDefault();
							var $this = $(this);
							$this.addClass('disabled');
							var item_id = $this.data('item_id');
							var option_id = $this.data('option_id');

							var url = "/rest-api/v1/checkout/item/"+item_id+(option_id?"/"+option_id:"")+"/later";

							$.ajax({
								type : 'POST',
								url  : url,
								data : {},
								dataType : 'json',
								success  : function(res){
									refreshCheckout();
								},
								complete : function(){
									$this.removeClass('disabled');
								}
							});
						})
						.on('click', '.checkout-review .cart-item-detail li a.remove', function(e){
							e.preventDefault();
							var $this = $(this);
							$this.addClass('disabled');

							params = {
								item_id : $this.data('item_id'),
								option_id : $this.data('option_id')
							};

							removeItem($this, params, function(){ 
								refreshCheckout();
							});		
						})				
						.on('click', '.checkout-review .sdd_option fieldset > a', function(event){
							event.preventDefault();
							$(this).hide().next().show();
						})

				}
			}

			Checkout.Shipping.init();
			Checkout.Payment.init();
			Checkout.Review.init();
			
			function removeItem($btn, data, callback){
				
				$btn.addClass('disabled').attr('disabled', true);
				var url = '/rest-api/v1/checkout/item/'+data.item_id;
				if(data.option_id) url += "/option/"+data.option_id;

				$.ajax({
					type : 'DELETE',
					url  : url,
					data : {},
					dataType : 'json',
					success  : callback || $.noop,
					complete : function(){				
						$btn.removeClass('disabled').removeAttr('disabled');
					}
				});
			};

			function renderShippingInfo(data){
				if(! Object.keys(data.sale_items_freeze)[0]) return;

				var addrId = data.sale_items_freeze[Object.keys(data.sale_items_freeze)[0]].shipping_addr_id;
				$(".checkout-shipping li input:radio[value="+addrId+"]").click();
			}

			function renderSummary(data){
				var $frm = $(".order-price-summary");

				$frm.find("li.total .price").html("$"+formatMoney(data.total_prices));
				$frm.find("li.subtotal_ .price").html("$"+formatMoney(data.subtotal_prices.replace(".00","")));
				$frm.find("li.shipping_ .price").html("$"+formatMoney(data.shipping_costs.replace(".00","")));
				$frm.find("li.tax_ .price").html("$"+formatMoney(data.sales_taxes.replace(".00","")));

				var coupontAmount = 0;
				var fancyRebate = 0;
				for(k in data.sale_items_freeze){
					var item = data.sale_items_freeze[k];
					if(item.coupon_amount) coupontAmount+= item.coupon_amount;
					if(item.fancy_rebate) fancyRebate+= item.fancy_rebate;
				}
				if(coupontAmount > 0)
					$frm.find("li.coupon_").show().find(".price").html("- $"+formatMoney(coupontAmount.toFixed(2).replace(".00","")));
				else
					$frm.find("li.coupon_").hide();
				if(fancyRebate > 0)
					$frm.find("li.rebate_").show().find(".price").html("- $"+formatMoney(fancyRebate.toFixed(2).replace(".00","")));
				if(data.fancy_money_amount > 0)
					$frm.find("li.giftcard_").show().find(".price").html("- $"+formatMoney(data.fancy_money_amount.replace(".00","")));

				$frm.find(".currency_price").attr('price', data.total_prices.replace(".00",""));
				refresh_currency();
			}

			function renderSaleItems(data){
				var sellerTemplate = $("script#seller_template").html();
				var itemTemplate = $("script#cart_item_template").html();
		        var payment_method = 'stripe';
				var itemCount = 0;

		        var $couponArea = $(".checkout-payment .payment-coupon dd");
		        var couponInfo = data.sale_items_freeze[ Object.keys(data.sale_items_freeze)[0] ].coupons;
		        couponInfo = couponInfo && couponInfo[0];
		        if( couponInfo ){        	
		        	$couponArea.find(">ul li").html("<b>"+couponInfo.code+ " · <a href='#' class='remove-coupon_' code='"+couponInfo.code+"'>Remove</a></b> "+couponInfo.description);
		        	$couponArea.show().find(">input,>button,>div").hide().end().find(">ul").show();
		        }else{
		        	$couponArea.find(">input,>button").show().end().find(">div,>ul").hide();
		        }

		        var isAvailable = true;
		        $(".checkout-review [seller_id]").attr("mark-delete",true);
				for(k in data.sale_items_freeze){
					var seller = data.sale_items_freeze[k];
					var $sellerEl = $(".checkout-review [seller_id="+k+"]");
					if(!$sellerEl.length) $sellerEl = $(sellerTemplate);
					$sellerEl.attr('seller_id', k);
					$sellerEl.find('> h4').html(seller.items[0].brand_name);

					if(!seller.checkout_available) isAvailable = false;
					$sellerEl.find(".sdd_option").hide();
					
					$sellerEl.find("[item_id]").attr("mark-delete", true);

					$(seller.items).each(function(){
						var item = this;
						
						var $el = $sellerEl.find("[item_id="+item.id+"]");
						if(!$el.length) $el = $(itemTemplate);
						$el.attr('item_id', item.id)
							.find(".item").attr("href", this.item_url)
								.find("img").css("background-image","url('"+this.image_url+"')").end()
								.find(".title").html(this.title).end()
							.end()
							.find(".price").html("$"+formatMoney(this.item_price.replace(".00",""))).end()
							.find(".qty").html('Quantity: '+this.quantity).end();
						if(parseInt(this.item_retail_price) && this.item_price!=this.item_retail_price){
							$el.find(".price").addClass("sales").html('<small class="before">'+ "$"+formatMoney(this.item_retail_price.replace(".00",""))+'</small>'+" $"+formatMoney(this.item_price.replace(".00","")))
						}
						if(this.option_id){
							$el.find("._option").css('display','block').html(this.option);
						}
						
						if(item.error_message){
							$el.find(".error").find('b').html(item.error_message).end().show();
							//$el.find(".action").show().end().removeClass('hide-action');
							$el.find(".delivery-option").hide();
							$el.find("a.save_for_later, a.remove").data('cid', item.id).data('sicid', item.id).data('item_id', item.sale_id).data('option_id', item.option_id);
						}else{
							$el.find(".error, .action").hide().end().addClass('hide-action');
							$el.find(".delivery-option").show();
						}

						$el.removeAttr('mark-delete');
						$el.appendTo( $sellerEl.find("ul") );
						itemCount++;
					})
					var shipping_option = null;
					$sellerEl.find(".delivery-option ul").empty();
					if (seller.items[0].item_type != 'VANITY') {
						var shipping_options_length = $(seller.shipping_options).length;
						$(seller.shipping_options).each(function(){
							var amount = "$"+this.amount.toFixed(2);
							if(this.amount==0){
								amount = "Free";
							}
							var html = "";
							var shipped_from = seller.ships_from_name;
							if(shipping_options_length==1){
								this.label = 'Shipping';
								$sellerEl.find(".delivery-option b.tit").hide();
								html = "<li><label for='seller_shipping_"+k+"_"+this.id+"'><b>"+this.label+" - "+amount+"</b> "+(shipped_from?('<span title="' + seller.ships_from_name + '">Shipped from ' + seller.ships_from_name + "</span>"):"")+"<small>"+this.detail+"</small></label></li>";
							}else{
								$sellerEl.find(".delivery-option b.tit").show();
								html = "<li><input type='radio' id='seller_shipping_"+k+"_"+this.id+"' name='seller_shipping_"+k+"' value='"+this.id+"' "+(this.id==seller.shipping_selected?'checked':'')+"> <label for='seller_shipping_"+k+"_"+this.id+"'><b>"+this.label+" - "+amount+"</b>" +(shipped_from?('<span title="' + seller.ships_from_name + '">Shipped from ' + seller.ships_from_name + "</span>"):"")+"<small>"+this.detail+"</small></label></li>";
							}
							$sellerEl.find(".delivery-option ul").append($(html));
						})
						if( seller.shipping_options.length == 1){
							$sellerEl.find(".delivery-option").addClass('disabled');
						}else{
							$sellerEl.find(".delivery-option").removeClass('disabled');
						}
						if( !seller.shipping ){
							$sellerEl.find('.delivery-option').addClass('free');
						}else{
							$sellerEl.find('.delivery-option').removeClass('free');
						}
					}
					
					$sellerEl.find("[item_id][mark-delete]").remove();

					var note = data.note_info[ k ];
					var giftInfo = data.gift_info[ k ];
					
					if(note || (giftInfo && giftInfo.is_gift)){
						$sellerEl.find(".optional.edit").show();
					}else{
						$sellerEl.find(".optional.edit").hide();
					}
					if(note)
						$sellerEl.find("a.note").data('note',note||'').end().find("div.note > span").html(note + " · ").end().find(".optional.add a.note").hide().end().find(".optional.edit > div.note").show();
					else
						$sellerEl.find("a.note").data('note','').end().find("div.note > span").html('').end().find(".optional.add a.note").show().end().find(".optional.edit > div.note").hide();
					if(giftInfo && giftInfo.is_gift) {
						$sellerEl.find("a.gift").data('is_gift',true).data('gift_message',giftInfo.gift_message||'').end().find("div.gift > span").removeClass('empty').html(giftInfo.gift_message + " · ").end().find(".optional.add a.gift").hide().end().find(".optional.edit > div.gift").show();
						if (!giftInfo.gift_message) {
							$sellerEl.find("div.gift > span").addClass('empty').html('No gift message added · ');
						}
					}
					else {
						$sellerEl.find("a.gift").data('is_gift',false).data('gift_message','').end().find("div.gift > span").html('').end().find(".optional.add a.gift").show().end().find(".optional.edit > div.gift").hide();
					}

					if( note || (giftInfo && giftInfo.is_gift) ){
						$sellerEl.find(".optional.add span").hide();
					}else{
						$sellerEl.find(".optional.add span").show();
					}

					//if(samedayMessage)
					//	$(".cart-list ._sameday").show().find(".text").html(samedayMessage);

					$sellerEl.removeAttr('mark-delete');
					$sellerEl.appendTo($(".checkout-review"));
		            try {
		                track_event('Begin Checkout', { 'payment method': payment_method, 'type': 'saleitem', 'seller id': k});
		            }catch(e) {}
				}
				$(".checkout-review [seller_id][mark-delete]").remove();

				$(".btn-checkout").attr('is-available', isAvailable?'true':'false');

				if(isAvailable && !Checkout.Shipping.isOpened() && !Checkout.Payment.isOpened()){
					$(".btn-checkout").removeAttr('disabled');
				}else{
					if (!window.use_amex_express) {
						$(".btn-checkout").attr('disabled', 'disabled');
					}
				}
				if ($('.checkout-giftoption').length) {
					for(k in data.sale_items_freeze){
						$('.checkout-giftoption').attr('seller_id', k);
					}
					var giftInfo = data.gift_info[ k ];
					if (giftInfo && giftInfo.is_gift) {
						$('.checkout-giftoption').find('li').removeClass('selected');
						$('.checkout-giftoption').find('li > input#giftopt_t').attr('checked', true).closest('li').addClass('selected');
						$('.checkout-giftoption').find('li.selected > textarea').val(giftInfo.gift_message);
					}
				}
				
			}

			function render(data){
				$("[name=checkout_id]").val(data.id);
				renderShippingInfo(data);
				renderSummary(data);
				renderSaleItems(data);

				if(data.payment_gateway == 6) {
		            if(data.sale_items_freeze.credit_cards && data.sale_items_freeze.credit_cards.cards[0]){
		                $("[name=payment_id]").val(data.sale_items_freeze.credit_cards.cards[0].id);
		            }
		        }
			}

			var isBegin = true;
			function refreshCheckout(json){
				if(json){
					render(json);
				}else{
					$.ajax({
						type : 'GET',
						url  : '/rest-api/v1/checkout',
						data : location.args,
						success  : function(json){
							if(isBegin){
								var param = {'payment method':'stripe', type:'saleitem'}
								param['seller id'] = Object.keys( json.sale_items_freeze).join(", ");

								track_event('Begin Payment', param ); 
								isBegin = false;
							}
							render(json);
						}
					});	
				}
			}
			refreshCheckout();

			$('button.btn-checkout').click(function(event){
	            $('form.payment_').submit() ;
	        })

	        $(".payment_").submit(function(e){
	            var $this = $(this);

	            function saveCheckoutPayment() {
	                var checkoutId = $("[name=checkout_id]").val();
	                var paymentId = $("#container > .checkout-payment.wrapper ul.select_payment li.selected input:radio").val()||"-1";
	                var params = {
	                            "payment_gateway": 6,
	                            "payment_id": paymentId,
	                            "ordered_via": "FancyAnywhere"
	                            };
	                if( $("[name=uid]").val() )params['uid'] = $("[name=uid]").val();
	                $.ajax({
	                    type : 'POST',
	                    url  : '/rest-api/v1/checkout/payment/'+checkoutId,
	                    contentType: "application/json; charset=utf-8",
	                    data : JSON.stringify(params),
	                    processData : false,
	                    success  : function(res){
	                        if(res.error){
	                            alert(res.error);
	                            document.location.href="/embed/cart";
	                        }else{
	                            $(".payment_").attr('paid','true').submit();
	                        }                   
	                    },
	                    error: function(res){
	                        alert("We failed to process your order. Please try again or contact cs@fancy.com");
	                        document.location.href="/embed/cart";
	                    }
	                });
	            }

	            if(!$(this).attr('paid') && !$(".btn-checkout").is(".loading")){
	                $('.btn-checkout').addClass('loading');
	                e.preventDefault();
	                saveCheckoutPayment();
	            }
	            
	        })  

		})();

		// confirm
		$('#wrap .btn-back_').click(function(){ close(); });
	});

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
})(jQuery);

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

