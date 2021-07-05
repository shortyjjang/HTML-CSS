$(function(){
    var $this = $('#save_profile_image'), $file = $('#uploadavatar'), userid = $('#userid').val(), $change_photo = $this.closest('.change-photo'), $form = $('#form-photo')[0];
    var url = '/settings_image.xml';
    if(userid) url += '?userid='+userid;

    var file_upload = $file.fileupload({
      dataType : 'xml',
      autoUpload: false,
      url      : url,
      start    : function() {
          $change_photo.addClass('uploading');
      },
      add: function(e, data){
          $this.off('click').on('click',function(){
              data.process().done(function () {
                  data.submit();
              });
          })
      },
      done     : function(e, data) {
          var $xml = $(data.result), $st = $xml.find('status_code');
          $change_photo.removeClass('uploading none');
          $file.attr('value','');

          if ($st.length>0 && $st.text()==1) {
            var url = $xml.find('original_image_url').text();
            $('.photo-preview>img, #uploaded-photo, .user-info .avatar').css('background-image', 'url(' + url + ')');
            if($form) {
              $form.reset();
              $.dialog("change-photo").close();
            }
          } else if ($st.length>0 && $st.text()==0) {
            alert($xml.find("message").text());
            return false;
          } else {
            alert("Unable to upload file..");
            return false;
          }
      },
      fail  :function(e, data){
          $change_photo.removeClass('loading');
          alert(e);
      }, 
      always : function(){
          
      }
    }); 

    $('#delete_profile_image').on('click',function(e){
      var original_labels = alertify.labels
      alertify.set({'labels': {ok: 'Delete', cancel: 'Cancel'}});
      alertify.confirm('Are you sure?', function (e) {
        if(e) {
          var $change_photo = $(this).closest('.change-photo');
          $change_photo.addClass('uploading');
	        var userid = $('#userid').val();
          $.post(
            '/delete_profile_image2.json?userid=' + userid,
            {}, // parameters
            function(response){
              if (response.status_code != undefined && response.status_code == 1) {
                var url = response.user_image_url;
                $('#uploaded-photo, .user-info .avatar').css('background-image', 'url(' + url + ')');
                $change_photo.removeClass('uploading');
                $change_photo.addClass('none');
                if($form) {
                  $form.reset();
                  $.dialog("change-photo").close();
                }
              }
              else if (response.status_code != undefined && response.status_code == 0) {
                if(response.message != undefined)
                  alert(response.message);
              }
            },
            "json"
          );
        }
      });
      alertify.set({'labels': original_labels})
      e.preventDefault()
    });
})
