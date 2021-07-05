/**
 * Set data-interval="NUMBER_IN_MS" to configure interval of slideshow images. default : 5000
 *
 * If you set data-preload="pathOfImage1;pathOfImage2;" attribute to div.visual, anmation class is appended after all the images are loaded.
 * Otherwise, the class is added with 0.4s delay.
 */

function selectStory(str){
	$('.business .stories .paging a[slide-num="'+str+'"]').click();
}

jQuery(function($){
	var $win = $(window), $body = $('body'), $header = $('#header'), $wrap = $('#wrap');

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
		$win.resize(function(){
			if ($body.hasClass('opened')==false) {
				if ($(window).width()<1080) {
					if ($header.hasClass('fixed')==true) {$header.find('.head').css('left',-($wrap.scrollLeft() + ($win.width() - $wrap.width()) * 0.5)+'px');
					}else{$header.find('.head').css('left','');}
				}
			}else{
				$header.find('.head').css('left','');
			}
		});
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
			if ($body.hasClass('opened')==false) {
				if ($(window).width()<1080) {
					if ($header.hasClass('fixed')==true) {$header.find('.head').css('left',-($wrap.scrollLeft() + ($win.width() - $wrap.width()) * 0.5)+'px');
					}else{$header.find('.head').css('left','');}
				}
			}else{
				$header.find('.head').css('left','');
			}
		}).scroll();
	})();

	// navigation on sidebar
	(function(){
		var $nav = $('.navigation'), $langs = $nav.find('.language-list');

		// close navigation menus
		$('.navigation-trick')
			.click(function(){
				$body.removeClass('opened');
				$header.find('.head').css('left','');
				$('.container').css('left','');
				return false;
			})
			.mousedown(function(){
				$langs.trigger('hide');
			});

		$header.find('a.menu').click(function(){
			$body.addClass('opened');
			if ($body.hasClass('opened')==false) {
				if ($(window).width()<1080) {
					if ($header.hasClass('fixed')==true) {$header.find('.head').css('left',-($wrap.scrollLeft() + ($win.width() - $wrap.width()) * 0.5) +'px');
					}else{$header.find('.head').css('left','');}
				}
			}
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
			})
			.on('click', 'a', function(event){
				event.preventDefault();

				var $this = $(this), code = $this.attr('href').substr(1), name = $this.text();

				document.cookie = 'lang='+code+'; path=/';
				location.reload();
			});
	})();

	// contents
	(function(){
		var $slide, $sidebar = $('.sidebar'), slideTimer, showAnimation, slideTimer2;

		$('#content > .contents')
			.on('show', function(){
				var $this = $(this).show(), $visual, preloads, loadCount=0;

				($this.data('head') == 'dark') ? $header.addClass('dark') : $header.removeClass('dark');
				($this.data('title') == null) ? document.title = 'Fancy' : document.title = 'Fancy - ' + $this.data('title');

				$slide = $this.find('.slide').trigger('reset');
				$visual = $this.find('.visual');

				$('.visual').removeClass('animation');

				$wrap.scrollTop(0).scroll();

				clearTimeout(showAnimation);

				function beginAnimation(){
					clearTimeout(showAnimation);
					$visual.addClass('animation');
					if ($this.is('.publisher:visible')) {
						showAnimation = setTimeout(function(){
							$visual.removeClass('ani').removeClass('animation');
							showAnimation = setTimeout(function(){
								$visual.addClass('ani');
								showAnimation = setTimeout(beginAnimation, 100);
							},100);
						}, 19000);
					}
					if ($this.is('.apple_watch:visible')) {
						showAnimation = setTimeout(function(){
							$visual.removeClass('ani').removeClass('animation');
							showAnimation = setTimeout(function(){
								$visual.addClass('ani');
								showAnimation = setTimeout(beginAnimation, 100);
							},100);
						}, 20000);
					}
				}

				preloads = $visual.attr('data-preload') || '';
				if (preloads) preloads = preloads.split(/\s*;\s*/g);
				if (preloads.length) {
					$.each(preloads, function(){
						var img = new Image();
						img.onload = function(){

							if (++loadCount == preloads.length) {
								setTimeout(beginAnimation, 300);
							};
						};
						img.src = this;
					});
				} else {
					setTimeout(beginAnimation, 300);
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
						.data('index', 1)
						.attr('class', cls.replace(/\bpaging\d+\b/g,''))
						.addClass('paging' + $this.data('index'))
						.find('.dot').children().removeClass('show').end().end()
						.find('.prev').addClass('disabled');
				})
				.on('slideshow', function(){
					if ($(this).closest('.full-spectrum').length > 0) {
						$(this).trigger('reset');
					}else{
						$(this).trigger('reset').trigger('next');
					}
				})
				.on('set.slide', function(event, index){
					var $this = $(this), len, $dot, $dots;

					clearTimeout(slideTimer);

					len = $this.closest('.slide').find('.slide-item').length;

					(index <= 1) ? $this.find('a.prev').addClass('disabled') : $this.find('a.prev').removeClass('disabled');
					(index == len) ? $this.find('a.next').addClass('disabled') : $this.find('a.next').removeClass('disabled');

					// remove previous paging* class and set new paging index
					$this.attr('class', $this.attr('class').replace(/\bpaging\d+\b/g,'').replace(/ +/g,' '));
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
					} else if ($this.closest('#merchant').length > 0) {
						//gotoNext();
					} else {
						//gotoNext();
					}
				})
				.on('prev next', function(event){
					var $this = $(this), index, len, next;

					len   = $this.closest('.slide').find('.slide-item').length;
					index = +$this.data('index');
					next  = (event.type == 'next');

					if (next) {
						index = Math.min(index + 1, len);
					} else {
						index = Math.max(index - 1, 1);
					}

					$this.trigger('set.slide', index);
				})
				.on('click', 'a.prev', function(event){
					event.preventDefault();
					$(this).closest('.slide').trigger('prev');
				})
				.on('click', 'a.next', function(event){
					event.preventDefault();
					$(this).closest('.slide').trigger('next');
				})
				.trigger('reset')
			.end()
			.find('.campaign_featured')
				.on('reset', function(){
					var $this = $(this);

					$this
						.data('index', 1)
						.find('.prev').addClass('disabled');

					if(slideTimer2) clearTimeout(slideTimer2);
					slideTimer2 = setTimeout(function(){ $this.trigger('autoslide') }, +$this.data('interval') || 5000);
				})
				.on('slideshow', function(){
					$(this).trigger('reset').trigger('next');
				})
				.on('set.slide', function(event, index, autoslide){
					var $this = $(this), len;

					len = $this.find('ul li').length;

					(index <= 1) ? $this.find('a.prev').addClass('disabled') : $this.find('a.prev').removeClass('disabled');
					(index == len) ? $this.find('a.next').addClass('disabled') : $this.find('a.next').removeClass('disabled');

					$this.data('index', index);

					$this
						.find("ul li:eq("+(index-1)+")")
							.css('left', '0').removeClass('hide')
							.prevAll().css('left', '-200%').addClass('hide').end()
							.nextAll().css('left', '200%').addClass('hide').end()
							.prev().css('left', '-100%').removeClass('hide').end()
							.next().css('left', '100%').removeClass('hide').end()
						.end()
						.find(".pagination")
							.find("a.current").removeClass('current').end()
							.find("a:eq("+(index-1)+")").addClass('current').end()

					if(autoslide)
						slideTimer2 = setTimeout(function(){ $this.trigger('autoslide') }, +$this.data('interval') || 5000);
				})
				.on('autoslide', function(event){
					var $this = $(this), index, len, next;

					len   = $this.find('ul li').length;
					index = +$this.data('index');
					index++;
					
					if( index > len) index = 1;

					$this.trigger('set.slide', [index, true]);
				})
				.on('prev next', function(event){
					var $this = $(this), index, len, next;

					len   = $this.find('ul li').length;
					index = +$this.data('index');
					next  = (event.type == 'next');

					if (next) {
						index = Math.min(index + 1, len);
					} else {
						index = Math.max(index - 1, 1);
					}

					$this.trigger('set.slide', index);
				})
				.on('click', 'a.prev', function(event){
					event.preventDefault();
					if(slideTimer2) clearTimeout(slideTimer2);
					$(this).closest('.campaign_featured').trigger('prev');
				})
				.on('click', 'a.next', function(event){
					event.preventDefault();
					if(slideTimer2) clearTimeout(slideTimer2);
					$(this).closest('.campaign_featured').trigger('next');
				})
				.on('click', '.pagination a', function(event){
					event.preventDefault();
					if(slideTimer2) clearTimeout(slideTimer2);
					var index = $(this).prevAll().length+1;
					$(this).closest('.campaign_featured').trigger('set.slide', index);
				})
				.on('click', 'li.slide-item', function(event){
					event.preventDefault();
					if(slideTimer2) clearTimeout(slideTimer2);
					var index = $(this).prevAll().length+1;
					$(this).closest('.campaign_featured').trigger('set.slide', index);
				})
				.trigger('reset')
			.end();




		$wrap.scroll(function(){
			// animate slideshow
			if (!$slide || !$slide.length) return;

			var top = $slide.offset().top;

			if ($win.height() - $slide.height()/2 > top) {
				$slide.trigger('slideshow');
				$slide = null;
			}
		});


        var AboutRouter = Backbone.Router.extend({
            routes: {
                "": "home",
                "*name": "hub",
            },
            initialize: function (options) {
            },
            install_internal_link_hook : function (root) {
                $(document).on("click", "a[href^='" + root + "']", function (event) {
                    var href = $(event.currentTarget).attr('href');
                    // Remove leading slashes and hash bangs (backward compatablility)
                    var hrefMatch = new RegExp("^(" + root + ")(/.*)?$").exec(href);
                    //console.log([href, hrefMatch]);
                    if (hrefMatch) {
                        var fragment = Backbone.history.getFragment((hrefMatch[2] || '').replace(/^\//, ''));
                        //console.log([hrefMatch[1], hrefMatch[2], fragment]);
                        // Allow shift+click for new tabs, etc.
                        if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
                            event.preventDefault();
                            // Instruct Backbone to trigger routing events
                            Backbone.history.navigate(fragment, { trigger: true });
                            return false;
                        }
                    }
                });
            },
			getName : function() {
				var root = Backbone.history.root.replace(/\/$/, '');
				var path = location.pathname, name;
				var pattern = '^'+root.replace(/\//g, '\\/')+'\\/';

				name = path.replace(new RegExp(pattern,'i'), '');

				return name;
			},
            home: function () {
                this.hub('');
            },
            hub: function (name) {
                name = name.replace(/\/$/, '').replace(/^merchant\//,'merchants/');
                var root = Backbone.history.root.replace(/\/$/, '');
                var fragmentURL = name == "" ? root : root + "/" + name;
                var elId = name;

                if (name == '') {
                    elId = 'about';
                } else if (name == 'storefront') {
                    elId = 'merchant';
                } else if (name == 'merchants') {
                    elId = 'selling';
                } else if (name == 'jobs') {
                    elId = 'job-index';
                }  else if (name == 'add-to-fancy') {
                    elId = 'fancy-add';
                } else if (name == 'fancy-assets') {
                    elId = 'resource-logo';
                } else if (name == 'fancy-brand') {
                    elId = 'fancy-guide';
				} else if (name == 'fancy-anywhere-button') {
					setTimeout(function(){ $('#'+name+' form').trigger('update') }, 0);
				} else if (name == 'help') {
					$('.ui-autocomplete').removeClass('topic resources').addClass('help');
                } else if (m = new RegExp("^(merchants|storefront)/(features|apple-watch|pricing|resources|mobile|twitter-buy-now)(/.+)?$").exec(name)) {
                    if (m[3]) {
                        elId = m[3].replace(/^\//, '');
						$('.ui-autocomplete').removeClass('resources help help_topic').addClass('topic');
                    } else if (m[2] == 'features') {
                        elId = 'merchant-features';
                    } else if (m[2] == 'pricing') {
                        elId = 'merchant-pricing';
                    } else if (m[2] == 'resources') {
                        elId = 'merchant_resources';
						$('.ui-autocomplete').removeClass('topic help help_topic').addClass('resources');
                    } else if (m[2] == 'mobile') {
                        elId = 'sell_mobile';
                    }  else if (m[2] == 'apple-watch') {
                        elId = 'apple_watch_seller';
                    }   else if (m[2] == 'twitter-buy-now') {
                        elId = 'twitter-buy-now';
                    }
                } else if ( name.match(/help-center\/.+/) ){
                	name = name.split("/")[1];
                	elId = name;
                } else if ( name.match(/fancy-api\/.+/) ){
                	name = name.split("/")[1];
                	elId = name;
                }else if ( name.match(/mobile\/.+/) ){
                	name = name.split("/")[1];
                	elId = name;
                }else if ( name.match(/jobs\/.+/) ){
                	name = name.split("/")[1];
                	elId = name;
                }

                var $hash = $('#' + elId);
                var $content, menu;

                if ($hash.attr("require-login")) {
                    location.href = '/login?next='+encodeURIComponent(location.href);
                    return;
                }

                $('.merchant.idx .spectrum dl, .merchant.idx, .merchant .inner, .mobile .inner, .merchant.idx, .merchant.fea .accepting .browser, .fa .inner').removeClass('show');
                $content = $hash.closest('.contents, .sub-contents');
                if ($content.length == 0) {
					$('body').addClass('error');
					$('#header').addClass('dark');
					$('.errorbox').show().find('.error-msg').addClass('ani');
				} else {
					$content.find('.inner').removeAttr('style');
					$('body').removeClass('error');
					$('.errorbox').hide().find('.error-msg').removeClass('ani');
					if ($hash.is(".agreement h4.stit")) return;

					$('.contents').find('.search-result.inner').remove();
					if ($content.is('.sub-contents')) {
						menu  = $content.closest('.contents').attr('id');
						if (menu == 'merchant_topic') {
							$('#'+menu)
								.find('.sub-contents').hide().end()
								.find('.sidebar li').removeClass('show').end()
								.find('.sidebar a[href]')
								.removeClass('current')
								.filter('[href="'+fragmentURL+'"]').addClass('current').closest('li').addClass('show').end().end()
								.end();
						}else if (menu == 'faq') {
							$('#'+menu)
								.find('.sub-contents').hide().end()
								.find('.sidebar li').removeClass('show').end()
								.find('.sidebar a[href]')
									.removeClass('current')
									.filter('[href="'+fragmentURL+'"]').addClass('current').closest('li').addClass('show').end().end()
								.end()
								.find('.sub-contents li').removeClass('show').end();
							$hash.addClass('show').closest('.sub-contents').show();
						} else if (menu == 'help_topic') {
							$('#'+menu)
								.find('.sub-contents').hide().end()
								.find('.sidebar li').removeClass('show').end()
								.find('.sidebar a[href]')
								.removeClass('current')
								.filter('[href="'+fragmentURL+'"]').addClass('current').closest('li').addClass('show').end().end()
								.end();
							$hash.find('li').addClass('show');
							$header.addClass('help').removeClass('merchant');
						} else{
							$('#'+menu)
								.find('.sub-contents').hide().end()
								.find('.sidebar a[href]')
								.removeClass('current')
								.filter('[href="'+fragmentURL+'"]').addClass('current').end()
								.end();
						}
						$hash.show();

						$content = $content.closest('.contents');
					}

					$('.navigation a').removeClass('current').filter('[href="'+fragmentURL+'"]').addClass('current');
					$content.siblings('.contents').trigger('hide').end().trigger('show');

					$header.removeClass('help').removeClass('topic');
					if (elId == 'help'||menu == 'help_topic') {
						$header.removeClass('merchant').end().find('.stit').show().find('em').hide().end().find('b').text('Help Center');
						//$('#header .logo a').attr('href','/about/help-center');
						$header.addClass('help').removeClass('merchant');
						$('.ui-autocomplete').addClass('help').removeClass('help_topic').removeClass('topic').removeClass('resources');
						if (menu == 'help_topic'){
							$header.addClass('topic');
							$('.ui-autocomplete').removeClass('help').addClass('help_topic').removeClass('topic').removeClass('resources');
						}
                    } else if (elId == 'contact') {
                        try {
                            FB.XFBML.parse();
                        } catch(e) {}
						$header.removeClass('merchant');
					}  else if (elId == 'accelerator-program') {
                       $(".accelerator-program .visual .slideshow img:gt(0)").hide();
						setInterval(function() {
						  $('.accelerator-program .visual .slideshow img:first')
							.fadeOut(1000)
							.next()
							.fadeIn(1000)
							.end()
							.appendTo('.accelerator-program .visual .slideshow .img-wrap');
						}, 3000);
					} else{
						if (elId == 'google_glass') {
							$header.removeClass('merchant').find('.stit').show().find('b').text($('.navigation a').filter('[href="'+fragmentURL+'"]').text()).end().end();
							//$('#header .logo a').attr('href','/about');
						} else if (elId == 'affiliates') {
							$header.removeClass('merchant').find('.stit').show().find('b').text('Affiliates').end().end();
						} else if (menu == 'jobs') {
							$header.removeClass('merchant').find('.stit').hide().end();
							//$('#header .logo a').attr('href','/about');
						} else if (/^(business)/.test(elId)) {
							$header.removeClass('merchant').find('.stit').show().find('b').text('Business').end().end();
							//$('#header .logo a').attr('href','/about');
						}  else if (elId == 'selling' || elId == 'merchant' || elId == 'merchant-features' || elId == 'merchant-pricing'|| elId == 'merchant_signup'|| menu == 'merchant_topic' || elId == 'merchant_resources') {
							$header.addClass('merchant').find('.stit').show().find('b').text('Merchants').end().end().end();
								//.find('.logo > a').attr('href','/about/merchants').end()
							$('#merchant_resources, #merchant_topic').find('.inner').removeAttr('style').end().find('.search-result').show();
							if (elId == 'selling' || elId == 'merchant' || elId == 'merchant-features' || elId == 'merchant_resources' || elId == 'merchant-pricing' || elId == 'merchant_signup') {
								$header.find('.merchant-menu a').removeClass('current');
								$header.find('.merchant-menu a[href="'+fragmentURL+'"]').addClass('current');
							}
						} else{
							$header.removeClass('merchant').find('.stit').hide().end();
							//$('#header .logo a').attr('href','/about');
							if (elId == 'terms-privacy') {
								document.title = 'Fancy - Privacy Policy';
							}else if(elId == 'job-index') {
								var args = jQuery.parseString(location.search.substr(1));
								if('openings' in args){
									$('#wrap').scrollTop( $hash.find('.openings').offset().top );
								}	
							}
						}
					}
				}

				if (location.hash) {
					$hash.find('.faq_cont > li').removeClass('show').find('.faq_q a').eq(location.hash.substr(1)).click();
				}
			}
        });
        var router = new AboutRouter();
        $(document).ready(function () {
            var root = '/about';
            router.install_internal_link_hook(root);
            Backbone.history.start({pushState: true, root: root});
        });
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
			.on('hide', function(){
				$langPop.find('.language-list').removeClass('show');

				clearTimeout(timer);
				timer = setTimeout(function(){
					$langPop.css('opacity', 0);
					timer = setTimeout(function(){ $langPop.removeClass('show') }, 300);
				}, 300);
			})
			.on('click', function(event){
				if (event.target == this) $langPop.trigger('hide');
			})
			.on('click', '.btn-close', function(event){
				$langPop.trigger('hide');
			})
			.on('click', 'a', function(event){
				event.preventDefault();

				var $this = $(this), code = $this.attr('href').substr(1), name = $this.text();

				document.cookie = 'lang=; expires='+(new Date(0).toGMTString())+'; path=/';
				document.cookie = 'lang='+code+'; path=/';
				location.reload();
			});
	})();

	(function(){
		if (navigator.userAgent.indexOf('iPad') != -1){$('body').addClass('ipad');}
		if (navigator.userAgent.indexOf('Firefox') != -1){$('body').addClass('moz');$('.resources .chrome').text('Firefox');}
		else if (navigator.userAgent.indexOf('Chrome') != -1){$('body').addClass('chrome');}
		else if (navigator.userAgent.indexOf('Safari') != -1){$('body').addClass('safari');}
		else {$('body').addClass('ms');$('.resources .chrome').text('Internet Explore');$('.drag-button').hide();$('.drag-button.ms').show();}

		var dlgPreview = $.dialog('preview_widget');
		dlgPreview.$obj.on({
			open: function(){
				$(this).css('width', '');
			},
			close: function(){
				$(this).find('>.preview').empty();
			}
		});

		$(window).on('message', function(event){
			var data = event.originalEvent.data, $iframe;
			if (data && /^resize-widget\b(.+),(\d+),(\d+)$/.test(data)) {
				dlgPreview.$obj.css('width', parseInt(RegExp.$2)+40);
				dlgPreview.center();
			}
		});

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
			$(this).closest('dl').toggleClass('show');
			$(this).closest('.contents')
				.find('dl').removeClass('show').end().end().closest('dl').addClass('show')
			.closest('.contents')
				.find('.sidebar li.show small').find('a').removeClass('current').end().find('a:nth-of-type('+$(this).closest('dl').index()+')').addClass('current');


		});
		//map
		//release
		$('.releases .lists a').click(function(){
			return false;
		});
		// show glass movie
		$movie = $('.view-movie');
		$('.glass .btn-show').click(function(){
			$movie.find('.frame').attr('open','open');
			$movie.find('.frame iframe').attr('open','open').attr('src','https://player.vimeo.com/video/66838775?autoplay=1');
			$movie.find('.frame iframe').load(function(){
				if($movie.find('.frame').attr('open') == 'open' ){
					$movie.show();
					setTimeout(function(){$movie.animate({opacity:'1'},function(){$movie.addClass('show').find('.frame').removeAttr('open');});},10);
				}
			});
		});

		// referral links
		$('#referral-links')
			.on('click', '.btn-blue', function(event){
				var $this = $(this), url = $.trim($this.prev('input').val()), $fs = $this.closest('fieldset'), $share = $fs.find('p.share');

				if (!new RegExp('^https?://'+location.hostname.replace(/\./g,'\\.'),'i').test(url)) {
					return $fs.find('.url .value').find('input[type="text"]').focus().end().addClass('error');
				}

				url = url.replace(/^https?:\/\/|\?.*$/,'');
				if (window.username) url += '?ref='+username;
				url = encodeURIComponent(url);

				$share.show().find('input').val('Loading...');
				$.getJSON('/get_short_url.json?url='+url, function(json){
					$share.find('input').val(json.short_url).focus();
				});
			})
			.on('focus', '.url input[type="text"]', function(event){
				$(this).closest('.value').removeClass('error');
			})
			.on('blur', '.url input[type="text"]', function(event){
				if (!new RegExp('^https?://'+location.hostname.replace(/\./g,'\\.'),'i').test($.trim(this.value))) {
					return $(this).closest('.value').addClass('error');
				}
			});

		// show error field
		$('input[type="text"].required_,textarea.required_')
			.blur(function(){
				var $this = $(this);

				if ($.trim(this.value)) {
					$this.removeClass('error');
					$this.attr('placeholder', $this.data('txt-placeholder')||'');
				} else {
					$this.addClass('error');
					$this
						.data('txt-placeholder', $this.attr('placeholder')||'')
						.attr('placeholder', ($this.width() > 100) ? gettext('This field is required') : gettext('Required'));
				}
			})
			.focus(function(){
				$(this).removeClass('error').attr('placeholder', $(this).data('txt-placeholder')||'');
			});

		// register application
		$('#fancy-api')
			.on('click', 'button.btn-submit', function(event){
				var $this = $(this), $frm = $this.closest('.frm'), params;
				var login_require = $this.attr('require_login');
				if (typeof(login_require) != undefined && login_require === 'true'){
					alertify.alert("Please login to submit a request.");
					return ;
				}


				event.preventDefault();

				params = {
					app_name     : $.trim( $frm.find('.name_').val() ),
					app_website  : $.trim( $frm.find('.website_').val() ),
					callback_url : $.trim( $frm.find('.callback_').val() ),
					description  : $.trim( $frm.find('.desc_').val() ),
					csrfmiddlewaretoken : $frm.find('input[name="csrfmiddlewaretoken"]').val()
				};

				$this.prop('disabled', true);

				$.ajax({
					type : 'POST',
					url  : '/register_application.xml',
					data : params,
					dataType : 'xml',
					success  : function(xml){
						var $xml = $(xml), st = $xml.find('status_code').text() || 0, msg = $xml.find('message').text();
						if (st == 1) {
							alert(gettext('Thanks! We will contact you when your API application has been approved.'));
						} else if (msg) {
							alert(msg);
						}
					},
					complete : function(){
						$this.prop('disabled', false);
					}
				})
			})
			.on('blur keyup', 'input,textarea', function(event){
				var $fieldset = $(this).closest('fieldset'), disabled = false;

				$fieldset.find('.required_').each(function(){
					if (!$.trim(this.value)) {
						disabled = true;
						return false;
					}
				});

				$fieldset.find('button.btn-submit').prop('disabled', disabled);
			});

		$('form.frm')
			.on('keyup', 'input[type="text"],textarea', function(event){
				var $this = $(this), val = $.trim(this.value);

				if (val.length && $this.parent().hasClass('error')) {
					$this.parent().removeClass('error');
				}
			})
			.on('click', 'button[type="submit"]', function(event){
				var $this = $(this), $form = $this.closest('form'), data = serializeForm($form), f, $error, hasError = false, $wrap = $('#wrap');

				for (var name in data) {
					f = $form[0].elements[name];
					if (f.hasAttribute && f.hasAttribute('required') && !data[name].length) {
						$error = $(f).next('span.error-msg');
						if (!$error.length) $error = $('<span class="error-msg" />').insertAfter(f);
						$error.text('This field is required').parent().addClass('error');

						// first invalid field
						if (!hasError) {
							hasError = true;
							try {
								f.scrollIntoView();
								f.focus();
								$wrap.scrollTop -= 60;
							}catch(e){};
						}
					}
				}

				if (hasError){
					event.preventDefault();
				}
			});

		// tumblr
		$('#tumblr').find('a.btn-join').click(function(){
			$('#fancy-widget').data('tumblr', true);
			$('#fancy-widget dl.fa > dt > a').click();
		});

		// glass movie
		$('.view-movie, .view-movie .close').on('click', function(event){
			if(event.target == this) {
				$movie.removeClass('show');
				setTimeout(function(){$movie.animate({opacity:'0'},function(){$movie.hide().find('iframe').removeAttr('src');});},200);
			}
		});

		// fancy it bookmarklet
		$('#resources .btn-fancyit')
			.on('dragstart', function(event){
				var $btn = $(this), $arrow = $('.btn-fancyit-arrow');

				$btn.addClass('drag');
				$arrow.removeAttr('style').show().css({top:10,opacity:1});

				$(document).on('dragend.fancyit', function(event){
					$(document).off('dragend.fancyit');
					$btn.removeClass('drag');
					$arrow.removeAttr('style').hide();
				});
			});

		// fancy it bookmarklet tip
		(function(){
			var match = / (MSIE|Chrome|AppleWebkit|Firefox)[ \/](\d+)/.exec(navigator.userAgent), agent, ver, $tip;

			if (match) {
				agent = match[1].toLowerCase();
				ver = match[2];
			}

			$tip = $('.bookmarklet .right > .tip').hide();

			switch (agent) {
				case 'chrome':
				case 'applewebkit':
					$tip.filter('.ch').show().find('>small').not(agent=='chrome'?'.ch_':'.sa_').hide();
					break;
				case 'firefox':
					$tip.filter('.ff').show();
					break;
			}
		})();

		// form script
		$('input[type="text"],input[type="password"], textarea')
			.focus(function(){
				if($(this).closest('.contents').hasClass('help')==true || $(this).closest('#header').hasClass('help')==true){
					$(this).closest('.search').addClass('focus');
					if ($(this).closest('#header').hasClass('fixed')==true) {
						$('.ui-autocomplete').addClass('help_top');
					}else{
						$('.ui-autocomplete').removeClass('help_top');
					}
				}else{
					$(this).addClass('focus');
				}
			})
			.keyup(function(){$(this).addClass('active');})
			.blur(function(){
				if($(this).closest('.contents').hasClass('help')==true || $(this).closest('#header').hasClass('help')==true){
					if ($(this).val()=='') {
						$(this).closest('.search').removeClass('focus');
					}
				}else{
					$(this).removeClass('focus');
					if ($(this).val()=='') {
						$(this).removeClass('active');
					}
				}
		});

		$('#affiliates, #fancy-anywhere-button, #fancy-widget, #fancy-button')
			.on('click', 'dt.tab', function(event){
				$(this)
					.closest('dl')
						.addClass('current')
						.find('input[type="hidden"][name="type_"]').attr('name', 'type').end()
						.siblings('dl')
							.removeClass('current')
							.find('input[type="hidden"][name="type"]').attr('name', 'type_');
			})
			.on('click', '.btn-try', function(event){
				event.preventDefault();
				$(this).toggleClass('selected').closest('dl').find('.btns_widget').toggleClass('show');
			})
			.on('change', 'input[name="type"],input[name="apply_type"]', function(event){
				var $this = $(this), $blocks = $this.closest('li').find('.share_cont');

				$blocks.hide().find('input[type="text"]').removeAttr('requried');
				$blocks.filter('.'+$this.val()).show().find('input[type="text"]:not(.optional)').attr('required', 'required').focus();
				if( $this.val() == 'specific'){
					$this.closest('.cont').find('[name=image_url]').addClass('optional').attr('placeholder','Optional');
				}else{
					$this.closest('.cont').find('[name=image_url]').removeClass('optional').removeAttr('placeholder');
				}
			})
			.on('click', 'input[type="radio"]', function(event){
				var $this = $(this);

				$this.closest('p')
					.find('label').removeClass('on').end()
					.find('label[for="'+$this.attr('id')+'"]').addClass('on');

				if($this.val()=='custom'){
					$this.closest('p').find('input[name=custom_btn_url]').removeClass('optional').attr('required','required');
				}else{
					$this.closest('p').find('input[name=custom_btn_url]').addClass('optional').removeAttr('required');
				}
			})
			.on('focus', 'input[type="text"]', function(event){
				$(this).closest('.value').removeClass('error');
			})
			.on('blur', 'input[type="text"]', function(event){
				if (this.hasAttribute('required') && $.trim(this.value).length === 0) {
					$(this).closest('.value').addClass('error');
				}
			})
			.on('click', 'input[name="size"]', function(event){
				if (this.value === 'c') {
					$(this).nextAll('input.set_size').show();
				} else {
					$(this).nextAll('input.set_size').hide();
				}
			})
			.on('change', 'select[name="widget_type"]', function(){
				$(this).nextAll('select').hide().filter('[name="'+this.value+'"]').show();
			})
			.on('click', '.btn-getcode', function(event){
				if (!validateForm(this.form)) return;

				var data = serializeForm(this.form), title = this.getAttribute('data-title');
				var dlgCode = $.dialog('get_code').open();
				var $code = dlgCode.$obj.find('code').text('Loading...');

				dlgCode.$obj.find('.code > [class*="type-"]').hide().filter('.type-'+data.type).show();

				if (title) {
					dlgCode.$obj.find('.ltit').text(title);
				}

				generateCode(data).done(function(content){
					if (content.head) {
						$code.filter('.header_').text(content.head);
					}

					if (content.code) {
						$code.filter('.generated_').text(content.code);
					}
				});
			})
			.on('click', '.btn-preview', function(event){
				if (!validateForm(this.form)) return;

				var data = serializeForm(this.form), title = this.getAttribute('data-title');
				var $preview = dlgPreview.open().$obj.find('.preview').empty().text('Loading...');

				if (title) {
					dlgPreview.$obj.find('.ltit').text(title);
				}

				generateCode(data).done(function(content){
					$preview.empty().append(content.$preview);
					dlgPreview.center();
				});
			})
			.on('submit', 'form', function(event){
				return false;
			});
	})();

	$('.popup.merchant-signin')
	.on('click', function(event){
		if(event.target === this) {
			$(this).closest('#popup_container').removeAttr('class').removeAttr('style');
		}
	});

	(function(){

		$wrap.scroll(function(){
			$('.merchant, .fa, .publisher, .mobile').find('.inner').each(function(){
				var $this = $(this);
				if ($(this).closest('div').hasClass('accepting')==true) {var $this = $this.find('.browser');}
				var top = $this.offset().top;
				if (top < $(window).height()/2) {
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
});


jQuery(function($) {
	var tagIds = {};
	var helpContent = [], merchantContent = [];
	var searchData = [];

	$('.help.searchable_').find('.sub-contents ol li .faq_q > a').each(function(){
		var $this = $(this), $searchable = $this.closest('.searchable_');
		var name  = $this.closest(".sub-contents").attr("id");
		var index = $("#"+name+" .faq_cont > li").index( $this.closest("li") );
		var url   = $searchable.attr('data-path-prefix') + '/' + name + "#"+index;

		if (name in tagIds) return;

		// hide content of <pre> element
		var $pre = $this.find('pre.code');
		$pre.each(function(){ var $this=$(this); $this.data('__tmp', $this.html()).empty(); });

		var $content = $this.closest("li");
		var data = {
			tagId : name+"#"+index,
			value : $.trim($this.text()),
			content : $.trim($content.text()).replace(/\s+/g, ' '),
			url : url
		};

		// restore content of <pre> element
		$pre.each(function(){ var $this=$(this); $this.html($this.data('__tmp')).removeData('__tmp');  });

		helpContent.push(tagIds[name+"#"+index] = data);
	});

	// merchant contents
	$('#merchant_topic .sub-contents').each(function(){
		var $this = $(this), $answer = $this.find('>.answer');
		var name = $this.attr('id'), url = '/about/merchants/resources/' + name;

		// hide content of <pre> element
		var $pre = $answer.find('pre.code');
		$pre.each(function(){ var $this=$(this); $this.data('__tmp', $this.html()).empty(); });

		var $small = $this.find('> h3 > small'), desc = $small.text();
		$small.text('');

		var data = {
			tagId : name,
			value : $.trim($this.find('>h3').text()),
			content : $.trim($answer.text()).replace(/\s+/g, ' '),
			url : url
		};

		if (desc) $small.text(desc);

		// restore content of <pre> element
		$pre.each(function(){ var $this=$(this); $this.html($this.data('__tmp')).removeData('__tmp');  });

		merchantContent.push(tagIds[name] = data);
	});

	$.expr[":"].contains = $.expr.createPseudo(function(arg) {
	    return function( elem ) {
	        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
	    };
	});

	function filterData(term, collection) {
		term = $.trim(term);
		var matcher = new RegExp($.ui.autocomplete.escapeRegex(term), "i");
		var results = [];

		$.each(collection, function(idx, el) {
			var matchResult = matcher.exec(el.content);
			if (matchResult) {
				var result = $.extend({matchResult:matchResult}, el);

				results.push(result);
			}
		});

		return results;
	}

	function resultToHTML(result) {
		var previewLength = 300, beforeLength = Math.floor(previewLength / 2 * 1);

		result = $.map(result, function(el){
			var excerpt = '', start = Math.max(el.matchResult.index - beforeLength, 0), end, term = el.matchResult[0];

			while(start > 0 && el.content.substr(--start, 1) !== ' ') ;

			end = start + previewLength;
			while(end < el.content.length && el.content.substr(++end, 1) !== ' ') ;

			if (start > 0) excerpt = '...';
			excerpt += el.content.substring(start, el.matchResult.index);
			excerpt += '<strong>'+term+'</strong>';
			excerpt += el.content.substring(el.matchResult.index + term.length, end);
			if (end < el.content.length) excerpt += '...';

			return '<li><a href="'+(el.url2 || el.url)+'"><b>'+el.value+'</b>'+excerpt+'</a></li>';
		});

		return result.join('');
	}

	$('fieldset.search')
		.each(function(){
			var $this = $(this);

			$this.find('input.text')
				.autocomplete({
					appendTo: '#wrap',
					minLength: 1,
					source: function(request, response) {
						var $form = this.element.closest('fieldset.search');
						var results = filterData(request.term, ($form.attr('data-type')==='help') ? helpContent : merchantContent);
						response(results);
					},
					open: function ()   {
						$(this).data("ui-autocomplete").menu.element.addClass($(this).closest('.search').find('.text').attr('search'));
						$(this).closest('.search').find('.text').data('selected',false);
					},
					select: function(event,ui) {
						$( "fieldset.search").find('input.text').each(function(){$(this).val('');});
						$(this).closest('.search').find('.text').data('selected',true);
						var link = $('<a href="'+ui.item.url+'" class="help_topic"></a>').appendTo(document.body);
						link.click().remove();
						return false;
					}
				})
				.data('ui-autocomplete')._renderItem = function( ul, item ) {
					var t = item.value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
					var l = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
					return $( "<li></li>" )
						.data( "item.autocomplete", item )
						.append( '<a data-href="'+ item.url +'"><span class="drop-title">' +  t + "</span><br/><span class='drop-desc' style='display:none;'>"+l+"</span></a>" )
						.appendTo( ul );
				};
		})
		.on('click', 'button', function(event){
			event.preventDefault();

			var $form = $(this).closest('fieldset.search');
			var term = $.trim($form.find('input:text').val());

			if (!term) return;

			var results = filterData(term, ($form.attr('data-type')==='help') ? helpContent : merchantContent);
			var resultStr = 'No results';

			if (results.length === 1) resultStr = '1 result';
			else if (results.length > 1) resultStr = results.length + ' results';

			var $contentBlocks = $('.contents');

			$contentBlocks
				.find('.search-result.inner').remove().end() // remove previous search results
				.filter(':visible')
					.find('>.inner').hide().end() // hide visible contents
					.find('>.visual .inner').removeAttr('style').end() // remove animation styles
					.append('<div class="search-result inner"><h2>Search Results <small>'+resultStr+' for "'+$("<div>").text(term).html()+'"</small></h2><ul></ul><p class="contact">Can’t find what you’re looking for? <a href="/about/contact">Contact Us</a></p></div>')
					.find('.search-result ul')
						.append(resultToHTML(results));

		})
		.on('keypress', 'input.text', function(event){
			if (event.which != 13) return;
			event.preventDefault();

			var $this = $(this), val = $.trim($this.val());
			if(!$this.data('selected')){
				$this.closest('fieldset').find('button').click();
				$this.autocomplete('close');
			}
		});
});

// partner email
$(document).ready(function(){
  $('#partner .btn-blue').click(function(event){
  	var $el = $("#partner");
    var title = $el.find('#brand_title').val();
    var description = $el.find('#brand_description').val();
    var website = $el.find('#brand_website').val();
    var contact_name = $.trim($el.find('#contact_name').val());
    var contact_email = $.trim($el.find('#contact_email').val());

    if (!title.length) {
		alert('Please enter your company brand name.');
		title.focus();
        return false;
	}
	if (!description.length) {
        alert('Please enter your brand description.')
        description.focus();
        return false;
	}
	if (!website.length) {
        alert("Please enter your brand website URL.")
        website.focus();
        return false;
    }
	if (!contact_name.length) {
        alert("Please enter your name.")
        return false;
    }
    if(contact_email.search(emailRegEx) == -1){ // see common/util.js to change emailRegEx
	    alert('A valid email address is required.');
        return false;
    }


	var param = {};
	param['title'] = $.trim(title);
	param['description'] = $.trim(description);
	param['website'] = $.trim(website);
	param['contact_name'] = $.trim(contact_name);
	param['contact_email'] = $.trim(contact_email);
	//param['image']= files.attr("src");

	$.post("/create-brand.json",param,
	  function(response){
		if (response.status_code == 1) {
			$el.find('#brand_title').val('');
			$el.find('#brand_description').val('');
			$el.find('#brand_website').val('');
			$el.find('#contact_name').val('');
			$el.find('#contact_email').val('');
		    alert('Thank you! We will get back to you soon.');
		}
		else {
			if(response.message) alert(response.message);
		}
	  }, "json"
	).fail(function(){
	  alert("failed. please try again");
	})

	return false;
  });
  $('#partner .btn_resend').click(function(event){
        var sending = false;

        event.preventDefault();

        if(sending) return;
        sending = true;

        $.ajax({
                type : 'post',
                url  : '/send_email_confirmation.json',
                data : {resend : true},
                success : function(response){
                        if (typeof response.status_code == 'undefined') return;
                        if (response.status_code == 1) {
                                alert('Thank you! You will receive a confirmation email shortly');
                        } else if (response.status_code == 0) {
                                if(response.message) alert(response.message);
                        }
                },
                complete : function(){
                        sending = false;
                }
        });
  });

  $(document).delegate(".head h1.logo > a, .search-result li a", "click", function(e){
	$("#help, #help_topic").find("div.inner").show().end().find("fieldset.search input").val('').end().find("div.search-result.inner").remove();
	$("#header fieldset.search input").val("");
  })

  $(document).delegate(".search-result li a, a.help_topic", "click", function(e){
	$("#help_topic").find("ol.faq_cont > li").removeClass("show");
	var url = $(this).attr("href") || $(this).attr("data-href");
	var id = url.split("/")[3];
	var index = id.split("#")[1];
	var id = id.split("#")[0];
	$("#"+id).find("li:eq("+index+")").addClass("show");
  })


});


jQuery(function($){
	var sections = ['celebrity', 'featured', 'partners', 'people'];
	$(sections).each(function(i, section){

		var autoplay = null;
		function showNext(){
			var $current = $('.celebrity ._'+section+' li.active'), $next = $current.next();
			if( !$next[0] ){
				$next = $('.celebrity ._'+section+' li:eq(0)');
			}
			$next.closest('.inner').find('li,p').removeClass('active').end().find('[data-name="'+$next.attr('data-name')+'"]').addClass('active');
		}

		$('.celebrity ._'+section+' li > a').hover(function(){
			if(autoplay) clearInterval(autoplay);
			$(this).closest('.inner').find('li,p').removeClass('active').end().find('[data-name="'+$(this).closest('li').attr('data-name')+'"]').addClass('active');
			return false;
		}, function(){
			autoplay = setInterval(showNext, 5000);
		});

		autoplay = setInterval(showNext, 5000);
	})


	function showMap(num){
		var $dot = $('.partner .community .map .dot:eq('+num+')');
		$dot.addClass('show');
		setTimeout( function(){
			$dot.removeClass('show');
		},10000);

		if (num < $('.partner .community .map .dot').length) {
			num = num+1;
		}else{
			num = 0;
		}
		setTimeout(function(){
			showMap(num);
		}, 500);
	}
	showMap(0);
});

// shipping FAQ
jQuery(function($){
	var $link = $('#email .quick a'), $faqItems = $('#help_shipping li');

	$link.click(function(event){
		event.preventDefault();

		var idx = $link.index(this);
		try { $faqItems.removeClass('show').eq(idx).addClass('show').get(0).scrollIntoView() } catch(e) {};
	});

	$('.faq_cont .faq_q a').click(function(event){
		event.preventDefault();
		$(this).closest('li').toggleClass('show');
	});
});

function loadScript(attrs, parent) {
	var s = document.createElement('script');

	for (var name in attrs) {
		if (attrs.hasOwnProperty(name)) s.setAttribute(name, attrs[name]);
	}

	if (!parent) parent = document.querySelector('head');

	parent.appendChild(s);
}

function serializeForm(form) {
	var arr = $(form).serializeArray(), name, value, obj = {};

	for (var i=0,c=arr.length; i < c; i++) {
		name  = arr[i].name;
		value = $.trim(arr[i].value);
		obj[name] = value;
	}

	return obj;
}

function validateForm(form) {
	var valid = true;

	$(form)
		.find('.value.error, .value .error').removeClass('error').end()
		.find('input[type="text"]:visible').filter('[required],[data-match]').each(function(){
			var $this = $(this), value = $.trim(this.value);
			var required = !!this.hasAttribute('required');
			if (required && value.length === 0) {
				$this.closest('.value').addClass('error');
				valid = false;
				return false;
			}

			var match = this.getAttribute('data-match');
			if (match) {
				var regex = new RegExp(match);
				if (!regex.test(value)) {
					$this.closest('.value').addClass('error');
					valid = false;
					return false;
				}
			}
	});

	var data = serializeForm(form);
	if( data.type == 'recommend' && data.apply_type == 'img' && !data.image_url){
		valid = false;
		$(form).find("[name=image_url]").addClass('error').closest('.value').addClass('error');
	}

	return valid;
}

// Fancy Anywhere Content Generator
function generateCode(data, opt) {
	var head = '', code = '', $preview, deferred = new jQuery.Deferred();

	opt = opt || {};

	switch (data.type) {
		case 'button':
			code = '<script type="text/javascript" src="//'+location.hostname+'/fancyit/v2/fancyit.js" id="fancyit" async="async"';

			if (data.info_type === 'custom') {
				if (data.title) code += ' data-title="'+encodeURIComponent(data.title)+'"';
				if (data.item_url) code += ' data-item="'+encodeURIComponent(data.item_url)+'"';
				if (data.image_url) code += ' data-image="'+encodeURIComponent(data.image_url)+'"';
				code += ' data-category="'+encodeURIComponent(data.category)+'"';
			}

			if (data.counter_position) {
				code += ' data-count="' + data.counter_position + '"';
			}

			code += '></script>';

			$preview = $(code);
			break;
		case 'content':
			head = '<script src="//'+location.hostname+'/_static/embed/js/in_content.js" id="fancy-anywhere-context" async';
			head += ' data-selector="' + data.selector + '" data-frequency="' + data.frequency + '"';
			if (data.links_num !== 'all') head += ' data-max="' + data.links_num + '"';
			head += '></script>';

			$preview = $('<p>This is an example text. Lorem ipsum dolor sit amet, bracelet consectetur adipiscing elit bracelet, jewelry ring sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ring. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat belt. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>');
			$preview.append( $(head.replace(/data-selector="[^"]+"/, 'data-selector="'+(opt.selector || '.popup.preview_widget .preview')+'"')) );

			break;
		case 'widget':
			code = '<script src="//'+location.hostname+'/widget/widget.js?';

			// type
			code += 'type='+data.widget_type;
			switch (data.widget_type) {
				case 'category': code += '&category='+data.category; break;
				case 'list': code += '&list_id='+data.list; break;
			}

			// username
			if (data.username) code += '&ref='+data.username+'&username='+data.username;

			// cols and rows
			code += '&cols=' + (+data.cols||4);
			code += '&rows=' + (+data.rows||2);

			// size
			code += '&size=' + data.size;
			if(data.size=='c') {
				if (!+data.len) data.len = 230;
				code+='&len='+data.len;
			}

			// topbar
			if (data.topbar) code += '&topbar=' + data.topbar;

			// anywhere
			if (data.show_buy === 'on') code += '&anywhere';

			// custom css
			if (data.custom_css) code += '&customCSS='+encodeURIComponent(data.custom_css);

			code += '" async></script>';

			$preview = $(code);
			break;
		case 'specific':
		case 'recommend':
			head = '<script src="//'+location.hostname+'/anywhere.js?ref='+username+'';
			code = '<a';

			if (data.type === 'specific') {
				var match = /\/things\/(\d+)\//.exec(data.item_url);
				if (!match) return deferred.fail();

				code += ' href="' + data.item_url.replace(/\?.*$/, '') + '?ref='+username+'&action=buy"';
				code += ' data-fancy-id="' + (id=match[1]) + '"';
			} else {
				data.keywords = data.keywords.replace(/ {2,}/g, ' ').replace(/"/g, '');
				code += ' href="http://fancy.com/search?q='+encodeURIComponent(data.keywords)+'&ref='+username+'"'
				code += ' data-fancy-keywords="'+data.keywords+'"';
			}

			$preview = $('<div></div>');

			if (data.apply_type === 'img') {
				code += ' class="fancy-anywhere-image"><img src="%s"';
				if (+data.width) code += ' width="' + data.width + '"';
				if (+data.height) code += ' height="' + data.height + '"';
				code += ' /></a>';

				if (data.buy_btn === 'custom' && data.custom_btn_url) {
					head += '&buttonImg=' + encodeURIComponent(data.custom_btn_url);
				}

				if (data.image_url) {
					code = code.replace('%s', data.image_url);
					$preview.html(code);

					var img = new Image();
					img.onload = function(){
						deferred.resolve({head: head, code: code, $preview: $preview});
					};
					img.src = data.image_url;
					
					head += '&_=' + (new Date().getTime()) + '" id="fancy-anywhere" async></script>';
				} else {
					getDefaultImage(function(src){
						code = code.replace('%s', src);
						$preview.html(code).append(head);

						var img = new Image();
						img.onload = function(){
							deferred.resolve({head: head, code: code, $preview: $preview});
						};
						img.src = src;
					});
					head += '&_=' + (new Date().getTime()) + '" id="fancy-anywhere" async></script>';
				}
				return deferred;
			} else {
				code += ' class="fancy-anywhere-text">';
				code += data.link_text+'</a>';

				$preview.html('<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' + code + ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>');
			}

			head += '&_=' + (new Date().getTime()) + '" id="fancy-anywhere" async></script>';
			$preview.append(head);

			break;
	}

	deferred.resolve({head: head, code: code, $preview: $preview});

	return deferred;
}

function getDefaultImage(callback) {
	var cache = arguments.callee.cache || {}, fn = arguments.callee;

	if (typeof id == 'undefined' || !id) return;
	if (cache[id]) return callback(cache[id]);

	try{ fn.xhr.abort() }catch(e){};
	$.ajax({
		type : 'GET',
		url  : '/get_thing_url.json',
		data : {thing_id : id},
		beforeSend : function(xhr){ fn.xhr = xhr; },
		success : function(json) {
			if (!json.url) return;
			callback(cache[id] = json.url);
			fn.cache = cache;
		}
	});
}

// about collect & share
$(function(){
	var $collectShare = $(".collect_share");
	var $stream = $collectShare.find("ol.stream");
	var direction = 'forward'; // forward or reverse
	var DEFAULT_SPEED = 20;
	var MOVE_SPEED = 2;
	var speed = DEFAULT_SPEED;

	function scroll(autoreverse){
		var left, remain, duration;
		var width = $collectShare.width();
		var contentWidth = $stream.width();

		$stream.stop();
		if( direction == 'forward' ){
			left = (-20-contentWidth+width);
			remain = Math.abs( left - parseInt($stream.css('left')) );
		}else{
			left = 0;
			remain = Math.abs( parseInt($stream.css('left')) );
		}

		duration = remain*speed;

		$stream.animate({left: left }, duration ,'linear', function(){
			if(autoreverse){
				direction = (direction=='forward'?'reverse':'forward');
				scroll(true);
			}
		});
	}

	$stream.hover(function(){
		$("ol.stream").stop();
	}, function(){
		scroll(true);
	})

	$collectShare
		.find('a.prev')
			.hover(function(e){
				direction = 'reverse';
				speed = MOVE_SPEED;
				scroll(false);
			}, function(e){
				direction = 'forward';
				speed = DEFAULT_SPEED;
				scroll(true);
			})
		.end()
		.find('a.next')
			.hover(function(e){
				direction = 'forward';
				speed = MOVE_SPEED;
				scroll(false);
			}, function(e){
				direction = 'forward';
				speed = DEFAULT_SPEED;
				scroll(true);
			})
		.end()


	scroll(true);
});

// about contact us new
$(function(){
	var duration = 350;
	var effect = 'swing'
	var nextMailPoc = ''; // point of contact for email
	function reposition($step){
		$step
			.prevAll('.step').each(function(){
				if( $(this).css('left')!='-100%' ){
					$(this).css('left','-100%');
				}
			}).end()
			.nextAll('.step').each(function(){
				if( $(this).css('left')!='100%' ){
					$(this).css('left','100%');
				}
			}).end()
	}

	$('#contact .visual a.next').click(function(){
		var $next;
		if ($(this).data("next")) {
			$(this).closest('.step')
				.closest('fieldset')
					.find('.step[data-step="'+$(this).data("next")+'"]')
						.animate({'left':'0'},duration,effect)
						.find('h3 > a')
							.data("prev",$(this).closest('.step').data('step'))
						.end()
					.end()
				.height($(this).closest('fieldset').find('.step[data-step="'+$(this).data("next")+'"]').outerHeight()).end()
			.animate({'left':'-100%'},duration,effect);

			reposition( $(this).closest('.step').closest('fieldset').find('.step[data-step="'+$(this).data("next")+'"]') );
		}else{
			if ($(this).data("tit") != ''){

				var $target= $('.step[data-step="information"]');
				if ($(this).closest('.step').data('step')=='information') $target = $('.step[data-step="scd_information"]');

				$target
					.find('a.next')
					.removeAttr('style')
					.text($(this).data("other"))
					.data('text','')
					.data('tit','')
					.data("other",'');

					if ($(this).data("nextother")) {
						$target.find('a.next')
							.data('text',$(this).data('othertext'))
							.data('tit',$(this).data("othertit"))
							.data("other",$(this).data("nextother"));
					}

				$(this).closest('.step').animate({'left':'-100%'},duration,effect);
				$target
					.find('h3 > a')
						.data("prev",$(this).closest('.step').data('step'))
						.text($(this).text())
					.end()
					.find('dt').html($(this).data("tit")).end()
					.find('dd').html($(this).data("text")).end()
					.find('a.next').data("reason",$(this).text()).end()
				.animate({'left':'0'},duration,effect)
				.closest('fieldset')
					.height($target.outerHeight())
				.end();
				if ($(this).data("tit2")) {
					$target
						.find('h3 > a').text($(this).data("tit2")).end()
						.find('a.next').data("reason",$(this).data("tit2"));
				}

				reposition( $target );
			}else {
				$(this).closest('.step')
					.closest('fieldset')
						.find('.step.frm')
							.find('h3 > a')
								.data("prev",$(this).closest('.step').data('step'))
							.end()
							.find('select option:first-child')
								.val($(this).data('reason'))
								.text($(this).data('reason'))
							.end()
						.animate({'left':'0'},duration,effect).end()
					.height($(this).closest('fieldset').find('.step.frm').outerHeight()).end()
				.animate({'left':'-100%'},duration,effect);

				reposition( $(this).closest('.step').closest('fieldset').find('.step.frm') );
			}
			if ($(this).data("othernext")) {
				//console.debug('DEBUG: added mail address', $(this).data("othernext"))
				nextMailPoc = $(this).data("othernext");
			}

		}
		return false;
	});
	$('#contact .visual h3 a').click(function(){
		$(this).closest('.step')
			.closest('fieldset')
				.find('.step[data-step="'+$(this).data("prev")+'"]')
					.animate({'left':'0'},duration,effect)
				.end()
			.height($(this).closest('fieldset').find('.step[data-step="'+$(this).data("prev")+'"]').outerHeight())
			.end()
		.animate({'left':'100%'},duration,effect);

		reposition( $(this).closest('.step').closest('fieldset').find('.step[data-step="'+$(this).data("prev")+'"]') );
	});
	$('#contact .visual .btn-send').click(function(){
		var el = this;
		var $step = $(el).closest('.step');
		
		if (!nextMailPoc) {
			console.warn('POC should be populated')
			alertify.alert('There was an error. Please try again.')
			return
		}

		var mailSender = $step.find('input.email').val().trim();
		var mailTopic = $step.find('select').val().trim();
		if (mailTopic === 'other') {
			mailTopic = $step.find('input.other-topic').val();
		}
		var mailMessage = $step.find('textarea.content').val().trim();
		var senderFullname = $step.find('input.sender-name').val().trim();

		if (!mailSender) {
			alertify.alert('Please write your e-mail.');
			return;
		}
		if (!mailTopic) {
			alertify.alert('Please write your subject.');
			return;
		}
		if (!mailMessage) {
			alertify.alert('Please write your message.');
			return;
		}
		if (!senderFullname) {
			alertify.alert('Please write your full name.');
			return;
		}

		var dur = duration;
		var eff = effect;
		
		var data = {
			poc: nextMailPoc,
			sender: mailSender,
			topic: mailTopic,
			message: mailMessage,
			sender_fullname: senderFullname
		};
		if (location.args.test_with_mail) {
			data.test_with_mail = location.args.test_with_mail;
		}

		$.ajax({
			url  : '/send-business-mail.json',
			method: 'POST',
			data: data
		})
		.done(function(){
			$(el).closest('fieldset').find('.step:not(".complete")').css({opacity: 0}).closest('fieldset').find('.step.complete').css({ left: 0 }).addClass('show');
			setTimeout(function(){
				$('.visual').find('fieldset')
					.find('.step:not(".complete")')
						.animate({'left':'100%'},dur,eff)
						.css('opacity','0')
					.end()
					.find('.step.complete')
						.removeClass('show')
					.end()
					.find('.selector[data-step="index"]')
						.animate({'left':'0'},dur,eff)
						.css('opacity','')
					.end()
				.height($('.selector[data-step="index"]').outerHeight());	
			}, 3000);

			setTimeout(function(){
				$('.visual').find('.step').css('opacity','');
			}, 3500)
			// alertify.alert('Mail is sent successfully.')

			// Reset form
			$step.find('select').val($step.find('select option:first-child').val());
			$step.find('input.other-topic').val('').hide();
			$step.find('select').show();
			$step.find('textarea.content').val('');
			nextMailPoc = '';
		})
		.fail(function(){
			alertify.alert('There was an error while sending your mail. Please try again.')
		})
	});

})
