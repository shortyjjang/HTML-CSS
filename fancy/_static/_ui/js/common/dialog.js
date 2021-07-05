jQuery(function($){
    // common popup script
    var $container = $('#popup_container'), prev_dialog=null, next_dialog =null, duration=300, distance=100, container_h;
    var $win = $(window), $body = $('body');

    $container
        .on('click', function(event) {
            if (prev_dialog && prev_dialog.$obj.attr("close-on-click-outside") == "false") return;
            
            if($container.hasClass('edit_shipping_addr')==false && $container.hasClass('checkout-payment')==false && $container.hasClass('get-started')==false && event.target === this && prev_dialog) {
                if ($container.hasClass('create_po')==true) {
                    var ans=confirm("You haven't finished PO yet. Do you want to leave without finishing? Are you sure you want to close this popup?")
                    if(ans ==true) {event.preventDefault();prev_dialog.close();}
                }
                else if( !$container.hasClass("update-browser") ) {
                    event.preventDefault();
                    prev_dialog.close();
                }
            }
        })
        .delegate('.ly-close,.btn-close,.btn-cancel', 'click', function(event){
            if ($container.hasClass('create_po')==true) {
                var ans=confirm("You haven't finished PO yet. Do you want to leave without finishing? Are you sure you want to close this popup?")
                if(ans ==true) {
                    event.preventDefault();
                    if(prev_dialog) prev_dialog.close();
                }
            }else{
                event.preventDefault();
                if(prev_dialog) prev_dialog.close();
            }
        });

    // ESC to close a popup
    $body.on('keyup.popup', function(event){
        if(event.keyCode == 27 && prev_dialog) {
            if (prev_dialog.$obj.attr('close-on-esc') != 'false') {
                prev_dialog.close();
            }
        }
    });

    $.dialog = function(popup_name){
        var $popup = $container.find('>.'+popup_name);
        return {
            name : popup_name,
            $obj : $popup,
            loading : function() {
                var $c = $container.addClass(popup_name).show();
                setTimeout(function(){ $c.css('opacity',1); },1);
                this.$obj.hide();
                prev_dialog = this;
                $container.data('lastest_popup_name', popup_name);
                $container.find('.loader').show();
                return this;
            },
            open : function(back_to_prev_after_close, options){
                if(prev_dialog && prev_dialog.name==this.name && !$container.find('.loader').is(":visible")) {
                    // this is already opened
                    return;
                }

                if(back_to_prev_after_close && prev_dialog){
                    $container.data('lastest_popup_name', popup_name);
                    $container.removeClass(prev_dialog.name).addClass(popup_name);
                    prev_dialog.$obj.hide();
                    this.center().$obj.trigger('open', arguments).show();
                    next_dialog = prev_dialog;
                    prev_dialog = this;
                    return;
                }else{
                    next_dialog = null;
                }

                var $c,h,mt,sc=$win.scrollTop();
                if (!(options && options.disableScrollMod)) {
					$('#container-wrapper').css('top',-sc+'px');
                    $('html').addClass('fixed');
                }
                var that = this;
                var that_arguments = arguments;
                var _prev_dialog = !!prev_dialog;

                if(!container_h) container_h = Math.min($container.height(), $win.innerHeight());
                var after_close;
                after_close = function() {
                    if(Modernizr.csstransitions && that.$obj.attr('popup-slide')=='top') {
                        that.$obj.css('top', '-200%');
                        that.$obj.css('transition', 'top 0.5s');
                        that.$obj.css('-webkit-transition', 'top 0.5s');
                        that.$obj.css('-moz-transition', 'top 0.5s');
                        that.$obj.css('-o-transition', 'top 0.5s');
                        setTimeout(function(){that.$obj.css('top', '0%')},0);
                    }

                    // Double dialog
                    //if ($('.overlay-thing:visible, #overlay-article:visible').length > 0) {
                    //    $container.css('top', 0);
                    //}
                    // else if ($win.innerHeight() < $body[0].scrollHeight) {
                    //     $container.css('top',-sc+'px');
                    // }
                    $container.find('.loader').hide();
                    $c = $container.addClass(popup_name).show().data('scroll-top',sc);

                    that.center().$obj.show().trigger('open', that_arguments).show().siblings('.popup').css('display','');

                    if(!_prev_dialog && $c.length) {
                        setTimeout(function(){ $c.css('opacity',1); },1);
                    }
    
                    prev_dialog = that;
                    $container.data('lastest_popup_name', popup_name);

                    that.$obj.off('transitionend', after_close);

                    return that;
                }
                if(prev_dialog) prev_dialog.close(true, after_close);
                else after_close();
                return this;
            },
            close : function(keep_container, callback){

                var that = this;
                var after_close;

                if (that.$obj.attr('disable-close') == 'true') {
                    return;
                }

                var immediate_close = true;
                if(that.$obj.attr('popup-slide')=='top') {
                    immediate_close = false;
                }

                if(next_dialog && next_dialog.name != popup_name){
                    $container.removeClass(popup_name).addClass(next_dialog.name);
                    $container.data('lastest_popup_name', next_dialog.name);
                    this.$obj.hide();
                    next_dialog.center().$obj.trigger('close').show();
                    prev_dialog = next_dialog;
                    next_dialog = null;
                    return;
                }

                after_close = function() {
                    $container.find('.loader').hide();
                    $c = $container.eq(keep_container?1:0).end();

                    if(keep_container) {
                        $container.removeClass(popup_name);
                    } else {
                        // restore scroll position
                        $('#container-wrapper').css('top',0);
                        $('html').removeClass('fixed');
                        $container.css('top','0px');

                        $win.scrollTop($c.data('scroll-top'));
    
                        if(Modernizr.csstransitions && immediate_close) {
                            $container.css('opacity', 0);
                            setTimeout(function(){ $container.removeClass(popup_name).hide() },duration+100);
                        } else {
                            $container.removeClass(popup_name).hide();
                        }
                    }

                    prev_dialog = null;
                    $popup.trigger('close').hide();

                    that.$obj.off('transitionend', after_close);

                    if(callback===undefined || callback===null) {
                    } else {
                        callback();
                    }
                }

                if(!this.showing() || !this.can_close()){
                    after_close();
                    return;
                }

                if(Modernizr.csstransitions && that.$obj.attr('popup-slide')=='top') {
                    that.$obj.css('top', '0%');
                    that.$obj.css('transition', 'top 0.5s');
                    that.$obj.css('-webkit-transition', 'top 0.5s');
                    that.$obj.css('-moz-transition', 'top 0.5s');
                    that.$obj.css('-o-transition', 'top 0.5s');
                    if(!keep_container) $container.css('opacity', 0);
                    setTimeout(function(){that.$obj.css('top', '-200%')},0);
                    that.$obj.on('transitionend', after_close);
                } else {
                    after_close();
                }

                return this;
            },
            center : function(return_value){
                var mt;
                if(this.$obj.attr('popup-align')=='top') {
                    mt = 0;
                } else {
                    mt = Math.max(Math.floor((container_h-this.$obj.outerHeight())/2)+(+this.$obj.attr('data-offset')||0)-20,5);
                    if($popup.attr('data-margin-top')) mt = $popup.attr('data-margin-top');
                }

                if(return_value) return mt;

                var ml = $(window).width()-$popup.width();

                this.$obj.css({'margin-top': mt+'px', marginLeft:ml/2+'px'});
                return this;
            },
            showing : function(){
                return $container.is(':visible') && $container.hasClass(popup_name);
            },
            can_close : function(){ return true }
        };
    };

    $.dialog.close = function(){
        prev_dialog && prev_dialog.close();
    }

    // window
    var resize_timer = null;
    $win.on(
        'resize',
        function(){
            clearTimeout(resize_timer);
            resize_timer = setTimeout(function(){
                container_h = $win.innerHeight();
                if(prev_dialog) prev_dialog.center();
            }, 100);
        }
    );



    var m = /MSIE ([\d\.]+)/.exec(navigator.userAgent);
    if (m && parseInt(m[1]) < 9) {
        $('body').addClass('ie');
    }
});
