jQuery(function($){
    $('.popup.request_sale')
        .on('click', '.sell', function(event){

            var $this = $(this), ntid = $this.attr('ntid'), ntoid = $this.attr('ntoid'), login_require = $this.attr('require_login');

            if (login_require && login_require === 'true'){
                event.preventDefault();
                return require_login();
            }
        })
        .on('click', '.customer', function(event){
            event.preventDefault();
            var $this = $(this), ntid = $this.attr('ntid'), login_require = $this.attr('require_login');

            if (login_require && login_require === 'true') return require_login();

            $.ajax({
                type : 'post',
                url  : '/send_email_for_sale_request.json',
                data : {new_thing_id:ntid},
                dataType : 'json',
                success  : function(json){                  
                    alertify.alert(gettext("Thank you. Your request was successfully sent to Fancy."));
                    $.dialog('request_sale').close();
                },
                error : function(){
                    alertify.alert(gettext("Thank you. Your request was successfully sent to Fancy."));
                    $.dialog('request_sale').close();
                }
            });
        });

    var isSending = false;
    $('.popup.ask_seller')
        .on('keyup paste', 'textarea', function(event){
            var $this = $(this);
            if($this.val()){
                $this.closest('fieldset').find("._send").removeAttr('disabled');
            }else{
                $this.closest('fieldset').find("._send").attr('disabled','disabled');
            }
        })
        .on('click', '._send', function(event){
            if(isSending) return;
            
            var $this = $(this), tid = $this.attr('tid'), seller_id = $this.attr('seller_id'), brand_name = $this.attr('brand_name'), message = $this.closest('fieldset').find('textarea').val(), login_require = $this.attr('require_login');
            
            $this.attr('disabled','disabled');
            isSending = true;
        
            if (login_require && login_require === 'true'){
                event.preventDefault();
                return require_login();
            }
            
            if(!message){
                $this.attr('disabled','disabled');
                isSending = false;
                return;
            }
            if(message && message.length>2048){
                $this.removeAttr('disabled');
                
                isSending = false;
                alertify.alert("Sorry, message is too long. Please write less than 2048 characters.");
                return;
            }
            var params = {seller_id:seller_id, things:tid, message:message};


            $.post("/messages/send-message.json", params, function(res){
                $this.removeAttr('disabled');
                if(!res.status_code){
                    alertify.alert(res.message || "Sorry, we couldn't send your message right now. Please try again later.");
                    return;
                }else{
                    $this.closest('fieldset').find('textarea').val('');
                    alertify.alert("Your message has been sent to "+brand_name);
                    $.dialog('ask_seller').close();
                    return;
                }
            })
            .always(function(){
                $this.removeAttr('disabled');
                isSending = false;
            })
        });
});
