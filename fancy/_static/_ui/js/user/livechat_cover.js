    var $summary = $("#summary"), $coverImg = $("#coverImg"), $coverSaveBtn = $("#save_cover_image"), $coverForm = $("#form-cover");
    var preventDefault = function(e) {
        if (e.which === 1) e.preventDefault();
    }
    
    var coverImage = new Fancy.CoverImage({
        input : '#uploadcover',
        objectType : ($summary.attr('cover-type')||'userprofile'),
        objectId : ($summary.attr('upid')||$summary.attr('lid')||$summary.attr('object-id')),
        maxWidth : 1940,
        uploadUrl : ($summary.attr('cover-type')=='fancylist'?'/upload_list_cover_image.json':'/upload_cover_image.json'),
        beforeUpload : function(){
            $("#save_cover_image").attr('label',$("#save_cover_image").text()).text('').addClass('progress').css('width','1%');
            $('.upload-cover .btn-cancel').hide();
        },
        success: function(image){
            coverImage.save(function(json){
                $.dialog('upload-cover').close();
                location.reload();
            });
        },
        error: function(){
            $coverForm.trigger('reset');
        },
        progress: function(prog){
            $coverForm.find('.progress').css('width', (488 * (prog) / 100).toFixed(0) +'px');
        }
    });

    $coverForm.on({
        reset : function(){
            var $bar = $coverSaveBtn;
            $bar.removeClass('progress').text($bar.attr('label')||'Upload Image').width('auto');
            $(this).find('.ltit').removeClass('try').end().find('.msg').hide();
            $('.upload-cover .btn-cancel').show();
        },
        submit : function(event) {
            var $this=$(this), isUpload = $this.find('.method.image').hasClass('current');

            if (isUpload) {
                coverImage.upload();
            } else {
                var url = $("#uploadcoverUrl").val().trim();
                coverImage.uploadByUrl(url);
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
        $.dialog('upload-cover').open();
        var w = $coverSaveBtn.outerWidth();
        $coverSaveBtn.width(w).data('org-width', w).addClass('ani');
        $coverForm.trigger('reset');        
    });

    $('.upload-cover #delete_cover_image, #summary .btn-delete-cover').click(function(e) {
        $summary.find(".menu-container").removeClass("opened");

        var original_labels = alertify.labels
        alertify.set({'labels': {ok: 'Delete', cancel: 'Cancel'}});
        alertify.confirm(gettext('Are you sure?'), function (e) {
          if(e) {
            $('#coverImage').addClass('loading');
            coverImage.delete(function(){
                location.reload();
            })
          }
        });
        alertify.set({'labels': original_labels})
        e.preventDefault()
    });

    $summary.find('.inner-wrapper').hover(
        function() {
            $summary.find('.cover .menu-container').removeClass('opened');
        },
        function() {
        }
    );

    $summary.find(".menu-container .menu-content a").click(function(e){
        if($(e.target).attr('rel') != 'external') e.preventDefault();
    })

