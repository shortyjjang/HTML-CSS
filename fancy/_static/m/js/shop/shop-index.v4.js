$(function(){

	$('#pop_wrap')
	    .on('click', function(event){
		    if(event.target === this) {
		        $(window).off('scroll touchmove mousewheel');
		        $(this).removeAttr('class').hide();
		        $("#more-share-link").val('');
		        $('#share-box')
					.find('a.tw').attr('href', '').end()
					.find('a.fb').attr('href', '').end()
					.find('a.gg').attr('href', '').end()
					.find('a.tb').attr('href', '').end();
		    }

	    });

    $('#content').on('click','.btn-buy',function(e){
        e.preventDefault();
        var login_require = $(this).attr('require_login');
        if ($(this).attr('gift-card') == 'true'){
            var thing_url = $(this).attr('thing-url');
            window.location = thing_url;
            return;
        }
        var tid = $(this).attr('tid');
        var active_option = $(this).attr('active-option');
        if(active_option == 'False'){
            addToCart(tid, false);
        }else {
            $(window)
                .on('scroll touchmove mousewheel',function(e){
                    e.preventDefault();
                      e.stopPropagation();
                      return false;
                });

            var thingInfo = getThingInfo(tid);
            if (thingInfo.availability) {
                btn_buy_available(tid);
            } else {
                btn_buy_unavailable(tid);
            }

            var is_waiting = $("#pop_wrap select[name=option_id] option:selected").attr("waiting");
            var is_soludout =$("#pop_wrap select[name=option_id] option:selected").attr("soldout");
            if(is_soludout == 'True'){
                $("#pop_wrap .add_to_cart.btn-green").hide();
                $("#pop_wrap .btn-gray.btn-notify").show();
            }else{
                $("#pop_wrap .add_to_cart.btn-green").show();
                $("#pop_wrap .btn-gray.btn-notify").hide();
            }
            if(is_waiting == 'True'){
                $("#pop_wrap button.btn-gray.btn-notify").addClass('subscribed').text(gettext("Subscribed"));
            }else{
                $("#pop_wrap button.btn-gray.btn-notify").removeClass('subscribed').text(gettext("Notify me when available"));
            }

        }
    });

    var btn_buy_available = function(tid){
        var thing_option_id = "#thing-option-"+tid;
        var height = $(window).height();
        $("#thing-option-wrapper").html( $(thing_option_id).html() );
        $('.popup.sale-item-input').css('top',height/2);
        $('#pop_wrap').addClass('sale-item-input').show().find('.sale-item-input').find('.btn-green').show().end().find('.btn-gray').hide().end().find('.selectbox').removeClass('disabled');
	};

    var btn_buy_unavailable = function(tid) {
        var thing_option_id = "#thing-option-"+tid;
        var height = $(window).height();
        $("#thing-option-wrapper").html( $(thing_option_id).html() );
        $('.popup.sale-item-input').css('top',height/2);
        $('#pop_wrap').addClass('sale-item-input').show().find('.sale-item-input').find('.btn-green').hide().end().find('.btn-gray').show().end().find('.selectbox').addClass('disabled');
    };

    var getThingInfo = function(tid){
        var thing_option_id = "#thing-option-"+tid;
        var isSoldout = $(thing_option_id).attr('soldout');
        if(isSoldout == 'False'){
            return {availability:true}
        }else{
            return {availability:false}
        }
    };


    $("#thing-option-wrapper").on('click',".add_to_cart",function(e){
        e.preventDefault();
        var tid = $(this).attr('tid');
        addToCart(tid);
    });
    var addToCart = function addToCart(tid, active_option){
        var param = {};
        //no option
        param['seller_id'] = parseInt($("#thing-wrapper-"+tid).attr('sisi'));
        param['thing_id'] = tid;
        param['sale_item_id'] = parseInt($("#thing-wrapper-"+tid).attr('sii'));
        if (active_option == false) {
            param['quantity'] = 1;
        }else if ($("#thing-wrapper-"+tid).attr('active-option') != 'False'){
            param['option_id'] = parseInt($("#pop_wrap [name=option_id]").val());
            param['quantity'] = parseInt($("#pop_wrap [name=quantity]").val());
        }else{
            param['quantity'] = 1;
        }
        $.ajax({
            type : 'POST',
            url  : '/add_item_to_cart.json',
            data : param,
            success : function(json){
                if(!json || json.status_code == undefined) return;
                if(json.status_code == 1){
                    window.location = "/cart";
                } else if(json.status_code == 0){
                    if(json.message) alert(json.message);
                }
            }
        });

    }

    $doc = $(document);
    $doc.off('click', '.follow,.following');

    $(document).on('change','.option-box', function(){
        var option_id = $(this).attr('id');
        var select_str = "#pop_wrap #"+option_id+" option:selected";
        var $option_box = $(select_str);
        var soldout = $option_box.attr('soldout');
        var remaining_quantity = $option_box.attr('remaining-quantity');
        if (soldout == 'True'){
            $("#pop_wrap .add_to_cart.btn-green").hide();
            $("#pop_wrap .btn-gray.btn-notify").show();
        }else{
            $("#pop_wrap .add_to_cart.btn-green").show();
            $("#pop_wrap .btn-gray.btn-notify").hide();
        }
        var is_waiting = $("#pop_wrap select[name=option_id] option:selected").attr("waiting");
        if(is_waiting == 'True'){
            $("#pop_wrap button.btn-gray.btn-notify").addClass('subscribed').text(gettext("Subscribed"));
        }else{
            $("#pop_wrap button.btn-gray.btn-notify").removeClass('subscribed').text(gettext("Notify me when available"));
        }


    });
    var scrolltop;
    $(document).on('touchstart',"#pop_wrap select[name='quantity']",function(){
        scrolltop = $("body").scrollTop();
        $("#pop_wrap").css({'position':'absolute','top':scrolltop});

    });
    $(document).on('blur',"#pop_wrap select[name='quantity']",function(){
        $("body").scrollTop(scrolltop);
        $("#pop_wrap").css({'position':'fixed','top':0});
    });

    $(document).on('touchstart',"#pop_wrap .option-box",function(){
        scrolltop = $("body").scrollTop();
        $("#pop_wrap").css({'position':'absolute','top':scrolltop});
    });
    $(document).on('blur',"#pop_wrap .option-box",function(){
        $("body").scrollTop(scrolltop);
        $("#pop_wrap").css({'position':'fixed','top':0});

    })


    $('body').on('click','button.btn-notify',function(event){
		var $this = $(this), params, url, selected;
		event.stopPropagation();
		event.preventDefault();

		if($this.attr('require_login') === 'true') return require_login();

        url = '/wait_for_product.json';
        params = {sale_item_id : $this.attr('item_id')};
        var option_id = $('#pop_wrap select[name=option_id]').val();
        if (typeof option_id !== "undefined" && option_id != null && option_id != '') {
		    params['option_id'] = option_id;
        }
        var remove = 0;
		if($this.hasClass('subscribed')){
		    remove = 1;
		    params['remove'] = remove;
		}
	    $.ajax({
			type : 'post',
			url  : url,
			data : params,
			dataType : 'json',
			success  : function(json){
			    if(!json || json.status_code == undefined) return;
			    if(json.status_code == 1) {
				if (remove == 1) {
				    $this.removeClass('subscribed').text(gettext("Notify me when available"));
				    if ("option_id" in params) {
				    	$("#pop_wrap select[name=option_id] option:selected").attr("waiting","False");
				    }
				} else {
				    $this.addClass('subscribed').text(gettext("Subscribed"));
				    $("#pop_wrap select[name=option_id] option:selected").attr("waiting","True");
				}
			    } else if (json.status_code == 0 && json.message) {
					alert(json.message);
			    }
			}
		});
	});


	var updateSocialLink = function updateSocialLink(url, txt, img){
		var url = encodeURIComponent(url);
		var txt = encodeURIComponent(txt);
		var img = encodeURIComponent(img);

		$('#share-box')
			.find('a.tw').attr('href', 'http://twitter.com/share?text='+txt+'&url='+url+'&via=fancy').data({width:540,height:300}).end()
			.find('a.fb').attr('href', 'http://www.facebook.com/sharer.php?u='+url).data({url:url,text:txt}).end()
			.find('a.gg').attr('href', 'https://plus.google.com/share?url='+url).end()
			.find('a.tb').attr('href', 'http://www.tumblr.com/share/link?url='+url+'&name='+txt+'&description='+txt).end();
    };

    $("#content").on('click','a.share',function(){
        var tid = $(this).attr('tid');
        var imgUrl = "https://" + $(this).data('img');
        var title = $(this).data('title');
        var url = $(this).data('url');
        var $link = $("#more-share-link");

        $.post('/get_short_url.json', {thing_id:tid}).done(function(data){
				if(data.short_url) {
					$link.val(data.short_url);
					updateSocialLink(data.short_url, title, imgUrl);
				}else{
                    return false;
                }
        });
        $('#pop_wrap').addClass('share_thing').show();

    });
})