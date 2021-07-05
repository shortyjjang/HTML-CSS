export function toggleUpload(uploadInput) {
    const evt = document.createEvent("MouseEvents");
    evt.initEvent("click", true, false);
    uploadInput.dispatchEvent(evt);
}

export function uploadVideo () {
    return $("#video-file").fileupload({
        dataType: 'json',
        url: '',
        start: function(e, data) {
            $('.cover.video .cover-preview .add').hide();
            $('.cover.video .cover-preview').find('li.item .btn-del').hide();
            $('.cover.video .cover-preview').find('li.item').removeClass('added').addClass('loading').show();
        },
        add: function(e, data){
          var fname = data.files[0].name.split(".");
          var ext = fname[fname.length-1];
          if( /(mov|avi|mkv|mpg|mp4)/i.test(ext)){
              data.type = 'POST';
              data.url = '/rest-api/v1/videos/videocontents';
              data.paramName = 'video-file';
          }else{
              alertify.alert('Please select a video file');
              return;
          }
          
          data.process().done(function () {
              data.submit();
          });
        },
        done: function(e, data) {
          if(data.result.status){
            $('.cover.video .cover-preview').find('li.item .btn-del').show();
            $('.cover.video .cover-preview').find('li.item').attr('video_id', data.result.id ).removeClass('loading').addClass('added');
          } else {
            alertify.alert("An error occurred. Please check the file and try again.");
            $('.cover.video .cover-preview .add').show();
            $('.cover.video .cover-preview').find('li.item').removeClass('loading').hide();
          }
        },
        fail: function(e){
          alertify.alert("An error occurred. Please check the file and try again.");
          $('.cover.video .cover-preview .add').show();
          $('.cover.video .cover-preview').find('li.item').removeClass('loading').hide();
        },
        always: function(e){
          
        }
    });
}

