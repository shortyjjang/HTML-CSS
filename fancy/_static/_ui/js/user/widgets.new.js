$(function() {
    var products = [];
    var searched_items = [];
    var is_searching = false;
    var menu = {main:'widgets', sub:'shop-the-post'}
    var $previewHolder = $(".preview-holder");

    var render_in_product_list = function(new_item) {
        is_selected = false;
        $previewHolder.find('ol.stream li.preview-item').each(function() {
            if ($(this).attr('tid') == new_item.id) {
                is_selected = true;
                return false;
            }
        });

        var clone_base = $('.clones li.stream-item');
        var product_view = $('.step1 ol.stream');

        var new_cell = clone_base.clone();
        new_cell.attr('tid', new_item.id);
        new_cell.attr('tname', new_item.name);
        new_cell.attr('timage', new_item.image_url_original);
        new_cell.find('figure').css('background-image', 'url(' +new_item.image_url+ ')');
        var title = new_item.name, price, commission;
        for(var i in new_item.sales) {
            var sale = new_item.sales[i];
            price =  '$'+sale.deal_price;
            commission = '$'+(parseFloat(sale.deal_price)*0.1).toFixed(2);
            break;
        }
        new_cell.find('a.title').text(title);
        new_cell.find('.price').text(price);
        new_cell.find('.commission').text(commission);
        new_cell.attr('title', title);
        
        if(is_selected)
            new_cell.find('.figure-item').addClass('selected');

        product_view.append(new_cell);
    }

    var fill_in_product_list = function(items, search) {
        for (i in items) {
            var new_item = items[i];
            var list = products;
            if (search)
                list = searched_items;

            if (_.find(list, function(item){ return item.id == new_item.id }) == undefined )
                list.push(new_item);

            render_in_product_list(new_item);
        }
    };

    var clear_product_list = function(clear_data) {
        if(clear_data)
            products = [];
        var product_view = $('.step1 ol.stream');
        product_view.empty();
    };

    var clear_preview_list = function() {
        preview = [];
        var preview_view = $previewHolder.find('ol.stream');
        preview_view.empty();
    };

    var update_preview_auxiliaries = function() {
        var item_count = $previewHolder.find('ol.stream li').length;
        $previewHolder.find('.ltit small').text('('+item_count+' Products)');

        var sub = menu.sub;

        layout_preview_items();
        $previewHolder.removeClass('shop-post boutique lookbook');
        if (sub == 'boutique') {
            $previewHolder.addClass('boutique').find('.ltit span').text('Boutique');
            $previewHolder.find('a.prev-page').hide();
            $previewHolder.find('a.next-page').hide();
        } else if (sub == 'lookbook') {
            $previewHolder.addClass('lookbook').find('.ltit span').text('Lookbook');
            if (item_count > 1) {
                $previewHolder.find('a.prev-page').show();
                $previewHolder.find('a.next-page').show();
            } else {
                $previewHolder.find('a.prev-page').hide();
                $previewHolder.find('a.next-page').hide();
            }
        } else if (sub == 'shop-the-post') {
            $previewHolder.addClass('shop-post').find('.ltit span').text('Shop The Post');
            var selected_size = $('.widget .filter select.widget-size[name="shop-the-post"]').val();
            var size_option = selected_size.split('-');
            var items_per_page = size_option[1];
            if (item_count > items_per_page) {
                $previewHolder.find('a.prev-page').show();
                $previewHolder.find('a.next-page').show();
            } else {
                $previewHolder.find('a.prev-page').hide();
                $previewHolder.find('a.next-page').hide();
            }
        }

    };

    var add_preview_item = function(thing_id) {
        var preview_item = $('.clones li.preview-item').clone();
        var preview_view = $previewHolder.find('ol.stream');

        var item = get_item_by_thing_id(thing_id);
        if (item == null) return false;

        preview_item.attr('tid', item.id);
        preview_item.attr('tname', item.name);
        preview_item.attr('timage', item.image_url_original);
        preview_item.attr('username', item.user.username);
        preview_item.find('a').attr('href', item.url);

        preview_item.find('.figure-item span.figure').css('background-image', 'url(' +item.image_url_original+ ')');
        preview_item.find('figcaption a').attr('href', item.url);
        preview_item.find('figcaption a').text(item.name);
        preview_item.find('.username a').text(item.user.username);
        preview_item.find('.username a').attr('href', "/" + item.user.username);
        preview_item.find('.figure-item span.figure img').attr('src', item.image_url_original);

        var has_sale = false;
        for(var i in item.sales) {
            var sale = item.sales[i];
            preview_item.attr('price', sale.deal_price);
            preview_item.find('figcaption .price').text('$'+sale.deal_price);
            preview_item.find('.username a').text(sale.sale_item_seller.brand_name);
            has_sale = true;
            break;
        }

        if (!has_sale) {
            preview_item.find('figcaption .price').text('');
        }

        refresh_preview_item(preview_item);
        preview_view.append(preview_item);

        var preview_length = $previewHolder.find('ol.stream li').length;
        update_paging(1, preview_length);
        update_preview_auxiliaries();

        return false;
    };

    var remove_preview_item = function(thing_id) {
        var selected_item = null
        var total = 0;
        var current_index = $previewHolder.find('ol.stream').attr('current-index');
        var show_other_items = false;
        var sub = menu.sub;

        $previewHolder.find('ol.stream li').each(function(index, element) {
            var preview = $(this);
            if(preview.attr('tid') == thing_id)
                selected_item = preview;
            if ( current_index != undefined && parseInt(current_index) == index )
                show_other_items = true;
        });

        $('.widget .step1 ol.stream li').each(function() {
            if($(this).attr('tid') == thing_id) {
                if($(this).find(".figure-item").hasClass("selected"))
                    $(this).find(".figure-item").removeClass("selected");
                return false;
            }
        });

        if (selected_item == null) return false;

        selected_item.remove();

        if (sub == 'lookbook') {
            if (show_other_items) {
                var index = 0;
                if(parseInt(current_index) > 0)
                    index = current_index - 1;
                show_item_at_index(index);
            }
        } else if (sub == 'shop-the-post') {
            // if in the last page and no item exists in last page, show previous page.

            var selected_size = $('.widget .filter select.widget-size[name=shop-the-post] option:selected').val();
            var size_option = selected_size.split('-');
            var items_per_page = size_option[1];
            var left_val = $previewHolder.find('ol.stream').css('left');
            var current_page = parseInt(left_val.substr(0, left_val.length-2)) / -(160*items_per_page);
            var total_items = $previewHolder.find('ol.stream li').length;
            var has_remaining = false;
            var last_page = parseInt(total_items/items_per_page) - 1;
            if (total_items % items_per_page) {
                has_remaining = true;
                last_page++;
            }
            if (current_page >= last_page && has_remaining == false && current_page != 0) {
                $previewHolder.find('.prev-page').click();
            }
        }

        update_preview_auxiliaries();
        return false;
    };

    var get_item_by_thing_id = function(thing_id) {
        var item;
        var list = products;
        if (is_searching) {
            list = searched_items;
        }
        for( i=0; i < list.length; i++) {
            product = list[i];
            if (product.id == thing_id) {
                return product;
            }
        }
        return null;
    };

    var show_list_items = function(list_id, page, search_term) {
        var param = {'list_id':list_id, 'page':page}
        var search = false;
        if (search_term != null && search_term.length > 0) {
            param['search_term'] = search_term;
            search = true;
        }
        is_searching = search;

        showLoading();
        $.ajax({
            type : 'GET',
            url : 'widgets/list.json',
            dataType : 'json',
            data:param,
            success : function(json) {
                if (page == 0) {
                    if(is_searching) {
                        clear_product_list(false);
                    } else {
                        clear_product_list(true);
                        clear_preview_list();
                        $previewHolder.find('ol.stream').css('left', '0px');
                    }
                    $(".content").scrollTop(0);
                }
                fill_in_product_list(json.items, search);
                if(json.has_next_page) { $('.widget .step1 .load_more').show(); }
                else { $('.widget .step1 .load_more').hide(); }

                $('.widget .step1 .load_more').attr('current-page', page);
                stopLoading();
            },
            error: function() {
                stopLoading();
            }
        });
    };

    var update_paging = function(current, total) {
        var page = $('.paging');
        if(page) {
            page.text(current + " of " + total);
            if (total <= 0) {
                page.hide();
            } else {
                page.show();
            }
        }
    };

    var get_show_title = function() {
        return $('.widget .filter .options [name="show-title"]').hasClass('on');
    };

    var get_show_price = function() {
       return $('.widget .filter .options [name="show-price"]').hasClass('on');
    }

    var get_show_merchant = function() {
       return $('.widget .filter .options [name="show-merchant"]').hasClass('on');
    }

    var refresh_preview_item = function(preview) {
        var show_title = get_show_title();
        var show_price = get_show_price();
        var show_merchant = get_show_merchant();
        var price = preview.attr('price');
        var has_price = false;
        var selected_option = $('.widget .filter select.option-currency option:selected');
        var currency_code = selected_option.val();
        var symbol = selected_option.attr('symbol');
        var rate = selected_option.attr('rate');
        if (typeof price !== 'undefined' && price !== false)
            has_price = true;

        if(show_title)
            preview.find('figcaption > a').css( "display", "block");
        else
            preview.find('figcaption > a').hide();

        if(!show_price && !show_title) 
                preview.find('figcaption').hide();
        else
                preview.find('figcaption').show();

        if(show_price && has_price) {
            if(currency_code == 'USD' && (price % 1 != 0) )
                preview.find('figcaption .price').text(symbol + price);
            else
                preview.find('figcaption .price').text(symbol + parseInt(price*rate));

            preview.find('figcaption .price').show();
        }
        else
            preview.find('figcaption .price').hide();

        if(show_merchant)
            preview.find('figcaption .figure-detail span.username a').show();
        else
            preview.find('figcaption .figure-detail span.username a').hide();

        if(show_merchant && show_price && has_price)
            preview.find('figcaption .figure-detail span.username i').show();
        else
            preview.find('figcaption .figure-detail span.username i').hide();

        return false;
    }
    
    $('.widget .filter .options li .btn-switch').on('click', function(e){
        $(this).toggleClass('on');
        $previewHolder.find('ol.stream li').each(function() {
            refresh_preview_item($(this));
        });
    })

    var layout_preview_items = function() {
        if( !$(".step2").is(":visible") ) return;

        var selected_size = $('.widget .filter select.widget-size:visible option:selected').val();
        var size_option = selected_size.split('-');
        var size = size_option[1];
        if(size_option[0] == 'post') {
			var column = 1;
			var itemSize = 184;
			if (size == 2) column = 2;
			if (size == 4) itemSize = 320;
			if (size == 5) itemSize = 400;
            $previewHolder.find('.slide').css({'width': itemSize*column, height:''}).find('ol.stream').css({'left':'0px', 'width':(itemSize* $previewHolder.find('ol.stream li').length)+'px'}).find('.figure-item').width(itemSize - 14);
        } else if (size_option[0] == 'lookbook') {
            var width = '660px';
            var height = '500px';
            var image_size = '400px';
            var left_margin = '30px';
            var arrow_gap = '55px';
            if (size == 1) {
                width = '300px';
                height = '300px';
                image_size = '200px';
                left_margin = '210px';
                arrow_gap = '175px';
            } else if (size == 2) {
                width = '500px';
                height = '420px';
                image_size = '320px';
                left_margin = '110px';
                arrow_gap = '105px';
            }
            $previewHolder.find('.slide').css('width', image_size);
            $previewHolder.find('.slide').css('height', height);
            
            $previewHolder.find('ol.stream').css({'left':'0px', 'width':( parseInt(width) * $previewHolder.find('ol.stream li').length)+'px'});
            $previewHolder.find('ol.stream li').each( function() {
                $(this).css('width', image_size);
                $(this).find('div.figure-item').css('width', image_size);
                $(this).find('span.figure').css('width', image_size);
                $(this).find('span.figure').css('height', image_size);
            });

            //update sample size
            var $sample = $('.clones .preview-item');
            $sample.css('width', image_size);
            $sample.find('div.figure-item').css('width', image_size);
            $sample.find('span.figure').css('width', image_size);
            $sample.find('span.figure').css('height', image_size);
        } else {
            $previewHolder
                .find('.slide, ol.stream, ol.stream li, ol.stream li .figure-item, ol.stream li .figure').css({left:'', width:'', height:''}).end()
            var $preview_holder = $previewHolder.find('ol');
            if(size == 1) {
                $preview_holder.removeClass('column-1 column-2 column-3 column-4');
                $preview_holder.addClass('column-1');
            } else if (size == 2) {
                $preview_holder.removeClass('column-1 column-2 column-3 column-4');
                $preview_holder.addClass('column-2');
            } else if (size == 3) {
                $preview_holder.removeClass('column-1 column-2 column-3 column-4');
                $preview_holder.addClass('column-3');
            } else {
                $preview_holder.removeClass('column-1 column-2 column-3 column-4');
                $preview_holder.addClass('column-4');
            }
        }
    };

    $('.widget .filter .type select').change(function(){
        var type = $(this).val();
        menu.sub = type;
        $('.widget .filter .size select').hide();
        $('.widget .filter .size select[name='+type+']').show();
        update_preview_auxiliaries();
    })

    $('.widget .category select.option-list').change( function() {
        var selected_list = $('.widget .category select.option-list option:selected').val();
        show_list_items(selected_list, 0, null);
        return false;
    });

    $('.widget .filter select.widget-size').change( function() {
        update_preview_auxiliaries();
        return false;
    });

    $('.widget .filter select.option-currency').change( function() {
        var selected_option = $('.widget .filter select.option-currency option:selected');
        var currency_code = selected_option.val();
        var rate = selected_option.attr('rate');
        if (typeof rate !== 'undefined' && rate !== false) {
            $previewHolder.find('ol.stream li').each(function() {
                refresh_preview_item($(this));
            });

        } else {
            $.ajax({
            type : 'GET',
            url : '/convert_currency.json',
            dataType : 'json',
            data:{amount:1.0, currency_code:currency_code},
            success : function(json) {
                selected_option.attr('rate', json.amount);
                $previewHolder.find('ol.stream li').each(function() {
                    refresh_preview_item($(this));
                });
                },
            error: function() {
                }
            });
        }
        return false;
    });

    var show_item_at_index = function (display_index) {
        $previewHolder.find('ol.stream li').each( function(index, element) {
           if (index == display_index) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });

        update_paging(display_index+1, $previewHolder.find('ol.stream li').length);
        $previewHolder.find('ol.stream').attr('current-index', display_index);
    }

    $previewHolder.find('.prev-page').click( function(e) {
        e.preventDefault();
        var selected_size = $('.widget .filter select.widget-size:visible option:selected').val();
        var size_option = selected_size.split('-');
        var items_per_page = size_option[1];
        if(size_option[0] == 'lookbook') items_per_page = 1;
        var item_width = $previewHolder.find('ol.stream li:eq(0)').width();
        var left_val = $previewHolder.find('ol.stream').css('left');
        var current_page = parseInt(left_val.substr(0, left_val.length-2)) / -(item_width*items_per_page);
        if (current_page > 0) {
            $previewHolder.find('ol.stream').css('left', -(item_width*items_per_page*(current_page-1)) + 'px')
        } else {
            var total_items = $previewHolder.find('ol.stream li').length;
            var last_page = parseInt(total_items/items_per_page);
            if (total_items % items_per_page) last_page++;
            $previewHolder.find('ol.stream').css('left', -(item_width*items_per_page*(last_page-1)) + 'px')
        }
    });

    $previewHolder.find('.next-page').click( function(e) {
        e.preventDefault();
        var total_items = $previewHolder.find('ol.stream li').length;
        var selected_size = $('.widget .filter select.widget-size:visible option:selected').val();
        var size_option = selected_size.split('-');
        var items_per_page = size_option[1];
        if(size_option[0] == 'lookbook') items_per_page = 1;
        var item_width = $previewHolder.find('ol.stream li:eq(0)').width();
        var left_val = $previewHolder.find('ol.stream').css('left');
        var current_page = parseInt(left_val.substr(0, left_val.length-2)) / -(item_width*items_per_page);
        if (total_items > (current_page + 1) * items_per_page) {
            $previewHolder.find('ol.stream').css('left', -(item_width*items_per_page*(current_page+1)) + 'px')
        } else {
            $previewHolder.find('ol.stream').css('left', '0px')
        }
    });

    $('.widget .step1 .search input').keypress(function(e) {
        var term = $(this).val();
        var selected_list = $('.widget .category select.option-list option:selected').val();
        if(e.which == 13 && term.length > 0) {
            show_list_items(selected_list, 0, term);
        }
    });

    $('.widget .step1 .search input').on("change", function() {
        if($(this).val().length <= 0) {
            is_searching = false;
            clear_product_list(false);
            for (i in products) {
                render_in_product_list(products[i]);
            }
        }
    });

    $('.widget .step1 .load_more').on("click", "a", function(event) {
        $('.widget .step1 .load_more').hide();
        var selected_list = $('.widget .category select.option-list option:selected').val();

        var search_term = $('.widget .step1 .search input').val();
        if(search_term.length <= 0)
            search_term = null;

        var page = parseInt($('.widget .step1 .load_more').attr('current-page')) + 1;
        show_list_items(selected_list, page, search_term);

        return false;
    });

    $('.widget .step1 ol.stream').on("click", "a.selector", function(event) {
        event.preventDefault();
        var $this = $(this), $div = $this.closest('.figure-item'), tid = $this.closest('li').attr('tid');
        $div.toggleClass('selected');
        if( $div.hasClass('selected') ){
            add_preview_item(tid);
        }else{
            remove_preview_item(tid);
        }
    });

    $('.widget .step1 .all').click(function(e){
        e.preventDefault();
        $('.widget .step1 ol.stream li .figure-item:not(.selected) a.selector').trigger('click');
    })

    $previewHolder.find('ol.stream').on("click", "a.delete-preview-item", function(event) {
        event.preventDefault();
        var thing_id = $(this).parents('li').attr('tid');

        remove_preview_item(thing_id);
        return false;
    });

    function get_selected_thing_ids(){
        var thing_ids = [];
        $previewHolder.find('ol.stream li').each( function() {
            thing_ids.push($(this).attr('tid'));
        })
        return thing_ids;
    }

    $('.widget .btn-next').click(function(e){
        var thing_ids = get_selected_thing_ids();

        if (thing_ids.length <= 0) {
            alertify.alert(gettext("Please select things to preview widget."));
            return false;
        }
        $('.widget .step1').hide();
        $('.widget .step2').show();
        $('.preview-holder').removeClass('boutique shop-post lookbook');
        $('.widget .filter .type select').trigger('change');
    })

    $('.widget .btn-back').click(function(e){
        $('.widget .step2').hide();
        $('.widget .step1').show();
    })

    $('.widget .btn-code').click(function() {
        var thing_ids = get_selected_thing_ids();

        if (thing_ids.length <= 0) {
            alertify.alert(gettext("Please select things to generate widget code."));
            return false;
        }
        var sub = menu.sub;
        var selected_size = $('.widget .filter select.widget-size:visible option:selected').val();
        var size_option = selected_size.split('-');
        var size = size_option[1];

        var width = 0;
        var height = 0;
        var widget_type = 0;
        var type = ''
        var currency_code = $('.widget .filter select.option-currency option:selected').val();

        if (sub == 'shop-the-post') {
            widget_type = 0;
            if(size == 5) width = '970px';
            else if (size == 4) width = '810px';
            else if (size == 3) width = '650px';
            else if (size == 2) width = '490px';
            else width = '330px';
            height = '214px';
        }
        if (sub == 'lookbook') {
            widget_type = 1;
            if (size == 3) { width = '720px'; height = '554px'; }
            else if (size == 2) { width = '560px'; height = '474px'; }
            else { width = '360px'; height = '354px'; }
        }
        if(sub == 'boutique') {
            widget_type = 2;
            if (size == 4) { width = '620px'; }
            else { width = '540px'; }
            height = $('.preview-vertical .slide').css('height');
        }

        if (get_show_title()) type = type + 'st,';
        if (get_show_price()) type = type + 'sp,';
        if (get_show_merchant()) type = type + 'sm,';

        var param = {thing_ids:thing_ids.join(), widget_type:widget_type};

        $.ajax({
            type : 'GET',
            url : '/affiliate/widgets/generate_code.json',
            dataType : 'json',
            data:param,
            success : function(json) {
                //show popup
                var url = json['url'];
                var html = '<iframe src="'+url+'?cc='+currency_code+'&wtype='+widget_type+'&type='+type+'&size='+size+'" allowtransparency="true" scrolling="no" frameborder="0" width="'+width+'" height="'+height+'" style="width:'+width+';height:'+height+';margin:0 auto;border:0"></iframe>';
                $('.general-code textarea').text(html);
                $.dialog('popup.general-code').open();
                $('#popup_container').css('top', '0px');
            },
            error: function() {

            }
        });
        return false;
    });

    $('.general-code .btn-done').click(function () {
        $.dialog('popup.general-code').close();
        return false;
    });

    var main = menu.main;
    if (main == 'widgets') {
        var selected_list = $('.widget .category select.option-list option:selected').val();
        show_list_items(selected_list, 0, null);
    }

    function showLoading() {
        var $wrapper = $('#spinner-holder');
        if(!window.Modernizr || !Modernizr.csstransitions ){
            $wrapper.find('.spinner').show().end();
            $wrapper.addClass('loading');
            $wrapper.trigger('before-fadeout');
        } else {
            $wrapper.trigger('before-fadeout').addClass('anim').addClass('loading');
        }
    };

    function stopLoading() {
        var $wrapper = $('#spinner-holder');
        $wrapper.removeClass('loading');
    };
});

