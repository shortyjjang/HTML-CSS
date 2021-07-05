$(document).ready(function() {
    $('a.yahoo,a.gmail,a.winlive,a.twitter').click(function() {
        var e = ''
        if($(this).hasClass('gmail'))
            e = 'gmail';
        else if ($(this).hasClass('yahoo'))
            e = 'yahoo';
        else if ($(this).hasClass('winlive'))
            e = 'live';
        else if ($(this).hasClass('twitter'))
            e = 'twitter';
        else if ($(this).hasClass('facebook'))
            e = 'facebook';
            
        var loc = document.location.protocol+"//"+document.location.host;
        var param = {};
        param['eprovider']=e;
        param['location']=loc;

		$(".left-sidebar").hide();
		$('body').removeClass('wider').addClass('loading');
		$('.waiting').show();
		
		
        var selectedRow = $(this);
		if(e=='twitter'){
			var popup = window.open(null, '_blank', 'height=400,width=800,left=250,top=100,resizable=yes', true);			
			$('#searching-logo').addClass('twitter');
		}
		else if( e=='yahoo'){
			var popup = window.open(null, '_blank', 'height=500,width=700,left=250,top=100,resizable=yes', true);
			$('#searching-logo').addClass('yahoo');
		}
		else if ( e=='gmail'){
			var popup = window.open(null, '_blank', 'height=550,width=900,left=250,top=100,resizable=yes', true);
			$('#searching-logo').addClass('gmail');
		}
		else if(e=='live'){
			var popup = window.open(null, '_blank', 'height=500,width=900,left=250,top=100,resizable=yes', true);
			$('#searching-logo').addClass('winlive');
		}
		$.post("/find_friends.xml",param, 
			function(xml){
				if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
					//location.href = $(xml).find("url").text();
					if(e=='yahoo'){
						popup.location.href = $(xml).find("url").text();						
						yahooConnected0(popup,$(xml).find("url").text(),
							function(xml){
								if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1){
									location.href = $(xml).find("url").text();
									return false;
								}
								else if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0 && $(xml).find("message").length>0){
									alert($(xml).find("message").text());                                      
								}
								else{
									//alert("Please login to Yahoo.");                                      
								}
								$(".left-sidebar").show();
								$('body').addClass('wider').removeClass('loading');
								$('.waiting').hide();
								$('#searching-logo').removeClass('yahoo');
							},
							function(xml){
								$(".left-sidebar").show();
								$('body').addClass('wider').removeClass('loading');
								$('.waiting').hide();
								$('#searching-logo').removeClass('yahoo');
								//alert("Please login to Yahoo.");  
							})
					}
					else if(e=='gmail'){
						popup.location.href = $(xml).find("url").text();						
						gmailConnected0(popup,$(xml).find("url").text(),
							function(xml){
								if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1){
									location.href = $(xml).find("url").text();
									return false;
								}
								else if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0 && $(xml).find("message").length>0){
									alert($(xml).find("message").text());                                      
								}
								else{
									//alert("Please login to Gmail.");                                      
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

								//alert("Please login to Gmail.");  
							})
					}
					else if(e=='live'){
						popup.location.href = $(xml).find("url").text();						
						liveConnected0(popup,$(xml).find("url").text(),
							function(xml){
								if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1){
									location.href = $(xml).find("url").text();
									return false;
								}
								else if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0 && $(xml).find("message").length>0){
									alert($(xml).find("message").text());                                      
								}
								else{
									//alert("Please login to Windows Live.");                                      
								}
								$(".left-sidebar").show();
								$('body').addClass('wider').removeClass('loading');
								$('.waiting').hide();
								$('#searching-logo').removeClass('winlive');
							},
							function(xml){
								$(".left-sidebar").show();
								$('body').addClass('wider').removeClass('loading');
								$('.waiting').hide();
								$('#searching-logo').removeClass('winlive');
								//alert("Please login to Windows Live.");  
							})
					}
					else if (e == 'twitter'){
						popup.location.href = $(xml).find("url").text();						
						twitterConnected0(popup,$(xml).find("url").text(),
							function(xml){

								if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1){
									location.href = "/find_friends_follow_list";
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
					else if (e == 'facebook'){
					    FB.login(function(response2) {
					      if (response2.authResponse) {
						    //if (response.perms) {
							    location.href = '/find_friends_follow_list'
						    //} else {
						    //	$(".left-sidebar").show();
						    //	$('body').addClass('wider').removeClass('loading');
						    //	$('.waiting').hide();
						    //	$('#searching-logo').removeClass('facebook');
						    //}
					      } else {
						    $(".left-sidebar").show();
						    $('body').addClass('wider').removeClass('loading');
						    $('.waiting').hide();
						    $('#searching-logo').removeClass('facebook');
					      }
					    }, {scope:'email,user_friends'});

					    /*
						FB.getLoginStatus(function(response){
							if (response.authResponse) {
								location.href = '/find_friends_follow_list'							
							}
							else{
								FB.login(function(response2) {
								  if (response2.authResponse) {
									//if (response.perms) {
										location.href = '/find_friends_follow_list'
									//} else {
									//	$(".left-sidebar").show();
									//	$('body').addClass('wider').removeClass('loading');
									//	$('.waiting').hide();
									//	$('#searching-logo').removeClass('facebook');
									//}
								  } else {
									$(".left-sidebar").show();
									$('body').addClass('wider').removeClass('loading');
									$('.waiting').hide();
									$('#searching-logo').removeClass('facebook');
								  }
								}, {scope:'email,user_friends'});
							}
						});
					    */
					}
				}
				else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
					$(".left-sidebar").show();
					$('body').addClass('wider').removeClass('loading');
					$('.waiting').hide();
					if(e=='twitter'){
						$('#searching-logo').removeClass('twitter');
					}
					else if( e=='yahoo'){
						$('#searching-logo').removeClass('yahoo');
					}
					else if ( e=='gmail'){
						$('#searching-logo').removeClass('gmail');
					}
					else if(e=='live'){
						$('#searching-logo').removeClass('winlive');
					}
					alert($(xml).find("message").text());
				}  
		}, "xml");
        return false;
    });
});


var yahooConnected0 = function(modal,url,success, failure) {
	//var modal = window.open(url, '_blank', 'height=500,width=700,left=250,top=100,resizable=yes', true);
	var wait  = function() {
		setTimeout(function() {
			if (modal == null) {
				failure(); // When does this happen?
				return;
			}
			if (modal.closed) {
				$.post('/find_friends/yahoo/check.xml',function(xml) {
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

var gmailConnected0 = function(modal,url,success, failure) {
	//var modal = window.open(url, '_blank', 'height=500,width=700,left=250,top=100,resizable=yes', true);
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

var liveConnected0 = function(modal,url,success, failure) {
	//var modal = window.open(url, '_blank', 'height=500,width=900,left=250,top=100,resizable=yes', true);
	var wait  = function() {
		setTimeout(function() {
			if (modal == null) {
				failure(); // When does this happen?
				return;
			}
			if (modal.closed) {
				$.post('/find_friends/live/check.xml',function(xml) {
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

var twitterConnected0 = function(popup,url,success, failure) {
	//var modal = window.open(url, '_blank', 'height=400,width=800,left=250,top=100,resizable=yes', true);
	var wait  = function() {
		setTimeout(function() {
			if (popup == null) {
				failure(); // When does this happen?
				return;
			}
			if (popup.closed) {
				$.post('/apps/twitter/check.xml',function(xml) {
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
