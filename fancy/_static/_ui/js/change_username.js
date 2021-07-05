$(document).ready(function(){

$('.user-section a#change_email, .admin-user-frm a#change_email').on('click',function(event){
	var uid = $(this).attr('uid');
    var new_email = $(this).parents('form').find('#new_email').val().trim();
	var new_email_placeholder = $(this).parents('form').find('#new_email').attr('placeholder').trim();
    var illegalCharsUsername = /\W/; // allow letters, numbers, and underscores
    
	if(new_email.length<=0 || new_email == new_email_placeholder){
	  alert('Please enter new email');
	  return false;
	}


    if(new_email.search(emailRegEx) == -1){ // see common/util.js to change emailRegEx
        alert("Please enter valid email");
        return false;
    }
        
	var param = {};
	param['uid']=uid;
	param['new_email']=new_email;
        
    if (window.confirm('Are you sure you want to change this email to '+new_email+'?')){
        $.post("/change_email.xml",param, function(xml){
            if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                location.reload(true);
            }
            else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                alert($(xml).find("message").text());
            }
        }, "xml");
        return false;
    }
    return false;
});


$('.user-section a#change_fullname, .admin-user-frm a#change_fullname').on('click',function(event){
	var uid = $(this).attr('uid');
    var new_fullname = $(this).parents('form').find('#new_fullname').val().trim();
	var new_fullname_placeholder = $(this).parents('form').find('#new_fullname').attr('placeholder').trim();
    var illegalCharsUsername = /\W/; // allow letters, numbers, and underscores
    
	if(new_fullname.length<=0 || new_fullname == new_fullname_placeholder){
	  alert('Please enter new fullname');
	  return false;
	}
        
	var param = {};
	param['uid']=uid;
	param['new_fullname']=new_fullname;
        
    if (window.confirm('Are you sure you want to change this fullname to '+new_fullname+'?')){
        $.post("/change_fullname.xml",param, function(xml){
            if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                location.reload(true);
            }
            else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                alert($(xml).find("message").text());
            }
        }, "xml");
        return false;
    }
    return false;
});


  $('.user-section a#change_username, .admin-user-frm a#change_username').on('click',function(event){
	var uid = $(this).attr('uid');
        var new_username = $(this).parents('form').find('#new_username').val().trim();
	var new_username_placeholder = $(this).parents('form').find('#new_username').attr('placeholder').trim();
        
        
        
        var illegalCharsUsername = /\W/; // allow letters, numbers, and underscores
        
	var param = {};
	if(new_username.length<=0 || new_username == new_username_placeholder){
	  alert('Please enter new username');
	  return false;
	}
            else if(new_username.length <3){
              alert('username must be greater than 2 characters long.');
              return false;		
            }
            else if (illegalCharsUsername.test(new_username)){
              alert('The specified username contains illegal characters.');
              return false;
            }
        
	var param = {};
	param['uid']=uid;
	param['new_username']=new_username;
        
        if (window.confirm('Are you sure you want to change this username to '+new_username+'?')){
            $.post("/change_username.json",param, 
              function(resp){
                  if (resp.status_code == 1) {
                      location.href = '/' + new_username;
                  } else {
                      alert(resp.message || "Something went wrong!")
                  }
            }, "json");
            return false;
        }
    return false;
  });

        $('.user-section a#delete_profile_pic, .admin-user-frm a#delete_profile_pic').click(function(){
                var user_id = $(this).attr('uid');
		var param = {};
		param['user_id']=user_id;

            if(window.confirm('Are you sure you want to delete this user\'s profile pic?')){  
                $.post("/delete_user_profile_image_admin.json",param, 
                    function(response){
                        if(response.status_code != undefined && response.status_code == 1){
                          location.reload(false);
                        }
                        if(response.status_code != undefined && response.status_code == 0){
                            if(response.message != undefined)
                                alert(response.message);
                        }
                }, "json");
            }

		return false;
	    });

  

});
