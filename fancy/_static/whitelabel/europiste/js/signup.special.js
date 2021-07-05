TEST = false;

jQuery(function($) {
    signup.dlg_signup.$obj.on('open', function() {
        $('#popup_container').data('modal', false);
    });

    if(window.pre_opened_dialog_name=='sign') {
        signup.dlg_signup.$obj.trigger('open');
    }

    $('.popup.sign .select-lists .trick').click(function(e) {
        e.preventDefault();
        $(this).closest('.select-lists').find('.lists').hide();
    });
    $('.popup.sign .select-lists a.selector').click(function(e) {
        e.preventDefault();
        $(this).next().show();
    });

    $('.popup.sign .select-lists .lists li a').click(function(e){
        e.preventDefault();
        var tag = $(this).data('tag');
        var text = $(this).data('text') || $(this).text();

        var $list = $(this).closest('.select-lists');
        var $selector = $list.find('a.selector');
        if($list.hasClass('single-select')) {
            if($(this).is(".selected")){
                $list.find('.lists li a').removeClass('selected').closest('.multi-text').find(".tags li[data-tag]").remove();
                $selector.text($selector.data('original-label'));
            }else{
                $list.find('.lists li a').removeClass('selected').closest('.multi-text').find(".tags li[data-tag]").remove();

                var $li = '<li class="selected" data-tag="'+tag+'">'+text+' <a href="#" class="btn-del"></a></li>';
                $(this).addClass('selected').closest('.multi-text').find(".tags").append($li);

                if(!$selector.data('original-label')) {
                    $selector.data('original-label', $selector.text());
                }
                $selector.text(text);

                if($list.hasClass('error')) {
                    $list.parent().removeClass('error');
                    $list.removeClass('error');
                }
            }
        } else {
            if($(this).is(".selected")){
                $(this).removeClass('selected').closest('.multi-text').find('.tags li[data-tag="'+tag+'"]').remove();
            }else{
                var $li = '<li class="selected" data-tag="'+tag+'">'+text+' <a href="#" class="btn-del"></a></li>';
                $(this).addClass('selected').closest('.multi-text').find(".tags").append($li);
                if($list.hasClass('error')) {
                    $list.parent().removeClass('error');
                    $list.removeClass('error');
                }
            }
        }
        $(this).closest('.lists').hide();
    })
    $('.popup.sign .select-lists').parent().find('.tags').on('click', 'li a.btn-del', function(e){
        e.preventDefault();
        var tag = $(this).closest('li').attr('data-tag');
        $(this).closest('.multi-text').find('.lists a[data-tag="'+tag+'"]').trigger('click');
    })

    $('.popup.sign .btn-to-step1').click(function(e) {
        e.preventDefault();

        $('#signup-form').addClass('step1').removeClass('step2').removeClass('step3').removeClass('step4').removeClass('step5');
        $('.popup.sign .slideshow .pagination a#side-slide-1').click();
    })
    $('.popup.sign .btn-to-step2').click(function(e) {
        e.preventDefault();

        if(!$(this).hasClass('btn-back')) {
            signup.check_step1().then(function(response) {
                $('#signup-form').removeClass('step1').addClass('step2').removeClass('step3').removeClass('step4').removeClass('step5');
                $('.popup.sign .slideshow .pagination a#side-slide-2').click();
            }, function(response) {
            })
        } else {
            $('#signup-form').removeClass('step1').addClass('step2').removeClass('step3').removeClass('step4').removeClass('step5');
            $('.popup.sign .slideshow .pagination a#side-slide-2').click();
        }
    })
    function skip_document() {
        return ($('.popup.sign input[name="apply-with-working-email"]').is(':checked') ||
            ($.trim($('.popup.sign input[name="invitation-code"]').val()).length > 0));
    }

    $('.popup.sign .btn-to-step3').click(function(e) {
        e.preventDefault();

        if($(this).hasClass('btn-back')) {
            if (skip_document()) {
                $('.popup.sign .btn-back.btn-to-step2').click();
                return;
            }
        } else {
            var $company_name = signup.form_signup.find('input[name="companyname"]');
            var $jobtitle = signup.form_signup.find('input[name="jobtitle"]');
            //var $phonenumber = signup.form_signup.find('input[name="company-telephone"]');
            
            if($company_name.val().length<1) {
                signup.show_error($company_name, gettext("Please enter company name"));
                return;
            }
            if($jobtitle.val().length<1) {
                signup.show_error($jobtitle, gettext("Please enter job title"));
                return;
            }
            //if(!signup.check_phonenumber.call($phonenumber)) return;
            
            if (skip_document()) {
                $('.popup.sign .btn-to-step4').click();
                return;
            }
        }

        $('#signup-form').removeClass('step1').removeClass('step2').addClass('step3').removeClass('step4').removeClass('step5');
        $('.popup.sign .slideshow .pagination a#side-slide-3').click();
    });
    $('.popup.sign .btn-to-step4').click(function(e) {
        e.preventDefault();
        
        if(!($(this).hasClass('btn-back') || skip_document()))  {
            if(!signup.form_signup.find('.uploader').next('.tags').find('li').length) {
                alertify.alert(gettext("Please upload supporting documents."));
                return;
            }
        }
        $('#signup-form').removeClass('step1').removeClass('step2').removeClass('step3').addClass('step4').removeClass('step5');
        $('.popup.sign .slideshow .pagination a#side-slide-4').click();
    });
    $('.popup.sign input[name="apply-with-working-email"]').click(function() {
        if($(this).is(":checked")) {
            $(this).closest('div').find('.toggle-label').show();
        } else {
            $(this).closest('div').find('.toggle-label').hide();
        }
    })

    signup.check_step1 = function() {
        var $firstname = signup.form_signup.find('input[name="firstname"]');
        var $lastname = signup.form_signup.find('input[name="lastname"]');
        var $email = signup.form_signup.find('input[name="email"]');
        var $password = signup.form_signup.find('input[name="user_password"]');
        var $username = signup.form_signup.find('input[name="username"]');
        var $phonenumber = signup.form_signup.find('input[name="telephone"]');
        var $region = signup.form_signup.find('.region-tag .select-lists');
        var $button = $('.popup.sign .btn-to-step2')

        if(TEST) {
            return new Promise(function(resolve, reject) {
                resolve();
            })
        }

        return new Promise(function(resolve, reject) {
            if(!signup.check_name.call($firstname, true)) {
                reject(null);
                return;
            }
            if(!signup.check_name.call($lastname, true)) {
                reject(null);
                return;
            }
            if(!signup.check_email.call($email, true)) {
                reject(null);
                return;
            }
            if(!signup.form_signup.data('sns')) {
                if($password.length && !signup.check_password.call($password, null, true)) {
                    reject(null);
                    return;
                }
            }
            if(!signup.check_username.call($username, null, true)) {
                reject(null);
                return;
            }

            if(!signup.check_phonenumber.call($phonenumber, true)) {
                reject(null);
                return;
            }

            if($region.find('li>a.selected').length<1) {
                signup.show_error($region, gettext("Select your region"));
                reject(null);
                return;
            }

            $button.addClass('loading').prop('disabled',true);

            var email = $.trim($email.val())||'';
            var params = {'email':email};

            $.get('/check-field/email', params, function(response) {
                if (response.status_code != undefined && response.status_code == 1) {
                    resolve(response);
                } else if (response.status_code != undefined && response.status_code == 0) {
                    signup.show_error($email, response.message)
                    reject(response);
                }
            }, 'json')
            .fail(function(xhr) {
                ALERT("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
                reject(null);
            })
            .always(function() {
                $button.removeClass('loading').prop('disabled',false);
            });
        });
    }
});

jQuery(function($) {
    $('.popup.sign .add-address').click(function() {
        var $address = $(this).parent().next('.address')
        $address.toggleClass("hidden");
        $(this).toggleClass("folded");
    });

    $('.popup.sign .address select[name="country"]').change(function () {
        var country = $(this).val();
        if(country=='US') {
            $(this).closest('.address').find('select[name="state"]').parent('p').removeClass('hidden').end().end().find('input[name="state-text"]').parent('p').addClass('hidden');
        } else {
            $(this).closest('.address').find('select[name="state"]').parent('p').addClass('hidden').end().end().find('input[name="state-text"]').parent('p').removeClass('hidden');
        }
    });
});

jQuery(function($) {
    signup.check_phonenumber = function (required) {
        var field = this;
        var phonenumber = $.trim($(field).val())||'';
        if(phonenumber && is_valid_phonenumber(phonenumber)) {
            return true;
        }
        if(!(required || phonenumber)) {
            return true;
        }
        if(required && !phonenumber) {
            signup.show_error($(field), gettext("Please enter your phone number"));
        } else if(phonenumber) {
            signup.show_error($(field), gettext("Please enter valid phone number"));
        }
        return false;
    }
    signup.check_phonenumber_required_error = function () {
        var field = this;
        var number = $.trim($(field).val())||'';
        if(number && is_valid_phonenumber(number)) {
            $(field).removeClass('error');
            $(field).parent().removeClass('error');
            return true;
        }
        return false;
    }
    signup.check_phonenumber_error = function () {
        var field = this;
        var number = $.trim($(field).val())||'';
        if((!number) || is_valid_phonenumber(number)) {
            $(field).removeClass('error');
            $(field).parent().removeClass('error');
            return true;
        }
        return false;
    }

    signup.check_required_field_error = function () {
        var field = this;
        var name = $.trim($(field).val())||'';
        if(name.length>=1) {
            $(field).removeClass('error');
            $(field).parent().removeClass('error');
            return true;
        }
        return false;
    }
    signup.form_signup.off('keyup','input[name="email"]');
    signup.form_signup.off('click', '.btn-signup');
    signup.form_signup.off('keyup', 'input:text, input:password');

    signup.form_signup.on('keyup', 'input.error[name="email"]', signup.check_email_error)
    signup.form_signup.on('keyup', 'input.error[name="user_password"]', signup.check_password_error)
    signup.form_signup.on('keyup', 'input.error[name="firstname"]', signup.check_name_error)
    signup.form_signup.on('keyup', 'input.error[name="lastname"]', signup.check_name_error)
    signup.form_signup.on('keyup', 'input.error[name="username"]', signup.check_username_error)
    signup.form_signup.on('keyup', 'input.error[name="telephone"]', signup.check_phonenumber_required_error)

    signup.form_signup.on('keyup', 'input.error[name="companyname"]', signup.check_required_field_error)
    signup.form_signup.on('keyup', 'input.error[name="jobtitle"]', signup.check_required_field_error)
    signup.form_signup.on('keyup', 'input.error[name="company-telephone"]', signup.check_phonenumber_error)

    signup.form_signup.on('keyup', 'input:text, input:password', function(event) {
        if($(this).val() && event.which == 13){
            event.preventDefault();
            var $next = $(this).closest('p').next('p').find("input:text:visible, input:password:visible");
            if($next.length) $next.focus();
            //else $(this).closest('fieldset').find('.btn-signup').click();
        }
    });

    signup.form_signup.off('open');
    signup.form_signup.on('open', function(event) {
        event.preventDefault()
        signup.form_signup.find('input[name="firstname"]').focus();

        signup.form_signup.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        })
        try {track_event('Signup Popup', {'channel': 'gear'});} catch(e) {}
        try { dataLayer.push({'event': 'Signup_Begin' });} catch(e){}
    });


    signup.form_sns_signup_detail.off('open');
    signup.form_sns_signup_detail.on('open', function(event, sns) {
        if(sns) {
            signup.form_signup.find('.sns').hide();
            signup.form_signup.find('input[name="username"]').parent().removeClass("left");
            signup.form_signup.find('input[name="user_password"]').parent().addClass("hidden");
            signup.form_signup.data('sns',sns);
        } else {
            signup.form_signup.find('.sns').show();
            signup.form_signup.find('input[name="username"]').parent().addClass("left");
            signup.form_signup.find('input[name="user_password"]').parent().removeClass("hidden");
            signup.form_signup.data('sns',null);
        }

        $('.popup.sign').find('.signup').removeClass('login email')
    });
});


jQuery(function($) {
    signup.form_signup.find('.uploader').next('.tags').on('click', 'li a.btn-del', function(e){
        e.preventDefault();
        $(this).closest('li').remove();
    })
    signup.form_signup.find('.uploader:not(.loading) input[type="file"]').change(function(event) {
        var $this = $(this);
        var $uploader = $this.closest('.uploader');

        $this.attr('disabled','disabled');
        signup.form_signup.find('.btn-signup').attr('disabled','disabled').addClass('loading');

        if($this.val()=='') {
            $this.attr('disabled',null);
            $uploader.find('span').text('No file selected').attr('disabled',null).end().removeClass('loading');
        } else {
            $uploader.find('span').text($(this).val().split("\\").pop()).end().addClass('loading');
            $.ajaxFileUpload({
                url:'/upload_document.json',
                fileElementId:'document-file-upload',
                dataType:'json',
                success:function(json, status) {
                    if(json && json.status_code) {
                        var $li = '<li class="selected" data-file-id="'+json.id+'" data-file-hash="'+json.hash+'">'+json.filename+' <a class="btn-del"></a></li>';
                        $uploader.next(".tags").append($li);
                        $this.val('');
                    }
                },
                error: function (data, status, e) {
                },
                complete: function() {
                    $this.closest('.uploader').removeClass('loading');
                    $this.attr('disabled',null);
                    signup.form_signup.find('.btn-signup').attr('disabled', null).removeClass('loading')
                }
            })
        }
    });
});

jQuery(function($) {
    signup.form_signup.on('click', '.btn-signup', function(event) {
        event.preventDefault();

        if( $(this).attr('disabled') ) return;
        
        signup.form_signup.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });

        var $form = $(this).closest('fieldset');

        var $email = $form.find('input[name="email"]');
        var $referrer = $form.find('input[name="referrer"]');
        var $invitation_key = $form.find('input[name="invitation_key"]');
        var $user_id = $form.find('input[name="user_id"]');
        var $firstname = $form.find('input[name="firstname"]');
        var $lastname = $form.find('input[name="lastname"]');
        var $username = $form.find('input[name="username"]');
        var $phonenumber = $form.find('input[name="telephone"]');
        var $password = $form.find('input[name="user_password"]');

        var firstname = $.trim($firstname.val())||'';
        var lastname = $.trim($lastname.val())||'';
        var email = $.trim($email.val())||'';
        var referrer = $.trim($referrer.val())||null;
        var invitation_key = $.trim($invitation_key.val())||null;
        var user_id = $.trim($user_id.val())||null;
        var username = $.trim($username.val())||null;
        var phonenumber = $.trim($phonenumber.val())||null;
        var password = $.trim($password.val())||null;

        var address = null;
        var company_address = null;
        if(!$form.find('.step1 .address').hasClass('hidden')) {
            var $address_line1 = $form.find('.step1 input[name="address1"]');
            var $address_line2 = $form.find('.step1 input[name="address2"]');
            var $city = $form.find('.step1 input[name="city"]');
            var $state_text = $form.find('.step1 input[name="state-text"]');
            var $state = $form.find('.step1 select[name="state"]');
            var $zip = $form.find('.step1 input[name="zip"]');
            var $country = $form.find('.step1 select[name="country"]');

            address = {
                address1 : $.trim($address_line1.val())||'',
                address2 : $.trim($address_line2.val())||'',
                city : $.trim($city.val())||'',
                zip : $.trim($zip.val())||'',
                state : $country.val()=='US'?$state.val():$.trim($state_text.val())||'',
                country :  $country.val()
            }
        }

        $company_name = $form.find('input[name="companyname"]');
        $jobtitle = $form.find('input[name="jobtitle"]');
        $company_website = $form.find('input[name="company-website"]');
        $company_phonenumber = $form.find('input[name="company-telephone"]');
        $invitation_code = $form.find('input[name="invitation-code"]');

        var company_name = $.trim($company_name.val())||null;
        var jobtitle = $.trim($jobtitle.val())||null;
        var company_website = $.trim($company_website.val())||null;
        var company_phonenumber = $.trim($company_phonenumber.val())||null;
        var invitation_code = $.trim($invitation_code.val())||null;

        var $applicant_note = $form.find(".applicant-note textarea")
        var applicant_note = $.trim($applicant_note.val()) || null;

        if(!$form.find('.step2 .address').hasClass('hidden')) {
            var $address_line1 = $form.find('.step2 input[name="address1"]');
            var $address_line2 = $form.find('.step2 input[name="address2"]');
            var $city = $form.find('.step2 input[name="city"]');
            var $state_text = $form.find('.step2 input[name="state-text"]');
            var $state = $form.find('.step2 select[name="state"]');
            var $zip = $form.find('.step2 input[name="zip"]');
            var $country = $form.find('.step2 select[name="country"]');

            company_address = {
                address1 : $.trim($address_line1.val())||'',
                address2 : $.trim($address_line2.val())||'',
                city : $.trim($city.val())||'',
                zip : $.trim($zip.val())||'',
                state : $country.val()=='US'?$state.val():$.trim($state_text.val())||'',
                country :  $country.val()
            }
        }

        var region_tags = [];
        $form.find('.region-tag .tags').find('li').each(function(i,elem) {
            region_tags.push($(elem).data('tag'));
        });

        var profession_tags = [];
        $form.find('.professional-category .tags').find('li').each(function(i,elem) {
            profession_tags.push($(elem).data('tag'));
        });

        if(!profession_tags.length) {
            var $profession = signup.form_signup.find('.professional-category .select-lists');
            signup.show_error($profession, gettext("Please specify your profession"));
            return;
        }

        var files = [];
        $form.find('.step3 .tags').find('li').each(function(i,elem) {
            files.push({
                'id': $(elem).data('file-id'),
                'hash': $(elem).data('file-hash')
            })
        });

        var that = this;
        if(!TEST) {
            $(that).addClass('loading').prop('disabled',true);
        }

        var param = {
            'fullname': firstname+' '+lastname,
            'firstname': firstname,
            'lastname': lastname
        };
        var extra_param = { };

        if(invitation_key && invitation_key.length>0) param['invitation_key'] = invitation_key;
        if(referrer && referrer.length>0) param['referrer'] = referrer;
        if(user_id && user_id.length>0) param['user_id'] = user_id;
        if(email.length>0) param['email'] = email;
        if(username.length>0) param['username'] = username;

        if(phonenumber && phonenumber.length>0) extra_param['phonenumber'] = phonenumber;
        if(address) {
            extra_param['address'] = address;
        }
        if(region_tags) {
            extra_param['regions'] = region_tags;
        }
        if(profession_tags) {
            extra_param['tags'] = profession_tags;
        }
        if (invitation_code && invitation_code.length > 0) {
            extra_param['invitation_code'] = invitation_code;
        }
        
        extra_param['company'] = {
            'name': company_name,
            'title' : jobtitle,
            'website' : company_website,
            'phonenumber' : company_phonenumber,
            'address': company_address,
        }
        
        if(applicant_note) {
            extra_param['applicant_note'] = applicant_note;
        }
        extra_param['attachment'] = files;

        param['extra'] = JSON.stringify(extra_param);

        var sns = signup.form_signup.data('sns');
        if(sns) {
            param['sns'] = sns;
        } else {
            param['password'] = password;
        }

        var activate_url = $('.container').is('.activate_mode') ? '/activate-login?success=true' : '';
        var next_url = $form.find('input.next_url').val() || '';

        signup.check_step1().then(function() {
            $.post("/email_signup.json", param, function(response) {
                if (response.status_code != undefined && response.status_code == 1) {
                    signup.onCompleteSignup('gear');

                    $('#signup-form').removeClass('step1').removeClass('step3').removeClass('step2').removeClass('step4').addClass('step5');
                    $('.popup.sign .slideshow .pagination a#side-slide-5').click();

                    $.dialog('sign').$obj.on('close', function() {
                        /*
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
                        */
                        location.href = "/"
                    });
                } else if (response.status_code != undefined && response.status_code == 0) {
                    var msg = response.message;
                    var error = response.error;
                    if (response.error != undefined && response.error.indexOf('email')>=0){
                        $form.find('.hidden-email').show();  

                        var $email = signup.form_signup.find('input[name="email"]');
                        if($email.parent().hasClass('hidden-email')) {
                            ALERT(msg);
                        } else {
                            signup.show_error($email, msg)
                        }
                    }

                    if (response.error != undefined && response.error.indexOf('username')>=0){
                        var $username = signup.form_signup.find('input[name="username"]');
                        signup.show_error($username, msg)
                    } else {
                        ALERT(msg);
                    }
                    $('.popup.sign .btn-to-step1').click();
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
                $(that).removeClass('loading').prop('disabled',false).css({'cursor': ''});
            });

        }, function(response) {
            $('.popup.sign .btn-to-step1').click();
            $(that).removeClass('loading').prop('disabled',false)
        });
    })
});
