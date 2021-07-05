(function() {
    var $sidebar = $("#sidebar");
    // var $activities = $("#sidebar .activites");
    // var imageLimit = $activities.data('image-limit');

    function loadPopular(category) {
        $sidebar.find(".popular ul").addClass("loading");
        $.get("/shop/popular_sidebar/" + category).then(function(data) {
            $sidebar
                .find(".popular ul")
                .removeClass("loading")
                .html($(data).html());
        });
    }

    var lastIndex = null;
    function generateRandom(min, max) {
        if (max - min < 2) return min;
        var num = Math.floor(Math.random() * (max - min + 1)) + min;
        return num === lastIndex ? generateRandom(min, max) : num;
    }

    function randomSwitchPopular() {
        if ($sidebar.find(".popular ul").hasClass("loading")) {
            lastIndex = null;
            return;
        }
        lastIndex = generateRandom(0, $sidebar.find(".popular ul > li").length - 1);
        var $li = $sidebar.find(".popular ul > li:eq(" + lastIndex + ")");
        var $a = $li.find("a.on");
        $a.removeClass("on");
        if ($a[0] && $a.next()[0]) {
            $a.next().addClass("on");
        } else {
            $li.find("a:eq(0)").addClass("on");
        }
    }

    setInterval(randomSwitchPopular, 5000);

    var popularCategory = $.cookie.get("home.sidebar.popular");
    if (popularCategory) {
        $sidebar
            .find(".popular")
            .find("select")
            .val(popularCategory);
    }

    $sidebar
        .find(".popular")
        .find("select")
        .change(function() {
            var category = $(this).val();
            $sidebar
                .find(".popular a.more")
                .attr("href", "/shop/popular/" + category)
                .end()
                .find(".select-category > span")
                .html(
                    $(this)
                        .find("option:selected")
                        .html()
                );
            loadPopular(category);
            $.cookie.set("home.sidebar.popular", category, 9999);
        })
        .change();

    $sidebar
        .find(".collection")
		.find('li').removeClass('current').end()
		.find('li:first-of-type').addClass('current').end()
        .find(".paging .prev")
        .click(function(e) {
            e.preventDefault();
            clearTimeout(timer);
            var $this = $(this);
            if ($this.hasClass("disabled")) return;

            var collection = $sidebar.find(".collection li.current");
            var prevCollection = collection.prev("li");

            if (prevCollection[0]) {
                prevCollection.addClass("prevFadeIn", function() {
                    prevCollection.addClass('current');
                    collection.removeClass('current');
                    var timer = setTimeout(function() {
                        $sidebar
                            .find(".collection li")
                            .removeClass("prevFadeIn")
                            .removeClass("nextFadeIn");
                    }, 350);
                });
                $sidebar.find(".paging .next").removeClass("disabled");
                if (!prevCollection.prev("li").length) $sidebar.find(".paging .prev").addClass("disabled");
            }
        })
        .end()
        .find(".paging .next")
        .click(function(e) {
            e.preventDefault();
            clearTimeout(timer);
            var $this = $(this);
            if ($this.hasClass("disabled")) return;

            var collection = $sidebar.find(".collection li.current");
            var nextCollection = collection.next("li");
            if (nextCollection[0]) {
                nextCollection.addClass("nextFadeIn", function() {
                    nextCollection.addClass('current');
                    collection.removeClass('current');
                    var timer = setTimeout(function() {
                        $sidebar
                            .find(".collection li")
                            .removeClass("prevFadeIn")
                            .removeClass("nextFadeIn");
                    }, 350);
                });
                $sidebar.find(".paging .prev").removeClass("disabled");
                if (!nextCollection.next("li").length) $sidebar.find(".paging .next").addClass("disabled");
            }
        })
        .end();

    $sidebar
        .find(".article")
        .find(".paging .prev")
        .click(function(e) {
            e.preventDefault();
            var $this = $(this);
            if ($this.hasClass("disabled")) return;

            var article = $sidebar.find(".article > div.article_item:visible");
            var prevArticle = article.prev(".article_item");
            if (prevArticle[0]) {
                if ($this.hasClass("slide")) {
                    prevArticle.addClass("prevFadeIn", function() {
                        prevArticle.show();
                        setTimeout(function() {
                            article.hide();
                            $sidebar
                                .find(".article > div.article_item")
                                .removeClass("prevFadeIn")
                                .removeClass("nextFadeIn");
                        }, 350);
                    });
                } else {
                    article.hide();
                    prevArticle.show();
                }
                $sidebar.find(".paging .next").removeClass("disabled");
                if (!prevArticle.prev(".article_item").length) $sidebar.find(".paging .prev").addClass("disabled");
            }
        })
        .end()
        .find(".paging .next")
        .click(function(e) {
            e.preventDefault();
            var $this = $(this);
            if ($this.hasClass("disabled")) return;

            var article = $sidebar.find(".article > div.article_item:visible");
            var nextArticle = article.next(".article_item");
            if (nextArticle[0]) {
                if ($this.hasClass("slide")) {
                    nextArticle.addClass("nextFadeIn", function() {
                        nextArticle.show();
                        setTimeout(function() {
                            article.hide();
                            $sidebar
                                .find(".article > div.article_item")
                                .removeClass("prevFadeIn")
                                .removeClass("nextFadeIn");
                        }, 350);
                    });
                } else {
                    article.hide();
                    nextArticle.show();
                }
                $sidebar.find(".paging .prev").removeClass("disabled");
                if (!nextArticle.next(".article_item").length) $sidebar.find(".paging .next").addClass("disabled");
            }
        })
        .end();

    $sidebar.find(".activites ul.stit > li a").click(function(e) {
        e.preventDefault();
        $sidebar.find(".activites ul.stit > li a.current").removeClass("current");
        $(this).addClass("current");

        var tab = $(this).attr("data-tab");
        $sidebar
            .find(".activites")
            .find("._global, ._follow")
            .hide();
        if (tab == "follow") $sidebar.find(".signin").show();
        if ($sidebar.find("ul._" + tab).hasClass("loading") || $sidebar.find("ul._" + tab + " li").length) {
            $sidebar.find("ul._" + tab + ",a.more._" + tab).show();
        } else {
            $sidebar.find(".empty._" + tab).show();
        }
    });

    var timer;
    var delay = 50;

    $("#sidebar .activites > ul")
        .mouseover(function() {
            if ($("html").hasClass("ipad")) return;
            clearTimeout(timer);
            timer = setTimeout(function() {
                $("html").trigger("lockScroll");
            }, delay);
        })
        .mouseleave(function(e) {
            if ($(e.relatedTarget).is("#sidebar .activites > ul *")) return;
            clearTimeout(timer);
            $("html").trigger("unlockScroll");
        });

    if (!$(".gnb.guest").length) {
        var $followActivityList = $("#sidebar ul.activity._follow");

        var calling = false;
        var isLast = false;
        $followActivityList.scroll(function() {
            if (calling || isLast) return;
            var $list = $followActivityList;
            var scrollTop = $list.scrollTop();
            var scrollHeight = $list[0].scrollHeight;
            if (scrollTop > scrollHeight - $list.height() - 400) {
                var aid = $list.find("li[data-aid]:last").attr("data-aid");
                calling = true;
                $.get("/recent_activity_feed.json", { cursor: aid }, function(data) {
                    if (!data) isLast = true;
                    var lastTimeSince = $followActivityList.find("li[data-datelabel]:last").attr("data-datelabel");
                    $followActivityList.append(data);
                    $followActivityList
                        .find("li[data-datelabel='" + lastTimeSince + "']")
                        .not(":first")
                        .remove();
                }).always(function() {
                    calling = false;
                });
            }
        });

        $.get("/recent_activity_feed.json", {}, function(data) {
            $followActivityList.removeClass("loading").empty();
            $followActivityList.html(data);

            if ($followActivityList.is(":visible")) {
                if (!$followActivityList.find("li").length) {
                    $followActivityList
                        .hide()
                        .next()
                        .show()
                        .next()
                        .hide();
                }
            }
        }).fail(function() {
            if ($followActivityList.is(":visible")) {
                $followActivityList
                    .removeClass("loading")
                    .hide()
                    .next()
                    .show()
                    .next()
                    .hide();
            }
        });
    }

    var $feedtabs = $(".navigation .viewer li a[data-feed]");
    $feedtabs.click(function(e) {
        var feed = $(e.currentTarget).attr("data-feed") || "featured";
        if (feed == "recommended") {
            $sidebar
                .find(".wrapper.activites, .wrapper.popular, .wrapper.article")
                .hide()
                .end()
                .find(".wrapper.users")
                .show();
        } else {
            $sidebar
                .find(".wrapper.activites, .wrapper.popular, .wrapper.article")
                .show()
                .end()
                .find(".wrapper.users")
                .hide();
        }
    });
})();
