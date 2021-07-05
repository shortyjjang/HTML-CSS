!function(p){
	'use strict';

	p.escape = function(){
		var map={'&':'amp','<':'lt','>':'gt','"':'quot'};
		return this.replace(/&|<|>|\"/g, function(c){ return map[c]?'&'+map[c]+';':c });
	};
	p.escape_html = p.escape; // alias

	if (!('trim' in p)) {
		p.trim = function(){ return this.replace(/^\s+|\s+$/g,'') };
	}

	p.startsWith = function(s) {
		return this.indexOf(str) === 0;
	};

	p.isInt = function() {
		return (parseFloat(this) == parseInt(this)) && !isNaN(this);
	};
	p.is_int = p.isInt; // alias

	p.encode = function() {
		return encodeURIComponent(this);
	};

	p.decode = function() {
		return decodeURIComponent(this);
	};

	p.stripTags = function() {
		return this.replace(/<\?[a-z][a-z\d:]*.*?>/g, '');
	};
}(String.prototype);
