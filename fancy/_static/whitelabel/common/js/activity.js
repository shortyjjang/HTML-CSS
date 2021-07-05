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
		var $tpl_saleitem = $("#tpl-search-saleitem");
		var $tpl_charity  = $("#tpl-search-charity");

		function show_suggest(result, type) {
			var $c = $('.create-post .search .suggest ul');
			$c.empty();

			if (!result.length) {
			$c.hide();
			return;
			}
			$c.show();
			if (type == 'saleitems') {

			_.each(result, function(item) {
				$tpl_saleitem.template({IMAGE:item.sale_item_images[0].thumb_image_url_200, TITLE:item.title, PRICE:item.deal_price, BRAND:item.brand_name, ID:item.sale_id}).appendTo($c);
			});
			
			} else if (type == 'charity') {
			_.each(result, function(item) {
				var n = item.user.num_followers;
				var f_string = (n == 1 ? n + ' FOLLOWER' : n + ' FOLLOWERS')
				$tpl_charity.template({TITLE:item.user.fullname, FOLLOWERS:f_string, ID:item.id, IMAGE:item.user.image_url}).appendTo($c);
			});
			}
		}

        function find(word, type){
            $.ajax({
                type : 'GET',
                url  : '/search.json',
                data : {q:word, target:type, title_only: 'true', per_page:5, from_db:'true', order_by:'alphabetical'},
                dataType : 'json',
                success  : function(json){
                    console.log(json);
		    var result = null;
                    try {
			if (type == 'saleitems') {
			    result = json.sale_items;
			    show_suggest(result, 'saleitems');
			} else if (type == 'charity') {
			    result = json.charities;
			    show_suggest(result, 'charity');
			}
                    } catch(e) {
                        console.log(e);
                    }
                }
            });
        }

        $(".add-posts .buttons")
	    .on('click', function(e){
		e.preventDefault();
		resetPopup();
		$('.popup.create-post').addClass('focus');
		return false;
	    });
	$('.popup.create-post')
	    .on('click', function(e){
		if(event.target === this) {
		    $(this).removeClass('focus');
		}
	    })
	    .find('.ly-close')
	    .on("click", function(e){
		$(this).closest('.create-post').removeClass('focus');
	    });


	function resetPopup() {
	    var $popup = $(".popup.create-post"); 
	    $popup.find('.type button').removeClass('current');
	    $popup.find('.uploaded').hide().data('file', null).data('filename', null)
		.find('img').css('background-image', 'none');
	    $popup.find('.selected,.search').hide();
	}

	function getActivePost() {
	    var $popup = $(".create-post");
	    if ($popup.find('.btn-image').hasClass('current')) return 'image';
	    if ($popup.find('.btn-product').hasClass('current')) return 'product';
	    if ($popup.find('.btn-charity').hasClass('current')) return 'charity';
	    return null;
	}

	function getFormData(type) {
	    var $popup = $(".create-post");
	    var formData = new FormData();
	    var text = $popup.find(".text textarea").val();
	    formData.append('text', text);

	    if (type == 'image') {
		var $container = $popup.find('ul.uploaded');
		if ($container.is(':visible')) {
		    formData.append('image', $container.data('file'), $container.data('filename'));
		} else {
		    type = 'text';
		}
	    } else if (type == 'product') {
		var $container = $popup.find('ul.selected');
		if ($container.is(':visible')) {
		    formData.append('object_id', $container.find('.items').data('item_id'));
		} else {
		    type = 'text';
		}
	    } else if (type == 'charity') {
		var $container = $popup.find('ul.selected');
		if ($container.is(':visible')) {
		    formData.append('object_id', $container.find('.items').data('item_id'));
		} else {
		    type = 'text';
		}
	    } else {
		type = 'text';
	    }
	    formData.append('type', type);

	    return formData;
	}

	function showPostButtonIfAvailable() {
	    var $popup = $(".create-post");
	    var available = ($popup.find(".text textarea").val().length > 0);
	    if (available) {
			if ($popup.find('.text').find('.trick-value').outerHeight()>18) {
				$popup.find('.text').find('.trick-value').text($popup.find(".text textarea").val()).end().find('textarea').css('height',($popup.find('.text').find('.trick-value').outerHeight()+18)+'px').css('padding-top','0');
			}else{
				$popup.find('.text').find('.trick-value').text($popup.find(".text textarea").val()).end().find('textarea').css('height',$popup.find('.text').find('.trick-value').outerHeight()+'px').css('padding-top','');
			}
		$popup.find('.share-post.buttons').removeAttr('disabled');
	    } else {
		$popup.find('.text').find('.trick-value').text('').end().find('textarea').css('height','').css('padding-top','');
		$popup.find('.share-post.buttons').prop("disabled", true);
	    }
	    return available;
	}

        $(".create-post")
	    .on('click', '.share-post.buttons', function(e) {
		e.preventDefault();
		var type = getActivePost();
		var formData = getFormData(type);
		var url = '/add-activity-post.json'
		var $this = $(this);
		$this.prop('disabled', true);
		$.ajax({
                    url: url,
                    method: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false
		}).then(function(res) {
		    if (res.status_code === 1) {
			location.reload();
		    }
                }).fail(function(res) {
		    $this.removeAttr('disabled');
		    alertify.alert(res.responseText);
                })
	    })
	    .on('keyup', '.text textarea', function(e) {
			showPostButtonIfAvailable();
	    })
	    .on('click', '.btn-image', function(e) {
		$(this).closest('.type')
		    .find('button').removeClass('current').end().end().addClass('current');
		$(this).closest('.popup').find('.selected,.search').hide();
		//$(this).closest('.popup').find('.uploaded').hide().data('file', null).data('filename', null)
		//    .find('img').css('background-image', 'none');
		//var input = $(this).closest('.popup').find('.btn-image input');
		//input.replaceWith(input.val('').clone(true));
	    })
	    .on('click', '.search .suggest .info', function(e) {
                e.preventDefault();
		var $info = $(this).closest('.popup').find('.search').hide().end().find('.selected').find('.info');
		$info.html($(this).html()).end().show();
		$info.closest("li").data($(this).closest("li").data());
		showPostButtonIfAvailable();
	    })
	    .on('click', '.selected .delete', function(e) {
                e.preventDefault();
		$(this).closest('.popup').find('.selected').hide().find(".info").empty();
		$(this).closest('.popup').find('.search').show().find('input').val('').end().find('.suggest').hide().find('ul').empty();
		showPostButtonIfAvailable();
	    })
	    .on('click', '.uploaded .delete', function(e) {
                e.preventDefault();
		$(this).closest('.popup').find('.uploaded').hide().data('file', null).data('filename', null)
		    .find('img').css('background-image', 'none');
		var input = $(this).closest('.popup').find('.btn-image input');
		input.replaceWith(input.val('').clone(true));
		showPostButtonIfAvailable();
	    })
            .on('change', '#activity-image-upload', function() {
		if (!this.value) {
                    return false;
		}
		var reader = new FileReader();
		var file = $('#activity-image-upload').prop('files')[0];
		var $container = $(this).closest('.popup').find('.uploaded');
		$container.find('img').css('background-image', 'none').end().show();
		reader.onload = function(event) {
                    $container.data('file', file)
                    $container.data('filename', file.name)
		    $container.find('img').css('background-image', 'url(' + event.target.result + ')');
		    showPostButtonIfAvailable();
		};
		reader.readAsDataURL(file);
            })
	    .on('click', '.btn-product', function(e) {
                e.preventDefault();
		if ($(this).hasClass('current')) {
		    return false;
		}
		$(this).closest('.type')
		    .find('button').removeClass('current').end().end().addClass('current');
		$(this).closest('.popup').find('.uploaded, .selected').hide().end().find('.search').show().find('input').attr('placeholder','Search for a product').val('').end().find('.suggest').hide().find('ul').empty();
	    })
	    .on('click', '.btn-charity', function(e) {
                e.preventDefault();
		if ($(this).hasClass('current')) {
		    return false;
		}
		$(this).closest('.type')
		    .find('button').removeClass('current').end().end().addClass('current');
		$(this).closest('.popup').find('.uploaded, .selected').hide().end().find('.search').show().find('input').attr('placeholder','Search for a charity').val('').end().find('.suggest').hide().find('ul').empty();
	    });

	var $textbox = $('.create-post .search > input');
	var prev_keyword = '';
	var timer = null;

	$textbox.on('keyup', function(e) {
            var kw = $.trim($textbox.val());
	    var $cont = $('.create-post .search .suggest ul');
	    var type = 'saleitems';
	    if ($('.create-post .btn-product').hasClass('current')) {
		type = 'saleitems';
	    } else if ($('.create-post .btn-charity').hasClass('current')) {
		type = 'charity';
	    } else {
		return false;
	    }

            $textbox.attr('data-prev-val', kw);
            if(!kw.length) {
		$cont.empty().hide();
                return ;
            }
            if(kw != prev_keyword ) {
                prev_keyword = kw;
                $cont.empty().hide();
                clearTimeout(timer); 
		timer = setTimeout(function(){ find(kw, type); }, 500);
            } else {
		if (!$cont.find('li').length) {
                    clearTimeout(timer); 
		    timer = setTimeout(function(){ find(kw, type); }, 500);
		}
	    }
	})

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

    })
