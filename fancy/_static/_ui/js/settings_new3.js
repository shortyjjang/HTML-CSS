jQuery(function($){
	if ($(window).height()<$('#content').height()+$('#header').height()+20){
		$('.set_area').addClass('btns-fix');
	}else{
		$('.set_area').removeClass('btns-fix');
	}

	var $form = $('form');
	var savedString = $('.btn-save').html();

    function show_notification(message, msg_class, timeout, slide_duration, btn) {
        //$(window).scrollTop(0);
        if(!$(".notification-bar p")[0].length){
            //alertify.alert(message);
	        $('.btn-save').addClass('loading').attr('disabled','disabled');
			if(msg_class=="success" && $('.btn-save')[0]){
				$('.btn-save').removeClass('loading').html("Saved");
				setTimeout(function(){
					$('.btn-save').html(savedString);
				}, 3000);
			}
            return;
        }
        /*$(".notification-bar p").html(message);
        $(".notification-bar").addClass(msg_class).slideDown();
        setTimeout(function(){
            $(".notification-bar").slideUp(slide_duration, function(){
                $(".notification-bar").removeClass(msg_class).hide();
            });
        }, timeout);*/

    }
	$('#save_password').on('click',function(event){
		var passwd = $(this).parents('form').find('#pass').val().trim();
		var confirm_passwd = $(this).parents('form').find('#confirmpass').val().trim();

		var selectedRow = $(this);

		var param = {};
		if(passwd.length >= 6){
			if(passwd != confirm_passwd){
				alertify.alert(gettext('The passwords you entered must match. Please try again.'));
				return false;
			} else {
			  param['password']=passwd;
			}
		} else if (passwd.length > 0) {
			alertify.alert(gettext("Password should be 6 characters or more."));
			return false;
		}else {
			alertify.alert(gettext("Please enter the new password."));
			return false;
		}
	
		$('.btn-save').attr('disabled','disabled').next().show();
		$.post(
			'/settings_password.json',
			param,
			function(response){
				if (response.status_code != undefined && response.status_code ==1) {
					selectedRow.closest('form')
						.find('#pass').val('').end()
						.find('#confirmpass').val('');

                    show_notification(gettext("<b>Success!</b> Your password has been changed."), "success", 3000, 300);
				} else if (response.status_code != undefined && response.status_code == 0) {
					if(response.message != undefined){		
                        show_notification("<b>Bummer!</b> "+response.message, "failed", 3000, 300);
					}
				}
				$('.btn-save').next().hide();
			},
			'json'
		).fail(function() { 
            show_notification(gettext("Server error. Please try again."), "failed", 3000, 300);
			$('.btn-save').next().hide();
		});
		return false;
	});

	$('#save_notifications').on('click',function(event){
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
                    show_notification(gettext("<b>Success!</b> Your notification settings have been saved."), "success", 3000, 300);
				} else if (response.status_code != undefined && response.status_code == 0) {
					if(response.message != undefined){
                        show_notification("<b>Bummer!</b> "+response.message, "failed", 3000, 300);
					}
				}
				$('.btn-save').next().hide();
			},
			'json'
		).fail(function() { 
            show_notification(gettext("Server error. Please try again."), "failed", 3000, 300);
			$('.btn-save').next().hide();	
		});
		return false;
	});


	$('#save_account').on('click',function(event){
		event.preventDefault();
		
		try{tinyMCE.triggerSave();}catch(e){}
		var fullname = $(this).parents('form').find('#name').val().trim();
		var email = $(this).parents('form').find('#email').val().trim();
		var ori_email = $(this).parents('form').find('#email').data("email").trim();
		var user_email = $(this).parents('form').find('#user_email').val().trim();
		var website = $(this).parents('form').find('#site').val().trim();
		var twitter_username = $(this).parents('form').find('#twitter').val();
        if (twitter_username) twitter_username.trim();
		var loc = $(this).parents('form').find('#loc').val().trim();
		var bio = $(this).parents('form').find('#bio').val().trim();		
		var age = $('#age').val();
		var gen = $('input[name=gender]').filter(":checked").val();
		var birthday_year = $('#birthday_year').val();
		var birthday_month = $('#birthday_month').val();
		var birthday_day = $('#birthday_day').val();

		var selectedRow = $(this);
		var illegalCharsUsername = /\W/; // allow letters, numbers, and underscores

		if(fullname.length <=0 ){
			alertify.alert(gettext('Please enter your name'));
			return false;
		}
        if(fullname.length > 99){
			alertify.alert(gettext('Your full name should be shorter than 100 characters.'));
			return false;
        }
	
		if(user_email.length > 0 && email.length <=0 ) {
			email = user_email;
		}

		if(email.search(emailRegEx) == -1){ // see common/util.js to change emailRegEx
			alertify.alert(gettext('A valid email address is required'));
			return false;
		}
		var $enhanced_bio = $(this).parents('form').find("#use_bio");
		if ($enhanced_bio.is(":checked") && $("#bio").hasClass('text-updated')) {
			alertify.alert(gettext("Your enhanced bio has been submitted for review by our editorial team."));
		}

		var param = {fullname:fullname, email:email};
	
		param['website_url'] = website || '';
		param['twitter_username'] = twitter_username || '';
		param['location'] = loc || '';
		param['bio'] = bio || '';		
		param['age'] = isNaN(age=parseInt(age))?'none':age;
		param['gender'] = gen;
		param['birthday_year'] = birthday_year || '';
		param['birthday_month'] = birthday_month || '';
		param['birthday_day'] = birthday_day || '';
	  	param['is_enhanced_bio'] = $enhanced_bio.is(":checked");

		$('.btn-save').attr('disabled','disabled').next().show();
		$.post(
			'/settings_account.json',
			param, 
			function(response){
				if (response.status_code != undefined && response.status_code > 0) {
					if(response.website != undefined){
						selectedRow.parents('form').find('#site').val(response.website);
					}

					if (email != ori_email) {
						location.reload();
					}else{
                        show_notification(gettext("<b>Success!</b> Your profile settings have been updated."), "success", 3000, 300);
					}
				} else if (response.status_code != undefined && response.status_code ==0) {
					if(response.message != undefined){
                        show_notification(response.message, "success", 3000, 300);
					}
				}
				$('.btn-save').next().hide();
			},
			'json'
		).fail(function() { 
            show_notification(gettext("Server error. Please try again."), "failed", 3000, 300);
			$('.btn-save').next().hide();
		});
		return false;
	});

	$('#save_apps').on('click',function(event){
		event.preventDefault();

		var post_to_facebook = $('input#post_to_facebook').is(':checked');
		var post_to_twitter = $('input#post_to_twitter').is(':checked');

		var param = {}
		param['post_to_twitter']=post_to_twitter;
		param['post_to_facebook']=post_to_facebook;

		$('.btn-save').attr('disabled','disabled').next().show();
		$.post(
			'/settings_apps.json',
			param,
			function(response){
				if (response.status_code != undefined && response.status_code > 0) {
                    show_notification(gettext("<b>Success!</b> Your preferences have been updated."), "success", 3000, 300);
				} else if (response.status_code != undefined && response.status_code ==0) {
					if(response.message != undefined){
                        show_notification("<b>Bummer!</b> "+response.message, "failed", 3000, 300);
					}
				}
				$('.btn-save').next().hide();
			},
			'json'
		).fail(function() {
            show_notification(gettext("Server error. Please try again."), "failed", 3000, 300);
            $('.btn-save').next().hide();
        });
		return false;
	});

	$('#save_preferences').on('click',function(event){
		event.preventDefault();
		
		var fullname = $(this).parents('form').find('#name').val().trim();
		var email = $(this).parents('form').find('#email').val().trim();
		var show_list_options = $('input[name=lists]').filter(":checked").val()=="true";
        var enable_sms = $('input[name=sms]').filter(":checked").val()=="true";
		var make_private = $('input[name=make-private]').filter(":checked").val()=="1";
			
		var selectedRow = $(this);
		
		var param = {fullname:fullname, email:email};
	
		param['lang'] = $form.find('#lang').val();
		param['timezone'] = $form.find('#timezone').val();
		param['show_list_options']=show_list_options;
		param['make_private']=make_private;
        param['enable_sms'] = enable_sms;

		$('.btn-save').attr('disabled','disabled').next().show();
		$.post(
			'/settings_account.json',
			param, 
			function(response){
				if (response.status_code != undefined && response.status_code > 0) {
					$.ajax({
						type: 'POST', 
						url:  '/set_my_currency.json',
						data: {currency_code: $form.find('#currency').val()},
						success: function(response) {
							if (response && response.success && response.success == true) {
							}
							else {
								alertify.alert(gettext('Failed to change currency setting.'));
							}

							if (param['lang'] != $form.find('#lang').data('langcode') || response.status_code ==2) {
								location.reload();
							}else{
                                show_notification(gettext("<b>Success!</b> Your preferences have been updated."), "success", 3000, 300);
							}

						},
						error: function(res){
							alertify.alert(gettext('Failed to change currency setting.'));
							location.reload();
						}
					});
				} else if (response.status_code != undefined && response.status_code ==0) {
					if(response.message != undefined){
                        show_notification("<b>Bummer!</b> "+response.message, "failed", 3000, 300);
					}
				}
				$('.btn-save').next().hide();
			},
			'json'
		).fail(function() { 
            show_notification(gettext("Server error. Please try again."), "failed", 3000, 300);
			$('.btn-save').next().hide();
		});
		return false;
	});

    $('.section.sms-notify input#able1').on('click', function() {
        var sms_number = $('a.number').text().trim();
        if (!sms_number.length) {
            $.dialog('sms-notify').open();
        }
    });

    $('.section.sms-notify a.number').on('click', function() {
        $.dialog('sms-notify').open();
        return false;
    });

    $('.popup.sms-notify .btn-confirm').on('click', function() {
		var email = $('#email').val().trim();
        var enable_sms = $('input[name=sms]').filter(":checked").val()=="true";
        var sms_country = $('.popup.sms-notify #country').val();
        var sms_numberpart = $('.popup.sms-notify #number').val();
        var param = {
            email: email,
            enable_sms: enable_sms,
            sms_country: sms_country,
            sms_numberpart: sms_numberpart
        };
        if (document.sms_notifications.checkValidity()) {
            $.dialog('sms-notify').close();
		    $('.btn-save').attr('disabled','disabled').next().show();
            $.post('/settings_account.json', param, function(response) {
                if (response.status_code != undefined && response.status_code > 0) {
                    show_notification(gettext("<b>Success!</b> Your phone number has been updated."), "success", 3000, 300);
                    if (response.sms_phonenumber != undefined) {
                        $('.section.sms-notify .phone a').text(response.sms_phonenumber);
                    }
                } else if (response.status_code != undefined && response.status_code == 0) {
                    if (response.message != undefined) {
                        show_notification("<b>Bummer!</b> "+response.message, "failed", 3000, 300);
                    }
                }
                $('.btn-save').next().hide();
            }, 'json'
            ).fail(function() {
                show_notification(gettext("Server error. Please try again."), "failed", 3000, 300);
			    $('.btn-save').next().hide();
            });
            return false;
        } else {
            return;
        }
    });
    var validateSMSForm = function() {
        var phone_num = $('.sms-notify #number').val();
        var isWhole_re = /^\s*\d+\s*$/;
        var $tel= $('.sms-notify #number')[0];
        $tel.setCustomValidity('');
        if (!phone_num.length) {
            $tel.setCustomValidity('Please input your phone number.');
        } else if (String(phone_num).search (isWhole_re) == -1) {
            $tel.setCustomValidity('Only digits allowed in telephone number.');
        } else if (phone_num.length < 7) {
            $tel.setCustomValidity('At least 7 digits needed.');
        } else if (phone_num.length > 15) {
            $tel.setCustomValidity('Cannot be greater than 15 digits.');
        }

    };
    $('form.sms-notify input#number').on('input', validateSMSForm);
    $('form.sms-notify #country').on('change', function() {
        var country = $("form.sms-notify select#country")[0].value;

        $("form.sms-notify i[class^='flag']").remove()
        $("form.sms-notify #number").after("<i class='flag-" + country.toLowerCase() + "'></i>")
    });




	// add upload button disabled 2012-12-06
	$('#uploadavatar').on('change', function(event){
		//$('button#save_profile_image').disable(!this.value);
	});
	$("button#save_profile_image").on('click',function(event){
		var $this = $(this), $file = $('#uploadavatar'), file = $file.attr('value'), $up = $file.next('.uploading');

		if(!file) return false;

		$up.show().prev('input:file').hide();

		$.ajaxFileUpload( { 
			url:'/settings_image.xml',
			secureuri:false,
			fileElementId:'uploadavatar',
			dataType: 'xml',
			success: function (xml, status) 
			{
				var $xml = $(xml), $st = $xml.find('status_code');

				$up.hide().prev('input:file').show();

				if ($st.length>0 && $st.text()==1) {
					var img_url = 'url(' + $xml.find('original_image_url').text() + ')';
					$('.photo-preview').find('img').css('background-image', img_url);
				} else if ($st.length>0 && $st.text()==0) {
					alertify.alert($xml.find("message").text());
					return false;
				} else {
					alertify.alert(gettext("Unable to upload file.."));
					return false;
				}
			},
			error: function (data, status, e)
			{
				$up.hide().prev('input:file').show();

				alertify.alert(e);
				return false;
			}
		});

 		$file.attr('value','');

		return false;
	});
  
	$('button#delete_profile_image').on('click',function(event){
		if (window.confirm(gettext('Are you sure?'))){
			$.post(
				'/delete_profile_image.json',
				{}, // parameters
				function(response){
					if (response.status_code != undefined && response.status_code == 1) {
					  location.reload(false);
					}
					else if (response.status_code != undefined && response.status_code == 0) {
						if(response.message != undefined)
							alertify.alert(response.message);
					}  
				},
				"json"
			);
			return false;
		}
	
		return false;
	});

	$('a#delete_token').on('click',function(event){
		var $this = $(this);

		if (window.confirm(gettext('Are you sure?'))){
			$.post(
				'/delete_token.xml',
				{token_key:$this.attr('tkey')}, // parameters
				function(xml){
					var $status_code = $(xml).find('status_code');
					if ($status_code.length>0 && $status_code.text()==1) {
						location.reload(false);
					} else if ($status_code.length>0 && $status_code.text()==0) {
						alertify.alert($(xml).find("message"));
					}
				},
				'xml'
			);
		}
		
		return false;
	});
  
	$('button#close_account').on('click',function(event){
		if (window.confirm(gettext('Are you sure you want to close your account?'))){
			$.post(
				'/close_account.json',
				{}, // parameters
				function(response){
					if (response.status_code != undefined && response.status_code == 1) {
					  location.href='/';
					}
					else if (response.status_code != undefined && response.status_code == 0) {
						if(response.message != undefined)
							alertify.alert(response.message);
					}  
				},
				"json"
			);
			return false;
		}
	
		return false;
	});

		$('button#remove_card').on('click',function(event){
		if (window.confirm(gettext('Remove your credit card information?'))){
			$.post(
				'/remove_card.json',
				{}, // parameters
				function(response){
					if (response.status_code != undefined && response.status_code == 1) {
						location.reload(true);
					}
					else if (response.status_code != undefined && response.status_code == 0) {
						if(response.message != undefined)
							alertify.alert(response.message);
					}  
				},
				"json"
			);
			return false;
		}
	
		return false;
	});


	$('a#resend_confirmation').on('click',function(event){
		$.post(
			'/send_email_confirmation.json',
			{'resend' : true },
			function(response){
				if (response.status_code != undefined && response.status_code == 1) {
					alertify.alert(gettext("A confirmation email has been sent to {{email}.".replace('{email}',response.email)));
				} else if (response.status_code != undefined && response.status_code == 0) {
					if(response.message != undefined)
						alertify.alert(response.message);
				}
			},
			"json"
		);
		return false;
	});

	$('a#cancel_confirmation').on('click',function(event){
		$.post(
			'/cancel_email_confirmation.json',
			{}, // parameters
			function(response){
				if (response.status_code != undefined && response.status_code == 1) {
					$('.confirm-email').remove();
				}
				else if (response.status_code != undefined && response.status_code == 0) {
					if(response.message != undefined)
						alertify.alert(response.message);
				}
			},
			"json"
		);
		return false;
	});

	$("#bio").on('keydown', function(event){
		if (!$(this).hasClass('text-updated'))$(this).addClass('text-updated');
	});
	$("#bio").on('keyup', function(event){
		var maxlength = 180;
		var aboutArea = $(this);
		var remainCnt = maxlength - aboutArea.val().length;
		var remainCntArea = $("div.section.profile").find("b.byte");
		remainCntArea.text(remainCnt);
		if(remainCnt<0){
			remainCntArea.css('color','red');
		}else{
			remainCntArea.css('color','');
		}
	});

	$("#confirmpass").keyup(function(){
		if($('#pass').val()==$(this).val() && $(this).val().length>=6 ) {
			$('.btn-save').removeAttr('disabled');
		}else{
			$('.btn-save').attr('disabled','disabled');
		}
	});

	$("#use_bio").change(function() {
		var checked = $(this).is(":checked");
		$(".enhanced-bio-status").toggle(checked);
		$("div.section.profile").find(".plain-bio-status").toggle(!checked);
		var is_initial = $('#bio').hasClass('init');
		$('#bio').removeClass('init');
		if (checked) {
			$('#bio').data('saved', $('#bio').val()).removeAttr('max-length');
			// WYSIWYG Editor
			tinyMCE.init({
				mode : 'exact',
				elements : 'bio',
				theme : 'advanced',
				theme_advanced_toolbar_location : 'top',
				theme_advanced_toolbar_align : 'left',
				theme_advanced_buttons1 : 'bold,italic,underline,|,bullist,numlist,|,justifyleft,justifycenter,justifyright,|,forecolor,fontsizeselect,|,link,unlink,|,code',
				theme_advanced_buttons2 : '',
				theme_advanced_buttons3 : '',
				theme_advanced_resizing : true,
				theme_advanced_font_sizes : '10px,12px,14px,16px,24px',
				theme_advanced_more_colors : true,
				init_instance_callback : function(inst) {
					var content = $('#bio').data('enhanced') || '';
					var content_txt = $('#bio').val().trim();
					//if (!is_initial) {
					if ($(content).text().trim()==content_txt) inst.setContent(content);
					else inst.setContent(content_txt)
					//}
				}
			});
		} else {
			var enhanced = '';
			if( tinyMCE.editors[0] ) {
				enhanced = tinyMCE.editors[0].getContent();
				tinyMCE.editors[0].remove();
				$('#bio').data('enhanced', enhanced);
				$('#bio').val($(enhanced).text()).trigger("keyup");				
			}			
		}
	}).change();
	if(!$("#use_bio").is(":checked")){
		$("#bio").trigger("keyup");	
	}

	function populate_day_choices() {
		var selected_year = $('#birthday_year').val();
		var selected_month = $('#birthday_month').val();

		if (selected_year == 0) selected_year = 1900;
		if (selected_month == 0) selected_month = 1;

		var long_february = false;
		if (selected_year % 4 == 0) long_february = true;
		if (selected_year % 100 == 0) long_february = false;
		if (selected_year % 400 == 0) long_february = true;

		var days_in_month = 31;
		if (selected_month == 4 || selected_month == 6 || selected_month == 9 || selected_month == 11) days_in_month = 30;
		if (selected_month == 2) {
			if (long_february) days_in_month = 29;
			else days_in_month = 28;
		}

		$('#birthday_day').empty();
		$('#birthday_day').append('<option value="0">Day</option>');
		for(var day=1; day<=days_in_month; day++) {
			$('#birthday_day').append('<option value="'+day+'">'+day+'</option>');
		}

		return false;
	};
});
