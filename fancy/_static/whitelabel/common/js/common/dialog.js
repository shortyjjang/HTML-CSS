jQuery(function($){
    // common popup script
    var $container = $('#popup_container'), prev_dialog=null, next_dialog =null, duration=300, distance=100, container_h;
    var $win = $(window), $body = $('body');

    $container
        .on('click', function(event){
            if(event.target === this && prev_dialog) {
                event.preventDefault();
                prev_dialog.close();
            }
        })
        .delegate('.ly-close,.btn-close,.btn-cancel', 'click', function(event){
            event.preventDefault();
            if(prev_dialog) prev_dialog.close();
        });

    // ESC to close a popup
    $body.on('keyup.popup', function(event){
        if(event.keyCode == 27 && prev_dialog) prev_dialog.close();
    });

    $.dialog = function(popup_name){
        var $popup = $container.find('>.'+popup_name);
        return {
            name : popup_name,
            $obj : $popup,
            loading : function() {
                var $c = $container.addClass(popup_name).show();
                setTimeout(function(){ $body.addClass('popup-on');$c.css('opacity',1); },1);
                this.$obj.hide();
                prev_dialog = this;
                $container.data('lastest_popup_name', popup_name);
                $container.find('.loader').show();
                return this;
            },
            open : function(back_to_prev_after_close){
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
                var that = this;
                var that_arguments = arguments;

                if(!container_h) container_h = Math.min($container.height(), $win.innerHeight());
                var after_close;
                after_close = function() {
                    $container.find('.loader').hide();
                    $c = $container.addClass(popup_name).show();

                    that.center().$obj.show().trigger('open', that_arguments).show().siblings('.popup').css('display','');

                    if($c.length) {
                        setTimeout(function(){ $body.addClass('popup-on');$c.css('opacity',1); },1);
                    }
    
                    prev_dialog = that;
                    $container.data('lastest_popup_name', popup_name);

                    var modal = that.$obj.data('modal');
                    if(modal != undefined) {
                        $container.data('modal', modal);
                    }

                    that.$obj.off('transitionend', after_close);

                    return that;
                }
                $('#popup_container').data('modal', true);
                if(prev_dialog) prev_dialog.close(true, after_close);
                else after_close();
                return this;
            },
            before_close: null,
            close : function(keep_container, callback){
                var that = this;

                if(!this.can_close()) return;
                $container.removeAttr('modal');

                if(next_dialog && next_dialog.name != popup_name){
                    $container.removeClass(popup_name).addClass(next_dialog.name);
                    $container.data('lastest_popup_name', next_dialog.name);
                    this.$obj.hide();
                    next_dialog.center().$obj.trigger('close').show();
                    prev_dialog = next_dialog;
                    next_dialog = null;
                    return;
                }

                var after_close = function() {
                    $container.find('.loader').hide();
                    $c = $container.eq(keep_container?1:0).end();

                    if(keep_container) {
                        $container.removeClass(popup_name);
                        $body.removeClass('popup-on');
                    } else {
                        $container.removeClass(popup_name).hide();
                        $body.removeClass('popup-on');
                    }

                    prev_dialog = null;
                    $popup.trigger('close').hide();

                    that.$obj.off('transitionend', after_close);

                    if(callback===undefined || callback===null) {
                    } else {
                        callback();
                    }
                }

                if (that.before_close) {
                    if(!this.showing() || !this.can_close()){
                        that.before_close(after_close)
                        return;
                    }
                    that.before_close(after_close)
                } else{
                    if(!this.showing() || !this.can_close()){
                        after_close();
                        return;
                    }
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
            can_close : function(value){ 
                if(value===true || value===false){
                    $container.data('modal', value);
                }else{
                    if( $container.data('modal') === false ) return false;
                    return true;
                }
            }
        };
    };

    // window
    $win.on(
        'resize',
        function(){
            container_h = $win.innerHeight();
            if(prev_dialog) prev_dialog.center();
        }
    );

    var m = /MSIE ([\d\.]+)/.exec(navigator.userAgent);
    if (m && parseInt(m[1]) < 9) {
        $('body').addClass('ie');
    }
});
