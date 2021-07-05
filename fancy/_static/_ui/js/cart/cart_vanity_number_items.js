jQuery(function($){

    $('.popup.recipient_addr').on('close', function(e) {
        if( $('.gift-option.vanity textarea').val() !== '' ) return;
        $('.gift-option.vanity').removeClass('check');
        $('.gift-option.vanity input:checkbox[name^="is_gift"]').prop('checked', false);
    });

    function isValidString($field, allowedBlank) {
        if( !allowedBlank && $field.val() === "") {
            alert("The fullname, address 1, city and zipcode field are required.");
            return false;
        }
        if( $field.attr('placeholder') !== undefined && $field.val() === $field.attr('placeholder') ) return false;
        return true;
    }

    function isValidCountry(country) {
        if( country === "" ) return false;
        return true;
    }

    function isValidState($field, country) {
        if (country === 'US' && $field.val() === "" ) {
            alert("You sholud enter the state.");
            return false;
        }
        return true;
    }

    function isValidPhone(number) {
        if( number === $('.popup.recipient_addr .telephone > .text').attr('placeholder') ) {
            alert("The telephone number is required.");
            return false;
        }
        if( isNaN(parseInt(number, 10)) ) {
            alert("Please enter the telephone number without dash or space.");
            return false;
        }
        return true;
    }

    $('.popup.recipient_addr .btn-save-add').click(function(e) {
        var fullName = $('.popup.recipient_addr .fullname > .text');
        var address1 = $('.popup.recipient_addr .add1.text');
        var address2 = $('.popup.recipient_addr .add2.text');
        var city = $('.popup.recipient_addr .city.text');
        var state = $('.popup.recipient_addr .state.text');
        var country = $('.popup.recipient_addr .select-country option:selected').val();
        var zipcode = $('.popup.recipient_addr .zip.text');

        if( !isValidString(fullName, false) ) return;
        if( !isValidString(address1, false) ) return;
        if( !isValidString(address2, true) ) return;
        if( !isValidString(city, false) ) return;
        if( !isValidCountry(country) ) return;
        if( !isValidState(state) ) return;
        if( !isValidString(zipcode, false) ) return;

        var telephone = $('.popup.recipient_addr .telephone > .text').val();
        if( !isValidPhone(telephone) ) return;

        fullName = fullName.val();
        address1 = address1.val();
        address2 = address2.val();
        city = city.val();
        state = state.val();
        country = $('.popup.recipient_addr .select-country option:selected').text();
        zipcode = zipcode.val();

        var recipient = fullName + '\r' + address1 + '\r' + city + ', ' + state + ' ' + zipcode + '\r' + country;
        console.log(recipient);
        $('.gift-option.vanity textarea').height(80);
        $('.gift-option.vanity textarea').val(recipient);
        $.dialog('recipient_addr').close();
    });
});