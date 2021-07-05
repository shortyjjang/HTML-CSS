/**
 * Get multiline string easy.
 *
 * This script is based on Sindre Sorhus's multiline function.
 * https://github.com/sindresorhus/multiline
 *
 * You can use this script in the same way.
 */
(function(global){
	'use strict';

	var regex = /\/\*!?(?:\@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)\s*\*\//;
	function multiline(fn) {
		if (typeof fn !== 'function') throw new TypeError('Expected a function');
		var match = regex.exec(fn.toString());
		if (!match) throw new TypeError('Multiline comment missing.');
		return match[1];
	};

	global.multiline = multiline;
})(this);
