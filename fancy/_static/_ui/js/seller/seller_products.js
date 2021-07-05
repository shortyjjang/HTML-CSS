(function(){
    if (typeof(init_brand_cover) == "undefined"){
        return;
    }
    var scrollingSpeed = 700;
    var ignore_scroll_timout = 3000;
    var easingcss3 =  'cubic-bezier(.825,0,.5,1)';
    var $switch_brand = $('.switch_brand');
    var $brand_cover = $('#brand_cover');
    if (window.container_wrapper == undefined) {
        var $container_wrapper = $('#container-wrapper');
    }else{
        var $container_wrapper = window.container_wrapper;
    }
    window.scroll_lock = false;
    window.animation_lock = false;
    window.timeout_handle = false;
    window.animation_timeout_handle = false;
    var $window = $(window);
    var container = $("body");
    var body = $("body");
    function addMouseWheelHandler(){
        var prefix = '';
        var _addEventListener;

        if (window.addEventListener){
            _addEventListener = "addEventListener";
        }else{
            _addEventListener = "attachEvent";
            prefix = 'on';
        }

        // detect available wheel event
        var support = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
            document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
                'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox


        if(support == 'DOMMouseScroll'){
            document[ _addEventListener ](prefix + 'MozMousePixelScroll', MouseWheelHandler, false);
        }

        //handle MozMousePixelScroll in older Firefox
        else{
            document[ _addEventListener ](prefix + support, MouseWheelHandler, false);
        }
    }

    function getAverage(elements, number){
        var sum = 0;

        //taking `number` elements from the end to make the average, if there are not enought, 1
        var lastElements = elements.slice(Math.max(elements.length - number, 1));

        for(var i = 0; i < lastElements.length; i++){
            sum = sum + lastElements[i];
        }

        return Math.ceil(sum/number);
    }
    $(window).resize(function(){
        init_brand_cover();
    });
    function getTransforms(translate3d){
        return {
            '-webkit-transform': translate3d,
            '-moz-transform': translate3d,
            '-ms-transform':translate3d,
            'transform': translate3d
        };
    }

    body.on('click','.switch_brand',function(){
        animatedScroll($brand_cover,$(window).height());
    });
    function animatedScroll(element,targetPos){
        if (targetPos == 0){
            window.display_mode = 0;
            animatedOpacity($container_wrapper,0.0,400);
        }else{
            window.scrollTo(0,0);
            //$container_wrapper.css({'transform':'translateY(25px)','-webkit-transform':'translateY(25px)'});
            window.display_mode = 1;
            setTimeout(function(){
                $container_wrapper.css({'overflow':'initial','height':'initial'});
                //$container_wrapper.css({'transform':'translateY(0)','-webkit-transform':'translateY(0)'});
                animatedOpacity($container_wrapper,1.0,400);
            },400);
        }
        removeAnimation(element);
        addAnimation(element);
        element.css({'margin-top':-targetPos+"px"});
    }
    function animatedOpacity(element,opacity,speed){
        removeAnimation(element);
        addAnimation(element,speed);
        element.css({'opacity':opacity});
    }
    $brand_cover.on("webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd", function(){
        // removeAnimation($brand_cover);
        window.animation_lock = false;
        if(window.display_mode == 0){
            $container_wrapper.css({'opacity':0,'overflow':'hidden','height':0});
        }
    });
    $container_wrapper.on("webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd", function() {
        removeAnimation($container_wrapper);
        window.animation_lock = false;
    });
    function addAnimation(element,speed){
        if(!speed){
            speed = scrollingSpeed;
        }
        var transition = 'all ' + speed + 'ms ' + easingcss3;
        return element.css({
            '-webkit-transition': transition,
            'transition': transition
        });
    };
    function removeAnimation(element){
        element.css({
            '-webkit-transition': 'none',
            'transition': 'none'
        });
    }

    $("#scroll-to-top").click(function(){
        animatedScroll($brand_cover,0);
    });
    var prevTime = new Date().getTime();
    var scrollArr = [];
    var MouseWheelHandler = function(e){
        e = e || window.event;
        var value = e.wheelDelta || -e.deltaY || -e.detail;
        var delta = Math.max(-1, Math.min(1, value));

        var horizontalDetection = typeof e.wheelDeltaX !== 'undefined' || typeof e.deltaX !== 'undefined';
        var isScrollingVertically = (Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta)) || (Math.abs(e.deltaX ) < Math.abs(e.deltaY) || !horizontalDetection);

        if(scrollArr.length > 149){
            scrollArr.shift();
        }
        scrollArr.push(Math.abs(value));

        var curTime = new Date().getTime();
        var timeDiff = curTime-prevTime;
        prevTime = curTime;

        if(timeDiff > 200){
            scrollArr = [];
        }

        var averageEnd = getAverage(scrollArr, 10);
        var averageMiddle = getAverage(scrollArr, 70);
        var isAccelerating = averageEnd >= averageMiddle;




        var windowHeight = $('.brand_cover').height();
        var topPos = $brand_cover.css('margin-top').replace('px','');


        if(delta > 0) {
            if (Math.abs(topPos) == windowHeight && $(window).scrollTop() <=0 ) {
                var targetPos = 0;
            }
        }else if(delta < 0) {
            if (Math.abs(topPos) == 0) {
                var targetPos = windowHeight;
            }
        }
        if (targetPos !==undefined && window.animation_lock == false) {
            window.scroll_lock = true;
            window.animation_lock = true;
            animatedScroll($brand_cover, targetPos);
            if(window.timeout_handle){
                clearTimeout(window.timeout_handle);
            }
            window.timeout_handle = setTimeout(function () {
                window.scroll_lock = false;
            }, ignore_scroll_timout);
        }
        if(isAccelerating && isScrollingVertically) {
            if (window.animation_lock == false){
                if(window.timeout_handle){
                    clearTimeout(window.timeout_handle);
                }
                window.scroll_lock = false;
            }

        }
        if (window.scroll_lock){
            e.preventDefault();
            return;
        }
        if (window.animation_lock){
            e.preventDefault();
            return;
        }


    };
    var touchStartY = 0;
    var touchStartX = 0;
    var touchEndY = 0;
    var touchEndX = 0;
    var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
    var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints))
    var options = {};
    options.normalScrollElements = null;
    options.normalScrollElementTouchThreshold = 5;
    options.fitToSection = true;
    options.scrollBar = false;
    options.autoScrolling = true;
    options.touchSensitivity  = 5;
    function checkParentForNormalScrollElement (el, hop) {
        hop = hop || 0;
        var parent = $(el).parent();

        if (hop < options.normalScrollElementTouchThreshold &&
            parent.is(options.normalScrollElements) ) {
            return true;
        } else if (hop == options.normalScrollElementTouchThreshold) {
            return false;
        } else {
            return checkParentForNormalScrollElement(parent, ++hop);
        }
    }

    function isReallyTouch(e){
        return typeof e.pointerType === 'undefined' || e.pointerType != 'mouse';
    }

    function touchStartHandler(event){
        var e = event.originalEvent;
        if(isReallyTouch(e)){
            /*if (window.animation_lock == false){
                if(window.timeout_handle){
                    clearTimeout(window.timeout_handle);
                }
                window.scroll_lock = false;
            }*/
            var touchEvents = getEventsPage(e);
            touchStartY = touchEvents.y;
            touchStartX = touchEvents.x;
        }
    }

    function getEventsPage(e){
        var events = [];

        events.y = (typeof e.pageY !== 'undefined' && (e.pageY || e.pageX) ? e.pageY : e.touches[0].pageY);
        events.x = (typeof e.pageX !== 'undefined' && (e.pageY || e.pageX) ? e.pageX : e.touches[0].pageX);

        //in touch devices with scrollBar:true, e.pageY is detected, but we have to deal with touch events. #1008
        if(isTouch && isReallyTouch(e) && options.scrollBar){
            events.y = e.touches[0].pageY;
            events.x = e.touches[0].pageX;
        }

        return events;
    }
    function getMSPointer(){
        var pointer;

        //IE >= 11 & rest of browsers
        if(window.PointerEvent){
            pointer = { down: 'pointerdown', move: 'pointermove'};
        }

        //IE < 11
        else{
            pointer = { down: 'MSPointerDown', move: 'MSPointerMove'};
        }

        return pointer;
    }
    function addTouchHandler(){
        if(isTouchDevice || isTouch){
            var MSPointer = getMSPointer();
            $('body').off('touchstart ' +  MSPointer.down).on('touchstart ' + MSPointer.down, touchStartHandler);
            $('body').off('touchmove ' + MSPointer.move).on('touchmove ' + MSPointer.move, touchMoveHandler);
        }
    }
    function touchMoveHandler(event){
        var e = event.originalEvent;
        var windowHeight = $('.brand_cover').height();
        var topPos = $brand_cover.css('margin-top').replace('px','');
        if (!checkParentForNormalScrollElement(event.target) && isReallyTouch(e) ) {
            event.preventDefault();

            var touchEvents = getEventsPage(e);

            touchEndY = touchEvents.y;
            touchEndX = touchEvents.x;

            if (Math.abs(touchStartY - touchEndY) > ($window.height() / 100 * options.touchSensitivity)) {
                if (touchStartY > touchEndY) {
                    if (Math.abs(topPos) == 0) {
                        var targetPos = windowHeight;
                    }
                } else if (touchEndY > touchStartY) {
                    if (Math.abs(topPos) == windowHeight && $(window).scrollTop() <=0 ) {
                        var targetPos = 0;
                    }
                }
            }
            if (targetPos !==undefined) {
                animatedScroll($brand_cover, targetPos);
            }
        }

    }
    addTouchHandler();
    addMouseWheelHandler();
})();