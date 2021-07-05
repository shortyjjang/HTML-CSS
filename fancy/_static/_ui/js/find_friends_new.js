$(document).ready(function() {
    $('a.twitter,button.btn-twitter').click(function(){
		var loc = location.protocol+"//"+location.host;
		var param = {'location':loc};

		$(".left-sidebar").hide();
		$('body').removeClass('wider').addClass('loading');
		$('.waiting').show();

		var selectedRow = $(this);
		var popup = window.open(null, '_blank', 'height=400,width=800,left=250,top=100,resizable=yes', true);			
		$('#searching-logo').addClass('twitter');
			
		$.post(
			'/find_friends_twitter.xml',
			param, 
			function(xml){
				var $xml = $(xml);
				if ($xml.find('status_code').length>0 && $xml.find('status_code').text()==1) {
					popup.location.href = $xml.find("url").text();						
					twitterConnected0(popup,$xml.find("url").text(),
						function(xml){
							if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1){
								location.href = "/find_friends/twitter";
								return false;
							}
							else{
							}
							$(".left-sidebar").show();
							$('body').addClass('wider').removeClass('loading');
							$('.waiting').hide();
							$('#searching-logo').removeClass('twitter');
						},
						function(xml){
							$(".left-sidebar").show();
							$('body').addClass('wider').removeClass('loading');
							$('.waiting').hide();
							$('#searching-logo').removeClass('twitter');
						})
					
				}
				else if ($xml.find("status_code").length>0 && $xml.find("status_code").text()==0) {
					$(".left-sidebar").show();
					$('body').addClass('wider').removeClass('loading');
					$('.waiting').hide();
					$('#searching-logo').removeClass('twitter');
					alert($(xml).find("message").text());
				}  
			},
			'xml'
		);

		return false;
    });
    
    $('a.gmail,button.btn-gmail').click(function(){
        var loc = location.protocol+'//'+location.host;
        var param = {'location':loc};

		$(".left-sidebar").hide();
		$('body').removeClass('wider').addClass('loading');
		$('.waiting').show();
		
        var selectedRow = $(this);
	
		var popup = window.open(null, '_blank', 'height=550,width=900,left=250,top=100,resizable=yes', true);
		$('#searching-logo').addClass('gmail');
	
		$.post(
			'/find_friends_gmail.xml',
			param, 
			function(xml){
				if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
					popup.location.href = $(xml).find("url").text();
					gmailConnected0(popup,$(xml).find("url").text(),
						function(xml){
							if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1){
								location.href = "/find_friends/gmail";
								return false;
							}
							else if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0 && $(xml).find("message").length>0){
								alert($(xml).find("message").text());                                      
							}
							$(".left-sidebar").show();
							$('body').addClass('wider').removeClass('loading');
							$('.waiting').hide();
							$('#searching-logo').removeClass('gmail');

						},
						function(xml){
							$(".left-sidebar").show();
							$('body').addClass('wider').removeClass('loading');
							$('.waiting').hide();
							$('#searching-logo').removeClass('gmail');
						})
					
				}
				else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
					$(".left-sidebar").show();
					$('body').addClass('wider').removeClass('loading');
					$('.waiting').hide();
					$('#searching-logo').removeClass('gmail');
					alert($(xml).find("message").text());
				}
			},
			'xml'
		);

        return false;
    });
});

var twitterConnected0 = function(popup,url,success, failure) {
	var wait  = function() {
		setTimeout(function() {
			if (popup == null) {
				failure(); // When does this happen?
				return;
			}
			if (popup.closed) {
				$.post('/link_or_update_tw_user.xml',function(xml) {
					if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
						success(xml);
					}
					else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
						alert($(xml).find("message").text());
						failure();
					}
					else {
						/*failure();*/
					}
				}, "xml");
			}
			else {
				wait();
			}
		}, 25);
	};
	wait();
};

var gmailConnected0 = function(modal,url,success, failure) {
	var wait  = function() {
		setTimeout(function() {
			if (modal == null) {
				failure(); // When does this happen?
				return;
			}
			if (modal.closed) {
				$.post('/find_friends/google/check.xml',function(xml) {
					if ($(xml).find("status_code").length>0) {
						success(xml);
					}
					else {
						failure();
					}
				}, "xml");
			}
			else {
				wait();
			}
		}, 25);
	};
	wait();
};
