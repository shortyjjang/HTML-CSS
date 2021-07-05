import { reactBridge } from './ReactBridge';


export function renderFeaturedItems(stream) {
    var $featuredList = $('.add_thing_item .featured ul');
    _.each(stream, function(item) {
        var $li = $('<li><input type="checkbox" /><label></label><img src="/_ui/images/common/blank.gif"></li>');
        $li.attr('data-tid', item.object.id_str);
        if (item.object.sales && item.object.sales[0]) {
            $li.attr('data-sid', item.object.sales[0].sale_id);
        }
        $li.find('img').css('background-image', 'url(' + item.object.thumb_image_url + ')');
        $featuredList.append($li);
    });
}

let requesting = false;
let cursor = null;
export const requestFeaturedItems = _.debounce(function(event, init) {
    const el = this;
    if (init || (requesting === false &&
                (el.scrollHeight - el.scrollTop - 10 <= el.clientHeight) && 
                 cursor != null)
    ) {
        requesting = true;
        $.get('/_admin/articles/featured.json?limit=150&cursor=' + (cursor || ''), function(json) {
            if (json.stream) {
                renderFeaturedItems(json.stream);
                cursor = json.next_cursor || null;
            }
            requesting = false;
        });
    }
}, 250);

export function attachExternalEvents() {
    $('.popup.add_thing_item').on('click', '.btn-save', function(e) {
        let itemIDList = $('.popup.add_thing_item .text').val().trim();
        var $selectedFeatured = $('.popup.add_thing_item .featured li.selected')
        if ($selectedFeatured.length === 0 && !itemIDList) {
            return;
        }

        $.get('/_admin/articles/validate_product_ids.json?ids=' + itemIDList)
            .then(function(res) {
                if (res.ids) {
                    itemIDList = res.ids.join(',');
                }
                var ids = _.map($selectedFeatured, function(item) {
                    var pid = window.isWhitelabel ? $(item).attr('data-sid') : $(item).attr('data-tid');
                    return pid;
                });
                ids = _.without(ids, undefined);
    
                var thing_ids = '';
                var idsStr = '';
                if (ids.length > 0) {
                    idsStr = ids.join(',')
                }
                if (itemIDList) {
                    itemIDList = itemIDList.split(',').map(e => e.trim()).join(',');
                    if (idsStr) {
                        thing_ids = itemIDList + ',' + idsStr;
                    } else {
                        thing_ids = itemIDList
                    }
                } else {
                    thing_ids = idsStr;
                }
                if (thing_ids) {
                    reactBridge(articleAdmin =>
                        articleAdmin.updateThingIds(thing_ids.split(','))
                    );
                }
                $('.popup.add_thing_item .text').val('');
                $.dialog('add-bio-items').close();
            })
            .fail(function() {
                alertify.alert('Failed to validate ID, please try again')
            });
    });

    $('.popup.add_thing_item .featured').on('click', 'ul > li:not(.selected)', function(e) {
        $(this).addClass('selected');
        $(this).find('input').prop('checked', 'checked');
    });

    $('.popup.add_thing_item .featured').on('click', 'ul > li.selected', function(e) {
        $(this).removeClass('selected');
        $(this).find('input').prop('checked', false);
    });

    $('.popup.add_thing_item .search .text').keyup(function(e){
        if (e.keyCode === 13) {
            $('.popup.add_thing_item .btn-save').click();
        }
    });
/*
    $('.popup.add_thing_item .featured .more').on('click', function(e) {
        var cursor = $(this).data('cursor');
        $.get('/_admin/articles/featured.json?cursor=' + cursor, function(json) {
            if (json.stream) {
                renderFeaturedItems(json.stream);
                if (json.next_cursor) {
                    $('.popup.add_thing_item .featured .more').data('cursor', json.next_cursor).show();
                } else {
                    $('.popup.add_thing_item .featured .more').hide();
                }
            }
        });
    });
*/
    
    $('.popup.add_thing_item .featured ul').on('scroll', requestFeaturedItems);
}
