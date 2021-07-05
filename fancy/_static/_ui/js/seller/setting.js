
function getParams($form) {
    var arrParam = $form.serializeArray();
    var params = {};

    for (var i=0; i < arrParam.length; i++) {
        params[arrParam[i].name] = arrParam[i].value.trim();
    }

    return params;
}

function highlight($form, field_tag, field, msg) {
    alert(msg);
    $form.find(field_tag + '[name=' + field + ']').focus();
    return false;
}

function isValidURL(url) {
    return /^https?:\/\/[^\/]+/.test(url);
}

function updateSetting(url, params, saveBtnSelector, successCallback) {
    saveBtnSelector = saveBtnSelector || '.btn-save';
    var $btn_save = $(saveBtnSelector);
    $btn_save.attr('disabled', 'disabled');
    var $additional_info = $('.additional-info');
    $.post(
        url,
        params,
        function (response) {
            if (response.status_code != undefined && response.status_code > 0) {
                $(window).scrollTop(0);
                var $upload_success = $('.upload-success');
                if ($upload_success) {
                    if ($upload_success.hasClass("notification-bar")){
                        $upload_success.css('top',$('#header').height()+"px");
                        setTimeout(function(){$upload_success.css('top','-100px');},3000);
                    }else{
                        $upload_success.show();
                        setTimeout(function() {
                            $upload_success.slideUp(300);
                        },3000);
                    }                    
                }

                // For notification email: call successCallback only when confirmation email is sent
                if (successCallback) {
		    if (response.status_code == 2) {
			successCallback(response.confirmation_email);
		    } else if (response.status_code == 3) {
			successCallback(null, response.notification_email);
		    } else {
			successCallback(response);
		    }
                }

                if (response.message != undefined && $additional_info.length > 0) {
                    $additional_info.text(response.message);
                    $additional_info.show();
                }

            } else if (response.status_code != undefined && response.status_code ==0) {
                if(response.message != undefined){
                    $(window).scrollTop(0);
                    var $upload_fail = $('.upload-fail');
                    if ($upload_fail) {
                        if ($upload_fail.hasClass("notification-bar") ){
                            $upload_fail.css('top',$('#header').height()+"px");
                            if(response.message){
                                $upload_fail.html('<p><i class="icon">!</i> <b>' + gettext('Error!') + '</b> ' + response.message+"</p>").show();
                            }
                            setTimeout(function(){$upload_fail.css('top','-100px');},3000);
                        }else{
                            $upload_fail.html('<i class="icon">!</i> <b>' + gettext('Error!') + '</b> ' + response.message).show();
                            setTimeout(function() {
                                $upload_fail.slideUp(300, function() {
                                    $upload_fail.html('');
                                });
                            },3000);
                        }
                    }
                }
            }
            $btn_save.removeAttr('disabled');
        },
        'json'
    ).fail(function () {
        $(window).scrollTop(0);
        var $upload_fail = $('.upload-fail');
        if ($upload_fail) {
            if ($upload_fail.hasClass("notification-bar")){
                $upload_fail.css('top',$('#header').height()+"px");
                setTimeout(function(){$upload_fail.css('top','-100px');},3000);
            }else{
                $upload_fail.html('<i class="icon">!</i> <b>' + gettext('Error!') + '</b> ' + gettext('Server error. Please Try again.')).show();
                setTimeout(function() {
                    $upload_fail.slideUp(300, function() {
                        $upload_fail.html('');
                    });
                },3000);
            }
        }
        $btn_save.removeAttr('disabled');
    });
}

function updateSettingAlertify(url, params, saveBtnSelector, successCallback) {
    $.post(
        url,
        params,
        function (response) {
            if (response.status_code != undefined && response.status_code > 0) {
                var skip_alert = false;
                if(response.confirmation_email_sent) {
                    skip_alert = true;
                }
                if(!skip_alert) {
                    alertify.alert(gettext('Success!') + ' Your settings are successfully updated.' + (response.message ? ' ' + response.message : ''));
                }
                // For notification email: call successCallback only when confirmation email is sent
                if (successCallback) {
                    if (response.status_code == 2) {
                        successCallback(response.confirmation_email);
                    } else if (response.status_code == 3) {
                        successCallback(null, response.notification_email);
                    } else {
                        successCallback(response);
                    }
                }
            } else if (response.status_code != undefined && response.status_code ==0 && response.message != undefined) {
                alertify.alert(gettext('Error!') + ' ' + response.message)
            }
        },
        'json'
    ).fail(function () {
        alertify.alert(gettext('Error!') + ' ' + gettext('Server error. Please Try again.'))
    });
}
