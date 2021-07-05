/**
 * Created by ryan on 1/21/16.
 */
(function(){
    var prefetchajax = null;
    var category = "all";
    var ajax     = null;
    var $wrapper = $("#content");
    var $menutabs = $('.menu li'),
        $contents_wrap = $("#home-timeline"),
        $feedtabs = $('.menu a[data-feed]'),
        vid = $contents_wrap.attr('vid');

    if( $("a.current[data-feed]").attr('data-feed') == 'featured'){
		prefetchTab('recommended');
	}else{
		prefetchTab('featured');
	}

    function prefetchTab(feed, category){
		if(!category) category = 'all';
		var result = $.jStorage.get('first-'+vid+'-'+feed+"-"+category+'.new');
		if(!result){
			$feedtabs.filter("[data-feed="+feed+"]").addClass('_prefetching');
			if(prefetchajax) prefetchajax.abort();
			prefetchajax = $.ajax({
				url : '/_featured_feed?feed='+feed+'&category='+category,
				dataType : 'html',
				success : function(data, st, xhr) {
					result = data;
					$.jStorage.set('first-'+vid+'-'+feed+'-'+category+'.new', result, {TTL:5*60*1000});
					if( $feedtabs.filter("[data-feed="+feed+"]").hasClass('_switchNow') ){
						$feedtabs.filter("[data-feed="+feed+"]").removeClass('_switchNow');
						switchTab(feed);
					}
				}
				,complete : function(){
					$feedtabs.filter("[data-feed="+feed+"]").removeClass('_prefetching');
				}
			});
		}
	}

    // Need to Handle fancyd item when using cache (or not using cache all together)

    $feedtabs.click(function(e){
        var items = $("#home-timeline").children();

        items.each(function(i) {
          $(this).delay(i*100).animate({
              opacity:0.01,
          },100)
        });
        var feed_type = $(this).attr("data-feed") || "featured";
        $('.menu a.current').removeClass("current");
		$(this).addClass('current');
        if( $(this).hasClass('_prefetching') ){
			$(this).addClass('_switchNow');
		}else{
			switchTab(feed_type);
		}
		e.preventDefault();

    });
    window.cached_result = null;
    var switchTab = function switchTab(feed_type, category){
        //$.jStorage.deleteKey(keys.prefetch);
        $.infiniteshow.abort();
        if(!category) category = "all";
		if(ajax) ajax.abort();
		if(prefetchajax) prefetchajax.abort();

        $.cookie.set('timeline-feed',feed_type,9999);
        window.cached_result = $.jStorage.get('first-'+vid+'-'+feed_type+"-"+category+'.new');
        if(!window.cached_result) {
            ajax = $.ajax({
                url: '/_featured_feed?feed=' + feed_type + '&category=' + category,
                dataType: 'html',
                success: function (data, st, xhr) {
                    window.cached_result = data;
                    //var result = data;
                    $.jStorage.set('first-' + vid + '-' + feed_type + '-' + category + '.new', data, {TTL: 5 * 60 * 1000});
                    swapContent(false);
                },
                error: function (xhr, st, err) {
                    url = '';
                },
                complete: function () {
                    /*
                     $stream.trigger("changeloc");
                     $wrapper.off('before-fadein').on('before-fadein', swapContent);
                     $wrapper.off('after-fadein').on('after-fadein', done);
                     $wrapper.trigger("redraw");
                     */

                }
            });
        }else{
            swapContent(true);
        }

    };
    var swapContent = function(is_cached){
        var feed_type = $("#content .menu a.current").attr("data-feed") || "featured";
        var data = window.cached_result;
        if(!data){
            setTimeout(swapContent,20,is_cached);
            return;
        }
        if($wrapper.hasClass("swapping")) {
            return;
        }
        $wrapper.addClass("swapping");
        var $sandbox = $(data);
        var feed_data = $sandbox.find("#home-timeline").html();
        if(!!$sandbox.find("#pagination_div")) {
            //var pagination_div = $sandbox.find("#pagination_div")[0].outerHTML;
            var pagination_div = $sandbox.find("#pagination_div").prop('outerHTML');
        }else{
            var pagination_div = false;
        }
        var infscr_loading = $sandbox.find("#infscr-loading").html();
        $("#home-timeline").html(feed_data).promise().done(function(){
            $wrapper.removeClass("swapping");
        });

        if (feed_type == 'featured') {
            $("#home-timeline").children().css({opacity: 0.01});
        }else if (feed_type == 'recommended'){
            $("#home-timeline .fancy-item-list").children().css({opacity: 0.01});
        }
        $("#infscr-loading").html(infscr_loading);
        $("#pagination_div").remove();
        if (!!pagination_div){
            $("#infscr-loading").after($(pagination_div));
        }
        if (feed_type == 'featured') {
            var items = $("#home-timeline").children();
        }else if (feed_type == 'recommended'){
            var items = $("#home-timeline .fancy-item-list").children();
        }
        items.each(function(i) {
          $(this).delay(i*50).animate({
              opacity:1.0
          },50)
        });
        $.remove_infiniteshow();
        if (feed_type == 'featured'){
            $.infiniteshow({
            itemSelector:'#home-timeline > .fancy-item-list',
            streamSelector:'#home-timeline',
            dataKey:'home-new',
            post_callback: function($items){ $('#home-timeline').trigger('itemloaded') },
            prefetch:true,
            newtimeline:true
            });
        }else if (feed_type == 'recommended'){
            $.infiniteshow({
            itemSelector:'#home-timeline .fancy-item-list > li',
            streamSelector:'#home-timeline .fancy-item-list',
            dataKey:'home-new',
            post_callback: function($items){ $('#home-timeline').trigger('itemloaded') },
            prefetch:true,
            newtimeline:true
            });
        }
        if(is_cached){
            if (feed_type == 'featured') {
                var $rows = $("#home-timeline > .fancy-item-list");
            }else {
                return;
            }
            var ids = [];
				$rows.each(function(){
					var tid = this.getAttribute('tid');
					if(tid) ids.push(tid)
				});

				if(!ids.length) return;

				$.ajax({
					type : 'GET',
					url  : '/user_fancyd_things.json',
					data : {object_ids:ids.join(',')},
					dataType : 'json',
					success : function(json){
						var ids = {};
						$.each(json, function(i,v){ ids[v.object_id] = v.id });
						$rows.each(function(){
							var $this = $(this), btn, rtid;
							if(rtid=ids[this.getAttribute('tid')]) {
								btn = $this.find('a.button.fancy').attr('rtid', rtid).toggleClass('fancy fancyd').get(0);
								if(btn) btn.lastChild.nodeValue = gettext(" Fancy'd");
							} else {
								btn = $this.find('a.button.fancyd').removeAttr('rtid').toggleClass('fancy fancyd').get(0);
								if(btn) btn.lastChild.nodeValue = gettext(" Fancy");
							}
						});
					}
				});
        }




    };
    var updateSocialLink = function updateSocialLink(url, txt, img){
		var url = encodeURIComponent(url);
		var txt = encodeURIComponent(txt);
		var img = encodeURIComponent(img);

		$('#share-box')
			.find('a.tw').attr('href', 'http://twitter.com/share?text='+txt+'&url='+url+'&via=fancy').data({width:540,height:300}).end()
			.find('a.fb').attr('href', 'http://www.facebook.com/sharer.php?u='+url).data({url:url,text:txt}).end()
			.find('a.gg').attr('href', 'https://plus.google.com/share?url='+url).end()
			.find('a.tb').attr('href', 'http://www.tumblr.com/share/link?url='+url+'&name='+txt+'&description='+txt).end();
			/*
			.find('a.li').attr('href', 'http://www.linkedin.com/shareArticle?mini=true&url='+enc_url+'&title='+enc_txt+'&source=thefancy.com').end()
			.find('a.vk').attr('href', 'http://vkontakte.ru/share.php?url='+enc_url).end()
			.find('a.wb').attr('href', 'http://service.weibo.com/share/share.php?url='+enc_url+'&appkey=&title='+enc_txt+(img?'&pic='+enc_img:'')).end()
			.find('a.mx').attr('href', 'http://mixi.jp/share.pl?u='+enc_url+'&k=91966ce7669c34754b21555e4ae88eedce498bf0').data({width:632,height:456}).end()
			.find('a.qz').attr('href', 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+enc_url).end()
			.find('a.rr').attr('href', 'http://share.renren.com/share/buttonshare.do?link='+enc_url+'&title='+enc_txt).end()
			.find('a.od').attr('href', 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=2&st.noresize=on&st._surl='+enc_url).end()
			*/
    };
    $("#home-timeline").on('click','a.share',function(){
        var tid = $(this).attr('tid');
        var objectType = $(this).data('object-type') || 'thing';
        var imgUrl = "https://" + $(this).data('img');
        var title = $(this).data('title');
        var url = $(this).data('url');
        var $link = $("#more-share-link");

        var payload;
        if (objectType !== 'thing') {
            payload = { url : 'https://' + location.hostname + url }
        } else {
            payload = { thing_id: tid }
        }
        $.post('/get_short_url.json', payload).done(function(data){
				if(data.short_url) {
					$link.val(data.short_url);
					updateSocialLink(data.short_url, title, imgUrl);
				}else{
                    return false;
                }
        });
        $('#pop_wrap').addClass('share_thing').show();



    });


})();