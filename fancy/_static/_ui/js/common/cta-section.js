$(function(){
	var isChromium = window.chrome,
    winNav = window.navigator,
    vendorName = winNav.vendor,
    isOpera = winNav.userAgent.indexOf("OPR") > -1,
    isIEedge = winNav.userAgent.indexOf("Edge") > -1

	var $cta = $(".cta");
	
	if( !isChromium || vendorName !== "Google Inc." || isOpera || isIEedge) {
		$cta.find(".chrome").remove();
	}else{
		$cta.find(".bookmarklet").remove();
	}

	function nextEl(){
		var $remains = $cta.find("div[data-section]");
		var next = $remains[Math.floor(Math.random()*$remains.length)];
		return $(next);
	}

	function showNext($el){
		function next(){
			var $next = nextEl();
			if( $next[0] ){
				$cta.show();
				$next.fadeIn(200);
			}else{
				$cta.hide();
			}	
		}

		if($el){
			$el.fadeOut(200, function(){
				$el.remove();
				next();
			});	
		}else{
			next();
		}
		
	}

	showNext();
	
	$cta
		.find("a.close")
			.click(function(e){
				e.preventDefault();

				var $el = $(this).closest('div');
				showNext($el);
			})
		.end()
		.find(".newsletter")
			.find(".btn-subscribe")
				.click(function(e){
					var $this = $(this);
					var $email = $this.closest('.newsletter').find("input[name=email]");
					var email = $email.val();
					if( $email.is(":visible") && !email){
						alertify.alert("Please input email address");
						return;
					}
					$.post('/news-subscribe.json', {email:email})
					.then(function(data){
						$this.closest('.newsletter').find(".step1").hide().end().find(".step2").show();
					})
				})
			.end()
		.end()
		.find(".invite")
			.find(".btn-invite")
				.click(function(e){
					var $this = $(this);
					var $email = $this.closest('.invite').find("input[name=email]");
					var email = $email.val();
					if( !email){
						alertify.alert("Please input email address");
						return;
					}

					$.post('/invite_friend_with_email_list.json', {use_credit_email:true, emails:email})
					.then(function(data){
						alertify.alert("sent");
						$email.val('')
					})
				})
			.end()
		.end()
	
})