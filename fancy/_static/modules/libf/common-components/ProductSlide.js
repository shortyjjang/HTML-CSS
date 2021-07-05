// fork of recommend-slide (accacb79d2af557369e02132ef5f486d226aa5d3)
export default function applyProductSlide() {
    $(function() {
        var mWidth = 920;

        function initSlide($el, option) {
            var $slide;
            if ($el.is('.itemSlide, .slideshow')) {
                $slide = $el;
            } else {
                $slide = $el.find(".itemSlide, .slideshow");
            }
            $slide.data('slideInit', true);
            var $list = $el.find("ul"),
                $li = $list.find("li"),
                itemWidth = $li.width() + 20,
                $prev = $el.find("a.prev"),
                $next = $el.find("a.next");
            var slideWidth = null;

            if (option.itemPerSlide) slideWidth = itemWidth * option.itemPerSlide;

            function resetRecommend() {
                if (!$slide || !$li) {
                    $el.css("visibility", "visible");
                    return;
                }

                if (slideWidth && slideWidth > itemWidth * $li.length) {
                    $el.css("visibility", "visible");
                    return;
                }

                if ($(window).width() < mWidth) {
                    if (option.center) {
                        $slide.find(".itemList").scrollLeft(($li.length * 147 - $(window).width() + 20) / 2);
                    }
                    $prev.removeClass("disabled");
                    $next.removeClass("disabled");
                } else {
                    if ($slide.width() > itemWidth * $li.length) {
                        $prev.addClass("disabled");
                        $next.addClass("disabled");
                        if (option.center) {
                            $slide.find(".itemList").css("left", "0px");
                        }
                    } else {
                        if (option.center) {
                            $slide
                                .find(".itemList")
                                .css("left", -parseInt(($li.length * 285 - $(window).width() + 20) / 2) + "px");
                        }
                        $prev.removeClass("disabled");
                        $next.removeClass("disabled");
                    }
                }
                $el.css("visibility", "visible");
            }

            function getPrevLeft($el) {
                preparePrev();
                var left = Math.abs(parseInt($list.css("left"))),
                    nextLeft,
                    width = $slide.width();
                if (slideWidth) width = slideWidth;
                nextLeft = left - width;
                return nextLeft;
            }

            function getNextLeft($el) {
                prepareNext();
                var left = Math.abs(parseInt($list.css("left"))),
                    nextLeft,
                    width = $slide.width();
                if (slideWidth) width = slideWidth;
                nextLeft = left + width;
                return nextLeft;
            }

            function preparePrev() {
                var $li = $list.find("li"),
                    left = Math.abs(parseInt($list.css("left"))),
                    width = $slide.width(),
                    itemWidth = $li.width() + 20;
                if (slideWidth) width = slideWidth;

                if (left < width) {
                    var prepareCount = Math.ceil(Math.abs(width - left) / itemWidth);
                    for (var i = 0; i < prepareCount; i++) {
                        var $el = $list.find("li:not([_prev])").last();
                        $el.clone().insertBefore($list.find("li").first());
                        $el.attr("_prev", true);
                    }
                    $list.css("left", 0 - left - prepareCount * itemWidth + "px");
                }
            }

            function prepareNext() {
                var $li = $list.find("li"),
                    left = Math.abs(parseInt($list.css("left"))),
                    width = $slide.width(),
                    listWidth = $li.length * ($li.width() + 20),
                    itemWidth = $li.width() + 20,
                    spare = listWidth - (left + width);
                if (slideWidth) width = slideWidth;
                if (spare - width < width) {
                    var prepareCount = Math.ceil(Math.abs(width - (listWidth - (left + width))) / itemWidth);
                    for (var i = 0; i < prepareCount; i++) {
                        var $el = $list.find("li:not([_next])").first();
                        $el.clone().insertAfter($list.find("li").last());
                        $el.attr("_next", true);
                    }
                }
            }

            function clearOld() {
                var $li = $list.find("li"),
                    left = Math.abs(parseInt($list.css("left"))),
                    itemWidth = $li.width() + 20,
                    $prev = $list.find("li[_next]:not(:in-viewport)"),
                    prevCnt = $prev.length;
                $list.find("li[_prev]:not(:in-viewport)").remove();
                $prev.remove();
                $list.css("left", 0 - left + prevCnt * itemWidth + "px");
            }

            resetRecommend();

            if (slideWidth && slideWidth > itemWidth * $li.length) {
                $prev.hide();
                $next.hide();
            }

            $el.on("click", "a.prev", function(e) {
                e.preventDefault();
                var $this = $(this);
                if ($this.hasClass("_disabled")) return;
                var left = getPrevLeft($el);
                $this.addClass("_disabled");
                $list.animate({ left: 0 - left + "px" }, 300, "easeInOutExpo", function() {
                    clearOld();
                    $this.removeClass("_disabled");
                });
            }).on("click", "a.next", function(e) {
                e.preventDefault();
                var $this = $(this);
                if ($this.hasClass("_disabled")) return;
                var left = getNextLeft($el);
                $this.addClass("_disabled");
                $list.animate({ left: 0 - left + "px" }, 300, "easeInOutExpo", function() {
                    clearOld();
                    $this.removeClass("_disabled");
                });
            });
        }

        $.fn.productSlide = function(option) {
            var option = option || { center: true };
            var self = this;
            var $slides = this.each(function() {
                var $el = $(this);
                initSlide($el, option);
            });

            return $slides;
        };
    });
}
