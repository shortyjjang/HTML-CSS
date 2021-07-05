// this script is depends on signup.js

jQuery(function($) {
    function lsGet(key) {
        if (window.localStorage) {
            return localStorage.getItem(key);
        } else {
            return false;
        }
    }
    function lsSet(key, value) {
        if (window.localStorage) {
            return localStorage.setItem(key, value);
        } else {
            return false;
        }
    }
    if (window.openSignupPromo) {
        function ensureLoaded(test, onLoaded) {
            var done = false;
            var pid = setInterval(function() {
                var loaded;
                if (!done) {
                    try {
                        loaded = test();
                        done = loaded !== undefined;
                    } catch(e) {}
                } else {
                    clearInterval(pid);
                    onLoaded(loaded);
                }
            }, 100);
            return pid;
        }
        // open promotion popup on load if ck_dm_signup cookie is not set
        var openablePath = location.pathname.search(/\/(cart|checkout|confirmation|login|signup|giveaways?|pages\/holiday-giveaway)(?![a-zA-Z])/) < 0;
        ensureLoaded(function() {
            return window.$.dialog;
        }, function() {
            if (window.popup_default === 'dm-signup' &&
                !window.pre_opened_dialog_name &&
                !(document.cookie.indexOf('ck_dm_signup=') !== -1 || lsGet('ck_dm_signup')) &&
                openablePath
            ) {
                $.dialog('dm-signup').open();
                lsSet('ck_dm_signup', true);
            }
        });
    }
    var dlg_signup = $.dialog('dm-signup');

    // var dialogs = {
    //     'sign': dlg_signup,
    // }

    var form_signup = $('.dm-signup .frm .step1');
    var form_signup_detail = $('.dm-signup .frm .step2');

    signup.is_narrow_screen = function() {
        return true
    }
    
    function gotoSignup() {
        dlg_signup.$obj.find('.frm').removeClass('step2').addClass('step1')
        form_signup.trigger('open')
    }

    // signup first phase dialog/form
    dlg_signup.$obj
    .on('click', '.ly-close,.popup-close', function(event) {
        event.preventDefault()
        $.cookie.set('ck_dm_signup',true,9999)
        dlg_signup.close()
    })
    .on('open', function(event) {
        gotoSignup()
    })

    signup.init_form_signup(form_signup, function(){
        var agree = form_signup.find('#dm-signup-email-check').prop('checked')
        if(!agree){
            ALERT('Please check the box to allow us to send you personalized emails with exclusive offers');
            return false;
        }
        return true;
    }, function(response){
        form_signup.username = response.username;
        form_signup.email = response.email;

        dlg_signup.$obj.find('.frm').removeClass('step1').addClass('step2')

        onBeginSignup(true);
        try { track_event('Begin Signup', { 'channel': 'gear', 'via':'web-promo' }); } catch (e) {}
    }, function(response){
        var msg = response.message;
        var error = response.error;
        if(error=='email_duplicate') {
            $.post("/coupon_popup_subscribe.json", { email: response.email }).then(function(resp) { 
                if(resp.status_code){
                    dlg_signup.$obj.addClass('success')
                    $.cookie.set('ck_dm_signup',true,9999)
                }else{
                    ALERT(resp.message || 'Please try again later');
                }
            }).fail(function(xhr) {
                ALERT("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            })
        } else {
            signup.show_error($email, msg)
        }
        return;
    });

    form_signup
        .on('open', function(event) {
            event.preventDefault();
            try {track_event('Signup Popup', {'channel': 'gear', 'via':'web-promo'});} catch(e) {}
            return false;
        });


    // signup second phase (detail) dialog/form
    signup.init_form_signup_detail(form_signup, form_signup_detail, {'promo-signup':true}, function(activate_url, next_url){
        onCompleteSignup('gear');
        dlg_signup.$obj.addClass('success')
        dlg_signup.$obj.on('close', function(event) {
            location.reload()
        })
        $.cookie.set('ck_dm_signup',true,9999)
    });
    

    var onBeginSignup = function() {
        form_signup_detail.trigger('open')
    }

    var onCompleteSignup = function(channel) {
        try {track_event('Complete Signup', {'channel':channel, 'via':'web-promo'});} catch(e){}
        try { fbq('track', 'CompleteRegistration'); } catch (e) {}
        $.cookie.set('ck_dm_signup',true,9999)

        var digitalData = {page:{}, event:[], order:{}, products:[]};
        digitalData.event = [{eventInfo:{eventName:'New User'}}];
        saveDigitalData(digitalData);
    }

});
