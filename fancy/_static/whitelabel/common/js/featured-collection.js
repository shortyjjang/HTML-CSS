jQuery(function($) {
    var $paging = $('#content .figure-product .paging'), $paging_buttons = $('#content .figure-product .paging > a')
    var $prev = $(".figure-product .paging-wrap a.prev"), $next = $(".figure-product .paging-wrap a.next")
    $paging_buttons.click(function(event) {
        event.preventDefault()
        if($(this).hasClass('current')) return

        $(this).siblings('a.current').removeClass('current')
        $(this).addClass('current')
        if ($(this).attr('video') == 'true') {
            $video_player.find('.btn-play').click();
            $video_player.show();
            $image.hide();
        } else {
            var image = $(this).data('image')
            // var width = $(this).data('width')
            // var height = $(this).data('height')
            $image.css('background-image','url("'+image+'")')
            $video_player.hide();
            $video_player.find('.btn-pause').click();
            $image.show();
        }
    })

})
