jQuery(function($) {
    var process_mobile_add_to_cart = false;
    var $ov_share = $("#pop_wrap .share_thing"),
        $add = $ov_share.find("span.add"),
        $list = $ov_share.find(".user-list"),
        $tpl = $list.find(">script").remove(),
        $name = $add.prev("script").remove();

    if (location.args) {
        $(document).ready(function() {
            var action = location.args["action"] || "";
            if ("fancy" in location.args || action == "fancy") {
                $(".things-btn button.fancy").click();
            } else if ("unfancy" in location.args) {
                $(".things-btn button.fancyd").click();
            } else if ("addtolist" in location.args) {
                $(".things-btn button.btn-add").click();
            } else if (action == "buy") {
                $(".thing-sale button.btn-buy").click();
            }
        });
    }

    // Recommendation
    (function() {
        if (!window.thing_id) return;
        var $box = $("div._might-fancy ul"),
            $tpl = $box.find('>script[type="fancy/template"]'),
            isLoading = false,
            cursor,
            reachedEnd = false;

        $box.empty();
        function load() {
            if (isLoading || reachedEnd) return;

			var url = '/recently_viewed_things?thing_id=' + window.thing_id;
            isLoading = true;

			$.ajax({
				type : 'get',
				url  : '/might_also_fancy?thing_id='+window.thing_id+'&lang='+lang+'&count='+12 ,
				success  : function(html){
					if(!html) return;
					$('.suggest.similar ul.figure-shop').html(html);
				},
				error : function(){
					$('.suggest.similar').hide();
					$('.suggest.similar ul.figure-shop').html('');
				}
			});

			// var requireLogin = $('.other-thing .recently ul.fancy-suggestions').attr('require_login');

			$.ajax({
				type : 'get',
				url  : url,
				success  : function(html){
					if(!html) return;
					$('.suggest.recently ul.figure-shop').html(html);
				},
				error : function(){
					$('.suggest.recently').hide();
					$('.suggest.recently ul.figure-shop').html('');
				}
			});
        }

        $box.on("scroll", function(e) {
            var scrollLeft = $box.scrollLeft();
            var width = $box[0].scrollWidth;
            if (scrollLeft > width - $box.width() * 3) load();
        });

        load();
    })();

	$('.other-thing .tabs a').on('click', function(e) {
        e.preventDefault();
        // var current_menu = $(this).attr('class');
		if ($(this).hasClass('similar')) {
			$('.other-thing .tabs').find('a').removeClass('current').end().find('a.similar').addClass('current');
			$('.other-thing').find('.inner').hide().end().find('.inner.similar').show();
		}else{
			$('.other-thing .tabs').find('a').removeClass('current').end().find('a.recently').addClass('current');
			$('.other-thing').find('.inner').hide().end().find('.inner.recently').show();
		}
		return false;
    });

    // Show someone
    $("#link-show").click(function() {
        if ($(this).attr("require_login") == "true") return require_login();
        $ov_share.trigger("show");
        return false;
    });

    var txt_add = $add.text().split("|");
    var is_ios = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    /*$ov_share
        .on({
            show: function() {
                var $this = $(this),
                    cmt,
                    url,
                    img,
                    enc_cmt,
                    enc_url,
                    enc_img;

                url = location.protocol + "//" + location.hostname + location.pathname;
                enc_url = encodeURIComponent(url);

                cmt = $(".figure-product figcaption")
                    .text()
                    .trim();
                enc_cmt = encodeURIComponent(cmt);
                console.log(cmt);
                console.log(enc_cmt);
                img = $this.find("form").attr("timage");
                enc_img = encodeURIComponent(img);

                // initialize
                $this
                    .find("input:text:not([name=url]),textarea")
                    .val("")
                    .end()
                    .find("span.add")
                    .text(txt_add[0])
                    .end()
                    .find(".user-list")
                    .hide()
                    .end()
                    .find("b.name")
                    .remove()
                    .end()
                    .find(".sh-frm")
                    .removeClass("focus")
                    .end();

                // get short url
                $.ajax({
                    type: "post",
                    url: "/get_short_url.json",
                    data: { thing_id: $this.find("form").attr("tid") },
                    dataType: "json",
                    headers: { "X-CSRFToken": $.cookie.get("csrftoken") },
                    success: function(json) {
                        if (!json.short_url) return;
                        var enc_short_url = encodeURIComponent(json.short_url);
                        $this
                            .find("input[name=url]")
                            .val(json.short_url)
                            .end()
                            .find(".share_whatsapp a")
                            .attr("href", "whatsapp://send?text=" + enc_cmt + " " + enc_short_url)
                            .end()
                            .find(".share-via a[href]")
                            .each(function() {
                                this.setAttribute(
                                    "href",
                                    this.getAttribute("href").replace(/([\?&]u(?:rl))=[^&]+/, "$1=" + enc_short_url)
                                );
                            })
                            .end();
                    }
                });
                openPop("share_thing");
                $this
                    .find(".share-via")
                    .find("a.tw")
                    .attr("href", "http://twitter.com/share?text=" + enc_cmt + "&url=" + enc_url + "&via=fancy")
                    .end()
                    .find("a.fb")
                    .attr("href", "http://www.facebook.com/sharer.php?u=" + enc_url)
                    .end()
                    .find("a.gg")
                    .attr("href", "https://plus.google.com/share?url=" + enc_url)
                    .end()
                    .find("a.tb")
                    .attr(
                        "href",
                        "http://www.tumblr.com/share/link?url=" +
                            enc_url +
                            "&name=" +
                            enc_cmt +
                            "&description=" +
                            enc_cmt
                    )
                    .end()
                    .end();

                if (is_ios) {
                    var url = "whatsapp://send?text=";
                    url += [enc_cmt, enc_url].join(" ");
                    $(".share_whatsapp")
                        .show()
                        .find("a")
                        .attr("href", url);
                }
            },
            hide: function() {
                var $this = $(this);
                $this.hide();
            },
            click: function(event) {
                if (event.target === this) $(this).trigger("hide");
            },
            touchstart: function(event) {
                if (event.target === this) $(this).trigger("hide");
            }
        })
        .find("input[name=url]")
        .focus(function() {
            var t = this;
            setTimeout(function() {
                t.select();
            }, 100);
        })
        .end()
        .find("span.add")
        .click(function() {
            $(this)
                .hide()
                .next("input:text")
                .show()
                .focus();
        })
        .end()
        .find("input[name=email]")
        .keydown(function(event) {
            var inp = this,
                $inp = $(this),
                v = $.trim(inp.value);

            switch (event.keyCode) {
                case 8: // backspace
                    if (v.length != 0) return true;
                    $inp.focus()
                        .siblings("b.name")
                        .eq(-1)
                        .find(">i.delete")
                        .click();
                    return false;
                case 13: // enter
                case 32: // space
                case 186: // ';'
                case 188: // ','
                    if (v.indexOf("@") > 0) {
                        setTimeout(function() {
                            var email = $.trim(inp.value);
                            inp.value = "";
                            $name
                                .template({ USERNAME: email })
                                .attr("email", email)
                                .insertBefore($add);
                            $add.text(txt_add[1]).click();
                        }, 10);
                    }
                    return false;
            }

            function request() {
                // abort the previous request
                try {
                    inp.xhr.abort();
                } catch (e) {}

                var v = $.trim(inp.value);
                if (!v)
                    return $list
                        .hide()
                        .parents("dd")
                        .addClass("focus");

                // email?
                if (v.indexOf("@") > -1)
                    return $list
                        .hide()
                        .parents("dd")
                        .removeClass("focus");

                $list
                    .empty()
                    .parents("dd")
                    .removeClass("focus");

                $.ajax({
                    type: "get",
                    url: "/search-users.json",
                    data: { term: v },
                    dataType: "json",
                    success: function(json) {
                        if (v != $.trim(inp.value))
                            return $list
                                .hide()
                                .parents("dd")
                                .removeClass("focus");
                        if (json && json.length) {
                            for (var i = 0, c = json.length; i < c; i++) {
                                $tpl.template({
                                    UID: json[i].id,
                                    USER_IMAGE: json[i].image_url,
                                    USERNAME: json[i].username,
                                    FULLNAME: json[i].name || json[i].username
                                }).appendTo($list);
                            }
                            $list
                                .scrollTop(0)
                                .show()
                                .parents("dd")
                                .addClass("focus")
                                .end()
                                .find(">li:first");
                        } else {
                            $list
                                .hide()
                                .parents("dd")
                                .removeClass("focus");
                        }
                    }
                });
            }

            clearTimeout(this.timer);
            setTimeout(request, 100);
        })
        .blur(function() {
            $add.show();
            $(this).hide();
        })
        .end()
        .find(".email-frm")
        .on("click", "b.name > i.delete", function() {
            var $par = $(this).parent(),
                $b = $par.siblings("b.name");
            $par.remove();
            if (!$b.length) $add.text(txt_add[0]);
            return false;
        })
        .end()
        .find(".user-list")
        .on("click", "li", function() {
            var $li = $(this);
            $name
                .template({
                    USERNAME: $li.attr("username"),
                    IMAGE_URL: $li.find("img").attr("src")
                })
                .attr({ uid: $li.attr("uid") })
                .insertBefore($add.text(txt_add[1]));
            $ov_share
                .find("input[name=email]")
                .val("")
                .focus();
            $list
                .hide()
                .parents("dd")
                .removeClass("focus");
        })
        .end()
        .find("button.btn-send")
        .click(function(e) {
            var $frm = $(this).parents("form"),
                params,
                emails = [],
                users = [];

            $(this).prop("disabled", true);

            params = {
                type: "nt",
                url: $frm.attr("turl"),
                name: $frm.attr("tname"),
                oid: $frm.attr("tid"),
                ooid: $frm.attr("ooid"),
                message: $.trim($frm.find("textarea").val())
            };

            $frm.find("b.name").each(function() {
                var $b = $(this);
                if ($b.attr("email")) {
                    emails.push($b.attr("email"));
                } else {
                    users.push($b.attr("uid"));
                }
            });

            if (!emails.length && !users.length) {
                $frm.find("button:submit").prop("disabled", false);
                return false;
            }

            params.emails = emails.join(",");
            params.users = users.join(",");

            $.ajax({
                type: "post",
                url: "/share-with-someone.json",
                data: params,
                dataType: "json",
                headers: { "X-CSRFToken": $.cookie.get("csrftoken") },
                success: function(json) {
                    if (!json) return;
                    if (json.status_code) {
                        alert("Sent!");
                        //$ov_share.trigger('hide');
                        closePop();
                    } else {
                        alert(json.message);
                    }
                },
                complete: function() {
                    $frm.find("button:submit").prop("disabled", false);
                }
            });

            e.preventDefault();
            return false;
        })
        .end();
	*/
    $('.figure-button a.share').click(function(){
        x=$(this).position();
        var top = x.top;
        openPop('share_thing');
        //$('#pop_wrap .share_thing').css('margin-top', Math.max(50,top-($('#pop_wrap .share_thing').height()))+'px');
        if ($(this).attr('require_login') == 'true') return require_login();
        $("#ov-share").trigger('show');
        return false;
    });
    $('.popup.share_thing dt a').click(function(){
        $('.share_thing dl').removeClass('current');
        $(this).parents('dl').addClass('current');
        return false;
    });
    // feature/featured
    $("a.feature").click(function() {
        var $this = $(this),
            params = {},
            url;

        if ($this.attr("require_login") == "true") return require_login();

        params["object_id"] = $this.attr("oid");
        params["object_type"] = "newthing";
        params["object_owner_id"] = $this.attr("ooid");

        if ($this.attr("ffid")) params["ffid"] = $this.attr("ffid");

        url = $this.hasClass("featured") ? "/delete_featured_find.xml" : "/add_featured_find.xml";

        $.ajax({
            url: url,
            type: "post",
            data: params,
            dataType: "xml",
            headers: { "X-CSRFToken": $.cookie.get("csrftoken") },
            success: function(xml) {
                var $xml = $(xml),
                    $st = $xml.find("status_code");
                if (!$st.length || $st.text() != 1) return;
                if (params["ffid"]) {
                    $this.removeAttr("ffid").removeClass("featured")[0].lastChild.nodeValue = lang["feature"];
                } else {
                    $this.attr("ffid", $xml.find("id").text()).addClass("featured")[0].lastChild.nodeValue =
                        lang["featured"];
                }
            }
        });
        return false;
    });

    var $options = $("select[name=option_id]");
    var $multiOptions = $(".default .multi-option");

    $options
        .on("change", function(event) {
            var val = $(this).val();
            var $selectedOption = $(this).children("option:selected");
            var soldout = window.sale_item_options[val] == "True";
            var $btn_soldout = $(".btn-cart.soldout"),
                $btn_cart = $(".btn-cart").not(".soldout");
            var $notify = $(".notify");
            var is_waiting = window.user_waiting_options[val] == "True";
            if (soldout) {
                $notify.show();
                $btn_soldout.show();
                $btn_cart.hide();
                if (is_waiting) {
                    $("a.notify")
                        .data("option_id", val)
                        .addClass("subscribed")
                        .text("Subscribed");
                } else {
                    $("a.notify")
                        .data("option_id", val)
                        .removeClass("subscribed")
                        .text("Notify me when available");
                }
            } else {
                $notify.hide();
                $btn_soldout.hide();
                $btn_cart.show();
            }

            var findp = sale_item_option_prices[val];
            var findrp = sale_item_option_retail_prices[val];
            if (typeof findp != undefined && findp != null) {
                var html = "$" + findp;
                $(".figure-detail .price").removeClass("sales");
                if (findrp && findrp > findp) {
                    $(".figure-detail .price").addClass("sales");
                    html += ' <small class="before">$' + findrp + "</small>";
                }
                $(".figure-detail .price").html(html);
            }
            setValues($selectedOption.data("values"));
        })
        .trigger("change");

    function setValues(values) {
        $multiOptions.each(function(i) {
            var selector = '[data-value="' + values[i].replace(/"/g, '\\"') + '"]';

            $(this)
                .find("[data-value]")
                .removeClass("selected")
                .filter(selector)
                .addClass("selected")
                .end()
                .end()
                .find("select")
                .val(values[i])
                .end()
                .find("span.value")
                .text(values[i]);
        });
        $multiOptions
            .find("option, [data-value]")
            .removeAttr("disabled")
            .end()
            .find("li.disabled")
            .removeClass("disabled");
        $(values).each(function(i, v) {
            $multiOptions.eq(i).each(function(ii) {
                $(this)
                    .find("select option, [data-value]")
                    .each(function() {
                        var tempValues = _.clone(values),
                            value = $(this).data("value") || $(this).attr("value"),
                            exists = false;
                        tempValues[i] = value;
                        $options.find("option").each(function() {
                            if (
                                $(this)
                                    .data("values")
                                    .join("/") == tempValues.join("/")
                            ) {
                                exists = true;
                                return false;
                            }
                        });
                        if (!exists) {
                            if ($(this).is("a, button"))
                                $(this)
                                    .closest("li")
                                    .addClass("disabled");
                            if (!$(this).is("a")) $(this).attr("disabled", "disabled");
                        }
                    });
            });
        });
    }

    $multiOptions.on("click change", "select, [data-value]", function(e) {
        if ($(this).is("a") || $(this).is("button")) e.preventDefault();
        if (e.type == "click" && $(this).is("select")) return;
        if ($(this).attr("disabled")) {
            e.preventDefault();
            return;
        }

        var values = Array.prototype.slice.call(
                $multiOptions.map(function() {
                    return (
                        $(this)
                            .find(".selected")
                            .data("value") ||
                        $(this)
                            .find("select")
                            .val()
                    );
                })
            ),
            index = $(this)
                .closest(".multi-option")
                .data("index");
        values[index] = $(this).data("value") || $(this).val();
        $options.find("option").each(function() {
            if (
                $(this)
                    .data("values")
                    .join("/") == values.join("/")
            ) {
                $options.val($(this).val()).trigger("change");
                return false;
            }
        });
    });

    // own
    $("a.notify").click(function() {
        var $this = $(this),
            params = {},
            url,
            _CLASS_ = "subscribed";

        if ($this.attr("require_login") == "true") return require_login();

        params["sale_item_id"] = $this.attr("item_id");
        var option_id = $(this).data("option_id");

        if (typeof option_id !== "undefined" && option_id != null && option_id != "") {
            params["option_id"] = option_id;
        }
        var remove = $this.hasClass(_CLASS_) ? 1 : 0;

        url = "/wait_for_product.json";
        params["remove"] = remove;

        $.ajax({
            type: "post",
            url: url,
            data: params,
            dataType: "json",
            success: function(json) {
                if (!json || json.status_code == undefined) return;
                if (json.status_code == 1) {
                    if (remove == 1) {
                        $this.removeClass(_CLASS_).text("Notify me when available");
                        if ("option_id" in params) {
                            window.user_waiting_options[option_id] = "False";
                        }
                    } else {
                        $this.addClass(_CLASS_).text("Subscribed");
                        if ("option_id" in params) {
                            window.user_waiting_options[option_id] = "True";
                        }
                    }
                } else if (json.status_code == 0 && json.message) {
                    alert(json.message);
                }
            }
        });
    });

    // sale overlay
    (function() {
        var $ov = $("._sale-layer"),
            $fr = $ov.find(".figure .figure-wrap"),
            $p = $ov.find(".figure .pagination");

        $fr.swipe({
            //allowPageScroll:"horizontal",
            threshold: 30,
            triggerOnTouchEnd: false,
            swipeRight: function(e) {
                $p.find("a.current")
                    .prev("a")
                    .trigger("click");
            },
            swipeLeft: function(e) {
                $p.find("a.current")
                    .next("a")
                    .trigger("click");
            }
        });

        $p.find("a").click(function(e) {
            var $this = $(this);
            e.preventDefault();
            var width = $fr.width();
            var idx = $this.prevAll("a").length;
            var toLeft = Math.max(width * idx, 0);
            $fr.animate({ scrollLeft: toLeft + "px" }, 300, "easeInOutExpo");
            $p.find("a.current").removeClass("current");
            $this.addClass("current");
        });

        // add to cart
        $ov.find("form").submit(function() {
            var elems = this.elements,
                params = {},
                i,
                c,
                f,
                n,
                v,
                $btn = $(this).find("button.btn-cart");

            for (i = 0, c = elems.length; i < c; i++) {
                f = elems[i];
                n = f.name;
                v = $.trim(f.value || "");
                if (!n || !v.length) continue;
                params[n] = v;
            }
            var is_fancybox = params.is_fancybox == "true";
            var has_categories = params.has_categories == "true";
            if (is_fancybox) {
                if ($btn.attr("require_login")) return require_login(params);

                var categories = [];
                if (has_categories) {
                    $(".fancybox input[name=categories]:checked").each(function() {
                        categories.push($(this).val());
                    });
                    if (categories.length != 3) {
                        alert(gettext("Please choose three categories."));
                        return false;
                    }
                }
                params["quantity"] = 1;
                params["categories"] = categories.join(",");
                params["is_fancybox"] = is_fancybox;
            }
            if (!params.quantity) params.quantity = 1;

            $btn.prop("disabled", true).css("opacity", 0.7);
            if (process_mobile_add_to_cart) return false;
            process_mobile_add_to_cart = true;
            params.from_sds_page = window.from_sds_page;
            if (window.dataLayer) {
                dataLayer.push({
                    event: "Add_to_Cart_Button",
                    product_id: params["sale_item_id"],
                    products: undefined,
                    products_info: undefined,
                    revenue: undefined,
                    option_id: params["option_id"]
                });
            }
            $.ajax({
                type: "post",
                url: "/add_item_to_cart.json",
                data: params,
                dataType: "json",
                success: function(resp) {
                    if (resp.status_code) {
                        location.href = "/cart";
                    } else {
                        if (resp.message) alert(resp.message);
                    }
                },
                complete: function() {
                    process_mobile_add_to_cart = false;
                    $btn.prop("disabled", false).css("opacity", "");
                }
            });
            return false;
        });
    })();

    // report this thing
    $(".report-link").click(function(event) {
        var $this = $(this);
        event.stopPropagation();
        event.preventDefault();

        if ($this.attr("require_login") === "true") return require_login();
        $(".popup.report")
            .find(".default")
            .show()
            .end()
            .find(".reported")
            .hide();
        $(".popup.report .btn-report").attr("tid", $this.attr("tid"));
        openPop("report");
    });

    $(".popup.report .btn-report").click(function(event) {
        var $this = $(this);
        event.stopPropagation();
        event.preventDefault();

        $.ajax({
            type: "post",
            url: "/report_thing.xml",
            data: { tid: $this.attr("tid") },
            dataType: "xml",
            success: function() {
                $this
                    .parents(".default")
                    .hide()
                    .next()
                    .show();
            }
        });

        return false;
    });

    // description more/less
    $("._descr-more").click(function(e) {
        var $this = $(this);
        $this
            .closest("div")
            .find(".description")
            .toggleClass("short");
        $this
            .closest(".description")
            .find(".detail")
            .toggleClass("short");
        $this.toggleClass("see-more see-less");
        if ($this.hasClass("see-less")) {
            $this.html(gettext("Hide") + "<i></i>");
        } else {
            $this.html(gettext("Read More") + "<i></i>");
        }
        e.preventDefault();
    });

    // currency approximately
    var str_currency = $(".figure-detail a.code, .figure-info a.code")
        .eq(0)
        .text();
    var dlg_currency = $.dialog("show_currency");
    var $currency_list = $(".popup.show_currency");

    function refresh_currency() {
        var $currency = $(".figure-detail a.code, .figure-info a.code");

        $currency.text(str_currency);

        function text_currency(el, money, code, symbol, natural_name) {
            if (typeof money == "number") {
                if (code == "BTC") {
                    money = money.toFixed(5);
                } else {
                    money = money.toFixed(2);
                }
            }
            money = money.replace(/[ \.]00$/, "");

            var str = "APPROX. " + symbol + " " + money + " <small>" + code + "</small>";
            $(el).html(str);
            $(el)
                .show()
                .attr("currency", code);
        }

        function show_currency(el, code, set_code) {
            var p = $(el).attr("price");

            if (window.numberType === 2) p = p.replace(/,/g, ".").replace(/ /g, "");
            p = p.replace(/,/g, "");

            if (set_code) {
                $.ajax({
                    type: "POST",
                    url: "/set_my_currency.json",
                    data: { currency_code: code }
                });
            }

            if (code == "USD") {
                $(el)
                    .attr("currency", code)
                    .text("USD");
                return $(el)
                    .show()
                    .removeClass("currency_price");
            } else {
                $(el).addClass("currency_price");
            }

            text_currency(el, "...", code, "");

            $.ajax({
                type: "GET",
                url: "/convert_currency.json?amount=" + p + "&currency_code=" + code,
                dataType: "json",
                success: function(json) {
                    if (!json || typeof json.amount == "undefined") return;
                    var price = json.amount.toFixed(2) + "",
                        regex = /(\d)(\d{3})([,\.]|$)/;
                    while (regex.test(price)) price = price.replace(regex, "$1,$2$3");
                    if (code == "BTC") {
                        price = json.amount.toFixed(5) + "";
                    }

                    if (window.numberType === 2) price = price.replace(/,/g, " ").replace(/\./g, ",");

                    text_currency(el, price, json.currency.code, json.currency.symbol, json.currency.natural_name);
                }
            });
        }

        // get currency
        $currency.each(function(i, v) {
            var $this = $(v);
            if ($this.attr("price") && parseFloat($this.attr("price")) > 0) {
                if ($this.attr("currency")) {
                    show_currency(v, $this.attr("currency"));
                } else {
                    setTimeout(function() {
                        $.ajax({
                            type: "GET",
                            url: "/get_my_currency.json",
                            dataType: "json",
                            success: function(json) {
                                if (json && json.currency_code) show_currency(v, json.currency_code);
                            }
                        });
                    }, 100);
                }
            } else {
                $this.closest(".currency").hide();
            }
        });

        $currency.closest(".figure-detail, .figure-info").delegate("a.code", "click", function(event) {
            var $this = $(this);
            event.preventDefault();
            if (!$currency_list.hasClass("loaded")) return;

            function close_currency() {
                dlg_currency.close();
            }

            var my_currency = $currency
                .filter(":visible")
                .eq(0)
                .attr("currency");
            if (my_currency) {
                var my_currency_selector = 'li.currency[code="' + my_currency + '"]';
                $currency_list
                    .find(my_currency_selector)
                    .find("a")
                    .addClass("current");
                var $ul_major = $currency_list.find("ul.major");

                var $my_currency_item = $ul_major.find(my_currency_selector);
                if ($my_currency_item.length == 0) {
                    var $ul_all = $currency_list.find("ul").not(".major");
                    $my_currency_item = $ul_all.find(my_currency_selector).clone();
                }
                $ul_major.prepend($my_currency_item);
            }
            dlg_currency.open();
            dlg_currency.$obj.on("click", "li.currency a", function(event) {
                event.preventDefault();
                var code = $(event.target)
                    .closest(".currency")
                    .attr("code");
                show_currency($this, code, true);
                close_currency();
            });
        });
    }

    refresh_currency();

    var $scope = $(document.body);
    $scope.find(".delivery-summary").on("click", ".delivery a", function(e) {
        e.preventDefault();
        var code = $(this).attr("code");
        if (code) {
            if ($.dialog("shipping").$obj.find(".country-list ul.after > li.current").length > 0) {
            } else {
                $.dialog("shipping")
                    .$obj.find(".country-list ul.after > li")
                    .each(function() {
                        if ($(this).attr("code") == code) {
                            $(this)
                                .closest("ul")
                                .find(".current")
                                .removeClass("current");
                            $(this).addClass("current");
                        }
                    });
            }
        }
        $scope
            .find(".popup.shipping .search .text")
            .val("")
            .trigger("change");
        $.dialog("shipping").open();
        return false;
    });

    $scope.find(".popup.shipping ul").on("click", "li > a", function(e) {
        e.preventDefault();

        var code = $(this)
            .closest("li")
            .attr("code");
        $(this)
            .closest("ul")
            .find(".current")
            .removeClass("current");
        $(this).addClass("current");

        var $selected = $scope.find(".popup.shipping li .current");
        var code = $selected.parent().attr("code");
        var countryName = $selected.find("b").text();

        if (code) {
            showShippingCountry(countryName, code);
            $.post("/set_shipping_country", { code: code, name: countryName });
        }
        $.dialog("shipping").close();
    });

    function showShippingCountry(name, code) {
        var $intlShipping = $scope.find(".delivery.international");
        var $domeShipping = $scope.find(".delivery.domestic");

        if (code == "US") {
            $intlShipping.hide();
            $domeShipping
                .find("a")
                .text(name)
                .attr("code", code);
            $domeShipping.show();
        } else {
            if ($intlShipping.length > 0) {
                // available international shipping
                $domeShipping.hide();
                $intlShipping
                    .find("a")
                    .text(name)
                    .attr("code", code);
                $intlShipping.show();
            } else {
                // unavailable international shipping
                $intlShipping.hide();
                $domeShipping.html('Unable to ship to <a href="#" code="' + code + '">' + name + "</a>");
                $domeShipping.show();
            }
        }
    }

    $scope
        .find(".popup.shipping .search")
        .on("keyup change paste", ".text", function(e) {
            var $this = $(this);
            var text = $this.val().toLowerCase();
            if (text === "") {
                $scope.find(".popup.shipping ul").hide();
                $scope.find(".popup.shipping ul.after").show();
                $scope.find(".popup.shipping .search .remove").hide();
                $.dialog("shipping").center();
                return;
            }

            var $ul = $scope.find(".popup.shipping ul.search-result");
            $ul.html("");
            $scope.find(".popup.shipping ul li").each(function() {
                var $li = $(this);
                var code = $li.attr("code").toLowerCase();
                var name = $li.text().toLowerCase();
                if (code.indexOf(text) > -1 || name.indexOf(text) > -1) {
                    $ul.append($li.clone());
                }
            });
            $scope.find(".popup.shipping ul").hide();
            $scope.find(".popup.shipping ul.search-result").show();
            $scope.find(".popup.shipping .search .remove").show();
            $.dialog("shipping").center();
        })
        .on("click", ".remove", function(e) {
            $scope
                .find(".popup.shipping .search .text")
                .val("")
                .trigger("change");
        });
});
