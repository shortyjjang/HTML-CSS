$(document).ready(function() {
      
    $(document).delegate('.sl-twitter','click',function(e){  
    	e.preventDefault();
    	e.stopPropagation();    	

        var loc = document.location.protocol+"//"+document.location.host;
    
        var selectedRow = $(this);
		var url=location.search;

		url = url.replace(/[\?&]from_twitter_link=1/g,'').replace(/^[\?&]/,'');
		url = loc+location.pathname+'?from_twitter_link=1&'+url;

		$.ajax({
			type : 'post',
			url  : '/apps/twitter/login.xml',
	        headers : {'X-CSRFToken':$.cookie.get('csrftoken')},
			data : {location:loc,next:url},
			dataType : 'xml',
			success  : function(xml){
				var $xml=$(xml),$st=$xml.find('status_code'),params={};
				if(!$st.length || $st.text() != '1') return;
				location.href = $xml.find('url').text();
			},
			complete : function(){
			}
		});
	});

	// check from_twitter_auth parameter
	if(/\?from_twitter_link=1/.test(location.search)){

        $.ajax({
	        type : 'post',
	        url  : '/apps/twitter/check.xml',
            headers : {'X-CSRFToken':$.cookie.get('csrftoken')},
	        dataType : 'xml',
	        success  : function(xml){
                if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1){
				    param = {};
				    $.ajax({
		                type : 'post',
		                url  : '/link_twitter_user.xml',
						headers : {'X-CSRFToken':$.cookie.get('csrftoken')},
		                data : param,
		                dataType : 'xml',
		                success  : function(xml){
					    	if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
					    		document.location.href = document.location.protocol+"//"+document.location.host+document.location.pathname;						 		
					     	}
					     	else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
						 		alert($(xml).find("message").text());
					     	}
					     	else {
						 		//alert('failed');
					     	}
		                },
		                complete : function(){
		                }
                	});			     
			 	}
			 
	        },
	        complete : function(){
	        }
		});
	}
    
    $(document).delegate('#unlink_twitter','click',function(){
		$.ajax({
		    type : 'post',
		    url  : '/unlink_twitter_user.xml',
	        headers : {'X-CSRFToken':$.cookie.get('csrftoken')},
		    data : {},
		    dataType : 'xml',
		    success  : function(xml){
	                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
			    		$('.sns-t').empty().html('<em></em><button type="button" class="btn-gray sl-twitter">Connect with Twitter</button>');
	                }
	                else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
	                    alert($(xml).find("message").text());
	                }
	                else {
	                    //alert('failed');
	                }
		    },
		    complete : function(){
		    }
		});	
		return false;
    });

    $(document).delegate('.network-item._twitter .switch.on','click',function(){
		$.ajax({
		    type : 'post',
		    url  : '/unlink_twitter_user.xml',
	        headers : {'X-CSRFToken':$.cookie.get('csrftoken')},
		    data : {},
		    dataType : 'xml',
		    success  : function(xml){
	                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
				    	$('.network-item._twitter > small').text( gettext("Share your Fancy activity to your Twitter profile.") );
				    	$('.network-item._twitter > button.switch').toggleClass("on sl-twitter");
				    	$('.network-item._twitter').next('p.option').remove();		
	                }
	                else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
	                    alert($(xml).find("message").text());
	                }
	                else {
	                    //alert('failed');
	                }
		    },
		    complete : function(){
		    }
		});	
		return false;
    });
});

