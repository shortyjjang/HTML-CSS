$(function(){

	// set a flag to check if the stream is restored
	var $stream = $('#content .stream').attr('loc', location.pathname.replace(/\//g, '-').substr(1)), $last;
    $last = $stream.find('>li:last-child');
    // var infiniteShowOption = {
    //     itemSelector: '#content .stream > li',
    //     streamSelector: '#content .stream'
    // }
    // if ($('.stream[loc]').attr('loc')) {
    //     infiniteShowOption.dataKey = $('.stream[loc]').attr('loc')
    // } else if (window.infiniteShowDataKey) {
    //     infiniteShowOption.dataKey = window.infiniteShowDataKey;
    // }
	// $.infiniteshow(infiniteShowOption);
	$("#content").removeClass("loading");
	
	// $stream.data('restored', $last[0] !== $stream.find('>li:last-child')[0]);
	// if(!$stream.find('> li').length) $('div.empty-result').show();

    $("a.keep-filters").click(function() {
        event.preventDefault();
		var link = $(this).attr('href'), params = {}, p = link.indexOf('?');
        if (p > 0) {
            params = $.parseString(link.substr(p + 1));
            link = link.substr(0, p);
        }
        params = $.extend(params, location.args);
        if ($.isEmptyObject(params)) location  = link;
        else location = link + '?' + $.param(params);
        return false;
    });

	$('.shop.browse .cover a, .shop.browse .category-menu a, .shop.sales .cover a, .shop.sales .category-menu a').each(function(){
		var link = $(this).attr('href');
		if (link && link != '#') {
			if (link.indexOf('&')>0) link = link.replace(" & ", "-");
			if (link.indexOf(' ')>0) link = link.replace(" & ", "-");
			$(this).attr('href',link);
		}
	});

    $("#refine-by-category").on("change", function(event) {
        event.preventDefault();
        var url = $(this).val(),
            args = $.extend({}, location.args),
            query;

        if (args.sale_category) delete args.sale_category;
        if ((query = $.param(args))) {
            if (url.indexOf("?") > 0) url += "&" + query;
            else url += "?" + query;
        }

        loadPage(url);
    });

    var currentSaleCategory = location.args.sale_category;
    if (!!currentSaleCategory) {
        $('#sidebar .category li a').removeClass('current');
        $('#sidebar .category li a[data-sale_category="' + currentSaleCategory + '"]').addClass('current');
    }

    if (!!currentSaleCategory || !!location.args.price || !!location.args.keyword || !!location.args.q) {
        $('.wrapper-content').addClass('refine');
    }

    // keyword search
    $("#sidebar .btn-apply").click(function(event){
            var keyword = $(".refine_menu .filter input[type=text]").val(),
                url = location.pathname,
                args = $.extend({}, location.args),
                query;

            event.preventDefault();

            if (keyword) {
                args.q = keyword;
            } else {
                delete args.q;
            }

            if ((query = $.param(args))) url += "?" + query;

            loadPage(url);
			$(this).find('.refine_menu').find('.reset').show();
	});
    $(".refine_menu .filter input[type=text]")
        .hotkey("ENTER", function(event) {
            var keyword = $.trim(this.value),
                url = location.pathname,
                args = $.extend({}, location.args),
                query;

            event.preventDefault();

            if (keyword) {
                args.q = keyword;
            } else {
                delete args.q;
            }

            if ((query = $.param(args))) url += "?" + query;

            loadPage(url);
			if($('.container').hasClass('product-listing')) {
				$(this).closest('.refine_menu').find('.reset').show();
			}else{
				if (keyword) {
				$(this)
					.closest("dl.filter")
					.find("dt a")
					.text(keyword);
				}else{
					$(this)
						.closest("dl.filter")
						.find("dt a")
						.text('Keyword');
				}
				$(this).closest('dl').toggleClass('show');
			}
        })
        .keyup(function() {
            var hasVal = !!$.trim(this.value);
			if($('.container').hasClass('product-listing')) return;
            if (hasVal) {
                $(this)
                    .parent()
                    .find(".remove")
                    .show();
            } else {
                $(this)
                    .parent()
                    .find(".remove")
                    .hide()
                    .closest("dl.filter")
                    .find("dt a")
                    .text('Keyword');
            }
        })
        .keyup();

    $(".refine_menu .reset").click(function(event) {
        event.preventDefault();
        $('.refine_menu')
            .find('li a').removeClass('selected').end()
			.find('.keyword input[type=text]').val("").keyup() ;

        var url = location.pathname,
            args = $.extend({}, location.args),
            query;

        event.preventDefault();
        delete args.q;
        delete args.price;

        if ((query = $.param(args))) url += "?" + query;

        loadPage(url);
		return false;
    });

    // remove keyword
    $(".refine_menu .filter .remove").click(function(event) {
        event.preventDefault();
        $(this)
            .parent()
            .find("input[type=text]")
            .val("")
            .keyup();

        var url = location.pathname,
            args = $.extend({}, location.args),
            query;

        event.preventDefault();
        delete args.q;

        if ((query = $.param(args))) url += "?" + query;

        loadPage(url);
		$(this)
			.closest("dl.filter")
			.find("dt a")
			.text('Keyword');
    });
    
    $(".ships li a").on("click", function(event) {
        event.preventDefault();
        $(this).closest(".ships").find('a').removeClass('selected');
        var ships_to = $(this).attr('value'),
            url = location.pathname,
            args = $.extend({}, location.args),
            query;

        if (ships_to) {
            args.ships_to = ships_to;
        } else {
            delete args.ships_to;
        }

        if ((query = $.param(args))) url += "?" + query;
        setOptions(args);

        loadPage(url);
        $(this).addClass('selected')
            .closest(".ships")
            .find("dt a")
            .text(
                $(this).text()
            );
        $(this).closest('dl').toggleClass('show');
		return false;
    });

    $(".color li").on("click", function(event) {
        event.preventDefault();
        $(this).closest(".color").find("li").removeClass('checked');
        var color = $(this).find("input").val(),
            url = location.pathname,
            args = $.extend({}, location.args),
            query;

        if (color) {
            args.color = color;
        } else {
            delete args.color;
        }

        if ((query = $.param(args))) url += "?" + query;
        setOptions(args);

        loadPage(url);
        if (color) {
            $(this).addClass('checked')
            .closest(".color")
            .find("dt a")
            .text(
                $(this).find("label").text()
            );
        } else {
            $(this)
            .closest(".color")
            .find("dt a")
            .text('Color');
        }
        $(this).closest('dl').toggleClass('show');
    });

    // new sort option (v4)
    $(".sort li a").on("click", function(event) {
        event.preventDefault();
        $(this).closest(".sort")
			.find('a').removeClass('selected').end()
			.find('option').removeAttr('selected');
        var sort_by = $(this).data('sortby'),
            url = location.pathname,
            args = $.extend({}, location.args),
            query;

        if (sort_by) {
            args.sort_by = sort_by;
        } else {
            delete args.sort_by;
        }

        if ((query = $.param(args))) url += "?" + query;
        setOptions(args);

        loadPage(url);
        $(this).addClass('selected')
            .closest(".sort")
            .find("dt a")
            .text(
                $(this).text()
            );
        $(this).closest('dl').toggleClass('show');
		return false;
    });
    $('select[name="sort"]').on("change", function(event) {
        event.preventDefault();
        $(this).closest(".sort")
			.find('a').removeClass('selected');

        var sort_by = $(this).val(),
            url = location.pathname,
            args = $.extend({}, location.args),
			query;
		if (sort_by == '') {
            delete args.sort_by;
		}
        else if (sort_by) {
            args.sort_by = sort_by;
        } else {
            delete args.sort_by;
        }

        if ((query = $.param(args))) url += "?" + query;
        setOptions(args);

        loadPage(url);
		if (sort_by == 'newest') {
			$(this)
				.closest(".sort")
				.find("dt a").text('Newest').end()
				.find('a[data-sortby="' + sort_by + '"]').addClass('selected');
		} else if (sort_by == 'popular') {
			$(this)
				.closest(".sort")
				.find("dt a").text('Popular').end()
				.find('a[data-sortby="' + sort_by + '"]').addClass('selected');
		} else if (sort_by == 'price_desc') {
			$(this)
				.closest(".sort")
				.find("dt a").text('Highest price').end()
				.find('a[data-sortby="' + sort_by + '"]').addClass('selected');
		} else if (sort_by == 'price_asc') {
			$(this)
				.closest(".sort")
				.find("dt a").text('Lowest price').end()
				.find('a[data-sortby="' + sort_by + '"]').addClass('selected');
		} else {
			$(this)
				.closest(".sort")
				.find("dt a").text('Sort');
		}

		return false;
    });

	$('.price .amount .btn-apply').click(function(event){
		var min_price = parseInt($('.price .amount input.min').val()),
			max_price = parseInt($('.price .amount input.max').val()),
			url = location.pathname,
			args = $.extend({}, location.args),
			query;

		$('#slider-range').slider("values", 0,min_price);
		$(".price .amount span.min").text(min_price);
		$('#slider-range').slider("values", 1,max_price);
		$(".price .amount span.max").text(max_price);


		if (max_price == 1000) max_price = "";
		if (max_price && !min_price) min_price = "1";

		if (min_price || max_price) {
			var price = min_price + "-" + max_price;
			args.price = price;
		} else {
			delete args.price;
		}

		if ((query = $.param(args))) url += "?" + query;

		loadPage(url);
	});
	$('.price li a').click(function(event){
		var min_price = parseInt($(this).data('pricemin')),
			max_price = parseInt($(this).data('pricemax')),
			url = location.pathname,
			args = $.extend({}, location.args),
			query;

		if (max_price == 1000 || isNaN(max_price)) max_price = "";
		if (max_price && !min_price) min_price = "1";

		if ($(this).hasClass('selected')) {
			delete args.price;
			$(this).closest('ul').find('a').removeClass('selected');
			if($(this).closest('.refine_menu').find('.keyword input[type=text]').val()=='') {
				$(this).closest('.refine_menu').find('a.reset').hide();
			}
		}
		else if (min_price || max_price) {
			var price = min_price + "-" + max_price;
			args.price = price;
			$(this).closest('ul').find('a').removeClass('selected').end().end().addClass('selected').closest('.refine_menu').find('.reset').show();
		} else {
			delete args.price;
			$(this).closest('ul').find('a').removeClass('selected');
			if($(this).closest('.refine_menu').find('.keyword input[type=text]').val()=='') {
				$(this).closest('.refine_menu').find('a.reset').hide();
			}
		}

		if ((query = $.param(args))) url += "?" + query;

		loadPage(url);
		return false;
	});

    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 1000,
        step: 10,
        values: [parseInt($(".price .amount span.min").text()), parseInt($(".price .amount span.max").text())],
        slide: function(event, ui) {
            if (ui.values[1] - ui.values[0] < 10) return false;
            $(".price .amount span.min").text(ui.values[0] || 1);
            $(".price .amount span.max").text(ui.values[1] + (ui.values[1] == 1000 ? "+" : ""));
            $(".price .amount input.min").val($(".price .amount span.min").text());
            $(".price .amount input.max").val($(".price .amount span.max").text());
            $('.price dt a').text("$"+$(".price .amount span.min").text()+" - $" + $(".price .amount span.max").text());
        },
        change: function(event, ui) {
            var min_price = ui.values[0],
                max_price = ui.values[1],
                url = location.pathname,
                args = $.extend({}, location.args),
                query;


            if (max_price == 1000) max_price = "";
            if (max_price && !min_price) min_price = "1";

            if (min_price || max_price) {
                var price = min_price + "-" + max_price;
                args.price = price;
            } else {
                delete args.price;
            }

            if ((query = $.param(args))) url += "?" + query;

            loadPage(url);
        }
    });

    function setOptions(params) {
        // set sort order
        $(".refine_menu .sort li.selected").removeClass("selected");
        if (params.sort_by) {
            if ($(".refine_menu .sort li input").length) {
                $(".refine_menu .sort li input[value=" + params.sort_by + "]")
                    .parent()
                    .addClass("selected")
                    .end()[0].checked = true;
            }
        }

        $(".refine_menu .option fieldset").hide();
        if (params.ss) {
            $(".refine_menu .option fieldset").show();
            $(".refine_menu input[name=ss]")
                .parent()
                .addClass("selected")
                .end()[0].checked = true;
        }
    }

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

		$('#content').addClass('loading');
		$stream.css('height','');
		$('div.empty-result').hide();
		if(useCSS3){
			$stream.addClass('use-css3').removeClass('fadein').parents('#content').addClass('loading');

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
				
				$stream.attr('loc', location.pathname.replace(/\//g, '-').substr(1));

				var $html = $($.trim(html)),
				    $more = $('.pagination > a'),
				    $new_more = $html.find('.pagination > a');
					
				
				$stream.html( $html.find('#content ol.stream').html() );
				$(".filter div.breadcrumb").html( $html.find(".filter div.breadcrumb").html() );
				//if( $(".filter div.breadcrumb a").length ) $(".filter div.breadcrumb").show()
				//else $(".filter div.breadcrumb").hide();

				$(".filter ul.menu").html( $html.find(".filter ul.menu").html() );
				if( $html.find(".filter ul.menu").css('display')!='none'){
					if( $(".filter ul.menu li").length ) $(".filter ul.menu").show()
					else $(".filter ul.menu").hide();	
				}else{
					$(".filter ul.menu").hide();
				}
				
			
				$('#content').removeClass('loading');
				if(!$stream.find('> li').length) $('div.empty-result').show();
				else $('div.empty-result').hide();

				$('.page-header .count b').text($html.find('.count b').text());

				if($new_more.length) $('.pagination').append($new_more);
				$more.remove();

                var $mixpanel = $html.filter('script#mixpanel_script');
                if ($mixpanel) $.globalEval($mixpanel.html()); 


				(function(){
					if(useCSS3 && (Date.now() - begin < maxDelay+300)){
						return setTimeout(arguments.callee, 50);
					}

					$stream.addClass('fadein').html( $html.find('#content ol.stream').html() );
					
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

						setTimeout(function(){ $stream.removeClass('use-css3 fadein').find('li.anim').removeClass('anim fadein').parents('#content').removeClass('loading'); }, maxDelay+300);
					}

					$win.scrollTop(0).trigger('scroll');
				})();
			}
		});

		function inViewport(el){
			return (stTop + el.offsetTop + el.offsetHeight > scTop + headerH) && (stTop + el.offsetTop < scTop + winH);
		};
	};


	$(window).on('popstate', function(event){
		var e = event.originalEvent, $stream;
		if(!e || !e.state) return;

		$stream = $('#content .stream');
		if ($stream.data('restored')) {
			$stream.data('restored', false);
		} else {
			loadPage(event.originalEvent.state.url, true);
		}
	});
});
