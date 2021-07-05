jQuery(function($){
    $('#region-tag').change(function(event) {
        var country = $(this).val();
        if(country) {
            $('#request-region-change').removeAttr('disabled');
        } else {
            $('#request-region-change').attr('disabled', true);
        }
    })
    $('#request-region-change').click(function(event) {
        var that = $(this);

        var country = $('#region-tag').val();
        if(country) {
            var param = {}
            var extra_param = {'regions':[country]}
            param['extra'] = JSON.stringify(extra_param);

            $(that).addClass('loading').prop('disabled','disabled').css({'cursor': ''});

            $.post('/request-tag-update.json', param, function(res) {
                if (res.status_code != undefined && res.status_code == 1) {
                    location.reload();
                } else {
                    var msg = res.message;
                    var error = res.error;
                    alert(msg || error);
                }
            }, 'json')
            .fail(function(xhr) {
                try {
                    err = JSON.parse(xhr.responseText);
                    err = err.message || err.error;
                    if(err) {
                        alert(err);
                        return;
                    }
                } catch(e) {
                }
                alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            })
            .always(function() {
                $(that).removeClass('loading').prop('disabled',false).css({'cursor': ''});
            });
        }
    })
})
