$(document).ready(function() {
    $(window).load(function(){
        $.get('/rest-api/v1/things/vanity-number/area-list', null, function(response) {
            if (response) {
                _.each(response, function(state){
                    $('.vanity .state #state').append($("<option></option>")
                        .attr("value", state)
                        .text(state));
                });
            }
            $('.vanity .state #state').prop('selectedIndex', -1);
        });
    });

    $('.vanity #state').change(function(e){
        var state = $('.vanity #state option:selected').text();
        $('.vanity .state .selectBox-label').attr('value', state).text(state);
    });

    function isExistAreaCodeValue(code) {
        if( code === '' ) return false;
        if( code === $('.vanity .frm #code').attr('placeholder') ) return false;
        return true;
    }

    function isValidAreaCode(code) {
        if( isNaN(parseInt(code, 10)) ) return false;
        if( code.length != 3){
            alert("Invalid area code.");
            return false;
        }
        return true;
    }

    function isExistPriceVaule(min, max) {
        if( min === '' && max === '' ) return false;
        if( min === $('.vanity .frm #price_min').attr('placeholder') && max === $('.vanity .frm #price_max').attr('placeholder') )
            return false;
        return true;
    }

    function isValidPrice(min, max) {
        if( min === $('.vanity .frm #price_min').attr('placeholder') || min === '' ) {
            min = 0;
            return true;
        }
        if( max === $('.vanity .frm #price_max').attr('placeholder') || max === '' ) {
            max = '';
            return true;
        }

        min = min.replace(',', '').replace('$', '');
        max = max.replace(',', '').replace('$', '');
        if( isNaN(parseInt(min, 10)) ) {
            alert("Please check price field. It should be number.");
            return false;
        }
        if( isNaN(parseInt(max, 10)) ) {
            alert("Please check price field. It should be number.");
            return false;
        }
        if( parseInt(min, 10) >= parseInt(max, 10) ) {
            alert("The max price number should be bigger than min price number.");
            return false;
        }
        return true;
    }

    function getValidPrice(price) {
        if( price === $('.vanity .frm #price_min').attr('placeholder') || price === '' ) {
            return 0;
        }

        if( price === $('.vanity .frm #price_max').attr('placeholder') || price === '' ) {
            return '';
        }

        var validPrice = parseInt(price.replace('$', '').replace(',', ''), 10);
        if( isNaN(validPrice) )
            return '';
        else
            return validPrice;
    }

    function isValidState(state) {
        if( $('.vanity .state #state').prop('selectedIndex') === 0 ) return false;
        if( state === undefined ) return false;
        if( state === '' ) return false;
        return true;
    }

    function isExistTermValue(term) {
        if( term === '' ) return false;
        if( term === $('.vanity .search').attr('placeholder') ) return false;
        return true;
    }

    function isValidTerm(term) {
        if( term.length < 4 ) {
            alert("The search term should be 4 or more characters.");
            return false;
        }
        return true;
    }

    function isValidSort(sort) {
        if( sort === 'price_desc' || sort === 'price_asc' ){
            return true;
        }
        return false;
    }

    function getParams() {
        var areaCode = $('.vanity .frm #code').val();
        var minPrice = $('.vanity .frm #price_min').val();
        var maxPrice = $('.vanity .frm #price_max').val();
        var state = $('.vanity #state option:selected').text();
        var term = $('.vanity #search').val();
        var sort = $('.popup.vanity_result .result select option:selected').attr('value');
        
        var params = {};
        if( isExistTermValue(term) ){
            if( isValidTerm(term) ) {
                params['q'] = term;
            } else {
                return false;
            }
        }

        if( isExistAreaCodeValue(areaCode) ) {
            if (isValidAreaCode(areaCode)) {
                params['ac'] = areaCode;
            } else {
                return false;
            }
        }
        
        if( isExistPriceVaule(minPrice, maxPrice) ) {
            if( isValidPrice(minPrice, maxPrice) ) {
                params['p'] = getValidPrice(minPrice) + '-' + getValidPrice(maxPrice);
            } else {
                return false;
            }
        }
        
        if( isValidState(state) ) {
            params['state'] = state;
        }

        if( isValidSort(sort) ) {
            params['sort'] = sort;
        }

        return params;
    }

    function searchNumber(is_opened_popup, mobile) {
        params = getParams();
        if( params === false ) {
            return;
        }
        
        console.log(params);
        $('.vanity_result .empty').hide();
        $('.vanity_result .result').show();
        $('.vanity_result .result ul').empty();
        $('.vanity_result .result').addClass('loading');

        if( !is_opened_popup ) {
            $.dialog("vanity_result").open();
			$('html').addClass('fixed');
        } else {
            $('.vanity_result').show();
            $('.thing-info').hide();
        }

        if( params['q'] ) {
            $('.vanity_result .result .text').val(params['q']);
        }

        $.get('/rest-api/v1/things/vanity-number/search', params, function(response){
            if (response) {
                console.log(response);
                if( response.data.length === 0 ){
                    $('.vanity_result .empty').show();
                    $('.vanity_result .result').hide();
                } else {
                    appendSearchResult(response, mobile, is_opened_popup);
                }
            } else {
                $('.vanity_result .empty').show();
                $('.vanity_result .result').hide();
            }
        });
    }

    function appendSearchResult(result, mobile, is_opened_popup) {
        _.each(result.data, function(num_info) {
            var $li = $('<li></li>').attr('id', num_info.id_str);
            var $btn = $('<button></button>').addClass('btn-checkout');    
            $li.append($('<b></b>').addClass('number').text(num_info.display_num))
                .append($('<span></span>').addClass('price').text(numeral(num_info.price).format("$0,0.00")));

            $btn.text('Checkout');
            
            if( is_opened_popup ) {
                $btn.addClass('btns-gray-embo');
            } else {
                $btn.addClass('btns-green-embo');
            }
            $li.append($btn);
            $('.vanity_result .result ul').append($li);
        });

        if(result.data.length > 20 || result.next_page) {
            var $more = $('<li></li>');
            if( mobile ) {
                $more.append($('<button class="more btn-white">GET MORE</button>')
                    .attr('next_page', result.next_page)
                );
            } else {
                $more.append($('<button class="more btns-white">GET MORE</button>')
                    .attr('next_page', result.next_page)
                );
            }
            $('.vanity_result .result ul').append($more);
        }
        $('.vanity_result .result').removeClass('loading');
    }

    function updateCart( args ){
        var $list = $('.side-cart-list'), $item  = $('#cartitem-'+args['ITEMCODE']), price, quantity;
        if(args.OPTIONS) args.OPTIONS+=", ";

        quantity = parseInt(args['QUANTITY']) || 0;
        price    = parseFloat(args['PRICE']) || 0;
        fancy_price = parseFloat(args['FANCY_PRICE']) || 0;

        if($item.length) {
            quantity += parseInt($item.data('quantity'));
            price += parseFloat($item.data('price'));
            fancy_price += parseFloat($item.data('fancy_price'));
            $item.find('.qty').text(quantity).end().find('.price b').text('$'+price.toFixed(2).replace(/\.?0+$/, ''));
        } else {
            $item = $list.find('>script[type="fancy/template"]').template(args).appendTo($list);
        }
        $item.data('options', args['OPTIONS']||'').data('price', price).data('quantity', quantity);

        var count = 0, price = 0;

        $('.side-cart-list > dd').each(function(){
            var $this = $(this);
            var q = parseInt($this.data('quantity')) || 0;
            var p = parseFloat($this.data('price')) || 0;

            if(q == 0) {
                $item.remove();
                return;
            }

            count += q;
            price += p;
        });

        $(".side-cart-total .side-cart-txt b").text("$"+price.toFixed(2).replace(/\.?0+$/,''));
        $("#header span.count").text( count);
        $("#aside_right dl.side-cart-list > dt").text(count+' '+(count>1?gettext('items'):gettext('item')));
        
        $(".side-cart-total").show();
        $(".side-cart-list").show();
        $(".side-cart-empty").hide();
    
        $("#header a.cart").trigger("click");
    }

    function checkout(number_id, require_login) {
        if( require_login ) {
            $.dialog('popup.sign.signup').open();
        } else {
            $.post('/rest-api/v1/things/vanity-number/add-to-cart', {'id': number_id}, function(response){
                if (response) {
                    console.log(response);
                    if (response.error_message) {
                        alert(response.error_message);
                    } else {
                        var params = {
                            "payment_gateway": 6,
                            "is_vanity": 'true'
                        };

                        $.ajax({
                            type : 'POST',
                            url  : '/rest-api/v1/checkout',
                            contentType: "application/json; charset=utf-8",
                            data : JSON.stringify(params),
                            processData : false,
                            success  : function(res){
                                document.location.href= "/vanity-number/checkout";
                            },
                            error : function(res) {
                                console.log(res);
                                if (res.responseText) {
                                    var json = JSON.parse(res.responseText)
                                    if (json.error) {
                                        alert(json.error);  
                                    }
                                }
                                searchResultClose();
                            }
                        });
                    }
                }
                searchResultClose();
            });
        }
    }

    function addToCart(number_id, require_login, is_mobile) {
        console.log(number_id);
        console.log();
        if( require_login ) {
            $.dialog('popup.sign.signup').open();
        } else {
            $.post('/rest-api/v1/things/vanity-number/add-to-cart', {'id': number_id}, function(response){
                if (response) {
                    console.log(response);
                    if (response.error_message) {
                        alert(response.error_message);
                    } else {
                        var args = {
                            'THING_ID':response.thing_id,
                            'ITEMCODE':response.id,
                            'THUMBNAIL_IMAGE_URL':response.image_url,
                            'ITEMNAME':response.title,
                            'QUANTITY':response.quantity,
                            'PRICE':response.item_price,
                            'OPTIONS':response.option,
                        };

                        if( is_mobile ) {
                            closePop();
                            updateCart(args);
                        } else {
                            Fancy.Cart.addItem(args);
                            Fancy.Cart.openPopup();
                        }
                    }
                }
                searchResultClose();
            });
        }
    }

    function getMoreSearchResult(mobile, is_opened_popup) {
        var page = $('.result li > .more').attr('next_page');
        var params = getParams({});
        params['pg'] = page;

        $('.vanity_result ul li:last-child').remove();
        $('.vanity_result .result ul').append($('<li class="loading"></li>'));

        $.get('/rest-api/v1/things/vanity-number/search', params, function(response){
            $('.vanity_result ul li:last-child').remove();
            if (response) {
                appendSearchResult(response, mobile, is_opened_popup);
            }
        });
    }

    function searchResultClose() {
        $('.vanity_result .result select').prop("selectedIndex", 0);
        $('.popup.vanity_result .result .text').val('');
        $.dialog("vanity_result").close();
    }

    $('.vanity .learn_more').click(function(e){
        $.dialog("vanity_learn").open();
    });

    $('.vanity .btn-search').click(function(e){
        searchNumber(false, false);
    });

    $('.vanity .search-frm .btn-blue').click(function(e){
        searchNumber(false, true);
    });

    $('.popup.things-v3').on('click', '.vanity .btn-search', function(e) {
        searchNumber(true, false);
    });

    $('.popup.vanity_result .ly-close').click(function(e){
        searchResultClose();
    });

    $('.popup.vanity_result').on('click', '.btn-search', function(e) {
        searchResultClose();
    });

    $('.popup.things-v3').on('click', '.vanity_result .btn-search', function(e) {
        $('.vanity_result').hide();
        $('.thing-info').show();
    });

    $('.popup.vanity_result').on('change', '.result select', function(e) {
        searchNumber(false, false);
    });

    $('.popup.vanity_result').on('keydown', '.result .text', function(e) {
        switch(e.which) {
            case 13:
                var term = $('.vanity_result .result .text').val();
                if( isExistTermValue(term) ){
                    $('.vanity #search').val(term);
                }
                searchNumber(false, false);
        }
    });

    $('.popup.things-v3').on('change', '.result select', function(e) {
        if( $('.popup.vanity_result .result select').prop("selectedIndex") === 0 ) return;
        searchNumber(true, false);
    });

    $('.popup.vanity_result').on('click', '.btn-checkout', function(e){
        checkout($(this).parent().attr('id'), $(this).closest('.popup').attr('require_login'));
    });

    $('.popup.vanity_result').on('click', '.add-to-cart', function(e){
        addToCart($(this).parent().attr('id'), $(this).closest('.popup').attr('require_login'), false);
    });

    $('.popup .vanity').on('click', '.add-to-cart', function(e){
        addToCart($(this).parent().attr('id'), $(this).closest('.popup').attr('require_login'), true);
    });

    $('.popup.vanity-number-detail').on('click', 'li > .more', function(e) {
        getMoreSearchResult(true, false);
    });

    $('.popup.vanity_result').on('click', 'li > .more', function(e) {
        getMoreSearchResult(false, false);
    });

    $('.popup.things-v3').on('click', 'li > .more', function(e) {
        getMoreSearchResult(false, true);
    });
});
