$(function() {
    var products = [];
    var searched_items = [];
    var is_searching = false;

    var render_in_product_list = function(new_item) {
        is_selected = false;
        $('.preview-holder ol.stream li').each(function() {
            if ($(this).attr('tid') == new_item.id) {
                is_selected = true;
                return false;
            }
        });

        var clone_base = $('.clones li.product-item');
        var product_view = $('.product ol.stream');

        var new_cell = clone_base.clone();
        new_cell.attr('tid', new_item.id);
        new_cell.attr('tname', new_item.name);
        new_cell.attr('timage', new_item.image_url_original);
        new_cell.find('a span.figure').css('background-image', 'url(' +new_item.thumb_image_url_200+ ')');
        var title = new_item.name;
        for(var i in new_item.sales) {
            var sale = new_item.sales[i];
            title = title + ' - ' + '$'+sale.deal_price;
            break;
        }
        new_cell.attr('title', title);
        if(is_selected)
            new_cell.find('a').addClass('on');

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
        var product_view = $('.product ol.stream');
        product_view.empty();
    };

    var clear_preview_list = function() {
        preview = [];
        var preview_view = $('.preview-holder ol.stream');
        preview_view.empty();
        $('.preview-holder').hide();
    };

    var update_preview_auxiliaries = function() {
        var item_count = $('.preview-holder ol.stream li').length;
        if(item_count > 0)
            $('.preview-holder').show();
        else
            $('.preview-holder').hide();

        var sub = menu.sub;

        if (sub == 'boutique') {
            layout_preview_items();
        } else if (sub == 'lookbook') {
            if (item_count > 1) {
                $('.preview-holder a.prev-item').show();
                $('.preview-holder a.next-item').show();
            } else {
                $('.preview-holder a.prev-item').hide();
                $('.preview-holder a.next-item').hide();
            }
        } else if (sub == 'shop-the-post') {
            var selected_size = $('.widget .option select.widget-size option:selected').val();
            var size_option = selected_size.split('-');
            var items_per_page = size_option[1];
            if (item_count > items_per_page) {
                $('.preview-holder a.prev-page').show();
                $('.preview-holder a.next-page').show();
            } else {
                $('.preview-holder a.prev-page').hide();
                $('.preview-holder a.next-page').hide();
            }
        }

    };

    var add_preview_item = function(thing_id) {
        var preview_item = $('.clones li.preview-item').clone();
        var preview_view = $('.preview-holder ol.stream');

        var item = get_item_by_thing_id(thing_id);
        if (item == null) return false;

        preview_item.attr('tid', item.id);
        preview_item.attr('tname', item.name);
        preview_item.attr('timage', item.image_url_original);
        preview_item.attr('username', item.user.username);
        preview_item.find('a').attr('href', item.url);

        var sub = menu.sub;
        if (sub == 'shop-the-post')
            preview_item.find('a span.figure').css('background-image', 'url(' +item.image_url_original+ ')');
        preview_item.find('figcaption a').attr('href', item.url);
        preview_item.find('figcaption a').text(item.name);
        preview_item.find('.username a').text(item.user.username);
        preview_item.find('.username a').attr('href', "/" + item.user.username);
        preview_item.find('.figure-item span.figure img').attr('src', item.image_url_original);

        var has_sale = false;
        for(var i in item.sales) {
            var sale = item.sales[i];
            preview_item.attr('price', sale.deal_price);
            preview_item.find('figcaption b.price').text('$'+sale.deal_price);
            preview_item.find('.username a').text(sale.sale_item_seller.brand_name);
            has_sale = true;
            break;
        }

        if (!has_sale) {
            preview_item.find('figcaption b.price').text('');
        }

        refresh_preview_item(preview_item);
        preview_view.append(preview_item);

        var preview_length = $('.preview-holder ol.stream li').length;
        update_paging(1, preview_length);
        update_preview_auxiliaries();

        return false;
    };

    var remove_preview_item = function(thing_id) {
        var selected_item = null
        var total = 0;
        var current_index = $('.preview-holder ol.stream').attr('current-index');
        var show_other_items = false;
        var sub = menu.sub;

        $('.preview-holder ol.stream li').each(function(index, element) {
            var preview = $(this);
            if(preview.attr('tid') == thing_id)
                selected_item = preview;
            if ( current_index != undefined && parseInt(current_index) == index )
                show_other_items = true;
        });

        $('.widget .product ol.stream li').each(function() {
            if($(this).attr('tid') == thing_id) {
                if($(this).find("a").hasClass("on"))
                    $(this).find("a").removeClass("on");
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

            var selected_size = $('.widget .option select.widget-size option:selected').val();
            var size_option = selected_size.split('-');
            var items_per_page = size_option[1];
            var left_val = $('.preview-holder ol.stream').css('left');
            var current_page = parseInt(left_val.substr(0, left_val.length-2)) / -(160*items_per_page);
            var total_items = $('.preview-holder ol.stream li').length;
            var has_remaining = false;
            var last_page = parseInt(total_items/items_per_page) - 1;
            if (total_items % items_per_page) {
                has_remaining = true;
                last_page++;
            }
            if (current_page >= last_page && has_remaining == false && current_page != 0) {
                $('.widget .preview-holder .prev-page').click();
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
            url : 'list.json',
            dataType : 'json',
            data:param,
            success : function(json) {
                if (page == 0) {
                    $('.widget .product .stit small').text(json.item_total_count);
                    if(is_searching) {
                        clear_product_list(false);
                    } else {
                        clear_product_list(true);
                        clear_preview_list();
                        $('.preview-holder ol.stream').css('left', '0px');
                    }
                }
                fill_in_product_list(json.items, search);
                if(json.has_next_page) { $('.widget .product .load_more').show(); }
                else { $('.widget .product .load_more').hide(); }

                $('.widget .product .load_more').attr('current-page', page);
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
        return $('.widget .option ul.options input[name="show-title"]').is(':checked');
    };

    var get_show_price = function() {
       return $('.widget .option ul.options input[name="show-price"]').is(':checked');
    }

    var get_show_merchant = function() {
       return $('.widget .option ul.options input[name="show-merchant"]').is(':checked');
    }

    var get_auto_update = function() {
       return $('.widget .option ul.options input[name="auto-update"]').is(':checked');
    }

    var refresh_preview_item = function(preview) {
        var show_title = get_show_title();
        var show_price = get_show_price();
        var show_merchant = get_show_merchant();
        var auto_update = get_auto_update();
        var price = preview.attr('price');
        var has_price = false;
        var selected_option = $('.widget .option select.option-currency option:selected');
        var currency_code = selected_option.val();
        var symbol = selected_option.attr('symbol');
        var rate = selected_option.attr('rate');
        if (typeof price !== 'undefined' && price !== false)
            has_price = true;

        if(show_title)
            preview.find('figcaption > a').css( "display", "block");
        else
            preview.find('figcaption > a').hide();

        if(show_price && has_price) {
            if(currency_code == 'USD' && (price % 1 != 0) )
                preview.find('figcaption .figure-detail b.price').text(symbol + price);
            else
                preview.find('figcaption .figure-detail b.price').text(symbol + parseInt(price*rate));

            preview.find('figcaption .figure-detail b.price').show();
        }
        else
            preview.find('figcaption .figure-detail b.price').hide();

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

    $('.widget .option ul.options li input').on("change", function() {
        $('.preview-holder ol.stream li').each(function() {
            refresh_preview_item($(this));
        });

        return false;
    });

    $('.widget .option select.option-list').change( function() {
        var selected_list = $('.widget .option select.option-list option:selected').val();
        show_list_items(selected_list, 0, null);

        return false;
    });

    var layout_preview_items = function() {
        var selected_size = $('.widget .option select.widget-size option:selected').val();
        var size_option = selected_size.split('-');
        var size = size_option[1];
        if(size_option[0] == 'post') {
            $('.preview-holder .slide').css('width', 160*size-10);
            $('.preview-holder a.prev-page').css('left', 435+(-size*80));
            $('.preview-holder a.next-page').css('right', 435+(-size*80));
            $('.preview-holder ol.stream').css('left', '0px');
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
            $('.preview-holder .slide').css('width', width);
            $('.preview-holder .slide').css('height', height);
            $('.preview-holder .slide').css('margin-left', left_margin);

            $('.preview-holder ol.stream li').each( function() {
                $(this).css('width', width);
                $(this).find('div.figure-item').css('width', width);
                $(this).find('span.figure img').css('max-width', image_size);
                $(this).find('span.figure img').css('max-height', image_size);
                $(this).find('figure').css('line-height', image_size);
            });

            $('.preview-holder .prev-item').css('left', arrow_gap);
            $('.preview-holder .next-item').css('right', arrow_gap);

            //update sample size
            var $sample = $('.clones .preview-item');
            $sample.css('width', width);
            $sample.find('div.figure-item').css('width', width);
            $sample.find('span.figure img').css('max-width', image_size);
            $sample.find('span.figure img').css('max-height', image_size);
            $sample.find('figure').css('line-height', image_size);
        } else {
            var $preview_holder = $('.preview-holder ol');
            if(size == 1) {
                $preview_holder.addClass('column-1');
                $preview_holder.removeClass('column-2');
                $preview_holder.removeClass('column-3');
                $preview_holder.removeClass('column-4');
            } else if (size == 2) {
                $preview_holder.removeClass('column-1');
                $preview_holder.addClass('column-2');
                $preview_holder.removeClass('column-3');
                $preview_holder.removeClass('column-4');
            } else if (size == 3) {
                $preview_holder.removeClass('column-1');
                $preview_holder.removeClass('column-2');
                $preview_holder.addClass('column-3');
                $preview_holder.removeClass('column-4');
            } else {
                $preview_holder.removeClass('column-1');
                $preview_holder.removeClass('column-2');
                $preview_holder.removeClass('column-3');
                $preview_holder.addClass('column-4');
            }
        }
    };

    $('.widget .option select.widget-size').change( function() {
        layout_preview_items();
        update_preview_auxiliaries();
        return false;
    });

    $('.widget .option select.option-currency').change( function() {
        var selected_option = $('.widget .option select.option-currency option:selected');
        var currency_code = selected_option.val();
        var rate = selected_option.attr('rate');
        if (typeof rate !== 'undefined' && rate !== false) {
            $('.preview-holder ol.stream li').each(function() {
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
                $('.preview-holder ol.stream li').each(function() {
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
        $('.preview-holder ol.stream li').each( function(index, element) {
           if (index == display_index) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });

        update_paging(display_index+1, $('.preview-holder ol.stream li').length);
        $('.preview-holder ol.stream').attr('current-index', display_index);
    }

    $('.widget .preview-holder .prev-item').click( function(event) {
        event.preventDefault();
        var total_items = $('.preview-holder ol.stream li').length;
        var current_index = parseInt($('.preview-holder ol.stream').attr('current-index'));
        if (current_index > 0) {
            show_item_at_index(current_index-1);
        } else {
            show_item_at_index(total_items-1);
        }
        return false;
    });

    $('.widget .preview-holder .next-item').click( function(event) {
        event.preventDefault();
        var total_items = $('.preview-holder ol.stream li').length;
        var current_index = parseInt($('.preview-holder ol.stream').attr('current-index'));
        if (total_items > current_index + 1) {
            show_item_at_index(current_index+1);
        } else {
            show_item_at_index(0);
        }
        return false;
    });

    $('.widget .preview-holder .prev-page').click( function() {
        var selected_size = $('.widget .option select.widget-size option:selected').val();
        var size_option = selected_size.split('-');
        var items_per_page = size_option[1];
        var left_val = $('.preview-holder ol.stream').css('left');
        var current_page = parseInt(left_val.substr(0, left_val.length-2)) / -(160*items_per_page);
        if (current_page > 0) {
            $('.preview-holder ol.stream').css('left', -(160*items_per_page*(current_page-1)) + 'px')
        } else {
            var total_items = $('.preview-holder ol.stream li').length;
            var last_page = parseInt(total_items/items_per_page);
            if (total_items % items_per_page) last_page++;
            $('.preview-holder ol.stream').css('left', -(160*items_per_page*(last_page-1)) + 'px')
        }
        return false;
    });

    $('.widget .preview-holder .next-page').click( function() {
        var total_items = $('.preview-holder ol.stream li').length;
        var selected_size = $('.widget .option select.widget-size option:selected').val();
        var size_option = selected_size.split('-');
        var items_per_page = size_option[1];
        var left_val = $('.preview-holder ol.stream').css('left');
        var current_page = parseInt(left_val.substr(0, left_val.length-2)) / -(160*items_per_page);
        if (total_items > (current_page + 1) * items_per_page) {
            $('.preview-holder ol.stream').css('left', -(160*items_per_page*(current_page+1)) + 'px')
        } else {
            $('.preview-holder ol.stream').css('left', '0px')
        }
        return false;
    });

    $('.widget .product .search input').keypress(function(e) {
        var term = $(this).val();
        var selected_list = $('.widget .option select.option-list option:selected').val();
        if(e.which == 13 && term.length > 0) {
            show_list_items(selected_list, 0, term);
        }
    });

    $('.widget .product .search input').on("change", function() {
        if($(this).val().length <= 0) {
            is_searching = false;
            clear_product_list(false);
            for (i in products) {
                render_in_product_list(products[i]);
            }
        }
    });

    $('.widget .product .load_more').on("click", "a", function(event) {
        $('.widget .product .load_more').hide();
        var selected_list = $('.widget .option select.option-list option:selected').val();

        var search_term = $('.widget .product .search input').val();
        if(search_term.length <= 0)
            search_term = null;

        var page = parseInt($('.widget .product .load_more').attr('current-page')) + 1;
        show_list_items(selected_list, page, search_term);

        return false;
    });

    $('.widget .product ol.stream').on("click", "a.product-list-item", function(event) {
        event.preventDefault();
        var thing_id = $(this).parents("li").attr('tid');
        if ($(this).hasClass("on")) {
            remove_preview_item(thing_id);
        } else {
            $(this).addClass("on");
            add_preview_item(thing_id);
        }
        return false;
    });

    $('.widget .preview-holder ol.stream').on("click", "a.delete-preview-item", function(event) {
        var thing_id = $(this).parents('li').attr('tid');

        remove_preview_item(thing_id);
        return false;
    });

    $('.widget .option .btn-code').click(function() {
        var thing_ids = [];
        $('.widget .preview-holder ol.stream li').each( function() {
            thing_ids.push($(this).attr('tid'));
        })

        if (thing_ids.length <= 0) {
            alertify.alert(gettext("Please select things to generate widget code."));
            return false;
        }
        var sub = menu.sub;
        var selected_size = $('.widget .option select.widget-size option:selected').val();
        var size_option = selected_size.split('-');
        var size = size_option[1];

        var width = 0;
        var height = 0;
        var widget_type = 0;
        var type = ''
        var currency_code = $('.widget .option select.option-currency option:selected').val();

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
            url : 'generate_code.json',
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
        var selected_list = $('.widget .option select.option-list option:selected').val();
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

