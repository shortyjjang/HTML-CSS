jQuery(function($){
    $('.store_lists .btn-create').on('click', function(e) {
        e.preventDefault();
        openPopup('add_new_banner', 'create');
    });

    $('#banner-large-image').fileupload({
        dataType : 'json',
        url      : '/_admin/featured-banner/upload-image.json',
        start    : function() {
            $('.create_store .image').addClass('loading').find("img").css('backgroundImage','');
        },
        done     : function(e, data) {
            $('.create_store .image img').css('backgroundImage', 'url('+data.result.image_url+')');
            $('.create_store .image input[name=image_path]').val(data.result.image_path);
        },
        always  :function(){
            $('.create_store .image').removeClass('loading');
        }
    }); 

    $('.banner-visibility').on('change', function(e) {
		var selected = $(this).val();
		if (selected == 4) {
			$('.select-category-wrapper').show();
		} else {
			$('.select-category-wrapper').hide();
		}
    });

    $.get('/rest-api/v1/products/categories?root').then(function(json) {
        var catEls = json.categories.map(function(cat) {
            return $('<option value="' + cat.id_str + '">' + cat.display + '</option>')
        });
        $('.select-category-wrapper .banner-category').append(catEls);
    });

    function openPopup(popupId, mode, $banner) {
        $('.popup form').attr('id', popupId);
        if (mode === 'create') {
            $('#popup_container .create_store').find('.ltit').text('Create Featured Banner');
            $('#popup_container .create_store').find('input[type="text"], input[type="hidden"]').val('');
            $('#popup_container .create_store select.banner-type').val('newthing').change();
            $('#popup_container .create_store select.banner-visibility').val('0').change();
            $('#popup_container .create_store select.banner-position').val('top').change();
            $('#popup_container .create_store').find('button[type="submit"]').text('Add New Banner');
            $('#popup_container .create_store .image img').css('backgroundImage', '');
        } else if (mode === 'edit') {
            $('#popup_container .create_store').find('.ltit').text('Edit Featured Banner');
            $('#popup_container .create_store').find('button[type="submit"]').text('Save changes');
            $('#popup_container .create_store').attr('data-id', $banner.data('id'));
            fillPopup($banner);
        } else {
            return;
        }
		$.dialog('create_store').open();
    }

    function fillPopup($banner) {
        console.log("fillPopup");
        console.log($banner.data('id'));
        $('.create_store .image img').css('backgroundImage', 'url('+$banner.attr('data-banner-image-large')+')');
        $('.create_store .image input[name=image_path]').val($banner.attr('data-banner-image-path'));
        $('.create_store input[name=name]').val($banner.find('.title').text());
        $('.create_store select.banner-type').val($banner.find('.type').data('value'));
        $('.create_store select.banner-category').val($banner.find('.category').data('value')||'');
        $('.create_store select.banner-visibility').val($banner.find('.visibility').data('value')).change();
        $('.create_store select.banner-position').val($banner.find('.position').data('value'));
        $('.create_store input[name=obj]').val($banner.find('.obj').data('value'));
    }

    $('.popup .btn-cancel, .popup .ly-close').on('click', function(e){
        e.preventDefault();
        $(this).closest('#popup_container').hide().removeAttr('class');
    });

	$('#popup_container .create_store')
	.on('submit', 'form#add_new_banner', function(e){
		console.log("add_new_banner submit")
		e.preventDefault();
		var $btn = $(this).find('.btn-save');
		if ($btn.hasClass('loading')) return;

		var name = $('.popup input[name=name]').val();
		if (!name || name === '') {
			alert('Please enter a name.');
			return;
		}

		var obj = $('.popup input[name=obj]').val();
		if (!obj || obj === '') {
			alert('Please enter a object.');
			return;
		}

		var objectType = $('.popup select.banner-type').val();
		var objectId = $('.popup input[name=obj]').val();
		var name = $('.popup input[name=name]').val();
		var visibility = $('.popup select.banner-visibility').val();
		var position = $('.popup select.banner-position').val();
		var category_id = $('.popup select.banner-category').val();
		
		var image_path = $('.popup .image input[name=image_path]').val();
		if (image_path.length <= 0) {
			alert('Image files are required.');
			return;
		}

		var formData = {};
		formData['type'] = objectType;
		formData['obj'] = objectId;
		formData['name'] = name;
		formData['visibility'] = visibility;
		formData['position'] = position;
		formData['category_id'] = category_id;
		formData['image_path'] = image_path;

		$btn.addClass('loading');
		$.ajax({
			type: 'POST',
			url: '/_admin/featured-banner/add.json',
			data: formData,
			cache: false,
			success: function(response) {
				if (response.error_message) {
					alert(response.error_message);
					$btn.removeClass('loading');
				} else {
					location.reload();
				}
			},
		});
	})
	.on('submit', 'form#edit_banner', function(e){
        console.log('edit_banner submit');
        e.preventDefault();
        var $btn = $(this).find('.btn-save');
        if ($btn.hasClass('loading')) return;

        var bannerId = $('.popup.create_store').data('id');
        
        var objectType = $('.popup select.banner-type').val();
        var objectId = $('.popup input[name=obj]').val();
        var name = $('.popup input[name=name]').val();
        var visibility = $('.popup select.banner-visibility').val();
        var position = $('.popup select.banner-position').val();
        var category_id = $('.popup select.banner-category').val();
        var image_path = $('.popup .image input[name=image_path]').val();
        
        var formData = {};
        formData['type'] = objectType;
        formData['obj'] = objectId;
        formData['name'] = name;
        formData['visibility'] = visibility;
        formData['position'] = position;
        formData['category_id'] = category_id;
        formData['image_path'] = image_path;

        $btn.addClass('loading');
        $.ajax({
            type: 'POST',
            url: '/_admin/featured-banner/' + bannerId + '/edit.json',
            data: formData,
            cache: false,
            success: function(response) {
                if (response.error_message) {
                    alert(response.error_message);
                    $btn.removeClass('loading');
                } else {
                    location.reload();
                }
            },
        });
	});

    function inputTextValid() {
        var name = $('.popup input[name=name]').val();
        if (!name || name === '') {
            alert('Please enter a name.');
            return false;
        }

        var obj = $('.popup input[name=obj]').val();
        if (!obj || obj === '') {
            alert('Please enter a object.');
            return false;
        }

        return true;
    }

    $('.popup select.banner-type').on('change', function(e) {
        var selected = $(this).val();
        var $obj = $('.popup input[name=obj]');
        var placeholder = '';
        if (selected == 'newthing') {
            placeholder = 'Thing ID';
        } else if (selected == 'fancylist') {
            placeholder = 'List ID';
        } else if (selected == 'article') {
            placeholder = 'Article slug';
        } else if (selected == 'shopcollection') {
            placeholder = 'collection ID';
        } else if (selected == 'saleitemseller') {
            placeholder = 'Username of the store';
        } else if (selected == 'sellerstorelist') {
            placeholder = 'Path value from https://fancy.com/admin/manage-store-lists';
        }
        $('.popup input.type').val(selected);
        $obj.attr('placeholder', placeholder);
    });

    $('a.btn-del').on('click',function(e){
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete?')){
            var $row = $(this).closest('tr');
            var bannerId = $row.data('id');
            $.post('/_admin/featured-banner/delete.json', { banner_id: bannerId }, function(response) {
                if (response.error_message) {
                    alert(response.error_message);
                } else {
                    $row.remove();
                }
            });
        }
    });

    $('a.btn-edit').on('click', function(e) {
        e.preventDefault();
        var $banner = $(this).closest('tr');
        openPopup('edit_banner', 'edit', $banner);
    });

    $('a.btn-top').on('click', function(e){
        var $tr = $(this).closest('tr');
        $tr.prependTo( $tr.closest('tbody') ); 
        $('tbody').sortable('disable');
        var order = [];
        _.each($('tbody > tr'), function(tr){
            var idx = valid_orders[tr.rowIndex-1];
            order.push({id:$(tr).data('id'), order:idx});
            $(tr).attr('data-order', idx);
        });
        
        var params = {
            'order': JSON.stringify(order)
        };

        $.post('/_admin/featured-banner/update_order.json', params, function(response){
            if (response.err_message) {
                alert(response.err_message);
            }
            $tr.closest('tbody').sortable('enable');
        }, 'json');
    })

    var valid_orders = [];
    $('#content tbody > tr').each(function(i){
        var order = $(this).data('order');
        valid_orders.push(order);
    })

    $('tbody').sortable({
        handle: '.btn-move',
        containment: '.items.wrapper',
        forcePlaceholderSize: true,
        tolerance: 'intersect',
        start: function(e, ui) {
            ui.item.css('background-color', 'white');
        },
        update: function(e, ui) {
            $('tbody').sortable('disable');
            var order = [];
            _.each($('tbody > tr'), function(tr){
                var idx = valid_orders[tr.rowIndex-1];
                order.push({id:$(tr).data('id'), order:idx});
                $(tr).attr('data-order', idx);
            });
            
            var params = {
                'order': JSON.stringify(order)
            };

            $.post('/_admin/featured-banner/update_order.json', params, function(response){
                if (response.err_message) {
                    alert(response.err_message);
                }
                ui.item.closest('tbody').sortable('enable');
            }, 'json');
        },
    }).disableSelection();

    $('[name=filter_by]').on('change', function(e) {
        e.preventDefault();
        var filter_by = $(this).val();
        location.href = "?filter_by="+filter_by;
    });

});
