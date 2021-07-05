// create/edit collection
$(function(){
	var dialog = $.dialog("add_collection");

    if(Fancy.CoverImage) {
	var coverImage = new Fancy.CoverImage({
        input : '.add_collection #uploadcover',
        objectType : "whitelabelusercollection",
        objectId : null,
        appLabel : "whitelabel",
        maxWidth : 1940,
        autoupload : true,
        uploadUrl : '/upload_list_cover_image.json',
        beforeUpload : function(){
        	dialog.$obj
        		.find("fieldset").addClass('loading');
        },
        success: function(image){
        	dialog.$obj
        		.find("fieldset").removeClass('loading').end()
        		.find("div.add").hide().end()
        		.find("div.edit").show()
        			.find("img").css('background-image', "url('"+image.url+"')");
        },
        error: function(){
        	dialog.$obj
        		.find("fieldset").removeClass('loading');
        },
        progress: function(prog){
        }
    });

	dialog.$obj
		.on('click', ".btn-upload", function(){
			dialog.$obj.find("#uploadcover").trigger('click');
		})
		.on('click', ".btn-remove", function(){
			coverImage.uploaded = false;
			dialog.$obj
        		.find("div.add").show().end()
        		.find("div.edit").hide()
        			.find("img").css('background-image', "none");
		})
		.on('click', '.btn-del', function(){

            var original_labels = alertify.labels
			alertify.set({'labels': {ok: 'Delete', cancel: 'Cancel'}});
			alertify.confirm("Are you sure you want to delete this list?", function(e){
				if(e){
					var data = {}, url;
					data.collection_id = dialog.$obj.find("[name=collection_id]").val();
					if(!data.collection_id){
						alertify.alert("Please select a collection");
						return;
					}

					url = '/collection/update/'+data.collection_id;

					dialog.$obj
		        		.find("fieldset").addClass('loading');

					$.ajax({
						type : 'DELETE',
						url  : url,
						data : data,
						dataType : 'json',
						success : function(json){
		                    if(json.status!=1) {
							    dialog.$obj
		            				.find("fieldset").removeClass('loading');
		        			    alertify.alert(json.error || "Failed to delete a list. please try again");
		                        return
		                    }

							location.href = "/"+dialog.$obj.data('username')+"/collections/";
						},
						error: function(){
							dialog.$obj
		        				.find("fieldset").removeClass('loading');
		        			alertify.alert("Failed to delete a list. please try again");
						}
					});
				}
			})
            alertify.set({'labels': original_labels})
			
		})
		.on('click', '.btn-save', function(){
			var data = {}, url = '/collection/add';
			dialog.$obj.find("[name]").each(function(){
				var key = $(this).attr('name'), value = $(this).val();
				data[key] = value;
			})
			if(!data.title){
				alertify.alert("Please enter list title");
				return;
			}

			if(data.collection_id){
				url = '/collection/update/'+data.collection_id;
			}

			dialog.$obj
        		.find("fieldset").addClass('loading');

			$.ajax({
				type : 'POST',
				url  : url,
				data : data,
				dataType : 'json',
				success : function(json){
					if(json.status!=1) {
					    dialog.$obj
            				.find("fieldset").removeClass('loading');
        			    alertify.alert(json.error || "Failed to create a list. please try again");
                        return
                    }

					function reload(){
						location.href = "/collection/"+json.collection.name;
					}

					if(coverImage.hasUploadedImage() ){
						coverImage.objectId = json.collection.id;
						coverImage.save(function(json){
							reload();
			            });
					}else{
						if(coverImage.objectId){
			        		coverImage.delete(function(){
			        			reload();
			        		})
			        	}else{
			        		reload();
			        	}
					}
				},
				error: function(){
					dialog.$obj
        				.find("fieldset").removeClass('loading');
        			alertify.alert("Failed to create a list. please try again");
				}
			});
		})
		}

		// Approval request / cancel request
	$(document.body)
        .on('mouseover', '.approval-btn', function() {
            var $el = $(this)
            var status = $el.data('status')
            if (status === 'pending') {
                $el.text('Cancel Approval')
            } else if (status === 'initial') {
                $el.text('Request Approval')
            }
        })
        .on('mouseout', '.approval-btn', function() {
            var $el = $(this)
            var status = $el.data('status')
            if (status === 'pending') {
                $el.text('Pending Approval')
            } else if (status === 'initial') {
                $el.text('Request Approval')
            }
        })
        .on('click', '.approval-btn', function() {
            var $el = $(this)
            var status = $el.data('status')
            var cid = $el.data('cid')
            if (status === 'pending') {
                $.ajax({
                    url: '/collection/request_approval/' + cid,
                    method:'delete',
                })
                    .done(function(res){
                        if (res.status_code === 1) {
                            $el.data('status', 'initial')
                            $el.text('Request Approval')
                        } else {
                            window.alertify.alert(res.message)
                        }
                    })
                    .fail(function(){
                        window.alertify.alert('Unexpected error occured, please try again later.')
                    })
            } else if (status === 'initial') {
                $.post('/collection/request_approval/' + cid)
                    .done(function(res){
                        if (res.status_code === 1) {
                            $el.data('status', 'pending')
                            $el.text('Pending Approval')
                        } else {
                            window.alertify.alert(res.message)
                        }
                    })
                    .fail(function(){
                        window.alertify.alert('Unexpected error occured, please try again later.')
                    })
            }
        });
})
