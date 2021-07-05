(function(){

if (typeof define != 'function' || !define.amd) return;

if (window.jQuery) {
	define('jquery', [], function($){ return jQuery; });
	if (jQuery.ui) {
		define('jquery-ui', [], function($){});
	}
}

})();
