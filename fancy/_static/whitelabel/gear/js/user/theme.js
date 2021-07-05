$(function(){

    var $summary = $("#summary"), dialog = $.dialog("set-theme"), upload_dialog = $.dialog("upload-theme");

    var coverImage = new Fancy.CoverImage({
        input : '.popup.upload-theme input:file',
        dropZone : '.popup.upload-theme',
        objectType : $summary.attr('object-type'),
        objectId : $summary.attr('object-id'),
        appLabel : $summary.attr('app-label'),
        maxWidth : 1940,
        uploadUrl : '/upload_cover_image.json',
        autoupload : true,
        autoupdate : false,
        beforeUpload : function(){
            upload_dialog.$obj.addClass('loading');
        },
        success: function(image){
            upload_dialog.$obj.removeClass('loading');
            upload_dialog.$obj.find("img").css('background-image', 'url("'+image.url+'")').end().find("a.remove").show();
        },
        error: function(){
            upload_dialog.$obj.removeClass('loading');
        },
        progress: function(prog){
        }
    });

    dialog.$obj
        .on("click", "li > a", function(e){
            e.preventDefault();
            $(this).closest('ul').find('li a.selected').removeClass('selected').end().end().addClass("selected");
        })
        .on("click", ".btn-upload", function(e){
            upload_dialog.open();
        })
        .on('click', ".btn-cancel", function(e){
            dialog.close();
        })
        .on('click', ".btn-save", function(e){
            var cover_id = $(this).closest('.popup').find('[data-interest-id] a.selected').closest('li').data('cover-id');
            var object_id = $(this).closest('.popup').data('object-id');

            if(cover_id){
                $.get(
                    '/update_cover_image.json?for=fancy_userprofile&app_label=fancy&object_type=userprofile&object_id=' + object_id+'&cover_image_id='+cover_id,
                    function(json){
                        if (json.status_code !== undefined && json.status_code == 1) {
                            location.reload();
                        } else if (json.status_code !== undefined && json.status_code === 0) {
                            json.message && that.alert(json.message);
                        }
                    },
                    "json"
                );
            }else{
                $.get(
                    '/delete_cover_image.json?for=fancy_userprofile&app_label=fancy&object_type=userprofile&object_id=' + object_id,
                    function(json){
                        if (json.status_code !== undefined && json.status_code == 1) {
                            location.reload();
                        } else if (json.status_code !== undefined && json.status_code === 0) {
                            json.message && that.alert(json.message);
                        }
                    },
                    "json"
                );
            }
        })

    upload_dialog.$obj
        .on("click", "a.remove", function(e){
            upload_dialog.$obj.find("img").css('background-image', '').end().find("a.remove").hide();
        })
        .on("click", ".btn-back", function(e){
            dialog.open();
        })
        .on('click', ".btn-save", function(e){
            var needDelete = upload_dialog.$obj.find("a.remove").is(":hidden");
            if( needDelete ){
                coverImage.delete(function(){
                    location.reload();
                });
            }else if(coverImage.uploaded ){
                coverImage.save(function(){
                    location.reload();
                });
            }
        })

    if( !dialog.$obj.find("ul li a.selected").length ){
        var uploadedImg = upload_dialog.$obj.find("img").data("cover-image-url");
        if(uploadedImg){
            upload_dialog.$obj.find("img").css('background-image', 'url("'+uploadedImg+'")').end().find("a.remove").show();
        }
    }

}) 