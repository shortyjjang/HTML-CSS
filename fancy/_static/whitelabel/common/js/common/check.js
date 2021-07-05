function is_valid_phonenumber(n) {
    var phoneNumberRegex = /^([\+][\s]*[0-9]{1,3}([\-\s]+[0-9]{1,3})?)?([0-9\-\s]{7,})$/;

    if(!phoneNumberRegex.test(n)) {
        return false;
    }

    var digits = n.replace(/[^0-9]/g,'');
    if(digits.length<7) {
        return false;
    }
    return true;
}
