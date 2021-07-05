$(function(){
  var $summary = $("#summary"), $change_photo = $('.popup.change-photo');;

  $('#uploaded-photo').css('background-image', $('.user-info .avatar').css('background-image') );

  if( $('.user-info .avatar').data('uploaded')){
    $('.popup.change-photo').removeClass('none'); 
  }else{
    $('.popup.change-photo').addClass('none'); 
  }

  $change_photo.find("p.ltit").text('Upload Store Logo');

  var logoImage = new Fancy.CoverImage({
        input : '.popup.change-photo #uploadavatar',
        objectType : 'saleitemsellerlogo',
        objectId : $summary.attr('object-id'),
        appLabel : $summary.attr('app-label')||'fancy',
        resize : 220,
        maxWidth : 1940,
        previewAsBackground : true,
        autoupdate : true,
        beforeUpload : function(){
            $change_photo.addClass('uploading');
        },
        success: function(image){
           $('#uploaded-photo, .user-info .avatar').css('background-image', 'url(' + image.url + ')');
            $.dialog('change-photo').close();
            $change_photo.removeClass('uploading none');
        },
        error: function(){
            $change_photo.removeClass('uploading none');
        },
        progress: function(prog){
            
        }
    });

  $("#save_profile_image").on('click',function(e){
    e.preventDefault()
    logoImage.upload();
  });

  $('#delete_profile_image').on('click',function(e){
    var original_labels = alertify.labels
    alertify.set({'labels': {ok: 'Delete', cancel: 'Cancel'}});
    alertify.confirm("Are you sure you want to delete this image?", function (e) {
        if (e){
            logoImage.delete(function(){
                var defaultUrl = $(".user-info .avatar").data('default-url');
                if(defaultUrl){
                  $('#uploaded-photo, .user-info .avatar').css('background-image', 'url("'+defaultUrl+'")');
                }else{
                  $('#uploaded-photo, .user-info .avatar').css('background-image', '');
                }
                $change_photo.addClass('none');
                $('#delete_profile_image').hide();
            })
        }
    })
    alertify.set({'labels': original_labels});
    e.preventDefault()
  });
})
