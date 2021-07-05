jQuery(function($){

    $('form input#email').keyup(function() {
	var $this = $(this), $form = $this.closest('form');
	var email = $.trim($form.find('#email').val()||'');
	var $good = $('#new-sign .sns-frm .check-email ');
	if ($good.length > 0) {
	    if (email.search(emailRegEx) == 0) { // see common/util.js to change emailRegEx
		$good.show();
	    } else {
		$good.hide();
	    }
	}
    });

    $('form button.sign').click(function(event){

	var $this = $(this), $form = $this.closest('form'), $fieldset = $form.find('fieldset');
	var username = $.trim($form.find('#username').val()||'');
	var email = $.trim($form.find('#email').val()||'');
	var passwd = $.trim($form.find('#user_password').val()||'');
	var user_id = $.trim($form.find('#user_id').val()||'');
	var fullname = $.trim($form.find('#fullname').val()||'');
	var referrer = $.trim($form.find('.referrer').val() || '');
	var invitation_key = $.trim($form.find('.invitation_key').val() || '');
	var illegalCharsUsername = /\W/; // allow letters, numbers, and underscores
	var is_brand_store = $('#brandSt').is(':checked');

	//<!-- Captcha -->
	//challenge = ($('#recaptcha_challenge_field').val()||'').trim();
	//cap_resp  = ($('#recaptcha_response_field').val()||'').trim();
	//<!-- / Captcha -->

	$form.find('input.error').removeClass('error').end().find('div.error').hide();
	$form.find('input.error').removeClass('error').end().find('p.error').hide();
	$form.find('.error-label').hide(); 

	function displayError(fieldSelector, msg) {
		//var $error = $form.find('div.error');
		var $error = $form.find(fieldSelector)
		//msg = gettext(msg);

		if ($error.length > 0) { 
			$error.show().text(msg)
			return false; 
		}
		
		$error = $form.find('p.error-message'); 

		if ($error.length >  0) {
			//$error.show().find('span.message').text(msg);
			$error.show().text(msg);
		} else {
			$error = $form.find('p.error');
			if ($error.length >  0) {
				$error.show().html('<span class="icon"></span>' + msg);
			} else {
				alert(msg);
			}
		}
		return false;
	};

	if(username.length <=0 || username==$fieldset.find('#username').attr('placeholder').trim()){
	    return displayError('#error-username', 'Please enter username.');
	}

        if(invitation_key == '' && email.search(emailRegEx) == -1){ // see common/util.js to change emailRegEx
	    return displayError('#error-email', 'A valid email address is required.');
        }

	if(username.length <3){
	    return displayError('#error-username', 'username must be greater than 2 characters long.');
	}

	if(fullname==$fieldset.find('#fullname').attr('placeholder').trim()){
	    fullname = '';
	}

	if (illegalCharsUsername.test(username)){
	    return displayError('#error-username', 'Please use alphanumeric characters for your username.');
	}

	if(passwd.length <=0 || passwd==$fieldset.find('input#user_password').attr('placeholder').trim()){
	    return displayError('#error-user_password', 'Please enter password.');
	}

        if (passwd.length < 6) {
	    return displayError('#error-user_password', "Password should be 6 characters or more.");
        }
	//<!-- Captcha -->
	//if(cap_resp.length <=0){
 	//	return displayError('#recaptcha_response_field','Please enter the two words in the captcha box.');
	//}
	//<!-- / Captcha -->


	var param = {
	    'username'  : username,
	    'password'  : passwd,
	    'fullname'  : fullname,
	    'user_id'   : user_id,
	    'email'     : email,
	    'next'		: '/fancyit?v2'
	};

	if (invitation_key.length > 0) { param['invitation_key']=invitation_key; }
	if (referrer.length > 0) { param['referrer']=referrer; }

        
	//<!-- Captcha -->
	//if (challenge.length > 0) { param['challenge']=challenge; }
	//if (cap_resp.length > 0) { param['response']=cap_resp; }
	//<!-- / Captcha -->

	$this.attr('disabled', true).css({'cursor': 'default'});

    var http_post="/invitation_signup";
    var https_post="/invitation_signup.json";
    var from_popup = $this.attr('from_popup');
    if (typeof(from_popup) != undefined && from_popup === 'true'){
            http_post="/email_signup";
            https_post="/settings_account.json";
    }
	// use xhr when current page is on https, else use iframe proxy
	if(document.location.protocol=="https:"){		
		$.post(
		    https_post, param,
		    function(response){
			if (response.status_code != undefined && response.status_code == 1) {
			    location.href=$(".register input[name=next]").val();
			} else if (response.status_code != undefined && response.status_code == 0) {
			    var msg = response.message;
			    //var error = response.error;
	                    if (response.error != undefined && response.error.indexOf('email')>=0){
	 			displayError('#error-email', msg);
			    }
			    else if (response.error != undefined && response.error.indexOf('username')>=0) {
	 			displayError('#error-username', msg);
			    }
			    else if(error.indexOf('captcha')>=0) {
				Recaptcha.reload();
	 			displayError('#recaptcha_response_field', msg);
			    }
			    $this.removeAttr('disabled').css('cursor','');
			}
		    },
		    'json'
		)
        .fail(function(xhr) {
            if(xhr.status==403) {
                alert("It looks like your browser is set to block cookies. Please enable cookies in your browser settings.");
            } else if(xhr.status>=400) {
                alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            }
        });
	}else{
		window.is_brand_store = is_brand_store;
		window.displayError = displayError;
		$("#signup_iframe").detach();
		$("#signup_form").detach();
		$("<iframe name='signup_iframe' id='signup_iframe' style='height:0;width:0'></iframe>").appendTo(document.body);
		$("<form id='signup_form' action='https://"+location.hostname+http_post+"' method='post' target='signup_iframe'></form>").appendTo(document.body);
		for(var k in param){
			$('#signup_form').append("<input type='hidden' name='"+k+"' value='"+param[k]+"'>");
		}
		$('#signup_form').append("<input type='hidden' name='csrfmiddlewaretoken' value='"+$("input[name=csrfmiddlewaretoken]").val()+"'>");
		$('#signup_form').submit();
	}


	return false;
    });
});
