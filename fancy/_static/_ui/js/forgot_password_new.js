$(document).ready(function(){
            
	$('input').bind('keypress', function(e) {
		if(e.keyCode==13){
			$('button.submit').click();
			return false;
		}
	});
	
    $('form button.submit').live('click',function(event){
		var $this = $(this), $form = $this.closest('form'), $fieldset = $form.find('fieldset');
		
        var email = $.trim($form.find('#email').val()||'');
        var pid =  $.trim($form.find('#pid').val()||'');

		$form.find('input.error').removeClass('error').end().find('div.error').hide();

        function displayError(fieldSelector, msg) {
            alert(msg);
        };

        if(email.length <=0 || email==$('#email').attr('placeholder').trim()){
            return displayError('input#email', 'Please enter email.');
        }

        if(email.search(emailRegEx) == -1){ // see common/util.js to change emailRegEx
            return displayError('input#email', 'A valid email address is required.');
        }

        var param = {};
        param['email'] = email;
        param['pid'] = pid;

        var selectedRow = $(this);
        $.post("/reset_password.xml",param, 
               function(xml){
                    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                        $('input#email').val('');
                        var message = $(xml).find('message').text();
                        alert(message);
                        location.href="/login"
                    } else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                        var msg = $(xml).find("message").text();
                        displayError('#input#email', msg);
                    }  
                }, "xml").error(function(xhr) {
                    try {
                        err = JSON.parse(xhr.responseText);
                        err = err.message || err.error;
                        if(err) {
                            alertify.alert(err);
                            return;
                        }
                    } catch(e) {
                    }
                if(xhr.status==403) {
                        alert("It looks like your browser is set to block cookies. Please enable cookies in your browser settings.");
                    } else if(xhr.status>=400) {
                        alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
                    }
                });
        return false;
    });

});
