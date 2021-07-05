$(document).ready(function() {
	  
	$('.network .facebook .switch button').on('click',function(){
		// make button group as a toggle button 
		var parent = $(this).parents("div.after").first(); 
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
			}, {scope:'email,user_friends,user_birthday'});
		}
		
		return false;
	});

});

function onFBUnlink(){
    $.ajax({
		type : 'post',
		url  : '/unlink_fb_user.xml',
        headers : {'X-CSRFToken':$.cookie.get('csrftoken')},
		data : {},
		dataType : 'xml',
		success  : function(xml){
		    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
		    	var parent = $(".network .facebook");
		    	parent.find(".switch button.btn-switchon").removeClass("current");
				parent.find(".switch button.btn-switchoff").addClass("current");
				parent.find(".after-off").show().end().find(".after-on").hide();
            }
            else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                alert($(xml).find("message").text());
            }
            else {
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
			url  : '/link_fb_user.xml',
            headers : {'X-CSRFToken':$.cookie.get('csrftoken')},
			data : param,
			dataType : 'xml',
			success  : function(xml){	
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    var name = $(xml).find("name").text();
                    var profileUrl = $(xml).find("profile_url").text();
                    var html_str = 'Connected to Facebook as <a href="'+profileUrl+'"  target="_blank">'+name+'</a>.<br/><input type="checkbox" checked="checked" id="post_to_facebook" /><label for="post_to_facebook" class="connect-label">Publish things you fancy to your Facebook Timeline.</label>';

			    	var parent = $(".network .facebook");
                    parent.find("div.after-on").html(html_str);
			    	parent.find(".switch button.btn-switchoff").removeClass("current");
					parent.find(".switch button.btn-switchon").addClass("current");
					parent.find(".after-on").show().end().find(".after-off").hide();
		        }
		        else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
			        alert($(xml).find("message").text());
		        }
		        else {
		        }
			},
			complete : function(){
			}
	});

	return false;
}
