!function(p){
	'use strict';

	/**
	 * Inserts thousands/decimal separators to number and returns the formatted string.
	 * @param String ts indicates a thousands separator
	 * @param String ds incicates the decimal point
	 */
	p.format = function(ts, dp){
		var n = (this+'').split('.');

		if (!ts) ts = ',';
		if (!dp) dp = '.';

		n[0] = n[0].replace(new RegExp('\\d(?=(\\d{3})+$)', 'g'), '$&'+ts);
		n[1] = n[1] ? dp + n[1] : '';

		return n[0] + n[1];
	};
}(Number.prototype);
