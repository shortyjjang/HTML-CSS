jQuery(function($){

    if(location.args){
        var action = location.args['action'] || '';
        if('fancy' in location.args || action == 'fancy'){
            $('.other-thing .figure-item').find('a.button.fancy,a.button.fancyd').eq(0).click();
        } else if ('unfancy' in location.args){
            $('.other-thing .figure-item a.button.fancyd').eq(0).click();
        } else if(action == 'buy') {
            $('#popup_container ul.figure-list > li > a:first').each(function(){
                var $this = $(this), img;

                img = new Image;
                img.onload = function(){
                    $this.data('size', this.width+','+this.height)
                    setTimeout(function(){ $('#sidebar .thing-description a').click() }, 10);
                };
                img.src = $this.attr('href');
            });
        }
    }
    /*
    var roomlist = [], roomscache = {};

    function resetResult() {
        $('.booking-result').empty().hide();
        $('dd.btn-check').show().find('button').show().end().find('.loading').hide();
    }
    */

    // Slides
    if ($.fn.slides) {
        var $hotel_photos = $('#hotel-photos'), $frame = $hotel_photos.find('.slides_container');

        $hotel_photos
            .find('.slides_container img')
                .load(function(){
                    var maxWidth = $frame.width(), maxHeight = $frame.height(), w = this.width, h = this.height, ml = 0, mt = 0;

                    if(w > maxWidth) {
                        w = maxWidth;
                        h = parseInt(this.height * (maxWidth / this.width));
                    }

                    if(h > maxHeight) {
                        h = maxHeight;
                        w = parseInt(this.width * (maxHeight / this.height));
                    }

                    mt = parseInt((maxHeight - h)/2);
                    ml = parseInt((maxWidth - w)/2);

                    this.width  = w;
                    this.height = h;
                    this.style.marginTop  = mt+'px';
                    this.style.marginLeft = ml+'px';
                })
            .end()
            .slides({
                preload: true,
                generateNextPrev: false,
                generatePagination: true,
                slideSpeed : 0,
                crossfade  : false
            });
    }

    if ($('.thing-shop .store img').width()>56) {
        $('.thing-shop .store span').width(120);
    }

    function text_currency(money, code, symbol) {
        var $currency = $('#sidebar > .figure-info .currency_price');
        if(typeof(money) == 'number') {
            money = money.toFixed(2);
        }
        money = money.replace(/[ \.]00$/,'');
        var str = gettext('Approximately').toUpperCase()+' '+ symbol+money+' <a class="code">'+code+'</a>';
        $currency.html(str);
        $currency.attr('currency', code);
        $currency.css('display', 'block');
        $currency.show();
    }

    function show_currency(code, set_code){
        var $currency = $('#sidebar > .figure-info .currency_price');
        if ($currency.length === 0) return;

        var p = $currency.eq(0).attr('price');
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
            $currency.attr('currency', code);
            $currency.hide().parent().find('.usd').show().html('<a class="code">USD</a>');
            return;
        }

        $currency.parent().find('.usd').html('USD');
        $('.hotel .usd').hide();

        $.ajax({
            type : 'GET',
            url  : '/convert_currency.json?amount='+p+'&currency_code='+code,
            dataType : 'json',
            success  : function(json){
                if(!json || typeof(json.amount)=='undefined') return hide_currency();

                var price = json.amount.toFixed(2) + '', regex = /(\d)(\d{3})([,\.]|$)/;
                while(regex.test(price)) price = price.replace(regex, '$1,$2$3');

                if(window.numberType === 2) price = price.replace(/,/g, ' ').replace(/\./g, ',');

                text_currency(price, json.currency.code, json.currency.symbol);
            },
            error : function(){
                hide_currency();
            }
        });
    }

    function hide_currency(){
        var $currency = $('#sidebar > .figure-info .currency_price');
        $currency.hide();
    }

    // image list on right side of thing
    (function(){
        var dlg_currency = $.dialog('show_currency');
        var $currency_list = $('.popup.show_currency .currency-list');
        var $currency = $('#sidebar > .figure-info .currency_price');

        // get currency
        if($currency.eq(0).attr('price')){
            if ($currency.eq(0).attr('currency')) {
                show_currency($currency.eq(0).attr('currency'));
            } else {
                $.ajax({
                    type : 'GET',
                    url  : '/get_my_currency.json',
                    dataType : 'json',
                    success  : function(json){
                        if(json && json.currency_code) show_currency(json.currency_code);
                    },
                    error: function() {
                        show_currency('USD');
                    }
                });
            }

            $currency.parent().delegate('a.code', 'click', function(event){
                event.preventDefault();
                if(!$currency_list.hasClass('loaded')) return;

                var old_dlg_class= $('#popup_container').attr('class');
                function close_currency() {
                    if (old_dlg_class) $.dialog(old_dlg_class).open();
                    else dlg_currency.close();
                }

                var my_currency = $currency.eq(0).attr('currency');
                if (my_currency) {
                    var my_currency_selector = 'li.currency[code="'+my_currency+'"]';
                    $currency_list.find(my_currency_selector).find('a').addClass('current');
                    var $ul_major = $currency_list.find('.right[code="all"] ul.major');

                    var $my_currency_item = $ul_major.find(my_currency_selector);
                    if ($my_currency_item.length === 0) {
                        var $ul_all = $currency_list.find('.right[code="all"] ul').not('.major');
                        $my_currency_item = $ul_all.find(my_currency_selector).clone();
                    }
                    $ul_major.prepend($my_currency_item);
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
                        show_currency(code, true);
                        close_currency();
                    });
            });
        }

    })();

    function setPrice(val) {
        var price = sale_item_option_prices[val];
        var retail_price = sale_item_option_retail_prices[val];
        var discount_percentage = sale_item_option_discount[val];
        $currency = $('#sidebar > .figure-info .currency_price');

        function setPriceInSidebar(price) {
            var $priceEle = $('#sidebar p.price');
            $priceEle.find('big').html('$'+price+ '<small class="usd"><a class="code">USD</a></small>');
            
            if (discount_percentage) {
				$priceEle.find('big').addClass('sale');
                $priceEle.find('.sales').show()
                    .html('<em>$' + retail_price + '</em> (Save ' + discount_percentage + '%)');
            } else {
				$priceEle.find('big').removeClass('sale');
                $priceEle.find('.sales').hide();
            }
        }

        if(/^(?:string|number)$/.test(typeof price)){
            price = numberFormat(price);
            setPriceInSidebar(price);
            $currency.eq(0).attr('price', price);
        }

        show_currency($currency.eq(0).attr('currency'));
    }

    $('#option_id,.popup select.option').change(function(){
        setPrice(this.value);
    });

    (function() {
        var $saleItemInputContainer = $("fieldset.sale-item-input");
        var $quantitySelectTags = $saleItemInputContainer.find('select[name=quantity]');
        var $quantityTrickSelectContainers = $quantitySelectTags.closest('.trick-select');
        var $quantitySelectLabels = $quantityTrickSelectContainers.find(".selectBox-label");

        $('select[name=quantity]').on('change', function(event) {
            console.log("quantity changed");
            var val = $(this).val();
            var $selectedOption = $(this).children('option:selected');
            $quantitySelectTags.val(val);
            $quantitySelectLabels.text($selectedOption.text());
        }).trigger('change');

        var $optionSelectTags = $saleItemInputContainer.find('select[name=option_id]');
        var $optionTrickSelectContainers = $optionSelectTags.closest('.trick-select');
        var $optionSelectLabels = $optionTrickSelectContainers.find(".selectBox-label");

        $('select[name=option_id]').on('change', function(event) {
            console.log("option changed");
            var val = $(this).val();
            var $selectedOption = $(this).children('option:selected');
            $optionSelectTags.val(val);
            $optionSelectLabels.text($selectedOption.text());
            var soldout = window.sale_item_options[val] == 'True';
            var $gift = $('.btn-create.group-gift'), $notify = $('button.notify-available');
            var $btn_cart = $(".add_to_cart.btn-cart");
            var is_waiting = window.user_waiting_options[val] == 'True';
            if (soldout) {
                $btn_cart.removeClass('btns-green-embo')
                .addClass('btns-blue-embo')
                .addClass('disabled')
                .attr("disabled", "disabled")
                .text(gettext('Sold out'));
                $notify.show();
                $gift.hide();
                if (is_waiting) {
                    $notify.addClass('subscribed');
                    $notify.text(gettext("Subscribed"));
                } else {
                    $notify.removeClass('subscribed');
                    $notify.text(gettext("Notify me when available"));
                }
                console.log("soldout!");
                $quantitySelectLabels.text(1);
            } else {
                console.log("available!");
                $btn_cart.addClass('btns-green-embo')
                .removeClass('btns-blue-embo')
                .removeClass('disabled')
                .removeAttr("disabled")
                .text(gettext('Add to Cart'));
                $notify.hide();
                if ($gift.hasClass('for-gifting')) {
                    $gift.show();
                }
                var remainingQuantity = parseInt($selectedOption.attr('remaining-quantity'));
                var currentlySelectedQuantity = parseInt($quantitySelectTags.val());
                if (currentlySelectedQuantity > remainingQuantity) {
                    currentlySelectedQuantity = remainingQuantity;
                }
                $quantitySelectTags.empty();
                for (var i=1; i<=remainingQuantity && i<=10; i++) {
                    $quantitySelectTags.append('<option value="' + i + '">' + i + '</option>');
                }
                $quantitySelectTags.val(currentlySelectedQuantity);
                $quantitySelectTags.trigger('change');
            }
        }).trigger('change');

        $saleItemInputContainer.find('select#gift-value').on('change', function(event) {
            var $this = $(this);
            var $container = $this.closest('.trick-select');
            var $label = $container.find('.selectBox-label');
            $label.text($this.children('option:selected').text());
        }).trigger('change');
    })();

    // "notify" button
    $('button.notify-available').click(function(event) {
        var $this = $(this), params, url, selected;
        event.stopPropagation();
        event.preventDefault();

        if($this.attr('require_login') === 'true') return require_login();

            url = '/wait_for_product.json';
            params = {sale_item_id : $this.attr('item_id')};
            var option_id = $this.parent().find('.trick-select.option select').val();
            if (typeof option_id !== "undefined" && option_id != null && option_id != '') {
            params['option_id'] = option_id;
            }
            var remove = 0;
        if($this.hasClass('subscribed')){
            remove = 1;
            params['remove'] = remove;
        }

            var $notify = $('button.notify-available');

        $.ajax({
            type : 'post',
            url  : url,
            data : params,
            dataType : 'json',
            success  : function(json){
                if(!json || json.status_code == undefined) return;
                if(json.status_code == 1) {
                if (remove == 1) {
                    $notify.removeClass('subscribed').text(gettext("Notify me when available"));
                    if ("option_id" in params) {
                    window.user_waiting_options[option_id] = 'False';
                    }
                } else {
                    $notify.addClass('subscribed').text(gettext("Subscribed"));
                    if ("option_id" in params) {
                    window.user_waiting_options[option_id] = 'True';
                    }
                }
                } else if (json.status_code == 0 && json.message) {
                alertify.alert(json.message);
                }
            }
        });
    });

    // Use natural background color - https://app.asana.com/0/369567867430/4763569164444
    (function(){
        var $canvas = $('<canvas />'), $img = $('.fig-image > img'), ctx;

        // activate this feature only when the image has extra horizontal margins
        if($img.width() >= $img.parent().width()) return;

        // check whehter canvas is supported
        if(!$canvas[0].getContext || !(ctx=$canvas[0].getContext('2d'))) return;

        var img = new Image;
        img.onload = function(){
            $canvas.attr({width:this.width,  height:this.height});

            try { ctx.drawImage(this, 0, 0); } catch(e) { return };

            var ltRGB = ctx.getImageData(0, 0, 1, 1),
                rtRGB = ctx.getImageData(this.width-1,0,1,1),
                lbRGB = ctx.getImageData(0, this.height-1, 1, 1),
                rbRGB = ctx.getImageData(this.width-1, this.height-1, 1, 1),
                allWhite = true;

            $.each([ltRGB, rtRGB, lbRGB, rbRGB], function(idx, rgb){
                if(rgb2hsv.apply(this, rgb.data || rgb)[2] < 99) {
                    allWhite = false;
                    return false;
                }
            });

            if(allWhite) {
                $img.closest('.fig-image').css('background-color', '#fff');
            }
        };
        img.crossOrigin = 'anonymous';
        img.src = $img.attr('src')+'?_host='+(location.protocol+location.hostname).replace(/\W+/g,'_');

        // make sure the load event fires for cached images too
        if(img.complete || img.complete === undefined) {
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
            img.src = $img.attr('src');
        };

        function rgb2hsv(r,g,b){
            r /= 255; g /= 255; b /= 255;
            var max = Math.max(r,g,b), min = Math.min(r,g,b), m1=max+min, m2=max-min, v=m1/2, s=0, h=0;
            if(max != min){
                s = m2 / ((v<.5)?m1:2-m1);
                if(r == max) h = (g-b)/m2;
                else if(g == max) h = 2+(b-r)/m2;
                else h = 4+(r-g)/m2;
            }
            h *= 100; s *= 100; v *= 100;
            if(h < 0) h += 360;

            return [h, s, v];
        };
    })();

    // when click "Fancy it" or "Fancy'd" button
    $('#sidebar, .other-thing, .summary').on('mouseover', '.button-static.fancyd:not(._count)', function(e){
		this.lastChild.nodeValue = gettext("Unfancy");
	});

	$('#sidebar, .other-thing, .summary').on('mouseout', '.button-static.fancyd:not(._count)', function(e){
		this.lastChild.nodeValue = gettext("Fancy'd");
	});
    $('.fancy-suggestions').on('mouseover', '.button.fancyd:not(._count)', function(e){
		this.lastChild.nodeValue = gettext("Unfancy");
	});

	$('.fancy-suggestions').on('mouseout', '.button.fancyd:not(._count)', function(e){
		this.lastChild.nodeValue = gettext("Fancy'd");
	});

    $('.price a.code').click(function(){
        $(this).closest('div').find('.currency_codes').toggle();
    });
});

function readyForAnonumous()
{
    jQuery(function($){
        $.dialog('popup.sign.signup').open().close = function() {};
    });
}

function readyForSaleItem(info)
{
    var $ = jQuery;

    function displayIcons() {
        var $quick = $('#sidebar .quick-shipping'), $same = $('#sidebar .same-delivery');

        if ($quick.is(':hidden') || $same[0]) $('#sidebar .ship-detail').show();
        if ($quick.is(':hidden') && $same[0]) {
            $same.find('em').show().end().find('small em').css('margin-left','-15px').width(220);
        } else if ($quick.is(':visible') && $same.length == 0 ) {
            $quick.find('em').show();
        } 
    }

    jQuery(function($){
        if (!('quickShippingInfo' in info)) return displayIcons();

        $('select[name="quantity"],select[name="option_id"]').change(function(){
            var $this = $(this), $fieldset = $this.closest('fieldset'), $quick = $('#sidebar .quick-shipping'), quantity, option, sii, key;

            quantity = +$fieldset.find('select[name="quantity"]').val();
            option   = $fieldset.find('select[name="option_id"]').val() || '';
            sii      = $quick.attr('sii');

            if(isNaN(quantity) || quantity <= 0) return;

            key = sii + (option?'-'+option:'');
            if(key in info.quickShippingInfo && info.quickShippingInfo[key] >= quantity && info.quickShippingInfo[key] >=5 ) $('.quick-shipping').show();

            displayIcons();
        });

        $('select[name="quantity"]').change();
    });
}
