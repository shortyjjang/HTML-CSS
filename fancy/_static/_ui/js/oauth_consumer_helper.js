$(document).ready(function(){
  
  $('input.register').live('click',function(event){
    var app_name = $(this).parents('form').find('#app_name').val().trim();
    var app_website = $(this).parents('form').find('#app_website').val().trim();
    var callback_url = $(this).parents('form').find('#callback_url').val().trim();
    var description = $(this).parents('form').find('#description').val().trim();
    var selectedRow = $(this);	

    var param = {};
    param['app_name']=app_name;
    param['app_website']=app_website;
    param['callback_url']=callback_url;
    param['description']=description;
	
    $.post("/register_application.xml",param, 
      function(xml){
	    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
	      alert(gettext("Thanks! We will contact you when your API application has been approved."));
	      location.href="/"
	    }
	    else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
	      alert($(xml).find("message").text());      
	    }
    }, "xml");
    
    return false;
  });

  $('a.reset').live('click',function(event){
    var consumer_key = $(this).attr('ckey');
    var selectedRow = $(this);	

    var param = {};
    param['consumer_key']=consumer_key;
    if (window.confirm(gettext('Are you sure you want to reset your consumer key? This will revoke access from all clients using this key.'))){
      $.post("/reset_consumer.xml",param, 
	function(xml){
	      if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
		location.href="/api/consumers"
	      }
	      else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
		alert($(xml).find("message").text());      
	      }
      }, "xml");
      return false;
    }
    
    return false;
  });
  
  $('a.delete').live('click',function(event){
    var consumer_key = $(this).attr('ckey');
    var selectedRow = $(this);	

    var param = {};
    param['consumer_key']=consumer_key;
	
    if (window.confirm(gettext('Are you sure you want to delete this application registration? Access from all clients will be revoked.'))){
	$.post("/delete_consumer.xml",param, 
	  function(xml){
		if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
		  location.href="/api/consumers"
		}
		else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
		  alert($(xml).find("message"));
		}
	}, "xml");
		    return false;
    }
    
    return false;
  });
  
  $('a.update').live('click',function(event){
    var consumer_key = $(this).attr('ckey');
    var app_name = $(this).parents('form').find('#app_name').val().trim();
    var app_website = $(this).parents('form').find('#app_website').val().trim();
    var callback_url = $(this).parents('form').find('#callback_url').val().trim();
    var selectedRow = $(this);	

    var param = {};
    param['consumer_key']=consumer_key;
    param['app_name']=app_name;
    param['app_website']=app_website;
    param['callback_url']=callback_url;
	
    $.post("/update_consumer.xml",param, 
      function(xml){
	    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
	      location.href="/api/consumers"
	    }
	    else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
	      alert($(xml).find("message").text());      
	    }
    }, "xml");
    
    return false;
  });

});
