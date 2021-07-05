$(document).ready(function() {
	  
	$('.network .facebook .switch button').on('click',function(){
		// make button group as a toggle button 
		var parent = $(this).closest("div.after"); 
		var onBtn = parent.find(".btn-switchon"); 
		var offBtn = parent.find(".btn-switchoff");
		if ( onBtn.is(".current") ) {
			var r=confirm('Do you really want to remove facebook connection?');
			if (r==true){
				onFBUnlink();
			}
		}else{
			FB.login(function(response2) {
				if (response2.authResponse) {
						onFBLink('');
				} else {
				}
			}, {scope:'email,user_friends'});
		}
		
		return false;
	});

});

function onFBUnlink(){
    $.ajax({
		type : 'post',
		url  : '/unlink_fb_user.json',
        headers : {'X-CSRFToken':$.cookie.get('csrftoken')},
		data : {},
		dataType : 'json',
		success  : function(json){
		    if (json.status_code==1) {
		    	var parent = $(".network .facebook");
		    	parent.find(".switch button.btn-switchon").removeClass("current");
				parent.find(".switch button.btn-switchoff").addClass("current");
				parent.find(".after-off").show().end().find(".after-on").hide();
            }
            else {
            	alertify.alert(json.message||"Please retry your request.");
            }
		},
		complete : function(){
		}
	});
}

function onFBLink(perms) {
    param = {}
    param['perms']=perms;

    $.ajax({
			type : 'post',
			url  : '/link_fb_user.json',
            headers : {'X-CSRFToken':$.cookie.get('csrftoken')},
			data : param,
			dataType : 'json',
			success  : function(json){	
                if (json.status_code==1) {
                    var name = json.name;
                    var profileUrl = json.profile_url;
                    var html_str = 'Connected to Facebook as <a href="'+profileUrl+'"  target="_blank">'+name+'</a>.';

			    	var parent = $(".network .facebook");
                    parent.find("div.after-on").html(html_str);
			    	parent.find(".switch button.btn-switchoff").removeClass("current");
					parent.find(".switch button.btn-switchon").addClass("current");
					parent.find(".after-on").show().end().find(".after-off").hide();
		        }
		        else {
		        	alertify.alert(json.message||"Please retry your request.");
		        }
			},
			complete : function(){
			}
	});

	return false;
}
