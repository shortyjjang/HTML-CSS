$(document).ready(function() {
	$('.btn-sns-t').click(function() {
		var loc = document.location.protocol+"//"+document.location.host;
		var tids = $(this).attr('tids');
		var param = {};
		param['location']=loc;
		param['tids']=tids;

		var selectedRow = $(this);
		var popup = window.open(null, '_blank', 'height=400,width=800,left=250,top=100,resizable=yes', true);

		$.post("/find_friends_twitter_s.xml",param, 
			function(xml){
				if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {

				popup.location.href = $(xml).find("url").text();						
				twitterConnected0(popup,$(xml).find("url").text(),
					function(xml){
					$.post("/post_order_to_twitter.json",param, 
						function(response){
							if (response.status_code != undefined && response.status_code == 1) {
								selectedRow.hide();
							}
							else if (response.status_code != undefined && response.status_code == 0) {
								if(response.message != undefined)
								alert(response.message);
							}  
						}, "json");
					},
					function(xml){
						alert(gettext("Please retry your request."));
					})

				}
				else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
					alert($(xml).find("message").text());
				}  
			}, "xml");
		return false;
	});

	var twitterConnected0 = function(popup,url,success, failure) {
		var wait  = function() {
			setTimeout(function() {
				if (popup == null) {
					failure(); // When does this happen?
					return;
				}
				if (popup.closed) {
					success();
				}
				else {
					wait();
				}
			}, 25);
		};
		wait();
	};

})
