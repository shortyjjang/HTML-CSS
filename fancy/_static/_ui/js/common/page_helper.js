// filter
$("#filter").each(function() {
    var filter = $(this);
    filter
        .find("h3")
        .parent()
        .find("a")
        .click(function() {
            filter
                .toggleClass("expanded")
                .find("em")
                .text($(this).text());
            location.href = $(this).attr("href");
            return false;
        });
});

jQuery(function($) {
    //user icon
    $(".user-section .social-accounts a,.user-section .vcard .fn a").each(function() {
        var tool = $(this).find(".tooltip");
        $(this).mouseover(function() {
            $(tool).css("margin-left", -($(tool).width() / 2) - 7 + "px");
        });
    });

    // banner close button
    $(".container > .banner_  .close_").click(function(event) {
        event.preventDefault();

        var $this = $(this),
            cookie_name = $this.attr("rel"),
            expires = new Date();
        $this.closest(".banner_").hide();
        expires.setDate(expires.getDate() + 14); // two weeks
        document.cookie = cookie_name + "=true; path=/; expires=" + expires.toUTCString();
    });

    // gift guide
    // $('.gift-banner.guide_ .btn-rnd-blue').click(function(event){
    // 	event.preventDefault();
    // 	location.href = '/gifts/index';
    // });
    // $('#content,#slideshow-box').delegate('span.daily','mouseenter',function(){
    // 	$(this).find('em').css('margin-left',-$(this).find('em').width()/2-8+'px').show();
    // 	$(this).find('small').css('margin-left',-$(this).find('small').width()/2-8+'px').show();
    // });
    // $('#content,#slideshow-box').delegate('span.daily','mouseleave',function(){
    // 	$(this).find('em, small').hide();
    // });

    // email confirmation
    (function() {
        var sending = false;
        $('#notibar-email-confirm a:not([href^="/"])').click(function(event) {
            var $this = $(this).attr("href", "#");

            event.preventDefault();

            if (sending) return;
            sending = true;

            $.ajax({
                type: "post",
                url: "/send_email_confirmation.json",
                data: { resend: true },
                success: function(response) {
                    if (typeof response.status_code == "undefined") return;
                    if (response.status_code == 1) {
                        $this
                            .parent()
                            .css("opacity", "0")
                            .css("opacity", "1")
                            .html(gettext("Success! You should receive a new confirmation email soon."));

                        setTimeout(function() {
                            $(".notify-default").slideUp();
                            $("#container-wrapper").animate({ "padding-top": "0" });
                        }, 2000);
                    } else if (response.status_code == 0) {
                        if (response.message) alertify.alert(response.message);
                    }
                },
                complete: function() {
                    sending = false;
                }
            });
        });
    })();

    // languages (when signed out)
    (function() {
        $("#lang_popup").on("click", "a[href]:not(.selected):not(.mn-lang):not(.btn-add)", function(event) {
            event.preventDefault();

            var $this = $(this),
                lang = $this.attr("href").substring(1);
            $.cookie.set("lang", lang, 14);

            location.reload();
        });
    })();

    if (window.can_show_signin_overlay == true) {
        $.dialog("popup.sign.signup").open().close = function() {};
    }
    if (/Safari/.test(navigator.userAgent)) {
        $("body").addClass("chrome");
    }
    if ('ontouchstart' in document.documentElement ) {
        $("html").addClass("ipad ");
    }

    // new fancy share
    $(".share-via li").each(function() {
        $(this).mouseover(function() {
            $(this)
                .find("em")
                .css("left", 28 * $(this).index() + 28 + "px")
                .css(
                    "margin-left",
                    -(
                        $(this)
                            .find("em")
                            .width() / 2
                    ) -
                        8 +
                        "px"
                );
        });
    });
    $(".share-with-someone .to input").focus(function() {
        $(this)
            .parents(".email-frm")
            .addClass("focus");
    });
    $(".share-with-someone .to input").blur(function() {
        $(this)
            .parents(".email-frm")
            .removeClass("focus");
    });
    $("#fancy-share .link").click(function() {
        $("#fancy-share .link input").stop();
    });
    $(".timeline").delegate(".btn-live", "click", function() {
        var $this = $(this);
        if ($this.attr("require_login")) {
            window.require_login($this.data("url"));
            return;
        }
        location.href = $this.data("url");
    });
    // $('.timeline, .livechat').delegate('.btn-livechat.btn-notify', 'click', function(event) {
    //     event.preventDefault();

    //     var $this = $(this);
    //     if($this.attr('clicked')) {
    //         return;
    //     }
    //     $this.attr('clicked', true);

    //     var chat_id = $this.attr('livechat-id');
    //     if($this.attr('require_login')) {
    //         window.require_login('/livechat/'+chat_id+'?subscribe');
    //         return;
    //     }
    //     $.post('/rest-api/v1/livechat/subscribe/'+chat_id, function(res) {
    //         if(res && res.status_code==1) {
    //             try{track_event('Subscribe to Live Chat', {'chat_id':chat_id});}catch(e){}
    //             var url = $this.parent().find('.share-livechat').attr('href');
    //             $.ajax({ type : 'post', url  : '/get_short_url.json', data : {url:url}, dataType : 'json', success : function(json){
    //                 if(!json.short_url) return;
    //                 $this.parent().find('.share-livechat .share a').attr('href',json.short_url);
    //                 $this.parent().find('.share-livechat').show();
    //             }});
    //         }
    //     })
    //     .always(function() {
    //         $this.attr('clicked', null);
    //     });
    //     $this.parent().find('.btn-subscribed').show();
    //     $this.hide();
    // });
    // $('.timeline,.livechat').delegate('.btn-subscribed', 'click', function() {
    //     var chat_id = $(this).attr('livechat-id');
    //     $.ajax({
    //         url:'/rest-api/v1/livechat/subscribe/'+chat_id,
    //         type:'DELETE',
    //         success:function(json) {
    //         }
    //     });
    //     $(this).parent().find('.btn-notify').show();
    //     $(this).hide();
    // });
    $(window).click(function(event) {
        if ($(".close-click-outside:visible").length > 0) {
            event.stopPropagation();
            event.preventDefault();
            $(".close-click-outside").hide();
        }
    });
    $(document).delegate(".close-click-outside", "click", function(event) {
        event.stopPropagation();
    });
    $("#content.activity-list").delegate(".paging.with-arrow a", "click", function(event) {
        event.stopPropagation();
        event.preventDefault();
        if ($(this).hasClass("disabled")) return;

        var $activity_item = $(this).closest(".activity-item");
        if ($activity_item.length <= 0) return;

        var $current_item = $activity_item.find("ul>li:visible");
        if ($current_item.length <= 0) return;

        $activity_item.find(".paging.with-arrow a").removeClass("disabled");
        if ($(this).hasClass("prev")) {
            if (
                $current_item
                    .hide()
                    .prev()
                    .show()
                    .prev().length <= 0
            ) {
                $(this).addClass("disabled");
            }
        } else if ($(this).hasClass("next")) {
            if (
                $current_item
                    .hide()
                    .next()
                    .show()
                    .next().length <= 0
            ) {
                $(this).addClass("disabled");
            }
        }
    });

    $("[data-url-retina]").each(function() {
        var $this = $(this);
        $this.attr("data-src", this.getAttribute(window.devicePixelRatio > 1 ? "data-url-retina" : "data-url"));
        if (!$this.hasClass("lazy")) {
            $this.css("background-image", "url('" + $this.attr("data-src") + "')");
        }
    });
    $.FLazy();
});
