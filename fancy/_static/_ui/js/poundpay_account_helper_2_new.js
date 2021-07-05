$(document).ready(function(){
  
	$('#sign-up').on('click',function(event){
    
    	var isMkp = true;
		var merchant_name = $('#merchant_name').val().trim();
		var merchant_street_address = $('#merchant_street_address').val().trim();
		var merchant_street_address_2 = $('#merchant_street_address_2').val().trim();
		var merchant_city = $('#merchant_city').val().trim();
		var merchant_state = $('#merchant_state').val().trim();
		var merchant_postal_code = $('#merchant_postal_code').val().trim();
		var merchant_country = $('#merchant_country').val().trim();
		var merchant_phone_number = $('#merchant_phone_number').val().trim();
        var brand_name = $('#brand_name').val().trim();
        var dwolla_id = $("[name=dwolla_id]").val().trim();
        var skip_dwolla = $("#skip-dwolla").is(":checked");
		//var merchant_dob_day = $('#merchant_dob_day').val().trim();
		//var merchant_dob_month = $('#merchant_dob_month').val().trim();
		//var merchant_dob_year = $('#merchant_dob_year').val().trim();

		if(merchant_name.length <=0 ){
            alert("Full name is required");
			return false;
		}
		
		if(merchant_street_address.length <=0 ){
            alert("Address line 1 is required");
			return false;
		}
		
		if(merchant_postal_code.length <=0 ){
            alert("Postal code is required");
			return false;
		}

		if(!skip_dwolla && !dwolla_id){
			alert("Dwolla ID is required");
			return false;	
		}
        
        /*
        if(merchant_dob_day.length <=0 || merchant_dob_day==$('#merchant_dob_day').attr('placeholder').trim()
		 || merchant_dob_month.length <=0 || merchant_dob_month==$('#merchant_dob_month').attr('placeholder').trim()
		 || merchant_dob_year.length <=0 || merchant_dob_year==$('#merchant_dob_year').attr('placeholder').trim()
		 ){
            alert("Date of birth is required");
			return false;
		}*/

		
		if(merchant_phone_number.length <=0 ){
            alert("Phone is required");
			return false;
		}

		var param = {};

		var redirect_url = $(this).attr('re-url');
		var extra_data = $(this).attr('extra-data');
		
		param['use_storefront']=!isMkp;
		param['merchant_name']=merchant_name;
		param['merchant_street_address']=merchant_street_address;
		param['merchant_street_address_2']=merchant_street_address_2;
		param['merchant_postal_code']=merchant_postal_code;
		param['merchant_city']=merchant_city;
		param['merchant_state']=merchant_state;
		param['merchant_country']=merchant_country;
		param['merchant_phone_number']=merchant_phone_number;
        param['brand_name']=brand_name;
        if(!skip_dwolla)
        	param['dwolla_id']=dwolla_id;
		//param['merchant_dob_day']=merchant_dob_day;
		//param['merchant_dob_month']=merchant_dob_month;
		//param['merchant_dob_year']=merchant_dob_year;

		if(extra_data != undefined)
			param[extra_data.toString()]=extra_data;
		

		var rowedSelect = $(this);
        rowedSelect.attr('style','cursor:default');
		rowedSelect.attr('disabled','disabled');

		$.post("/merchant-signup-2-new.json",param, 
						  function(response){
								rowedSelect.attr('style','cursor:hand');
								rowedSelect.removeAttr('disabled');
								if (response.status_code != undefined && response.status_code == 1) {
									if(redirect_url != undefined)
										location.href = redirect_url;
									else
                                        location.href = '/merchant/get-started';
								}
								else if (response.status_code != undefined && response.status_code == 0) {
                                    if(response.merchant_city != undefined){
		                                $('#merchant_city').val(response.merchant_city);
		                            }
		                            if(response.merchant_street_address != undefined){
		                                $('#merchant_street_address').val(response.merchant_street_address);
		                            }
		                            if(response.merchant_street_address_2 != undefined){
		                                $('#merchant_street_address_2').val(response.merchant_street_address_2);
		                            }
		                            if(response.merchant_postal_code != undefined){
		                                $('#merchant_postal_code').val(response.merchant_postal_code);
		                            }
		                            if(response.merchant_state != undefined){
		                                $('#merchant_state').selectBox('value',response.merchant_state);
		                            }
									if(response.message != undefined){
										alert(response.message);
									}
								}
						  }, "json");
		  return false;
  });

});
