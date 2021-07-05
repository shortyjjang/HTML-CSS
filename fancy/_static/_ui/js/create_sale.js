$(document).ready(function(){

    $('.add-option-btn-cancel').click(function(event){
        var url = $(this).attr('data-url');
        location.href = url;
        return false;
    });

    $(document).on("click", '.add-option-btn-save,.btn-complete-later', function() {
        tinyMCE.triggerSave();
        var new_thing_id = $(this).attr('ntid');
        var new_thing_user_id = $(this).attr('ntuid');
        var title = $('#title').val().trim();
        var description = $('#wysiwyg').val().trim();
        var price = $('#price').val().trim();
        var retail_price = $('#retail_price').val().trim();
        var sale_start_date = $('#deal-start').val().trim() + " 00:00:00";
        var sale_end_date = $('#deal-end').val().trim() + " 00:00:00";
        var quantity = $('#quantity').val().trim();
        var tag = '';
        if($('#tag').length >0)
            tag = $('#tag').val().trim();
        var color = '';
        if($('#color').length >0) 
            color = $('#color').val().trim();

        var country_of_origin = $('#country_of_origin option:selected').val();

        var seller_sku = $('#seller-sku').val().trim();
        var personalizable = $('.add-option-personalizable-input').is(':checked');
        var incomplete = $(this).hasClass('btn-complete-later');

        var prod_length = $('#length').val(); 
        var prod_height = $('#height').val(); 
        var prod_width  = $('#width').val(); 
        var prod_weight = $('#weight').val();                                                                                                                                                        

        if (prod_height.trim().length<=0 || prod_width.trim().length<=0 ||
            prod_length.trim().length<=0 || prod_weight.trim().length<=0){
            alert("Length, Height, Width, and Weight required");
            return false;
        }

        var tax_code = $('#taxClassText').val();
        var check_charge_tax = $('#check-charge-tax:checked');
        var charge_domestic_shipping = $('#domestic_shipping').is(':checked');;
        var charge_international_shipping = $('#international_shipping').is(':checked');
        var ships_internationally = $('#ships_internationally').is(':checked');
        var return_policy = $('#return_policy').val();
        var commodity_code_id = $('.hcc-codes.current').val();
        var iids = '';    
        var uws = $('#uws').val().trim();
        var uwe = $('#uwe').val().trim();
        var iws = $('#iws').val().trim();
        var iwe = $('#iwe').val().trim();

        var check_sale_indefinite = $('#check_indefinite:checked');

        var s_gender = [];
        var r_gender = [];
        var relationship = [];

        $('input[name=rec_sender_gender]:checked').each(function(){s_gender.push($(this).val())});
        $('input[name=rec_recpt_gender]:checked').each(function(){r_gender.push($(this).val())});
        $('input[name=rec_relationship]:checked').each(function(){relationship.push($(this).val())});

        var s_age_min = $('input[name=rec_sender_age_min]').val();
        var s_age_max = $('input[name=rec_sender_age_max]').val();
        var r_age_min = $('input[name=rec_recpt_age_min]').val();
        var r_age_max = $('input[name=rec_recpt_age_max]').val();

	var has_recommendation = (typeof s_age_min != "undefined" && 
				  typeof s_age_max != "undefined" && 
				  typeof r_age_min != "undefined" && 
				  typeof r_age_max != "undefined");

	if(has_recommendation) {
            if (s_age_min >= s_age_max || r_age_min >= r_age_max) {
		alert('Maximum value should be greater than minimum value.');
		return false;                                                                                                                                                                                                                          
            }
	    
            if (s_age_min < 0 || r_age_min < 0) {
		alert('Minimum value should be greater than 0.');
		return false;
            }

            if (s_age_max > 200 || r_age_max > 200) {
		alert('Maximum value should be less than or equal to 200.');
		return false;
            }
	}

        $('#file-list > li').each(function(){
            var iid = $(this).attr('iid');
            if(iids.length>0)
                iids = iids+','+iid
            else
                iids = iid;
        });
        var cat_ids = '';
        if($('.add-option-category .used-category').length>0){
            $('.add-option-category .used-category > li').each(function(){
                var cid = $(this).attr('data-c');
                if(cat_ids.length>0)
                    cat_ids = cat_ids+','+cid
                else
                    cat_ids = cid;
            });

        }
        if (title.length == 0 && !incomplete){
            alert('Please select a title.');
            return false;
        }

        if (cat_ids.length <= 0 && !incomplete)
        {
            alert('Please select one or more categories.');
            return false;            
        }

        if (description.length == 0 && !incomplete){
            alert('Please describe your product.');
            return false;
        }
        if (price.length == 0 || isNaN(parseFloat(price))){
            alert('Please enter the price.');
            return false;
        }
        if (retail_price.length == 0 || isNaN(parseFloat(retail_price))){
            if(incomplete){
                retail_price=price
            }
            else{
                alert('Please enter the retail price.');
                return false;
            }
        }
        if (sale_start_date.length == 0 || sale_end_date.length ==0 ){
            alert('Please enter the sale dates.');
            return false;
        }
        if (check_sale_indefinite.length == 0 && sale_end_date.length ==0 ){
            alert('Please enter the sale dates.');
            return false;
        }
        if (check_charge_tax.length && (typeof(tax_code) == undefined || tax_code == null || !tax_code.is_int())){
            alert('Please select a product taxability code.');
            return false;        
        }
    
        var param = {};

        var use_custom_charge = $('#use_custom_shipping_charge').is(':checked');
        
        if(use_custom_charge) {
            var custom_charge_domestic = parseFloat($('.custom_charge_domestic').val());
            var custom_charge_international = parseFloat($('.custom_charge_international').val());
            if(charge_domestic_shipping) {
                if(isNaN(custom_charge_domestic)) {
                    alert('Please enter valid domestic custom charge.');
                    return false;
                }
                else {
                    param['custom_domestic_charge'] = custom_charge_domestic;
                }
            }
            if(charge_international_shipping) {
                if(isNaN(custom_charge_international)) {
                    alert('Please enter valid international custom charge.');
                    return false;
                }
                else {
                    param['custom_international_charge'] = custom_charge_international;
                }
            }

            var domestic_incremental_fee = $('.domestic_incremental_fee').val();
            var international_incremental_fee = $('.international_incremental_fee').val();
			if (custom_charge_domestic && domestic_incremental_fee) {
				domestic_incremental_fee = parseFloat(domestic_incremental_fee);
				if(isNaN(domestic_incremental_fee)) {
					alert('Please enter valid incremental fee');
					return false;
				}
				param['domestic_incremental_fee'] = domestic_incremental_fee;
			}
			if (custom_charge_international && international_incremental_fee) {
				international_incremental_fee = parseFloat(international_incremental_fee);
				if(isNaN(international_incremental_fee)) {
					alert('Please enter valid incremental fee');
					return false;
				}
				param['international_incremental_fee'] = international_incremental_fee;
			}
        } 

        param['weight'] = prod_weight;
        param['height'] = prod_height;
        param['width']  = prod_width;
        param['length'] = prod_length;

        param['new_thing_id']=new_thing_id;
        param['new_thing_user_id']=new_thing_user_id;
        param['title']=title;
        param['cat_ids']=cat_ids;
        param['description']=description;
        param['price']=price;
        param['retail_price']=retail_price;
        param['sale_start_date']=sale_start_date;
        if (check_sale_indefinite.length){
            param['sale_end_date']='-1';
        }
        else{
            param['sale_end_date']=sale_end_date;
        }
        param['charge_domestic_shipping']=charge_domestic_shipping;
        param['charge_international_shipping']=charge_international_shipping;
        param['international_shipping']=ships_internationally;
        param['return_policy'] = return_policy;
        param['commodity_code_id'] = commodity_code_id;
        if (commodity_code_id == undefined) commodity_code_id = 'none';
        if (incomplete)
            param['incomplete']='true';
        if ((typeof(tax_code) != undefined && tax_code != null && tax_code.is_int()))
            param['tax_code']=tax_code;
        param['iids']=iids;

	if(has_recommendation) {
            param['relationship']=relationship.join(',');
            param['s_gender'] = s_gender.join(',');
            param['r_gender'] = r_gender.join(',');
            param['s_age_min'] = s_age_min;
            param['s_age_max'] = s_age_max;
            param['r_age_min'] = r_age_min;
            param['r_age_max'] = r_age_max;
	}
        
        var total_quantity = 0;
        if (quantity.length > 0)
        {
            if(!quantity.is_int()){
                alert('Please enter a valid quantity.');
                return false;            
            }
            total_quantity = parseInt(quantity);
            param['quantity']=quantity;
        }
        if (tag.length > 0)
        {
            param['tag'] = tag;
        }
        
        if (color.length > 0)
        {
            param['color'] = color; 
        }

        if (country_of_origin.length > 0) {
            param['country_of_origin'] = country_of_origin;
        }

        param['seller_sku'] = seller_sku;
        param['personalizable'] = personalizable;

        if (uws.length > 0)
        {
            if(!uws.is_int()){
                alert('Please enter a valid US Window Start.');
                return false;            
            }
            if (uwe.length <= 0 || (uwe.length > 0 && !uwe.is_int() ))
            {
                    alert('Please enter a valid US Window End.');
                    return false;            
            }
            if (parseInt(uws)> parseInt(uwe))
            {
                    alert('Please enter a valid US Window End.');
                    return false;            
            }
            param['uws']= parseInt(uws);
            param['uwe']= parseInt(uwe);
        }
        if (iws.length > 0)
        {
            if(!iws.is_int()){
                alert('Please enter a valid International Start.');
                return false;            
            }
            if (iwe.length <= 0 || (iwe.length > 0 && !iwe.is_int() ))
            {
                    alert('Please enter a valid International End.');
                    return false;            
            }
            if (parseInt(iws)> parseInt(iwe))
            {
                    alert('Please enter a valid International End.');
                    return false;            
            }
            param['iws']= parseInt(iws);
            param['iwe']= parseInt(iwe);
        }

        var has_options = $('#check-multiple').is(':checked');
        if (has_options)
        {
            var total_quantity_options = 0;
            var item_options = [];
            var has_quantity = false;
            var no_quantity = false;
			var has_dim = false;
			var no_dim = false;
            $('.table-option-item tbody tr input.option').each(function(index) {
                var option_name = $(this).val().trim();
                var option_quantity = $(this).parents('tr').find('input.quantity').val().trim();
                var option_color = $(this).parents('tr').find('input.color').val().trim();
                var option_price = $(this).parents('tr').find('input.price').val().trim();
                var option_retail_price = $(this).parents('tr').find('input.retail_price').val().trim();
                var option_seller_sku = $(this).parents('tr').next().next().find('input.seller_sku').val().trim();
				var $dim = $(this).parents('tr').next();
                var option_weight = $dim.find('input.weight').val().trim();
                var option_height = $dim.find('input.height').val().trim();
                var option_length = $dim.find('input.length').val().trim();
                var option_width  = $dim.find('input.width').val().trim();
				
                if (option_name.length > 0)
                {
                    item_option = { 'option': option_name } 

                    if (option_quantity.length > 0){
                        if(!option_quantity.is_int()){ 
                            alert('Please select a valid quantity.'); 
                            return false;
                        }

                        item_option['quantity'] = option_quantity ;
                        total_quantity_options += parseInt(option_quantity) ;
                        has_quantity = true;
                    }
                    else 
                    {
                        no_quantity = true;
                    }
                    if(option_color.length > 0) 
                    {
                        item_option['color'] = option_color;
                    }
	                if(typeof option_price != "undefined" && option_price.length>0){

                        if (isNaN(parseFloat(option_price))){
                            alert('Please enter the valid price.');
                            return false;
                        }
                        item_option['price'] = option_price;
                    }
	                if(typeof option_retail_price != "undefined" && option_retail_price.length>0){

                        if (isNaN(parseFloat(option_retail_price))){
                            alert('Please enter the valid retail price.');
                            return false;
                        }
                        item_option['retail_price'] = option_retail_price;
                    }

					has_dim = option_width.length > 0 || option_height.length > 0 || option_length.length > 0 || option_weight.length > 0;
					no_dim  = !(option_width.length > 0 && option_height.length > 0 && option_length.length > 0 && option_weight.length > 0);

					if (has_dim && no_dim) {
						return false;
					}

                    if(option_seller_sku.length > 0)
                    {
                        item_option['seller_sku'] = option_seller_sku;
                    }

                    if(has_dim)
                    {
                        item_option['width']  = option_width;
                        item_option['height'] = option_height;
                        item_option['length'] = option_length;
                        item_option['weight'] = option_weight;
                    }
                    item_options.push(item_option);
                }
            });

			if (has_dim && no_dim) {
				alert("Please enter Length, Height, Width, and Weight in options.");
				return false;
			}

            if (item_options.length>0)
            {
                if(has_quantity && no_quantity) 
                {
                    alert('Please enter the quantity in options');
                    return false;            
                }

                if(has_quantity && no_quantity) 
                {
                    alert('Please enter the quantity in options');
                    return false;            
                }

                var option_json_string = JSON.stringify({"options":item_options})
                param['option_json_string']=option_json_string;
            }
            if(total_quantity_options != total_quantity){
                alert('The sum of option quantities must equal the total quantity you selected.');
                return false;                    
            }
            
        }
        if ($('#file-list li').size() < 3 && !incomplete)
        {
          alert("You need at least 3 images.");
          return false;
        }
        
        
        if( $(this).hasClass('waiting'))
            return false;
        if($('.add-option-btn-save').hasClass('waiting'))
            return false;
        if($('.btn-complete-later').hasClass('waiting'))
            return false;

        $(this).addClass('waiting');
        var selectedRow = $(this);
        $.post("/add_deal_item.xml",param,
          function(xml){
                selectedRow.removeClass('waiting');
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                  var msg = $(xml).find("message").text();
                  location.href='/listings';
                }
                else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                  var msg = $(xml).find("message").text();
                  alert(msg);
                }
        }, "xml");
        
        
        return false;
    });




});
