$(document).ready(function() {
    $(document).delegate('.fancyd_list', 'click', function(e) {
        // Prevent event handling on overlay instance
        if ($(this).parents('.overlay-thing').length > 0) {
            return;
        }
        e.preventDefault();

        return; // disable popup
    });

    $('.popup.fancyd_list').on('click', '.follow, .following', function(e) {
        // Prevent event handling on overlay instance
        if ($('.popup.fancyd_list').data('via-overlay')) {
            return;
        }
        e.preventDefault();
        
        var $this = $(this), login_require = $this.attr('require_login');
        if (typeof(login_require) !== undefined && login_require === 'true')  return require_login();
        if ($this.hasClass('loading')) return;

        if ($this.hasClass('follow')) {
            Fancy.Action.follow($this,
                '/add_follow.xml',
                { user_id: $this.attr('uid') },
                function($el) {
                    $el.text(gettext('Following'));
                }
            );
        } else {
            Fancy.Action.unFollow($this,
                '/delete_follow.xml',
                { user_id: $this.attr('uid') },
                function($el) {
                    $el.text(gettext('Follow'));
                }
            );
        }
    });

    $('.popup.fancyd_list').on('click', 'li.more', function(e) {
        // Prevent event handling on overlay instance
        if ($('.popup.fancyd_list').data('via-overlay')) {
            return;
        }
        e.preventDefault();
        getFollowList();
    });

    function getFollowList() {
        var $list = $('.popup.fancyd_list ul');
        var thingId = $list.attr('tid');
        var page = $list.attr('page');

        if($list.hasClass('loading')) return;
        $list.addClass('loading');

        $.get(
            '/thing_follower_list',
            { thing_id: thingId, page: page },
            function(html) {
                $list.find('li.more').remove();
                $list.append(html);
                $list.attr('page', parseInt(page, 10)+1);
                $list.removeClass('loading');
            }
        );
    }
});
