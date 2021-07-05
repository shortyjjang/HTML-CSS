$(document).ready(function() {
    
    
    $("a#fb-invite-all, button#fb-invite-all").click(function() {
	var button = $(this);
	
	var message = button.attr("uname") +" has invited you to join Fancy. Discover amazing stuff, collect the things you love, unlock crazy good deals!";
	var referrer = button.attr("referrer");
	FB.ui({method: "apprequests",
	    message: message,
	    filters: ["app_non_users"],
	    data : referrer
	}, function(response) {
	    if (!response)
		return;
	    var request_ids = "";
	    for (var i = 0; i < response.to.length; i++) {
		response.request + "_" + response.to[i]
		if (request_ids.length > 0)
		    request_ids = request_ids + ',' + response.request + "_" + response.to[i];
		else
		    request_ids = response.request + "_" + response.to[i];
		
	    }
	    var param = {};
	    param['request_ids']=request_ids;
	    
	    $.post("/invite_friend_with_fb_request_id.xml",param, 
		function(xml){
		    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
			alert('sent');
		    }
		    else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
			alert($(xml).find("message").text());
		    }  
	    }, "xml");
	    
	    
	});
	return false;
    });
  
    $("a#fb-invite").on("click", function() {
	var button = $(this);
	fb_id = button.attr("fbid");
	var message = button.attr("uname") +" has invited you to join Fancy. Discover amazing stuff, collect the things you love, unlock crazy good deals!";
	FB.ui({method: "apprequests",
	    message: message,
	    to: fb_id
	}, function(response) {
	    if (!response)
	    {
		return;
	    }
	    
	    var request_id = response.request + "_" + response.to[0];
	    
	    var param = {};
	    param['request_id']=request_id;
	    
	    $.post("/invite_friend_with_fb_request_id.xml",param, 
		function(xml){
		    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
			    button.removeClass("invite").addClass("invited");
			    button.html('Invited');
		    }
		    else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
			alert($(xml).find("message").text());
		    }  
	    }, "xml");
	    
	    
	    return false;
	});
	return false;
    });
    
    $("a#tw-invite, button#tw-invite").on("click", function() {
	var button = $(this);
	tw_id = button.attr("twid");
	    
	var param = {};
	param['twitter_ids']=tw_id;
	
	$.post("/invite_friend_with_twitter_ids.xml",param, 
	    function(xml){
		if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
			button.removeAttr('id');
			button.removeClass("invite").addClass("invited");
			button.html('Invited');
		}
		else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
		    alert($(xml).find("message").text());
		}  
	}, "xml");

	return false;
    });
    
    $("a#tw-invite-all").on("click", function() {
	var button = $(this);
	
	var tw_ids = '';
	
	var friends = $('a#tw-invite');
	
	friends.each(function(){
	    var twid = $(this).attr('twid');
	    if(twid != undefined && twid !=null)
	    {
		if(tw_ids.length>0)
		{
		    tw_ids = tw_ids+","+twid;
		}
		else
		{
		  tw_ids = ""+twid;
		}
	    }
	});
	    
	var param = {};
	param['twitter_ids']=tw_ids;
	
	$.post("/invite_friend_with_twitter_ids.xml",param, 
	    function(xml){
		if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
			//button.removeAttr('id');
			//button.removeClass("invite").addClass("invited");
			//button.html('Invited');
			friends.each(function(){
			    $(this).removeAttr('id');
			    $(this).removeClass("invite").addClass("invited");
			    $(this).html('Invited');
			});
		}
		else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
		    alert($(xml).find("message").text());
		}  
	}, "xml");

	return false;
    });
    
    $("a#email-invite").on("click", function() {
	var button = $(this);
	email = button.attr("email");
	    
	var param = {};
	param['emails']=email;
	
	$.post("/invite_friend_with_email_list.xml",param, 
	    function(xml){
		if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
			button.removeAttr('id');
			button.removeClass("invite").addClass("invited");
			button.html('Invited');
		}
		else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
		    alert($(xml).find("message").text());
		}  
	}, "xml");

	return false;
    });
    
    $("a#email-invite-all").on("click", function() {
	var button = $(this);
	
	var emails = '';
	
	var friends = $('a#email-invite');
	
	friends.each(function(){
	    var email = $(this).attr('email');
	    if(email != undefined && email !=null)
	    {
		if(emails.length>0)
		{
		    emails = emails+","+email;
		}
		else
		{
		  emails = ""+email;
		}
	    }
	});
	    
	var param = {};
	param['emails']=emails;
	
	$.post("/invite_friend_with_email_list.xml",param, 
	    function(xml){
		if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
			friends.each(function(){
			    $(this).removeAttr('id');
			    $(this).removeClass("invite").addClass("invited");
			    $(this).html('Invited');
			});
		}
		else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
		    alert($(xml).find("message").text());
		}  
	}, "xml");

	return false;
    });
    
    
    // Find invite users
    
    /*
    var findinviteBtn = $('.btn.invite')
    var findinviteallBtn = $('.btn.invite-all')
    
    findinviteBtn.on('click', function() {
	    var btn = $(this);
	    btn.removeClass("invite").addClass("invited");
	    btn.html('Invited');
	    return false;
    });
    
    findinviteallBtn.on('click', function() {
	    var btn = $(this);
	    btn.removeClass("invite-all").addClass("invited");		
	    btn.html('Invited all');	
	    findinviteBtn.removeClass("invite").addClass("invited");
	    findinviteBtn.html('Invited');
	    return false;
    });*/
    
    var findinvitefollowBtn = $('.btn.follow')
    var findinvitefollowingBtn = $('.btn.following')
    var findinvitefollowallBtn = $('.btn.follow-all')
    var findinvitefollowingallBtn = $('.btn.following-all')

    findinvitefollowBtn.on('click', function() {
            var uid = $(this).attr('uid');
            var param = {};
            param['user_id']=uid;
            var btn = $(this);
            $.post("/add_follow.xml",param, 
                    function(xml){
                            if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
				btn.removeClass("follow").addClass("following");
				btn.html('Following');
                            }
                            else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                            }  
            }, "xml");
            
            return false;
    });
    
    findinvitefollowingBtn.on('mouseover mouseout', function(event) {
	    if (event.type == 'mouseover'){
		    $(this).html('Unfollow');
		    $(this).css({ backgroundColor: '#d95c43' });
	    } 
	    else {
		    $(this).html("Following");
		    $(this).removeAttr('style');
	    }
    });

    findinvitefollowingBtn.on('click', function() {
	
            var uid = $(this).attr('uid');
            var param = {};
            param['user_id']=uid;
            var btn = $(this);
            $.post("/delete_follow.xml",param, 
                    function(xml){
                            if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {		
				btn.removeClass("following").addClass("follow");
				btn.removeAttr('style');
				btn.html('Follow');
                            }
                            else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                            }  
            }, "xml");
            
            return false;
    });
    
    findinvitefollowallBtn.on('click', function() {
	
	var uids = '';
	findinvitefollowBtn.each(function(){
	  var uid = $(this).attr('uid');
	  if(uid != undefined && uid !=null)
	    if(uids.length>0)
	      uids = uids+","+uid;
	    else
	      uids = ""+uid;
	});
    
	if(uids.length>0){
	  var param = {};
	  param['user_ids']=uids;
	  var btn = $(this);
	  $.post("/add_follows.xml",param, 
	      function(xml){
		  if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
		    btn.removeClass("follow-all").addClass("following-all");		
		    btn.html('Following all');	
		    findinvitefollowBtn.removeClass("follow").addClass("following");
		    findinvitefollowBtn.html('Following');
		  }
		  else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
		    alert($(xml).find("message").text());
		  }  
	  }, "xml");      
	}
	return false;
    });		
    
    findinvitefollowingallBtn.on('mouseover mouseout', function(event) {
	    if (event.type == 'mouseover'){
		    $(this).html('Unfollow all');
		    $(this).css({ backgroundColor: '#d95c43' });
	    } 
	    else {
		    $(this).html("Following all");
		    $(this).removeAttr('style');
	    }
    });

    findinvitefollowingallBtn.on('click', function() {
	var uids = '';
	findinvitefollowBtn.each(function(){
	  var uid = $(this).attr('uid');
	  if(uid != undefined && uid !=null)
	    if(uids.length>0)
	      uids = uids+","+uid;
	    else
	      uids = ""+uid;
	});
    
	if(uids.length>0){
	  var param = {};
	  param['user_ids']=uids;
	  var btn = $(this);
	  $.post("/delete_follows.xml",param, 
	      function(xml){
		  if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
		    btn.removeClass("following-all").addClass("follow-all");
		    btn.removeAttr('style');
		    btn.html('Follow all');
		    findinvitefollowBtn.removeClass("following").addClass("follow");
		    findinvitefollowBtn.html('Follow');
		  }
		  else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
		    alert($(xml).find("message").text());
		  }  
	  }, "xml");      
	}
	return false;
    
    });	
});