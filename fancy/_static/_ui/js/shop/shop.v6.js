$(function() {
    $(".slide-listing").each(function() {
        if (
            $(this)
                .find(".stream")
                .width() < $(this).width()
        )
            $(this)
                .find(".paging")
                .hide();
    });
    $(window).resize(function() {
        $(".slide-listing").each(function() {
            var $slide = $(this);
            var $slideListing = $(this).find(".stream");
            var current = $slideListing.attr("data-paging");
            var slidewidth = $slide.width();
            var itemWidth =
                $slideListing.find("li:first").width() + parseInt($slideListing.find("li:first").css("margin-left"));
            $slide
                .find(".paging")
                .find("a.next")
                .removeClass("disabled");

            if ($slideListing.width() < slidewidth)
                $(this)
                    .find(".paging")
                    .hide();
            if ($slide.is(":not(.scrollable)")) {
                $slideListing.css("left", -(current * itemWidth) + "px");
            }
        });
    });
    $(".slide-listing .paging a").on("click", function() {
        if ($(this).hasClass("disabled")) return false;

        var $slide = $(this).closest(".slide-listing");
        var $sWindow = $slide.find(".scrollable-window");
        var $slideListing = $slide.find(".stream");
        var max = $slideListing.find("li").length;
        var current = Number($slideListing.attr("data-paging"));
        var slidewidth = $slide.width();
        var $first = $slideListing.find("li:first");
        var scrollingAmount = $first.width() + parseInt($first.css('margin-left'));
        var itemWidth = $first.width() + parseInt($first.css("margin-left"));
        var viewNum = parseInt(slidewidth / itemWidth);

        if ($slide.is(".scrollable")) {
            viewNum = 1;
        }
        if ($(this).hasClass("prev")) {
            $slide
                .find(".paging")
                .find("a.next")
                .removeClass("disabled");
            if ($slide.is(".scrollable")) {
                $sWindow.prop("scrollLeft", Math.max($sWindow.prop("scrollLeft") - scrollingAmount, 0));
            } else {
                if (current - viewNum > viewNum) {
                    $slideListing
                        .css("left", -(itemWidth * (current - viewNum)) + "px")
                        .attr("data-paging", current - viewNum);
                } else {
                    $slideListing.css("left", "0").attr("data-paging", "1");
                    $slide
                        .find(".paging")
                        .find("a.prev")
                        .addClass("disabled");
                }
            }
        }

        if ($(this).hasClass("next")) {
            $slide
                .find(".paging")
                .find("a.prev")
                .removeClass("disabled");

            if ($slide.is(".scrollable")) {
                $sWindow.prop("scrollLeft", $sWindow.prop("scrollLeft") + scrollingAmount);
            } else {
                if (current + viewNum < max - viewNum) {
                    $slideListing
                        .css("left", -(itemWidth * (current + viewNum)) + "px")
                        .attr("data-paging", current + viewNum);
                } else {
                    $slideListing
                        .css(
                            "left",
                            -(
                                itemWidth * max -
                                slidewidth +
                                parseInt($slideListing.find("li:first").css("margin-left"))
                            ) + "px"
                        )
                        .attr("data-paging", max - viewNum);
                    $slide
                        .find(".paging")
                        .find("a.next")
                        .addClass("disabled");
                }
            }
        }

        return false;
    });
    $(".scrollable-window").on("scrollend", function() {
        var $slide = $(this).closest(".slide-listing");
        var $sWindow = $slide.find(".scrollable-window");
        var $slideListing = $slide.find(".stream");
        var $first = $slideListing.find("li:first");
        var scrollingAmount = $first.width() + parseInt($first.css('margin-left'));
        var currPos = $sWindow.prop("scrollLeft");
        $sWindow.prop("scrollLeft", (Math.round(currPos / scrollingAmount)) * scrollingAmount);
    });
});
