$(document).ready(function(){

	$(document).delegate('.remove_gift_card', 'click', function(){
		var card_id = $(this).attr('cid');
            
        var param={};
        param['card_id']=card_id;
        var selectedRow = $(this);
        $.post("/delete-gift-card.json",param, 
            function(response){
				if (response.status_code != undefined && response.status_code == 1) {
					location.reload(true);
				}
				else if (response.status_code != undefined && response.status_code == 0) {
					if(response.message != undefined){
						alertify.alert(response.message);
					}
				}
			}, "json");
        return false;
	});

	$(document).delegate('#gift-value','change',function(){
		$('.shop-v3 .giftcard .select-card .amount').html('<small>$</small>'+$(this).val());
	});

    $(document).delegate('.create-gift-card', 'click', function(){
        var login_require = $(this).attr('require_login'); 
        if (typeof(login_require) != undefined && login_require != null && login_require=='true'){ 
            require_login();
            return false;
        }
		var sender = $('input#sender-name').val();
        var recipient_name = $('input#recipient-name').val();
        var recipient_email = $('input#recipient-email').val();
        var recipient_email_re = $('input#recipient-email-re').val();
        var recipient_username = $('input#recipient-username').val();
        var gift_value = $('select#gift-value').val();
        var message = $('textarea#message').val();
        var card_image_num = $("input#card_image_num").val();
          
        /*  
        if (sender.trim().length == 0){
            alertify.alert('Please enter sender name');
            return false;
        }*/

        if (recipient_name.trim().length == 0){
            alertify.alert('Please enter recipient name');
            $('input#recipient-name').focus();
            return false;
        }

        // see common/util.js to change emailRegEx		    
        if(recipient_email.search(emailRegEx) == -1 && !recipient_username){
			alertify.alert('A valid email address is required');
            $('input#recipient-email').focus();
            return false;
        }
        if($('input#recipient-email-re')[0]){
            if(recipient_email!=recipient_email_re){
                alertify.alert('Please check the recipient\'s email address and try again.');
                $('input#recipient-email-re').focus();
                return false;
            }
        }
        if (message.trim().length == 0){
            alertify.alert('Please enter personal message');
            $('textarea#message').focus();
            return false;
        }

        var param = {};
        if(sender) param['sender_name']=sender;
        param['recipient_name']=recipient_name;
        param['recipient_email']=recipient_email;
        param['recipient_username']=recipient_username;
        param['amount']=gift_value;
        param['message']=message;
        if(card_image_num) param['card_image_num']=card_image_num;
        param['v3'] = true;
            
        var selectedRow = $(this);
        $.post("/create-gift-card.json",param, 
            function(response){
				if (response.status_code != undefined && response.status_code == 1) {
                    location.href = '/gift-card/checkout'
				} else if (response.status_code != undefined && response.status_code == 0) {
					if(response.message != undefined){
						alertify.alert(response.message);
					}
				}
			}, "json");
        return false;
	});

    function recipient_selected(user){
        $(".giftcard .search-fancy-users-for-giftcard").val(user.username);
        $(".giftcard input[name=recipient_name]").val(user.fullname);
        $(".giftcard input[name=recipient_username]").val(user.username);
    }

    // auto complete
    search_fancy_deferred = function(query) {
        return $.ajax({
            type : 'get',
            url  : '/search-users.json',
            data : {'term': query},
            dataType : 'json'
        });
    }

    autocomplete = function(options) {
        var defaults = {
            input : '.giftcard .search-fancy-users-for-giftcard',
            list  : '.giftcard ul.user-list',
            template : 'script[type="fancy/giftcard_user_list_item"]',
            onmousedown : recipient_selected,
            timeout : 100,
            enable_space : false,
            request : function ($list, $input, $template, query) {
                $input.addClass('loading');
                $.when(search_fancy_deferred(query)).done(function(json) {
                    $input.removeClass('loading');
                    if (query != $.trim($input.val())) return $list.hide();
                    if (json && json.length) {
                        for(var i=0,c=json.length; i < c; i++) {
                            var user = json[i];
                            var context = { NAME : user.name,
                                    USERNAME : user.username,
                                    PHOTO : user.profile_image_url,
                                    SMALL_PHOTO : user.image_url,
                                    URL : user.html_url,
                                    TYPE2 : user.type,
                                    UID : user.uid
                                  }
                            var $item = $template.template(context);
                            $item.appendTo($list);
                        }
                        $list.show().find('>li:first').addClass('on');
                    } else {
                       $list.hide();
                    }
                });
            }
        };
        options = $.extend({}, defaults, options);

        var $inp  = $(options.input),
        $list = $(options.list),
        $item = $list.find('>li').remove(),
        timer, prev_val;
    
        $inp
            .keydown(function(event){

                var $inp = $(this).data('uid',0);

                switch(event.keyCode) {
                    case 9: // tab
                    case 13: // enter
                    case 32: // space 
                        if (options.enable_space) {
                            break;
                        }
                    case 186: // ';'
                    case 188: // ','
                        if ($inp.val().indexOf('@') == -1) {
                            if (event.keyCode == 9 && $list.is(':hidden')) return true;
                            $list.trigger('key.enter');
                        }
                        return false;
                    case 38: $list.trigger('key.up'); return false;
                    case 40: $list.trigger('key.down'); return false;
                }
        
                clearTimeout(timer);
        
                setTimeout(function(){
                    var val = $.trim($inp.val());
                            
                    if (!val || val == prev_val) return;
                            
                    prev_val = val;
                            
                    if (val.indexOf('@') >= 0) return $list.hide();
                            
                    var $template = $(options.template);
                    function request() {
                        $list.hide().empty();                    
                        options.request($list, $inp, $template, val);
                    }
                    timer = setTimeout(request, options.timeout);
                            
                }, 0);
        })
        .end();
    
        $list
            .on('key.up key.down', function(event){
                if ($list.is(':hidden')) return false;
        
                var $items = $list.children('li'), up = (event.namespace=='up'), idx = Math.min(Math.max($items.filter('.on').index()+(up?-1:1),0), $items.length-1);
                var $on = $items.removeClass('on').eq(idx).addClass('on'), bottom;
                
                if (up) {
                    if (this.scrollTop > $on[0].offsetTop) this.scrollTop = $on[0].offsetTop;
                } else {
                    bottom = $on[0].offsetTop - this.offsetHeight + $on[0].offsetHeight;
                    if (this.scrollTop < bottom) this.scrollTop = bottom;
                }
            })
            .on('key.enter', function(){
                $list.children('li.on').mousedown();
            })
            .delegate('li', 'mousedown', function(){
                var $li = $(this);
                options.onmousedown($li.data());
                $list.hide();
            });
    }
    autocomplete();
});
