(function ($) {
    var handleVideoPlayerScroll;
    function forceTriggerScrollEvent() {
        if (handleVideoPlayerScroll) {
            handleVideoPlayerScroll();
        }
    }

    function initVideo($el, option, firstPlay){
        var $vid = $el.find("video");
        var isInited = false;
        option = option || {};
        try{
            $el.find('#end_time').text(numeral($vid.prop('duration')/100).format('00.00').replace('.', ':'));
            $el.find('#current_time').text(numeral($vid.prop('currentTime')/100).format('00.00').replace('.', ':'));
            isInited = true;
        }catch(e){
            setTimeout(function(){initVideo($el, option, firstPlay);}, 500);
        }

        if(!isInited) return;
        var $progress = $el.find('.timestamp .progress');
        var $videoInfo = $el.find("#videoInfo");

        $vid.bind("timeupdate", function() {
            if (!$progress.hasClass('animate')) $progress.addClass('animate');
            $videoInfo.removeClass("loading stop");
            var $ct = $el.find('#current_time');
            if ($ct.length > 0) {
                $ct.text(numeral($vid.prop('currentTime')/100).format('00.00').replace('.', ':'));
            }
            $progress.find("i:eq(0)").css('width', '100%');
            var width = numeral($vid.prop('currentTime')/$vid.prop('duration')).format('0%');
            $progress.find("i:eq(1)").css({'width': width});
        });
        $vid.bind('progress', function(e) {
            $progress.find("i:eq(0)").css('width', '100%');
        });
        $vid.bind('ended', function(e) {
            $videoInfo.attr('class',"pause");
            $progress.find("i:eq(0)").css('width', '100%');
        });
        $vid.bind('canplay', function(e) {
            $videoInfo.removeClass("loading");
            if (option && option.autoplay && firstPlay === null) {
                // https://app.asana.com/0/260912680807/440881386363604
                // prevent homepage top video not playing.
                forceTriggerScrollEvent();
            }
        });
        $vid.bind('canplaythrough', function(e) {
            $videoInfo.removeClass("loading");
        });
        $vid.bind('loadstart', function(e) {
            $videoInfo.addClass("loading");
        });
        $vid.bind('pause', function(e) {
            $videoInfo.attr('class',"pause");
        });
        $vid.bind('play', function(e) {
            $videoInfo.attr('class',"playing");
        });
        $vid.bind('playing', function(e) {
            $videoInfo.attr('class',"playing");
        });
        $vid.bind('seeked', function(e) { 
            if( $videoInfo.hasClass('pause') ) return;
            $videoInfo.attr('class',"playing");
        });
        $vid.bind('stalled', function(e) {
            $videoInfo.addClass("loading");
        });
        $vid.bind('suspend', function(e) {
        });
        $vid.bind('waiting', function(e) {
            $videoInfo.addClass("loading");
        });
        function playVid() {
            $vid[0].play(); 
        }
        function pauseVid() { 
            $vid[0].pause();
        }
        function muteVid() { 

            if ( $el.find("#muteBtn").hasClass('btn-muted') ) {
                $vid[0].muted = false;
                $el.find("#muteBtn").attr('class', "btn-mute");    
                fadeInVolume()
            }else{
                $el.find("#muteBtn").attr('class', "btn-muted");
                fadeOutVolume(function(){
                    if( $el.find("#muteBtn").hasClass('btn-muted') ){
                        $vid[0].muted = true;    
                    }
                })
            }
        }
        function fadeInVolume(callback){
            var volume = $vid.attr('ori_volume')||$vid[0].volume||1;
            $vid[0].volume = 0;
            $vid.stop(true,true).animate(
                { volume: volume }, 
                1500,
                callback
            );
        }
        function fadeOutVolume(callback){
            $vid.attr('ori_volume', $vid.attr('ori_volume')||$vid[0].volume||1);
            $vid.stop(true,true).animate(
                { volume: 0 }, 
                1000,
                callback
            );
        }

        var hoverTimeout = null;
        if( !/Safari/.test(window.navigator.userAgent) || !/Version\/11/.test(window.navigator.userAgent)){
            if(!option.muted){
                $el.hover(function(){
                    if ( $el.find("#muteBtn").hasClass('btn-muted') && !$el.attr('muted_by_hand') ) {
                        hoverTimeout = setTimeout(function(){
                            muteVid();
                        },100);
                    }
                }, function(){
                    if(hoverTimeout) clearTimeout(hoverTimeout);
                    if ( !$el.find("#muteBtn").hasClass('btn-muted') && $el.is(":in-viewport") ) {
                        muteVid();
                    }
                })
            }
        }

        var pauseTimeout = null;
        $el.find('#videoInfo .btn-play').on('click', function(e) {
            $progress.removeClass('animate');
            $videoInfo.attr('class',"playing").removeAttr('stop_by_hand');
            if(pauseTimeout) clearTimeout(pauseTimeout);
            playVid();
        });

        $el.find('#videoInfo .btn-pause').on('click', function(e) {
            var $this = $(this);
            if(pauseTimeout) clearTimeout(pauseTimeout);
            if(!$(this).attr('scroll')){
                $videoInfo.attr('class',"pause").attr('stop_by_hand',true);
                pauseVid();
            }else{
                $videoInfo.attr('class',"pause");
                if ( !$el.find("#muteBtn").hasClass('btn-muted') ){
                    muteVid();
                    pauseTimeout = setTimeout(function(){
                        pauseVid();    
                    }, 1000)
                }else{
                    pauseVid();
                }
            }
            $this.removeAttr('scroll');
        });

        $el.find('#videoInfo #muteBtn').on('click', function(e) {
            muteVid();
            if ( $el.find("#muteBtn").hasClass('btn-muted') ){
                $el.attr('muted_by_hand', true);
            }else{
                $el.removeAttr('muted_by_hand');
            }
        });

        $el.find('#videoInfo .timestamp').on('click', function(e) {
            var width = $progress.width();
            var currentPos = e.pageX - $(this).offset().left;
            var progress = currentPos/width * $vid[0].duration;
            var width = numeral( progress/$vid.prop('duration') ).format('0%');
            $progress.find("i:eq(1)").css({'width': width});
            $vid[0].currentTime = progress;
        });
        var mousedown = false;
        $(document).on('mousedown', function(e) {
            mousedown = true;
        });
        $(document).on('mouseup', function(e) {
            mousedown = false;
        });
        $el.find('#videoInfo .timestamp').on('mousemove', function(e) {
            if(!mousedown) return;
            var width = $progress.width();
            var currentPos = e.pageX - $(this).offset().left;
            var progress = currentPos/width * $vid[0].duration;
            var width = numeral( progress/$vid.prop('duration') ).format('0%');
            $progress.find("i:eq(1)").css({'width': width});
            $vid[0].currentTime = progress;
        });
    }

    var $players = null;

    $(function(){
        handleVideoPlayerScroll = _.throttle(function(){
            if(!$players || !$players.length) return;
            
            $players.not(":in-viewport").find('.playing').each(function(){
                $(this).find(".btn-pause").attr('scroll',true).click();
            })

            if( $("body").is(".thing-overlay-on, .article-overlay-on") ) return;

            if($players.not('.multiple-play-video').filter(':in-viewport').length > 0){
                var player = null;
                $players.filter(":in-viewport").each(function(){
                    if( !player && !$(this).find("#videoInfo").attr('stop_by_hand') ){
                        player = $(this);
                    }
                })
                if(player && !player.find('#videoInfo').is(".playing")) player.find(".btn-play").click();
            }

            $players.filter(".multiple-play-video:in-viewport").each(function(){
                if(!$(this).find("#videoInfo").attr('stop_by_hand') ){
                    if ($(this).find('video').prop('paused')) {
                        $(this).find(".btn-play").click();
                    }
                }
            })
        }, 100);
        window.addEventListener('scroll', handleVideoPlayerScroll, { passive: true });
    });

    $(window).load(function(){
        forceTriggerScrollEvent();
    });

    function autoplayVid($el) {
        $el.find(".btn-play").click();
    }

    $.fn.videoPlayer = function(option){
        var option = option || {autoplay:false, hidden:false};
        var firstPlay = null;
        var self = this;
        var $videos = this.each(function(){
            var $el = $(this);
            initVideo($el, option, firstPlay);
            if( option.autoplay && !firstPlay && !option.hidden && $el.is(":in-viewport:not(.multiple-play-video)")) {
                firstPlay = this;
            }
            if (option.autoplay && $el.is(":in-viewport(.multiple-play-video)")) {
                autoplayVid($el)
            }
        })
        if(firstPlay){
            autoplayVid($(firstPlay))
        }

        if( option.autoplay){
            if(!$players ) $players = self;
            else $players = $players.add(self);
        }
        
        return $videos;
    }
})(window.jQuery);
