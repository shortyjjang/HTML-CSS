jQuery(function($){

	// button fixed
	$(window).scroll(function(){
		if ($(document).height()-$(window).height()-($(document).height()-$('.container').outerHeight()) < $(window).scrollTop() ){
			$('.set_area').removeClass('btns-fix');
		}else{
			$('.set_area').addClass('btns-fix');
		}
		if($(window).width()<$('.container').width() && $('.set_area').hasClass('btns-fix')){
			$('.set_area .btn-area').css('margin-left',258 - $(window).scrollLeft()+'px');
		}else{
			$('.set_area .btn-area').css('margin-left','');
		}
	});

	var savedString = $('.btn-save').html();

    function show_notification(message, msg_class, timeout, slide_duration, btn) {
		$('.btn-save').removeClass('loading').attr('disabled', null);
		if(msg_class=="success" && $('.btn-save')[0]){
			$('.btn-save').html("Saved").attr('disabled', 'disabled');
			setTimeout(function(){
				$('.btn-save').html(savedString);
			}, 3000);
		} else {
			alertify.alert(message);
		}
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
				    $('.btn-save').removeAttr('disabled')
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

    $('#save_notifications').attr('disabled', 'disabled');
    var form_notifications = $('#save_notifications').parents('form');
    form_notifications.find('.btn-switch').click(function(event) {
        $('#save_notifications').removeAttr('disabled');
    });
	$('#save_notifications').on('click',function(event){
		var notify_follow = $('#following').hasClass('on');
		var notify_join = $('#invited').hasClass('on');
		var notify_updates = $('#updates').hasClass('on');
		var notify_shown_to_me = $('#shown_to_me').hasClass('on');
		var notify_comments_on_fancyd = $('#comments_on_fancyd').hasClass('on');
		var notify_mentions_me = $('#mentions_me').hasClass('on');
		var notify_featured = $('#featured').hasClass('on');
        var notify_messages = $('#message').hasClass('on');
        var notify_birthdays = $('#birthdays').hasClass('on');
        var notify_sns_friends_join = $('#sns_friends_join').hasClass('on');

		var wmn_follow = $('#wmn-follow').hasClass('on');
		var wmn_join = $('#wmn-join').hasClass('on');
		var wmn_shown_to_me = $('#wmn-shown_to_me').hasClass('on');
		var wmn_comments_on_fancyd = $('#wmn-comments_on_fancyd').hasClass('on');
		var wmn_featured = $('#wmn-featured').hasClass('on');
		var wmn_mentioned_in_comment = $('#wmn-mentioned_in_comment').hasClass('on');
		var wmn_fancyd = $('#wmn-fancyd').hasClass('on');
		var wmn_followed_commented = $('#wmn-followed_commented').hasClass('on');
		var wmn_deal = $('#wmn-deal').hasClass('on');
		var wmn_followed_earned_deal = $('#wmn-followed_earned_deal').hasClass('on');
		var wmn_promotion = $('#wmn-promotion').hasClass('on');
		var wmn_followed_promoted = $('#wmn-followed_promoted').hasClass('on');
        var wmn_messages = $('#wmn-message').hasClass('on');
			
		var selectedRow = $(this);

		var param = {};
	
		param['notify_follow']=notify_follow;
		param['notify_join']=notify_join;
		param['notify_updates']=notify_updates;
		param['notify_shown_to_me']=notify_shown_to_me;
		param['notify_comments_on_fancyd']=notify_comments_on_fancyd;
		param['notify_mentions_me']=notify_mentions_me;
		param['notify_featured']=notify_featured;
        param['notify_messages']=notify_messages;
        param['notify_birthdays']=notify_birthdays;
        param['notify_sns_friends_join']=notify_sns_friends_join;
		param['wmn_follow']=wmn_follow;
		param['wmn_join']=wmn_join;
		param['wmn_shown_to_me']=wmn_shown_to_me;
		param['wmn_comments_on_fancyd']=wmn_comments_on_fancyd;
		param['wmn_featured']=wmn_featured;
		param['wmn_mentioned_in_comment']=wmn_mentioned_in_comment;
		param['wmn_fancyd']=wmn_fancyd;
		param['wmn_followed_commented']=wmn_followed_commented;
		param['wmn_deal']=wmn_deal;
		param['wmn_followed_earned_deal']=wmn_followed_earned_deal;
		param['wmn_promotion']=wmn_promotion;
		param['wmn_followed_promoted']=wmn_followed_promoted;
        param['wmn_messages']=wmn_messages;
		param['username'] = username;
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
				    $('.btn-save').removeAttr('disabled');
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

    var __initial_setup = true;
    $('#save_account').attr('disabled', 'disabled');
    var form_profile = $('#save_account').parents('form');
    form_profile
    .on('change', '#name,#lastname,#site,#username,#loc,#use_bio,#bio,#email,#birthday_year,#birthday_month,#birthday_day,input[name="gender"]', function(event) {
        if(this.id=='use_bio' && __initial_setup) {
            __initial_setup = null;
        } else {
            $('#save_account').removeAttr('disabled');
        }
    })
	$('#save_account').on('click',function(event){
		event.preventDefault();
		
		try{tinyMCE.triggerSave();}catch(e){}

		var fullname = $(this).parents('form').find('#name').val().trim();
		var lastname_field_exists = $(this).parents('form').find('#lastname').length>0
		var lastname = lastname_field_exists?$(this).parents('form').find('#lastname').val().trim():""
		var username = $(this).parents('form').find('#username').val().trim();
		var ori_username = $(this).parents('form').find('#username').data("username").trim();
		var email = $(this).parents('form').find('#email').val().trim();
		var ori_email = $(this).parents('form').find('#email').data("email").trim();
		var user_email = $(this).parents('form').find('#user_email').val().trim();
		var website = $(this).parents('form').find('#site').val().trim();
		var twitter_username = $(this).parents('form').find('#twitter').val();
        if (twitter_username) twitter_username.trim();
		var loc = $(this).parents('form').find('#loc').val();
        if(loc) loc = loc.trim();
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

        if(ori_username!=username) {
            if(username.length<3) {
                alertify.alert(gettext('Please use longer username'));
    			return false;
            }
            if(username.length>30) {
                alertify.alert(gettext('Please use shorter username'));
    			return false;
            }
            if(!username.match('^[a-zA-Z0-9_]+$')) {
                alertify.alert(gettext('Please use alphanumeric characters for your username'));
    			return false;
            }
        }

		if(user_email.length > 0 && email.length <=0 ) {
			email = user_email;
		}

        if(!emailRegEx.test(email)) { // see common/util.js to change emailRegEx
			alertify.alert(gettext('A valid email address is required'));
			return false;
        }
		var $enhanced_bio = $(this).parents('form').find("#use_bio");
		if ($enhanced_bio.is(":checked") && $("#bio").hasClass('text-updated')) {
			alertify.alert(gettext("Your enhanced bio has been submitted for review by our editorial team."));
		}

		var param = {fullname:fullname, email:email};

        if(lastname_field_exists) {
            param['lastname'] = lastname
        }

        if(ori_username!=username) {
            param['username'] = username;
        }

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

                        if(response.fullname != undefined) {
                            // change user's fullname in the user menu
                            $('#header .you-main b').text(response.fullname);
                        }
						if(response.status_code==2) {
                            location.reload();
                        }
					}
				} else if (response.status_code != undefined && response.status_code ==0) {
					if(response.message != undefined){
                        show_notification(response.message, "failed", 3000, 300);
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


    $('#save_preferences').attr('disabled', 'disabled');
    var form_preferences = $('#save_preferences').parents('form');
    form_preferences
    .on('change', '#lang', function(event) { form_preferences.attr('should-reload', true); })
    .on('change', '#currency', function(event) { form_preferences.attr('should-update-currency', true); })
    .on('change', '#lang,#currency,#timezone,input[name="category-list"],input[name="make-private"],input[name="control-msg"]', function(event) {
        $('#save_preferences').removeAttr('disabled');
    });

    $('#save_preferences').on('click',function(event) {
        event.preventDefault();

        if($('.btn-save').attr('disabled')) {
            return false;
        }

        var form = form_preferences;
        var fullname = form.find('#name').val().trim();
        var email = form.find('#email').val().trim();

        var enable_category_list = $('input[name=category-list]').filter(":checked").val()=="true";
        var enable_sms = $('input[name=sms]').filter(":checked").val()=="true";
        var make_private = $('input[name=make-private]').filter(":checked").val()=="1";
        var messages_permission = $('input[name=control-msg]').filter(":checked").val();

		var selectedRow = $(this);

		var param = {fullname:fullname, email:email};
	
		param['lang'] = form.find('#lang').val();
		param['timezone'] = form.find('#timezone').val();
		param['show_list_options']=false;
		param['enable_category_list']=enable_category_list;
		param['make_private']=make_private;
        //param['enable_sms'] = enable_sms;
        param['messages_permission'] = messages_permission;
        $(".switch-region .set-region").text($('#currency').val());
        $('.btn-save').attr('disabled','disabled').next().show();
        $.post('/settings_account.json', param, function(response) {
            if (response.status_code != undefined && response.status_code > 0) {
                var settings_account_response = response;
                var after_currency_update = function() {
                    if (settings_account_response.status_code ==2) {
                        location.reload();
                    } else {
                        if(form_preferences.attr('should-reload') || param['lang'] != form.find('#lang').data('langcode')) {
                            location.reload();
                        }
                        show_notification(gettext("<b>Success!</b> Your preferences have been updated."), "success", 3000, 300);
                    }
                };
                if(form_preferences.attr('should-update-currency')) {
                    $.ajax({
                        type: 'POST', 
                        url:  '/set_my_currency.json',
                        data: {currency_code: form.find('#currency').val()},
                        success: function(response) {
                            if (!(response && response.success && response.success == true)) {
                                alertify.alert(gettext('Failed to change currency setting.'), function() { 
                                    after_currency_update();
                                });
                                return;
                            } else {
                                after_currency_update();
                            }
                        },
                        error: function(res){
                            alertify.alert(gettext('Failed to change currency setting.'), function() {
                                after_currency_update();
                            });
                        }
                    });
                } else {
                    after_currency_update(response);
                }
            } else if (response.status_code != undefined && response.status_code ==0) {
                if(response.message != undefined){
                    show_notification("<b>Bummer!</b> "+response.message, "failed", 3000, 300);
                }
            }
            $('.btn-save').next().hide();
        }, 'json')
        .fail(function() {
            show_notification(gettext("Server error. Please try again."), "failed", 3000, 300);
            $('.btn-save').next().hide();
        });
        return false;
    });

    var update_sms_phone = function(enable_sms) {
        var email = $('#email').val().trim();

        var param = {
            email: email,
            enable_sms: enable_sms,
        };
        var sms_country = $('.popup.sms-notify #country').val();
        if(enable_sms) {
            param['sms_country'] = sms_country;
            param['sms_numberpart'] = $('.popup.sms-notify #number').val();
        } else {
            param['sms_country'] = '';
            param['sms_numberpart'] = '';
        }

        var btn_was_disabled = false;
        if($('.btn-save').attr('disabled')) {
            btn_was_disabled = true;
        }
        $('.btn-save').attr('disabled','disabled').next().show();
        $.post('/settings_account.json', param, function(response) {
            if (response.status_code != undefined && response.status_code > 0) {
                if(enable_sms) {
                    show_notification(gettext("<b>Success!</b> Your phone number has been updated."), "success", 3000, 300);
                    $('.section.sms-notify .phone a').html('<i class="flag-'+sms_country.toLowerCase()+'"></i>'+response.sms_phonenumber);
                    $('.section.sms-notify .phone a').attr('data-country', sms_country);
                    $('.section.sms-notify input#able2').attr('checked', false);
                    $('.section.sms-notify input#able1').attr('checked', true);
                    $('.section.sms-notify .phone').show();
                } else {
                    $('.section.sms-notify input#able1').attr('checked', false);
                    $('.section.sms-notify input#able2').attr('checked', true);
                    $('.section.sms-notify .phone').hide();
                }
            } else if (response.status_code != undefined && response.status_code == 0) {
                if (response.message != undefined) {
                    show_notification("<b>Bummer!</b> "+response.message, "failed", 3000, 300);
                }
            }
            if(!btn_was_disabled) {
                $('.btn-save').next().hide();
            } else {
                $('.btn-save').next().hide();
            }
        }, 'json'
        ).fail(function() {
            show_notification(gettext("Server error. Please try again."), "failed", 3000, 300);
            if(!btn_was_disabled) {
                $('.btn-save').next().hide();
            } else {
                $('.btn-save').next().hide();
            }
        });
    }

    var popupSMSPhoneNumber = function() {
        var sms_number = $('a.number').text().trim();
        sms_number = sms_number.replace(/^\+[0-9]* /, '').replace(/[^0-9]/g, '');
        $('.popup.sms-notify #number').val(sms_number);

        var country = $('.phone .number').attr('data-country') || 'US';
        if(country=='NONE') country = 'US';
        var $country = $('.popup.sms-notify #country');
        $country.val(country);
        $('.popup.sms-notify i').attr('class', 'flag-'+country.toLowerCase());
        $.dialog('sms-notify').open();
    }

    $('.section.sms-notify input#able1').on('click', function(event) {
        popupSMSPhoneNumber();
        return false;
    });
    $('.section.sms-notify input#able2').on('click', function() {
        update_sms_phone(false);
        return false;
    });

    $('.section.sms-notify a.number').on('click', function() {
        popupSMSPhoneNumber();
        return false;
    });
    $('.popup.sms-notify #country').on('change', function(event) {
        $('.popup.sms-notify i').attr('class', 'flag-'+$(this).val().toLowerCase());
    });
    $('.popup.sms-notify input#number').on('keyup', function(event) {
        if(event.which == 13){
            $('.popup.sms-notify .btn-confirm').click();
        }
    });
    $('.popup.sms-notify .btn-confirm').on('click', function(event) {
        event.preventDefault();

        $.dialog('sms-notify').close();

        update_sms_phone(true);
    });


    if(window.profile_image_exist) {
        $('.photo-func .btn-delete').show();
    } else {
        $('.photo-func .btn-delete').hide();
    }

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
					var img_url = 'url(' + $xml.find('resized_image_url').text() + ')';
					$('.photo-preview').find('img').css('background-image', img_url);
                    $('#header .you-main img').css('background-image', img_url);
                    $('.photo-func').show();
                    $('.photo-func .btn-change').text(_changePhoto);
                    $('.photo-func .btn-delete').show();
                    $('.upload-file').hide();
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
        var original_labels = alertify.labels
        alertify.set({'labels': {ok: 'Delete', cancel: 'Cancel'}});
        alertify.confirm(gettext('Are you sure?'), function (e) {
          if (e){
			$.post(
				'/delete_profile_image.json',
				{}, // parameters
				function(response){
					if (response.status_code != undefined && response.status_code == 1) {
					  //location.reload(false);
                        var img_url = 'url(' + response.resized_image_url + ')';
                        $('.photo-preview').find('img').css('background-image', img_url);
                        $('#header .you-main img').css('background-image', img_url);
                        $('.photo-func').show();
                        $('.photo-func .btn-change').text(_uploadPhoto);
                        $('.photo-func .btn-delete').hide();
                        $('.upload-file').hide();
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
        })
        alertify.set({'labels': original_labels})
	
		return false;
	});

	$('a#delete_token').on('click',function(event){
		var $this = $(this);

        alertify.confirm(gettext('Are you sure?'), function (e) {
        if (e){
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
        else return;
        })

		
		return false;
	});
  

	$('button#close_account').on('click',function(event){
        alertify.confirm(gettext('Are you sure you want to close your account?'), function (e) {
        if (e){
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
        else return;
        })

		return false;
	});

	$('button#remove_card').on('click',function(event){
        alertify.confirm(gettext('Remove your credit card information?'), function (e) {
        if (e){
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
        else return;
        })
		return false;
	});


	$('a#resend_confirmation').on('click',function(event){
		event.preventDefault();
		$.post(
			'/send_email_confirmation.json',
			{'resend' : true },
			function(response){
				if (response.status_code != undefined && response.status_code == 1) {
					alertify.alert(gettext("A confirmation email has been sent to {email}.".replace('{email}',response.email)));
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
		event.preventDefault();
        var $this = $(this);
		$.post(
			'/cancel_email_confirmation.json',
			{}, // parameters
			function(response){
				if (response.status_code != undefined && response.status_code == 1) {
					//location.reload();
                    $this.parent('.comment').remove();
                    $('input#username').removeAttr('disabled');
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
	$('a#cancel-rename').on('click',function(event){
		event.preventDefault();
        var $this = $(this);
		$.post(
			'/cancel_rename_request.json',
			{}, // parameters
			function(response){
				if (response.status_code != undefined && response.status_code == 1) {
					//location.reload();
                    $this.parent('.comment').remove();
                    $('input#username').removeAttr('disabled');
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

    $("#username").on('keyup', function(event) {
        $("#homepage").text('https://fancy.com/'+$(this).val().trim());
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

	$('.privacy .delete').click(function(e){
		e.preventDefault();
		$.post('/remove_all_recently_viewed_thing', function(json){
            if(!json) {
                alertify.alert("Failed to remove recently viewed things.");
                return;
            }
            if( json.status_code == 1) {
                alertify.alert(json.msg || "Successfully deleted.");
            } else {
                alertify.alert(json.error || "Failed to remove recently viewed things.");
            }
        }).error(function() {
            alertify.alert("Failed to remove recently viewed things.");
        });
	});

    $('div.notification span.www #updates').change(function() {
        if ($(this).attr('checked')) {
            $('div.section.notification span.comment').hide();
        } else {
            $('div.section.notification span.comment').show();
        }
    });
});
