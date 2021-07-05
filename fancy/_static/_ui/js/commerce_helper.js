$(document).ready(function() {
  $('#buythis').on('click',function(event) {
		event.preventDefault();

        var html_url = $(this).attr('html_url');
        var login_require = $(this).attr('require_login'); 
        if (typeof(login_require) != undefined && login_require != null && login_require=='true'){ 
              require_login();
        }
        else{
            location.href=html_url;
        }
  });
  
  $('.sell').on('click',function(event) {
		event.preventDefault();

        var ntid = $(this).attr('ntid');
        var ntoid = $(this).attr('ntoid');
        var login_require = $(this).attr('require_login'); 
        if (typeof(login_require) != undefined && login_require != null && login_require=='true'){ 
              require_login();
        }
        else{
          
            location.href='/sales/create?ntid='+ ntid +'&ntoid='+ntoid;
        }
  });
    
});
