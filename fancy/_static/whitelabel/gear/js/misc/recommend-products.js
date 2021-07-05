;(function($){

	$("button.add").click(function(){
		$(this).before($('<input type="text" placeholder="Enter product URL">'));
	})

	$("button.btn-send").click(function(){
		submit();
	})

	function reset($form){
		$("#content input:not(:eq(0))").remove();
		$("#content input").val('');
	}
	
	function submit() {
		var $submit = $("button.btn-send"), urls = Array.prototype.slice.call($("#content input").map(function(){ if($(this).val()) return $(this).val() }));

		if (!urls.length){
			alertify.alert('Please enter at least one URL');
			return;
		}

		$submit.prop('disabled', true);

		$.ajax({
			type : 'POST',
			url  : '/recommend_product.json',
			data : {urls: JSON.stringify(urls)},
			dataType : 'json',
			success  : function(json) {
				if (json.status_code) {
                    var original_labels = alertify.labels
					alertify.set({'labels': {ok: 'Done'}});
					alertify.alert("Products sent. Thanks for your recommendations.");
					alertify.set({'labels': original_labels});
					reset();
				} else {
					wentWrong();
				}
			},
			error : function() {
				wentWrong();
			},
			complete : function() {
				$submit.prop('disabled', false);
			}
		});
	};

	function wentWrong() {
		alertify.alert('Sorry, something went wrong.\nPlease try again later.');
	};

})(jQuery);
