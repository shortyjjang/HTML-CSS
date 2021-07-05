$(function(){

	// set a flag to check if the stream is restored
	var $stream = $('#content .stream').attr('loc', location.pathname.replace(/\//g, '-').substr(1)), $last;
	$last = $stream.find('>li:last-child');

	$("#content").removeClass("loading");

	$stream.data('restored', $last[0] !== $stream.find('>li:last-child')[0]);
	if(!$stream.find('> li').length) $('div.empty-result').show();

	$("a.keep-filters").click(function() {
		event.preventDefault();
		var link = $(this).attr('href'), params = {}, p = link.indexOf('?');
		if (p > 0) {
			params = $.parseString(link.substr(p + 1));
			link = link.substr(0, p);
		}
		params = $.extend(params, location.args, window.overwrite_filter_values);
		if ($.isEmptyObject(params)) location  = link;
		else location = link + '?' + $.param(params);
		return false;
	});

	$('#sidebar .refine_menu .categories li').each(function(){
		if ($(this).find('li').length < 2) {
			$(this).find('ul, a.show').remove();
		}
	});

	$('#sidebar')
		.find('.refine_menu .categories').delegate('li a', 'click', function (event) {
			event.preventDefault();
			if ($(this).hasClass('show')){
				$(this).closest('li').toggleClass('open');
			} else {
				$(this).closest('dl').find('a.current').removeClass('current').end().end().addClass("current");
				$(".refine_menu .reset").show();
				
				var subcategory = $(this).attr('rel'), url = location.pathname,
				args = $.extend({}, location.args, window.overwrite_filter_values), query;

				if ($('.container').hasClass('search')) {
					delete args.scid;
					args.scid = subcategory;
				}else{
					delete args.categories;
					args.categories = subcategory;
				}

				if (query = $.param(args)) {
					if (url.indexOf("?") > 0) url += '&' + query;
					else url += '?' + query;
				}

				loadPage(url);
			}
			return false;
		}).end()
		.find(".btn-apply").click(function(event){
			if ($('.container').hasClass('search')) return;

			var keyword = $(".refine_menu .filter input[type=text]").val(),
			url = location.pathname,
			args = $.extend({}, location.args, window.overwrite_filter_values),
			query;

			event.preventDefault();

			if (keyword) {
				args.q = keyword;
			} else {
				delete args.q;
			}

			if (query = $.param(args)) {
				if (url.indexOf("?") > 0) url += '&' + query;
				else url += '?' + query;
			}

			if (args.q || args.categories || args.scid || args.price || args.p || args.color || args.c || args.sort_by || args.order_by ) { $('#sidebar .refine_menu').find('.reset').show();
			} else {$('#sidebar .refine_menu').find('.reset').hide();}
			loadPage(url);
		}).end()
		.find(".keyword")
			.find("input[type=text]")
				.hotkey("ENTER", function(event) {
					var keyword = $.trim(this.value),
						url = location.pathname,
						args = $.extend({}, location.args, window.overwrite_filter_values),
						query;

					event.preventDefault();

					if (keyword) {
						args.q = keyword;
					} else {
						delete args.q;
					}

					if ((query = $.param(args))) url += "?" + query;

					if (args.q || args.categories || args.scid || args.price || args.p || args.color || args.c || args.sort_by || args.order_by ) { $('#sidebar .refine_menu').find('.reset').show();
					} else {$('#sidebar .refine_menu').find('.reset').hide();}
					loadPage(url);
				})
				.keyup(function() {
					var hasVal = !!$.trim(this.value);
					if (hasVal) {
						$(this).parent().find(".remove").show();
					} else {
						$(this).parent().find(".remove").hide()
					}
				})
			.end()
			.find(".remove").click(function(event) {
				event.preventDefault();
				$(this)
					.parent()
					.find("input[type=text]")
					.val("")
					.keyup();

				var url = location.pathname,
					args = $.extend({}, location.args, window.overwrite_filter_values),
					query;

				event.preventDefault();
				delete args.q;

				if ((query = $.param(args))) url += "?" + query;

				if (args.q || args.categories || args.scid || args.price || args.p || args.color || args.c || args.sort_by || args.order_by ) { $('#sidebar .refine_menu').find('.reset').show();
				} else {$('#sidebar .refine_menu').find('.reset').hide();}
				loadPage(url);
			}).end()
		.end()
		.find(".reset").click(function(event) {
			event.preventDefault();
			$('.refine_menu')
				.find('dl').removeClass('show').find('dd').hide().end().end()
				.find('dl.sort dd').removeAttr('style').end()
				.find('li').removeClass('open').find('a').removeClass('current').removeClass('selected').end()

			if (!$('.container').hasClass('search')) $('.refine_menu').find('.keyword input[type=text]').val("").keyup() ;

			var url = location.pathname,
				args = $.extend({}, location.args, window.overwrite_filter_values),
				query;

			if (!$('.container').hasClass('search')) delete args.q;
			delete args.p;
			delete args.price;
			delete args.categories;
			delete args.scid;
			delete args.color;
			delete args.sort_by;
			delete args.order_by;

			if ((query = $.param(args))) url += "?" + query;

			$('.refine_menu .sort dt a').text('Sort by');
			$('#sidebar .refine_menu').find('.reset').hide();
			loadPage(url);
			return false;
		}).end()
		.find(".price")
			.find('.amount .btn-apply').click(function(event){
				var min_price = parseInt($('.price .amount input.min').val()),
					max_price = parseInt($('.price .amount input.max').val()),
					url = location.pathname,
					args = $.extend({}, location.args, window.overwrite_filter_values),
					query;

				$('#slider-range').slider("values", 0,min_price);
				$(".price .amount span.min").text(min_price);
				$('#slider-range').slider("values", 1,max_price);
				$(".price .amount span.max").text(max_price);


				if (max_price == 1000) max_price = "";
				if (max_price && !min_price) min_price = "1";
				if ($('.container').hasClass('search')) {
					if (min_price || max_price) {
						var price = min_price + "-" + max_price;
						args.p = price;
					} else {
						delete args.p;
					}
				}else{
					if (min_price || max_price) {
						var price = min_price + "-" + max_price;
						args.price = price;
					} else {
						delete args.price;
					}
				}

				if ((query = $.param(args))) url += "?" + query;

				loadPage(url);
			}).end()
			.find('li a').click(function(event){
				var min_price = parseInt($(this).data('pricemin')),
					max_price = parseInt($(this).data('pricemax')),
					url = location.pathname,
					args = $.extend({}, location.args, window.overwrite_filter_values),
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
					if ($('.container').hasClass('search')) {args.p = price;
					}else{args.price = price;}
					$(this).closest('ul').find('a').removeClass('selected').end().end().addClass('selected').closest('.refine_menu').find('.reset').show();
				} else {
					if ($('.container').hasClass('search')) {	delete args.p;
					}else{	delete args.price;}
					$(this).closest('ul').find('a').removeClass('selected');
					if($(this).closest('.refine_menu').find('.keyword input[type=text]').val()=='') {
						$(this).closest('.refine_menu').find('a.reset').hide();
					}
				}

				if ((query = $.param(args))) url += "?" + query;

				if (args.q || args.categories || args.scid || args.price || args.p || args.color || args.c || args.sort_by || args.order_by ) { $('#sidebar .refine_menu').find('.reset').show();
				} else {$('#sidebar .refine_menu').find('.reset').hide();}
				loadPage(url);
				return false;
			}).end()
			.find("#slider-range").slider({
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
						args = $.extend({}, location.args, window.overwrite_filter_values),
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

					if (args.q || args.categories || args.scid || args.price || args.p || args.color || args.c || args.sort_by || args.order_by ) { $('#sidebar .refine_menu').find('.reset').show();
					} else {$('#sidebar .refine_menu').find('.reset').hide();}
					loadPage(url);
				}
			}).end()
		.end()
		.find(".color li a").on("click", function(event) {
			event.preventDefault();
			$(this).closest(".color").find("a").removeClass('selected').end().end().addClass('selected');
			var color = $(this).data('color'),
				url = location.pathname,
				args = $.extend({}, location.args, window.overwrite_filter_values),
				query;

			if (color) {
				if ($('.container').hasClass('search')) {
					args.c = color;
				}else{
					args.color = color;
				}
			} else {
				delete args.c;
				delete args.color;
			}

			if (query = $.param(args)) {
				if (url.indexOf("?") > 0) url += '&' + query;
				else url += '?' + query;
			}

			if (args.q || args.categories || args.scid || args.price || args.p || args.color || args.c || args.sort_by || args.order_by ) { $('#sidebar .refine_menu').find('.reset').show();
			} else {$('#sidebar .refine_menu').find('.reset').hide();}

			loadPage(url);
			return false;
		});

    // new sort option (v4)
	$('.sort')
		.delegate('li a', 'click', function (event) {
			event.preventDefault();
			$(this).closest(".sort")
				.find('a').removeClass('selected').end()
				.find('option').removeAttr('selected');
			var sort_by = $(this).data('sortby'),
				url = location.pathname,
				args = $.extend({}, location.args, window.overwrite_filter_values),
				query;

			if (sort_by) {
				if ($('.container').hasClass('search')) {
					args.order_by = sort_by;
				}else{
					args.sort_by = sort_by;
				}
			} else {
				delete args.sort_by;
				delete args.order_by;
			}

			if ((query = $.param(args))) url += "?" + query;
			setOptions(args);
			if (args.q || args.categories || args.scid || args.price || args.p || args.color || args.c || args.sort_by || args.order_by ) { $('#sidebar .refine_menu').find('.reset').show();
			} else {$('#sidebar .refine_menu').find('.reset').hide();}

			loadPage(url);
			$(this).addClass('selected')
				.closest(".sort")
				.find("dt a")
				.text(
					$(this).text()
				);
			$(this).closest('dl').toggleClass('show');
			return false;
		}).end()
		.find("select").on("change", function(event) {
			event.preventDefault();
			$(this).closest(".sort")
				.find('a').removeClass('selected');

			var sort_by = $(this).val(),
				url = location.pathname,
				args = $.extend({}, location.args, window.overwrite_filter_values),
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
		})
	.end();


    function setOptions(params) {
    }

	function loadPage(url, skipSaveHistory){
		var $stream = $('#content ol.stream');
		if ($stream.length === 0) {
			$('#content').prepend($('<ol class="stream after" ts="" loc="" />'));
			$stream = $('#content ol.stream');
		}

		if (!skipSaveHistory && window.history && history.pushState) {
			history.pushState({
				url: url
			}, document.title, url);
		}
		location.args = $.parseString(location.search.substr(1));

		$('.pagination > a').remove().attr('href', '');
		$("#content").addClass("loading");

		try {
			if (window.ajax) window.ajax.abort()
		} catch (e) {};

		window.ajax = $.ajax({
			type: 'GET',
			url: url,
			dataType: 'html',
			success: function (html) {

				$stream.attr('loc', location.pathname.replace(/\//g, '-').substr(1));

				var $html = $($.trim(html)), $more = $('.pagination > a'), $new_more = $html.find('.pagination > a');

				if ($new_more.length) $('.pagination').append($new_more);
				$("#content").removeClass("loading");

				$('.page-header .count b').text($html.find('.count b').text());

				if ($html.find('.count b').text() == '0') {
					$('#content').find('ol.stream').html('').end().find('.empty-result, .yet_product, .empty').show();
				}else{
					$('#content').find('ol.stream').html($html.find('ol.stream').html()).end().find('.empty-result, .yet_product, .empty').hide();
				}

				(function () {
					// reset infiniteshow
					$.infiniteshow({
						itemSelector: '#content .stream > li',
						post_callback: function () {
						}
					});
				})();
			}
		});

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

	var $selectedSubcat = $('.refine_menu li li a.current[rel]');
	if ($selectedSubcat.length > 0) {
		$selectedSubcat.closest('dd > ul > li')
			.find('> a').addClass('current').end()
			.addClass('open');
	}
});
