jQuery(function($) {
    $('#header #keyword-search-input, #header #keyword-search-input-mini').focusin(function(event) {
		$(this).closest('#header').addClass('search');
    });
    $('#header #keyword-search-input, #header #keyword-search-input-mini').focusout(function(event) {
        var $this = $(this);
		setTimeout(function(){
            $this.closest('#header').removeClass('search');
        },200);
    });

    $('#header .menu > li.category').hover(function(){
        $(this).addClass('hover');
    },function(){
        $(this).removeClass('hover');
    });
    $('#header .menu .trick').hover(function(){
        $(this).closest('li').removeClass('hover');
    });

    $("#mailjet_form").submit(function() {
        var $this = $(this), $email = $this.find('input.email_text');
        var email = $.trim($email.val());
        if (email.length == 0) {
            alertify.alert('Please enter an email address');
            $email.focus();
            return false;
        }
        // see common/util.js to change emailRegEx
        if (!emailRegEx.test(email)){
            alertify.alert('Please enter a valid email address');
            $email.focus();
            return false;
        }
        $email.val(email);
        $('#footer .newsletter .success').show(); 
        setTimeout(function(){
            $email.val('');
            $('#footer .newsletter .success').fadeOut(); 
        },6000)
        return true;
    });
})
