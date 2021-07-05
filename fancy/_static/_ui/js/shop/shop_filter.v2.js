$(function(){

	// set a flag to check if the stream is restored
	var $refine_menu = $('#sidebar .refine_menu'), $content = $('#content'), originalRefineHtml= null;

	$content.removeClass("loading");

	$('#sidebar > label').on('click',function(){
		if($(window).width()>900) return;
		$('body').toggleClass('filter_open');
		originalRefineHtml = $refine_menu.html(); // restore in case you close without saving
	});

	$refine_menu
	.on('click', 'dt' ,function(){
		if($(window).width()>900) return;
		$(this).closest('dl').toggleClass('show');
	})
	.on('click', 'a.close', function(){
		if($(window).width()>900) return;
		$('body').removeClass('filter_open');
		if (originalRefineHtml) $refine_menu.html(originalRefineHtml)
		return false;
	})
	.on('click', 'li > a', function(event){
		event.preventDefault();
		var url = location.pathname,
			args = $.extend({}, location.args, window.overwrite_filter_values),
			query, active = $(this).hasClass('selected');
		var $this = $(this), $dl = $this.closest('dl');
		var type = $dl.attr('data-type'), key = $dl.attr('data-key'), value = $this.attr('data-value');

		$this.closest('dd').find('a.selected').removeClass('selected');
		$refine_menu.find('.result a[data-type=' + $dl.attr('data-type') + ']').remove();
		if (!active) {
			 $(this).addClass('selected');
			 $("<a>").attr("href", "#").attr("data-type", type).attr("data-key", key).text($this.text()).appendTo($refine_menu.find('.result'));
		}

		if($(window).width() <= 900) return;

		if (active) {
			delete args[key];
		} else if (value && value.length) {
			args[key] = value;
		} else {
			delete args[key];
		}

		delete args.pg;
		
		loadArgs(args);

		return false;
	})
	.on('click', '.result a', function(event) {
		event.preventDefault();
		var $this = $(this), type = $this.attr("data-type");
		if (type == "keyword") {
			$refine_menu.find('.keyword input[type=text]').val('').trigger('update');
		} else {
			$refine_menu.find('dl[data-type="' + type + '"] li a.selected').click();
		}
	})
	.on('click', '.btn-apply', function(event){
		event.preventDefault();
		$('body').removeClass('filter_open');
		var args = $.extend({}, location.args, window.overwrite_filter_values);
		delete args.pg;		
		$refine_menu.find("dl[data-type]").each(function (idx, elem) {
			var $dl = $(elem), type = $dl.attr('data-type'), key = $dl.attr('data-key'), val;
			if (type == "keyword") {
				var $k = $dl.find("input[type=text]");
				$k.trigger('update');
				val = $k.val();
			} else {
				val = $dl.find("a.selected").attr("data-value");
			}
			if (val && val.length) args[key] = val;
			else delete args[key];
		});
		loadArgs(args);
	})
	.on('update', '.keyword input[type=text]', function() {
		var keyword = $.trim(this.value), args = $.extend({}, location.args, window.overwrite_filter_values);
		var key = $(this).closest('dl').attr('data-key');
		
		$refine_menu.find('.result a[data-type=keyword]').remove();
		if (keyword) {
			args[key] = keyword;
			$("<a>").attr("href", "#").attr("data-type", "keyword").attr("data-key", key).text(keyword).appendTo($refine_menu.find('.result'));
		} else {
			delete args[key];
		}
		delete args.pg;

		if($(window).width()>900) { loadArgs(args); }
	})
	.on('keyup', '.keyword input[type=text]', function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
			$(this).trigger('update');
		}
	})
	.on('keydown', '.keyword input[type=text]', function() {
		var hasVal = !!$.trim(this.value);
		if (hasVal) {
			$(this).parent().find(".remove").show();
		} else {
			$(this).parent().find(".remove").hide()
		}
	})
	.on('click', '.keyword .remove', function(event) {
		event.preventDefault();
		$(this)
			.hide()
			.parent()
			.find("input[type=text]")
			.val("")
			.trigger('update');
	});

    // new sort option (v4)
	$('.sort select').on("change", function(event) {
		event.preventDefault();
		$(this).closest(".sort")
			.find('a').removeClass('selected').end()
			.find('label').text($(this).find("option:selected").text());

		var sort_by = $(this).val(),
			url = location.pathname,
			args = $.extend({}, location.args, window.overwrite_filter_values),
			query;
		if (sort_by && sort_by.length) {
			args.sort_by = sort_by;
		} else {
			delete args.sort_by;
		}
		delete args.pg;
		loadArgs(args);

		return false;
	});

	$(".pagination").on('click', 'a', function(event) {
		var page = $(this).attr("page");
		if (page) {
			event.preventDefault();
			var args = $.extend({}, location.args, window.overwrite_filter_values);
			args.pg = page;
			loadArgs(args);
			$(this).closest('.pagination').find("a.current").removeClass("current");
			$(this).addClass("current");
		}
	});

	function loadArgs(args) {
		var url = location.pathname;
		if (query = $.param(args)) {
			if (url.indexOf("?") > 0) url += '&' + query;
			else url += '?' + query;
		}
		loadPage(url);
	}

	function loadPage(url, skipSaveHistory){
		originalRefineHtml = null;

		if (!skipSaveHistory && window.history && history.pushState) {
			history.pushState({
				url: url
			}, document.title, url);
		}
		location.args = $.parseString(location.search.substr(1));


		$("#content").addClass("loading");

		try {
			if (window.ajax) window.ajax.abort()
		} catch (e) {};

		var top = 0, $container = $(".container");
		if ($container.hasClass("brand")) {
			var $profile = $container.find(".profile");
			top = $profile[0].offsetHeight + parseInt($(".container .profile").css("margin-bottom")) || 0;
		}
		$(window).scrollTop(top);

		window.ajax = $.ajax({
			type: 'GET',
			url: url,
			dataType: 'html',
			success: function (html) {
				var $html = $("<div>" + $.trim(html) + "</div>");
				$("#content").removeClass("loading");
				$('.page-header .count b').text($html.find('.count b').text());
				$("#content").html($html.find("#content").html());
				$(".pagination").html($html.find(".pagination").html());
				$('#sidebar').removeClass('fixed').removeClass('fixedTop').removeClass('stop').css('top','');
				
			}
		});
	};

	$(window).on('popstate', function(event){
		var e = event.originalEvent;
		if(!e || !e.state) return;
		loadPage(event.originalEvent.state.url, true);
	});
});