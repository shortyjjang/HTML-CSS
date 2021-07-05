jQuery(function($) {
    $('html')
        .bind('lockScroll', function(e){
            if( $('html').hasClass('fixed') ) return;
            var sc = $(window).scrollTop(), $container = $('#container-wrapper');
            
            $container.attr('position',sc);
            $('html').addClass('fixed');
            $container.css('top',-sc+'px');
        })
        .bind('unlockScroll', function(e){
            if( !$('html').hasClass('fixed') ) return;
            var $container = $('#container-wrapper');
            $('html').removeClass('fixed');
            $(window).scrollTop($container.attr('position')||0);
            $container.removeAttr('position');
            $container.css('top','0');
            
        })
});