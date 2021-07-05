var pagination = function(page, next) {
    $('.pagination').attr('page', page);
    
    if (page == 1) $('.pagination .prev').addClass('disabled');
    else $('.pagination .prev').removeClass('disabled');
    if (next) $('.pagination .next').removeClass('disabled');
    else $('.pagination .next').addClass('disabled');
};

var loadList = function(page, key, value) {
    $('.pagination').hide();
    $('.company-list .loading').show();

    var searchString = $('.search .text').val();
    var $table = $('.company-list > table');

    if ($table === [] && searchString === "") return;

    if (!page) page = $('.pagination').attr('page');
    var url = '/_admin/crm/get_company_list.json?p=' + page;
    if (searchString !== '') url += '&q=' + searchString;
    if (key && value) url += '&key=' + key + '&value=' + value;

    $.ajax({
        type : 'GET',
        url : url,
        dataType : 'json',
        success : function(json) {
            if (json) {
                if ($table != []) $table.remove();
                $('.pagination').before(json.list);
                if (page) pagination(page, json.has_next);
                $('.pagination').show();
            }
            $('.company-list .loading').hide();
        },
        error : function() {
            $('.company-list .loading').hide();
        }
    });
};

var loadRank = function() {
    var url = '/_admin/crm/get_rank_data.json';

    $.ajax({
        type : 'GET',
        url : url,
        dataType : 'json',
        success : function(json) {
            if (json) {
                $('.rank#contact').html(json.contact);
                $('.rank#categories').html(json.categories);
                $('.rank#location').html(json.location);
                $('.rank#partnership').html(json.partnership);
                $('.rank#level').html(json.level);
            }
        }
    });
};


var getData = function() {
    var data = {
        'name': $('.name .text').val(),
        'website': $('.website .text').val(),
        'contact': $('.contact .text').val(),
        'email': $('.email .text').val(),
        'phone': $('.phone .text').val(),
        'address1': $('.address .addr1').val(),
        'address2': $('.address .addr2').val(),
        'city': $('.address .city').val(),
        'state': $('.address .state').val(),
        'country': $('.address .country').val(),
        'zip': $('.address .zip').val(),
        'fst_date': $('.fst .calendar').val(),
        'fst_time': $('.fst .time').val(),
        'last_date': $('.last .calendar').val(),
        'last_time': $('.last .time').val(),
        'discount_code': $('.discount_code .text').val(),
        'discount_rate': $('.discount_per .text').val(),
        'note': $('.note .text').val(),
        'contact_job_title': $('.contact_job_title .text').val(),
        'entity_legal_name': $('.entity_legal_name .text').val(),
        'payment_terms': $('.payment_terms .text').val(),
        'credit_limit': $('.credit_limit .text').val(),
        'right_of_return': $('.right_of_return .text').val(),
        'min_order': $('.min_order .text').val(),
        'tax_id': $('.tax_id .text').val(),
    };

    if ($('.company-list').attr('id')) {
        data['id'] = $('.company-list').attr('id');
    }

    data['status'] = _.map($('.status .selected'), function(obj) {
        return obj.id;
    });
    data['status'] = JSON.stringify(data['status']);

    data['contactor'] = _.map($('.fancy .selected'), function(obj) {
        return obj.id;
    });
    data['contactor'] = JSON.stringify(data['contactor']);

    data['categories'] = _.map($('.cate .selected'), function(obj) {
        return obj.id;
    });
    data['categories'] = JSON.stringify(data['categories']);

    if ($('.level .selected').length) {
        data['level'] = $('.level .selected').attr('id');
    }
    if ($('.freight_terms .selected').length) {
        data['freight_terms'] = $('.freight_terms .selected').attr('id');
    }
    data['primary_currency_id'] = $('.primary_currency select').val();
    data['fancy_subsidiary_id'] = $('.fancy_subsidiary select').val();

    if ($('.social .added').length) {
        data['social_media'] = _.map($('.social .added'), function(obj) {
            return {
                'id': obj.id,
                'name': obj.children[0].value,
                'address': obj.children[1].value,
            };
        });
        data['social_media'] = JSON.stringify(data['social_media']);
    }

    if ($('.social .deleted').length) {
        data['deleted_social_media'] = _.map($('.social .deleted'), function(obj) {
            if (obj.id !== '') return obj.id;
        });
        data['deleted_social_media'] = JSON.stringify(data['deleted_social_media']);
    }

    if ($('.attach_file li.newfile').length) {
        data['attachments'] = _.map($('.attach_file li.newfile'), function(obj) {
            return {
                'path': obj.getAttribute('data-path'),
                'filename': obj.getAttribute('data-filename'),
            };
        });
        data['attachments'] = JSON.stringify(data['attachments']);
    }
    if ($('.attach_file li.deleted').length) {
        data['deleted_attachments'] = _.map($('.attach_file li.deleted'), function(obj) {
            if (obj.id !== '') return obj.id;
        });
        data['deleted_attachments'] = JSON.stringify(data['deleted_attachments']);
    }
    if ($('.more_contact.added').length) {
        data['more_contact'] = _.map($('.more_contact.added'), function(obj) {
            return {
                'id': obj.id,
                'name': obj.children[0].value,
                'title': obj.children[1].value,
                'email': obj.children[2].value,
                'phone': obj.children[3].value,
            };
        });
        data['more_contact'] = JSON.stringify(data['more_contact']);
    }
    if ($('.more_contact.deleted').length) {
        data['deleted_more_contacts'] = _.map($('.more_contact.deleted'), function(obj) {
            if (obj.id !== '') return obj.id;
        });
        data['deleted_more_contacts'] = JSON.stringify(data['deleted_more_contacts']);
    }

    _.map($('.fancy_dropship .selected'), function(obj) { data['is_' + obj.id] = true; });

    return data;
};

var validate = function(data) {
    // null check
    if (!data['name'] || data['name'] === '') {
        alert("Error. Company name is blank.");
        return false;
    }

    // type check

    if(data['discount_rate'] !== '') {
        //if(!$.isNumeric(data['discount_rate'])) {
        if(data['discount_rate'].length > 40) {
            alert("Error. The discount rate should be less than 40 characters.");
            return false;
        }
    }
    if(data['credit_limit'] !== '') {
        if(!$.isNumeric(data['credit_limit'])) {
            alert("Error. Please enter the valid credit limit.");
            return false;
        }
    }
    if(data['min_order'] !== '') {
        if(!$.isNumeric(data['min_order'])) {
            alert("Error. Please enter the valid minimum order amount in USD");
            return false;
        }
    }

    return true;
};

var saveCompany = function(data, needRefresh) {
    data['csrfmiddlewaretoken'] = $('[name="csrfmiddlewaretoken"]').val();
    $.ajax({
        type: 'POST',
        url: '/_admin/crm/update_data',
        data: data,
        dataType: 'json',
        success: function(response) {
            if (response.err_message) {
                alert(response.err_message);
            } else{
                var opener = window.opener;
                if (needRefresh && opener && opener != undefined) {
                    opener.refresh(response['company_id'], response['company_name']);
                 }
                window.location.href = '/_admin/crm/company';
            }
        }
    });
};

var getFilter = function() {
    return {
        key: $('table').attr('key'),
        value: $('table').attr('value')
    };
};

$('.search > input').on('keyup', function(e) {
    if (e.which == 13) {
        $('.pagination').attr('page', 1);
        loadList();
    }
});

$('.company-list').on('click', 'table > tbody > tr .btn-area .close', function(e) {
    var index = $(this).closest('tr').prevAll().length;

    $('table > tbody > tr').eq(index-1).removeClass('opened');
    $(this).closest('tr').remove();
});

$('.company-list').on('click', 'table > tbody > tr .btn-area .edit', function(e) {
    window.location.href = '/_admin/crm/edit_company?id=' + $(this).closest('td').attr('id');
});

$('.company-list').on('click', 'table > tbody > tr .btn-area .delete', function(e) {
    if (!window.confirm('Do you really want to delete this company?')) return;

    var $selectedDetail = $(this).closest('tr');
    var selectedRowIndex = $selectedDetail.prevAll().length;
    var data = {
        'id': $(this).closest('td').attr('id'),
        'csrfmiddlewaretoken': $('[name="csrfmiddlewaretoken"]').val(),
    };

    $.ajax({
        type : 'POST',
        url : '/_admin/crm/delete_company',
        data : data,
        success : function() {
            $selectedDetail.remove();
            $('table > tbody > tr').eq(selectedRowIndex-1).remove();
        }
    });
});

$('.company-list').on('click', 'table > tbody > tr', function(e){
    var $selected = $(this);
    if (!$selected.attr('id')) return;
    if ($selected.hasClass('opened')) return;

    var index = $selected.closest('tr').prevAll().length;
    
    $.ajax({
        type : 'GET',
        url : '/_admin/crm/get_detail_data.json?id=' + $(this).attr('id'),
        dataType : 'json',
        success : function(json) {
            if (json) {
                $('table > tbody > tr').eq(index).after(json.detail);
                $('.detail').show();
                $selected.addClass('opened');
				$('.tooltip').hover(function(){
					$(this).find('em').css('margin-left',-($(this).find('em').width()/2)-8+'px');
				});
            }
        }
    });
});

$('.company-list').on('click', 'table > tbody > tr .email .btn-save ', function(){
    var data = {
        'id': $(this).closest('td').attr('id'),
        'csrfmiddlewaretoken': $('[name="csrfmiddlewaretoken"]').val(),
        'email': $(this).parent().find('.text').val(),
    };

    var index = $(this).closest('tr').prevAll().length;

    $.ajax({
        type : 'POST',
        url : '/_admin/crm/save_email',
        data : data,
        success : function(json) {
            if (json && json.message) {
                alert(json.message);
                if (json.email) {
                    $('table > tbody > tr').eq(index-1).find('td:last').text(json.email);
                }
            }
        }
    });

});

$('ul.after').on('click', 'li', function() {
    if ($(this).find('button').length) return;

    var $closestDiv = $(this).closest('div');
    if ($closestDiv.hasClass('freight_terms')) {
        if($closestDiv.find('.selected').length>0){
            if($closestDiv.find('.selected').attr('id') != $(this).attr('id')){
                $closestDiv.find('.selected').removeClass('selected');
            }
        }
        $(this).toggleClass('selected');
        return;
    }
    if ($closestDiv.hasClass('level') || $closestDiv.hasClass('primary_currency') || $closestDiv.hasClass('fancy_subsidiary')) {
        $closestDiv.find('.selected').removeClass('selected');
    }
    $(this).toggleClass('selected');
});

$('.btn-area .btn-add').click(function() {
    window.location.href = '/_admin/crm/edit_company';
});

$('.btn-area .btn-cancel').click(function() {
    window.location.href = '/_admin/crm/company';
});

$('.btn-area .btn-save').click(function() {
    var data = getData();
    var needRefresh = false;
    if ($(this).attr('need-refresh') == "true") {
        needRefresh = true;
    }
    if (validate(data)) {
        saveCompany(data, needRefresh);
    }
});

var set_vendor_tag = function(v_id, tag, adding, force_update) { 
    $.ajax({
        type: 'POST',
        url: '/_admin/crm/update_processing_tag',
        data: {id:v_id, tag:tag, force_update:force_update, csrfmiddlewaretoken:$('[name="csrfmiddlewaretoken"]').val()},
        dataType: 'json',
        success: function(response) {
            if (response.status == 2) { 
                var force = window.confirm("Another vendor is using the tag, do you want to use this tag on this company and remove it from the previous company?");
                if (force) { 
                    set_vendor_tag(v_id, tag, adding, true);   
                } else { 
                    $('.company-list .tag input').val("");   
                }
            } else if (response.status == 1) {
                if (adding) {
                    $('.company-list .tag .btn-add-tag').hide(); 
                    $('.company-list .tag .btn-remove-tag').show(); 
                    $('.company-list .tag input').prop('disabled', true);    
                } else { 
                    $('.company-list .tag .btn-add-tag').show(); 
                    $('.company-list .tag .btn-remove-tag').hide(); 
                    $('.company-list .tag input').val("");   
                    $('.company-list .tag input').prop('disabled', false);   
                }
            } else if (response.err_message) {
                alert(response.err_message);
            }
        }
    });   
}

$('.company-list .tag .btn-add-tag').click(function () {
    set_vendor_tag($('.company-list').attr('id'), $('.company-list .tag input').val() , true, false);
}); 

$('.company-list .tag .btn-remove-tag').click(function () {
    set_vendor_tag($('.company-list').attr('id'), "" , false, false);    
}); 

$('.fancy > ul > li .btn-add').click(function() {
    $('.fancy fieldset.add-form').show();
    $(this).closest('li').hide();
});

$('.fancy > fieldset > .btn-add').click(function() {
    var username = $(this).parent().find('.text').val();
    if (username === '') {
        alert("Please check entered username.");
        return;
    }

    var data = {
        'csrfmiddlewaretoken': $('[name="csrfmiddlewaretoken"]').val(),
        'username': username
    };

    console.log(data);

    $.ajax({
        type : 'POST',
        url : '/_admin/crm/add_new_fancy_contact',
        data : data,
        success : function(json) {
            if (json.user_id && json.user_id != 0) {
                var addtionHtml = '<li id="' + json.user_id + '"><input type="checkbox" /><label>' + json.username + '</label></li>';
                $('.fancy > ul > li .btn-add').closest('li').before(addtionHtml);
                $('.fancy > fieldset > .text').val('');
            } else {
                alert(json.message);
            }
        }
    });
});

$('.fst > .date > .icon').click(function() {
    $(this).parent().find('.calendar').focus();
});

$('.last > .date > .icon').click(function() {
    $(this).parent().find('.calendar').focus();
});

$('.more_contacts').on('click', '.btn-add', function() {
    var $thisSpan = $(this).closest('span');
    var name = $thisSpan.find('.name').val().trim();
    var title = $thisSpan.find('.title').val().trim();
    var email = $thisSpan.find('.email').val().trim();
    var phone = $thisSpan.find('.phone').val().trim();

    if (name === '') {
        alert('Please check entered name.');
        return;
    }

    var addtionHtml = '<span class="more_contact added"><input type="text" disabled="disabled" class="text" value="' + name + '" />';
    addtionHtml += '<input type="text" disabled="disabled" class="text" value="' + title + '" />';
    addtionHtml += '<input type="text" disabled="disabled" class="text" value="' + email + '" />';
    addtionHtml += '<input type="text" disabled="disabled" class="text" value="' + phone + '" />';
    addtionHtml += '<button class="btns-white btn-delete"><i class="icon"></i></button></span>';

    $thisSpan.before(addtionHtml);
    $thisSpan.find('.name').val('');
    $thisSpan.find('.title').val('');
    $thisSpan.find('.email').val('');
    $thisSpan.find('.phone').val('');
});

$('.more_contacts').on('click', '.btn-delete', function() {
    var $thisSpan = $(this).closest('span');
    $thisSpan.removeClass('added');
    $thisSpan.addClass('deleted');
    $thisSpan.hide();
});

$('.social').on('click', '.btn-add', function() {
    var $thisSpan = $(this).closest('span');
    var name = $thisSpan.find('.name').val();
    var address = $thisSpan.find('.url').val();

    if (name === '' || address === '') {
        alert('Please check entered name and url.');
        return;
    }

    var addtionHtml = '<span class="sns-item added"><input type="text" class="text" value="' + name + '" placeholder="Social Media Name" />';
    addtionHtml += '<input type="text" class="text" value="' + address + '" placeholder="Social Media URL" />';
    addtionHtml += '<button class="btns-white btn-delete"><i class="icon"></i></button></span>';

    $thisSpan.before(addtionHtml);
    $thisSpan.find('.name').val('');
    $thisSpan.find('.url').val('');
});

$('.social').on('click', '.btn-delete', function() {
    var $thisSpan = $(this).closest('span');
    $thisSpan.removeClass('added');
    $thisSpan.addClass('deleted');
    $thisSpan.hide();
});

$('.pagination .prev').click(function() {
    if ($(this).hasClass('disabled')) return;

    var page = parseInt($('.pagination').attr('page'), 10) -1;
    if (page < 1) return;

    var filter = getFilter();
    loadList(page, filter.key, filter.value);
});

$('.pagination .next').click(function() {
    if ($(this).hasClass('disabled')) return;

    var page = parseInt($('.pagination').attr('page'), 10) +1;
    var filter = getFilter();
    loadList(page, filter.key, filter.value);
});

$('.btn-action').on('change', function () {
    var selected_value = $('select.btn-action option:selected').val();
    if (selected_value == 'download_csv') {
        window.location.href = '/_admin/crm/download_company_list';
    }
});

$('.rank').on('click', 'ul > li > .label > a', function() {
    var key = $(this).closest('div').attr('id');
    var value = $(this).closest('span').attr('id');
    loadList(1, key, value);
});

$(window).load(function(){
    if (!$('.company-add').length) {
        loadList();
        loadRank();
    }
});
