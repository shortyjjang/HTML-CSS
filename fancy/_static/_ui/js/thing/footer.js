// Recommendations
(function(){

    $(document).ready(function() {
        if(!window.thing_id) return;
    
        $.ajax({
            type : 'get',
            url  : '/might_also_fancy?thing_id='+window.thing_id+'&lang='+lang+'&count='+12 ,
            success  : function(html){
                if(!html) return;
                $('.other-thing .similar ul.fancy-suggestions').html(html);
                $('.similar .fancy-suggestions').infinitescroll('resume');
            },
            error : function(){
                $('.other-thing .similar ul.fancy-suggestions').html('');
            }
        });

        // var requireLogin = $('.other-thing .recently ul.fancy-suggestions').attr('require_login');
        var url = '/recently_viewed_things?thing_id=' + window.thing_id;

        $.ajax({
            type : 'get',
            url  : url,
            success  : function(html){
                if(!html) return;
                $('.other-thing .recently ul.fancy-suggestions').html(html);
            },
            error : function(){
                $('.other-thing .recently, .summary .recently').hide();
                $('.other-thing .recently ul.fancy-suggestions').html('');
            }
        });
    });

    $('.similar .fancy-suggestions').infinitescroll({
        itemSelector: "li",
        navSelector: "#page_nav",
        nextSelector: "#page_nav a",
        dataType: 'html',
        appendCallback: false,
        extraScrollPx: 10,
        loading: {
            img: '/_ui/images/common/loading.gif',
            msgText: "",
            finishedMsg: ""
        },
        state: {
            isPaused: true,
        },
        maxPage: 5,
    }, function(html, opts) {
        if (html){
            $('.other-thing .similar ul.fancy-suggestions').find('#infscr-loading').remove();
            $('.other-thing .similar ul.fancy-suggestions').append(html);
        } else {
            $('.similar .fancy-suggestions').infinitescroll('pause');
        }
    });

    $('.fancy-suggestions').on('click', '.buttons .btn-cart', function(e) {
        e.preventDefault();
        $(this).parent().find('.sale-item-input').toggle();
    });

    $('.fancy-suggestions').on('click', '.buttons .add_to_cart', function(e) {
        var $this = $(this), login_require = $this.attr('require_login');
        var params = {};
        params['seller_id'] = $this.attr('sisi');
        params['thing_id'] = $this.attr('tid');
        params['sale_item_id'] = $this.attr('sii');

        var quantity = $this.parent().find('select[name="quantity"]').val();
        quantity = parseInt(quantity, 10);
        if(isNaN(quantity) || quantity <= 0) return alert(gettext('Please select a valid quantity.'));
        params['quantity'] = quantity;
        
        if ($this.parent().find('select[name="option_id"]').length) {
            var optionId = $this.parent().find('select[name="option_id"]').val();
            params['option_id'] = optionId;
        }

        var mixpanel_param = { 'sale id': params['sale_item_id'] };
        try{
            if ('option_id' in params) mixpanel_param['option id'] = params['option_id'];
            if ($this.attr('via')) mixpanel_param['via'] = $this.attr('via');
            if( $this.attr('section') ) mixpanel_param.section = $this.attr('section');
            if( $this.attr('utm') ) mixpanel_param.utm = $this.attr('utm');
        } catch(e) {};
        if (typeof(login_require) !== undefined && login_require !== null && login_require=='true'){
            param['mixpanel'] = mixpanel_param;
            $.jStorage.set('fancy_add_to_cart', params);
            $.dialog('popup.sign.signup').open();
            return;
        }

        if($this.hasClass('loading')) return;
        $this.addClass('loading');

        params.from_sds_page = window.from_sds_page;
        try{ track_event('Add to Cart', mixpanel_param); } catch(e) {};
        if (dataLayer) {
            dataLayer.push({'event': 'Add_to_Cart_Button', 'product_id': params['sale_item_id'], 'products': undefined, 'products_info': undefined, 'revenue': undefined, 'option_id': param['option_id'] });
        }

        $.ajax({
            type : 'POST',
            url  : '/add_item_to_cart.json',
            data : params,
            success : function(json){
                if(!json || json.status_code === undefined) return;
                if(json.status_code == 1){
                    var args = {
                        'THING_ID':$this.attr('tid'),
                        'ITEMCODE':json.itemcode,
                        'THUMBNAIL_IMAGE_URL':json.image_url,
                        'ITEMNAME':json.itemname,
                        'QUANTITY':json.quantity,
                        'PRICE':json.price,
                        'OPTIONS':json.option,
                        'HTML_URL':json.html_url,
                        'CART_ID':json.cart_id
                    };
                    if( json.fancy_price) args['FANCY_PRICE'] = json.fancy_price;
                    Fancy.Cart.addItem(args);
                    if($.dialog('things-v3').showing()){
                        $.dialog('things-v3').close();
                    }
                    $this.closest("span.show_cart.opened").removeClass("opened").closest("li.active").removeClass("active");
                    if( $("#slideshow").is(":visible")){
                        $("#slideshow").find("p.alert-cart").find("b").text(json.itemname).end().slideDown(250);
                        setTimeout(function(){
                            $("#slideshow").find("p.alert-cart").slideUp(250);
                        },3000);
                    }else{
                        Fancy.Cart.openPopup();
                    }

                } else if(json.status_code === 0){
                    if(json.message) alert(json.message);
                }
            },
            complete : function(){
                $this.removeClass('loading');
            }
        });
    });

    $('.fancy-suggestions').on('click', 'a.delete', function(e) {
        e.preventDefault();
        var $thisCard = $(this).closest('li');
        var thingId = $thisCard.attr('tid');
        $.post('/remove_recently_viewed_thing',
            { thing_id: thingId },
            function(json){
                if(!json) return;
                if( json.status_code == 1) {
                    $thisCard.remove();
                } else {
                    alert("Failed to remove the thing.");
                }
            }
        );
    });

    $('.fancy-suggestions').delegate('.fancyd, .fancy', 'click', function(event){
        event.preventDefault();

        var $this = $(this),login_require = $this.attr('require_login');

        if (typeof(login_require) != undefined && login_require === 'true')  return require_login();
        if($this.hasClass('loading')) return;

        var tid  = $this.attr('tid') || null;
        if (!tid) return;

        $this.addClass('loading');
        if ($this.hasClass('fancyd')) {
            Fancy.Action.unFancy(tid, function(){
                $this.removeClass('fancyd').addClass('fancy').each(function(){
                    this.lastChild.nodeValue = gettext('Fancy');
                });
                $this.removeClass('loading');
            });
        } else {
            var params = {};
            params.http_referer = document.referrer;

            Fancy.Action.doFancy(tid, params, function() {
                $this.removeClass('loading');
                $this.addClass('fancyd').html('<span><i></i></span>' + gettext("Fancy'd"));
            });
        }
    });

    $('.fancy-suggestions').on('click', '.delete', function(e) {
        e.preventDefault();
        $(this).closest('li').remove();
		return false;
    });

	$('.summary .quick_menu a, .other-thing .tabs a').on('click', function(e) {
        e.preventDefault();
        // var current_menu = $(this).attr('class');
		var position_y = $('.other-thing').position().top-$(window).scrollTop();
		if ($(this).hasClass('similar')) {
			$('.summary .quick_menu').find('a').removeClass('current').end().find('a.similar').addClass('current');
			$('.other-thing .tabs').find('a').removeClass('current').end().find('a.similar').addClass('current');
			$('.other-thing').find('.inner').hide().end().find('.inner.similar').show();
		}else{
			$('.summary .quick_menu').find('a').removeClass('current').end().find('a.recently').addClass('current');
			$('.other-thing .tabs').find('a').removeClass('current').end().find('a.recently').addClass('current');
			$('.other-thing').find('.inner').hide().end().find('.inner.recently').show();
		}
		if ($(this).closest('ul').hasClass('quick_menu')==true) {
			setTimeout(function(){$(window).scrollTop($('.other-thing').offset().top-37);},200);
		}else{
			setTimeout(setPosition(position_y),200);
		}
		return false;
    });

    function setPosition(top){
        $(window).scrollTop($('.other-thing').offset().top - top);
    }
})();
