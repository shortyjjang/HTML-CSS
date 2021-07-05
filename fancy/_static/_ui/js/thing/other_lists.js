$(document).ready(function() {
    $('.lists-listing').on('mouseover', 'a.fancyd-stuff-list', function(e) {
        var t;
        var $imgs = $(this).find('img');
        if ($imgs.length > 1) {
            var swap = function() {
                var $on = $imgs.filter('.on').removeClass('on');
                if ($on.index() < $imgs.length) {
                    $on.next().addClass('on');
                } else {
                    $imgs.eq(0).addClass('on');
                }
                t = setTimeout(swap, 1000);
            };
            var end = function() {
                $imgs.removeClass('on');
                $imgs.eq(0).addClass('on');
                clearTimeout(t);
                t = null;
                $imgs = null;

                $(document).off('mouseout', end);
            };
            $(document).on('mouseout', end);
            swap();
        }
    });
});
