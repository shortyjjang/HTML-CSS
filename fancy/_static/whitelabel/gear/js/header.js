jQuery(function($) {
    $('#header #keyword-search-input, #header #keyword-search-input-mini').focusin(function(event) {
		$(this).closest('#header').addClass('search');
    });
    $('#header #keyword-search-input, #header #keyword-search-input-mini').focusout(function(event) {
        var $this = $(this);
		setTimeout(function(){
            $this.closest('#header').removeClass('search');
        },200);
    });

    $('#header .menu > li.category').hover(function(){
        $(this).addClass('hover');
    },function(){
        $(this).removeClass('hover');
    });
    $('#header .menu .trick').hover(function(){
        $(this).closest('li').removeClass('hover');
    });

    $("#mailjet_form").submit(function() {
        var $this = $(this), $email = $this.find('input.email_text');
        var email = $.trim($email.val());
        if (email.length == 0) {
            alertify.alert('Please enter an email address');
            $email.focus();
            return false;
        }
        // see common/util.js to change emailRegEx
        if (!emailRegEx.test(email)){
            alertify.alert('Please enter a valid email address');
            $email.focus();
            return false;
        }
        $email.val(email);
        $('#footer .newsletter .success').show(); 
        setTimeout(function(){
            $email.val('');
            $('#footer .newsletter .success').fadeOut(); 
        },6000)
        return true;
    });

})

jQuery(function($){
    if(!window.Fancy) Fancy = {};
    Fancy.ActivitiesPreview = {
        $sensor: $(".header-wrapper a.activity"),
        $trick: $(".header-wrapper .alertify .trick"),
        $pulldown: $(".header-wrapper .short-feed"),
        $activityloading: $(".header-wrapper .short-feed .loading"),
        $activitylist: $(".header-wrapper .short-feed ul"),
        $activityempty: $(".header-wrapper .short-feed .empty"),
        $activitymore: $(".header-wrapper .short-feed .more"),
        loaded: false,
        init: function () {
            var preview = this;
            this.$trick.click(function (e) {
                preview.closePulldown();
            });
            this.$sensor.click(function (e) {
                if( preview.$pulldown.closest('li').hasClass("hover")){
                    preview.closePulldown();
                }else{
                    preview.openPulldown();
                }
            });
            this.$pulldown.closest('li').removeClass('hover').end().removeClass('loading');
            
            var calling = false;
            var isLast = false;
            /*this.$activitylist.scroll(function(e){
                if(calling || isLast) return;
                var $list = preview.$activitylist;
                var scrollTop = $list.scrollTop();
                var scrollHeight = $list[0].scrollHeight;
                if(scrollTop > scrollHeight - $list.height() - 400 ){
                    var aid = $list.find("li[data-aid]:last").attr('data-aid');
                    calling = true;
                    $.get("/_notifications.html", {cursor:aid}, function (data) {
                        if(!data) isLast=true;
                        var lastTimeSince = preview.$activitylist.find("li[data-timesince]:last").attr('data-timesince');
                        preview.$activitylist.append(data);
                        preview.$activitylist.find("li[data-timesince='"+lastTimeSince+"']").not(':first').remove();
                    }).always(function () {
                        calling = false;
                    });
                }
            });*/
        },
        openPulldown: function () {
            var preview = this;
            var maxFetch = 20;
            var maxShow = 4;
            this.$pulldown.closest('li').addClass('hover');
            $('html').trigger('lockScroll');

            if (!this.loaded) {
                this.loaded = true;
                this.$pulldown.addClass('loading');
                
                $.get("/_notifications.html", {}, function (data) {
                    preview.$activitylist.empty();                
                    preview.$activitylist.html( $(data).html() );

                    if(!preview.$activitylist.find("li").length && preview.$activityempty[0]){
                        preview.$activityempty.show();
                        preview.$activitylist.hide();
                    }else{
                        preview.$activitymore.show();
                    }

                    setTimeout(function(){
                        preview.$activitylist.find("li.unread").removeClass('unread');
                    }, 3000);

                }).always(function () {
                    preview.$pulldown.removeClass('loading');
                }).fail(function() {
                    preview.loaded = false;
                });
            }
        },
        closePulldown: function () {
            this.$pulldown.closest('li').removeClass('hover');
            $('html').trigger('unlockScroll');
        }
    };

    Fancy.ActivitiesPreview.init();
});


jQuery(function($) {
    $('html')
        .bind('lockScroll', function(e){
            if( $('html').hasClass('fixed') ) return;
			if ($('#container-wrapper').hasClass('detail')) return;
            var sc = $(window).scrollTop(), $container = $('#wrap > #container-wrapper');
            if ($('#container-wrapper').hasClass('activity')) {
				var sidebar_class, sidebar_style;
				sidebar_class = $('.activity #sidebar').attr('class');
				sidebar_style = $('.activity #sidebar').attr('style');
            }
            
            $container.attr('position',sc);
            $('html').addClass('fixed');
            $container.css('top',-sc+'px');
            if($(window).width()>720){
				if ($('#container-wrapper').hasClass('activity')) {
				$('.activity #sidebar').attr('class',sidebar_class).attr('style',sidebar_style).css('top','');
				}
            }
        })
        .bind('unlockScroll', function(e){
            if( !$('html').hasClass('fixed') ) return;
			if ($('#container-wrapper').hasClass('detail')) return;
            var $container = $('#wrap > #container-wrapper');
            $('html').removeClass('fixed');
            $container.css('top','0');
			$(window).scrollTop($container.attr('position')||0);
            if($(window).width()>720 && $('#container-wrapper').hasClass('activity') && $('#content').outerHeight() > $('#sidebar').outerHeight()) {
			  var setTop = $('#content').offset().top;
			  if ($('#sidebar').outerHeight()+setTop > $(window).height()) {
				if($container.attr('position')>$('#sidebar').outerHeight()+setTop-$(window).height()){
					if ($container.attr('position')<$('#wrap').outerHeight()-$('#footer').height()-$(window).height()){
						$('#sidebar').addClass('fixed').addClass('bottom').css('top','').removeClass('stop');
					}else{
						$('#sidebar').addClass('fixed').addClass('bottom').css('top','').addClass('stop');
					}
				}else{
					$('#sidebar').removeClass('fixed').removeClass('bottom').css('top','');
				}
			  }else{
				if ($container.attr('position')>setTop) {
					$('#sidebar').addClass('fixed').css('top',setTop+'px');
				}else{
					$('#sidebar').removeClass('fixed').css('top','');
				}
			  }
            }
			$container.removeAttr('position');
        })
});