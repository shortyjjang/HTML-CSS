(function(){
	'use strict';

	var Model = namespace('Fancy.Model');
	Model.Thing = Backbone.Model.extend({
		urlRoot : '/rest-api/v1/things/',
		defaults : {
			id      : -1,
			title   : '',
			description : '',
			url     : '',
			price   : -1,
			wanted  : null,
			owned   : null,
			fancyd  : false,
			options : [],
			fancydCount : 0
		},
		cachedURL : {},
		getOriginalImageURL : function() {
			var sale = this.get('sales') && (this.get('sales')[0] || this.get('sales'));
			var url = sale && sale.images[0] && sale.images[0].src.replace(/^https?:/g, '');;
			url = url || this.get('original_image').src.replace(/^https?:/g, '');
			return url
		},
		getImageURL : function() {
			var sale = this.get('sales') && (this.get('sales')[0] || this.get('sales'));
			var url = sale && sale.images[0] && sale.images[0].thumbnail_src.replace(/^https?:/g, '');;
			url = url || this.get('image').src.replace(/^https?:/g, '');
			return url
		},
		getCropImageURL : function(width, height, url) {
			var size = width+(height?'x'+height:''), key;

			var sale = this.get('sales') && (this.get('sales')[0] || this.get('sales'));
			url = url || sale && sale.images[0] && sale.images[0].src;
			url = url || ( this.get('original_image') || this.get('image') ).src ;
			key = 'image_crop_'+size+'_'+url;

			if (!this.cachedURL[key]) {
				url = getResizeURL(url, size, 'crop');
				this.cachedURL[key] = getCDNURL(url);
			}

			return this.cachedURL[key];
		}
	});

	var HOSTS = {};
	makeServer('THINGD_MEDIA', 'thingd-media-ec%d.thefancy.com', 1, 6);
	makeServer('THEFANCY_MEDIA', 'thefancy-media-ec%d.thefancy.com', 1, 6);
	makeServer('RESIZE_IMAGE', 'resize-ec%d.thefancy.com', 1, 6);
	makeServer('STATICFILES', 'static-ec%d.thefancy.com', 1, 6);
	makeServer('FANCY_WEB', 'site-ec%d.thefancy.com', 1, 6);

	function makeServer(type, template, start, end) {
		if (!HOSTS[type]) HOSTS[type] = [];
		for (; start <= end; start++) {
			HOSTS[type].push(template.replace(/%d/, start));
		}
	}

	function getResizeURL(url, size, method) {
		var parts = parseURL(url), path = '/resize/';

		if (method) path += method+'/';
		path += size + '/';
		path += (/^(test_)?default/.test(parts.pathname)) ? 'thingd' : 'thefancy';
		path += parts.pathname;

		return parts.protocol + '//' + parts.hostname + path;
	}

	function getCDNURL(url){
		var parts = parseURL(url), hostname, path = parts.pathname, candidates;

		if (parts.hostname == 's3.amazonaws.com') {
			if (/\/media\.thefancy\.com/.test(parts.pathname)) {
				path = parts.pathname.replace(/^\/media\.thefancy\.com/, '');
				candidates = HOSTS.THEFANCY_MEDIA;
			} else if (/\/media\.thingd\.com/.test(parts.pathname)) {
				path = parts.pathname.replace(/^\/media\.thingd\.com/, '');
				candidates = HOSTS.THINGD_MEDIA;
			}
		} else if (/^\/(test_)?default/.test(path)) {
			candidates = HOSTS.THINGD_MEDIA;
		} else if (/^\/_ui/.test(path)) {
			candidates = HOSTS.FANCY_WEB;
		} else if (/^\/(resize|mark)/.test(path)) {
			candidates = HOSTS.RESIZE_IMAGE;
		} else if (/^\/_static_gen/.test(path)) {
			candidates = HOSTS.STATICFILES;
		} else {
			candidates = HOSTS.THEFANCY_MEDIA;
		}

		hostname = candidates[sumChars(path.replace(/[^a-zA-Z0-9_]+/g,'')) % candidates.length];

		return '//'+ hostname + path;
	};

	function sumChars(str) {
		var sum = 0, i, c;
		for (i=0,c=str.length; i < c; i++) {
			sum += str.charCodeAt(i);
		}
		return sum;
	};

	var Collection = namespace('Fancy.Collection');
	Collection.Things = Backbone.Collection.extend({
		model : Model.Thing,
		parse : function(json, options) {
			return json.things || (json.items || []);
		}
	});
})();
