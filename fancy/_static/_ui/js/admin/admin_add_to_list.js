
// fancy/fancyd button and add-to-list popup
jQuery(function($){
	var dlg_list = $.dialog('add-to-list');
	var $list_popup = dlg_list.$obj;


	$list_popup.off('open');
	$list_popup
		.on({
			open : function(e){
				load_category();
				e.preventDefault();
			},
			close : function(){
				
			},
			mousedown : function(event){

			}
		})

	function load_category(){
		var tid = $('#thing-id').val();
		$list_popup.attr('tid', tid);

		var img_src = $('#file-list').find('li').attr('item_img_url');
		$list_popup.find('.item-image img').attr('src', img_src);

		$list_popup.find('.btn-want').hide();
		$list_popup.find('.btn-set').hide();

		$.ajax({
			type : 'get',
			url : '/_get_list_checkbox.html',
			data : {username:'giftguide', tid:tid, rtid:'111'},
			success : function(html){
				var $ul = $('.list-categories ul');
				$ul.html(html);
				$list_popup.attr('tid', tid);
			}
		});
	};

	$(".btn-admin-list").click(function(e){
		e.preventDefault();
		dlg_list.open()
		return false;
	});	

});



