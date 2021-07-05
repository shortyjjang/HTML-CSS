/**
 * slide 엘리먼트에 data-interval="3000"과 같이 설정하면 슬라이드 쇼 간격을 설정할 수 있습니다(3000 = 3초). 기본값은 5000.
 * .dot 엘리먼트에 data-interval="200"과 같이 설정하면 각 점들이 나타나는 간격을 설정할 수 있습니다. 기본값은 100(=0.1초)
 * div.visual에 data-preload="이미지경로1;이미지경로2;"를 설정하면 설정한 이미지를 모두 읽어들인 다음에 animation 클래스를 추가합니다.
 * (설정하지 않으면 기존과 같이 0.4초 후 추가)
 *
 * If you set data-preload="pathOfImage1;pathOfImage2;" attribute to div.visual, anmation class is appended after all the images are loaded.
 * Otherwise, the class is added with 0.4s delay.
 */
 
function allowDrop(ev) {
ev.preventDefault();
}
function drag(ev) {
	$('.resources .add_fancy .btn-fancyit').addClass('drag');
	$('.btn-fancyit-arrow').removeAttr('style').show().css({top:'10px',opacity:'1'});
}
function drop(ev) {
	ev.preventDefault();
	$('.resources .add_fancy .btn-fancyit').removeClass('drag');
	$('.btn-fancyit-arrow').removeAttr('style').hide();
}

jQuery(function($){
	var $win = $(window), $body = $('body'), $header = $('#header'), $wrap = $('#wrap'), hashTimer;
	
	// resource loading indicator
	(function(){
		var $loader = $('#page-loader'), $imgs = $('img'), total = $imgs.length+1, loaded = 0;
		
		$imgs.load(function(){
			$loader.css('width', (++loaded/total)*100+'%');
		});

		$win.load(function(){
			$loader.css('width', '100%');
			setTimeout(function(){ $loader.css('opacity',0) }, 400);
		});
	})();
	
	// top navigation
	(function(){
		var prevPos = $wrap.scrollTop(), $contents = $('.contents');
		if ($win.width() > 970) {
			$header.width($('.container').width());
		}
		$wrap.scroll(function(event){
			var curPos = $wrap.scrollTop(), threshold = $contents.filter(':visible').find('.visual').height() - 1;
			if (threshold<0) {
				$header.addClass('fixed show');
			}else {
				if (curPos <= prevPos) { // moving up
					if (curPos < 50) $header.removeClass('fixed top');
					if (curPos < threshold) $header.removeClass('show');
				} else { // moving down
					if (curPos > 50) $header.addClass('top');
					if (curPos > threshold) $header.addClass('fixed show');
				}
			}
			prevPos = curPos;
		}).scroll();
	})();
	
	// navigation on sidebar
	(function(){
		var $nav = $('.navigation'), $langs = $nav.find('.language-list');

		// close navigation menus
		$('.navigation-trick')
			.click(function(){
				$body.removeClass('opened');
				return false;
			})
			.mousedown(function(){
				$langs.trigger('hide');
			});
		
		$header.find('a.menu').click(function(){
			$body.addClass('opened');
			$langs.hide();
			return false;
		});
		
		$nav
			.on('mousedown', function(event){
				if (!$(event.target).closest('.language-list,.lang-current').length) {
					$langs.trigger('hide');
				}
			})
			.on('click', '.major a, .etc a', function(event){		
				// hide side navigation
				$('.navigation-trick').click();
				// emulate hashchange event for older browsers
				hashTimer = setTimeout(function(){ $win.trigger('hashchange') }, 10);
			})
			.on('click', '.lang a.lang-current', function(event){
				$langs.trigger( $langs.is(':visible') ? 'hide' : 'show' );
				return false;
			})
			.on('click', '.language-list a', function(event){
				event.preventDefault();
				$langs.trigger('hide');
			});
			
		$langs
			.on('show', function(){
				var offset = $langs.css('top','').removeClass('up').show().offset();
				if (offset.top + $langs.height() > $win.height()) {
					$langs.addClass('up').css('top', $('.lang-current').offset().top - $langs.height() - 4);
				}
			})
			.on('hide', function(){
				$langs.hide();
			});
	})();
	
	// contents
	(function(){
		var $slide, $sidebar = $('.sidebar'), slideTimer;
		
		$sidebar.on('click', 'a', function(){
			hashTimer = setTimeout(function(){ $win.trigger('hashchange') }, 10);
		});

		$('#content > .contents')
			.on('show', function(){
				var $this = $(this).show(), $visual, preloads, loadCount=0;

				($this.data('head') == 'dark') ? $header.addClass('dark') : $header.removeClass('dark');
				
				$slide = $this.find('.slide').trigger('reset');
				$visual = $this.find('.visual');

				$('.visual').removeClass('animation');
				
				$wrap.scrollTop(0).scroll();

				function beginAnimation(){
					$visual.addClass('animation');
				};

				preloads = $visual.attr('data-preload') || '';
				if (preloads) preloads = preloads.split(/\s*;\s*/g);
				if (preloads.length) {
					$.each(preloads, function(){
						var img = new Image();
						img.onload = function(){
							if (++loadCount == preloads.length) beginAnimation();
						};
						img.src = this;
					});
				} else {
					setTimeout(beginAnimation, 400);
				}

				clearTimeout(slideTimer);
			})
			.on('hide', function(){
				$(this).hide();
			})
			.find('.slide')
				.on('reset', function(){
					var $this = $(this), cls = $this.attr('class');

					$this
						.data('index', $this.length ? 0 : 0)
						.attr('class', cls.replace(/\bpaging\d+\b/g,''))
						.addClass('paging' + $this.data('index'))
						.find('.dot').children().removeClass('show').end().end()
						.find('.prev').addClass('disabled');

				})
				.on('slideshow', function(){
					$(this).trigger('reset').trigger('next');
				})
				.on('prev next', function(event){
					var $this = $(this), index, len, next, $dot, $dots;
					
					clearTimeout(slideTimer);

					len   = $this.closest('.slide').find('.slide-item').length;
					index = $this.data('index');
					next  = (event.type == 'next');

					$this.removeClass('paging'+index);
					if (next) {
						index = Math.min(index + 1, len);
					} else {
						index = Math.max(index - 1, 1);
					}
					
					(index <= 1) ? $this.find('a.prev').addClass('disabled') : $this.find('a.prev').removeClass('disabled');
					(index == len) ? $this.find('a.next').addClass('disabled') : $this.find('a.next').removeClass('disabled');

					$this.data('index', index).addClass('paging'+index);

					function gotoNext(){
						if (index == len) return;
						clearTimeout(slideTimer);
						slideTimer = setTimeout(function(){ $this.trigger('next') }, +$this.data('interval') || 5000);
					};
					
					// animate dots
					$dot = $this.find('.slide'+index+' .dot').removeClass('dot');
					if ($dot.length) {
						setTimeout(function(){ $dot.children().removeClass('show').end().addClass('dot') }, 1);

						(function($dots){
							var fn = arguments.callee;
							slideTimer = setTimeout(function(){
								if ($dots.length) {
									$dots.eq(0).addClass('show');
									fn($dots.slice(1));
								} else {
									//gotoNext();
								}
							}, +$dots.parent().data('interval') || 100);
						})($dot.children());
					} else if ($this.parent('#feature').length > 0) {
						//gotoNext();
					} else {
						//gotoNext();
					}
				})
				.on('click', 'a.prev', function(event){
					event.preventDefault();
					$(this).closest('.slide').trigger('prev');
				})
				.on('click', 'a.next', function(event){
					event.preventDefault();
					$(this).closest('.slide').trigger('next');
				})
			.end();
			

		$wrap.scroll(function(){
			// animate slideshow
			if (!$slide || !$slide.length) return;

			var top = $slide.offset().top;

			if ($win.height() - $slide.height()/2 > top) {
				$slide.trigger('slideshow');
				$slide = null;
			}
			if ($win.width()<970) {
				$header.find('.inner').css('left',-$wrap.scrollLeft()+'px');
			}
		});

		$win.resize(function(){
			if ($win.width() > 970) {
				$header.css('margin-left',$wrap.find('.container').width() - $win.width() + 'px').find('.head').css('padding-left',($win.width() - $wrap.find('.container').width())/2 + 'px').find('.inner').removeAttr('style');

				$('#popup_container h1.logo').find('.icon').css('margin-left',$wrap.find('.container').width() - $win.width() - (($win.width() - $wrap.find('.container').width())/4) + 'px');
			}else{
				$header.removeAttr('style').find('.head').removeAttr('style');
				$('#popup_container h1.logo').removeAttr('style');
			}
		});
			
		$win.on('hashchange', function(event, hashParam){
			var hash = hashParam || location.hash || '#about';
			if (hash.length < 2) return;
			if ($(hash).filter('.contents').length == 0 && $(hash).filter('.sub-contents').length == 0 ) return;
			clearTimeout(hashTimer);
			if ($(hash).filter('.sub-contents').length > 0) {
				var menu = $(hash).filter('.sub-contents').parents('.contents').attr('id');
				$('#'+menu).find('.sub-contents').hide().end().find(hash).show();
				$('#'+menu).siblings('.contents').trigger('hide').end().trigger('show');
				$('.navigation a').removeClass('current').filter('[href="'+hash+'"]').addClass('current').filter(function(){$(this).text() == menu;}).addClass('current');
				$('#'+menu+' .snb').find('a').removeClass('current').end().find('a[href="'+hash+'"]').addClass('current');
				if (menu == 'business' || menu == 'partner') {
					$header.removeClass('merchant-sign').removeClass('merchant').find('.stit').show().find('b').text('Business').end().end().find('.logo .icon').width(27);
				}else if (menu == 'merchant_topic') {
					$('#merchant_topic .snb li').removeClass('show');
					$('#merchant_topic .snb a[href="'+hash+'"]').closest('li').find('a:eq(0)').addClass('current').end().addClass('show');
					$('#merchant_topic').find('.inner').removeAttr('style').end().find('.search-result').show();
					$('#partner, #business').hide();
				}else{
					$header.removeClass('merchant-sign').removeClass('merchant').find('.stit').hide().end().find('.logo .icon').width(129);
				}
			}else{
				$(hash).siblings('.contents').trigger('hide').end().trigger('show');
				$('.navigation a').removeClass('current').filter('[href="'+hash+'"]').addClass('current');
				if (hash == '#google_glass') {
					$header.removeClass('merchant').find('.stit').show().find('b').text($('.navigation a').filter('[href="'+hash+'"]').text()).end().end().find('.logo .icon').width(27);
				} else if (hash == '#merchant' || hash == '#featured' || hash == '#pricing') {
					$header.removeClass('merchant-sign').addClass('merchant').find('.stit').show().find('b').text('Merchants').end().end().find('.logo .icon').width(27).end();
					$('#merchant_resources').find('.inner').removeAttr('style').end().find('.search-result').show();
					if (hash == '#merchant') {
						$header.find('.merchant-menu li:eq(0) a').addClass('current');
					}
					if (hash == '#featured') {
						$header.find('.merchant-menu li:first-child a').addClass('current');
					}
					if (hash == '#pricing') {
						$header.find('.merchant-menu li:eq(1) a').addClass('current');
					}
					$('#partner, #business').hide();
				}else if (hash == '#merchant_signup') {
					$header.removeClass('merchant').addClass('merchant-sign').find('.stit').show().find('b').text('Merchants').end().end().find('.logo .icon').width(27).end();
					$('#partner, #business').hide();
				}else if (hash == '#partner') {
					$header.removeClass('merchant-sign').removeClass('merchant').find('.stit').show().find('b').text('Business').end().end().find('.logo .icon').width(27);
				} else{
					$header.removeClass('merchant-sign').removeClass('merchant').find('.stit').hide().end().find('.logo .icon').width(129);
				}
			}
			$('.merchant .search-result').hide();
		});

		if ($win.width() > 970) {
			$header.css('margin-left',$wrap.find('.container').width() - $win.width() + 'px').find('.head').css('padding-left',($win.width() - $wrap.find('.container').width())/2 + 'px').find('.inner').removeAttr('style');

			$('#popup_container h1.logo').find('.icon').css('margin-left',$wrap.find('.container').width() - $win.width() - (($win.width() - $wrap.find('.container').width())/4) + 'px');
		}else{
			$header.removeAttr('style').find('.head').removeAttr('style');
			$('#popup_container h1.logo').removeAttr('style');
		}

		// on page loaded
		(function(hash){
			if (!hash || hash.length < 2) return;

			var $hash = $(hash), $content;
			
			if (!$hash.length) return;
			
			$content = $hash;
			if (!$content.length) return;
			
			$win.trigger('hashchange', '#'+$content.attr('id'));
			location.hash = hash;
		})(location.hash);
	})();

	// language picker in footer
	(function(){
		var $lang = $('#footer .lang'), timer, $langPop = $('.language-popup');

		$lang
			.on('click', 'a', function(event){
				event.preventDefault();
				$langPop.addClass('show');
				clearTimeout(timer);
				timer = setTimeout(function(){
					$langPop.css('opacity', 1);
					timer = setTimeout(function(){
						$langPop.find('.language-list').addClass('show');
					}, 300);
				}, 1);
				
			});
		$langPop
			.on('click', function(event){
				if (event.target == this) {
					$langPop.find('.language-list').removeClass('show');
					clearTimeout(timer);
					timer = setTimeout(function(){
						$langPop.css('opacity', 0);
						timer = setTimeout(function(){
							$langPop.removeClass('show');
						}, 300);
					}, 300);
				}
			})
			.delegate('.ly-close', 'click', function(event){
				$langPop.find('.language-list').removeClass('show');
				
				clearTimeout(timer);
				timer = setTimeout(function(){
					$langPop.css('opacity', 0);
					timer = setTimeout(function(){
						$langPop.removeClass('show');
					}, 300);
				}, 300);
			});
	})();

	(function(){
	
		if (navigator.userAgent.indexOf('Firefox') != -1){$('body').addClass('moz');$('.resources .chrome').text('Firefox');}
		if (navigator.userAgent.indexOf('MSIE') != -1) {$('body').addClass('ms');$('.drag-button').hide();$('.drag-button.ms').show();}

		//business story
		var $story_tab = $('#story .paging');
		$story_tab.on('click','a', function(){
			$('#story .paging a').removeClass('current');
			$(this).parents('#story').find('.slide-item').hide().end().find('.slide-item.'+$(this).attr('slide-num')).show();
			$(this).addClass('current');
			return false;
		});
		//business-index story
		var $story_focus = $('.business.intro .stories .tab li');
		$story_focus.on('mouseover', function(){
			var cont = '.'+$(this).find('a').attr('slide-num');
			$story_focus.removeClass('hover');
			$(this).addClass('hover');
			$('.business.intro .stories .introduce').css('opacity','0').filter(cont).css('opacity','1');
			return false;
		});
		// faq
		$('.topic dt').click(function(){
			$(this).parents('dl').toggleClass('show');
		});
		//map
		$('#map input').keypress(function(){
			$(this).parents('fieldset').find('.zip-list').show();
		});
		//release
		$('.releases .lists a').click(function(){
			return false;
		});
		// show glass movie
		$movie = $('.view-movie');
		$('.glass .btn-show').click(function(){
			$movie.find('.frame').attr('open','open');
			$movie.find('.frame iframe').attr('open','open').attr('src','http://player.vimeo.com/video/66838775?autoplay=1');
			$movie.find('.frame iframe').load(function(){
				if($movie.find('.frame').attr('open') == 'open' ){
					$movie.show();
					setTimeout(function(){$movie.animate({opacity:'1'},function(){$movie.addClass('show').find('.frame').removeAttr('open');});},10);
				}
			});
		});
		//widget tab
		$('.resources')
			.find('.btns_widget .stit a').click(function(){
				$('.resources .btns_widget dl').removeClass('current');
				$(this).parents('dl').addClass('current');
				return false;
			}).end()
			.find('.btn-getcode')
				.click(function(){
					$(this).parents('dd').find('.get_code').toggle();
				})
			.end()
			.find('.add_fancy .btn-fancyit')
				.hover(function(){
					$(this).html('Drag it');
					$('.btn-fancyit-arrow').show();
					if ($wrap.scrollTop() > 340) {
						$('.btn-fancyit-arrow').height(242-($wrap.scrollTop()-340));
						setTimeout(function(){$('.btn-fancyit-arrow').css({top:$wrap.scrollTop()+10+'px',opacity:'1'});},10);
					}else{
						$('.btn-fancyit-arrow').height(242);
						setTimeout(function(){$('.btn-fancyit-arrow').css({top:$wrap.scrollTop()+10+'px',opacity:'1'});},10);
					}
				},function(){
					$(this).html('Fancy it');
					$('.btn-fancyit-arrow').hide().css({top:'350px',opacity:'0'});
				})
				.click(function(){return false;}/*)
				.mousedown(function(){
					$(this).addClass('drag');
				})
				.mouseout(function(){
					$(this).removeClass('drag');
					$('.btn-fancyit-arrow').remove();
			}*/
		);
		// glass movie
		$('.view-movie, .view-movie .close').on('click', function(event){
			if(event.target == this) {
				$movie.removeClass('show');
				setTimeout(function(){$movie.animate({opacity:'0'},function(){$movie.hide().find('iframe').removeAttr('src');});},200);
			}
		});
		// form script
		$('input[type="text"], textarea')
			.focus(function(){
				if($(this).hasClass('error')){
					$(this).addClass('focus').removeClass('error');
					$(this).keyup(function(){$(this).addClass('active');});
					$(this).blur(function(){
						$(this).removeClass('focus');
						if ($(this).val()=='') {$(this).removeClass('active').addClass('error');}
					});
				}
				else{
					$(this).addClass('focus');
					$(this).keyup(function(){$(this).addClass('active');});
					$(this).blur(function(){
						$(this).removeClass('focus');
						if ($(this).val()=='') {$(this).removeClass('active');}
					});
				}
			});
	})();

	(function(){

		$wrap.scroll(function(){
			$('.merchant.idx, .merchant.fea').find('.inner').each(function(){
				var $this = $(this);
				if ($(this).closest('div').hasClass('accepting')==true) {var $this = $this.find('.browser');}
				var top = $this.offset().top;
				if (top < ($(window).height()-$this.height())/2 + 52) {
					$this.addClass('show');
				}
			});
			$('.merchant.idx .spectrum dl').each(function(){
				var $this = $(this);
				var top = $this.offset().top;
				if (top < ($(window).height()-$this.height())/2 + 52) {
					$this.addClass('show');
				}
			});
		});
	})();

	$('#popup_container')
	.on('click', function(event){
		if(event.target === this) {
			$(this).removeAttr('class').removeAttr('style');
		}
	});
	$('.popup.merchant-signin')
	.on('click', function(event){
		if(event.target === this) {
			$(this).closest('#popup_container').removeAttr('class').removeAttr('style');
		}
	});
});

jQuery(function($) {
	var tag_ids = {}; 
	var search_data = []; 
	$('#merchant_topic').find('ul.snb a').each(function(){
		var tag_id = $(this).attr('href');
		if (!(tag_id in tag_ids)){
			var title = $(this).text();
			var txt = $(tag_id).find('h3').text();
			var d = {'label':txt,'title':title,'tag_id':tag_id};
			search_data.push(d);
			tag_ids[tag_id]=d
		}   
	}); 
	$('fieldset.search').each(function(){
		$(this).find('button').click(function(){
			var data = $('.ui-autocomplete.'+$(this).closest('.search').find('.text').attr('search')).filter(':visible').html();
            if (data == null || data == undefined)
                data = '';
			$('.contents').filter(':visible').find('.inner').hide().end().find('.visual .inner').removeAttr('style').end().append('<div class="search-result inner" style="display:block;"><h2>Search Results <small>'+ $('.ui-autocomplete.'+$(this).closest('.search').find('.text').attr('search')).filter(':visible').find('li').length + ' results for "'+$('.contents').filter(':visible').find("fieldset.search input.text" ).val()+'"</small></h2><ul>'+data+'</ul><p class="contact">Can’t find what you’re looking for? <a href="#contact">Contact Us</a></p>');
            $('.search-result').filter(':visible').find('ul li span.drop-desc').show();
            $('.search-result').filter(':visible').find('ul li span.drop-title').css("font-size", "20px").css('color','#3298db');
		});
		$(this).find('input.text')
			.autocomplete({   
				source:search_data,
				minLength: 1,
				appendTo:"#wrap",
				select: function(event,ui)
				{   
					//$( "fieldset.search input.text" ).val( ui.item.title + ui.item.label );
					location.replace(ui.item.tag_id);
				}   
			}).data( "autocomplete" )._renderItem = function( ul, item ) {
                var t = item.title.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
                var l = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
                return $( "<li></li>" )
			    	.data( "item.autocomplete", item )
					.append( '<a href="/about'+ item.tag_id +'"><span class="drop-title">' +  t + "</span><br/><span class='drop-desc' style='display:none;'>"+l+"</span></a>" )
					.appendTo( ul );
			};
	}).keypress(function(e) {
        if (e.which == 13){
            $(this).find('button').click();
			$('.ui-autocomplete.'+$(this).closest('.search').find('.text').attr('search')).hide();
        }
    });;
}); 

