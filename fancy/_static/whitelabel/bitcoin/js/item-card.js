$(function() {
    /* SHow different colors for options */
    $(document).delegate('.itemListElement .color-swatch-item a>img', 'click', function() {
        var image = $(this).data('image');
        if(image) {
            $(this).closest('.itemListElement').find('.figure img').css('background-image','url("'+image+'")').attr('class','');
        }
    });
});

