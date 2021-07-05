/**
 * Cookie manipulation script.
 *
 * Cookie.get(name)
 * if it can't get any cookie with the name, returns null.
 *
 * Cookie.set(name, value, days)
 * if days is 0, the cookie will be removed when the browser is closed.
 * if days is negative, the cookie would be removed immediately.
 */
(function(factory){
	if (typeof define == 'function' && define.amd) {
		define([], factory);
	} else {
		factory();
	}
}(function(){
	'use strict';
	window.Cookie = {
		'get' : function(name){
			var regex = new RegExp('(^|[ ;])'+name+'\\s*=\\s*([^\\s;]+)');
			return regex.test(document.cookie)?unescape(RegExp.$2):null;
		},
		'set' : function(name, value, days){
			var expire = new Date(), cookie_str;
			expire.setDate(expire.getDate() + (days||0));
			cookie_str = name+'='+escape(value)+(days?';expires='+expire:'');
			cookie_str +='; path=/';
			document.cookie = cookie_str;
		}
	};

	return Cookie;
}));
