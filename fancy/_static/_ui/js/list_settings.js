jQuery(function($){
	$('.save').click(function(event){
		event.preventDefault();

		var title = $('#setting-title').val().trim();
		var privacy_mode = $('#make-private').is(':checked');
		var lid = $(this).attr('lid');
		var oid = $(this).attr('oid');

		var category_id = $('input[name=category]:checked').val()

		var param = {};
		param['title']=title;
		param['privacy_mode'] = (privacy_mode == false)?0:1;

		if(category_id != undefined && category_id != null){
			param['category_id']=category_id;
		}
		param['lid']=lid;
		param['oid']=oid;

		$.post("/update_list.xml",param, 
			function(xml){
				if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
					var url = $(xml).find("url").text();
					location.href = url;
				}
				else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
					var msg = $(xml).find("message").text();
					alertify.alert(msg);
				}
			}, "xml");

		return false;
	});

	$("a.button.send").click(function(event){
		var lid = $(this).attr('lid');
		var oid = $(this).attr('oid');

		var param = {};
		param['lid']=lid;
		param['oid']=oid;

		$.post("/delete_list.xml",param, 
			function(xml){
				if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
					var url = $(xml).find("url").text();
					location.href = url;
				}
				else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
					var msg = $(xml).find("message").text();
					alertify.alert(msg);
				}
			}, "xml");
		return false;
	});

	$('.delete.settings').click(function(event){
		var $this = $(this), lid = $this.attr('lid'), oid = $this.attr('oid');

		event.preventDefault();

		if(!lid || !oid || $this.hasClass('loading')) return;
        alertify.confirm(gettext('Are you sure?'),function(e){
        if (e){
		$this.addClass('loading');

		$.ajax({
			type : 'POST',
			url  : '/delete_list.xml',
			data : {lid : lid, oid : oid},
			dataType : 'xml',
			success  : function(xml){
				var $xml = $(xml), $st = $xml.find('status_code'), $url = $xml.find('url'), $msg = $xml.find('message');
				if($st.text() == 1){
					if($url.length) location.href = $url.text();
				} else if($msg.length){
					alertify.alert($msg.text());
				}
			},
			complete : function(){
				$this.removeClass('loading');
			}
		});}
        else return;
        })
	});
});
