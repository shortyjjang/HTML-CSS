jQuery(function($) {
    $("#subscribe").click(function() {
        var login_require = $(this).attr("require_login");
        if (typeof login_require != undefined && login_require != null && login_require == "true") {
            require_login();
            return false;
        }

        var theform = $("#subscription_form");
        theform.submit();
    });

    $("#content,#sidebar,#popup_container").delegate(".show_cart select[name=option_id]", "change", function(event) {
        event.stopPropagation();
        event.preventDefault();
        var $this = $(this);
        if ($this.attr("require_login") === "true") return require_login();

        var val = $this.val();
        var $selectedOption = $(this).children("option:selected");
        var soldout = $selectedOption.attr("soldout") == "True";
        var $notify = $this.closest(".show_cart").find("button.btn-notify");
        var $btn_cart = $this.closest(".show_cart").find(".add_to_cart");
        var is_waiting = $selectedOption.attr("waiting") == "True";
        if (soldout) {
            $btn_cart.hide();
            $notify.show();
            if (is_waiting) {
                $notify.addClass("subscribed");
                $notify.text(gettext("Subscribed"));
            } else {
                $notify.removeClass("subscribed");
                $notify.text(gettext("Notify me when available"));
            }
        } else {
            $btn_cart.show();
            $notify.hide();
        }

        var remainingQuantity = $this.find("option:selected").attr("remaining-quantity");
        var $qtySelect = $this
            .closest(".show_cart")
            .find("select[name=quantity]")
            .empty();
        if (remainingQuantity > 0) {
            for (var i = 1; i <= Math.min(10, remainingQuantity); i++) {
                $("<option value=" + i + ">" + i + "</option>").appendTo($qtySelect);
            }
            $qtySelect.val(1).trigger("change");
        } else {
            $("<option value=0>0</option>").appendTo($qtySelect);
            $qtySelect.val(0).trigger("change");
        }
        if (soldout) {
            $qtySelect.attr("disabled", "disabled");
        } else {
            $qtySelect.removeAttr("disabled");
        }
    });

    $("#content,#sidebar,#popup_container").delegate(
        ".left_num button.btn-notify, .show_cart button.btn-notify",
        "click",
        function(event) {
            var $this = $(this),
                params,
                url,
                selected;
            event.stopPropagation();
            event.preventDefault();
            var inSearch = $this.is(".left_num button.btn-notify");

            if ($this.attr("require_login") === "true") return require_login();

            url = "/wait_for_product.json";
            params = { sale_item_id: $this.attr("item_id") };
            var option_id = $this
                .closest(".show_cart")
                .find("select[name=option_id]")
                .val();
            if (typeof option_id !== "undefined" && option_id != null && option_id != "") {
                params["option_id"] = option_id;
            }
            var remove = 0;
            if ($this.hasClass("subscribed")) {
                remove = 1;
                params["remove"] = remove;
            }

            $.ajax({
                type: "post",
                url: url,
                data: params,
                dataType: "json",
                success: function(json) {
                    if (!json || json.status_code == undefined) return;
                    if (json.status_code == 1) {
                        if (remove == 1) {
                            $this.removeClass("subscribed").text(gettext("Notify me when available"));
                            if ("option_id" in params) {
                                $this
                                    .closest(".show_cart")
                                    .find("select[name=option_id] option:selected")
                                    .attr("waiting", "False");
                            }
                        } else {
                            if (inSearch) {
                                var $cont = $this.closest(".left_num");
                                $cont.text(gettext("Subscribed"));
                                setTimeout(function() {
                                    $cont.remove();
                                }, 1000);
                            } else {
                                $this.addClass("subscribed").text(gettext("Subscribed"));
                                $this
                                    .closest(".show_cart")
                                    .find("select[name=option_id] option:selected")
                                    .attr("waiting", "True");
                            }
                        }
                    } else if (json.status_code == 0 && json.message) {
                        alertify.alert(json.message);
                    }
                }
            });
        }
    );

    $("#content,#sidebar,#popup_container,#slideshow").delegate("#add_to_cart,.add_to_cart", "click", function(event) {
        event.preventDefault();
        if ($(this).closest("#overlay-thing").length > 0) {
            return;
        }
        if ($(this).hasClass("soldout")) {
            return;
        }
        if ($(this).attr("id") == "fancy-g-link") {
            return true;
        }

        var $this = $(this),
            login_require = false; //$this.attr('require_login');

        var param = {},
            i,
            c,
            q,
            prefix;
        var is_fancybox = $this.attr("stype") == "fancybox";

        param["seller_id"] = $this.attr("sisi");
        param["quantity"] = 1;
        param["thing_id"] = $this.attr("tid");

        prefix = $this.attr("prefix") || "";
        if (prefix) prefix += "-";

        if (is_fancybox) {
            var $frm = $(this).parents(".frm");
            var has_categories = $this.attr("has_categories") == "true";
            var allow_multiple = $(this).attr("allow_multiple") == "true";
            var categories = [];
            var note = $frm.find("textarea[id=note]").val();
            if (has_categories) {
                $frm.find(".fancybox-category input[name=categories]:checked").each(function() {
                    categories.push($(this).val());
                });
                if (categories.length != 3) {
                    alert(gettext("Please choose three categories."));
                    return false;
                }
            }
            param["sale_item_id"] = $frm.find("select[name=sale_item_id]").val();
            param["categories"] = categories.join(",");
            param["is_fancybox"] = is_fancybox;
            param["allow_multiple"] = allow_multiple;
            if (note) {
                param["note"] = note.trim();
            }
        } else {
            // quantity
            q = parseInt($("#" + prefix + "quantity").val());
            if (isNaN(q) || q <= 0) return alert(gettext("Please select a valid quantity."));
            param["quantity"] = q;

            // option
            if ($("#" + prefix + "option_id").length) {
                var option_id = parseInt($("#" + prefix + "option_id").val());
                if (!isNaN(option_id)) param["option_id"] = option_id;
            }
            if ($("#" + prefix + "personalization").length) {
                var personalization = $("#" + prefix + "personalization").val();
                param["personalization"] = personalization;
            }
            param["sale_item_id"] = $this.attr("sii");
        }

        var mixpanel_param = { "sale id": param["sale_item_id"] };
        try {
            if ("option_id" in param) mixpanel_param["option id"] = param["option_id"];
            if ($this.attr("via")) mixpanel_param["via"] = $this.attr("via");
            if ($this.attr("section")) mixpanel_param.section = $this.attr("section");
            if ($this.attr("utm")) mixpanel_param.utm = $this.attr("utm");
        } catch (e) {}

        if (typeof login_require != undefined && login_require != null && login_require == "true") {
            param["mixpanel"] = mixpanel_param;
            $.jStorage.set("fancy_add_to_cart", param);
            $.dialog("popup.sign.signup").open();
            return;
        }

        if ($this.hasClass("loading")) return;
        $this.addClass("loading");

        param.from_sds_page = window.from_sds_page;
        try {
            track_event("Add to Cart", mixpanel_param);
        } catch (e) {}
        if (typeof dataLayer != "undefined" && dataLayer) {
            dataLayer.push({
                event: "Add_to_Cart_Button",
                product_id: param["sale_item_id"],
                products: undefined,
                products_info: undefined,
                revenue: undefined,
                option_id: param["option_id"]
            });
        }

        $.ajax({
            type: "POST",
            url: "/add_item_to_cart.json",
            data: param,
            success: function(json) {
                if (!json || json.status_code == undefined) return;
                if (json.status_code == 1) {
                    var args = {
                        THING_ID: $this.attr("tid"),
                        ITEMCODE: json.itemcode,
                        THUMBNAIL_IMAGE_URL: json.image_url,
                        ITEMNAME: json.itemname,
                        QUANTITY: json.quantity,
                        PRICE: json.price,
                        OPTIONS: json.option,
                        HTML_URL: json.html_url,
                        CART_ID: json.cart_id
                    };
                    if (json.fancy_price) args["FANCY_PRICE"] = json.fancy_price;
                    if ($this.attr("goto_cart")) {
                        location.href = "/cart";
                        return;
                    }
                    if ($.dialog("things-v3").showing()) {
                        $.dialog("things-v3").close();
                    }
                    if (is_fancybox) {
                        Fancy.Cart.addItem(args);
                        $("textarea#note").val("");
                        $(".fancybox-category input[name=categories]:checked").prop("checked", false);
                    } else {
                        Fancy.Cart.addItem(args);
                    }
                    $this
                        .closest(".show_cart.opened")
                        .removeClass("opened")
                        .closest("li.active")
                        .removeClass("active");
                    if ($("#slideshow").is(":visible")) {
                        $("#slideshow")
                            .find("p.alert-cart")
                            .find("b")
                            .text(json.itemname)
                            .end()
                            .slideDown(250);
                        setTimeout(function() {
                            $("#slideshow")
                                .find("p.alert-cart")
                                .slideUp(250);
                        }, 3000);
                    } else {
                        Fancy.Cart.openPopup();
                    }
                    window.TrackingEvents.addToCart([{
                        id: param.sale_item_id,
                        name: json.itemname,
                        quantity: json.quantity,
                        price: json.price,
                        variant: json.option,
                    }]);
                } else if (json.status_code == 0) {
                    if (json.message) alert(json.message);
                }
            },
            complete: function() {
                $this.removeClass("loading");
            }
        });
    });

    var $btnAddToCart = $(".add_to_cart");
    var login_require = $btnAddToCart.attr("require_login");

    if (typeof login_require == "undefined") {
        var param = $.jStorage.get("fancy_add_to_cart", null);
        if (param) {
            param.from_sds_page = window.from_sds_page;
            try {
                if ("mixpanel" in param) {
                    var mixpanel_param = param["mixpanel"];
                    track_event("Add to Cart", mixpanel_param);
                }
            } catch (e) {}
            $.ajax({
                type: "POST",
                url: "/add_item_to_cart.json",
                data: param,
                success: function(json) {
                    if (!json || json.status_code == undefined) return;
                    if (json.status_code == 1) {
                        var args = {
                            THING_ID: param["thing_id"],
                            ITEMCODE: json.itemcode,
                            THUMBNAIL_IMAGE_URL: json.image_url,
                            ITEMNAME: json.itemname,
                            QUANTITY: json.quantity,
                            PRICE: json.price,
                            OPTIONS: json.option,
                            CART_ID: json.cart_id
                        };
                        Fancy.Cart.addItem(args);
                        Fancy.Cart.openPopup();
                        window.TrackingEvents.addToCart(json.quantity, json.itemname, param.sale_item_id, json.price, (Number(json.price) * Number(json.quantity)) || 0);
                    } else if (json.status_code == 0) {
                        if (json.message) alert(json.message);
                    }
                },
                complete: function() {
                    $.jStorage.deleteKey("fancy_add_to_cart");
                }
            });
        }
    }

    $(document).delegate(".same-delivery .same-day-shipping-pop", "click", function() {
        var login_require = $(this).attr("require_login");
        if (typeof login_require != undefined && login_require != null && login_require == "true") {
            require_login();
            return false;
        }

        var old_dlg_class = $("#popup_container").attr("class");
        function close_delivery() {
            if (old_dlg_class) $.dialog(old_dlg_class).open();
            else $.dialog("delivery-popup").close();
        }

        $.dialog("delivery-popup")
            .open()
            .$obj.on("click", ".ly-close", function(e) {
                close_delivery();
                e.preventDefault();
                e.stopPropagation();
            });
    });

    $(document).delegate(".delivery-popup .check-same-day-shipping", "click", function() {
        var sale_item_id = $(this)
            .parents(".delivery-popup")
            .attr("si-id");
        var country_code = $(this)
            .parents(".delivery-popup")
            .find("select.same-day-country-select option:selected")
            .val();
        var zip = $(this)
            .parents(".delivery-popup")
            .find("input.zipcode")
            .val()
            .trim();
        $(".delivery-popup p.comment").remove();
        $(".delivery-popup p.notify-delivery").remove();
        var param = { zipcode: zip, sale_item_id: sale_item_id, country_code: country_code };

        if (zip.length > 0) {
            $.post(
                "/check-same-day-eligibility.json",
                param,
                function(response) {
                    if (response.status_code != undefined && response.status_code == 1) {
                        $(".delivery-popup fieldset").before(
                            '<p class="notify-delivery success"><i class="check"></i> <b>Good news!</b> Your address is eligible for Same-Day Delivery.</p>'
                        );
                    } else if (response.status_code != undefined && response.status_code == 2) {
                        $(".delivery-popup fieldset").before(
                            '<p class="notify-delivery"><i class="not"></i> ' +
                                "<b>Hang tight, we're almost there!</b> Unfortunately same-day delivery is not currently available in your area, but we're expanding rapidly.</p>"
                        );
                    } else if (response.status_code != undefined && response.status_code == 3) {
                        $(".delivery-popup fieldset").before(
                            '<p class="notify-delivery"><i class="not"></i> ' + "We support overnight delivery!</p>"
                        );
                    } else if (response.status_code != undefined && response.status_code == 4) {
                        $(".delivery-popup fieldset").before(
                            '<p class="notify-delivery"><i class="not"></i> ' + "We support expedited shipping!</p>"
                        );
                    } else if (response.status_code != undefined && response.status_code == 0) {
                        if (response.message != undefined) alert(response.message);
                    }
                },
                "json"
            );
        } else {
            alertify.alert("Please enter your zipcode.");
        }
        return false;
    });
    $(document)
        .on("click", ".show_cart .btn-cart", function(event) {
            var $this = $(this);
            event.preventDefault();
            var $show_cart = $(this).closest(".show_cart");
            if ($show_cart.find("em").length) {
                if (
                    $show_cart.find("select[name=option_id] option").length > 1 ||
                    $show_cart.find(".personalization").length ||
                    !!$show_cart.find("button.add_to_cart").attr("style")
                ) {
                    $(this)
                        .closest("li")
                        .addClass("active")
                        .find(".opened")
                        .removeClass("opened")
                        .end()
                        .find(".show_cart")
                        .addClass("opened");

                    var header_top = $("#header").height() + 142;
                    if ($("#header_summary").hasClass("show")) {
                        header_top = header_top + $("#header_summary").height();
                    }

                    if ($this.offset().top - $(window).scrollTop() < header_top) {
                        $this
                            .closest("li")
                            .find(".sale-item-input")
                            .addClass("bot");
                    } else {
                        $this
                            .closest("li")
                            .find(".sale-item-input")
                            .removeClass("bot");
                    }
                } else {
                    $(this)
                        .closest(".show_cart")
                        .find(".add_to_cart")
                        .click();
                }
                $show_cart.trigger("mixpanel");
            } else {
                $(this)
                    .closest(".show_cart")
                    .data("click", true);
            }
        })
        .on("click", ".show_cart .trick", function(event) {
            event.preventDefault();
            var $li = $(this).closest("li");
            if (event.data && event.data.cleanup) {
            } else {
                $li.removeClass("active");
            }
            $li.find(".opened").removeClass("opened");
            $li.find(".sale-item-input").removeClass("bot");
        })
        .on("mixpanel", ".show_cart", function(event) {
            var $this = $(this),
                $add_to_cart = $this.closest(".show_cart").find(".add_to_cart");
            var param = {
                "thing id": $add_to_cart.attr("tid"),
                "sale id": $add_to_cart.attr("sii"),
                via: $add_to_cart.attr("via")
            };
            if ($add_to_cart.attr("section")) param.section = $add_to_cart.attr("section");
            if ($add_to_cart.attr("utm")) param.utm = $add_to_cart.attr("utm");

            if ($this.find("select[name=option_id]").length || !!$this.find("button.add_to_cart").attr("style")) {
                param["option popup"] = true;
            } else {
                param["option popup"] = false;
            }
            try {
                track_event("Buy", param);
            } catch (e) {
                console.log(e);
            }
        });
});
