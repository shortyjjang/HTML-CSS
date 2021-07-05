$(function(){

        var dlgSupport = $.dialog('support');
	$("#choose_different_order").click(function(e){
		e.preventDefault();
                dlgSupport.open();
		isLoading = false;
		loadOrderList(1);
		return false;
	});

	$("#popup_container .popup .btn-next").click(function(){
		loadOrderList($(this).data('next-page'));
	});

	var isLoading = false;

	function loadOrderList(page){
		if(isLoading) return false;
		isLoading = true;
		$("#popup_container .popup div.order_list").empty();
		$(".popup.support").addClass('loading');
                page = page || 1;
		$.ajax({
			type : 'GET',
			url  : '/about/orderlist.json',
			data : {page:page},
			dataType : 'json',
			success  : function(json){
				try {
					$("#popup_container .popup div.order_list").append(json.html);
					if($("#chosen_order").val()) $('.popup.orders dl.order-list[data-orderid="'+$("#chosen_order").val()+'"]').addClass('selected');
				} catch(e) {
				}
				isLoading = false;
				$(".popup.support").removeClass('loading');
				if (json.has_more) {
					$('.popup.support').find('.btn-next').data('next-page', page+1).show();
				} else {
					$('.popup.support').find('.btn-next').hide();
				}
			},
			failed : function(){
				isLoading = false;
				$(".popup.support").removeClass('loading');
				page ++;
			}
		});
	}

	$("#popup_container .popup.orders .btn-save").on('click',function(){
		var $dl = $(this).closest('.popup').find('dl.selected');
		$("#chosen_order").val($dl.data('orderid'));
		dlgSupport.close();
	});
	$("#popup_container .popup.orders div.order_list").on('click', 'dl.order-list', function(){
		$(this).closest('.popup').find('dl').removeClass('selected').end().end().addClass('selected');
	});

	$("._btn-send-email").click(function(){
		var frm = $(this).parents(".frm"), $btn = $(this);
		var params = {};
		var elems = frm.find("input,select,textarea");
		for(var i=0; i<elems.length; i++){
			var el = elems[i];
			if( el.name=='orderitem' ) continue;
			if( el.required && !el.value ){
				alertify.alert("Please input "+ $(el).attr('label'));
				el.focus();
				return;
			}else{
				params[el.name] = el.value;
			}
		}
                $btn.prop('disabled', true);

		$.ajax({
			type : 'POST',
			url  : '/about/contact.json',
			data : params,
			dataType : 'json',
			success : function(json){
				if (json.status_code == 1) {
                                    alert("Thank you!");
                                    $(frm)
                                            .find('input:text,textarea').val('').end()
                                            .find('select').prop('selectedIndex', 0).end()
                                            .find(".choosed_order_list").empty();
                                } else {
                                    alert(json.message || "Please try again later, or email us at cs@fancy.com");
                                }
			},
			complete : function(){
                            $btn.prop('disabled', false);
			}
		});

	});

	$('button.register').click(function(event){		
	    var app_name = $('#app_name').val().trim();
	    var app_website = $('#app_website').val().trim();
	    var callback_url = $('#callback_url').val().trim();
	    var description = $('#description').val().trim();
	    var selectedRow = $(this);	

	    var param = {};
	    param['app_name']=app_name;
	    param['app_website']=app_website;
	    param['callback_url']=callback_url;
	    param['description']=description;
	    
	    $.post("/register_application.xml",param, 
	      function(xml){
		    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
		      alert( gettext('Thanks! We will contact you when your API application has been approved.'));
		      $('#app_name').val('');
		      $('#app_website').val('');
		      $('#callback_url').val('');
		      $('#description').val('');
		    }
		    else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
		      alert($(xml).find("message").text());      
		    }
	    }, "xml");
	    
	    return false;
	  });

	$(".popup.merchant-signin .sign input[name=password]").keypress(function(e){
		if(e.keyCode==13){
			$("button._signin").trigger("click");
		}
	})
	$("button._signin").click(function(e){
		var $email = $(".popup.merchant-signin .sign input[name=email]");
		var $password = $(".popup.merchant-signin .sign input[name=password]");
		$.post('/login.json', {'username':$.trim($email.val()), 'password':$password.val(), 'callback':''},
			function(response){
				if (response.status_code != undefined && response.status_code == 1) {
                    if (document.location.pathname == "/about/merchants")
                        document.location.href = '/merchant/dashboard';
                    else
    					document.location.reload();
				} else if (response.status_code != undefined && response.status_code == 0) {
					alert(response.message);
					//$(".popup.merchant-signin .sign > h2").html(response.message).show();
				}				
			},
			'json'
		).fail(function() {
	    	alert( "Error occured. please try again." );
		})
	})
	$("button._resetpw").click(function(e){
		var $email = $(".popup.merchant-signin .pw input[name=email]");
                if(!$email.val()){
			alert("Please enter your email address");
			$email.focus();
			return;
		}
		var param = {email:$email.val(), skip_captcha:true};
		$.post('/reset_password.xml', param,
			function(xml){
               if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    alert('We will send a password reset link if this email is associated with an account.');
                    $email.closest('.popup').removeClass('merchant-pw');
               }
               else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
				   var msg = $(xml).find("message").text();
				   alert(msg);
               }  
			},
			'xml'
		).fail(function() {
	    	alert( "Error occured. please try again." );
		})
	})

	$('#merchant .full-spectrum .slide .step').on('click', 'a', function(event){
		event.preventDefault();

		var slideNum = this.href.match(/#slide(\d+)/);

		$(this).closest('.slide').trigger('set.slide', slideNum[1]);
	});

	$("input[name=merchant_email]").keypress(function(e){
		if(e.keyCode == 13){
			$(this).next().click();
		}
	});

	$(" a._startfreetrial").click(function(e){
		e.preventDefault();
		var $this = $(this);
		if( $this.prev().is("input[type=text]") ){
			var email = $this.prev().val();
			$this.attr("href", $this.attr("href")+"?email="+encodeURIComponent(email));
		}
		document.location.href = $this.attr("href");
	})

	$("a._deactived").click(function(e) {
		e.preventDefault();
                alertify.alert("Your merchant account is under review or inactive.<br/>Please contact us at hello@fancy.com if you have any questions.");
	})

    var $merchant_signup = $(".merchant-signup");
    $merchant_signup.on("click", ".btn-apply", function() {
        var $this = $(this), $fieldset = $merchant_signup.find("fieldset"), payload = {}
        if ($this.hasClass('loading')) return;
        $fieldset.find("input:text, textarea, select").each(function() {
            payload[$(this).attr('name')] = $.trim($(this).val());
        });

        if (!payload.name) { alertify.alert("Please enter your name."); return; }
        if (!payload.email) { alertify.alert("Please enter your email."); return; }
        if (!payload.shop_name) { alertify.alert("Please enter your shop's name."); return; }
        if (!payload.shop_url) { alertify.alert("Please enter your shop's website."); return; }
        if (!payload.platform) { alertify.alert("Please choose your current e-commerce platform."); return; }
        if (!payload.reason) { alertify.alert("Please complete the form."); return; }

        $this.addClass('loading');
        function submit(token) {
            var $file = $fieldset.find('input:file'), files = $file.prop('files'), options;
            if (token) payload['recaptcha_token'] = token;
            if (files && files.length && window.FormData) {
                var data = new FormData();
                for (k in payload) data.append(k, payload[k]);
                data.append('file', files[0]);
                options = { url: '/merchant-signup-apply.json', data: data, type: 'POST', dataType: 'json',
                    contentType: false, processData: false };
            } else {
                options = { url: '/merchant-signup-apply.json', data: payload, type: 'POST', dataType: 'json' };
            }

            $.ajax(options)
                .done(function(resp) {
                    if (resp.status_code == 0) {
                        alertify.alert(resp.message || "Error! Please try again later.");
                    } else {
                        alertify.alert("Thank you! We will get back to you soon.");
                        $.dialog("merchant-signup").close();
                        $fieldset.find("input, textarea, select").val(null).find('span.filename').text('');
                    }
                    $this.removeClass('loading');
                }).fail(function() {
                    alertify.alert("Something went wrong! Please try again, or email us at cs@fancy.com");
                    $this.removeClass('loading');
                })
        }
        if (window.execute_recaptcha) {
            window.execute_recaptcha(function(success, token) {
                if (success) {
                    if (window.clear_recaptcha) clear_recaptcha();
                    submit(token);
                }
                else {
                    alert('Please complete RECAPTCHA to continue')
                    $this.removeClass('loading');
                }
            });
        } else {
            submit();
        }
    
    }).on('change', 'input:file', function() {
        var $this = $(this), $fn = $this.closest('p').find('span.filename'), fn = $this.val();
        fn = fn.replace(/^.*?([^\\\/]*)$/, '$1')
        $fn.text(fn);
    });

    
});
