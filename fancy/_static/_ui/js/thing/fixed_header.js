$(window).scroll(function(){
    var baseH = $(".thing-detail .figure-info").offset().top + $('.thing-detail .figure-info').height()+8;
    if ($(window).scrollTop()> baseH) {
        $('.thing-detail').addClass('fixed_summary').find('.summary').css('top',$('#header').height()+'px');
        if ($(window).scrollTop()> $('.other-thing').offset().top-42) {
            $('.thing-detail').addClass('fixed_menu');
        }else{
            $('.container').removeClass('fixed_menu');
        }
    }else {
        $('.container').removeClass('fixed_summary').find('.summary').css('top',-$('.thing-detail .summary').height()+'px');
    }
});

(function($) {
    $('.summary')
        .on('click', '.share', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#sidebar .share').click();
			return false;
        });
})(jQuery);