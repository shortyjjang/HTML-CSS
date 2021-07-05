(function(){
	var Router = namespace('Fancy.Router');
	Router.ColorSearch = Backbone.Router.extend({
		routes : {
			'' : 'index',
			'search/:color' : 'search',
			'search/:color/:variance' : 'search'
		}
	});
})();


jQuery(function($){
	var $win = $(window), router, things, view, args,
		$popup  = $('#search-palette-frm'),
	    $square = $('#search-color-square'),
	    $sample = $('#search-color-sample'),
	    $variance = $('#search-color-variance'),
		$slider   = $popup.find('.color-range'),
		$palette  = $('#content > .palette-big'),
	    $header   = $('h2 > b'), headerText = $header.eq(1).text(),
		$spinner;

	// create the color palette
	(function(){
		var html = '', colors = 'd4f5fe d7e6fd cec8fc e0c8fc eed2e2 f5d8da f7ddd6 fae8d5 fbecd5 fdf8dd faf8dc e6edd4 aeebfd b0cdfc 998bfa c390fb e0a2c5 ecafb0 f2bcab f5cfa9 f7dbab fdf4bc f7f3b9 d9e8b6 88e1fb 84b3fc 654ef8 a556f9 d270a6 e48687 ea977e f1b87b f4c97d fded99 f3f095 c5dd8f 6cd5fa 5c99fa 4131e6 8e39ef c83e87 dc5859 e5734c ec9f4a f1b64d fde775 efe970 b5d268 58afd5 3777f9 3625ae 742cb8 a03169 d83324 e35218 ea9225 efae2c fee855 eae64d 9aba4c 4c97b1 3169d1 281f90 5c249a 852959 bc1a08 be3d0f c16f1c c48922 f2d436 cfc938 819b40 3c768c 2753a5 211974 4a1c79 682047 951406 96300c 995a17 9a6c1b c0aa2b a39d2b 667933 2b5564 1c3d78 151252 361457 4b1833 6b0e04 6c2309 6e4011 6f4d14 8a781e 76721f 4a5824 203e4a 142a55 100c3d 260f3f 360f24 4d0903 4f1906 502f0c 50380f 655716 565316 36401a ffffff f7f7f7 e4e4e4 cbcbcb afafaf 909090 717171 525252 363636 1d1d1d 090909 000000'.split(' ');

		for (var i=0; i < colors.length; i++) {
			html += '<li><a href="#search/'+colors[i]+'" style="background-color:#'+colors[i]+'"></a></li>';
		}

		$palette.html(html);
	})();

	// refind
	(function(){
		$popup.on('click', '.btn-update', function(event){
			event.preventDefault();
			router.navigate('search/'+$sample.val().substr(1)+'/'+$variance.val().replace(/%$/,''), {trigger:true});
			$popup.hide();
		});
	})();

	// color range slider and color picker
	(function(){
		$popup.show();

		// Color picker
		$sample.iris({
			hide : false,
			change : function(event, ui){ $square.css('background', ui.color.toString()); }
		});

		// Slider
		$slider.slider({
			min   : 0,
			max   : 100,
			value : 0,
			slide : function(event, ui){ $variance.val(ui.value+'%'); }
		});

		$popup.hide();
	})();

	// spinner
	(function() {
		var opts = {
			lines: 9, // The number of lines to draw
			length: 13, // The length of each line
			width: 7, // The line thickness
			radius: 16, // The radius of the inner circle
			corners: 0.9, // Corner roundness (0..1)
			rotate: 69, // The rotation offset
			direction: 1, // 1: clockwise, -1: counterclockwise
			color: '#87888a', // #rgb or #rrggbb or array of colors
			speed: 1.5, // Rounds per second
			trail: 64, // Afterglow percentage
			shadow: false, // Whether to render a shadow
			hwaccel: true, // Whether to use hardware acceleration
			className: 'spinner', // The CSS class to assign to the spinner
			zIndex: 2e9, // The z-index (defaults to 2000000000)
			top: 'auto', // Top position relative to parent in px
			left: 'auto' // Left position relative to parent in px
		};
		var spinner = new Spinner(opts).spin();
		$spinner = $(spinner.el).appendTo('#content');
		$spinner.object = spinner;
	})();

	view = new Fancy.View.ThingStream({
		url   : '/rest-api/v1/things/search_by_color'
	});
	view.on('beforeload', function(view){
		_.extend(view.data, args);
		$spinner.show();
	});
	view.on('afterload', function(view){
		$spinner.hide();
	});

	router = new Fancy.Router.ColorSearch();
	router.on('route:index', function(){
		$header.eq(0).show().end().eq(1).hide();
		$palette.show();
		view.$el.hide();
		$spinner.hide();
	});
	router.on('route:search', function(color, variance){
		variance = variance || 50;

		$header.eq(0).hide().end().eq(1).text(headerText.replace('%s', '#'+color)).show();
		$sample.iris('color', '#'+color);
		$slider.slider('value', variance);
		$variance.val(variance+'%');

		$palette.hide();

		args = {color:color, variance:variance};

		view.reset();
		view.setEnable(true);
		view.render();
		view.$el.show();
	});
	Backbone.history.start({hashChange: true, root: location.pathname});
});
