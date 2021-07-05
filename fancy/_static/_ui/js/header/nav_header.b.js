if (!window.Fancy) window.Fancy = {};

// top menu bar
jQuery(function($) {
    var $nav = $("#navigation"),
        $cur = null,
        cur_len = 0,
        timer,
        sc,
        $container = $(".container:visible"),
        $submenu = $(".submenu");
    var delay = 200;

    clearTimeout(timer);

    $("#header .trick")
        .css("top", $("#header").height() + "px")
        .on("click", function(e) {
            if (
                $(this)
                    .closest(".gnb-wrap")
                    .hasClass("right")
            ) {
                e.preventDefault();
                var $this = $(this);
                clearTimeout(timer);

                $("html").trigger("unlockScroll");
                $this
                    .closest(".gnb")
                    .removeClass("active")
                    .removeClass("open")
                    .removeClass("hover")
                    .end();
                $nav.find(".search")
                    .removeClass("focus")
                    .find("input")
                    .val("");
                timer = setTimeout(function() {
                    $nav.find('[class^="menu-contain"], [class^="feed-"]').removeClass("show");
                    $("html").removeClass("hover");
                }, 100);
            } else {
                e.preventDefault();
                var $this = $(this);
                clearTimeout(timer);

                $submenu.find(".submenu-dropdown").css("height", "0");
                timer = setTimeout(function() {
                    $submenu
                        .removeClass("show")
                        .find("li.gnb")
                        .removeClass("hover");
                }, 200);
            }
        })
        .on("focus mouseover", function(e) {
            if (
                $(this)
                    .closest(".gnb-wrap")
                    .hasClass("right")
            )
                return;

            e.preventDefault();
            var $this = $(this);
            clearTimeout(timer);

            $submenu.find(".submenu-dropdown").css("height", "0");
            timer = setTimeout(function() {
                $submenu
                    .removeClass("show")
                    .find("li.gnb")
                    .removeClass("hover");
            }, 200);
        });

    if ($nav.hasClass("hover_submenu")) {
        delay = 0;
        $nav.on("click", ".gnb > .mn-you, .gnb > .mn-seller, .gnb > .mn-msg", function(e) {
            e.preventDefault();
            var $this = $(this);
            clearTimeout(timer);
            $this
                .closest("li.gnb")
                .find(".trick")
                .css("top", $("#header").height() - $("#header .submenu").height() + "px");

			$('#header').removeClass('open');
            if ($this.closest("li.gnb").is(".active")) {
                $this
                    .closest("li.gnb")
                    .find(".trick")
                    .click();
                return;
            }

            if (
                $(this)
                    .closest("li.gnb")
                    .hasClass("active")
            ) {
                $("html").trigger("unlockScroll");
                $(this)
                    .closest("#navigation")
                    .find(".gnb")
                    .removeClass("active");
                $nav.find('[class^="menu-contain"], [class^="feed-"]').removeClass("show");
                $("html").removeClass("hover");
            } else {
                if ($("html").hasClass("fixed") && $nav.find(".search").hasClass("focus")) {
                    $nav.find(".search")
                        .removeClass("focus")
                        .find("input")
                        .val("");
                    $nav.find(".search")
                        .find(".trick")
                        .removeAttr("style");
                }
            }

            timer = setTimeout(function() {
                $("html").trigger("lockScroll");
                $this
                    .closest("#navigation")
                    .find(".gnb")
                    .removeClass("active")
                    .end()
                    .end()
                    .closest("li.gnb")
                    .addClass("active");
            }, delay);

            return false;
        })
		.on("mouseover", ".gnb > .mn-you", function() {
			$(".menu-contain-you")
				.find(".menu-container-you")
				.height($(".menu-contain-you .you-main").height());
		})
		.on("click", ".menu-contain-seller .multiple-index a.store", function() {
			var $this = $(this),
				$store = $this.closest(".menu-contain-seller").find(".multiple-store");
			$store
				.children("div")
				.css("display", "none")
				.eq($this.index())
				.css("display", "");
			$this
				.closest(".menu-contain-seller")
				.addClass("details")
				.height($store.height());
			return false;
		})
		.on("click", ".menu-contain-seller .multiple-store a.back", function() {
			$(this)
				.closest(".menu-contain-seller")
				.removeClass("details")
				.height(
					$(this)
						.closest(".menu-contain-seller")
						.find(".multiple-index")
						.height()
				);
			return false;
		});
    }

    $nav.on("click", ".logo, .logo a", function() {
        if ($("body").hasClass("home")) {
            $(window).scrollTop(0);
            return false;
        }
    })
        .find("li > a")
        .each(function() {
            var $this = $(this),
                path = $this.attr("href");
            if (path == "/" || path == "#") return;
            if (location.pathname.indexOf(path) == 0 && path.length > cur_len) {
                $cur = $this;
                cur_len = path.length;
            }
        })
        .on("touchstart", "a[href]", function() {
            var $this = $(this),
                path = $this.attr("href");
            if (path == "/" || path == "#" || $this.next("div")[0]) return;
            location.href = path;
        });
    if ($cur) $cur.addClass("current");

    $submenu
        .find(".submenu-dropdown").css("height", "0").end()
        .on("mouseover focus", "li.gnb > a, li.gnb > em", function(e) {
            $this = $(this);
            clearTimeout(timer);
            if ($(window).width() < 760) return;
			if('ontouchstart' in document.documentElement) return;

            $this
                .closest("li.gnb")
                .find(".trick")
                .css("top", $("#header").height() + "px");
            $nav.find("li.gnb").removeClass("active");
            if (!$submenu.hasClass("show")) {
                timer = setTimeout(function() {
                    $submenu.addClass("show");
                    $this
                        .closest("li.gnb")
                        .find(".submenu-dropdown")
                        .height(
                            $this
                                .closest("li.gnb")
                                .find(".submenu-dropdown .inner")
                                .outerHeight()
                        );
                    $this
                        .closest("ul")
                        .find(".gnb")
                        .removeClass("hover")
                        .end()
                        .end()
                        .closest("li.gnb")
                        .addClass("hover");
                }, 200);
            } else {
                $submenu.find(".submenu-dropdown").css("height", "auto");
                $this
                    .closest("ul")
                    .find(".gnb")
                    .removeClass("hover")
                    .end()
                    .end()
                    .closest("li.gnb")
                    .addClass("hover");
            }
        })
        .on("click", "li > a, li > em", function(e) {
			if('ontouchstart' in document.documentElement || $(window).width() < 761) {
				if ($(this).closest(".gnb").find(".submenu-dropdown").length > 0 || $(this).closest("li").find("> ul").length > 0 || $(this).closest("li").find("> small").length > 0) {
					if ($(this).closest("li").hasClass("hover")) {
						$(this).closest("ul").find("> li").removeClass("hover");
					} else {
						$(this).closest("ul").find("> li").removeClass("hover").end().end().closest("li").addClass("hover");
					}
					return false;
				}else {
					return;
				}
			}
        })
        .on("mouseleave", "li.gnb", function() {
            $this = $(this);
            clearTimeout(timer);
            if ($(window).width() < 760) return;
			if('ontouchstart' in document.documentElement) return;

            $submenu.find(".submenu-dropdown").css("height", "0");
            timer = setTimeout(function() {
                $submenu
                    .removeClass("show")
                    .find("li.gnb")
                    .removeClass("hover");
            }, 200);
        })
        .find("li > a")
        .each(function() {
            var $this = $(this),
                path = $this.attr("href");
            if (path == "/" || path == "#") return;
            if (location.pathname.indexOf(path) == 0 && path.length > cur_len) {
                $cur = $this;
                cur_len = path.length;
            }
        });
    $("#header .prompt-inbox a.close").click(function(event) {
        event.preventDefault();
        $("#header .prompt-inbox").hide();
        $.post("/header_notification_as_read.json", { messages_past_a_day_for_merchant: true }, function(data) {});
    });
    $("#header .prompt-inbox a.view").click(function(event) {
        $("#header .prompt-inbox").hide();
        $.post("/header_notification_as_read.json", { messages_past_a_day_for_merchant: true }, function(data) {});
        return true;
    });

    $(".switch-region").on("click", ".set-region", function() {
        $.dialog("change_region").open();
        return false;
    });

    $.dialog("change_region")
        .$obj.on("click", ".btns-blue-embo", function() {
            var selectedRegion = $(".popup.change_region select.regions").val();
            if (selectedRegion === "us") {
                $(".switch-region .set-region")
                    .addClass("us")
                    .removeClass("intl");
            } else {
                $(".switch-region .set-region")
                    .removeClass("us")
                    .addClass("intl");
            }
            $.cookie.set("region", selectedRegion);

            var selectedCurrency = $(".popup.change_region select.currencies").val();
            $.ajax({
                type: "POST",
                url: "/set_my_currency.json",
                data: { currency_code: selectedCurrency }
            }).then(function() {
                $(".switch-region .set-region").text(selectedCurrency);
            });
            $.dialog("change_region").close();
        })
        .on("open", function() {
            var $el = $(this);
            var $regions = $el.find(".regions");
            $regions.val($regions.data("value"));
            var $currencyList = $el.find(".currencies");
            if (!$currencyList.data("loaded")) {
                $el.find(".btns-blue-embo").prop("disabled", true);
                $.get("/get_all_currencies.json").then(function(res) {
                    res.currencies.forEach(function(currency) {
						if (currency.country == 'United States') {
							currency.country = 'US';
						}
                        var txt = currency.country + " (" + currency.code + ")";
                        $currencyList.append($("<option value=" + currency.code + ">" + txt + "</option>"));
                    });
                    $el.find(".btns-blue-embo").prop("disabled", false);
                    $currencyList.data("loaded", true);
                    $currencyList.val($currencyList.data("current-currency"));
                });
            }
        });

    Fancy.ActivitiesPreview = {
        $sensor: $(".mn-noti").parent(),
        $pulldown: $(".mn-noti")
            .parent()
            .find(".feed-activity"),
        $tab: $(".mn-noti")
            .parent()
            .find(".feed-activity > h4 > a"),
        $activityloading: $(".mn-noti")
            .parent()
            .find(".feed-activity > .feed.activity .loading"),
        $activitylist: $(".mn-noti")
            .parent()
            .find(".feed-activity > .feed.activity > ul"),
        $activityempty: $(".mn-noti")
            .parent()
            .find(".feed-activity > .feed.activity > div.empty"),
        $activitymore: $(".mn-noti")
            .parent()
            .find(".feed-activity > .feed.activity > .more"),
        $notificationloading: $(".mn-noti")
            .parent()
            .find(".feed-activity > .feed.notifications .loading"),
        $notificationlist: $(".mn-noti")
            .parent()
            .find(".feed-activity > .feed.notifications > ul"),
        $notificationempty: $(".mn-noti")
            .parent()
            .find(".feed-activity > .feed.notifications > div.empty"),
        $notificationmore: $(".mn-noti")
            .parent()
            .find(".feed-activity > .feed.notifications > .more"),
        $template: $(".mn-noti")
            .parent()
            .find(".feed-activity > .feed.notifications script[type='fancy/template']"),
        pulldownCloseTimer: null,
        loaded: false,
        init: function() {
            var preview = this;
            this.$sensor
                .mouseenter(function(e) {
                    clearTimeout(preview.pulldownCloseTimer);
                    preview.openPulldown();
                })
                .mouseleave(function(e) {
                    preview.pulldownCloseTimer = setTimeout(function() {
                        preview.closePulldown();
                    }, 100);
                });
            this.$tab.click(function(e) {
                e.preventDefault();
                preview.$tab.removeClass("current");
                $(this).addClass("current");
                preview.$pulldown.find(".feed").hide();
                if ($(this).attr("tab") == "activity") {
                    preview.$pulldown.find(".feed.activity").show();
                } else if ($(this).attr("tab") == "messages") {
                    preview.$pulldown.find(".feed.messages").show();
                    if ($(this).hasClass("new")) {
                        $.post("/header_notification_as_read.json", { messages: true }, function(data) {});
                        $(this).removeClass("new");
                        $(".feed-inbox.prompt-cs").hide();
                        if (!$(".feed-activity h4 a.new").length)
                            $(this)
                                .closest("li.gnb")
                                .find("a.mn-noti")
                                .addClass("none");
                    }
                } else {
                    preview.$pulldown.find(".feed.notifications").show();
                    if ($(this).hasClass("new")) {
                        $.post("/header_notification_as_read.json", { notifications: true }, function(data) {});
                        $(this).removeClass("new");
                        $(".feed-inbox.prompt-cs").hide();
                        if (!$(".feed-activity h4 a.new").length)
                            $(this)
                                .closest("li.gnb")
                                .find("a.mn-noti")
                                .addClass("none");
                    }
                }
            });
            this.$pulldown.hide();
            this.$activityloading.hide();
            this.$notificationloading.hide();

            var calling = false;
            var isLast = false;
            this.$activitylist.scroll(function(e) {
                if (calling || isLast) return;
                var $list = preview.$activitylist;
                var scrollTop = $list.scrollTop();
                var scrollHeight = $list[0].scrollHeight;
                if (scrollTop > scrollHeight - $list.height() - 400) {
                    var aid = $list.find("li[data-aid]:last").attr("data-aid");
                    calling = true;
                    $.get("/recent_activity_feed.json", { cursor: aid }, function(data) {
                        if (!data) isLast = true;
                        var lastTimeSince = preview.$activitylist
                            .find("li[data-timesince]:last")
                            .attr("data-timesince");
                        preview.$activitylist.append(data);
                        preview.$activitylist
                            .find("li[data-timesince='" + lastTimeSince + "']")
                            .not(":first")
                            .remove();
                    }).always(function() {
                        calling = false;
                    });
                }
            });
        },
        openPulldown: function() {
            var preview = this;
            var maxFetch = 20;
            var maxShow = 4;
            this.$sensor.addClass("open");
            this.$pulldown.show();

            if (!this.loaded) {
                this.loaded = true;
                this.$activityloading.show();
                this.$notificationloading.show();

                $.getJSON(
                    "/notifications.json",
                    { count: maxFetch, lang: window.CURRENT_LANGCODE || "en", thumbnail: 82 },
                    function(data) {
                        preview.$notificationlist.empty();
                        if (data.response.notifications.length > maxShow) {
                            data.response.notifications = data.response.notifications.slice(0, maxShow);
                        }
                        var now = new Date();
                        var today = $.datepicker.formatDate("yy-mm-dd", now);
                        var yesterday = $.datepicker.formatDate("yy-mm-dd", new Date(now.setDate(now.getDate() + 1)));
                        var prev_date = null;
                        for (i in data.response.notifications) {
                            var item = data.response.notifications[i];
                            var $li = $("<li>");
                            var text = item.text;
                            var date = $.datepicker.formatDate(
                                "yy-mm-dd",
                                $.datepicker.parseDate("yy-mm-dd", item.date_created)
                            );
                            if (!prev_date || prev_date != date) {
                                var str = "";
                                if (date == today) str = "Today";
                                else if (date == yesterday) str = "Yesterday";
                                else
                                    str = $.datepicker.formatDate(
                                        "dd MM",
                                        $.datepicker.parseDate("yy-mm-dd", item.date_created)
                                    );

                                preview.$notificationlist.append("<li class='date-divider'>" + str + "</li>");
                            }
                            prev_date = date;

                            if (item.entities.user) {
                                var user = item.entities.user;
                                $li.append(
                                    '<a href="/' +
                                        user.username +
                                        '"><img src="' +
                                        user.image_url.replace(/http[s]?:/i, "") +
                                        '" class="photo"></a>'
                                );
                                text = text.replace(
                                    (user.fullname || user.username) + " ",
                                    "<a href='/" +
                                        user.username +
                                        "' class='username'>" +
                                        (user.fullname || user.username) +
                                        "</a> "
                                );
                            } else if (item.type == "featured") {
                                var thing = item.entities.thing;
                                $li.append(
                                    "<a href='" +
                                        thing.url +
                                        "'><img src='/_ui/images/common/blank.gif' class='photo featured'></a>"
                                );
                                text = text.replace(thing.name, "<a href='" + thing.url + "'>" + thing.name + "</a>");
                            } else if (item.type == "order_shipped") {
                                $li.append(
                                    "<a href='/purchases/" +
                                        item.entities.order.order_id +
                                        "'><img src='/_ui/images/common/blank.gif' class='photo ship'></a>"
                                );
                                text = text.replace(
                                    "#" + item.entities.order.order_id,
                                    "<a href='/purchases/" +
                                        item.entities.order.order_id +
                                        "' class='full_link'>#" +
                                        item.entities.order.order_id +
                                        "</a>"
                                );
                            }

                            if (item.entities.thing) {
                                var thing = item.entities.thing;
                                $li.append(
                                    '<a href="' +
                                        thing.url +
                                        '"><img src="' +
                                        (thing.thumb_image_url || "").replace(/http[s]?:/i, "") +
                                        '" class="thing"></a>'
                                );
                                text = text.replace(thing.name, "<a href='" + thing.url + "'>" + thing.name + "</a>");
                            } else if (item.entities.deal) {
                                var deal = item.entities.deal;
                                $li.append(
                                    '<a href="' +
                                        deal.url +
                                        '"><img src="' +
                                        deal.image_url.replace(/http[s]?:/i, "") +
                                        '" class="thing"></a>'
                                );
                            } else if (item.entities.store) {
                                var store = item.entities.store;
                                $li.append(
                                    '<a href="/brands-stores/' +
                                        store.name +
                                        '"><img src="' +
                                        store.image_url.replace(/http[s]?:/i, "") +
                                        '" class="thing"></a>'
                                );
                            } else if (item.entities.user2) {
                                var user = item.entities.user2;
                                $li.append(
                                    '<a href="/' +
                                        user.username +
                                        '"><img src="' +
                                        user.image_url.replace(/http[s]?:/i, "") +
                                        '" class="thing"></a>'
                                );
                                text = text.replace(
                                    (user.fullname || user.username) + " ",
                                    "<a href='/" +
                                        user.username +
                                        "'> class='username'" +
                                        (user.fullname || user.username) +
                                        "</a> "
                                );
                            } else if (item.image_url_120) {
                                $li.append(
                                    '<a href="/help/promotions"><img src="' +
                                        item.image_url_120.replace(/http[s]?:/i, "") +
                                        '" class="thing"></a>'
                                );
                            }

                            if (item.entities.livechat) {
                                var livechat = item.entities.livechat;
                                text = text.replace(
                                    "Live Chat",
                                    "<a href='" + livechat.url + "' class='username'>Live Chat</a>"
                                );
                                text = text.replace(
                                    "live chat",
                                    "<a href='" + livechat.url + "' class='username'>live chat</a>"
                                );
                            }

                            $li.append('<span class="noti-wrap">' + text + "</span>");
                            preview.$notificationlist.append($li);
                        }
                        if (!data.response.notifications.length && preview.$notificationempty[0]) {
                            preview.$notificationempty.show();
                            preview.$notificationlist.hide();
                        } else {
                            preview.$notificationmore.show();
                        }
                    }
                )
                    .always(function() {
                        preview.$notificationloading.hide();
                    })
                    .fail(function() {
                        preview.loaded = false;
                    });

                $.get("/recent_activity_feed.json", {}, function(data) {
                    preview.$activitylist.empty();
                    preview.$activitylist.html(data);

                    if (!preview.$activitylist.find("li").length && preview.$activityempty[0]) {
                        preview.$activityempty.show();
                        preview.$activitylist.hide();
                    } else {
                        preview.$activitymore.show();
                    }
                })
                    .always(function() {
                        preview.$activityloading.hide();
                    })
                    .fail(function() {
                        preview.loaded = false;
                    });
            }
        },
        closePulldown: function() {
            this.$pulldown.hide();
            this.$sensor.removeClass("open");
        }
    };

    Fancy.MessagesPreview = {
        $sensor: $(".mn-msg").parent(),
        $tab: $(".mn-msg")
            .parent()
            .find(".feed-activity > h4 > a"),
        $pulldown: $(".mn-msg")
            .parent()
            .find(".feed-activity"),
        $messageloading: $(".mn-msg")
            .parent()
            .find(".feed-activity > .feed.messages .loading"),
        $messageempty: $(".mn-msg")
            .parent()
            .find(".feed-activity > .feed.messages > div.empty"),
        $messagelist: $(".mn-msg")
            .parent()
            .find(".feed-activity > .feed.messages > ul"),
        $messagemore: $(".mn-msg")
            .parent()
            .find(".feed-activity > .feed.messages > .more"),
        $messagetemplate: $(".mn-msg")
            .parent()
            .find(".feed-activity > .feed.messages script[type='fancy/template']"),
        $newslettersloading: $(".mn-msg")
            .parent()
            .find(".feed-activity > .feed.newsletter .loading"),
        $newsletterslist: $(".mn-msg")
            .parent()
            .find(".feed-activity > .feed.newsletter > ul"),
        $newslettersempty: $(".mn-msg")
            .parent()
            .find(".feed-activity > .feed.newsletter > div.empty"),
        $newslettersmore: $(".mn-msg")
            .parent()
            .find(".feed-activity > .feed.newsletter > .more"),

        pulldownCloseTimer: null,
        loaded: false,
        init: function() {
            var preview = this;
            this.$sensor
                .mouseenter(function(e) {
                    clearTimeout(preview.pulldownCloseTimer);
                    preview.openPulldown();
                })
                .mouseleave(function(e) {
                    preview.pulldownCloseTimer = setTimeout(function() {
                        preview.closePulldown();
                    }, 100);
                });

            this.$tab.click(function(e) {
                e.preventDefault();
                preview.$tab.removeClass("current");
                $(this).addClass("current");
                preview.$pulldown.find(".feed").hide();
                if ($(this).attr("tab") == "messages") {
                    preview.$pulldown.find(".feed.messages").show();
                } else if ($(this).attr("tab") == "newsletter") {
                    preview.$pulldown.find(".feed.newsletter").show();
                }
            });

            this.$pulldown.hide();
            this.$messageloading.hide();
            this.$messageempty.hide();
            this.$newslettersloading.hide();
            this.$newslettersempty.hide();
        },
        openPulldown: function() {
            var preview = this;
            var maxFetch = 20;
            var maxShow = 4;
            this.$sensor.addClass("open");
            this.$pulldown.show();

            if (!this.loaded) {
                this.loaded = true;
                this.$messageloading.show();
                this.$messageempty.hide();
                this.$newslettersloading.show();
                this.$newslettersempty.hide();
                var storeOnly = typeof isStoreOnly != "undefined" && isStoreOnly;

                $.getJSON("/messages/retrieve-threads.json", { archived: false }, function(data) {
                    preview.$messagelist.empty();

                    var threads = data.threads;
                    var validThreads = [];
                    $(threads).each(function() {
                        if (!storeOnly || this.am_i_store) validThreads.push(this);
                    });

                    for (i in validThreads) {
                        var item = validThreads[i];
                        if (!item.last_message) continue;

                        var $li = $(preview.$messagetemplate.html());
                        var member = item.members[0];
                        var isSellerThread = !!member.seller;

                        $li.attr("thread-id", item.id).attr("following", item.following);
                        $li.find("img")
                            .css(
                                "background-image",
                                "url('" +
                                    ((isSellerThread ? member.seller.logo_image : member.image_url) || "").replace(
                                        /http[s]?:/i,
                                        ""
                                    ) +
                                    "')"
                            )
                            .end()
                            .find("b.username")
                            .html(
                                item.is_admin_thread
                                    ? "Fancy"
                                    : isSellerThread
                                    ? member.seller.brand_name
                                    : member.fullname || member.username
                            )
                            .end()
                            .find("span.message")
                            .html(item.last_message.message)
                            .end()
                            .find(".status .date")
                            .html(item.last_message.sent_since)
                            .end()
                            .find("a")
                            .attr("href", (storeOnly ? "/merchant" : "") + "/messages/" + item.id)
                            .end();

                        if (isSellerThread) {
                            $li.addClass("store")
                                .find("b.username")
                                .addClass("store");
                        }
                        if (item.am_i_store) {
                            $li.find("b.username").addClass("store");
                        }

                        if (item.last_message.attachments.length) {
                            if (item.last_message.attachments[0].name.match(/\.(?:png|jpg|jpeg|gif)$/i)) {
                                $li.find("span.message").html($li.find("span.message").html() + "(Image)");
                            } else {
                                $li.find("span.message").html($li.find("span.message").html() + "(Attachment)");
                            }
                        }

                        if (item.last_message.things && item.last_message.things.length) {
                            $li.find("span.message").html(item.last_message.things[0].name);
                        }

                        if (item.unread_count > 0) {
                            $li.find(".new")
                                .show()
                                .end()
                                .addClass("unread");
                            $li.addClass("show");
                        } else if (item.last_message.from.id != member.id) {
                            $li.find("span.message").html("You: " + $li.find("span.message").html());
                        }

                        preview.$messagelist.append($li);
                    }
                    if (!preview.$messagelist.find("li").length) {
                        preview.$messageempty.show();
                        preview.$messagelist.hide();
                        preview.$messagemore.hide();
                    } else {
                        preview.$messageempty.hide();
                        preview.$messagelist.show();
                        preview.$messagemore.show();
                    }
                })
                    .always(function() {
                        preview.$messageloading.hide();
                    })
                    .fail(function() {
                        preview.loaded = false;
                    });

                $.get("/newsletters?header", {}, function(data) {
                    preview.$newsletterslist.empty();
                    preview.$newsletterslist.html(data);

                    if (!preview.$newsletterslist.find("li").length && preview.$newslettersempty[0]) {
                        preview.$newslettersempty.show();
                        preview.$newslettersmore.hide();
                        preview.$newsletterslist.hide();
                    } else {
                        preview.$newslettersempty.hide();
                        preview.$newslettersmore.show();
                        preview.$newsletterslist.show();
                    }
                })
                    .always(function() {
                        preview.$newslettersloading.hide();
                    })
                    .fail(function() {
                        preview.loaded = false;
                    });
            }
        },
        closePulldown: function() {
            this.$pulldown.hide();
            this.$sensor.removeClass("open");
        }
    };
});

$(function() {
    //Fancy.ActivitiesPreview.init();
    Fancy.MessagesPreview.init();
});
