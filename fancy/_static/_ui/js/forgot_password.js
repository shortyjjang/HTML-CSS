$(document).ready(function(){
            
	$('input').bind('keypress', function(e) {
		if(e.keyCode==13){
			$('button.submit').click();
			return false;
		}
	});
	
    $('fieldset button.submit').on('click',function(event){
        var email = $('input#id-user').val().trim();

    	challenge = $('#recaptcha_challenge_field').val().trim();
    	response = $('#recaptcha_response_field').val().trim();

    	$(this).parents('form').find('input#id-user').removeClass('error');
    	$(this).parents('form').find('label.error').remove();
	

        if(email.search(emailRegEx) == -1){// see common/util.js to change emailRegEx
    		$(this).parents('form').find('input#id-user').addClass('error');
    		$(this).parents('form').find('input#id-user').after('<label class="error" for="id-user" generated="true"><span class="error-message">A valid email address is required</span></label>');
    		return false;
        }

    	if(response.length <=0){
    	  $('#recaptcha_response_field').addClass('error');
    	  $('#recaptcha_response_field').after('<label class="error" for="name" generated="true">Please enter the two words in the captcha box.</label>');
    	  return false;
    	}

        var param = {};
        param['email']=email;
        param['challenge']=challenge;
        param['response']=response;
        var selectedRow = $(this);
        $.post("/reset_password.xml",param, 
            function(xml){
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    $('input#id-user').val('');
                    selectedRow.parents('form').hide();
		    selectedRow.parents('form').siblings('h2').html('Reminder sent. Check your email momentarily.');
		    selectedRow.parents('form').siblings('h2').after('<a href="/login" class="button submit">Return to sign in</a>');
                }
                else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
			var msg = $(xml).find("message").text();
			if(msg.indexOf('captcha')>=0){
				Recaptcha.reload();
				$('#recaptcha_response_field').addClass('error');
				$('#recaptcha_response_field').after('<label class="error" for="name" generated="true">'+msg+'</label>');			  
			}
			else{
				Recaptcha.reload();
				selectedRow.parents('form').find('input#id-user').addClass('error');
				selectedRow.parents('form').find('input#id-user').after('<label class="error" for="id-user" generated="true">'+msg+'</label>');
				
			}

                }  
        }, "xml");
        return false;
    });

});
