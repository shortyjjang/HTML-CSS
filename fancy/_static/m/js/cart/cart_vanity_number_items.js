jQuery(function($){
    $('.gift-option').on('click', 'input:checkbox[name^="is_gift"]', function(e) {
        $(this).parents('.option').find('textarea').toggle();
        if( this.checked ) {
            $(this).closest('.cart').addClass('show-recipient-addr');
        }
    });

    function recipientAddrClose() {
        $('.cart.show-recipient-addr').removeClass('show-recipient-addr');
    }

    $('#frm-recipient-addr').on('click', '.btn-cancel', function(e) {
        $('.gift-option').find('textarea').toggle();
        $('.gift-option input:checkbox[name^="is_gift"]').prop('checked', false);
        recipientAddrClose();
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
        if( number === $('#frm-recipient-addr .telephone > .text').attr('placeholder') ) {
            alert("The telephone number is required.");
            return false;
        }
        if( isNaN(parseInt(number, 10)) ) {
            alert("Please enter the telephone number without dash or space.");
            return false;
        }
        return true;
    }

    $('#frm-recipient-addr .btn-save').click(function(e) {
        var fullName = $('#frm-recipient-addr .fullname');
        var address1 = $('#frm-recipient-addr .address1');
        var address2 = $('#frm-recipient-addr .address2');
        var city = $('#frm-recipient-addr input.city');
        var state = $('#frm-recipient-addr .state');
        var country = $('#frm-recipient-addr .country option:selected').val();
        var zipcode = $('#frm-recipient-addr input.zip');

        if( !isValidString(fullName, false) ) return;
        if( !isValidString(address1, false) ) return;
        if( !isValidString(address2, true) ) return;
        if( !isValidString(city, false) ) return;
        if( !isValidCountry(country) ) return;
        if( !isValidState(state) ) return;
        if( !isValidString(zipcode, false) ) return;

        var telephone = $('#frm-recipient-addr .phone').val();
        if( !isValidPhone(telephone) ) return;

        fullName = fullName.val();
        address1 = address1.val();
        address2 = address2.val();
        city = city.val();
        state = state.val();
        country = $('#frm-recipient-addr .country option:selected').text();
        zipcode = zipcode.val();

        var recipient = fullName + '\r' + address1 + '\r' + city + ', ' + state + ' ' + zipcode + '\r' + country;
        console.log(recipient);
        $('.gift-option textarea').height(80);
        $('.gift-option textarea').val(recipient);
        recipientAddrClose();
    });
});
