$(document).ready(function() {
	function hide_category_popout() {
		var category_id = $('.popup.edit-thing .figure-infomation .lists-popout.category input:checked').eq(0).attr('id');
		var label_txt = $('.popup.edit-thing .figure-infomation .lists-popout.category').find('label[for="'+category_id+'"]').text().trim();
		$('.popup.edit-thing .select-category.category').text(label_txt);
		$('.popup.edit-thing .select-category').removeClass('focus');
		$('.popup.edit-thing .figure-infomation .lists-popout.category').hide();
	}
	function hide_lists_popout() {
		var list_names = $.map($('.popup.edit-thing .figure-infomation .lists-popout.lists input:checked'), function(elem) {
			var list_id = $(elem).attr('id');
			var label_txt = $('.popup.edit-thing .figure-infomation .lists-popout.lists').find('label[for="'+list_id+'"]').text().trim();
			return label_txt;
		});
		list_names = list_names.join(',');
		$('.popup.edit-thing .select-category.lists').text(list_names);
		$('.popup.edit-thing .select-category').removeClass('focus');
		$('.popup.edit-thing .figure-infomation .lists-popout.lists').hide();
	}

	$('.popup.edit-thing .figure-infomation .lists-popout.category .trick').click(function() {
		hide_category_popout();
	});
	$('.popup.edit-thing .figure-infomation .lists-popout.lists .trick').click(function() {
		hide_lists_popout();
	});
	hide_lists_popout();

	$('input#fancy-new-list').keypress(function(event) {
		var keycode = event.which;
		if (keycode == 13) {
			var list_name = $(this).val().trim();
			if (!list_name.length) return;

			if ($('input#list-new').length) {
				$('label[for="list-new"]').text(list_name);
				$('input#list-new').focus();
			} else {
				var $input = $('<input/>').attr('type', 'checkbox').attr('id', 'list-new').attr('lid', 'new').prop('checked', true);
				var $label = $('<label/>').attr('for', 'list-new').text(list_name);
				$('<li/>').append($input).append($label).appendTo('.popup.edit-thing .figure-infomation .lists-popout.lists ul');
				$input.focus();
			}
		}
	});

	$('.popup.edit-thing .btn-save').on('click',function() {
		var title = $('#fancy-title').val().trim();
		var link = $('#fancy-web-link').val().trim();
		var description= ($('#fancy-description').val()||'').trim();
		var category = $('.popup.edit-thing .figure-infomation .lists-popout.category input:checked').eq(0).val();
		var thing_id =$(this).attr('tid');
		var uid = $(this).attr('uid');

		if(title.length <=0 ){
			alert(gettext("Please enter title."));
			return false;
		}

		var param = {};
		param['name']=title;
		param['link']=link;
		param['description']=description;
		param['thing_id']=thing_id;
		param['uid']=uid;

		if(category !="-1" && category  != "-2")
			param['category']=category;

		var list_ids = $.map($('.popup.edit-thing .figure-infomation .lists-popout.lists input:checked').not('[id="list-new"]'), function(elem) {
			return $(elem).attr('lid');
		});

		if (list_ids.length>0){
			param['list_ids'] = list_ids.join(',');
		}
		if ($('input#list-new:checked').length) {
			param['list_name'] = $('label[for="list-new"]').text();
		}

		var selectedRow = $(this);
		function update_callback(xml) {
			var $xml = $(xml), $st = $xml.find('status_code'), msg = $xml.find('message').text();

			if ($st.text() == '0') {
				alert(msg);
			} else if ($st.text() == '1') {
				location.href = $(xml).find("thing_url").text();
			} else if ($st.text() == '2') {
				if (confirm(msg)) {
					param['ignore_dup_link'] = true;
					$.post("/update_new_thing.xml", param, update_callback, "xml");
				}
			}
		}
		$.post("/update_new_thing.xml",param, update_callback, "xml");

		return false;
	});

	$('.popup.edit-thing .figure-infomation .lists-popout.category input:checkbox').click(function() {
		var my_id = $(this).attr('id');
		if ($(this).is(':checked')) {
			$('.popup.edit-thing .figure-infomation .lists-popout.category input:checkbox').not('[id="'+my_id+'"]').each(function() {
				$(this).prop('checked', false);
			});
		}
	});

	$('.figure-img a.change-img').click(function(event) {
		event.preventDefault();

		var evt = document.createEvent("MouseEvents");
		evt.initEvent("click", true, false);
		document.getElementById('uploadphoto').dispatchEvent(evt);
	});

	$(".figure-img input:file").change(function(event){
		var $this = $(this);
		var fileval  = $this.val(), thing_id = $this.attr('tid'), uid = $this.attr('uid');
		var $em = $('.edit-thing.popup .progress > em');
		var $uploadButton = $('.edit-thing.popup a.change-img');

		$em.css('width', '1px').parent().show();
		$uploadButton.hide();

		if (fileval.length>0) {
			$.ajaxFileUpload({ 
				url:'/newthing_image.xml?thing_id='+thing_id+'&uid='+uid,
				secureuri:false,
				fileElementId:'uploadphoto',
				dataType: 'xml',
				success: function(xml, status) {
					var $xml = $(xml), $st = $xml.find('status_code'), $msg = $xml.find('message');

					if ($st.length && $st.text() == "1") {
						location.reload(false);	    
					} else if ($st.length && $st.text() == "0") {
						alert($msg.text());
						return false;
					} else {
						alert(gettext("Unable to upload file."));
						return false;
					}
				},
				error: function(data, status, e) {
					alert(e);
					return false;
				},
				complete : function(){
					$em.parent().hide();
				},
				progress : function(percent){
					$em.css('width', percent+'%');
					$uploadButton.css('display','');
				}
			});
			$('#uploadphoto').attr('value', '');
		}
		return false;
	});
});
