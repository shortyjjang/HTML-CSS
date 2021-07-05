jQuery(function($){
	

	$("input[name=emails]").keyup(function(e){
		if(e.keyCode == 13){
			e.preventDefault();
			$(".btn-send").click();
		}
	})

	$(".btn-send").click(function(){
		var emails = $("input[name=emails]").val();
		if(!emails){
			alertify.alert("Please input email addresses");
			return;
		}

		$(".btn-send").prop('disabled', true);
		$.post("/invite_friends_with_emails.json", {emails: emails}, function(json){
			if(json.status_code==1){
				$("input[name=emails]").val('');
				var message = "Invitation sent!";
				if(emails.split(",").length > 1){
					message = "Invitations sent!";
				}
				alertify.alert(message);
			}else{
				alertify.alert(json.message||'Request Failed. Please try again');
			}
		}).always(function(){
			$(".btn-send").prop('disabled', false);
		})
	})
});