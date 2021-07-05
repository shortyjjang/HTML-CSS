$(function() {
    var ALERT = window.alertify?window.alertify.alert:window.alert;

    $.cookie.set('signup-forced', 'true');

    $('.guest-checkout input.text[name="email"]').keydown(function(e) {
        if (e.keyCode == 13)
            $(".guest-checkout .btn-signup").click();
    }).focus();
    $(".guest-checkout .btn-signup").click(function() {
        var $this = $(this), $email = $('.guest-checkout input.text[name="email"]'), email = $.trim($email.val());
        if ($this.hasClass("loading")) return;
        if (!emailRegEx.test(email)) { // see common/util.js to change emailRegEx
            $(document.body).focus();
            ALERT("Please enter a valid email address", function() { $email.focus(); });
            return;
        }
        $this.addClass("loading");
        $.post('/email_signup.json', { 'email': email }, function(resp) {
            if (resp.status_code == 1) {
                try {track_event('Signup Complete', {'channel': 'fancy', 'via': window.is_mobile ? 'mobile web' : 'web', 'guest checkout': true}); } catch(e) {}
                $.cookie.set('signup_complete_required', true);
                $.cookie.set('signup_complete_for_sns', 'fancy');
                location.reload();
            } else {
                if (resp.error == "invalid-captcha") {
                    alert("Sorry, please follow the sign-up process to continue with checkout.");
                    location.href = '/register?email=' + encodeURIComponent(email) + "&next="+encodeURIComponent(location.href);
                    return;
                }
                if (resp.error == 'email_duplicate'){
                    if( $(".popup.signin").length ){
                        $.dialog('signin').open();
                        var $network = $.dialog('signin').$obj.find('.others a:eq(0)');
                        $.dialog('signin').$obj
                            .find("h2").html('<b>Welcome back!</b> <small>Login to your Fancy account to continue the checkout process.<small>').end()
                            .find("input[name=username]").val(email).end()
                            .find(".others").empty().append($network).end()
                            .find("input[name=user_password]").focus().end()
                            

                        $this.removeClass("loading");
                        return;
                    }else{
                        location.href = "/login?next=/checkout";
                        return;
                    }
                }
                ALERT(resp.message || "Unknown error. Please try again later");
                $this.removeClass("loading");
            }
        });
    });

    window.SimpleRegisterEnabled = true;
    window.simpleRegister = function(params) {
        var sns_type = params["sns-type"];
        var username = params["username"];
        var $email = $('.guest-checkout input.text[name="email"]');
        var email = $.trim($email.val());
        if(email.length>0) {
            params["email"] = email;
        } else {
            email = params["email"];
        }
        params['fast_signup'] = true;
        if(sns_type=='twitter') {
            // Server can retrieve email address from facebook,google account
            // But cannot retrieve email address from twitter account.
            if(!emailRegEx.test(email)) { // see common/util.js to change emailRegEx
                $(document.body).focus();
                ALERT("Please enter a valid email address", function() { $email.focus(); });
                return;
            }
        }

        if(sns_type=='facebook') {
            $.post("/facebook_signup.xml",params, function(xml) {
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    // success
                    try {track_event('Signup Complete', {'channel': 'facebook', 'via': 'web', 'guest checkout': true}); } catch(e) {}
                    $.cookie.set('signup_complete_required', true);
                    $.cookie.set('signup_complete_for_sns', 'facebook');
                    location.reload();
                } else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                    var msg = $(xml).find("message").text();
                    ALERT(msg);
                }
            }, "xml")
            .fail(function(xhr) {
                ALERT("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            });
        } else if(sns_type=='twitter') {
            $.post("/twitter_signup.xml",params, function(xml){
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    // success
                    try {track_event('Signup Complete', {'channel': 'twitter', 'via': 'web', 'guest checkout': true}); } catch(e) {}
                    $.cookie.set('signup_complete_required', true);
                    $.cookie.set('signup_complete_for_sns', 'twitter');
                    location.reload();
                } else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                    var msg = $(xml).find("message").text();
                    ALERT(msg);
                }
            }, "xml")
            .fail(function(xhr) {
                ALERT("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            });
        } else if(sns_type=='google') {
            var url = "/social/signup_google.json";

            $.post(url, params, function(response) {
                if (response.status_code != undefined && response.status_code == 1) {
                    // success
                    try {track_event('Signup Complete', {'channel': 'google', 'via': 'web', 'guest checkout': true}); } catch(e) {}
                    $.cookie.set('signup_complete_required', true);
                    $.cookie.set('signup_complete_for_sns', 'google');
                    location.reload();
                } else if (response.status_code != undefined && response.status_code == 0) {
                    var msg = response.message;
                    var error = response.error;
                    ALERT(msg);
                }
            }, 'json')
            .fail(function(xhr) {
                ALERT("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            });
        }
    }
});

jQuery(function($) {
	// currency approximately
	var str_currency = $('.checkout-submit .currency_price').eq(0).text();
	var dlg_currency = $.dialog('show_currency');
	var $currency_list = $('.popup.show_currency .currency-list');

	var $currency = $('.checkout-submit .currency_price');
		
	function refresh_currency(){
		$currency.text(str_currency);

		// get currency
		$currency.each(function(i,v){
			var $this = $(v);
			if($this.attr('price') && parseFloat($this.attr('price'))>0){	
				if ($this.attr('currency')) {
	                show_currency(v, $this.attr('currency'));
				} else {
					setTimeout(function(){
						$.ajax({
							type : 'GET',
							url  : '/get_my_currency.json',
							dataType : 'json',
							success  : function(json){
								if(json && json.currency_code) show_currency(v, json.currency_code);
							}
						});
					},100)
				}
			}else{
				$this.closest(".currency").hide();
			}
		})	
	};

	function text_currency(el, money, code, symbol, natural_name) {

		if(typeof(money) == 'number') {
			money = money.toFixed(2);
		}
		money = money.replace(/[ \.]00$/,'');

		var str = str_currency.replace('...', symbol+" "+money+' <small>'+code+'</small>');
		$(el).html(str);
        $(el).attr('currency', code);
        $(el).closest(".currency").find(".country > a").html(natural_name);
	};		

	function show_currency(el, code, set_code){
		var p = $(el).attr('price');

		if(window.numberType === 2) p = p.replace(/,/g, '.').replace(/ /g, '');
		p = p.replace(/,/g, '');

		if(set_code) {
			$.ajax({
				type : 'POST',
				url  : '/set_my_currency.json',
				data : {currency_code:code}
			});
		}

		if(code == 'USD') {			
			$(el).attr('currency', code);
		    return $(el).closest(".currency").find(".change_currency").show().end().find(".country, .currency_price").hide();
		}else{			
			$(el).closest(".currency").find(".country, .currency_price").show().end().find(".change_currency").hide();
		}

		text_currency(el, '...', code, '');
		
		$.ajax({
			type : 'GET',
			url  : '/convert_currency.json?amount='+p+'&currency_code='+code,
			dataType : 'json',
			success  : function(json){
				if(!json || typeof(json.amount)=='undefined') return;
				var price = json.amount.toFixed(2) + '', regex = /(\d)(\d{3})([,\.]|$)/;
				while(regex.test(price)) price = price.replace(regex, '$1,$2$3');

				if(window.numberType === 2) price = price.replace(/,/g, ' ').replace(/\./g, ',');

				text_currency(el, price, json.currency.code, json.currency.symbol, json.currency.natural_name);
			}
		});
	};

	$currency.closest(".wrapper").delegate('a.change_currency, a.code', 'click', function(event){
		var $this = $(this);
		event.preventDefault();
        if(!$currency_list.hasClass('loaded')) return;

        var old_dlg_class= $('#popup_container').attr('class');
        function close_currency() {
            if (old_dlg_class) $.dialog(old_dlg_class).open();
            else dlg_currency.close();
        }

        var my_currency = $currency.filter(":visible").eq(0).attr('currency');
        if (my_currency) {
            var my_currency_selector = 'li.currency[code="'+my_currency+'"]'
            $currency_list.find(my_currency_selector).find('a').addClass('current');
            var $ul_major = $currency_list.find('.right[code="all"] ul.major');

            var $my_currency_item = $ul_major.find(my_currency_selector);
            if ($my_currency_item.length == 0) {
                var $ul_all = $currency_list.find('.right[code="all"] ul').not('.major');
                $my_currency_item = $ul_all.find(my_currency_selector).clone();
            }
            $ul_major.prepend($my_currency_item)
        }
        dlg_currency.open().$obj
            .find('.right-outer .right[code="all"]').show().end()
            .find('.right-outer .right').not('[code="all"]').hide().end().end()
            .off('click', 'button.cancel')
            .on('click', 'button.cancel', function() {
                close_currency();
            })
            .off('click', 'button.save')
            .on('click', 'button.save', function(event) {
                event.preventDefault();
                var code = $currency_list.find('.right li a.current').parent().attr('code');
                show_currency( $this.closest('.wrapper').find('.currency').find('.currency_price'), code, true);
                close_currency();
            });
	});

    refresh_currency();
});
