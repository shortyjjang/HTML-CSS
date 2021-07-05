
function get_path_for_search() {
    var search_option = $('.search select.target option:selected').val();
    var search_keyword = $('.search .keyword').val();
    if (search_keyword.length > 0)
        return "search_option=" + search_option + "&search_keyword=" + search_keyword

    return ""
}

function get_path_for_filter() {
    var filter_option = $('.search select.filter-so option:selected').val();
    return "filter_option=" + filter_option
}

function get_reload_path() {
    reload_path = document.location.pathname + "?"
    filter_path = get_path_for_filter()

    reload_path = reload_path + filter_path + "&"
    search_path = get_path_for_search()
    if (search_path.length > 0)
        reload_path = reload_path + search_path + "&"

    return reload_path
}

$('.filter-so').change(function() {
    selection = $(this).val()
    if (selection == $(this).attr('default-filter'))
        return false;

    window.location.href = get_reload_path()
});

$('input.check-all-so').change(function() {
    if($(this).is(':checked')) {
        $('.check.shipment-order').attr('checked', 'checked');
    }
    else {
        $('.check.shipment-order').removeAttr('checked');
    }
    return false;
});

$('.search .btn-search').click(function() {
    path = get_reload_path();

    window.location.href = path;

    return false;
});


$('.search input.keyword').bind('keypress', function(e) {
    if (e.keyCode === 13) $('.btn-search').click();
});

$('a.sort').click(function(){
    path = get_reload_path()

    if($(this).attr('ascending')) {
        window.location.href= path + "sort="+$(this).attr('sort-key')+"&asc=false"
    }
    else {
        window.location.href= path + "sort="+$(this).attr('sort-key')+"&asc=true"
    }
    return false;
});

$('a.so_edit').click(function() {
    var so_id = $(this).attr('so-id');
    $.post('/admin/manage-so/popup-edit-so.json', {so_id: so_id, mode: "pending"}, function(response) {
        if (response.status_code == 1) {
            $('.edit_so_popup').html(response.html);
            $.dialog('edit_so_popup').open();
        }
        else alert('Failed: ' + response.message);
    }, 'json');
    return false;
});

$('a.so_disassociate').click(function() {
    var so_id = $(this).attr('so-id');
    so_ids = [so_id]

    param = { 'so_id_list': JSON.stringify(so_ids) };
    param['mode'] = 'disassociate_list';
    if(!window.confirm('Are you sure you want to disassociate this order from sale order?')) {
        return false;
    }

    $.post('/admin/manage-so/update-shipment-order-item.json', param, function(response) {
            if (response.status_code == 1) location.reload(true);
            else alert('Failed: ' + response.message);
        }, 'json');
});


$('a.so_cancel_result_update').click(function() {
    var so_id = $(this).attr('so-id');
    $.post('/admin/manage-so/popup-update-so-cancel-result.json', {so_id: so_id}, function(response) {
        if (response.status_code == 1) {
            $('.update_so_cancel_result_popup').html(response.html);
            $.dialog('update_so_cancel_result_popup').open();
        }
        else alert('Failed: ' + response.message);
    }, 'json');
    return false;
});

$('a.so_history').click(function() {
    var so_id = $(this).attr('so-id');
    $.get('/admin/manage-so/popup-get-so-history.json', {so_id: so_id}, function(response) {
        if (response.status_code == 1) {
            $('.get_so_history_popup').html(response.html);
            $.dialog('get_so_history_popup').open();
        }
        else alert('Failed: ' + response.message);
    }, 'json');
    return false;
});

$('.so-action').change(function() {
    var selection = $(this).val();
    //selected so_ids
    var so_ids = [];

    $('.check.shipment-order:checked').each(function() { so_ids.push($(this).attr('so-id')); });

    if (selection == "0" || so_ids.length <= 0) {
        return false;
    }

    var param = { 'so_id_list': JSON.stringify(so_ids) };

    if (selection == "1") {
        //update only
        param['mode'] = 'update_list';
        if(!window.confirm('Are you sure you want to update status of these orders?')) {
            $(this).val(0);
            return false;
        }
    }
    else if (selection == "2") {
        param['mode'] = 'cancel_list';
        if(!window.confirm('Are you sure you want to cancel these orders?')) {
            $(this).val(0);
            return false;
        }
    }
    else if (selection == "3") {
        param['mode'] = 'disassociate_list';
        if(!window.confirm('Are you sure you want to disassociate these orders from sale orders?')) {
            $(this).val(0);
            return false;
        }
    }

    $.post('/admin/manage-so/update-shipment-order-item.json', param, function(response) {
            if (response.status_code == 1) location.reload(true);
            else alert('Failed: ' + response.message);
        }, 'json');

    $(this).val(0);
});

$('select.so_warehouse').change(function() {
    window.location.href = $(this).find('option:selected').attr('warehouse-url');
    return false;
});