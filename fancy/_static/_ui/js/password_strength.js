$(document).ready(function() {

        $('#user_password').keyup(function(){
           checkStrength($('#user_password').val())
        })
        
        function checkStrength(password){
 
        var strength = 0   
        
        if (password.length < 6) {
            $('.register .popup_wrap .frm').find('.loader').removeClass('great').removeClass('weak').removeClass('good').removeClass('alright').find('em').text('Too short');
            return false;
        }

        if (password.length > 5) strength += 1
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))  strength += 1
        if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/))  strength += 1 
        if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/))  strength += 1                                                                                 
        if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,",%,&,@,#,$,^,*,?,_,~])/)) strength += 1
        if (strength < 2 ) {
            $('.register .popup_wrap .frm').find('.loader').removeClass('great').removeClass('good').removeClass('alright').addClass('weak').find('em').text('Weak');
        } else if (strength == 2 ) {
            $('.register .popup_wrap .frm').find('.loader').removeClass('great').removeClass('good').removeClass('weak').addClass('alright').find('em').text('Alright');
        } else if (strength == 3 ) {
            $('.register .popup_wrap .frm').find('.loader').removeClass('great').removeClass('alright').removeClass('weak').addClass('good').find('em').text('Good');

        } else {
            $('.register .popup_wrap .frm').find('.loader').removeClass('good').removeClass('alright').removeClass('weak').addClass('great').find('em').text('Great');
        }
        }
});
