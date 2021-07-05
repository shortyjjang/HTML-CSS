$(document).ready(function() {
	//$('a.facebook-publish-actions').live('click',function(){
	$('.add-facebook-timeline button.btn-now').on('click',function(){
        var selectedRow = $(this);
        FB.login(function(response2) {
            if (response2.authResponse) {
				onFBLoggedIn('');
				//selectedRow.hide();
				$('.add-facebook-timeline,.add-facebook-timeline-back').hide();
		        popupHide();
            } else {
            }
        }, {scope:'email,user_friends'});
        return false;
	});
    $('.add-facebook-timeline-close').click(popupHide);
    $('.add-facebook-timeline button.btn-cancel').click(function(){
		var expire = new Date();
		expire.setDate(expire.getDate() + 1);
		document.cookie = 'add-facebook-timeline' + '=1; path=/; expires='+expire.toUTCString();
		popupHide();
		return false;
	});
});

function popupHide() {
	$.dialog('add_facebook').close();
}
        
function onFBLoggedIn(perms) {
    param = {}
    param['perms']=perms;
    $.post("/login_fb_user.xml", param,
            function(xml){
            if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1 && $(xml).find("url").length>0) {
            }
            else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
            }
            else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
            }
            else {
            }
    }, "xml");
    return false;
}
