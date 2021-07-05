$(document).ready(function(){
  
  $('a.register').live('click',function(event){
    var name = $(this).parents('form').find('#name').val().trim();
    var directory_entry = $(this).parents('form').find('#directory_entry').val().trim();
    var coupon_code = $(this).parents('form').find('#coupon_code').val().trim();
    var coupon_url = $(this).parents('form').find('#coupon_url').val().trim();
    var header_text = $(this).parents('form').find('#header_text').val().trim();
    var footer_text = $(this).parents('form').find('#footer_text').val().trim();
    var email_subject = $(this).parents('form').find('#email_subject').val().trim();
    var email_body = $(this).parents('form').find('#email_body').val().trim();
    var required_count = $(this).parents('form').find('#required_count').val().trim();
    var external_url = $(this).parents('form').find('#external_url').val().trim();
    var coupon_text = $(this).parents('form').find('#coupon_text').val().trim();
    var expiration = $(this).parents('form').find('#store_deal_expiration').val().trim();
    var selectedRow = $(this);
    /*
    if(coupon_code.length <=0 && coupon_url.length <=0){
      alert("please enter coupon-code or coupon-url")
      return false;
    }

    if(coupon_text.length <=0 ){
      alert("please enter coupon text.")
      return false;
    }*/
    if(required_count.length <=0 ){
      alert("please enter required count.")
      return false;
    }
    
    var param = {};
    param['name']=name;
    param['directory_entry']=directory_entry;
    param['coupon_code']=coupon_code;
    param['coupon_url']=coupon_url;
    param['header_text']=header_text;
    param['footer_text']=footer_text;
    param['email_subject']=email_subject;
    param['email_body']=email_body;
    param['required_count']=required_count;
    param['external_url']=external_url;
    param['coupon_text']=coupon_text;
    param['expiration']=expiration;
    
    $.post("/admin/register_brand_badge.xml",param, 
      function(xml){
	    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
	      bbid = $(xml).find("badge_id").text();
	      //alert(bbid);
	      location.href="/admin/edit-brand-badge-images?brand_badge_id="+ bbid
	    }
	    else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
	      alert($(xml).find("message").text());      
	    }
    }, "xml");
    
    return false;
  });
  
  $('a.delete').live('click',function(event){
    var badge_id = $(this).attr('bbid');
    var selectedRow = $(this);	

    var param = {};
    param['badge_id']=badge_id;
	
    if (window.confirm(gettext('Are you sure you want to delete this brand badge?'))){
	$.post("/admin/delete_brand_badge.xml",param, 
	  function(xml){
		if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
		  location.href="/admin/view-brand-badges"
		}
		else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
		  alert($(xml).find("message"));
		}
	}, "xml");
		    return false;
    }
    
    return false;
  });
  
  $('a.activate').live('click',function(event){
    var badge_id = $(this).attr('bbid');
    var selectedRow = $(this);	

    var param = {};
    param['badge_id']=badge_id;
	
    if (window.confirm('Activate badge?')){
	$.post("/admin/activate_brand_badge.xml",param, 
	  function(xml){
		if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
		  location.reload(true);
		}
		else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
		  alert($(xml).find("message"));
		}
	}, "xml");
		    return false;
    }
    
    return false;
  });
  
  $('a.deactivate').live('click',function(event){
    var badge_id = $(this).attr('bbid');
    var selectedRow = $(this);	

    var param = {};
    param['badge_id']=badge_id;
	
    if (window.confirm(gettext('Deactivate badge?'))){
	$.post("/admin/deactivate_brand_badge.xml",param, 
	  function(xml){
		if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
		  location.reload(true);
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
    var badge_id = $(this).attr('bbid');
    var is_active = $(this).attr('is_active');
    //alert(is_active);
    var name = $(this).parents('form').find('#name').val().trim();
    var directory_entry = $(this).parents('form').find('#directory_entry').val().trim();
    var coupon_code = $(this).parents('form').find('#coupon_code').val().trim();
    var coupon_url = $(this).parents('form').find('#coupon_url').val().trim();
    var header_text = $(this).parents('form').find('#header_text').val().trim();
    var footer_text = $(this).parents('form').find('#footer_text').val().trim();
    var email_subject = $(this).parents('form').find('#email_subject').val().trim();
    var email_body = $(this).parents('form').find('#email_body').val().trim();
    var required_count = $(this).parents('form').find('#required_count').val().trim();
    var external_url = $(this).parents('form').find('#external_url').val().trim();
    var coupon_text = $(this).parents('form').find('#coupon_text').val().trim();
    var expiration = $(this).parents('form').find('#store_deal_expiration').val().trim();
    
    /*
    if(coupon_code.length <=0 && coupon_url.length <=0){
      alert("please enter coupon-code or coupon-url")
      return false;
    }

    if(coupon_text.length <=0 ){
      alert("please enter coupon text.")
      return false;
    }*/
    
    var selectedRow = $(this);	

    var param = {};
    param['badge_id']=badge_id;
    param['name']=name;
    param['directory_entry']=directory_entry;
    param['coupon_code']=coupon_code;
    param['coupon_url']=coupon_url;
    param['header_text']=header_text;
    param['footer_text']=footer_text;
    param['email_subject']=email_subject;
    param['email_body']=email_body;
    param['required_count']=required_count;
    param['external_url']=external_url;
    param['coupon_text']=coupon_text;
    param['expiration']=expiration;
    if (is_active == "active"){
      param['is_active']=0; // if current setting is active then deactivate
    }else if(is_active == "inactive")
    {
      param['is_active']=1; // if current settings is inactive then activate
    }
  
    $.post("/admin/update_brand_badge.xml",param, 
      function(xml){
	    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
	      location.href="/admin/view-brand-badges"
	    }
	    else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
	      alert($(xml).find("message").text());      
	    }
    }, "xml");
    
    return false;
  });
  
  $('a.upload').live('click',function(event){
    var badge_id = $(this).parents('form').find('#name').attr('bbid');
    var image_type = $(this).attr('image_type');
    var selectedRow = $(this);
    var temp;
    
    if (image_type == 1){temp ="header_image";}
    else if (image_type == 2){temp ="middle_image";}
    else if (image_type == 3){temp ="large_badge_image";}
    else if (image_type == 4){temp ="small_badge_image";}

    var param = {};
    param['badge_id']=badge_id;
    param['image_type']=image_type;
  
    var fileval = $(this).parent().find('#'+temp).attr('value');
    if (fileval.length>0){
	  $.ajaxFileUpload( { 
		  url:'/admin/brand_badge_image.xml?badge_id='+badge_id+'&image_type='+temp,
		  secureuri:false,
		  fileElementId:temp,
		  dataType: 'xml',
		  success: function (data, status) 
		  {
			  if ($(data).find("status_code").length>0 && $(data).find("status_code").text()==1)
			  {
			    param['image_url']=$(data).find("image_url").text();
			    $.post("/admin/update_brand_badge_image.xml",param, 
			      function(xml){
				    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
				      location.reload(true);
				    }
				    else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
				      alert($(xml).find("message").text());      
				    }
			    }, "xml");
			  }
			  else if ($(data).find("status_code").length>0 && $(data).find("status_code").text()==0)
			  {
				  alert($(data).find("message").text());
				  return false;
			  }
			  else
			  {
				  alert(gettext("Unable to upload file."));
				  return false;
			  }
		  },
		  error: function (data, status, e)
		  {
			  alert(e);
			  return false;
		  }
	  });
    }
    
    return false;
  });

});
