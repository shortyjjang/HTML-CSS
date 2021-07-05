$(function(){
    // cover image
    var $summary = $("#summary"), $coverImg = $("#coverImg"), $coverSaveBtn = $("#save_profile_image"), $coverForm = $("#form-cover");
    var preventDefault = function(e) {
        if (e.which === 1) e.preventDefault();
    }
    
    var coverImage = new Fancy.CoverImage({
        input : '#uploadcover',
        objectType : 'saleitemseller',
        objectId : ($summary.attr('spid')||$summary.attr('object-id')),
        maxWidth : 1940,
        beforeUpload : function(){
            $coverSaveBtn.attr('label',$coverSaveBtn.text()).text('').addClass('progress').css('width','1%');
            $('.upload-cover .btn-cancel').hide();
        },
        success: function(image){
            coverImage.save(function(json){
                $.dialog('upload-cover').close();
                $coverForm.trigger('reset')
                $('#coverImage').removeClass('add').addClass('loading').addClass("image").find('.menu-container').show().find('a').removeAttr('style').end().end().find('.camera').hide().end();
                $coverImg.hide();
                $("#delete_cover_image").show();
                $coverImg.one('load', function() {
                    $('#coverImage').removeClass('loading');
                    $(this).parent().show().end().hide().fadeIn('slow');
                    $summary.find('.menu-container').removeClass('opened');
                });
                if($coverImg.css('backgroundImage')!='none'){
                    $coverImg.css('background-image', "url('"+json.image_url+"')").show();
                }else{
                    $coverImg.attr('src', json.image_url).height((image.height*$("#coverImage").width())/image.width).show();
                }
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
                coverImage.uploadByUrl(url, 'seller');
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
                $('#coverImage').removeClass("loading image").addClass('add').parent().find('.menu-container').hide().end().find('.camera').show().end().find(".image img").hide().end().fadeIn();
                $("#delete_cover_image").hide();
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
})

$(function(){
    // logo type
    var $summary = $("#summary"), $logoType = $('img#logoType, #uploaded-logo'), $logoForm = $(".change-photo"), $logoSaveBtn = $("#save_logo_image"), $logoDeleteBtn = $('#delete_logo_image');

    var logoImage = new Fancy.CoverImage({
        input : '#uploadlogo',
        objectType : 'saleitemsellerlogo',
        objectId : ($summary.attr('spid')||$summary.attr('object-id')),
        resize : 360,
        resizeMethod : 'max',
        maxWidth : 1940,
        previewAsBackground : true,
        beforeUpload : function(){
            $logoForm.addClass('uploading');
            $logoSaveBtn.prop('disabled',true);
        },
        success: function(image){
            logoImage.save(function(json){
                $.dialog("change-photo").close();
                var url = json.resized_url;
                $logoForm.removeClass('blank');
                $logoType.css('background-image', 'url("'+url+'")');
                $logoType.removeClass('blank');
                $("#uploadlogo").val("");
                $("#logoFileName").val("");
                $logoDeleteBtn.show();
                $logoForm.removeClass('uploading');
                $logoSaveBtn.prop('disabled',false);
            });
        }
    });

    $logoSaveBtn.on('click',function(e){
        logoImage.upload();
        preventDefault(e);
    });
    
    $logoDeleteBtn.on('click', function(e) {
        e.preventDefault();

        alertify.confirm("Are you sure you want to delete this image?", function (e) {
            if (e){
                logoImage.delete(function(){
                    $logoType.removeAttr('style');
                    $logoType.addClass('blank');
                    $logoDeleteBtn.hide();
                })
            }
        })
    });

    $('#uploadlogo').on('change', function() {
        if (this.files && this.files.length) {
            /([^\\\/]+\.(jpe?g|png|gif))$/i.test(this.files[0].name);

            var filename  = RegExp.$1;
            $('#logoFileName').val(filename);
        }
    });
})
