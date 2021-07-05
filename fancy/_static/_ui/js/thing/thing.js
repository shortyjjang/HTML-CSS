window.__thing = function (scope) {

(function($) {
    var $scope = $('#overlay-thing .figure-section');
	var maxW = $scope.width();
    $scope.find('.figure-item > figure img').load(function(e) {
        var image = $(this).attr('src');
        var height = $(this).height();
        var width = $(this).width();
        var $thingImage = $scope.find('> .figure-item span.figure');

		if ($scope.find('> .figure-item span.figure').data('ori-image') == image) {
			$thingImage.css('line-height',height-2+'px').height(height).attr('data-width',width).attr('data-height',height).animate({opacity:'1'},'fast');
		}else{
			$thingImage.css('line-height',638+'px').height(maxW).attr('data-width',width).attr('data-height',height).animate({opacity:'1'},'fast');
		}

        if (width>maxW) {
            //$thingImage.css('background-image','url('+image+')').height((maxW*height)/width).attr('data-width',width).attr('data-height',height);
			$thingImage.find('img').addClass('fit');
            $thingImage.addClass('zoomShow').removeClass('startZoom');
            var $zoomImage = $thingImage.find('.zoomImage');
            var imageWidth = maxW * 1.5 + 125;
            var imageHeight = ((maxW*height)/width) * 1.5 + 125;
            $zoomImage.removeAttr('style').css('background-image','url('+image+')');
            $zoomImage.css('background-size', (imageWidth) + 'px ' + (imageHeight) + 'px');
            $zoomImage.attr('bg-width', imageWidth).attr('bg-height', imageHeight);
        }else{
            //$thingImage.css('background-image','url('+image+')').height(height).attr('data-width',width).attr('data-height',height);
            $thingImage.removeClass('zoomShow').removeClass('startZoom').find('.zoomImage').removeAttr('style');
        }
    });

    $scope.find('.figure-detail .description .more').click(function(e) {
        e.preventDefault();
        $(this).closest('.detail').addClass('show');
    });

    $scope.find('.figure-detail .description .less').click(function(e) {
        e.preventDefault();
        $(this).closest('.detail').removeClass('show');
    });

    function showZoomImage(coordX, coordY) {
        var left = coordX-$scope.offset().left;
        var top = coordY-$scope.offset().top;
        var height =  maxW * $scope.find('.figure-item > figure img').height() / $scope.find('.figure-item > figure img').width();
        var topPosition = (top-(maxW-height)/2);

        var backgroundLeft = $scope.find('.zoomImage').attr('bg-width') * left / maxW -125;
        var backgroundTop = $scope.find('.zoomImage').attr('bg-height') * topPosition / height -125;

        if (left > 0 && topPosition > 0 && topPosition < height) {
            $scope.find('.figure-item .figure .zoomImage')
                .css('left',left-125 + "px ")
                .css('top',top-125 +'px')
                .css('background-position',( -1 * backgroundLeft)+'px '+ (-1 * backgroundTop) + 'px').show();
        }else{
            $scope.find('.figure-item .figure .zoomImage').hide();
        }
    }

    $scope.find('.figure-item > figure').on('mousemove', '.startZoom', function(e){
        showZoomImage(e.pageX, e.pageY);
    });

    $scope.find('.figure-item > figure').on('click', '.zoomShow', function(e){
        if ( $scope.find('.video_player').is(':visible') ) {
            return;
        }
        $(this).addClass('startZoom');
        showZoomImage(e.pageX, e.pageY);
    });
    $scope.find('.figure-item > figure').on('click', '.zoomImage', function(e){
        e.preventDefault();
        e.stopPropagation();
        $(this).closest('.figure').removeClass('startZoom');
        $scope.find('.figure-item .figure .zoomImage').hide();
    });

    function redrawImage(image, username) {
        if (!$scope.find('.video_player').is(':visible')) {
            $scope.find('.figure-item > figure .figure').css('background-image','url('+image+')').find('img').attr('src', image).removeClass('fit');
        } else {
            $scope.find('.figure-item > figure .figure').css('background-image','url('+image+')').find('img').attr('src', image).removeClass('fit');
            $scope.find('.video_player').fadeOut('slow',function(){
                $scope.find('.figure-item > figure .figure').show();
            });
        }
        if(username){
            $scope.find('.submitted').show().find("b").html(username);
        }else{
            $scope.find('.submitted').hide();
        }
    }

    $scope.find('.figure-detail .thumbnail-list')
        .on('click', 'li > a.thumb:not(.active)', function(e) {
            e.preventDefault();
            var $this = $(this);
            if($this.is(".video-thumb")) return;
            
            $(this).closest('ul')
                .find("li.current").removeClass('current').end()
                .find('.active').removeClass('active');
            $(this).addClass('active');
            $(this).closest('li').addClass('current');
			if ($scope.find('#videoInfo').hasClass('stop')==false) {
				$scope.find('#videoInfo .btn-pause').click();
			}
            $scope.find("span.figure").height(maxW).find(" > img").show();

            redrawImage($(this).data('image'), $(this).data('username'));
        })
        .on('click', 'li > a.thumb.active', function(e) {
            if ( $scope.find('.video_player').length ) {
                return;
            }
            if($this.is(".video-thumb")) return;

            $(this).removeClass('active');
            redrawImage($scope.find('> .figure-item span.figure').data('ori-image'));
        })
        .on('click', 'a.more', function(e){
            e.preventDefault();
            $(this).toggle();
            $(this).parent().find('li').show();
        });

    $scope.find(".figure-item figure a.prev,.figure-item figure a.next").click(function(e){
        var $this = $(this);
        if($this.hasClass("disabled")) return;
        e.preventDefault();
        e.stopPropagation();
        var $thumbnailList = $scope.find(".thumbnail-list ul li");
        var $thumbnail = null;
        if( $this.hasClass("prev") ){
            $thumbnail = $thumbnailList.filter(".current").prev();
            if($thumbnail.is("a")) $thumbnail = $thumbnail.prev();
            if(!$thumbnail.length) $thumbnail = $thumbnailList.last();

        }else{
            $thumbnail = $thumbnailList.filter(".current").next();
            if($thumbnail.is("a")) $thumbnail = $thumbnail.next();
            if(!$thumbnail.length) $thumbnail = $thumbnailList.first();
        } 
        if($thumbnail.length){ 
            $thumbnailList.removeClass("current"); 
            $thumbnail.addClass("current").find(".thumb").click();         
        }
    })

    $scope.find('.thumbnail-list').on('click', '.video-thumb', function(e) {
        $(this).closest('ul')
            .find("li.current").removeClass('current').end()
            .find('.active').removeClass('active');
        $(this).addClass('active');
        $(this).closest('li').addClass('current');
        $scope.find("span.figure").css('height','').find(">img").hide();

        $scope.find('.video_player').fadeIn('slow', function() {
            $scope.find('.zoomShow').removeClass('zoomShow');
            $scope.find('.figure-item > figure .figure img').hide();
        });
    })

    // shipping location

    $scope.find('.figure-detail .description').on('click', '.shipping a', function(e) {
        e.preventDefault();
        var code = $(this).attr('code');
        if(code) {
            if($.dialog('shipping').$obj.find('.country-list ul.after > li.current').length>0) {
            } else {
                $.dialog('shipping').$obj.find('.country-list ul.after > li').each(function() {
                    if($(this).attr('code')==code) {
                        $(this).closest('ul').find('.current').removeClass('current');
                        $(this).addClass('current');
                    }
                });
            }
        }
        $.dialog('shipping').open();
        return false;
    });

    $scope.find('.popup.shipping ul').on('click', 'li > a', function(e) {
        e.preventDefault();

        var code = $(this).closest('li').attr('code');
        $(this).closest('ul').find('.current').removeClass('current');
        $(this).addClass('current');
    });

    function showShippingCountry(name, code) {
        var $intlShipping = $scope.find('.figure-detail .description .international');
        var $domeShipping = $scope.find('.figure-detail .description .domestic');

        if (code == 'US') {
            $intlShipping.hide();
            $domeShipping.find('span.unable').hide();
            $domeShipping.find('span a').text(name);
            $domeShipping.find('span a').attr('code',code);
            $domeShipping.find('span.able').show();
            $domeShipping.show();
        } else {
            if( $intlShipping.length >0 ) { // available international shipping
                $domeShipping.hide();
                $intlShipping.find('span a').text(name);
                $intlShipping.find('span a').attr('code',code);
                $intlShipping.show();
            } else { // unavailable international shipping
                $intlShipping.hide();
                $domeShipping.find('span.able').hide();
                $domeShipping.find('span.unable').html('Unable to ship to <a href="#" code="' + code + '">' + name + '</a>');
                $domeShipping.find('span.unable').show();
                $domeShipping.show();
            }
        }
    }

    $scope.find('.popup.shipping').on('click', '.btn-area .save', function(e) {
        var $selected = $scope.find('.popup.shipping li .current');
        var code = $selected.parent().attr('code');
        var countryName = $selected.find('b').text();

        if(code) {
            showShippingCountry(countryName, code);
            $.post('/set_shipping_country', {'code': code, 'name': countryName});
        }
        $.dialog('shipping').close();
    });

    $scope.find('.popup.shipping').on('click', '.btn-area .cancel', function(e) {
        $.dialog('shipping').close();
    });

    $scope.find('.popup.shipping .search').on('keyup', '.text', function(e) {
        switch(e.which) {
            case 13: // Enter
                var $this = $(this);
                if ($this.hasClass('loading')) return;

                var text = $this.val();
                if (text === "") {
                    $scope.find('.popup.shipping ul').hide();
                    $scope.find('.popup.shipping ul.after').show();
                    return;
                }

                $this.addClass('loading');

                $.get('/rest-api/v1/countries/search',
                    { 'q': text },
                    function(json) {
                        $this.blur();
                        console.log(json);
                        var $ul = $scope.find('.popup.shipping ul.search-result');
                        $ul.html('');

                        _.each(json, function(country) {
                            var $li = $('<li></li>');
                            $li.attr('code', country.code)
                                .append('<a href="$"><b>' + country.name + '</b></a>');
                            $scope.find('.popup.shipping ul.search-result').append($li);
                        });
                        $this.removeClass('loading');
                        $scope.find('.popup.shipping ul').hide();
                        $scope.find('.popup.shipping ul.search-result').show();
                    }
                );
                break;
        }
    });

    $scope.find('.fancyd-friends a').hover(function(){
            $(this).find('span').css('margin-left',-($(this).find('span').width()/2)-10+'px');
    });

    $(function() {
        if ($scope.find(".thumbnail-list ul li").length > 1) {
            $scope.find(".figure-item figure a.prev,.figure-item figure a.next").show()
        }

        $(".video_player").videoPlayer();

        var shippingCountry = $.cookie.get('shipping_country');
        var shippingCountryCode = $.cookie.get('shipping_country_code');
        var currentCountry = $scope.find('.figure-detail .description .shipping span a').text();
        console.log(shippingCountry);

        if (shippingCountry && shippingCountry != currentCountry) {
            showShippingCountry(shippingCountry, shippingCountryCode);
        }

		if ($scope.find('.figure-detail .detail').height()<175) {
			$scope.find('.figure-detail .detail').addClass('short');
		}
    });

    $(".customer-review")
        .find("a.more")
            .click(function(e){
                e.preventDefault();
                $.dialog('customer-review').open();
                //$(".popup.customer-review").find("ul").scroll();
            })
        .end()


    var loading = false;
    var last = false;
    var $reviewTemplate = $(".popup.customer-review ul > script").remove();
    function loadReviews(){
        if(loading || last) return;

        loading = true;
        $(".popup.customer-review ul li.loading").show();
        var siid = $(".popup.customer-review ul").attr('data-siid');
        var rid = $(".popup.customer-review ul li[data-rid]:last").attr('data-rid');
        var params = {cursor: rid-1};
        $.ajax({
            type:'GET',
            url: '/rest-api/v1/reviews/'+siid, 
            data: params, 
            success : function(res){
                console.log(res);
                loading = false;
                $(".popup.customer-review ul li.loading").hide();
                var viewer_id = $(".popup.customer-review ul").attr('data-viewer_id');
                if(res.reviews.length){
                    $(res.reviews).each(function(){
                        this.votecnt = this.voteup + this.votedown;
                        this.up_percentage = (this.voteup/this.votecnt*100).toFixed(0);
                        this.date_created = $.datepicker.formatDate( 'MM d, yy', new Date(this.date_created) );
                        this.rating = this.rating*10;
                        this.voteup = this.voteup + "";
                        this.votedown = this.votedown + "";
                        var $el = $reviewTemplate.template(this);
                        if(this.votecnt) $el.find("p.precentage").show();
                        if(this.voted==0 && this.user.id != viewer_id) $el.find("p.survey").show();
                        $el.insertBefore( $(".popup.customer-review ul li.loading") );
                    })
                }else{
                    last = true;
                }
            }
        });
    }

    $(".popup.customer-review")
        .find("ul").scroll(function(e){
            var $ul = $(this);
            var scrollTop = $ul.scrollTop();
            var scrollHeight = $ul[0].scrollHeight;
            if(scrollTop > scrollHeight - $ul.height() - 200 ){
                loadReviews();
            }
        });

    $(".customer-review, .customer-review")
        .on('click', 'a.like', function(e){
            e.preventDefault();
            var siid = $(this).attr('data-siid');
            var rid = $(this).attr('data-rid');
            var params = {vote:1};
            $.ajax({
                type:'PUT',
                url: '/rest-api/v1/reviews/'+siid+"/"+rid, 
                data: params, 
                success : function(res){
                    $('.customer-review li[data-rid='+rid+"] p.survey").hide().next().show();        
                }
            });
        })
        .on('click', 'a.unlike', function(e){
            e.preventDefault();
            var siid = $(this).attr('data-siid');
            var rid = $(this).attr('data-rid');
            var params = {vote:-1};
            $.ajax({
                type:'PUT',
                url: '/rest-api/v1/reviews/'+siid+"/"+rid, 
                data: params, 
                success : function(res){
                    $('.customer-review li[data-rid='+rid+"] p.survey").hide().next().show();        
                }
            });
        })

})(jQuery);

};

jQuery(function () {
  if (window.is_thing_detail_page) {
    window.__thing();
  }
});
