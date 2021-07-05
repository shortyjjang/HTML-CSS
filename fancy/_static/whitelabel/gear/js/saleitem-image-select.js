jQuery(function($) {
    $(document)
        .on('click', '.figure-product .paging > a', function(event) {
            event.preventDefault()
            if($(this).hasClass('current')) return

            $video_player = $(this).closest('.figure-product').find('.image-container .video_player')
            $image = $(this).closest('.figure-product').find('.image-container .image-wrap img')

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
