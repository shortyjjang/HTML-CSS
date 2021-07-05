
jQuery(function($) {
    var $image = $('#content .figure-product .image-container .image-wrap img');
    var $video_player = $('#content .figure-product .image-container .image-wrap .video_player');
    var $scope = $('#content .figure-product');
    var $thingImage = $scope.find('.image-wrap');
    // var $fr= $scope.find(".image-wrap");
    var mobileWidth = 920;

    $video_player.videoPlayer({autoplay:true, muted:true});

    var $paging = $('#content .figure-product .paging'), $paging_buttons = $('#content .figure-product .paging div > a')
    // var $prev = $(".figure-product .paging-wrap a.prev");
    var $next = $(".figure-product .paging-wrap a.next");
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
            if(window.isRetina()) image = image2x;
            $image.attr('src', image).data('original-image', original_image||image);
    	    $video_player.hide();
    	    $video_player.find('.btn-pause').click();
            if(isFit) $image.closest('.image-wrap').addClass('fit');
            else $image.closest('.image-wrap').removeClass('fit');
    	    $image.show();
    	}
    }).filter(":eq(0)").trigger('click');

    var width = $thingImage.width();
    $thingImage.css('line-height', width+'px').height(width);
    $(window).resize(function(){
        var width = $thingImage.width();
        $thingImage.css('line-height', width+'px').height(width);
    })
    
    var page = 1;

    function resizeSlideWidth(){
        var windowWidth = $(window).width();
        $('.figure-product .showcase .slidesjs-pagination').width(windowWidth);
        $('.figure-product .showcase .slidesjs-pagination').find('li').each(function(){
            var imgURL = $('.slide-item[slidesjs-index="'+$(this).find('a').data('slidesjs-item')+'"] img').attr('src');
            $(this).find('a').html('<img src="/_static/_ui/images/common/blank.gif" style="background-image:url('+imgURL+')" />');
            if($('.paging a[data-original-image="'+imgURL+'"]').hasClass('fit')){
                $(this).find('img').addClass('fit');
                $('.slide-item[slidesjs-index="'+$(this).find('a').data('slidesjs-item')+'"]').addClass('fit');
            }
        });
        $('.figure-product .showcase .slidesjs-container')
            .width(windowWidth)
            .height(windowWidth)
            .find('.slidesjs-control').width(windowWidth).height(windowWidth);
    }

    function getSlideIndex(){
        return $("#slides").find(".slidesjs-pagination-item .active").parent().index();
    }

    // function setSlideIndex(idx){
    //     if($("#slides").data('plugin_slidesjs')){
    //         $("#slides").data('plugin_slidesjs').data.animating = false;
    //         $("#slides").data('plugin_slidesjs').goto(index+1);
    //         $(".slidesjs-control").trigger("transitionend")
    //     }
    //     $("#slides .slidesjs-control").find('img').css('max-height',$(window).height()+'px').end().css('height',$(window).height()+'px');
    // }

    function resetSlide(option_id){
        if(!option_id) option_id = $options.val();

        $("#slides").html( $("#slides_originals").html() )
            .find("[data-img_src]").each(function(){
                $(this).attr('src', $(this).data('img_src'));
            }).end()
            .find("[data-optionid]").filter("[data-optionid!='"+option_id+"']").remove();

        var width, height;
        width = $(window).width();
        height = width;
        
        $("#slides").removeData('plugin_slidesjs');
        if( $("#slides > div.slide-item").length > 1){
            $("#slides").removeClass('noslideshow');
        }else{
            $("#slides").addClass('noslideshow').css({width:width+'px', height:height+'px'});
            return;
        }
        
        $('#slides:not(.noslideshow)').slidesjs({
            width: width,
            height: height,
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

        resizeSlideWidth();
        
    }
    function showZoomImage(coordX, coordY) {
        // var $imgContainer = $scope.find(".image-container");
        var $imgWrap = $scope.find(".image-wrap");
        var $img = $scope.find(".image-wrap img");
        var $zoomImage = $scope.find('.zoomImage');
        // var marginTop = ($imgWrap.outerHeight()-$img.outerHeight())/2;
        var left = coordX - $img.offset().left ;
        var top = coordY - $img.offset().top ;
        // var wrWidth = $imgWrap.width();
        // var wrHeight = $imgWrap.height();
        var cWidth = $img.width();
        var cHeight = $img.height();
        var zWidth = $zoomImage.width();
        var zHeight = $zoomImage.height();
        var bgWidth = $zoomImage.attr('bg-width');
        var bgHeight = $zoomImage.attr('bg-height');
        var diff = 0;
        
        if(cWidth==cHeight){
            diff = parseInt((bgHeight-bgWidth)/2);
            bgHeight = bgWidth;
        }
        
        var backgroundLeft = (bgWidth-zWidth) * left/cWidth;
        var backgroundTop = (bgHeight-zHeight) * top/cHeight;
        
        if(backgroundTop<0) backgroundTop = 0;
        if(backgroundTop > bgHeight-zHeight) backgroundTop = bgHeight-zHeight;
        if(backgroundLeft<0) backgroundLeft = 0;
        if(backgroundLeft > bgWidth-zWidth) backgroundLeft = bgWidth-zWidth;
        backgroundTop += diff;

        $scope.find('.image-container .zoomImage').css('background-position',( -1 * backgroundLeft)+'px '+ (-1 * backgroundTop) + 'px').fadeIn(200);
    }
    function initSlide($el){
        var $list = $el.find(".paging"), $listdiv = $el.find(".paging > div"), $li = $list.find("a:visible"), $prev = $el.find("a.prev"), $next = $el.find("a.next");
        $prev.addClass('disabled');
        $next.addClass('disabled');
        if( $listdiv.width() > $list.width() ){
            $next.removeClass('disabled');
        }
        $listdiv.animate({'left': 0}, 300);
        $el.off('click', 'a.prev').off('click', 'a.next')
            .on('click', 'a.prev', function(e){
                e.preventDefault();
                var $this = $(this);
                if( $this.hasClass('disabled')) return;
                page--;
                var left = Math.max(0, (page-1)*$list.width());
                $this.addClass('disabled');
                $listdiv.animate({'left': (0-left)+'px'}, 300, 'easeInOutExpo', function(){
                    if( page > 1 ) $this.removeClass('disabled');
                    $next.removeClass('disabled');    
                });
            })
            .on('click', 'a.next', function(e){
                e.preventDefault();
                var $this = $(this);
                if( $this.hasClass('disabled')) return;
                page++;
                var left = Math.min( $listdiv.width() - $list.width(), (page-1)*$list.width() );
                var maxPage = Math.ceil($listdiv.width() / $list.width());
                $this.addClass('disabled');
                $listdiv.animate({'left': (0-left)+'px'}, 300, 'easeInOutExpo', function(){
                    if( page < maxPage) $this.removeClass('disabled');
                    $prev.removeClass('disabled');    
                });
            })

        $(window).resize(function(){
            var left = (page-1)*$list.width();
            $listdiv.css('left', (0-left)+'px');
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
    var $multiOptions = $('.detail #content .multi-option')
    var $quantity = $('.detail #content .qty select')
    $btn_cart.click(function(event) {
        var $this = $(this)
        var sale_item_id = $this.data('sale-item-id')
        var seller_id = $this.data('seller-id')
        var price = $(this).data('sale-item-price') || 0;
        var option_id = $options.val()
        var quantity = $quantity.val() || 1;
        if($this.hasClass('loading')) {
            return
        }

        if( $options.length && !option_id){
            $options.css('color','red');
            $multiOptions.each(function(i){
                var $this=$(this), value = $this.find('[data-value].selected').data('value') || $this.find("select").val();
                if(!value){
					$this.addClass('error').append('<span class="error-msg">Please select an option</span>');
                    return false;
                }
            })
            $('html,body').animate({scrollTop: $this.closest('.frm').offset().top-50}, 200, 'easeInOutExpo');
            return;
        }


        $this.prop('disabled',true)
        $this.addClass('loading')
        $.post('/add_item_to_cart.json', {'sale_item_id':sale_item_id, 'seller_id':seller_id, 'option_id': option_id, 'quantity': quantity}, function(res) {
            if(res.status_code>0) {
                try { fbq('track', 'AddToCart', {content_type:'product', content_ids:[sale_item_id], value:price, currency:'USD'}); } catch (e) {}

                var digitalData = {};
                digitalData.event = [{eventInfo:{eventName:'Cart Adds'}}];

                saveDigitalData(digitalData);

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

    function parsePrice(val) {
        if (typeof val == "string") return parseFloat(val.replace(/[^\d\.\-]/g, ""));
        return val;
    }
    function setPrice(val) {
        var $priceEle = $('#content p.price');
        var $selectedOption = $options.find('[value="'+val+'"]');
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
        var discount_percentage = retail_price && (parsePrice(retail_price) > parsePrice(price));
        
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

    function setValues(values){
        if(!values){
            $multiOptions.find('[data-value]').removeClass('selected').end()
        }else{
            $multiOptions.each(function(i){
                var selector = '[data-value="'+(values[i]+'').replace(/"/g,"\\\"")+'"]';
                $(this)
                    .find('[data-value]').removeClass('selected').filter(selector).addClass('selected').end().end()
                    .find("select").removeAttr('style').val(values[i]).end()
                    .find("span.value").removeAttr('style').text(values[i]);
            })
        }

        $(values||['']).each(function(i,v){
            $multiOptions.eq(i).each(function(ii){
                $(this).find("select option, [data-value]").each(function(){
                    var tempValues = _.clone(values||['']), value = $(this).data('value')||$(this).attr('value'), exists = false, soldout = false;
                    tempValues[i] = value;
                    if( $(this).attr('unavailable') ) return true;
                    $options.find("option").each(function(){
                        if( tempValues.indexOf("")!=-1 || ($(this).data('values') && $(this).data('values').join("/") == tempValues.join("/")) ){
                            exists = true;
                            soldout = $(this).attr('soldout')=='True';
                            return false;
                        }
                    })
                    if(values){
                        if(exists){
                            if( $(this).is("a, button") ) $(this).closest('li').removeClass('disabled');
                            else $(this).removeAttr('disabled');
                            if( soldout ) $(this).addClass('soldout');
                            else $(this).removeClass('soldout');
                        }else{
                            if( $(this).is("a, button") ) $(this).closest('li').addClass('disabled');
                            else $(this).attr('disabled', 'disabled');
                        }
                    }
                    if($(this).is("option") && $(this).val()) {
                        var label = value;
                        if(soldout) label += " - Out of Stock";
                        if(label) $(this).text(label);
                    }
                })
            })
        })
    }

    $multiOptions.on('click change', 'select, [data-value]', function(e){
        if( $(this).is("a") ) e.preventDefault();
        if( e.type=='click' && $(this).is("select")) return;
        if( $(this).attr('disabled') || $(this).closest('li').hasClass('disabled') ) return;

        var values = Array.prototype.slice.call($multiOptions.map(function(){ return $(this).find(".selected").data("value")||$(this).find("select").val()||'' })), index=$(this).closest('.multi-option').data('index');
        values[index] = $(this).data('value')||$(this).val();
        if( $(this).is(".selected")){
            values[index] = '';
        }else{
            $(this).closest('.multi-option').removeClass('error').find(".error-msg").remove();
        }
        var exists = false;
        $options.find("option").each(function(){
            if( $(this).data('values') && $(this).data('values').join("/") == values.join("/") ){
                exists = true;
                $options.val( $(this).val() ).trigger('change');
                return false;
            }
        })
        if(!exists){
            $options.val( '' ).trigger('change');
            setValues(values);
            $options.trigger('change_option_images', [values]);
            
        }
    })

    $options.bind('change_option_images', function(event, option_id){
        if( option_id instanceof Array){
            var values = option_id;
            option_id = "";
            $(values).each(function(i,v){
                if(!v) values[i] = $multiOptions.filter(":eq("+i+")").find("select option:eq(1)").val();
            })
            $options.find("option").each(function(){
                if( $(this).data('values') && $(this).data('values').join("/") == values.join("/") ){
                    option_id = $(this).val();
                    return false;
                }
            })
            if(!option_id) return;
        }
        
        var $option_images = $paging_buttons.filter('[data-optionid]').filter('[data-optionid!=None]').hide().filter('[data-optionid='+option_id+']').show();
        $paging_buttons.filter("[data-optionid=None]").show();
        if($option_images.length){
            $paging_buttons.filter("[data-optionid=None]").each(function(){
                if($(this).data('options').hide_for_option) $(this).hide();
            })
        }
        initImageList();
        resetSlide(option_id);
        if( $option_images.length) $option_images.filter(':eq(0)').trigger('click');
        else $paging_buttons.filter(':visible').filter(':eq(0)').trigger('click');
    });

    $options.on('change', function(event) {
        var val = $(this).val();

        $(this).removeAttr('style');

        var $selectedOption = $(this).children('option:selected');
        var soldout = $selectedOption.attr('soldout') == 'True';
        var isWaiting = $selectedOption.attr('waiting') == 'True';
        var $btn_cart = $(".buttons.btn-cart");

        if(!val){
            $btn_cart
                .removeClass('disabled')
                .removeClass('soldout')
                .removeAttr("disabled")
                .text('Add to Cart');
            if( window.applePayAvailable ){
                $btn_cart.removeClass('half');
                $(".apple-pay-button").hide();
            }

            if (soldout) {
                $btn_cart
                    .addClass('disabled')
                    .addClass('soldout')
                    .attr("disabled", "disabled")
                    .html('Out of Stock - '+(isWaiting?'<a href="#" class="tooltip notifyme remove"><b>Subscribed</b> <em>Click to cancel your stock notification.</em>':'<a href="#" class="tooltip notifyme"><b>Notify me</b> <em>Click to be notified when this item is back in stock.</em></a>'));
                $btn_cart.find('.notifyme').data('sale_id', $btn_cart.data('sale-item-id') );
            }

            setPrice(val);
            setValues('');
            return;
        }
        
        if (soldout) {
            $btn_cart
                .addClass('disabled')
                .addClass('soldout')
                .attr("disabled", "disabled")
                .html('Out of Stock - '+(isWaiting?'<a href="#" class="tooltip notifyme remove"><b>Subscribed</b> <em>Click to cancel your stock notification.</em>':'<a href="#" class="tooltip notifyme"><b>Notify me</b> <em>Click to be notified when this item is back in stock.</em></a>'));
            $btn_cart.find('.notifyme').data('sale_id', $btn_cart.data('sale-item-id') ).data('option_id', val);
            if( window.applePayAvailable ){
                $btn_cart.removeClass('half');
                $(".apple-pay-button").hide();
            }
        } else {
            $btn_cart
                .removeClass('disabled')
                .removeClass('soldout')
                .removeAttr("disabled")
                .text('Add to Cart');

            if( window.applePayAvailable ){
                $btn_cart.addClass('half');
                $(".apple-pay-button").show();
            }
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
        $options.trigger('change_option_images', val);
        setPrice(val);
        setValues( $selectedOption.data('values') );
    });

    if(location.args.option){
        $options.val(location.args.option);
    }else if($options.find("option[value!='']").length==1){
        $options.val($options.find("option[value!='']").attr('value'));
    }

    function checkUnavailableOptions(){
        $multiOptions.each(function(i){
            $(this).find('select option, [data-value]').each(function(){
                var value = $(this).data('value')||$(this).attr('value');
                var hasAvailableOption = false, soldout=false;
                $options.find("option").each(function(){
                    var values = $(this).data('values');
                    if(values && values[i] == value && $(this).attr('soldout')!='True'){
                        hasAvailableOption = true;
                        soldout = $(this).attr('soldout') == 'True';
                        return false;
                    }
                })

                if(!hasAvailableOption){
                    $(this).addClass('soldout');
                    if($(this).is("option") && $(this).val()) {
                        var label = value;
                        if(soldout) label += " - Out of Stock";
                        if(label) $(this).text(label);
                    }
                    $(this).attr('unavailable', true);
                }
            });
        })
    }

    checkUnavailableOptions();
    $options.trigger("change");

    var initial_image = $paging.data('init-iid');
    if (initial_image) {
        $paging_buttons.filter("[data-iid=" + initial_image + "]").trigger('click');
    }

	// reviews
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
    var reviewTemplate = _.template($('script[type="text/x-template"]#review-post').html().trim())
    $('.reviewPost .more').on('click', function(event) {
		event.preventDefault()
		var $el = $(this)
		if ($el.hasClass('_loading')) {
			return;
		}
		$el.addClass('_loading')
        var cursor = $el.data('cursor')
        var $addReviewPopup = $('.popup.add_review')
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

	// view size chart
    $('.view-size-chart').click(function(event) {
        event.preventDefault()
        $.dialog('general_size_guide').open()
    });
    $('.general_size_guide .tab>li>a').click(function(event) {
        event.preventDefault()
        if($(this).hasClass('current')) return
        $('.general_size_guide .tab>li>a.current').removeClass('current')
        $(this).addClass('current')
        var tab = $(this).data('tab')
        $(this).closest('.general_size_guide').find('.section').hide()
        $(this).closest('.general_size_guide').find('.section.'+tab).show()
    });

	//showcase
	$scope.find('.image-wrap > img')
	.load(function(e) {
        if ( !$scope.find('.image-container .video_player').length || $scope.find('.image-container .video_player').css('display') == 'none' ) {
			var image = $(this).data('original-image');
            var height = $(this).height();
			var width = $(this).width();
            var windowWidth = $(window).width();
			var zoomRatio = 2;
			if ($thingImage.data('ori-image') == image) {
				$thingImage.attr('data-width',width).attr('data-height',height);//.animate({opacity:'1'},'fast');
			}else{
				$thingImage.attr('data-width',width).attr('data-height',height);//.animate({opacity:'1'},'fast');
			}
			var $imgContainer = $scope.find(".image-container");
			var $zoomImage = $thingImage.find('.zoomImage');
			var border = parseInt($imgContainer.css('padding-left'));
			var imageWidth = width * zoomRatio;
			var imageHeight = ((height*height)/height) * zoomRatio;
			var zoomWidth = $imgContainer.outerWidth();
			var zoomHeight = $imgContainer.outerHeight();

            if(windowWidth > mobileWidth){
                var bgSize = (imageWidth) + 'px ' + (imageHeight) + 'px';
                if(imageWidth == imageHeight) bgSize = (imageWidth) + 'px ';
    			$thingImage.addClass('zoomShow').removeClass('startZoom');
    			$zoomImage.removeAttr('style')
    			.css({
    				'background-image':'url('+image+')',
    				'background-size': bgSize,
    				'left': (0-border)+'px',
    				'top': (0-border)+'px',
    				'width': (zoomWidth )+'px',
    				'height': (zoomHeight )+'px'
    			})
                $("<img/>").load(function(){
                    var resizeRatio = width / this.width;
                    $zoomImage.attr('bg-width', width*zoomRatio).attr('bg-height', this.height/resizeRatio*zoomRatio);    
                }).attr('src', $(this).attr('src'));
    			$zoomImage.attr('bg-width', imageWidth).attr('bg-height', imageHeight);
            }else{
                $zoomImage.removeAttr('style')
            }
		}
    })
	.trigger('load');

    if($(window).width()<=mobileWidth){
        setTimeout(function(){
            resetSlide();    
        },2000)
    }
        
	// zoom
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
        if($(e.target).closest('.video_player').length) return;
        if ( !$scope.find('.image-container .video_player').length || $scope.find('.image-container .video_player').css('display') == 'none' ) {
            if($(window).width() < mobileWidth){
                if( $(e.target).closest(".slidesjs-pagination").length) return;
                var index = getSlideIndex();
                $(".paging-wrap .paging a:eq("+index+")").trigger("click");
                $('html').addClass('show_fullscreen');
                $scope.find('.image-container .zoomImage').show();
            }else{
    			if( $(this).hasClass('startZoom')){
    				$(this).removeClass('startZoom');
    				$scope.find('.image-container .zoomImage').fadeOut(200);
    			}else{
                    e.stopPropagation();
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
        }
    });
	
    $('.icon-link')
        .on('mousedown',function(event) {
            event.preventDefault();
            var $link = $(this);
            Gear.prepareClipboard(location.protocol + '//' + location.hostname + $link.attr('href')); // see common.js
        })
        .on('mouseup',function(event) {
            event.preventDefault();
            Gear.copyToClipboard(); // see common.js
        })
        .on('click',function(event) {
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
    });

    $(document.body).on('click', function(e){
        if( $(".image-container").hasClass('startZoom') ){
            $(".image-container").removeClass('startZoom');
            $scope.find('.image-container .zoomImage').fadeOut(200);
        }
    });

	// resize
    $(window).on("orientationchange", function() {
        if($(window).width() <= mobileWidth){
            resizeSlideWidth();
        }else{
            $('#content .figure-product')
                .find('.image-wrap')
                .css('line-height',$(window).height()+'px')
                .height($(window).height())
                .attr('data-width',$('#content .figure-product .image-wrap > img').width())
                .attr('data-height',$('#content .figure-product .image-wrap > img').height());    
        }
    });
	$(window).resize(function(){
        if($(window).width() <= mobileWidth){
            if( !$("#slides").data('plugin_slidesjs') ){
                resetSlide();
            }else{
                resizeSlideWidth();    
            }
        }else{
            $('#content .figure-product').find('.image-wrap > img').trigger('load');
            var height = $('#content .figure-product').find('.image-wrap').width();
            $('#content .figure-product')
                .find('.image-wrap')
                .css('line-height',height+'px')
                .height(height)
                .attr('data-width',$('#content .figure-product .image-wrap > img').width())
                .attr('data-height',$('#content .figure-product .image-wrap > img').height());
        }
	})

    $(".recommended").recommendSlide();
    $(document).on('click', '.itemListElement .detail-overlay .figure-list a', function(){
        var $this = $(this), $a = $this.closest(".itemListElement").find("a.main-link"), url = $a.attr("href"), q = url.indexOf("?");
        if (q < 0) {
            url = url  + '?image=' + $this.data("iid");
        } else {
            var param = $.parseString(url.substr(q+1))
            param['image'] = $this.data("iid");
            url = url.substr(0, q+1) + $.param(param);
        }
        if($(window).width()>mobileWidth){
            $this.closest('.itemListElement').find('.figure-list a').removeClass('current').end().find('.figure img')
               .css('background-image','url('+$this.data('image')+')').end().end().addClass('current');
            $a.attr('href', url);
        } else {
            location.href = url;
        }
    });
	
	//fixed sidebar
	$(window).scroll(function(){

        var window_height = $(window).height();
        var figure_info_height = $('.figure-info').outerHeight();
        var figure_product_offset = $('.figure-product').offset().top;
        var scroll_top = $(window).scrollTop();


		if(window_height > figure_info_height+figure_product_offset){
			if(scroll_top > figure_product_offset){
				if(scroll_top > $('.suggest-items').offset().top - figure_info_height) {
					$('.figure-info').addClass('stop');
				}else{
					$('.figure-info').addClass('fixed').removeClass('stop');
				}
			}else{
				$('.figure-info').removeClass('fixed stop');
			}
		}else{
            if(window_height<figure_info_height) {
    			if(scroll_top > figure_product_offset + figure_info_height - window_height){
    				if(scroll_top > $('.suggest-items').offset().top - window_height) {
    					$('.figure-info').addClass('stop');
    				}else{
    					$('.figure-info').addClass('fixed fixedBottom').removeClass('stop');
    				}
    			}else {
    				$('.figure-info').removeClass('fixed fixedBottom stop');
    			}
            } else {
    			if(scroll_top > figure_product_offset) {
    				if(scroll_top > $('.suggest-items').offset().top - figure_info_height) {
    					$('.figure-info').addClass('stop');
    				}else{
    					$('.figure-info').addClass('fixed').removeClass('stop');
    				}
    			}else {
    				$('.figure-info').removeClass('fixed fixedBottom stop');
    			}
            }
		}
    });

    $(document).on('click', '.popup.ask_qna .btn-send', function(e) {
        var sender_name = $('.popup.ask_qna [name="qna_sender_name"]').val().trim()
        var sender_email = $('.popup.ask_qna [name="qna_sender_email"]').val().trim()
        var question = $('.popup.ask_qna [name="qna_question"]').val().trim()
        var sale_item_id = $('.popup.ask_qna').attr('data-sid')
        var recipient_debug = location.args.recipient;

        if (!sender_name) {
            alertify.alert('Please write your name.');
            return;
        }

        if (!sender_email && sender_email.indexOf("@") > 0) {
            alertify.alert('Please write correct email address.');
            return;
        }

        if (!question) {
            alertify.alert('Please write question.');
            return;
        }

        if (!sale_item_id) {
            console.warn('Sale item id not exists.');
        }

        var $this = $(this)
        $.post('/send-qna-customer.json', {
            sale_item_id: sale_item_id,
            question: question,
            sender_name: sender_name,
            sender_email: sender_email,
            recipient_debug: recipient_debug,
        }).then(function (res) {
            if (res.status_code == 1) {
                $this.closest('.popup').find('.success').show();
                setTimeout(function(){
                    $.dialog('ask_qna').close();
                    $('.popup.ask_qna').find('.step').hide().end().find('.frm').show();
                    // clear fields
                    $('.popup.ask_qna [name="qna_sender_name"]').val('');
                    $('.popup.ask_qna [name="qna_sender_email"]').val('');
                    $('.popup.ask_qna [name="qna_question"]').val('');
                }, 3000);
            } else {
                if (res && res.message) {
                    alertify.alert(res.message);
                } else {
                    alertify.alert('There was an error while sending request. Please try again.');
                }
            }
        }).fail(function (jqxhr) {
            alertify.alert('There was an error while sending request. Please try again.');
        })

        return false;
    })

    // resize techspec moreinfo iframe height
    window.resizeIFrameToFitContent = function( name ) {
        var iFrame = $(".description iframe[data-section="+name+"]")[0];
        iFrame.height = Math.max(iFrame.contentWindow.document.body.scrollHeight, 100);
    }

    $(window).resize(function(){
        $(".description iframe[data-section]").each(function(){
            var name = $(this).data('section');
            resizeIFrameToFitContent(name);
        })
    })

})
