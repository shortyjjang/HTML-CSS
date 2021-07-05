$(document).ready(function(){

  $('a.deactivate_user').click(function(){
	var uid = $(this).attr('uid');
	var param = {};
	param['uid']=uid;
        
        if (window.confirm('Are you sure you want to deactivate this user?')){
            $.post("/deactivate_user.xml",param, 
              function(xml){
                    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                      location.reload(false);
                    }
                    else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                      alert($(xml).find("message"));
                    }
            }, "xml");
			return false;
        }
    return false;
  });

  $('a.deactivate_user_order_cancel').click(function(){
    var uid = $(this).attr('uid');
    var params = {
      uids: uid,
      cancel_orders: true,
      action_url: location.pathname
    };
    var confirmMsg = 'Are you sure you want to deactivate this user and cancel all orders of this user?';

    if($(this).hasClass('also_refered')) {
      params.include_referrals = true;
      confirmMsg = 'Are you sure you want to deactivate this user (including refered user by this user) and cancel all orders of this user and refered users? ';
    }

    if (window.confirm(confirmMsg)){
      $.post("/admin/deactivate_users.json", params, 
        function(res){
          if (res.status_code == 1) {
            if (res.failed.length > 0) {
              alert("Failed deactivate user : " + res.failed);
            }
            location.reload(false);
          }
          else if (res.status_code == 0) {
            alert(res.message);
          }
      });
    }
    return false;
  });
  
  $('a.reactivate_user').click(function(){
	var uid = $(this).attr('uid');
	var param = {};
	param['uid']=uid;
        
        if (window.confirm('Are you sure you want to reactivate this user?')){
            $.post("/reactivate_user.xml",param, 
              function(xml){
                    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                      location.reload(false);
                    }
                    else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                      alert($(xml).find("message"));
                    }
            }, "xml");
			return false;
        }
    return false;
  });

  $('a.toggle_vip_user').click(function(){
	var uid = $(this).attr('uid');
	var param = {};
	param['uid']=uid;
        
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
  });

  $('a.toggle_super_vip_user').click(function() {
    var uid = $(this).attr('uid');
    var param = {};
    param['uid'] = uid;

    $.post('/toggle_super_vip_user.json', param, 
        function(response) {
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

  });

  $('a.toggle_trustworthy').click(function(){
	var uid = $(this).attr('uid');
	var param = {};
	param['uid']=uid;
        
         $.post('/toggle_trustworthy_user.json',param,              
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
  });

  $('a.toggle_affiliate').click(function(){
    var uid = $(this).attr('uid');
    var param = {};
    param['uid']=uid;
          
           $.post('/toggle_affiliate_program.json',param,              
              function(response){
                  if (response.status_code != undefined && response.status_code == 1) {
                    alert('Updated!')
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
    });

  $('a.unlink_facebook').click(function(){
	var uid = $(this).attr('uid');
	var param = {};
	param['uid']=uid;
        
        if (window.confirm("Are you sure you'd like to unlink Facebook account?")){
         $.post('/unlink_fb_user_by_admin.json',param,              
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
         }
        return false;
  });
 
  $('a.unlink_twitter').click(function(){
	var uid = $(this).attr('uid');
	var param = {};
	param['uid']=uid;
        
        if (window.confirm("Are you sure you'd like to unlink Twitter account?")){
         $.post('/unlink_twitter_user_by_admin.json',param,              
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
         }
        return false;
  });

  $('a.unlink_social').click(function(e){
	var uid = $(this).attr('uid');
        var backend = $(this).attr('backend');
        var post_link = '/unlink_' + backend + '_by_admin.json';
	var param = {};
	param['uid']=uid;
        
        if (window.confirm("Are you sure you'd like to unlink this account? (" + backend + ")")){
         $.post(post_link,param,              
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
         }
        return false;
  });

  $("a.send-review-reminder").click(function(e) {
    var $this = $(this), soid = $this.attr('data-order-id'), email = $this.attr('data-email');
    if ($this.hasClass("loading")) return false;
    if (window.confirm("Do you want to send a review request email to " + email + "?\nThe email will only show the items that have not been reviewed yet.")) {
      if ($this.hasClass("loading")) return false;
      $this.addClass("loading");
      $.post('/_admin/review-requests/resend.json', { sale_order_id: soid }).then(function(resp) {
        if (resp.status_code == 1) alert("Sent!")
        else alert(resp.message || "Something went wrong!")
        $this.removeClass("loading");
      
      }).fail(function() {
        alert("Something went wrong!")
        $this.removeClass("loading");
      });
    }
    return false;

  });
});
