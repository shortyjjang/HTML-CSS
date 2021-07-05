$(document).ready(function(){

  $('#create-deal button.button').live('click',function(event){
    var new_thing_id = $(this).attr('ntid');
    var new_thing_user_id = $(this).attr('ntuid');
    var title = $('#title').val().trim();
    var description = $('#description').val().trim();
    var price = $('#price').val().trim();
    var retail_price = $('#retail_price').val().trim();
    var sale_start_date = $('#sale_start_date').val().trim();
    var sale_end_date = $('#sale_end_date').val().trim();
    var quantity = $('#quantity').val().trim();
    var image_url1 = $('#image_url1').val().trim();
    var image_url2 = $('#image_url2').val().trim();
    var image_url3 = $('#image_url3').val().trim();
    var image_url4 = $('#image_url4').val().trim();
    var image_url5 = $('#image_url5').val().trim();
    var tax_code = $('input#taxClassText').val();
	
    var option1 = $('#option1').val().trim();
    var option1_quantity = $('#option1_quantity').val().trim();
    var option2 = $('#option2').val().trim();
    var option2_quantity = $('#option2_quantity').val().trim();
    var option3 = $('#option3').val().trim();
    var option3_quantity = $('#option3_quantity').val().trim();
    var option4 = $('#option4').val().trim();
    var option4_quantity = $('#option4_quantity').val().trim();
    var option5 = $('#option5').val().trim();
    var option5_quantity = $('#option5_quantity').val().trim();
    
    if (new_thing_id.length == 0 || new_thing_user_id.length == 0 || title.length == 0 || description.length == 0 ||
	price.length == 0 || retail_price.length == 0 || sale_start_date.length == 0 || sale_end_date.length == 0 || (typeof(tax_code) == undefined || tax_code == null))
    {
      alert("All fields are required.");
      return false;
    }

    var param = {};
	
    param['new_thing_id']=new_thing_id;
    param['new_thing_user_id']=new_thing_user_id;
    param['title']=title;
    param['description']=description;
    param['price']=price;
    param['retail_price']=retail_price;
    param['sale_start_date']=sale_start_date;
    param['sale_end_date']=sale_end_date;
    param['tax_code']=tax_code;
    
    if (quantity.length > 0)
    {
      param['quantity']=quantity;
    }
    
    var image_urls=[];
    
    if (image_url1.length > 0)
    {
      image_urls.push(image_url1);
    }
    if (image_url2.length > 0)
    {
      image_urls.push(image_url2);
    }
    if (image_url3.length > 0)
    {
      image_urls.push(image_url3);
    }
    if (image_url4.length > 0)
    {
      image_urls.push(image_url4);
    }
    if (image_url5.length > 0)
    {
      image_urls.push(image_url5);
    }
    if (image_urls.length < 3)
    {
      alert("must enter at least 3 image urls.");
      return false;
    }
    
    if (image_urls.length>0)
    {
      var images = '{"image":[';
      for(var i=0; i<image_urls.length; i++) {
	var url = image_urls[i];
	if (i != 0)
	{
	  images = images+','
	}
	images = images + '{"url"  : "' +url+ '"}';
      }
      images = images + "]}";
      
      param['images']=images;
    }
    
    var item_options = [];
    
    if (option1.length > 0)
    {
      var temp = [option1];
      if (option1_quantity.length > 0){
	temp.push(option1_quantity)
      }
      item_options.push(temp);
    }
    if (option2.length > 0)
    {
      var temp = [option2];
      if (option2_quantity.length > 0){
	temp.push(option2_quantity)
      }
      item_options.push(temp);
    }
    if (option3.length > 0)
    {
      var temp = [option3];
      if (option3_quantity.length > 0){
	temp.push(option3_quantity)
      }
      item_options.push(temp);
    }
    if (option4.length > 0)
    {
      var temp = [option4];
      if (option4_quantity.length > 0){
	temp.push(option4_quantity)
      }
      item_options.push(temp);
    }
    if (option5.length > 0)
    {
      var temp = [option5];
      if (option5_quantity.length > 0){
	temp.push(option5_quantity)
      }
      item_options.push(temp);
    }

    if (item_options.length>0)
    {
      var option_json_string = '{"options":[';
      for(var i=0; i<item_options.length; i++) {
	var option = item_options[i];
	if (i != 0)
	{
	  option_json_string = option_json_string+','
	}
	if (option.length > 1)
	{
	  option_json_string = option_json_string + '{"option"  : "' +option[0]+ '", "quantity" : "' + option[1] + '"}';
	}
	else{
	  option_json_string = option_json_string + '{"option"  : "' +option[0]+ '"}';
	}
      }
      option_json_string = option_json_string + "]}";
      
      param['option_json_string']=option_json_string;
    }

    $.post("/add_deal_item.xml",param, 
      function(xml){
	    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
	      var msg = $(xml).find("message").text();
	      alert(msg);
	    }
	    else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
	      var msg = $(xml).find("message").text();
	      alert(msg);
	    }
    }, "xml");
    
    
    return false;
  });
  
  $('.add-option-btn-save').live('click',function(event){
    var brand_name = $('#brand_name').val().trim();
    var address1 = $('#address1').val().trim();
    var address2 = $('#address2').val().trim();
    var city = $('#city').val().trim();
    var state = $('#state').val().trim();
    var zip = $('#zip').val().trim();
    var phone = $('#contact_phone').val().trim();
    var tax_shipping = false;
    if ($('#tax_shipping:checked').val() !== undefined) {
      tax_shipping = true;
    }
    
    var redirect_url = $(this).attr('re-url');
    
    if (brand_name.length == 0 || address1.length ==0 || city.length == 0 || state.length == 0 || zip.length == 0 || phone.length == 0)
    {
      alert("All fields are required.");
      return false;
    }
    
    var phone_number = phone.replace(/\s+/g, ""); 
    if (!phone_number.length > 9 || !phone_number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/)){
	    alert("Please specify a valid phone number.");
	    return false;			
    }

    var param = {};
    param['brand_name']=brand_name;
    param['address1']=address1;
    param['address2']=address2;
    param['city']=city;
    param['state']=state;
    param['zip']=zip;
    param['contact_phone']=phone_number;
    param['tax_shipping']=tax_shipping;
    
    $.post("/signup_seller.json",param, 
	  function(response){
	      if (response.status_code != undefined && response.status_code == 1) {
		  if(redirect_url != undefined)
		      location.href = redirect_url;
		  else
		      location.href = '/sales/create';
	      }
	      else if (response.status_code != undefined && response.status_code == 0) {
		  if(response.city != undefined){
		      $('#city').val(response.city);
		  }
		  if(response.address1 != undefined){
		      $('#address1').val(response.address1);
		  }
		  if(response.address2 != undefined){
		      $('#address2').val(response.address2);
		  }
		  if(response.zip != undefined){
		      $('#zip').val(response.zip);
		  }
		  if(response.state != undefined){
		      $('#state').val(response.state)
		  }
		  if(response.message != undefined)
		      alert(response.message);
	      }
    }, "json");
    
    
    return false;
  });
  
  /*
  $('#seller-signup button.button').live('click',function(event){
    var contact_name = $('#contact_name').val().trim();
    var contact_email = $('#contact_email').val().trim();
    var contact_phone = $('#contact_phone').val().trim();
    
    var is_company = $('#is_company').is(':checked');
    var tax_shipping = $('#tax_shipping').is(':checked');
    var company_name = $('#company_name').val().trim();
    var company_url = $('#company_url').val().trim();
    var company_twitter = $('#company_twitter').val().trim();
    var company_facebook = $('#company_facebook').val().trim();

    var address1 = $('#address1').val().trim();
    var address2 = $('#address2').val().trim();
    var city = $('#city').val().trim();
    var state = $('#state').val().trim();
    var zip = $('#zip').val().trim();

	var country_v = $('#id_countrycode').val();
	var country = $('#id_countrycode option[value="'+country_v+'"]').text();
    
    var paypal_email = $('#paypal_email').val().trim();
    
    if (contact_name.length == 0 || contact_email.length == 0 || contact_phone.length == 0 || is_company.length == 0 || address1.length ==0 ||
		  city.length == 0 || state.length == 0 || country.length == 0 || zip.length == 0)
    {
      alert("enter all fields");
      return false;
    }

    var param = {};
	
    param['contact_name']=contact_name;
    param['contact_email']=contact_email;
    param['contact_phone']=contact_phone;
    param['is_company']=is_company;
    param['tax_shipping']=tax_shipping;
    param['address1']=address1;
    param['address2']=address2;
    param['city']=city;
    param['state']=state;
    param['country']=country;
    param['zip']=zip;
    
    if (is_company == true)
    {
      if (company_name.length == 0 || company_url.length == 0)
      {
	alert("enter company_name and company_url");
	return false;
      }
      param['company_name']=company_name;
      param['company_url']=company_url;
      if (company_twitter.length > 0)
      {
	param['company_twitter']=company_twitter;
      }
      if (company_facebook.length > 0)
      {
	param['company_facebook']=company_facebook;
      }
    }
    
    if (paypal_email.length > 0)
    {
      param['paypal_email']=paypal_email;
    }

	if ($(this).hasClass('update')){
	  $.post("/update_seller.xml",param, 
		function(xml){
		  if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
			var msg = $(xml).find("message").text();
			alert(msg);
		  }
		  else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
			var msg = $(xml).find("message").text();
			alert(msg);
		  }
	  }, "xml");
	  
	}
	else{
	  $.post("/signup_seller.xml",param, 
		function(xml){
		  if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
			var msg = $(xml).find("message").text();
			alert(msg);
		  }
		  else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
			var msg = $(xml).find("message").text();
			alert(msg);
		  }
	  }, "xml");
	  
	}
    
    
    return false;
  });
  */
  
  $('#seller-update button.button').live('click',function(event){
    var contact_name = $('#contact_name').val().trim();
    var contact_email = $('#contact_email').val().trim();
    var contact_phone = $('#contact_phone').val().trim();
    var company_name = $('#company_name').val().trim();
    var company_url = $('#company_url').val().trim();
    var company_twitter = $('#company_twitter').val().trim();
    var company_facebook = $('#company_facebook').val().trim();
    var paypal_email = $('#paypal_email').val().trim();
    
    if (contact_name.length == 0 || contact_email.length == 0 || contact_phone.length == 0 || company_name.length == 0 ||
	company_url.length == 0 || company_twitter.length == 0 || company_facebook.length == 0 || paypal_email.length == 0)
    {
      alert("All fields are required.");
      return false;
    }

    var param = {};
	
    param['contact_name']=contact_name;
    param['contact_email']=contact_email;
    param['contact_phone']=contact_phone;
    param['company_name']=company_name;
    param['company_url']=company_url;
    param['company_twitter']=company_twitter;
    param['company_facebook']=company_facebook;
    param['paypal_email']=paypal_email;

    $.post("/update_seller.xml",param, 
      function(xml){
	    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
	      var msg = $(xml).find("message").text();
	      alert(msg);
	    }
	    else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
	      var msg = $(xml).find("message").text();
	      alert(msg);
	    }
    }, "xml");
    
    
    return false;
  });

});
