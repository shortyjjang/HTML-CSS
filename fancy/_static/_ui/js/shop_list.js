jQuery(function($) {
	var code = null;

	$('.search .sub-category').change(function(){
		var $this = $(this), url = this.value, text = $this.find('>option').eq(this.selectedIndex).text(),issibling = $this.find('>option').eq(this.selectedIndex).hasClass('sibling');

        if (issibling)
		    $('ul.breadcrumbs').find('.last').remove();
		$('ul.breadcrumbs').append('<li class="last">/ <a href="#">'+text+'</a></li>');

		if(url) loadPage(url);
	});

	$('.search .price-range').change(function(){
		var range = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(range != '-1'){
			args.p = range;
		} else {
			delete args.p;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	$('.search .color-filter').change(function(){
		var color = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(color){
			args.c = color;
		} else {
			delete args.c;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});
    
    $('.search .sort-by-price').change(function(){
		var sort_by_price = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(sort_by_price){
			args.sort_by_price = sort_by_price;
		} else {
			delete args.sort_by_price;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});
	
    $('.search .relationship').change(function(){
		var relationship = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(relationship){
			args.rel = relationship;
		} else {
			delete args.rel;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	$('.search .se-gender').change(function(){
		var gender = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(gender){
			args.sg = gender;
		} else {
			delete args.sg;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});

	$('.search .re-gender').change(function(){
		var gender = this.value, url = location.pathname, args = $.extend({}, location.args), query;

		if(gender){
			args.rg = gender;
		} else {
			delete args.rg;
		}

		if(query = $.param(args)) url += '?'+query;

		loadPage(url);
	});
    $('#immediateShipping').change(function(){
        var v = this.value, url = location.pathname, args = $.extend({}, location.args), query;

        //if (this.checked) {
        //    args.is = v;
        //    $(this).closest('label').addClass('on');
        //} else {
        //    delete args.is;
        //    $(this).closest('label').removeClass('on');
        //}
        if ($(this).closest('label').hasClass('on')) {
            delete args.is;
            $(this).closest('label').removeClass('on');
        } else {
            args.is = v;
            $(this).closest('label').addClass('on');
        }

        if(query = $.param(args)) url += '?'+query;

        loadPage(url);
    });


	$('.search .search-string')
		.hotkey('ENTER', function(event){
			var q = $.trim(this.value), url = location.pathname, args = $.extend({}, location.args), query;

			event.preventDefault();

			if(q) {
				args.q = q;
			} else {
				delete args.q;
			}

			if(query = $.param(args)) url += '?'+query;

			loadPage(url);
		})
		.keyup(function(){
			var hasVal = !!$.trim(this.value);
			$(this).parent()
				.find('.del-val').css({opacity:hasVal?1:0}).end()
				.find('.label').css({opacity:hasVal?0:1});
		})
		.keyup();

	$('.search .filter-age')
		.hotkey('ENTER', function(event){
			var ra = $.trim(this.value), url = location.pathname, args = $.extend({}, location.args), query;

			event.preventDefault();

			if(ra) {
				args.ra = ra;
			} else {
				delete args.ra;
			}

			if(query = $.param(args)) url += '?'+query;

			loadPage(url);
		})
		.keyup(function(){
			var hasVal = !!$.trim(this.value);
			$(this).parent()
				.find('.del-val').css({opacity:hasVal?1:0}).end()
				.find('.label').css({opacity:hasVal?0:1});
		})
		.keyup();

	$('.search-frm .del-val').click(function(event){
	    event.preventDefault();
	    $(this).next('.search-string').val('').keyup();
	    var $age = $(this).next('.filter-age');
	    if ($age.length > 0) {
		    $age.val('').keyup();
	    }
	});

	$('ul.breadcrumbs').on('click', 'a', function(event){
		event.preventDefault();
		$(this).closest('li').nextAll('li').remove();
		loadPage(this.getAttribute('href'));
	});

	var $select = $('.shop div.outside select,.shop .search-frm select');
	$select.selectBox();
	$select.each(function(){
		var $this = $(this);
		if($this.css('display') != 'none') $this.css('visibility', 'visible');
	});
	
	// color palette
	$('.color-filter-selectBox-dropdown-menu')
		.addClass('palette')
		.find('>li >a').each(function(){
			var $this = $(this), color = $this.attr('rel');

			if(!color) return;
			$this.prepend('<i class="color '+color+'" /> ');
		});

	$.infiniteshow({itemSelector:'#content .stream > li'});

	var dlg_detail = $.dialog('preview-thing');
	dlg_detail.$obj
		.on('open', attachHotkey)
		.on('close', detachHotkey)
		.on('click', '.add_to_cart', function(){ 
		    var require_login = $(this).attr('require_login') == 'true';
		    dlg_detail.close(require_login);
		})
		.on('mouseover', 'a.paging', function(){
			var $this = $(this);
			if(!$this.hasClass('disabled')) $(this).addClass('hover');
		})
		.on('mouseout', 'a.paging', function(){
			$(this).removeClass('hover');
		})
		.on('click', 'a.paging', function(event){
			event.preventDefault();

			var $this = $(this), tid, $li, $btnNext, $btnPrev;
			if($this.hasClass('disabled')) return;

			tid = dlg_detail.$obj.find('.add_to_cart').attr('tid');
			$li = $('a#thing-'+tid).closest('li');
			$li = $this.hasClass('btn-prev')? $li.prev('li') : $li.next('li');
			if($li.length) $li.find('.zoom').click();

			$btnPrev = dlg_detail.$obj.find('.btn-prev');
			$btnNext = dlg_detail.$obj.find('.btn-next');

			$li.prev('li').length ? $btnPrev.removeClass('disabled') : $btnPrev.addClass('disabled').removeClass('hover');
			$li.next('li').length ? $btnNext.removeClass('disabled') : $btnNext.addClass('disabled').removeClass('hover');
		})
		.on('click', '.btn-campaign', function(){ 
			var img_url = $(this).attr('img_url');
			var t = $(this).attr('title');
			$('.gift-campaign').find('.fig-image > img').attr('src',img_url);
			$('.gift-campaign').find('.fig-caption > b').text(t);

			var $select = $('.gift-campaign select.select-white');
			$select.selectBox();
			$select.each(function(){
				var $this = $(this);
				if($this.css('display') != 'none') $this.css('visibility', 'visible');
			});
			dlg_detail.close() 
		})
		.on('keypress', function(){
			if(event.keyCode == 27){ dlg_detail.close() }
		});

    $('.stream').on('click','.figure-product-new .zoom',function(){
        var sid = $(this).attr('data-id'), param = {sale_item_id:sid};
	    $.post("/get-sale-item.json",param,
		        function(response){
			        if(response.status_code != undefined && response.status_code == 1){
                        try { track_event('View Sale Info', { 'sale id': sid.toString(), 'via': 'list' }); } catch(e) {}
                        $('.popup.preview-thing').find('.fill').empty();
                        $('.popup.preview-thing').find('.fill').append(response.html);

						if(!$.dialog('preview-thing').showing()){
							$.dialog('preview-thing').open();
						}
			      }
			      if(response.status_code != undefined && response.status_code == 0){
				      if(response.message != undefined)
					      alert(response.message);
			      }
        }, "json");
		return false;
    
    });

	function loadPage(url, skipSaveHistory){
		var $win = $(window), $stream  = $('#content ol.stream');

		if (!$stream.length) return;

		var $lis     = $stream.find('>li'),
			scTop    = $win.scrollTop(),
			stTop    = $stream.offset().top,
			winH     = $win.innerHeight(),
			headerH  = $('#header-new').height(),
			useCSS3  = Modernizr.csstransitions,
			firstTop = -1,
			maxDelay = 0,
			begin    = Date.now();

		if(useCSS3){
			$stream.addClass('use-css3').removeClass('fadein');

			$lis.each(function(i,v){
				if(!inViewport(v)) return;
				if(firstTop < 0) firstTop = v.offsetTop;

				var delay = Math.round(Math.sqrt(Math.pow(v.offsetTop - firstTop, 2)+Math.pow(v.offsetLeft, 2)));

				v.className += ' anim';
				setTimeout(function(){ v.className += ' fadeout'; }, delay+10);

				if(delay > maxDelay) maxDelay = delay;
			});
		}

		if(!skipSaveHistory && window.history && history.pushState){
			history.pushState({url:url}, document.title, url);
		}
		location.args = $.parseString(location.search.substr(1));
						
		$.ajax({
			type : 'GET',
			url  : url,
			dataType : 'html',
			success  : function(html){
				$('.price-range').selectBox('value', location.args.p || '-1');
				$('.relationship').selectBox('value', location.args.rel || '');
				$('.color-filter').selectBox('value', location.args.c || '');
				$('.sort-by-price').selectBox('value', location.args.sort_by_price || '');
				$('.se-gender').selectBox('value', location.args.sg || '');
				$('.re-gender').selectBox('value', location.args.rg || '');
				$('.filter-age').val(location.args.ra || '').keyup();
				$('.search-string').val(location.args.q || '').keyup();
                if(location.args.is){
                    $('#immediateShipping').closest('label').addClass('on')
                }
                else{
                    $('#immediateShipping').closest('label').removeClass('on')
                }


				var $html = $($.trim(html)),
				    $more = $('.pagination > a'),
				    $new_more = $html.find('.pagination > a'),
					$cate_sel = $('.shop-select.sub-category'),
				    $new_cate_sel = $html.find('.shop-select.sub-category');

				$('ul.breadcrumbs').html( $html.find('ul.breadcrumbs').html() );
				$cate_sel.html( $new_cate_sel.html() ).selectBox('destroy').selectBox();
				if($new_cate_sel.attr('edge')){
					$cate_sel.attr('edge', 'true');
					$('ul.sub-category-selectBox-dropdown-menu > li').removeClass('subcategory');
				} else {
					$cate_sel.removeAttr('edge', '');
					$('ul.sub-category-selectBox-dropdown-menu > li:not(:first-child)').addClass('subcategory');
				}

				$stream.html( $html.find('#content > ol.stream').html() );

				if($new_more.length) $('.pagination').append($new_more);
				$more.remove();

				(function(){
					if(useCSS3 && (Date.now() - begin < maxDelay+300)){
						return setTimeout(arguments.callee, 50);
					}

					$stream.addClass('fadein').html( $html.find('#content > ol.stream').html() );
					
					if(useCSS3){
						$win.scrollTop(scTop);
						scTop = $win.scrollTop();
						stTop = $stream.offset().top;
						
						firstTop = -1;
						$stream.find('>li').each(function(i,v){
							if(!inViewport(v)) return;
							if(firstTop < 0) firstTop = v.offsetTop;
							
							var delay = Math.round(Math.sqrt(Math.pow(v.offsetTop - firstTop, 2)+Math.pow(v.offsetLeft, 2)));
							
							v.className += ' anim';
							setTimeout(function(){ v.className += ' fadein'; }, delay+10);
							
							if(delay > maxDelay) maxDelay = delay;
						});

						setTimeout(function(){ $stream.removeClass('use-css3 fadein').find('li.anim').removeClass('anim fadein'); }, maxDelay+300);
					}

					// reset infiniteshow
					$.infiniteshow({itemSelector:'#content .stream > li'});
					$win.trigger('scroll');
				})();
			}
		});

		function inViewport(el){
			return (stTop + el.offsetTop + el.offsetHeight > scTop + headerH) && (stTop + el.offsetTop < scTop + winH);
		};
	};
    var tooltip = function(target) {
        var $target = $(target);
        if (!$('#tooltip').length) {
            $('<span>').attr('id','tooltip').appendTo(document.body);
        }
        var $tooltip = $('#tooltip').show();

        $tooltip.text($target.text());
        var o = $target.offset();
        o.left = Math.round(o.left - ($tooltip.width() + 16 - $target.width()) / 2); //16:#tooltip's padding
        o.top = Math.round(o.top - ($tooltip.height() + 9));
        $('#tooltip').offset(o);
    };

    $('.tooltip').hover(function() {
        tooltip(this);
    }, function() {
        $('#tooltip').hide();
    })
	function attachHotkey(){
		$(document).on('keydown.shop', function(event){
			var key = event.which, tid, $li;
			if(!dlg_detail.showing() || (key != 37 /* LEFT */ && key != 39 /* RIGHT */)) return;

			event.preventDefault();

			dlg_detail.$obj.find(key==37?'>.btn-prev':'>.btn-next').click();
		});
	};

	function detachHotkey(){
		$(document).off('keydown.shop');
	};

	(function(){
		var $cate_sel = $('.shop-select.sub-category')
		if($cate_sel.attr('edge')){
			$('ul.sub-category-selectBox-dropdown-menu > li').removeClass('subcategory');
		} else {
			$('ul.sub-category-selectBox-dropdown-menu > li:not(:first-child)').addClass('subcategory');
		}
	})();

	$(window).on('popstate', function(event){
		var e = event.originalEvent;
		if(!e || !e.state) return;

		loadPage(event.originalEvent.state.url, true);
	});

	if(window.history && history.pushState){
		history.pushState({url:location.href}, document.title, location.href);
	}
});
