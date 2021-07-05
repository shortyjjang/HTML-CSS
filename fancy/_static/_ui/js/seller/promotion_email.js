
var BASE_URL = '/merchant/promote/promotion_email';
function get_list_params($cont) {
    var id = $cont.attr('list-id');
    var name = $cont.find('.name input:text').val();
    var loc = $cont.find('.location .multi-text span').map(function() {return $(this).attr('code');}).get().join();
    var gender = $cont.find('input:radio[name="gender"]:checked').val();
    var lang = $cont.find('.language .multi-text span').map(function() {return $(this).attr('code');}).get().join();
    var age_min = $cont.find('.age input.start').val();
    var age_max = $cont.find('.age input.end').val();
    var fancyd_thing_ids = $cont.find('.fancyd input:checkbox').is(':checked') ? $cont.find('.fancyd input:text').val() : '';
    var purchased_sale_ids = $cont.find('.purchased input:checkbox').is(':checked') ? $cont.find('.purchased input:text').val() : '';
    var verified_only = $cont.find('.verified input:checkbox').is(':checked');

    var params = {
        id: id, name: name, location: loc, gender: gender, language: lang, age_min: age_min, age_max:age_max, fancyd_thing_ids: fancyd_thing_ids, purchased_sale_ids: purchased_sale_ids, verified_only: verified_only
    };
    return params;
}

function build_multitext_span(code, name) {
    var $span = $('<span/>').attr('code', code).text(name).append($('<a/>').attr('href', '#').addClass('btn-del').append($('<i/>').addClass('icon')));
    return $span;
}
function fill_list_information($cont, list_info) {
    $cont.attr('list-id', list_info.id);
    $cont.find('.name input:text').val(list_info.name);
    $cont.find('.location .multi-text').empty();
    $.each(list_info.location, function(idx, loc) {
        $cont.find('.location .multi-text').append(build_multitext_span(loc.code, loc.name));
    });
    $cont.find('.gender input:radio[name="gender"]').each(function() {
        $(this).prop('checked', $(this).val() == list_info.gender);
    });
    $cont.find('.language .multi-text').empty();
    $.each(list_info.language, function(idx, lang) {
        $cont.find('.language .multi-text').append(build_multitext_span(lang.code, lang.name));
    });
    $cont.find('.age input.start').val(list_info.age_min);
    $cont.find('.age input.end').val(list_info.age_max);

    $cont.find('.fancyd input:checkbox').prop('checked', list_info.fancyd_thing_ids.length > 0);
    $cont.find('.fancyd input:text').val(list_info.fancyd_thing_ids.join());

    $cont.find('.purchased input:checkbox').prop('checked', list_info.purchased_sale_ids.length > 0);
    $cont.find('.purchased input:text').val(list_info.purchased_sale_ids.join());
    
    $cont.find('.verified input:checkbox').prop('checked', list_info.verified_only);
}

function get_campaign_params() {
    var id = $('.create-campain.step1').attr('campaign-id');
    var list_params = get_list_params($('.create-campain.step1 .choose-audience .data-cont'));
    var list_id = list_params.id;
    var name = $('.create-campain.step2 .name input.text').val();
    var subject = $('.create-campain.step2 .subject input.text').val();
    var fromname = $('.create-campain.step2 .fromname input.text').val();
    var fromemail = $('.create-campain.step2 .fromemail input.text').val();
    var template = "";
    var delivery_specific = $('.create-campain.step4 .send-option input:radio#specific').is(':checked');
    if (delivery_specific) {
        var date = $('.create-campain.step4 .delivery-date input#datepicker').val();
        var hour = $('.create-campain.step4 .delivery-time .hour').val();
        var min = $('.create-campain.step4 .delivery-time .minute').val();
        var ampm = $('.create-campain.step4 .delivery-time .ampm').val();
        var timezone = $('.create-campain.step4 .delivery-time .timezone').val();
        var delivery_date = date+' '+hour+':'+min+':00 '+ampm;
    }
    else {
        var delivery_date = '';
        var timezone = '';
    }

    return {id: id, list_id: list_id, name:name, subject:subject, fromname:fromname, fromemail:fromemail, template:template, delivery_date:delivery_date, timezone:timezone}
}

function show_step(step) {
    $('.create-campain').hide();
    $('.create-campain.'+step).show();
}

// For both Campaign and List pages
$('.create-campain.step1')
    .on('change', '.choose-list select', function() {
        var list_id = $(this).val();

        var $list_cont = $('.create-campain.step1 .choose-audience .data-cont');
        if (list_id == 'new') {
            fill_list_information($list_cont, { id: 'new', name: '', gender: 'all', location: [], language: [], age_min: null, age_max: null, fancyd_thing_ids: [], purchased_sale_ids: [], verified_only: false });
        }
        else {
            $.get(BASE_URL+'/get_list_detail.json', {id: list_id}, function(response) {
                if (response.status_code == 1 && response.list) {
                    fill_list_information($list_cont, response.list);
                }
                else if (response.status_code == 0 && response.message) {
                    alert(response.message);
                }
            });
        }
        $('.create-campain.step1 .btn-next').prop('disabled', false);
    })
    .find('.choose-audience .data-cont')
        .on('click', '.location .btn-add', function() {
            var $loc = $(this).parents('.location');
            var code = $loc.find('select').val();
            var name = $loc.find('select option:selected').text();
            $loc.find('.multi-text').append(build_multitext_span(code, name));
        })
        .on('click', '.location .btn-del', function() {
            $(this).parents('span').remove();
        })
        .on('click', '.language .btn-add', function() {
            var $lang = $(this).parents('.language');
            var code = $lang.find('select').val();
            var name = $lang.find('select option:selected').text();
            $lang.find('.multi-text').append(build_multitext_span(code, name));
        })
        .on('click', '.language .btn-del', function() {
            $(this).parents('span').remove();
        })
    .end()
    .on('click', '.btn-next', function() {
        var $list_cont = $('.create-campain.step1 .choose-audience .data-cont');
        var params = get_list_params($list_cont);
        var id = params.id;
        function next_on_success(response) {
            if (response.status_code == 1 && response.list) {
                $list_cont.attr('list-id', response.list.id);
                $('.create-campain.step2 p input.text').keyup();
                show_step('step2');
            }
            else if (response.status_code == 0 && response.message) {
                alert(response.message);
            }
        }
        if (id == 'new') {
            $.post(BASE_URL+'/add_list.json', params, next_on_success);
        }
        else {
            $.post(BASE_URL+'/update_list_detail.json', params, next_on_success);
        }
    })

$('.create-campain.step1 .choose-list select').change();


// Campaign page - step2
$('.create-campain.step2')
    .on('click', '.btn-next', function() {
        show_step('step3');
    })
    .on('click', '.btn-back', function() {
        show_step('step1');
    })
    .on('keyup', '.subject input.text, .fromname input.text', function() {
        var $p = $(this).parents('p');
        var limit = $p.attr('limit');
        var remaining = limit - $(this).val().length;
        $p.find('span.remaining').text(remaining);
    })
    .on('keyup', 'p input.text', function() {
        var name = $('.name input.text').val();
        var subject = $('.subject input.text').val();
        var fromname = $('.fromname input.text').val();
        var fromemail = $('.fromemail input.text').val();
        
        var empty_exists = !(name.length>0 && subject.length>0 && fromname.length>0 && fromemail.length>0);
        $('.create-campain.step2 .btn-next').prop('disabled', empty_exists);
    })

// Campaign page - step3
$('.create-campain.step3')
    .on('click', '.btn-next', function() {
        var campaign_info = get_campaign_params();
        $.get(BASE_URL+'/get_list_detail.json', {id: campaign_info.list_id}, function(response) {
            if (response.status_code == 1 && response.list) {
                var list = response.list;
                $('.summary-recipient .name').text(list.name);
                var loc = $.map(list.location, function(l, idx) {return l.name}).join();
                var lang = $.map(list.language, function(l, idx) {return l.name}).join();
                function empty_if_null(val) {return (val != null) ? val.toString() : ''}
                var age = (list.age_min || list.age_max) ?  empty_if_null(list.age_min) + "-" + empty_if_null(list.age_max) + " year" : "";
                var gender = (list.gender) ? list.gender + " gender" : "";
                var num_recipients = list.subscribers_count;
                var detail = $.grep([loc, lang, age, gender], function(str, idx) {return str.length}).join();
                $('.summary-recipient .qty a').text(num_recipients + " recipient(s)");
                $('.summary-recipient .detail').text(detail);
                $('.summary-recipient .total .qty').text(num_recipients);
            }
        });

        $('.summary-info .detail.name').text(campaign_info.name);
        $('.summary-info .detail.subject').text(campaign_info.subject);
        $('.summary-info .detail.fromname').text(campaign_info.fromname);
        $('.summary-info .detail.fromemail').text(campaign_info.fromemail);
        
        show_step('step4');
    })
    .on('click', '.btn-back', function() {
        show_step('step2');
    })

// Campaign page - step4
$('.create-campain.step4')
    .on('click', 'a.edit', function() {
        var target = $(this).attr('target');
        show_step(target);
        return false;
    })
    .on('change', '.schedule .send-option input:radio[name="send-option"]', function() {
        var delivery_specific = $(this).attr('id') == 'specific';
        $('.create-campain.step4 .delivery-date input:text').prop('disabled', !delivery_specific);
        $('.create-campain.step4 .delivery-time select').prop('disabled', !delivery_specific);
    })
    .on('click', '.btn-schedule', function() {
        var params = get_campaign_params();
        $.post(BASE_URL+'/add_campaign.json', params, function(response) {
            if (response.status_code == 1) {
                location.href = BASE_URL + '/campaign';
            }
            else if(response.status_code == 0 && response.message) {
                alert(response.message);
            }
        });
    })
    .on('click', '.btn-save', function() {
        var params = get_campaign_params();
        $.post(BASE_URL+'/update_campaign.json', params, function(response) {
            if (response.status_code == 1) {
                location.href = BASE_URL + '/campaign';
            }
            else if(response.status_code == 0 && response.message) {
                alert(response.message);
            }
        });
    })
    .on('click', '.btn-back', function() {
        show_step('step3');
    })

$(function() {
    $( "#datepicker" ).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: "yy-mm-d"
    });
});

// List page
$('.lists')
    .on('click', '.btn-create', function() {
        var $list_cont = $('.popup.create-list .choose-audience .data-cont');
        fill_list_information($list_cont, { id: 'new', name: '', gender: 'all', location: [], language: [], age_min: null, age_max: null, fancyd_thing_ids: [], purchased_sale_ids: [], verified_only: false });

        $.dialog('create-list').open();
        return false;
    })
    .on('click', '.btn-manage', function() {
        var list_id = $(this).attr('list-id');
        $.get(BASE_URL+'/get_list_detail.json', {id: list_id}, function(response) {
            if (response.status_code == 1 && response.list) {
                fill_list_information($('.popup.modify-list .create-campain.step1 .data-cont'), response.list);
                $.dialog('modify-list').open();
            }
            else if (response.status_code == 0 && response.message) {
                alert(response.message);
            }
        });
    })

function reload_on_success(response) {
    if (response.status_code == 1) {
        location.reload(false);
    }
    else if (response.status_code == 0 && response.message) {
        alert(response.message);
    }
}
$('.popup.create-list .btn-create').click(function() {
    var params = get_list_params($('.popup.create-list .date-cont'));
    $.post(BASE_URL+'/add_list.json', params, reload_on_success);
})

$('.popup.modify-list .btn-save').click(function() {
    var params = get_list_params($('.popup.modify-list .data-cont'));
    $.post(BASE_URL+'/update_list_detail.json', params, reload_on_success);
})
