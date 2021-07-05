jQuery(function($){
	$('form.myform').submit(function(){
		var $form=$(this), $lang=$('#lang'), elems=this.elements, params={}, change_lang=false, e, n, v;

		function error(msg,fld){
			alert(msg);
			if(fld) fld.focus();
			return false;
		};

		for(var i=0,c=elems.length; i < c; i++){
			e = elems[i];
			n = (e.getAttribute('name') || e.getAttribute('id') || '').replace(/^setting-/, '');
			if(!n) continue;
			v = (e.getAttribute('type')=='checkbox')?(e.checked?'true':'false'):$.trim(e.value);
			if(v) params[n] = v;
		}

		// check passwords
		if(params.password && params.password != params['confirm-password']) {
			return error(lang['passwords-must-match'],elems.password);
		}

		// disable submit button
		$form.find(':submit').addClass('disabled').prop('disabled', true);

		// save language setting
		if($lang.val() != $lang.data('langcode')){
			change_lang = true;
			$.ajax({
				type : 'post',
				url  : '/update_language.json',
				data : {'lang' : $lang.val()},
				dataType : 'json',
				success  : function(json){ }
			});
		}

		// save
		$.ajax({
			type : 'post',
			url  : '/settings.xml',
			data : params,
			dataType : 'xml',
			success  : function(xml){
				var $xml=$(xml),$st=$xml.find('status_code'),$msg=$xml.find('message');
				if($st.text() === '1'){
					alert(lang['settings-saved']);
					if(change_lang) location.reload();
				}else if($msg.length){
					alert($msg.text());
				}
			},
			complete : function(){
				$form.find(':submit').removeClass('disabled').prop('disabled', false);
			}
		});

		return false;
	});
	$('a.btn-pw').click(function(){
		$(this).hide();
		$('#block-pwd').show();
		return false;
	});

	$(document).delegate('a#close-account','click',function(event){
		if (window.confirm('Are you sure you want to close your account?')){
			$.ajax({
				type : 'post',
				url  : '/close_account.json',
				headers  : {'X-CSRFToken':$.cookie.get('csrftoken')},
				data : {}, // parameters
				dataType : 'json',
				success  : function(response) {
					if (response.status_code != undefined && response.status_code == 1) {
						location.href='/';
					}
					else if (response.status_code != undefined && response.status_code == 0) {
						if(response.message != undefined)
							alert(response.message);
					}
				},
				complete : function() {
				}
			});
			return false;
		}
		return false;
	});


    $(document).delegate('a#resend_confirmation','click',function(event){
        $.ajax({
            type : 'post',
            url : '/send_email_confirmation.json',
            headers : {'X-CSRFToken':$.cookie.get('csrftoken')},
            data : {'resend' : true},
            dataType : 'json',
            success : function(response){
                if (response.status_code != undefined && response.status_code == 1) {
					alert("confirmation email has been sent to " + response.email)
                }
                else if (response.status_code != undefined && response.status_code == 0) {
                    if(response.message != undefined)
                        alert(response.message);
                }
            },
            complete : function() {
            }
        });
        return false;
    });


    $(document).delegate('a#cancel_confirmation','click',function(event){
        $.ajax({
            type : 'post',
            url : '/cancel_email_confirmation.json',
            headers : {'X-CSRFToken':$.cookie.get('csrftoken')},
            data : {}, // parameters
            dataType : 'json',
            success : function(response){
                if (response.status_code != undefined && response.status_code == 1) {
                    $('#user_email').next().remove();
                }
                else if (response.status_code != undefined && response.status_code == 0) {
                    if(response.message != undefined)
                        alert(response.message);
                }
            },
            complete : function(){
            }
        });
        return false;
    });

	$(document).delegate("#bio",'keyup paste', function(event){
		var aboutArea = $(this);
		var remainCnt = 180-aboutArea.val().length;
		if(remainCnt<0){
			aboutArea.val( aboutArea.val().substring(0,180) );
			remainCnt = 0;
		}
		var remainCntArea = $("form.myform").find(".byte");
		remainCntArea.text(remainCnt);
	});

	$("#bio").trigger("keyup");

    $("button#save_profile_image").on('click',function(event){
		event.preventDefault();
		$('#uploadavatar').trigger("click");
	})

	// add upload button disabled 2012-12-06
	$(document).delegate('#uploadavatar','change propertychange', function(event){
		var $this = $(this), $file = $('#uploadavatar'), file = $file.attr('value'), $up = $file.next('.uploading');

		if(!$file) return false;

		//$up.show().prev('input:file').hide();

		$.ajaxFileUpload( { 
			url:'/settings_image.xml',
			secureuri:false,
			fileElementId:'uploadavatar',
			dataType: 'xml',
			success: function (xml, status) 
			{
				var $xml = $(xml), $st = $xml.find('status_code');

				//$up.hide().prev('input:file').show();
		
				if ($st.length>0 && $st.text()==1) {
					location.reload(true);
				} else if ($st.length>0 && $st.text()==0) {
					alert($xml.find("message").text());					
					return false;
				} else {
					alert("Unable to upload file..");
					return false;
				}
			},
			error: function (data, status, e)
			{
				//$up.hide().prev('input:file').show();
				alert(e);
				return false;
			}
		});

		$("button#save_profile_image").find("#uploadavatar").remove().end().prepend('<input id="uploadavatar" type="file" name="upload-file" style="display:none"/>');
 		$file.attr('value','');

		return false;
	});

});
