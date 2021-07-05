$(function(){
	$("._find_friends").click(function(e){
		e.preventDefault();
		var dlg = $.dialog("get-started");		
		dlg.$obj.find("ul.find_sns li a.current").click();
		dlg.open();
	})

	var $popup = $(".popup.get-started");
	// var friendTemplate = $popup.find('.step1 .connected > script').remove();

	$popup
		.find(".step2")
			.find("ul.find_sns li a").click(function(e){
				e.preventDefault();
				var type = $(this).attr('sns-type');
				var name = $(this).text();
				var connected = $(this).attr('sns-connected') == 'true';

				$(this).closest('.step')
					.find('.connect, .connected').hide().end()
					.find('.btn-area')
						.find('.btns-blue-embo:not(._continue)').attr('disabled','disabled').end()
					.end()
					.find('.connect.'+type).show()
						.find('i').removeAttr('class').addClass(type).end()
						.find('span').text(name).end()
						.find('button').attr('sns-type', type).end()
					.end()
					.find('.find_sns a').removeClass('current').end()
				.end().addClass('current');

				if(connected){
					$(this).closest('.step').find('.connect.'+type).hide().end().find('.connected.'+type).show();
				}
			}).end()
			.find('.connect button').click(function(e){
				var $btn = $(this);
		        if ($btn.attr('sns-type') == 'fb') {
		            var params = {scope:'email,user_friends'};
		            
		            FB.login(function(response2) {
		                if (response2.authResponse) {
		                	onFBLink('');
		                }
		            }, params);
	        } else if ($btn.attr('sns-type') == 'tw') {
		            var loc = location.protocol+"//"+location.host;
		            var param = {'location':loc};
		            var popup = window.open(null, '_blank', 'height=400,width=800,left=250,top=100,resizable=yes', true);			
		            $.post('/find_friends_twitter.xml', param, function(xml) {
		                var $xml = $(xml);
		                if ($xml.find('status_code').length>0 && $xml.find('status_code').text()==1) {
		                    popup.location.href = $xml.find("url").text();						
		                    twitterConnected0(popup,$xml.find("url").text(), function(xml){
		                        if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1){
		                            $.get('/activity_get_started.json', null,
		                                    function(html) {
		                                        $('.connect.tw').hide();
		                                        $popup.find(".step1 ul.find_sns li a.tw").attr('sns-connected','true');
		                                        $('.connected.tw').show().find('ol').html( $(html).find(".connected.tw ol").html() );
		                                    }, 'html');
		                        }
		                    }, function(xml){})
		                } else if ($xml.find("status_code").length>0 && $xml.find("status_code").text()==0) {
		                    alertify.alert($(xml).find("message").text());
		                }  
		            }, 'xml');
		        } else if ($btn.attr('sns-type') == 'gm') {
		            var loc = location.protocol+'//'+location.host;
		            var param = {'location':loc};
		            var popup = window.open(null, '_blank', 'height=550,width=900,left=250,top=100,resizable=yes', true);
		            $.post('/find_friends_gmail.xml', param, function(xml){
		                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
		                    popup.location.href = $(xml).find("url").text();
		                    gmailConnected0(popup,$(xml).find("url").text(),
		                        function(xml){
		                            if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1){
		                                $.get('/activity_get_started.json', null,
		                                    function(html) {
		                                        $('.connect.gm').hide();
		                                        $popup.find(".step1 ul.find_sns li a.gm").attr('sns-connected','true');
		                                        $('.connected.gm').show().find('ol').html( $(html).find(".connected.gm ol").html() );
		                                    }, 'html');
		                            } else if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0 && $(xml).find("message").length>0){
		                                alertify.alert($(xml).find("message").text());
		                            }
		                        }, function(xml){})
		                } else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
		                    alertify.alert($(xml).find("message").text());
		                }
		            }, 'xml');
		        }
			}).end()
			.find('a._back').click(function(e){
				e.preventDefault();
				//$popup.find(".step1 a.following-user-link.follow").click();
				$(this).closest('.popup').find('.step').hide().end().find('.step1').show();
			}).end()
			.find('.btn-area button._continue').click(function(){
                var next_url = $('.popup.get-started').attr('next_url');
                if(next_url) document.location.href = next_url;
				else if($popup.attr('home_page')) document.location.href="/";
				else document.location.reload();
			}).end()
			.on('click','a.following-user-link', function(e){
				$popup.find('.step2').find("._continue").removeAttr('disabled');
			})
		.end()
		.find(".step1")
			.find(".btn-area button.btn-continue").click(function(){
				var $this = $(this);
				var follow_seller_ids = $popup.find(".step1 a.following-user-link.following").map( function(){ return $(this).attr('sid')} );
				follow_seller_ids = Array.prototype.slice.call(follow_seller_ids).join(",");
				var unfollow_seller_ids = $popup.find(".step1 a.following-user-link:not(.following)").map( function(){ return $(this).attr('sid')} );
				unfollow_seller_ids = Array.prototype.slice.call(unfollow_seller_ids).join(",");
				var follow_user_ids = $popup.find(".step1 a.following-user-link.following").map( function(){ return $(this).attr('uid')} );
				follow_user_ids = Array.prototype.slice.call(follow_user_ids).join(",");
				var unfollow_user_ids = $popup.find(".step1 a.following-user-link:not(.following)").map( function(){ return $(this).attr('uid')} );
				unfollow_user_ids = Array.prototype.slice.call(unfollow_user_ids).join(",");
				if(follow_seller_ids){
					$.ajax({
	                    type : 'post',
	                    url  : '/add_follows.xml',
	                    data : {seller_ids:follow_seller_ids},
	                    dataType : 'xml',
	                    success : function(xml){
	                    },
	                    error: function() {
	                    },
	                    complete : function(){
	                    }
	                });
				}
				if(unfollow_seller_ids){
					$.ajax({
	                    type : 'post',
	                    url  : '/delete_follows.xml',
	                    data : {seller_ids:unfollow_seller_ids},
	                    dataType : 'xml',
	                    success : function(xml){
	                    },
	                    error: function() {
	                    },
	                    complete : function(){
	                    }
	                });
				}
				if(follow_user_ids){
					$.ajax({
	                    type : 'post',
	                    url  : '/add_follows.xml',
	                    data : {user_ids:follow_user_ids},
	                    dataType : 'xml',
	                    success : function(xml){
	                    },
	                    error: function() {
	                    },
	                    complete : function(){
	                    }
	                });
				}
				if(unfollow_user_ids){
					$.ajax({
	                    type : 'post',
	                    url  : '/delete_follows.xml',
	                    data : {user_ids:unfollow_user_ids},
	                    dataType : 'xml',
	                    success : function(xml){
	                    },
	                    error: function() {
	                    },
	                    complete : function(){
	                    }
	                });
				}
				$this.closest('.popup').find('.step').hide().end().find('.step2').show();
				
			}).end()
			.find(".btn-area button.btn-unfollow").click(function(){
				$popup.find(".step1 a.following-user-link.following").click();
			}).end()
			.find(".btn-area button.btn-followall").click(function(){
				$popup.find(".step1 a.following-user-link.follow:not(.following)").click();
			}).end()
			.on('click','a.following-user-link', function(e){
				var followingCnt = $popup.find('.step1').find("a.following-user-link.following").length;
				if( $(this).hasClass('following') ) followingCnt--;
				else followingCnt++

				if(followingCnt){
					$popup.find(".step1 .btn-area button.btn-unfollow").show().end().find(".step1 .btn-area button.btn-followall").hide();
					if(followingCnt == 1){
						var isStore = $popup.find('.step1').find("a.following-user-link.following").closest('li').hasClass('store');
						if( !$(this).hasClass('following') ) isStore = $(this).closest('li').hasClass('store');
						
						$popup.find(".step1 button.btn-continue").text("Follow "+followingCnt+" "+(isStore?'store':'person'));
					}else{
						$popup.find(".step1 button.btn-continue").text("Follow "+followingCnt+" people and stores");
					}
				}else{
					$popup.find(".step1 .btn-area button.btn-unfollow").hide().end().find(".step1 .btn-area button.btn-followall").show();
					$popup.find(".step1 button.btn-continue").text("Continue");
				}
				
			})

	$popup.find(".step1 a.following-user-link").click();


	function onFBLink(perms) {
	    param = {}
	    param['perms']=perms;

	    $.ajax({
				type : 'post',
				url  : '/link_fb_user.xml',
	            headers : {'X-CSRFToken':$.cookie.get('csrftoken')},
				data : param,
				dataType : 'xml',
				success  : function(xml){	
	                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {	                    
	                    $.get('/activity_get_started.json', null,
                            function(html) {
                                $('.connect.fb').hide();
                                $popup.find(".step1 ul.find_sns li a.fb").attr('sns-connected','true');
                                $('.connected.fb').show().find('ol').html( $(html).find(".connected.fb ol").html() );
                            }, 'html');
			        }
			        else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
				        alertify.alert($(xml).find("message").text());
			        }
			        else {
			        }
				},
				complete : function(){
				}
		});

		return false;
	}

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
                            alertify.alert($(xml).find("message").text());
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
});
