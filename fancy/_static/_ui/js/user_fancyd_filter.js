
$(function() {
    var $stream = $("#content .stream").attr("loc", location.pathname.replace(/\//g, "-").substr(1)),
        $last;
    $last = $stream.find(">li:last-child");
    $stream.data("restored", $last[0] !== $stream.find(">li:last-child")[0]);
    if (!$stream.find("> li").length) {
        var args = $.extend({}, location.args);
        if (!$.param(args)) {
            $("div.yet_product").show();
            $(".wrapper-content").removeClass("refine");
            $("#summary .refine a").remove();
        } else {
            $("div.empty-result").show();
        }
    }

    $(".shop .search_keyword input").focus(function() {
        $(this)
            .parents("dd")
            .find(".ic-search")
            .addClass("on");
    });
    $(".shop .search_keyword input").blur(function() {
        if ($(this).val() == "") {
            $(this)
                .parents("dd")
                .find(".ic-search")
                .removeClass("on");
        }
    });

    $(".cate li, .category li").delegate("a", "click", function(event) {
        event.preventDefault();
        $(".cate a.current, .category a.current").removeClass("current");
        $(this).addClass("current");
        var url = $(this).attr("href"),
            args = $.extend({}, location.args),
            query;

        if (args.sale_category) delete args.sale_category;
        if ((query = $.param(args))) {
            if (url.indexOf("?") > 0) url += "&" + query;
            else url += "?" + query;
        }

        loadPage(url);
    });

    // New category (v4)
    $("#refine-by-category").on("change", function(event) {
        event.preventDefault();
        var url = $(this).val(),
            args = $.extend({}, location.args),
            query;

        if (args.sale_category) delete args.sale_category;
        if ((query = $.param(args))) {
            if (url.indexOf("?") > 0) url += "&" + query;
            else url += "?" + query;
        }

        loadPage(url);
    });

    var currentSaleCategory = location.args.sale_category;
    if (!!currentSaleCategory) {
        $('#sidebar .category li a').removeClass('current');
        $('#sidebar .category li a[data-sale_category="' + currentSaleCategory + '"]').addClass('current');
    }

    if (!!currentSaleCategory || !!location.args.price || !!location.keyword) {
        $('.wrapper-content').addClass('refine');
    }

    // keyword search
    $(".filter .filter input[type=text]")
        .hotkey("ENTER", function(event) {
            var keyword = $.trim(this.value),
                url = location.pathname,
                args = $.extend({}, location.args),
                query;

            event.preventDefault();

            if (keyword) {
                args.keyword = keyword;
            } else {
                delete args.keyword;
            }

            if ((query = $.param(args))) url += "?" + query;

            loadPage(url);
        })
        .keyup(function() {
            var hasVal = !!$.trim(this.value);
            if (hasVal) {
                $(this)
                    .parent()
                    .find(".remove")
                    .show();
            } else {
                $(this)
                    .parent()
                    .find(".remove")
                    .hide();
            }
        })
        .keyup();

    // remove keyword
    $(".filter .filter .remove").click(function(event) {
        event.preventDefault();
        $(this)
            .parent()
            .find("input[type=text]")
            .val("")
            .keyup();

        var url = location.pathname,
            args = $.extend({}, location.args),
            query;

        event.preventDefault();
        delete args.keyword;

        if ((query = $.param(args))) url += "?" + query;

        loadPage(url);
    });

    // new sort option (v4)
    $("select#order-by").on("change", function(event) {
        event.preventDefault();
        var sort_by_price = $(this).val(),
            url = location.pathname,
            args = $.extend({}, location.args),
            query;

        if (sort_by_price) {
            args.sort = sort_by_price;
        } else {
            delete args.sort;
        }

        if ((query = $.param(args))) url += "?" + query;
        setOptions(args);

        loadPage(url);
        $(this)
            .closest(".more")
            .find(".order-by-label")
            .text(
                $(this)
                    .find("option:selected")
                    .text()
            );
    });

    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 1000,
        step: 10,
        values: [parseInt($(".price .amount .min").text()), parseInt($(".price .amount .max").text())],
        slide: function(event, ui) {
            if (ui.values[1] - ui.values[0] < 10) return false;
            $(".price .amount .min").text(ui.values[0] || 1);
            $(".price .amount .max").text(ui.values[1] + (ui.values[1] == 1000 ? "+" : ""));
        },
        change: function(event, ui) {
            var min_price = ui.values[0],
                max_price = ui.values[1],
                url = location.pathname,
                args = $.extend({}, location.args),
                query;

            if (max_price == 1000) max_price = "";
            if (max_price && !min_price) min_price = "1";

            if (min_price || max_price) {
                var price = min_price + "-" + max_price;
                args.price = price;
            } else {
                delete args.price;
            }

            if ((query = $.param(args))) url += "?" + query;

            loadPage(url);
        }
    });

    function setOptions(params) {
        // set sort order
        $("#sidebar .sort li.selected").removeClass("selected");
        if (params.sort_by_price) {
            if ($("#sidebar .sort li input").length) {
                $("#sidebar .sort li input[value=" + params.sort_by_price + "]")
                    .parent()
                    .addClass("selected")
                    .end()[0].checked = true;
            }
        }

        $("#sidebar .option fieldset").hide();
        if (params.ss) {
            $("#sidebar .option fieldset").show();
            $("#sidebar input[name=ss]")
                .parent()
                .addClass("selected")
                .end()[0].checked = true;
        }
    }

    var ajax = null;
    function loadPage(url, skipSaveHistory) {
        var $win = $(window),
            $stream = $("#content ol.stream");

        var $lis = $stream.find(">li"),
            scTop = $win.scrollTop(),
            stTop = $stream.offset().top,
            winH = $win.innerHeight(),
            headerH = $("#header-new").height(),
            useCSS3 = Modernizr.csstransitions,
            firstTop = -1,
            maxDelay = 0,
            begin = Date.now();

        if (useCSS3) {
            $stream.addClass("use-css3").removeClass("fadein");

            $lis.each(function(i, v) {
                if (!inViewport(v)) return;
                if (firstTop < 0) firstTop = v.offsetTop;

                var delay = Math.round(Math.sqrt(Math.pow(v.offsetTop - firstTop, 2) + Math.pow(v.offsetLeft, 2)));

                v.className += " anim";
                setTimeout(function() {
                    v.className += " fadeout";
                }, delay + 10);

                if (delay > maxDelay) maxDelay = delay;
            });
        }

        if (!skipSaveHistory && window.history && history.pushState) {
            history.pushState({ url: url }, document.title, url);
        }
        location.args = $.parseString(location.search.substr(1));

        setOptions(location.args);

        $(".pagination > a")
            .remove()
            .attr("href", "");
        $("#content").addClass("loading");

        try {
            if (ajax) ajax.abort();
        } catch (e) {}

        ajax = $.ajax({
            type: "GET",
            url: url,
            dataType: "html",
            success: function(html) {
                setOptions(location.args);

                $stream.attr("loc", location.pathname.replace(/\//g, "-").substr(1));

                var $html = $($.trim(html)),
                    $new_more = $html.find(".pagination > a");

                $stream.html($html.find("#content ol.stream").html());

                if (!$stream.find("> li").length) {
                    $stream.css("height", "").hide();
                    $("div.empty, div.empty-result, div.yet_product").show();
                } else {
                    $stream.show();
                    $("div.empty, div.empty-result, div.yet_product").hide();
                }

                if ($new_more.length) $(".pagination").append($new_more);
                $("#content").removeClass("loading");

                (function() {
                    if (useCSS3 && Date.now() - begin < maxDelay + 300) {
                        return setTimeout(arguments.callee, 50);
                    }

                    $stream.addClass("fadein").html($html.find("#content ol.stream").html());

                    if (useCSS3) {
                        $win.scrollTop(scTop);
                        scTop = $win.scrollTop();
                        stTop = $stream.offset().top;

                        firstTop = -1;
                        $stream.find(">li").each(function(i, v) {
                            if (!inViewport(v)) return;
                            if (firstTop < 0) firstTop = v.offsetTop;

                            var delay = Math.round(
                                Math.sqrt(Math.pow(v.offsetTop - firstTop, 2) + Math.pow(v.offsetLeft, 2))
                            );

                            v.className += " anim";
                            setTimeout(function() {
                                v.className += " fadein";
                            }, delay + 10);

                            if (delay > maxDelay) maxDelay = delay;
                        });

                        setTimeout(function() {
                            $stream
                                .removeClass("use-css3 fadein")
                                .find("li.anim")
                                .removeClass("anim fadein");
                        }, maxDelay + 300);
                    }

                    // reset infiniteshow
                    $.infiniteshow({
                        itemSelector: "#content .stream > li"
                    });
                    $win.trigger("scroll");
                })();
            }
        });

        function inViewport(el) {
            return stTop + el.offsetTop + el.offsetHeight > scTop + headerH && stTop + el.offsetTop < scTop + winH;
        }
    }

    $(window).on("popstate", function(event) {
        var e = event.originalEvent,
            $stream;
        if (!e || !e.state) return;

        $stream = $("#content .stream");
        if ($stream.data("restored")) {
            $stream.data("restored", false);
        } else {
            loadPage(event.originalEvent.state.url, true);
        }
    });
});
