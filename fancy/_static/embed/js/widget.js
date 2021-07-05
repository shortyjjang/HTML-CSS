jQuery(function($){
    $('.embed .widget .wrapper .prev-page').click( function(event) {
        event.preventDefault();
        var items_per_page = $('.embed .widget .wrapper').attr('size');
        var left_val = $('.embed .widget .wrapper ol.stream').css('left');
        var current_page = parseInt(left_val.substr(0, left_val.length-2)) / -(160*items_per_page);
        if (current_page > 0) {
            $('.embed .widget .wrapper ol.stream').css('left', -(160*items_per_page*(current_page-1)) + 'px')
        } else {
            var total_items = $('.embed .widget .wrapper ol.stream li').length;
            var last_page = parseInt(total_items/items_per_page);
            if (total_items % items_per_page) last_page++;
            $('.embed .widget .wrapper ol.stream').css('left', -(160*items_per_page*(last_page-1)) + 'px')
        }
        return false;
    });

    $('.embed .widget .wrapper .next-page').click( function(event) {
        event.preventDefault();
        var total_items = $('.embed .widget .wrapper ol.stream li').length;
        var items_per_page = $('.embed .widget .wrapper').attr('size');
        var left_val = $('.embed .widget .wrapper ol.stream').css('left');
        var current_page = parseInt(left_val.substr(0, left_val.length-2)) / -(160*items_per_page);
        if (total_items > (current_page + 1) * items_per_page) {
            $('.embed .widget .wrapper ol.stream').css('left', -(160*items_per_page*(current_page+1)) + 'px')
        } else {
            $('.embed .widget .wrapper ol.stream').css('left', '0px')
        }
        return false;
    });

    var update_paging = function(current, total) {
        var page = $('.embed .widget .wrapper .paging');
        if(page) {
            page.text(current + " of " + total);
            if (total <= 0) {
                page.hide();
            } else {
                page.show();
            }
        }
    };

    var show_item_at_index = function (display_index) {
        $('.embed .widget .wrapper ol.stream li').each( function(index, element) {
           if (index == display_index) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });

        update_paging(display_index+1, $('.embed .widget .wrapper ol.stream li').length);
        $('.embed .widget .wrapper ol.stream').attr('current-index', display_index);
    }

    $('.embed .widget .wrapper .prev-item').click( function(event) {
        event.preventDefault();
        var total_items = $('.embed .widget .wrapper ol.stream li').length;
        var current_index = parseInt($('.embed .widget .wrapper ol.stream').attr('current-index'));
        if (current_index > 0) {
            show_item_at_index(current_index-1);
        } else {
            show_item_at_index(total_items-1);
        }
        return false;
    });

    $('.embed .widget .wrapper .next-item').click( function(event) {
        event.preventDefault();
        var total_items = $('.embed .widget .wrapper ol.stream li').length;
        var current_index = parseInt($('.embed .widget .wrapper ol.stream').attr('current-index'));
        if (total_items > current_index + 1) {
            show_item_at_index(current_index+1);
        } else {
            show_item_at_index(0);
        }
        return false;
    });
});