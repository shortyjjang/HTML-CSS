
jQuery(function($) {
    var $image = $('#content .figure-product .image-container .image-wrap img')
    var $video_player = $('#content .figure-product .image-container .image-wrap .video_player')
    $video_player.videoPlayer({autoplay:true, muted:true});

    function initReviewElement($el) {
    	var $review_video_player = $el.find('.video_player');
    	$review_video_player.videoPlayer({autoplay:false, muted:true});
    	$review_video_player.find("button").hide().end().find(".btn-play").show();
    	$el.on("click", ".btn-play", function(event) {
    	    var $player = $(this).closest(".video_player");
    	    if (!$player.hasClass('full')) {
    		$player.addClass('full').removeClass('close');
    		$player.find("button").show();
    		$player.find('.btn-play').click();
    	    } 
    	});

    	$el.on("click", ".btn-fullscreen", function(event) {
    	    event.preventDefault();
    	    var $player = $(this).closest(".video_player");
    	    if ($player.hasClass('full')) {
        		$player.find('.btn-pause').click();
        		$player.find("button").hide().end().find(".btn-play").show();
        		$player.removeClass('full').addClass("close");
    	    } 
    	});
    }

    initReviewElement($(".reviewPost"));

    var $paging = $('#content .figure-product .paging'), $paging_buttons = $('#content .figure-product .paging > a')
    var $prev = $(".figure-product .paging-wrap a.prev"), $next = $(".figure-product .paging-wrap a.next")
    $paging_buttons.click(function(event) {
        event.preventDefault()
        if($(this).hasClass('current')) return

        $(this).siblings('a.current').removeClass('current')
        $(this).addClass('current')
    	if ($(this).attr('video') == 'true') {
    	    $video_player.find('.btn-play').click();
    	    $video_player.show();
    	    $image.hide();
    	} else {
            var image = $(this).data('image'), image2x = $(this).data('image2x'), original_image = $(this).data('original-image'), isFit = $(this).hasClass('fit');
            if(isRetina()) image = image2x;
            $image.attr('src', image).data('original-image', original_image||image);
    	    $video_player.hide();
    	    $video_player.find('.btn-pause').click();
            if(isFit) $image.closest('.image-wrap').addClass('fit');
            else $image.closest('.image-wrap').removeClass('fit');
    	    $image.show();
    	}
    }).filter(":eq(0)").trigger('click');
    $paging_buttons.bind('change_option', function(event, option_id){
        var $option_images = $paging_buttons.filter('[data-optionid]').filter('[data-optionid!=None]').hide().filter('[data-optionid='+option_id+']').show();
        $paging_buttons.filter("[data-optionid=None]").show();
        if($option_images.length){
            $paging_buttons.filter("[data-optionid=None]").each(function(){
                if($(this).data('options').hide_for_option) $(this).hide();
            })
        }
        initImageList();
        if( $option_images.length) $option_images.filter(':eq(0)').trigger('click');
        else $paging_buttons.filter(':visible').filter(':eq(0)').trigger('click');
    });

    var page = 1;
    
    function initSlide($el){
        var $list = $el.find(".paging"), $li = $list.find("a:visible"), $prev = $el.find("a.prev"), $next = $el.find("a.next"), maxPage = Math.ceil($li.length/5);
        $prev.addClass('disabled');
        $next.addClass('disabled');
        if( $li.length > 5 ){
            $next.removeClass('disabled');
        }
        $list.animate({'scrollLeft': 0}, 300);

        $el.off('click', 'a.prev').off('click', 'a.next')
            .on('click', 'a.prev', function(e){
                e.preventDefault();
                var $this = $(this);
                if( $this.hasClass('disabled')) return;
                page--;
                var left = (page-1)*$list.width();

                $this.addClass('disabled');
                $list.animate({'scrollLeft': left}, 300, 'easeInOutExpo', function(){
                    if( page > 1 ) $this.removeClass('disabled');
                    $next.removeClass('disabled');    
                });
            })
            .on('click', 'a.next', function(e){
                e.preventDefault();
                var $this = $(this);
                if( $this.hasClass('disabled')) return;
                page++;
                var left = (page-1)*$list.width();
                $this.addClass('disabled');
                $list.animate({'scrollLeft': left}, 300, 'easeInOutExpo', function(){
                    if( page < maxPage) $this.removeClass('disabled');
                    $prev.removeClass('disabled');    
                });
            })


        $(window).resize(function(){
            var left = (page-1)*$list.width();
            $list.scrollLeft(left);
        })
    }

    function initImageList(){
        var imageCnt = $paging_buttons.filter(':visible').length;
        if(imageCnt > 5){
            $next.removeClass('disabled');
        }
        initSlide( $(".figure-product .paging-wrap") );
    }

    initImageList();

    var $btn_cart = $('.detail #content .btn-cart')
    var $options = $('.detail #content .option select')
    var $quantity = $('.detail #content .qty select')
    $btn_cart.click(function(event) {
        var $this = $(this)
        var sale_item_id = $this.data('sale-item-id')
        var seller_id = $this.data('seller-id')
        var price = $(this).data('sale-item-price') || 0;
        var option_id = $options.val()
        var quantity = $quantity.val()

        if($this.hasClass('loading')) {
            return
        }
        $this.prop('disabled',true)
        $this.addClass('loading')
        $.post('/add_item_to_cart.json', {'sale_item_id':sale_item_id, 'seller_id':seller_id, 'option_id': option_id, 'quantity': quantity}, function(res) {
            if(res.status_code>0) {
                try { fbq('track', 'AddToCart', {content_type:'product', content_ids:[sale_item_id], value:price, currency:'USD'}); } catch (e) {}
                window.location = '/cart'
            } else {
                if(res.message) {
                    alertify.alert(res.message)
                }
            }
        }).fail(function(xhr) {
            alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
        }).always(function() {
            $this.prop('disabled',false)
            $this.removeClass('loading')
        })
    })

    $(document.body)
        .on('mousedown', '.icon-link', function(event) {
            event.preventDefault();
            var $link = $(this);
            Gear.prepareClipboard(location.protocol + '//' + location.hostname + $link.attr('href')); // see common.js
        })
        .on('mouseup', '.icon-link', function(event){
            event.preventDefault();
            Gear.copyToClipboard(); // see common.js
        })
        .on('click', '.icon-link', function(event) {
            event.preventDefault();
            var $link = $(this);
            var $tooltip = $link.find('em')
            var originalLabel = $tooltip.text();
            $tooltip.text('Link Copied');
            $tooltip.addClass('_copied');
            // restore label
            setTimeout(function(){
                $tooltip.text(originalLabel);
                $tooltip.removeClass('_copied');
            }, 5000)
        })

    function setPrice(val) {
        var $priceEle = $('#content p.price');
        var $selectedOption = $options.find('[value='+val+']');
        var price = $selectedOption.data('price');
        var retail_price = $selectedOption.data('retail-price');
        if (price == "" && retail_price == "") {
            price = $priceEle.data('price');
            retail_price = $priceEle.data('retail-price');
        } else if (price == "") {
            price = $priceEle.data('price');
            if (retail_price != $priceEle.data('retail-price'))
                retail_price = "";
        }
        var discount_percentage = retail_price && retail_price > price;
        
        function setPriceInSidebar(price) {
            $priceEle.find('b').html('$'+price);
            
            if (discount_percentage) {
                $priceEle.find('b')
                    .addClass('sales')
                    .html('$' + price +' <small class="before">$' + retail_price + '</small>');
            } else {
                $priceEle.find('b').removeClass('sales');
            }
        }

        setPriceInSidebar(price);
    }

    $options.on('change', function(event) {
        var val = $(this).val();
        var $selectedOption = $(this).children('option:selected');
        var soldout = $selectedOption.attr('soldout') == 'True';
        var isWaiting = $selectedOption.attr('waiting') == 'True';
        var $btn_cart = $(".buttons.btn-cart");
        if (soldout) {
            $btn_cart
                .addClass('disabled')
                .attr("disabled", "disabled")
                .html('Out of Stock - '+(isWaiting?'<a href="#" class="tooltip notifyme remove"><b>Subscribed</b> <em>Click to cancel your stock notification.</em>':'<a href="#" class="tooltip notifyme"><b>Notify me</b> <em>Click to be notified when this item is back in stock.</em></a>'));
            $btn_cart.find('.notifyme').data('sale_id', $btn_cart.data('sale-item-id') ).data('option_id', val);
        } else {
            $btn_cart
                .removeClass('disabled')
                .removeAttr("disabled")
                .text('ADD TO CART');
            var remainingQuantity = parseInt($selectedOption.attr('remaining-quantity'));
            var currentlySelectedQuantity = parseInt($quantity.val());
            if (currentlySelectedQuantity > remainingQuantity) {
                currentlySelectedQuantity = remainingQuantity;
            }
            $quantity.empty();
            for (var i=1; i<=remainingQuantity && i<=10; i++) {
                $quantity.append('<option value="' + i + '">' + i + '</option>');
            }
            $quantity.val(currentlySelectedQuantity);
            $quantity.trigger('change');
        }
        $paging_buttons.trigger('change_option', val);
        setPrice(val);
    }).trigger('change');

    var initial_image = $paging.data('init-iid');
    if (initial_image) {
        $paging_buttons.filter("[data-iid=" + initial_image + "]").trigger('click');
    }

    var reviewTemplate = null;
    try {
        reviewTemplate = _.template($('script[type="text/x-template"]#review-post').html().trim())
    } catch(e) {
    }

    $(document.body)
        // Load more reviews
        .on('click', '.reviewPost .more', function(event) {
            event.preventDefault()
            var $el = $(this)
            if ($el.hasClass('_loading')) {
                return;
            }
            $el.addClass('_loading')
            var cursor = $el.data('cursor')
            var sid = $addReviewPopup.find('.frm').data('sid')
            $.get('/review_list.json?sale_item_id=' + sid + '&count=5&cursor=' + cursor)
                .then(function(res) {
                    if (res.status_code === 1) {
                        if (res.next_cursor) {
                            $el.data('cursor', res.next_cursor)
                        } else {
                            $el.data('cursor', null)
                            $el.hide()
                        }
                        res.reviews.forEach(function(rev) {
                            rev.date_created = new Date(rev.date_created)
                            var $el = $(reviewTemplate(rev))
                            $el.appendTo('.reviewPost');
			    initReviewElement($el);
                        })
                    } else {
                        console.warn('There was an error while fetching reviews. Please try again later.')
                    }
                })
                .always(function() {
                    $el.removeClass('_loading')
                })
            return false;
        })
        

    $(".recommended").recommendSlide();


    $('.view-size-chart').click(function(event) {
        event.preventDefault()
        $.dialog('general_size_guide').open()
    })
    $('.general_size_guide .tab>li>a').click(function(event) {
        event.preventDefault()
        if($(this).hasClass('current')) return

        $('.general_size_guide .tab>li>a.current').removeClass('current')
        $(this).addClass('current')
        var tab = $(this).data('tab')
        $(this).closest('.general_size_guide').find('.section').hide()
        $(this).closest('.general_size_guide').find('.section.'+tab).show()
    })


    var $scope = $('#content .figure-product');
    var mobileWidth = 920;
    
    $scope.find('.image-wrap > img')
	.load(function(e) {

        if ( !$scope.find('.image-container .video_player').length || $scope.find('.image-container .video_player').css('display') == 'none' ) {
			var image = $(this).data('original-image');
			var height = $(this).height();
			var width = $(this).width();
			var $thingImage = $scope.find('.image-wrap');
			var zoomRatio = 2;

			if ($thingImage.data('ori-image') == image) {
				$thingImage.css('line-height',height-2+'px').height(height).attr('data-width',width).attr('data-height',height).animate({opacity:'1'},'fast');
			}else{
				$thingImage.css('line-height',$thingImage.width()+'px').height($thingImage.width()).attr('data-width',width).attr('data-height',height).animate({opacity:'1'},'fast');
			}

			var $imgContainer = $scope.find(".image-container");
			var $zoomImage = $thingImage.find('.zoomImage');
			var border = parseInt($imgContainer.css('padding-left'));
			var imageWidth = width * zoomRatio;
			var imageHeight = ((height*height)/height) * zoomRatio;
			var zoomWidth = $imgContainer.outerWidth();
			var zoomHeight = $imgContainer.outerHeight();
			
			$thingImage.find('img').addClass('fit');
			$thingImage.addClass('zoomShow').removeClass('startZoom');
			$zoomImage.removeAttr('style')
			.css({
				'background-image':'url('+image+')',
				'background-size': (imageWidth) + 'px ' + (imageHeight) + 'px',
				'left': (0-border)+'px',
				'top': (0-border)+'px',
				'width': (zoomWidth )+'px',
				'height': (zoomHeight )+'px'
			})
			$zoomImage.attr('bg-width', imageWidth).attr('bg-height', imageHeight);
		}
    })
	.trigger('load');

    function showZoomImage(coordX, coordY) {
        var $imgContainer = $scope.find(".image-container");
        var $imgWrap = $scope.find(".image-wrap");
        var $img = $scope.find(".image-wrap img");
        var $zoomImage = $scope.find('.zoomImage');
        var marginTop = ($imgWrap.outerHeight()-$img.outerHeight())/2;
        var left = coordX - $img.offset().left ;
        var top = coordY - $img.offset().top ;
        var wrWidth = $imgWrap.width();
        var wrHeight = $imgWrap.height();
        var cWidth = $img.width();
        var cHeight = $img.height();
        var zWidth = $zoomImage.width();
        var zHeight = $zoomImage.height();
        var bgWidth = $zoomImage.attr('bg-width');
        var bgHeight = $zoomImage.attr('bg-height');
        
        var height =  cHeight;
        //if (cWidth < 250 || cHeight < 250) return;
        //if (cWidth < 500 && cHeight < 500) return;
        
        var backgroundLeft = (bgWidth-zWidth) * left/cWidth;
        var backgroundTop = (bgHeight-zHeight) * top/cHeight;
        
        if(backgroundTop<0) backgroundTop = 0;
        if(backgroundTop > bgHeight-zHeight) backgroundTop = bgHeight-zHeight;
        if(backgroundLeft<0) backgroundLeft = 0;
        if(backgroundLeft > bgWidth-zWidth) backgroundLeft = bgWidth-zWidth;

        $scope.find('.image-container .zoomImage')
                .css('background-position',( -1 * backgroundLeft)+'px '+ (-1 * backgroundTop) + 'px').fadeIn(200);
    }

    $scope.find('.image-container')
	.on('mousemove', function(e){
        if ( !$scope.find('.image-container .video_player').length || $scope.find('.image-container .video_player').css('display') == 'none' ) {
			if( !$(this).hasClass('startZoom')) return;
			showZoomImage(e.pageX, e.pageY);
        }
	})
	.on('mouseenter', function(e){
        if ( !$scope.find('.image-container .video_player').length || $scope.find('.image-container .video_player').css('display') == 'none' ) {
            return;
			if( !$(this).hasClass('startZoom')) return;
			showZoomImage(e.pageX, e.pageY);
        }
    })
    .on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        if($(e.target).closest('.video_player').length) return;
        if ( !$scope.find('.image-container .video_player').length || $scope.find('.image-container .video_player').css('display') == 'none' ) {
        
			if( $(this).hasClass('startZoom')){
				$(this).removeClass('startZoom');
				$scope.find('.image-container .zoomImage').fadeOut(200);
			}else{
				var $img = $scope.find(".image-wrap img");
				var cWidth = $img.width();
				var cHeight = $img.height();
				//if (cWidth < 250 || cHeight < 250) return;
				//if (cWidth < 500 && cHeight < 500) return;
				$(this).addClass('startZoom');
				$scope.find('.image-container .zoomImage').fadeIn(200);
				showZoomImage(e.pageX, e.pageY);
			}
        }
    });

    $(document.body).on('click', function(e){
        var $this = $(e.target);
        if( $(".image-container").hasClass('startZoom') ){
            $(".image-container").removeClass('startZoom');
            $scope.find('.image-container .zoomImage').fadeOut(200);
        }
    });

    function resetSlide(){
        $("#slides").html( $("#slides_originals").html() )
            .find("[data-img_src]").each(function(){
                $(this).attr('src', $(this).data('img_src'));
            }).end()
            .find("[data-optionid]").filter("[data-optionid!='"+$options.val()+"']").remove();
        $("#slides").removeData('plugin_slidesjs');

        if( $("#slides > div.slide-item").length > 1){
            $("#slides").removeClass('noslideshow');
        }else{
            $("#slides").addClass('noslideshow');
            return;
        }

        $('#slides:not(.noslideshow)').slidesjs({
            width: $(window).width(),
            height: $(window).height(),
            navigation: {
                effect: "slide"
            },
            pagination: {
                pagination: true,
                effect: "slide"
            },
            effect: {
                slide: {
                    speed: 200
                }
            },
            play: {
                active: false,
                effect: "slide",
                interval: 120004444,
                auto: true,
                swap: false,
                pauseOnHover: true,
                restartDelay: 80004444
            }
        });
    }

    (function(){

        var $fr= $scope.find(".image-wrap"), $p = $scope.find(".paging");

        $scope.find('.image-container .btn-zoom').on('click', function(e){
            e.preventDefault();

            e.stopPropagation();

            resetSlide();

            $fr.closest('html').addClass('show_fullscreen');
            var index = $('#content .figure-product .paging > a.current').prevAll(':visible:not([video])').length;

            if($("#slides").data('plugin_slidesjs')){
                $("#slides").data('plugin_slidesjs').data.animating = false;
                $("#slides").data('plugin_slidesjs').goto(index+1);
                $(".slidesjs-control").trigger("transitionend")
            }
            $("#slides .slidesjs-control").find('img').css('max-height',$(window).height()+'px').end().css('height',$(window).height()+'px');
        });


    })();

    $(window).on("orientationchange", function() {
        $('#content .figure-product').find('.image-wrap > img').trigger('load');
        resetSlide();
        $('#content .figure-product')
			.find('.image-wrap')
			.css('line-height',$('#content .figure-product').find('.image-wrap').width()+'px')
			.height($('#content .figure-product').find('.image-wrap').width())
			.attr('data-width',$('#content .figure-product .image-wrap > img').width())
			.attr('data-height',$('#content .figure-product .image-wrap > img').height());
        $("#slides .slidesjs-control").find('img').css('max-height',$(window).height()+'px').end().css('height',$(window).height()+'px');
    });

	$(window).resize(function(){
        $('#content .figure-product').find('.image-wrap > img').trigger('load');
        if($(window).width() > mobileWidth){
            $("#slides").removeData('plugin_slidesjs');
        }
        $('#content .figure-product')
			.find('.image-wrap')
			.css('line-height',$('#content .figure-product').find('.image-wrap').width()+'px')
			.height($('#content .figure-product').find('.image-wrap').width())
			.attr('data-width',$('#content .figure-product .image-wrap > img').width())
			.attr('data-height',$('#content .figure-product .image-wrap > img').height());
        $("#slides .slidesjs-control").find('img').css('max-height',$(window).height()+'px').end().css('height',$(window).height()+'px');
	})

    $(document).on('click', '.itemListElement .detail-overlay .figure-list a', function(){
        var $this = $(this), $a = $this.closest(".itemListElement").find("a.main-link"), url = $a.attr("href"), q = url.indexOf("?");
        if (q < 0) {
            url = url  + '?image=' + $this.data("iid");
        } else {
            var param = $.parseString(url.substr(q+1))
            param['image'] = $this.data("iid");
            url = url.substr(0, q+1) + $.param(param);
        }
        if($(window).width()>920){
            $this.closest('.itemListElement').find('.figure-list a').removeClass('current').end().find('.figure img')
               .css('background-image','url('+$this.data('image')+')').end().end().addClass('current');
            $a.attr('href', url);
        } else {
            location.href = url;
        }
    });
})
