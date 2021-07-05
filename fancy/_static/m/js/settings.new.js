jQuery(function($){
	$('form.myform').submit(function(){
		var $form=$(this), elems=this.elements, params={}, e, n, v;

		function error(msg,fld){
			alert(msg);
			if(fld) fld.focus();
			return false;
		};

		for(var i=0,c=elems.length; i < c; i++){
			e = elems[i];
			n = (e.getAttribute('name') || e.getAttribute('id') || '').replace(/^setting-/, '');
			if(!n) continue;
			if( e.getAttribute('type')=='checkbox'){
				v = e.checked?'true':'false';
			}else if (e.getAttribute('type')=='radio'){
				if(e.checked) v = $.trim(e.value);
			}else{
				v = $.trim(e.value);
			}
			if(v) params[n] = v;
		}

		// check passwords
		if(params.password && params.password != params['confirm-password']) {
			return error(lang['passwords-must-match'],elems.password);
		}

		// disable submit button
		$form.find(':submit').addClass('disabled').prop('disabled', true);

		// save
		$.ajax({
			type : 'post',
			url  : '/settings_account.json',
			data : params,
			success  : function(response){
				if (response.status_code != undefined && response.status_code > 0) {
					alert(lang['settings-saved']);
				}else if (response.message != null) {
					alert(response.message);
				}
			},
			complete : function(){
				$form.find(':submit').removeClass('disabled').prop('disabled', false);
			}
		});

		return false;
	});


	$('#save_preferences').click(function(event){
		event.preventDefault();
		
		var $form = $(this).parents('form');
		var fullname = $(this).parents('form').find('#name').val().trim();
		var email = $(this).parents('form').find('#email').val().trim();
		var show_list_options = $('input[name=lists]').filter(":checked").val()=="true";
		var enable_category_list = $('input[name=category-list]').filter(":checked").val()=="true";
		var make_private = $('input[name=make-private]').filter(":checked").val()=="1";
			
		var selectedRow = $(this);
		
		var param = {fullname:fullname, email:email};
	
		param['lang'] = $form.find('#lang').val();
		param['show_list_options']=show_list_options;
		param['enable_category_list']=enable_category_list;
		param['make_private']=make_private;
		
		$('.btn-save').attr('disabled','disabled').next().show();
		$.post(
			'/settings_account.json',
			param, 
			function(response){
				if (response.status_code != undefined && response.status_code > 0) {
                    /*$.ajax({
                        type: 'POST', 
                        url:  '/set_my_currency.json',
                        data: {currency_code: $form.find('#currency').val()},
                        success: function(response) {
                            if (response && response.success && response.success == true) {
                            }
                            else {
                                alert('Failed to change currency setting.');
                            }
                        }
                    });*/
					if (param['lang'] != $form.find('#lang').data('langcode') || response.status_code ==2) {
						location.reload();
					}else{
						alert("Success! Your preferences setting has now been changed.");						
					}
				} else if (response.status_code != undefined && response.status_code ==0) {
					if(response.message != undefined){
                        alert("Bummer! "+response.message);
                    }
				}
                $('.btn-save').removeAttr('disabled').next().hide();
			},
			'json'
		).fail(function() { 
			alert("Bummer! server error. Try again.");			
            $('.btn-save').removeAttr('disabled').next().hide();
		});
		return false;
	});


    $('#save_apps').click(function(event){
        event.preventDefault();

        var post_to_facebook = $('#post_to_facebook').is(':checked');
        var post_to_twitter = $('#post_to_twitter').is(':checked');

        var param = {};
        param['post_to_facebook']=post_to_facebook;
        param['post_to_twitter']=post_to_twitter;

        $('.btn-save').attr('disabled','disabled').next().show();
        $.post(
            '/settings_apps.json',
            param,
            function(response){
                if (response.status_code != undefined && response.status_code ==1) {
                    alert("Success! Your apps settings have been saved.");
                } else if (response.status_code != undefined && response.status_code == 0) {
                    if(response.message != undefined){
                        alert("Bummer! "+response.message);
                    }
                }
                $('.btn-save').removeAttr('disabled').next().hide();
            },
            'json'
        ).fail(function() {
                alert("Bummer! server error. Try again.");
                $('.btn-save').removeAttr('disabled').next().hide();
            });
        return false;
    });


    $('#save_notifications').click(function(event){

		event.preventDefault();

		var notify_follow = $('#following').is(':checked');
		var notify_join = $('#invited').is(':checked');
		var notify_updates = $('#updates').is(':checked');
		var notify_shown_to_me = $('#shown_to_me').is(':checked');
		var notify_comments_on_fancyd = $('#comments_on_fancyd').is(':checked');
		var notify_mentions_me = $('#mentions_me').is(':checked');
		var notify_featured = $('#featured').is(':checked');

		var wmn_follow = $('#wmn-follow').is(':checked');
		var wmn_join = $('#wmn-join').is(':checked');
		var wmn_shown_to_me = $('#wmn-shown_to_me').is(':checked');
		var wmn_comments_on_fancyd = $('#wmn-comments_on_fancyd').is(':checked');
		var wmn_featured = $('#wmn-featured').is(':checked');
		var wmn_mentioned_in_comment = $('#wmn-mentioned_in_comment').is(':checked');
		var wmn_followed_add_person = $('#wmn-followed_add_person').is(':checked');
		var wmn_followed_add_store = $('#wmn-followed_add_store').is(':checked');
		var wmn_fancyd = $('#wmn-fancyd').is(':checked');
		var wmn_followed_commented = $('#wmn-followed_commented').is(':checked');
		var wmn_deal = $('#wmn-deal').is(':checked');
		var wmn_followed_earned_deal = $('#wmn-followed_earned_deal').is(':checked');
		var wmn_promotion = $('#wmn-promotion').is(':checked');
		var wmn_followed_promoted = $('#wmn-followed_promoted').is(':checked');
			
		var selectedRow = $(this);

		var param = {};
	
		param['notify_follow']=notify_follow;
		param['notify_join']=notify_join;
		param['notify_updates']=notify_updates;
		param['notify_shown_to_me']=notify_shown_to_me;
		param['notify_comments_on_fancyd']=notify_comments_on_fancyd;
		param['notify_mentions_me']=notify_mentions_me;
		param['notify_featured']=notify_featured;
		param['wmn_follow']=wmn_follow;
		param['wmn_join']=wmn_join;
		param['wmn_shown_to_me']=wmn_shown_to_me;
		param['wmn_comments_on_fancyd']=wmn_comments_on_fancyd;
		param['wmn_featured']=wmn_featured;
		param['wmn_mentioned_in_comment']=wmn_mentioned_in_comment;
		param['wmn_followed_add_person']=wmn_followed_add_person;
		param['wmn_followed_add_store']=wmn_followed_add_store;
		param['wmn_fancyd']=wmn_fancyd;
		param['wmn_followed_commented']=wmn_followed_commented;
		param['wmn_deal']=wmn_deal;
		param['wmn_followed_earned_deal']=wmn_followed_earned_deal;
		param['wmn_promotion']=wmn_promotion;
		param['wmn_followed_promoted']=wmn_followed_promoted;

		$('.btn-save').attr('disabled','disabled').next().show();
		$.post(
			'/settings_notifications.json',
			param,
            function(response){
				if (response.status_code != undefined && response.status_code ==1) {
					alert("Success! Your notifications settings have been saved.");

				} else if (response.status_code != undefined && response.status_code == 0) {
				    if(response.message != undefined){
				    	alert("Bummer! "+response.message);
				    }
                }
                $('.btn-save').removeAttr('disabled').next().hide();
			},
			'json'
		).fail(function() { 
			alert("Bummer! server error. Try again.");
            $('.btn-save').removeAttr('disabled').next().hide();	
		});
		return false;
	});

	$('#save_password').click(function(event){
		var $form = $(this).parents('form')
		var passwd = $form.find('#pass').val().trim();
		var confirm_passwd = $form.find('#confirmpass').val().trim();
		var cpasswd = ($form.find('#password').val()||'').trim();

		var selectedRow = $(this);

		var param = {};
	    param['current_pw']=cpasswd;
		if(passwd.length >= 6){
			if(passwd != confirm_passwd){
				alert("The passwords you entered must match. Please try again.");
				return false;
			} else {
			  param['password']=passwd;
			}
		} else if (passwd.length > 0) {
            alert("Password should be 6 characters or more.");
            return false;
        }else {
            alert("Please enter the new password.");
            return false;
        }
	
		$('.btn-save').attr('disabled','disabled').next().show();
		$.post(
			'/settings_password2.json',
			param,
			function(response){
				if (response.status_code != undefined && response.status_code ==1) {
					selectedRow.closest('form')
						.find('#pass').val('').end()
						.find('#confirmpass').val('').end()
						.find('#password').val('');

					alert("Success! Your password has been changed.");
					
				} else if (response.status_code != undefined && response.status_code == 0) {
				    if(response.message != undefined){		
                        alert(response.message || "Failed to save the new password.");
				    }
                }
                $('.btn-save').removeAttr('disabled').next().hide();
			},
			'json'
		).fail(function(xhr) { 
            var response = jQuery.parseJSON(xhr.responseText);
            alert(response.message || gettext("Incorrect password") + " " + gettext("Your settings have not changed"))

			//alert("Bummer! server error. Try again.");
			$('.btn-save').removeAttr('disabled').next().hide();
		});
		return false;
	});

	$('a.btn-pw').click(function(){
		$(this).hide();
		$('#block-pwd').show();
		return false;
	});

	$(document).delegate('a#close-account','click',function(event){
		if (window.confirm('Are you sure you want to close your account?')){
			$.ajax({
				type : 'post',
				url  : '/close_account.json',
				headers  : {'X-CSRFToken':$.cookie.get('csrftoken')},
				data : {}, // parameters
				dataType : 'json',
				success  : function(response) {
					if (response.status_code != undefined && response.status_code == 1) {
						location.href='/';
					}
					else if (response.status_code != undefined && response.status_code == 0) {
						if(response.message != undefined)
							alert(response.message);
					}
				},
				complete : function() {
				}
			});
			return false;
		}
		return false;
	});


    $(document).delegate('a#resend_confirmation','click',function(event){
        var $this = $(this);
        if ($this.attr('loading')) return false;
        $this.attr('loading', true);
        $.ajax({
            type : 'post',
            url : '/send_email_confirmation.json',
            headers : {'X-CSRFToken':$.cookie.get('csrftoken')},
            data : {'resend' : true},
            dataType : 'json',
            success : function(response){
                if (response.status_code != undefined && response.status_code == 1) {
					alert("confirmation email has been sent to " + response.email)
                }
                else if (response.status_code != undefined && response.status_code == 0) {
                    if(response.message != undefined)
                        alert(response.message);
                }
            },
            complete : function() {
                $this.attr('loading', null);
            }
        });
        return false;
    });


    $(document).delegate('a#cancel_confirmation','click',function(event){
        var $this = $(this);
        if ($this.attr('loading')) return false;
        $this.attr('loading', true);
        $.ajax({
            type : 'post',
            url : '/cancel_email_confirmation.json',
            headers : {'X-CSRFToken':$.cookie.get('csrftoken')},
            data : {}, // parameters
            dataType : 'json',
            success : function(response){
                if (response.status_code != undefined && response.status_code == 1) {
                    location.reload();
                }
                else if (response.status_code != undefined && response.status_code == 0) {
                    if(response.message != undefined)
                        alert(response.message);
                }
            },
            complete : function(){
                $this.attr('loading', null);
            }
        });
        return false;
    });

	$(document).delegate("#bio",'keyup paste', function(event){
		var maxlength = 2048;
		var aboutArea = $(this);
		var remainCnt = maxlength - aboutArea.val().length;
		if(remainCnt<0){
			aboutArea.val( aboutArea.val().substring(0, maxlength) );
			remainCnt = 0;
		}
		var remainCntArea = $("form.myform").find(".byte");
		remainCntArea.text(remainCnt);
	});

	$("#bio").trigger("keyup");


	$("button#save_profile_image").on('click',function(event){
		event.preventDefault();
		$('#uploadavatar').trigger("click");
	})

	$("#confirmpass").keyup(function(){
		if($('#pass').val()==$(this).val() && $(this).val().length>=6 ) {
			$('.btn-save').removeAttr('disabled');
		}else{
			$('.btn-save').attr('disabled','disabled');
		}
	});

	// add upload button disabled 2012-12-06
	$(document).delegate('#uploadavatar','change propertychange', function(event){
		var $this = $(this), $file = $('#uploadavatar'), file = $file.attr('value'), $up = $file.next('.uploading');

		if(!$file) return false;

		//$up.show().prev('input:file').hide();

		$.ajaxFileUpload( { 
			url:'/settings_image.xml',
			secureuri:false,
			fileElementId:'uploadavatar',
			dataType: 'xml',
			success: function (xml, status) 
			{
				var $xml = $(xml), $st = $xml.find('status_code');

				//$up.hide().prev('input:file').show();
		
				if ($st.length>0 && $st.text()==1) {
					var img_url = 'url(' + $xml.find('original_image_url').text() + ')';
					$('#save_profile_image').find('img').css('background-image', img_url);
				} else if ($st.length>0 && $st.text()==0) {
					alert($xml.find("message").text());					
					return false;
				} else {
					alert("Unable to upload file..");
					return false;
				}
			},
			error: function (data, status, e)
			{
				//$up.hide().prev('input:file').show();
				alert(e);
				return false;
			}
		});

		$("button#save_profile_image").find("#uploadavatar").remove().end().prepend('<input id="uploadavatar" type="file" name="upload-file" style="display:none"/>');
 		$file.attr('value','');

		return false;
	});
});
