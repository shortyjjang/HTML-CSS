(function() {
        var opts = {
          lines: 9, // The number of lines to draw
          length: 13, // The length of each line
          width: 7, // The line thickness
          radius: 16, // The radius of the inner circle
          corners: 0.9, // Corner roundness (0..1)
          rotate: 69, // The rotation offset
          direction: 1, // 1: clockwise, -1: counterclockwise
          color: '#87888a', // #rgb or #rrggbb or array of colors
          speed: 1.5, // Rounds per second
          trail: 64, // Afterglow percentage
          shadow: false, // Whether to render a shadow
          hwaccel: false, // Whether to use hardware acceleration
          className: 'spinner', // The CSS class to assign to the spinner
          zIndex: 2e9, // The z-index (defaults to 2000000000)
          top: 'auto', // Top position relative to parent in px
          left: 'auto' // Left position relative to parent in px
        };
        var target = document.getElementById('content');
        //var spinner = new Spinner(opts).spin(target);
    })();

    $(function(){

        if(location.hash.startsWith("#comment")){
            var $el = $(location.hash);
            $el.addClass('highlight');
            $('html').animate({scrollTop: $el.offset().top - $("#header").height()-10 }, 200, 'easeInOutExpo');
            setTimeout(function(){
                $el.removeClass('highlight');
            },5000)
        }

        $.infiniteshow({
            itemSelector:'#content ol.activityList > li',
            streamSelector:'#content ol.activityList',
            post_callback: function($items){
                $items.find(".video_player").videoPlayer({autoplay:true, muted:true});
                var H = $items.find('figcaption').find('.description').hide().end().outerHeight();
                if ($items.find('figure').outerHeight()<$items.find('figcaption').find('.description').show().end().outerHeight()) {
                    $items.find('.description').height($items.find('figure').outerHeight() - H - 4).end().addClass('fixed');
                }
            },
            prefetch:true            
        })

        $("#content")
            .delegate(".activityFeed div.thumbnail.clickable > .thumbnail-slide > a","click", function(e){
                e.preventDefault();
                var $this = $(this);
                var $li = $this.closest("li.activityFeed");

                $this.parent().find("a").removeClass("current");
                $this.addClass("current");
                $li.find(".activityItem").hide().filter("div[data-id="+ $this.attr("data-id") +"]").show();
            })
            .delegate(".activityFeed .pagination a.prev","click", function(e){
                e.preventDefault();
                var $this = $(this), thumW;
                if($this.hasClass('disabled')) return;
                var $li = $this.closest("li.activityFeed");
                var $current = $li.find(".thumbnail-slide > a.current");
                var $paging = $li.find(".thumbnail-slide");
                if($(window).width() > 800) {thumW = $paging.find('a:first-child').width()+15;
                } else {thumW = $paging.find('a:first-child').width()+10;}
                var left = $paging.position().left - parseInt($li.outerWidth()/thumW) * thumW;
                left = Math.max(0, left);

                $paging.css('left', left +'px');

                if(parseInt(left)==0){
                    $this.addClass('disabled');
                }
                $this.next().removeClass('disabled');
            })
            .delegate(".activityFeed .pagination a.next","click", function(e){
                e.preventDefault();
                var $this = $(this), thumW;
                if($this.hasClass('disabled')) return;
                var $li = $this.closest("li.activityFeed");
                var $current = $li.find(".thumbnail-slide > a.current");
                var $paging = $li.find(".thumbnail-slide");
                if($(window).width() > 800) {thumW = $paging.find('a:first-child').width()+15;
                } else {thumW = $paging.find('a:first-child').width()+10;}
                var left = $paging.position().left + parseInt($li.outerWidth()/thumW) * thumW;
                left = Math.min($li.outerWidth()-$paging.width(), left);
                $paging.css('left', left +'px');
                if(parseInt(left)>=$li.outerWidth()-$paging.width()){
                    $this.addClass('disabled');
                }
                $this.prev().removeClass('disabled');
            })
            .delegate('.btn-like', 'click', function(e){
                e.preventDefault();
                var $this = $(this), liked = $this.hasClass('on'), tag_count = $(this).data('like_count'), object_id=$this.data('object_id');
                if ($this.hasClass('login-required')) return;
                if(liked) tag_count--;
                else tag_count++;

                $(this).data('like_count', tag_count);
                liked = !liked;

                $this.nextAll("a.liked_count").remove();
                if(tag_count>0){
                    var html = '';
                    var other_count = tag_count-1;
                    if(liked) other_count--;

                    if(other_count>=1) html+=' + <a href="#" class="liked_count">'+other_count+' other'+(other_count>1?'s':'')+'</a>';
                    $this.closest('.like').append($(html));
                }
                if(liked && tag_count==1){
                    $this.html('You liked this').addClass('on');
                }else if(liked && tag_count>1){
                    $this.html('You,').addClass('on');
                }else if(tag_count>1){
                    $this.html('').removeClass('on');
                }else{
                    $this.html('Like').removeClass('on');
                }

                $.post('/'+(!liked?'remove':'add')+'_activity_like.json', {object_id:object_id}, function(json){
                    var tag_count = json.tag_count, liked = json.tagged_by_me;
                })
            })
            .delegate('.sns .share-copy','mousedown',function(event) {
                event.preventDefault();
                var link = $(this).data('link');
                Gear.prepareClipboard(link); // see common.js
            })
            .delegate('.sns .share-copy','mouseup',function(event) {
                event.preventDefault();
                Gear.copyToClipboard(); // see common.js
            })
            .delegate('.sns .share-copy','click',function(event) {
                event.preventDefault();
                var $link = $(this);
                var $tooltip = $link.find('em')
                var originalLabel = $tooltip.text();
                $tooltip.text('Link Copied').css('margin-left',-$tooltip.outerWidth()/2+'px');
                $tooltip.addClass('_copied');
                // restore label
                setTimeout(function(){
                    $tooltip.text(originalLabel).css('margin-left',-$tooltip.outerWidth()/2+'px');
                    $tooltip.removeClass('_copied');
                }, 5000)
            });

        $(".video_player").videoPlayer({autoplay:true, muted:true});
        setTimeout(function(){
            $('.activity .activityFeed').each(function(){
                var $this = $(this),  W = $this.outerWidth();
                if (W < $this.find('.thumbnail-slide').outerWidth() && $(window).width() > 720) {
                    $this.find('.pagination').show();
                }else{
                    $this.find('.pagination').hide();
                }
            }).end()
            .find('.activityItem').each(function(){
                var $this = $(this), H = $this.find('figcaption').find('.description').hide().end().outerHeight() - 4;
                if ($this.find('figure').outerHeight()<$this.find('figcaption').find('.description').show().end().outerHeight()) {
                    $this.find('.description').height($this.find('figure').outerHeight() - H).end().addClass('fixed');
                }
            });
            if($(window).width()<720){
                $('#sidebar .section > ul > li').show();
            }else{
                $('#sidebar .section > ul > li').hide().filter('.current').show();
            }
        },100);
        //comment


        $(window).resize(function(){
            if($(window).width()<720){
                $('#sidebar .section > ul > li').show();
            }else{
                $('#sidebar .section > ul > li').hide().filter('.current').show();
            }
            $('.activity .activityFeed').each(function(){
                var $this = $(this),  W = $this.outerWidth();
                if (W < $this.find('.thumbnail-slide').outerWidth() && $(window).width() > 720) {
                    $this.find('.pagination').show();
                }else{
                    $this.find('.pagination').hide();
                }
            }).end()
            .find('.activityItem').each(function(){
                var $this = $(this), H = $this.find('figcaption').find('.description').hide().end().outerHeight() - 4;
                if ($this.find('figure').outerHeight()<$this.find('figcaption').find('.description').show().end().outerHeight()) {
                    $this.find('.description').height($this.find('figure').outerHeight() - H).end().addClass('fixed');
                }
            });
        });

        //sidebar
        $(window).scroll(function(){
            $('.activity .activityFeed').each(function(){
                var $this = $(this),  W = $this.outerWidth();
                if (W < $this.find('.thumbnail-slide').outerWidth() && $(window).width() > 720) {
                    $this.find('.pagination').show();
                }else{
                    $this.find('.pagination').hide();
                }
            }).end()
            .find('.activityItem').each(function(){
                var $this = $(this), H = $this.find('figcaption').find('.description').hide().end().outerHeight() - 4;
                if ($this.find('figure').outerHeight()<$this.find('figcaption').find('.description').show().end().outerHeight()) {
                    $this.find('.description').height($this.find('figure').outerHeight() - H).end().addClass('fixed');
                }
            });
            if( $("html").hasClass("fixed") ) return;
            if ($('#content').outerHeight() > $('#sidebar').outerHeight() && $(window).width() > 720) {
              var setTop = $('#content').offset().top;
              if ($('#sidebar').outerHeight()+setTop > $(window).height()) {
                if($(window).scrollTop()>$('#sidebar').outerHeight()+setTop-$(window).height()){
                    if ($(window).scrollTop()<$('#wrap').outerHeight()-$('#footer').height()-$(window).height()){
                        $('#sidebar').addClass('fixed').addClass('bottom').css('top','').removeClass('stop');
                    }else{
                        $('#sidebar').addClass('fixed').addClass('bottom').css('top','').addClass('stop');
                    }
                }else{
                    $('#sidebar').removeClass('fixed').removeClass('bottom').css('top','');
                }
              }else{
                if ($(window).scrollTop()>setTop) {
                    $('#sidebar').addClass('fixed').css('top',setTop+'px');
                }else{
                    $('#sidebar').removeClass('fixed').css('top','');
                }
              }
            }
        });

        $("#sidebar")
            .on("click", ".section .prev:not(.disabled)", function(e){
                e.preventDefault();
                var $li = $(this).closest('.section').find("li:visible");
                $li.removeClass('current').prev().addClass('current').show().end().hide();
                if( !$li.prev().prev().length ) $(this).addClass('disabled')
                $(this).next().removeClass('disabled');
            })
            .on("click", ".section .next:not(.disabled)", function(e){
                e.preventDefault();
                var $li = $(this).closest('.section').find("li:visible");
                $li.removeClass('current').next().addClass('current').show().end().hide();
                if( !$li.next().next().length ) $(this).addClass('disabled')
                $(this).prev().removeClass('disabled'); 
            })

        function addComment(activity_id, parent_id, comment){
            var url = '/add_activity_comment.json';
            var object_id = activity_id;
            if(parent_id){
                url = '/add_comment_comment.json';
                object_id = parent_id;
            }
            $.post(url, {object_id:object_id, comment:comment}, function(res){
                var $template = $("#commentTemplate");
                var $el = $template.template({comment_id:res.comment.id, comment:res.comment.comment});
                var $parent = $("li[data-activity-id="+activity_id+"] > .comment > ul");
                if(parent_id){
                    $parent = $parent.find("[data-comment-id="+parent_id+"] > ul");
                    $parent.prev('.form').hide();
                }
                $el.prependTo( $parent );    
            });
        }


        function deleteComment(activity_id, parent_id, comment_id){
            var url = '/remove_activity_comment.json';
            var object_id = activity_id;
            if(parent_id){
                url = '/remove_comment_comment.json';
                object_id = parent_id;
            }
            $.post(url, {object_id:object_id, comment_id:comment_id}, function(){
                $(".comment > ul li[data-comment-id="+comment_id+"]").remove();
            });
        }

        $(".comment")
            .on('click', '.reply', function(e){
                e.preventDefault();
                $(this).closest('.dialog').next('.form').show();
            })
            .on('click', '.delete', function(e){
                e.preventDefault();
                var $this = $(this);
                var original_labels = alertify.labels;
                alertify.set({
                    labels: {
                        ok     : "Delete",
                        cancel : "Cancel"
                    }
                });
                alertify.confirm('Are you sure you want to delete your comment?', function(e){
                    if(e){
                        var activity_id = $this.closest('[data-activity-id]').data('activity-id');
                        var parent_id = $this.closest('li[data-comment-id]').parents('li[data-comment-id]').data('comment-id');
                        var comment_id = $this.closest('li[data-comment-id]').data('comment-id');
                        deleteComment(activity_id, parent_id, comment_id);
                    }
                })
                alertify.set({labels: original_labels})
            })
            .on('click', '.btn-add', function(e){
                e.preventDefault();
				var comment = $(this).closest('.form').find('input:text').val();
				var activity_id = $(this).closest('[data-activity-id]').data('activity-id');
				var parent_id = $(this).closest('li[data-comment-id]').data('comment-id');
				if(!comment){
					alertify.alert("Please input a comment");
					return;
				}
				addComment(activity_id, parent_id, comment);
				$(this).closest('.form').find('input:text').val('');
                $(this).closest('.form').find('.btn-add').attr('disabled','disabled');
            })
            .on('keyup', 'input:text', function(e){
				if(e.keyCode=='13'){
                    e.preventDefault();
                    var comment = $(this).val();
                    var activity_id = $(this).closest('[data-activity-id]').data('activity-id');
                    var parent_id = $(this).closest('li[data-comment-id]').data('comment-id');
                    if(!comment){
                        alertify.alert("Please input a comment");
                        return;
                    }
                    addComment(activity_id, parent_id, comment);
                    $(this).val('');
                    $(this).blur();
                }else{
                    if (!$(this).val()) {
                        $(this).closest('.form').find('.btn-add').attr('disabled','disabled');
                    }else{
                        $(this).closest('.form').find('.btn-add').removeAttr('disabled');
                    }
                    
                }
            })

    // hack for ios safari virtual keyboard problem. 
    // https://stackoverflow.com/questions/24557780/ios-7-fixed-footer-toolbar-breaks-on-virtual-keyboard
    /*var userAgent = window.navigator.userAgent;
    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
        $(document).on('focus', '.popup.create-post textarea', function() {
            $(".popup.create-post").css({height: '100vh'});
        });
        $(document).on('blur', '.popup.create-post textarea', function() {
            $(".popup.create-post").css({height: '100%'});
        });
    }*/

})
