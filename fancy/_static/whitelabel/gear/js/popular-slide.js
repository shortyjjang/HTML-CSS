(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals.
        factory(jQuery);
    }
}(function ($) {
    
    $(window).resize(function(){
        
    });

    function getPrevLeft($el){
        var $slide = $el.find(".slideshow"), $ul = $el.find("ul.figureList"), $li = $ul.find("li"), paddingLeft = parseInt($li.first().css('padding-left')), left = Math.abs(parseInt($ul.css('left'))), nextLeft, width = $slide.width();
        for(var i = 0; i < $li.length; i++){
            var posLeft = $($li[i]).position().left;
            if( posLeft + width > left){
                nextLeft = posLeft ;
                break;
            }
        }
        nextLeft = Math.max(nextLeft, 0 );
        return nextLeft;
    }

    function getNextLeft($el){
        var $slide = $el.find(".slideshow"), $ul = $el.find("ul.figureList"), $li = $ul.find("li"), paddingLeft = parseInt($li.first().css('padding-left')), left = Math.abs(parseInt($ul.css('left'))), nextLeft, width = $slide.width();
        for(var i = 0; i < $li.length; i++){
            var posLeft = $($li[i]).position().left;
            if( posLeft - left + $($li[i]).width() > width){
                nextLeft = posLeft ;
                break;
            }
        }
        nextLeft = Math.min(nextLeft, $ul.width()-$slide.width()+20 );
        return nextLeft;
    }

    function initSlide($el){
        var $slide = $el.find(".slideshow"), $ul = $el.find("ul.figureList"), $prev = $el.find("a.prev"), $next = $el.find("a.next");
        $prev.addClass('disabled');
        $next.addClass('disabled');
        if($slide.width() < $ul.width()){
            $next.removeClass('disabled');
        }
        $el
            .on('click', 'a.prev', function(e){
                e.preventDefault();
                var $this = $(this);
                if( $this.hasClass('disabled')) return;
                var left = getPrevLeft($el);
                $this.addClass('disabled');
                $ul.animate({'left': (0-left)+'px'}, 300, 'easeInOutExpo', function(){
                    var nextleft = getPrevLeft($el);
                    if(left > nextleft) $this.removeClass('disabled');
                    $next.removeClass('disabled');    
                });
            })
            .on('click', 'a.next', function(e){
                e.preventDefault();
                var $this = $(this);
                if( $this.hasClass('disabled')) return;
                var left = getNextLeft($el);
                $this.addClass('disabled');
                $ul.animate({'left': (0-left)+'px'}, 300, 'easeInOutExpo', function(){
                    var nextleft = getNextLeft($el);
                    if(left < nextleft) $this.removeClass('disabled');
                    $prev.removeClass('disabled');    
                });
            })

    }

    $.fn.popularSlide = function(option){
        var option = option || {};
        var self = this;
        var $slides = this.each(function(){
            var $el = $(this);
            initSlide($el);
        })
        
        return $slides;
    }
}));
