$(document).ready(function() {
      
	  
	$(document).delegate('.sl-facebook','click',function(){
		FB.login(function(response2) {
			if (response2.authResponse) {
					onFBLink('');
			} else {
			}
		}, {scope:'email,user_friends'});
		return false;
	});
      
	$(document).delegate('#unlink_facebook','click',function(){

        $.ajax({
			type : 'post',
			url  : '/unlink_fb_user.xml',
			headers : {'X-CSRFToken':$.cookie.get('csrftoken')},
			data : {},
			dataType : 'xml',
			success  : function(xml){
			    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
					$('.sns-f').empty().html('<em></em><button type="button" class="btn-gray sl-facebook">Connect with Facebook</button>');
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
	});

	$(document).delegate('.network-item._facebook .switch.on','click',function(){

        $.ajax({
			type : 'post',
			url  : '/unlink_fb_user.xml',
			headers : {'X-CSRFToken':$.cookie.get('csrftoken')},
			data : {},
			dataType : 'xml',
			success  : function(xml){
			    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
			    	$('.network-item._facebook > small').text( gettext("By connecting your Fancy account to Facebook, you'll be able to share things you fancy directly to your Facebook Timeline.") );
			    	$('.network-item._facebook > button.switch').toggleClass("on sl-facebook");
			    	$('.network-item._facebook').next('p.option').remove();					
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
	});
});


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
	            /*var name = $(xml).find("name").text();
	            var html_str = '<em class="on"></em><b>Linked to Facebook as ' + name + '</b>  <a href="#" id="unlink_facebook">Unlink</a><label><input type="checkbox" name="facebook" checked> Post things I fancy to Facebook</label>';
				$('.sns-f').empty().html(html_str);*/
				location.reload();
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
