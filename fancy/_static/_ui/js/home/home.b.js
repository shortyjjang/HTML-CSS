(function(){
    var $stream = $('.timeline #content ol.stream'),
    //  $container=$('.container.timeline'), $wrapper = $('.wrapper-content'), 
    first_id = 'stream-first-item_', latest_id = 'stream-latest-item_', vid = $stream.attr('vid');

    // var feedName = "Everything";
    
    if(!vid){
        $stream.delegate('div.figure-item a', 'click', function(){
            var $this = $(this), requireLogin = $this.attr('require_login'), url = $this.attr('href');
            url = url || '';

            if (requireLogin !== 'true') return;

            $('#fancy-g-signup,#fancy-g-signin').attr('next', url);
            var $social = $('.social');
            if ($social.length > 0) {
                 $social.attr('next', url);
            }
            $(".popup.sign.signup")
                .find('input.next_url').val(url).end()
                .find('a.signup').attr('href','/register?next='+url).end()
                .find('a.signin').attr('href','/login?next='+url);
            $.dialog('popup.sign.signup').open();
            return false;
        });
    } else {
        $(function(){
            var $custom_checks = $('div.customize form.options input:checkbox');
            $custom_checks.click(function(){
                if (!$custom_checks.filter(':checked').length) $('#show_featured_items').prop('checked', true);
            });
        });
    }

    // show images as each image is loaded
    $stream.on('itemloaded', function(e, skipScroll){

        var $latest = $stream.find('>#'+latest_id).removeAttr('id'),
            $first = $stream.find('>#'+first_id).removeAttr('id'),
            $target=$();

        // var forceRefresh = false;

        if(!$first.length || !$latest.length) {
            $target = $stream.children('li');
            setTimeout(function(){
                $target.find(".video_player").videoPlayer({autoplay:true,muted:true});
            },10);          
        } else {
            var newThings = $first.prevAll('li');
            // if(newThings.length) forceRefresh = true;
            $target = newThings.add($latest.nextAll('li'));

            setTimeout(function(){
                $target.find(".video_player").videoPlayer({autoplay:true,muted:true,hidden:true });
            },10);
        }

        $stream.find('>li:first-child').attr('id', first_id);
        $stream.find('>li:last-child').attr('id', latest_id);

        if(!skipScroll){
            $(window).trigger("scroll.infiniteshow");   
        }
    });

    // show images as each image is loaded
    $stream.on('restored', function(){
        var $target = $stream.children('li');
        $target.find("li[tid]").each(function(){
            $(this).attr('data-expose-id', $(this).attr('tid'));
        })
        $target.find(".video_player").videoPlayer({autoplay:true,muted:true});

        $stream.find('>li:first-child').attr('id', first_id);
        $stream.find('>li:last-child').attr('id', latest_id);
    });

    $stream.trigger('itemloaded');

    // var $win = $(window),
    // scTop    = $win.scrollTop(),
    // stTop    = $stream.offset().top,
    // winH     = $win.innerHeight(),
    // headerH  = $('#header-new').height(),
    // firstTop = -1,
    // maxDelay = 0,
    // begin    = Date.now(),
    // ajax     = null,
    // prefetchajax = null;

    // category selection
    // var init_ts = $stream.attr("ts");
    // var ttl  = 5 * 60 * 1000;


    $stream.find('select[name=option_id]').on('change', function() {
        var $this = $(this);
        var $selectedOption = $this.children('option:selected');
        var $quantitySelectTags = $this.siblings('select[name=quantity]');
        var remainingQuantity = parseInt($selectedOption.attr('remaining-quantity'));

        var currentlySelectedQuantity = parseInt($quantitySelectTags.val());
        if (currentlySelectedQuantity > remainingQuantity) {
            currentlySelectedQuantity = remainingQuantity;
        }
        $quantitySelectTags.empty();
        for (var i=1; i<=remainingQuantity && i<=10; i++) {
            $quantitySelectTags.append('<option value="' + i + '">' + i + '</option>');
        }
        $quantitySelectTags.val(currentlySelectedQuantity);
    });

    $stream
        .on('click', 'input[type="text"][readonly],textarea[readonly]', function(event){
            event.preventDefault();
            $(this).focus().select();
        })
        // .on('keyup', 'input[name="email-recv"],textarea[name="email-msg"]', function(event){
        //     var $email = $(this).closest('.email'), recv = $.trim($email.find('input[name="email-recv"]').val()), msg = $.trim($email.find('textarea').val()), $btn = $email.find('button');
        //     // see common/util.js to change emailRegEx
        //     $btn[0].disabled = !(emailRegEx.test(recv) && msg);
        // })
        // .on('click', 'button[name="email-send"]', function(event){
        //     var $this = $(this);
        //     var $email = $this.closest('.email'), recv = $.trim($email.find('input[name="email-recv"]').val()), msg = $.trim($email.find('textarea').val());
        //     var $li = $email.closest('li'), tid = $li.attr('tid'), params;
        //     // see common/util.js to change emailRegEx
        //     if (!emailRegEx.test(recv)) return;

        //     if ($this.hasClass('loading')) return;
        //     $this.addClass('loading');

        //     params = {
        //         type : 'nt',
        //         url  : $li.find('input[name="share-link"]').val(),
        //         name : $.trim($li.find('figcaption > a').text()),
        //         oid  : $li.attr('tid'),
        //         ooid : $li.attr('tuserid'),
        //         emails : recv,
        //         message : msg
        //     };

        //     $.post('/share-with-someone.json', params)
        //         .then(function(data){
        //             alert('Sent!');
        //             $li.removeClass('active').find('.opened').removeClass('opened').end().find('.show_share').hide();
        //         })
        //         .always(function(){
        //             $this.removeClass('loading');
        //         });
        // })
        .on('click', '.via > .more', function(event){
            event.preventDefault();
            $(this).closest('.via').toggleClass('show');
        })
        .on('mouseover', '.via > .others > a', function(){
            var $em = $(this).find('em');
            $em.css('margin-left',-($em.width()/2)-13+'px');
        })
        .on('click', '.select-boxes2', function(event){
            event.preventDefault();
            $(this).closest('.customize').toggleClass('opened');
        });
        // .on('click', '.sns > .via a:not(.more)', function(event){
        //     event.preventDefault();
        //     var $this = $(this);

        //     if ($this.is('.fb') && window.FB) {
        //         var params = {
        //             method: 'feed',
        //             link: $this.closest('.popup').data('url')||$this.data('url'),
        //             name: $this.data('text'),
        //             caption: '',
        //             description: ''
        //         };
        //         FB.ui(params, $.noop);
        //     } else {
        //         var w = $this.data('width') || 620, h = $this.data('height') || 380, t = Math.max(Math.round((screen.availHeight-h-80)/2), 20), l = Math.max(Math.round((screen.availWidth-w)/2), 5);
        //         try{ window.open($this.attr('href'), $this.attr('class'), 'top='+t+',left='+l+',width='+w+',height='+h+',menubar=no,status=no,toobar=no,location=no,personalbar=no,scrollbars=no,resizable=yes').focus(); }catch(e){};
        //     }
        // })
        // .on('mouseover', '.figure.gif', function(e){
        //     var src = $(this).find("img.gif").attr('src');
        //     $(this).find("img.gif").attr('src', '/_ui/images/common/blank.gif');
        //     $(this).addClass('on').find("img.gif").attr('src', src);
        // })
        // .on('mouseout', '.figure.gif', function(e){
        //     $(this).removeClass('on');
        // })

    $(window).on('scrollstop', function(){
        var scrollTop = $(window).scrollTop();
        var windowHeight = $(window).height();
        $("ol.stream li.active").each(function(){
            var $this = $(this);
            if( $this.offset().top + $this.height() < scrollTop || $this.offset().top > scrollTop + windowHeight){
                $this.find(".show_cart.opened, .menu-container.opened").removeClass('opened').end().removeClass("active");
                $this.find(".menu-container .show_share, .menu-container .show_someone").hide();
            }
        })
    });
})();
