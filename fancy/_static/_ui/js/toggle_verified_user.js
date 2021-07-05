$(document).ready(function(){

  function toggle_verified_user(uid) {
	var param = {};
	param['uid']=uid;

	$.post("/toggle_verified_user.xml",param, 
	  function(xml){
		if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
		  location.reload(false);
		}
		else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
		  alert($(xml).find("message"));
		}
	}, "xml");
  }

  function toggle_verified_purchaser(uid, email) {
    var param = {};
    param['uid'] = uid;
    param['email'] = email;
    var endpoint = "/toggle_verified_purchaser.xml";
   if(document.location.protocol=="https:"){
    endpoint = "/toggle_verified_purchaser_s.xml";
   }
    $.post(endpoint, param, 
      function(xml) {
		if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
		  location.reload(false);
		}
		else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
		  alert($(xml).find("message"));
		}
      }, "xml");
  }

  function toggle_guest_vip(uid, email, super_vip) {
	var param = {};
	param['uid']=uid;
	param['email']=email;

    if (super_vip) {
         $.post('/toggle_super_vip_user.json',param,              
            function(response){
                if (response.status_code != undefined && response.status_code == 1) {
                        location.reload(false);
                }
                else if (response.status_code != undefined && response.status_code == 0) {
                    if(response.message != undefined)
                        alert(response.message);
                }
            },
            "json"
        );
        return false;
    }
    else {
         $.post('/toggle_vip_user.json',param,              
            function(response){
                if (response.status_code != undefined && response.status_code == 1) {
                        location.reload(false);
                }
                else if (response.status_code != undefined && response.status_code == 0) {
                    if(response.message != undefined)
                        alert(response.message);
                }
            },
            "json"
        );
        return false;
    }
  }

        $('.remove_card').on('click',function(event){
                var uid = $(this).attr('uid');
                var param = {};
                param['user_id'] = uid;
		if (window.confirm('Remove credit card information?')){
			$.post(
				'/remove_card_admin.json',
				param, // parameters
				function(response){
					if (response.status_code != undefined && response.status_code == 1) {
                                          location.reload(false);
					}
					else if (response.status_code != undefined && response.status_code == 0) {
						if(response.message != undefined)
							alert(response.message);
					}  
				},
				"json"
			);
			return false;
		}
    
		return false;
	});


  $('.user-section a.toggle_verified, .admin-user-frm a.toggle_verified, .controller a.toggle_verified').on('click',function(event){
	var uid = $(this).attr('uid');
    toggle_verified_user(uid);
    return false;
  });
  $('.verified-purchasers a.toggle_verified').on('click',function(event){
	var uid = $(this).attr('uid');
    toggle_verified_user(uid);
    return false;
  });
  $('.seller-info a.toggle_verified').on('click',function(event){
	var uid = $(this).attr('uid');
    toggle_verified_user(uid);
    return false;
  });

  $('a.toggle_private').on('click',function(){
      var uid = $(this).attr('uid');
      var nextState = $(this).hasClass('on') ? 0 : 1;
      $.post({ url: '/admin/update-private-user.json', data: { 'user_id': uid, 'private': nextState }})
        .then(function(){
          location.reload();
        })
        .fail(function() {
          alert('There was an error. please try again');
        })
      return false;
    });

  $('.user-section a.toggle_verified_purchaser, .admin-user-frm a.toggle_verified_purchaser, .controller a.toggle_verified_purchaser').on('click', function(event) {
    var uid=$(this).attr('uid');
    var email=$(this).attr('email');
    toggle_verified_purchaser(uid, email);
    return false;
  });
  $('.verified-purchasers a.toggle_verified_purchaser').on('click', function(event) {
    var uid=$(this).attr('uid');
    var email=$(this).attr('email');
    toggle_verified_purchaser(uid, email);
    return false;
  });
  $('.seller-info a.toggle_verified_purchaser').on('click', function(event) {
    var email=$(this).attr('email');
    var uid=$(this).attr('uid');
    toggle_verified_purchaser(uid, email);
    return false;
  });

  $('.user-section a.toggle_guest_vip, .admin-user-frm a.toggle_guest_vip, .controller a.toggle_guest_vip').on('click', function(event) {
    var uid=$(this).attr('uid');
    var email=$(this).attr('email');
    var super_vip = 0;
    toggle_guest_vip(uid, email, super_vip);
    return false;
  });
  $('.verified-purchasers a.toggle_guest_vip').on('click', function(event) {
    var uid=$(this).attr('uid');
    var email=$(this).attr('email');
    var super_vip = 0;
    toggle_guest_vip(uid, email, super_vip);
    return false;
  });
  $('.seller-info a.toggle_guest_vip').on('click', function(event) {
    var email=$(this).attr('email');
    var uid=$(this).attr('uid');
    var super_vip = 0;
    toggle_guest_vip(uid, email, super_vip);
    return false;
  });

  $('.user-section a.toggle_guest_super_vip, .admin-user-frm a.toggle_guest_super_vip, .controller a.toggle_guest_super_vip').on('click', function(event) {
    var uid=$(this).attr('uid');
    var email=$(this).attr('email');
    var super_vip = 1;
    toggle_guest_vip(uid, email, super_vip);
    return false;
  });
  $('.verified-purchasers a.toggle_guest_vip').on('click', function(event) {
    var uid=$(this).attr('uid');
    var email=$(this).attr('email');
    var super_vip = 1;
    toggle_guest_vip(uid, email, super_vip);
    return false;
  });
  $('.seller-info a.toggle_guest_vip').on('click', function(event) {
    var email=$(this).attr('email');
    var uid=$(this).attr('uid');
    var super_vip = 1;
    toggle_guest_vip(uid, email, super_vip);
    return false;
  });

});
