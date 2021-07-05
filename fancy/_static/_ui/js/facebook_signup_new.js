jQuery(function($){
$('form button.sign').live('click',function(event){
    var $this = $(this), $form = $this.closest('form'), $fieldset = $form.find('fieldset');
    var username = $.trim($form.find('#username').val() || '');
    var email = $.trim($form.find('#email').val()||'');
    var post_to_facebook = $('#fb-wall').is(':checked');
    var illegalCharsUsername = /\W/; // allow letters, numbers, and underscores
    var fb_request_id = $this.attr('fbrid');

    var referrer = $.trim($form.find('.referrer').val() || '');
    var invitation_key = $.trim($form.find('.invitation_key').val() || '');

    $form.find('input.error').removeClass('error').end().find('div.error').hide();
    $form.find('input.error').removeClass('error').end().find('p.error').hide();

    function displayError(fieldSelector, msg) {
    var $error = $form.find(fieldSelector).next(".error-label");
    if ($error.length > 0) {
    $form
    .find('.error-label').hide().end()
    .find('input.error').removeClass('error').end();
    $error.show().text(gettext(msg));
    $error.prev("input").addClass("error");
    return false;
    }

    $error = $form.find('div.error');
    if ($error.length ==  0) {
        $error = $form.find('p.error');
        $error.show().html('<span class="icon"></span>' + msg);
    } else {
        $error.show().find('span.message').text(msg);
    }
    return false;
    };

    if(username.length <=0 || username==$fieldset.find('#username').attr('placeholder').trim()){
        return displayError('input#username', 'Please enter username.');
    }

    if(username.length <3){
        return displayError('input#username', 'username must be greater than 2 characters long.');
    }

    if (illegalCharsUsername.test(username)){
        return displayError('input#username', 'The specified username contains illegal characters.');
    }

    var param = {};
    param['username']=username;
    param['email']=email;
    param['post_to_facebook']=post_to_facebook;
    if (referrer.length > 0) { param['referrer']=referrer; }
    if (invitation_key.length > 0) { param['invitation_key']=invitation_key; }
    if(fb_request_id != undefined) { param['fb_request_id']=fb_request_id; }
    if (location.args['next'])
        param['next'] = location.args['next'];

    var close_w = false;

    if($form.find('#close_w').length){
        close_w = true;
    }

    $this.attr('disabled', true).css({'cursor': 'default'});

    $.post("/facebook_signup.xml",param, 
            function(xml){
            if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1 && $(xml).find("url").length>0) {
                if(close_w){
                    window.close();
                }
                else{
                    if (document.URL.indexOf('/seller-signup') > -1) {
                        location.href="/seller-signup";
                    } else {
                        location.href=$(xml).find("url").text();
                    }
                }
            } else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                if(close_w){
                    window.close();
                }
                else{
                    if (document.URL.indexOf('/seller-signup') > -1) {
                        location.href="/seller-signup";
                    } else {
                        location.href="/?channel=facebook";
                    }
                }
            }
            else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
            var error_type = $(xml).find("error").text();
            if(error_type == "email_duplicate"){
                var email = $(xml).find("email").text();
                $form.find('#email').val(email);
                $form.find('.hidden-email').show();  
            }

            if(error_type == "fb_no_email"){
                $form.find('.hidden-email').show();  
            }


            var msg = $(xml).find("message").text();
            displayError(null, msg);
            $this.removeAttr('disabled').css('cursor','');
            }
            }, "xml");
            return false;
            });
});
