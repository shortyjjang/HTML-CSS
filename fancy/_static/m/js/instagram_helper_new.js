$(document).ready(function(){


  $('.network-item._instagram button.switch._off').click(function(e){
     e.preventDefault();
     e.stopPropagation();
     document.location.href = $("#instagram_auth_url").val();
  });

  $('.unlink_instagram, .network-item._instagram button.switch.on').click(function(e){
    e.preventDefault();      

    if (window.confirm('Are you sure you want to unlink Instagram account?')){
        $.ajax({
		    type : 'post',
		    url  : '/unlink_instagram.xml',
		    headers  : {'X-CSRFToken':$.cookie.get('csrftoken')},
		    data : {},
		    dataType : 'xml',
		    success  : function(xml){
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    location.reload(false);
                }
                else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                    alert($(xml).find("message"));
                }

		    },
		    complete : function(){
		    }
	    });
		return false;
    }
    return false;
  });
  
  $('#instagram a#subscriptions').click(function(){
        $.ajax({
			type : 'post',
			url  : '/make_subscription.xml',
			headers  : {'X-CSRFToken':$.cookie.get('csrftoken')},
			data : {},
			dataType : 'xml',
			success  : function(xml){
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    alert($(xml).find("json")); 
                    //location.reload(false);
                }
                else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                    alert($(xml).find("message"));
                }

			},
			complete : function(){
			}
		});

    return false;
  });

});
