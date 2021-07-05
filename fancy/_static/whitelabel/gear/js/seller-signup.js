jQuery(function($) {
    $('#content .online li').click(function(e) {
        if($(this).hasClass('not')) {
            // clicked 'Not currently selling online'
            if($('#content .online li.selected:not(.not)').length>=0) {
                // selection exists
                $('#content .online li.not').addClass('selected')
                $('#content .online li:not(.not)').removeClass('selected')
            }
        } else {
            $(this).toggleClass('selected')
            if($('#content .online li.selected:not(.not)').length==0) {
                // no selection
                $('#content .online li.selected.not').addClass('selected')
            } else {
                $('#content .online li.selected.not').removeClass('selected')
            }
        }
    })
})

jQuery(function($) {
    $('#content.frm .step1 button#btn-signup-step1').click(function(event) {
        var $button = $(this)
        var params = {}
        $("#content.frm.step1 .step1 input").each(function(){
            if(this.name) params[this.name] = this.value;
        })

        if( !params['brand_name'] ){
            alertify.alert(gettext("Please enter your store name"));
            return;
        }
        var brand_name = params['brand_name']
        if(!(brand_name.length>=3 && brand_name.length<=30 && brand_name.match('^[a-zA-Z0-9_ ]+$'))) {
            alertify.alert(gettext("Please enter alphanumeric characters for your store name."));
            return;
        }
        if(('firstname' in params && 'lastnamne' in params) && !(params['firstname'] && params['lastname'])) {
            alertify.alert(gettext("Please enter your full name"));
            return;
        }
        if( "email" in params ){
            if( !params['email'] ){
                alertify.alert(gettext("Please enter your email address"));
                return;
            }
            // see common/util.js to change emailRegEx
            if(!emailRegEx.test($.trim(params["email"]))) {
                alertify.alert(gettext("Please enter a valid email address"));
                return;
            }
        }
        if( "password" in params && !params['password'] ){
            alertify.alert(gettext("Please enter your password"));
            return;
        }
        if( 'password' in params ) {
            password = params['password']
            if(!password.match(/^(?=.*[^a-zA-Z])(?=.*[a-zA-Z]).{6,}$/)) {
                alertify.alert(gettext("Your password must contain at least six letters, and include a number or symbol."));
                return
            }
        }

        function goto_step2() {
            $('.frm.step1').addClass('step2').removeClass('step1');
            try {track_event('Begin Signup', {'channel': 'gear/merchant', 'via': 'web'}); } catch(e) {}
        }

        if('email' in params) {
            $button.prop('disabled','disabled');
            $.get('/check-field/email', {'email':params.email}, function(response) {
                if (response.status_code != undefined && response.status_code == 1) {
                    goto_step2()
                } else if (response.status_code != undefined && response.status_code == 0) {
                    var msg = response.message;
                    var error = response.error;
                    alertify.alert(msg || error || "Error occurred. please try again.")
                    return;
                }
            }, 'json')
            .fail(function(xhr) {
                alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            })
            .always(function() {
                $button.prop('disabled',false);
            });
        } else {
            goto_step2()
        }
    })
})

jQuery(function($) {
    var $form_signup_basic = $('.step1 fieldset')
    var $form_signup_step2 = $('.step2')
    var $form_signup_detail = $('.step2 .detail')
    var $form_prompt_username = $.dialog('prompt_username').$obj

    function get_signup_params() {
        var signup_params = {}
        signup_params['with-basic-info'] = $form_signup_basic.find('input[name="with-basic-info"]').val()
        //signup_params['brandname'] = $form_signup_basic.find('input[name="brand_name"]').val()
        signup_params['username'] = $form_signup_basic.find('input[name="brand_name"]').val().replace(/ /g,'').toLowerCase()
        signup_params['firstname'] = $form_signup_basic.find('input[name="firstname"]').val()
        signup_params['lastname'] = $form_signup_basic.find('input[name="lastname"]').val()
        signup_params['email'] = $form_signup_basic.find('input[name="email"]').val()
        signup_params['password'] = $form_signup_basic.find('input[name="password"]').val()
        return signup_params
    }

    function get_merchant_params() {
        var merchant_country = $form_signup_detail.find('select[name="country"]').val()
        var merchant_params = {
            'brand_name': $form_signup_basic.find('input[name="brand_name"]').val(),
            'merchant_name': [$form_signup_basic.find('input[name="firstname"]').val(),$form_signup_basic.find('input[name="lastname"]').val()].join(' ').trim(),
            'merchant_street_address': $form_signup_detail.find('input[name="address1"]').val(),
            'merchant_street_address_2': $form_signup_detail.find('input[name="address2"]').val(),
            'merchant_city': $form_signup_detail.find('input[name="city"]').val(),
            'merchant_postal_code': $form_signup_detail.find('input[name="zip"]').val(),
            'merchant_phone_number': $form_signup_detail.find('input[name="phone"]').val(),
            'merchant_country': merchant_country,
            'merchant_state': merchant_country=='US'?$form_signup_detail.find('select[name="us-state"]').val():$form_signup_detail.find('input[name="state"]').val()
        }
        return merchant_params
    }


    function try_signup_user(signup_params, merchant_params, notify_username_duplicate) {
        disable_create_button()
        $.post('/email_signup.json', signup_params, function(response) {
            if(response.status_code!=undefined && response.status_code==1) {
                signup_seller(merchant_params)
                try{ gtag('event', 'conversion', { 'send_to': 'AW-733896396/cNgYCJWEvKIBEMy9-d0C' }); } catch(e) { console.log(e) }
                try{ fbq('track', 'CompleteRegistration'); } catch(e) { console.log(e) }
            } else if (response.status_code != undefined && response.status_code == 0) {
                if( response.error == 'email_duplicate') {
                    if( !signup_params['password'] ) {
                        alertify.alert(gettext('Email already exists'))
                        return
                    }
                    var login_params = {
                        'username': signup_params['email'],
                        'password': signup_params['password']
                    }
                    $.post('/login.json', {'username':$.trim(login_params['email']), 'password':login_params['password'], 'callback':''}, function(response){
                        if (response.status_code != undefined && response.status_code == 1) {
                            signup_seller(merchant_params)
                        } else if (response.status_code != undefined && response.status_code == 0) {
                            alertify.alert(gettext('Email already exists.'))
                            reset_create_button()
                        }
                    }, 'json').fail(function(xhr) {
                        alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
                        reset_create_button()
                    })
                } else if (response.error.search('name_blacklist')>=0 || response.error.search()) {
                    reset_create_button()
                    $.dialog('prompt_username').open()
                    $form_prompt_username.trigger('open')
                    if(notify_username_duplicate) {
                        alertify.alert(response.message || gettext('Username is not available.'))
                    }
                } else {
                    alertify.alert(response.message || 'An unknown error has occurred.\nPlease try again.');
                    reset_create_button()
                }
            }
        }, 'json').fail(function(xhr) {
            alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            reset_create_button()
        }).always(function() {
        })
    }

    $form_prompt_username.on('open', function(event) {
        $form_prompt_username.find('#retry-create-account').prop('disabled',null)
    })
    $form_prompt_username.find('#retry-create-account').click(function(event) {
        event.preventDefault()
        var signup_params = get_signup_params()
        var merchant_params = get_merchant_params()

        var username = $form_prompt_username.find('#alternative_username').val()
        if(!(username.length>=3 && username.length<=30 && username.match('^[a-zA-Z0-9_]+$'))) {
            alertify.alert(gettext("Please enter alphanumeric characters for your store name."))
            return
        }
        signup_params['username'] = username

        $(this).prop('disabled', true)
        try_signup_user(signup_params, merchant_params, true)
    })

    function disable_create_button() {
        $form_signup_step2.find('button.btn-create').attr('disabled',true).addClass('disabled').html('Processing...');
    }
    function reset_create_button() {
        $form_signup_step2.find('button.btn-create').removeAttr('disabled').removeClass('disabled').html('Create Account');
    }

    $form_signup_step2
    .on('change', '.detail select[name="country"]', function(event) {
        if($(this).val()=='US') {
            $form_signup_detail.find('select.state').show()
            $form_signup_detail.find('input.state').hide()
        } else {
            $form_signup_detail.find('select.state').hide()
            $form_signup_detail.find('input.state').show()
        }
    })
    .on('click', 'button.btn-create', function(event) {
        event.preventDefault()
        var $button = $(this)

        var signup_params = get_signup_params()
        var merchant_params = get_merchant_params()

        /*var already_selling = []
        $('#content .online li.selected:not(.not)>input').each(function() {
            already_selling.push($(this).val())
        })
        if(already_selling) {
            merchant_params['already_selling'] = already_selling.join(',')
        }*/

        if(!merchant_params.merchant_street_address){
            alertify.alert(gettext("Address line 1 is required"));
            return false;
        }

        if(!merchant_params.merchant_city){
            alertify.alert(gettext("City is required"));
            return false;
        }

        if(!merchant_params.merchant_postal_code ){
            alertify.alert(gettext("Postal code is required"));
            return false;
        }

        if(!merchant_params.merchant_phone_number ){
            alertify.alert(gettext("Phone is required"));
            return false;
        }

        disable_create_button()
        if(window.logged_in) {
            signup_seller(merchant_params)
        } else {
            try_signup_user(signup_params, merchant_params)
        }
    })

    function signup_seller(params) {
        $.post("/merchant-signup-2-new.json",params, function(response) {
            if (response.status_code != undefined && response.status_code == 1) {
                try {track_event('Signup Complete', {'channel': 'gear/merchant', 'via': 'web'}); } catch(e) {}
                location.href = '/merchant/get-started';
            } else if (response.status_code != undefined && response.status_code == 0) {
                if(response.message != undefined){
                    alertify.alert(response.message);
                } else {
                    alertify.alert( "Error occured. please try again." );	
                }
            }
            reset_create_button()
        }, "json").fail(function() {
            alertify.alert( "Error occured. please try again." );
            reset_create_button()
        })
    }
})
