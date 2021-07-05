$(document).ready(function() {
  
    var showPopup = $('#confirm-follow').dialog(Fancy.Popup.options);
    Fancy.Popup.setup(showPopup);
    
    $('.follow-all-users').click(function(e) {
	    e.preventDefault();
	    showPopup.dialog('open'); 
    });
    
    $('#confirm-follow .button.ok').click(function() {
	    var followusersBtn = $('.follow-all-users');
	    var login_require = $(this).attr('require_login');  
	    if (typeof(login_require) != undefined && login_require != null && login_require=='true'){ 
	      require_login();
	      return false;
	    }
	    var need_location_href = $(this).attr('need_location_href');
	
	    if (typeof(need_location_href) == undefined || need_location_href == null){ 
	      need_location_href='false';
	    }
	    
	    var li = $('.twitter-users a.follow-link');
	    var uids = '';
		li.each(function(){
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
	      var selectedRow = $(this);
	      $.post("/add_follows.xml",param, 
		  function(xml){
		      if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
			followusersBtn.html('Following').addClass('following-users');
			li.each(function(){
			  var btn = $(this);
			  btn.removeClass("follow-link").addClass("following-link");
			  btn.html('<span></span>Following');
			  btn.children('span').css({ backgroundPosition: '0 -35px', height: '14px', width: '40px' });
			  btn.css({ backgroundPosition: "-200px 0" });                  
			});
			if (need_location_href=='true')
			{
			  location.href="/following"
			}
		      }
		      else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
			alert($(xml).find("message").text());
		      }  
	      }, "xml");      
	    }
	    showPopup.dialog('close'); 
	    return false;
    });
    
    $('#confirm-follow .button.cancel').click(function() {
	    showPopup.dialog('close'); 
	    return false;
    });
  
  $('.follow-all').click(function() {
    var login_require = $(this).attr('require_login');  
    if (typeof(login_require) != undefined && login_require != null && login_require=='true'){ 
      require_login();
      return false;
    }
    var need_location_href = $(this).attr('need_location_href');

    if (typeof(need_location_href) == undefined || need_location_href == null){ 
      need_location_href='false';
    }
    
    var li = $('.twitter-users a.follow-link');
    var uids = '';
	li.each(function(){
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
      var selectedRow = $(this);
      $.post("/add_follows.xml",param, 
          function(xml){
              if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
		
		var followNotificationTTL = 5 * 1000; // 5 seconds
		var followAllTimeout = 0;
		
		//event.preventDefault();
		window.clearTimeout(followAllTimeout);
		var btn = jQuery(this),
			twitterUsers = jQuery('.twitter-users'),
			count = twitterUsers.find('li').length;
		
		twitterUsers.find('.follow-link').text('Following').removeClass('.follow-link');

		$.get('_many_vcards.html', function (data) {
			jQuery('.followup-message').find('span').html(count).end().slideDown();
			followAllTimeout = window.setTimeout(function () {
				jQuery('.followup-message').slideUp();
			}, followNotificationTTL);
			setTimeout(function() {
				twitterUsers.fadeTo(500, 0.01, function() {
					twitterUsers.html(data);
					twitterUsers.fadeTo(250, 1);
				});
			}, 2000);
		});
		
		/*
                li.each(function(){
                  var btn = $(this);
                  btn.removeClass("follow-link").addClass("following-link");
                  btn.html('<span></span>Following');
                  btn.children('span').css({ backgroundPosition: '0 -35px', height: '14px', width: '40px' });
                  btn.css({ backgroundPosition: "-200px 0" });                  
                });
		if (need_location_href=='true')
		{
		  location.href="/following"
		}
		*/
              }
              else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                alert($(xml).find("message").text());
              }  
      }, "xml");      
    }
    return false;
  });
});