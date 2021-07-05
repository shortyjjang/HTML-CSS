import { copyToClipboard, renderPopup } from "fancyutils";

import AddlistPopup from "../overlay-thing/components/popup/AddlistPopup";

const getUrl = (thingUrl: string, viewerUsername: string) => {
    let url = `https://fancy.com${thingUrl}`;
    if (viewerUsername) {
        const connector = ~url.indexOf("?") ? "&" : "?";
        url = `${url}${connector}ref=${viewerUsername}`;
    }
    return url;
};

const copyAction = (thingUrl: string, viewerUsername: string, $messageEl: JQuery<HTMLElement>) => {
    copyToClipboard(getUrl(thingUrl, viewerUsername));
    $messageEl.text("Link copied!");
    setTimeout(() => {
        $messageEl.text("Copy link");
    }, 2000);
};

export function setup() {
    $(() => {
        // click outside to close
        $(document)
            .on("click", ".figure-item .menu-container .btn-more", function () {
                const $el = $(this);

                const $container = $el.closest(".menu-container");
                if ($container.hasClass("show-list")) {
                    $container.removeClass("show-list");
                } else if ($container.hasClass("show-share")) {
                    $container.removeClass("show-share");
                } else if ($container.hasClass("opened")) {
                    $container.removeClass("opened").closest("li").removeClass("active");
                    $(document.body).removeClass("show-more-share");
                } else {
                    $container.addClass("opened").closest("li").addClass("active");
                    $(document.body).addClass("show-more-share");
                }
                if (!$el.data("clickoutside")) {
                    const ts = Math.random();
                    const evt = `click.action-clickoutside-${ts}`;
                    $el.data("clickoutside", evt);
                    $(document).on(evt, function (e2) {
                        if ($(e2.target).is($el) || $(e2.target).closest($container).length) {
                            return true;
                        }
                        e2.preventDefault();
                        e2.stopPropagation();
                        $el.closest(".menu-container.opened").removeClass("opened").closest("li").removeClass("active");
                        $(document.body).removeClass("show-more-share");
                        // close addlist popover
                        $el.closest(".menu-container").removeClass("show-list");
                        $(document).off(evt);
                        $el.data("clickoutside", null);
                    });
                }
            })
            .on("click", ".figure-item .menu-container .add-list", function () {
                if (!window.__FancyUser.loggedIn) {
                    window.require_login();
                    return false;
                }
                const $this = $(this);
                const objectId = $this.closest("li").attr("tid")!;
                renderPopup(AddlistPopup, { objectId });
                return false;
            })
            .on("click", ".figure-item .menu-container .copy-link", function () {
                const $el = $(this);
                const url = $el.closest(".figure-item").data("url");
                copyAction(url, window.__FancyUser.viewerUsername, $el);
                return false;
            })
            .on("click", ".figure-item .menu-container .share", function () {
                $(this).closest(".menu-container").addClass("show-share");
                return false;
            })
            .on("click", ".figure-item .menu-container .ly-close", function () {
                $(this).closest(".menu-container").removeClass("opened");
                return false;
            });
    });
}

// $(function () {
//     $(".figure-item #show-share .close, .figure-item #show-addlist .close").click(function (e) {
//         e.preventDefault();
//         $(this).closest(".menu-container").removeClass("show-share").removeClass("show-list");
//         return false;
//     });
// });
