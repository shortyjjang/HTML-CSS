jQuery(function($) {
    // gift sale overlay
    (function() {
        var $ov = $("._giftcard-layer");

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

            var recipient_name = $("input[name=recipient_name]").val();
            var recipient_email = $("input[name=recipient_email]").val();
            var recipient_username = $("input[name=recipient_username]").val();
            var message = $("textarea[name=message]").val();

            if (recipient_name.trim().length == 0) {
                alert("Please enter recipient name");
                return false;
            }

            // see common/util.js to change emailRegEx
            if (recipient_email.search(window.emailRegEx) == -1 && !recipient_username) {
                alert("A valid email address is required");
                return false;
            }
            if (message.trim().length == 0) {
                alert("Please enter personal message");
                return false;
            }

            params.v3 = true;

            $btn.prop("disabled", true).css("opacity", 0.7);
            $.ajax({
                type: "post",
                url: "/create-gift-card.json",
                data: params,
                dataType: "json",
                success: function(resp) {
                    if (resp.status_code) {
                        location.href = "/gift-card/checkout";
                    } else {
                        if (resp.message) alert(resp.message);
                    }
                },
                complete: function() {
                    $btn.prop("disabled", false).css("opacity", "");
                }
            });
            return false;
        });

        function recipient_selected(user) {
            $ov.find(".recipe-email").val(user.username);
            $ov.find("input[name=recipient_name]").val(user.fullname);
            $ov.find("input[name=recipient_username]").val(user.username);
        }

        // auto complete
        function search_fancy_deferred(query) {
            return $.ajax({
                type: "get",
                url: "/search-users.json",
                data: { term: query },
                dataType: "json"
            });
        }

        function autocomplete(options) {
            var ajax = null;

            var defaults = {
                input: "._giftcard-layer .recipe-email",
                list: "._giftcard-layer ul.user-list",
                template: 'script[type="fancy/giftcard_user_list_item"]',
                onmousedown: recipient_selected,
                timeout: 100,
                enable_space: false,
                request: function($list, $input, $template, query) {
                    $input.addClass("loading");
                    if (ajax) {
                        try {
                            ajax.abort();
                        } catch (e) {}
                    }
                    ajax = search_fancy_deferred(query);
                    $.when(ajax).done(function(json) {
                        $input.removeClass("loading");
                        if (query != $.trim($input.val())) return $list.hide();
                        if (json && json.length) {
                            for (var i = 0, c = json.length; i < c; i++) {
                                var user = json[i];
                                var context = {
                                    NAME: user.name,
                                    USERNAME: user.username,
                                    PHOTO: user.profile_image_url,
                                    SMALL_PHOTO: user.image_url,
                                    URL: user.html_url,
                                    TYPE2: user.type,
                                    UID: user.uid
                                };
                                var $item = $template.template(context);
                                $item.appendTo($list);
                            }
                            $list
                                .show()
                                .find(">li:first")
                                .addClass("on");
                        } else {
                            $list.hide();
                        }
                    });
                }
            };
            options = $.extend({}, defaults, options);

            var $inp = $(options.input),
                $list = $(options.list),
                $item = $list.find(">li").remove(),
                timer,
                prev_val;

            $inp.keyup(function(event) {
                if ($(this).attr("require_login") == "true") return require_login();

                var $inp = $(this).data("uid", 0);

                switch (event.keyCode) {
                    case 9: // tab
                    case 13: // enter
                    case 32: // space
                        if (options.enable_space) {
                            break;
                        }
                    case 186: // ';'
                    case 188: // ','
                        if ($inp.val().indexOf("@") == -1) {
                            if (event.keyCode == 9 && $list.is(":hidden")) return true;
                            $list.trigger("key.enter");
                        }
                        return false;
                    case 38:
                        $list.trigger("key.up");
                        return false;
                    case 40:
                        $list.trigger("key.down");
                        return false;
                }

                var val = $.trim($inp.val());

                if (!val) clearTimeout(timer);
                if (!val || val == prev_val) return;

                prev_val = val;

                if (val.indexOf("@") >= 0) return $list.hide();

                $list.hide().empty();
                var $template = $(options.template);
                function request() {
                    options.request($list, $inp, $template, val);
                }
                clearTimeout(timer);
                timer = setTimeout(request, options.timeout);
            }).end();

            $list
                .on("key.up key.down", function(event) {
                    if ($list.is(":hidden")) return false;

                    var $items = $list.children("li"),
                        up = event.namespace == "up",
                        idx = Math.min(Math.max($items.filter(".on").index() + (up ? -1 : 1), 0), $items.length - 1);
                    var $on = $items
                            .removeClass("on")
                            .eq(idx)
                            .addClass("on"),
                        bottom;

                    if (up) {
                        if (this.scrollTop > $on[0].offsetTop) this.scrollTop = $on[0].offsetTop;
                    } else {
                        bottom = $on[0].offsetTop - this.offsetHeight + $on[0].offsetHeight;
                        if (this.scrollTop < bottom) this.scrollTop = bottom;
                    }
                })
                .on("key.enter", function() {
                    $list.children("li.on").mousedown();
                })
                .delegate("li", "mousedown", function() {
                    var $li = $(this);
                    options.onmousedown($li.data());
                    $list.hide();
                });
        }
        autocomplete();
    })();
    // calendar
    (function() {
        var $t = $("input.calendar"),
            $cal = $t.after('<div class="calendar">').next(),
            d = new Date(),
            months = lang.monthNames.split(" "),
            en_months = "January February March April May June July August September October November December".split(
                " "
            ),
            today = new Date(),
            one_year_later = new Date();

        function ymd(dt, m, d) {
            return (
                "" + dt.getFullYear() + ((m = dt.getMonth()) > 9 ? m : "0" + m) + ((d = dt.getDate()) > 9 ? d : "0" + d)
            );
        }

        d.setDate(d.getDate() + 1);
        one_year_later.setFullYear(one_year_later.getFullYear() + 1);

        $cal.on("draw", function(event, date) {
            var $this = $(this),
                sel,
                start,
                end,
                min,
                max,
                classList = [],
                html = "";

            if (!date) date = $this.data("date") || new Date();
            $this.data("date", date);

            sel = $this.data("selected");

            start = new Date(date);
            start.setDate(1);
            start.setDate(1 - start.getDay());
            end = new Date(date);
            end.setDate(1);
            end.setMonth(end.getMonth() + 1);
            end.setDate(0);
            end.setDate(end.getDate() + 7 - end.getDay());

            if ((min = $this.data("min"))) min = ymd(min);
            if ((max = $this.data("max"))) max = ymd(max);

            var now = new Date();

            while (start < end) {
                classList = [];
                if (start.getMonth() != date.getMonth()) {
                    classList.push("other-month");
                    classList.push(start.getMonth() < date.getMonth() ? "prev-month" : "next-month");
                } else if (sel && ymd(sel) == ymd(start)) {
                    classList.push("selected");
                }
                if (ymd(now) == ymd(start)) {
                    classList.push("today");
                }
                if (min && ymd(start) < min) classList.push("disabled");
                if (max && ymd(start) > max) classList.push("disabled");

                html +=
                    (start.getDay() == 0 ? "<tr>" : "") +
                    "<td" +
                    (classList.length ? ' class="' + classList.join(" ") + '"' : "") +
                    ">" +
                    start.getDate() +
                    "</td>" +
                    (start.getDay() == 6 ? "</tr>" : "");
                start.setDate(start.getDate() + 1);
            }

            $this
                .find("p>b")
                .text(months[date.getMonth()] + " " + date.getFullYear())
                .end()
                .find("tbody")
                .html(html);
        })
            .on("select", function(event, date) {
                var $this = $(this),
                    d = $this.data("date"),
                    v = en_months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

                $this
                    .data("selected", new Date(date))
                    .prev("input")
                    .val(v);
                //$this.closest('dd').prev('dt').text(v);
                $this.prevAll("p").html("<i class='ic-calendar'></i> " + v);

                if (d.getFullYear() != date.getFullYear() || d.getMonth() != date.getMonth()) return;

                $this
                    .find("td:not(.other-month)")
                    .removeClass("selected")
                    .filter(function() {
                        return this.firstChild.nodeValue == date.getDate();
                    })
                    .addClass("selected");
            })
            .on("set-min", function(event, min) {
                var $this = $(this),
                    sel = $this.data("selected");
                min = new Date(min);
                if (ymd(sel) < ymd(min)) {
                    $this.trigger("select", [min]);
                    var d = $this.data("date");
                    d.setMonth(min.getMonth());
                }

                $this.data("min", min).trigger("draw");
            })
            .on("set-max", function(event, max) {
                var $this = $(this),
                    sel = $this.data("selected");
                max = new Date(max);
                if (ymd(sel) > ymd(max)) $this.trigger("select", [max]);
                $this.data("max", max).trigger("draw");
            })
            .append('<p><a class="prev"><i></i></a><a class="next"><i></i></a><b></b></p>')
            .append(
                '<table><thead><th class="sun">' +
                    lang.shortWeekNames.replace(/ /g, "</th><th>") +
                    "</th></thead><tbody></tbody></table>"
            )
            .on("click", "a.prev", function() {
                var $cal = $(this).closest(".calendar"),
                    d = $cal.data("date");

                if (+ymd(d) - ymd(today) < 0) return false;

                d.setDate(1);
                d.setMonth(d.getMonth() - 1);
                $cal.trigger("draw");
            })
            .on("click", "a.next", function() {
                var $cal = $(this).closest(".calendar"),
                    d = $cal.data("date");

                if (+ymd(one_year_later) - ymd(d) < 0) return false;

                d.setDate(1);
                d.setMonth(d.getMonth() + 1);
                $cal.trigger("draw");
            })
            .find("tbody")
            .delegate("td", "click", function() {
                var $this = $(this),
                    $cal = $this.closest(".calendar"),
                    d = $cal.data("date"),
                    m = d.getMonth();
                if ($this.hasClass("selected") || $this.hasClass("disabled")) return false;
                d.setDate($this.text());
                if ($this.hasClass("prev-month")) d.setMonth(m - 1);
                else if ($this.hasClass("next-month")) d.setMonth(m + 1);
                if ($this.hasClass("other-month")) $cal.trigger("draw");
                $cal.trigger("select", [d]);
                return false;
            })
            .end()
            .each(function() {
                $(this)
                    .data("date", new Date(d))
                    .data("min", new Date(d));
            })
            .trigger("select", [d])
            .trigger("draw");

        $cal.eq(0).on("select", function(event, date) {
            date = new Date(date);
            date.setDate(date.getDate() + 1);
            $cal.eq(1).trigger("set-min", date);
        });
        //$cal.eq(1).on('select',function(event,date){ date=new Date(date);date.setDate(date.getDate()-1);$cal.eq(0).trigger('set-max',date) });

        $cal.eq(0).trigger("select", [d]);
    })();

    // hotel overlay
    (function() {
        var $ov = $("._hotel_layer");
        $ov.on("show", function() {
            var $b = $("body"),
                h = Math.max($b[0].scrollHeight, $b.innerHeight()),
                d1 = new Date(),
                d2 = new Date();

            d1.setDate(d1.getDate() + 1);
            d2.setDate(d2.getDate() + 4);

            $ov.show()
                .height(h)
                .attr("class", "step1")
                .find("#adult-people")
                .val(1)
                .end()
                .find("#child-people")
                .val(0)
                .end()
                .find("div.in, div.out")
                .removeClass("on")
                .end()
                .find("div.calendar")
                .eq(0)
                .trigger("select", [d1])
                .end()
                .eq(1)
                .trigger("select", [d2])
                .end()
                .end();
        })
            .on("hide", function() {
                $ov.hide();
            })
            .on("click", function(event) {
                if (event.target === this) $(this).trigger("hide");
            })
            .find("a.more")
            .click(function() {
                var $hm = $("#hotel-more").toggle();
                $(this)
                    .find("i")
                    .text($hm.is(":visible") ? "-" : "+");
                return false;
            })
            .end()
            .find("div.in, div.out")
            .click(function() {
                $("div.in, div.out").removeClass("on");
                $(this).addClass("on");
            })
            .end()
            .find("p.txt-error")
            .blur(function() {
                $(this).hide();
            })
            .end()
            .find(".btn-availability")
            .click(function() {
                var $btn = $(this),
                    params = {
                        hotelId: window.hotel_id,
                        arrivalDate: $("#check-in").val(),
                        departureDate: $("#check-out").val()
                    },
                    rooms = [];

                rooms[0] = $("#adult-people").val();
                for (var i = 0, c = parseInt($("#child-people").val()); i < c; i++) rooms.push(10);
                params.rooms = rooms.join(",");

                $btn.addClass("disabled")
                    .prop("disabled", true)
                    .next(".loading")
                    .show();

                $.ajax({
                    type: "post",
                    url: "/ean/hotel/rooms/",
                    data: params,
                    dataType: "json",
                    headers: { "X-CSRFToken": $.cookie.get("csrftoken") },
                    success: function(json) {
                        var $list = $ov.find(".booking-list"),
                            tpl = $list.find("script").html(),
                            $obj,
                            vars,
                            resp;

                        $list.find(".booking-item").remove();

                        if (!parseInt(json.size)) {
                            if (json.EanWsError && json.EanWsError.presentationMessage) {
                                $btn.prev("p.txt-error")
                                    .show()
                                    .text(json.EanWsError.presentationMessage)
                                    .focus();
                            }
                            return;
                        }

                        $ov.addClass("show-hotel-list")
                            .find("#b-step1 dl")
                            .removeClass("on");

                        if (!$.isArray(json.HotelRoomResponse)) json.HotelRoomResponse = [json.HotelRoomResponse];

                        for (var i = 0; i < json.HotelRoomResponse.length; i++) {
                            resp = json.HotelRoomResponse[i];
                            vars = {
                                roomType: resp.RoomType.description,
                                roomDesc: resp.RoomType.descriptionLong,
                                price: resp.chargeable.total
                            };
                            $(
                                tpl.replace(/##(\w+)##/g, function($0, $1) {
                                    return vars[$1] || "";
                                })
                            )
                                .appendTo($list)
                                .find("button")
                                .attr("rateCode", resp.rateCode)
                                .click(function() {
                                    location.href =
                                        "https://" +
                                        location.host +
                                        "/ean/hotel/book/?hotelId=" +
                                        params.hotelId +
                                        "&arrivalDate=" +
                                        json.arrivalDate +
                                        "&departureDate=" +
                                        json.departureDate +
                                        "&rateCode=" +
                                        this.getAttribute("rateCode") +
                                        "&rooms=" +
                                        params.rooms;
                                });
                        }
                    },
                    complete: function() {
                        $btn.removeClass("disabled")
                            .prop("disabled", false)
                            .next(".loading")
                            .hide();
                    }
                });
            })
            .end()
            .find(".btn-cancel")
            .click(function() {
                $ov.trigger("hide");
            })
            .end();
    })();
    // vanity number overlay
    (function() {
        var $ov = $("._sale-layer");

        // add to cart
        $ov.on("click", ".btn-checkout", function() {
            var number_id = $(this)
                .closest("li")
                .attr("id");
            $.post("/rest-api/v1/things/vanity-number/add-to-cart", { id: number_id }, function(response) {
                if (response) {
                    if (response.error_message) {
                        alert(response.error_message);
                    } else {
                        var params = {
                            payment_gateway: 6,
                            is_vanity: "true"
                        };

                        params.v3 = true;

                        $.ajax({
                            type: "POST",
                            url: "/rest-api/v1/checkout",
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify(params),
                            processData: false,
                            success: function(res) {
                                location.href = "/vanity-number/checkout";
                            },
                            error: function(res) {
                                console.log(res);
                                if (res.responseText) {
                                    var json = JSON.parse(res.responseText);
                                    if (json.error) {
                                        alert(json.error);
                                    }
                                }
                                closePop();
                            }
                        });
                    }
                }
                closePop();
            });
        });
    })();
    // vanity
    $('button.btn-buy').click(function(){
		var $t=$(this);
	        var gplus_exclusive = $t.attr('gplus_exclusive') == 'true';
	        var params = {}
	        if (gplus_exclusive) {
		    params['gex'] = 't';
	        }
		if($t.attr('require_login')) return require_login(params);
		$('#ov-sale').trigger('show');
		return false;
	});

    // hotel
    $("button.btn-book").click(function() {
        $("#ov-hotel").trigger("show");
    });
    // thing image swipe. currently it shows only for hermes
    (function() {
        var $fr = $(".figure .figure-wrap"),
            $p = $(".figure .pagination");

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
    })();
});
