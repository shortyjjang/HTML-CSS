$(function(){
    var $send_app_popup = $('.popup.send_app, .popup.download_sellapp');
    $send_app_popup.find('.btn-send').click(function() {
        var phoneNumberRegex = /^[0-9]{2,3}[-\s]?[0-9]{3,4}[-\s]?[0-9]{3,4}$/;
        var $phoneNumberInput = $send_app_popup.find('.input-phone');
        var $countrySelect = $send_app_popup.find('.select-country');
        var $sendButton = $(this);
        var $success = $send_app_popup.find("div.success");

        var phoneNumberText = $.trim($phoneNumberInput.val());
        if (phoneNumberRegex.test(phoneNumberText)) {
            $.ajax({
                type: 'POST',
                url: "https://" + window.location.host + "/sms/request_seller_app_link_text.json",
                xhrFields: {withCredentials: true},
                crossDomain: true,
                dataType: 'json',
                data: {
                    phone_number: phoneNumberText,
                    country_code: $.trim($countrySelect.val())
                },
                success: function(response) {
                    if (response.status_code != undefined && response.status_code == 1) {
                        $success.show();
                        $sendButton.closest('.frm').hide();
                    } else {
                        alert(response.message);
                    }
                },
                error: function(xhr) {
                    var msg = "Error! Please try again later.";
                    try{
                        var err = JSON.parse(xhr.responseText);
                        msg = err.message || msg;
                    } catch (e) {}
                    alert(msg);
                },
                beforeSend: function() {
                    $phoneNumberInput.disable(true);
                    $sendButton.disable(true);
                },
                complete: function() {
                    $phoneNumberInput.disable(false);
                    $sendButton.disable(false);
                }
            });
        } else {
            alert(gettext("Please check your phone number."));
        }
    });
});
