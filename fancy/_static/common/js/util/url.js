/**
 * parse a given URL
 */
function parseURL(url) {
	var fn = arguments.callee;
	if (!fn.anchor) fn.anchor = document.createElement('a');
	fn.anchor.setAttribute('href', url);

	return {
		protocol : fn.anchor.protocol,
		host     : fn.anchor.host,
		hostname : fn.anchor.hostname,
		port     : fn.anchor.port,
		pathname : fn.anchor.pathname.replace(/^\/?/, '/'),
		hash     : fn.anchor.hash,
		search   : fn.anchor.search
	};
};

// parse query string - equivalent to parse_string php function
function parseString() {
	var args = {};
	str = str.split(/&/g);
	for(var i=0;i<str.length;i++){
		if(/^([^=]+)(?:=(.*))?$/.test(str[i])) args[RegExp.$1] = decodeURIComponent(RegExp.$2);
	}
	return args;
}
