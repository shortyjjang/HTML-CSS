(function(){
    var $btns = $('#content .viewer li'), $stream = $('ol.stream'), $container=$('.container'), $wrapper = $('.timeline'), first_id = 'stream-first-item_', latest_id = 'stream-latest-item_';

    // show images as each image is loaded
    $stream.on('itemloaded', function(){

        var $latest = $stream.find('>#'+latest_id).removeAttr('id'),
            $first = $stream.find('>#'+first_id).removeAttr('id'),
            $target=$(), viewMode;

        // merge sameuser thing
        var userid = $latest.attr('tuserid');
        var $currents = $latest.prevUntil('li[tuserid!='+userid+"]");
        var $nexts = $latest.nextUntil('li[tuserid!='+userid+"]");
        var $group = $($currents).add($latest).add($nexts);
        $nexts.filter(".clear").removeClass("clear").find("a.vcard").detach();
        if($group.length>2){
            $group.removeClass("big mid").addClass("sm").each(function(i){
                if(i%3==0) $(this).addClass("clear");
            });

            if($group.length%3==2){
                $group.last().removeClass("sm").addClass("mid").prev().removeClass("sm").addClass("mid");
            }else if($group.length%3==1){
                $group.last().removeClass("sm").addClass("big");
            }
        }else if($group.length==2){
            $group.removeClass("big").addClass("mid");
        }

        var forceRefresh = false;

        if(!$first.length || !$latest.length) {
            $target = $stream.children('li');
        } else {
            var newThings = $first.prevAll('li');
            if(newThings.length) forceRefresh = true;
            $target = newThings.add($latest.nextAll('li'));
        }

        $stream.find('>li:first-child').attr('id', first_id);
        $stream.find('>li:last-child').attr('id', latest_id);

        viewMode = $container.hasClass('vertical') ? 'vertical' : ($container.hasClass('normal') ? 'grid':'classic');

        if(viewMode=='grid'){
            $target.each(function(i,v,a){
                var $li = $(this), src_g;
                var $grid_img = $li.find(".figure.grid");

                if($grid_img.height()>400){
                    $grid_img.css("background-image", "url("+$grid_img.attr("data-ori-url")+")");
                }else{
                    $grid_img.css("background-image", "url("+$grid_img.attr("data-310-url")+")");
                }
            });
        }

        if(viewMode == 'vertical'){
            $('#infscr-loading').show();
            setTimeout(function(){
                arrange(forceRefresh);
                $('#infscr-loading').hide();
            },10);
        }

    });
    $stream.trigger('itemloaded');

    $btns.each(function(){
        var $tip = $(this).find('span');
        $tip.css('margin-left', -$tip.outerWidth()/2 + 'px');
    });

    $btns.click(function(event){
        event.preventDefault();
        if($wrapper.hasClass('anim')) return;

        var $btn = $(this);

        if(/\b(normal|vertical|classic)\b/.test($btn.attr('class'))){
            setView(RegExp.$1);

            $btns.find('a.current').removeClass('current');
            $btn.find('a').addClass('current');
        }
    });

    $wrapper.on('redraw', function(event){
        var curMode = '';
        if(/\b(normal|vertical|classic)\b/.test($container.attr('class'))) curMode = RegExp.$1;
        if(curMode) setView(curMode, true);
    });

    function setView(mode, force){
        if(!force && $container.hasClass(mode)) return;
        var $items = $stream.find('>li');

        if($items.length>100){
            $items.filter(":eq(100)").nextAll().detach();
        }

        if(!window.Modernizr || !Modernizr.csstransitions ){
            $stream.addClass('loading');
            $wrapper.trigger('before-fadeout');
            $stream.removeClass('loading');

            $wrapper.trigger('before-fadein');
            switchTo(mode);

            if(mode=='normal'){
                $items.each(function(i,v,a){
                    var $li = $(this);
                    var $grid_img = $li.find(".figure.grid");

                    if($li.height()>400){
                        $grid_img.css("background-image", "url("+$grid_img.attr("data-ori-url")+")");
                    }else{
                        $grid_img.css("background-image", "url("+$grid_img.attr("data-310-url")+")");
                    }
                });
            }

            $stream.find('>li').css('opacity',1);
            $wrapper.trigger('after-fadein');
            return;
        }

        $wrapper.trigger('before-fadeout').addClass('anim');
        $stream.addClass('loading');

        var item,
            $visibles, visibles = [], prevVisibles, thefirst,
            offsetTop = $stream.offset().top,
            hh = $('#header-new').height(),
            sc = $(window).scrollTop(),
            wh = $(window).innerHeight(),
            f_right, f_bottom, v_right, v_bottom,
            i, c, v, d, animated = 0;

        // get visible elements
        for(i=0,c=$items.length; i < c; i++){
            item = $items[i];
            if (offsetTop + item.offsetTop + item.offsetHeight < sc + hh) {
                //item.style.visibility = 'hidden';
            } else if (offsetTop + item.offsetTop > sc + wh) {
                //item.style.visibility = 'hidden';
                break;
            } else {
                visibles[visibles.length] = item;
            }
        }
        prevVisibles = visibles;

        // get the first animated element
        for(i=0,c=Math.min(visibles.length,10),thefirst=null; i < c; i++){
            v = visibles[i];

            if( !thefirst || (thefirst.offsetLeft > v.offsetLeft) || (thefirst.offsetLeft == v.offsetLeft && thefirst.offsetTop > v.offsetTop) ) {
                thefirst = v;
            }
        }

        if(visibles.length==0) fadeIn();
        // fade out elements using delay based on the distance between each element and the first element.
        for(i=0,c=visibles.length; i < c; i++){
            v = visibles[i];

            d = Math.sqrt(Math.pow((v.offsetLeft - thefirst.offsetLeft),2) + Math.pow(Math.max(v.offsetTop-thefirst.offsetTop,0),2));
            delayOpacity(v, 0, d/5);

            if(i == c -1){
                setTimeout(fadeIn,300+d/5);
            }
        }

        function fadeIn(){
            $wrapper.trigger('before-fadein');

            if($wrapper.hasClass("wait")){
                setTimeout(fadeIn, 50);
                return;
            }

            var i, c, v, thefirst, COL_COUNT, visibles = [], item;

            if($items.length !== $stream.get(0).childNodes.length || $items.get(0).parentNode !== $stream.get(0)) $items = $stream.find('>li');
            $stream.height($stream.parent().height());

            switchTo(mode);

            if(mode=='normal'){
                $items.each(function(i,v,a){
                    var $li = $(this);
                    var $grid_img = $li.find(".figure.grid");

                    if($li.height()>400){
                        $grid_img.css("background-image", "url("+$grid_img.attr("data-ori-url")+")");
                    }else{
                        $grid_img.css("background-image", "url("+$grid_img.attr("data-310-url")+")");
                    }
                });
            }

            $stream.removeClass('loading');
            $wrapper.removeClass('anim');

            // get visible elements
            for(i=0,c=$items.length; i < c; i++){
                item = $items[i];
                if (offsetTop + item.offsetTop + item.offsetHeight < sc + hh) {
                    //item.style.visibility = 'hidden';
                } else if (offsetTop + item.offsetTop > sc + wh) {
                    //item.style.visibility = 'hidden';
                    break;
                } else {
                    visibles[visibles.length] = item;
                    item.style.opacity = 0;
                }
            }

            $wrapper.addClass('anim');

            $(visibles).css({opacity:0,visibility:''});
            COL_COUNT = Math.floor($stream.width()/$(visibles[0]).width());

            // get the first animated element
            for(i=0,c=Math.min(visibles.length,COL_COUNT),thefirst=null; i < c; i++){
                v = visibles[i];

                if( !thefirst || (thefirst.offsetLeft > v.offsetLeft) || (thefirst.offsetLeft == v.offsetLeft && thefirst.offsetTop > v.offsetTop) ) {
                    thefirst = v;
                }
            }

            // fade in elements using delay based on the distance between each element and the first element.
            if(visibles.length==0) done();
            for(i=0,c=visibles.length; i < c; i++){
                v = visibles[i];

                d = Math.sqrt(Math.pow((v.offsetLeft - thefirst.offsetLeft),2) + Math.pow(Math.max(v.offsetTop-thefirst.offsetTop,0),2));
                delayOpacity(v, 1, d/5);

                if(i == c -1) setTimeout(done, 300+d/5);
            }
        };

        function done(){
            $wrapper.removeClass('anim');
            $stream.find('>li').css('opacity',1);
            $wrapper.trigger('after-fadein');
        };

        function delayOpacity(element, opacity, interval){
            setTimeout(function(){ element.style.opacity = opacity }, Math.floor(interval));
        };

        function switchTo(mode){
            $container.removeClass('vertical normal classic').addClass(mode);
            if(mode == 'vertical') {
                arrange(true);
                $.infiniteshow.option('prepare',2000);
            } else {
                $stream.css('height','');
                $.infiniteshow.option('prepare',4000);
            }
            if($.browser.msie) $.infiniteshow.option('prepare',1000);
            $.cookie.set('profile-thing-view',mode,9999);
        };

    };

    var bottoms = [0,0,0,0];
    function arrange(force_refresh){

        var i, c, x, w, h, nh, min, $target, $marker, $first, $img, COL_COUNT, ITEM_WIDTH;

        var ts = new Date().getTime();

        $marker = $stream.find('li.page_marker_');

        if(force_refresh || !$marker.length) {
            force_refresh = true;
            bottoms = [0,0,0,0];
            $target = $stream.children('li');
        } else {
            $target = $marker.nextAll('li');
        }

        if(!$target.length) return;

        $first = $target.eq(0);
        $target.eq(-1).addClass('page_marker_');
        $marker.removeClass('page_marker_');

        //ITEM_WIDTH  = parseInt($first.width());
        //COL_COUNT   = Math.floor($stream.width()/ITEM_WIDTH);
        ITEM_WIDTH = 237;
        COL_COUNT = 4;

        for(i=0,c=$target.length; i < c; i++){
            min = Math.min.apply(Math, bottoms);

            for(x=0; x < COL_COUNT; x++) if(bottoms[x] == min) break;

            //$li = $target.eq(i);
            $li = $($target[i]);
            $img = $li.find('.figure.vertical > img');
            if(!(nh = $img.attr('data-calcHeight'))){
                w = +$img.attr('data-width');
                h = +$img.attr('data-height');

                if(w && h) {
                    //nh = $img.width()/w * h;
                    nh = 217/w * h;
                    nh = Math.max(nh,150);
                    $img.attr('height', nh).data('calcHeight', nh);
                }else{
                    nh = $img.height();
                }
            }

            $li.css({top:bottoms[x], left:x*ITEM_WIDTH})
            bottoms[x] = bottoms[x] + nh + 20;
        }

        $stream.height(Math.max.apply(Math, bottoms));

    };
    $wrapper.on('arrange', function(){ arrange(true); });

    /*
    if( $.cookie.get('profile-thing-view')=="vertical"){
        $wrapper.trigger("arrange");
    }
    */
    $(window).trigger("prefetch.infiniteshow");

    $stream.delegate('.figure-item',"mouseover",function(){
        if ($(this).parents('.timeline').hasClass('classic')==true) {
            $(this).find('.figure.classic .back')
                .width($(this).find('.figure.classic img').width())
                .height($(this).find('.figure.classic img').height())
                .css('margin-left',-($(this).find('.figure.classic img').width()/2)+'px')
                .css('margin-top',-($(this).find('.figure.classic img').height()/2)+'px')
                .css('left','50%')
                .css('top','50%')
                .end();
            $(this).find('.price').css('margin-top',($(this).find('.figure.classic').height()-$(this).find('.figure.classic img').height())/2+'px').css('margin-left',($(this).find('.figure.classic').width()-$(this).find('.figure.classic img').width())/2+'px');
            $(this).find('.share').css('margin-top',($(this).find('.figure.classic').height()-$(this).find('.figure.classic img').height())/2+'px').css('margin-right',($(this).find('.figure.classic').width()-$(this).find('.figure.classic img').width())/2+'px');
        }else{
            $(this).find('.figure.classic .back').removeAttr('style').end()
                .find('.price').removeAttr('style').end()
                .find('.figure.classic .share').removeAttr('style');
        }
    });

    $.infiniteshow({
        itemSelector:'ol.stream > li[tid]',
        streamSelector:'ol.stream',
        dataKey:'profile-thing',
        post_callback: function($items){ $('ol.stream').trigger('itemloaded') },
        prefetch:true,

        newtimeline:true
    })
    if($.browser.msie) $.infiniteshow.option('prepare',1000);
})();