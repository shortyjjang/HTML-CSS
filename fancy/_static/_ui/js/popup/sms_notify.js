var $phone = $('.wrapper.phone');

function update_sms_phone(enable_sms) {
    var order_id = $phone.attr('order-id');
    var country = $('.popup.sms-notify #country').val();
    var phone_num = $('.popup.sms-notify #number').val();
    phone_num = phone_num.replace(/^\+[0-9]* /, '');
    if(!enable_sms) {
        phone_num = '';
    }
    var params = {
        phone_num: phone_num,
        order_ids: order_id,
        country_code: country
    };

    $.post('/update-sms-phone.json', params, function(response) {
        if (response.status_code !== undefined && response.status_code === 1) {
            if (phone_num.length > 0 && response.sms_phonenumber !== undefined) {
                alert(gettext("Your phone number has been updated."));
                $phone.find('.number').attr('data-country',country);
                $phone.find('.number').text(response.sms_phonenumber);
                if(!$phone.find('.btn-switch').hasClass('on')) {
                    $phone.find('.btn-switch').addClass('on');
                }
            } else {
                alert(gettext("Your phone number has been removed."));
                $phone.find('.number').text("");
                $phone.find('.btn-switch').removeClass('on');
            }
        } else if (response.status_code !== undefined && response.status_code === 0 && response.message !== undefined) {
            alert("Failed: "+response.message);
        } else {
            alert("Failed.");
        }
        $.dialog('sms-notify').close();
    })
    .fail(function(xhr) {
        alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
    })
}

function popupOpen() {
    var number = $phone.find('.number').text().trim();
    number = number.replace(/^\+[0-9]* /, '').replace(/[^0-9]/g, '');
    $('.popup.sms-notify #number').val(number);

    var country = $phone.find('.number').attr('data-country') || 'US';
    if(country=='NONE') country = 'US';
    var $country = $('.popup.sms-notify #country');
    $country.val(country);
    $('.popup.sms-notify i').attr('class', 'flag-'+country.toLowerCase());

    $.dialog('sms-notify').open();
}

$phone.find('.number').click(function() {
    popupOpen();
    return false;
});

$phone.find('.btn-switch').click(function(event) {
    event.preventDefault();
    if (!$(this).hasClass('on')) {
        popupOpen();
    } else {
        var phone_num = $('.popup.sms-notify #number').val();
        update_sms_phone(false);
    }
});

$('.popup.sms-notify #country').on('change', function(event) {
    $('.popup.sms-notify i').attr('class', 'flag-'+$(this).val().toLowerCase());
})
$('.popup.sms-notify input#number').on('keyup', function(event) {
    if(event.which == 13){
        $('.popup.sms-notify .btn-confirm').click();
    }
});
$('.popup.sms-notify .btn-confirm').click(function(event) {
    event.preventDefault();
    update_sms_phone(true);
});


