window.STREAM_SELECTOR = "#content .stream";
window.STREAM_ITEM_SELECTOR = "> li, > dl";

$(function () {
    var alertify = window.alertify;

    $("#footer .newsletter .btn-subscribe").click(function () {
        var $this = $(this);
        var $email = $this.closest(".newsletter").find("input[name=email]");
        var email = $email.val();
        if ($email.is(":visible") && !email) {
            alertify.alert("Please input email address");
            return;
        }
        $.post("/news-subscribe.json", { email: email, signup_source: "footer" }).then(function () {
            $this.closest(".newsletter").find(".step1").hide().end().find(".step2").show();
        });
    });

    $(document.body).on("click", ".pagination .btn-more.noinfinitescroll", function () {
        var $self = $(this);
        var $pag = $self.closest(".pagination");
        var $loading = $pag.find('#infscr-loading')
        var nextUrl = $self.attr("href");

        if ($self.data("loading")) {
            return false;
        }

        if (nextUrl) {
            $self.data("loading", true);
            $self.hide();
            $loading.show();

            $.get(nextUrl)
                .then(function (res) {
                    var $items = $(res).find(STREAM_SELECTOR).find(STREAM_ITEM_SELECTOR);
                    $(STREAM_SELECTOR).append($items);
                    if ($.fn.videoPlayer) {
                        $items.find(".video_player").videoPlayer({ autoplay: true });
                    }
                    var replacingNextUrl = $(res).find(".pagination .btn-more").attr("href");
                    if (replacingNextUrl) {
                        $self.attr("href", replacingNextUrl);
                    } else {
                        $self.attr("href", "")
                    }
                })
                .always(function () {
                    $("[data-url-retina]").each(function () {
                        var $this = $(this);
                        $this.attr(
                            "data-src",
                            this.getAttribute(window.devicePixelRatio > 1 ? "data-url-retina" : "data-url")
                        );
                    });
                    $.FLazy && $.FLazy();
                    $self.data("loading", false);
                    $loading.hide();
                    if ($self.attr("href")) {
                        $self.show();
                    }
                });
        } else {
            $self.hide();
        }
        return false;
    });

    function check_maxlength() {
        var max = parseInt($(this).attr("maxlength"));
        var len = $(this).val().length;
        if (len > max) $(this).val($(this).val().substr(0, max));
        if (len >= max) return false;
    }

    $("textarea[maxlength]").keypress(check_maxlength).change(check_maxlength);
    $(".show-after-jquery").show();
    $("body").mousedown(function () {
        $(
            ".container, #overlay-thing .content, #overlay-thing .sidebar, #overlay-thing .timeline"
        ).not('.purchases.detail, .review-purchases, .cart').disableSelection();
    });

    function copyTextToClipboard(text) {
        var cb, range, selection, mark;
        try {
            range = document.createRange();
            selection = document.getSelection();

            mark = document.createElement('mark');
            mark.textContent = text;
            // used to conserve newline, etc
            mark.style.whiteSpace = 'pre';
            document.body.appendChild(mark);

            range.selectNode(mark);
            selection.addRange(range);

            var successful = document.execCommand('copy');
            if (!successful) {
                throw new Error('copy command was unsuccessful');
            }
        } catch (err) {
            console.warn(err)
            try {
                 window.clipboardData.setData('text', text);
            } catch (err) {
                console.warn('unable to copy, falling back to prompt');
                var copyKey = /mac os x/i.test(navigator.userAgent) ? '⌘' : 'Ctrl';
                  window.prompt("Press " + copyKey + "+C to copy", text);
            }

        } finally {
            if (selection) {
                if (typeof selection.removeRange == 'function') {
                    selection.removeRange(range);
                } else {
                    selection.removeAllRanges();
                }
            }
            if (mark) {
                document.body.removeChild(mark);
            }
        }
    }
    $(".btn-copy-clipboard").click(function(e) {
        e.preventDefault();
        var $this = $(this), url = $this.attr("data-url");
        copyTextToClipboard(url);
        $this.text("Copied to clipboard");
        setTimeout(function() {
            $this.text("Copy link");
        }, 2000);
    });
});
