function initSlideshow() {
    var len;
    len = $(".explore .fetured li").length;
    $(".explore .fetured ul").width(len * 325 + (len + 1) * 15);

    len = $(".explore .top-collections li").length;
    $(".explore .top-collections ul").width(len * 175 + (len + 1) * 15 + 75 + 130);

    len = $(".explore .merchant li").length;
    $(".explore .merchant ul").width(len * 100 + (len + 1) * 15);

    len = $(".explore .epicks li").length;
    $(".explore .epicks ul").width(len * 175 + (len + 1) * 15 + 75 + 120);

    $(".slideshow .figcaption .title, .slideshow .figcaption .username").each(function(i, e) {
        if (e.scrollWidth > 175) {
            $(e)
                .closest(".figcaption")
                .addClass("long");
        }
    });
    function choseEl($slideshow) {
        var arr = $slideshow.find("li:in-viewport").toArray();
        var minDistanceEl = _.min(arr, function(e) {
            var rect = e.getBoundingClientRect();
            var positionCentered = rect.x + rect.width / 2;
            var distance = Math.abs(positionCentered - $slideshow.width() / 2);
            return distance;
        });
        return minDistanceEl;
    }

    $(".slideshow")
        .off("scroll.slideshow")
        .on("scroll.slideshow", function() {
            var $slideshow = $(this);
            var chosenEl = choseEl($slideshow);
            if (!chosenEl) {
                return;
            }
            var $chosenEl = $(chosenEl);

            if (!$slideshow.find("li.current").is(chosenEl)) {
                $slideshow.find("li.current").removeClass("current");
                $chosenEl.addClass("current");
            }
            updateCaption($slideshow, $chosenEl)
        });

    function updateCaption($slideshow, $chosenEl) {
        var chosenCaption = $slideshow.parent().find(".figcaption.outer");
        if ($slideshow.is(".ss-epicks")) {
            chosenCaption.find(".title").text($chosenEl.data("slide-title"));
            chosenCaption.find(".username").text("by " + $chosenEl.data("slide-subtitle"));
        } else if ($slideshow.is(".ss-fs")) {
            chosenCaption.find(".sellername b").text($chosenEl.data("slide-title"));
            chosenCaption.find(".sellername small").text($chosenEl.data("slide-count") + ' Products');
            chosenCaption.find("a.sellername").attr("href", $chosenEl.data("slide-href"));
            var cs = $chosenEl.find(".pop-item");
            var firstTid = chosenCaption
                .find(".pop-items")
                .find(".pop-item:eq(1)")
                .data("thing-id");
            if (firstTid !== cs.eq(1).data("thing-id")) {
                chosenCaption
                    .find(".pop-items")
                    .empty()
                    .append(cs.clone());
            }
        } else if ($slideshow.is(".ss-tc")) {
            chosenCaption.find(".title").text($chosenEl.data("slide-title"));
            chosenCaption.find(".count").text($chosenEl.data("slide-count") + " ITEMS");
        }
    }
    // initialization
    updateCaption($('.slideshow.ss-fs'), $('.slideshow.ss-fs li:first-child'))
    updateCaption($('.slideshow.ss-epicks'), $('.slideshow.ss-epicks li:first-child'))
    updateCaption($('.slideshow.ss-tc'), $('.slideshow.ss-tc li:first-child'))
}

$(function(){
    initSlideshow()
});
