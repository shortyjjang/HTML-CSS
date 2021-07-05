// Clone-list dialog and buttons
jQuery(function($){
	var $clone = $('#clone-list'), dlg_clone = $.dialog('clone-list'), btn;

	$('#content,#sidebar,#summary').delegate('.btn-clone-list', 'click', function(event){
		if(event) event.preventDefault();
		btn = this;
		dlg_clone.open();
	});

	$clone
		.on('open', function(event){
			var $btn = $(btn);

			$clone.data({loid:$btn.attr('loid'), lid:$btn.attr('lid')});
			$('#name-clone-list').val('').focus();
		})
		.on('click', 'button.btn-clone', function(event){
			var params, list_name, $btn=$(this);

			event.preventDefault();

			list_name = $.trim($('#name-clone-list').val());
			user_name = $.trim($('#username-clone-list').val());
			if(!list_name) return alertify.alert(gettext('Please input name of list'));
			if(!user_name) return alertify.alert(gettext('Please input username of list'));

			if($btn.hasClass('loading')) return;
			$btn.addClass('loading').text(gettext('Cloning...'));
			var loid = $btn.attr('loid');
			var lid = $btn.attr('lid');
			params = {
				loid  : loid,
				lid   : lid,
				lname : list_name,
				uname : user_name,
			};

			function request(){
				$.ajax({
					type : 'post',
					url  : '/clone_list.xml',
					data : params,
					dataType : 'xml',
					success  : function(xml){ 
						var $xml=$(xml), $st=$xml.find('status_code'), error, msg;
						if(!$st.length) return;
						if($st.text() == 1){
							alertify.alert(gettext('You have successfully cloned this list.'));
							dlg_clone.close();
						} else if($st.text() == 0){
							error = $xml.find('error').text();
							msg   = $xml.find('message').text();
							if(error != 'list_exist'){
								alertify.alert(msg);
							} else if(confirm(msg)) {
								params['merge'] = 'true';
								request();
							}
						}
					},
					complete : function(){
						$btn.removeClass('loading').text(gettext('Clone List'));
					},
					error : function(){
						alertify.alert(gettext('Oops! Something went wrong.'));
					}
				});
			};
			request();
		})
		.on('keypress', '#name-clone-list', function(event){
			if(event.keyCode == 13) {
				$('button.btn-clone').click();
				return false;
			}
		});
});