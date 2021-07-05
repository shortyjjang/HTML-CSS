ALERT = alertify.alert

jQuery(function($) {
    window.signup = {
        is_narrow_screen: function() {
            try {
                return window.matchMedia('(max-width: 800px)').matches
            } catch(e) {
            }
            return false
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
        },
        check_phonenumber : function (required) {
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
        },
        check_phonenumber_required_error : function () {
            var field = this;
            var number = $.trim($(field).val())||'';
            if(number && is_valid_phonenumber(number)) {
                $(field).removeClass('error');
                $(field).parent().removeClass('error');
                return true;
            }
            return false;
        },
        check_phonenumber_error : function () {
            var field = this;
            var number = $.trim($(field).val())||'';
            if((!number) || is_valid_phonenumber(number)) {
                $(field).removeClass('error');
                $(field).parent().removeClass('error');
                return true;
            }
            return false;
        },
        check_required_field_error : function () {
            var field = this;
            var name = $.trim($(field).val())||'';
            if(name.length>=1) {
                $(field).removeClass('error');
                $(field).parent().removeClass('error');
                return true;
            }
            return false;
        }
    }

    signup.check_step1 = function() {
        var $firstname = $('#update-rfv').find('input[name="firstname"]');
        var $lastname = $('#update-rfv').find('input[name="lastname"]');
        var $phonenumber = $('#update-rfv').find('input[name="telephone"]');
        var $region = $('#update-rfv').find('.region-tag .select-lists');
        var $button = $('.popup.sign .btn-to-step2')

        return new Promise(function(resolve, reject) {
            if(!signup.check_name.call($firstname, true)) {
                reject(null);
                return;
            }
            if(!signup.check_name.call($lastname, true)) {
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

            resolve(null);
        });
    }

    $('#update-rfv').on('keyup', 'input.error[name="firstname"]', signup.check_name_error);
    $('#update-rfv').on('keyup', 'input.error[name="lastname"]', signup.check_name_error);
    $('#update-rfv').on('keyup', 'input.error[name="telephone"]', signup.check_phonenumber_required_error)
    $('#update-rfv').on('keyup', 'input.error[name="companyname"]', signup.check_required_field_error)
    $('#update-rfv').on('keyup', 'input.error[name="jobtitle"]', signup.check_required_field_error)
    $('#update-rfv').on('keyup', 'input.error[name="company-telephone"]', signup.check_phonenumber_error)

    $('#update-rfv .btn-to-step1').click(function(e) {
        $('#update-rfv').addClass('step1').removeClass('step2').removeClass('step3').removeClass('step4').removeClass('step5');
    });
    $('#update-rfv .btn-to-step2').click(function(e) {
        if(!$(this).hasClass('btn-back')) {
            signup.check_step1().then(function(response) {
                $('#update-rfv').addClass('step2').removeClass('step1').removeClass('step3').removeClass('step4').removeClass('step5');
            }, function(response) {
            })
        } else {
            $('#update-rfv').addClass('step2').removeClass('step1').removeClass('step3').removeClass('step4').removeClass('step5');
        }
    });
    function skip_document() {
        return ($('#update-rfv input[name="apply-with-working-email"]').is(':checked') ||
            ($.trim($('#update-rfv input[name="invitation-code"]').val()).length > 0));
    }
    $('#update-rfv .btn-to-step3').click(function(e) {
        if($(this).hasClass('btn-back')) {
            if(skip_document()) {
                $('#update-rfv .btn-back.btn-to-step2').click();
                return;
            }
        } else {
            var $company_name = $('#update-rfv').find('input[name="companyname"]');
            var $jobtitle = $('#update-rfv').find('input[name="jobtitle"]');
            var $phonenumber = $('#update-rfv').find('input[name="company-telephone"]');

            if($company_name.val().length<1) {
                signup.show_error($company_name, gettext("Please enter company name"));
                return;
            }
            if($jobtitle.val().length<1) {
                signup.show_error($jobtitle, gettext("Please enter job title"));
                return;
            }
            if(!signup.check_phonenumber.call($phonenumber)) {
                return;
            }
            if(skip_document()) {
                $('#update-rfv .btn-to-step4').click();
                return;
            }
        }
        $('#update-rfv').addClass('step3').removeClass('step1').removeClass('step2').removeClass('step4').removeClass('step5');
    });
    $('#update-rfv .btn-to-step4').click(function(e) {
        if(!($(this).hasClass('btn-back') || skip_document()))  {
            if(!$('#update-rfv .uploader').next('.tags').find('li').length) {
                alertify.alert(gettext("Please upload supporting documents."));
                return;
            }
        }
        $('#update-rfv').addClass('step4').removeClass('step1').removeClass('step2').removeClass('step3').removeClass('step5');
    });
    $('#update-rfv input[name="apply-with-working-email"]').click(function() {
        if($(this).is(":checked")) {
            $(this).closest('div').find('.toggle-label').show();
        } else {
            $(this).closest('div').find('.toggle-label').hide();
        }
    })
    $('#update-rfv .btn-signup').click(function(e) {
        event.preventDefault();

        if( $(this).attr('disabled') ) return;
        
        $('#update-rfv').find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });

        var $form = $(this).closest('fieldset');

        var $firstname = $form.find('input[name="firstname"]');
        var $lastname = $form.find('input[name="lastname"]');
        var $phonenumber = $form.find('input[name="telephone"]');

        var firstname = $.trim($firstname.val())||'';
        var lastname = $.trim($lastname.val())||'';
        var phonenumber = $.trim($phonenumber.val())||null;

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
        $(that).addClass('loading').prop('disabled',true);

        var param = {
            'fullname': firstname+' '+lastname,
            'firstname': firstname,
            'lastname': lastname
        };
        var extra_param = { };

        if(phonenumber && phonenumber.length>0) extra_param['phonenumber'] = phonenumber;
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
        }

        if(applicant_note) {
            extra_param['applicant_note'] = applicant_note;
        }
        extra_param['attachment'] = files;

        param['extra'] = JSON.stringify(extra_param);

        signup.check_step1().then(function() {
            $.post("/update-request-for-verification.json", param, function(response) {
                if (response.status_code != undefined && response.status_code == 1) {
                    $('#update-rfv').removeClass('step1').removeClass('step3').removeClass('step2').removeClass('step4').addClass('step5');

                    $.dialog('update-rfv').$obj.on('close', function() {
                    });
                } else {
                    var msg = response.message;
                    var error = response.error;
                    ALERT(msg || error);
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
    });
});

jQuery(function($) {
    $('#update-rfv .select-lists .trick').click(function(e) {
        e.preventDefault();
        $(this).closest('.select-lists').find('.lists').hide();
    });
    $('#update-rfv .select-lists a.selector').click(function(e) {
        e.preventDefault();
        $(this).next().show();
    });
    $('#update-rfv .select-lists .lists li a').click(function(e){
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

                var $li = '<li class="selected" data-tag="'+tag+'">'+text+' <a class="btn-del"></a></li>';
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
    $('#update-rfv .select-lists').parent().find('.tags').on('click', 'li a.btn-del', function(e){
        e.preventDefault();
        var tag = $(this).closest('li').attr('data-tag');
        $(this).closest('.multi-text').find('.lists a[data-tag="'+tag+'"]').trigger('click');
    })
});

jQuery(function($) {
    $('#update-rfv').find('.uploader').next('.tags').on('click', 'li a.btn-del', function(e){
        e.preventDefault();
        $(this).closest('li').remove();
    })
    $('#update-rfv').find('.uploader:not(.loading) input[type="file"]').change(function(event) {
        var $this = $(this);
        var $uploader = $this.closest('.uploader');

        $this.attr('disabled','disabled');
        $('#update-rfv').find('.btn-signup').attr('disabled','disabled').addClass('loading');

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
                    $('#update-rfv').find('.btn-signup').attr('disabled', null).removeClass('loading')
                }
            })
        }
    });
});


