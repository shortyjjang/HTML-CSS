jQuery(function($){
	var View = namespace('Fancy.View'), globals = namespace('Fancy.globals');

	View.Signup = Backbone.View.extend({
		el : '#signup',
		events : {
			'click .btn-create' : 'onCreate',
			'click button.btn-sign' : 'onGoSignin',
			'click span.error-msg' : 'onClickErrorMsg',
			'focus input' : 'onFocusInput',
			'keypress input' : 'onCreate'
		},
		initialize : function(options) {
			if (!options) options  = {};

			_.bindAll(this, 'render');

		},
		open : function() {
			this.$('input[name=email]').val('').parent().removeClass("error");
			this.$('input[name=fullname]').val('').parent().removeClass("error");
			this.$('input[name=password]').val('').parent().removeClass("error");
			this.$el.parent().find(" > .sign, > .user-info").hide();
			this.$el.show();

			return this;
		},
		close : function() {
			return this;
		},
		render : function() {
			return this;
		},
		onCreate: function(e){
			if(e.type=='keypress' && e.which != 13) return;

			var $this = this;
			var $target = $(e.currentTarget);
			var $email = this.$('input[name=email]');
			var $fullname = this.$('input[name=fullname]');
			var $password = this.$('input[name=password]');
			
			var isValid = true;
			if(!$email.val()){
				var $errorMsg = $email.parent().addClass("error").find("span.error-msg");
				$errorMsg.text($errorMsg.attr("data-msg-empty"));
				isValid = false;
			}
			else if (!/^[\w\.%+-]+@[\w\.\-]+\.[A-Za-z]{2,4}$/.test($email.val())){
				var $errorMsg = $email.parent().addClass("error").find("span.error-msg");
				$errorMsg.text($errorMsg.attr("data-msg-invalid"));
				isValid = false;
			}
			if(!isValid) return;
			$target[0].disabled = true;
			$this.$el.addClass('loading');

			$.post('/email_signup.json', {'email':$.trim($email.val())},
				function(response){
					if (response.status_code != undefined && response.status_code == 1) {
						globals.userInfo = {fullname:response.fullname, email:response.email};
						globals.viewUserInfo.open();
					} else if(response.status_code != undefined && response.status_code ==0 && response.error == 'email_duplicate'){
						globals.viewSignin.open({email: $email.val(), title:'You already have a Fancy account'});
					} else if (response.status_code != undefined && response.status_code == 0) {
						var $errorMsg = $email.parent().addClass("error").find("span.error-msg");
						$errorMsg.text(response.message);
					}
					$target[0].disabled = false;
					$this.$el.removeClass('loading');
				},
				'json'
			);
		},
		onGoSignin: function(e){
			if (e) e.preventDefault();
			globals.viewSignin.open();
		},
		onClickErrorMsg: function(e){
			var $target = $(e.currentTarget);
			$target.parent().removeClass("error").find("input").trigger("focus");
		},
		onFocusInput: function(e){
			var $target = $(e.currentTarget);
			$target.parent().removeClass("error");
		}
	});


	View.TwitterSignup = Backbone.View.extend({
		el : '#twitter-signup',
		events : {
			'click .btn-create' : 'onCreate',
			'click span.error-msg' : 'onClickErrorMsg',
			'focus input' : 'onFocusInput',
			'keypress input' : 'onCreate'
		},
		initialize : function(options) {
			if (!options) options  = {};

			_.bindAll(this, 'render');

		},
		open : function(username) {
			this.$('input[name=email]').val('').parent().removeClass("error");
			this.$('input[name=fullname]').val('').parent().removeClass("error");
			this.$el.parent().find(" > .sign, > .user-info").hide();
			this.$el.find("p.linked-tw b").html("@"+username);
			this.$el.show();

			return this;
		},
		close : function() {
			return this;
		},
		render : function() {
			return this;
		},
		onCreate: function(e){
			if(e.type=='keypress' && e.which != 13) return;

			var $this = this;
			var $target = $(e.currentTarget);
			var $email = this.$('input[name=email]');
			var $fullname = this.$('input[name=fullname]');
			
			var isValid = true;
			if(!$fullname.val()){
				$fullname.parent().addClass("error");
				isValid = false;
			}
			if(!$email.val()){
				var $errorMsg = $email.parent().addClass("error").find("span.error-msg");
				$errorMsg.text($errorMsg.attr("data-msg-empty"));
				isValid = false;
			}
			else if (!/^[\w\.%+-]+@[\w\.\-]+\.[A-Za-z]{2,4}$/.test($email.val())){
				var $errorMsg = $email.parent().addClass("error").find("span.error-msg");
				$errorMsg.text($errorMsg.attr("data-msg-invalid"));
				isValid = false;
			}
			if(!isValid) return;
			$target[0].disabled = true;
			$this.$el.addClass('loading');
			

			$.post("/twitter_signup.xml", {'email':$.trim($email.val()), 'fullname':$.trim($fullname.val())}, 
				function(xml){
					if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
						globals.userInfo = {fullname:$fullname.val(), email:$email.val()};
						globals.viewUserInfo.open();
					}
					else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
						var msg = $(xml).find("message").text();
						var err = $(xml).find("error").text();
						if (err.indexOf('email')>=0){
							var $errorMsg = $email.parent().addClass("error").find("span.error-msg");
							$errorMsg.text(msg);
						}else{
							alert(msg);
						}
					 }

					$target[0].disabled = false;
					$this.$el.removeClass('loading');
				 }, "xml");

		},
		onClickErrorMsg: function(e){
			var $target = $(e.currentTarget);
			$target.parent().removeClass("error").find("input").trigger("focus");
		},
		onFocusInput: function(e){
			var $target = $(e.currentTarget);
			$target.parent().removeClass("error");
		}
	});

	View.Signin = Backbone.View.extend({
		el : '#signin',
		events : {
			'click .btn-signin' : 'onSignin',
			'click a.go-back' : 'onGoBack',
			'click a.go-pw' : 'onGoForgotPassword',
			'click span.error-msg' : 'onClickErrorMsg',
			'click .sns .btn-fb' : 'onFBSignin',
			'click .sns .btn-tw' : 'onTWSignin',
			'focus input' : 'onFocusInput',
			'keypress input' : 'onSignin'
		},
		initialize : function(options) {
			if (!options) options  = {};

			this._initFB();
			this._initGPlus();
			this._initTwitter();

			_.bindAll(this, 'render');
		},
		_initFB : function(){
			
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
						{scope:'email,user_friends,user_birthday'}
					);
		        }
		    }
			// add script
			$('<script />').appendTo('#fb-root').attr('src', 'https://connect.facebook.net/en_US/sdk.js');
			  
		},
		_initGPlus : function(){

			window.gplus_clicked = false;

			window.visible_actions = "http://schemas.google.com/AddActivity"
			window.visible_actions += " http://schemas.google.com/BuyActivity"
			window.visible_actions += " http://schemas.google.com/CommentActivity"
			window.visible_actions += " http://schemas.google.com/CreateActivity"

			window.clientid_ = "870365319043-ljas5u3l1p8uv7a343i6ludrpmkv5mpj.apps.googleusercontent.com";
			window.scope_ = "https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email";

			window.cookiepolicy_url = document.location.protocol+"//"+document.location.host;
			window.sign_options = {
			    clientid : clientid_,
			    accesstype : "offline",
			    apppackagename : "com.thefancy.app",
			    callback : "onSignInCallback",
			    scope : scope_,
			    cookiepolicy : cookiepolicy_url,
			    requestvisibleactions : visible_actions
			};

			window.onSignInCallback = function(authResult) {
			    if (authResult.error == 'access_denied' || authResult.error == 'user_signed_out') return false;
			    if (window.___gcfg.isSignedOut) {
			        if (gapi.auth && gapi.auth.getToken() != null) {
			            gapi.auth.signOut();
			        }
			        return;
			    }

			    if (typeof authResult == "undefined" || 
			        typeof authResult.code == "undefined" && typeof authResult.access_token == "undefined") {
			        if (gplus_clicked) {
			            alert(gettext("Sorry, we couldn't sign you in. Please try again."));
			            location.reload();
			        }
			        return;
			    }
			    var result = authResult;
			    var ajaxEndpoint = '/social/check_login_google.json';
			    ajaxEndpoint = location.protocol == 'http:' ? "https://" + window.location.host + ajaxEndpoint : ajaxEndpoint;
			    var origin = location.pathname;
			    var params = {}
			    if (result.code) params['code'] = result.code;
			    if (result.state) params['state'] = result.state;
			    if (result.refresh_token) params['refresh_token'] = result.refresh_token;
			    if (result.redirect_state) params['redirect_state'] = result.redirect_state;
			    if (origin) params['origin'] = origin;
			    params['autosignin'] = gplus_clicked ? "false" : "true";

			    var ajax_options = {};
			    ajax_options.type = 'POST';
			    ajax_options.url = ajaxEndpoint;
			    ajax_options.dataType = 'json';
			    ajax_options.data = params;
			    ajax_options.success = function(json) {
			        if (!json.status_code) {
			            if (gplus_clicked) alert(json.message);
			        } else {
			        	if(json.url){
					        var url  = '/social/signup_google.json';

					        $.ajax({
					            type : 'POST',
					            url  : url,
					            data : {fullname:json.fullname, email:json.email},
					            dataType : 'json',
					            success  : function(data){
					            	if(data.status_code == 1){
						            	globals.userInfo = {fullname:json.fullname, email:json.email};
										globals.viewUserInfo.open();
									}else{
										alert(data.message);
									}
					            },
					            complete : function(){					                
					            }
					        });
			        		
			        	}else{
			        		globals.userInfo = {fullname:json.fullname, email:json.email};
							globals.viewUserInfo.open();
			        	}
			        }
			    }
			    if (location.protocol == 'http:') {
					ajax_options.xhrFields = {withCredentials: true};
					ajax_options.crossDomain = true;
			    }
			    $.ajax(ajax_options);
			};


			function initialize_google() {
			    if (typeof gapi == "undefined") {
			        setTimeout(initialize_google, 50);
			        return;
			    }

			    $("#fancy-g-signin").on('click', function() {
				   gplus_clicked = true;
			       window.___gcfg.isSignedOut = false;
			    });


			    if ($('#fancy-g-signin').length > 0) {
				   gapi.signin.render('fancy-g-signin', sign_options);
			    }

			    if ($('.g-plusone').length > 0) {
			        gapi.plusone.go();
			    }
			}
			initialize_google();
		},
		_initTwitter : function(){
			var $this = this;
			if(/\?from_twitter_auth=1/.test(location.search)){
				$.ajax({
					type : 'post',
					url  : '/apps/twitter/check.xml',
					dataType : 'xml',
					success  : function(xml) {
						if($(xml).find('status_code').length) {
							$this.onTwitterLoggedin();
						}
					}
				});
			}

		},
		onTwitterLoggedin : function(){
			var params={};

			$.ajax({
				type : 'POST',
				url  : '/login_twitter_user.xml',
				data : params,
				dataType : 'xml',
				success  : function(xml){
					var $xml = $(xml), $st = $xml.find('status_code'), $url = $xml.find('url');
					if(!$st.length) return;
					if ($st.text()==1) {
						var url = $(xml).find("url").text();
						var email = $(xml).find("email").text();
						var fullname = $(xml).find("fullname").text();
						if(url == "/register"){
							var username = $(xml).find("username").text();
							globals.viewTwitterSignup.open(username);
						}else{
							globals.userInfo = {fullname:fullname, email:email};
							globals.viewUserInfo.open();
						}
						
					} else if ($st.text() == 0) {
						  alert($xml.find("message").text());
					}
				}
			});
		},
		open : function(option) {
			var email = (option && option.email) || '';
			var title = (option && option.title) || 'Sign in with your email address';
			this.$('input[name=email]').val(email).parent().removeClass("error");
			this.$('input[name=password]').val('').parent().removeClass("error");
			this.$('fieldset > h3').text(title);
			this.$el.parent().find(" > .sign, > .user-info").hide();
			this.$el.show();
			if(email) this.$('input[name=password]').focus();
			else this.$('input[name=email]')
			return this;
		},
		close : function() {
			return this;
		},
		render : function() {
			return this;
		},
		onSignin: function(e){
			if(e.type=='keypress' && e.which != 13) return;

			var $this = this;
			var $target = $(e.currentTarget);
			var $email = this.$('input[name=email]');
			var $password = this.$('input[name=password]');
			
			var isValid = true;
			if(!$email.val()){
				var $errorMsg = $email.parent().addClass("error").find("span.error-msg");
				$errorMsg.text($errorMsg.attr("data-msg-empty"));
				isValid = false;
			}
			if(!$password.val()){
				var $errorMsg = $password.parent().addClass("error").find("span.error-msg");
				$errorMsg.text($errorMsg.attr("data-msg-empty"));				
				isValid = false;
			}
			if(!isValid) return;
			$target[0].disabled = true;
			$this.$el.addClass('loading');
			$.post('/login.json', {'username':$.trim($email.val()), 'password':$password.val(), 'callback':''},
				function(response){
					if (response.status_code != undefined && response.status_code == 1) {
						globals.userInfo = {fullname:response.fullname, email:response.email};
						globals.viewUserInfo.open();
					} else if (response.status_code != undefined && response.status_code == 0) {
						alert(response.message);
					}
					$target[0].disabled = false;
					$this.$el.removeClass('loading');
				},
				'json'
			);
			
		},				
		onGoBack: function(e){
			if (e) e.preventDefault();
			globals.viewSignup.open();
		},
		onGoForgotPassword: function(e){
			if (e) e.preventDefault();
			globals.viewForgotPassword.open();
		},		
		onClickErrorMsg: function(e){
			var $target = $(e.currentTarget);
			$target.parent().removeClass("error").find("input").trigger("focus");
		},
		onFocusInput: function(e){
			var $target = $(e.currentTarget);
			$target.parent().removeClass("error");
		},
		onFBConnected: function(perms, fb_source){
			var $this = this;
		    param = {}
		    param['perms']=perms;
		    var from_oauth_authorize = null;

			if (fb_source != undefined && fb_source.length > 0) {
				param['fb_source'] = fb_source;
			}
		    
			$.post("/login_fb_user.xml", param,
				function(xml){
					if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1 ) {
						var email = $(xml).find("email").text();
						var fullname = $(xml).find("fullname").text();
						if(!email){
							$.post("/facebook_signup.xml",{}, 
							       function(xml){
									   if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
											$this.onFBConnected('', false);
									   }
									   else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
							                var msg = $(xml).find("message").text();
							                alert(msg);
									   }
							       }, "xml");
						}else{
							globals.userInfo = {fullname:fullname, email:email};
							globals.viewUserInfo.open();
						}
					}
					else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
						alert($(xml).find("message").text());
					}
					else {
						//alert('failed');
					}
				}, "xml");
		},
		onFBSignin : function(e){
			var $this = this;
			var expire = new Date();
	        expire.setDate(expire.getDate() - 1);
	        document.cookie = 'ck_sns_su' + '=; path=/; expires='+expire.toUTCString();

			if(!window.FB) return false;

		    $.post("/fb_signup_log/open");
			FB.login(
				function(response2) {
	                if (response2.authResponse) {
		                $.post("/fb_signup_log/connected");

	                    $this.onFBConnected('', false);
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
				{scope:'email,user_friends,user_birthday'}
			);
		},
		onTwitterConnected : function(popup,url,success, failure) {
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
		},
		onTWSignin : function(e){
			var $this = this;
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
				popup = window.open("about:blank", '_blank', 'height=400,width=800,left=250,top=100,resizable=yes', true);
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
						$this.onTwitterConnected(
							popup,
							$url.text(),
							function(xml){
								var $xml = $(xml), $st = $xml.find('status_code');

								if($st.length && $st.text()==1){
									$this.onTwitterLoggedin();
								}
							}
						);
	                } else if ($st.text()==0) {
						popup.close();
	                    alert($xml.find("message").text());
	                }
	        }, "xml");
		}
	});

	View.UserInfo = Backbone.View.extend({
		el : '#user_info',
		events : {
			'click a.go-signout' : 'onSignout'
		},
		initialize : function(options) {
			if (!options) options  = {};

			this._template = _.template( this.$el.find("script").html() );
            this._loggedIn = this.$el.is(':visible');
			_.bindAll(this, 'render');
		},
        isLoggedIn : function() {
            return this._loggedIn;
        },
		open : function() {
            this._loggedIn = true;
			this.trigger('login');
			this.render();
			this.$el.parent().find(" > .sign, > .user-info").hide();
			this.$el.show();
			return this;
		},
		close : function() {
			return this;
		},
		render : function() {
			this.$el.find("p").html( this._template( globals.userInfo ) );
			return this;
		},
		onSignout: function(e){
			var $this = this;
			$.get('/logout.json', {},
				function(response){
                    $this._loggedIn = false;
					globals.userInfo = {};
					$this.trigger('logout');
					globals.viewSignup.open();
				},
				'json'
			);
			
		}
	});

	View.ForgotPassword = Backbone.View.extend({
		el : '#forgot_password',
		events : {
			'click a.go-back' : 'onGoBack',
			'click button.btn-reset' : 'onReset'
		},
		initialize : function(options) {
			if (!options) options  = {};

			_.bindAll(this, 'render');
		},
        isLoggedIn : function() {
            return this._loggedIn;
        },
		open : function() {
            this._loggedIn = true;
			this.trigger('login');
			this.render();
			this.$el.parent().find(" > .sign, > .user-info").hide();
			this.$el.show();
			return this;
		},
		close : function() {
			return this;
		},
		render : function() {
			return this;
		},
		onGoBack: function(e){
			globals.viewSignin.open();
		},
		onReset: function(e){
			var $this = this;
			var email = this.$el.find("input[name=email]").val();
			if(!email){
				alert("Please enter your email address");
				this.$el.find("input[name=email]").focus();
				return;
			}
			var param = {email:email};
			$.post('/reset_password.xml', param,
				function(xml){
                    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                       $this.$el.find("input[name=email]").val('');
					   alert('Reminder sent. Check your email momentarily.');
					   globals.viewSignin.open();
                   }
                   else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
					   var msg = $(xml).find("message").text();
					   alert(msg);
                   }  
				},
				'xml'
			).fail(function() {
		    	alert( "Error occured. please try again." );
			})
			
		}
	});


});
