$(document).ready(function() {
  
  var showPopup = $('#confirm-invite').dialog(Fancy.Popup.options);
  Fancy.Popup.setup(showPopup);
  
  $('.invite-all-contacts').click(function(e) {
          e.preventDefault();
          showPopup.dialog('open'); 
  });
  
  $('#confirm-invite .button.ok').click(function() {
        var inviteusersBtn = $('.invite-all-contacts');
        var inviteursersLinks = $('.invite-contact-link');
          
        var emails = '';
        
	inviteursersLinks.each(function(){
	  var email = $(this).attr('email');
	  if(email != undefined && email !=null)
	    if(emails.length>0)
	      emails = emails+","+email;
	    else
	      emails = ""+email;
	});
        if(emails.length>0){
          var param = {};
          param['emails']=emails;
          var selectedRow = $(this);
          
          $.post("/invite_friend_with_email_list.xml",param, 
              function(xml){
                  if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    inviteusersBtn.html('Invited').addClass('invited-users');
                    inviteursersLinks.html('Invitation Sent').addClass('sent');
                    inviteursersLinks.removeAttr('email');
                  }
                  else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                    alert($(xml).find("message").text());
                  }  
          }, "xml");
        }
          showPopup.dialog('close'); 
          return false;
          
  });
  
  $('#confirm-invite .button.cancel').click(function() {
          showPopup.dialog('close'); 
          return false;
  });
    
  $('.invite-contact-link').click(function() {
        var login_require = $(this).attr('require_login'); 
        if (typeof(login_require) != undefined && login_require != null && login_require=='true'){ 
              require_login();
              return false;
        }
        
        var emails = $(this).attr('email');
        
        var param = {};
        param['emails']=emails;
	var selectedRow = $(this);
        
        if ( selectedRow.hasClass('sent') ) {
        }
        else {
          $.post("/invite_friend_with_email_list.xml",param, 
              function(xml){
                  if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                      selectedRow.addClass('sent');
                      selectedRow.html("Sent Invitation");
                      selectedRow.removeAttr('email');
                  }
                  else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                      alert($(xml).find("message").text());
                  }  
          }, "xml");
        }
        
        
        return false;
  });
});