$(function(){

    $("#content")
        .delegate(".activityFeed .controller a.edit-post","click", function(e){
            e.preventDefault();
            var $this = $(this);
            var $activity = $this.closest('[data-activity-id]');
            $(this).closest('.controller').removeClass('show');
            openPostPopup($activity);
        })
        .delegate("a.delete-post","click", function(e){
            e.preventDefault();
            var $this = $(this);
            var original_labels = alertify.labels;
            alertify.set({
                labels: {
                    ok     : "Delete",
                    cancel : "Cancel"
                }
            });
            alertify.confirm('Are you sure you want to delete your post?', function(e){
                if(e){
                    var $activity = $this.closest('[data-activity-id]');
                    var activity_id = $activity.data('activity-id');
                    var url = '/delete-activity-post.json';
                    var object_id = activity_id;
                    $.post(url, {'activity_id':activity_id}, function(){
                    $activity.remove();
                    });
                }
            })
            $(this).closest('.controller').removeClass('show');
            alertify.set({labels: original_labels})
        });

    $(".admin-post #content")
        .delegate("a.edit-post","click", function(e){
            e.preventDefault();
            var $this = $(this);
            var $activity = $this.closest('[data-activity-id]')
            openAdminEditPopup($activity);
        })
        .delegate("a.hide-post","click", function(e){
            e.preventDefault();
            var $this = $(this);
            var $activity = $this.closest('[data-activity-id]');
            var activity_id = $activity.data('activity-id');
            var url = '/toggle-activity-post.json';
            var object_id = activity_id;
            $.post(url, {'activity_id':activity_id, 'show' : 'false'}, function(){
		location.reload();
	    });
        })
        .delegate("a.show-post","click", function(e){
            e.preventDefault();
            var $this = $(this);
            var $activity = $this.closest('[data-activity-id]');
            var activity_id = $activity.data('activity-id');
            var url = '/toggle-activity-post.json';
            var object_id = activity_id;
            $.post(url, {'activity_id':activity_id, 'show' : 'true'}, function(){
		location.reload();
            });
	});
    var $tpl_saleitem = $("#tpl-search-saleitem");
    var $tpl_charity  = $("#tpl-search-charity");

    function show_suggest(result, type) {
	var $c = $('.popup.create-post .search .suggest');
	$c.find('ul').empty();
	
	if (!result.length) {
	    $c.hide();
	    return;
	}
	$c.show();
	if (type == 'saleitems') {
	    
	    _.each(result, function(item) {
		$tpl_saleitem.template({IMAGE:item.sale_item_images[0].thumb_image_url_200, TITLE:item.title, PRICE:item.deal_price, BRAND:item.seller.brand_name.toUpperCase(), ID:item.sale_id}).appendTo($c.find('ul'));
	    });
	    
	} else if (type == 'charity') {
	    _.each(result, function(item) {
		var n = item.user.num_followers;
		var f_string = (n == 1 ? n + ' FOLLOWER' : n + ' FOLLOWERS')
		$tpl_charity.template({TITLE:item.user.fullname, FOLLOWERS:f_string, ID:item.id, IMAGE:item.user.image_url}).appendTo($c.find('ul'));
	    });
	}
    }

    function find(word, type){
	$('.popup.create-post .search .suggest').addClass('loading')
        $.ajax({
            type : 'GET',
            url  : '/search.json',
            data : {q:word, target:type, per_page:20, search_for:'activity-post'},
            dataType : 'json',
            success  : function(json){
                console.log(json);
                var result = null;
                try {
                    if (type == 'saleitems') {
                    result = json.sale_items;
                    show_suggest(result, 'saleitems');
                    } else if (type == 'charity') {
                    result = json.charities;
                    show_suggest(result, 'charity');
                    }
                    $('.popup.create-post .search .suggest').removeClass('loading')
                } catch(e) {
                    console.log(e);
                }
            }
        });
    }

    $(".add-posts .buttons")
	.on('click', function(e){
	    e.preventDefault();
	    openPostPopup();
	    return false;
	});
	$(".popup.create-post textarea").not(".admin")
	.on('focus', function(e){
	    if ($(window).width() < 920 && !$(this).closest('.create-post').hasClass('focus')) {
		$(this).closest('.create-post').addClass('focus');
		var sc = $(window).scrollTop();
		$('html').addClass('show_post');
		$('#wrap > #container-wrapper').css('top',-sc+'px').attr('data-top',sc);
		resetPostPopup();
	    }
	});

    $('.popup.create-post').not(".admin")
        .on('click', function(e){
            if(event.target === this) {
                $(this).removeClass('focus');
				$('html').removeClass('show_post');
				var sc = $('#wrap > #container-wrapper').attr('data-top');
				$('#wrap > #container-wrapper').css('top','');
				$(window).scrollTop(sc);
				resetPostPopup();
            }
        })
        .find('.ly-close')
        .on("click", function(e){
            $(this).closest('.popup.create-post').removeClass('focus');
			$('html').removeClass('show_post');
			var sc = $('#wrap > #container-wrapper').attr('data-top');
			$('#wrap > #container-wrapper').css('top','');
			$(window).scrollTop(sc);
			resetPostPopup();
			return false;
        });

    function initCreatePostTab(type) {
	var $popup = $('.popup.create-post');
	if (type == 'image') {
	    var $btn = $popup.find('.btn-image');
	    $btn.closest('.type')
		.find('button').removeClass('current').end().end().addClass('current');
	    $popup.find('.selected,.search').hide();
	} else if (type == 'product') {
	    var $btn = $popup.find('.btn-product');
	    $btn.closest('.type')
		.find('button').removeClass('current').end().end().addClass('current');
	    $popup.find('.uploaded, .selected').hide().end().find('.search').show().find('input').attr('placeholder','Search for a product on Gear').val('').end().find('.suggest').hide().find('ul').empty();
	} else if (type == 'charity') {
	    var $btn = $popup.find('.btn-charity');
	    $btn.closest('.type')
		.find('button').removeClass('current').end().end().addClass('current');
	    $popup.find('.uploaded, .selected').hide().end().find('.search').show().find('input').attr('placeholder','Search for a charity on Gear').val('').end().find('.suggest').hide().find('ul').empty();
	}
    }

    function openPostPopup($update) {
		resetPostPopup();
		var $popup = $('.popup.create-post');
		var $button = $popup.find('.share-post.buttons');
		if ($update) {
			$popup.addClass('update');
			var item_type = $update.find(".posts").data('type');
			var $tpl_saleitem = $("#tpl-search-saleitem");
			var $tpl_charity  = $("#tpl-search-charity");

			initCreatePostTab(item_type);
			$popup.data('activity-id', $update.data('activity-id'))
			var text = $update.find('.posts .text').html();
			$popup.find("textarea").val(text);
			if (item_type == 'image') {
			var image_url = $update.find(".posts .image img").attr('src');
			var $container = $popup.find('.uploaded');
			$container.find('img').css('background-image', 'url(' + image_url + ')');
			$container.show();
			} else if (item_type == 'product') {
			var $info = $popup.find('.search').hide().end().find('.selected').find('.info');
			var $sale_item  = $update.find('.posts .activityItem');
			var image_url = $sale_item.data('thumbnail');
			var title = $sale_item.data('title');
			var sale_id = $sale_item.data('id');
			var brand_name = $sale_item.data('brand_name');  
			var price = $sale_item.data('price');  
			var $item = $tpl_saleitem.template({IMAGE:image_url, TITLE:title, PRICE:price, BRAND:brand_name, ID:sale_id})
			$info.html($item.find('.info').html()).end().show();
			$info.closest("li").data($item.data());
			} else if (item_type == 'charity') {
			var $info = $popup.find('.search').hide().end().find('.selected').find('.info');
			var $charity = $update.find('.posts .charity');
			var n = $charity.data('num_followers');
			var f_string = (n == 1 ? n + ' FOLLOWER' : n + ' FOLLOWERS')
			var fullname = $charity.data('fullname');
			var item_id = $charity.data('id');
			var image_url = $charity.data('image_url');
			var $item = $tpl_charity.template({TITLE:fullname, FOLLOWERS:f_string, ID:item_id, IMAGE:image_url});
			$info.html($item.find('.info').html()).end().show();
			$info.closest("li").data($item.data());
			}
			$button.removeAttr("disabled").html("<em>Update </em>Post");
		} else {
			$popup.removeClass('update');
			$popup.data('activity-id', null)
			$button.html("<em>Share </em>Post"); 
		}
		$popup.addClass('focus');
		if ($('html').hasClass('show_post')) {
			$('html').removeClass('show_post');
			var sc = $('#wrap > #container-wrapper').attr('data-top');
			$('#wrap > #container-wrapper').css('top','');
			$(window).scrollTop(sc);
		}else{
			var sc = $(window).scrollTop();
			$('#wrap > #container-wrapper').css('top',-sc+'px').attr('data-top',sc);
			$('html').addClass('show_post');
		}
    }

    function openAdminEditPopup($update) {
	resetPostPopup();
	var $popup = $('.popup.create-post');
	var $button = $popup.find('.share-post.buttons');
	$popup.addClass('update');
	$popup.addClass('admin');
	var item_type = $update.data('type');
	var $tpl_saleitem = $("#tpl-search-saleitem");
	var $tpl_charity  = $("#tpl-search-charity");
	var is_active = $update.data('is_active');
	initCreatePostTab(item_type);
	$popup.data('activity-id', $update.data('activity-id'))
	$popup.find("textarea").val($update.data('text'));

	var $bg = $update.find('.user .thumb').css('background-image');
        var avatar_url = $bg.replace('url(','').replace(')','').replace(/\"/gi, "");
	$popup.find(".text .avatar").css('background-image', 'url(' + avatar_url + ')');

	if (item_type == 'image') {
	    var image_url = $update.data('image');
	    var $container = $popup.find('.uploaded');
	    $container.find('img').css('background-image', 'url(' + image_url + ')');
	    $container.show();
	} else if (item_type == 'product') {
	    var $info = $popup.find('.search').hide().end().find('.selected').find('.info');
	    var image_url = $update.data('image');
	    var title = $update.data('title');
	    var sale_id = $update.data('id');
	    var brand_name = $update.data('brand_name');  
	    var price = $update.data('price');  
	    var $item = $tpl_saleitem.template({IMAGE:image_url, TITLE:title, PRICE:price, BRAND:brand_name, ID:sale_id})
	    $info.html($item.find('.info').html()).end().show();
	    $info.closest("li").data($item.data());
	} else if (item_type == 'charity') {
	    var $info = $popup.find('.search').hide().end().find('.selected').find('.info');
	    var n = $update.data('num_followers');
	    var f_string = (n == 1 ? n + ' FOLLOWER' : n + ' FOLLOWERS')
	    var fullname = $update.data('fullname');
	    var item_id = $update.data('id');
	    var image_url = $update.data('image');
	    var $item = $tpl_charity.template({TITLE:fullname, FOLLOWERS:f_string, ID:item_id, IMAGE:image_url});
	    $info.html($item.find('.info').html()).end().show();
	    $info.closest("li").data($item.data());
	}
	$button.removeAttr("disabled").html("<em>Update </em>Post");
	$.dialog('create-post').open();
    }

    function resetPostPopup() {
	var $popup = $(".popup.create-post"); 
	$popup.removeClass('update');
	$popup.find('.type button').removeClass('current');
	$popup.find('.uploaded').hide().data('file', null).data('filename', null)
	    .find('img').css('background-image', 'none');
	$popup.find('.selected,.search').hide();
	$popup.find(".text textarea").val('');
	$popup.find('.share-post.buttons').prop("disabled", true);
    }

    function getActivePost() {
	var $popup = $(".popup.create-post");
	if ($popup.find('.btn-image').hasClass('current')) return 'image';
	if ($popup.find('.btn-product').hasClass('current')) return 'product';
	if ($popup.find('.btn-charity').hasClass('current')) return 'charity';
	return null;
    }

    function getFormData(type) {
	var $popup = $(".popup.create-post");
	var formData = new FormData();
	var text = $popup.find(".text textarea").val();
	formData.append('text', text);
	var is_update = $popup.hasClass('update');
	if (is_update) {
	    formData.append('activity_id', $popup.data('activity-id'));
	}
	if (type == 'image') {
	    var $container = $popup.find('ul.uploaded');
	    if ($container.is(':visible')) {
		if (is_update) {
		    if ($container.data('file')) {
			formData.append('image', $container.data('file'), $container.data('filename'));
		    }
		} else {
		    formData.append('image', $container.data('file'), $container.data('filename'));
		}
	    } else {
		type = 'text';
	    }
	} else if (type == 'product') {
	    var $container = $popup.find('ul.selected');
	    if ($container.is(':visible')) {
		formData.append('object_id', $container.find('.items').data('item_id'));
	    } else {
		type = 'text';
	    }
	} else if (type == 'charity') {
	    var $container = $popup.find('ul.selected');
	    if ($container.is(':visible')) {
		formData.append('object_id', $container.find('.items').data('item_id'));
	    } else {
		type = 'text';
	    }
	} else {
	    type = 'text';
	}
	formData.append('type', type);

	return formData;
    }

    function showPostButtonIfAvailable() {
	var $popup = $(".popup.create-post");
	var available = ($popup.find(".text textarea").val().length > 0);
	if (available) {
	    if ($popup.find('.text').find('.trick-value').outerHeight()>18) {
		$popup.find('.text').find('.trick-value').text($popup.find(".text textarea").val()).end().find('textarea').css('height',($popup.find('.text').find('.trick-value').outerHeight()+18)+'px').css('padding-top','0');
	    }else{
		$popup.find('.text').find('.trick-value').text($popup.find(".text textarea").val()).end().find('textarea').css('height',$popup.find('.text').find('.trick-value').outerHeight()+'px').css('padding-top','');
	    }
	    $popup.find('.share-post.buttons').removeAttr('disabled');
	} else {
	    $popup.find('.text').find('.trick-value').text('').end().find('textarea').css('height','').css('padding-top','');
	    $popup.find('.share-post.buttons').prop("disabled", true);
	}
	return available;
    }

    $(".popup.create-post")
	.on('click', '.share-post.buttons', function(e) {
	    e.preventDefault();
	    var $popup = $('.popup.create-post')
	    var type = getActivePost();
	    var formData = getFormData(type);
	    var url = $popup.hasClass('update') ? '/update-activity-post.json' : '/add-activity-post.json';
	    var $this = $(this);
	    $this.prop('disabled', true);

	    $.ajax({
                url: url,
                method: 'POST',
                data: formData,
                contentType: false,
                processData: false
	    }).then(function(res) {
		if (res.status_code === 1) {
		    location.reload();
		} else if (res.message) {
		    $this.removeAttr('disabled');
		    alertify.alert(res.message);
		}
            }).fail(function(res) {
		$this.removeAttr('disabled');
		alertify.alert(res.responseText);
            })
	})
	.on('keyup', '.text textarea', function(e) {
	    showPostButtonIfAvailable();
	})
	.on('click', '.search .suggest .info', function(e) {
            e.preventDefault();
	    var $info = $(this).closest('.popup').find('.search').hide().end().find('.selected').find('.info');
	    $info.html($(this).html()).end().show();
	    $info.closest("li").data($(this).closest("li").data());
	    showPostButtonIfAvailable();
	})
	.on('click', '.selected .delete', function(e) {
            e.preventDefault();
	    $(this).closest('.popup').find('.selected').hide().find(".info").empty();
	    $(this).closest('.popup').find('.search').show().find('input').val('').end().find('.suggest').hide().find('ul').empty();
	    showPostButtonIfAvailable();
	})
	.on('click', '.uploaded .delete', function(e) {
            e.preventDefault();
	    $(this).closest('.popup').find('.uploaded').hide().data('file', null).data('filename', null)
		.find('img').css('background-image', 'none');
	    var input = $(this).closest('.popup').find('.btn-image input');
	    input.replaceWith(input.val('').clone(true));
	    showPostButtonIfAvailable();
	})
        .on('change', '#activity-image-upload', function() {
	    if (!this.value) {
                return false;
	    }
	    var reader = new FileReader();
	    var file = $('#activity-image-upload').prop('files')[0];
	    var $container = $(this).closest('.popup').find('.uploaded');
	    $container.find('img').css('background-image', 'none').end().show();
	    reader.onload = function(event) {
                $container.data('file', file)
                $container.data('filename', file.name)
		$container.find('img').css('background-image', 'url(' + event.target.result + ')');
		showPostButtonIfAvailable();
	    };
	    reader.readAsDataURL(file);
        })
	.on('click', '.btn-image', function(e) {
	    initCreatePostTab('image');
	})
	.on('click', '.btn-product', function(e) {
            e.preventDefault();
	    if ($(this).hasClass('current')) {
		return false;
	    }
	    initCreatePostTab('product');
	})
	.on('click', '.btn-charity', function(e) {
            e.preventDefault();
	    if ($(this).hasClass('current')) {
		return false;
	    }
	    initCreatePostTab('charity');
	});

    var $textbox = $('.popup.create-post .search > input');
    var prev_keyword = '';
    var timer = null;

    $textbox.on('keyup', function(e) {
        var kw = $.trim($textbox.val());
	var $cont = $('.popup.create-post .search .suggest');
	var type = 'saleitems';
	if ($('.popup.create-post .btn-product').hasClass('current')) {
	    type = 'saleitems';
	} else if ($('.popup.create-post .btn-charity').hasClass('current')) {
	    type = 'charity';
	} else {
	    return false;
	}

        $textbox.attr('data-prev-val', kw);
        if(!kw.length) {
	    $cont.hide().find('ul').empty();
            return ;
        }
        if(kw != prev_keyword ) {
            prev_keyword = kw;
            $cont.hide().find('ul').empty();
            clearTimeout(timer); 
	    timer = setTimeout(function(){ find(kw, type); }, 500);
        } else {
	    if (!$cont.find('li').length) {
                clearTimeout(timer); 
		timer = setTimeout(function(){ find(kw, type); }, 500);
	    }
	}
    })
})
