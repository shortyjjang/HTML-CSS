$(document).ready(function() {
    
    $('.form-controls .button.send').click(function() {
      
        var selected_all = $('#all').is(':checked');
        
        var followusers = $('.follow_user');
	
        var uids = '';
	    var uid_count = 0;
		followusers.each(function(){
			  if ($(this).is(':checked')){
				var uid = $(this).attr('uid');
				if(uid != undefined && uid !=null){
				  if(uids.length>0)
					uids = uids+","+uid;
				  else
					uids = ""+uid;
				  uid_count = uid_count + 1;
				}
			  }
		});
	
	if(uids.length>0){
	  var param = {};
	  param['user_ids']=uids;
	  var selectedRow = $(this);
	  $('.follow-box').hide();
	  $('.waiting').show();
	  $.post("/add_follows.xml",param, 
	      function(xml){

			$('.follow-box').show();
			$('.waiting').hide();

		  if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
			followusers.each(function(){
			  if ($(this).is(':checked')){
				$(this).parent().parent('li').remove();
			  }
			});

			var remain_count = $('.friends-list ul.u-list > li').size();
			var ran = Math.random() * remain_count;
			var howabout = $('.friends-list ul.u-list > li').eq(ran).attr('id');

			$('#alert-msg').empty();					
			$('#alert-msg').removeClass('notification invited');
			if(remain_count>0){
				$('#alert-msg').addClass('notification invited').append('<p><strong>Success! '+uid_count+' followed.</strong> What about also following <a href="#'+howabout+'">'+howabout+'</a>?</p>');								
			}
			else{
				location.href='/find_friends?fc='+uid_count;
				//$('#alert-msg').addClass('notification invited').append('<p><strong>Success! '+uid_count+' followed.</strong></p>');				
			}

		  }
		  else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
		    alert($(xml).find("message").text());
		  }  
	  }, "xml");      
	}
	return false;
    });

});