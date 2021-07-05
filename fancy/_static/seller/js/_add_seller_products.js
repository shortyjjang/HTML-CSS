jQuery(function($) {
    var $addul = $(".add_collection_item .list_item"), $addtpl = $addul.find('li:first'), $addbtn = $('.add_collection_item .btn-area .btn-add-items');

    var $dialog = $.dialog('add_collection_item')
    var _collectionID
    var _sellerID
    var _categoryID
    var _onAdd
    var _itemsLimit = -1
    var _includeAffiliate = true
    var _discounted_only = false
    var ajax

    $.openSellerProductsDialog = function(options) {
        if(options && options.onAdd) _onAdd = options.onAdd
        if(options && options.itemsLimit) _itemsLimit = options.itemsLimit
        $dialog.open();
        $('.add_collection_item').find('.list_item').empty().data('keyword', -1).end().find('input#add_search').val('').focus().trigger('keyup');
    }
    $.openCategoryProductsDialog = $.openSellerProductsDialog;

    $.readySellerProductsDialog = function(seller_id, collection_id, onAdd, includeAffiliate) {
        _collectionID = collection_id
        _sellerID = seller_id
        _onAdd = onAdd
        if(includeAffiliate!=null && includeAffiliate!=undefined) {
            _includeAffiliate = includeAffiliate
        }
    }
    $.readyCategoryProductsDialog = function(category_id, onAdd, includeAffiliate, discounted_only) {
        _collectionID = null
        _sellerID = null
        _categoryID = category_id
        _onAdd = onAdd
        if(includeAffiliate!=null && includeAffiliate!=undefined) {
            _includeAffiliate = includeAffiliate
        }
        if(discounted_only!=null && discounted_only!=undefined) {
            _discounted_only = discounted_only
        }
    }

    function loadPage(search, page) {
        var data = { include_affiliate: _includeAffiliate?"true":"false", per_page: '20', exclude_collection: _collectionID, page: page, sort:{sort:'id',ascending:'false'} };
        data["discounted_only"] = _discounted_only?"true":"false";

        var category_id = $(".add_collection_item select[name=category]").val();
        if(_categoryID) {
            category_id = _categoryID;
        }
        var sort_by = $(".add_collection_item select[name=sort_by]").val();
        var min_price = parseInt($( ".add_collection_item .price dd .amount .min" ).text());
        var max_price = parseInt($( ".add_collection_item .price dd .amount .max" ).text());
        if (search.length) {
            data['search[text]'] = search; data['search[field]'] = 'all';
            data['q'] = search;
        }
        if(category_id){
            data['category_id'] = category_id;
        }
        if(sort_by=='num_sold') {
            data['sort'] = {sort:'num_sold',ascending:'false'}
            data['order_by'] = 'popular'
        } else if(sort_by=='price_desc') {
            data['sort'] = {sort:'price',ascending:'false'}
            data['order_by'] = 'highprice'
        } else if(sort_by=='price_asc') {
            data['sort'] = {sort:'price',ascending:'true'}
            data['order_by'] = 'lowprice'
        } else {
            data['sort'] = {sort:'id',ascending:'false'}
        }
        if(max_price==1000) max_price="";
        if(min_price==1) min_price="";
        if(max_price && !min_price) min_price = "1"

        if(min_price || max_price){             
            var price = min_price+"-"+max_price;
            data["price_range"] = price;
            $( ".add_collection_item .price dt span").html( $( ".add_collection_item .price dd .amount").html() );
        }else{
            $( ".add_collection_item .price dt span").html("Any Price");
        }

        if(ajax) try{ajax.abort();}catch(e){}
        var url = null;
        if(_sellerID) {
            url = '/rest-api/v1/seller/'+_sellerID+'/products/';
        } else {
            url = '/rest-api/v1/search/saleitems/';
        }
        ajax = $.get(url, data).done(function(json) {
            if ($addul.data('keyword') != search) return;

            json.products = json.products || json.sale_items;
            $addul.removeClass('loading');
            if (page == 1){
                $addul.empty();
                if(!json.products.length){
                    $addul.append('<li class="empty">There are no results matching your request</li>');
                }
            }
            if(window.current_ids == null || window.current_ids == undefined) window.current_ids = {}
            $.each(json.products, function(idx, item) {
                if ((item.id || item.sale_id) in window.current_ids || !item.images.length) return true;
                $addtpl.clone().data('item', item)
                    .find('img').css('background-image', "url('" + (item.images[0].url_310 || item.images[0].thumb_image_url_310) + "')").end()
                    .find('span.title b').text(item.title).end()
                    .find('span.title small').text('$' + (item.price || item.fancy_price)).end()
                    .find('span.sku').text(item.id_str || item.sale_id).end()
                    .appendTo($addul);
            });

            if (json.next_page_num) {
                $addul.data('next', json.next_page_num);
            } else {
                if (json.current_page < json.max_page) {
                    $addul.data('next', json.current_page+1);
                } else {
                    $addul.data('next', null);
                }
            }
        }).fail(function(xhr) {
            if(xhr.status){
                alertify.alert("Failed to load the items");
            }
        });
    }
    $('.add_collection_item').on('keyup', '#add_search', function() {
        var search = $.trim($(this).val());
        if ($addul.data('keyword') == search) return;
        $addul.addClass('loading').data('keyword', search).data('next', null).empty();
        $addbtn.prop('disabled', true).text('Add Items');
        loadPage(search, 1);
    }).on("click", ".list_item > li a", function() {
        var $li = $(this).closest("li");
        if(!$li.hasClass("selected") && _itemsLimit>=0 && $('.add_collection_item .list_item > li.selected').length>=_itemsLimit) {
            return
        }
        $li.toggleClass("selected");
        var $sel = $addul.find("li.selected");
        if ($sel.length) {
            $addbtn.prop("disabled", false).text(($sel.length == 1) ? "Add 1 Item" : ("Add " + $sel.length + " Items"));
        } else {
            $addbtn.prop("disabled", true).text("Add Items");
        }
    }).on("click", ".btn-area .btn-add-items", function() {
        if(_onAdd) {
            var $selected = $addul.find("li.selected"), $items = $(".item-order"); 
            _onAdd($selected,$items)
        }
        $.dialog('add_collection_item').close();
    }).on('click', ".select-all", function(e){
        e.preventDefault();
        $(".add_collection_item li:not(.selected) a").trigger('click');
    }).on('click', ".deselect-all", function(e){
        e.preventDefault();
        $(".add_collection_item li.selected a").trigger('click');
    })

    $(".add_collection_item .list_item").scroll(function() {
        var $this = $(this), search = $this.data('keyword'), next = $this.data('next');
        if (next && !($this.hasClass('loading'))) {
            if (this.scrollHeight - $this.outerHeight() - 10 < $this.scrollTop()) {
                $this.addClass('loading');
                loadPage(search, next);                
            }
        }
    });

    $(".add_collection_item select[name=category]" ).change(function(e){
        var label = $(this).find("option:selected").text(), search = $(".add_collection_item .list_item").data('keyword');
        $(this).prev().text(label);
        loadPage(search, 1);
    }); 
    $(".add_collection_item select[name=sort_by]" ).change(function(e){
        var label = $(this).find("option:selected").text(), search = $(".add_collection_item .list_item").data('keyword');
        $(this).prev().text(label);
        loadPage(search, 1);
    }); 

    $(".add_collection_item .price .trick" ).click(function(e){
        $(this).closest('dl').removeClass('opened');
    });

    $(".add_collection_item #slider-range" ).slider({
        range: true,
        min: 0,
        max: 1000,
        step: 10,
        values: [ parseInt($( ".add_collection_item .price .amount .min" ).text()), parseInt($( ".add_collection_item .price .amount .max" ).text()) ],
        slide: function( event, ui ) {
            if(ui.values[1]-ui.values[0] < 10) return false;;
            $( ".add_collection_item .price dd .amount .min" ).text( ui.values[ 0 ] || 1);
            $( ".add_collection_item .price dd .amount .max" ).text( ui.values[ 1 ] + (ui.values[1]==1000?"+":""));
        },
        change: function( event, ui ) {
            var search = $(".add_collection_item .list_item").data('keyword');
            loadPage(search, 1);
        }
    });
})
