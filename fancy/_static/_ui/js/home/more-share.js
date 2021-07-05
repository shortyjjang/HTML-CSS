window.MoreShare = {
    init: function init(containerSelector, loggedIn) {
        if (window.renderMoreShare) {
            window.renderMoreShare({ containerSelector: containerSelector, loggedIn: loggedIn });
        } else {
            window.MoreShare.queue.push({ containerSelector: containerSelector, loggedIn: loggedIn });
        }
    },
    queue: []
};
