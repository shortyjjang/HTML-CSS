$(document).ready(function() {
  
  $('.form-controls .button.send').click(function() {
        
        
        var selected_all = $('#all').is(':checked');
        
        var inviteusers = $('.invitation_user');
          
        var emails = '';
        var email_count = 0;
		inviteusers.each(function(){
		  if ($(this).is(':checked')){
			var email = $(this).attr('email');
			if(email != undefined && email !=null){
			  if(emails.length>0)
				emails = emails+","+email;
			  else
				emails = ""+email;
			  email_count = email_count + 1;
			}
		  }
		});
        
        if(emails.length>0){
          var param = {};
          param['emails']=emails;
          var selectedRow = $(this);
		  var msg = $('#comment').val();
		  var msg_holder = $('#comment').attr('placeholder');
		  if (msg.length > 0 && msg != msg_holder){			
            param['message']=msg;
		  }
          
		  $('.invite-box').hide();
		  $('.waiting').show();
          $.post("/invite_friend_with_email_list.xml",param, 
              function(xml){
				  $('.invite-box').show();
				  $('.waiting').hide();
                  if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
					inviteusers.each(function(){
					  if ($(this).is(':checked')){
						$(this).parent().parent('li').remove();
					  }
					});

					var remain_count = $('.friends-list ul>li').size();
					var ran = Math.random() * remain_count;
					var howabout = $('.friends-list ul>li').eq(ran).attr('id');
					$('#alert-msg').empty();					
					$('#alert-msg').removeClass('notification invited');
					if(remain_count>0){
					  $('#alert-msg').addClass('notification invited').append('<p><strong>Success! '+email_count+' invited</strong>. What about also inviting <a href="#'+howabout+'">'+howabout+'</a>?</p>');					  					  
					}
					else{
					  location.href = '/find_friends_follow_list?ic='+email_count;
					  //$('#alert-msg').addClass('notification invited').append('<p><strong>Success! '+email_count+' invited</strong>.</p>');					  
					}

                  }
                  else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                    alert($(xml).find("message").text());
                  }  
          }, "xml");
        }
          return false;
          
  });
});