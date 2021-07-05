/*
 * ======================================================================================
 * - SALE LISTINGS PAGE
 * ======================================================================================
 */

if(typeof expand_url == 'undefined'){
    function expand_url(url) {
        return url;
    }
}

// Expand or shrink each item when clicked
$('.sale-listings .tb-sales tbody .sale-header').each(function(){
	var cur = $(this);
	$(this).find('td').click(function(event){
		var $target = $(event.target);
		if ($target.is('a,input,button') || $target.parent().is('a,input,button')) {
			return true;
		}else{
			$(cur).toggleClass('current');
            var item_number = $(cur).attr('id');
			$('#' + item_number +'.sale-content').toggle();
			return false;
		}
	});
});

// Search button
$('.sale-listings .btn-search').click(function() {
    var filter_option = $('.search select.category option:selected').val();
    var search_option = $('.search select.target option:selected').val();
    if (search_option == 'assignee') {
        var search_keyword = $('.search select.assignee option:selected').val();
    }
    else {
        var search_keyword = $('.search input.keyword').val();
    }

    var url = "/admin/manage-po/sale-listings?"+search_option+"="+search_keyword;
    window.location.href = url;
});

// Search button works when Return key is pressed from search input
$('.sale-listings .search input.keyword').bind('keypress', function(e) {
    if (e.keyCode === 13) $('.btn-search').click();
});

// 'Actions' drop-down list at the top-right
$('.sale-listings .status').change(function() {
    if ($(this).val() == 1) {
        show_create_po();
    }
    if ($(this).val() == 2) {
        show_add_po();
    }
    $(this).val(-1);
    return false;
});

// Filter options drop-down list at the top-left
$('.sale-listings .category').change(function() {
    location.href = $(this).find('option:selected').attr('filter-url');
});

// Search option is given
$('.sale-listings .target').change(function() {
    if ($(this).val() == 'assignee') {
        $('.search .assignee').show();
        $('.search .keyword').hide();
    }
    else {
        $('.search .assignee').hide();
        $('.search .keyword').show();
    }
});

//  When a radio button of a warehouse is selected:
$('.sale-listings .sale-content .inventory-summary input[type="radio"]').change(function() {
    var warehouse_id = $(this).val();
    $('.sale-listings .sale-content .inventory-summary input[type="radio"]').val([warehouse_id]);

    $('.sale-listings .sale-content .active-po tr').each(function() {
        if ($(this).attr('warehouse-id') == warehouse_id || warehouse_id == "all")
            $(this).addClass('highlight');
        else
            $(this).removeClass('highlight');
    });

    $('.sale-listings .sale-content .pending-orders tr').each(function() {
        if ($(this).attr('best-warehouse-id') == warehouse_id || warehouse_id == "all")
            $(this).addClass('highlight2');
        else
            $(this).removeClass('highlight2');
    });
});

// When an item's checkbox is checked:
$('.sale-listings .sale-header .check.item-profile').click(function() {
    var checked = ($(this).is(':checked') == true);
    var item_number_id = $(this).parents('.sale-header').attr('id');
    if (checked) {
        $('.sale-listings #' + item_number_id + '.sale-content .check.pending-order').not(':disabled').attr('checked', 'checked');
    }
    else {
        $('.sale-listings #' + item_number_id + '.sale-content .check.pending-order').removeAttr('checked');
    }
    show_add_to_active_po_link(item_number_id);
});

// When a pending order's checkbox is checked:
$('.sale-listings .check.pending-order').click(function() {
    var item_number_id = $(this).parents('.sale-content').attr('id');
    show_add_to_active_po_link(item_number_id);
});


// Show Create PO popup
function show_create_po() {
    var soi_ids = get_checked_soi_ids();
    var item_numbers = get_checked_item_numbers();
    var warehouse = $('.inventory-summary input[type="radio"]:checked').val();
    if (soi_ids.length == 0 && item_numbers.length == 0) {
        alert("Please select at least one sale item or pending order.");
        return false;
    }
    var param = {
        soi_ids: JSON.stringify(soi_ids),
        item_numbers: JSON.stringify(item_numbers),
        warehouse_id: warehouse
    };
    show_create_purchase_order_popup_with_params(param)
}

function show_create_purchase_order_popup_with_params(params) { 
    $.post(expand_url('/admin/manage-po/popup-edit-po.json'), params, function(response) {
        if (response.status_code == 1) {
            $('.popup.create_po').html(response.html);
            $.dialog('create_po').open();
        }
        else alert('Failed: ' + response.message);
    }, 'json');
}

// Save or Send PO

function save_and_send_po() {
    save_po(true);
}

function save_po(send_po) {
    var param = get_create_po_params();
    if (!validate_po(param, false)) {
        return false;
    }
    var soi_ids = get_checked_soi_ids();
    var item_numbers = get_checked_item_numbers();
    param['sale_order_item_ids'] = JSON.stringify(soi_ids);
    param['item_numbers'] = JSON.stringify(item_numbers);
    param['send_po'] = send_po;
    $.post(expand_url('/admin/create-and-send-po.json'), param, function(response) {
        if (response.status_code == 1) { location.reload(false); }
        else if (response.status_code == 2) { alert(response.message); location.reload(false); }
        else alert('Failed: ' + response.message);
    }, 'json');
}

function save_po_and_use_inventory(send_po, $button) {
    var param = get_create_po_params();
    if (!validate_po(param, false)) {
        return false;
    }
    var $sale_items = $('.create_po .sale tbody tr');
    if ($sale_items.length != 1) {
        alert('Incorrect number of sale items: only one sale item is allowed');
    }

    var inventory_warehouse_id = $button.attr('inventory_warehouse_id');
    var item_number, quantity_to_use;
    $sale_items.each(function() {
        item_number = $(this).attr('item-number');
        quantity_to_use = $(this).find('input.quantity').val();
        return false;
    });

    if (quantity_to_use <= 0) {
        alert('Please enter a valid quantity');
        return false;
    }

    param['sale_order_item_ids'] = JSON.stringify([]);
    param['item_numbers'] = JSON.stringify([item_number]);
    param['send_po'] = send_po;

    $.post(expand_url('/admin/create-and-send-po.json'), param, function(response) {
        if (response.status_code == 1 || response.status_code == 2) {
            if (response.message) {
                alert(response.message);
            }

            $.post(expand_url('/admin/update-inventory-item-quantity.json'), {
                'item_number': item_number,
                'warehouse_id': inventory_warehouse_id,
                'quantity_to_use': quantity_to_use,
                'po_id': response.po_id
            }, function (response) {
                if (response.status_code == 1) {
                    location.reload(false);
                } else {
                    alert('Failed: ' + response.message);
                }
            }, 'json');
        } else {
            alert('Failed: ' + response.message);
        }
    }, 'json');
}

// Show 'Add to active PO' link
function show_add_to_active_po_link(item_number_id) {
    var checked_pending_orders = $('.sale-listings .sale-content#'+item_number_id+' .check.pending-order:checked');
    var quantity_total = 0;
    $.each(checked_pending_orders, function() {
        var quantity = parseInt($(this).parents('tr.pending-order').attr('quantity'));
        quantity_total += quantity;
    });

    var empty_active_pos = $('.sale-listings .sale-content#'+item_number_id+' .active-po tr.empty-order');
    $.each(empty_active_pos, function() {
        var po_id = $(this).attr('po-id');
        var quantity = $(this).attr('quantity');
        var quantity_received= $(this).attr('quantity-rcvd');
        if (quantity_total > 0 && quantity - quantity_received >= quantity_total) {
            var add_link_txt = "Add "+checked_pending_orders.length+" Selected " + ((checked_pending_orders.length > 1) ? "Orders" : "Order");
            $(this).find('td.related-order a.add-to-active-po').show().text(add_link_txt);
        }
        else {
            $(this).find('td.related-order a.add-to-active-po').hide();
        }
    });

}

// When 'Add to Active PO' link is clicked:
$('.sale-listings .add-to-active-po').click(function() {
    var po_id = $(this).parents('tr.empty-order').attr('po-id');
    var item_number_id = $(this).parents('.sale-content').attr('id');
    var soi_ids = [];
    $('.sale-listings .sale-content#'+item_number_id+' .check.pending-order:checked').each(function() { soi_ids.push($(this).attr('soi-id')); });
    var confirmed = confirm("Do you want to add "+soi_ids.length+ ((soi_ids.length > 1) ? " pending orders" : " pending order") + " to PO #"+po_id+"?");
    if (!confirmed) return false;

    var param = {
        sale_order_item_ids: JSON.stringify(soi_ids),
        purchase_order_id: po_id
    };
    
    add_to_active_po_with_params(param); 

    return false;
});

function add_to_active_po_with_params(params) { 
    $.post(expand_url('/admin/add-to-active-po.json'), params, function(response) {
        if (response.status_code == 1) location.reload(false);
        else alert('Failed: ' + response.message);
    }, 'json');
}

// Show 'Add to PO' popup
function show_add_po() {
    var soi_ids = get_checked_soi_ids();
    var item_numbers = get_checked_item_numbers();
    if (soi_ids.length == 0 && item_numbers.length == 0) {
        alert("Please select at least one sale item or pending order.");
        return false;
    }
    $.dialog('add_po').open();
}

// When 'Add to PO' button is clicked:
$('.add_po .btn-add').click(function() {
    var soi_ids = get_checked_soi_ids();
    var item_numbers = get_checked_item_numbers();

    if (soi_ids.length <= 0 && item_numbers.length <= 0) {
        alert("Please select at least one sale item or pending order.");
        return false;
    }

    var param = {
        purchase_order_id: $('.add_po .po-id option:selected').val(),
        sale_order_item_ids: JSON.stringify(soi_ids),
        item_numbers: JSON.stringify(item_numbers)
    };

    add_to_po_with_params(param); 
});

function add_to_po_with_params(params) { 
    $.post(expand_url('/admin/add-to-po.json'), params, function(response) {
        if (response.status_code == 1) location.reload(false);
        else if (response.status_code == 2) alert('Invalid request. Please try different purchase order, sale item, pending order.');
        else alert('Failed');
    }, 'json');
}

function update_best_warehouse(soi_id, best_warehouse, best_available_warehouse) {
    var $row = $('input.pending-order[soi-id="'+soi_id+'"]').parents('tr.pending-order');
    if (best_warehouse != null) {
        $row.attr('best-warehouse-id', best_warehouse.id);
        $row.find('td.best').text(best_warehouse.name);
    }
    else {
        $row.removeAttr('best-warehouse-id');
        $row.find('td.best').text("");
    }
    if (best_available_warehouse != null) {
        $row.find('td.best-available').text(best_available_warehouse.name);
    }
    else {
        $row.find('td.best-available').text("");
    }
}

// When Cross Shipping is toggled:
$('.sale-listings input.check.cross-shipping').click(function() {
    var allow = $(this).prop('checked');
    var item_number = $(this).parents('.sale-header').attr('item-number');
    var soi_ids = $.map($('.sale-content#item-'+item_number+' .pending-orders input.pending-order'), function(input, idx) {
        return $(input).attr('soi-id');
    });
    param = {
        item_number: item_number,
        allow: allow,
        soi_ids: JSON.stringify(soi_ids)
    }
    $.post(expand_url('/admin/manage-po/update-cross-shipping.json'), param, function(response) {
        if (response.status_code == 1) {
            for (var i=0; i<response.pending_order_items.length; i++) {
                var order_item = response.pending_order_items[i];
                update_best_warehouse(order_item.id, order_item.best_warehouse, order_item.best_available_warehouse);
            }
            alert("Cross shipping is " + (allow ? "allowed." : "disallowed"));
        }
        else alert('Failed: ' + response.message);
    }, 'json');
});

// When 'Edit' button for Warehouse Restrictions is clicked:
$('.sale-listings .pending-order a.edit-restrictions').click(function() {
    var $column = $(this).parent();
    var soi_id = $column.attr('soi-id');
    var order_id = $column.attr('order-id');
    var sale_id = $column.attr('sale-id');
    var sale_img = $column.attr('sale-img');
    var sale_title = $column.attr('sale-title');
    var sale_option = $column.attr('sale-option');
    var locked_id = $column.find('.locked').attr('wh-id');
    var disallowed_ids = $column.find('.disallowed').map(function() {return $(this).attr('wh-id');});

    $('.restrictions')
        .find('.info')
            .find('span.order-id').text(order_id).end()
            .find('span.sale-id').text(sale_id).end()
            .find('span.sale-img').css("background-image", "url('"+sale_img+"')").end()
            .find('span.sale-title').text(sale_title).end()
            .find('span.sale-option').text(sale_option).end()
            .attr('soi-id', soi_id);

    if (locked_id == undefined) locked_id = "none";
    $('.restrictions .lock input[name="lock"]').val([locked_id]);

    $('.restrictions .disallow input[type="checkbox"]').each(function() {
        var val = $(this).val();
        if ($.inArray(val, disallowed_ids) >= 0)
            $(this).prop('checked', true);
        else
            $(this).prop('checked', false);
    });

    $.dialog('restrictions').open();

    return false;
});

// Save warehouse restrictions
$('.popup.restrictions .btn-save').click(function() {
    var $popup = $('.popup.restrictions');
    var soi_id = $popup.find('.info').attr('soi-id');
    var locked_id = $popup.find('.lock input[name="lock"]:checked').val();
    var disallowed_ids = [];
    $popup.find('.disallow input[type="checkbox"]:checked').each(function() {
        disallowed_ids.push(parseInt($(this).val()));
    });

    var param = {
        soi_id: soi_id,
        locked_id: locked_id,
        disallowed_ids: JSON.stringify(disallowed_ids)
    };

    $.post(expand_url('/admin/manage-po/update-warehouse-restrictions.json'), param, function(response) {
        if (response.status_code == 1) {
            var disallowed = response.restrictions.disallowed;
            var locked = response.restrictions.locked;
            var best_warehouse = response.best_warehouse;
            var best_available_warehouse = response.best_available_warehouse;
            var $column = $('.sale-listings .pending-orders td[soi-id="'+soi_id+'"]');
            $column.find('.tooltip').remove();
            if (disallowed.length > 0) {
                var $span = $('<span/>').addClass('tooltip');
                var $icon = $('<i/>').addClass('ic-stop');
                var $tooltip = $('<small/>');
                $.each(disallowed, function(idx, wh) {
                    $tooltip.append($('<div/>').addClass('disallowed').attr('wh-id', wh.id).text(wh.name));
                });
                $column.prepend($span.append($icon).append($tooltip));
            }
            if (locked != null) {
                var $span = $('<span/>').addClass('tooltip');
                var $icon = $('<i/>').addClass('ic-lock');
                var $tooltip = $('<small/>').addClass('locked').attr('wh-id', locked.id).text(locked.name);
                $column.prepend($span.append($icon).append($tooltip));
            }
            update_best_warehouse(soi_id, best_warehouse, best_available_warehouse);
            $.dialog('restrictions').close();
        }
        else alert('Failed: ' + response.message);
    });
});


/* ======================================================================================
 * - Common PO page actions
 * ======================================================================================
 */

// When the filter option on the top-left is selected:
$('.po_category').change(function() {
    location.href = $(this).find('option:selected').attr('filter-url');
});

// When the warehouse option is selected:
$('.po_warehouse').change(function() {
    location.href = $(this).find('option:selected').attr('warehouse-url');
});

$('a.duplicate-po').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');
    $.post(expand_url('/admin/duplicate-po.json'), {'po_id': po_id}, function(response) {
        if(response.status_code == 1) {
            $('.popup.create_po').html(response.html);
            $.dialog('create_po').open();
        }
        else alert('Failed: ' + response.message);
    }, 'json');
});

$('a.po-edit-history').on("click", function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');
    $.post(expand_url('/admin/manage-po/popup-edit-po-history.json'), {po_id: po_id}, function(response) {
        if (response.status_code == 1) {
            $('.popup.po_edit_history').html(response.html);
            $.dialog('po_edit_history').open();
        }
        else alert('Failed: ' + response.message);
    }, 'json');
});

$('.sales-frm .check.all').click(function() {
    if($(this).is(':checked')) {
        $('.pending-item .check.purchase-order').attr('checked', 'checked');
    }
    else {
        $('.pending-item .check.purchase-order').removeAttr('checked');
    }
});

// Print checked PO
function print_checked_po(po_class) {
    var po_ids = [];
    $(po_class + ' .pending-item .check.purchase-order:checked').each(function() {
        po_ids.push(parseInt($(this).parents('.pending-item').attr('po-id')));
    });
    if (po_ids.length == 0) {
        alert("Please select at least one purchase order.");
        return false;
    }
    var url = "/admin/manage-po/print?po_ids=" + JSON.stringify(po_ids);
    window.open(url);
    return false;
}

$('.search input.keyword').bind('keypress', function(e) {
    if (e.keyCode === 13) $('.btn-search').click();
});


$('.so-action').on("change", function() {
    selection = $(this).val()
    //selected so_ids
    so_ids = []
    $('.check.shipment-order:checked').each(function() { so_ids.push($(this).attr('so-id')); });

    if (selection == "0" || so_ids.length <= 0) {
        return false;
    }

    param = { 'so_id_list': JSON.stringify(so_ids) };

    if (selection == "1") {
        //updatee only
        param['mode'] = 'update_list';
        if(!window.confirm('Are you sure you want to update status of these orders?')) {
            return false;
        }
    }
    else if (selection == "2") {
        param['mode'] = 'cancel_list';
        if(!window.confirm('Are you sure you want to cancel these orders?')) {
            return false;
        }
    }
    else if (selection == "3") {
        param['mode'] = 'disassociate_list';
        if(!window.confirm('Are you sure you want to disassociate these orders from sale orders?')) {
            return false;
        }
    }

    $.post(expand_url('/admin/manage-so/update-shipment-order-item.json'), param, function(response) {
            if (response.status_code == 1) location.reload(true);
            else alert('Failed: ' + response.message);
        }, 'json');

});

$('select.so_warehouse').change(function() {
    window.location.href = $(this).find('option:selected').attr('warehouse-url');
    return false;
});

$('a.po_history').click(function() {
    var po_id = $(this).attr('po-id');
    $.get(expand_url('/admin/manage-po/popup-get-po-history.json'), {po_id: po_id}, function(response) {
        if (response.status_code == 1) {
            $('.popup.get_po_history_popup').html(response.html);
            $.dialog('get_po_history_popup').open();
        }
        else alert('Failed: ' + response.message);
    }, 'json');
    return false;
});

/*
 * ======================================================================================
 * - SAVED PO
 * ======================================================================================
 */

// When 'Remove PO' button is clicked:
$('.saved-po a.remove-po').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');
    var confirmed = confirm("Do you really want to remove PO #" + po_id + "?");
    if (!confirmed) return false;
    $.post(expand_url('/admin/remove-po.json'), {po_id: po_id}, function(response) {
        if (response.status_code == 1) location.reload(false);
        else alert('Failed: ' + response.message);
    }, 'json');
});

// Show 'Edit PO' popup
$('.saved-po a.edit-po').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');
    $.post(expand_url('/admin/manage-po/popup-edit-po.json'), {po_id: po_id}, function(response) {
        if (response.status_code == 1) {
            $('.popup.create_po').html(response.html);
            $.dialog('create_po').open();
        }
        else alert('Failed: ' + response.message);
    }, 'json');
    return false;
});

// Show 'PO Attachment' popup
$('.saved-po a.po-attachments').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');

    $.get(expand_url('/admin/manage-po/popup-po-attachment.json'), {po_id: po_id}, function(response) {
        if (response.status_code == 1) {
            $('.popup.po_attachment').html(response.html);
            $.dialog('po_attachment').open();
        } else {
            alert('Failed: ' + response.message);
        }
    }, 'json');
    return false;
});

// Modify / Send PO
function modify_po(send_po) {
    var param = get_create_po_params();
    if (!validate_po(param, false)) {
        return false;
    }
    param['purchase_order_id'] = $('.create_po .po-id').attr('po-id');
    param['send_po'] = send_po;
    $.post(expand_url('/admin/modify-and-send-po.json'), param, function(response) {
        if (response.status_code == 1) location.reload(false);
        else if (response.status_code == 2) { alert(response.message); location.reload(false); }
        else alert('Failed: ' + response.message);
    }, 'json');
}

function modify_and_send_po() {
    modify_po(true);
}

// Send multiple POs
$('.saved-po select.status').change(function() {
    var $value = $(this).val();
    if ($value == 1) {
        send_checked_po();
    } else if ($value == 2) {
        print_checked_po('.saved-po');
    }
    $(this).val(-1);
    return false;
});

function send_checked_po() {
    var po_ids = [];
    $('.saved-po .pending-item .check.purchase-order:checked').each(function() {
        po_ids.push($(this).parents('.pending-item').attr('po-id'));
    });
    if (po_ids.length == 0) {
        alert("Please select at least one purchase order.");
        return false;
    }
    $.post(expand_url('/admin/send-po.json'), {po_ids: JSON.stringify(po_ids)}, function(response) {
        if (response.status_code == 1) location.reload(false);
        else if (response.status_code == 2) { alert(response.message); location.reload(false); }
        else alert('Failed: ' + response.message);
    }, 'json');
}

// When 'Remove' button of PO item is clicked:
$('.saved-po a.remove-po-items').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');
    var item_number = $(this).parents('tr.item').attr('item-number');
    var confirmed = confirm("Do you really want to remove the item '" + item_number + "' from PO #" + po_id + "?");
    if (!confirmed) return false;
    var param = {
        po_id: po_id,
        item_number: item_number
    };
    $.post(expand_url('/admin/remove-po-item.json'), param, function(response) {
        if (response.status_code == 1) location.reload(false);
        else alert('Failed: ' + response.message);
    }, 'json');

});

// When the search button is clicked:
$('.saved-po .sales-frm .search .btn-search').click(function() {
    var search_option = $('.sales-frm .search select.target option:selected').val();
    var search_keyword = $('.sales-frm .search .keyword').val();

    window.location.href = "/admin/manage-po/saved?search_option=" + search_option + "&search_keyword=" + search_keyword;

});

/*
 * ======================================================================================
 * - ACTIVE PO
 * ======================================================================================
 */

// 'Close' link is clicked:
$('.active-po a.close-po').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');
    var confirmed = confirm("Do you really want to close PO #" + po_id + "?");
    if (!confirmed) return false;
    var po_ids = [po_id];
    $.post(expand_url('/admin/close-po.json'), {po_ids: JSON.stringify(po_ids)}, function(response) {
        if (response.status_code == 1) location.reload(false);
        else alert('Failed: ' + response.message);
    }, 'json');
});

// 'Cancel' link is clicked:
$('.active-po a.cancel-po').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');
    var confirmed = confirm("Do you really want to cancel PO #" + po_id + "?");
    if (!confirmed) return false;
    var po_ids = [po_id];
    $.post(expand_url('/admin/cancel-po.json'), {po_ids: JSON.stringify(po_ids)}, function(response) {
        if (response.status_code == 1) location.reload(false);
        else alert('Failed: ' + response.message);
    }, 'json');
});

// 'Receive' link is clicked:
$('.active-po a.receive-po').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');

    $.post(expand_url('/admin/manage-po/popup-receive-po.json'), {po_id: po_id}, function(response) {
        if (response.status_code == 1) {
            $('.popup.receive_po').html(response.html).find('.btn-receive').attr('po-id', po_id);
            $.dialog('receive_po').open();
        } else {
            alert('Failed: ' + response.message);
        }
    }, 'json');
    return false;
});

// 'Lost' link is clicked:
$('.active-po a.lost-po').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');

    $.post(expand_url('/admin/manage-po/popup-lost-po.json'), {po_id: po_id}, function(response) {
        if (response.status_code == 1) {
            $('.popup.lost_po').html(response.html).find('.btn-lost').attr('po-id', po_id);
            $.dialog('lost_po').open();
        } else {
            alert('Failed: ' + response.message);
        }
    }, 'json');
    return false;
});

// 'Edit' link is clicked:
$('.active-po a.view-po').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');

    $.post(expand_url('/admin/manage-po/popup-view-po.json'), {po_id: po_id}, function(response) {
        if (response.status_code == 1) {
            $('.popup.po_edit_history').html(response.html);
            $.dialog('po_edit_history').open();
        }
        else alert('Failed: ' + response.message);
    }, 'json');
    return false;
});


// 'Edit' link is clicked:
$('.active-po a.edit-po').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');

    $.post(expand_url('/admin/manage-po/popup-edit-po.json'), {po_id: po_id}, function(response) {
        if (response.status_code == 1) {

            $('.popup.create_po').html(response.html);

            $.dialog('create_po').open();
            //disable target select & hide send button
            //$('.create_po').find('input, textarea, button, select').prop('disabled',true);
            $('.create_po .target select').prop('disabled', true);
            //$('.create_po .vendor').hide();
            //$('.create_po .comment').hide();
            //$('.create_po .sale').hide();
            //$('.create_po .extra').hide();

            $('.create_po .btn-send').hide();
        }
        else alert('Failed: ' + response.message);
    }, 'json');
    return false;
});

// Validate PO values
function validate_po(params, suppress_alert) {
    var string_length_check = { '255':['wire_ref_num', 'paypal_ref_num', 'merchant_invoice', 'order_ref_num', 'tracking_id']};
    var check_failed = {};
    var length_check_failed = []
    for (limit in string_length_check) {
        for (i in string_length_check[limit]) {
            var key = string_length_check[limit][i];
            if (key in params && params[key].length > parseInt(limit)) {
                length_check_failed.push(key);
            }
        }
    }
    if (length_check_failed.length > 0 ) {
        if (!suppress_alert)
            var message = 'Maximum length for these fields are 255 characters: ' + length_check_failed ;
            alert(message);
        return false;
    }

	var ccnt = parseInt(params.carton_count);
	var pcnt = parseInt(params.pallet_count);
	if (!ccnt && !pcnt) {
		alert("Either Package count or Pallet count should be specified.");
		return false;
	}
    return true;
}

// Show 'PO Attachment' popup
$('.active-po a.po-attachments').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');

    $.get(expand_url('/admin/manage-po/popup-po-attachment.json'), {po_id: po_id}, function(response) {
        if (response.status_code == 1) {
            $('.popup.po_attachment').html(response.html);
            $.dialog('po_attachment').open();
        } else {
            alert('Failed: ' + response.message);
        }
    }, 'json');
    return false;
});

// Save / Send duplicated PO
function save_duplicated_po(send_po) {
    var param = get_create_po_params();
    if (!validate_po(param, false)) {
        return false;
    }
    param['purchase_order_id'] = $('.create_po .po-id').attr('po-id');
    param['send_po'] = send_po;
    //param['duplicate'] = true
    $.post(expand_url('/admin/duplicate-and-send-po.json'), param, function(response) {
        if (response.status_code == 1) location.reload(false);
        else if (response.status_code == 2) { alert(response.message); location.reload(false); }
        else alert('Failed: ' + response.message);
    }, 'json');
}

function save_and_send_duplicated_po() {
    save_duplicated_po(true);
}

// When 'Actions' drop-down list is selected:
$('.active-po select.status').change(function () {
    var value = $(this).val();
    if (value == 1) {
        cancel_checked_po();
    } else if (value == 2) {
        print_checked_po('.active-po');
    } else if (value == 3) {
        close_checked_po();
    }
    $(this).val(-1);
    return false;
});

// Close checked PO
function close_checked_po() {
    var po_ids = [];
    $('.active-po .pending-item .check.purchase-order:checked').each(function() {
        po_ids.push($(this).parents('.pending-item').attr('po-id'));
    });
    if (po_ids.length == 0) {
        alert("Please select at least one purchase order.");
        return false;
    }
    var confirmed = confirm("Do you really want to close PO " + $.map(po_ids, function(po_id, idx) {return '#'+po_id;}).join(", ") + "?");
    if (!confirmed) return false;
    $.post(expand_url('/admin/close-po.json'), {po_ids: JSON.stringify(po_ids)}, function(response) {
        if (response.status_code == 1) location.reload(false);
        else alert('Failed: ' + response.message);
    }, 'json');
}

// Cancel Checked PO
function cancel_checked_po() {
    var po_ids = [];
    $('.active-po .pending-item .check.purchase-order:checked').each(function() {
        po_ids.push($(this).parents('.pending-item').attr('po-id'));
    });
    if (po_ids.length == 0) {
        alert("Please select at least one purchase order.");
        return false;
    }
    var confirmed = confirm("Do you really want to cancel PO " + $.map(po_ids, function(po_id, idx) {return '#'+po_id;}).join(", ") + "?");
    if (!confirmed) return false;
    $.post(expand_url('/admin/cancel-po.json'), {po_ids: JSON.stringify(po_ids)}, function(response) {
        if (response.status_code == 1) location.reload(false);
        else alert('Failed: ' + response.message);
    }, 'json');
}

// Update ETA
$('.active-po.pending-item .update-eta').click(function() {
    var eta = $(this).parent().find('.eta').val();
    var po_id = $(this).parents('.pending-item').attr('po-id');
    $.post(expand_url('/admin/update-po-eta.json'), {po_id: po_id, eta:eta}, function(response) {
        if (response.status_code == 1) alert('Updated');
        else alert('Failed: ' + response.message);
    });
    return false;
});


$('.popup.receive_po')
    .delegate('.btn-receive', 'click', function () {
        var po_id = $(this).attr('po-id');

        var received_items = [];
        $('.popup.receive_po tbody tr.item').each(function () {
            received_items.push({
                item_number: $(this).attr('item-number'),
                quantity_received: $(this).find('.quantity-received').val()
            });
        });
        var params = {'po_id': po_id, 'received_items': JSON.stringify(received_items)};

        $.post(expand_url('/admin/manage-po/process-received-quantity.json'), params, function (response) {
            if (response.status_code == 1) location.reload(false);
            else alert('Failed: ' + response.message);
        }, 'json');
    });


(function () {
    var $popupLostPO = $('.popup.lost_po');

    $popupLostPO.on('click', '.btn-lost', function () {
        var po_id = $(this).attr('po-id');
        var $all = $popupLostPO.find('table tbody input[name="item-check"]');
        var $checked = $popupLostPO.find('table tbody input[name="item-check"]:checked');
        var lost_items = [];
        var allItemsLost = $all.length == $checked.length;

        for (var i=0; i<$checked.length; i++) {
            var $tr = $($checked[i]).closest('tr.item');
            var quantityLost = $tr.find('.quantity-lost').val();

            if (!quantityLost) {
                alert('Please enter lost quantity.');
                $tr.find('.quantity-lost').focus();
                return false;
            }

            if ($tr.attr('item-quantity') != quantityLost) {
                allItemsLost = false;
            }

            if (quantityLost > 0) {
                lost_items.push({
                    item_number: $tr.attr('item-number'),
                    quantity_lost: quantityLost
                });
            }
        }

        if (lost_items.length == 0) {
            alert('Please select at least one item to mark as lost.');
            return false;
        }

        if (allItemsLost && !window.confirm(_.str.sprintf('Are you sure you want to mark PO #%s as lost?', po_id))) {
            return false;
        }

        if (!allItemsLost && !window.confirm(_.str.sprintf('Are you sure you want to mark selected item(s) (%s) as lost?', _.pluck(lost_items, 'item_number')))) {
            return false;
        }

        var params = {'po_id': po_id, 'lost_items': JSON.stringify(lost_items)};
        $.post(expand_url('/admin/manage-po/mark-po-as-lost.json'), params, function (response) {
            if (response.status_code == 1) {
                location.reload(false);
            } else {
                alert('Failed: ' + response.message);
            }
        })
    });

    $popupLostPO.on('click', 'table thead input[name="check-header"]', function () {
        var $checkboxes = $popupLostPO.find('table tbody input[name="item-check"]');
        $checkboxes.prop("checked", $(this).prop("checked"));
    });

    $popupLostPO.on('click', 'table tbody input[name="item-check"]', function () {
        var $checked = $popupLostPO.find('table tbody input[name="item-check"]:checked');
        var $all = $popupLostPO.find('table tbody input[name="item-check"]');
        $popupLostPO.find('table thead input[name="check-header"]').prop("checked", $all.length == $checked.length);
    });

    $popupLostPO.on('keypress', 'table tbody input.quantity-lost', function () {
        var $itemCheckBox = $(this).closest('tr').find('input[name="item-check"]');

        if (!$itemCheckBox.is(':checked')) {
            $itemCheckBox.prop('checked', true);
        }
    });
})();

/*
 * ======================================================================================
 * - CANCELED PO
 * ======================================================================================
 */

$('.canceled-po a.edit-po').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');
    $.post(expand_url('/admin/manage-po/popup-edit-po.json'), {'po_id': po_id}, function(response) {
        if(response.status_code == 1) {
            $('.popup.create_po').html(response.html);
            $.dialog('create_po').open();
            //disable all the other values
            //$('.create_po').find('input, textarea, button, select').prop('disabled',true);
            $('.create_po .target').hide();
            $('.create_po .vendor').hide();
            //$('.create_po .comment').hide();
            // $('.create_po .shipping').hide();
            // $('.create_po .sale').hide();
            // $('.create_po .extra').hide();
            // Disable editing 'Tag' and 'Order Type' fields.
            $('.create_po .extra .tag input').attr('disabled', 'disabled');
            $('.create_po .extra select.po-order-type').attr('disabled', 'disabled');
            $('.create_po .btn-send').hide();
        }
        else alert('Failed: ' + response.message);
    }, 'json');
    return false;
});

// Show 'PO Attachment' popup
$('.canceled-po a.po-attachments').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');

    $.get(expand_url('/admin/manage-po/popup-po-attachment.json'), {po_id: po_id}, function(response) {
        if (response.status_code == 1) {
            $('.popup.po_attachment').html(response.html);
            $.dialog('po_attachment').open();
        } else {
            alert('Failed: ' + response.message);
        }
    }, 'json');
    return false;
});

$('.canceled-po select.status').change(function() {
    var $value = $(this).val();
    if ($value == 1) {
        print_checked_po('.canceled-po');
    }
    $(this).val(-1);
    return false;
});


/*
 * ======================================================================================
 * - LOST PO
 * ======================================================================================
 */

$('.lost-po a.edit-po').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');
    $.post(expand_url('/admin/manage-po/popup-edit-po.json'), {'po_id': po_id}, function(response) {
        if(response.status_code == 1) {
            $('.popup.create_po').html(response.html);
            $.dialog('create_po').open();
            //disable all the other values
            //$('.create_po').find('input, textarea, button, select').prop('disabled',true);
            $('.create_po .target').hide();
            $('.create_po .vendor').hide();
            //$('.create_po .comment').hide();
            // $('.create_po .shipping').hide();
            // $('.create_po .sale').hide();
            // $('.create_po .extra').hide();
            // Disable editing 'Tag' and 'Order Type' fields.
            $('.create_po .extra .tag input').attr('disabled', 'disabled');
            $('.create_po .extra select.po-order-type').attr('disabled', 'disabled');
            $('.create_po .btn-send').hide();
        }
        else alert('Failed: ' + response.message);
    }, 'json');
    return false;
});

// Show 'PO Attachment' popup
$('.lost-po a.po-attachments').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');

    $.get(expand_url('/admin/manage-po/popup-po-attachment.json'), {po_id: po_id}, function(response) {
        if (response.status_code == 1) {
            $('.popup.po_attachment').html(response.html);
            $.dialog('po_attachment').open();
        } else {
            alert('Failed: ' + response.message);
        }
    }, 'json');
    return false;
});

$('.lost-po select.status').change(function() {
    var $value = $(this).val();
    if ($value == 1) {
        print_checked_po('.lost-po');
    }
    $(this).val(-1);
    return false;
});


/*
 * ======================================================================================
 * - HISTORY PO
 * ======================================================================================
 */

$('.history-po .sales-frm .search .btn-search').click(function() {
  var search_option = $('.sales-frm .search select.target option:selected').val();
  var search_keyword = $('.sales-frm .search .keyword').val();

  window.location.href = "/admin/manage-po/history?search_option=" + search_option + "&search_keyword=" + search_keyword;

});

$('.history-po a.edit-po').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');
    $.post(expand_url('/admin/manage-po/popup-edit-po.json'), {'po_id': po_id}, function(response) {
        if(response.status_code == 1) {
            $('.popup.create_po').html(response.html);
            $.dialog('create_po').open();
            //disable all the other values
            //$('.create_po').find('input, textarea, button, select').prop('disabled',true);
            $('div .target :input').attr('disabled', true)
            $('div .vendor :input').disable('disabled'. true);
            //$('.create_po .comment').hide();
            // $('.create_po .shipping').hide();
            // $('.create_po .sale').hide();
            // $('.create_po .extra').hide();
            // Disable editing 'Tag' and 'Order Type' fields.
            $('.create_po .extra .tag input').attr('disabled', true);
            // $('.create_po .extra select.po-order-type').attr('disabled', 'disabled'); // commented out for https://app.asana.com/0/862521100724/11996878036937
            $('.create_po .btn-send').hide();
        }
        else alert('Failed: ' + response.message);
    }, 'json');
    return false;
});

$('.history-po select.status').change(function() {
    var $value = $(this).val();
    if ($value == 1) {
        print_checked_po('.history-po');
    }
    $(this).val(-1);
    return false;
});

// 'Cancel' link is clicked:
$('.history-po a.cancel-po').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');
    var confirmed = confirm("Do you really want to cancel PO #" + po_id + "?");
    if (!confirmed) return false;
    var po_ids = [po_id];
    $.post(expand_url('/admin/cancel-po.json'), {po_ids: JSON.stringify(po_ids)}, function(response) {
        if (response.status_code == 1) location.reload(false);
        else alert('Failed: ' + response.message);
    }, 'json');
});

// Show 'PO Attachment' popup
$('.history-po a.po-attachments').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');

    $.get(expand_url('/admin/manage-po/popup-po-attachment.json'), {po_id: po_id}, function(response) {
        if (response.status_code == 1) {
            $('.popup.po_attachment').html(response.html);
            $.dialog('po_attachment').open();
        } else {
            alert('Failed: ' + response.message);
        }
    }, 'json');
    return false;
});

/*
 * ======================================================================================
 * - RECEIVED ITEMS POPUP
 * ======================================================================================
 */
$('a.view-received').click(function() {
    var po_id = $(this).parents('dl.pending-item').attr('po-id');
    var item_number = $(this).parents('tr.item').attr('item-number');
    var quantity = $(this).parents('tr.item').attr('quantity');
    var quantity_received = $(this).parents('tr.item').attr('quantity-received');
    var quantity_lacks = quantity - quantity_received;
    $('.po_received')
        .find('.btn-process')
            .attr('po-id', po_id).attr('item-number', item_number).end()
        .find('input.quantity-received')
            .val(quantity_lacks);

    $.dialog('po_received').open();
    return false;
});

$('.po_received')
    .delegate('.btn-process', 'click', function() {
        var po_id = $(this).attr('po-id');
        var item_number = $(this).attr('item-number');
        var quantity_received = $('.po_received input.quantity-received').val();

        var received_items = [{
            item_number:item_number, quantity_received:quantity_received
        }];

        var params = {'po_id': po_id, 'received_items': JSON.stringify(received_items)};

        $.post(expand_url('/admin/manage-po/process-received-quantity.json'), params, function(response) {
            if (response.status_code == 1) location.reload(false);
            else alert('Failed: ' + response.message);
        }, 'json');
    });
/*
 * ======================================================================================
 * - VIEW ORDERS POPUP
 * ======================================================================================
 */

$('a.view-orders').click(function() {
    var po_id = $(this).parents('.pending-item').attr('po-id');
    var item_number = $(this).parents('tr.item').attr('item-number');
    $.get(expand_url('/admin/manage-po/popup-view-orders'), {po_id: po_id, item_number: item_number}, function(response) {
        $('.popup.po_view').html(response);
        $.dialog('po_view').open();
    }, 'html');
    return false;
});

// When 'Remove' or 'Disassociate' link is clicked:
$('.po_view')
    .delegate('a.remove', 'click', function() {
        var poi_id = $(this).attr('poi-id');
        remove_po_item(poi_id);
        return false;
    })
    .delegate('a.disassociate', 'click', function() {
        var poi_id = $(this).attr('poi-id');
        disassociate_po_item(poi_id);
        return false;
    });

// Remove item from PO
function remove_po_item(poi_id) {
    $.post(expand_url('/admin/remove-po-item.json'), {poi_id: poi_id}, function(response) {
        if (response.status_code == 1) location.reload(false);
        else alert('Failed: ' + response.message);
    }, 'json');
}

// Disassociate item from PO
function disassociate_po_item(poi_id) {
    $.post(expand_url('/admin/disassociate-po-item.json'), {poi_id: poi_id}, function(response) {
        if (response.status_code == 1) location.reload(false);
        else alert('Failed: ' + response.message);
    }, 'json');
}

/*
 * ======================================================================================
 * - EDIT PO POPUP
 * ======================================================================================
 */

function get_checked_soi_ids() {
    var soi_ids = [];
    $('.check.pending-order:checked').each(function() { soi_ids.push($(this).attr('soi-id')); });
    return soi_ids;
}

function get_checked_item_numbers() {
    var item_numbers = [];
    $('.check.item-profile:checked').each(function() {
        item_numbers.push($(this).parents('.sale-header').attr('item-number'));
    });
    return item_numbers;
}

function check_min_quantity(curr) {
    var min_quantity = $(curr).attr('min-quantity');
    var curr_quantity = parseInt($(curr).val());
    if (isNaN(curr_quantity))
        return ;
    if (curr_quantity < min_quantity) {
        alert("Quantity should not be less than "+min_quantity);
        $(curr).val(min_quantity);
    }
    else {
        $(curr).val(curr_quantity);
    }
}

function check_max_quantity(curr) {
    var max_quantity = $(curr).attr('max-quantity');
    var curr_quantity = parseInt($(curr).val());
    if (isNaN(curr_quantity))
        return;

    if (curr_quantity > max_quantity) {
        alert("Quantity should not be greater than " + max_quantity);
        $(curr).val(max_quantity);
    } else {
        $(curr).val(curr_quantity);
    }
}

function check_tag_length(curr) {
    var strValue = $(curr).val()

    if(strValue.length > 50)
    {
        alert("Maximum length allowed for tag is 50 characters")
        $(curr).val(strValue.substr(0,50))
    }
}

function check_card_number(curr) {
    var strValue = $(curr).val()

    if(strValue == '') return;

    var reg = /^\d+$/;
    if(strValue.length != 4 || !strValue.match(reg))
    {
        alert("Please put a valid card number");
        $(curr).val('')
    }
}

function check_decimal_number(curr) {
    var strValue = $(curr).val()
    var defaultValue = $(curr).attr('default-value')
    if(isNaN(strValue)) {
        alert("Please put a valid number");
        strValue = strValue.replace(/.*?(([0-9]*\.)?[0-9]+).*/g, "$1");

        if(strValue == '' && typeof(defaultValue) != 'undefined')
            strValue = defaultValue;
        if(isNaN(strValue))
            strValue = 0;
        $(curr).val(strValue);
        return false;
    }

    return true;
}

function update_unit_total($enclosing_tr, unit_cost_cls, unit_discount_cls, unit_total_cls) {
    unit_cost_cls = unit_cost_cls || 'unit-cost';
    unit_discount_cls = unit_discount_cls || 'unit-discount-value';
    unit_total_cls = unit_total_cls || 'unit-total';

    $enclosing_tr.find('.' + unit_total_cls).val(
        $enclosing_tr.find('.' + unit_cost_cls).val() - $enclosing_tr.find('.' + unit_discount_cls).val()
    )
}

function update_total_discount_value($item_tr_list, $total_discount_value_field) {
    var total_discount_value = 0;

    $item_tr_list.each(function() {
        total_discount_value += ($(this).find('input.quantity').val() * $(this).find('input.unit-discount-value').val());
    });

    $total_discount_value_field.val(total_discount_value);
}

function get_create_po_params() {
    var saved_quantities = {};
    var saved_unit_costs = {};
    var saved_currency_codes = {};
    var saved_unit_discount_values = {};

    $('.create_po .sale tbody tr').each(function() {
        var item_number = $(this).attr('item-number');
        saved_quantities[item_number] = $(this).find('input.quantity').val();
        saved_unit_costs[item_number] = $(this).find('input.unit-cost').val();
        saved_currency_codes[item_number] = $(this).find('select.currency').val();
        saved_unit_discount_values[item_number] = $(this).find('input.unit-discount-value').val();
    });

    var param = {
        warehouse: $('.create_po .warehouse option:selected').val(),
        vendor_id: $('.create_po .vendor .select-address option:selected').val(),
        vendor_company: $('.create_po .vendor .vendor_company').val(),
        vendor_contact: $('.create_po .vendor .vendor_contact').val(),
        vendor_address1: $('.create_po .vendor .vendor_address1').val(),
        vendor_address2: $('.create_po .vendor .vendor_address2').val(),
        vendor_city: $('.create_po .vendor .vendor_city').val(),
        vendor_state: $('.create_po .vendor .vendor_state option:selected').val(),
        vendor_zip: $('.create_po .vendor .vendor_zip').val(),
        vendor_country: $('.create_po .vendor .vendor_country option:selected').val(),
        vendor_phone: $('.create_po .vendor .vendor_phone').val(),
        vendor_email: $('.create_po .vendor .vendor_email').val(),
        carrier: $('.create_po .shipping .carrier option:selected').val(),
        service_level: $('.create_po .shipping .service_level option:selected').val(),
        tracking_id: $('.create_po .shipping .tracking_id').val(),
        order_ref_num: $('.create_po .shipping .order_ref_num').val(),
        eta: $('.create_po .shipping .eta').val(),
        comments: $('.create_po .comment textarea').val(),
        tag: $('.create_po .extra .po-tag').val(),
        shipping_cost: $('.create_po .extra .shipping-cost').val(),
        extra_cost: $('.create_po .extra .extra-cost').val(),
        extra_cost_type: $('.create_po .extra .extra-cost-type option:selected').val(),
        carton_count: $('.create_po .extra .package-cnt').val(),
        pallet_count: $('.create_po .extra .pallet-cnt').val(),
        sales_tax: $('.create_po .extra .sales-tax').val(),
        card_last_four: $('.create_po .extra .credit-card-last').val(),
        discount_value: $('.create_po .extra .discount-value').val(),
        saved_quantities: JSON.stringify(saved_quantities),
        saved_unit_costs: JSON.stringify(saved_unit_costs),
        saved_currency_codes: JSON.stringify(saved_currency_codes),
        saved_unit_discount_values: JSON.stringify(saved_unit_discount_values),
        po_type: $('.create_po .extra .po-order-type option:selected').val(),
        wire_ref_num: $('.create_po .extra .wire-ref').val(),
        paypal_ref_num: $('.create_po .extra .paypal-ref').val(),
        merchant_invoice: $('.create_po .extra .merchant-invoice').val(),
        shipping_account: $('.create_po .shipping .shipping_account option:selected').val(),
        is_shipping_paid: $('.create_po .shipping .is_shipping_paid').is(':checked')
    };
    return param;
}

function toggle_send_button() {
    var carrier = $('.create_po .shipping .carrier').val();
    var service_level = $('.create_po .shipping .service_level').val();
    var tracking_id = $('.create_po .shipping .tracking_id').val();
    var order_ref_num = $('.create_po .shipping .order_ref_num').val();
    var vendor_company = $('.create_po .vendor .vendor_company').val();
    if (vendor_company.length == 0 || (tracking_id.length == 0 && order_ref_num.length == 0)) {
        $('.create_po .btn-send').attr('disabled', 'disabled');
    }
    else {
        $('.create_po .btn-send').removeAttr('disabled');
    }
}

$('.create_po')
    .delegate('.btn-save.create', 'click', function() {
        save_po(false);
    })
    .delegate('.btn-send.create', 'click', function() {
        save_and_send_po();
    })
    .delegate('.btn-save.modify', 'click', function() {
        modify_po(false);
    })
    .delegate('.btn-send.modify', 'click', function() {
        modify_and_send_po();
    })
    .delegate('.btn-save.duplicate', 'click', function() {
        save_duplicated_po(false);
    })
    .delegate('.btn-send.duplicate', 'click', function() {
        save_and_send_duplicated_po();
    })
    .delegate('.btn-save.create_and_use_inventory', 'click', function() {
        save_po_and_use_inventory(false, $(this));
    })
    .delegate('.btn-send.create_and_use_inventory', 'click', function() {
        save_po_and_use_inventory(true, $(this));
    });