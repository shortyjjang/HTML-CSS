$(function(){
    var $summary = $("#summary"), $coverImg = $("#coverImg"), $coverSaveBtn = $("#save_cover_image"), $coverForm = $("#form-cover"), dialog = $.dialog('upload-cover');
    var preventDefault = function(e) {
        if (e.which === 1) e.preventDefault();
    }

    var coverImage = new Fancy.CoverImage({
        input : '.popup.upload-cover #uploadcover',
        objectType : $summary.attr('object-type'),
        objectId : $summary.attr('object-id'),
        appLabel : $summary.attr('app-label')||'fancy',
        maxWidth : 1940,
        uploadUrl : ($summary.attr('cover-type')=='fancylist'?'/upload_list_cover_image.json':'/upload_cover_image.json'),
        autoupdate : true,
        beforeUpload : function(){
            $("#save_cover_image").addClass('progress');
            $('.upload-cover .btn-cancel').hide();
        },
        success: function(image){
            dialog.close();
            $('#form-cover').trigger('reset')
            $("#delete_cover_image").show();
            $("#summary .btn-delete-cover").closest('li').show();
            $coverImg.css('background-image', "url('"+image.url+"')");
        },
        error: function(){
            $('#form-cover').trigger('reset')
        },
        progress: function(prog){
        }
    });

    dialog.$obj.on('close', function(){
        coverImage.abort();
    })

    $coverForm.on({
        reset : function(){
            var $bar = $coverSaveBtn;
            $bar.removeClass('progress');
            $(this).find('.ltit').removeClass('try').end().find('.msg').hide();
            $('.upload-cover .btn-cancel').show();
        },
        submit : function(event) {
            event.preventDefault();
            var $this=$(this), isUpload = $this.find('.method.image').hasClass('current');

            if (isUpload) {
                coverImage.upload();
            } else {
                var url = $(".popup.upload-cover #uploadcoverUrl").val().trim();
                coverImage.uploadByUrl(url, 'user');
            }
            return false;
        }
    })

    $coverSaveBtn.on('click',function(e){
        if($(this).hasClass('progress')) return false;
        $coverForm.trigger('submit');
        preventDefault(e);
    });
    
    $summary.find('.btn-upload-cover').click(function(e) {
        e.preventDefault()
        dialog.open();
        var w = $coverSaveBtn.outerWidth();
        $coverSaveBtn.width(w).data('org-width', w).addClass('ani');
        $coverForm.trigger('reset');        
    });

    $('.upload-cover #delete_cover_image, #summary .btn-delete-cover').click(function(e) {
        var original_labels = alertify.labels
        alertify.set({'labels': {ok: 'Delete', cancel: 'Cancel'}});
        alertify.confirm('Are you sure?', function (e) {
          if(e) {
            coverImage.delete(function(){
                $coverImg.css('background-image', "url('"+$coverImg.data('default-url')+"')");
                $("#delete_cover_image").hide();
                $("#summary .btn-delete-cover").closest('li').hide();
            })
          }
        });
        alertify.set({'labels': original_labels})
        e.preventDefault()
    });
})
